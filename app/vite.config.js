import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config";
ds
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  server: {
    https: {
      key: process.env.KEY_SSH,
      cert: process.env.CERT_SSH,
    },
  },
});
