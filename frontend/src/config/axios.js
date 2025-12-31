import axios from "axios";
import { toast } from "react-toastify";

/**
 * Axios instance
 */
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // required for cookies (access + refresh token)
});


// Capitalize helper (for toast messages)

function capitalize(value) {
  if (typeof value !== "string") return "";
  if (value.length === 0) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * RESPONSE INTERCEPTOR
 * Runs AFTER backend sends response
 */
axiosClient.interceptors.response.use(

  /**
   * ✅ SUCCESS RESPONSE
   */
  (response) => {
    if (response.config?.show && response.data?.message) {
      toast.success(capitalize(response.data.message));
    }
    return response;
  },

  /**
   * ❌ ERROR RESPONSE
   */
  async (error) => {
    const originalRequest = error.config;

    // 🚨 Safety check (axios edge case)
    if (!originalRequest) {
      return Promise.reject(error);
    }

    /**
     * 🔴 If refresh-token request itself fails
     * DO NOT retry — redirect to login
     */
    if (originalRequest.url?.includes("/api/users/refresh-token")) {
      return Promise.reject(error);
    }

    /**
     * Routes where refresh should NOT be attempted
     */
    const skipRefreshRoutes = [
      "/api/users/login",
      "/api/users/profile",
    ];

    /**
     * 🔄 Refresh token logic
     */
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !skipRefreshRoutes.some(route =>
        originalRequest.url?.includes(route)
      )
    ) {
      originalRequest._retry = true;

      try {
        // request new access token using refresh token cookie
        await axiosClient.post("/api/users/refresh-token");

        // retry original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    /**
     * Skip toast & handling if explicitly told
     */
    if (originalRequest.skip) {
      return Promise.reject(error);
    }

    /**
     * Default error toast
     */
    const message =
      error.response?.data?.message ||
      "Something went wrong, please try again later";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosClient;
