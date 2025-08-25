// src/component/EventCard.jsx
import React from 'react';
import '../styles/Home.css';

export default function EventCard({ event, onJoin }) {
  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="event-card">
      <div className="event-card-content">
        <h4>{event.name}</h4>
        <p className="event-card-date">{eventDate}</p>
        <p className="event-card-desc">{event.description.substring(0, 80)}...</p>
      </div>
      {/* The "Join" button only appears if the onJoin function is provided */}
      {onJoin && (
        <button className="btn primary full-width" onClick={() => onJoin(event.id)}>
          Join Event
        </button>
      )}
    </div>
  );
}