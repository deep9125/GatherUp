import React , { useState, useEffect }from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; 
import axios from 'axios';
const API_URL = 'http://localhost:3000/api';
export default function ManagerSidebar() {
    const { user, refetchTrigger } = useAppContext();
    const navigate = useNavigate();
    const { id: selectedEventId } = useParams(); 
    const [managerEvents, setManagerEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
    const managerId =user?._id;
    if (!managerId) {
      setLoading(false);
      return;
    }
    const fetchManagerEvents = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/events/manager/${managerId}`);
        setManagerEvents(response.data);
      } catch (err) {
        setError("Could not load events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchManagerEvents();
  }, [user,refetchTrigger]);
    const handleSelectEvent = (event) => {
        navigate(`/events/${event._id}`);
    };
  if (loading) return <div className="sidebar-loading">Loading events...</div>;
  if (error) return <div className="sidebar-error">{error}</div>;
    return (
        <>
            <div className="sidebar-header">
                <h2>My Events</h2>
                <button className="btn add-event-btn" onClick={() => navigate("/manage/add")}>
                    + Add Event
                </button>
            </div>
            <ul className="event-list">
                {managerEvents.map((event) => (
                    <li
                        key={event._id}
                        // The 'active' class is applied if the event's ID matches the ID in the URL
                        className={selectedEventId === event._id ? "active" : ""}
                        onClick={() => handleSelectEvent(event)}
                    >
                        <span className="event-name">{event.name}</span>
                    </li>
                ))}
            </ul>
        </>
    );
}

