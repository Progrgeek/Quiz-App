/**
 * Component-Specific Design Tokens
 * Tokens specifically for component variants and states
 */

import { tokens } from './tokens.js';

const { colors, spacing, typography, borderRadius, shadows } = tokens;

export const components = {
  // Button Component Variants
  button: {
    variants: {
      primary: {
        background: colors.primary[500],
        backgroundHover: colors.primary[600],
        backgroundActive: colors.primary[700],
        color: '#ffffff',
        border: 'transparent',
      },
      
      secondary: {
        background: colors.gray[100],
        backgroundHover: colors.gray[200],
        backgroundActive: colors.gray[300],
        color: colors.gray[900],
        border: colors.gray[300],
      },
      
      success: {
        background: colors.success[500],
        backgroundHover: colors.success[600],
        backgroundActive: colors.success[700],
        color: '#ffffff',
        border: 'transparent',
      },
      
      error: {
        background: colors.error[500],
        backgroundHover: colors.error[600],
        backgroundActive: colors.error[700],
        color: '#ffffff',
        border: 'transparent',
      },
      
      outline: {
        background: 'transparent',
        backgroundHover: colors.gray[50],
        backgroundActive: colors.gray[100],
        color: colors.gray[700],
        border: colors.gray[300],
      },
      
      ghost: {
        background: 'transparent',
        backgroundHover: colors.gray[100],
        backgroundActive: colors.gray[200],
        color: colors.gray[700],
        border: 'transparent',
      },
    },
    
    sizes: {
      xs: {
        height: '1.75rem',   // 28px
        padding: '0.25rem 0.5rem',
        fontSize: typography.fontSizes.xs,
        borderRadius: borderRadius.sm,
      },
      sm: {
        height: '2rem',      // 32px
        padding: '0.375rem 0.75rem',
        fontSize: typography.fontSizes.sm,
        borderRadius: borderRadius.md,
      },
      md: {
        height: '2.5rem',    // 40px
        padding: '0.5rem 1rem',
        fontSize: typography.fontSizes.base,
        borderRadius: borderRadius.md,
      },
      lg: {
        height: '3rem',      // 48px
        padding: '0.75rem 1.5rem',
        fontSize: typography.fontSizes.lg,
        borderRadius: borderRadius.lg,
      },
      xl: {
        height: '3.5rem',    // 56px
        padding: '1rem 2rem',
        fontSize: typography.fontSizes.xl,
        borderRadius: borderRadius.lg,
      },
    },
    
    states: {
      disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
      loading: {
        cursor: 'wait',
      },
      focus: {
        outline: '2px solid',
        outlineColor: colors.primary[500],
        outlineOffset: '2px',
      },
    },
  },
  
  // Card Component Variants
  card: {
    variants: {
      default: {
        background: '#ffffff',
        border: colors.gray[200],
        shadow: shadows.sm,
      },
      elevated: {
        background: '#ffffff',
        border: 'transparent',
        shadow: shadows.md,
      },
      outlined: {
        background: '#ffffff',
        border: colors.gray[300],
        shadow: 'none',
      },
      filled: {
        background: colors.gray[50],
        border: 'transparent',
        shadow: 'none',
      },
    },
    
    sizes: {
      sm: {
        padding: spacing.md,
        borderRadius: borderRadius.md,
      },
      md: {
        padding: spacing.lg,
        borderRadius: borderRadius.lg,
      },
      lg: {
        padding: spacing.xl,
        borderRadius: borderRadius.xl,
      },
    },
  },
  
  // Input Component Variants
  input: {
    variants: {
      default: {
        background: '#ffffff',
        border: colors.gray[300],
        borderFocus: colors.primary[500],
        color: colors.gray[900],
        placeholder: colors.gray[500],
      },
      filled: {
        background: colors.gray[50],
        border: colors.gray[200],
        borderFocus: colors.primary[500],
        color: colors.gray[900],
        placeholder: colors.gray[500],
      },
      flushed: {
        background: 'transparent',
        border: 'transparent',
        borderBottom: colors.gray[300],
        borderFocus: colors.primary[500],
        color: colors.gray[900],
        placeholder: colors.gray[500],
      },
    },
    
    sizes: {
      sm: {
        height: '2rem',
        padding: '0.25rem 0.5rem',
        fontSize: typography.fontSizes.sm,
        borderRadius: borderRadius.sm,
      },
      md: {
        height: '2.5rem',
        padding: '0.5rem 0.75rem',
        fontSize: typography.fontSizes.base,
        borderRadius: borderRadius.md,
      },
      lg: {
        height: '3rem',
        padding: '0.75rem 1rem',
        fontSize: typography.fontSizes.lg,
        borderRadius: borderRadius.lg,
      },
    },
    
    states: {
      error: {
        border: colors.error[500],
        borderFocus: colors.error[600],
        color: colors.error[700],
      },
      success: {
        border: colors.success[500],
        borderFocus: colors.success[600],
        color: colors.success[700],
      },
      disabled: {
        background: colors.gray[100],
        border: colors.gray[200],
        color: colors.gray[400],
        cursor: 'not-allowed',
      },
    },
  },
  
  // Exercise-Specific Components
  exercise: {
    answerChoice: {
      variants: {
        default: {
          background: '#ffffff',
          border: colors.gray[300],
          borderHover: colors.primary[300],
          color: colors.gray[900],
        },
        selected: {
          background: colors.primary[50],
          border: colors.primary[500],
          color: colors.primary[900],
        },
        correct: {
          background: colors.success[50],
          border: colors.success[500],
          color: colors.success[900],
        },
        incorrect: {
          background: colors.error[50],
          border: colors.error[500],
          color: colors.error[900],
        },
      },
    },
    
    questionHeader: {
      background: colors.gray[50],
      border: colors.gray[200],
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
    },
    
    progressBar: {
      background: colors.gray[200],
      fill: colors.primary[500],
      height: '0.5rem',
      borderRadius: borderRadius.full,
    },
  },
  
  // Toast/Notification Components
  toast: {
    variants: {
      success: {
        background: colors.success[50],
        border: colors.success[200],
        icon: colors.success[500],
        text: colors.success[800],
      },
      error: {
        background: colors.error[50],
        border: colors.error[200],
        icon: colors.error[500],
        text: colors.error[800],
      },
      warning: {
        background: colors.warning[50],
        border: colors.warning[200],
        icon: colors.warning[500],
        text: colors.warning[800],
      },
      info: {
        background: colors.info[50],
        border: colors.info[200],
        icon: colors.info[500],
        text: colors.info[800],
      },
    },
  },
};

export default components;
