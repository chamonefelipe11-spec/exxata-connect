/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "exxata-red": "#D51D07",
        "exxata-blue": "#0B1A2B"
      },
      fontFamily: {
        sans: ['Manrope','ui-sans-serif','system-ui','Segoe UI','Roboto','Helvetica','Arial']
      },
      boxShadow: {
        card: "0 10px 30px rgba(2,6,23,.08)"
      },
      borderRadius: { xl2: "16px" }
    }
  },
  plugins: []
}
