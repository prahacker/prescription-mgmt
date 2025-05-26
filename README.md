# Prescription Management System

A streamlined solution for digitizing and managing medical prescriptions using OCR and speech synthesis technologies.

## Overview

The Prescription Management System is designed to extract text from prescription images and convert it into audible speech. This tool aims to assist healthcare professionals and patients by simplifying the process of reading and understanding medical prescriptions.

## Features

* **OCR Integration**: Utilizes [EasyOCR](https://github.com/JaidedAI/EasyOCR) to extract text from prescription images.
* **Speech Synthesis**: Converts extracted text into speech using Python's `pyttsx3` library.
* **Server-Side Rendering**: Implements a server using Node.js to handle requests and serve the application.

## Technologies Used

* **Python**: For OCR processing and speech synthesis.
* **Node.js**: To set up the server and manage application routes.
* **EasyOCR**: An OCR library for extracting text from images.
* **pyttsx3**: A text-to-speech conversion library in Python.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/prahacker/prescription-mgmt.git
   cd prescription-mgmt
   ```



2. **Set up the Python environment**:

   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install easyocr pyttsx3
   ```



3. **Set up the Node.js environment**:

   ```bash
   npm install
   ```



## Usage

1. **Run the OCR and Speech Script**:

   ```bash
   python speak.py
   ```



This script will prompt you to input the path to the prescription image, extract text using OCR, and read it aloud.

2. **Start the Server**:

   ```bash
   node server_speak.cjs
   ```



This will start the server on the default port (e.g., 3000). You can access the application via `http://localhost:3000`.

## File Structure

* `easyocr_script.py`: Handles OCR processing of prescription images.
* `speak.py`: Integrates OCR and text-to-speech functionalities.
* `server_speak.cjs`: Sets up the Node.js server to serve the application.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

*Note: This README is based on the available information from the repository. For more detailed instructions and features, please refer to the actual code and documentation within the repository.*

---
