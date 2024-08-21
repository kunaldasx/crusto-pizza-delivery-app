import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],

	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},

	server: {
		port: 5173,
		host: true,
		open: true,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},

	preview: {
		port: 4173,
		host: true,
		open: true,
		proxy: {
			"/api": {
				target: "http://localhost:3000",
				changeOrigin: true,
				secure: false,
			},
		},
	},

	build: {
		outDir: "dist",
		sourcemap: false,
		minify: "esbuild",
		rollupOptions: {
			output: {
				manualChunks: {
					vendor: ["react", "react-dom"],
					router: ["react-router-dom"],
				},
			},
		},
	},
});
