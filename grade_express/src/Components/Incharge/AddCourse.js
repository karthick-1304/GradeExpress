import React, { useState, useEffect, act } from 'react';
import "./AddCourse.css";
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import RoleBasedHeader from '../Common_pages/RoleBasedHeader';
const AddCourse = ({user,logout}) => {
    const [courses, setCourses] = useState([]);
    const [displayCourses, setDisplayCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeadLineModal, setShowDeadLineModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchName,setSearchName]=useState();
    const [activeSection,setActiveSection]=useState("home");
    const [selectedProcess,setSelectedProcess]=useState("none");
    const [deadLineCourseData,setDeadLineCourseData]=useState({
        st_date:new Date().toISOString().split('T')[0],
        end_date:new Date().toISOString().split('T')[0]
    })
    const [formData, setFormData] = useState({
        name: "",
        credits_count: 0,
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
            const response = await axios.get(`http://localhost:5000/getCourses/${user.dept}`);
            setCourses(response.data);
            setDisplayCourses(response.data);
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

    const handleDeadLineChange=(e)=>{
        const { name, value } = e.target;
        setDeadLineCourseData({
            ...deadLineCourseData,
             [name]: value
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        formData["domain"]=user.dept;
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

    const handleDeadLineSubmit = async (e) => {
        e.preventDefault();
        console.log(deadLineCourseData);
        deadLineCourseData["prefix"]=selectedProcess;
        if(!deadLineCourseData.st_date||!deadLineCourseData.end_date){
            alert("Enter Date");return;
        }

        try {
            await axios.put(`http://localhost:5000/editDeadLineCourse/${selectedCourse.code}`, deadLineCourseData);
            fetchCourses();
            handleCloseModal();
        } catch (error) {
            alert("Check Date Range");
            console.error("Error submitting course:", error);
        }
    };
    

    const handleDeadLineSelect = async () => {
       
        if(selectedProcess=='none'){
            alert("Select Process");
            return;}
        setActiveSection("action");
        const newDeadLineData = {
            st_date: selectedCourse[`${selectedProcess}st_date`]?.split('T')[0] || new Date().toISOString().split('T')[0],
            end_date:selectedCourse[`${selectedProcess}end_date`]?.split('T')[0] || new Date().toISOString().split('T')[0],
        };
        setDeadLineCourseData(newDeadLineData);
        
    };
    
    const handleAddCourse = () => {
        setEditMode(false);
        setFormData({
            name: "",
            credits_count: 0,
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
    const handleDeadLineCourse = (course) => {
        setShowDeadLineModal(true);
        setSelectedCourse(course);
        setShowDeadLineModal(true);
    };

    const handleDeleteCourse = async (code) => {
        if (!window.confirm("Are You Sure?")) 
            return;  // Stop execution if userclicks "Cancel"
        alert("Ok");
        try {
            await axios.delete(`http://localhost:5000/deleteCourse/${code}`);
            fetchCourses();
        } catch (error) {
            console.error("Error deleting course:", error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setShowDeadLineModal(false);
        setSelectedCourse(null);
        setActiveSection("home");
    };
     
    function search(e) {
        const value = e.target.value;
        setSearchName(value);
        if (value) {
            setDisplayCourses(courses.filter(course => course.name.toLowerCase().includes(value.toLowerCase())));
        }
        else    
            setDisplayCourses(courses);
    }
    return (
        <div className='outer-container-incharge'>
           <RoleBasedHeader user={user} logout={logout}/>
            <div className="admin-page">
                <h1 className='course-h2'>Course Management</h1>
                <div className='course-search-container'>
                <Button onClick={handleAddCourse}>Add Course</Button>
                <input type="text"  placeholder="Search by Course Name: " className='course-search' onChange={search} />
                </div>
                <Table  className='course-table'striped  hover>
                    <thead>
                        <tr>
                            <th>Course Code</th>
                            <th>Name</th>
                            <th>No Of Credit</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayCourses.map((course) => (
                            <tr key={course.code}>
                                <td>{course.code}</td>
                                <td>{course.name}</td>
                                <td>{course.credits_count>0?"Yes":"No"}</td>
                                <td>
                                    <Button variant="success" onClick={() => handleEditCourse(course)}>Edit</Button>{' '}
                                    <Button variant="warning" onClick={() => handleDeadLineCourse(course)}>DeadLine</Button>{' '}
                                    <Button variant="danger" onClick={() => handleDeleteCourse(course.code)}>Delete</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Modal className='deadline-model-form' show={showDeadLineModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Time Line Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form >
                        {activeSection=='home'&&(
                            <>
                                <select
                                id="" value={selectedProcess}
                                onChange={(e) => setSelectedProcess(e.target.value)}>
                                    <option value="" hidden>Select Process</option>
                                    <option value="enroll_">Enroll</option>
                                    <option value="payment_">Payment</option>
                                    <option value="hallticket_">HallTicket</option>
                                    <option value="certificate_">Certificate</option>
                                    <option value="acceptance_">Grade Acceptance</option>
                                </select>
                                <Button variant="primary"  onClick={handleDeadLineSelect}>Submit</Button>
                            </>
                        )}
                        {activeSection=='action'&&(
                            <>
                                 <Form.Group>
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control type="date" name="st_date" value={deadLineCourseData.st_date} onChange={handleDeadLineChange} required />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control type="date" name="end_date" value={deadLineCourseData.end_date} onChange={handleDeadLineChange} required />
                                </Form.Group>
                                <Button variant="primary" type="submit" onClick={handleDeadLineSubmit}>Update</Button>
                            </>
                        )}
                    </Form>
                </Modal.Body>
            </Modal>
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
                            <Form.Label> Number of Credits</Form.Label>
                            <Form.Control type="number" name="credits_count" value={formData.credits_count} onChange={handleChange} required />
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
