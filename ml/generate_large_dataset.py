import random
import csv

OUTPUT_FILE = "ml/data/fitness_data_10000.csv"

rows = []

# Header
rows.append([
    "age",
    "gender",
    "height_cm",
    "weight_kg",
    "activity_level",
    "goal",
    "calories_required"
])

for _ in range(10000):
    age = random.randint(18, 60)
    gender = random.choice([0, 1])  # 0=female, 1=male
    height = random.randint(150, 190)

    # weight correlated with height
    weight = round(random.uniform(height * 0.35, height * 0.55), 1)

    activity = random.choice([1, 2, 3])  # low, medium, high
    goal = random.choice([1, 2])          # loss, gain

    # calories logic (industry-style approximation)
    base_calories = 10 * weight + 6.25 * height - 5 * age
    if gender == 1:
        base_calories += 200

    if activity == 1:
        base_calories += 200
    elif activity == 2:
        base_calories += 400
    else:
        base_calories += 600

    if goal == 2:
        base_calories += 300
    else:
        base_calories -= 200

    calories = int(base_calories)

    rows.append([
        age,
        gender,
        height,
        weight,
        activity,
        goal,
        calories
    ])

with open(OUTPUT_FILE, "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerows(rows)

print("✅ 10,000-row dataset generated:", OUTPUT_FILE)
