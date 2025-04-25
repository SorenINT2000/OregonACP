import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { app } from '../firebase';

// Extend the Firebase User type to include our custom claims
interface User extends FirebaseUser {
  executive?: boolean;
  owner?: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  isOwner: boolean;
  refreshUserClaims: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);

  // Function to update user claims
  const updateUserClaims = async (user: FirebaseUser) => {
    try {
      // Force token refresh to get the latest claims
      await user.getIdToken(true);

      // Get the user's custom claims
      const idTokenResult = await user.getIdTokenResult();
      console.log('ID Token Result:', idTokenResult);
      console.log('Claims:', idTokenResult.claims);

      // Explicitly check if the claims exist and are true
      const executive = idTokenResult.claims.executive === true;
      const owner = idTokenResult.claims.owner === true;

      console.log('Executive claim:', executive);
      console.log('Owner claim:', owner);

      // Set the user with the executive and owner claims
      const userWithClaims = {
        ...user,
        executive,
        owner
      } as User;

      console.log('User with claims:', userWithClaims);

      setCurrentUser(userWithClaims);
    } catch (error) {
      console.error('Error getting user claims:', error);
      setCurrentUser(user as User);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await updateUserClaims(user);
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const signIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Immediately update claims after sign in
    await updateUserClaims(userCredential.user);
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  const signInWithGoogle = async () => {
    const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
    // Immediately update claims after sign in
    await updateUserClaims(userCredential.user);
  };

  // Function to manually refresh user claims
  const refreshUserClaims = async () => {
    if (auth.currentUser) {
      await updateUserClaims(auth.currentUser);
    }
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    logout,
    signInWithGoogle,
    isOwner: currentUser?.owner || false,
    refreshUserClaims
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 