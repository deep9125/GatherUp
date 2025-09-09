// src/component/Navbar.jsx
import React from 'react';
import '../styles/Home.css';

// It receives props to handle navigation and user info
export default function Navbar({ user, setView, onLogout }) {
  return (
    <header className="header">
      <h3>🗓️ Gather Up</h3>
      <div className="header-actions">
        {user.role === "Manager" && (
          <button className="btn-dashboard-btn" onClick={() => setView("dashboard")}>
            Manager Dashboard
          </button>
        )}
        <button className="btn-logout-btn" onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}