import React from 'react';
import '../styles/Home.css';
export default function EventCard({ event, onViewDetails, onJoin }) {
  const eventDate = new Date(event.startTime).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
  return (
    <div className="event-card" onClick={() => onViewDetails(event)}>
      <div className="event-card-content">
        <h4>{event.name}</h4>
        <p className="event-card-date">{eventDate}</p>
        <p className="event-card-desc">{event.description.substring(0, 80)}...</p>
      </div>
      {onJoin && (
        <button 
          className="btn primary full-width" 
          onClick={(e) => {
            e.stopPropagation(); 
            onJoin(event);
          }}
        >
          Join Event
        </button>
      )}
    </div>
  );
}