import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ——— Dark palette (nicho section, admin) ———
        obsidian: "#0a0a0a",
        "obsidian-light": "#111111",
        "obsidian-mid": "#1a1a1a",
        "obsidian-surface": "#242424",
        cream: "#f5f0e8",
        "cream-muted": "#c8c0b0",
        "cream-dim": "#7a7268",
        // ——— Light palette (public site) ———
        "page-bg": "#f8f7f4",
        "card-bg": "#ffffff",
        "text-dark": "#1c1917",
        "text-mid": "#57534e",
        "text-light": "#a8a29e",
        "border-light": "#e8e5e0",
        "surface-2": "#f1efe9",
        // ——— Gold (shared) ———
        gold: "#c9a96e",
        "gold-light": "#e2c98a",
        "gold-dark": "#a07840",
        "gold-muted": "#8a6840",
        // ——— Semantic ———
        border: "rgba(201,169,110,0.15)",
        "border-subtle": "rgba(201,169,110,0.07)",
      },
      fontFamily: {
        display: ["var(--font-philosopher)", "Georgia", "serif"],
        body: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest: "0.3em",
        "ultra-wide": "0.5em",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gold-glow": "radial-gradient(ellipse at center, rgba(201,169,110,0.15) 0%, transparent 70%)",
      },
      animation: {
        "fade-up": "fadeUp 0.8s ease forwards",
        "fade-in": "fadeIn 0.6s ease forwards",
        "particle-float": "particleFloat 8s ease-in-out infinite",
        "shimmer": "shimmer 2.5s linear infinite",
        "reveal-text": "revealText 1s ease forwards",
        "marquee": "marquee 30s linear infinite",
      },
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        particleFloat: {
          "0%, 100%": { transform: "translateY(0) translateX(0)", opacity: "0.6" },
          "33%": { transform: "translateY(-20px) translateX(10px)", opacity: "1" },
          "66%": { transform: "translateY(-10px) translateX(-8px)", opacity: "0.8" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        revealText: {
          from: { clipPath: "inset(0 100% 0 0)" },
          to: { clipPath: "inset(0 0% 0 0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      boxShadow: {
        "gold-glow": "0 0 40px rgba(201,169,110,0.2)",
        "card": "0 2px 12px rgba(0,0,0,0.06)",
        "card-hover": "0 12px 40px rgba(0,0,0,0.12)",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
