import { colors, spacing, typography, borderRadius, shadows, breakpoints, components } from './src/styles/tokens.js';
import { tailwindAnimations } from './src/styles/animations.js';

export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './public/**/*.html'
  ],
  safelist: [
    // Preserve color classes used in Stats component
    'text-primary-500', 'text-primary-600', 'text-primary-700', 'bg-primary-500',
    'text-blue-500', 'text-blue-600', 'text-blue-700', 'bg-blue-500',
    'text-success-500', 'text-success-600', 'text-success-700', 'bg-success-500',
    'text-warning-500', 'text-warning-600', 'text-warning-700', 'bg-warning-500',
    'text-error-500', 'text-error-600', 'text-error-700', 'bg-error-500',
    // Gradient backgrounds
    'bg-gradient-to-br', 'from-primary-50', 'to-primary-100',
    'from-blue-50', 'to-blue-100',
    'from-success-50', 'to-success-100',
    'from-warning-50', 'to-warning-100',
    'from-error-50', 'to-error-100',
    // Gradient progress bars
    'bg-gradient-to-r', 'from-primary-500', 'to-primary-600',
    'from-blue-500', 'to-blue-600',
    'from-success-500', 'to-success-600',
    'from-warning-500', 'to-warning-600',
    'from-error-500', 'to-error-600',
    // Icon colors
    'text-primary-600', 'text-blue-600', 'text-success-600', 'text-warning-600', 'text-error-600'
  ],
  theme: {
    extend: {
      colors: {
        ...colors,
        // Semantic color aliases
        brand: colors.primary,
        danger: colors.error,
        safe: colors.success,
        caution: colors.warning,
        neutral: colors.gray
      },
      spacing: {
        ...spacing,
        // Component-specific spacing
        'button-sm': components.button.padding.sm,
        'button-md': components.button.padding.md,
        'button-lg': components.button.padding.lg,
        'card-sm': components.card.padding.sm,
        'card-md': components.card.padding.md,
        'card-lg': components.card.padding.lg
      },
      fontSize: typography.fontSizes,
      lineHeight: typography.lineHeights,
      fontWeight: typography.fontWeights,
      borderRadius: {
        ...borderRadius,
        'card-sm': components.card.borderRadius.sm,
        'card-md': components.card.borderRadius.md,
        'card-lg': components.card.borderRadius.lg,
        'input': components.input.borderRadius
      },
      boxShadow: shadows,
      screens: breakpoints,
      height: {
        'button-sm': components.button.heights.sm,
        'button-md': components.button.heights.md,
        'button-lg': components.button.heights.lg,
        'input-sm': components.input.heights.sm,
        'input-md': components.input.heights.md,
        'input-lg': components.input.heights.lg
      },
      animation: {
        // Design system animations
        ...tailwindAnimations,
        // Legacy animations (keep for compatibility)
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-soft': 'bounceSoft 0.6s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceSoft: {
          '0%, 20%, 53%, 80%, 100%': { transform: 'translate3d(0,0,0)' },
          '40%, 43%': { transform: 'translate3d(0, -5px, 0)' },
          '70%': { transform: 'translate3d(0, -3px, 0)' },
          '90%': { transform: 'translate3d(0, -1px, 0)' }
        }
      }
    },
  },
  plugins: [
    // Add Tailwind plugins for better form styling
    function({ addUtilities }) {
      addUtilities({
        '.touch-target': {
          'min-height': '44px',
          'min-width': '44px'
        },
        '.focus-ring': {
          'outline': '2px solid rgb(59 130 246 / 0.5)',
          'outline-offset': '2px'
        },
        '.exercise-card': {
          'border-radius': components.card.borderRadius.md,
          'padding': components.card.padding.md,
          'box-shadow': shadows.md
        }
      });
    }
  ],
};
