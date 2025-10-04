import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import '../styles/Home.css'; 
import FeedbackForm from './FeedbackForm'; 
const API_URL = 'http://localhost:3000'; 
export default function EventDetail() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user, triggerRefetch } = useAppContext();

  const [event, setEvent] = useState(null);
  const [eventGroup, setEventGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/events/${eventId}`);
        setEvent(response.data);
        const groupResponse = await axios.get(`${API_URL}/api/groups/event/${eventId}`);
        if (groupResponse.data.length > 0) {
          setEventGroup(groupResponse.data[0]); 
        }
      } catch (err) {
        setError("Event not found or an error occurred.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);
  const { hasJoined, userRating, isPastEvent, userRole, userId } = useMemo(() => {
    if (!user || !event) {
      return { hasJoined: false, userRating: null, isPastEvent: false, userRole: null, userId: null };
    }
    const currentUserId =  user._id;
    const currentUserRole =  user.role;

    return {
      userId: currentUserId,
      userRole: currentUserRole,
      hasJoined: event.attendees.some(attendee => attendee._id === currentUserId),
      userRating: event.ratings.find(rating => rating.userId._id === currentUserId),
      isPastEvent: new Date(event.date) < new Date(),
    };
  }, [event, user]);
  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${event.name}"?`)) {
      try {
        await axios.delete(`${API_URL}/api/events/${eventId}`);
        toast.success('Event deleted successfully.');
        triggerRefetch();
        navigate('/dashboard');
      } catch (err) {
        toast.error('Failed to delete event.');
      }
    }
  };

  const handleJoin = async () => {
    try {
      await axios.post(`${API_URL}/api/events/${eventId}/join`, { userId });
      toast.success(`Successfully joined "${event.name}"!`);
      navigate(`/ticket/${eventId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to join event.');
    }
  };

  const handleRateEvent = async (ratingData) => {
    try {
      await axios.post(`${API_URL}/api/events/${eventId}/rate`, { 
        userId, 
        score: ratingData.rating, 
        comment: ratingData.comment 
      });
      toast.success("Thank you for your feedback!");
      const response = await axios.get(`${API_URL}/api/events/${eventId}`);
      setEvent(response.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit rating.");
    }
  };
  if (loading) return <div>Loading event details...</div>;
  if (error || !event) return <div className="event-detail-container"><h2>{error || 'Event Not Found'}</h2></div>;
  
  return (
    <div className="event-detail-container scrollable">
      <h2 className="event-title">{event.name}</h2>
      <img src={`${API_URL}/${event.imageUrl}`} alt={event.name} className="event-detail-image" />
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <div className="event-description"><p>{event.description}</p></div>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Attendees:</strong> {event.attendees.length} / {event.capacity}</p>
      <p><strong>Price:</strong> ${event.ticketPrice > 0 ? event.ticketPrice.toFixed(2) : 'Free'}</p>
      {userRole === "Manager" && (
        <div className="manager-actions">
          <button className="btn" onClick={() => navigate(`/manage/edit/${event._id}`)}>Edit Event</button>
          <button className="btn cancel-btn" onClick={handleDelete}>Delete Event</button>
          {eventGroup ? (
            <button className="btn secondary" onClick={() => navigate(`/groups/${eventGroup._id}`)}>View Group</button>
          ) : (
            <button className="btn secondary" onClick={() => navigate(`/events/${event._id}/create-group`)}>Create Group</button>
          )}
        </div>
      )}

      {userRole === "User" && (
        <div className="user-actions-container">
          {!hasJoined ? (
            <button className="btn primary join-btn" onClick={handleJoin}>Join Now</button>
          ) : (
            <>
              {isPastEvent ? (
                userRating ? (
                <div className="user-rating-display">
                  <h3>Your Rating</h3>
                  <div className="star-rating-display">
                    
                    {[...Array(5)].map((_, i) => <span key={i} className={i < userRating.score ? "star selected" : "star"}>★</span>)}
                     {userRating.comment && <p className="user-comment">"{userRating.comment}"</p>}
                  </div>
                </div>
                ) : (
                  <FeedbackForm onSubmit={handleRateEvent} />
                )
              ) : (
                <div className="user-ticket-info">
                  <h3>Your Ticket is Confirmed!</h3>
                  <p>Present this QR code at the event entrance.</p>
                  <div className="ticket-qr-code">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GatherUp-Ticket-EventID:${event._id}-UserID:${userId}`}
                      alt="Your Event Ticket QR Code" 
                    />
                  </div>
                   {eventGroup && (
                    <button className="btn secondary" onClick={() => navigate(`/groups/${eventGroup._id}`)}>
                      View Event Group
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}