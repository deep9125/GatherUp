import React,{useState,useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; 
import axios from 'axios';
import '../styles/Home.css'; 
const toLocalISOString = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const tzOffset = date.getTimezoneOffset() * 60000; 
  const localDate = new Date(date.getTime() - tzOffset);
  return localDate.toISOString().slice(0, 16);
};
const API_URL = 'http://localhost:3000';
export default function EditEventForm() {
  const { id: eventId } = useParams(); 
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null); 
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/api/events/${eventId}`);
        const eventToEdit = response.data;
        setFormData({ ...eventToEdit, startTime: toLocalISOString(eventToEdit.startTime),
          endTime: toLocalISOString(eventToEdit.endTime), });
        setImagePreview(`${API_URL}/${eventToEdit.imageUrl}`); 
      } catch (err) {
        setError('Failed to load event data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);
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
    if (!formData.name || !formData.startTime || !formData.endTime || !formData.location) {
      toast.error('Please fill in all required fields.');
      return;
    }
    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);

    if (start >= end) {
      toast.error("Event start time must be before the end time.");
      return; 
    }
    setLoading(true);
    const eventData = new FormData();
    Object.keys(formData).forEach(key => {
      eventData.append(key, formData[key]);
    });
    if (imageFile) {
      eventData.append('eventImage', imageFile);
    }
    try {
      const response = await axios.put(`${API_URL}/api/events/${eventId}`, eventData);
      toast.success('Event updated successfully!');
      navigate(`/events/${response.data._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update event.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  if (loading) return <div>Loading form...</div>;
  if (error || !formData) return <div className="error-message">{error || "Event not found."}</div>;
  return (
    <div className="add-event-form-container">
      <h2>Edit Event: {formData.name}</h2>
      <form onSubmit={handleSubmit} noValidate>
        {error && <p className="form-error">{error}</p>}

        <div className="form-group">
          <label htmlFor="name">Event Name</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">Start Time</label>
            <input type="datetime-local" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="endTime">End Time</label>
            <input type="datetime-local" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} required />
          </div>
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
          <label htmlFor="eventImage">Change Event Image</label>
          <input type="file" id="eventImage" name="image" accept="image/*" onChange={handleImageChange} />
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
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}

