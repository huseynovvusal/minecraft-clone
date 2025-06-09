import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      "@": "/src",
      "@types": "/src/types",
    },
  },
})
