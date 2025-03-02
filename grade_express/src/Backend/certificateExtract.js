const express = require("express");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const { spawn } = require("child_process");
const flaskPort = 5000; 
const app=express();
app.use(cors());

const upload = multer({ dest: "uploads/" });
const extract=async (req, res) => {
    try{
    const flaskProcess = spawn("python", ["app.py"]);
    flaskProcess.stdout.on("data", (data) => {
    console.log(`Flask: ${data}`);
    flaskProcess.stderr.on("data", (data) => {
    console.error(`Flask Error: ${data}`);});});
    }
    catch(err){
        console.error(err);
    }
    try {
        const file = req.file;
        if (!file) 
            return res.status(400).json({ error: "No file uploaded" });
        
        const formData = new FormData();
        formData.append("file", file);
        console.log(formData);
        // Send file to Flask API
        return;
        const response = await axios.post(`http://localhost:${flaskPort}/upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        res.json(response.data);
    } catch (error) {
        console.error("Error forwarding request:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
    process.on("exit", () => {
        flaskProcess.kill(); 
    });
}

module.exports={extract}



