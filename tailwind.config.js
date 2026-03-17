/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#000000",
                secondary: "#F4F4F4",
            },
            container: {
                center: true,
                padding: '2rem',
                screens: {
                    sm: '640px',
                    md: '768px',
                    lg: '1024px',
                    xl: '1280px',
                    '2xl': '1536px',
                },
            },
            backgroundImage: {
                'accent-gradient': 'linear-gradient(to right, #D8B4FE, #F472B6, #818CF8)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                serif: ['Playfair Display', 'serif'],
                header: ['Montserrat', 'sans-serif'],
                body: ['Lato', 'sans-serif'],
            },
        },
    },
    plugins: [],
}

