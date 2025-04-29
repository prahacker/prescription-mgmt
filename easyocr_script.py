from flask import Flask, request, jsonify
from flask_cors import CORS
import easyocr
import os
from werkzeug.utils import secure_filename

# Setup
app = Flask(__name__)
CORS(app)  # Enable CORS for all origins

UPLOAD_FOLDER = './uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

reader = easyocr.Reader(['en'], gpu=False)

@app.route("/", methods=["GET"])
def health():
    return jsonify({"status": "OCR server ready"})

@app.route("/extract", methods=["POST"])
def extract_text():
    try:
        if 'file' not in request.files:
            return jsonify({"success": False, "error": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"success": False, "error": "Empty filename"}), 400

        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        print(f"[INFO] OCR processing {file_path}...")

        # Perform OCR
        result = reader.readtext(file_path, detail=0)
        os.remove(file_path)

        # Ensure result is JSON serializable
        result = [str(line) for line in result]

        return jsonify({"success": True, "text": result})
    
    except Exception as e:
        print(f"[ERROR] {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
