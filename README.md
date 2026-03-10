# 🎨 HiddenPixel - Image Steganography

<div align="center">

![HiddenPixel](https://img.shields.io/badge/Steganography-Image%20Encryption-blueviolet?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.8+-blue?style=for-the-badge&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.1.0-green?style=for-the-badge&logo=flask)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-success?style=for-the-badge)

**Hide your secrets in plain sight with advanced image steganography and AES encryption** 👁️‍🗨️

[Live Demo](#-quick-start) • [Features](#-features) • [Setup](#-setup) • [API Docs](#-api-documentation) • [How It Works](#-how-it-works)

</div>

---

## 📚 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Project Structure](#-project-structure)
- [Setup & Installation](#-setup--installation)
- [Usage Guide](#-usage-guide)
- [API Documentation](#-api-documentation)
- [How It Works](#-how-it-works)
- [Security Features](#-security-features)
- [Interactive Demo](#-interactive-demo)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**HiddenPixel** is a sophisticated web application that enables you to hide confidential messages within digital images using LSB (Least Significant Bit) steganography combined with AES-256 encryption. The application provides a user-friendly interface to encode secret messages into images and decode them using the correct encryption key.

**Perfect for:**
- 🔒 Secure message transmission
- 🤫 Covert communication
- 📚 Educational purposes
- 🔐 Data privacy protection

---

## ✨ Features

### Core Features

<table>
<tr>
<td>

**🔐 Advanced Encryption**
- AES-256-CBC encryption
- SHA-256 key hashing
- Secure random IV generation
- Base64 encoding

</td>
<td>

**🎯 Image Steganography**
- LSB (Least Significant Bit) embedding
- Multi-format support (PNG, JPG, JPEG, BMP)
- Lossless encoding/decoding
- Automatic message boundary detection

</td>
</tr>
<tr>
<td>

**⚡ User-Friendly Interface**
- Responsive web design
- Real-time image preview
- Password visibility toggle
- Smooth animations & transitions

</td>
<td>

**✅ Input Validation**
- File format checking
- Image size validation
- Key strength verification
- Error handling & recovery

</td>
</tr>
<tr>
<td>

**🌓 Dark/Light Mode**
- Toggle theme support
- Persistent theme storage
- Comfortable viewing experience

</td>
<td>

**📊 Animations**
- AOS (Animate On Scroll)
- Binary text animations
- Loading spinners
- Smooth scrolling

</td>
</tr>
</table>

---

## 💻 Technology Stack

| Layer | Technologies |
|-------|---------------|
| **Backend** | Python 3.8+, Flask 3.1.0 |
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Encryption** | PyCryptodome 3.22.0, Hashlib |
| **Image Processing** | Pillow 11.0.0, NumPy 1.23.5 |
| **Styling** | Bootstrap 5.3, Font Awesome 6.0 |
| **Animations** | AOS (Animate On Scroll) |
| **Deployment** | Gunicorn 23.0.0 |

---

## 📁 Project Structure
