import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../context/AppContext'; // Corrected path

export default function UserSidebar() {
    const { user } = useAppContext();

    return (
        <>
            <div className="sidebar-header">
                <h2>Welcome, {user.displayName}!</h2>
            </div>
            <ul className="navigation-menu">
                {/* Using NavLink is the best practice for navigation. 
                  It automatically adds an 'active' class to the link 
                  that corresponds to the current page.
                */}
                <li>
                    <NavLink to="/" end>Browse All Events</NavLink>
                </li>
                <li>
                    <NavLink to="/my-events">My Joined Events</NavLink>
                </li>
            </ul>
        </>
    );
}

