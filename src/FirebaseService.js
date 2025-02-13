import { db } from "./firebaseConfig";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";

const getUsers = async () => {
  const usersCollection = collection(db, "users");
  const data = await getDocs(usersCollection);
  return data.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

const addUser = async (user) => {
  const usersCollection = collection(db, "users");
  await addDoc(usersCollection, user);
};

const updateUser = async (id, updatedData) => {
  const userDoc = doc(db, "users", id);
  await updateDoc(userDoc, updatedData);
};

const deleteUser = async (id) => {
  const userDoc = doc(db, "users", id);
  await deleteDoc(userDoc);
};

export { getUsers, addUser, updateUser, deleteUser };
