/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#070914",
          900: "#0b1020",
          850: "#10172e",
          800: "#161e3a",
          700: "#222b4a",
          600: "#2a3354",
        },
        cream: {
          50: "#f4f6fc",
          100: "#e3e7f3",
          200: "#c4cbe1",
          300: "#a0aac9",
        },
        slate: {
          300: "#a4abc1",
          400: "#7e85a0",
          500: "#5a6383",
          600: "#3c4566",
        },
        ember: {
          50: "#fff1e8",
          100: "#ffe1cc",
          400: "#ff8a4d",
          500: "#ff5a1f",
          600: "#ea4408",
          700: "#bf360a",
        },
        sky: {
          300: "#7fc6ff",
          400: "#5cb0ff",
          500: "#3056d3",
          600: "#2143a8",
        },
        mint: {
          300: "#7fe7c3",
          400: "#39d49b",
          500: "#0fbf80",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "system-ui", "sans-serif"],
        sans: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      boxShadow: {
        card:
          "0 1px 0 0 rgba(255,255,255,0.04), 0 24px 60px -28px rgba(0,0,0,0.6)",
        cardGlow:
          "0 1px 0 0 rgba(255,255,255,0.04), 0 24px 60px -20px rgba(255,90,31,0.35)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        wheel: { to: { transform: "rotate(360deg)" } },
        dash: { to: { strokeDashoffset: "-200" } },
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        marquee: "marquee 40s linear infinite",
        "wheel-slow": "wheel 4s linear infinite",
        dash: "dash 4s linear infinite",
        floaty: "floaty 4s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
