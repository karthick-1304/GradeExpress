require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const multer = require("multer");
const path = require('path');
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
const {pool,login,authMiddleware,checkToken}=require( "./dbConnection.js");
const{uploadStudent}=require("./admin.js");

const {getStaff, addStaff, editStaff, deleteStaff, editProfileStaff,getTutorwardStudents,removeStudentFromTutorward,getAllCourses,getCoursesSearch,getCoursesFilter,getCourseStudents,addGrade,getStudentCourses,getEligibleStudents,actionVerification,addStudentsToTutorward,getTutorwardList ,getCourseIncharge,setScore,getAllCompletedCourses,getCompletedDistCourses,getRecords,getSeasons,generateCourseExcel}=require("./staff.js")
const {getCourses,addCourse,editCourse, deleteCourse, registerCourse, getAllotedCourses, editDeadLineCourse}=require("./course.js");

const { deleteStudent, getStudents, editStudent } = require("./student.js");
const { fetchEnrollments, enrollCourse, deleteEnrollment, updateEnrollment } = require("./process.js");
const { forgetPassword } = require("./email.js");
const { addVerfication } = require("./verification.js");
const { getCourseRegistrations, getUniqueExamDates, generateStudentExcel } = require("./OdList.js");

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//choice 1:
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); 
  }
});

// const storage = multer.memoryStorage();
const upload = multer({ storage: storage , limits: { fileSize: 10 * 1024 * 1024 }, });

//choice:2
// const upload = multer({ dest: "uploads/" });
  app.use(cors());
  app.use(bodyParser.json());
  app.post("/login",login);
  app.post("/checkToken",authMiddleware,checkToken);
  app.post("/upload",uploadStudent);
  app.get('/getStaffs', getStaff);
  app.get('/getCourses/:dept', getCourses);
  app.put('/registerCourse/:code', registerCourse);
  app.post('/addCourse',addCourse);
  app.put('/editCourse/:code',editCourse);
  app.put('/editDeadLineCourse/:code',editDeadLineCourse);
  app.delete('/deleteCourse/:code', deleteCourse);
  app.post('/addStaffs', addStaff);
  app.put('/editStaffs', editStaff);
  app.delete('/deleteStaffs/:regno', deleteStaff);
  app.get('/getStudents', getStudents);
  app.delete('/deletStudents/:regno',deleteStudent );
  app.put('/editProfileStudent',editStudent);
  app.put('/editProfileStaff',editProfileStaff);
  app.post('/fetchEnrollments', fetchEnrollments);
  app.post('/enrollments', enrollCourse);
  app.post("/deleteEnrollment",deleteEnrollment);
  app.get('/getCoursesToEnroll/:dept', getAllotedCourses);
 // app.post('/updateEnrollment', upload.single("certificate"), updateEnrollment);
  app.post('/updateEnrollment', upload.single("certificate"), updateEnrollment);
  app.post("/forgot-password",forgetPassword);
  app.post("/addVerfication_details",addVerfication);
app.get("/course-registration/:dept", getCourseRegistrations);
  app.get("/exam-dates/:dept", getUniqueExamDates);
  app.get("/generate-excel/:dept/:exam_date", generateStudentExcel);



app.get("/:tutorId/listofwardstudents",getTutorwardList );
//Getting All tutorward students
 app.get( "/studentsTutorward",getTutorwardStudents);
  //Getting the courses of a student of tutorward
app.get("/student/:regno/courses", getStudentCourses);
//Getting the eligible students for a tutor based on the academic year of the tutor logged in
app.get("/tutor/:tutorYear/eligible-students", getEligibleStudents);
//Adding students to the tutorward 
app.post("/tutor/:tutorId/add-students", addStudentsToTutorward);
 //delete the partcular student from the tutorward
app.post("/remove-student/:tutorId", removeStudentFromTutorward);
//Verification List of the students of the tutorward
app.get("/studentsVerify/:regno",actionVerification);
//Getting all the courses of the particular NPTEL season
app.get("/courses", getAllCourses);
//Getting the courses based on the search query name or code
app.get("/courses/search", getCoursesSearch);
//Getting the courses based on the department
app.get("/courses/filter/:dept", getCoursesFilter);
//Getting the students of a particular course
app.get("/courses/:code/students", getCourseStudents);
//Adding the grade of a student in a course
app.get("/courses/:code/grade", addGrade);
//getCourseIncharge
app.get("/courses/:courseDomain/incharge",getCourseIncharge);

//setScore
app.post("/update-score",setScore);
app.get("/download-excel", generateCourseExcel);
app.get("/records",getRecords);
app.get("/seasons",getSeasons);
app.get("/completed_dist_courses",getCompletedDistCourses)
app.get("/getAllCourses",getAllCompletedCourses);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


