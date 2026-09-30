// client/src/context/AuthContext.jsx
// React Context provides a way to pass authentication data and functions through the component tree
// without having to pass props down manually at every level.

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Read stored user details and JWT token from localStorage on initial render
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('bricknest_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('bricknest_token') || null;
  });

  const [loading, setLoading] = useState(true);
  // Track array of favorited property IDs to give instant heart-icon visual feedback
  const [favoriteIds, setFavoriteIds] = useState([]);

  // Fetch the logged-in user's favorites from the backend whenever the token changes
  useEffect(() => {
    const fetchUserFavorites = async () => {
      if (token && user) {
        try {
          const res = await api.get('/favorites');
          // res.data is an array of favorite objects: [{ _id, property: { _id, ... } }]
          const ids = res.data.map((fav) => fav.property?._id || fav.property);
          setFavoriteIds(ids);
        } catch (err) {
          console.error('Failed to load user favorites:', err);
        }
      } else {
        setFavoriteIds([]);
      }
      setLoading(false);
    };

    fetchUserFavorites();
  }, [token, user]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, ...userData } = res.data;

      // Save credentials in browser localStorage
      localStorage.setItem('bricknest_token', userToken);
      localStorage.setItem('bricknest_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed. Please check credentials.';
      return { success: false, message };
    }
  };

  // Register handler
  const register = async (name, email, password) => {
    try {
      const res = await api.post('/auth/register', { name, email, password });
      const { token: userToken, ...userData } = res.data;

      localStorage.setItem('bricknest_token', userToken);
      localStorage.setItem('bricknest_user', JSON.stringify(userData));

      setToken(userToken);
      setUser(userData);
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message };
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem('bricknest_token');
    localStorage.removeItem('bricknest_user');
    setUser(null);
    setToken(null);
    setFavoriteIds([]);
  };

  // Check if a property is currently shortlisted
  const isFavorite = (propertyId) => {
    return favoriteIds.includes(propertyId);
  };

  // Toggle favorite status (adds if not present, removes if present)
  const toggleFavorite = async (propertyId) => {
    if (!user) {
      return { requireAuth: true };
    }

    const alreadyFavorited = favoriteIds.includes(propertyId);

    // Optimistic UI update: update state immediately for snappy feel
    if (alreadyFavorited) {
      setFavoriteIds((prev) => prev.filter((id) => id !== propertyId));
    } else {
      setFavoriteIds((prev) => [...prev, propertyId]);
    }

    try {
      if (alreadyFavorited) {
        await api.delete(`/favorites/${propertyId}`);
      } else {
        await api.post(`/favorites/${propertyId}`);
      }
      return { success: true, favorited: !alreadyFavorited };
    } catch (error) {
      // Revert optimistic update on failure
      if (alreadyFavorited) {
        setFavoriteIds((prev) => [...prev, propertyId]);
      } else {
        setFavoriteIds((prev) => prev.filter((id) => id !== propertyId));
      }
      console.error('Error toggling favorite:', error);
      return { success: false, message: 'Could not update favorites' };
    }
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        favoriteIds,
        isFavorite,
        toggleFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to consume the AuthContext conveniently
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
