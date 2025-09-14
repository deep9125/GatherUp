// src/pages/AllEventsPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import EventCard from '../component/EventCard';
import { toast } from 'react-hot-toast';

export default function AllEventsPage() {
  const { events, joinedEvents, dispatch } = useAppContext();
  const navigate = useNavigate();

  const availableEvents = events.filter(
    event => !joinedEvents.some(joinedEvent => joinedEvent.id === event.id)
  );

  const handleJoinEvent = (eventToJoin) => {
    if (joinedEvents.find(e => e.id === eventToJoin.id)) {
      toast.error("You have already joined this event!");
      return;
    }
    dispatch({ type: 'JOIN_EVENT', payload: eventToJoin });
    navigate(`/ticket/${eventToJoin.id}`);
  };

  const handleViewDetails = (event) => {
    navigate(`/events/${event.id}`);
  };

  return (
    <div className="event-grid-container">
      <h2>All Events ({availableEvents.length})</h2>
      <div className="event-grid">
        {availableEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            onJoin={() => handleJoinEvent(event)}
            onViewDetails={() => handleViewDetails(event)}
          />
        ))}
      </div>
    </div>
  );
}