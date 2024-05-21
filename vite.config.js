import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "tailwindcss";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
  plugins: [
    react(),
    nodePolyfills({
      globals: {
        Buffer: true, // Ensure Buffer is polyfilled
        global: true,
        process: true,
      },
      protocolImports: true, // Add support for `node:` protocol imports
    }),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  build: {
    manifest: true,
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name][extname]',
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
      },
    },
  },
});
