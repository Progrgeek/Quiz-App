/**
 * Design System Tokens for Exercise Components
 * Week 2 - Day 8: Component Standardization
 */

// Color Tokens
export const colors = {
  // Primary Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main primary
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a'
  },
  
  // Success Colors (for correct answers)
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a', // Main success
    700: '#15803d',
    800: '#166534',
    900: '#14532d'
  },
  
  // Error Colors (for incorrect answers)
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626', // Main error
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  // Warning Colors (for hints/partial credit)
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706', // Main warning
    700: '#b45309',
    800: '#92400e',
    900: '#78350f'
  },
  
  // Neutral Colors
  neutral: {
    0: '#ffffff',
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827'
  }
};

// Typography Tokens
export const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace']
  },
  
  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }]
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

// Spacing Tokens
export const spacing = {
  0: '0px',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  3: '0.75rem',   // 12px
  4: '1rem',      // 16px
  5: '1.25rem',   // 20px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  10: '2.5rem',   // 40px
  12: '3rem',     // 48px
  16: '4rem',     // 64px
  20: '5rem',     // 80px
  24: '6rem'      // 96px
};

// Border Radius Tokens
export const borderRadius = {
  none: '0px',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px'
};

// Shadow Tokens
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
};

// Breakpoints for Responsive Design
export const breakpoints = {
  mobile: '0px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px'
};

// Touch Target Sizes (for accessibility)
export const touchTargets = {
  minimum: '44px',      // iOS minimum
  comfortable: '48px',  // Recommended
  large: '56px'        // For primary actions
};

// Exercise-Specific Tokens
export const exercise = {
  // Layout configurations
  layouts: {
    'multiple-choice': {
      mobile: 'grid-cols-1 gap-3',
      tablet: 'grid-cols-2 gap-4', 
      desktop: 'grid-cols-2 gap-6'
    },
    'drag-drop': {
      mobile: 'grid-cols-1 gap-3',
      tablet: 'grid-cols-2 gap-4',
      desktop: 'grid-cols-3 gap-6'
    },
    'fill-blanks': {
      mobile: 'space-y-4',
      tablet: 'space-y-6',
      desktop: 'space-y-8'
    }
  },
  
  // State colors for options
  states: {
    default: {
      bg: colors.neutral[50],
      border: colors.neutral[300],
      text: colors.neutral[700],
      hover: {
        bg: colors.neutral[100],
        border: colors.neutral[400]
      }
    },
    selected: {
      bg: colors.primary[50],
      border: colors.primary[500],
      text: colors.primary[700]
    },
    correct: {
      bg: colors.success[50],
      border: colors.success[500],
      text: colors.success[700]
    },
    incorrect: {
      bg: colors.error[50],
      border: colors.error[500],
      text: colors.error[700]
    }
  }
};

// Animation Durations
export const animation = {
  fast: '150ms',
  base: '200ms',
  slow: '300ms',
  slower: '500ms'
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  breakpoints,
  touchTargets,
  exercise,
  animation
};
