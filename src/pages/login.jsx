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

  const handleLogin = () => {
    // Now we check for both email and password
    const foundUser = users.find(
      (user) => user.email === email && user.password === password
    );

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