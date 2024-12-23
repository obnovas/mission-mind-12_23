/** @type {import('tailwindcss').Config} */
import { colors } from './src/styles/colors';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: colors.ocean,
        secondary: colors.sand,
        accent: colors.accent,
        tertiary: colors.shell,

        // Custom banner color
        banner: '#f74020',

        // Journey Colors
        journey: {
          ocean: colors.ocean,
          coral: colors.coral,
          sage: colors.sage,
          sunset: colors.sunset,
          lavender: colors.lavender,
          mint: colors.mint,
          berry: colors.berry,
          honey: colors.honey,
          sand: colors.sand,
          shell: colors.shell,
        },

        // Semantic Colors
        success: colors.success,
        warning: colors.warning,
        error: colors.error,

        // Neutral Colors
        neutral: {
          ...colors.neutral,
          25: '#FCFCFD',
        },

        // Component-specific colors
        background: {
          DEFAULT: colors.sand[50],
          alt: colors.sand[100],
        },
        surface: {
          DEFAULT: colors.neutral[50],
          alt: colors.neutral[100],
        },
        text: {
          primary: colors.neutral[900],
          secondary: colors.neutral[600],
          tertiary: colors.neutral[400],
          inverted: colors.neutral[50],
        },
        border: {
          DEFAULT: colors.neutral[200],
          hover: colors.neutral[300],
          focus: colors.accent[500],
        },

        // Import all color families with extra subtle shades
        ocean: { ...colors.ocean, 25: '#F8FBFE' },
        coral: { ...colors.coral, 25: '#FEF8F8' },
        sage: { ...colors.sage, 25: '#F7FBF8' },
        sunset: { ...colors.sunset, 25: '#FEF9F6' },
        lavender: { ...colors.lavender, 25: '#FCF8FE' },
        mint: { ...colors.mint, 25: '#F6FBF9' },
        berry: { ...colors.berry, 25: '#FEF6FA' },
        honey: { ...colors.honey, 25: '#FEFDF6' },
        sand: { ...colors.sand, 25: '#FDFCFB' },
        shell: { ...colors.shell, 25: '#FAFBFD' },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};