import React from 'react';
import IMG from "./student_jump_img.jpg"
import { Link } from 'react-router-dom';

const InchargeHomePage = ({user,setUser}) => {
    const student=user;
    console.log(user);
    const studentsList=[
        {regno:"2212074",name:"SELVARAJ R",credits:15,completed:3,ongoing:2},{regno:"2212075",name:"HEMALATHA",credits:20,completed:4,ongoing:2},{regno:"2212076",name:"PONKARTHIKEYAN P",credits:20,completed:5,ongoing:2},{regno:"2212077",name:"SANKARANARAYANAN",credits:15,completed:3,ongoing:3}]
  return (
    <div className='outer-container'>
        <nav className="navbar navbar-expand-lg shadow py-3">
            <div className="container">
            <h1 style={{ color: "orangered", fontSize: "23px" }}>WELCOME {student.name.toUpperCase()} !</h1>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav gap-4">
                <Link to="/" className="text-decoration-none"><li className="nav-item">Home</li></Link>
                {user.designation === "Incharge" && (
                    <>
                      <Link to="/addCourse" className="text-decoration-none"><li className="nav-item">Add Course</li></Link>
                    <Link to="/" className="text-decoration-none"><li className="nav-item">Assignment Upload</li></Link>
                    </>
                )}
                <Link to="/aboutUs" className="text-decoration-none"><li className="nav-item">Verify</li></Link>
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
                        <th>Designation</th>
                        <td>{student.designation}</td>
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
            <div>
                <h1 className='student-head'>Tutor Ward</h1>
                <div>
                <table className="course-table">
                    <thead>
                        <tr>
                            <th>RegNo</th>
                            <th>Name</th>
                            <th>No of Credits earned</th>
                            <th>Completed</th>
                            <th>On Going</th>
                        </tr>
                    </thead>
                    <tbody>
                        {studentsList.map((item, index) => (
                        <tr key={index}>
                            <td>{item.regno}</td>
                            <td>{item.name}</td>
                            <td>{item.credits}</td>
                            <td>{item.completed}</td>
                            <td>{item.ongoing}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
            </div>
    </div>
    
  )
}

export default InchargeHomePage