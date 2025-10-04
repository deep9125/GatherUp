import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import Navbar from '../component/Navbar';
import Footer from '../component/Footer';
import ManagerSidebar from '../component/ManagerSidebar';
import UserSidebar from '../component/UserSidebar';
import '../styles/Home.css';

export default function HomePage() {
  const { user, logout } = useAppContext();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout(); 
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
          <Outlet /> 
        </main>
      </div>
      <Footer />
    </div>
  );
}