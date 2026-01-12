import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error

print("📥 Loading dataset...")

# IMPORTANT: correct relative path
data = pd.read_csv("data/fitness_data_10000.csv")

print("✅ Dataset loaded")

# Separate features and target
X = data[[
    "age",
    "gender",
    "height_cm",
    "weight_kg",
    "activity_level",
    "goal"
]]

y = data["calories_required"]

print("🧠 Splitting data...")

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("🚀 Training model...")

# Model
model = RandomForestRegressor(
    n_estimators=200,
    random_state=42,
    n_jobs=-1
)

# Train
model.fit(X_train, y_train)

print("📊 Evaluating model...")

# Evaluate
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)

print(f"✅ Model trained successfully")
print(f"📉 Mean Absolute Error (MAE): {mae:.2f}")

# Save model
joblib.dump(model, "model.pkl")

print("💾 Model saved as model.pkl")
