import React, {useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext'; 
import '../styles/Home.css'; 
const API_URL = 'http://localhost:3000/api';
export default function UserDashboard() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId =  user?._id;
    if (!userId) return;
    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users/${userId}/events`);
        setJoinedEvents(response.data);
      } catch (err) {
        setError("Could not fetch your dashboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJoinedEvents();
  }, [user]);
  const nextUpcomingEvent = useMemo(() => {
    if (!joinedEvents || joinedEvents.length === 0) return null;
    const futureEvents = joinedEvents
      .filter(event => new Date(event.startTime) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return futureEvents.length > 0 ? futureEvents[0] : null;
  }, [joinedEvents]);

  const eventsThisMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return joinedEvents.filter(event => new Date(event.startTime).getMonth() === currentMonth).length;
  }, [joinedEvents]);
  if (loading) return <div>Loading your dashboard...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (joinedEvents.length === 0) {
    return (
      <div className="dashboard-container dashboard-empty">
        <h2>Welcome to your Dashboard, {user.displayName}!</h2>
        <p>You haven't joined any events yet. Let's find something fun!</p>
        <button className="btn primary" onClick={() => navigate('/')}>
          Browse All Events
        </button>
      </div>
    );
  }
  return (
    <div className="dashboard-container">
      <h2>My Dashboard</h2>
      <p>Hello, <strong>{user.displayName}</strong>! Here's a summary of your activity.</p>
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>🗓️ {joinedEvents.length}</h3>
          <p>Events Joined</p>
        </div>
        <button 
          className="stat-card interactive" 
          onClick={() => nextUpcomingEvent ? navigate(`/events/${nextUpcomingEvent._id}`) : null}
          disabled={!nextUpcomingEvent}
        >
          <h3>🎉 {nextUpcomingEvent ? nextUpcomingEvent.name : 'None!'}</h3>
          <p>
            Next Upcoming Event: 
            <strong>{nextUpcomingEvent ? new Date(nextUpcomingEvent.startTime).toLocaleDateString() : ' N/A'}</strong>
          </p>
        </button>
        <div className="stat-card">
          <h3>📅 {eventsThisMonth}</h3>
          <p>Events This Month</p>
        </div>
      </div>
      <div className="dashboard-actions">
        <button className="btn" onClick={() => navigate('/my-events')}>
          View All My Joined Events
        </button>
      </div>
    </div>
  );
}

