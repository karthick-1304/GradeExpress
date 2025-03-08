const ExcelJS = require("exceljs");
const {pool} =require("./dbConnection");
const fs = require("fs");
const path = require("path");

// Fetch all course registration details based on staff department
const getCourseRegistrations = async (req, res) => {
    try {
        const { dept } = req.params;
        const { exam_date } = req.query; // Get selected date from query parameters

        let query = `
            SELECT student_regno, course_code, c.name, exam_venue,  TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date, exam_time 
            FROM course_registration  
            JOIN students_info s ON student_regno = s.regno 
            JOIN course_details c ON c.code = course_code
            WHERE s.dept = $1
        `;
        let values = [dept];

        if (exam_date) {
            query += " AND exam_date = $" + (values.length + 1); // Dynamically adjust index
            values.push(exam_date);
        }

        query += " ORDER BY student_regno"; 

        const result = await pool.query(query, values);
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
            `SELECT DISTINCT TO_CHAR(exam_date, 'YYYY-MM-DD') AS exam_date FROM course_registration join students_info s on student_regno=s.regno where s.dept= $1`,
            [dept]
        );
        res.json(
            (result.rows || []).map(row => row.exam_date )
          );
    } catch (err) {
        console.error("Error fetching unique exam dates:", err);
        res.status(500).json({ error: err.message });
    }
};

// Generate a PDF for students with a selected exam date
const generateStudentExcel = async (req, res) => {
    const { dept, exam_date } = req.params;

    try {
        let query = `SELECT student_regno, course_code, c.name, exam_venue, exam_date, exam_time 
            FROM course_registration  
            JOIN students_info s ON student_regno = s.regno 
            JOIN course_details c ON c.code = course_code
            WHERE s.dept = $1`;
        let params = [dept];

        if (exam_date !== "All") {
            query += ` AND exam_date = $2`;
            params.push(exam_date);
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "No students found" });
        }

        // Create an Excel workbook and sheet
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Student Exam List");

        // Define columns
        worksheet.columns = [
            { header: "Register Number", key: "student_regno", width: 15 },
            { header: "Course Code", key: "course_code", width: 15 },
            { header: "Course Name", key: "name", width: 30 },
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
            `attachment; filename=Exam_List_${exam_date}.xlsx`
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

module.exports = { getCourseRegistrations, getUniqueExamDates, generateStudentExcel };
