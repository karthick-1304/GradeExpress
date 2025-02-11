import React, { useState, useEffect } from 'react';
import "./AddCourse.css";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';

const AddCourse = () => {
    const [courses, setCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
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
        prev_topper: "",
        assignment_drive_link: "",
    });
    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getCourses');
            setCourses(response.data);
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
            prev_topper: "",
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

    return (
        <div className='outer-container'>
            <div className="admin-page">
                <h1>Course Management</h1>
                <Button onClick={handleAddCourse}>Add Course</Button>
                <Table striped bordered hover>
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
                        {courses.map((course) => (
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

            <Modal show={showModal} onHide={handleCloseModal}>
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
                            <Form.Label>Previous Topper</Form.Label>
                            <Form.Control type="text" name="prev_topper" value={formData.prev_topper} onChange={handleChange} />
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
