import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAppContext } from '../context/AppContext';
import FeedbackForm from "./FeedbackForm";
import '../styles/Home.css';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, events, joinedEvents, ratings, groups, dispatch } = useAppContext();

  const event = React.useMemo(() => events.find(e => e.id == id), [events, id]);
  const hasJoined = React.useMemo(() => joinedEvents.some(e => e.id == id), [joinedEvents, id]);
  const eventGroup = React.useMemo(() => groups.find(g => g.eventId == id), [groups, id]);
  const userRating = ratings[id];
  const isPastEvent = event ? new Date(event.date) < new Date() : false;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete the event: "${event.name}"?`)) {
      dispatch({ type: 'DELETE_EVENT', payload: event.id });
      toast.success('Event deleted successfully.');
      navigate('/dashboard');
    }
  };

  const handleJoin = () => {
    dispatch({ type: 'JOIN_EVENT', payload: event });
    navigate(`/ticket/${event.id}`);
  };

  const handleRateEvent = (ratingData) => {
    dispatch({ type: 'RATE_EVENT', payload: { eventId: event.id, ratingData } });
    toast.success("Thank you for your feedback!");
  };
  
  // Handlers for group actions
  const handleCreateGroup = () => navigate(`/events/${event.id}/create-group`);
  const handleViewGroup = () => navigate(`/groups/${eventGroup.id}`);


  if (!event) {
    return (
      <div className="event-detail-container">
        <h2>Event Not Found</h2>
      </div>
    );
  }

  const formattedDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  const UserRatingDisplay = ({ rating }) => (
    <div className="user-rating-display">
      <h3>Your Rating</h3>
      <div className="star-rating-input">
        {[...Array(5)].map((n, i) => <span key={i} className={i < rating.rating ? "star selected" : "star"}>★</span>)}
      </div>
      {rating.comment && <p className="user-comment">"{rating.comment}"</p>}
    </div>
  );

  return (
    <div className="event-detail-container scrollable">
      <h2 className="event-title">{event.name}</h2>
      <img src={event.image} alt={event.name} className="event-detail-image" />
      <p className="event-date"><strong>Date:</strong> {formattedDate}</p>
      <div className="event-description"><p>{event.description}</p></div>
      <p className="event-location"><strong>Location:</strong> {event.location}</p>
      <p className="event-capacity"><strong>Capacity:</strong> {event.attendees || 0} / {event.capacity}</p>
      <p className="event-price"><strong>Price:</strong> ${event.ticketPrice}</p>

      {user.role === "Manager" && (
        <div className="manager-actions">
          <button className="btn" onClick={() => navigate(`/manage/edit/${event.id}`)}>Edit Event</button>
          <button className="btn cancel-btn" onClick={handleDelete}>Delete Event</button>
          {/* Conditional Group Button for Manager */}
          {eventGroup ? (
            <button className="btn secondary" onClick={handleViewGroup}>View Group</button>
          ) : (
            <button className="btn secondary" onClick={handleCreateGroup}>Create Group</button>
          )}
        </div>
      )}

      {user.role === "User" && (
        <div className="user-actions-container">
          {!hasJoined ? (
            <button className="btn primary join-btn" onClick={handleJoin}>Join Now / Buy Ticket</button>
          ) : (
            <>
              {isPastEvent ? (
                 <>
                  {userRating ? <UserRatingDisplay rating={userRating} /> : <FeedbackForm onSubmit={handleRateEvent} />}
                </>
              ) : (
                <div className="user-ticket-info">
                  <h3>Your Ticket for this Event</h3>
                  <p>Present this QR code at the event entrance for entry.</p>
                  <div className="ticket-qr-code">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GatherUp-Ticket-EventID:${event.id}-UserID:${user.uid}`}
                      alt="Your Event Ticket QR Code"
                    />
                  </div>
                  {/* Conditional Group Button for User */}
                  {eventGroup && (
                    <button className="btn secondary view-group-btn" onClick={handleViewGroup}>
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