const {pool} =require("./dbConnection");
const getStudents=async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM students_info');
      res.json(result.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

const deleteStudent=async (req, res) => {
  const { regno } = req.params;
  try {
    await pool.query('DELETE FROM students_info WHERE regno = $1', [regno]);
    res.send('Student deleted');
    console.log("Student deleted");
  } catch (err) {
    res.status(500).send(err.message);
  }
}

const editStudent= async (req, res) => {
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
  };
module.exports={getStudents,deleteStudent,editStudent};