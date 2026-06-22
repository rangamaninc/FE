import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      src: resolve(__dirname, "src"),
      "@": resolve(__dirname, "src"),
    },
  },
  optimizeDeps: {
    include: [
      "@mui/material",
      "@mui/material/styles",
      "@mui/icons-material",
      "@mui/x-data-grid",
      "@mui/x-date-pickers",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true,
    port: 5173,
  },
});
