/**
 * Design Tokens - Single source of truth for design values
 * Used across Tailwind config and CSS-in-JS
 */

export const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6', // Main brand
    600: '#2563eb', // Hover
    700: '#1d4ed8', // Active
    800: '#1e40af',
    900: '#1e3a8a'  // Text
  },
  
  // Semantic colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e', // Main success
    600: '#16a34a',
    700: '#15803d', // Dark success
    800: '#166534',
    900: '#14532d'
  },
  
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444', // Main error
    600: '#dc2626',
    700: '#b91c1c', // Dark error
    800: '#991b1b',
    900: '#7f1d1d'
  },
  
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f59e0b', // Main warning
    600: '#d97706',
    700: '#b45309', // Dark warning
    800: '#92400e',
    900: '#78350f'
  },
  
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9', // Main info
    600: '#0284c7',
    700: '#0369a1', // Dark info
    800: '#075985',
    900: '#0c4a6e'
  },
  
  // Educational context colors
  exercise: {
    correct: '#22c55e',
    incorrect: '#ef4444',
    partial: '#f59e0b',
    hint: '#6366f1',
    example: '#8b5cf6'
  },
  
  // Neutral grays
  gray: {
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

export const spacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
  '4xl': '6rem',   // 96px
  '5xl': '8rem'    // 128px
};

export const typography = {
  fontSizes: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem'      // 48px
  },
  
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  fontWeights: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700'
  }
};

export const borderRadius = {
  none: '0',
  sm: '0.125rem',    // 2px
  md: '0.375rem',    // 6px
  lg: '0.5rem',      // 8px
  xl: '0.75rem',     // 12px
  '2xl': '1rem',     // 16px
  '3xl': '1.5rem',   // 24px
  full: '9999px'
};

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)'
};

export const animations = {
  durations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms'
  },
  
  easings: {
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Component-specific tokens
export const components = {
  button: {
    heights: {
      sm: '2rem',    // 32px
      md: '2.5rem',  // 40px
      lg: '3rem'     // 48px
    },
    
    padding: {
      sm: '0.5rem 0.75rem',  // 8px 12px
      md: '0.625rem 1rem',   // 10px 16px
      lg: '0.75rem 1.5rem'   // 12px 24px
    }
  },
  
  card: {
    padding: {
      sm: '1rem',      // 16px
      md: '1.5rem',    // 24px
      lg: '2rem'       // 32px
    },
    
    borderRadius: {
      sm: '0.375rem',  // 6px
      md: '0.5rem',    // 8px
      lg: '0.75rem'    // 12px
    }
  },
  
  input: {
    heights: {
      sm: '2rem',      // 32px
      md: '2.5rem',    // 40px
      lg: '3rem'       // 48px
    },
    
    borderRadius: '0.375rem' // 6px
  }
};

// Accessibility
export const a11y = {
  minTouchTarget: '44px', // iOS minimum
  focusRingWidth: '2px',
  focusRingOffset: '2px',
  colorContrastMin: 4.5   // WCAG AA
};

// Theme variants
export const themes = {
  light: {
    colors: {
      background: colors.gray[50],
      surface: '#ffffff',
      text: colors.gray[900],
      textSecondary: colors.gray[600],
      border: colors.gray[200],
      primary: colors.primary[500],
      success: colors.success[500],
      error: colors.error[500],
      warning: colors.warning[500],
      info: colors.info[500]
    }
  },
  dark: {
    colors: {
      background: colors.gray[900],
      surface: colors.gray[800],
      text: colors.gray[50],
      textSecondary: colors.gray[300],
      border: colors.gray[700],
      primary: colors.primary[400],
      success: colors.success[400],
      error: colors.error[400],
      warning: colors.warning[400],
      info: colors.info[400]
    }
  }
};

export const tokens = {
  colors,
  spacing,
  typography,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  components,
  a11y,
  themes
};

export default tokens;
