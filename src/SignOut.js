import React from 'react';
import { auth } from './firebaseConfig';
import { signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';  // Import useNavigate from react-router-dom

const SignOut = () => {
  const navigate = useNavigate();  // Initialize useNavigate

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log("User signed out!");
      navigate("/signin");  // Redirect to sign-in page after successful sign-out
    } catch (err) {
      console.error("Sign-out error:", err.message);
    }
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
};

export default SignOut;
