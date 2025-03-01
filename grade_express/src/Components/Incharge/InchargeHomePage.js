import React, { useEffect } from "react";
import IMG from "./student_jump_img.jpg";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const InchargeHomePage = ({ user, setUser,logout }) => {
  // console.log("Staff Home Page:",user);
  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const studentsList = [
    {
      regno: "2212074",
      name: "SELVARAJ R",
      credits: 15,
      completed: 3,
      ongoing: 2,
    },
    {
      regno: "2212075",
      name: "HEMALATHA",
      credits: 20,
      completed: 4,
      ongoing: 2,
    },
    {
      regno: "2212076",
      name: "PONKARTHIKEYAN P",
      credits: 20,
      completed: 5,
      ongoing: 2,
    },
    {
      regno: "2212077",
      name: "SANKARANARAYANAN",
      credits: 15,
      completed: 3,
      ongoing: 3,
    },
  ];
  const handleEditClick = () => {
    setUpdatedUser(user);
    setShowModal(true);
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(updatedUser);
    console.log(updatedUser);
    setShowModal(false);
    axios
      .put("http://localhost:5000/editProfileStaff", updatedUser)
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
                  <Link to="/" className="text-decoration-none">
                    <li className="nav-item">Assignment Upload</li>
                  </Link>
                </>
              )}
              <Link to="/verifyCertificate" className="text-decoration-none">
                <li className="nav-item">Verify</li>
              </Link>
              <Link to="/"  onClick={()=>logout()} className="text-decoration-none">
                <li className="nav-item">Logout</li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      <h1 className="student-head">Profile</h1>
      <div className="main1">
        <div className="profile-total">
          <div className="profile-left">
            <img src={IMG} alt="" />
            <h1>{user.role}</h1>
          </div>

          <table className="profile-table">
            <tr>
              <th>Name</th>
              <td>{user.name}</td>
            </tr>
            <tr>
              <th>Regno</th>
              <td>{user.regno}</td>
            </tr>
            <tr>
              <th>Designation</th>
              <td>{user.designation}</td>
            </tr>
            <tr>
              <th>Email</th>
              <td>{user.email}</td>
            </tr>
            <tr>
              <th>Department</th>
              <td>{user.dept}</td>
            </tr>
          </table>
          <div>
            <button className="student-profile-btn" onClick={handleEditClick}>
              {" "}
              <i className="bi bi-pencil-square"> </i>
              Edit
            </button>
          </div>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Edit Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="password"
                value={updatedUser.password}
                onChange={handleChange}
                required
              />
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
      <div>
        <h1 className="student-head">Tutor Ward</h1>
        <div>
          <table className="tutorward-table">
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
  );
};

export default InchargeHomePage;
