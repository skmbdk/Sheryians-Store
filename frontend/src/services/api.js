import axios from 'axios';

// Create Axios instance for API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});

// Helper functions to manage stored token in localStorage
export const getStoredToken = () => localStorage.getItem('accessToken');
export const setStoredToken = (token) => localStorage.setItem('accessToken', token);
export const removeStoredToken = () => localStorage.removeItem('accessToken');

// Helper functions to manage user in localStorage
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeStoredUser = () => localStorage.removeItem('user');

// Attach Authorization header to every request if token is present
api.interceptors.request.use(
  (config) => {
    const token = getStoredToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor to handle token refresh automatically on 401 errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If request fails with 401 and hasn't been retried yet
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/register') &&
      !originalRequest.url.includes('/auth/refresh-token')
    ) {
      originalRequest._retry = true;
      try {
        // Attempt to get a new access token using httpOnly refresh token cookie
        const res = await axios.post(
          'http://localhost:5000/api/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        const newAccessToken = res.data.accessToken;
        setStoredToken(newAccessToken);

        // Update authorization header and retry original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear user state
        removeStoredToken();
        removeStoredUser();
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
