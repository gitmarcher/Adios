import React, { useState } from 'react';
import BackButton from './BackButton';

const FacultyLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically handle the login logic
    console.log('Faculty login attempt:', { email, password });
  };

  return (
    <div className="faculty-login">
      <h2>Faculty Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email ID:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <BackButton />
    </div>
  );
};

export default FacultyLogin;