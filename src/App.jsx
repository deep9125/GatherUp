import React,{useEffect} from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate,useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './context/AppContext'; 
import useRedirector from './hooks/useRedirector';
import HomePage from './pages/HomePage';
import LoginPage from './pages/login';
import MyEventsPage from './pages/MyEventPage'; 
import DashboardPage from './pages/DashboardPage';
import CreateGroupPage from './pages/CreateGroupForm';
import ViewGroupPage from './component/ViewGroup';
import EventAnalyticsPage from './pages/EventAnalytics';
import SignupPage from './pages/SignupPage';
import EventDetailPage from './pages/EventDetail';
import EditEventPage from './pages/EditEventForm';
import AddEventPage from './pages/AddEventForm';
import TicketPage from './pages/TicketPage';
import AttendancePage from './pages/AttendancePage';
import AllEventsPage from './pages/AllEventsPage';
const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

const AppContent = () => (
  <Routes>
    <Route path="/" element={<HomePage />}>
      <Route index element={<RootRedirector />} /> 
      <Route path="events" element={<AllEventsPage />} />
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);
const RootRedirector = () => {
  useRedirector();
  return <div>Loading...</div>;
};
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};
const AppLayout = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation(); 
  useEffect(() => {
    if (user && (location.pathname === '/login' || location.pathname === '/signup')) {
      navigate('/'); 
    }
  }, [user, navigate, location.pathname]);
  return user ? <AppContent /> : <AuthRoutes />;
};
function App() {
  return (
    <Router>
      <AppProvider>
        <Toaster position="top-center" />
        <AppLayout />
      </AppProvider>
    </Router>
  );
}

export default App;

