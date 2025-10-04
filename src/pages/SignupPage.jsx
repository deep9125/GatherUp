import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import '../styles/Home.css';

export default function SignupPage() {
  const { register, loading, error } = useAppContext();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User');
  const handleSignup = (e) => {
    e.preventDefault(); 
    if (!displayName || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }
    register({ displayName, email, password, role });
  };
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-title">Create Account</h2>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Display Name"
            className="input-field"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
          />
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
          <select 
            className="input-field" 
            value={role} 
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="User">User</option>
            <option value="Manager">Manager</option>
          </select>
          
          <button className="btn primary" type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <div className="divider"></div>
        <p className="toggle-text">
          Already have an account?{' '}
          <Link to="/login" className="toggle-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}