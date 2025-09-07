import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import initialEvents from "../mockEvents"; 
import EventDetail from "../component/EventDetail";
import AddEventForm from "../component/AddEventForm";
import ManagerDashboard from "../component/ManagerDashboard";
import UserDashboard from "../component/UserDashboard";
import EventCard from "../component/EventCard";
import EditEventForm from "../component/EditEventForm"

const mockUser = {
  uid: "test123",
  email: "test@gatherup.com",
  displayName: "TEST",
  role: "Manager", // <-- CHANGE THIS TO "User" TO TEST THE OTHER VIEW
};

export default function Home() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);  //for Manager Which Event is Selected Currently
  const [joinedEvents, setJoinedEvents] = useState([]);  // for User List of all joined events
  const [view, setView] = useState(mockUser.role === "Manager" ? "eventDetail" : "allEvents");

  useEffect(() => {
    if (mockUser.role === "Manager" && events.length > 0 && !selectedEvent) {
      setSelectedEvent(events[0]);
    }
  }, [events, selectedEvent]);

  const handleAddEvent = (newEvent) => {
    const eventWithId = { ...newEvent, id: `evt_${Date.now()}`, managerId: mockUser.uid };
    const updatedEvents = [...events, eventWithId];
    setEvents(updatedEvents);
    setSelectedEvent(eventWithId);
    setView("eventDetail");
  };
  
  const handleShowEditForm = () => {
    setView("editForm");
  };

  const handleDeleteEvent = (eventId) => {
    console.log("Deleting event with ID:", eventId);
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    console.log("Updated events after deletion:", updatedEvents);
    setSelectedEvent(updatedEvents.length > 0 ? updatedEvents[0] : null);
  }

  const handleUpdateEvent = (updatedEventData) => {
    const updatedEvents = events.map(event => 
      event.id === updatedEventData.id ? updatedEventData : event
    );
    setEvents(updatedEvents);
    setSelectedEvent(updatedEventData); // Also update the currently selected event
    setView("eventDetail"); // Switch back to the detail view after updating
  };

  const handleJoinEvent = (eventId) => {
    if (joinedEvents.find(e => e.id === eventId)) {
      alert("You have already joined this event!");
      return;
    }
    const eventToJoin = events.find(e => e.id === eventId);
    setJoinedEvents([...joinedEvents, eventToJoin]);
    alert(`Successfully joined: ${eventToJoin.name}`);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setView("eventDetail");
  };
  
  const handleLogout = () => window.location.reload();

  const renderMainContent = () => {
    if (mockUser.role === "Manager") {
      switch (view) {
        case "addForm":
          return <AddEventForm onAddEvent={handleAddEvent} onClose={() => setView("eventDetail")} />;
        case "dashboard":
          return <ManagerDashboard user={mockUser}  />;
        case "editForm":
          return <EditEventForm event={selectedEvent} onUpdateEvent={handleUpdateEvent} onClose={() => setView("eventDetail")} />;
        case "eventDetail":
        default:
          return <EventDetail event={selectedEvent} userRole={mockUser.role} handleEdit={handleShowEditForm} handleDelete={handleDeleteEvent} />;
      }
    } else { // User Role
      switch (view) {
        case "dashboard":
          return <UserDashboard user={mockUser} myEvents={joinedEvents} />;
        case "myEvents":
          return (
            <div className="event-grid-container">
              <h2>My Joined Events ({joinedEvents.length})</h2>
              {joinedEvents.length > 0 ? (
                <div className="event-grid">{joinedEvents.map(event => <EventCard key={event.id} event={event} />)}</div>
              ) : (<p>You haven't joined any events yet.</p>)}
            </div>
          );
        case "allEvents":
        default:
          return (
            <div className="event-grid-container">
              <h2>All Events ({events.length})</h2>
              <div className="event-grid">{events.map(event => <EventCard key={event.id} event={event} onJoin={handleJoinEvent} />)}</div>
            </div>
          );
      }
    }
  };

  return (
    <div className="home-container">
      <header className="header">
        <h3>🗓️ Gather Up</h3>
        <div className="header-actions">
          {mockUser.role === "Manager" && (
            <button className="btn dashboard-btn" onClick={() => setView("dashboard")}>Manager Dashboard</button>
          )}
          <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div className="main-content">
        <aside className="sidebar scrollable">
          {mockUser.role === "Manager" ? (
            <>
              <div className="sidebar-header">
                <h2>Events</h2>
                <button className="btn add-event-btn" onClick={() => setView("addForm")}>+ Add Event</button>
              </div>
              <ul className="event-list">
                {events.map((event) => (
                  <li key={event.id} className={selectedEvent?.id === event.id ? "active" : ""} onClick={() => handleSelectEvent(event)}>
                    <span className="event-name">{event.name}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            // User Sidebar
            <>
              <div className="sidebar-header">
                <h2>Welcome, {mockUser.displayName}!</h2>
              </div>
              <ul className="navigation-menu">
                <li className={view === 'allEvents' ? 'active' : ''} onClick={() => setView('allEvents')}>Browse All Events</li>
                <li className={view === 'myEvents' ? 'active' : ''} onClick={() => setView('myEvents')}>My Joined Events</li>
                <li className={view === 'dashboard' ? 'active' : ''} onClick={() => setView('dashboard')}>My Dashboard</li>
              </ul>
            </>
          )}
        </aside>

        <div className="vertical-line"></div>
        <main className="content-area scrollable">
          {renderMainContent()}
        </main>
      </div>
    </div>
  );
}