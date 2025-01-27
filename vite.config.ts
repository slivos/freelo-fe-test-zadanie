import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import svgLoader from "vite-svg-loader";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), svgLoader()],
  resolve: {
    alias: {
      "@composables": path.resolve(__dirname, "./src/Composables"),
      "@stores": path.resolve(__dirname, "./src/stores"),
      "@svg": path.resolve(__dirname, "./src/assets/svg"),
    },
  },
  optimizeDeps: {
    exclude: ["floating-vue"],
  },
});
