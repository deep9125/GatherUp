import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import '../styles/Home.css';

export default function ViewGroupPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  // Get the list of all users from the context
  const { user, groups, events, users, dispatch } = useAppContext();
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null);

  const group = React.useMemo(() => groups.find(g => g.id == groupId), [groups, groupId]);
  const event = React.useMemo(() => {
    if (!group) return null;
    return events.find(e => e.id == group.eventId);
  }, [events, group]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [group?.messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const messagePayload = {
      sender: user.uid,
      text: newMessage.trim(),
    };
    dispatch({ type: 'ADD_MESSAGE_TO_GROUP', payload: { groupId: group.id, message: messagePayload } });
    setNewMessage("");
  };

  if (!group || !event) {
    return (
      <div className="event-detail-container">
        <h2>Group Not Found</h2>
        <button className="btn" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="view-group-form">
      <h2>Group Chat for {event.name}</h2>

      <div className="chat-box" ref={chatBoxRef}>
        {group.messages.map((msg, index) => {
          // --- NEW: Look up sender's info ---
          const senderInfo = users.find(u => u.uid === msg.sender);
          const senderName = senderInfo ? senderInfo.displayName : 'Unknown User';
          const senderRole = senderInfo ? senderInfo.role : '';

          return (
            <div
              key={index}
              className={`chat-message ${msg.sender === user.uid ? "my-msg" : "other-msg"}`}
            >
              {/* --- NEW: Display sender's info --- */}
              <div className="message-sender-info">
                <strong>{senderName}</strong>
                {senderRole && <span className="sender-role">{senderRole}</span>}
              </div>
              <p>{msg.text}</p>
            </div>
          );
        })}
      </div>

      <form className="chat-input" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit" className="btn">Send</button>
      </form>

      <button className="btn cancel-btn" onClick={() => navigate(`/events/${event.id}`)}>
        Back to Event
      </button>
    </div>
  );
}