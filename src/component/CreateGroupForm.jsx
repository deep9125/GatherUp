// src/component/CreateGroupForm.jsx
import React from "react";
import "../styles/Home.css";

export default function CreateGroupForm({ event, onClose }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle group creation logic here
    console.log("Creating group for event:", event);
    onClose();
  };

  return (
    <div className="create-group-form">
      <h2>Create Group for Event: {event.name}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="groupName">Group Name:</label>
          <input type="text" id="groupName" required />
        </div>
        <button type="submit" className="btn">Create Group</button>
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
