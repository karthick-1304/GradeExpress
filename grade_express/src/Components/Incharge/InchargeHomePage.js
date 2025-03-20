import {React,useEffect,useState} from "react";
import IMG from "./student_jump_img.jpg";
import axios from "axios";
import toast from "react-hot-toast";
import { Link ,useNavigate,useLocation} from "react-router-dom";

const InchargeHomePage = ({ user, setUser,logout }) => {

  const [showModal, setShowModal] = useState(false);
  const [updatedUser, setUpdatedUser] = useState(user);
  const [studentsList, setStudentsList] = useState([]);
  const [deleteRegNo, setDeleteRegNo] = useState(""); 
  const navigate=useNavigate();
  const location = useLocation();




  const fetchStudents = () => {
    if (Array.isArray(user.designation) && user.designation.includes("Tutor")) {
      console.log("Fetching students for tutorward:", user.tutorward);  
      axios
        .get("http://localhost:5000/studentsTutorward", {
          params: { tutorward: user.tutorward }
        })
        .then((response) => {
          setStudentsList(response.data);
          console.log("Students Fetched Successfully!", response.data);
        })
        .catch((error) => {
          console.error("Error fetching students:", error);
        });
    }
  };
  const listStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/${user.regno}/listofwardstudents`, {
        params: { tutorId: user.regno }
      });
  
      console.log('pk');
      console.log(response.data);
  
      // Extract tutor_ward from the first object in the array
      if (response.data.length > 0 && response.data[0].tutor_ward) {
        user.tutorward = response.data[0].tutor_ward;
        fetchStudents(); // Call fetchStudents after listStudents finishes
      } else {
        console.warn("No tutor_ward data found");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };
  
  useEffect(() => { // Call the function
    listStudents()
    console.log("received");
  }, [location]);
  

  const handleEditClick = () => {
    setUpdatedUser(user);
    setShowModal(true);
  };
  const handleStudentClick = (regno, name) => {
    navigate(`/student/${regno}/courses`, { state: { studentName: name } });
  };

  const handleChange = (e) => {
    setUpdatedUser({ ...updatedUser, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    setUser(updatedUser);
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
  const handleDeleteStudent = async () => {
    let f=1
    for (let i = 0; i < studentsList.length; i++) {
      if (studentsList[i].regno === deleteRegNo) {
        console.log(studentsList[i].regno);
        f=0;
      }
    }
    if (!deleteRegNo.trim() ||f==1) {
      toast.error("Enter a valid RegNo!", { position: "top-center" });
      return;
    }
    
  
    try {
      const response = await axios.post(
        `http://localhost:5000/remove-student/${user.regno}`,
        { studentRegNo: deleteRegNo }
      );
      
      toast.success(response.data.message, { position: "top-center" });
      setDeleteRegNo(""); // Clear input field
      listStudents(); 
  
    } catch (error) {
      console.error("Error removing student:", error);
      toast.error("Failed to remove student!", { position: "top-center" });
    }
  };

  return (
    <div className="outer-container-incharge">
      <nav className="navbar navbar-expand-lg shadow py-3">
        <div className="container">
          <h1 style={{ color: "##F7DBA7", fontSize: "23px" }}>
            Welcome {user?.name?.toUpperCase()} !!!
          </h1>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav gap-4">
              <Link to={`/${user.role}HomePage`}className="text-decoration-none">
                <li className="nav-item">Home</li>
              </Link>
              <Link to="/courses" state={{ user }} className="text-decoration-none">
                <li className="nav-item">Courses</li>
              </Link>
              {Array.isArray(user.designation) && user.designation.includes("Incharge") && (
                <>
                  <Link to="/addCourse" className="text-decoration-none">
                    <li className="nav-item">Add Course</li>
                  </Link>
                  <Link to="/od-report" className="text-decoration-none">
                    <li className="nav-item">OD Report</li>
                  </Link>
                </>
              )}
              {Array.isArray(user.designation) && user.designation.includes("Tutor")&& (
                <>
                <Link to="/verifyCertificate" className="text-decoration-none">
                <li className="nav-item">Verify</li>
              </Link>
                </>
              )}  
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
            <tbody>
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
            </tbody>
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
      {Array.isArray(user.designation) && user.designation.includes("Tutor") && (
        <div>
        <h1 className="student-head">Tutor Ward</h1>
          <button className="btn btn-primary d-flex justify-content-end" 
            onClick={() => navigate("/add-students")}
            style={{ marginLeft: "100px" }}
            >
            Add Students
        </button>
        <div style={{ display: "flex", alignItems: "center", marginTop: "10px" }}>
            <input
              type="text"
              className="form-control"
              placeholder="Enter Student RegNo"
              value={deleteRegNo}
              onChange={(e) => setDeleteRegNo(e.target.value)}
              style={{ width: "250px", marginRight: "10px" ,marginLeft:"240px",marginTop:"-55px"}}
            />
            <button className="btn btn-danger" onClick={handleDeleteStudent} style={{ marginTop:"-55px"}}>
              Remove Student
            </button>
          </div>
        <div>
          <table className="tutorward-table">
            <thead>
              <tr>
                <th>RegNo</th>
                <th>Name</th>
                <th>No of Credits earned</th>
              </tr>
            </thead>
              <tbody>
                {studentsList.map((item, index) => (
                    <tr
                        key={index}
                        onClick={() => handleStudentClick(item.regno, item.name)}
                        style={{ cursor: "pointer" }}
                    >
                        <td>{item.regno}</td>
                        <td>{item.name}</td>
                        <td>{item.credits_earned}</td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
        )} 
    </div>
  );
};

export default InchargeHomePage;
