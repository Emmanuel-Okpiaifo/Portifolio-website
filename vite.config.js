import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Subpath base is only for GitHub Pages (see .env.gh-pages). Netlify uses "/".
  const base =
    env.VITE_GH_PAGES === "true" && env.VITE_REPO_NAME
      ? `/${env.VITE_REPO_NAME}/`
      : "/";
  return {
    base,
    plugins: [react(), tailwindcss()],
    test: {
      environment: "jsdom",
      setupFiles: "./src/test/setup.js",
      css: false,
      testTimeout: 20000,
    },
    server: {
      open: true,
      host: false,
      proxy: {
        "/api": {
          target: "http://localhost:5000",
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
