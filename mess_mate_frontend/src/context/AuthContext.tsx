import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OwnerInfo {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  ownerToken: string | null;
  ownerInfo: OwnerInfo | null;
  isLoading: boolean;
  login: (token: string, info: OwnerInfo) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ownerToken, setOwnerToken] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (token: string, info: OwnerInfo) => {
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

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};