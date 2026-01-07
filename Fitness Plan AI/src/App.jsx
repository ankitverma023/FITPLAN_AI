import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider, useUser } from './context/UserContext';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import WorkoutDay from './pages/WorkoutDay';
import DietWeek from './pages/DietWeek';
import Progress from './pages/Progress';
import Profile from './pages/Profile';
import PlanOverview from './pages/PlanOverview';

const AppRoutes = () => {
  const { isRegistered } = useUser();

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route 
        path="/register" 
        element={isRegistered ? <Navigate to="/dashboard" /> : <Register />} 
      />
      <Route 
        path="/dashboard" 
        element={isRegistered ? <Dashboard /> : <Navigate to="/register" />} 
      />
      <Route 
        path="/plan/overview" 
        element={isRegistered ? <PlanOverview /> : <Navigate to="/register" />} 
      />
      <Route 
        path="/plan/workout/:week/:day" 
        element={isRegistered ? <WorkoutDay /> : <Navigate to="/register" />} 
      />
      <Route 
        path="/plan/diet/:week" 
        element={isRegistered ? <DietWeek /> : <Navigate to="/register" />} 
      />
      <Route 
        path="/progress" 
        element={isRegistered ? <Progress /> : <Navigate to="/register" />} 
      />
      <Route 
        path="/profile" 
        element={isRegistered ? <Profile /> : <Navigate to="/register" />} 
      />
    </Routes>
  );
};

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;