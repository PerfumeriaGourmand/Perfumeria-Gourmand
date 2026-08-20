import type { Metadata } from "next";
import { Spectral, Outfit, Philosopher } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import CartDrawer from "@/components/cart/CartDrawer";

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

const philosopher = Philosopher({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-philosopher",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.perfumeriagourmand.com.ar";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Gourmand",
    template: "%s | Gourmand",
  },
  description:
    "Perfumería premium online. Fragancias de nicho, árabe y diseñador seleccionadas para quienes buscan lo extraordinario. Envíos a todo Argentina. 12 cuotas sin interés.",
  keywords: [
    "perfumería", "perfumes", "nicho", "árabe", "diseñador",
    "fragancias", "Buenos Aires", "Argentina", "Byredo", "Creed",
    "Tom Ford", "Lattafa", "Dior", "YSL", "comprar perfumes online",
  ],
  authors: [{ name: "Gourmand Perfumería" }],
  creator: "Gourmand Perfumería",
  openGraph: {
    type: "website",
    locale: "es_AR",
    url: BASE_URL,
    siteName: "Gourmand Perfumería",
    title: "Gourmand Perfumería",
    description:
      "Perfumería premium online. Fragancias de nicho, árabe y diseñador. Envíos a todo Argentina. 12 cuotas sin interés.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gourmand Perfumería",
    description:
      "Perfumería premium online. Fragancias de nicho, árabe y diseñador. Envíos a todo Argentina.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: {
    canonical: "/",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={`${spectral.variable} ${outfit.variable} ${philosopher.variable}`}>
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
