/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          600: "#2563eb",
          700: "#1d4ed8"
        }
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(2, 6, 23, 0.25)"
      }
    }
  },
  plugins: []
};
