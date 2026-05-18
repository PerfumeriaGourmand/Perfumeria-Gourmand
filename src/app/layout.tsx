import type { Metadata } from "next";
import { Italiana, Spectral, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/cart/CartDrawer";

const italiana = Italiana({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-italiana",
  display: "swap",
});

const spectral = Spectral({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-spectral",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gourmand - Perfumería",
    template: "Gourmand - %s",
  },
  description:
    "Perfumería de nicho, árabe y diseñador. Fragancias seleccionadas para quienes buscan lo extraordinario.",
  keywords: ["perfumería", "nicho", "árabe", "diseñador", "fragancias", "Buenos Aires"],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Gourmand",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${italiana.variable} ${spectral.variable} ${outfit.variable}`}>
      <body className="font-sans bg-page-bg text-text-dark">
        {children}
        <CartDrawer />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#ffffff",
              color: "#1c1917",
              border: "1px solid #e8e5e0",
              fontFamily: "var(--font-outfit)",
              fontSize: "0.875rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
          }}
        />
      </body>
    </html>
  );
}
