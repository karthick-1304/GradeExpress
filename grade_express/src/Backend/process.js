const {pool} =require("./dbConnection");
const fetchEnrollments=async (req, res) => {
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
  };

  const enrollCourse=async (req, res) => {
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
  };

  const deleteEnrollment=async(req,res)=>{
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
  };

  const updateEnrollment=async (req, res) => {
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
  };
  module.exports={fetchEnrollments,enrollCourse,deleteEnrollment,updateEnrollment};