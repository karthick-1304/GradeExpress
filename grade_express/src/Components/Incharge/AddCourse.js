import React from 'react'
import { useState } from 'react';
import "./AddCourse.css";
import Table from "react-bootstrap/Table";


const AddCourse = () => {
    const [courses, setCourses] = useState([
        {
          domain: "Computer Science",
          name: "React Development",
          isCredit: true,
          code: "CS101",
          no_of_weeks: 8,
          st_date: "2024-02-10",
          end_date: "2024-04-10",
          instructor: "John Doe",
          success_rate: 85.5,
          prev_topper: "Alice",
          assignment_drive_link: "https://example.com/assignments",
        },
        {
          domain: "Data Science",
          name: "Machine Learning",
          isCredit: false,
          code: "DS202",
          no_of_weeks: 12,
          st_date: "2024-03-01",
          end_date: "2024-05-24",
          instructor: "Jane Smith",
          success_rate: 92.3,
          prev_topper: "Bob",
          assignment_drive_link: "https://example.com/ml-course",
        },
      ]);
    const [formData, setFormData] = useState({
        domain: "",
        name: "",
        isCredit: false,
        code: "",
        no_of_weeks: "",
        st_date: "",
        end_date: "",
        instructor: "",
        success_rate: "",
        prev_topper: "",
        assignment_drive_link: "",
      });
    
      // Handle input change
      const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
          ...formData,
          [name]: type === "checkbox" ? checked : value,
        });
      };
    
      // Handle form submission
      const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form Data Submitted:", formData);
        // You can send formData to an API here
      };
  return (
    <div className='outer-container'>
        <h1 className='course-page-head'>Course List</h1>
        <div>
        <div className='form'>
            <button>Add Course</button>
           {/*  <form onSubmit={handleSubmit}>
                <input type="text" name="domain" placeholder="Domain" value={formData.domain} onChange={handleChange} required />
                <input type="text" name="name" placeholder="Course Name" value={formData.name} onChange={handleChange} required />
                <label>
                <input type="checkbox" name="isCredit" checked={formData.isCredit} onChange={handleChange} />
                Credit Course
                </label>
                <input type="text" name="code" placeholder="Course Code" value={formData.code} onChange={handleChange} required />
                <input type="number" name="no_of_weeks" placeholder="Number of Weeks" value={formData.no_of_weeks} onChange={handleChange} required />
                <input type="date" name="st_date" value={formData.st_date} onChange={handleChange} required />
                <input type="date" name="end_date" value={formData.end_date} onChange={handleChange} required />
                <input type="text" name="instructor" placeholder="Instructor Name" value={formData.instructor} onChange={handleChange} required />
                <input type="number" step="0.01" name="success_rate" placeholder="Success Rate (%)" value={formData.success_rate} onChange={handleChange} required />
                <input type="text" name="prev_topper" placeholder="Previous Topper (Optional)" value={formData.prev_topper} onChange={handleChange} />
                <input type="url" name="assignment_drive_link" placeholder="Assignment Drive Link" value={formData.assignment_drive_link} onChange={handleChange} required />
                <button type="submit">Submit</button>
            </form> */}
        </div>
        <div className="container-fluid ">
        <table className="course-table">
                    <thead>
                        <tr>
                        <th>Course Code</th>
                        <th>Course Name</th>
                        <th>Domain</th>
                        <th>Instructor</th>
                        <th>No of Weeks</th>
                        <th>Success Rate</th>
                        <th>Previous Topper</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Credit Type</th>
                        <th>Assignment URL</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((item, index) => (
                        <tr key={index}>
                            <td>{item.code}</td>
                            <td>{item.name}</td>
                            <td>{item.domain}</td>
                            <td>{item.instructor}</td>
                            <td>{item.no_of_weeks}</td>
                            <td>{item.success_rate}</td>
                            <td>{item.prev_topper}</td>
                            <td>{item.st_date}</td>
                            <td>{item.end_date}</td>
                            <td>{item.isCredit ? "Yes" : "No"}</td>
                            <td><a href={item.drive_link} target="_blank" rel="noopener noreferrer">Drive Link</a></td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
         </div>
         </div>
    </div>
  )
}

export default AddCourse