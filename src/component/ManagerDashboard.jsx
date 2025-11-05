import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; 
import '../styles/Home.css';
import axios from 'axios';
const API_URL = 'http://localhost:3000/api';
export default function ManagerDashboard() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const managerId = user?._id;
    if (!managerId) return;

    const fetchManagerEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/events/manager/${managerId}`);
        setMyCreatedEvents(response.data);
      } catch (err) {
        setError("Could not fetch dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerEvents();
  }, [user]);

  const stats = useMemo(() => {
    const totalEvents = myCreatedEvents.length;
    const totalAttendees = myCreatedEvents.reduce((sum, event) => sum + (event.attendees?.length || 0), 0);
    const averageAttendance = totalEvents > 0 ? Math.round(totalAttendees / totalEvents) : 0;
    const totalRevenue = myCreatedEvents.reduce((sum, event) => {
      const eventRevenue = (event.ticketPrice || 0) * (event.attendees?.length || 0);
      return sum + eventRevenue;
    }, 0);
    return { totalEvents, totalAttendees, averageAttendance,totalRevenue };
  }, [myCreatedEvents]);
  if (loading) return <div>Loading dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
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
      
      <div className="dashboard-stats">
        <div className="stat-card">
          <h4 className="stat-title">Total Events</h4>
          <p className="stat-value">{stats.totalEvents}</p>
        </div>
        <div className="stat-card">
          <h4 className="stat-title">Total Registrations</h4>
          <p className="stat-value">{stats.totalAttendees}</p>
        </div>
        <div className="stat-card">
          <h4 className="stat-title">Avg. Registrations</h4>
          <p className="stat-value">{stats.averageAttendance}</p>
        </div>
        <div className="stat-card">
          <h4 className="stat-title">Total Revenue</h4>
          <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
        </div>
      </div>

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
                <tr key={event._id}>
                  <td>{event.name}</td>
                  <td>{new Date(event.startTime).toLocaleDateString()}</td>
                  <td>{event.attendees?.length || 0} / {event.capacity}</td>
                  <td>
                    <button className="btn-link" onClick={() => navigate(`/manage/attendance/${event._id}`)}> Attendance</button>
                    <button className="btn-link" onClick={() => navigate(`/manage/analytics/${event._id}`)}>Analytics</button>
                    <button className="btn-link" onClick={() => navigate(`/events/${event._id}`)}>View Details</button>
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