/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: {
        '2xl': '1340px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        // Official ICOSST Primary Accent (#0a5572)
        primary: {
          DEFAULT: '#0a5572',
          foreground: '#ffffff',
          50: '#f0f8fa',
          100: '#d9edf3',
          200: '#b5dde8',
          300: '#7ec1d4',
          400: '#42a0be',
          500: '#1781a8',
          600: '#0e698c',
          700: '#0a5572', // Primary accent from ICOSST design system
          800: '#08445c',
          900: '#07384c',
          950: '#031f2b',
        },
        // Map emerald to ICOSST primary palette so existing component classes inherit #0a5572
        emerald: {
          50: '#f0f8fa',
          100: '#d9edf3',
          200: '#b5dde8',
          300: '#7ec1d4',
          400: '#42a0be',
          500: '#1781a8',
          600: '#0e698c',
          700: '#0a5572',
          800: '#08445c',
          900: '#07384c',
          950: '#031f2b',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: '#0a5572',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        // Official academic conference brand palette
        uet: {
          green: '#0a5572',
          dark: '#07384c',
          light: '#1781a8',
          gold: '#d97706',
          navy: '#0a5572',
        },
        icosst: {
          primary: '#0a5572',
          accent: '#0a5572',
          dark: '#08445c',
          light: '#1781a8',
          border: '#131313',
          bg: '#ffffff',
          text: '#000000',
          muted: '#666666',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        card: '50px',
      },
      fontFamily: {
        sans: ['"IBM Plex Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Roboto', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
      },
      fontSize: {
        'display': ['46px', { lineHeight: '55.2px', fontWeight: '600' }],
        'heading-1': ['42px', { lineHeight: '50px', fontWeight: '600' }],
        'heading-2': ['38px', { lineHeight: '45px', fontWeight: '600' }],
        'heading-3': ['30px', { lineHeight: '38px', fontWeight: '600' }],
        'heading-4': ['24px', { lineHeight: '28.8px', fontWeight: '600' }],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        marquee: {
          from: { transform: 'translateX(0%)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee 25s linear infinite',
      },
    },
  },
  plugins: [],
};
