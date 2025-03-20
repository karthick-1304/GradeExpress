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
    const { regno, name, email, dept, designation, password,phone_no } = req.body;
    try {
      await pool.query('INSERT INTO staff_info (regno, name, email, dept, designation, password,phone_no) VALUES ($1, $2, $3, $4, $5, $6,$7)', [regno, name.toUpperCase(), email, dept, designation, password,phone_no]);
      res.status(201).send('Staff added');
      console.log("Staff updated");
    } catch (err) {
      res.status(500).send(err.message);
    }
  }

  const editStaff=async (req, res) => {        
    const { regno,name, email, dept, designation, password ,phone_no} = req.body;
    try {
      await pool.query('UPDATE staff_info SET name = $1, email = $2, dept = $3, designation = $4, password = $5, phone_no= $6 WHERE regno = $7', [name, email, dept, designation, password,phone_no, regno]);
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





//List of tutorward students
  const getTutorwardList = async (req, res) => {
    try {
        const {tutorId} =  req.params;
        console.log(tutorId)
        const studentsQuery = await pool.query(
            "SELECT tutor_ward FROM staff_info WHERE regno=$1",
            [tutorId]
        );
        console.log("Tutorward students:", studentsQuery.rows);
        res.json(studentsQuery.rows);
    } catch (err) {
        console.error("Error fetching tutorWardList students:", err);
        res.status(500).json({ message: "Server error" });
    }
    };






  //Getting students who belongsto the particular tutor
  const getTutorwardStudents = async (req, res) => {
    try {
        let { tutorward } = req.query;
        if (!tutorward) {
            return res.json([]);
        }
        if (!Array.isArray(tutorward)) {
            tutorward = tutorward.split(','); 
        }
        const studentResult = await pool.query(
            "SELECT * FROM students_info WHERE regno = ANY($1::text[])",
            [tutorward]
        );
        res.json(studentResult.rows);
    } catch (err) {
        console.error("Error fetching tutor ward students:", err);
        res.status(500).send("Server error");
    }
};

//List of courses details of a student belongs to the particular staff tutorward
const getStudentCourses = async (req, res) => {
  try {
      const { regno } = req.params;

      // Query to get completed courses (grade is NOT NULL)
      const completedCoursesQuery = `
          SELECT cc.course_code, cd.name,cc.score, cc.grade ,cc.certificate
          FROM course_completed cc
          JOIN course_details cd ON cc.course_code = cd.code
          WHERE cc.student_regno = $1;
      `;

      // Query to get ongoing courses (grade is NULL)
      const ongoingCoursesQuery = `
          SELECT cr.course_code, cd.name, cd.credits_count
          FROM course_registration cr
          JOIN course_details cd ON cr.course_code = cd.code
          WHERE cr.student_regno = $1;
      `;

      // Execute queries
      const completedCourses = await pool.query(completedCoursesQuery, [regno]);
      const ongoingCourses = await pool.query(ongoingCoursesQuery, [regno]);

      res.json({
          completed: completedCourses.rows,
          ongoing: ongoingCourses.rows
      });

  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};

//Getting the eligible students for a tutor based on the academic year of the tutor logged in
const getEligibleStudents = async (req, res) => {
try {

    const {tutorYear} =  req.params;
    console.log("Batch Year:", req);

    // Fetch students from that batch without a tutor assigned
    const studentsQuery = await pool.query(
        "SELECT regno, name FROM students_info WHERE year_of_joining = $1 AND tutor_name IS NULL",
        [tutorYear]
    );

    res.json(studentsQuery.rows);
} catch (err) {
    console.error("Error fetching eligible students:", err);
    res.status(500).json({ message: "Server error" });
}
};


//Adding students to the tutorward 
const addStudentsToTutorward = async (req, res) => {
try {
  const tutorId = req.params.tutorId; // ✅ Correct way to get the parameter
    const { regnos ,tutor_name} = req.body; // Expecting an array of regnos
    if (!regnos || regnos.length === 0) {
        return res.status(400).json({ message: "No students selected" });
    }

    // Assign selected students to the tutor
    await pool.query(
      "UPDATE staff_info SET tutor_ward = tutor_ward || $1 WHERE regno = $2",
      [regnos, tutorId]
    );
    await pool.query(
        "UPDATE students_info SET tutor_name = $1 WHERE regno = ANY($2)",
        [tutor_name, regnos]
    );
    res.json({ message: "Students successfully added to Tutorward!" });
} catch (err) {
    console.error("Error adding students to Tutorward:", err);
    res.status(500).json({ message: "Server error" });
}
};

//delete the partcular student from the tutorward
const removeStudentFromTutorward = async (req, res) => {
  try {
    const tutorID = req.params.tutorId;
    const { studentRegNo } = req.body;
    if (!studentRegNo) {
      return res.status(400).json({ message: "Student regno is required" });
    }
    try {

      await pool.query(
        "UPDATE students_info SET tutor_name = NULL WHERE regno = $1",
        [studentRegNo]
      );

      await pool.query(
        "UPDATE staff_info SET tutor_ward = array_remove(tutor_ward, $1) WHERE regno = $2",
        [studentRegNo, tutorID]
      );

      await pool.query("COMMIT"); 
      res.json({ message: "Student successfully removed from Tutorward!" });

    } catch (err) {
      await pool.query("ROLLBACK"); 
      console.error("Transaction error:", err);
      res.status(500).json({ message: "Error removing student" });
    } 

  } catch (err) {
    console.error("Error in removeStudentFromTutorward:", err);
    res.status(500).json({ message: "Server error" });
  }
};
//Verification List of the students of the tutorward
const actionVerification=async (req, res) => {
  const  tutorID = req.params.regno;
  console.log("Processing verification for tutor:", tutorID);

  try {
    // Fetch tutor's assigned students
    const tutorQuery = `
      SELECT tutor_ward FROM staff_info WHERE regno = $1
    `;
    const tutorResult = await pool.query(tutorQuery, [tutorID]);

    if (tutorResult.rows.length === 0) {
      return res.status(404).json({ message: "Tutor not found or has no assigned students." });
    }

    // Extract tutor_ward list (stored as a string "{2212075,2212079,...}")
    let tutorWardList = tutorResult.rows[0].tutor_ward;
    if (!tutorWardList || tutorWardList.length === 0) {
      return res.json([]); // No students assigned
    }

    // Convert "{2212075,2212079}" -> ['2212075', '2212079']
    // Ensure tutorWardList is an array
    if (!Array.isArray(tutorWardList)) {
      tutorWardList = tutorWardList[0]; // Extract first result if it's nested
    }

    if (!tutorWardList || tutorWardList.length === 0) {
      return res.json([]); // No students assigned
    }
    console.log("Tutorward Lisjjt:", tutorWardList);
    // Fetch verification details of these students
    const verificationQuery = `
      SELECT vd.student_regno,s.name,vd.course_code,vd.extracted_details FROM verification_details vd join students_info s on s.regno=vd.student_regno WHERE student_regno = ANY($1)
    `;
    const verificationResult = await pool.query(verificationQuery, [tutorWardList]);

    res.json(verificationResult.rows);

      } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
};
//Getting all the courses of the particular NPTEL season
const getAllCourses=async (req, res) => {
  try {
      const result = await pool.query("SELECT * FROM course_details");
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};
//Getting the courses based on the search query name or code
const getCoursesSearch=async (req, res) => {
  try {
      const { query } = req.query;
      const result = await pool.query(
          "SELECT * FROM course_details WHERE name ILIKE $1 OR code ILIKE $1", 
          [`%${query}%`]
      );
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};
//Getting the courses based on the department
const getCoursesFilter = async (req, res) => {
  try {
      const { dept } = req.params;
      const result = await pool.query(
          "SELECT * FROM course_details WHERE $1 = ANY(depts_enroll)", 
          [dept]
      );
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};
//Getting the students of a particular course
const getCourseStudents= async (req, res) => {
  try {
      const { code } = req.params;
      const result = await pool.query(
          "SELECT cr.student_regno, cr.score ,cr.grade ,s.regno,s.name FROM course_registration cr join students_info s on cr.student_regno=s.regno WHERE course_code = $1", 
          [code]
      );
      res.json(result.rows);
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};
//Adding the grade of a student in a course
const addGrade = async (req, res) => {
  try {
      const { code } = req.params;
      console.log("Processing grading for course:", code);

      // Fetch students' scores
      const students = await pool.query(
          "SELECT student_regno, score FROM course_registration WHERE course_code = $1",
          [code]
      );

      // Convert scores to numbers
      const scores = students.rows.map(s => s.score !== null ? parseInteger(s.score) : null);
      console.log("Scores:", scores);

      // Ensure all students have marks
      if (scores.includes(null)) {
          return res.status(400).json({ message: "All students must have marks before grading." });
      }

      const totalStudents = scores.length;
      let grades = {};

      if (totalStudents < 25) {
          // **ABSOLUTE GRADING**
          const maxScore = Math.max(...scores);
          const minPassingScore = 50;
          let k = (maxScore - minPassingScore) / 5;
          if (k < 7) k = 7; // If k is less than 7, set k to 7 as per rule

          scores.forEach(score => {
              if (score >= maxScore - 0 * k) grades[score] = 'O';
              else if (score >= maxScore - 1 * k) grades[score] = 'A+';
              else if (score >= maxScore - 2 * k) grades[score] = 'A';
              else if (score >= maxScore - 3 * k) grades[score] = 'B+';
              else if (score >= maxScore - 4 * k) grades[score] = 'B';
              else grades[score] = 'B';
          });

      } else {
          // **RELATIVE GRADING**
          const mean = scores.reduce((sum, val) => sum + val, 0) / totalStudents;
          const stdDev = Math.sqrt(scores.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / totalStudents);

          console.log("Mean:", mean, "Standard Deviation:", stdDev);

          scores.forEach(score => {
              if (score < mean - 1.8 * stdDev || score < 50) {
                  grades[score] = 'B';
              } else if (score >= mean + 1.65 * stdDev) {
                  grades[score] = 'O';
              } else if (score >= mean + 0.85 * stdDev) {
                  grades[score] = 'A+';
              } else if (score >= mean) {
                  grades[score] = 'A';
              } else if (score >= mean - 0.9 * stdDev) {
                  grades[score] = 'B+';
              }
          });
      }

      // Update grades in the database
      await Promise.all(students.rows.map(student => {
          const numericScore = parseFloat(student.score);
          return pool.query(
              "UPDATE course_registration SET grade = $1 WHERE student_regno = $2 AND course_code = $3",
              [grades[numericScore], student.student_regno, code]
          );
      }));

      res.json({ message: "Grading applied successfully." });
  } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
  }
};
  module.exports={getStaff,addStaff,editStaff,deleteStaff,editProfileStaff,getTutorwardStudents,removeStudentFromTutorward,actionVerification,getAllCourses,getCoursesSearch,getCoursesFilter,getCourseStudents,addGrade,getStudentCourses,getEligibleStudents,addStudentsToTutorward,getTutorwardList };