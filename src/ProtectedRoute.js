import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // If there is no user, navigate to the SignIn page
    return <Navigate to="/signin" />;
  }

  return children;  // If user is authenticated, return the children components (e.g., Dashboard)
};

export default ProtectedRoute;
