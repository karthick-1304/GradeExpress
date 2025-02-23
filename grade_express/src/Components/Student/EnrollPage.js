import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import "./EnrollPage.css";

const Enroll = ({ user }) => {
  console.log(user);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [newEnrollment, setNewEnrollment] = useState({
    register_number: user.regno,
    course_code: '',
    course_name: '',
    enroll_proof: '',
  });

  const [editingEnrollment, setEditingEnrollment] = useState(null);
  const [editData, setEditData] = useState({
    payment_proof: '',
    exam_venue: '',
    exam_date: '',
    certificate: '',
  });

  // Fetch available courses
  const fetchCourses = async () => {
    try {
      const response = await axios.get('http://localhost:5000/getCoursesToEnroll');
      setCourses(response.data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  // Fetch enrolled courses
  const fetchEnrollments = async () => {
    console.log(user.regno);
    try {
      const response = await axios.post('http://localhost:5000/fetchEnrollments', { register_number: user.regno });
      setEnrollments(response.data);
    } catch (error) {
      console.error('Error fetching enrollments:', error);
    }
  };

  useEffect(() => {
    fetchCourses();
    fetchEnrollments();
  }, []);

  // Handle selection of a course
  const handleCourseSelect = (e) => {
    const selected = courses.find(course => course.code === e.target.value);
    setSelectedCourse(e.target.value);
    setNewEnrollment({
      register_number: user.regno,
      course_code: selected?.code || '',
      course_name: selected?.name || '',
      enroll_proof: '',
    });
  };

  // Handle enrollment submission (Step 1)
  const handleConfirmEnrollment = async () => {
    try {
      await axios.post('http://localhost:5000/enrollments', newEnrollment);
      console.log(newEnrollment);
      fetchEnrollments();
      setShowEnrollModal(false);
      setSelectedCourse('');
      setNewEnrollment({
        register_number: user.regno,
        course_code: '',
        course_name: '',
        enroll_proof: '',
      });
    } catch (error) {
      console.error('Error enrolling:', error);
    }
  };

  // Open modal for adding additional details
  const handleAddDetails = (enrollment) => {
    setEditingEnrollment(enrollment);
    setEditData({
      payment_proof: enrollment.payment_proof || '',
      exam_venue: enrollment.exam_venue || '',
      exam_date: enrollment.exam_date || '',
      certificate: enrollment.certificate || '',
    });
    setShowDetailsModal(true);
  };

  // Handle change in additional details form
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  // Save additional details to the server
  const handleSaveDetails = async () => {
    try {
      await axios.put('http://localhost:5000/updateEnrollment', {
        ...editData,
        register_number: editingEnrollment.register_number,
        course_code: editingEnrollment.course_code,
      });
      fetchEnrollments();
      setShowDetailsModal(false);
    } catch (error) {
      console.error('Error updating details:', error);
    }
  };

  return (
    <div className="student-outer-container">
         <nav className="navbar navbar-expand-lg shadow py-3">
            <div className="container">
            <h1 style={{ color: "##F7DBA7", fontSize: "23px" }}>WELCOME {user.name}!</h1>
            <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                <ul className="navbar-nav gap-4">
                <Link to="/" className="text-decoration-none"><li className="nav-item">Home</li></Link>
                <Link to="/enroll" className="text-decoration-none"><li className="nav-item">Enroll</li></Link>
                <Link to="/contact" className="text-decoration-none"><li className="nav-item">Result</li></Link>
                <Link to="/" className="text-decoration-none"><li className="nav-item">Logout</li></Link>
                </ul>
            </div>
            </div>
        </nav>
      <h1 className="enrollPage-header">Course Enrollment</h1>
      
      {/* Button to open enrollment modal */}
      

      <div className="enrollPage-tableContainer">
        <Button variant="primary" onClick={() => setShowEnrollModal(true)}>
          Enroll in a Course
        </Button>
        <Table bordered  hover>
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
              <tr key={index}>
                <td>{enrollment.code}</td>
                <td>{enrollment.name}</td>
                <td>{enrollment.iscredit ?"Yes":"No"}</td>
                <td>{enrollment.enroll_proof}</td>
                <td>
                  <Button variant="info" onClick={() => handleAddDetails(enrollment)}>
                    Add Details
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Modal for Step 1: Selecting Course & Enroll Proof */}
      <Modal show={showEnrollModal}   className='enroll-modal' onHide={() => setShowEnrollModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Enroll in a Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select Course</Form.Label>
              <Form.Control as="select" value={selectedCourse} onChange={handleCourseSelect}>
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
              <Form.Control type="text" name="enroll_proof" value={newEnrollment.enroll_proof} onChange={(e) => setNewEnrollment({ ...newEnrollment, enroll_proof: e.target.value })} required />
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
      <Modal show={showDetailsModal} className='enroll-modal'  onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Additional Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Payment Proof</Form.Label>
              <Form.Control type="text" name="payment_proof" value={editData.payment_proof} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Exam Venue</Form.Label>
              <Form.Control type="text" name="exam_venue" value={editData.exam_venue} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Exam Date</Form.Label>
              <Form.Control type="date" name="exam_date" value={editData.exam_date} onChange={handleEditChange} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Certificate</Form.Label>
              <Form.Control type="text" name="certificate" value={editData.certificate} onChange={handleEditChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
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
