import React, { useState, useEffect } from 'react';
import "./AddCourse.css";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const AddCourse = ({user,logout}) => {
    const [courses, setCourses] = useState([]);
    const [displayCourses, setDisplayCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchName,setSearchName]=useState();
    const [formData, setFormData] = useState({
        domain: "",
        name: "",
        iscredit: false,
        code: "",
        no_of_weeks: "",
        st_date: new Date().toISOString().split('T')[0], // Default to current date
        end_date: "",
        instructor: "",
        success_rate: "",
        assignment_drive_link: "",
    });
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getCourses');
            setCourses(response.data);
            setDisplayCourses(response.data);
            console.log(response.data);
        } catch (error) {
            console.error("Error fetching courses:", error);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.put(`http://localhost:5000/editCourse/${selectedCourse.code}`, formData);
            } else {
                await axios.post('http://localhost:5000/addCourse', formData);
            }
            fetchCourses();
            handleCloseModal();
        } catch (error) {
            console.error("Error submitting course:", error);
        }
    };
    
    const handleAddCourse = () => {
        setEditMode(false);
        setFormData({
            domain: "",
            name: "",
            iscredit: false,
            code: "",
            no_of_weeks: "",
            st_date: new Date().toISOString().split('T')[0], 
            end_date: "",
            instructor: "",
            success_rate: "",
            assignment_drive_link: "",
        });
        setShowModal(true);
    };

    const handleEditCourse = (course) => {
        setEditMode(true);
        setSelectedCourse(course);
        setFormData({
            ...course,
            st_date: course.st_date.split('T')[0],  
            end_date: course.end_date.split('T')[0],
        });
        setShowModal(true);
    };

    const handleDeleteCourse = async (code) => {
        try {
            await axios.delete(`http://localhost:5000/deleteCourse/${code}`);
            fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCourse(null);
    };
     
    function search(e) {
        const value = e.target.value;
        setSearchName(value);
    
        // Use updated state inside useEffect if needed
        console.log("Search Query:", value);
    
        if (value) {
            setDisplayCourses(courses.filter(course => course.name.toLowerCase().includes(value.toLowerCase())));
            console.log("Filtered Courses:", courses);
        }
        else    
            setDisplayCourses(courses);
    }

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
                  <Link to="/od-report" className="text-decoration-none">
                    <li className="nav-item">OD Report</li>
                  </Link>
                </>
              )}
              <Link to="" className="text-decoration-none">
                <li className="nav-item">Verify</li>
              </Link>
              <Link to="/"  onClick={()=>logout()} className="text-decoration-none">
                <li className="nav-item">Logout</li>
              </Link>
            </ul>
          </div>
        </div>
      </nav>
            <div className="admin-page">
                <h1 className='course-h2'>Course Management</h1>
                <div className='course-search-container'>
                <Button onClick={handleAddCourse}>Add Course</Button>
                <input type="text"  placeholder="Search by Course Name: " className='course-search' onChange={search} />
                </div>
                <Table  className='course-table'striped bordered hover>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Name</th>
                            <th>Domain</th>
                            <th>Credit Type</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayCourses.map((course) => (
                            <tr key={course.code}>
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.domain}</td>
                                <td>{course.iscredit?"Yes":"No"}</td>
                                <td>
                                    <Button variant="warning" onClick={() => handleEditCourse(course)}>Edit</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDeleteCourse(course.code)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <Modal className='addcourse-model-form' show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>{editMode ? "Edit Course" : "Add Course"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group>
                            <Form.Label>Course Code</Form.Label>
                            <Form.Control type="text" name="code" value={formData.code} onChange={handleChange} required disabled={editMode} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Course Name</Form.Label>
                            <Form.Control type="text" name="name" value={formData.name} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Domain</Form.Label>
                            <Form.Control type="text" name="domain" value={formData.domain} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Instructor</Form.Label>
                            <Form.Control type="text" name="instructor" value={formData.instructor} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>No. of Weeks</Form.Label>
                            <Form.Control type="number" name="no_of_weeks" value={formData.no_of_weeks} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control type="date" name="st_date" value={formData.st_date} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Date</Form.Label>
                            <Form.Control type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Success Rate (%)</Form.Label>
                            <Form.Control type="number" name="success_rate" value={formData.success_rate} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Assignment Drive Link</Form.Label>
                            <Form.Control type="text" name="assignment_drive_link" value={formData.assignment_drive_link} onChange={handleChange} required />
                        </Form.Group>
                        <Form.Group controlId="iscredit">
                            <Form.Check type="checkbox" label="Credit Course" name="iscredit" checked={formData.iscredit} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            {editMode ? "Update" : "Add"}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default AddCourse;
