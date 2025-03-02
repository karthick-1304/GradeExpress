const {pool} =require("./dbConnection");
const addVerfication=async(req,res)=>{
    try{
        const{regno,course_code,ext_name,ext_course_name,online_assignment_score,proctored_score,consolidated_score,certificate_rollno}=req.body;
        console.log(regno, course_code, ext_name, ext_course_name,
            online_assignment_score, proctored_score, consolidated_score, certificate_rollno);
        const query = `
        INSERT INTO verification_details (
            student_regno, course_code, ext_name, ext_course_name,
            online_assignment_score, proctored_score, consolidated_score, certificate_rollno
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;`;

        const values = [
            regno, course_code, ext_name, ext_course_name,
            online_assignment_score, proctored_score, consolidated_score, certificate_rollno
        ];
        const result = await pool.query(query, values);

        res.status(201).json({
            success: true,
            message: 'Verification details added successfully',
            data: result.rows[0]
        });
    } catch (error) {
        console.error('Error inserting verification details:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add verification details',
            error: error.message
        });

    }
}
module.exports={addVerfication}