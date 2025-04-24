# Perfectly Secret Messaging Toolkit

## Overview

The Perfectly Secret Messaging Toolkit is a web-based application designed for encrypting and decrypting messages using the One-Time Pad (OTP) cipher. When used correctly, OTP provides mathematically proven perfect secrecy. This toolkit includes features for key generation using image data, key management, and secure message exchange, primarily intended for use on **air-gapped devices**.

**Key Concept:** One-Time Pad (OTP) offers unbreakable encryption *if and only if* the key is truly random, at least as long as the message, kept perfectly secret, and **never, ever reused**.

---

## ⚠️ CRITICAL SECURITY WARNING ⚠️

**USE ON AIR-GAPPED DEVICES ONLY:**

* This toolkit **MUST** be used exclusively on a device that is **permanently disconnected** from all networks (Internet, Wi-Fi, Cellular, Bluetooth, NFC, etc.). This is known as an "air-gapped" device. Keep the device in **Airplane Mode** with Wi-Fi and Bluetooth manually disabled at all times after installation.
* Connecting the device to any network after generating or importing keys will compromise the security of the system.

**NEVER REUSE KEYS:**

* The fundamental principle of OTP security is that the key material is used **only once**.
* This toolkit attempts to manage this by providing updated key files after encryption/decryption (removing the used portion). **You MUST save the updated key file and securely overwrite the previous version immediately after each operation.** Failure to do so renders the encryption completely insecure for *all* messages involved.

**DISCLAIMER:** You are solely responsible for maintaining the air gap of your device and managing your keys securely. Incorrect usage (key reuse, network connection) will completely break the security guarantees of the One-Time Pad. Use this tool with a full understanding of the risks and requirements.

---

## Features

* One-Time Pad Encryption/Decryption
* Image-Based Key Generation (TRNG)
* Key Shortening
* Key Transfer/Import via QR codes
* QR Code Ciphertext Output/Input
* Automatic Key Update Prompts
* Progressive Web App (PWA) for offline use

---

## Setup

1.  **Acquire Dedicated Air-Gapped Device:** Obtain a device (e.g., an inexpensive Android phone) that will **never** be connected to any network after the initial setup.
2.  **Initial (Temporary) Setup:** Connect the device to a network **once** solely to download or transfer this toolkit's files onto it.
3.  **Install Toolkit:** Place all toolkit files (HTML, CSS, JS directory structure) on the device.
4.  **GO OFFLINE PERMANENTLY:** Immediately enable **Airplane Mode** and manually **disable Wi-Fi and Bluetooth** in the device settings. **NEVER CONNECT TO ANY NETWORK AGAIN.**
5.  **Access:** Open the `index.html` file in the device's web browser. Consider saving it as a PWA to the home screen for easier offline access (the browser might prompt you, or look for an "Add to Home Screen" option).
6.  **SD Card (Recommended):** Store generated key files (`.txt`) on a removable SD card for physical transfer between trusted, air-gapped devices and for secure storage/destruction.

---

## How to Use

*(Open `index.html` on your air-gapped device to access the main menu)*

**1. Generate a One-Time Pad Key**

* Navigate to: `Generate Key`
* Click `1. Select photos`. Choose **two different**, complex photos stored on the device. RAW images converted to PNG or BMP are best; avoid lossy formats like JPEG if possible.
* The tool displays image details. Click `2. Process`. This extracts random data from the images.
* Once processing and randomness tests complete, click `3. Export`.
* Enter a filename (e.g., `my_otp_key`) and click `Save One Time Pad`.
* Save the resulting `.txt` file securely, ideally to your removable SD card. This file is your One-Time Pad.

**2. Share Key Securely (Choose one method):**

* **Method A: Physical SD Card Transfer (Recommended)**
    * Safely eject the SD card containing the key file.
    * Physically give the SD card to your trusted recipient.
    * The recipient inserts the SD card into their own trusted, air-gapped device.
* **Method B: QR Code Transfer (For smaller keys or portions)**
    * **Sender:**
        * Navigate to: `Transfer Copy of Key using QR Codes`
        * Select the key file (`.txt`) you wish to transfer.
        * The tool will display the key content as a series of numbered QR codes (100 characters per code).
    * **Recipient:**
        * Navigate to: `Import Key using QR Codes`
        * Click `Start Scan`.
        * Using the device camera, scan **all** QR codes presented by the sender, **in the correct sequence**. The scanned data will accumulate in the text area.
        * Once all codes are scanned, click `Save QR Data as a Key (.txt)`.
        * Enter a filename for the received key (e.g., `shared_pad.txt`) and click `Save`. Save it securely (ideally to SD card).

**3. Encrypt a Message (Sender)**

* Navigate to: `Encrypt Message (send a message)`
* In the `Message to Encrypt` box, type or paste your message. **Important:** Only Base64 characters (A-Z, a-z, 0-9, +, /, =) are currently supported directly. You may need to encode your message to Base64 first using a separate, secure offline tool if it contains other characters.
* Click `Select One-Time Pad Key File (.txt)` and choose the correct key file shared with the recipient.
* Click `Encrypt, Generate QR & Prepare Updated Key`.
* The encrypted message (ciphertext) will be displayed as one or more QR codes.
* **CRITICAL STEP:** A download prompt will appear for the **updated key file**. The filename will likely be prefixed with `updated_`. **You MUST save this file, overwriting your original key file.** This removes the used portion of the key.
* Use a *different* (networked) device to take clear photos of the ciphertext QR code(s). Send these images to your recipient via any method (email, chat, etc.). The ciphertext is safe to transmit insecurely.

**4. Decrypt a Message (Recipient)**

* Navigate to: `Decrypt Message (receive a message)`
* Click `Start Scan`.
* Using the device camera, scan the ciphertext QR code(s) received from the sender, **in the correct sequence**. The scanned Base64 ciphertext will appear in the text area.
* Click `Select One-Time Pad Key File (.txt)` and choose the corresponding key file (the one you originally received from or shared with the sender, *before* they encrypted this message).
* Click `Decrypt Message`.
* The original plaintext message should appear in the `Decrypted Message` area.
* **CRITICAL STEP:** A download prompt will appear for the **updated key file**. The filename will likely be prefixed with `updated_`. **You MUST save this file, overwriting your original key file.** This removes the used portion of the key.

**5. Shorten Key (Optional)**

* Use this if you need a key of a specific length (e.g., shorter than your generated one, perhaps to match a short message or for easier QR transfer).
* Navigate to: `Shorten Key`
* Upload your existing key file (`.txt`).
* Enter the desired final character count. The tool will either truncate (cut off the end) or pad with spaces (less secure, generally not recommended for OTP) to match the length.
* Click `3. Process and Save File`.
* Save the modified file. **Be careful**, as this permanently alters the key unless you kept a backup. It's generally better to generate a key of appropriate length initially.

---

## Technology Stack

* HTML5
* CSS3
* JavaScript (ES5)
* jQuery & jQuery UI
* CryptoJS (Core, EncBase64, x64Core)
* jsQR (QR Code Scanning)
* QRCode.js (QR Code Generation)
* FileSaver.js
* Progressive Web App (PWA) features via Service Worker and Manifest

## License

This software is distributed under the terms of the **GNU General Public License v3.0**. See the license text included or visit [http://www.gnu.org/licenses/](http://www.gnu.org/licenses/). Code derived from other libraries retains its original licensing where applicable (e.g., MIT for jQuery, CryptoJS).

## Donation

If you find this toolkit valuable, please consider supporting the creator via Bitcoin. See the "Donate BTC to Designer" option in the application.
