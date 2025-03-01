from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
from PIL import Image
import io
import os
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)  # Allow React frontend to communicate with Flask backend

UPLOAD_FOLDER = 'uploads'
STATIC_FOLDER = 'static'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['STATIC_FOLDER'] = STATIC_FOLDER

# Ensure directories exist
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(STATIC_FOLDER, exist_ok=True)

@app.route("/")
def home():
    return "Flask API is running!"

# Function to extract text from a PDF at a given rectangle area
def extract_text_from_area(pdf_path, rect):
    document = fitz.open(pdf_path)
    page = document.load_page(0)  # First page
    text = page.get_text("text", clip=fitz.Rect(*rect))
    return text.strip().replace("\n", ' ')

# Function to extract an image from the PDF at the specified coordinates
# Function to extract image from the PDF at the specified coordinates
def extract_image_from_area(pdf_path, rect, num):
    document = fitz.open(pdf_path)
    page = document.load_page(0)
    pix = page.get_pixmap(clip=fitz.Rect(*rect))
    img = Image.open(io.BytesIO(pix.tobytes()))
    
    # Save image in the static folder
    img_path = os.path.join(app.config['STATIC_FOLDER'], f"extracted_image{num}.png")
    img.save(img_path)
    
    # Return the URL of the image
    image_url = f"/static/{os.path.basename(img_path)}"
    return image_url


# Function to extract certificate details
# Function to extract certificate details
def extract_certificate_details(pdf_path):
    coords = {
        "Name": (420, 450, 2100, 550),
        "Course Name": (400, 630, 2150, 820),
        "Consolidated Score": (1360, 800, 1610, 900),
        "Online Assignment Score": (1082, 930, 1284, 1010),
        "Proctored Score": (1720, 930, 1920, 1010),
        "Time of Course": (1050, 1280, 1484, 1480),
        "Roll No of Certificate": (205, 1680, 800, 1822),
        "Profile Picture": (2164, 352, 2484, 732),
        "Badge Type": (55, 412, 400, 782),
        "QR of Certificate": (1284, 1680, 1422, 1822)
    }

    details = {}
    num = 1
    for field, rect in coords.items():
        if field in ["Profile Picture", "Badge Type", "QR of Certificate"]:
            details[field] = extract_image_from_area(pdf_path, rect, num)
            num += 1
        else:
            details[field] = extract_text_from_area(pdf_path, rect)

    return details


# Route to handle PDF uploads and processing
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    filename = secure_filename(file.filename)
    pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    file.save(pdf_path)

    details = extract_certificate_details(pdf_path)
    return jsonify(details)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
