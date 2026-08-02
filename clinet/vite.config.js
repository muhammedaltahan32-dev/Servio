import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import checker from "vite-plugin-checker";
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default defineConfig({
  clearScreen: true,
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    checker({
      typescript: false,
      eslint: {
        lintCommand: 'eslint "./src/**/*.{js,jsx}"',
      },
      terminal: true,
      overlay: true,
    }),
  ],
  resolve: {
    alias: {
      "@hooks": path.resolve(__dirname, "./src/hooks/index.js"),
      "@constants": path.resolve(__dirname, "./src/constants/index.js"),
      "@components": path.resolve(__dirname, "./src/components/index.js"),
      "@utils": path.resolve(__dirname, "./src/utils/index.js"),
    },
  },
  server: {
    port: 3000,
  },
});
