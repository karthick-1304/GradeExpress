import React from 'react'
import "./StudentHomePage.css";
import { Link } from 'react-router-dom';
import IMG from "./student_jump_img.jpg"
const StudentHomePage = ({user,setUser}) => {
    console.log("student homePage:",user);
    const student=user;//{name:"SELVA",regno:"2212074",Dept:"CSE",password:"Selva@2004",email:"2212074@nec.edu.in",role:"STUDENT"}
    const course=[{
        domain:"BLOCKCHAIN",name:"SOLIDITY",isCredit:true,code:"1234",week:12,st_date:"12/7/2024",end_date:"30/11/2025",instructor:"Mr.Mohaideen",score:89.09,grade:"A+",topper:"ABC",drive_link:"abcd.com" },{
            domain:"PERSONAL DEVELOPMENT",name:"PROFESSIONAL ENGLISH",isCredit:false,code:"2235",week:12,st_date:"12/7/2024",end_date:"30/11/2025",instructor:"Mr.Mohaideen",score:90.03,grade:"-",topper:"ABC",drive_link:"abcd.com" },{
                domain:"BLOCKCHAIN",name:"BLOCKCHAIN ARCHIETCTURE AND DESIGN",isCredit:true,code:"1236",week:12,st_date:"12/7/2024",end_date:"30/11/2025",instructor:"Mr.Mohaideen",score:89.09,grade:"A+",topper:"ABC",drive_link:"abcd.com" }]
  return (
    <div className='student-outer-container'>
        
        <nav className="navbar navbar-expand-lg shadow py-3">
            <div className="container">
            <h1 style={{ color: "orangered", fontSize: "23px" }}>WELCOME {student.name}!</h1>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav gap-4">
                <Link to="/" className="text-decoration-none"><li className="nav-item">Home</li></Link>
                <Link to="/aboutUs" className="text-decoration-none"><li className="nav-item">Enroll</li></Link>
                <Link to="/contact" className="text-decoration-none"><li className="nav-item">Result</li></Link>
                <Link to="/" className="text-decoration-none"><li className="nav-item">Logout</li></Link>
                </ul>
            </div>
            </div>
        </nav>
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
            </div>
            </div>
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

                <table className="course-table">
                    <thead>
                        <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Domain</th>
                        <th>No of Weeks</th>
                        <th>Score</th>
                        <th>Grade</th>
                        <th>Credit Type</th>
                        <th>Certificate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {course.map((item, index) => (
                        <tr key={index}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.domain}</td>
                            <td>{item.week}</td>
                            <td>{item.score}</td>
                            <td>{item.grade}</td>
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