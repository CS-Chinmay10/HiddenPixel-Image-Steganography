from flask import Flask, render_template, request, send_file
from PIL import Image
import numpy as np
from Crypto.Cipher import AES
import base64
import hashlib
import os
import logging

# Set up logging for easier debugging
logging.basicConfig(level=logging.DEBUG)

app = Flask(__name__)
app.secret_key = os.environ.get("SESSION_SECRET", "steganography-secret-key")
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def pad_key(key):
    return hashlib.sha256(key.encode()).digest()

def pad_message(message):
    padding_length = AES.block_size - (len(message) % AES.block_size)
    return message + chr(padding_length) * padding_length

def unpad_message(message):
    padding_length = ord(message[-1])
    return message[:-padding_length]

def encrypt_message(message, key):
    key = pad_key(key)
    iv = os.urandom(AES.block_size)
    cipher = AES.new(key, AES.MODE_CBC, iv)
    encrypted_message = cipher.encrypt(pad_message(message).encode())
    return base64.b64encode(iv + encrypted_message).decode()

def decrypt_message(encrypted_message, key):
    try:
        key = pad_key(key)
        encrypted_data = base64.b64decode(encrypted_message)
        iv = encrypted_data[:AES.block_size]  # Extract IV
        cipher = AES.new(key, AES.MODE_CBC, iv)
        decrypted = cipher.decrypt(encrypted_data[AES.block_size:]).decode()
        return unpad_message(decrypted)
    except Exception as e:
        logging.error(f"Decryption error: {str(e)}")
        return "Invalid decryption key or corrupted data!"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encode', methods=['POST'])
def encode():
    try:
        if 'image' not in request.files:
            return render_template('index.html', encode_error="No image file uploaded!")
        
        image = request.files['image']
        message = request.form['message']
        key = request.form['key']
        
        if not image or image.filename == '':
            return render_template('index.html', encode_error="No image selected!")
        
        if not message:
            return render_template('index.html', encode_error="Message cannot be empty!")
            
        if not key:
            return render_template('index.html', encode_error="Encryption key cannot be empty!")
        
        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'bmp'}
        if not image.filename or '.' not in image.filename:
            return render_template('index.html', encode_error="Invalid image format! Use PNG, JPG, JPEG or BMP.")
            
        file_ext = image.filename.rsplit('.', 1)[1].lower() if '.' in image.filename else ''
        if file_ext not in allowed_extensions:
            return render_template('index.html', encode_error="Invalid image format! Use PNG, JPG, JPEG or BMP.")
        
        encrypted_message = encrypt_message(message, key)
        img = Image.open(image.stream)
        img = img.convert('RGB')
        pixels = np.array(img)
        
        binary_message = ''.join(format(ord(c), '08b') for c in encrypted_message) + '1111111111111110'
        
        # Check if image is large enough to hide the message
        if pixels.shape[0] * pixels.shape[1] * 3 < len(binary_message):
            return render_template('index.html', encode_error="Image too small to hide the message! Use a larger image.")
        
        index = 0
        for i in range(pixels.shape[0]):
            for j in range(pixels.shape[1]):
                for k in range(3):
                    if index < len(binary_message):
                        # Ensure we don't get negative values by using proper bit manipulation
                        # Clear the least significant bit and then set it to the message bit
                        pixels[i, j, k] = (pixels[i, j, k] & 254) | int(binary_message[index])
                        index += 1
        
        stego_img = Image.fromarray(pixels)
        stego_path = os.path.join(UPLOAD_FOLDER, 'stego.png')
        stego_img.save(stego_path)
        
        # Return a response with a script to reset button state on client side
        response = send_file(stego_path, as_attachment=True, download_name='stego_image.png')
        # Add a custom header to indicate success
        response.headers['X-Encode-Success'] = 'true'
        return response
    except Exception as e:
        logging.error(f"Encoding error: {str(e)}")
        return render_template('index.html', encode_error=f"Error occurred: {str(e)}")

@app.route('/decode', methods=['POST'])
def decode():
    try:
        if 'stego_image' not in request.files:
            return render_template('index.html', decode_error="No stego image file uploaded!")
        
        stego_image = request.files['stego_image']
        key = request.form['key']
        
        if not stego_image or stego_image.filename == '':
            return render_template('index.html', decode_error="No stego image selected!")
            
        if not key:
            return render_template('index.html', decode_error="Decryption key cannot be empty!")
        
        # Check file extension
        allowed_extensions = {'png', 'jpg', 'jpeg', 'bmp'}
        if not stego_image.filename or '.' not in stego_image.filename:
            return render_template('index.html', decode_error="Invalid image format! Use PNG, JPG, JPEG or BMP.")
            
        file_ext = stego_image.filename.rsplit('.', 1)[1].lower() if '.' in stego_image.filename else ''
        if file_ext not in allowed_extensions:
            return render_template('index.html', decode_error="Invalid image format! Use PNG, JPG, JPEG or BMP.")
        
        img = Image.open(stego_image.stream)
        pixels = np.array(img)
        
        binary_message = ""
        for i in range(pixels.shape[0]):
            for j in range(pixels.shape[1]):
                for k in range(3):
                    binary_message += str(pixels[i, j, k] & 1)
                    # Check if we've reached the end marker
                    if len(binary_message) >= 16 and binary_message[-16:] == '1111111111111110':
                        break
                if '1111111111111110' in binary_message:
                    break
            if '1111111111111110' in binary_message:
                break
        
        if '1111111111111110' not in binary_message:
            return render_template('index.html', decode_error="No hidden message found in this image!")
        
        binary_message = binary_message.split('1111111111111110')[0]
        
        # Check if binary message length is valid
        if len(binary_message) % 8 != 0:
            return render_template('index.html', decode_error="Corrupted message data!")
        
        encrypted_message = ''.join(chr(int(binary_message[i:i+8], 2)) for i in range(0, len(binary_message), 8))
        message = decrypt_message(encrypted_message, key)
        
        return render_template('result.html', message=message)
    except Exception as e:
        logging.error(f"Decoding error: {str(e)}")
        return render_template('index.html', decode_error=f"Error occurred: {str(e)}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
