import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import ViteSitemap from "vite-plugin-sitemap";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    ViteSitemap({
      hostname: "https://tenwatradingandlogistics.com",
      generateRobotsTxt: true,
      robots: [
        {
          userAgent: "*",
          allow: "/",
        },
      ],
    }),
  ],
  server: {
    host: "0.0.0.0",
    port: 5173,
    allowedHosts: true,
  },
});