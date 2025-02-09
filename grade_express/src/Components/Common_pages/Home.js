import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Carousel, Container, Row, Col } from 'react-bootstrap';
import './Home.css';
import IMG from "./student_jump_img.jpg";
import Header from './Header';

const Home = () => {
  const features = [
    "Keeps track of a student’s completed and ongoing NPTEL courses including CGPA and Non - CGPA courses.",
    "Right from collecting initial course enrollment details till obtaining scores from the certificates is made easier and is done without any delay.",
    "Provided with both relational and absolute grading where the grades are generated course wise within minutes and thus time efficient.",
    "Providing access to the last 2 years assignments of a course for the students to study.",
    "The success rate of a particular course is displayed which is calculated from the previous candidates of that course."
  ];

  return (
    <div className='outer-container'>
      {/* Header Component */}
      <Header />

      {/* Main Section */}
      <div className='main'>
        <div className='heading'>
          <h1>Grade Express</h1>
          <p>A platform that makes grading efficient and effortless!</p>

          {/* Bootstrap Carousel */}
          <Container>
            <Row>
              <Col md={10}>
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

        {/* Image Section */}
        <div className='home-img'>
          <img src={IMG} alt="Student Jumping" />
        </div>
      </div>
    </div>
  );
};

export default Home;
