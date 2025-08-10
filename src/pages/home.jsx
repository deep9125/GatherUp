import React, { useState } from "react";
import "../styles/Home.css"; 
import EventDetail from "../component/EventDetail";
import AddEventForm from "../component/AddEventForm";
import { getAuth, signOut } from "firebase/auth";

export default function Home() {
  // Change to mutable state by removing const [events] and using setEvents
  const [events, setEvents] = useState([
    { id: 1, name: "Annual Tech Conference", date: "2025-09-12", description: "A gathering of innovators, developers, and tech leaders to discuss the future of technology." },
    { id: 2, name: "Global Music Festival 2025", date: "2025-10-05", description: "A 3-day live music event featuring artists from around the world." },
    { id: 3, name: "Startup Pitch Day", date: "2025-11-18", description: "Upcoming startups showcase their business ideas to investors." },
    { id: 4, name: "City Food & Wine Fair", date: "2025-08-22", description: "Taste the best gourmet food and wine from local and international chefs." },
    { id: 5, name: "International Art Expo", date: "2025-09-30", description: "An exhibition of contemporary art, sculpture, and installations from over 40 countries." },
    { id: 6, name: "Marathon for Charity", date: "2025-10-15", description: "A city-wide marathon to raise funds for children's education." },
    { id: 7, name: "AI & Robotics Summit", date: "2025-11-02", description: "Experts and researchers gather to discuss the latest in AI and robotics." },
    { id: 8, name: "Winter Wonderland Market", date: "2025-12-05", description: "Holiday-themed shopping experience with gifts, crafts, and food stalls." },
    { id: 9, name: "Film Premiere: Future Vision", date: "2025-09-25", description: "Exclusive red-carpet premiere of the sci-fi blockbuster 'Future Vision'." },
    { id: 10, name: "Blockchain & Crypto Forum", date: "2025-10-28", description: "Industry leaders discuss the impact and future of blockchain technology." },
    { id: 11, name: "Science & Space Exploration Expo", date: "2025-11-12", description: "NASA scientists and space engineers showcase the latest in space travel tech." },
    { id: 12, name: "Spring Fashion Week", date: "2025-09-18", description: "Runway shows featuring designers from Paris, Milan, and New York." },
    { id: 13, name: "International Jazz Festival", date: "2025-08-30", description: "Enjoy smooth jazz performances from renowned international artists." },
    { id: 14, name: "Environmental Sustainability Conference", date: "2025-10-20", description: "Discussions on climate change, renewable energy, and green technologies." },
    { id: 15, name: "Literature & Poetry Gathering", date: "2025-09-10", description: "Writers and poets come together to share and celebrate their work." },
    { id: 16, name: "Gourmet Chocolate Expo", date: "2025-11-05", description: "Taste and learn about the finest chocolates from around the world." },
    { id: 17, name: "International Film Festival", date: "2025-12-10", description: "A showcase of independent films and documentaries from various countries." },
    { id: 18, name: "Tech Startup Bootcamp", date: "2025-08-15", description: "An intensive program for early-stage startups to accelerate growth." },
    { id: 19, name: "Comic-Con 2025", date: "2025-09-28", description: "Celebrating comics, movies, and pop culture with cosplay and panels." },
    { id: 20, name: "Classical Music Concert", date: "2025-10-08", description: "A night of beautiful orchestral and chamber music performances." },
    { id: 21, name: "International Dance Festival", date: "2025-11-22", description: "Featuring traditional and contemporary dance troupes from around the globe." },
    { id: 22, name: "Virtual Reality Expo", date: "2025-09-14", description: "Explore the latest VR technologies, games, and immersive experiences." },
    { id: 23, name: "Food Truck Carnival", date: "2025-08-27", description: "A fun day with delicious street food from a variety of vendors." },
    { id: 24, name: "Entrepreneurship Workshop", date: "2025-10-12", description: "Learn key business skills and strategies from successful entrepreneurs." },
    { id: 25, name: "Photography Exhibition", date: "2025-11-30", description: "A display of stunning photographs capturing moments from around the world." }
  ]);

  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        window.location.href = "/";
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };

  const handleAddEvent = (newEvent) => {
    // Generate new unique ID (simple method)
    const newId = events.length ? Math.max(...events.map(e => e.id)) + 1 : 1;

    const eventWithId = { id: newId, ...newEvent };

    setEvents([...events, eventWithId]);
    setSelectedEvent(eventWithId);
  };

  return (
    <div className="home-container">
      <header className="header">
        <h3>🗓️ Gather Up</h3>
        <button className="btn logout-btn" onClick={handleLogout}>Logout</button>
      </header>

      <div className="main-content">
        <aside className="sidebar scrollable">
          <div className="sidebar-header">
            <h2>Events</h2>
            <button
              className="btn add-event-btn"
              onClick={() => setShowAddForm(true)}
              style={{ marginBottom: "12px" }}
            >
              + Add Event
            </button>
          </div>
          <ul className="event-list">
            {events.map((event) => (
              <li
                key={event.id}
                className={selectedEvent?.id === event.id ? "active" : ""}
                onClick={() => setSelectedEvent(event)}
              >
                <span className="event-name">{event.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="vertical-line"></div>

        {showAddForm ? (
          <AddEventForm
            onAddEvent={handleAddEvent}
            onClose={() => setShowAddForm(false)}
          />
        ) : (
          <EventDetail event={selectedEvent} />
        )}
      </div>
    </div>
  );
}
