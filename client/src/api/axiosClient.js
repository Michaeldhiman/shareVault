import axios from 'axios';

/**
 * Axios Client Instance
 * Configured with base URL, withCredentials: true for HttpOnly cookies, and error interceptors.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Automatically includes HttpOnly session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

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
