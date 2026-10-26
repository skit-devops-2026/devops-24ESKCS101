import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Any request starting with /api or /uploads is forwarded to the Express server.
export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            "/api": "http://127.0.0.1:5000",
            "/uploads": "http://127.0.0.1:5000"
        }
    }
});
