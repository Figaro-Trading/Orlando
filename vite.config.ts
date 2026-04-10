import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import { VitePWA } from "vite-plugin-pwa";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    preact(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "icons/*.png"],
      manifest: {
        name: "Orlando Park Assistant",
        short_name: "Orlando",
        description: "Assistant temps réel pour les parcs d'Orlando",
        theme_color: "#0f1117",
        background_color: "#0f1117",
        display: "standalone",
        orientation: "portrait",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "icons/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "icons/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,json}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.themeparks\.wiki\/v1\//,
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "themeparks-api",
              expiration: { maxEntries: 50, maxAgeSeconds: 600 },
              cacheableResponse: {
                statuses: [200],
                headers: { "Content-Type": "application/json" },
              },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },
});
