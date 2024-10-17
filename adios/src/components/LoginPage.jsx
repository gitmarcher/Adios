import React from 'react';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="login-page">
      <h1>Adios : LMS</h1>
      <div className="login-options">
        <Link to="/student-login" className="login-button">Student Login</Link>
        <Link to="/faculty-login" className="login-button">Faculty Login</Link>
      </div>
    </div>
  );
};

export default LoginPage;