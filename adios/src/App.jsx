import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage';
import StudentLogin from './components/StudentLogin';
import FacultyLogin from './components/FacultyLogin';
import StudentDashboard from './components/StudentDashboard';
import LeaveApplicationForm from './components/LeaveApplicationForm';

const App = () => {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/faculty-login" element={<FacultyLogin />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/leave-application" element={<LeaveApplicationForm />} />
      </Routes>
    </div>
  );
};

export default App;