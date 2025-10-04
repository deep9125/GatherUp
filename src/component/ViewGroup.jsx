import React,{ useState, useEffect, useRef } from 'react'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import '../styles/Home.css';

const API_URL = 'http://localhost:3000/api';

export default function ViewGroupPage() {
  const { id: groupId } = useParams();
  const navigate = useNavigate();
  const { user } = useAppContext(); 
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const chatBoxRef = useRef(null);
  const fetchGroup = async () => {
    try {
      const response = await axios.get(`${API_URL}/groups/${groupId}`);
      setGroup(response.data);
    } catch (err) {
      setError("Could not load group data.");
      console.error(err);
    }
  };
  useEffect(() => {
    fetchGroup().finally(() => setLoading(false));
    const intervalId = setInterval(fetchGroup, 5000);
    return () => clearInterval(intervalId);
  }, [groupId]);
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [group?.messages]);
  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const currentUserId = user?.user?.id || user?._id;
    const currentUsername = user?.user?.displayName || user?.displayName;
    try {
      await axios.post(`${API_URL}/groups/${groupId}/messages`, {
        userId: currentUserId,
        username: currentUsername, 
        text: newMessage.trim(),
      });
      setNewMessage("");
      fetchGroup();
    } catch (err) {
      toast.error("Failed to send message.");
      console.error(err);
    }
  };
  if (loading) return <div>Loading group chat...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!group) return <h2>Group Not Found</h2>;
  const currentUserId = user?.user?.id || user?._id;
  return (
    <div className="view-group-form">
      <h2>Group Chat for {group.name}</h2>
      <div className="chat-box" ref={chatBoxRef}>
        {group.messages.map((msg) => (
          <div
            key={msg._id}
            className={`chat-message ${msg.userId?._id === currentUserId ? "my-msg" : "other-msg"}`}
          >
            <div className="message-sender-info">
              <strong>{msg.userId?.displayName || 'Unknown User'}</strong>
            </div>
            <p>{msg.text}</p>
          </div>
        ))}
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
      <button className="btn cancel-btn" onClick={() => navigate(`/events/${group.eventId}`)}>
        Back to Event
      </button>
    </div>
  );
}