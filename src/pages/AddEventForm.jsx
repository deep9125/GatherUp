import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAppContext } from '../context/AppContext'; 
import { toast } from 'react-hot-toast';
import '../styles/Home.css'; 
const API_URL = 'http://localhost:3000/api';
export default function AddEventForm() {
  const { user, triggerRefetch  } = useAppContext();
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location || !imageFile) {
      toast.error("Please fill in all required fields.");
      return;
    }
    setError("");
    const eventData = new FormData();
    eventData.append('name', formData.name);
    eventData.append('date', formData.date);
    eventData.append('location', formData.location);
    eventData.append('description', formData.description);
    eventData.append('capacity', formData.capacity);
    const managerId = user?._id;
    eventData.append('managerId', managerId);
    eventData.append('eventImage', imageFile);
    eventData.append('ticketPrice', formData.ticketPrice || 0);
    try {
      const response = await axios.post(`${API_URL}/events/addEvent`, eventData);
      toast.success('Event created successfully!');
      triggerRefetch();
      navigate(`/events/${response.data._id}`); 
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create event.");
      console.error(err);
    } finally {
      setLoading(false);
    }
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
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Add Event'}
          </button>
        </div>
      </form>
    </div>
  );
}

