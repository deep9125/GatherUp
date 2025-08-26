import React, { useState, useEffect } from "react";
import "../styles/Home.css"; // Assuming shared styles with Home

export default function EditEventForm({ event, onUpdateEvent, onClose }) {
  // Initialize state with the event prop. 
  // If event is null, use empty strings as a fallback.
  const [formData, setFormData] = useState({
    name: event?.name || "",
    date: event?.date || "",
    location: event?.location || "",
    description: event?.description || "",
  });

  // Effect to update form if the selected event prop changes
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        date: event.date,
        location: event.location,
        description: event.description,
      });
    }
  }, [event]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location) {
        alert("Please fill in all required fields (Name, Date, Location).");
        return;
    }
    // Pass the full updated event object, including the un-editable id and managerId
    onUpdateEvent({ ...event, ...formData });
  };

  // If for some reason no event is selected, show a message.
  if (!event) {
    return <p>No event selected to edit. Please select an event from the list.</p>
  }

  return (
    <div className="form-container">
      <h2>Edit Event: {event.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={formData.description}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn submit-btn">Save Changes</button>
          <button type="button" className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}