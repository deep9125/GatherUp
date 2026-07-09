import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import api from '../utils/api';
import '../styles/Home.css';
export default function EventAnalyticsPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError("Could not load analytics for this event.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading analytics...</div>;
  if (error || !event) {
    return (
      <div className="dashboard-container">
        <h2>Event Not Found</h2>
        <p>{error}</p>
        <button className="btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
      </div>
    );
  }

  const ticketsSold = event.attendees?.length || 0;
  const revenue = ticketsSold * (event.ticketPrice || 0);
  const actualAttendance = event.presentAttendees?.length || 0;
  const attendanceRate = ticketsSold > 0 ? (actualAttendance / ticketsSold) * 100 : 0;
  return (
    <div className="dashboard-container">
      <h2>Analytics for: {event.name}</h2>
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>👥 {ticketsSold} / {event.capacity}</h3>
          <p>Tickets Sold</p>
        </div>
        <div className="stat-card">
          <h3>✅ {actualAttendance} / {ticketsSold}</h3>
          <p>Checked In</p>
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
      <div className="dashboard-actions">
        <button className="btn" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    </div>
  );
}