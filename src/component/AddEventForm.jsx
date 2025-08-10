import React, { useState } from "react";

export default function AddEventForm({ onAddEvent, onClose }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !description) return alert("All fields are required");

    // Call the parent callback with new event data
    onAddEvent({ name, date, description });

    // Clear form and close modal or form
    setName("");
    setDate("");
    setDescription("");
    onClose();
  };

  return (
    <div className="add-event-form">
      <h3>Add New Event</h3>
      <form onSubmit={handleSubmit}>
        <label>
          Event Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name"
          />
        </label>

        <label>
          Date:
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label>
          Description:
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description"
          />
        </label>

        <button type="submit">Add Event</button>
        <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
          Cancel
        </button>
      </form>
    </div>
  );
}
