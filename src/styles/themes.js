/**
 * Theme Configurations
 * Light and dark theme definitions using design tokens
 */

import { colors, spacing, typography, borderRadius, shadows } from './tokens.js';

export const lightTheme = {
  name: 'light',
  
  colors: {
    // Background colors
    background: {
      primary: '#ffffff',
      secondary: colors.gray[50],
      tertiary: colors.gray[100],
    },
    
    // Surface colors (for cards, modals, etc.)
    surface: {
      primary: '#ffffff',
      secondary: colors.gray[50],
      elevated: '#ffffff',
    },
    
    // Text colors
    text: {
      primary: colors.gray[900],
      secondary: colors.gray[700],
      tertiary: colors.gray[500],
      inverse: '#ffffff',
      disabled: colors.gray[400],
    },
    
    // Border colors
    border: {
      primary: colors.gray[200],
      secondary: colors.gray[300],
      focus: colors.primary[500],
      error: colors.error[500],
      success: colors.success[500],
    },
    
    // Brand colors (consistent across themes)
    brand: {
      primary: colors.primary[500],
      secondary: colors.success[500],
    },
    
    // Status colors
    status: {
      success: colors.success[500],
      error: colors.error[500],
      warning: colors.warning[500],
      info: colors.info[500],
    },
    
    // Interactive element colors
    interactive: {
      hover: colors.gray[100],
      active: colors.gray[200],
      selected: colors.primary[50],
      focus: colors.primary[100],
    },
    
    // Exercise-specific colors
    exercise: {
      correct: colors.exercise.correct,
      incorrect: colors.exercise.incorrect,
      partial: colors.exercise.partial,
      hint: colors.exercise.hint,
      example: colors.exercise.example,
    },
  },
  
  shadows: {
    ...shadows,
    // Theme-specific shadow adjustments
    card: shadows.sm,
    modal: shadows.xl,
    dropdown: shadows.lg,
  },
};

export const darkTheme = {
  name: 'dark',
  
  colors: {
    // Background colors
    background: {
      primary: colors.gray[900],
      secondary: colors.gray[800],
      tertiary: colors.gray[700],
    },
    
    // Surface colors
    surface: {
      primary: colors.gray[800],
      secondary: colors.gray[700],
      elevated: colors.gray[750],
    },
    
    // Text colors
    text: {
      primary: colors.gray[50],
      secondary: colors.gray[200],
      tertiary: colors.gray[400],
      inverse: colors.gray[900],
      disabled: colors.gray[600],
    },
    
    // Border colors
    border: {
      primary: colors.gray[700],
      secondary: colors.gray[600],
      focus: colors.primary[400],
      error: colors.error[400],
      success: colors.success[400],
    },
    
    // Brand colors (adjusted for dark theme)
    brand: {
      primary: colors.primary[400],
      secondary: colors.success[400],
    },
    
    // Status colors (lighter variants for dark theme)
    status: {
      success: colors.success[400],
      error: colors.error[400],
      warning: colors.warning[400],
      info: colors.info[400],
    },
    
    // Interactive element colors
    interactive: {
      hover: colors.gray[700],
      active: colors.gray[600],
      selected: colors.primary[900],
      focus: colors.primary[800],
    },
    
    // Exercise-specific colors (adjusted for dark theme)
    exercise: {
      correct: colors.success[400],
      incorrect: colors.error[400],
      partial: colors.warning[400],
      hint: colors.info[400],
      example: colors.primary[400],
    },
  },
  
  shadows: {
    // Dark theme shadows (more subtle)
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.3), 0 8px 10px -6px rgb(0 0 0 / 0.3)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.5)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
    card: '0 4px 6px -1px rgb(0 0 0 / 0.3), 0 2px 4px -2px rgb(0 0 0 / 0.3)',
    modal: '0 20px 25px -5px rgb(0 0 0 / 0.5), 0 8px 10px -6px rgb(0 0 0 / 0.5)',
    dropdown: '0 10px 15px -3px rgb(0 0 0 / 0.3), 0 4px 6px -4px rgb(0 0 0 / 0.3)',
  },
};

// High contrast theme for accessibility
export const highContrastTheme = {
  name: 'high-contrast',
  
  colors: {
    background: {
      primary: '#000000',
      secondary: '#1a1a1a',
      tertiary: '#333333',
    },
    
    surface: {
      primary: '#000000',
      secondary: '#1a1a1a',
      elevated: '#2d2d2d',
    },
    
    text: {
      primary: '#ffffff',
      secondary: '#e6e6e6',
      tertiary: '#cccccc',
      inverse: '#000000',
      disabled: '#808080',
    },
    
    border: {
      primary: '#ffffff',
      secondary: '#cccccc',
      focus: '#ffff00',
      error: '#ff4444',
      success: '#00ff00',
    },
    
    brand: {
      primary: '#0099ff',
      secondary: '#00ff00',
    },
    
    status: {
      success: '#00ff00',
      error: '#ff4444',
      warning: '#ffaa00',
      info: '#0099ff',
    },
    
    interactive: {
      hover: '#333333',
      active: '#4d4d4d',
      selected: '#0066cc',
      focus: '#ffff00',
    },
    
    exercise: {
      correct: '#00ff00',
      incorrect: '#ff4444',
      partial: '#ffaa00',
      hint: '#0099ff',
      example: '#cc99ff',
    },
  },
  
  shadows: {
    // High contrast theme uses minimal shadows
    sm: 'none',
    md: '0 0 0 2px #ffffff',
    lg: '0 0 0 3px #ffffff',
    xl: '0 0 0 4px #ffffff',
    '2xl': '0 0 0 5px #ffffff',
    inner: 'inset 0 0 0 1px #ffffff',
    card: '0 0 0 2px #ffffff',
    modal: '0 0 0 4px #ffffff',
    dropdown: '0 0 0 3px #ffffff',
  },
};

// Default theme (light)
export const defaultTheme = lightTheme;

// Theme utilities
export const getThemeValue = (theme, path) => {
  const keys = path.split('.');
  let value = theme;
  
  for (const key of keys) {
    value = value[key];
    if (!value) return null;
  }
  
  return value;
};

export const createThemeCSS = (theme) => {
  const css = [];
  
  const addCSSVariables = (obj, prefix = '') => {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        addCSSVariables(value, `${prefix}${key}-`);
      } else {
        css.push(`--${prefix}${key}: ${value};`);
      }
    });
  };
  
  addCSSVariables(theme);
  
  return css.join('\n');
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
  'high-contrast': highContrastTheme,
};

export default themes;
