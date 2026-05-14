import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// https://vite.dev/config/
export default defineConfig({
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

  // ─── Vitest configuration ────────────────────────────────────────────────────
  test: {
    globals: true, // No need to import describe/it/expect in test files
    environment: "jsdom", // Simulates a browser environment for React tests
    setupFiles: ["./src/test/setup.ts"], // Runs before every test file
    css: true,
  },
});
