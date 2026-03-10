# HiddenPixel Image Steganography

## Overview
HiddenPixel is a tool for hiding messages within images using steganography techniques. Users can securely encode and decode messages within their favorite images seamlessly.

## Features
- **Encode Messages**: Hide messages within image files without altering their appearance.
- **Decode Messages**: Extract hidden messages from encoded images.
- **Support for Various Formats**: Compatible with multiple image formats including PNG, JPEG, and BMP.

## Setup Instructions
1. **Clone the Repository**: 
   ```
   git clone https://github.com/CS-Chinmay10/HiddenPixel-Image-Steganography.git
   cd HiddenPixel-Image-Steganography
   ```
2. **Install Dependencies**:
   - Ensure you have Python installed.
   - Run the following command to install the required packages:
   ```
   pip install -r requirements.txt
   ```
3. **Run the Application**:
   ```
   python main.py
   ```

## API Documentation
- **Encode API**
  - `POST /encode`
  - **Parameters**:
    - `image`: The image file to encode the message into.
    - `message`: The message to be encoded.
  - **Response**: Returns the URL of the encoded image.

- **Decode API**
  - `POST /decode`
  - **Parameters**:
    - `image`: The encoded image file from which to extract the message.
  - **Response**: Returns the hidden message extracted from the image.

## Security Information
- Ensure the images used are not altered after encoding.
- Regularly update libraries and dependencies to their latest versions to avoid vulnerabilities.

## Contributing Guidelines
1. **Fork the Repository**: Create your own fork of the project to contribute.
2. **Create a Feature Branch**: 
   ```
   git checkout -b feature/YourFeature
   ```
3. **Commit Your Changes**:
   ```
   git commit -m 'Add some feature'
   ```
4. **Push the Branch**:
   ```
   git push origin feature/YourFeature
   ```
5. **Open a Pull Request**.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

#### Last Updated: 2026-03-10 16:44:45 UTC