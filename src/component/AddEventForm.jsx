// src/component/AddEventForm.jsx
import React, { useState } from "react";
import "../styles/Home.css";

export default function AddEventForm({ onAddEvent, onClose }) {
  // Use a single state object for all form data, making it cleaner
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
    ticketPrice: "",
    image: null,
  });
  
  const [imagePreview, setImagePreview] = useState(null); // State for the image preview URL
  const [error, setError] = useState(""); // State for handling form errors

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({ ...prevData, image: file }));
      // Create a URL for the selected file to use as a preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Check all required fields, including the new ones
    if (!formData.name || !formData.date || !formData.location || !formData.image) {
      setError("Please fill in all required fields (Name, Date, Location, Image).");
      return;
    }
    setError(""); // Clear error on successful submission
    onAddEvent(formData);
    onClose();
  };

  return (
    <div className="add-event-form-container">
      <h2>Create New Event</h2>
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
        </div>

        <div className="form-group">
          <label htmlFor="eventImage">Event Image</label>
          <input type="file" id="eventImage" name="image" accept="image/*" onChange={handleImageChange} required />
        </div>
        
        {/* --- Image Preview --- */}
        {imagePreview && (
          <div className="form-group image-preview-container">
            <p>Image Preview:</p>
            <img src={imagePreview} alt="Selected event" className="image-preview" />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange}></textarea>
        </div>

        <div className="form-actions">
          <button type="button" className="btn cancel-btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn submit-btn">Add Event</button>
        </div>
      </form>
    </div>
  );
}