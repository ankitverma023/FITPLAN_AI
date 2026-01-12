import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const CaloriesChart = ({ calories }) => {
  const data = [
    {
      name: "Daily Calories",
      calories: calories
    }
  ];

  return (
    <div className="card">
      <h3>🔥 Calories Overview</h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="calories" fill="#f97316" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CaloriesChart;