import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      "@styles/*": "/src/styles",
    },
  },
})
