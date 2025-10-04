import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import '../styles/Home.css'; 

const API_URL = 'http://localhost:3000/api';

export default function TicketPage() {
  const { id: eventId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/events/${eventId}`);
        setEvent(response.data);
      } catch (err) {
        setError('Could not find the event for this ticket.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (eventId) {
      fetchEvent();
    }
  }, [eventId]); 
  if (loading) return <div className="ticket-page-container"><div>Loading Ticket...</div></div>;
  if (error || !event) {
    return (
      <div className="ticket-page-container">
        <div className="ticket-card">
          <h2>Event Not Found</h2>
          <p>{error}</p>
          <button className="btn" onClick={() => navigate('/events')}>View All Events</button>
        </div>
      </div>
    );
  }
  
  const userId = user?.user?.id || user?._id;
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
            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GatherUp-Ticket-EventID:${event._id}-UserID:${userId}`}
            alt="Your Event Ticket QR Code" 
          />
        </div>
        
        <button className="btn primary full-width" onClick={() => navigate('/events')}>
          Done
        </button>
      </div>
    </div>
  );
}