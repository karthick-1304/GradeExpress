import React, { useState, useEffect, use, act } from "react";
import { Button, Table, Modal, Form } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./EnrollPage.css";
import { Toaster, toast } from "react-hot-toast";
const Enroll = ({ user }) => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [activeSection, setActiveSection] = useState("payment");
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [newEnrollment, setNewEnrollment] = useState({
    register_number: user.regno,
    course_code: "",
    course_name: "",
    enroll_proof: "",
  });

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [editData, setEditData] = useState({
    payment_proof: "",
    exam_venue: "",
    exam_date: "",
    exam_time: "",
    certificate: {},
    consolidated_score: 0,
    online_assignment_score: 0,
    proctored_score: 0,
    certificate_link: "",
  });

  // Fetch available courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/getCoursesToEnroll"
      );
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // Fetch enrolled courses
  const fetchEnrollments = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/fetchEnrollments",
        { register_number: user.regno }
      );
      setEnrollments(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  // Handle selection of a course
  const handleCourseSelect = (e) => {
    const selected = courses.find((course) => course.code === e.target.value);
    setSelectedCourse(e.target.value);
    setNewEnrollment({
      register_number: user.regno,
      course_code: selected?.code || "",
      course_name: selected?.name || "",
      enroll_proof: "",
    });
  };

  // Handle enrollment submission (Step 1)
  const handleConfirmEnrollment = async () => {
    try {
      await axios.post("http://localhost:5000/enrollments", newEnrollment);
      toast.success("Enrolled successfully!", {
        position: "top-center",
        duration: 5000,
      });
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Alreadt Enrolled!", {
        position: "top-center",
        duration: 5000,
      });
    }
    fetchEnrollments();
    setShowEnrollModal(false);
    setSelectedCourse("");
    setNewEnrollment({
      register_number: user.regno,
      course_code: "",
      course_name: "",
      enroll_proof: "",
    });
  };

  // Open modal for adding additional details
  const handleAddDetails = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEditData({
      payment_proof: "",
      exam_venue: "",
      exam_date: "",
      exam_time: "",
      certificate: {},
      consolidated_score: 0,
      online_assignment_score: 0,
      proctored_score: 0,
      certificate_link: "",
    });
    setShowDetailsModal(true);
  };

  // Handle change in additional details form
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save additional details to the server
  const handleSaveDetails = async () => {
    const formData = new FormData();
    formData.append("payment_proof", editData.payment_proof);
    formData.append("exam_venue", editData.exam_venue);
    formData.append("exam_date", editData.exam_date);
    formData.append("exam_time", editData.exam_time);
    formData.append("register_number", user?.regno);
    formData.append("course_code", editingEnrollment.code);
    formData.append("certificate", editData.certificate);
    formData.append("section", activeSection);
    try {
      if (activeSection == "certificate") {
        for (let pair of formData.entries()) {
          console.log(pair[0] + ":", pair[1]);
        }
        const response = await axios.post(
          `http://localhost:8000/upload`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        response.data["badge_type"]="Silver";
        response.data["topper"]="5%";
        response.data["certificate_link"]=editData.certificate_link;
        response.data["qr_of_certificate"]="https://www.skillrack.com/faces/index.xhtml";
        setResult(response.data);
        console.log("extracted:", response.data);
        await verifyData(response.data);
      } else {
        await axios
          .post("http://localhost:5000/updateEnrollment", formData, {
            headers: { "Content-Type": "multipart/fo rm-data" },
          })
          .then((response) => {
            toast.success(`${activeSection} details updated successfully!`, {
              position: "top-center",
              duration: 5000,
              toastClassName: "toast",
            });
          })
          .catch((e) => {
            console.error(`Error in ${activeSection} details updation!`, e);
            toast.error(`Error in ${activeSection} details updation!`, {
              position: "top-center",
              duration: 5000,
              toastClassName: "toast",
            });
          });
      }

      fetchEnrollments();
      setShowDetailsModal(false);
    } catch (error) {
      console.error("Error updating details:", error);
    }
  };
  async function deleteEnrollment(code) {
    console.log(code, user.regno);
    try {
      await axios.post("http://localhost:5000/deleteEnrollment", {
        regno: user.regno,
        code,
      });
      fetchEnrollments();
    } catch (error) {
      console.error("Error deleting details:", error);
    }
  }

  async function verifyData(extracted) {
    console.log("edit data:", editData.consolidated_score);
    console.log("result :see y ", result);
    if (
      editData.consolidated_score == extracted.consolidated_score &&
      editData.proctored_score == extracted.proctored_score &&
      editData.online_assignment_score == extracted.online_assignment_score
    ) {
      console.log(result);
      await axios
        .post("http://localhost:5000/addVerfication_details", {
          extracted,
          regno: user.regno,
          course_code: editingEnrollment.code,
        })
        .then((response) => {
          toast.success("Certificate uploaded successfully!", {
            position: "top-center",
            duration: 5000,
            toastClassName: "toast",
          });
        })
        .catch((e) => {
          console.error("Duplicate Entry:", e);
          toast.error("Duplicate Entry  ", {
            position: "top-center",
            duration: 5000,
            toastClassName: "toast",
          });
        });
    } else alert("Entered Data Mismatch");
  }
  const handleRowClick = (enrollment) => {
    navigate("/course-details", { state: { enrollment } });
  };

  const handleFileEditChange = (file) => {
    if (file) {
      setEditData((prevData) => ({
        ...prevData,
        certificate: file,
      }));
    } else console.log("No file Selected");
  };

  return (
    <div className="student-outer-container">
      <nav className="navbar navbar-expand-lg shadow py-3">
        <div className="container">
          <h1 style={{ color: "##F7DBA7", fontSize: "23px" }}>
            WELCOME {user.name}!
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
              <Link to="/enroll" className="text-decoration-none">
                <li className="nav-item">Enroll</li>
              </Link>
              <Link to="/contact" className="text-decoration-none">
                <li className="nav-item">Result</li>
              </Link>
              <Link to="/" className="text-decoration-none">
                <li className="nav-item">Logout</li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
      <h1 className="enrollPage-header">Course Enrollment</h1>

      <div className="enrollPage-tableContainer">
        <Button variant="primary" onClick={() => setShowEnrollModal(true)}>
          Enroll in a Course
        </Button>
        <Table bordered hover>
          <thead>
            <tr>
              <th>Course Code</th>
              <th>Course Name</th>
              <th>Credit Type</th>
              <th>Enroll Proof</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {enrollments.map((enrollment, index) => (
              <tr
                key={index}
                onClick={() => handleRowClick(enrollment)}
                style={{ cursor: "pointer" }}
              >
                <td>{enrollment.code}</td>
                <td>{enrollment.name}</td>
                <td>{enrollment.iscredit ? "Yes" : "No"}</td>
                <td>{enrollment.enroll_proof}</td>
                <td>
                  <Button
                    variant="info"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents row click event
                      handleAddDetails(enrollment);
                    }}
                  >
                    Add Details
                  </Button>

                  <Button
                    variant="danger"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevents row click event
                      deleteEnrollment(enrollment.code);
                    }}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Step 1: Selecting Course & Enroll Proof */}
      <Modal
        show={showEnrollModal}
        className="enroll-modal "
        onHide={() => setShowEnrollModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enroll in a Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Course</Form.Label>
              <Form.Control
                as="select"
                value={selectedCourse}
                onChange={handleCourseSelect}
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                  <option key={course.code} value={course.code}>
                    {course.name} ({course.code})
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group>
              <Form.Label>Enrollment Proof</Form.Label>
              <Form.Control
                type="text"
                name="enroll_proof"
                value={newEnrollment.enroll_proof}
                onChange={(e) =>
                  setNewEnrollment({
                    ...newEnrollment,
                    enroll_proof: e.target.value,
                  })
                }
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEnrollModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirmEnrollment}>
            Confirm Enrollment
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for Step 2: Adding Additional Details */}
      <Modal
        show={showDetailsModal}
        className="enroll-modal"
        onHide={() => setShowDetailsModal(false)}
      >
        <Modal.Header closeButton>
          <div className="form-header">
            <Button onClick={() => setActiveSection("payment")}>
              Payment Proof
            </Button>
            <Button onClick={() => setActiveSection("hallticket")}>
              Exam Details
            </Button>
            <Button onClick={() => setActiveSection("certificate")}>
              Certificate Proof
            </Button>
          </div>
        </Modal.Header>

        <Modal.Body>
          <Form>
            {/* Payment Proof Section */}
            {activeSection === "payment" && (
              <Form.Group>
                <Form.Label>Payment Proof</Form.Label>
                <Form.Control
                  type="text"
                  name="payment_proof"
                  value={editData.payment_proof}
                  onChange={handleEditChange}
                />
              </Form.Group>
            )}

            {/* Hallticket Proof Section */}
            {activeSection === "hallticket" && (
              <>
                <Form.Group>
                  <Form.Label>Exam Venue</Form.Label>
                  <Form.Control
                    type="text"
                    name="exam_venue"
                    value={editData.exam_venue}
                    onChange={handleEditChange}
                  />
                </Form.Group>

                <Form.Group>
                  {" "}
                  {/* Missing closing tag fixed */}
                  <Form.Label>Exam Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="exam_date"
                    value={editData.exam_date}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Exam Time</Form.Label>
                  <Form.Control
                    type="text"
                    name="exam_time"
                    value={editData.exam_time}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </>
            )}

            {/* Certificate Proof Section */}
            {activeSection === "certificate" && (
              <>
                <Form.Group>
                  <Form.Label>Certificate Link</Form.Label>
                  <Form.Control
                    type="text"
                    name="certificate_link"
                    value={editData.certificate_link}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Upload Certificate</Form.Label>
                  <Form.Control
                    type="file"
                    name="certificate"
                    onChange={(e) => handleFileEditChange(e.target.files[0])}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Label>Consolidated Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="consolidated_score"
                    value={editData.consolidated_score}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Proctored Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="proctored_score"
                    value={editData.proctored_score}
                    onChange={handleEditChange}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Online Assignment Score</Form.Label>
                  <Form.Control
                    type="text"
                    name="online_assignment_score"
                    value={editData.online_assignment_score}
                    onChange={handleEditChange}
                  />
                </Form.Group>
              </>
            )}
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDetailsModal(false)}
          >
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveDetails}>
            Save Details
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Enroll;
