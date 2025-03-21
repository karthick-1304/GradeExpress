import React, { useEffect, useState } from "react";
import { Link, useParams,useLocation } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";
const Verify = ({user,setUser,logout}) => {
  const navigate = useNavigate();
  const regno  = user.regno; // Get tutor regno from URL
  console.log("Tutor RegNo:", regno);
  const [verificationData, setVerificationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const location = useLocation();

  useEffect(() => {
      if (regno) {
          axios.get(`http://localhost:5000/studentsVerify/${regno}`).then((response) => {
                  setVerificationData(response.data);
                  console.log("Verification Data Fetched Successfully!", response.data);
              })
              .catch((error) => {
                  console.error("Error fetching verification data:", error);
                  setError("Failed to fetch verification records.");
              })
              .finally(() => setLoading(false));
      }
  }, [location]);


  const handleRowClick = (details) => {
    navigate("/handleIndVerify", { state: { details } });
  };

console.log(verificationData);
  if (loading) return <p>Loading verification records...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className='outer-container-incharge'>
          <RoleBasedHeader user={user} logout={logout}/> 
          <div className="container mt-5">
          <h2 className="mb-4 text-primary text-center text-uppercase fw-bold">
              Verification List
          </h2>

          {verificationData.length > 0 ? (
              <div className="table-responsive shadow-lg p-3 bg-white rounded"> {/* Adds shadow effect */}
                  <table className="table table-hover table-bordered table-striped align-middle">
                      <thead className="bg-gradient bg-primary text-white">
                      <tr className="text-center" style={{ backgroundColor: "#111111" }}>
                          <th scope="col">Reg No</th>
                          <th scope="col">Name</th>
                          <th scope="col">Course Code</th>
                          <th scope="col">Score</th>
                          <th scope="col">Certificate</th>
                      </tr>
                      </thead>
                      <tbody className="table-light">
                          {verificationData.map((cert, index) => {
                              const details = cert.extracted_details;
                              return (
                                <tr key={index} className="text-center" onClick={() => handleRowClick(details)}>
                                <td className="fw-semibold">{cert.student_regno}</td>
                                <td className="fw-semibold">{cert.name}</td>
                                <td>{cert.course_code}</td>
                                <td className="fw-bold text-success">{details.consolidated_score}</td>
                                <td>
                                  <a
                                    href={details.certificate_link}
                                    className="btn btn-outline-success btn-sm rounded-pill px-3 shadow-sm"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()} // Prevent row click from triggering when clicking the link
                                  >
                                    🎓 View Certificate
                                  </a>
                                </td>
                              </tr>                              
                              );
                          })}
                      </tbody>
                  </table>
              </div>
          ) : (
              <div className="alert alert-warning text-center fs-5 fw-bold shadow-sm">
                  ⚠ No verification records found for your students.
              </div>
          )}
      </div>
    </div>
  )
}

export default Verify