import React, { useState, useEffect } from "react";
import axios from "axios";
import { saveAs } from "file-saver";
import "bootstrap/dist/css/bootstrap.min.css";

const CourseDataExport = () => {
  const [courseOptions, setCourseOptions] = useState({ courses: [], names: [] });
  const [seasonOptions, setSeasonOptions] = useState([]);
  const [departmentOptions] = useState([
    "All",
    "CSE",
    "IT",
    "ECE",
    "AIDS",
    "EEE",
    "MECH",
    "CIVIL"
  ]);
  
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [selectedSeason, setSelectedSeason] = useState("All");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [courseDetailsMap, setCourseDetailsMap] = useState({});

  // Fetch course codes and seasons on component mount
  useEffect(() => {
    fetchCourseOptions();
    fetchSeasonOptions();
    fetchAllCourses(); // To get course names for the dropdown
  }, []);

  // Fetch all records when filters change
  useEffect(() => {
    if (selectedCourse) {
      fetchRecords();
    }
  }, [selectedCourse, selectedDepartment, selectedSeason]);

  const fetchCourseOptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/completed_dist_courses");
      setCourseOptions(response.data ?? { courses: [], names: [] }); // Ensuring default structure
    } catch (error) {
      console.error("Error fetching course options:", error);
      setCourseOptions({ courses: [], names: [] }); // Handle error case with default values
    }
  };
  

  const fetchSeasonOptions = async () => {
    try {
      const response = await axios.get("http://localhost:5000/seasons");
      setSeasonOptions(["All", ...response.data.seasons]);
    } catch (error) {
      console.error("Error fetching season options:", error);
    }
  };

  const fetchAllCourses = async () => {
    try {
      const response = await axios.get("http://localhost:5000/getAllCourses");
      const courseMap = response.data;
      setCourseDetailsMap(courseMap);
    } catch (error) {
      console.error("Error fetching course details:", error);
    }
  };

  const fetchRecords = async () => {
    if (!selectedCourse) return;
    
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/records", {
        params: {
          course_code: selectedCourse,
          dept: selectedDepartment,
          season: selectedSeason
        }
      });
      setRecords(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching records:", error);
      setLoading(false);
    }
  };

  const handleCourseChange = (e) => {
    setSelectedCourse(e.target.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.target.value);
  };

  const handleSeasonChange = (e) => {
    setSelectedSeason(e.target.value);
  };

  const handleDownloadExcel = async () => {
    if (!selectedCourse) {
      alert("Please select a course code first!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/download-excel", {
        params: {
          course_code: selectedCourse,
          dept: selectedDepartment,
          season: selectedSeason
        },
        responseType: 'blob'
      });
      
      const fileName = `${selectedCourse}_${selectedDepartment}_${selectedSeason}.xlsx`;
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      saveAs(blob, fileName);
      setLoading(false);
    } catch (error) {
      console.error("Error downloading Excel:", error);
      setLoading(false);
      alert("Error downloading Excel file. Please try again.");
    }
  };

  // Get course name from code
  const getCourseName = (code) => {
    return courseDetailsMap[code];
  };

  return (
    <div className="container-fluid py-5 bg-light min-vh-100">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-lg">
            <div className="card-header bg-primary text-white py-4">
              <h2 className="mb-0 text-center">Course Completion Data</h2>
            </div>
            
            <div className="card-body p-4">
              <div className="row mb-4 g-3">
                {/* Filter Section */}
                <div className="col-md-4">
                  <label htmlFor="courseSelect" className="form-label fw-bold">Course Code *</label>
                  <select 
                    id="courseSelect" 
                    className="form-select form-select-lg"
                    value={selectedCourse}
                    onChange={handleCourseChange}
                    required
                  >
                    <option value="">Select Course Code</option>
                    {courseOptions?.courses?.length > 0 &&
                      courseOptions.courses.map((code, index) => (
                        <option key={code} value={code}>
                          {code+'-'+courseOptions.names?.[index] || "Unnamed Course"} {/* Fallback for undefined names */}
                        </option>
                      ))
                    }


                  </select>
                </div>
                
                <div className="col-md-4">
                  <label htmlFor="deptSelect" className="form-label fw-bold">Department</label>
                  <select 
                    id="deptSelect" 
                    className="form-select form-select-lg"
                    value={selectedDepartment}
                    onChange={handleDepartmentChange}
                  >
                    {departmentOptions.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-md-4">
                  <label htmlFor="seasonSelect" className="form-label fw-bold">Season</label>
                  <select 
                    id="seasonSelect" 
                    className="form-select form-select-lg"
                    value={selectedSeason}
                    onChange={handleSeasonChange}
                  >
                    {seasonOptions.map((season) => (
                      <option key={season} value={season}>{season}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              {/* Download Button */}
              <div className="d-flex justify-content-end mb-4">
                <button 
                  className="btn btn-success btn-lg px-4 py-2"
                  onClick={handleDownloadExcel}
                  disabled={!selectedCourse || loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-file-earmark-excel me-2"></i>
                      Download Excel
                    </>
                  )}
                </button>
              </div>
              
              {/* Records Table */}
              <div className="table-responsive mt-2">
                <table className="table table-striped table-hover table-bordered">
                  <thead className="table-dark">
                    <tr>
                      <th>Student Reg No</th>
                      <th>Course Code</th>
                      <th>Certificate</th>
                      <th>Score</th>
                      <th>Grade</th>
                      <th>Season</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : records.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          {selectedCourse ? "No records found for the selected filters." : "Please select a course to view records."}
                        </td>
                      </tr>
                    ) : (
                      records.map((record, index) => (
                        <tr key={index}>
                          <td>{record.student_regno}</td>
                          <td>{record.course_code}</td>
                          <td>
                            <a href={record.certificate} target="_blank" rel="noopener noreferrer" className="link-primary">
                              View Certificate
                            </a>
                          </td>
                          <td>{record.score}</td>
                          <td>
                            <span className={`badge ${getGradeBadgeClass(record.grade)}`}>
                              {record.grade}
                            </span>
                          </td>
                          <td>{record.season}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {/* Display selected filters summary */}
              {selectedCourse && (
                <div className="alert alert-info mt-4">
                  <strong>Current Filter:</strong> Course: {selectedCourse} 
                  {selectedDepartment !== "All" && ` | Department: ${selectedDepartment}`} 
                  {selectedSeason !== "All" && ` | Season: ${selectedSeason}`}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper function to determine badge color based on grade
const getGradeBadgeClass = (grade) => {
  switch (grade) {
    case 'O':
      return 'bg-success';
    case 'A+':
      return 'bg-primary';
    case 'A':
      return 'bg-info';
    case 'B+':
      return 'bg-warning text-dark';
    case 'B':
      return 'bg-warning text-dark';
    case 'C':
      return 'bg-secondary';
    case 'F':
      return 'bg-danger';
    default:
      return 'bg-secondary';
  }
};

export default CourseDataExport;