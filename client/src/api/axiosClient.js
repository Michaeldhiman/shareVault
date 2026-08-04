import axios from 'axios';

/**
 * Axios Client Instance
 * Configured with base URL and interceptors for Authorization.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Dynamically attaches JWT Authorization header if available.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('securevault_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Formats API errors cleanly for consumer functions.
 */
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode: error.response?.status || 500,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

export default axiosClient;
