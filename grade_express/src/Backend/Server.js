require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const app = express();
app.use(cors());
app.use(bodyParser.json());

  const pool= new Pool({
    host: 'localhost', 
    port: 5432, 
    user: 'postgres', // Replace with your PostgreSQL username
    password: '2004', // Replace with your PostgreSQL password
    database: 'gradeExpress', // Replace with your PostgreSQL database name
  });

 
  app.post("/login", async (req, res) => {
    try {
      const { regno, password,role } = req.body;
      const db=(role==='Student')?"students_info":"staff_info";
      const query = `SELECT * FROM ${db} WHERE regno = $1`; 
      const result = await pool.query(query, [regno]); 
      if (result.rows.length === 0) 
        return res.status(401).json({ message: "Invalid registration number or password" });
      const user = result.rows[0];
      const passwordMatch = password===user.password;
      if (!passwordMatch) 
        return res.status(401).json({ message: "Invalid registration number or password" });
      let data;
      if(role=="Student"){
        data={
          regno: user.regno,
          name: user.name,
          password:user.password,
          email: user.email,
          dept: user.dept,
          tutor_name: user.tutor_name,
          phone_no: user.phone_no,
          year_of_joining: user.year_of_joining,
          role
        }
      }
      else{
        data={
          regno: user.regno,
          name: user.name,
          password:user.password,
          email: user.email,
          dept: user.dept,
          designation:user.designation,
          phone_no: user.phone_no,
          role
          // tutor_ward
        }
      }
      
      const token = jwt.sign( {regno:user.regno,role}, "123@2004", { expiresIn: "30m" });
  
      res.json({
        message: "Login successful",
       token,
        user: data
      });
    } catch (error) {
      console.error("Login Error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  const authMiddleware = (req, res, next) => {
    const {token}=req.body;
    if (!token) 
      return res.status(401).json({ message: "Access denied. No token provided." });
    
    try {
      const decoded = jwt.verify(token, "123@2004"); 
      req.body.regno = decoded.regno; 
      req.body.role=decoded.role;
      next(); 
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid or expired token." });
    }
  };
  app.post("/checkToken",authMiddleware,async (req,res)=>{
    const{regno,role}=req.body;
    const db=(role==='Student')?"students_info":"staff_info";
    const query = `SELECT * FROM ${db} WHERE regno = $1`; 
    const result = await pool.query(query, [regno]); 
    const user = result.rows[0];
    let data;
    if(role=="Student"){
      data={
        regno: user.regno,
        name: user.name,
        password:user.password,
        email: user.email,
        dept: user.dept,
        tutor_name: user.tutor_name,
        phone_no: user.phone_no,
        year_of_joining: user.year_of_joining,
        role
      }
    }
    else{
      data={
        regno: user.regno,
        name: user.name,
        password:user.password,
        email: user.email,
        dept: user.dept,
        designation:user.designation,
        phone_no: user.phone_no,
        role
        // tutor_ward
      }
    }
    res.json({
      user:data
    })
    
  })


  
// API to insert extracted data row by row
app.post("/upload", async (req, res) => {
  try {
    const students = req.body; // Array of student objects
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const client = await pool.connect();

    for (let student of students) {
      await client.query(
        "INSERT INTO students_info (regno, name,password, email, dept,tutor_name,phone_no,year_of_joining) VALUES ($1, $2, $3, $4,$5,$6,$7,$8)",
        [student.RegNo, student.Name, student.Password,student.Email, student.Department,student.Tutor_name,student.Phone_no,student.year_of_joining]
      );
    }
    client.release();
    res.status(200).json({ message: "Data inserted successfully!" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/getStaffs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM staff_info');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/getCourses', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM course_details');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post('/addCourse', async (req, res) => {
  const { domain, name, iscredit, code, no_of_weeks, st_date, end_date, instructor, success_rate, prev_topper, assignment_drive_link } = req.body;
  try {
    await pool.query(
      'INSERT INTO course_details (domain, name, iscredit, code, no_of_weeks, st_date, end_date, instructor, success_rate, prev_topper, assignment_drive_link) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
      [domain, name.toUpperCase(), iscredit, code, no_of_weeks, st_date, end_date, instructor, success_rate, prev_topper, assignment_drive_link]
    );

    res.status(201).send('Course added successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});


app.put('/editCourse/:code', async (req, res) => {
  const {code}=req.params;
  const {  domain, name, iscredit, no_of_weeks, st_date, end_date, instructor, success_rate, prev_topper, assignment_drive_link } = req.body;
  try {
      const result = await pool.query(
          `UPDATE course_details 
           SET domain = $1, name = $2, iscredit = $3, no_of_weeks = $4, st_date = $5, end_date = $6, 
               instructor = $7, success_rate = $8, prev_topper = $9, assignment_drive_link = $10
           WHERE code = $11`,
          [domain, name, iscredit, no_of_weeks, st_date, end_date, instructor, success_rate, prev_topper, assignment_drive_link, code]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ message: "Course not found" });
      }

      res.json({ message: "Course updated successfully" });
  } catch (err) {
      console.log(err);
      res.status(500).json({ error: err.message });
  }
});

app.delete('/deleteCourse/:code', async (req, res) => {
  const { code } = req.params;
  try {
    await pool.query('DELETE FROM course_details WHERE code = $1', [code]);
    res.send('Course deleted');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});



app.post('/addStaffs', async (req, res) => {
  const { regno, name, email, dept, designation, password } = req.body;
  try {
    await pool.query('INSERT INTO staff_info (regno, name, email, dept, designation, password) VALUES ($1, $2, $3, $4, $5, $6)', [regno, name.toUpperCase(), email, dept, designation, password]);
    res.status(201).send('Staff added');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/editStaffs', async (req, res) => {        
  const { regno,name, email, dept, designation, password } = req.body;
  try {
    await pool.query('UPDATE staff_info SET name = $1, email = $2, dept = $3, designation = $4, password = $5 WHERE regno = $6', [name, email, dept, designation, password, regno]);
    res.send('Staff updated');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/deleteStaffs/:regno', async (req, res) => {
  const { regno } = req.params;
  try {
    await pool.query('DELETE FROM staff_info WHERE regno = $1', [regno]);
    res.send('Staff deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get('/getStudents', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM students_info');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete('/deletStudents/:regno', async (req, res) => {
  const { regno } = req.params;
  try {
    await pool.query('DELETE FROM students_info WHERE regno = $1', [regno]);
    res.send('Student deleted');
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "karuppu10112004@gmail.com",
    pass: "umubokiovafsssbu"
  }
});

app.post("/forgot-password", async (req, res) => {
  const { regno,role } = req.body;
  const tempRole=(role=='Student')?'students_info':'staff_info';
  try {
    const result = await pool.query(`SELECT email, password FROM ${tempRole} WHERE regno = $1`, [regno]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Register number not found" });
    }

    const { email, password } = result.rows[0];

    const mailOptions = {
      from: "karuppu10112004@gmail.com",
      to: email,
      subject: "Password Recovery",
      text: `Hello, your password is: ${password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
        return res.status(500).json({ error: "Failed to send email" });
      } else {
        console.log("Email sent:", info.response);
        return res.json({ message: "Password sent to registered email" });
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});


app.put('/editProfileStudent', async (req, res) => {
  const { regno, password, phone_no,role } = req.body;
  try {
    await pool.query(
      `UPDATE students_info SET password = $1, phone_no = $2 WHERE regno = $3`,
      [password, phone_no, regno]
    );
    res.send('Profile updated successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

app.put('/editProfileStaff', async (req, res) => {
  const { regno, password } = req.body;
  try {
    await pool.query(
      `UPDATE staff_info SET password = $1 WHERE regno = $2`,
      [password, regno]
    );
    res.send('Profile updated successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

//enrolllment

app.post('/fetchEnrollments', async (req, res) => {
  const { register_number } = req.body;
  try {
    const result = await pool.query(
      `SELECT 
        c.code, 
        c.name, 
        c.isCredit, 
        cr.enroll_proof 
      FROM course_registration cr 
      JOIN course_details c ON c.code = cr.course_code 
      WHERE cr.student_regno = $1 
      ORDER BY c.code ASC`,
      [register_number]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving enrollments:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// POST /enrollments - Add a new enrollment
app.post('/enrollments', async (req, res) => {
  const {
    register_number,
    course_code,
    enroll_proof,
  } = req.body;
  try {
    const insertQuery = `
      INSERT INTO course_registration 
      (student_regno, course_code,enroll_proof)
      VALUES ($1, $2,$3)
      RETURNING *
    `;
    const values = [
      register_number,
      course_code,enroll_proof
    ];

    const result = await pool.query(insertQuery, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error inserting enrollment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post("/deleteEnrollment",async(req,res)=>{
  const {regno,code}=req.body;
  try {
    const query = `
      delete from course_registration 
      where student_regno= $1 and course_code=$2`;
    const values = [regno,code];
   await pool.query(query, values);
    res.send("Enrolled Course Deleted");
    console.log("Enrolled Course Deleted");
  } catch (err) {
    console.error('Error deleting enrollment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }

})

// GET /courses - Retrieve all courses
app.get('/getCoursesToEnroll', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM course_details ORDER BY name ASC');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving courses:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an enrollment with edited fields
app.put('/updateEnrollment', async (req, res) => {
  const { enroll_proof, payment_proof, certificate, register_number } = req.body;
  try {
    const updateQuery = `
      UPDATE course_registration 
      SET enroll_proof = $1,
          payment_proof = $2,
          certificate = $3
      WHERE student_regno = $4
      RETURNING *
    `;
    const values = [enroll_proof, payment_proof, certificate, register_number];
    const result = await pool.query(updateQuery, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error updating enrollment:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
//enrollment


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
