import  {React, useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Modal, Form } from 'react-bootstrap';
import RoleBasedHeader from '../Common_pages/RoleBasedHeader';
import "./RegisterCourse.css"

const RegiterCourse = ({user,logout}) => {
    const [courses, setCourses] = useState([]);
    const [displayCourses, setDisplayCourses] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchName,setSearchName]=useState();
    const [searchText, setSearchText] = useState('');
    const [selectedDept, setSelectedDept] = useState('');
    const [creditFilter, setCreditFilter] = useState('');
    const [registeredFilter, setRegisteredFilter] = useState('');

    // Filter logic
    const filteredCourses = courses.filter(course => {
        const matchesSearch = course.name.toLowerCase().includes(searchText.toLowerCase()) || 
                              course.code.toLowerCase().includes(searchText.toLowerCase());
        const matchesDept = selectedDept ? course.domain === selectedDept : true;
        const matchesCredit = creditFilter ? (creditFilter === "Yes" ? course.iscredit : !course.iscredit) : true;
        const matchesRegistration = registeredFilter ? (registeredFilter === "Registered" ? course.depts_enroll?.includes(user.dept) : !course.depts_enroll?.includes(user.dept)) : true;
        
        return matchesSearch && matchesDept && matchesCredit && matchesRegistration;
    }); 

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/getCourses/all');
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

    const handleRegisterCourse = async (course) => {
        console.log(course.depts_enroll);
        const action=course.depts_enroll?.includes(user.dept)?"Unregister":"Register";
        console.log(action);
        try {
            await axios.put(`http://localhost:5000/registerCourse/${course.code}`, {
                dept: user.dept ,action:action
            });
            fetchCourses();
            console.log("Success");
        } catch (error) {
            console.error("Error registering course:", error);
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
        <RoleBasedHeader user={user} logout={logout} />
        <div className="admin-page">
            <h1 className='course-h2'>Course Management</h1>
            
            {/* Filters */}
            <div className='register-course-search-container'>
                    <input type="text" placeholder="Search by Course Name or Code" className='register-course-search' onChange={(e) => setSearchText(e.target.value)} />
                    <Form.Select className='filter-dropdown' onChange={(e) => setSelectedDept(e.target.value)}>
                        <option value="">Filter by Department</option>
                        {[...new Set(courses.map(course => course.domain))].map((dept, index) => (
                            <option key={index} value={dept}>{dept}</option>
                        ))}
                    </Form.Select>
                    <Form.Select className='filter-dropdown' onChange={(e) => setCreditFilter(e.target.value)}>
                        <option value="">Filter by Credit Type</option>
                        <option value="Yes">Credit</option>
                        <option value="No">Non-Credit</option>
                    </Form.Select>
                    <Form.Select className='filter-dropdown' onChange={(e) => setRegisteredFilter(e.target.value)}>
                        <option value="">Filter by Registration Status</option>
                        <option value="Registered">Registered</option>
                        <option value="Not Registered">Not Registered</option>
                    </Form.Select>
                </div>
                
            
            {/* Table */}
            <Table className='course-table' striped hover>
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
                    {filteredCourses.map((course) => (
                        <tr key={course.code}>
                            <td>{course.code}</td>
                            <td>{course.name}</td>
                            <td>{course.domain}</td>
                            <td>{course.iscredit ? "Yes" : "No"}</td>
                            <td>
                                <Button 
                                    variant={course.depts_enroll?.includes(user.dept) ? "danger" : "success"} 
                                    onClick={() => handleRegisterCourse(course)}
                                >
                                    {course.depts_enroll?.includes(user.dept) ? "Unregister" : "Register"}
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    </div>
);
}

export default RegiterCourse