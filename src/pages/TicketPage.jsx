import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useTicketCode } from '../hooks/useTicketCode';
import axios from 'axios';
import '../styles/Home.css'; 

const API_URL = 'http://localhost:3000/api';

export default function TicketPage() {
  const { id: eventId } = useParams(); 
  const navigate = useNavigate();
  const { user } = useAppContext();

  const ticketCode = useTicketCode(eventId);
  
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
  
  const userId = user?._id;
  const eventDate = new Date(event.startTime  ).toLocaleDateString("en-US", {
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
          <h3>Event:{event.name}</h3>
          <p>Starts:{eventDate}</p>
          <p>Location:{event.location}</p>
        </div>

       <div className="ticket-confirmation-code">
          <p>Your Confirmation Code</p>
          <h3 className="code-text">{ticketCode}</h3>
        </div>
        
        <button className="btn primary full-width" onClick={() => navigate('/events')}>
          Done
        </button>
      </div>
    </div>
  );
}