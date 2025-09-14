import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AppProvider } from './context/AppContext'; // Import the provider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppProvider> {/* Wrap your entire app */}
      <App />
    </AppProvider>
  </React.StrictMode>
);