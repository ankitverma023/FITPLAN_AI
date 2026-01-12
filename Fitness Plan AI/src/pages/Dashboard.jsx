import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { generatePlan } from "../utils/planEngine";

import CaloriesChart from "../components/charts/CaloriesChart";
import BMIChart from "../components/charts/BMIChart";
import ProgressChart from "../components/charts/ProgressChart";

import { getAIPlan } from "../services/geminiApi";
import { predictCalories } from "../services/mlApi";

const Dashboard = () => {
  const { user, fitnessData } = useUser();

  /* ================= STATES ================= */
  const [aiTextPlan, setAiTextPlan] = useState("AI plan will appear here.");
  const [loadingAI, setLoadingAI] = useState(false);
  const [mlCalories, setMlCalories] = useState(null);

  /* ================= ML CALORIES ================= */
  useEffect(() => {
    if (!user) return;

    const fetchMLCalories = async () => {
      try {
        const calories = await predictCalories({
          age: Number(user.age || 22),
          gender: user.sex === "male" ? 1 : 0,
          height_cm: Number(user.height || 170),
          weight_kg: Number(user.weight || 65),
          activity_level: 2,
          goal: 1
        });
        setMlCalories(calories);
      } catch {
        setMlCalories(null);
      }
    };

    fetchMLCalories();
  }, [user]);

  /* ================= GEMINI AI ================= */
  useEffect(() => {
    if (!user || !fitnessData) return;

    const fetchAIPlan = async () => {
      try {
        setLoadingAI(true);
        const result = await getAIPlan({
          calories: mlCalories ?? fitnessData.targetCalories,
          goal: user.fitnessGoal,
          bmi: fitnessData.bmi,
          fitnessLevel: user.fitnessLevel
        });
        setAiTextPlan(result || "AI plan will appear here.");
      } catch {
        setAiTextPlan("AI plan unavailable right now.");
      } finally {
        setLoadingAI(false);
      }
    };

    fetchAIPlan();
  }, [user, fitnessData, mlCalories]);

  /* ================= SAFETY ================= */
  if (!user || !fitnessData) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}>
        <h2>Loading dashboard...</h2>
      </div>
    );
  }

  /* ================= RULE BASED PLAN ================= */
  const aiPlan = generatePlan({
    calories: mlCalories ?? fitnessData.targetCalories,
    goal: user.fitnessGoal,
    fitnessLevel: user.fitnessLevel,
    healthProblems: user.healthProblems || []
  });

  const currentWeek = 1;
  const currentDay = new Date().getDay() || 7;

  const todaysWorkout =
    fitnessData.workoutPlan?.[`week${currentWeek}`]?.[`day${currentDay}`] || {
      title: "Rest Day"
    };

  const todaysDiet =
    fitnessData.dietPlan?.[`week${currentWeek}`]?.[`day${currentDay}`] || {
      meals: {
        breakfast: { name: "Healthy Breakfast" },
        lunch: { name: "Nutritious Lunch" },
        dinner: { name: "Balanced Dinner" }
      }
    };

  const getBMIPosition = (bmi) => {
    const v = parseFloat(bmi);
    if (v <= 15) return 0;
    if (v >= 40) return 100;
    return ((v - 15) / 25) * 100;
  };

  /* ================= UI ================= */
  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb" }}>

      {/* HEADER */}
      <header style={{
        background: "linear-gradient(135deg, #22c55e, #f97316)",
        color: "white",
        padding: "2rem 0"
      }}>
        <div className="container" style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h1>Welcome back 👋</h1>
            <p>Your AI-powered fitness dashboard</p>
          </div>
          <Link to="/profile" className="btn" style={{ background: "rgba(255,255,255,0.2)", color: "white" }}>
            Profile
          </Link>
        </div>
      </header>

      <div className="container" style={{ padding: "2rem 0" }}>

        {/* QUICK STATS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
          <div className="card" style={{ textAlign: "center" }}>
            <h3>{currentWeek}/10</h3>
            <p>Week</p>
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <h3 style={{ color: "#f97316" }}>
              {mlCalories ?? fitnessData.targetCalories}
            </h3>
            <p>Daily Calories</p>
          </div>

          <div className="card" style={{ textAlign: "center" }}>
            <h3>{user.fitnessGoal?.replace("_", " ").toUpperCase()}</h3>
            <p>Goal</p>
          </div>
        </div>

        {/* BMI */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>📊 BMI Health Indicator</h3>
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Body Mass Index based health status
          </p>
          <p><strong>BMI:</strong> {fitnessData.bmi}</p>
          <div className="bmi-scale">
            <div
              className="bmi-indicator"
              style={{ left: `${getBMIPosition(fitnessData.bmi)}%` }}
            />
          </div>
        </div>

        {/* TODAY */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", marginTop: "2rem" }}>
          <div className="card">
            <h3>🏋️ Today Workout</h3>
            <p>{todaysWorkout.title}</p>
          </div>

          <div className="card">
            <h3>🍽️ Today Meals</h3>
            <p>Breakfast: {todaysDiet.meals.breakfast.name}</p>
            <p>Lunch: {todaysDiet.meals.lunch.name}</p>
            <p>Dinner: {todaysDiet.meals.dinner.name}</p>
          </div>
        </div>

        {/* RULE BASED AI */}
        <div
  className="card"
  style={{
    marginTop: "2rem",
    border: "1.5px solid #bbf7d0",
    backgroundColor: "#f0fdf4"
  }}
>
          <h3>🤖 AI Personalized Plan</h3>

          <h4>🥗 Diet</h4>
          <ul>
            {aiPlan.dietRecommendations.map((d, i) => <li key={i}>{d}</li>)}
          </ul>

          <h4>🏋️ Workout</h4>
          <ul>
            {aiPlan.workoutRecommendations.map((w, i) => <li key={i}>{w}</li>)}
          </ul>
        </div>

        {/* GEMINI AI */}
        <div
  className="card"
  style={{
    marginTop: "2rem",
    border: "1.5px solid #bbf7d0",
    backgroundColor: "#f0fdf4"
  }}
>
          <h3>✨ Gemini AI – Smart Recommendations</h3>
          <p style={{ fontSize: "0.9rem", color: "#6b7280" }}>
            Generated using your calories, BMI and fitness goal
          </p>

          {loadingAI ? (
            <p style={{ fontStyle: "italic", color: "#888" }}>
              🤖 Generating your personalized AI plan...
            </p>
          ) : (
            <div style={{ lineHeight: "1.8", color: "#374151" }}>
              {aiTextPlan
                .split("\n")
                .filter(line => line.trim() !== "")
                .map((line, idx) => (
                  <p key={idx} style={{ marginBottom: "0.6rem" }}>
                    {line}
                  </p>
                ))}
            </div>
          )}
        </div>

        {/* CHARTS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
          marginTop: "2rem"
        }}>
          <CaloriesChart calories={mlCalories ?? fitnessData.targetCalories} />
          <BMIChart bmi={fitnessData.bmi} />
          <ProgressChart />
        </div>

        {/* QUICK ACTIONS */}
        <div className="card" style={{ marginTop: "2rem" }}>
          <h3>⚡ Quick Actions</h3>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <Link to="/plan/overview" className="btn btn-primary">📋 Plan Overview</Link>
            <Link to="/progress" className="btn btn-secondary">📈 Progress</Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;