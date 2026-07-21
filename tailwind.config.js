/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: '#7B2FBE',
          violet: '#9B4DCA',
          light: '#C084FC',
          dark: '#0D0D14',
          card: '#13131F',
          border: '#1E1E32',
        },
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'purple-glow': 'radial-gradient(ellipse at 50% 0%, rgba(123,47,190,0.25) 0%, transparent 60%)',
        'purple-glow-left': 'radial-gradient(ellipse at 0% 50%, rgba(123,47,190,0.18) 0%, transparent 55%)',
        'purple-glow-right': 'radial-gradient(ellipse at 100% 50%, rgba(155,77,202,0.15) 0%, transparent 55%)',
      },
    },
  },
  plugins: [],
}
