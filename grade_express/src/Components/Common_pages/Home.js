import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Button, Container, Row, Col } from 'react-bootstrap';
import './Home.css';
import { Link } from 'react-router-dom';
import IMG from "./student_jump_img.jpg"

const Home = () => {
  const features=["Keeps track of a student’s completed and ongoing NPTEL courses including CGPA    and Non - CGPA courses.","Right from collecting initial course enrollment details till obtaining scores from the certificates is made easier and is done without any delay.","Provided with both relational and absolute grading where the grades are generated course wise within minutes and thus time efficient.","Providing access to the last 2 years assignments of a course for the students to study.","The success rate of a particular course is displayed which is calculated from the previous candidates of that course."]
  return (
    <div className='outer-container'>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg shadow py-3">
        <div className="container">
          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav gap-4">
              <Link to="/" className="text-decoration-none"><li className="nav-item">Home</li></Link>
              <Link to="/aboutUs" className="text-decoration-none"><li className="nav-item">About Us</li></Link>
              <Link to="/features" className="text-decoration-none"><li className="nav-item">Features</li></Link>
              <Link to="/contact" className="text-decoration-none"><li className="nav-item">Contact</li></Link>
              <Link to="/login" className="text-decoration-none"><li className="nav-item">Login</li></Link>
            </ul>
          </div>
        </div>
      </nav>
      <div className='main'>
      <div className='heading'>
        <h1 >Grade Express</h1>
        <p >A platform that makes grading efficient and effortless!</p>
      {/* Bootstrap Carousel */}
        <Container>
            <Row>
              <Col md={13}>
                <Carousel className="card">
                  {features.map((feature, index) => (
                    <Carousel.Item key={index}>
                      <div className="carousel-card">
                        <p className="text-dark p-4">{feature}</p>
                      </div>
                    </Carousel.Item>
                  ))}
                </Carousel>
              </Col>
            </Row>
        </Container>
      </div>
        <div className='home-img'>
          <img src={IMG} alt="" />
        </div>
      </div>
        
    </div>
  );
};

export default Home;
