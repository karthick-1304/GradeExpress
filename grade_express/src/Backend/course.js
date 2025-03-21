const {pool} =require("./dbConnection");
const getCourses=async (req, res) => {
      const{dept}=req.params;
      console.log(dept);

      try {
        let query = 'SELECT * FROM course_details';
        let params = [];
      
        if (dept !== 'all') {
          query += ' WHERE domain = $1';
          params.push(dept);
        }
        query += ' ORDER BY name ASC';
        const result = await pool.query(query, params);
        res.json(result.rows);
      } catch (err) {
        res.status(500).send(err.message);
      }
  };
  const getAllotedCourses=async (req, res) => {
    const{dept}=req.params;
    console.log(dept);

    try {
      let query = 'SELECT * FROM course_details WHERE $1 = ANY(depts_enroll) ORDER BY name ASC';
      const result = await pool.query(query, [dept]);
      res.json(result.rows);
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
};
  
  const addCourse=async (req, res) => {
    const { domain, name, credits_count, code, no_of_weeks, st_date, end_date, instructor, success_rate, assignment_drive_link } = req.body;
    console.log(domain);
    const iscredit=credits_count>0?"Yes":"No";
    try {
      await pool.query(
        'INSERT INTO course_details (domain, name, iscredit, code, no_of_weeks, st_date, end_date, instructor, success_rate,assignment_drive_link,depts_enroll,credits_count) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,$11,$12)',
        [domain, name, iscredit, code, no_of_weeks, st_date, end_date, instructor, success_rate, assignment_drive_link,{},credits_count]
      );
  
      res.status(201).send('Course added successfully');
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  };

const editCourse= async (req, res) => {
    const {code}=req.params;
    const {  domain, name, credits_count, no_of_weeks, st_date, end_date, instructor, success_rate,  assignment_drive_link } = req.body;
    console.log(domain);
    const iscredit=credits_count>0?"Yes":"No";
    try {
        const result = await pool.query(
            `UPDATE course_details 
             SET domain = $1, name = $2, iscredit = $3, no_of_weeks = $4, st_date = $5, end_date = $6, 
                 instructor = $7, success_rate = $8, assignment_drive_link = $9 , credits_count= $10
             WHERE code = $11`,
            [domain, name, iscredit, no_of_weeks, st_date, end_date, instructor, success_rate,assignment_drive_link,credits_count, code]
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

  const registerCourse=async(req,res)=>{
    const { code } = req.params;
    const { dept,action } = req.body; 
    console.log("recived");

    try {
      if(action=='Register'){
          await pool.query(
              `UPDATE course_details 
              SET depts_enroll = array_append(depts_enroll, $1) 
              WHERE code = $2`,
              [dept, code]
          );
          console.log("registered");
          res.status(200).json({ message: "Department register successfully" });
      }
      else{
        const result = await pool.query(
          `UPDATE course_details 
           SET depts_enroll = array_remove(depts_enroll, $1) 
           WHERE code = $2 
           RETURNING *`,
          [dept, code]
      );
      console.log("unregistered");
      res.status(200).json({ message: "Department unregister successfully" });
    }
       
    } catch (error) {
        console.error("Error updating course:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
  }
  module.exports={getCourses,addCourse,editCourse,deleteCourse,registerCourse,getAllotedCourses};