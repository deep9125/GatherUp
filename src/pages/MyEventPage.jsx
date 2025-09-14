import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // Correct path to your context
import EventCard from '../component/EventCard'; // Correct path to your component

export default function MyEventsPage() {
    const { joinedEvents } = useAppContext();
    const navigate = useNavigate();

    // Handler to navigate to the detailed view of a specific event
    const handleViewDetails = (event) => {
        navigate(`/events/${event.id}`);
    };

    return (
        <div className="event-grid-container">
            <h2>My Joined Events ({joinedEvents.length})</h2>

            {joinedEvents.length > 0 ? (
                <div className="event-grid">
                    {joinedEvents.map(event => (
                        <EventCard
                            key={event.id}
                            event={event}
                            // The card only needs a "View Details" button on this page
                            onViewDetails={() => handleViewDetails(event)}
                        />
                    ))}
                </div>
            ) : (
                <div className="empty-state">
                    <p>You haven't joined any events yet.</p>
                    <button className="btn" onClick={() => navigate('/')}>
                        Browse Events
                    </button>
                </div>
            )}
        </div>
    );
}
