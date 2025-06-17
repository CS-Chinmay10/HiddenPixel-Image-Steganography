document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS library for scroll animations
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize encryption visualization
    initEncryptionAnimation();

    // Handle form submissions with loading state
    const encodeForm = document.getElementById('encodeForm');
    const decodeForm = document.getElementById('decodeForm');
    const encodeButton = document.getElementById('encodeButton');
    const decodeButton = document.getElementById('decodeButton');
    
    if (encodeForm) {
        encodeForm.addEventListener('submit', function() {
            // Show loading spinner
            toggleLoadingState(encodeButton, true);
            
            // Set a timeout to reset the button state after a reasonable time
            // This is a fallback in case the download event isn't triggered
            setTimeout(() => {
                toggleLoadingState(encodeButton, false);
            }, 10000); // 10 seconds should be enough for most downloads to start
        });
        
        // Add an event listener to reset the button when the download completes
        // We need to poll for download completion since there's no direct API
        if (encodeButton) {
            window.addEventListener('focus', function() {
                // When the window regains focus (after download dialog), reset the button
                toggleLoadingState(encodeButton, false);
            });
        }
    }
    
    if (decodeForm) {
        decodeForm.addEventListener('submit', function() {
            // Show loading spinner
            toggleLoadingState(decodeButton, true);
            
            // For decode, we don't reset automatically since it navigates to a new page
        });
    }

    // Toggle password visibility
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            // Toggle type attribute
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
            } else {
                passwordInput.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
            }
        });
    });

    // Image preview functionality
    setupImagePreview('image', 'encodePreview', 'encodeImageUpload');
    setupImagePreview('stego_image', 'decodePreview', 'decodeImageUpload');

    // Binary animation in hero section
    animateBinaryText();

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Setup scroll down indicator
    const scrollDownIndicator = document.getElementById('scrollDown');
    if (scrollDownIndicator) {
        scrollDownIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        // Hide scroll indicator when scrolled down
        window.addEventListener('scroll', function() {
            if (window.scrollY > 300) {
                scrollDownIndicator.style.opacity = '0';
            } else {
                scrollDownIndicator.style.opacity = '1';
            }
        });
    }
    
    // Simple navbar toggle for mobile
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarToggler && navbarCollapse) {
        // Close mobile navbar when clicking on a nav link
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            });
        });
    }
});

/**
 * Toggle loading state of buttons
 */
function toggleLoadingState(button, isLoading) {
    if (!button) return;
    
    const spinner = button.querySelector('.spinner-border');
    
    if (isLoading) {
        button.disabled = true;
        spinner.classList.remove('d-none');
    } else {
        button.disabled = false;
        spinner.classList.add('d-none');
    }
}

/**
 * Setup image preview functionality
 */
function setupImagePreview(inputId, previewId, uploadWrapperId) {
    const input = document.getElementById(inputId);
    const preview = document.getElementById(previewId);
    const uploadWrapper = document.getElementById(uploadWrapperId);
    
    if (!input || !preview || !uploadWrapper) return;
    
    input.addEventListener('change', function() {
        const uploadIcon = uploadWrapper.querySelector('.upload-icon');
        
        if (this.files && this.files[0]) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                preview.style.backgroundImage = `url('${e.target.result}')`;
                preview.style.display = 'block';
                uploadIcon.style.display = 'none';
            };
            
            reader.readAsDataURL(this.files[0]);
        } else {
            preview.style.display = 'none';
            uploadIcon.style.display = 'flex';
        }
    });
}

/**
 * Animate binary text in hero section
 */
function animateBinaryText() {
    // This is just a visual effect for the binary numbers in the SVG
    const binaryTexts = document.querySelectorAll('.binary-overlay text');
    if (!binaryTexts.length) return;
    
    // Generate random binary string
    function getRandomBinary(length) {
        return Array.from({length}, () => Math.round(Math.random())).join('');
    }
    
    // Update binary text periodically
    setInterval(() => {
        binaryTexts.forEach(text => {
            const binary = getRandomBinary(48);
            // Split into 8-bit chunks for readability
            const formattedBinary = binary.match(/.{1,8}/g).join(' ');
            text.textContent = formattedBinary;
        });
    }, 2000);
}

