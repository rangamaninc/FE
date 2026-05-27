import axios from "axios";

axios.defaults.baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

axios.interceptors.request.use((config) => {
  const interceptedConfig = { ...config };

  const authToken = localStorage.getItem("authToken");

  if (authToken) {
    interceptedConfig.headers.Authorization = `${authToken}`;
  }

  return interceptedConfig;
});
