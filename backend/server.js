const express = require("express");
const cors = require("cors");

const userHistory = require("./userHistory");

const app = express();
const PORT = 5001;   // 👈 5001 use kar rahe ho, same rakho

// Middleware
app.use(cors());
app.use(express.json());

// Root test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// GET history
app.get("/api/history", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(userHistory, null, 2)); // pretty JSON
});

// POST new activity
app.post("/api/history", (req, res) => {
  const newActivity = req.body;

  if (!newActivity.date || !newActivity.activity) {
    return res.status(400).json({ error: "Invalid data" });
  }

  userHistory.push(newActivity);
  res.status(201).json({
    message: "Activity added successfully",
    data: newActivity
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
