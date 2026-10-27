import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface OwnerInfo {
  id: string;
  name: string;
  email: string;
}

export type Role = 'OWNER' | 'ADMIN';

interface AuthContextType {
  ownerToken: string | null;
  ownerInfo: OwnerInfo | null;
  role: Role | null;
  isLoading: boolean;
  login: (token: string, info: OwnerInfo, role?: Role) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [ownerToken, setOwnerToken] = useState<string | null>(null);
  const [ownerInfo, setOwnerInfo] = useState<OwnerInfo | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStoredAuth = async () => {
      const storedToken = await AsyncStorage.getItem('authToken');
      const storedInfo = await AsyncStorage.getItem('ownerInfo');
      const storedRole = await AsyncStorage.getItem('authRole');
      if (storedToken) {
        setOwnerToken(storedToken);
        setOwnerInfo(storedInfo ? JSON.parse(storedInfo) : null);
        // tokens saved before this change have no role: treat them as owners
        setRole(storedRole === 'ADMIN' ? 'ADMIN' : 'OWNER');
      }
      setIsLoading(false);
    };
    loadStoredAuth();
  }, []);

  const login = async (token: string, info: OwnerInfo, newRole: Role = 'OWNER') => {
    await AsyncStorage.setItem('authToken', token);
    await AsyncStorage.setItem('ownerInfo', JSON.stringify(info));
    await AsyncStorage.setItem('authRole', newRole);
    setOwnerToken(token);
    setOwnerInfo(info);
    setRole(newRole);
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['authToken', 'ownerInfo', 'authRole']);
    setOwnerToken(null);
    setOwnerInfo(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ ownerToken, ownerInfo, role, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};