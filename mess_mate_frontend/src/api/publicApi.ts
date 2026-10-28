import apiClient from './apiClient';
import { MessResponse } from './messApi';

export type PublicMess = MessResponse;

export interface MenuItem {
  name: string;
  isVeg: boolean;
  mealType: 'LUNCH' | 'DINNER';
}

export interface MenuDay {
  dayOfWeek: string;   // 'MONDAY' ... 'SUNDAY'
  items: MenuItem[];
}

export interface MessDetails {
  mess: PublicMess;
  weeklyMenu: { days: MenuDay[] };
}

// GET /messes?query=...   (empty query = everything)
export const searchMesses = async (query: string): Promise<PublicMess[]> => {
  const response = await apiClient.get<PublicMess[]>('/messes', {
    params: query.trim() ? { query: query.trim() } : {},
  });
  return response.data;
};

// GET /messes/by-ids?ids=a,b,c  (used by the Favorites tab)
export const getMessesByIds = async (ids: string[]): Promise<PublicMess[]> => {
  if (ids.length === 0) return [];
  const response = await apiClient.get<PublicMess[]>('/messes/by-ids', {
    params: { ids: ids.join(',') },
  });
  return response.data;
};

// GET /messes/{id}
export const getMessDetails = async (messId: string): Promise<MessDetails> => {
  const response = await apiClient.get<MessDetails>(`/messes/${messId}`);
  return response.data;
};