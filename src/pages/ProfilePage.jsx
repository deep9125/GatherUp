import React from 'react';
import { useAppContext } from '../context/AppContext';

// 1. Import your dedicated dashboard components
import ManagerDashboard from '../component/ManagerDashboard';
import UserDashboard from '../component/UserDashboard';

export default function ProfilePage() {
  // 2. Get the user from the context to check their role
  const { user } = useAppContext();

  // 3. Conditionally render the correct dashboard component.
  //    All specific logic is now handled by the components themselves.
  if (user.role === 'Manager') {
    return <ManagerDashboard />;
  } else {
    return <UserDashboard />;
  }
}