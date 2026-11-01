import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sora = Sora({ subsets: ["latin"], variable: "--font-sora" });

export const metadata: Metadata = {
  title: "Livres",
  description: "Boutiques de livres, commandes par WhatsApp",
};
export const viewport: Viewport = {
  themeColor: "#14213D",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body
        className={`${inter.variable} ${sora.variable} bg-[#F7F6F2] font-[family-name:var(--font-inter)] text-[#14213D] antialiased`}
      >
        {children}
      </body>
    </html>
  );
}