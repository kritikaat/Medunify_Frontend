import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get the API URL from environment or use default
  const apiTarget = env.VITE_API_BASE_URL || 'http://localhost:8000';
  
  return {
    server: {
      host: "::",
      port: 8080,
      // Allow ngrok domains and disable host checking for development
      allowedHosts: [
        'glucosidic-explicative-terrell.ngrok-free.dev',
        '.ngrok-free.dev', // Allow any ngrok-free.dev subdomain
      ],
      // Enable HMR for fast refresh without full page reloads
      hmr: {
        overlay: true, // Show errors as overlay
      },
      // Proxy API requests to bypass CORS during development
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
          // For ngrok, we need to set the origin header
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        },
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
