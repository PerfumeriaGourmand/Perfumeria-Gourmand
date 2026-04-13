import type { Metadata } from "next";
import { Philosopher, Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/cart/CartDrawer";

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-philosopher",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Gourmand — Perfumería de Lujo",
    template: "%s | Gourmand",
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
    <html lang="es" className={`${philosopher.variable} ${cormorant.variable} ${dmSans.variable}`}>
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
              fontFamily: "var(--font-dm-sans)",
              fontSize: "0.875rem",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            },
          }}
        />
      </body>
    </html>
  );
}
