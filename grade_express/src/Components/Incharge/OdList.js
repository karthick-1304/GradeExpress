import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OdList.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";

const ODlist = ({user,logout})=>{
    console.log(user.dept);
   //const [department, setDepartment] = useState(user.dept); // Change this dynamically if needed
    const [students, setStudents] = useState([]);
    const [uniqueDates, setUniqueDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("All");
    const [selectedExamTime, setSelectedExamTime] = useState("All");
    const [selectedYearOfJoining, setSelectedYearOfJoining] = useState("All");
    const [uniqueYears, setUniqueYears] = useState([]);
    const [uniqueExamTimes, setUniqueExamTimes] = useState([]);

    useEffect(() => {
      fetchUniqueYears();
      fetchUniqueExamTimes();
      fetchStudents();
      fetchUniqueDates();
  }, [selectedDate, selectedExamTime, selectedYearOfJoining]);

  const fetchStudents = async () => {
    try {
      let url = `http://localhost:5000/course-registration/${user.dept}`;
  
      const queryParams = {};
  
      if (selectedDate && selectedDate !== "All") {
        queryParams.exam_date = selectedDate;
      }
  
      if (selectedExamTime && selectedExamTime !== "All") {
        queryParams.exam_time = selectedExamTime;
      }
  
      if (selectedYearOfJoining && selectedYearOfJoining !== "All") {
        queryParams.year_of_joining = selectedYearOfJoining;
      }
  
      // Build query string dynamically
      const queryString = new URLSearchParams(queryParams).toString();
  
      if (queryString) {
        url += `?${queryString}`;
      }
  
      console.log("Fetching URL:", url);
  
      const response = await axios.get(url);
      setStudents(response.data);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };     

    const fetchUniqueDates = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/exam-dates/${user.dept}`);
            setUniqueDates(response.data);
        } catch (error) {
            console.error("Error fetching exam dates:", error);
        }
    };

    const fetchUniqueYears = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/year-of-joining/${user.dept}`);
        setUniqueYears(response.data);
      } catch (error) {
        console.error("Error fetching years of joining:", error);
      }
    };
    
    const fetchUniqueExamTimes = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/exam-times/${user.dept}`);
        setUniqueExamTimes(response.data);
      } catch (error) {
        console.error("Error fetching exam times:", error);
      }
    };    

    const downloadExcel = async () => {
      let url = `http://localhost:5000/generate-excel/${user.dept}`;
    
      const queryParams = {};
    
      if (selectedDate && selectedDate !== "All") {
        queryParams.exam_date = selectedDate;
      }
    
      if (selectedExamTime && selectedExamTime !== "All") {
        queryParams.exam_time = selectedExamTime;
      }
    
      if (selectedYearOfJoining && selectedYearOfJoining !== "All") {
        queryParams.year_of_joining = selectedYearOfJoining;
      }
    
      const queryString = new URLSearchParams(queryParams).toString();
    
      if (queryString) {
        url += `?${queryString}`;
      }
    
      console.log("Downloading Excel from:", url);
      window.open(url, "_blank");
    };        

    return (
      <div className="outer-container-incharge">
        <RoleBasedHeader user={user} logout={logout}/> 
      <nav className="navbar navbar-expand-lg shadow py-3">
      <div className="container">
          <h1 style={{ color: "##F7DBA7", fontSize: "23px" }}>
            WELCOME {user?.name?.toUpperCase()} !
          </h1>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav gap-4">
              <Link to={`/${user.role}HomePage`}className="text-decoration-none">
                <li className="nav-item">Home</li>
              </Link>
              {user.designation === "Incharge" && (
                <>
                  <Link to="/addCourse" className="text-decoration-none">
                    <li className="nav-item">Add Course</li>
                  </Link>
                  <Link to="/timeline" className="text-decoration-none">
                    <li className="nav-item">Timelines</li>
                  </Link>
                  <Link to="/ODlist" className="text-decoration-none">
                    <li className="nav-item">OD List</li>
                  </Link>
                </>
              )}
              <Link to="/aboutUs" className="text-decoration-none">
                <li className="nav-item">Verify</li>
              </Link>
              <Link to="/"  onClick={()=>logout()} className="text-decoration-none">
                <li className="nav-item">Logout</li>
              </Link>
            </ul>
        </div>
        </div>
      </nav>
      <div className="containerOD">
    <h1 className="TTh1">Course Registration Details</h1>
    <div className="filter-section">
        <label>Select Exam Date:</label>
        <select value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)}>
          <option value="All">All</option>
          {uniqueDates.map((date, index) => (
              <option key={index} value={date}>{date}</option>
          ))}
      </select>
      <label>Select Exam Time:</label>
      <select value={selectedExamTime} onChange={(e) => setSelectedExamTime(e.target.value)}>
        <option value="All">All</option>
        {uniqueExamTimes.map((time, index) => (
          <option key={index} value={time}>{time}</option>
        ))}
      </select>

      <label>Select Year of Joining:</label>
      <select value={selectedYearOfJoining} onChange={(e) => setSelectedYearOfJoining(e.target.value)}>
        <option value="All">All</option>
        {uniqueYears.map((year, index) => (
          <option key={index} value={year}>{year}</option>
        ))}
      </select>
      {/* Message for empty data */}
      {students.length === 0 && (
        <p style={{ color: 'red', marginTop: '1rem' }}>
          No students found for the applied filters.
        </p>
      )}
      <p style={{ marginTop: '1rem', fontWeight: 'bold' }}>
        Total Records Found: {students.length}
      </p>
      <button
        onClick={downloadExcel}
        disabled={students.length === 0}  // Use students here instead of filteredStudents
        style={{
          backgroundColor: students.length === 0 ? '#ccc' : '#4CAF50',
          color: 'white',
          cursor: students.length === 0 ? 'not-allowed' : 'pointer',
          marginTop: '1rem'
        }}
      >
        Download Excel
      </button>
    </div>

          {/* SCROLLABLE TABLE CONTAINER */}
          <div className="table-containerOD">
              <table className="styled-table">
                  <thead>
                      <tr>
                          <th>Register Number</th>
                          <th>Course Code</th>
                          <th>Course Name</th>
                          <th>Exam Venue</th>
                          <th>Exam Date</th>
                          <th>Exam Session</th>
                      </tr>
                  </thead>
                  <tbody>
                      {students.map((student, index) => (
                          <tr key={index}>
                              <td>{student.student_regno}</td>
                              <td>{student.course_code}</td>
                              <td>{student.course_name}</td>
                              <td>{student.exam_venue}</td>
                              <td>{student.exam_date}</td>
                              <td>{student.exam_time}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
        </div>
    );
};

export default ODlist;
