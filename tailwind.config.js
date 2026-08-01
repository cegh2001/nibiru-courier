/** @type {import('tailwindcss').Config} */

const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        { "text-shadow": (value) => ({ textShadow: value }) },
        { values: theme("textShadow") }
      );
    }),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))'
      },
      boxShadow: {
        '5xl': '20px 20px 50px rgba(0, 0, 0, 0.5)',
        rxl: '7px 0px 3px -3px rgba(0, 0, 0, 0.1)',
        'sm-xt': '0 0px 1.5px 0 rgb(0 0 0 / 0.05)',
        center: '0 0px 6px 0 rgb(0 0 0 / 0.1)',
        'center-lg': '0 0px 12px 0 rgb(0 0 0 / 0.1)'
      },
      colors: {
        // Nibiru brand colors - modern courier palette
        nibiru: {
          DEFAULT: '#1E3A5F',    // Deep navy
          dark: '#0F1E33',
          light: '#3B82F6',
          lighter: '#DBEAFE',
          accent: '#F59E0B',     // Amber accent for CTAs
        },
        crimson: {
          DEFAULT: '#DC2626',
          dark: '#991B1B',
          light: '#EF4444'
        },
        emerald: {
          ...colors.emerald,
          DEFAULT: '#10B981',
          dark: '#059669'
        },
        navy: {
          DEFAULT: '#0C3464',
          dark: '#001733',
          light: '#428DE8',
          lighter: '#BCDAFF',
          rgba: 'rgba(188,218,255,.5)'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        title: ['var(--font-outfit)', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        },
        'pulse-dot': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'pulse-dot': 'pulse-dot 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }
    },
    textShadow: {
      sm: '1px 1px 2px var(--tw-shadow-color)',
      DEFAULT: '2px 2px 4px var(--tw-shadow-color)',
      lg: '4px 4px 8px var(--tw-shadow-color)',
      xl: '4px 4px 16px var(--tw-shadow-color)'
    },
  },
};
