import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontSize: {
        "main-text": ["16px", { lineHeight: "32px", fontWeight: "500" }],
        h1: ["36px", { lineHeight: "64px", fontWeight: "400" }],
        h2: ["32px", { lineHeight: "48px", fontWeight: "400" }],
        h3: ["24px", { lineHeight: "40px", fontWeight: "400" }],
        subtitle: ["20px", { lineHeight: "45px", fontWeight: "500" }],
        button: ["16px", { fontWeight: "600" }],
        icon: ["60px", { fontWeight: "100" }],
        header: ["16px", { lineHeight: "30px", fontWeight: "500" }],
        "main-text-mobile": ["14px", { lineHeight: "32px", fontWeight: "500" }],
        "h1-mobile": ["24px", { lineHeight: "36px", fontWeight: "400" }],
        "h2-mobile": ["20px", { lineHeight: "32px", fontWeight: "400" }],
        "h3-mobile": ["16px", { lineHeight: "28px", fontWeight: "400" }],
        "subtitle-mobile": ["14px", { lineHeight: "30px", fontWeight: "500" }],
        "xs-mobile": ["10px", { lineHeight: "17px", fontWeight: "500" }],
        "s-mobile": ["12px", { lineHeight: "20px", fontWeight: "500" }],
        "button-m-mobile": ["14px", { lineHeight:"24px", fontWeight: "600" }],
        "button-s-mobile": ["12px", { lineHeight:"18px", fontWeight: "600" }],
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "ui-sans-serif", "system-ui"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Daikin Corporate Colors
        primary: {
          DEFAULT: "#0097E0", // DaikinBlue
          foreground: "#ffffff",
        },
        secondary: {
          DEFAULT: "#4D4D4D", // DaikinLightBlue
          foreground: "#000000",
        },
        white: "#ffffff",
        black: "#000000",
        // Daikin Supporting Colors
        "caring-blue-grey": "#CDDAE2",
        "caring-light-blue-grey": "#F1F4F7",
        "caring-blue": "#BEDCF4",
        "caring-light-blue": "#E3F0FB",
        "caring-orange": "#F9DDC0",
        "caring-light-orange": "#FCEFE1",
        "caring-yellow": "#F6EAC5",
        "caring-light-yellow": "#FBF5E2",
        "caring-green": "#C8DDC7",
        "caring-light-green": "#EEF4EE",
        "caring-berry": "#DABFC9",
        "caring-light-berry": "#F0EAED",
        "caring-brown": "#E7D8C6",
        "caring-light-brown": "#F6F0E9",
        "caring-grey": "#D8D6D6",
        "caring-light-grey": "#ECEAEA",
        "accent-blue-grey": "#728992",
        "accent-orange": "#EE740B",
        "accent-yellow": "#EAB500",
        "accent-green": "#50915D",
        "accent-berry": "#966498",
        "accent-brown": "#977362",
        "amm": "#4D4D4D",
        "container": "#F8FCFE",
        "grey-light":"#faf9f9d2",

        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
