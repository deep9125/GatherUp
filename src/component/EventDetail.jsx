// src/component/EventDetail.jsx
import React from "react";
import "../styles/Home.css";
import FeedbackForm from "./FeedbackForm"; // <-- Make sure you have created this file

// Add `userRating` and `onRateEvent` to the props
export default function EventDetail({ event, userRole, handleEdit, handleDelete, handleCreateGroup, hasCreatedGroup, handleViewGroup, handleJoin, hasJoined, hasGroup, userRating, onRateEvent }) {
  
  if (!event) {
    return (
      <div className="event-detail-container">
        <h2>Select an event to see the details</h2>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const isPastEvent = eventDate < new Date(); // Check if the event date is in the past

  const formattedDate = eventDate.toLocaleDateString("en-US", {
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
      <p className="event-date"><strong>Date:</strong> {formattedDate}</p>
      <div className="event-description"><p>{event.description}</p></div>
      <p className="event-location"><strong>Location:</strong> {event.location}</p>
      <p className="event-capacity"><strong>Capacity:</strong> {event.capacity}</p>
      <p className="event-price"><strong>Price:</strong> ${event.ticketPrice}</p> 

      {/* --- MANAGER ACTIONS (Unchanged) --- */}
      {userRole === "Manager" && (
        <div className="manager-actions">
            <button onClick={handleEdit}>Edit Event</button>
            <button onClick={() => handleDelete(event.id)}>Delete Event</button>
            {hasCreatedGroup ? 
                (<button onClick={() => handleViewGroup(event)}>View Group</button>)
            : (<button onClick={() => handleCreateGroup(event)}>Create Group</button>)}
        </div>
      )}

      {/* --- USER ACTIONS (All logic is now inside this component) --- */}
      {userRole === "User" && (
        <div className="user-actions-container">
          {!hasJoined ? (
            // 1. If user has NOT joined, show the join button
            <button className="btn primary join-btn" onClick={handleJoin}>Join Now / Buy Ticket</button>
          ) : (
            // 2. If user HAS joined...
            <>
              {isPastEvent ? (
                // 2a. And the event is in the past...
                <>
                  {userRating ? (
                    // ...and they have already rated it, show their rating.
                    <UserRatingDisplay rating={userRating} />
                  ) : (
                    // ...and they have NOT rated it, show the feedback form.
                    <FeedbackForm onSubmit={onRateEvent} />
                  )}
                </>
              ) : (
                // 2b. And the event is in the future, show their ticket.
                <div className="user-ticket-info">
                  <h3>Your Ticket for this Event</h3>
                  <p>Present this QR code at the event entrance for entry.</p>
                  <div className="ticket-qr-code">
                    
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=GatherUp-Ticket-EventID:${event.id}-UserID:test123`}
                      alt="Your Event Ticket QR Code" 
                    />
                  </div>
                  {hasGroup && (
                    <button className="btn secondary view-group-btn" onClick={() => handleViewGroup(event)}>
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