// src/App.jsx
import React, { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Home from "./pages/home";

function App() {
  const [user, setUser] = useState(null);
  const handleLogin = () => {
    setUser({ loggedIn: true }); 
  };
  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
      {user ? (
        <Home onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  );
}
export default App;