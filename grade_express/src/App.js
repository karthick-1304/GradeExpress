import 'bootstrap/dist/css/bootstrap.min.css';
import Home from "./Components/Common_pages/Home.js";
import {Routes,Route, useNavigate} from "react-router-dom"
import { useState,useEffect } from 'react';
import StudentHomePage from './Components/Student/StudentHomePage.js';
import AboutUs from './Components/Common_pages/AboutUs.js';
import Contact from './Components/Common_pages/Contact.js';
import Features from './Components/Common_pages/Features.js';
import axios from 'axios';
import * as XLSX from "xlsx";
import Login from './Components/Common_pages/Login.js';
import Header from './Components/Common_pages/Header.js';
import { Toaster, toast } from "react-hot-toast";
import InchargeHomePage from './Components/Incharge/InchargeHomePage.js';
import AddCourse from './Components/Incharge/AddCourse.js';
import AdminPage from './Components/Admin/AdminPage.js';
import Enroll from './Components/Student/EnrollPage.js';
import { Navigate } from 'react-router-dom';
import Verify from './Components/Incharge/Verify.js';
import DisplayCourse_info from './Components/Student/DisplayCourse_info.js';
import OdList from './Components/Incharge/OdList.js';

import StudentCourses from "./Components/Incharge/StudentCourses.js";
import AddStudents from './Components/Incharge/AddStudents.js';
import CourseList from './Components/Incharge/CourseList.js';
import CourseDetails from './Components/Incharge/CourseDetails.js';
import DemoGraph from './Components/Incharge/DemoGraph.js';
import HandleIndVerify from './Components/Incharge/HandleIndVerify.js';
function App() {
   const [user,setUser]=useState({});
   const navigae=useNavigate();
  async function get() {
    const fileInput = document.querySelector("#file");
    const file = fileInput.files[0];
  
    if (!file) {
      alert("Please select a spreadsheet file!");
      return;
    }
  
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      const binaryStr = e.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
  
      const sheetName = workbook.SheetNames[0]; // First sheet
      const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 });
  
      if (sheetData.length === 0) return;
  
      const headers = sheetData[0]; // First row as headers
      const requiredIndexes = {
        RegNo: headers.indexOf("RegNo"),
        Name: headers.indexOf("Name"),
        Email: headers.indexOf("Email"),
        Department: headers.indexOf("Department"),
        Tutor_name:headers.indexOf("Tutor_name"),
        Phone_no:headers.indexOf("Phone_number")
      };
  
      if (Object.values(requiredIndexes).includes(-1)) {
        console.error("Missing required columns");
        return;
      }
  
      const extractedData = sheetData.slice(1).map((row) => ({
        RegNo: row[requiredIndexes.RegNo],
        Name: row[requiredIndexes.Name],
        Password:"123",
        Email: row[requiredIndexes.Email],
        Department: row[requiredIndexes.Department],
        Tutor_name:row[requiredIndexes.Tutor_name],
        Phone_no:row[requiredIndexes.Phone_no],
        year_of_joining:2022
      }));
  
      console.log("Extracted Data:", extractedData);
      try {
        const response = await axios.post("http://localhost:5000/upload", extractedData, {
          headers: { "Content-Type": "application/json" },
        });
  
        console.log(response.data.message);
      } catch (error) {
        console.error("Error uploading data:", error);
      }
    };
  
    reader.readAsBinaryString(file);
  }

  useEffect(() => {
    const checkToken = async () => {
      const token = localStorage.getItem("token");
      console.log(token);
      if (token) {
        try {
          const response = await axios.post("http://localhost:5000/checkToken", { token });
          setUser(response.data.user);
          console.log(response.data.user.role);
            navigae(`/${response.data.user.role}HomePage`);
        } catch (error) {
          navigae("/login");
          console.error("Error verifying token:", error);
        }
      }
      
    };

    checkToken();
  }, []);

  
  function logout() {
    localStorage.removeItem("token");
    navigae("/");
}

  
   return (
    <div className="App">
     <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path='/aboutUs' element={<AboutUs/>}></Route>
        <Route path='/contact' element={<Contact/>}></Route>
        <Route path='/login' element={<Login user={user} setUser={setUser}/>}></Route>
        <Route path='/features' element={<Features/>}></Route>
        <Route path='/header' element={<Header/>}></Route>
        <Route path='/StudentHomePage' element={<StudentHomePage user={user} setUser={setUser} logout={logout}/>}></Route>
        <Route path='/StaffHomePage' element={<InchargeHomePage user={user} setUser={setUser} logout={logout}/>}></Route>
        <Route path='/addCourse' element={<AddCourse user={user} setUser={setUser} logout={logout}/>}></Route>
        <Route path='/AdminHomePage' element={<AdminPage get={get} logout={logout}/>}></Route>
        <Route path='/enroll' element={<Enroll user={user} setUser={setUser}/>}></Route>
        <Route path='/verifyCertificate' element={<Verify user={user} setUser={setUser}logout={logout}/>}></Route>
        <Route path='/course-details' element={<DisplayCourse_info/>}></Route>
        <Route path='/od-report' element={<OdList  user={user} setUser={setUser}logout={logout}/>}></Route>

        <Route path="/add-students" element={<AddStudents user={user} />} />
        <Route path="/courses" element={<CourseList logout={logout} />} />
        <Route path="/course/:courseCode" element={<CourseDetails logout={logout}/>} />
        <Route path="/student/:regno/courses" element={<StudentCourses />} />
        <Route path="/handleIndVerify" element={<HandleIndVerify user={user} setUser={setUser}logout={logout}/>} />

    
        <Route path="/graph" element={<DemoGraph />} />
     </Routes>
     <Toaster/>
    </div>
  );
}

export default App;