/**
 * Initialize encryption visualization animation in the hero section
 */
function initEncryptionAnimation() {
    const heroSection = document.getElementById('hero');
    if (!heroSection) return;
    
    // Create the encryption background container
    const encryptionBackground = document.createElement('div');
    encryptionBackground.className = 'encryption-background';
    heroSection.appendChild(encryptionBackground);
    
    // Sample plaintext messages related to security/encryption
    const messages = [
        'Secret message',
        'Hide data',
        'Steganography',
        'Image encryption',
        'Secure communication',
        'Hidden pixels',
        'Private data',
        'Invisible ink',
        'Encode information',
        'Conceal message'
    ];
    
    // Function to create encrypted version of text
    function encryptText(text) {
        const characters = '!@#$%^&*()_+-={}[]|:;"<>,.?/~`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let encrypted = '';
        for (let i = 0; i < text.length; i++) {
            // Replace space with special character
            if (text[i] === ' ') {
                encrypted += '█';
            } else {
                // Replace each character with random character of same length
                encrypted += characters.charAt(Math.floor(Math.random() * characters.length));
            }
        }
        return encrypted;
    }
    
    // Create and animate new encryption text pairs periodically
    function createEncryptionElement() {
        if (!document.contains(encryptionBackground)) return;
        
        // Get random message
        const message = messages[Math.floor(Math.random() * messages.length)];
        const encryptedMessage = encryptText(message);
        
        // Create original text element
        const textElement = document.createElement('div');
        textElement.className = 'encryption-text';
        textElement.textContent = message;
        textElement.style.left = Math.random() * 80 + 10 + '%'; // Random position 10-90%
        textElement.style.top = Math.random() * 60 + 20 + '%';  // Random position 20-80%
        textElement.style.fontSize = Math.floor(Math.random() * 10) + 22 + 'px'; // Random size 22-32px
        textElement.style.animation = 'encryptText 6s forwards';
        
        // Create encrypted text element (positioned at same spot)
        const encryptedElement = document.createElement('div');
        encryptedElement.className = 'encrypted-text';
        encryptedElement.textContent = encryptedMessage;
        encryptedElement.style.left = textElement.style.left;
        encryptedElement.style.top = textElement.style.top;
        encryptedElement.style.fontSize = textElement.style.fontSize;
        encryptedElement.style.animation = 'encryptedText 6s forwards';
        
        // Add elements to background
        encryptionBackground.appendChild(textElement);
        encryptionBackground.appendChild(encryptedElement);
        
        // Remove elements after animation completes
        setTimeout(() => {
            if (textElement.parentNode === encryptionBackground) {
                encryptionBackground.removeChild(textElement);
            }
            if (encryptedElement.parentNode === encryptionBackground) {
                encryptionBackground.removeChild(encryptedElement);
            }
        }, 6000);
    }
    
    // Initialize with a few encryption texts
    for (let i = 0; i < 3; i++) {
        setTimeout(() => createEncryptionElement(), i * 1500);
    }
    
    // Continue creating encryption animations periodically
    setInterval(createEncryptionElement, 3000);
}

// Add typing animation effect to decoded message if on result page
const decodedMessage = document.querySelector('.decoded-message');
if (decodedMessage) {
    const messageText = decodedMessage.textContent.trim();
    decodedMessage.textContent = '';
    
    let i = 0;
    const typingSpeed = 30; // milliseconds per character
    
    const typeWriter = () => {
        if (i < messageText.length) {
            decodedMessage.textContent += messageText.charAt(i);
            i++;
            setTimeout(typeWriter, typingSpeed);
        }
    };
    
    // Start typing animation
    setTimeout(typeWriter, 500);
}
