from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import os

# 🔹 Gemini (new SDK)
from google import genai
from dotenv import load_dotenv

# ==============================
# ENV LOAD
# ==============================
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

client = None
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)

# ==============================
# FASTAPI APP
# ==============================
app = FastAPI(title="FitPlan AI - Backend API")

# ==============================
# CORS (VERY IMPORTANT)
# ==============================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================
# SCHEMAS
# ==============================
class UserInput(BaseModel):
    age: int
    gender: int
    height_cm: float
    weight_kg: float
    activity_level: int
    goal: int


class AIPlanInput(BaseModel):
    calories: int
    goal: str
    bmi: float
    fitnessLevel: str


# ==============================
# ML CALORIES PREDICTION
# ==============================
@app.post("/predict-calories")
def predict_calories(data: UserInput):
    model = joblib.load("model.pkl")

    X = [[
        data.age,
        data.gender,
        data.height_cm,
        data.weight_kg,
        data.activity_level,
        data.goal
    ]]

    calories = model.predict(X)[0]
    return {"predicted_calories": int(calories)}


# ==============================
# GEMINI AI PLAN (WITH FALLBACK)
# ==============================
@app.post("/ai-plan")
def generate_ai_plan(data: AIPlanInput):
    try:
        if client is None:
            raise Exception("Gemini API key not configured")

        prompt = f"""
Create a personalized fitness plan.

Calories: {data.calories}
Goal: {data.goal}
BMI: {data.bmi}
Fitness Level: {data.fitnessLevel}

Provide:
1. Diet plan
2. Workout plan
3. Safety tips
"""

        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )

        return {"plan": response.text}

    except Exception as e:
        print("Gemini Error:", e)

        # 🔥 SMART FALLBACK (PROJECT NEVER BREAKS)
        fallback_plan = f"""
DIET PLAN:
• High protein meals
• Complex carbohydrates
• Healthy fats
• Plenty of water

WORKOUT PLAN:
• Strength training 3–4 days/week
• Cardio 3 days/week
• Stretching & mobility exercises

SAFETY TIPS:
• Warm up before workouts
• Maintain proper posture
• Take adequate rest
"""

        return {"plan": fallback_plan}