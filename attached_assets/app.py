from flask import Flask, render_template, request, send_file
from PIL import Image
import numpy as np
from Crypto.Cipher import AES
import base64
import hashlib
import os

app = Flask(__name__)
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
    except:
        return "Invalid decryption key!"

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/encode', methods=['POST'])
def encode():
    image = request.files['image']
    message = request.form['message']
    key = request.form['key']
    
    if not image or not message or not key:
        return "Missing input fields!"
    
    encrypted_message = encrypt_message(message, key)
    img = Image.open(image)
    img = img.convert('RGB')
    pixels = np.array(img)
    
    binary_message = ''.join(format(ord(c), '08b') for c in encrypted_message) + '1111111111111110'
    index = 0
    for i in range(pixels.shape[0]):
        for j in range(pixels.shape[1]):
            for k in range(3):
                if index < len(binary_message):
                    pixels[i, j, k] = pixels[i, j, k] & ~1 | int(binary_message[index])
                    index += 1
    
    stego_img = Image.fromarray(pixels)
    stego_path = os.path.join(UPLOAD_FOLDER, 'stego.png')
    stego_img.save(stego_path)
    
    return send_file(stego_path, as_attachment=True)

@app.route('/decode', methods=['POST'])
def decode():
    stego_image = request.files['stego_image']
    key = request.form['key']
    
    if not stego_image or not key:
        return "Missing input fields!"
    
    img = Image.open(stego_image)
    pixels = np.array(img)
    
    binary_message = ""
    for i in range(pixels.shape[0]):
        for j in range(pixels.shape[1]):
            for k in range(3):
                binary_message += str(pixels[i, j, k] & 1)
    
    binary_message = binary_message.split('1111111111111110')[0]
    encrypted_message = ''.join(chr(int(binary_message[i:i+8], 2)) for i in range(0, len(binary_message), 8))
    message = decrypt_message(encrypted_message, key)
    
    return render_template('result.html', message=message)

if __name__ == '__main__':
    app.run(debug=True)
