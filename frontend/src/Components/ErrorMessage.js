import React from 'react';
import './ErrorMessage.css';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-message">
      <span>{message}</span>
      <button onClick={onClose} className="close-btn">×</button>
    </div>
  );
};

export default ErrorMessage;
