import React, { useState } from 'react';
import { Link , useNavigate } from 'react-router-dom'; // Import Link
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import '../styles/Home.css';

export default function LoginPage() {
  const { dispatch, users } = useAppContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin =async () => {
    // Now we check for both email and password
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );
    try {
      const res = await fetch('http://localhost:3000/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      // setResponse(data);
      // setError(null);
    } catch (err) {
      // setError(err.message);
      // setResponse(null);
    }
    if (foundUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: foundUser });
      toast.success(`Welcome back, ${foundUser.displayName}!`);
      navigate('/');
    } else {
      toast.error('Invalid email or password.');
    }
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-title">🗓️ Gather Up</h2>
        <input 
          type="email" 
          placeholder="Email" 
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="input-field" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn primary" onClick={handleLogin}>
          Login
        </button>
        <div className="divider"></div>
        <p className="toggle-text">
          Don't have an account?{' '}
          <Link to="/signup" className="toggle-link">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}