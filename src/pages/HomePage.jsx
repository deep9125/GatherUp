// src/pages/HomePage.js
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import ManagerSidebar from '../component/ManagerSidebar';
import UserSidebar from '../component/UserSidebar';
import '../styles/Home.css';

export default function HomePage() {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
      // In a real app, this would clear tokens, etc.
      window.location.reload(); 
  };

  return (
    <div className="home-container">
      <Navbar user={user} onLogout={handleLogout} />
      <div className="main-content">
        <aside className="sidebar scrollable">
          {user.role === 'Manager' ? <ManagerSidebar /> : <UserSidebar />}
        </aside>
        <div className="vertical-line"></div>
        <main className="content-area scrollable">
          <Outlet /> {/* This is where the routed page component will be rendered */}
        </main>
      </div>
      <Footer />
    </div>
  );
}