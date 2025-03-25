import React, { useState, useEffect } from "react";
import { useLocation,Link } from "react-router-dom";
import axios from "axios";

import jsQR from "jsqr"; // Import jsQR for QR code scanning
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";

const HandleIndVerify = ({user,logout}) => {
  const location = useLocation();
  const verifiedData = location.state.details || {}; 
  const c_code=location.state.code
  const regnum=location.state.reg_num
  console.log("Verified Data:", verifiedData, c_code, regnum);

  const [uploadedFile, setUploadedFile] = useState(null);
  const [newExtractedData, setNewExtractedData] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [qrLink, setQrLink] = useState(""); // QR Code link from verified data

  useEffect(() => {
    if (verifiedData["qr_of_certificate"]) {
      setQrLink(verifiedData["qr_of_certificate"]);
    } else {
      alert("Error: QR Code link not found in the verified data.");
    }
  }, [verifiedData]);

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
      const response = await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setNewExtractedData(response.data);
      compareData(response.data);
    } catch (error) {
      alert("Upload failed");
    }
  };

  // Compare extracted data with verified data
  const compareData = async (newData) => {
    console.log("New Extracted Data:", newData);


    const isMatched = Object.keys(newData).every(
      (key) => key=='badge_type'||'qr_of_certificate'||newData[key] === verifiedData[key]
    );
    // const isdMatched = Object.keys(verifiedData).every(
    //   (key) => {console.log('hi',verifiedData[key])}
    // );
    console.log('vv',verifiedData,'nn',newData)

    setVerificationStatus(isMatched ? "Success ✅" : "Unsuccessful ❌");
    if(isMatched){
      updateScoreInDatabase(newData);
    }
  };

  // // Extract QR Code Link from Image
  // const extractQRCode = async () => {
  //   try {
  //     const imageUrl = "http://127.0.0.1:8000/static/extracted_image3.png"; // Path to the saved QR image
  //     const response = await fetch(imageUrl);
  //     const blob = await response.blob();
  //     const img = await createImageBitmap(blob);

  //     const canvas = document.createElement("canvas");
  //     const ctx = canvas.getContext("2d");
  //     canvas.width = img.width;
  //     canvas.height = img.height;
  //     ctx.drawImage(img, 0, 0, img.width, img.height);

  //     const imageData = ctx.getImageData(0, 0, img.width, img.height);
  //     const qrCode = jsQR(imageData.data, img.width, img.height);

  //     if (qrCode) {
  //       setQrLink(qrCode.data);
  //       setQrExtractSuccess(true); // Set success message
  //     } else {
  //       alert("No QR Code detected.");
  //       setQrExtractSuccess(false);
  //     }
  //   } catch (error) {
  //     console.error("Error extracting QR code:", error);
  //     alert("Failed to extract QR code.");
  //     setQrExtractSuccess(false);

  //   }
  // };
  
  // Function to update consolidated_score in the database
  const updateScoreInDatabase = async (newData) => {
    try {
      const response = await axios.post("http://localhost:5000/update-score", {
        regno: regnum,   // Assuming this is the regno
        course_code: c_code, // Assuming this is the course code
        score: newData.consolidated_score,
        link:verifiedData["certificate_link"]||null
      });
  
      if (response.data.success) {
        alert("Score updated successfully in the database! 🎉");
      } else {
        alert("Failed to update score. Please try again.");
      }
    } catch (error) {
      console.error("Error updating score:", error);
      alert("An error occurred while updating the score.");
    }
  };
  

  // Open QR Code Link
  const scanQRCode = () => {
    if (qrLink) {
      window.open(qrLink, "_blank");
    } else {
      alert("QR Code link not found.");
    }
  };


  // Helper function to format keys for display
  const formatKey = (key) => {
    return key
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };


  return (
    <div className="container py-5 mb-200">
       {/* Back Button */}
       <div className=" mb-4 m-0">
          <Link to="/verifyCertificate" className="btn btn-primary btn-lg">
                    🔙 Back
          </Link>
      </div>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-3 mb-5">
            <div className="card-header bg-primary text-white p-4">
              <h2 className="mb-0 text-center">Certificate Verification</h2>
            </div>
            
            <div className="card-body p-4">
              {/* Display extracted data */}
              <div className="mb-5">
                <h3 className="border-bottom border-2 pb-2 mb-4 text-primary">
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Extracted Certificate Details
                </h3>
                
                {verifiedData ? (
                  <div className="row g-1 h-50">
                    {[
                      "ext_name",
                      //"badge_type",
                      "time_of_course",
                      "ext_course_name",
                      "certificate_rollno",
                      "proctored_score",
                      "consolidated_score",
                      "online_assignment_score",
                    ].map((key) =>
                      verifiedData[key] ? (
                        <div key={key} className="col-md-6">
                          <div className="card h-100 border-0 bg-light">
                            <div className="card-body">
                              <h6 className="text-muted mb-2">{formatKey(key)}</h6>
                              <p className="fs-5 fw-bold mb-0">{verifiedData[key]}</p>
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                  </div>
                ) : (
                  <div className="alert alert-warning" role="alert">
                    No data received.
                  </div>
                )}
              </div>

              {/* Get Certificate Button */}
              <div className="d-grid gap-2 col-md-6 mx-auto mb-5">
                <button 
                  className="btn btn-primary btn-lg py-3" 
                  onClick={scanQRCode}
                >
                  <i className="bi bi-qr-code me-2"></i>
                  View Original Certificate
                </button>
              </div>

              {/* File re-upload for verification */}
              <div className="p-4 bg-light rounded-3 mb-4">
                <h3 className="mb-4 text-primary">
                  <i className="bi bi-arrow-repeat me-2"></i>
                  Re-Upload Downloaded Certificate
                </h3>
                
                <div className="row g-3 align-items-center">
                  <div className="col-md-8">
                    <div className="input-group input-group-lg">
                      <input 
                        type="file" 
                        className="form-control" 
                        accept="application/pdf" 
                        onChange={handleFileChange}
                        id="certificate-upload"
                      />
                      <label className="input-group-text" htmlFor="certificate-upload">
                        <i className="bi bi-file-earmark-pdf"></i>
                      </label>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <button 
                      className="btn btn-success btn-lg w-100" 
                      onClick={handleReUpload}
                    >
                      <i className="bi bi-shield-check me-2"></i>
                      Verify
                    </button>
                  </div>
                </div>
              </div>

              {/* Display verification status */}
              {verificationStatus && (
                <div className={`alert ${verificationStatus === "Success ✅" ? "alert-success" : "alert-danger"} p-4 fs-5 text-center`}>
                  <div className="d-flex flex-column align-items-center">
                    <div className={`rounded-circle p-3 mb-3 ${verificationStatus === "Success ✅" ? "bg-success" : "bg-danger"} bg-opacity-10`}>
                      <i className={`bi ${verificationStatus === "Success ✅" ? "bi-check-circle" : "bi-x-circle"} fs-1 ${verificationStatus === "Success ✅" ? "text-success" : "text-danger"}`}></i>
                    </div>
                    <h3 className="mb-0">Verification Status: {verificationStatus}</h3>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default HandleIndVerify;