// src/component/EditEventForm.jsx
import React, { useState, useEffect } from "react";
import "../styles/Home.css"; // Assuming shared styles with Home

export default function EditEventForm({ event, onUpdateEvent, onClose }) {
  // State to hold form data, now includes all editable fields
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    capacity: 0,
    ticketPrice: 0,
  });
  
  const [error, setError] = useState(""); // State for handling form errors

  // Effect to update form if the selected event prop changes
  useEffect(() => {
    if (event) {
      // Format date for the input field (YYYY-MM-DD)
      const eventDate = new Date(event.date).toISOString().split('T')[0];
      setFormData({
        name: event.name || "",
        date: eventDate || "",
        location: event.location || "",
        description: event.description || "",
        capacity: event.capacity || 0,
        ticketPrice: event.ticketPrice || 0,
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
    // Simple validation
    if (!formData.name || !formData.date || !formData.location) {
        setError("Please fill in all required fields (Name, Date, Location).");
        return;
    }
    setError(""); // Clear error on successful submission
    // Pass the full updated event object back
    onUpdateEvent({ ...event, ...formData });
  };

  if (!event) {
    return <p>No event selected to edit. Please select an event from the list.</p>
  }

  return (
    <div className="add-event-form-container">
      <h2>Edit Event: {event.name}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {/* Display error message if it exists */}
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="location">Location</label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required />
        </div>

        {/* Grouping for numeric inputs */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="capacity">Capacity</label>
            <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="ticketPrice">Ticket Price ($)</label>
            <input type="number" id="ticketPrice" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} min="0" />
          </div>
          <div className="form-group">
            <label htmlFor="ticketsSold">Tickets Sold</label>
            {/* Tickets sold is usually a calculated value, so we make it read-only */}
            <input type="number" id="ticketsSold" name="ticketsSold" value={event.ticketsSold || 0} readOnly disabled />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn submit-btn">Save Changes</button>
          <button type="button" className="btn cancel-btn" onClick={onClose}>Cancel</button>
        </div>
      </form>
    </div>
  );
}