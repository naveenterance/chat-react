/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mydark: {
          primary: "#007cff",
          secondary: "#866b00",
          accent: "#00f19d",
          neutral: "#000a12",
          "base-100": "#0c4a6e",
          info: "#00c9ff",
          success: "#22c55e",
          warning: "#facc15",
          error: "#ff588e",
        },
      },
      "garden",
    ],
  },
};
