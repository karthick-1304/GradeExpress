import React from 'react'
import { Link } from 'react-router-dom'
const Verify = ({user,setUser,logout}) => {
    const certificateList=[
        {name:"KARAN",course_name:"IOT",link:""},
        {name:"PONKARTHIKEYAN",course_name:"CLOUD COMPUTING",link:""}
    ]
  return (
    <div className='outer-container-incharge'>
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
      <ul>
        <li></li>
      </ul>
    </div>
  )
}

export default Verify