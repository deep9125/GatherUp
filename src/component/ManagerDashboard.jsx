// src/component/ManagerDashboard.jsx
import React from 'react';

export default function ManagerDashboard({ user }) {
  return (
    <div className="dashboard-container">
      <h2>Manager Dashboard</h2>
      <p>Welcome, {user.displayName || user.email}!</p>
      <p>Analytics on total registered users, tickets sold, and attendance will be shown here.</p>
    </div>
  );
}