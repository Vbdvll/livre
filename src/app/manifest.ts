import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Livres · Ma librairie",
    short_name: "Livres",
    description: "Boutique de livres, commandes par WhatsApp et suivi des ventes",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F6F2",
    theme_color: "#14213D",
    icons: [
      { src: "/pwa-192", sizes: "192x192", type: "image/png" },
      { src: "/pwa-512", sizes: "512x512", type: "image/png" },
      { src: "/pwa-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}