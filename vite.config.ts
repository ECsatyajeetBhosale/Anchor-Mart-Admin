import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const backendTarget = env.VITE_API_BASE_URL;

  return {
    plugins: [
      react(), // Enables React Fast Refresh in development
      tailwindcss(), // Tailwind CSS v4 — no config file needed
    ],

    resolve: {
      alias: {
        // Allows you to write: import { X } from "@/components/..."
        // instead of:          import { X } from "../../components/..."
        "@": path.resolve(__dirname, "./src"),
      },
    },

    // ─── Development server configuration ────────────────────────────────────
    server: {
      host: true,
      allowedHosts: [".ngrok-free.app"], // Allow all ngrok subdomains

      proxy: {
        // All /api/* calls are proxied server-side → no browser CORS issue
        "/api": {
          target: backendTarget,
          changeOrigin: true,
          secure: false,
          // ngrok requires this header to skip the interstitial warning page
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        },
      },
    },

    // ─── Vitest configuration ────────────────────────────────────────────────────
    test: {
      globals: true, // No need to import describe/it/expect in test files
      environment: "jsdom", // Simulates a browser environment for React tests
      setupFiles: ["./src/test/setup.ts"], // Runs before every test file
      css: true,
    },
  };
});
