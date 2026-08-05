import axios from 'axios';
import { useAuthStore } from '../store/useAuthStore';

/**
 * Axios Client Instance
 * Configured with base URL, withCredentials: true for HttpOnly cookies, and automatic token refresh.
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Automatically includes HttpOnly session/refresh cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor
 * Dynamically retrieves in-memory Access Token from Zustand store and attaches it.
 */
axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Keep track of token renewal state to prevent multiple concurrent requests from triggering multiple refreshes
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Response Interceptor
 * Formats API errors cleanly and handles automatic silent renewal of expired Access Tokens.
 */
axiosClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const originalRequest = error.config;
    const statusCode = error.response?.status || error.statusCode || 500;
    
    const formattedError = {
      message: error.response?.data?.message || error.message || 'An unexpected error occurred',
      statusCode,
      data: error.response?.data || null,
    };

    // If request fails with 401 Unauthorized, try to renew Access Token using Refresh Token
    if (statusCode === 401 && originalRequest && !originalRequest._retry) {
      // 1. If the refresh request itself fails with 401, immediately fail and clear session to prevent loops
      if (originalRequest.url.includes('/auth/refresh')) {
        useAuthStore.getState().logoutUser();
        return Promise.reject(formattedError);
      }

      // 2. If token refresh is already in flight, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Use standard axios to perform raw POST refresh call to avoid triggering parent request interceptors
        const refreshResponse = await axios.post(
          `${axiosClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = refreshResponse.data.data;

        // Save new Access Token to store
        useAuthStore.setState({ accessToken });

        // Process all queued requests with the new Access Token
        processQueue(null, accessToken);

        // Retry the original request
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // If renewal fails (e.g. Refresh Token expired/revoked), reject queue and force logout
        const cleanRefreshError = {
          message: refreshError.response?.data?.message || refreshError.message || 'Session expired',
          statusCode: refreshError.response?.status || 401,
        };
        processQueue(cleanRefreshError, null);
        
        useAuthStore.setState({
          user: null,
          accessToken: null,
          encryptionKey: null,
          isAuthenticated: false,
        });

        return Promise.reject(cleanRefreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(formattedError);
  }
);

export default axiosClient;
