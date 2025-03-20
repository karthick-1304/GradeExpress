from flask import Flask, request, jsonify
from flask_cors import CORS
import fitz  # PyMuPDF
from PIL import Image
import io
import os
from werkzeug.utils import secure_filename
from flask import Flask
from flask_cors import CORS

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
        "ext_name": (420, 450, 2100, 550),
        "ext_course_name": (400, 630, 2150, 820),
        "consolidated_score": (1360, 800, 1610, 900),
        "online_assignment_score": (1082, 930, 1284, 1010),
        "proctored_score": (1720, 930, 1920, 1010),
        "time_of_course": (1050, 1280, 1484, 1480),
        "certificate_rollno": (205, 1680, 800, 1822),
        "profile_picture": (2164, 352, 2484, 732),
        "badge_type": (55, 412, 400, 782),
        "qr_of_certificate": (1284, 1680, 1422, 1822)
    }

    details = {}
    num = 1
    for field, rect in coords.items():
        if field in ["profile_picture", "badge_type", "qr_of_certificate"]:
            details[field] = extract_image_from_area(pdf_path, rect, num)
            num += 1
        else:
            details[field] = extract_text_from_area(pdf_path, rect)

    return details


# Route to handle PDF uploads and processing
# @app.route('/upload', methods=['POST'])
# def upload_file():
#     if 'certificate' not in request.files:
#         print("No file")
#         return jsonify({'error': 'No file uploaded'}), 400

#     file = request.files['certificate']
#     if file.filename == '':
#         print("NO file")
#         return jsonify({'error': 'No selected file'}), 400

#     filename = secure_filename(file.filename)
#     pdf_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
#     file.save(pdf_path)
#     print(f"File saved at: {pdf_path}")
#     details = extract_certificate_details(pdf_path)
#     return jsonify(details)

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
    app.run(debug=True, port=8000)
