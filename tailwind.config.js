/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        'bg-primary': '#0A1628',
        'bg-secondary': '#1B3A5C',
        'bg-tertiary': '#0D2137',
        'bg-card': '#112240',
        'accent': '#00D4FF',
        'accent-green': '#00FF88',
        'accent-orange': '#FF9500',
        'accent-red': '#FF3B5C',
        'accent-purple': '#A855F7',
        'accent-yellow': '#FFD600',
        'text-primary': '#E8F0FE',
        'text-secondary': '#8BA3C7',
        'border-main': '#1E3A5F',
      },
      fontFamily: {
        'digital': ['Orbitron', 'DIN Alternate', 'monospace'],
        'sans': ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
