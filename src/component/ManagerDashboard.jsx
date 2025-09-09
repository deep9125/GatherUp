// src/component/ManagerDashboard.jsx
import React, { useMemo } from 'react';
import '../styles/Home.css';

// It now accepts props for events and navigation handlers
export default function ManagerDashboard({ user, myCreatedEvents,onViewAnalytics, onSelectEvent, onAddNew }) {

  // Calculate stats using useMemo for efficiency
  const stats = useMemo(() => {
    const totalEvents = myCreatedEvents.length;
    const totalAttendees = myCreatedEvents.reduce((sum, event) => sum + (event.attendees || 0), 0);
    const averageAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;
    
    return { totalEvents, totalAttendees, averageAttendance };
  }, [myCreatedEvents]);

  // A better "empty state" for new managers
  if (myCreatedEvents.length === 0) {
    return (
      <div className="dashboard-container dashboard-empty">
        <h2>Welcome to your Dashboard, {user.displayName}!</h2>
        <p>You haven't created any events yet. Let's get started!</p>
        <button className="btn primary" onClick={onAddNew}>
          + Create Your First Event
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button className="btn" onClick={onAddNew}>+ Create New Event</button>
      </div>
      <p>Welcome, <strong>{user.displayName}</strong>! Here's an overview of your events.</p>
      
      {/* Stat cards for a quick overview */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>🗓️ {stats.totalEvents}</h3>
          <p>Total Events Created</p>
        </div>
        <div className="stat-card">
          <h3>👥 {stats.totalAttendees.toLocaleString()}</h3>
          <p>Total Attendees Reached</p>
        </div>
        <div className="stat-card">
          <h3>📊 {stats.averageAttendance}</h3>
          <p>Avg. Attendance / Event</p>
        </div>
      </div>

      {/* A clear list of all created events */}
      <div className="dashboard-event-list">
        <h3>Your Events</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date</th>
                <th>Attendees</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {myCreatedEvents.map(event => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.date).toLocaleDateString()}</td>
                  <td>{event.attendees || 0} / {event.capacity}</td>
                  <td>
                    <button className="btn-link" onClick={() => onViewAnalytics(event)}> 
                      Analytics
                    </button>
                    <button className="btn-link" onClick={() => onSelectEvent(event)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}