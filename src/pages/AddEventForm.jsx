import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
// Corrected path to use plural 'contexts' folder
import { useAppContext } from '../context/AppContext'; 
// Corrected path to use plural 'styles' folder
import '../styles/Home.css'; 

export default function AddEventForm() {
  // --- State and Hooks ---
  const { user, dispatch } = useAppContext();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    capacity: "",
    ticketPrice: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // --- Handlers ---
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
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location || !imageFile) {
      setError("Please fill in all required fields (Name, Date, Location, Image).");
      return;
    }
    setError("");

    const newEvent = {
      ...formData,
      id: `evt_${Date.now()}`,
      managerId: user.uid,
      image: imagePreview,
      attendees: 0,
      capacity: parseInt(formData.capacity, 10) || 0,
      ticketPrice: parseFloat(formData.ticketPrice) || 0,
    };

    dispatch({ type: 'ADD_EVENT', payload: newEvent });
    navigate(`/events/${newEvent.id}`);
  };

  return (
    <div className="add-event-form-container">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit} noValidate>
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

        <div className="form-row">
            <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input type="number" id="capacity" name="capacity" value={formData.capacity} onChange={handleChange} min="0" />
            </div>
            <div className="form-group">
                <label htmlFor="ticketPrice">Ticket Price ($)</label>
                <input type="number" id="ticketPrice" name="ticketPrice" value={formData.ticketPrice} onChange={handleChange} min="0" step="0.01" />
            </div>
        </div>

        <div className="form-group">
          <label htmlFor="eventImage">Event Image</label>
          <input type="file" id="eventImage" name="image" accept="image/*" onChange={handleImageChange} required />
        </div>
        
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
          <button type="button" className="btn cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn submit-btn">Add Event</button>
        </div>
      </form>
    </div>
  );
}

