import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Register = () => {
  const navigate = useNavigate();
  const { registerUser } = useUser();
  
  const [formData, setFormData] = useState({
    age: '',
    sex: '',
    height: '',
    weight: '',
    fitnessGoal: '',
    fitnessLevel: '',
    healthProblems: ['none'], // Default to 'none'
    preferredCuisines: [],
    dietaryRestrictions: ['none'] // Default to 'none'
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setFormData(prev => {
      if (field === 'healthProblems') {
        // Handle health conditions with "None" logic
        if (value === 'none') {
          // If "None" is selected, clear all other selections
          return { ...prev, [field]: ['none'] };
        } else {
          // If any condition is selected, remove "None" and toggle the condition
          const currentValues = prev[field].filter(item => item !== 'none');
          return {
            ...prev,
            [field]: currentValues.includes(value)
              ? currentValues.filter(item => item !== value)
              : [...currentValues, value]
          };
        }
      } else if (field === 'preferredCuisines') {
        // Single select for cuisine (change to single select)
        return { ...prev, [field]: [value] };
      } else if (field === 'dietaryRestrictions') {
        // Single select for dietary restrictions
        return { ...prev, [field]: [value] };
      } else {
        // Default multi-select behavior
        return {
          ...prev,
          [field]: prev[field].includes(value)
            ? prev[field].filter(item => item !== value)
            : [...prev[field], value]
        };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    registerUser(formData);
    navigate('/dashboard');
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.age && formData.sex && formData.height && formData.weight;
      case 2:
        return formData.fitnessGoal && formData.fitnessLevel;
      case 3:
        return true; // Health problems are optional
      case 4:
        return true; // Final step - always valid
      default:
        return false;
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2rem 0' }}>
      <div className="container">
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <div className="card">
            <div style={{ marginBottom: '2rem' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>
                Fitness Assessment
              </h2>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
              <p style={{ textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-gray)' }}>
                Step {currentStep} of {totalSteps}
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {currentStep === 1 && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Basic Information</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Age</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      placeholder="Enter your age"
                      min="16"
                      max="80"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Sex</label>
                    <div className="checkbox-group">
                      {['male', 'female', 'other'].map(option => (
                        <div
                          key={option}
                          className={`checkbox-item ${formData.sex === option ? 'selected' : ''}`}
                          onClick={() => handleInputChange('sex', option)}
                        >
                          <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Height (cm)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.height}
                      onChange={(e) => handleInputChange('height', e.target.value)}
                      placeholder="Enter your height in cm"
                      min="120"
                      max="220"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Weight (kg)</label>
                    <input
                      type="number"
                      className="form-input"
                      value={formData.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="Enter your weight in kg"
                      min="30"
                      max="200"
                    />
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Fitness Goals & Level</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Fitness Goal</label>
                    <div className="checkbox-group">
                      {[
                        { key: 'weight_loss', label: 'Weight Loss' },
                        { key: 'muscle_gain', label: 'Muscle Gain' },
                        { key: 'fat_loss_toning', label: 'Fat Loss + Toning' },
                        { key: 'general_fitness', label: 'General Fitness' },
                        { key: 'endurance', label: 'Endurance Improvement' }
                      ].map(goal => (
                        <div
                          key={goal.key}
                          className={`checkbox-item ${formData.fitnessGoal === goal.key ? 'selected' : ''}`}
                          onClick={() => handleInputChange('fitnessGoal', goal.key)}
                        >
                          <span>{goal.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Fitness Level</label>
                    <div className="checkbox-group">
                      {[
                        { key: 'beginner', label: 'Beginner' },
                        { key: 'intermediate', label: 'Intermediate' },
                        { key: 'advanced', label: 'Advanced' }
                      ].map(level => (
                        <div
                          key={level.key}
                          className={`checkbox-item ${formData.fitnessLevel === level.key ? 'selected' : ''}`}
                          onClick={() => handleInputChange('fitnessLevel', level.key)}
                        >
                          <span>{level.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Health Considerations</h3>
                  
                  <div className="form-group">
                    <label className="form-label">Health Problems (Select all that apply)</label>
                    <div className="checkbox-group">
                      {[
                        { key: 'none', label: 'None' },
                        { key: 'knee_pain', label: 'Knee Pain' },
                        { key: 'back_pain', label: 'Back Pain' },
                        { key: 'heart_condition', label: 'Heart Condition' },
                        { key: 'diabetes', label: 'Diabetes' },
                        { key: 'asthma', label: 'Asthma' }
                      ].map(problem => (
                        <div
                          key={problem.key}
                          className={`checkbox-item ${formData.healthProblems.includes(problem.key) ? 'selected' : ''}`}
                          onClick={() => handleMultiSelect('healthProblems', problem.key)}
                        >
                          <span>{problem.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 style={{ marginBottom: '1.5rem' }}>Almost Done!</h3>
                  
                  <div style={{ 
                    padding: '1.5rem', 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '0.5rem', 
                    border: '1px solid #bae6fd',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ color: 'var(--energy-orange)', marginBottom: '1rem' }}>
                      🎯 Your Personalized Plan is Ready!
                    </h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-gray)', marginBottom: '1rem' }}>
                      Based on your fitness goal: <strong>{formData.fitnessGoal?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</strong>
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-gray)' }}>
                      We'll create a customized diet plan with meals specifically designed to help you achieve your goals.
                    </p>
                  </div>
                </div>
              )}

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                marginTop: '2rem' 
              }}>
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className="btn"
                    style={{ backgroundColor: 'var(--text-gray)', color: 'white' }}
                  >
                    Previous
                  </button>
                )}
                
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={nextStep}
                    className="btn btn-primary"
                    disabled={!isStepValid()}
                    style={{ 
                      marginLeft: 'auto',
                      opacity: isStepValid() ? 1 : 0.5,
                      cursor: isStepValid() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="btn btn-secondary"
                    disabled={!isStepValid()}
                    style={{ 
                      marginLeft: 'auto',
                      opacity: isStepValid() ? 1 : 0.5,
                      cursor: isStepValid() ? 'pointer' : 'not-allowed'
                    }}
                  >
                    Generate My Plan
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;