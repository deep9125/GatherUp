import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// Corrected path to use singular 'context' folder as per your project structure
import { useAppContext } from '../context/AppContext'; 
import '../styles/Home.css'; // This path should be correct if Home.css is in src/styles

export default function UserDashboard() {
  // Get state and navigation hook instead of using props
  const { user, joinedEvents } = useAppContext();
  const navigate = useNavigate();

  // --- Logic for calculating stats (uses 'joinedEvents' from context) ---
  const nextUpcomingEvent = useMemo(() => {
    if (!joinedEvents || joinedEvents.length === 0) return null;
    const futureEvents = joinedEvents
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return futureEvents.length > 0 ? futureEvents[0] : null;
  }, [joinedEvents]);

  const eventsThisMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return joinedEvents.filter(event => new Date(event.date).getMonth() === currentMonth).length;
  }, [joinedEvents]);
  // ----------------------------------------------------------------

  // Empty state if user has joined no events
  if (joinedEvents.length === 0) {
    return (
      <div className="dashboard-container dashboard-empty">
        <h2>Welcome to your Dashboard, {user.displayName}!</h2>
        <p>You haven't joined any events yet. Let's find something fun!</p>
        {/* Use navigate to change pages */}
        <button className="btn primary" onClick={() => navigate('/')}>
          Browse All Events
        </button>
      </div>
    );
  }

  // Main dashboard view
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
          // Use navigate to go to the event detail page
          onClick={() => nextUpcomingEvent ? navigate(`/events/${nextUpcomingEvent.id}`) : null}
          disabled={!nextUpcomingEvent}
        >
          <h3>🎉 {nextUpcomingEvent ? nextUpcomingEvent.name : 'None!'}</h3>
          <p>
            Next Upcoming Event: 
            <strong>{nextUpcomingEvent ? new Date(nextUpcomingEvent.date).toLocaleDateString() : ' N/A'}</strong>
          </p>
        </button>

        <div className="stat-card">
          <h3>📅 {eventsThisMonth}</h3>
          <p>Events This Month</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        {/* Use navigate to go to the "My Events" page */}
        <button className="btn" onClick={() => navigate('/my-events')}>
          View All My Joined Events
        </button>
      </div>
    </div>
  );
}

