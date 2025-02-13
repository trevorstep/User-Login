import React from 'react';
import { signOut } from "firebase/auth";
import { auth } from './firebaseConfig';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");  // Check if this logs when you click logout
    signOut(auth)
      .then(() => {
        console.log("Logged out successfully");
        navigate('/signin');  // Navigate to the Sign In page after logging out
      })
      .catch((error) => {
        console.error("Error during sign out: ", error);  // Log any errors here
      });
  };

  return (
    <div>
      <h1>Welcome to your Dashboard!</h1>
      <button onClick={handleLogout}>Log Out</button>
    </div>
  );
};

export default Dashboard;
