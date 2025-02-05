import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Header = ({ get }) => {
  return (
    <nav className="navbar navbar-expand-lg shadow py-3">
      <div className="container">
        <h1>Grade Express</h1>
        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav gap-4">
            <Link to="/" className="text-decoration-none"><li className="nav-item">Home</li></Link>
            <Link to="/aboutUs" className="text-decoration-none"><li className="nav-item">About Us</li></Link>
            <Link to="/features" className="text-decoration-none"><li className="nav-item">Features</li></Link>
            <Link to="/contact" className="text-decoration-none"><li className="nav-item">Contact</li></Link>
            <Link to="/login" className="text-decoration-none"><li className="nav-item">Login</li></Link>
            <input type="file" id="file" accept=".xls,.xlsx" />
            <Button onClick={() => get()}>Signup</Button>
          </ul>
        </div>
      </div>  
    </nav>
  );
};

export default Header;
