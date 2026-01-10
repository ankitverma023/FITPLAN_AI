import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Dashboard = () => {
  const { user, fitnessData } = useUser();

  if (!user || !fitnessData) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f9fafb'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2>Loading your dashboard...</h2>
          <p>Please wait while we prepare your fitness data.</p>
        </div>
      </div>
    );
  }

  const currentWeek = 1;
  const currentDay = new Date().getDay() || 7;

  // Safely access workout and diet data with fallbacks
  const todaysWorkout = fitnessData.workoutPlan?.[`week${currentWeek}`]?.[`day${currentDay}`] || {
    type: 'rest',
    title: 'Rest Day',
    description: 'Recovery and light stretching'
  };

  const thisWeeksDiet = fitnessData.dietPlan?.[`week${currentWeek}`] || {};
  const todaysDiet = thisWeeksDiet[`day${currentDay}`] || {
    meals: {
      breakfast: { name: 'Healthy Breakfast' },
      lunch: { name: 'Nutritious Lunch' },
      dinner: { name: 'Balanced Dinner' }
    }
  };

  // Calculate BMI position on scale (0-100%)
  const getBMIPosition = (bmi) => {
    const bmiValue = parseFloat(bmi);
    if (bmiValue <= 15) return 0;
    if (bmiValue >= 40) return 100;
    
    // Map BMI ranges to percentage positions
    if (bmiValue < 18.5) {
      return (bmiValue - 15) / (18.5 - 15) * 18.5;
    } else if (bmiValue < 25) {
      return 18.5 + (bmiValue - 18.5) / (25 - 18.5) * (25 - 18.5);
    } else if (bmiValue < 30) {
      return 25 + (bmiValue - 25) / (30 - 25) * (30 - 25);
    } else if (bmiValue < 35) {
      return 30 + (bmiValue - 30) / (35 - 30) * (35 - 30);
    } else {
      return 35 + (bmiValue - 35) / (40 - 35) * (100 - 35);
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      {/* Header */}
      <header style={{ 
        background: 'linear-gradient(135deg, var(--fitness-green), var(--energy-orange))',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                Welcome back! 👋
              </h1>
              <p style={{ opacity: 0.9 }}>
                Ready for Week {currentWeek} of your fitness journey?
              </p>
            </div>
            <Link to="/profile" className="btn" style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              textDecoration: 'none'
            }}>
              Profile
            </Link>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem 0' }}>
        {/* Quick Stats */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--fitness-green)', fontSize: '2rem' }}>
              {currentWeek}/10
            </h3>
            <p style={{ color: 'var(--text-gray)' }}>Weeks Completed</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--energy-orange)', fontSize: '2rem' }}>
              {fitnessData.targetCalories}
            </h3>
            <p style={{ color: 'var(--text-gray)' }}>Daily Calories</p>
          </div>
          
          <div className="card" style={{ textAlign: 'center' }}>
            <h3 style={{ color: 'var(--fitness-green)', fontSize: '2rem' }}>
              {user.fitnessGoal ? user.fitnessGoal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'General Fitness'}
            </h3>
            <p style={{ color: 'var(--text-gray)' }}>Your Goal</p>
          </div>
        </div>

        {/* BMI Health Indicator */}
        <div className="card bmi-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem', color: 'var(--text-dark)' }}>
            📊 Health Assessment
          </h3>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
            gap: '1rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: fitnessData.bmiCategory.color, fontSize: '2rem', marginBottom: '0.25rem' }}>
                {fitnessData.bmi}
              </h4>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>BMI</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: fitnessData.bmiCategory.color, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                {fitnessData.bmiCategory.category}
              </h4>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>Category</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <h4 style={{ color: fitnessData.bmiCategory.color, fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                {fitnessData.bmiCategory.risk} Risk
              </h4>
              <p style={{ color: 'var(--text-gray)', fontSize: '0.875rem' }}>Health Risk</p>
            </div>
          </div>

          {/* BMI Scale */}
          <div>
            <h4 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>BMI Scale</h4>
            <div className="bmi-scale">
              <div 
                className="bmi-indicator"
                style={{ left: `${getBMIPosition(fitnessData.bmi)}%` }}
              ></div>
            </div>
            <div className="bmi-labels">
              <span>Underweight<br/>&lt;18.5</span>
              <span>Normal<br/>18.5-24.9</span>
              <span>Overweight<br/>25-29.9</span>
              <span>Obese<br/>30-34.9</span>
              <span>Extremely Obese<br/>≥35</span>
            </div>
          </div>
        </div>

        {/* Today's Workout */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--fitness-green)' }}>
              🏋️ Today's Workout
            </h3>
            {todaysWorkout.type === 'rest' ? (
              <div>
                <p style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Rest Day</p>
                <p style={{ color: 'var(--text-gray)' }}>
                  Take time to recover and do light stretching
                </p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                  {todaysWorkout.title}
                </p>
                <p style={{ color: 'var(--text-gray)', marginBottom: '1rem' }}>
                  Phase: {todaysWorkout.phase || 'Foundation'}
                </p>
                <Link 
                  to={`/plan/workout/${currentWeek}/${currentDay}`}
                  className="btn btn-primary"
                  style={{ textDecoration: 'none' }}
                >
                  Start Workout
                </Link>
              </div>
            )}
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--energy-orange)' }}>
              🍽️ Today's Meals
            </h3>
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <p><strong>Breakfast:</strong> {todaysDiet.meals.breakfast.name}</p>
                <p><strong>Lunch:</strong> {todaysDiet.meals.lunch.name}</p>
                <p><strong>Dinner:</strong> {todaysDiet.meals.dinner.name}</p>
              </div>
              <Link 
                to={`/plan/diet/${currentWeek}`}
                className="btn btn-secondary"
                style={{ textDecoration: 'none' }}
              >
                View Full Diet Plan
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Quick Actions</h3>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem'
          }}>
            <Link 
              to="/plan/overview" 
              className="btn btn-primary"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              📊 Plan Overview
            </Link>
            <Link 
              to="/progress" 
              className="btn btn-secondary"
              style={{ textDecoration: 'none', textAlign: 'center' }}
            >
              📈 View Progress
            </Link>
            <Link 
              to={`/plan/workout/${currentWeek}/1`}
              className="btn"
              style={{ 
                backgroundColor: 'var(--text-gray)', 
                color: 'white',
                textDecoration: 'none', 
                textAlign: 'center' 
              }}
            >
              🗓️ Week Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;