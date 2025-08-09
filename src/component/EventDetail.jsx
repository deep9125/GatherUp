import React from "react";
import "../styles/Home.css"; // still uses the same styling

export default function EventDetail({ event }) {
  if (!event) {
    return (
      <div className="event-details">
        <p>Select an event to see details.</p>
      </div>
    );
  }

  return (
    <div className="event-details">
      <h1>{event.name}</h1>
      <p><strong>Date:</strong> {event.date}</p>
      <p>{event.description}</p>
    </div>
  );
}
