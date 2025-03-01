const { Pool } = require("pg");
const pool= new Pool({
  host: 'localhost', 
  port: 5432, 
  user: 'postgres', // Replace with your PostgreSQL username
  password: '2004', // Replace with your PostgreSQL password
  database: 'gradeExpress', // Replace with your PostgreSQL database name
});

const jwt = require("jsonwebtoken");
const login=async (req, res) => {
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
  };

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

  const checkToken=async (req,res)=>{
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
    
  };


module.exports={pool,login,authMiddleware,checkToken};



