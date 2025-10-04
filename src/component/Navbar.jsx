import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'; 

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  return (
    <header className="header">
      <h3>🗓️ Gather Up</h3>
      <div className="header-actions">
          <button className="btn-dashboard-btn" onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>
        <button className="btn-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

