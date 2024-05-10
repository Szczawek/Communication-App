import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: process.env.KEY_SSH,
      cert: process.env.CERT_SSH,
    },
  },
});
