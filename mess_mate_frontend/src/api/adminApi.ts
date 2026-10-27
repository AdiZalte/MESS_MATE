import apiClient from './apiClient';

export interface AdminMess {
  id: string;
  name: string;
  address: string;
  city: string;
  locality?: string;
  latitude: number;
  longitude: number;
  avgPricePerMeal?: number;
  coverImageUrl1?: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt?: string;
  ownerName?: string;
  ownerEmail?: string;
  ownerPhone?: string;
}

export type MessFilter = 'pending' | 'verified' | 'all';

export interface AdminAuthResponse {
  token: string;
  email: string;
}

export const loginAdmin = async (email: string, password: string) => {
  const response = await apiClient.post<AdminAuthResponse>('/admin/auth/login', { email, password });
  return response.data;
};

// `params` becomes the query string: /admin/messes?status=pending
export const getAdminMesses = async (status: MessFilter) => {
  const response = await apiClient.get<AdminMess[]>('/admin/messes', { params: { status } });
  return response.data;
};

export const verifyMess = async (messId: string) => {
  const response = await apiClient.put<AdminMess>(`/admin/messes/${messId}/verify`);
  return response.data;
};

export const unverifyMess = async (messId: string) => {
  const response = await apiClient.put<AdminMess>(`/admin/messes/${messId}/unverify`);
  return response.data;
};

export const deleteMess = async (messId: string) => {
  await apiClient.delete(`/admin/messes/${messId}`);
};