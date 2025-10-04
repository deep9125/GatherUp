import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';
import axios from 'axios';
const API_URL = 'http://localhost:3000/api';
export default function CreateGroupPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext();
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error('Please enter a group name.');
      return;
    }
    setLoading(true);
    const createdBy = user?.user?.id || user?._id;
    const newGroupData = {
      name: groupName.trim(),
      eventId: eventId,
      createdBy: createdBy,
    };

    try {
      const response = await axios.post(`${API_URL}/groups`, newGroupData);
      const newGroup = response.data;
      
      toast.success(`Group "${newGroup.name}" created!`);
      navigate(`/groups/${newGroup._id}`); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create group.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-form-container">
      <h2>Create a New Group</h2>
      <p>Create a discussion group for this event.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="groupName">Group Name</label>
          <input
            type="text"
            id="groupName"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Study Buddies"
            required
          />
        </div>
        <div className="form-actions">
          <button type="button" className="btn cancel-btn" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" className="btn submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Group'}
          </button>
        </div>
      </form>
    </div>
  );
}