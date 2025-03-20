import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ReferenceLine,
} from "recharts";

// Absolute Grading Ranges
const absoluteGradeRanges = [
  { grade: "O", min: 90, max: 100, color: "green" },
  { grade: "A+", min: 80, max: 89, color: "blue" },
  { grade: "A", min: 70, max: 79, color: "orange" },
  { grade: "B+", min: 60, max: 69, color: "purple" },
  { grade: "B", min: 50, max: 59, color: "red" },
];
// Generate Bell Curve Data
const generateBellCurveData = () => {
  const data = [];
  for (let x = 0; x <= 100; x += 2) {
    const y = Math.exp(-Math.pow(x - 50, 2) / (2 * 15 * 15)) * 100; // Gaussian function
    data.push({ x, y });
  }
  return data;
};

// Calculate Mean & Standard Deviation
const calculateStats = (students) => {
  const scores = students.map((s) => s.marks);
  const mean = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
  const stdDev = Math.sqrt(variance);
  return { mean, stdDev };
};

// Generate Relative Grading Ranges
const generateRelativeGrades = (mean, stdDev) => {
  return [
    { grade: "O", min: mean + 1.5 * stdDev, max: 100, color: "green" },
    { grade: "A+", min: mean + 0.5 * stdDev, max: mean + 1.5 * stdDev, color: "blue" },
    { grade: "A", min: mean - 0.5 * stdDev, max: mean + 0.5 * stdDev, color: "orange" },
    { grade: "B+", min: mean - 1.5 * stdDev, max: mean - 0.5 * stdDev, color: "purple" },
    { grade: "B", min: 0, max: mean - 1.5 * stdDev, color: "red" },
  ];
};

const BellCurveChart = ({ students }) => {
  if (!students || students.length === 0) return <p>No student data available.</p>;

  const bellCurveData = generateBellCurveData();
  const studentMarks = students.map((s) => ({ x: s.marks, y: 5 }));

  // Determine Grading Type
  const isAbsoluteGrading = students.length < 25;
  const gradeRanges = isAbsoluteGrading
    ? absoluteGradeRanges
    : generateRelativeGrades(...Object.values(calculateStats(students)));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={bellCurveData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="x" type="number" domain={[0, 100]} tickCount={11} label={{ value: "Marks", position: "insideBottom", dy: 10 }} />
        <YAxis dataKey="y" domain={[0, 100]} tick={false} label={{ value: "Number of Students", angle: -90, position: "insideLeft" }} />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />

        {/* Bell Curve */}
        <Line type="monotone" dataKey="y" stroke="black" strokeWidth={2} dot={false} />

        {/* Student Marks */}
        <Scatter data={studentMarks} fill="red" />

        {/* Grade Cutoff Lines */}
        {gradeRanges.map((grade, index) => (
          <ReferenceLine key={index} x={grade.min} stroke={grade.color} strokeDasharray="5 5" label={grade.grade} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default BellCurveChart;
