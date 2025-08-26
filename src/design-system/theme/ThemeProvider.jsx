// design-system/theme/ThemeProvider.jsx - Comprehensive theme management system
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokens, themes } from '../tokens/index.js';

// Theme context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  tokens: tokens,
  currentTheme: themes.light,
  isDark: false,
  isHighContrast: false,
  toggleTheme: () => {},
  resetTheme: () => {}
});

// Theme storage key
const THEME_STORAGE_KEY = 'quiz-app-theme';

// System theme detection
const getSystemTheme = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// High contrast detection
const getSystemHighContrast = () => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-contrast: high)').matches;
  }
  return false;
};

// Theme Provider Component
export const ThemeProvider = ({ 
  children, 
  defaultTheme = 'light',
  respectSystemPreferences = true,
  enablePersistence = true,
  onThemeChange = null
}) => {
  const [theme, setThemeState] = useState(() => {
    // Initialize theme based on preferences
    if (enablePersistence && typeof window !== 'undefined') {
      const stored = localStorage.getItem(THEME_STORAGE_KEY);
      if (stored && themes[stored]) {
        return stored;
      }
    }
    
    if (respectSystemPreferences) {
      const systemTheme = getSystemTheme();
      const hasHighContrast = getSystemHighContrast();
      
      if (hasHighContrast) {
        return 'highContrast';
      }
      return systemTheme;
    }
    
    return defaultTheme;
  });

  // Current theme object
  const currentTheme = themes[theme] || themes.light;

  // Theme state derivatives
  const isDark = theme === 'dark';
  const isHighContrast = theme === 'highContrast';

  // Set theme with persistence and callbacks
  const setTheme = useCallback((newTheme) => {
    if (!themes[newTheme]) {
      console.warn(`Theme "${newTheme}" does not exist. Available themes:`, Object.keys(themes));
      return;
    }

    setThemeState(newTheme);

    // Persist to localStorage
    if (enablePersistence && typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    }

    // Call change callback
    if (onThemeChange) {
      onThemeChange(newTheme, themes[newTheme]);
    }

    // Update document attributes for CSS custom properties
    updateDocumentTheme(newTheme, themes[newTheme]);
  }, [enablePersistence, onThemeChange]);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    const newTheme = isDark ? 'light' : 'dark';
    setTheme(newTheme);
  }, [isDark, setTheme]);

  // Reset to default theme
  const resetTheme = useCallback(() => {
    setTheme(defaultTheme);
  }, [defaultTheme, setTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (!respectSystemPreferences) return;

    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');

    const handleSystemThemeChange = () => {
      // Only auto-update if user hasn't manually set a theme
      const hasManualTheme = enablePersistence && localStorage.getItem(THEME_STORAGE_KEY);
      if (hasManualTheme) return;

      const systemTheme = getSystemTheme();
      const hasHighContrast = getSystemHighContrast();
      
      if (hasHighContrast) {
        setTheme('highContrast');
      } else {
        setTheme(systemTheme);
      }
    };

    darkModeQuery.addListener(handleSystemThemeChange);
    highContrastQuery.addListener(handleSystemThemeChange);

    return () => {
      darkModeQuery.removeListener(handleSystemThemeChange);
      highContrastQuery.removeListener(handleSystemThemeChange);
    };
  }, [respectSystemPreferences, enablePersistence, setTheme]);

  // Update document theme on mount and theme changes
  useEffect(() => {
    updateDocumentTheme(theme, currentTheme);
  }, [theme, currentTheme]);

  // Context value
  const contextValue = {
    theme,
    setTheme,
    tokens,
    currentTheme,
    isDark,
    isHighContrast,
    toggleTheme,
    resetTheme,
    availableThemes: Object.keys(themes),
    systemPreferences: {
      respectSystem: respectSystemPreferences,
      systemTheme: getSystemTheme(),
      systemHighContrast: getSystemHighContrast()
    }
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <div 
        className={`theme-${theme}`} 
        data-theme={theme}
        data-dark={isDark}
        data-high-contrast={isHighContrast}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

// Update document with theme CSS custom properties
const updateDocumentTheme = (themeName, themeTokens) => {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;
  
  // Clear existing theme classes
  root.classList.remove('theme-light', 'theme-dark', 'theme-high-contrast');
  
  // Add current theme class
  root.classList.add(`theme-${themeName}`);
  
  // Set data attributes
  root.setAttribute('data-theme', themeName);
  root.setAttribute('data-dark', themeName === 'dark');
  root.setAttribute('data-high-contrast', themeName === 'highContrast');

  // Set CSS custom properties for theme colors
  if (themeTokens?.colors) {
    setCSSCustomProperties(root, themeTokens.colors, '--color');
  }

  // Set other token CSS properties
  setCSSCustomProperties(root, tokens.spacing.spacing, '--spacing');
  setCSSCustomProperties(root, tokens.typography.sizes, '--font-size');
  setCSSCustomProperties(root, tokens.spacing.borderRadius, '--border-radius');
  setCSSCustomProperties(root, tokens.spacing.boxShadow, '--shadow');
};

// Helper to set CSS custom properties
const setCSSCustomProperties = (element, tokenObject, prefix, path = '') => {
  Object.entries(tokenObject).forEach(([key, value]) => {
    if (typeof value === 'object' && value !== null) {
      // Recursively handle nested objects
      setCSSCustomProperties(element, value, prefix, `${path}-${key}`);
    } else {
      // Set CSS custom property
      const propertyName = `${prefix}${path}-${key}`;
      element.style.setProperty(propertyName, value);
    }
  });
};

// Hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Hook for theme-aware styles
export const useThemeStyles = () => {
  const { currentTheme, tokens } = useTheme();
  
  return {
    colors: currentTheme.colors,
    tokens,
    
    // Helper functions for common style patterns
    getColor: (path) => {
      const keys = path.split('.');
      let value = currentTheme.colors;
      for (const key of keys) {
        value = value?.[key];
        if (!value) break;
      }
      return value || path;
    },
    
    getSpacing: (key) => tokens.spacing.spacing[key] || key,
    
    getFontSize: (key) => tokens.typography.sizes[key] || key,
    
    getBorderRadius: (key) => tokens.spacing.borderRadius[key] || key,
    
    getShadow: (key) => tokens.spacing.boxShadow[key] || key,
    
    // Responsive helpers
    getResponsiveValue: (values, breakpoint = 'base') => {
      return values[breakpoint] || values.base || values;
    }
  };
};

// Hook for component-specific theme tokens
export const useComponentTheme = (componentName) => {
  const { tokens } = useTheme();
  const componentTokens = tokens.components[componentName];
  
  if (!componentTokens) {
    console.warn(`Component theme "${componentName}" not found`);
    return {};
  }
  
  return componentTokens;
};

// Theme utility functions
export const themeUtils = {
  // Get all available themes
  getAvailableThemes: () => Object.keys(themes),
  
  // Check if theme exists
  themeExists: (themeName) => !!themes[themeName],
  
  // Get theme by name
  getTheme: (themeName) => themes[themeName],
  
  // Create theme CSS classes for Tailwind
  generateTailwindClasses: (themeColors) => {
    const classes = {};
    
    Object.entries(themeColors).forEach(([category, colors]) => {
      if (typeof colors === 'object') {
        Object.entries(colors).forEach(([shade, value]) => {
          const className = `${category}-${shade}`;
          classes[className] = value;
        });
      }
    });
    
    return classes;
  }
};

export default ThemeProvider;
