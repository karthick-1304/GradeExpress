import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const marks = [30, 40, 50, 60, 70, 80, 90, 100, 55, 65, 75, 85, 95, 35, 45, 20, 10, 5];

const calculateStats = (data) => {
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const stdDev = Math.sqrt(data.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / data.length);
    return { mean, stdDev };
};

const generateGradeRanges = (mean, stdDev) => {
    return {
        "O": [mean + 1.5 * stdDev, 100],
        "A+": [mean + 0.5 * stdDev, mean + 1.5 * stdDev],
        "A": [mean - 0.5 * stdDev, mean + 0.5 * stdDev],
        "B+": [mean - 1.5 * stdDev, mean - 0.5 * stdDev],
        "B": [0, mean - 1.5 * stdDev]
    };
};

const categorizeStudents = (data, gradeRanges) => {
    const distribution = { "O": 0, "A+": 0, "A": 0, "B+": 0, "B": 0 };
    data.forEach(mark => {
        for (let grade in gradeRanges) {
            if (mark >= gradeRanges[grade][0] && mark <= gradeRanges[grade][1]) {
                distribution[grade]++;
                break;
            }
        }
    });
    return distribution;
};

const DemoGraph = () => {
    const [stats, setStats] = useState({ mean: 0, stdDev: 0 });
    const [gradeRanges, setGradeRanges] = useState({});
    const [distribution, setDistribution] = useState({});

    useEffect(() => {
        const stats = calculateStats(marks);
        const ranges = generateGradeRanges(stats.mean, stats.stdDev);
        const dist = categorizeStudents(marks, ranges);
        setStats(stats);
        setGradeRanges(ranges);
        setDistribution(dist);
    }, []);

    const chartData = {
        labels: Object.keys(distribution),
        datasets: [
            {
                label: "Number of Students",
                data: Object.values(distribution),
                borderColor: "blue",
                backgroundColor: "rgba(0, 0, 255, 0.2)",
                tension: 0.4
            }
        ]
    };

    return (
        <div>
            <h2>Bell Curve - Grade Distribution</h2>
            <p><strong>Mean:</strong> {stats.mean.toFixed(2)}</p>
            <p><strong>Standard Deviation:</strong> {stats.stdDev.toFixed(2)}</p>
            <h3>Grade Ranges</h3>
            <ul>
                {Object.entries(gradeRanges).map(([grade, range]) => (
                    <li key={grade}><strong>{grade}:</strong> {range[0].toFixed(2)} to {range[1].toFixed(2)}</li>
                ))}
            </ul>
            <Line data={chartData} />
        </div>
    );
};

export default DemoGraph;