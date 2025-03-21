import React from 'react'
import { Link } from 'react-router-dom'
const RoleBasedHeader = ({user,logout}) => {
    console.log("user:",user);
  return (
    <>  
        <nav className="navbar navbar-expand-lg shadow py-3">
        <div className="container">
          <h1 style={{ color: "##F7DBA7", fontSize: "23px" }}>
            WELCOME {user?.name}!
          </h1>
          <div
            className="collapse navbar-collapse justify-content-end"
            id="navbarNav"
          >
            <ul className="navbar-nav gap-4">
              <Link
                to={`/${user.role}HomePage`}
                className="text-decoration-none"
              >
                <li className="nav-item">Home</li>
              </Link>
              <Link to="/courses" state={{ user }} className="text-decoration-none">
                <li className="nav-item">Courses</li>
              </Link>
              { user?.role=="Student" && (
                <>
                  <Link to="/enroll" className="text-decoration-none">
                    <li className="nav-item">Enroll</li>
                </Link>
                </>
              )}
              
              { user?.designation?.includes("Incharge") && (
                <>
                  <Link to="/addCourse" className="text-decoration-none">
                    <li className="nav-item">Add Course</li>
                  </Link>
                  <Link to="/od-report" className="text-decoration-none">
                    <li className="nav-item">OD Report</li>
                  </Link>
                </>
              )}
              { user?.designation?.includes("Tutor")&& (
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
    </>
  )
}



export default RoleBasedHeader