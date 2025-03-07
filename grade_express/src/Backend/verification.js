const {pool} =require("./dbConnection");
const addVerfication=async(req,res)=>{
    try{
        const{regno,course_code,extracted}=req.body;
        console.log(extracted);
        const query = `
        INSERT INTO verification_details (
            student_regno, course_code, extracted_details
        ) 
        VALUES ($1, $2, $3)
        RETURNING *;`;

        const values = [ regno, course_code, extracted];
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