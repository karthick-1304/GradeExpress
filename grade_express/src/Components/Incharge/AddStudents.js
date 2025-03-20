import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddStudents = ({ user }) => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [selectedStudents, setSelectedStudents] = useState([]);
    const [regnoRange, setRegnoRange] = useState({ from: "", to: "" });
    const [specificRegno, setSpecificRegno] = useState("");

    useEffect(() => {
        axios.get(`http://localhost:5000/tutor/${user.tutor_year}/eligible-students`)
            .then(response => {
                setStudents(response.data);
            })
            .catch(error => {
                console.error("Error fetching students:", error);
            });
    }, [user]);

    const handleCheckboxChange = (regno) => {
        setSelectedStudents(prev =>
            prev.includes(regno) ? prev.filter(id => id !== regno) : [...prev, regno]
        );
    };

    const handleAddStudents = () => {
        if (selectedStudents.length === 0) {
            toast.error("Please select at least one student.");
            return;
        }

        axios.post(`http://localhost:5000/tutor/${user.regno}/add-students`, { regnos: selectedStudents,tutor_name:user.name })
            .then(response => {
                toast.success("Students added successfully!");
                setStudents(students.filter(s => !selectedStudents.includes(s.regno)));
                setSelectedStudents([]);
            })
            .catch(error => {
                console.error("Error adding students:", error);
                toast.error("Failed to add students.");
            });
    };

    const handleAddByRange = () => {
        if (!regnoRange.from || !regnoRange.to) {
            toast.error("Enter both 'From' and 'To' RegNo.");
            return;
        }
        const rangeSelection = students
            .filter(student => student.regno >= regnoRange.from && student.regno <= regnoRange.to)
            .map(student => student.regno);

        setSelectedStudents([...new Set([...selectedStudents, ...rangeSelection])]);
        toast.success(`${rangeSelection.length} students selected.`);
    };

    const handleAddSpecific = () => {
        if (!specificRegno) {
            toast.error("Enter a valid RegNo.");
            return;
        }
        if (students.some(student => student.regno === specificRegno)) {
            setSelectedStudents([...new Set([...selectedStudents, specificRegno])]);
            toast.success(`Student ${specificRegno} selected.`);
        } else {
            toast.error("RegNo not found in eligible students.");
        }
    };

    return (
        <div className="container mt-4">
            <button className="btn btn-outline-dark mb-3" onClick={() => navigate("/StaffHomePage")}>
                ⬅ Back
            </button>
            <h2 className="text-center fw-bold mb-4">📚 Add Students to Tutor Ward</h2>

            {/* Add by Range */}
            <div className="card shadow-sm p-3 mb-4">
                <h4 className="fw-bold text-primary">📌 Add by Range</h4>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        placeholder="From RegNo"
                        value={regnoRange.from}
                        onChange={e => setRegnoRange({ ...regnoRange, from: e.target.value })}
                        className="form-control"
                    />
                    <input
                        type="text"
                        placeholder="To RegNo"
                        value={regnoRange.to}
                        onChange={e => setRegnoRange({ ...regnoRange, to: e.target.value })}
                        className="form-control"
                    />
                    <button className="btn btn-primary" onClick={handleAddByRange}>Add Range</button>
                </div>
            </div>

            {/* Add by Specific RegNo */}
            <div className="card shadow-sm p-3 mb-4">
                <h4 className="fw-bold text-primary">📌 Add by Specific RegNo</h4>
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        placeholder="Enter RegNo"
                        value={specificRegno}
                        onChange={e => setSpecificRegno(e.target.value)}
                        className="form-control"
                    />
                    <button className="btn btn-primary" onClick={handleAddSpecific}>Add</button>
                </div>
            </div>

            {/* Select Students */}
            <div className="card shadow-sm p-3 mb-4">
                <h4 className="fw-bold text-primary">📌 Select Students</h4>
                <div className="table-responsive">
                    <table className="table table-hover table-bordered">
                        <thead className="table-warning">
                            <tr>
                                <th>Select</th>
                                <th>RegNo</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">No students found.</td>
                                </tr>
                            ) : (
                                students.map(student => (
                                    <tr key={student.regno}>
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(student.regno)}
                                                onChange={() => handleCheckboxChange(student.regno)}
                                            />
                                        </td>
                                        <td>{student.regno}</td>
                                        <td>{student.name}</td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Selected Students */}
            <button className="btn btn-success w-100 py-2 fw-bold" onClick={handleAddStudents}>
                ✅ Add Selected Students
            </button>
        </div>
    );
};

export default AddStudents;
