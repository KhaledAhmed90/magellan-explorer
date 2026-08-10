import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const rootDir = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": resolve(rootDir, "./src"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: rootDir,
  build: {
    outDir: resolve(rootDir, ".output/public"),
    emptyOutDir: true,
    rollupOptions: {
      // Capacitor requires the web entry point to be named index.html.
      // Keep the source file named android-index.html, but emit index.html.
      input: resolve(rootDir, "android-index.html"),
      output: {
        entryFileNames: "assets/[name]-[hash].js",
      },
    },
  },
});
