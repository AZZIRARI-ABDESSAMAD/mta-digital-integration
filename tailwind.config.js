/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                mtaBlue: '#0055A4', // Couleur officielle MTA [cite: 7]
                mtaRed: '#E30613',
            },
        },
    },
    plugins: [],
}