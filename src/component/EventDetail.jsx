// src/component/EventDetail.jsx
import React from "react";
import "../styles/Home.css";

// We now pass `userRole` to conditionally render buttons
export default function EventDetail({ event, userRole,handleEdit }) {
  if (!event) {
    return (
      <div className="event-detail-container">
        <h2>Select an event to see the details</h2>
      </div>
    );
  }

  const eventDate = new Date(event.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="event-detail-container scrollable">
      <h2 className="event-title">{event.name}</h2>
      <p className="event-date"><strong>Date:</strong> {eventDate}</p>
      <div className="event-description"><p>{event.description}</p></div>
      
      {userRole === "Manager" && (
        <div className="manager-actions">
          <button className="btn primary" onClick={() => handleEdit()} >Edit Event</button>
          <button className="btn secondary">Delete Event</button>
        </div>
      )}

      {/* {userRole === "User" && (
        <button className="btn primary join-btn">Join Now / Buy Ticket</button>
      )}  */}
    </div>
  );
}