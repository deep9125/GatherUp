import React, { useState } from "react";
import "../styles/Home.css"; // Ensure the path is correct based on your project structure
import EventDetail from "../component/EventDetail";
import { getAuth, signOut } from "firebase/auth";


export default function Home() {
  const [events] = useState([
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
    { id: 12, name: "Spring Fashion Week", date: "2025-09-18", description: "Runway shows featuring designers from Paris, Milan, and New York." }
  ]);


  const [selectedEvent, setSelectedEvent] = useState(events[0]);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        console.log("User logged out");
        window.location.href = "/"; // Redirect after successful logout
      })
      .catch((error) => {
        console.error("Logout error:", error);
      });
  };


  return (
    <div className="home-container">
      {/* Header */}
      <header className="header">
        <h3>🗓️ Gather Up</h3>
        
        <button className="btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div className="main-content">
        {/* Sidebar */}
        <aside className="sidebar scrollable">
          <h2>Events</h2>
          <ul>
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

        {/* Vertical Line */}
        <div className="vertical-line"></div>

        {/* Event Details */}
        <EventDetail event={selectedEvent} />
      </div>
    </div>
  );
}
