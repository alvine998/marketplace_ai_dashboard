import axios from "axios";

const api = axios.create({
  baseURL:
    (window as any).CONFIG?.VITE_API_BASE_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:4001",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Retry logic for 429 errors
    if (error.response?.status === 429 && originalRequest) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;

      if (originalRequest._retryCount <= 3) {
        const retryAfter = error.response.headers["retry-after"];
        // Exponential backoff: 1s, 2s, 4s... or use retry-after header
        const delay = retryAfter
          ? parseInt(retryAfter, 10) * 1000
          : 1000 * Math.pow(2, originalRequest._retryCount - 1);

        await new Promise((resolve) => setTimeout(resolve, delay));
        return api(originalRequest);
      }
    }

    if (error.response?.status === 401) {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
