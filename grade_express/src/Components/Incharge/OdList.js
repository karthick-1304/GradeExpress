import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OdList.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const OdList = ({user,logout})=>{
    console.log(user.dept);
   //const [department, setDepartment] = useState(user.dept); // Change this dynamically if needed
    const [students, setStudents] = useState([]);
    const [uniqueDates, setUniqueDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("All");

    useEffect(() => {
      fetchStudents();
      fetchUniqueDates();
  }, [selectedDate]);

  const fetchStudents = async () => {
    try {
        const url = selectedDate && selectedDate !== "All" 
            ? `http://localhost:5000/course-registration/${user.dept}?exam_date=${selectedDate}` 
            : `http://localhost:5000/course-registration/${user.dept}`; // Fetch all students when "All" is selected

        const response = await axios.get(url);
        console.log(response.data);
        setStudents(response.data);
    } catch (error) {
        console.error("Error fetching students:", error);
    }
};

    const fetchUniqueDates = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/exam-dates/${user.dept}`);
            console.log(response.data);
            setUniqueDates(response.data);
        } catch (error) {
            console.error("Error fetching exam dates:", error);
        }
    };

    const downloadExcel = async () => {
      const url = selectedDate && selectedDate !== "All"
          ? `http://localhost:5000/generate-excel/${user.dept}/${selectedDate}`
          : `http://localhost:5000/generate-excel/${user.dept}/${'All'}`; // Fetch all students when "All" is selected
  
      window.open(url, "_blank");
  };  

    return (
      <div className="outer-container-incharge">
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
                 {/*  <Link to="/timeline" className="text-decoration-none">
                    <li className="nav-item">Timelines</li>
                  </Link> */}
                  <Link to="/ODlist" className="text-decoration-none">
                    <li className="nav-item">OD List</li>
                  </Link>
                </>
              )}
              <Link to="" className="text-decoration-none">
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
        <button onClick={downloadExcel}>Download Excel</button>
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
                              <td>{student.name}</td>
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

export default OdList;