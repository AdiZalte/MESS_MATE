import apiClient from './apiClient';

// ── Create Mess ──────────────────────────────────────────────

export interface CreateMessPayload {
  name: string;
  description?: string;
  address: string;
  city: string;
  locality?: string;
  latitude: number;
  longitude: number;
  messType: 'VEG' | 'NON_VEG' | 'BOTH';
  priceType: 'FIXED_MONTHLY' | 'PER_MEAL' | 'BOTH';
  avgPricePerMeal?: number;
  openingTime: string; // "HH:mm:ss"
  closingTime: string;
  coverImageUrl1?: string;
  coverImageUrl2?: string;
  coverImageUrl3?: string;
  isVeg?: boolean;
  isTiffin?: boolean;
}

export const createMess = async (payload: CreateMessPayload) => {
  const response = await apiClient.post('/owner/mess', payload);
  return response.data;
};

// ── Get My Mess ───────────────────────────────────────────────

export interface MessResponse {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  locality?: string;
  latitude: number;
  longitude: number;
  messType: string;
  priceType: string;
  avgPricePerMeal?: number;
  openingTime: string;
  closingTime: string;
  coverImageUrl1?: string;
  coverImageUrl2?: string;
  coverImageUrl3?: string;
  isActive: boolean;
  isVerified: boolean;
  avgRating: number;
  totalRatings: number;
}

export const getMyMess = async (): Promise<MessResponse | null> => {
  try {
    const response = await apiClient.get<MessResponse>('/owner/mess');
    return response.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null; // no mess yet — not an error state, just "nothing to show"
    }
    throw err; // anything else (401, 500) really is an error, let it propagate
  }
};