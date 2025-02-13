import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { signOut, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, deleteUser } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { auth, db } from "./firebaseConfig";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userData, setUserData] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      setLoading(true);
      if (authUser) {
        const userRef = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().signUpComplete) {
          setUser(authUser);
          setUserData(userSnap.data());
          navigate("/dashboard");
        } else {
          setError("Incomplete sign-up detected. Please sign up properly.");
          await signOut(auth);
          setUser(null);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleAuth = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      let userCredential;
      if (isSignUp) {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        await setDoc(doc(db, "users", newUser.uid), {
          email: newUser.email,
          createdAt: new Date(),
          profileName: "New User",
          signUpComplete: true
        });

        setUserData({
          email: newUser.email,
          profileName: "New User",
          signUpComplete: true,
        });

        setUser(newUser);
        navigate("/dashboard");
      } else {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
        const existingUser = userCredential.user;
        const userRef = doc(db, "users", existingUser.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().signUpComplete) {
          setUser(existingUser);
          setUserData(userSnap.data());
          navigate("/dashboard");
        } else {
          setError("Sign-up incomplete. Please sign up properly.");
          await signOut(auth);
        }
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    if (!user) return;
    const newProfileName = prompt("Enter your new profile name:");
  
    if (!newProfileName || newProfileName.trim() === "") {
      alert("Profile name cannot be empty.");
      return;
    }
  
    try {
      await updateDoc(doc(db, "users", user.uid), { profileName: newProfileName });
  
      // Fetch the updated user data
      const userSnap = await getDoc(doc(db, "users", user.uid));
      if (userSnap.exists()) {
        setUserData(userSnap.data());
        alert("Profile name updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile name.");
    }
  };
  

  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, "users", user.uid));
      await deleteUser(user);
      setUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error deleting account:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      navigate("/");
    } catch (error) {
      setError("Failed to sign out.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Welcome to the App!</h1>
      {user ? (
        <>
          {userData?.signUpComplete ? (
            <>
              <p>Logged in as: {user.email}</p>
              <p>Profile Name: {userData?.profileName || "Not Set"}</p>
              <button onClick={handleUpdateProfile}>Update Profile</button>
              <button onClick={handleDeleteAccount}>Delete Account</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </>
          ) : (
            <div>
              <p>Please complete the sign-up process.</p>
            </div>
          )}
        </>
      ) : (
        <div>
          <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
          <form onSubmit={handleAuth}>
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
          </form>
          <button onClick={() => setIsSignUp(!isSignUp)}>
            {isSignUp ? "Already have an account? Sign In" : "New user? Sign Up"}
          </button>
        </div>
      )}
      <Routes>
        <Route path="/" element={<div>Welcome, {user ? user.email : "Guest"}!</div>} />
        <Route path="/dashboard" element={<div>Welcome to your dashboard!</div>} />
      </Routes>
    </div>
  );
};

export default App;
