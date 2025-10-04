import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import '../styles/Home.css';

export default function LoginPage() {
  const { login, loading, error } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault(); // Prevent form submission
    login(email, password);
  };
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-title">🗓️ Gather Up</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email" 
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password" 
            className="input-field" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
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