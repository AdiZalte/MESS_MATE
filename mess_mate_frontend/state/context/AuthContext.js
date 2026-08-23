import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [ownerToken, setOwnerToken] = useState(null);
  const [ownerInfo, setOwnerInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // On app start, check if a token is already saved (keeps user logged in)
  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedInfo = await AsyncStorage.getItem('ownerInfo');
      if (storedToken) {
        setOwnerToken(storedToken);
        setOwnerInfo(storedInfo ? JSON.parse(storedInfo) : null);
      }
      setIsLoading(false);
    };
    loadStoredAuth();
  }, []);

  const login = async (token, info) => {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('ownerInfo', JSON.stringify(info));
    setOwnerToken(token);
    setOwnerInfo(info);
  };

  const logout = async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('ownerInfo');
    setOwnerToken(null);
    setOwnerInfo(null);
  };

  return (
    <AuthContext.Provider value={{ ownerToken, ownerInfo, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);