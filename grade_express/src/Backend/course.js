const {pool} =require("./dbConnection");
const getCourses=async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM course_details order by name asc');
      res.json(result.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };
  
  const addCourse=async (req, res) => {
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
  };

const editCourse= async (req, res) => {
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
  };

  const deleteCourse=async (req, res) => {
    const { code } = req.params;
    try {
      await pool.query('DELETE FROM course_details WHERE code = $1', [code]);
      res.send('Course deleted');
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  };
  module.exports={getCourses,addCourse,editCourse,deleteCourse};