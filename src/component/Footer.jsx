import React from 'react';
import '../styles/Home.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="footer">
      <p>&copy; {currentYear} GatherUp. All rights reserved.</p>
    </footer>
  );
}