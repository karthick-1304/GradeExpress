import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import "./AdminPage.css";


const AdminPage = ({get}) => {
  const [staffs, setStaffs] = useState([]);
  const [students, setStudents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [newStaff, setNewStaff] = useState({ regno: '', name: '', email: '', dept: '', designation: '', password: '',phone_no:'' });


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
    setNewStaff({ regno: '', name: '', email: '', depr: '', designation: '', password: '' ,phone_no:''});
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
    <div className='outer-container-incharge'>
        <div className="admin-page">
      <h1 class="admin-h1">Admin Dashboard</h1>
      <div className="admin-file-upload">
         <input type="file" id="file" accept=".xls,.xlsx" />
          <Button className='admin-submit-btn'  onClick={() => get()}>Submit</Button>
      </div>
      <h2 class="admin-h2">FACULTIES</h2>
      <Button className="admin-btn" onClick={() => openModal()}>Add Staff</Button>
      <Table  className='admin-table'striped bordered hover>
        <thead>
          <tr>
          <th>Register Number</th>
          <th>Name</th>
          <th>Email</th>
          <th>Phone Number</th>
          <th>Department</th>
          <th>Designation</th>
          <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {staffs.map((staff) => (
            <tr key={staff.regno}>
              <td>{staff.regno}</td>
              <td>{staff.name}</td>
              <td>{staff.email}</td>
              <td>{staff.phone_no}</td>
              <td>{staff.dept}</td>
              <td>{staff.designation}</td>
              <td>
                <Button class="admin-btn" variant="warning" onClick={() => openModal(staff)}>
                  Edit
                </Button>{' '}
                <Button class="admin-btn" variant="danger" onClick={() => handleDeleteStaff(staff.regno)}>
                  Delete
                </Button>
                </td>
            </tr>
          ))}
        </tbody>
      </Table>


      <h2 class="admin-h2">STUDENTS</h2>
      <Table className='admin-table' striped bordered hover>
        <thead>
          <tr>
            <th>Register Number</th>
            <th>Name</th>
            <th>Department</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.regno}>
              <td>{student.regno}</td>
              <td>{student.name}</td>
              <td>{student.dept}</td>
              <td>{student.email}</td>
              <td>
                <Button class="admin-btn" variant="danger" onClick={() => handleDeleteStudent(student.regno)}>
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
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedStaff ? selectedStaff.phone_no : newStaff.phone_no}
                  onChange={(e) =>
                    selectedStaff
                      ? setSelectedStaff({ ...selectedStaff, phone_no: e.target.value })
                      : setNewStaff({ ...newStaff, phone_no: e.target.value })
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
              <option value="INCHARGE">NPTEL Incharge</option>
              <option value="TUTOR">Tutor</option>
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
          <Button class="admin-btn" variant="secondary" onClick={closeModal}>
            Close
          </Button>
          <Button class="admin-btn"
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
  