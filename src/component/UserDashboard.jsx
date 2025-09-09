import React, { useMemo } from 'react';
import '../styles/Home.css';

export default function UserDashboard({ user, myEvents, setView, onViewDetails }) {

  const nextUpcomingEvent = useMemo(() => {
    if (!myEvents || myEvents.length === 0) return null;
    const futureEvents = myEvents
      .filter(event => new Date(event.date) > new Date())
      .sort((a, b) => new Date(a.date) - new Date(b.date));
    return futureEvents.length > 0 ? futureEvents[0] : null;
  }, [myEvents]);

  const eventsThisMonth = useMemo(() => {
    const currentMonth = new Date().getMonth();
    return myEvents.filter(event => new Date(event.date).getMonth() === currentMonth).length;
  }, [myEvents]);

  if (myEvents.length === 0) {
    return (
      <div className="dashboard-container dashboard-empty">
        <h2>Welcome to your Dashboard, {user.displayName}!</h2>
        <p>You haven't joined any events yet. Let's find something fun!</p>
        <button className="btn primary" onClick={() => setView('allEvents')}>
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
          <h3>🗓️ {myEvents.length}</h3>
          <p>Events Joined</p>
        </div>
        
        <button 
          className="stat-card interactive" 
          onClick={() => nextUpcomingEvent ? onViewDetails(nextUpcomingEvent) : null}
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
        <button className="btn" onClick={() => setView('myEvents')}>
          View All My Joined Events
        </button>
      </div>
    </div>
  );
}