const handleUpdateProfile = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }
    
    setUpdating(true);
    const userRef = doc(db, "users", user.uid);
  
    try {
      console.log("Attempting to update document for:", user.uid);
      
      await updateDoc(userRef, { profileName: "Updated Name" });
  
      console.log("Update successful! Refreshing user data...");
      fetchUserData(user.uid);  // Refresh UI with new data
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setUpdating(false);
    }
  };
  