import React, { useState } from "react";
import "../styles/Home.css";

export default function AddEventForm({ onAddEvent, onClose }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // This now only stores the selected file

  // The handleImageChange function is now much simpler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !description || !image) {
      return alert("All fields including image are required");
    }
    // We pass the image file object itself (or its name) instead of a preview
    onAddEvent({ name, date, description, image: image });
    onClose();
  };

  return (
    <div className="add-event-form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="eventName">Event Name</label>
          <input
            id="eventName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Annual Tech Conference"
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventDate">Date</label>
          <input
            id="eventDate"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="eventImage">Event Image</label>
          <input
            id="eventImage"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        {/* --- The image preview line has been removed --- */}

        <div className="form-group">
          <label htmlFor="eventDescription">Description</label>
          <textarea
            id="eventDescription"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe your event..."
            rows="5"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn primary">
            Add Event
          </button>
        </div>
      </form>
    </div>
  );
}