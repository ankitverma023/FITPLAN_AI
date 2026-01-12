import React from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer
} from "recharts";

// 🔥 BMI Color Logic
const getBmiColor = (bmi) => {
  if (bmi < 18.5) return "#3b82f6";   // Blue
  if (bmi < 25) return "#22c55e";     // Green
  if (bmi < 30) return "#f59e0b";     // Orange
  return "#ef4444";                  // Red
};

// 🔥 BMI Label Logic
const getBmiLabel = (bmi) => {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25) return "Normal";
  if (bmi < 30) return "Overweight";
  return "Obese";
};

const BMIChart = ({ bmi }) => {
  const bmiColor = getBmiColor(bmi);
  const bmiLabel = getBmiLabel(bmi);

  const data = [
    {
      name: "BMI",
      value: bmi,
      fill: bmiColor
    }
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: "0.5rem" }}>📊 BMI Indicator</h3>

      {/* 🔥 BMI TEXT + LABEL */}
      <div style={{ textAlign: "center", marginBottom: "10px" }}>
        <h2 style={{ margin: 0 }}>{bmi}</h2>
        <span style={{ color: bmiColor, fontWeight: "bold" }}>
          {bmiLabel}
        </span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={10}
            background
          />
          <Legend />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BMIChart;