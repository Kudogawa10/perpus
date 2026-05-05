/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.{js,ts,jsx,tsx}',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // MyPerpus Brand - Black & White base with accent
                perpus: {
                    black:     '#0a0a0a',
                    white:     '#fafafa',
                    gray: {
                        50:  '#f8f8f8',
                        100: '#efefef',
                        200: '#dfdfdf',
                        300: '#c0c0c0',
                        400: '#a0a0a0',
                        500: '#808080',
                        600: '#606060',
                        700: '#404040',
                        800: '#202020',
                        900: '#111111',
                    },
                    accent: '#1a1a1a',   // near-black accent
                    gold:   '#c9a84c',   // subtle gold for highlights
                    red:    '#e53e3e',   // danger
                    green:  '#38a169',   // success
                    blue:   '#3182ce',   // info
                },
            },
            fontFamily: {
                sans:    ['Instrument Sans', 'system-ui', 'sans-serif'],
                serif:   ['Playfair Display', 'Georgia', 'serif'],
                mono:    ['JetBrains Mono', 'monospace'],
                display: ['Syne', 'system-ui', 'sans-serif'],
            },
            animation: {
                'fade-in':       'fadeIn 0.4s ease-out',
                'slide-up':      'slideUp 0.4s ease-out',
                'slide-right':   'slideRight 0.3s ease-out',
                'pulse-slow':    'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'shimmer':       'shimmer 1.5s infinite',
            },
            keyframes: {
                fadeIn:    { from: { opacity: '0' }, to: { opacity: '1' } },
                slideUp:   { from: { transform: 'translateY(12px)', opacity: '0' }, to: { transform: 'translateY(0)', opacity: '1' } },
                slideRight:{ from: { transform: 'translateX(-12px)', opacity: '0' }, to: { transform: 'translateX(0)', opacity: '1' } },
                shimmer:   { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
            },
            boxShadow: {
                'perpus-sm':  '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)',
                'perpus':     '0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.05)',
                'perpus-lg':  '0 10px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)',
                'perpus-xl':  '0 20px 60px rgba(0,0,0,0.12), 0 8px 20px rgba(0,0,0,0.08)',
                'dark-sm':    '0 1px 3px rgba(0,0,0,0.3)',
                'dark':       '0 4px 16px rgba(0,0,0,0.4)',
                'dark-lg':    '0 10px 40px rgba(0,0,0,0.5)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
