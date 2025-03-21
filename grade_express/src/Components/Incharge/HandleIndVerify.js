import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import jsQR from "jsqr"; // Import jsQR for QR code scanning
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";

const HandleIndVerify = ({user,logout}) => {
  const location = useLocation();
  const  verifiedData = location.state.details || {}; // Full JSON data
  console.log("Verified Data:", verifiedData);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [newExtractedData, setNewExtractedData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [qrLink, setQrLink] = useState(null);
  const [qrExtractSuccess, setQrExtractSuccess] = useState(false); // New state for success message

  // Handle file selection
  const handleFileChange = (event) => {
    setUploadedFile(event.target.files[0]);
  };

  // Upload certificate and extract data
  const handleReUpload = async () => {
    if (!uploadedFile) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", uploadedFile);

    try {
      const response = await axios.post(
                `http://localhost:8000/upload`,
                formData,
                {
                  headers: { "Content-Type": "multipart/form-data" },
                }
              );

      setNewExtractedData(response.data);
      compareData(response.data);
    } catch (error) {
      alert("Upload failed");
    }
  };

  // Compare extracted data
  const compareData = (newData) => {
    console.log("New Extracted Data:", newData);
    const isMatched = Object.keys(newData).every(
      (key) => key=='badge_type'||'qr_of_certificate'||newData[key] === verifiedData[key]
    );
    // const isdMatched = Object.keys(verifiedData).every(
    //   (key) => {console.log('hi',verifiedData[key])}
    // );
    console.log('vv',verifiedData,'nn',newData)

    setVerificationStatus(isMatched ? "Success ✅" : "Unsuccessful ❌");
  };

  // Extract QR Code Link from Image
  const extractQRCode = async () => {
    try {
      const imageUrl = "http://127.0.0.1:8000/static/extracted_image3.png"; // Path to the saved QR image
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const img = await createImageBitmap(blob);

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);

      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const qrCode = jsQR(imageData.data, img.width, img.height);

      if (qrCode) {
        setQrLink(qrCode.data);
        setQrExtractSuccess(true); // Set success message
      } else {
        alert("No QR Code detected.");
        setQrExtractSuccess(false);
      }
    } catch (error) {
      console.error("Error extracting QR code:", error);
      alert("Failed to extract QR code.");
      setQrExtractSuccess(false);
    }
  };

  // Open QR Code Link
  const scanQRCode = () => {
    if (qrLink) {
      window.open(qrLink, "_blank");
    } else {
      alert("QR Code link not found. Try extracting it first.");
    }
  };

  return (
    <div className="container">
      <RoleBasedHeader user={user} logout={logout}/> 
      <h2>Certificate Verification</h2>

      {/* Display extracted data */}
      <div className="certificate-details">
        <h3 className="section-title">Extracted Certificate Details</h3>
        {verifiedData ? (
          <div className="details-container">
          {/* Certificate Info */}
          <div className="info-grid">
            {[
              "Name",
              "Course Name",
              "Online Assignment Score",
              "Proctored Score",
              "Consolidated Score",
              "Roll No of Certificate",
              "Time of Course"
            ].map((key) =>
              verifiedData[key] ? (
                <div key={key} className="info-row">
                  <span className="info-key">{key}:</span>
                  <span className="info-value">{verifiedData[key]}</span>
                </div>
              ) : null
            )}
          </div>
        </div>
        
        ) : (
          <p className="no-data">No data received.</p>
        )}
      </div>

      {/* Extract QR Code Button */}
      <button onClick={extractQRCode}>Extract QR Code</button>

      {/* Success message for QR extraction */}
      {qrExtractSuccess && (
        <p className="success-message">✅ QR Code extracted successfully!</p>
      )}

      {/* Start Verification Button */}
      <button onClick={scanQRCode}>Get certificate via QR link</button>

      {/* File re-upload for verification */}
      <div className="reupload-section">
        <h3>Re-Upload Downloaded Certificate</h3>
        <input type="file" accept="application/pdf" onChange={handleFileChange} />
        <button onClick={handleReUpload}>Verify</button>
      </div>

      {/* Display verification status */}
      {verificationStatus && (
        <div className={`status ${verificationStatus === "Success ✅" ? "success" : "error"}`}>
          <h3>Verification Status: {verificationStatus}</h3>
        </div>
      )}
    </div>
  );
};

export default HandleIndVerify;
