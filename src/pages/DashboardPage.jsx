import React from 'react';
import { useAppContext } from '../context/AppContext'; 
import ManagerDashboard from '../component/ManagerDashboard';
import UserDashboard from '../component/UserDashboard';

export default function DashboardPage() {
    const { user } = useAppContext();
    if (user.role === 'Manager') {
        return <ManagerDashboard />;
    } else {
        return <UserDashboard />;
    }
}