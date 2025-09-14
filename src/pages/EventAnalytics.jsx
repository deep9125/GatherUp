import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Corrected path to navigate up from 'pages' to 'src', then into 'context'
import { useAppContext } from '../context/AppContext';
// Corrected path to navigate up from 'pages' to 'src', then into 'styles'
import '../styles/Home.css';

// This is a basic analytics component. You could add charts or more detailed stats.
export default function EventAnalyticsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useAppContext();

  const event = React.useMemo(() => events.find(e => e.id == id), [events, id]);

  if (!event) {
    return (
      <div className="event-detail-container">
        <h2>Event Not Found</h2>
        <p>Analytics cannot be displayed for an event that does not exist.</p>
        <button className="btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  const revenue = (event.attendees || 0) * (event.ticketPrice || 0);
  const attendanceRate = event.capacity > 0 ? ((event.attendees || 0) / event.capacity) * 100 : 0;

  return (
    <div className="dashboard-container">
      <h2>Analytics for: {event.name}</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>👥 {event.attendees || 0} / {event.capacity}</h3>
          <p>Tickets Sold</p>
        </div>
        <div className="stat-card">
          <h3>📈 {attendanceRate.toFixed(1)}%</h3>
          <p>Attendance Rate</p>
        </div>
        <div className="stat-card">
          <h3>💰 ${revenue.toFixed(2)}</h3>
          <p>Total Revenue</p>
        </div>
      </div>

      {/* You could add charts or more detailed data visualizations here */}

      <div className="dashboard-actions">
        <button className="btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}

