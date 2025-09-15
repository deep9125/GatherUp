import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Corrected path to singular 'context' folder
import { AppProvider, useAppContext } from './context/AppContext'; 

// --- Page and Component Imports (Corrected Paths) ---
// Pages that were created from scratch
import HomePage from './pages/HomePage';
import LoginPage from './pages/login';
import MyEventsPage from './pages/MyEventPage'; // Corrected filename typo
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import CreateGroupPage from './pages/CreateGroupForm';
import ViewGroupPage from './component/ViewGroup';
import EventAnalyticsPage from './pages/EventAnalytics';
import SignupPage from './pages/SignupPage';
// Components that are being used as pages (still in the component folder)
import EventDetailPage from './pages/EventDetail';
import EditEventPage from './pages/EditEventForm';
import AddEventPage from './pages/AddEventForm';
import TicketPage from './pages/TicketPage';
import AttendancePage from './pages/AttendancePage';
import useRedirector from './hook/useRedirector';
// --- The App's Main Content, Shown Only After Login ---
const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    {/* Any other route redirects to login if not logged in */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const AppContent = () => (
  <Routes>
    <Route path="/" element={<HomePage />}>
      <Route index element={<RootRedirector />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="events/:id" element={<EventDetailPage />} />
      <Route path="my-events" element={<MyEventsPage />} />
      <Route path="dashboard" element={<DashboardPage />} />
      <Route path="ticket/:id" element={<TicketPage />} />
      <Route path="events/:id/create-group" element={<CreateGroupPage />} />
      <Route path="groups/:id" element={<ViewGroupPage />} />
      <Route path="manage/add" element={<ProtectedRoute roles={['Manager']}><AddEventPage /></ProtectedRoute>} />
      <Route path="manage/edit/:id" element={<ProtectedRoute roles={['Manager']}><EditEventPage /></ProtectedRoute>} />
      <Route path="manage/analytics/:id" element={<ProtectedRoute roles={['Manager']}><EventAnalyticsPage /></ProtectedRoute>} />
      <Route path="manage/attendance/:id" element={<ProtectedRoute roles={['Manager']}><AttendancePage /></ProtectedRoute>} />
    </Route>
  </Routes>
);

// --- A component to handle the default (index) route logic after login ---
const RootRedirector = () => {
  const IndexPageComponent = useRedirector(); // Get the correct component from the hook
  return <IndexPageComponent />;              // Render it
};

// --- A component to protect manager-only routes ---
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAppContext();
  // Although AppLayout should prevent this, it's good practice for safety
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// --- New top-level component that decides to show Login or the App ---
const AppLayout = () => {
  const { user } = useAppContext();
  return (
    <Router>
      <Toaster position="top-center" />
      {user ? <AppContent /> : <AuthRoutes/>}
    </Router>
  );
};

// --- The Main App component is now simpler ---
function App() {
  return (
    <AppProvider>
      <AppLayout />
    </AppProvider>
  );
}

export default App;

