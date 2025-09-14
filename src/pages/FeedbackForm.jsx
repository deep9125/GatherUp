// src/pages/FeedbackForm.jsx
import React, { useState } from 'react';
import '../styles/Home.css';

const Star = ({ selected = false, onSelect = f => f }) => (
  <span className={selected ? "star selected" : "star"} onClick={onSelect}>
    ★
  </span>
);

export default function FeedbackForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit({ rating, comment });
  };

  return (
    <div className="feedback-form-container">
      <h3>Rate This Event</h3>
      <form onSubmit={handleSubmit}>
        <div className="star-rating-input">
          {[...Array(5)].map((n, i) => (
            <Star key={i} selected={i < rating} onSelect={() => setRating(i + 1)} />
          ))}
          <p>{rating} of 5 stars</p>
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Leave a comment (optional)"
          rows="4"
          className="feedback-textarea"
        />
        <button type="submit" className="btn primary full-width">Submit Rating</button>
      </form>
    </div>
  );
}