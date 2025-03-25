
const { pool } = require("./dbConnection");
const ExcelJS = require("exceljs");
const fs = require("fs");
const { get } = require("https");
const path = require("path");

// Fetch all course registration details based on staff department
const getCourseRegistrations = async (req, res) => {
    try {
      const { dept } = req.params;
      let { exam_date, exam_time, year_of_joining } = req.query;
      
      console.log(exam_date,exam_time,year_of_joining);
      // If "All" is selected in frontend, we treat it like no filter applied.
      if (exam_date === "All" || !exam_date) exam_date = null;
      if (exam_time === "All" || !exam_time) exam_time = null;
      if (year_of_joining === "All" || !year_of_joining) year_of_joining = null;
  
      let query = `
        SELECT 
    cr.student_regno, 
    cr.course_code, 
    cd.name AS course_name, 
    cr.exam_venue, 
    cr.exam_date::TEXT, 
    cr.exam_time 
FROM 
    course_registration cr
INNER JOIN 
    students_info s ON cr.student_regno = s.regno
INNER JOIN 
    course_details cd ON cr.course_code = cd.code
WHERE 
    s.dept = $1`;
  
      const values = [dept]; // start with department
      let count = 2; // placeholder index (starts from $2)
      
      // Dynamically add WHERE conditions
      if (exam_date) {
        query += ` AND cr.exam_date = $${count}`;
        values.push(exam_date);
        count++;
      }
  
       if (exam_time) {
        query += ` AND cr.exam_time = $${count}`;
        values.push(exam_time);
        count++;
      }
   
    if (year_of_joining) {
        query += ` AND s.year_of_joining = $${count}`;
        values.push(year_of_joining);
        count++;
      }
      console.log(exam_date,exam_time);
      query += ` ORDER BY cr.student_regno`;
      const result = await pool.query(query, values);
      console.log(query,result.rows);
      res.json(result.rows);
    } catch (err) {
      console.error("Error fetching course registrations:", err);
      res.status(500).json({ error: err.message });
    }
  };  

// Fetch unique exam dates based on department
const getUniqueExamDates = async (req, res) => {
    try {
        const { dept } = req.params;
        const result = await pool.query(
            `SELECT DISTINCT cr.exam_date::TEXT FROM 
          course_registration cr
        INNER JOIN 
          students_info s 
        ON 
          cr.student_regno = s.regno
        WHERE 
          s.dept = $1`,
            [dept]
        );
        res.json(result.rows.map(row => row.exam_date));
    } catch (err) {
        console.error("Error fetching unique exam dates:", err);
        res.status(500).json({ error: err.message });
    }
};

// Generate a PDF for students with a selected exam date
const generateStudentExcel = async (req, res) => {
    const { dept } = req.params;
    const { exam_date, exam_time, year_of_joining } = req.query;

    try {
        let query = `
            SELECT cr.student_regno, cr.course_code, cr.course_name, cr.exam_venue, cr.exam_date, cr.exam_time
            FROM course_registration cr
            INNER JOIN students_info s ON cr.student_regno = s.regno
            WHERE s.dept = $1
        `;

        let params = [dept];
        let paramIndex = 2; // Start from $2 since $1 is used for department

        if (exam_date && exam_date !== "All") {
            query += ` AND cr.exam_date = $${paramIndex}`;
            params.push(exam_date);
            paramIndex++;
        }

        if (exam_time && exam_time !== "All") {
            query += ` AND cr.exam_time = $${paramIndex}`;
            params.push(exam_time);
            paramIndex++;
        }

        if (year_of_joining && year_of_joining !== "All") {
            query += ` AND s.year_of_joining = $${paramIndex}`;
            params.push(year_of_joining);
            paramIndex++;
        }

        query += ` ORDER BY cr.student_regno`; // Optional ordering

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No students found" });
        }

        // Create Excel workbook and sheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Student Exam List");

        // Define columns
        worksheet.columns = [
            { header: "Register Number", key: "student_regno", width: 15 },
            { header: "Course Code", key: "course_code", width: 15 },
            { header: "Course Name", key: "course_name", width: 30 },
            { header: "Exam Venue", key: "exam_venue", width: 20 },
            { header: "Exam Date", key: "exam_date", width: 15 },
            { header: "Exam Time", key: "exam_time", width: 15 },
        ];

        // Add data rows
        result.rows.forEach((student) => {
            worksheet.addRow(student);
        });

        // Set response headers
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=Exam_List_${dept}_${exam_date || "All"}.xlsx`
        );
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );

        // Write to response
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        console.error("Error generating Excel:", err);
        res.status(500).json({ error: "Failed to generate Excel" });
    }
};

const getUniqueYearsOfJoining = async (req, res) => {
    try {
      const { dept } = req.params;
  
      const query = `
        SELECT DISTINCT year_of_joining 
        FROM students_info 
        WHERE dept = $1
        ORDER BY year_of_joining DESC
      `;
      const values = [dept];
  
      const result = await pool.query(query, values);
      const years = result.rows.map(row => row.year_of_joining);
  
      res.json(years);
    } catch (err) {
      console.error("Error fetching years of joining:", err);
      res.status(500).json({ error: err.message });
    }
  };
    
  const getUniqueExamTimes = async (req, res) => {
    try {
      const { dept } = req.params;
  
      const query = `
        SELECT DISTINCT cr.exam_time 
        FROM 
          course_registration cr
        INNER JOIN 
          students_info s 
        ON 
          cr.student_regno = s.regno
        WHERE 
          s.dept = $1
        ORDER BY cr.exam_time
      `;
      const values = [dept];
  
      const result = await pool.query(query, values);
      const examTimes = result.rows.map(row => row.exam_time);
  
      res.json(examTimes);
    } catch (err) {
      console.error("Error fetching exam times:", err);
      res.status(500).json({ error: err.message });
    }
  };  

module.exports = { getCourseRegistrations, getUniqueExamDates, generateStudentExcel, getUniqueYearsOfJoining, getUniqueExamTimes };