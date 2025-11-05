import React, { useState, useEffect, useMemo } from 'react'; // 1. Import useMemo
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EventCard from '../component/EventCard';
import { toast } from 'react-hot-toast';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function AllEventsPage() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/events/viewAllEvent`);
      setAllEvents(response.data);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };
  fetchEvents();
}, []);
 const availableEvents = useMemo(() => {
    if (!user || !allEvents) return [];
    const today = new Date();
    const userId = user?._id;
    return allEvents.filter(event => {
      const notJoined = !event.attendees.includes(userId);
      const isUpcoming = new Date(event.startTime) >= today;
      return notJoined && isUpcoming;
    });
  }, [allEvents, user]);
  const handleJoinEvent = async (eventToJoin) => {
    if (!user) {
      toast.error("You must be logged in to join an event.");
      return;
    }
    try {
      await axios.post(`${API_URL}/events/${eventToJoin._id}/join`, {
        userId: user._id,
      });
      toast.success(`Successfully joined "${eventToJoin.name}"!`);
      navigate(`/ticket/${eventToJoin._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to join event.");
      console.error(err);
    }
  };
  const handleViewDetails = (event) => {
    navigate(`/events/${event._id}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="event-grid-container">
      <h2>Available Events ({availableEvents.length})</h2>
      <div className="event-grid">
        {availableEvents.map(event => (
          <EventCard
            key={event._id}
            event={event}
            onJoin={handleJoinEvent}
            onViewDetails={handleViewDetails}
          />
        ))}
      </div>
    </div>
  );
}