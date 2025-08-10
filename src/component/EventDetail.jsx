import React from "react";
import "../styles/Home.css";

export default function EventDetail({ event }) {
  if (!event) {
    return (
      <div className="event-details">
        <p>Select an event to see details.</p>
      </div>
    );
  }

  // If the image is stored as a File (local) or URL (from backend)
  const imageSrc =
    event.image instanceof File
      ? URL.createObjectURL(event.image)
      : event.image || null;

  return (
    <div className="event-details">
      <h1>{event.name}</h1>

      {imageSrc && (
        <img
          src={imageSrc}
          alt={event.name}
          style={{
            width: "100%",
            maxWidth: "400px",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      )}

      <p>
        <strong>Date:</strong> {event.date}
      </p>
      <p>{event.description}</p>
    </div>
  );
}
