import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { mockUsers } from '../service/mockUsers'; // Assuming you have this file
import { toast } from 'react-hot-toast';
import '../styles/Home.css'; // Assuming you have login styles here

export default function LoginPage() {
  const { dispatch } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // In a real app, you'd call an API. Here, we'll find the mock user.
    const foundUser = mockUsers.find(
      (user) => user.email === email
      // We are not checking password for this mock login
    );

    if (foundUser) {
      dispatch({ type: 'LOGIN_SUCCESS', payload: foundUser });
      toast.success(`Welcome, ${foundUser.displayName}!`);
    } else {
      toast.error('Invalid email or password.');
    }
  };

  const handleGoogleSignIn = () => {
    // For this mock app, we'll just log in the first user from the list
    const googleUser = mockUsers[0];
    dispatch({ type: 'LOGIN_SUCCESS', payload: googleUser });
    toast.success(`Welcome, ${googleUser.displayName}!`);
  };

  return (
    <div className="login-page-container">
      <div className="login-container">
        <h2 className="login-title">🗓️ Gather Up</h2>
        <input 
          type="email" 
          placeholder="Email (e.g., test@gatherup.com)" 
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
        <div className="divider">OR</div>
        <button className="btn google" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}