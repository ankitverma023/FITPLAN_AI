import React, { createContext, useContext, useState, useEffect } from 'react';
import rulesData from '../data/rules.json';
import workoutsData from '../data/workouts.json';
import dietsData from '../data/diets.json';

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

  useEffect(() => {
    // Check if user data exists in localStorage
    const savedUser = localStorage.getItem('fitplan_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsRegistered(true);
      generateFitnessData(userData);
    }
  }, []);

  const calculateBMR = (userData) => {
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
    
    return Math.round(bmr * rulesData.calorieRules.activityMultiplier);
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
    const { fitnessGoal, fitnessLevel, healthProblems } = userData;
    const goalData = rulesData.goals[fitnessGoal];
    const levelData = rulesData.fitnessLevels[fitnessLevel];
    const schedule = workoutsData.weeklySchedule[fitnessLevel];

    const workoutPlan = {};
    
    for (let week = 1; week <= 10; week++) {
      const weekKey = `week${week}`;
      const progressionKey = week <= 2 ? '1-2' : week <= 4 ? '3-4' : week <= 6 ? '5-6' : week <= 8 ? '7-8' : '9-10';
      const progression = rulesData.weeklyProgression[progressionKey];
      
      workoutPlan[weekKey] = {};
      
      schedule.pattern.forEach((workoutType, dayIndex) => {
        const dayKey = `day${dayIndex + 1}`;
        
        if (workoutType === 'rest') {
          workoutPlan[weekKey][dayKey] = {
            type: 'rest',
            title: 'Rest Day',
            description: 'Recovery and light stretching'
          };
        } else {
          let template = workoutsData.workoutTemplates[workoutType];
          
          // Apply health condition modifications
          if (healthProblems && healthProblems.length > 0) {
            healthProblems.forEach(condition => {
              if (workoutsData.modifications[condition]) {
                const modifications = workoutsData.modifications[condition].replace;
                template = { ...template };
                template.main = template.main.map(exercise => ({
                  ...exercise,
                  exercise: modifications[exercise.exercise] || exercise.exercise
                }));
              }
            });
          }
          
          workoutPlan[weekKey][dayKey] = {
            type: workoutType,
            title: `${workoutType.charAt(0).toUpperCase() + workoutType.slice(1)} Training`,
            phase: progression.phase,
            intensity: progression.intensityMultiplier,
            template: template
          };
        }
      });
    }
    
    return workoutPlan;
  };

  const generateDietPlan = (userData) => {
    const { fitnessGoal, preferredCuisines, dietaryRestrictions } = userData;
    const goalData = rulesData.goals[fitnessGoal];
    const baseBMR = calculateBMR(userData);
    const targetCalories = Math.round(baseBMR * goalData.calorieMultiplier);

    const dietPlan = {};
    const primaryCuisine = preferredCuisines[0] || 'continental';
    const mealTemplates = dietsData.mealTemplates[primaryCuisine];

    for (let week = 1; week <= 10; week++) {
      const weekKey = `week${week}`;
      dietPlan[weekKey] = {};

      for (let day = 1; day <= 7; day++) {
        const dayKey = `day${day}`;
        
        // Rotate meals to provide variety
        const mealIndex = (week + day) % 3;
        
        let meals = {
          breakfast: mealTemplates.breakfast[mealIndex],
          lunch: mealTemplates.lunch[mealIndex],
          snack: mealTemplates.snack[mealIndex],
          dinner: mealTemplates.dinner[mealIndex]
        };

        // Apply dietary restrictions
        if (dietaryRestrictions && dietaryRestrictions.length > 0) {
          dietaryRestrictions.forEach(restriction => {
            if (dietsData.dietaryModifications[restriction]) {
              // Apply modifications based on restrictions
              // This is a simplified version - in a real app, you'd have more complex logic
            }
          });
        }

        const dailyCalories = meals.breakfast.calories + meals.lunch.calories + 
                            meals.snack.calories + meals.dinner.calories;

        dietPlan[weekKey][dayKey] = {
          meals,
          totalCalories: dailyCalories,
          targetCalories
        };
      }
    }

    return dietPlan;
  };

  const generateFitnessData = (userData) => {
    const workoutPlan = generateWorkoutPlan(userData);
    const dietPlan = generateDietPlan(userData);
    const bmr = calculateBMR(userData);
    const bmi = calculateBMI(userData);
    const bmiCategory = getBMICategory(bmi);

    const data = {
      workoutPlan,
      dietPlan,
      bmr,
      bmi,
      bmiCategory,
      targetCalories: Math.round(bmr * rulesData.goals[userData.fitnessGoal].calorieMultiplier),
      startDate: new Date().toISOString().split('T')[0]
    };

    setFitnessData(data);
    return data;
  };

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
    setUser(null);
    setFitnessData(null);
    setIsRegistered(false);
    localStorage.removeItem('fitplan_user');
  };

  return (
    <UserContext.Provider value={{
      user,
      fitnessData,
      isRegistered,
      registerUser,
      updateUser,
      resetUser
    }}>
      {children}
    </UserContext.Provider>
  );
};