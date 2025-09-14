import React from 'react';
import { useAppContext } from '../context/AppContext'; // Correct path

// Import your existing dashboard components
import ManagerDashboard from '../component/ManagerDashboard';
import UserDashboard from '../component/UserDashboard';

export default function DashboardPage() {
    // 1. Get the current user from the context
    const { user } = useAppContext();

    // 2. Conditionally render the correct dashboard based on the user's role
    if (user.role === 'Manager') {
        return <ManagerDashboard />;
    } else {
        return <UserDashboard />;
    }
}