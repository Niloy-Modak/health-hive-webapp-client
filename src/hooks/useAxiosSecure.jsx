// hooks/useAxiosSecure.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://healthhive-server.vercel.app',
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const useAxiosSecure = () => axiosInstance;
export default useAxiosSecure;
