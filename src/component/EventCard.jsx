// src/component/EventCard.jsx
import React from 'react';
import '../styles/Home.css';

// It now takes an `onViewDetails` prop instead of `onJoin`
export default function EventCard({ event, onViewDetails, onJoin }) {
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  // The main div is now a button that triggers onViewDetails when clicked
  return (
    <div className="event-card" onClick={() => onViewDetails(event)}>
      <div className="event-card-content">
        <h4>{event.name}</h4>
        <p className="event-card-date">{eventDate}</p>
        <p className="event-card-desc">{event.description.substring(0, 80)}...</p>
      </div>
      {/* We keep the onJoin button for simplicity in the user's main view */}
      {onJoin && (
        <button 
          className="btn primary full-width" 
          onClick={(e) => {
            e.stopPropagation(); // Prevents the card's onClick from firing too
            onJoin(event.id);
          }}
        >
          Join Event
        </button>
      )}
    </div>
  );
}