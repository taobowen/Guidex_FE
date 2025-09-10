import axios from 'axios';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosInstance = axios.create({
  baseURL: 'https://aiskiingcoach.com',
  timeout: 10000,
});

// Request interceptor: add token to headers
axiosInstance.interceptors.request.use(
  async config => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor: handle 401 error
axiosInstance.interceptors.response.use(
  response => {
    if (response.data.code === 401) {
      router.replace('/auth/signIn');
    }
    return response;
  },
  async error => {
    console.error('Response error:', error);
    if (error.response?.code === 401) {
      const token = await AsyncStorage.getItem('authToken');
      router.replace('/auth/signIn');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
