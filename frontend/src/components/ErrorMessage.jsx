import React from 'react';

// Component to render top-level error messages and field-level validation errors
const ErrorMessage = ({ error }) => {
  if (!error) return null;

  // Handle express-validator field-level errors array
  if (error.errors && Array.isArray(error.errors)) {
    return (
      <div className="error-box">
        <strong>{error.message || 'Validation failed:'}</strong>
        <ul>
          {error.errors.map((err, idx) => (
            <li key={idx}>
              <strong>{err.field}:</strong> {err.message}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  // Handle simple string message or object message
  const message = typeof error === 'string' ? error : error.message || 'An error occurred';

  return (
    <div className="error-box">
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
