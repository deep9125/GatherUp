import React, { useState } from 'react';
import { Link ,useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import '../styles/Home.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const { dispatch, users } = useAppContext();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('User'); // State for the selected role, defaults to 'User'

  const handleSignup = async () => {
    if (!displayName || !email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    const userExists = users.some((user) => user.email === email);
    if (userExists) {
      toast.error('An account with this email already exists.');
      return;
    }

    const newUser = {
      id: 0,
      displayName,
      email,
      password,
      role, 
    };
    console.log(JSON.stringify(newUser));
    try {
      const res = await fetch('http://localhost:3000/api/users/register', {
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
    dispatch({ type: 'SIGNUP_SUCCESS', payload: newUser });
    toast.success(`Welcome, ${newUser.displayName}! Account created as a ${newUser.role}.`);
    navigate('/');
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-title">Create Account</h2>
        <input
          type="text"
          placeholder="Display Name"
          className="input-field"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
        
        <select 
          className="input-field" 
          value={role} 
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="User">User</option>
          <option value="Manager">Manager</option>
        </select>
        
        <button className="btn primary" onClick={handleSignup}>
          Sign Up
        </button>
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