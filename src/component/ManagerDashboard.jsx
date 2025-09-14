import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Corrected path to use plural 'contexts' folder
import { useAppContext } from '../context/AppContext'; 
import '../styles/Home.css';

export default function ManagerDashboard() {
  // Get state and navigation from hooks instead of props
  const { user, events } = useAppContext();
  const navigate = useNavigate();

  // Filter all events to get only the ones created by the current manager
  const myCreatedEvents = useMemo(() => 
    events.filter(event => event.managerId === user.uid),
    [events, user.uid]
  );

  // Calculate stats using useMemo for efficiency
  const stats = useMemo(() => {
    const totalEvents = myCreatedEvents.length;
    // Note: In a real app, attendees would come from a database relation
    const totalAttendees = myCreatedEvents.reduce((sum, event) => sum + (event.attendees || 0), 0);
    const averageAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;
    
    return { totalEvents, totalAttendees, averageAttendance };
  }, [myCreatedEvents]);

  // A better "empty state" for new managers that uses navigate
  if (myCreatedEvents.length === 0) {
    return (
      <div className="dashboard-container dashboard-empty">
        <h2>Welcome to your Dashboard, {user.displayName}!</h2>
        <p>You haven't created any events yet. Let's get started!</p>
        <button className="btn primary" onClick={() => navigate('/manage/add')}>
          + Create Your First Event
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Manager Dashboard</h2>
        <button className="btn" onClick={() => navigate('/manage/add')}>+ Create New Event</button>
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
                    {/* Updated to use navigate hook */}
                    <button className="btn-link" onClick={() => navigate(`/manage/analytics/${event.id}`)}> 
                      Analytics
                    </button>
                    <button className="btn-link" onClick={() => navigate(`/events/${event.id}`)}>
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

