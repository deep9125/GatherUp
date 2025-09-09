import React, { useState, useEffect } from "react";
import "../styles/Home.css";
import initialEvents from "../mockEvents"; 
import EventDetail from "../component/EventDetail";
import AddEventForm from "../component/AddEventForm";
import ManagerDashboard from "../component/ManagerDashboard";
import UserDashboard from "../component/UserDashboard";
import EventCard from "../component/EventCard";
import EditEventForm from "../component/EditEventForm"
import CreateGroupForm from "../component/CreateGroupForm";
import ViewGroup from "../component/ViewGroup";
import TicketPage from "../component/TicketPage";
import EventAnalytics from "../component/EventAnalytics";
import Navbar from "../component/Navbar";         
import Footer from "../component/Footer";         
import { Toaster, toast } from 'react-hot-toast'; 

const mockUser = {
  uid: "test123",
  email: "test@gatherup.com",
  displayName: "TEST",
  role: "Manager", 
};

export default function Home() {
  const [events, setEvents] = useState(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState(null);  
  const [joinedEvents, setJoinedEvents] = useState([]);  
  const [view, setView] = useState(mockUser.role === "Manager" ? "eventDetail" : "allEvents");
  const [eventsGroup, setEventsGroup] = useState([]); 
  const [ratings, setRatings] = useState({}); 
  useEffect(() => {
    if (mockUser.role === "Manager" && !selectedEvent) {
      // First, create a new list of only the manager's events
      const managersEvents = events.filter(event => event.managerId === mockUser.uid);
      // Then, if that list has events in it, select the first one
      if (managersEvents.length > 0) {
        setSelectedEvent(managersEvents[0]);
      }
    }
  }, [events, selectedEvent]);

  const handleViewDetails = (event) => {
    setSelectedEvent(event);
    setView("eventDetail_User"); // Set a new, specific view for the user's detail page
  };

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
    // This part is the same: remove the event from the main list
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);

    // THIS IS THE NEW, CORRECTED LOGIC:
    // After deleting, we re-filter the list to find what's left for the current manager
    const remainingManagersEvents = updatedEvents.filter(
      event => event.managerId === mockUser.uid
    );

    // Now, we select the new default event from the manager's OWN list.
    // If their list is empty, we correctly select null.
    setSelectedEvent(remainingManagersEvents.length > 0 ? remainingManagersEvents[0] : null);
  };

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
      toast.error("You have already joined this event!");
      return;
    }
    const eventToJoin = events.find(e => e.id === eventId);
    setJoinedEvents([...joinedEvents, eventToJoin]);
    
    // NEW: After joining, set the selected event and change the view
    setSelectedEvent(eventToJoin);
    setView("ticketPage"); 
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    setView("eventDetail");
  };

  const handleCreateGroup = (event) => {
    setEventsGroup([...eventsGroup, event]);
    setView("createGroupForm");
  }

  const handleViewGroup = (event) => {
    setView("viewGroup");
  }
  const handleViewAnalytics = (event) => {
    setSelectedEvent(event);
    setView("eventAnalytics");
  };
  const handleRateEvent = (eventId, ratingData) => {
    setRatings({
      ...ratings,
      [eventId]: ratingData, // Store the rating against the event ID
    });
    toast.success("Thank you for your feedback!");
  };
  const handleLogout = () => window.location.reload();

  const renderMainContent = () => {
    if (mockUser.role === "Manager") {
      switch (view) {
        case "addForm":
          return <AddEventForm onAddEvent={handleAddEvent} onClose={() => setView("eventDetail")} />;
        case "eventAnalytics":
          return <EventAnalytics event={selectedEvent} onClose={() => setView("eventDetail")} />;

        case "dashboard":
          const myCreatedEvents = events.filter(e => e.managerId === mockUser.uid);
          return <ManagerDashboard 
                    user={mockUser}
                    myCreatedEvents={myCreatedEvents}
                    // Pass the new handler to the dashboard
                    onViewAnalytics={handleViewAnalytics} 
                    onSelectEvent={handleSelectEvent}
                    onAddNew={() => setView("addForm")}
                 />;
        case "editForm":
          return <EditEventForm event={selectedEvent} onUpdateEvent={handleUpdateEvent} onClose={() => setView("eventDetail")} />;
        case "createGroupForm":
          return <CreateGroupForm event={selectedEvent} onClose={() => setView("eventDetail")} />;
        case "viewGroup":
          return <ViewGroup event={selectedEvent} userRole={mockUser.role} onClose={() => setView("eventDetail")} />;
        case "eventDetail":
        default:
          return <EventDetail 
                    event={selectedEvent} 
                    userRole={mockUser.role} 
                    handleEdit={handleShowEditForm} 
                    handleDelete={handleDeleteEvent} 
                    handleCreateGroup={handleCreateGroup} 
                    hasCreatedGroup={eventsGroup.find(e => e.id === (selectedEvent ? selectedEvent.id : null))}
                    handleViewGroup={handleViewGroup}
                  />;
      }
    } else { // User Role
      switch (view) {
        case "dashboard":
          return <UserDashboard 
                    user={mockUser} 
                    myEvents={joinedEvents}
                    // Add these two props to make it interactive
                    setView={setView}
                    onViewDetails={handleViewDetails}
                 />;
        case "eventDetail_User":
        const hasJoined = joinedEvents.some(e => e.id === selectedEvent.id);
        const hasGroup = eventsGroup.some(e => e.id === selectedEvent.id);
        const userRating = ratings[selectedEvent.id]; // Get the rating for this event

        return <EventDetail 
                  event={selectedEvent} 
                  userRole={mockUser.role} 
                  handleJoin={() => handleJoinEvent(selectedEvent.id)}
                  hasJoined={hasJoined}
                  hasGroup={hasGroup}
                  handleViewGroup={handleViewGroup}
                  // Pass the new props down
                  userRating={userRating} 
                  onRateEvent={(ratingData) => handleRateEvent(selectedEvent.id, ratingData)}
               />;

        case "ticketPage":
          return <TicketPage 
                    event={selectedEvent} 
                    onDone={() => setView("myEvents")} // "Done" button goes to "My Events"
                 />;
        case "myEvents":
          return (
            <div className="event-grid-container">
              <h2>My Joined Events ({joinedEvents.length})</h2>
              {joinedEvents.length > 0 ? (
                <div className="event-grid">{joinedEvents.map(event => 
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    // Pass the new handler here
                    onViewDetails={handleViewDetails} 
                  />
                )}</div>
              ) : (<p>You haven't joined any events yet.</p>)}
            </div>
          );
        case "allEvents":
      default:
        // Filter the main events list
        const availableEvents = events.filter(event => 
          !joinedEvents.some(joinedEvent => joinedEvent.id === event.id)
        );

        return (
          <div className="event-grid-container">
            {/* The title now shows the count of available events */}
            <h2>All Events ({availableEvents.length})</h2>
            {/* We now map over the new 'availableEvents' array */}
            <div className="event-grid">{availableEvents.map(event => 
              <EventCard 
                key={event.id} 
                event={event} 
                onJoin={handleJoinEvent} 
                onViewDetails={handleViewDetails} 
              />
            )}</div>
          </div>
        );
      }
    }
  };

  return (
    <div className="home-container">
      <Toaster position="top-center" /> 

      {/* 7. USE the new Navbar Component */}
      <Navbar user={mockUser} setView={setView} onLogout={handleLogout} />

      <div className="main-content">
        <aside className="sidebar scrollable">
          {mockUser.role === "Manager" ? (
            <>
              <div className="sidebar-header">
                <h2>My Events</h2>
                <button className="btn add-event-btn" onClick={() => setView("addForm")}>+ Add Event</button>
              </div>
              <ul className="event-list">
                {events
                .filter(event => event.managerId === mockUser.uid)
                .map((event) => (
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
      <Footer /> 
    </div>
  );
}