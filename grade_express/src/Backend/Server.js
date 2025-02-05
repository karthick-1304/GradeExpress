require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bodyParser = require("body-parser");

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
  

// API to insert extracted data row by row
app.post("/upload", async (req, res) => {
  try {
    const students = req.body; // Array of student objects
    if (!Array.isArray(students) || students.length === 0) {
      return res.status(400).json({ message: "Invalid data format" });
    }

    const client = await pool.connect();

    for (let student of students) {
        console.log(student);
      /* await client.query(
        "INSERT INTO users_info (regno, name,password,role, email, dept) VALUES ($1, $2, $3, $4,$5,$6)",
        [student.RegNo, student.Name, student.Password,student.Role,student.Email, student.Department]
      ); */
    }

    client.release();
    res.status(200).json({ message: "Data inserted successfully!" });
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
