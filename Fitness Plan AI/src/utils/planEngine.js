// src/utils/planEngine.js

export function generatePlan({
  calories,
  goal,
  fitnessLevel,
  healthProblems = []
}) {
  let diet = [];
  let workout = [];
  let notes = [];

  // 1️⃣ DIET
  if (goal === "weight_loss") {
    diet.push(
      "High protein meals",
      "Low refined carbs",
      "More vegetables",
      "Avoid sugar & fried food"
    );
  } else if (goal === "muscle_gain") {
    diet.push(
      "High protein",
      "Complex carbs",
      "Healthy fats",
      "Calorie surplus meals"
    );
  } else {
    diet.push("Balanced meals", "Moderate carbs", "Healthy fats");
  }

  // 2️⃣ CALORIES
  if (calories < 1800) {
    diet.push("Smaller portions", "Light meals");
  } else if (calories > 2500) {
    diet.push("Larger portions", "Extra protein servings");
  }

  // 3️⃣ WORKOUT
  if (goal === "weight_loss") {
    workout.push("Brisk walking", "Cycling", "Light cardio");
  } else if (goal === "muscle_gain") {
    workout.push("Strength training", "Resistance exercises");
  } else {
    workout.push("Mixed cardio & strength");
  }

  if (fitnessLevel === "beginner") {
    workout.push("Stretching", "Mobility exercises");
  } else if (fitnessLevel === "advanced") {
    workout.push("HIIT", "Progressive overload");
  }

  // 4️⃣ HEALTH CONDITIONS
  if (healthProblems.includes("knee_pain")) {
    workout.push("Cycling", "Swimming");
    notes.push("Avoid high-impact exercises due to knee pain");
  }

  if (healthProblems.includes("back_pain")) {
    workout.push("Yoga", "Core stability");
    notes.push("Avoid heavy lifting");
  }

  if (healthProblems.includes("diabetes")) {
    diet.push("Low glycemic foods");
    notes.push("Monitor blood sugar regularly");
  }

  if (healthProblems.includes("heart_condition")) {
    workout.push("Walking", "Light cardio");
    notes.push("Avoid high intensity workouts");
  }

  return {
    calories,
    dietRecommendations: [...new Set(diet)],
    workoutRecommendations: [...new Set(workout)],
    safetyNotes: notes
  };
}