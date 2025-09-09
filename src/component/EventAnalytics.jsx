// src/component/EventAnalytics.jsx
import React from 'react';
import '../styles/Home.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Mock data for the sales chart
const mockSalesData = [
  { name: 'Week 1', "Tickets Sold": 45 },
  { name: 'Week 2', "Tickets Sold": 110 },
  { name: 'Week 3', "Tickets Sold": 95 },
  { name: 'Week 4', "Tickets Sold": 150 },
];

export default function EventAnalytics({ event, onClose }) {
  if (!event) {
    return (
      <div className="dashboard-container">
        <h2>No Event Selected</h2>
        <p>Please select an event from the list to view its analytics.</p>
        <button className="btn" onClick={onClose}>Back</button>
      </div>
    );
  }

  // Calculate stats based on the event data
  const ticketsSold = event.attendees || 0;
  const capacity = event.capacity || 1; // Prevent division by zero
  const attendanceRate = ((ticketsSold / capacity) * 100).toFixed(1);
  const revenue = ticketsSold * (event.price || 0);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Analytics for "{event.name}"</h2>
        <button className="btn" onClick={onClose}>← Back to Details</button>
      </div>
      
      {/* Stat Cards */}
      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>👥 {ticketsSold.toLocaleString()} / {capacity.toLocaleString()}</h3>
          <p>Tickets Sold</p>
        </div>
        <div className="stat-card">
          <h3>📈 {attendanceRate}%</h3>
          <p>Attendance Rate</p>
        </div>
        <div className="stat-card">
          <h3>💰 ${revenue.toLocaleString()}</h3>
          <p>Estimated Revenue</p>
        </div>
      </div>

      {/* Chart */}
      <div className="dashboard-chart-container">
        <h3>Ticket Sales Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={mockSalesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Tickets Sold" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
        
      </div>
    </div>
  );
}
