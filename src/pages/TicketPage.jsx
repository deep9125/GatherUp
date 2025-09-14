import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/Home.css';

export default function TicketPage() {
  // --- Hooks for routing and state ---
  const { id } = useParams(); // Get event ID from the URL
  const navigate = useNavigate();
  const { user, events } = useAppContext();

  // Find the event from the global state using the ID from the URL
  const event = React.useMemo(() => events.find(e => e.id == id), [events, id]);

  // --- Render Logic ---
  // Handle case where the event ID from the URL is not found
  if (!event) {
    return (
      <div className="ticket-page-container">
        <div className="ticket-card">
            <h2>Event Not Found</h2>
            <p>The event for this ticket could not be found.</p>
            <button className="btn" onClick={() => navigate('/my-events')}>View My Events</button>
        </div>
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
                // The QR code now uses the actual user's ID from the context
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GatherUp-Ticket-EventID:${event.id}-UserID:${user.uid}`}
                alt="Your Event Ticket QR Code" 
            />
        </div>
        
        {/* The button now uses the navigate hook */}
        <button className="btn primary full-width" onClick={() => navigate('/my-events')}>
          Done
        </button>
      </div>
    </div>
  );
}