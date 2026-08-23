import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '../constants/config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// apiClient.interceptors.request.use(async (config) => {
//   console.log("REQUEST URL:", config.baseURL + config.url);
//   return config;
// });

// apiClient.interceptors.response.use(
//   (response) => {
//     console.log("SUCCESS:", response.status);
//     return response;
//   },
//   (error) => {
//     console.log("AXIOS ERROR:", error.message);
//     console.log("CODE:", error.code);
//     console.log("STATUS:", error.response?.status);
//     console.log("DATA:", error.response?.data);
//     return Promise.reject(error);
//   }
// );

export default apiClient;