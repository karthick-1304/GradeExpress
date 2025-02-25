const {pool} =require("./dbConnection");
const getStaff=async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM staff_info');
      res.json(result.rows);
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  const addStaff=async (req, res) => {
    const { regno, name, email, dept, designation, password } = req.body;
    try {
      await pool.query('INSERT INTO staff_info (regno, name, email, dept, designation, password) VALUES ($1, $2, $3, $4, $5, $6)', [regno, name.toUpperCase(), email, dept, designation, password]);
      res.status(201).send('Staff added');
      console.log("Staff updated");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  const editStaff=async (req, res) => {        
    const { regno,name, email, dept, designation, password } = req.body;
    try {
      await pool.query('UPDATE staff_info SET name = $1, email = $2, dept = $3, designation = $4, password = $5 WHERE regno = $6', [name, email, dept, designation, password, regno]);
      res.send('Staff updated');
      console.log("Staff updated");
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  const deleteStaff=async (req, res) => {
    const { regno } = req.params;
    try {
      await pool.query('DELETE FROM staff_info WHERE regno = $1', [regno]);
      res.send('Staff deleted');
      console.log("Staff deleted")
    } catch (err) {
      res.status(500).send(err.message);
    }
  };

  const editProfileStaff= async (req, res) => {
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
  };
  module.exports={getStaff,addStaff,editStaff,deleteStaff,editProfileStaff};