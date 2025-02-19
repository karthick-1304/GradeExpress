import React, { useEffect, useState } from 'react';
import Header from './Header';
import './Login.css';  
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Toaster, toast } from "react-hot-toast";
import ROBO from "../../Asserts/robo.jpg"


const Login = ({user,setUser}) => {
  const navigae=useNavigate();
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(""); 
  const [showPassword, setShowPassword] = useState(false);
  const isDisabled = !regno || !password || !role;
 
  useEffect(()=>{
    console.log(1);
  },[navigae])
  
  async function handleLogin(){
      const extractedData={
        regno,password,role
      }
      
      try {
        if(role=='Admin'){
          if(regno==='admin@nec'&&password=='123')
              navigae("/adminHomePage");
          else  
          throw new Error("Invalid admin credentials");
        }
        else{
          const response = await axios.post("http://localhost:5000/login", extractedData, {
            headers: { "Content-Type": "application/json" },
          });
          console.log(response.data);
          if(role=='Student')
              navigae("/studentHomePage");  
          else if(role=='Staff')
            navigae("/staffHomePage");
          
          setUser({ ...response.data.user, role:role });
        }
        toast.success("Login successfully!", {
          position: "top-center",
          duration: 5000,
        });
        
        
      } catch (error) {
        toast.error("Invalid Credential", {
          position: "top-center",
          duration: 5000,
          toastClassName: "toast",
      });
      
        console.error("Loginstage:Error fetching data:", error);
      }
  }
  const messages = [
    "Hey, It's a nice application",
    "It has so many features",
    "We can effectivey select courses based on success rate",
    "There is no grading delay "
  ];
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);
  function openForgerPassWord(){
    if(!regno||!role){
      toast.error("Enter Register Number", {
        position: "top-center",
        duration: 5000,
        toastClassName: "toast",
     });
    }
    else{
      axios.post("http://localhost:5000/forgot-password", { regno,role })
      .then((response) => {
        toast.success("Password sent to email", {
          position: "top-center",
          duration: 5000,
          toastClassName: "toast",
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.error || "Something went wrong!", {
          position: "top-center",
          duration: 5000,
          toastClassName: "toast",
        });
      });
    }


  }

  return (
    <div className='outer-container'>
      <Header />
      <div className='login-page-outer'>
      <div className='logo-container'>
        <img src={ROBO} alt="" />
          </div>
        <div className="login-container">
          <div className="login-card">  
            <h3 className="login-h3 text-center mb-4">Login</h3>
            
            {/* Registration Number Input */}
            <div className="mb-3">
              <label className="form-label">Registration Number</label>
              <input 
                type="text" 
                className="login-form-control" 
                placeholder="Enter Reg No"
                value={regno} 
                onChange={(e) => setRegno(e.target.value.trim())} 
              />
            </div>

            {/* Password Input */}
            <div className="mb-3 position-relative">
              <label className="form-label">Password</label>
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="login-form-control" 
                placeholder="Enter Password"
                value={password} 
                onChange={(e) => setPassword(e.target.value.trim())} 
              />
              <i 
                className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'} login-eye-icon`} 
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '20px', top: '50px', cursor: 'pointer' }}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Select Your Role</label>
              <select name="role" className='login-form-control'  onChange={(e)=>setRole(e.target.value.trim())}>
                <option value="" selected hidden>-- Select--</option>
                <option value="Student">Student</option>
                <option value="Staff">Staff</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            {/* Login Button */}
            <button 
              className="btn btn-primary btn-lg w-100" 
              disabled={isDisabled}
              onClick={()=>handleLogin()}
            >
              Login
            </button>

            {/* Forgot Password */}
            <div className="login-text-center mt-3 d-flex justify-content-center">
              <a href="#"  onClick={()=>openForgerPassWord()} className="text-decoration-none">Forgot Password?</a>
            </div>
            <h6 style={{textAlign:"center",paddingTop:"10px"}}>If it is your first login default password is: 123</h6>
          </div>
            <div className="text-container">
                <div key={index} className="text-box">
                  {messages[index]}
                </div>
            </div>
            <div className='round1'></div>
            <div className='round2'></div>
          </div>
        </div>
    </div>
  );
};

export default Login;
