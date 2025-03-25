import React, { useState, useEffect, use } from "react";
import { useParams, useLocation ,Link} from "react-router-dom";
import { Container, Button, Table, Nav, Tab, Card, Spinner, Alert } from "react-bootstrap";
import { BsGraphUp, BsPeople, BsJournalBookmark } from "react-icons/bs";
import Chart from "react-apexcharts";
import BellCurveChart from "./BellCurveChart";
import axios from "axios";
import "./CourseDetails.css"; // Custom Styles
import { Toaster, toast } from "react-hot-toast";
import RoleBasedHeader from "../Common_pages/RoleBasedHeader";

const CourseDetails = ({logout}) => {
  const { courseCode } = useParams();
  const location = useLocation();
  const [gradeRanges, setGradeRanges] = useState({});
  const { user, courseInfo } = location.state;
  console.log("course_info",courseInfo);
  console.log("user",user);

  const isStaff = user.designation?.includes("Incharge")&&user?.dept===courseInfo['domain']; // ✅ STAFF CHECK


  const [students, setStudents] = useState([]);
  const [chartOptions, setChartOptions] = useState({});
  const [chartSeries, setChartSeries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [gradingApplied, setGradingApplied] = useState(false);
  const [courseIncharge, setCourseIncharge] = useState([]);

  const loggedInStudent = students.find((s) => s.student_regno === user.regno);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchIncharge();
      await fetchCourseStudents();
      setLoading(false); 
    };
  
    fetchData();
  }, [location]); 

  const fetchCourseStudents = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${courseCode}/students`);
      console.log("Fetched students:", response.data);
  
      setStudents(response.data); // 🔹 Update state
      if (response.data.some((s) => s.grade)) {
        setGradingApplied(true);
        prepareChartData(response.data);
      }
    } catch (error) {
      console.error("Error fetching students", error);
    }
  };
  
  const fetchIncharge = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${courseInfo['domain']}/incharge`);
      console.log("Fetched incharge:", response.data);
  
      setCourseIncharge(response.data[0]); // 🔹 Update state
    } catch (error) {
      console.error("Error fetching incharge", error);
    }
  };

  const prepareChartData = (students) => {
    const marks = students.map((s) => parseFloat(s.score)).sort((a, b) => a - b);
    if (marks.length === 0) return;

    const bins = Array(10).fill(0);
    const minMark = Math.min(...marks);
    const maxMark = Math.max(...marks);
    const range = (maxMark - minMark) / 10;

    marks.forEach((mark) => {
      const index = Math.min(9, Math.floor((mark - minMark) / range));
      bins[index]++;
    });

    setChartOptions({
      chart: { type: "line", toolbar: { show: false } },
      title: { text: "Grade Distribution (Bell Curve)", align: "center", style: { fontSize: "16px" } },
      xaxis: { categories: bins.map((_, i) => (minMark + i * range).toFixed(2)), title: { text: "Marks" } },
      yaxis: { title: { text: "Frequency" } },
      stroke: { curve: "smooth" },
    });

    setChartSeries([{ name: "Students", data: bins }]);
  };

  const handleGrading = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/courses/${courseCode}/grade`);
      setGradeRanges(response.data.gradeRanges);
      toast.success("Graded Successfully!", {
                position: "top-center",
                duration: 5000,
              });
      fetchCourseStudents();
    } catch (error) {
      toast.error("Grading Unsuccessful!", {
                position: "top-center",
                duration: 5000,
      });
    }
  };

  return (
    <>
    <RoleBasedHeader user={user} logout={logout}/> 
   
    <Container className="course-container mt-4">
    
      {/* 🔹 COURSE HEADER */}
      {courseInfo &&loading===false&& (
        <Card className="course-header-card shadow-lg p-4">
          <Card.Body className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="course-title text-primary">
                {courseInfo.name} ({courseInfo.id})
              </h2>
              <p>
                <strong>Duration:</strong> {courseInfo.weeks} weeks | <strong>Credits:</strong> {courseInfo.credits}
              </p>
              {students.length>0&&isStaff && (
                <Button variant="success" onClick={handleGrading} className="proceed-button">
                  Proceed Grade
                </Button>
              )}
            </div>

            { courseIncharge && (
                <div className="text-end">
                <h5 className="text-info">{courseIncharge?.name}</h5>
                <p>
                  <strong>Dept:</strong> {courseIncharge?.dept} <br />
                  <strong>Staff Code:</strong> {courseIncharge?.phone_no}
                </p>
              </div>
              )}

          </Card.Body>
        </Card>
      )}

      {/* 🔹 NAVIGATION TABS */}
      <Tab.Container defaultActiveKey="instructions">
        <Nav variant="tabs" className="nav-tabs bg-light p-2 rounded">
          <Nav.Item>
            <Nav.Link eventKey="instructions">
              <BsJournalBookmark className="me-2" /> Instructions
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="participants">
              <BsPeople className="me-2" /> Participants
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="gradeCurve">
              <BsGraphUp className="me-2" /> Grade Curve
            </Nav.Link>
          </Nav.Item>
        </Nav>

        <Tab.Content className="mt-3">
          {/* 📖 INSTRUCTIONS SECTION */}
          <Tab.Pane eventKey="instructions">
          <Card className="info-card shadow-sm">
            <Card.Body>
              <h4 className="text-primary">📚 Grading Instructions</h4>

              


              {/* 🟢 Absolute Grading (If students < 25) */}
              {students.length < 25 && (
                <>
                  <h5 className="text-dark">📌 Absolute Grading (Strength &lt; 25)</h5>
                  <p>Grades are assigned based on the highest secured marks (X) and class interval (k).</p>

                  <Table striped bordered hover responsive className="grade-table">
                    <thead>
                      <tr><th>Grade</th><th>Marks Range</th><th>Grade Point</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>O</td><td>M &gt; (X - k)</td><td>10</td></tr>
                      <tr><td>A+</td><td>(X - k) ≥ M &gt; (X - 2k)</td><td>9</td></tr>
                      <tr><td>A</td><td>(X - 2k) ≥ M &gt; (X - 3k)</td><td>8</td></tr>
                      <tr><td>B+</td><td>(X - 3k) ≥ M &gt; (X - 4k)</td><td>7</td></tr>
                      <tr><td>B</td><td>(X - 4k) ≥ M ≥ (X - 5k)</td><td>6</td></tr>
                      <tr><td>RA</td><td>M &lt; 50</td><td>0</td></tr>
                    </tbody>
                  </Table>

                  <Alert variant="warning">
                    <strong>Class Interval Calculation (k):</strong><br />
                    k = (X - 50) / 5 (If k &lt; 7, take k = 7)
                  </Alert>
                </>
              )}

              {/* 🔵 Relative Grading (If students ≥ 25) */}
              {students.length >= 25 && (
                <>
                  <h5 className="text-dark">📌 Relative Grading (Strength ≥ 25)</h5>
                  <p>Grades are assigned using the mean (μ) and standard deviation (σ).</p>

                  <Table striped bordered hover responsive className="grade-table">
                    <thead>
                      <tr><th>Grade</th><th>Marks Range</th><th>Grade Point</th></tr>
                    </thead>
                    <tbody>
                      <tr><td>O</td><td>M ≥ (μ + 1.65σ)</td><td>10</td></tr>
                      <tr><td>A+</td><td>(μ + 1.65σ) &gt; M ≥ (μ + 0.85σ)</td><td>9</td></tr>
                      <tr><td>A</td><td>(μ + 0.85σ) &gt; M ≥ μ</td><td>8</td></tr>
                      <tr><td>B+</td><td>μ &gt; M ≥ (μ - 0.9σ)</td><td>7</td></tr>
                      <tr><td>B</td><td>(μ - 0.9σ) &gt; M ≥ (μ - 1.8σ)</td><td>6</td></tr>
                      <tr><td>RA</td><td>M &lt; (μ - 1.8σ) OR M &lt; 50</td><td>0</td></tr>
                    </tbody>
                  </Table>

                  <Alert variant="info">
                    <strong>Mean (μ) Calculation:</strong><br />
                    μ = (ΣM) / n (Average of total marks)<br /><br />
                    <strong>Standard Deviation (σ) Calculation:</strong><br />
                    σ = sqrt( (Σ(M - μ)²) / n ) (Spread of marks)
                  </Alert>
                </>
              )}
            </Card.Body>
          </Card>
        </Tab.Pane>

          {/* 👥 PARTICIPANTS SECTION */}
          <Tab.Pane eventKey="participants">
  {loading ? (
    <Spinner animation="border" variant="primary" />
  ) : students.length > 0 ? (
    <Table striped bordered hover responsive className="student-table shadow-sm">
      <thead>
        <tr className="bg-dark text-white">
          <th>Reg No</th>
          <th>Name</th>
          <th>Marks</th>
          <th>Grade</th>
        </tr>
      </thead>
      <tbody>
        {loggedInStudent && (
          <tr className="table-success">
            <td><strong>{loggedInStudent.student_regno}</strong></td>
            <td><strong>{loggedInStudent.name} (You)</strong></td>
            <td><strong>{loggedInStudent.score}</strong></td>
            <td><strong>{loggedInStudent.grade || "N/A"}</strong></td>
          </tr>
        )}
        {students.map((s) => (
          <tr key={s.student_regno}>
            <td>{s.student_regno}</td>
            <td>{s.name}</td>
            <td>{s.score|| "N/A"}</td>
            <td>{s.grade || "N/A"}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  ) : (
    <p className="text-center text-muted">No students list available.</p>
  )}
</Tab.Pane>
      {Object.keys(gradeRanges).length > 0 && (
              <div>
                <h3>Grade Ranges:</h3>
                <ul>
                  {Object.entries(gradeRanges).map(([grade, range]) => (
                    <li key={grade}>
                      {grade}: {range[0]} - {range[1]}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          <Tab.Pane eventKey="gradeCurve">
            <Card className="shadow-sm p-3">
              <h4 className="text-primary">📈 Grade Distribution Curve</h4>
              
              <p>
                {students.length < 25
                  ? "This chart represents the distribution of grades based on Absolute Grading."
                  : "This chart represents the distribution of grades based on Relative Grading."
                }
              </p>

              {/* Send actual students data to BellCurveChart */}
              <BellCurveChart students={students} />
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </Container>
    </>
  );
};

export default CourseDetails;
