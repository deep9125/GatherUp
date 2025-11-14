import React, { useState, useEffect ,useMemo} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import {generateTicketCode} from '../utils/codeGenerator.js';
const API_URL = 'http://localhost:3000/api';
export default function AttendancePage() {
  const { id:eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [attendance, setAttendance] = useState({});
  const [isAttendanceActive, setIsAttendanceActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeMessage, setTimeMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/events/${eventId}`);
        setEvent(response.data);
        const now = new Date();
        const start = new Date(response.data.startTime);
        const end = new Date(response.data.endTime);
        if (now >= start && now <= end) {
          setIsAttendanceActive(true);
        } else if (now < start) {
          setTimeMessage(`Attendance will open on ${start.toLocaleString()}.`);
        } else {
          setTimeMessage("The attendance period for this event has closed.");
        }
        const initialAttendance = {};
        response.data.attendees.forEach(attendee => {
          initialAttendance[attendee._id] = response.data.presentAttendees.includes(attendee._id) ? 'present' : 'unknown';
        });
        setAttendance(initialAttendance);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load event data.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);
  const filteredAttendees = useMemo(() => {
    if (!event) return [];
    
    return event.attendees.filter(attendee => {
      const ticketCode = generateTicketCode(event._id, attendee._id);
      return ticketCode.toLowerCase().includes(searchTerm.toLowerCase());
    });
  }, [event, searchTerm]);
  const handleStatusChange = (userId, status) => {
    setAttendance(prev => ({ ...prev, [userId]: status }));
  };

  const handleSaveChanges = async () => {
    const presentUserIds = Object.keys(attendance).filter(id => attendance[id] === 'present');
    const absentUserIds = Object.keys(attendance).filter(id => attendance[id] === 'absent');
    
    try {
      await axios.post(`${API_URL}/events/${eventId}/attendance`, { presentUserIds, absentUserIds });
      toast.success("Attendance saved!");
      navigate(`/manage/analytics/${eventId}`);
    } catch (err) {
      toast.error("Failed to save attendance.");
    }
  };

  if (loading) return <div>Loading attendance sheet...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!event) return <h2>Event Not Found</h2>;

    if (!isAttendanceActive) {
      return (
      <div className="attendance-container">
        <div className="attendance-header">
          <h1>Manage Attendance</h1>
          <h2>{event.name}</h2>
        </div>
        <div className="empty-state">
          <h3>Attendance Not Open</h3>
          <p>{timeMessage}</p>
          <button className="btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
        </div>
      </div>
      );
    }
  return (
    <div className="attendance-container">
      <div className="attendance-header">
        <h1>Manage Attendance</h1>
        <h2>{event.name}</h2>
      </div>

      <div className="form-group" style={{ margin: '20px 0' }}>
        <input
          type="text"
          placeholder="Search by Ticket Code (e.g., GUP-1234)"
          className="form-control" 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ width: '100%', padding: '10px' }} 
        />
      </div>

      <div className="user-list">
        {filteredAttendees.length > 0 ? (
          filteredAttendees.map(attendee => (
            <div key={attendee._id} className="user-row">
              <div className="user-info">
                <span className="user-name">{attendee.displayName}</span>
                <span className="user-code">
                  {generateTicketCode(event._id, attendee._id)}
                </span>
              </div>
              <div className="attendance-radios">
                <label>
                  <input type="radio" name={`status-${attendee._id}`} checked={attendance[attendee._id] === 'present'} onChange={() => handleStatusChange(attendee._id, 'present')} /> Present
                </label>
                <label>
                  <input type="radio" name={`status-${attendee._id}`} checked={attendance[attendee._id] === 'absent'} onChange={() => handleStatusChange(attendee._id, 'absent')} /> Absent
                </label>
              </div>
            </div>
          ))
        ) : (
          <p>No attendees found matching "{searchTerm}".</p>
        )}
      </div>
      
      <div className="form-actions">
        <button className="btn primary" onClick={handleSaveChanges}>Save Changes</button>
      </div>
    </div>
  );
}