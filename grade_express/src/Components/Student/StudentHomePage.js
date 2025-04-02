import React, { use, useEffect } from 'react'
import "./StudentHomePage.css";
import { Link } from 'react-router-dom';
import IMG from "./student_jump_img.jpg";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState } from 'react';
import axios from 'axios';
import { Toaster, toast } from "react-hot-toast";
import RoleBasedHeader from "../Common_pages/RoleBasedHeader.js"

const StudentHomePage = ({user,setUser,logout}) => {
    console.log("student homePage:",user);
    const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [courses,setCourses]=useState([]);
    const student=user;//{name:"SELVA",regno:"2212074",Dept:"CSE",password:"Selva@2004",email:"2212074@nec.edu.in",role:"STUDENT"}
    /* const course=[{
        domain:"BLOCKCHAIN",name:"SOLIDITY",isCredit:true,code:"1234",week:12,st_date:"12/7/2024",end_date:"30/11/2025",instructor:"Mr.Mohaideen",score:89.09,grade:"A+",topper:"ABC",drive_link:"abcd.com" },{
            domain:"PERSONAL DEVELOPMENT",name:"PROFESSIONAL ENGLISH",isCredit:false,code:"2235",week:12,st_date:"12/7/2024",end_date:"30/11/2025",instructor:"Mr.Mohaideen",score:90.03,grade:"-",topper:"ABC",drive_link:"abcd.com" },{
                domain:"BLOCKCHAIN",name:"BLOCKCHAIN ARCHIETCTURE AND DESIGN",isCredit:true,code:"1236",week:12,st_date:"12/7/2024",end_date:"30/11/2025",instructor:"Mr.Mohaideen",score:89.09,grade:"A+",topper:"ABC",drive_link:"abcd.com" }]
    */ const handleEditClick = () => {
        setUpdatedUser(user); 
        setShowModal(true);
    };
                
    const handleChange = (e) => {
        setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setUser(updatedUser);
        setShowModal(false);
        axios.put("http://localhost:5000/editProfileStudent", updatedUser)
  .then((response) => {
    toast.success("Profile updated successfully!", {
      position: "top-center",
      duration: 5000,
      toastClassName: "toast",
    });
  })
  .catch((e) => {
    console.error("Error in profile editing:", e);
    toast.error("Failed to update profile!", {
      position: "top-center",
      duration: 5000,
      toastClassName: "toast",
    });
  });

  };    

  const fetchCompletedCourses = async () => {
    console.log(user?.regno)
    try {
      const response = await axios.post(
        `http://localhost:5000/fetchCompletedCourses/${user?.regno}`,
      );
      setCourses(response.data);
      console.log(response.data);
      
    } catch (error) {
      console.error("Error fetching Completed Courses:", error);
    }
  };
  
  useEffect(()=>{
      fetchCompletedCourses();
  },[user])
  

  return (
    <div className='student-outer-container'>
        <RoleBasedHeader user={user} logout={logout}/> 
        <h1 className='student-head'>Profile</h1>
        <div className='main1'>
            <div className='profile-total'>
                <div className='profile-left'>
                    <img src={IMG} alt=""/>
                    <h1>{student.role}</h1>
                </div>
            
                <table className='profile-table' >
                    <tr>
                        <th>Name</th>
                        <td>{student.name}</td>
                    </tr>
                    <tr>
                        <th>Regno</th>
                        <td>{student.regno}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{student.email}</td>
                    </tr>
                    <tr>
                        <th>Department</th>
                        <td>{student.dept}</td>
                    </tr>
                </table>
                <div>
                    <button className='student-profile-btn' onClick={handleEditClick}>    <i className="bi bi-pencil-square">  </i> 
                    Edit</button>
                </div>
            </div>
            </div>

            {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Profile</h2>
            <form onSubmit={handleSubmit}>
              <label>Password:</label>
              <input
                type="text"
                name="password"
                value={updatedUser.password}
                onChange={handleChange}
                required
              />

              <label>Phone Number:</label>
              <input
                type="text"
                name="phone_no"
                value={updatedUser.phone_no}
                onChange={handleChange}
                required
              />

             {/*  <label>Department:</label>
              <input
                type="text"
                name="dept"
                value={updatedUser.dept}
                onChange={handleChange}
                required
              />
 */}
              <div className="modal-buttons">
                <button type="submit" className="save-btn">
                  Save
                </button>
                <button
                  type="button"
                  className="close-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
        <div className='course'>
                <h1 className='student-head'>Course Details</h1>
                <div className="search-container">
                    <select className="search-dropdown">
                        <option value="courseName">Course Name</option>
                        <option value="courseCode">Course Code</option>
                        <option value="domain">Domain</option>
                        <option value="creditType">Credit Type</option>
                        <option value="score">Score</option>
                        <option value="grade">Grade</option>
                    </select>
                    <div className="search-input-container">
                        <input type="text" className="search-input" placeholder="Search by..." />
                    </div>
                </div>

                <table className="completed-course-table">
                    <thead>
                        <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Credit Type</th>
                        <th>Certificate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((item, index) => (
                        <tr key={index}>
                            <td>{item.course_code}</td>
                            <td>{item.name}</td>
                            <td>{item.isCredit ? "Yes" : "No"}</td>
                            <td><a href={item.drive_link} target="_blank" rel="noopener noreferrer">Drive Link</a></td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
        </div>
    </div>
  )
}

export default StudentHomePage