'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    // Check if user is authenticated on load
    const checkAuth = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/v2/auths/check-auth', {
          credentials: 'include'
        });
        if (res.ok) {
          setIsAuthenticated(true);
          console.log("Authentication check successful: User is authenticated");
        } else {
          setIsAuthenticated(false);
          console.log("Authentication check successful: User is not authenticated");
        }
      } catch (err) {
        console.error('Auth check failed:', err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);