  import { defineConfig } from "vite";
  import react from "@vitejs/plugin-react";
  import "dotenv/config";

  // https://vitejs.dev/config/
  export default defineConfig({
    plugins: [react()],
    server: {
      host: "127.0.0.1",
      open: true,
      https: {
        key: process.env.KEY_SSH,
        cert: process.env.CERT_SSH,
      },
    },
    preview: {
      host: "0.0.0.0",
    },
    define: {
      "process.env": process.env,
    },
  });
