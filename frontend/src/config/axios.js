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
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest || !error.response) {
      return Promise.reject(error);
    }

    if (originalRequest.url?.includes("/api/users/refresh-token")) {
      return Promise.reject(error);
    }

    const skipRefreshRoutes = [
      "/api/users/login",
      "/api/users/profile",
    ];

    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !skipRefreshRoutes.some(route =>
        originalRequest.url?.includes(route)
      )
    ) {
      originalRequest._retry = true;

      try {
        await axiosClient.post("/api/users/refresh-token");
        return axiosClient(originalRequest);
      } catch {
        // ❌ DO NOTHING HERE
        return Promise.reject(error);
      }
    }

    if (!originalRequest.skip) {
      toast.error(
        error.response?.data?.message ||
        "Something went wrong"
      );
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
