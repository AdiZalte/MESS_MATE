import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'favoriteMessIds';

interface FavoritesContextType {
  favoriteIds: string[];
  isLoaded: boolean;
  isFavorite: (messId: string) => boolean;
  toggleFavorite: (messId: string) => void;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // 1) On app start: read the saved list from the phone
  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setFavoriteIds(JSON.parse(raw));
      } catch {
        // storage can fail (private mode, corrupted value): start empty rather than crash
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  // 2) Whenever the list changes (after the first load): write it back
  useEffect(() => {
    if (!isLoaded) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds)).catch(() => {});
  }, [favoriteIds, isLoaded]);

  const isFavorite = (messId: string) => favoriteIds.includes(messId);

  const toggleFavorite = (messId: string) => {
    setFavoriteIds((prev) =>
      prev.includes(messId)
        ? prev.filter((id) => id !== messId)   // already a favorite: remove it
        : [messId, ...prev]                    // not yet: add to the top
    );
  };

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoaded, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
};