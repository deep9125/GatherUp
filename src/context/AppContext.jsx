import React, { createContext, useReducer, useContext } from 'react';
import initialEvents from '../service/mockEvents'; // Corrected path
import { mockUser } from '../service/authService';  // Corrected path
import { mockUsers } from '../service/mockUsers';
// 1. Initial State
const initialState = {
  user: null,
  users: mockUsers,
  events: initialEvents,
  joinedEvents: [],
  ratings: {},
  groups: [], // RENAMED from eventsGroup for clarity
  loading: false,
};

// 2. Reducer: A pure function to handle state updates
const appReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.payload] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(event =>
          event.id === action.payload.id ? action.payload : event
        ),
      };
    case 'DELETE_EVENT':
      return {
        ...state,
        events: state.events.filter(event => event.id !== action.payload),
      };
    case 'JOIN_EVENT':
      return { ...state, joinedEvents: [...state.joinedEvents, action.payload] };
    case 'RATE_EVENT':
      return {
        ...state,
        ratings: { ...state.ratings, [action.payload.eventId]: action.payload.ratingData },
      };
    case 'ADD_MESSAGE_TO_GROUP':
  return {
    ...state,
    groups: state.groups.map(group =>
      group.id === action.payload.groupId
        ? { ...group, messages: [...group.messages, action.payload.message] }
        : group
    ),
  };
    case 'CREATE_GROUP': // ADDED this case to handle group creation
      return { ...state, groups: [...state.groups, action.payload] };
    case 'LOGIN_SUCCESS':
      return { ...state, user: action.payload };
    case 'SIGNUP_SUCCESS':
      return {
        ...state,
        user: action.payload, // Automatically log the new user in
        users: [...state.users, action.payload], // Add the new user to the list of all users
      };
    default:
      return state;
  }
};

// 3. Create Context
const AppContext = createContext();

// 4. Provider Component: Wraps your app and provides the state
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// 5. Custom Hook: A clean way to access the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};