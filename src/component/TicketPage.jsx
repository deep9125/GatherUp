// src/component/TicketPage.jsx
import React from 'react';
import '../styles/Home.css'; // Assuming you have some shared styles here

export default function TicketPage({ event, onDone }) {
  if (!event) {
    // Fallback in case there's no event data
    return (
      <div className="ticket-page-container">
        <h2>Booking Successful!</h2>
        <button className="btn" onClick={onDone}>View My Events</button>
      </div>
    );
  }

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="ticket-page-container">
      <div className="ticket-card">
        <h2 className="ticket-header">Booking Confirmed!</h2>
        <p className="ticket-subheader">You're all set for the event.</p>
        
        <div className="ticket-event-details">
          <h3>{event.name}</h3>
          <p>{eventDate}</p>
          <p>{event.location}</p>
        </div>

        <div className="ticket-qr-code">
            <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GatherUp-Ticket-EventID:${event.id}-UserID:test123`}
                alt="Your Event Ticket QR Code" 
            />
        </div>
        
        <button className="btn primary full-width" onClick={onDone}>
          Done
        </button>
      </div>
    </div>
  );
}