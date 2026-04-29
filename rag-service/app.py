from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF

app = Flask(__name__)
CORS(app)

@app.route("/extract-pdf", methods=["POST"])
def extract_pdf():
    try:
        if "file" not in request.files:
            return jsonify({"error": "No file uploaded"}), 400

        file = request.files["file"]

        pdf_bytes = file.read()

        doc = fitz.open(stream=pdf_bytes, filetype="pdf")

        extracted_text = ""

        for page in doc:
            extracted_text += page.get_text()

        if not extracted_text.strip():
            return jsonify(
                {"error": "No readable text found in PDF"}
            ), 400

        return jsonify({
            "text": extracted_text
        })

    except Exception as e:
        return jsonify({
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)