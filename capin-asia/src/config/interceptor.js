import axios from "axios";
import { clearSessionAndRedirect } from "../utils/authSession";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

axios.interceptors.request.use((config) => {
  const interceptedConfig = { ...config };
  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    interceptedConfig.headers.Authorization = authToken;
  }

  return interceptedConfig;
});

axios.interceptors.response.use(
  (response) => {
    const newToken =
      response.headers?.authorization || response.headers?.Authorization;

    if (newToken) {
      localStorage.setItem("authToken", newToken);
    }

    return response;
  },
  (error) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      "";

    if (status === 401) {
      const hadToken = Boolean(localStorage.getItem("authToken"));
      const isLoginRequest = error.config?.url?.includes("/users/login");

      if (hadToken && !isLoginRequest) {
        clearSessionAndRedirect(
          message || "Session expired. Please sign in again."
        );
      }
    }

    return Promise.reject(error);
  }
);
