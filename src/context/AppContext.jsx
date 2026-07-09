import React, { createContext, useReducer,useMemo, useContext,useState } from 'react';
import api from '../utils/api';

const initialState = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  isAuthenticated: !!localStorage.getItem('user'),
  loading: false,
  error: null,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'REQUEST_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
    case 'REGISTER_SUCCESS': 
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case 'REQUEST_FAIL':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    default:
      return state;
  }
};

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [refetchTrigger, setRefetchTrigger] = useState(0);
  const triggerRefetch = () => setRefetchTrigger(c => c + 1);
  const login = async (email, password) => {
    dispatch({ type: 'REQUEST_START' });
    try {
      const res = await api.post('/users/login', { email, password });
      const { token, ...user } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login Failed';
      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
    }
  };
  const register = async (userData) => {
    dispatch({ type: 'REQUEST_START' });
    try {
      const res = await api.post('/users/register', userData);
      const { token, ...user } = res.data;
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      dispatch({ type: 'REGISTER_SUCCESS', payload: user });
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration Failed';
      dispatch({ type: 'REQUEST_FAIL', payload: errorMessage });
    }
  };
  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };
  const value = useMemo(() => ({
    ...state,
    login,
    logout,
    triggerRefetch, 
    refetchTrigger,
    register,
  }), [state, refetchTrigger]); 
  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};