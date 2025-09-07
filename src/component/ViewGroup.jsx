// src/component/ViewGroup.jsx
import React, { useState } from "react";
import "../styles/Home.css";

export default function ViewGroup({ event, userRole, onClose }) {
  const [messages, setMessages] = useState([
    { sender: "manager", text: "Welcome to the group!" },
    { sender: "user", text: "Thanks, glad to join 🚀" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Push manager's new message
    setMessages([...messages, { sender: "manager", text: newMessage }]);
    setNewMessage("");
  };

  return (
    <div className="view-group-form">
      <h2>Group Chat for {event.name}</h2>

      {/* Chat messages */}
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat-message ${msg.sender === "manager" ? "manager-msg" : "user-msg"}`}
          >
            <p>{msg.text}</p>
          </div>
        ))}
      </div>

      {/* Message input */}
      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn">Send</button>
      </form>

      <button className="btn cancel-btn" onClick={onClose}>Close</button>
    </div>
  );
}
