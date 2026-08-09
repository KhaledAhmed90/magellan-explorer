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
      input: resolve(rootDir, "android-index.html"),
    },
  },
});
