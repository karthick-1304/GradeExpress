import React from "react";
import { Table, Button, Container, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";
const DisplayCourseInfo = ({user,logout}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { enrollment } = location.state || {};
  console.log("Enrollment:",enrollment);
  // enrollment.exam_date=enrollment.exam_date.split("T")[0];

  if (!enrollment) {
    return <p className="text-center text-danger mt-5">No course details available.</p>;
  }

  return (
    <div className="student-outer-container">
      <RoleBasedHeader user={user} logout={logout}/> 
    <Container className="p-5 d-flex justify-content-center">
      <Card className="shadow-lg p-4" style={{ width: "60%", borderRadius: "12px", background: "linear-gradient(135deg, #1e3c72, #2a5298)", color: "white" }}>
        <Card.Header className="text-center py-3" style={{ fontSize: "24px", fontWeight: "bold", background: "rgba(255,255,255,0.1)", borderRadius: "8px" }}>
          Course Details
        </Card.Header>

        <Table bordered hover responsive className="mt-3 text-white" style={{ borderRadius: "12px", overflow: "hidden" }}>
          <tbody>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Course Code</th>
              <td>{enrollment.code}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Course Name</th>
              <td>{enrollment.name}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Credit Type</th>
              <td>{enrollment.iscredit ? "Yes" : "No"}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Course Assignment DriveLink</th>
              <td>{enrollment.assignment_drive_link}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Enroll Proof</th>
              <td>{enrollment.enroll_proof}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Payment Proof</th>
              <td>{enrollment.payment_proof}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Exam Venue</th>
              <td>{enrollment.exam_venue}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Exam Date</th>
              <td>{enrollment.exam_date}</td>
            </tr>
            <tr>
              <th style={{ background: "#ffd700", color: "#222" }}>Exam Time</th>
              <td>{enrollment.exam_time}</td>
            </tr>
            {enrollment.grade !== null && (
                <tr>
                  <th style={{ background: "#ffd700", color: "#222" }}>Grade Accepted</th>
                  <td>
                  <Button
                    variant="success"
                    style={{
                      width: "80px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      marginRight: "10px",
                      borderRadius: "5px",
                    }}
                  >
                    Yes
                  </Button>

                  <Button
                    variant="danger"
                    style={{
                      width: "80px",
                      fontWeight: "bold",
                      fontSize: "16px",
                      borderRadius: "5px",
                    }}
                  >
                    No
                  </Button>
                </td>
                </tr>
              )}
          </tbody>
        </Table>

        <div className="text-center mt-3">
          <Button 
            onClick={() => navigate("/enroll")} 
            style={{
              background: "linear-gradient(135deg, #ff7eb3, #ff758c)",
              border: "none",
              padding: "10px 20px",
              fontSize: "18px",
              borderRadius: "8px",
              transition: "0.3s"
            }}
            onMouseOver={(e) => e.target.style.opacity = "0.8"}
            onMouseOut={(e) => e.target.style.opacity = "1"}
          >
            ⬅ Back
          </Button>
        </div>
      </Card>
    </Container>
    </div>
  );
};

export default DisplayCourseInfo;
