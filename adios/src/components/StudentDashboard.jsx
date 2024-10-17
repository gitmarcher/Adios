import React from 'react';
import { Link } from 'react-router-dom';

const StudentDashboard = () => {
  return (
    <div className="student-dashboard">
      <h2>Welcome, Student!</h2>
      <Link to="/leave-application" className="button">
        Apply for Leave
      </Link>
    </div>
  );
};

export default StudentDashboard;