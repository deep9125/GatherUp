import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EventCard from '../component/EventCard';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function MyEventsPage() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [joinedEvents, setJoinedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userId = user?._id;
    if (!userId) {
      setLoading(false);
      setError("User not found.");
      return;
    }

    const fetchJoinedEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/users/${userId}/events`);
        setJoinedEvents(response.data);
      } catch (err) {
        setError("Could not fetch your events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchJoinedEvents();
  }, [user]); 

  const handleViewDetails = (event) => {
    navigate(`/events/${event._id}`);
  };

  if (loading) return <div>Loading your events...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="event-grid-container">
      <h2>My Joined Events ({joinedEvents.length})</h2>

      {joinedEvents.length > 0 ? (
        <div className="event-grid">
          {joinedEvents.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onViewDetails={() => handleViewDetails(event)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <p>You haven't joined any events yet.</p>
          <button className="btn" onClick={() => navigate('/events')}>
            Browse Events
          </button>
        </div>
      )}
    </div>
  );
}