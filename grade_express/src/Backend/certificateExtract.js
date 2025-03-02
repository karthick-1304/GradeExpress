const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const flaskPort = 8000; 
const app=express();
app.use(cors());

const extract=async (req, res) => {
    try {
        const file = req.file;
        if (!file) 
            return res.status(400).json({ error: "No file uploaded" });
        
        const formData = new FormData();
        formData.append("file", file);
        console.log(file);
        // Send file to Flask API
        const response = await axios.post(`http://localhost:${flaskPort}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        // res.json(response.data);
    } catch (error) {
        console.log(1);
        console.error("Error forwarding request in flask:",error);
        // res.status(500).json({ error: "Internal Server Error" });
    }
}

module.exports={extract}



