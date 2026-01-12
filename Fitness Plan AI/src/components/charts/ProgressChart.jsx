import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const ProgressChart = () => {
  const data = [
    { week: "Week 1", progress: 10 },
    { week: "Week 2", progress: 20 },
    { week: "Week 3", progress: 35 },
    { week: "Week 4", progress: 50 }
  ];

  return (
    <div className="card">
      <h3 style={{ marginBottom: "1rem" }}>📈 Fitness Progress</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="week" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="progress"
            stroke="#22c55e"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProgressChart;
