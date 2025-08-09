import React, { useEffect, useState } from "react";
import { auth, googleProvider } from "../firebase";
import {
  signInWithPopup,
  onAuthStateChanged,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import Home from "./Home";

export default function Login() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const showAlert = (msg) => {
    alert(msg);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      showAlert("Google Sign-in failed: " + err.message);
    }
  };

  const handleEmailSignUp = async () => {
    if (!email.trim() || !password.trim()) {
      return showAlert("Please enter both email and password.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return showAlert("Please enter a valid email address.");
    }
    if (password.length < 6) {
      return showAlert("Password must be at least 6 characters long.");
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showAlert("Account created successfully!");
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        showAlert("This email is already registered.");
      } else {
        showAlert("Sign-up failed: " + err.message);
      }
    }
  };

  const handleEmailLogin = async () => {
    if (!email.trim() || !password.trim()) {
      return showAlert("Please enter both email and password.");
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return showAlert("Please enter a valid email address.");
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/user-not-found") {
        showAlert("No account found with this email.");
      } else if (err.code === "auth/wrong-password") {
        showAlert("Incorrect password.");
      } else {
        showAlert("Login failed: " + err.message);
      }
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  // If logged in → Go to Home
  if (user) {
    return <Home user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="login-container">
      <h2 className="login-title">Sign In / Sign Up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        className="input-field"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        className="input-field"
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="btn primary" onClick={handleEmailLogin}>
        Login with Email
      </button>
      <button className="btn secondary" onClick={handleEmailSignUp}>
        Sign Up with Email
      </button>

      <div className="divider">OR</div>

      <button className="btn google" onClick={handleGoogleLogin}>
        Sign in with Google
      </button>
    </div>
  );
}
