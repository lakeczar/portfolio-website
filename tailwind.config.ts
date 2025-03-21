/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss'

const config: Config = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // This enables the class-based dark mode
    theme: {
      extend: {
        // // You can also define custom colors here if needed
        // colors: {
        //   // Example of custom color
        //   'brand': {
        //     100: '#e6f0ff',
        //     // ... more shades
        //     900: '#0033a0',
        //   },
        // },
      },
    },
    plugins: [],
  }

export default config