import apiClient from './apiClient';

export interface RegisterPayload {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  messOwnerId: string;
  name: string;
  email: string;
}
//
// import axios from "axios";

// const handleRegister = async () => {
//   try {
//     const response = await axios.get("http://192.168.2.101:8080");
//     console.log(response.data);
//   } catch (e) {
//     console.log(e);
//   }
// };
//
export const registerMessOwner = async (payload: RegisterPayload) => {
  console.log("Calling API...");
    console.log(payload);
  const response = await apiClient.post<AuthResponse>('/auth/register', payload);
  return response.data;
};

export const loginMessOwner = async (payload: LoginPayload) => {
  const response = await apiClient.post<AuthResponse>('/auth/login', payload);
  return response.data;
};