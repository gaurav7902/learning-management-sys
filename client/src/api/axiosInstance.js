import axios from 'axios';

const axiosInstance = axios.create({
  // baseURL: "https://ghar-mai-kaksha-h1tm.onrender.com",
  baseURL: import.meta.env.VITE_BACKEND_URI,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = JSON.parse(sessionStorage.getItem('accessToken')) || '';

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (err) => Promise.reject(err)
);

export default axiosInstance;
