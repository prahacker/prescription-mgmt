import sys
import fitz  # PyMuPDF
import pyttsx3
import os

def read_pdf_lines(pdf_path):
    if not os.path.exists(pdf_path):
        print("❌ File does not exist:", pdf_path)
        return []

    lines = []
    try:
        with fitz.open(pdf_path) as doc:
            for page in doc:
                text = page.get_text()
                lines.extend(text.splitlines())
    except Exception as e:
        print("Error reading PDF:", e)
    return lines

def speak_lines(lines):
    engine = pyttsx3.init()
    engine.setProperty('rate', 150)  # Speech rate

    for line in lines:
        print("🗣️ Speaking:", line)
        engine.say(line)
        engine.runAndWait()

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 read_and_speak_pdf.py <file.pdf>")
        sys.exit(1)

    pdf_file = sys.argv[1]
    lines = read_pdf_lines(pdf_file)

    if lines:
        speak_lines(lines)
    else:
        print("No text found in the PDF.")
