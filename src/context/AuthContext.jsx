import React, { createContext, useContext, useState, useEffect } from 'react';
import { dbStore } from '../data/dbStore.js';
import { 
  auth, 
  isFirebaseConfigured, 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from '../services/firebaseClient.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    refreshUsers();

    if (isFirebaseConfigured) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        setFirebaseUser(fbUser);
        if (fbUser && fbUser.email) {
          const allUsers = dbStore.getUsers();
          const matched = allUsers.find(u => u.email.toLowerCase() === fbUser.email.toLowerCase());
          if (matched) {
            setCurrentUser(matched);
            localStorage.setItem('ihp_active_user_id', matched.id);
          }
        }
      });
      return () => unsubscribe();
    }
  }, []);

  const refreshUsers = () => {
    const allUsers = dbStore.getUsers();
    setUsers(allUsers);
    
    const savedUserId = localStorage.getItem('ihp_active_user_id');
    if (savedUserId) {
      const savedUser = allUsers.find(u => u.id === savedUserId);
      setCurrentUser(savedUser || null);
    } else {
      setCurrentUser(null);
    }
    setLoading(false);
  };

  const switchUser = (userId) => {
    const targetUser = users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem('ihp_active_user_id', targetUser.id);
      dbStore.logActivity('ROLE_SWITCH', `Switched active profile to ${targetUser.name} (${targetUser.role})`, targetUser);
    }
  };

  const switchRole = (role) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      switchUser(targetUser.id);
    }
  };

  const login = async (email, password) => {
    const trimmedEmail = (email || '').trim().toLowerCase();
    if (!trimmedEmail) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    if (isFirebaseConfigured) {
      try {
        const userCred = await signInWithEmailAndPassword(auth, trimmedEmail, password);
        setFirebaseUser(userCred.user);
      } catch (fbErr) {
        console.warn('Firebase auth attempt:', fbErr.message);
      }
    }

    const allUsers = dbStore.getUsers();
    const existingUser = allUsers.find(u => u.email.toLowerCase() === trimmedEmail);

    if (existingUser) {
      const storedPassword = existingUser.password || 'password123';
      if (password && storedPassword && password !== storedPassword && !isFirebaseConfigured) {
        return { success: false, error: 'Invalid password entered. Please try again.' };
      }

      setCurrentUser(existingUser);
      localStorage.setItem('ihp_active_user_id', existingUser.id);
      dbStore.logActivity('USER_LOGIN', `User ${existingUser.name} logged in (${existingUser.role})`, existingUser);
      return { success: true, user: existingUser };
    }

    return {
      success: false,
      error: 'Management panel access is restricted to authorized Dealers, Sales Staff, and Administrators.'
    };
  };

  const updatePassword = (newPassword, targetUserId = null) => {
    if (!currentUser) throw new Error('No user logged in');
    const userIdToUpdate = targetUserId || currentUser.id;
    dbStore.updateUserPassword(userIdToUpdate, newPassword, currentUser);
    if (userIdToUpdate === currentUser.id) {
      setCurrentUser(prev => ({ ...prev, password: newPassword }));
    }
    refreshUsers();
  };

  const logout = async () => {
    if (isFirebaseConfigured) {
      try {
        await firebaseSignOut(auth);
      } catch (err) {
        console.warn('Firebase logout warning:', err);
      }
    }
    localStorage.removeItem('ihp_active_user_id');
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        firebaseUser,
        isFirebaseConfigured,
        users,
        loading,
        switchUser,
        switchRole,
        login,
        updatePassword,
        logout,
        refreshUsers
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
