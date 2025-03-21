import React, { useEffect, useState } from "react";
import axios from "axios";
import "./OdList.css";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";
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
      <RoleBasedHeader user={user} logout={logout}/> 
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