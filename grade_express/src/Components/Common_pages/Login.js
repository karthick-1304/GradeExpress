import React, { useState } from 'react';
import Header from './Header';
import './Login.css';  
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome
import axios from 'axios';

const Login = () => {
  const [regno, setRegno] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const isDisabled = !regno || !password;
  
  async function handleLogin(){
      const role=!isNaN(regno[0])?"Student":"Staff";
      const extractedData={
        regno,password
      }
      console.log(extractedData);
      try {
        const response = await axios.post("http://localhost:5000/login", extractedData, {
          headers: { "Content-Type": "application/json" },
        });
        console.log(response.data.message);
      } catch (error) {
        console.error("Loginstage:Error fetching data:", error);
      }
  }

  return (
    <div className='outer-container'>
      <Header />
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
            <a href="#" className="text-decoration-none">Forgot Password?</a>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
