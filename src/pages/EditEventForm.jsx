import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // Correct path
import '../styles/Home.css'; // Correct path

export default function EditEventForm() {
  // --- Hooks for routing and state management ---
  const { id } = useParams(); // Get event ID from the URL
  const navigate = useNavigate();
  const { events, dispatch } = useAppContext();

  // Find the specific event to edit from the global state
  // useMemo prevents recalculating this on every render
  const eventToEdit = React.useMemo(() => events.find(e => e.id === id), [events, id]);

  // --- Component State ---
  const [formData, setFormData] = React.useState({
    name: '',
    date: '',
    location: '',
    description: '',
    capacity: 0,
    ticketPrice: 0,
  });
  
  const [imageFile, setImageFile] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [error, setError] = React.useState('');

  // --- Effect to pre-fill the form when the event data is available ---
  React.useEffect(() => {
    if (eventToEdit) {
      // Format date for the input field (YYYY-MM-DD)
      const eventDate = new Date(eventToEdit.date).toISOString().split('T')[0];
      setFormData({
        name: eventToEdit.name || '',
        date: eventDate || '',
        location: eventToEdit.location || '',
        description: eventToEdit.description || '',
        capacity: eventToEdit.capacity || 0,
        ticketPrice: eventToEdit.ticketPrice || 0,
      });
      // Set the initial image preview from the existing event
      setImagePreview(eventToEdit.image);
    }
  }, [eventToEdit]);

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
      // Create a URL for the newly selected file to use as a preview
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.date || !formData.location) {
      setError('Please fill in all required fields (Name, Date, Location).');
      return;
    }
    setError('');

    // Construct the updated event object, keeping existing data
    const updatedEvent = {
      ...eventToEdit, // Start with original event data
      ...formData,    // Overwrite with form data
      image: imagePreview, // Use the new (or old) image preview URL
      capacity: parseInt(formData.capacity, 10) || 0,
      ticketPrice: parseFloat(formData.ticketPrice) || 0,
    };

    // Dispatch the update action to the global state
    dispatch({ type: 'UPDATE_EVENT', payload: updatedEvent });

    // Navigate to the event's detail page after saving
    navigate(`/events/${id}`);
  };

  // --- Render Logic ---
  // Handle case where the event ID from the URL is not found
  if (!eventToEdit) {
    return (
        <div className="add-event-form-container">
            <h2>Event Not Found</h2>
            <p>The event you are trying to edit does not exist.</p>
            <button className="btn" onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
        </div>
    );
  }

  return (
    <div className="add-event-form-container">
      <h2>Edit Event: {eventToEdit.name}</h2>
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
          {/* Use navigate hook for Cancel button */}
          <button type="button" className="btn cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn submit-btn">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

