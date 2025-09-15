import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';


export default function AttendancePage() {
  const { eventId } = useParams();
  const { events, users } = useAppContext();
  
  // State to keep track of which user IDs are selected
  const [selectedUserIds, setSelectedUserIds] = useState([]);
    console.log("ID from URL (eventId):", eventId, typeof eventId); 
  console.log("All events from context:", events);
  // Find the current event based on the ID from the URL
  const event = useMemo(() => 
    events.find(e => e.id == Number(eventId)), 
    [events, eventId]
  );

  // In a real app, this would be a list of users registered for THIS event.
  // For this mock-up, we'll just list all users.
  const attendees = users;

  // Handler for checkbox changes
  const handleCheckboxChange = (userId) => {
    setSelectedUserIds(prevSelected =>
      prevSelected.includes(userId)
        ? prevSelected.filter(id => id !== userId) // Uncheck: remove ID
        : [...prevSelected, userId] // Check: add ID
    );
  };

  // Handler for marking attendance (simulated)
  const handleMarkAttendance = (status) => {
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user.');
      return;
    }
    // In a real app, you would dispatch an action here to update attendance state.
    toast.success(`${selectedUserIds.length} user(s) marked as ${status}.`);
    setSelectedUserIds([]); // Clear selection after action
  };

  if (!event) {
    return (
      <div className="attendance-container">
        <h2>Event not found</h2>
        <Link to="/dashboard">Return to Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Manage Attendance</h1>
        <h2>{event.name}</h2>
        <p>{new Date(event.date).toLocaleDateString()}</p>
      </div>

      <div className="attendance-controls">
        <button className="btn" onClick={() => handleMarkAttendance('Present')}>
          Mark as Present
        </button>
        <button className="btn secondary" onClick={() => handleMarkAttendance('Absent')}>
          Mark as Absent
        </button>
      </div>

      <div className="user-list">
        {attendees.map(user => (
          <div key={user.uid} className="user-row">
            <input
              type="checkbox"
              id={`user-${user.uid}`}
              checked={selectedUserIds.includes(user.uid)}
              onChange={() => handleCheckboxChange(user.uid)}
            />
            <label htmlFor={`user-${user.uid}`}>
              <span className="user-name">{user.displayName}</span>
              <span className="user-email">{user.email}</span>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}