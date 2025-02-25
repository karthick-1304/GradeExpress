const {pool} =require("./dbConnection");
const uploadStudent=async (req, res) => {
    console.log(1);
    try {
      const students = req.body; 
      if (!Array.isArray(students) || students.length === 0) {
        return res.status(400).json({ message: "Invalid data format" });
      }
      const client = await pool.connect();
      console.log(students);
      return;
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
  };


module.exports={uploadStudent};
  