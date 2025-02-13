import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';  // Import auth from firebaseConfig

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // To handle loading state

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    try {
      // Attempt to create the user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created successfully:', userCredential);  // Log successful sign up
      setLoading(false);  // Stop loading
    } catch (err) {
      setError(err.message);  // Capture and display any errors
      console.error('Sign-up error:', err.message);  // Log error
      setLoading(false);  // Stop loading
    }
  };

  return (
    <div>
      <h2>Sign Up</h2>
      <form onSubmit={handleSignUp}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display errors */}
        <button type="submit" disabled={loading}>Sign Up</button> {/* Disable button while loading */}
      </form>
    </div>
  );
};

export default SignUp;
