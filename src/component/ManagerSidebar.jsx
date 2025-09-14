import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // Corrected path

export default function ManagerSidebar() {
    const { events, user } = useAppContext();
    const navigate = useNavigate();
    const { id: selectedEventId } = useParams(); // Get the current event ID from the URL

    // Filter to get only the events created by the logged-in manager
    const managerEvents = events.filter(event => event.managerId === user.uid);

    // Navigate to the event's detail page when an event is clicked
    const handleSelectEvent = (event) => {
        navigate(`/events/${event.id}`);
    };

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
                        key={event.id}
                        // The 'active' class is applied if the event's ID matches the ID in the URL
                        className={selectedEventId === event.id ? "active" : ""}
                        onClick={() => handleSelectEvent(event)}
                    >
                        <span className="event-name">{event.name}</span>
                    </li>
                ))}
            </ul>
        </>
    );
}

