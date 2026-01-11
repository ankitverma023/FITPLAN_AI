import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fitnessData, setFitnessData] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [rulesData, setRulesData] = useState(null);
  const [dietsData, setDietsData] = useState(null);

  // Load JSON data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Loading JSON data...');
        const [rulesResponse, dietsResponse] = await Promise.all([
          fetch('/src/data/rules.json'),
          fetch('/src/data/diets.json')
        ]);
        
        if (!rulesResponse.ok || !dietsResponse.ok) {
          throw new Error('Failed to fetch JSON files');
        }
        
        const rules = await rulesResponse.json();
        const diets = await dietsResponse.json();
        
        console.log('JSON data loaded successfully');
        setRulesData(rules);
        setDietsData(diets);
      } catch (error) {
        console.error('Error loading JSON data:', error);
        console.log('Using fallback data');
        // Set fallback data
        setRulesData({
          goals: {
            weight_loss: { calorieMultiplier: 0.85 },
            muscle_gain: { calorieMultiplier: 1.15 },
            fat_loss_toning: { calorieMultiplier: 0.9 },
            general_fitness: { calorieMultiplier: 1.0 },
            endurance: { calorieMultiplier: 1.1 }
          },
          calorieRules: { activityMultiplier: 1.6 },
          healthConditions: {
            none: { name: 'None', priority: 0 }
          },
          dietaryRestrictions: {
            none: { name: 'No Restrictions' }
          }
        });
        setDietsData({ 
          mealTemplates: {
            continental: {
              breakfast: [
                { name: 'Healthy Breakfast', calories: 250, protein: 15, carbs: 30, fat: 10 }
              ],
              lunch: [
                { name: 'Healthy Lunch', calories: 400, protein: 25, carbs: 40, fat: 15 }
              ],
              snack: [
                { name: 'Healthy Snack', calories: 150, protein: 8, carbs: 15, fat: 8 }
              ],
              dinner: [
                { name: 'Healthy Dinner', calories: 350, protein: 20, carbs: 30, fat: 15 }
              ]
            }
          },
          nutritionTips: {
            general: ['Stay hydrated', 'Eat balanced meals', 'Practice portion control']
          }
        });
      }
    };
    
    loadData();
  }, []);

  const calculateBMR = (userData) => {
    if (!rulesData) return 1500; // Fallback BMR
    
    const { age, sex, height, weight } = userData;
    let bmr;
    
    switch (sex) {
      case 'male':
        bmr = (10 * weight) + (6.25 * height) - (5 * age) + 5;
        break;
      case 'female':
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 161;
        break;
      default:
        bmr = (10 * weight) + (6.25 * height) - (5 * age) - 78;
    }
    
    return Math.round(bmr * (rulesData.calorieRules?.activityMultiplier || 1.6));
  };

  const calculateBMI = (userData) => {
    const { height, weight } = userData;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getBMICategory = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) {
      return { category: 'Underweight', color: '#3b82f6', risk: 'Low' };
    } else if (bmiValue < 25) {
      return { category: 'Normal', color: '#22c55e', risk: 'Low' };
    } else if (bmiValue < 30) {
      return { category: 'Overweight', color: '#f59e0b', risk: 'Moderate' };
    } else if (bmiValue < 35) {
      return { category: 'Obese', color: '#ef4444', risk: 'High' };
    } else {
      return { category: 'Extremely Obese', color: '#991b1b', risk: 'Very High' };
    }
  };

  const generateWorkoutPlan = (userData) => {
    if (!rulesData) {
      // Return basic fallback workout plan
      return {
        week1: {
          day1: { type: 'rest', title: 'Rest Day', description: 'Recovery day' }
        }
      };
    }

    // Create a more complete structure that matches Dashboard expectations
    const workoutPlan = {};
    
    for (let week = 1; week <= 10; week++) {
      const weekKey = `week${week}`;
      workoutPlan[weekKey] = {};
      
      for (let day = 1; day <= 7; day++) {
        const dayKey = `day${day}`;
        
        // Simple pattern: strength, cardio, rest rotation
        const workoutTypes = ['strength', 'cardio', 'strength', 'cardio', 'strength', 'cardio', 'rest'];
        const workoutType = workoutTypes[day - 1];
        
        if (workoutType === 'rest') {
          workoutPlan[weekKey][dayKey] = {
            type: 'rest',
            title: 'Rest Day',
            description: 'Recovery and light stretching',
            intensity: 0.3,
            phase: week <= 2 ? 'Foundation' : week <= 4 ? 'Light Progression' : week <= 6 ? 'Moderate Intensity' : week <= 8 ? 'High Intensity' : 'Peak Conditioning',
            template: {
              warmup: [
                { exercise: 'Light Walking', duration: '5 min' },
                { exercise: 'Gentle Stretching', duration: '5 min' }
              ],
              main: [
                { exercise: 'Meditation', duration: '10 min' },
                { exercise: 'Light Yoga', duration: '15 min' }
              ],
              cooldown: [
                { exercise: 'Deep Breathing', duration: '5 min' }
              ]
            }
          };
        } else {
          const intensity = week <= 2 ? 0.6 : week <= 4 ? 0.75 : week <= 6 ? 0.9 : week <= 8 ? 1.1 : 1.25;
          
          workoutPlan[weekKey][dayKey] = {
            type: workoutType,
            title: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Training`,
            phase: week <= 2 ? 'Foundation' : week <= 4 ? 'Light Progression' : week <= 6 ? 'Moderate Intensity' : week <= 8 ? 'High Intensity' : 'Peak Conditioning',
            intensity: intensity,
            template: workoutType === 'strength' ? {
              warmup: [
                { exercise: 'Light Cardio', duration: '5 min' },
                { exercise: 'Joint Mobility', duration: '5 min' }
              ],
              main: [
                { exercise: 'Push-ups', sets: 3, reps: '8-12', rest: '60s' },
                { exercise: 'Squats', sets: 3, reps: '10-15', rest: '60s' },
                { exercise: 'Plank', sets: 3, duration: '30-60s', rest: '45s' },
                { exercise: 'Lunges', sets: 3, reps: '8-10 each leg', rest: '60s' }
              ],
              cooldown: [
                { exercise: 'Light Walking', duration: '5 min' },
                { exercise: 'Muscle Stretching', duration: '5 min' }
              ]
            } : {
              warmup: [
                { exercise: 'Light Walking', duration: '5 min' },
                { exercise: 'Dynamic Stretching', duration: '5 min' }
              ],
              main: [
                { exercise: 'Treadmill/Walking', duration: '20 min', intensity: 'moderate' },
                { exercise: 'Cycling', duration: '15 min', intensity: 'moderate' },
                { exercise: 'Elliptical', duration: '5 min', intensity: 'low' }
              ],
              cooldown: [
                { exercise: 'Walking', duration: '5 min' },
                { exercise: 'Static Stretching', duration: '5 min' }
              ]
            }
          };
        }
      }
    }
    
    return workoutPlan;
  };

  const generateDietPlan = (userData) => {
    if (!rulesData || !dietsData) {
      // Return basic fallback plan
      return {
        dietPlan: {},
        targetCalories: 2000,
        fitnessGoal: 'general_fitness',
        nutritionTips: ['Stay hydrated', 'Eat balanced meals']
      };
    }

    const baseBMR = calculateBMR(userData);
    const fitnessGoal = userData.fitnessGoal || 'general_fitness';
    
    // Step 1: Get the specific diet plan for the fitness goal
    const goalDietPlan = dietsData.dietPlans[fitnessGoal];
    if (!goalDietPlan) {
      console.warn(`No diet plan found for goal: ${fitnessGoal}`);
      return {
        dietPlan: {},
        targetCalories: Math.round(baseBMR),
        fitnessGoal,
        nutritionTips: ['Stay hydrated', 'Eat balanced meals']
      };
    }

    // Step 2: Calculate target calories based on goal
    const goalMultiplier = rulesData.goals[fitnessGoal]?.calorieMultiplier || 1.0;
    const targetCalories = Math.round(baseBMR * goalMultiplier);
    
    // Step 3: Generate weekly diet plan using goal-specific meals
    const dietPlan = {};
    const goalMeals = goalDietPlan.meals;
    
    for (let week = 1; week <= 10; week++) {
      const weekKey = `week${week}`;
      dietPlan[weekKey] = {};
      
      for (let day = 1; day <= 7; day++) {
        const dayKey = `day${day}`;
        
        // Deterministic meal selection based on fitness goal, week, and day
        const seed = `${fitnessGoal}_${week}_${day}`;
        const seedHash = seed.split('').reduce((a, b) => {
          a = ((a << 5) - a) + b.charCodeAt(0);
          return a & a;
        }, 0);
        
        // Select meals for each meal type
        const selectMeal = (mealArray, mealType) => {
          if (!mealArray || mealArray.length === 0) {
            return {
              name: `Healthy ${mealType}`,
              calories: mealType === 'breakfast' ? 300 : mealType === 'lunch' ? 450 : mealType === 'snack' ? 200 : 400,
              protein: 20,
              carbs: 35,
              fat: 15
            };
          }
          const index = Math.abs(seedHash + mealType.length + day) % mealArray.length;
          return mealArray[index];
        };
        
        const dayMeals = {
          breakfast: selectMeal(goalMeals.breakfast, 'breakfast'),
          lunch: selectMeal(goalMeals.lunch, 'lunch'),
          snack: selectMeal(goalMeals.snack, 'snack'),
          dinner: selectMeal(goalMeals.dinner, 'dinner')
        };
        
        // Calculate daily totals
        const dailyTotals = {
          calories: Object.values(dayMeals).reduce((sum, meal) => sum + meal.calories, 0),
          protein: Object.values(dayMeals).reduce((sum, meal) => sum + meal.protein, 0),
          carbs: Object.values(dayMeals).reduce((sum, meal) => sum + meal.carbs, 0),
          fat: Object.values(dayMeals).reduce((sum, meal) => sum + meal.fat, 0)
        };
        
        dietPlan[weekKey][dayKey] = {
          meals: dayMeals,
          dailyTotals,
          totalCalories: dailyTotals.calories, // Keep for backward compatibility
          targetCalories
        };
      }
    }
    
    // Get nutrition tips for the specific fitness goal
    const nutritionTips = dietsData.nutritionTips[fitnessGoal] || dietsData.nutritionTips.general_fitness || [
      'Stay hydrated throughout the day',
      'Eat balanced meals with all macronutrients',
      'Practice portion control',
      'Plan and prep meals for consistency'
    ];
    
    return {
      dietPlan,
      targetCalories,
      fitnessGoal,
      dietPlanName: goalDietPlan.name,
      dietDescription: goalDietPlan.description,
      macroRatio: goalDietPlan.macroRatio,
      nutritionTips
    };
  };

  const generateFitnessData = (userData) => {
    if (!rulesData) {
      // Return basic fallback data
      return {
        workoutPlan: {},
        dietPlan: {},
        bmr: 1500,
        bmi: '22.0',
        bmiCategory: { category: 'Normal', color: '#22c55e', risk: 'Low' },
        targetCalories: 2000,
        appliedHealthRules: [],
        healthConditions: [],
        cuisine: 'continental',
        dietaryRestriction: 'none',
        nutritionTips: []
      };
    }

    const workoutPlan = generateWorkoutPlan(userData);
    const dietData = generateDietPlan(userData);
    const bmr = calculateBMR(userData);
    const bmi = calculateBMI(userData);
    const bmiCategory = getBMICategory(bmi);

    // Ensure fitnessGoal exists, default to general_fitness
    const fitnessGoal = userData.fitnessGoal || 'general_fitness';
    const goalMultiplier = rulesData.goals[fitnessGoal]?.calorieMultiplier || 1.0;

    const data = {
      workoutPlan,
      dietPlan: dietData.dietPlan,
      bmr,
      bmi,
      bmiCategory,
      targetCalories: Math.round(bmr * goalMultiplier),
      // Add new diet-related data
      fitnessGoal: dietData.fitnessGoal,
      dietPlanName: dietData.dietPlanName,
      dietDescription: dietData.dietDescription,
      macroRatio: dietData.macroRatio,
      nutritionTips: dietData.nutritionTips,
      startDate: new Date().toISOString().split('T')[0]
    };

    setFitnessData(data);
    return data;
  };

  useEffect(() => {
    // Check if user data exists in localStorage, but only after JSON data is loaded
    if (rulesData && dietsData) {
      const savedUser = localStorage.getItem('fitplan_user');
      if (savedUser) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsRegistered(true);
        generateFitnessData(userData);
      }
    }
  }, [rulesData, dietsData]); // Depend on JSON data being loaded

  const registerUser = (userData) => {
    setUser(userData);
    setIsRegistered(true);
    localStorage.setItem('fitplan_user', JSON.stringify(userData));
    generateFitnessData(userData);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('fitplan_user', JSON.stringify(updatedUser));
    generateFitnessData(updatedUser);
  };

  const resetUser = () => {
    console.log('Resetting user data...');
    setUser(null);
    setFitnessData(null);
    setIsRegistered(false);
    localStorage.removeItem('fitplan_user');
  };

  const clearAllData = () => {
    console.log('Clearing all data...');
    localStorage.clear();
    setUser(null);
    setFitnessData(null);
    setIsRegistered(false);
  };

  return (
    <UserContext.Provider value={{
      user,
      fitnessData,
      isRegistered,
      registerUser,
      updateUser,
      resetUser,
      clearAllData
    }}>
      {children}
    </UserContext.Provider>
  );
};