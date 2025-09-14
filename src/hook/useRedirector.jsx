import React from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import AllEventsPage from '../pages/AllEventsPage';

export default function useRedirector() {
  const { user, events } = useAppContext();
  const navigate = useNavigate();

  // Wait for data to be available
  if (!user || !events) {
    return () => <div>Loading...</div>;
  }

  // --- Logic for the MANAGER role ---
  if (user.role === 'Manager') {
    const managerEvents = events.filter(event => event.managerId === user.uid);
    if (managerEvents.length > 0) {
      // Return a component that will perform the redirect
      return () => <Navigate to="/dashboard" replace />;
    } else {
      // Return a component that shows the "create event" prompt
      return () => (
        <div className="dashboard-container dashboard-empty">
          <h2>Welcome, {user.displayName}!</h2>
          <p>You haven't created any events yet. Let's get started!</p>
          <button className="btn primary" onClick={() => navigate('/manage/add')}>
            + Create Your First Event
          </button>
        </div>
      );
    }
  }

  // --- Logic for the USER role (and any others) ---
  // Return a component that shows the "All Events" page
  return () => <AllEventsPage />;
};