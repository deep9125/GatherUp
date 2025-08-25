// src/component/UserDashboard.jsx
import React from 'react';
import '../styles/Home.css';

export default function UserDashboard({ user, myEvents }) {
  const upcomingEvent = myEvents.length > 0 ? myEvents[0] : null;

  return (
    <div className="dashboard-container">
      <h2>My Dashboard</h2>
      <p>Hello, <strong>{user.displayName}</strong>! Here's a summary of your activity.</p>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>{myEvents.length}</h3>
          <p>Events Joined</p>
        </div>
        <div className="stat-card">
          <h3>{upcomingEvent ? upcomingEvent.name : 'N/A'}</h3>
          <p>Next Upcoming Event</p>
        </div>
      </div>
    </div>
  );
}