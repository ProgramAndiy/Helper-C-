import { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null); // 'student' or 'admin'
  const [userData, setUserData] = useState(null); // Full user profile from Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          // Fetch custom role or extra data from Firestore with a 3-second timeout
          const userDocRef = doc(db, 'users', user.uid);
          
          const fetchPromise = getDoc(userDocRef);
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error("User doc fetch timed out")), 3000)
          );
          
          const userDocSnap = await Promise.race([fetchPromise, timeoutPromise]);
          
          if (userDocSnap.exists()) {
            const data = userDocSnap.data();
            setUserData(data);
            setUserRole(data.role || 'student');
          } else {
            // Defaults to student if not in DB yet (e.g., just signed up)
            setUserRole('student');
            setUserData(null);
          }
        } catch (error) {
          console.error("Error fetching user role from Firestore:", error);
          // Default to student if offline or error occurs so app still loads
          setUserRole('student');
          setUserData(null);
        }
      } else {
        setUserRole(null);
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    setUserRole,
    userData,
    setUserData,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
