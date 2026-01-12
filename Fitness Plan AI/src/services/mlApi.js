// src/services/mlApi.js

const ML_API_BASE_URL = "http://127.0.0.1:5001";

export async function predictCalories(userData) {
  try {
    const response = await fetch(`${ML_API_BASE_URL}/predict-calories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      throw new Error(`ML API Error: ${response.status}`);
    }

    const data = await response.json();
    return data.predicted_calories;
  } catch (error) {
    console.error("ML API Error:", error);
    return null;
  }
}