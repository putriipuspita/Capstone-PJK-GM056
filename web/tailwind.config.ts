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
        navbar: "#2d6667",
        hero: "#135158",
        highlight: "#8DE5DB",
        abu: "#f4f5f7",
        teks: "#333333",
      },
      keyframes: {
        melayang: {
          '0%': { transform: 'translateY(0px) rotate(-3deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-2deg)' },
          '100%': { transform: 'translateY(0px) rotate(-3deg)' },
        },
        'melayang-kartu': {
          '0%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0px)' },
        }
      },
      animation: {
        melayang: 'melayang 6s ease-in-out infinite',
        'melayang-kartu': 'melayang-kartu 5s ease-in-out infinite',
      }
    },
  },
  plugins: [],
};
export default config;
