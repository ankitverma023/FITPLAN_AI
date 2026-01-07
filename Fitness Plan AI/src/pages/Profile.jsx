import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const Profile = () => {
  const { user, updateUser, resetUser, fitnessData } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(user || {});

  if (!user || !fitnessData) {
    return <div>Loading...</div>;
  }

  const handleSave = () => {
    updateUser(editData);
    setIsEditing(false);
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your profile? This will delete all your data and you\'ll need to register again.')) {
      resetUser();
    }
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMultiSelect = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb' }}>
      <header style={{ 
        background: 'linear-gradient(135deg, var(--fitness-green), var(--energy-orange))',
        color: 'white',
        padding: '2rem 0'
      }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                Profile Settings
              </h1>
              <p style={{ opacity: 0.9 }}>
                Manage your fitness profile and preferences
              </p>
            </div>
            <Link to="/dashboard" className="btn" style={{ 
              backgroundColor: 'rgba(255,255,255,0.2)', 
              color: 'white',
              textDecoration: 'none'
            }}>
              ← Dashboard
            </Link>
          </div>
        </div>
      </header>

      <div className="container" style={{ padding: '2rem 0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {/* Basic Information */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3>Basic Information</h3>
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="btn btn-primary"
                >
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={handleSave}
                    className="btn btn-primary"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setIsEditing(false);
                      setEditData(user);
                    }}
                    className="btn"
                    style={{ backgroundColor: 'var(--text-gray)', color: 'white' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem'
            }}>
              <div className="form-group">
                <label className="form-label">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={editData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                  />
                ) : (
                  <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    {user.age} years
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Sex</label>
                {isEditing ? (
                  <div className="checkbox-group">
                    {['male', 'female', 'other'].map(option => (
                      <div
                        key={option}
                        className={`checkbox-item ${editData.sex === option ? 'selected' : ''}`}
                        onClick={() => handleInputChange('sex', option)}
                      >
                        <span>{option.charAt(0).toUpperCase() + option.slice(1)}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    {user.sex.charAt(0).toUpperCase() + user.sex.slice(1)}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Height</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={editData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                  />
                ) : (
                  <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                    {user.height} cm
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Weight</label>
                {isEditing ? (
                  <input
                    type="number"
                    className="form-input"
                    value={editData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                  />
                ) : (
                  <div>
                    <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem', marginBottom: '0.5rem' }}>
                      {user.weight} kg
                    </p>
                    <p style={{ 
                      fontSize: '0.875rem', 
                      color: fitnessData.bmiCategory.color,
                      fontWeight: '600'
                    }}>
                      BMI: {fitnessData.bmi} ({fitnessData.bmiCategory.category})
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Fitness Goals */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Fitness Goals & Level</h3>
            
            <div className="form-group">
              <label className="form-label">Fitness Goal</label>
              {isEditing ? (
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
                      className={`checkbox-item ${editData.fitnessGoal === goal.key ? 'selected' : ''}`}
                      onClick={() => handleInputChange('fitnessGoal', goal.key)}
                    >
                      <span>{goal.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  {user.fitnessGoal.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Fitness Level</label>
              {isEditing ? (
                <div className="checkbox-group">
                  {[
                    { key: 'beginner', label: 'Beginner' },
                    { key: 'intermediate', label: 'Intermediate' },
                    { key: 'advanced', label: 'Advanced' }
                  ].map(level => (
                    <div
                      key={level.key}
                      className={`checkbox-item ${editData.fitnessLevel === level.key ? 'selected' : ''}`}
                      onClick={() => handleInputChange('fitnessLevel', level.key)}
                    >
                      <span>{level.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  {user.fitnessLevel.charAt(0).toUpperCase() + user.fitnessLevel.slice(1)}
                </p>
              )}
            </div>
          </div>

          {/* Health & Diet */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Health & Dietary Preferences</h3>
            
            <div className="form-group">
              <label className="form-label">Health Problems</label>
              {isEditing ? (
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
                      className={`checkbox-item ${editData.healthProblems.includes(problem.key) ? 'selected' : ''}`}
                      onClick={() => handleMultiSelect('healthProblems', problem.key)}
                    >
                      <span>{problem.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  {user.healthProblems.length > 0 ? user.healthProblems.join(', ') : 'None'}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Cuisines</label>
              {isEditing ? (
                <div className="checkbox-group">
                  {[
                    { key: 'indian', label: 'Indian' },
                    { key: 'continental', label: 'Continental' },
                    { key: 'mediterranean', label: 'Mediterranean' },
                    { key: 'asian', label: 'Asian' },
                    { key: 'keto', label: 'Keto-style' },
                    { key: 'vegan', label: 'Vegan' }
                  ].map(cuisine => (
                    <div
                      key={cuisine.key}
                      className={`checkbox-item ${editData.preferredCuisines.includes(cuisine.key) ? 'selected' : ''}`}
                      onClick={() => handleMultiSelect('preferredCuisines', cuisine.key)}
                    >
                      <span>{cuisine.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  {user.preferredCuisines.join(', ')}
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Dietary Restrictions</label>
              {isEditing ? (
                <div className="checkbox-group">
                  {[
                    { key: 'none', label: 'No Restrictions' },
                    { key: 'vegetarian', label: 'Vegetarian' },
                    { key: 'vegan', label: 'Vegan' },
                    { key: 'eggitarian', label: 'Eggitarian' },
                    { key: 'lactose_intolerant', label: 'Lactose Intolerant' },
                    { key: 'gluten_free', label: 'Gluten Free' }
                  ].map(restriction => (
                    <div
                      key={restriction.key}
                      className={`checkbox-item ${editData.dietaryRestrictions.includes(restriction.key) ? 'selected' : ''}`}
                      onClick={() => handleMultiSelect('dietaryRestrictions', restriction.key)}
                    >
                      <span>{restriction.label}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ padding: '0.75rem', backgroundColor: '#f9fafb', borderRadius: '0.5rem' }}>
                  {user.dietaryRestrictions.length > 0 ? user.dietaryRestrictions.join(', ') : 'None'}
                </p>
              )}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card" style={{ border: '2px solid #ef4444' }}>
            <h3 style={{ color: '#ef4444', marginBottom: '1rem' }}>⚠️ Danger Zone</h3>
            <p style={{ marginBottom: '1rem', color: 'var(--text-gray)' }}>
              This action will permanently delete your profile and all associated data. You'll need to register again to use the app.
            </p>
            <button 
              onClick={handleReset}
              className="btn"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              Reset Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;