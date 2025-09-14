import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { toast } from 'react-hot-toast';

export default function CreateGroupPage() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();
  const { user, dispatch } = useAppContext();
  const [groupName, setGroupName] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!groupName.trim()) {
      toast.error('Please enter a group name.');
      return;
    }

    const newGroup = {
      id: `grp_${Date.now()}`,
      eventId: eventId,
      name: groupName.trim(),
      managerId: user.uid,
      messages: [], // <-- ADD THIS LINE
      members: [user.uid], // The creator is the first member
    };

    dispatch({ type: 'CREATE_GROUP', payload: newGroup });
    toast.success(`Group "${newGroup.name}" created!`);
    navigate(`/groups/${newGroup.id}`); // Navigate to the new group's page
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
          <button type="submit" className="btn submit-btn">Create Group</button>
        </div>
      </form>
    </div>
  );
}