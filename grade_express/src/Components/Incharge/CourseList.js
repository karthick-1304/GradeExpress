import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Form, InputGroup } from "react-bootstrap";
import { useNavigate,Link,useLocation  } from "react-router-dom";
import axios from "axios";


const CourseList = ({logout}) => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [departments] = useState(['CSE', 'ECE', 'EEE', 'MECH', 'CIVIL', 'AIDS', 'IT', 'SH']);
    const [selectedDept, setSelectedDept] = useState("");
    const location = useLocation();
    const user = location.state?.user || {}; 
    
    const navigate = useNavigate();

    useEffect(() => {
        fetchCourses();
    }, [location]);

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/courses");
            setCourses(res.data);
            setFilteredCourses(res.data); // Initialize filtered list
        } catch (err) {
            console.error("Error fetching courses", err);
        }
    };

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!query.trim()) {
            setFilteredCourses(courses);
        } else {
            setFilteredCourses(
                courses.filter(course =>
                    course.name.toLowerCase().includes(query.toLowerCase()) ||
                    course.code.toLowerCase().includes(query.toLowerCase())
                )
            );
        }
    };

    const handleFilter = async (dept) => {
        setSelectedDept(dept);

        if (!dept) {
            setFilteredCourses(courses); // Reset to all courses
            return;
        }

        try {
            const res = await axios.get(`http://localhost:5000/courses/filter/${dept}`);
            setFilteredCourses(res.data);
        } catch (err) {
            console.error("Error filtering courses", err);
            setFilteredCourses([]);
        }
    };

    return (
        <>

        <div>
            <nav className="navbar navbar-expand-lg shadow py-3">
                    <div className="container">
                      <div
                        className="collapse navbar-collapse justify-content-end"
                        id="navbarNav"
                      >
                        <ul className="navbar-nav gap-4">
                          <Link to={`/${user.role}HomePage`}className="text-decoration-none">
                            <li className="nav-item">Home</li>
                          </Link>
                          <Link to="/courses" state={{ user }} className="text-decoration-none">
                            <li className="nav-item">Courses</li>
                          </Link>
                          {Array.isArray(user.designation) && user.designation.includes("Incharge") && (
                            <>
                              <Link to="/addCourse" className="text-decoration-none">
                                <li className="nav-item">Add Course</li>
                              </Link>
                              <Link to="/od-report" className="text-decoration-none">
                                <li className="nav-item">OD Report</li>
                              </Link>
                            </>
                          )}
                          {Array.isArray(user.designation) && user.designation.includes("Tutor")&& (
                            <>
                            <Link to="/verifyCertificate" className="text-decoration-none">
                            <li className="nav-item">Verify</li>
                          </Link>
                            </>
                          )}  
                          <Link to="/"  onClick={()=>logout()} className="text-decoration-none">
                            <li className="nav-item">Logout</li>
                          </Link>
                        </ul>
                      </div>
                    </div>
                  </nav>
        </div>
        <Container className="my-5">
            <h2 className="text-center text-primary fw-bold mb-4">
                📚 Explore Our Courses
            </h2>

            {/* Search & Filter Row */}
            <Row className="mb-4 justify-content-center">
                <Col md={5}>
                    <InputGroup className="shadow-sm">
                        <InputGroup.Text className="bg-primary text-white">
                            🔍
                        </InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Search courses by name or code..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="rounded-end"
                        />
                    </InputGroup>
                </Col>
                <Col md={4}>
                    <Form.Select
                        value={selectedDept}
                        onChange={(e) => handleFilter(e.target.value)}
                        className="shadow-sm"
                    >
                        <option value="">🎓 All Deaprtments</option>
                        {departments.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Display Selected Filter */}
            {selectedDept && (
                <p className="text-left fw-bold" style={{ fontSize: "1.2rem", color: "black" }}>
                    📌 Filtered by {selectedDept}
                </p>
            )}


            {/* Course Cards */}
            <Row>
                {filteredCourses.length > 0 ? (
                    filteredCourses.map((course) => (
                        <Col key={course.code} md={4} className="mb-4">
                            <Card
                                className="shadow-lg border-0 course-card"
                                onClick={() =>
                                    navigate(`/course/${course.code}`, {
                                        state: {
                                            user: user,
                                            courseInfo: {
                                                id: course.code,
                                                name: course.name,
                                                weeks: course.no_of_weeks,
                                                credits: course.credits_count,
                                                instructor: course.instructor,
                                                domain: course.domain
                                            },
                                        },
                                    })
                                }
                            >
                                <Card.Img 
                                    variant="top" 
                                    src={require("../../Asserts/nptel_image_course.jpg")} 
                                    className="course-img" 
                                />
                                <Card.Body className="text-left">
                                    <Card.Title className="fw-bold text-primary course-title">
                                        {course.name}
                                    </Card.Title>
                                    <Card.Text className="course-details">
                                        <span>📘 <strong>Course Code:</strong> {course.code}</span> <br />
                                        <span>📆 <strong>No.of.Weeks:</strong> {course.no_of_weeks}</span> <br />
                                        <span>🎓 <strong>Credits Offered:</strong> {course.credits_count}</span><br/>
                                        <span>🎓 <strong>Instructor</strong> {course.instructor}</span>
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col className="text-center">
                        <p className="text-danger fs-5 fw-bold">No courses found!</p>
                    </Col>
                )}
            </Row>
        </Container>
        </>
    );
};

export default CourseList;
