import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceArea } from "recharts";

const BellCurveChart = ({ students }) => {
  const intervalSize = 10;
  const marksDistribution = Array(11).fill(0); // 0-10, 10-20, ..., 90-100

  students.forEach(({ score }) => {
    const index = Math.min(Math.floor(score / intervalSize), 10);
    marksDistribution[index]++;
  });

  const chartData = marksDistribution.map((count, i) => ({
    marks: i * intervalSize, // Using numbers instead of strings
    students: count,
  }));

  // Grade Segments
  const gradeSegments = [
    { label: "O Grade", start: 90, end: 100, color: "#4CAF50" },  // Green
    { label: "A+ Grade", start: 80, end: 89, color: "#2196F3" },  // Blue
    { label: "A Grade", start: 75, end: 79, color: "#FF9800" },   // Orange
    { label: "B+ Grade", start: 65, end: 74, color: "#FFC107" },  // Yellow
    { label: "B Grade", start: 60, end: 64, color: "#E91E63" },   // Pink
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="marks" label={{ value: "Marks Range", position: "insideBottom", offset: -5 }} />
        <YAxis label={{ value: "No. of Students", angle: -90, position: "insideLeft" }} />
        <Tooltip />

        {/* Color Segments */}
        {gradeSegments.map((grade, index) => (
          <ReferenceArea
            key={index}
            x1={grade.start}
            x2={grade.end}
            stroke={grade.color}
            fill={grade.color}
            fillOpacity={0.2}
          />
        ))}

        <Line type="monotone" dataKey="students" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BellCurveChart;
