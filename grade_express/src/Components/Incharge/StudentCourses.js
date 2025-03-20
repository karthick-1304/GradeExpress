import React, { useEffect, useState } from "react";
import { useParams, useLocation,Link } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const StudentCourses = () => {
    const { regno } = useParams();
    const [studentInfo, setStudentInfo] = useState(null);
    const location = useLocation();
    const [courses, setCourses] = useState({ completed: [], ongoing: [] });
    const studentName = location.state?.studentName || "Unknown Student";

    useEffect(() => {
        axios.get(`http://localhost:5000/student/${regno}/courses`)
            .then((response) => {
                setCourses(response.data);
                setStudentInfo({ name: studentName, regno });
            })
            .catch((error) => {
                console.error("Error fetching student courses:", error);
            });
    }, [regno]);

    return (
        <div className="container my-5">
            {/* Student Info Card */}
            <div className="card shadow-lg p-4 text-center mb-4">
                {studentInfo && (
                    <>
                        <h2 className="fw-bold">{studentInfo.name}</h2>
                        <p className="text-muted fs-5">Reg No: {studentInfo.regno}</p>
                        <div className="d-flex justify-content-center gap-3">
                            <span className="badge bg-success fs-6">
                                {courses.completed.length} Completed Courses
                            </span>
                            <span className="badge bg-warning text-dark fs-6">
                                {courses.ongoing.length} Ongoing Courses
                            </span>
                        </div>
                    </>
                )}
            </div>

            {/* Completed Courses Table */}
            <h3 className="mb-3 text-success">✅ Completed Courses</h3>
            <div className="table-responsive">
                <table className="table table-striped table-bordered shadow">
                    <thead className="table-success">
                        <tr>
                            <th>Course ID</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Grade</th>
                            <th>Certificate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.completed.map((course, index) => (
                            <tr key={index}>
                                <td>{course.course_code}</td>
                                <td>{course.name}</td>
                                <td>{course.score}</td>
                                <td className="fw-bold">{course.grade}</td>
                                <td>{course.certificate}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Ongoing Courses Table */}
            <h3 className="mt-5 mb-3 text-warning">⏳ Ongoing Courses</h3>
            <div className="table-responsive">
                <table className="table table-hover table-bordered">
                    <thead className="table-warning">
                        <tr>
                            <th>Course ID</th>
                            <th>Name</th>
                            <th>Credits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.ongoing.map((course, index) => (
                            <tr key={index}>
                                <td>{course.course_code}</td>
                                <td>{course.name}</td>
                                <td>{course.credits_count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Back Button */}
            <div className="text-center mt-4">
                <Link to="/StaffHomePage" className="btn btn-primary btn-lg">
                    🔙 Back
                </Link>
            </div>
        </div>
    );
};

export default StudentCourses;
