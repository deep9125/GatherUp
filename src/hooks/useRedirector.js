import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function useRedirector() {
  const { user } = useAppContext();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (user && location.pathname === '/') {
      const role = user.user?.role || user.role;
      if (role === 'Manager') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/events', { replace: true });
      }
    }
  }, [user, navigate, location.pathname]);
}