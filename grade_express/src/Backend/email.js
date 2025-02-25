const {pool} =require("./dbConnection");
const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "karuppu10112004@gmail.com",
      pass: "umubokiovafsssbu"
    }
  });

  const forgetPassword= async (req, res) => {
    const { regno,role } = req.body;
    const tempRole=(role=='Student')?'students_info':'staff_info';
    try {
      const result = await pool.query(`SELECT email, password FROM ${tempRole} WHERE regno = $1`, [regno]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: "Register number not found" });
      }
  
      const { email, password } = result.rows[0];
  
      const mailOptions = {
        from: "karuppu10112004@gmail.com",
        to: email,
        subject: "Password Recovery",
        text: `Hello, your password is: ${password}`
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Error sending email:", error);
          return res.status(500).json({ error: "Failed to send email" });
        } else {
          console.log("Email sent:", info.response);
          return res.json({ message: "Password sent to registered email" });
        }
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  module.exports={transporter,forgetPassword}