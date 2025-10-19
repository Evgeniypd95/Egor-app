import React, { createContext, useContext, useEffect, useState } from 'react';
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';
import { User } from '../types';
import { getUserData } from '../services/authService';

interface AuthContextType {
  user: FirebaseUser | null;
  userData: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userData: null,
  loading: true,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[AUTH_CONTEXT] Setting up auth listener');
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('[AUTH_CONTEXT] Auth state changed:', firebaseUser?.uid || 'logged out');
      setUser(firebaseUser);

      if (firebaseUser) {
        try {
          console.log('[AUTH_CONTEXT] Fetching user data...');
          const data = await getUserData(firebaseUser.uid);
          console.log('[AUTH_CONTEXT] User data loaded:', data?.displayName);
          setUserData(data);
        } catch (error) {
          console.error('[AUTH_CONTEXT] Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
