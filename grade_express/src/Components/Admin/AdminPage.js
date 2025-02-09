import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import "./AdminPage.css";


const AdminPage = ({get}) => {
  const [staffs, setStaffs] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({ regno: '', name: '', email: '', dept: '', designation: '', password: '' });


  const fetchStaffs = async () => {
    const response = await axios.get('http://localhost:5000/getStaffs');
    console.log(response.data);
    setStaffs(response.data);
  };


  const fetchStudents = async () => {
    const response = await axios.get('http://localhost:5000/getStudents');
    setStudents(response.data);
  };


  const handleFileUpload = async (event) => {
    const formData = new FormData();
    formData.append('file', event.target.files[0]);
    await axios.post('http://localhost:5000/upload', formData);
    fetchStaffs();
  };


  const handleAddStaff = async () => {
    await axios.post('http://localhost:5000/addStaffs', newStaff);
    setNewStaff({ regno: '', name: '', email: '', depr: '', designation: '', password: '' });
    fetchStaffs();
    setShowModal(false);
  };


  const handleEditStaff = async () => {
    console.log(selectedStaff);
    await axios.put(`http://localhost:5000/editStaffs`, selectedStaff);
    fetchStaffs();
    setShowModal(false);
  };


  const handleDeleteStaff = async (regno) => {
    await axios.delete(`http://localhost:5000/deleteStaffs/${regno}`);
    fetchStaffs();
  };


  const handleDeleteStudent = async (regno) => {
    await axios.delete(`http://localhost:5000/deletStudents/${regno}`);
    fetchStudents();
  };


  const openModal = (staff) => {
    setSelectedStaff(staff || null);
    setShowModal(true);
  };


  const closeModal = () => setShowModal(false);


  React.useEffect(() => {
    fetchStaffs();
    fetchStudents();
  }, []);


  return (
    <div className='outer-container'>
        <div className="admin-page">
      <h1>Admin Page</h1>
      <div className="file-upload">
         <input type="file" id="file" accept=".xls,.xlsx" />
            <Button onClick={() => get()}>Submit</Button>
      </div>
      <Button onClick={() => openModal()}>Add Staff</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
          <th>Register Number</th>
          <th>Name</th>
          <th>Email</th>
          <th>Department</th>
          <th>Designation</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.regno}>
              <td>{staff.regno}</td>
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.dept}</td>
              <td>{staff.designation}</td>
              <td>
                <Button variant="warning" onClick={() => openModal(staff)}>
                  Edit
                </Button>{' '}
                <Button variant="danger" onClick={() => handleDeleteStaff(staff.regno)}>
                  Delete
                </Button>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>


      <h2>Students</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Register Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.regno}>
              <td>{student.regno}</td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>
                <Button variant="danger" onClick={() => handleDeleteStudent(student.regno)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>


      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedStaff ? 'Edit Staff' : 'Add Staff'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
          <Form.Group>
          <Form.Label>Register Number</Form.Label>
          <Form.Control
            type="text"
            value={selectedStaff ? selectedStaff.regno : newStaff.regno}
            readOnly={!!selectedStaff} // Read-only when editing staff (selectedStaff is not null)
            onChange={(e) =>
              selectedStaff
                ? setSelectedStaff({ ...selectedStaff, regno: e.target.value })
                : setNewStaff({ ...newStaff, regno: e.target.value })
              }
            />
            </Form.Group>
              <Form.Group>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStaff ? selectedStaff.name : newStaff.name}
                  onChange={(e) =>
                    selectedStaff
                      ? setSelectedStaff({ ...selectedStaff, name: e.target.value })
                      : setNewStaff({ ...newStaff, name: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedStaff ? selectedStaff.email : newStaff.email}
                  onChange={(e) =>
                    selectedStaff
                      ? setSelectedStaff({ ...selectedStaff, email: e.target.value })
                      : setNewStaff({ ...newStaff, email: e.target.value })
                  }
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Department</Form.Label>
                <Form.Control
                  as="select"
                  value={selectedStaff ? selectedStaff.dept : newStaff.dept}
                  onChange={(e) =>
                    selectedStaff
                      ? setSelectedStaff({ ...selectedStaff, dept: e.target.value })
                      : setNewStaff({ ...newStaff, dept: e.target.value })
                  }
                >
                  <option value="" hidden>Select Department</option>
                  <option value="CSE">CSE</option>
                  <option value="MECH">MECH</option>
                  <option value="CIVIL">CIVIL</option>
                  <option value="EEE">EEE</option>
                  <option value="ECE">ECE</option>
                  <option value="IT">IT</option>
                  <option value="AIDS">AIDS</option>
                <option value="S&H">S&H</option>
              </Form.Control>
            </Form.Group>
            <Form.Group>
            <Form.Label>Designation</Form.Label>
            <Form.Control
              as="select"
              value={selectedStaff ? selectedStaff.designation : newStaff.designation}
              onChange={(e) =>
                selectedStaff
                  ? setSelectedStaff({ ...selectedStaff, designation: e.target.value })
                  : setNewStaff({ ...newStaff, designation: e.target.value })
              }
            >
              <option value="" hidden>Select Designation</option>
              <option value="NPTEL STAFF INCHARGE">NPTEL Staff Incharge</option>
              <option value="STAFF (TUTOR)">Staff(Tutor)</option>
            </Form.Control>
          </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="text"
                value={selectedStaff ? selectedStaff.password : newStaff.password}
                onChange={(e) =>
                  selectedStaff
                    ? setSelectedStaff({ ...selectedStaff, password: e.target.value })
                    : setNewStaff({ ...newStaff, password: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={selectedStaff ? handleEditStaff : handleAddStaff}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    </div>
  );
};


export default AdminPage;
  