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
const {getStaff, addStaff, editStaff, deleteStaff, editProfileStaff}=require("./staff.js")
const {getCourses,addCourse,editCourse, deleteCourse}=require("./course.js");
const { deleteStudent, getStudents, editStudent } = require("./student.js");
const { fetchEnrollments, enrollCourse, deleteEnrollment, updateEnrollment } = require("./process.js");
const { forgetPassword } = require("./email.js");
const { addVerfication } = require("./verification.js");
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
  app.get('/getCourses', getCourses);
  app.post('/addCourse',addCourse);
  app.put('/editCourse/:code',editCourse);
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
  app.get('/getCoursesToEnroll', getCourses);
 // app.post('/updateEnrollment', upload.single("certificate"), updateEnrollment);
  app.post('/updateEnrollment', upload.single("certificate"), updateEnrollment);
  app.post("/forgot-password",forgetPassword);
  app.post("/addVerfication_details",addVerfication);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


