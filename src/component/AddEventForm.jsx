import React, { useState } from "react";
import "../styles/Home.css";

export default function AddEventForm({ onAddEvent, onClose }) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null); // Store file
  const [preview, setPreview] = useState(null); // For preview

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);

      // Generate preview
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !date || !description || !image)
      return alert("All fields including image are required");

    // Call parent with event data
    onAddEvent({ name, date, description, image });

    // Reset form
    setName("");
    setDate("");
    setDescription("");
    setImage(null);
    setPreview(null);

    onClose();
  };

  return (
    <div className="add-event-form">
      <h3>Add New Event</h3>
      <form onSubmit={handleSubmit}>
        
        <label className="description-label">
          Event Name: <span style={{ color: "red" }}>*</span>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name"
          />
        </label>

        <label className="description-label">
          Date: <span style={{ color: "red" }}>*</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <label className="description-label">
          Description: <span style={{ color: "red" }}>*</span>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Event description"
          />
        </label>
        
        <label className="description-label">
          Event Image: <span style={{ color: "red" }}>*</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </label>

        <div className="button-row">
          <button type="submit">Add Event</button>
          <button type="button" onClick={onClose} style={{ marginLeft: 8 }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
