const handleDeleteAccount = async () => {
    if (!user) {
      console.error("No user is logged in.");
      return;
    }
  
    const userRef = doc(db, "users", user.uid);
  
    try {
      console.log("Attempting to delete document for:", user.uid);
      await deleteDoc(userRef);
      console.log("Delete successful!");
  
      // Clear local state
      setUserData(null);
      
      // Sign out user
      await signOut(auth);
    } catch (error) {
      console.error("Delete error:", error);
    }
  };
  