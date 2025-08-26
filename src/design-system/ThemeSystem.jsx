/**
 * Week 2 Day 10: Theme System Integration
 * Light/Dark Mode Support & High Contrast
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme Context
const ThemeContext = createContext({
  theme: 'light',
  setTheme: () => {},
  isDark: false,
  isHighContrast: false,
  setHighContrast: () => {}
});

// Theme Provider Component
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [isHighContrast, setHighContrast] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('quiz-app-theme');
    const savedHighContrast = localStorage.getItem('quiz-app-high-contrast') === 'true';
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(systemPrefersDark ? 'dark' : 'light');
    }
    
    if (savedHighContrast) {
      setHighContrast(true);
    }
  }, []);

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove previous theme classes
    root.classList.remove('light', 'dark', 'high-contrast');
    
    // Add current theme classes
    root.classList.add(theme);
    if (isHighContrast) {
      root.classList.add('high-contrast');
    }
    
    // Save to localStorage
    localStorage.setItem('quiz-app-theme', theme);
    localStorage.setItem('quiz-app-high-contrast', isHighContrast.toString());
  }, [theme, isHighContrast]);

  const value = {
    theme,
    setTheme,
    isDark: theme === 'dark',
    isHighContrast,
    setHighContrast
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Theme Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Theme-aware Exercise Components
export const ThemedExerciseComponents = {
  /**
   * Theme-aware Container
   */
  Container: ({ children, className = '', ...props }) => {
    const { isDark, isHighContrast } = useTheme();
    
    const themeClasses = isDark
      ? 'bg-neutral-900 text-neutral-100'
      : 'bg-white text-neutral-900';
    
    const contrastClasses = isHighContrast
      ? isDark
        ? 'border-2 border-yellow-400'
        : 'border-2 border-black'
      : 'shadow-md';

    return (
      <div
        className={`w-full max-w-4xl mx-auto rounded-lg ${themeClasses} ${contrastClasses} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  },

  /**
   * Theme-aware Option Button
   */
  Option: ({ 
    children, 
    selected, 
    correct, 
    incorrect, 
    onClick, 
    disabled = false,
    className = '',
    ...props 
  }) => {
    const { isDark, isHighContrast } = useTheme();
    
    const baseClasses = 'w-full text-left p-4 rounded-md border-2 transition-all duration-200 focus:outline-none min-h-[44px]';
    
    // Theme-aware state styling
    let stateClasses = '';
    if (disabled) {
      stateClasses = isDark
        ? 'bg-neutral-800 border-neutral-700 text-neutral-500 cursor-not-allowed'
        : 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed';
    } else if (correct) {
      stateClasses = isDark
        ? 'bg-success-900 border-success-400 text-success-100'
        : 'bg-success-100 border-success-500 text-success-800';
      
      if (isHighContrast) {
        stateClasses += ' ring-4 ring-success-400';
      }
    } else if (incorrect) {
      stateClasses = isDark
        ? 'bg-error-900 border-error-400 text-error-100'
        : 'bg-error-100 border-error-500 text-error-800';
      
      if (isHighContrast) {
        stateClasses += ' ring-4 ring-error-400';
      }
    } else if (selected) {
      stateClasses = isDark
        ? 'bg-primary-900 border-primary-400 text-primary-100'
        : 'bg-primary-100 border-primary-500 text-primary-800';
      
      if (isHighContrast) {
        stateClasses += ' ring-4 ring-primary-400';
      }
    } else {
      stateClasses = isDark
        ? 'bg-neutral-800 border-neutral-600 text-neutral-100 hover:bg-neutral-700 hover:border-neutral-500'
        : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400';
      
      stateClasses += ' focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
      
      if (isHighContrast && !isDark) {
        stateClasses += ' border-black';
      }
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${stateClasses} ${className}`}
        role="option"
        aria-selected={selected}
        aria-disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },

  /**
   * Theme-aware Question
   */
  Question: ({ children, level = 2, className = '', ...props }) => {
    const { isDark, isHighContrast } = useTheme();
    
    const Component = `h${level}`;
    
    const themeClasses = isDark
      ? 'text-neutral-100'
      : 'text-neutral-900';
    
    const contrastClasses = isHighContrast
      ? 'font-bold'
      : 'font-semibold';

    return React.createElement(
      Component,
      {
        className: `text-lg sm:text-xl lg:text-2xl mb-4 lg:mb-6 ${themeClasses} ${contrastClasses} ${className}`,
        role: 'heading',
        'aria-level': level,
        ...props
      },
      children
    );
  },

  /**
   * Theme-aware Button
   */
  Button: ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    loading = false,
    className = '',
    ...props 
  }) => {
    const { isDark, isHighContrast } = useTheme();
    
    const variants = {
      primary: isDark
        ? 'bg-primary-600 text-white hover:bg-primary-500 border-primary-600'
        : 'bg-primary-500 text-white hover:bg-primary-600 border-primary-500',
      secondary: isDark
        ? 'bg-neutral-700 text-neutral-100 hover:bg-neutral-600 border-neutral-600'
        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-300',
      success: isDark
        ? 'bg-success-600 text-white hover:bg-success-500 border-success-600'
        : 'bg-success-500 text-white hover:bg-success-600 border-success-500',
      error: isDark
        ? 'bg-error-600 text-white hover:bg-error-500 border-error-600'
        : 'bg-error-500 text-white hover:bg-error-600 border-error-500'
    };

    const sizes = {
      sm: 'px-2 py-1.5 sm:px-3 sm:py-2 text-sm',
      md: 'px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base',
      lg: 'px-4 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg'
    };

    const baseClasses = 'font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]';
    const widthClass = fullWidth ? 'w-full' : '';
    
    const contrastClasses = isHighContrast
      ? 'font-bold border-2'
      : '';

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${contrastClasses} ${className}`}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            <span className="ml-2">Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
};

// Theme Toggle Component
export const ThemeToggle = () => {
  const { theme, setTheme, isHighContrast, setHighContrast } = useTheme();

  return (
    <div className="flex items-center gap-4">
      {/* Dark/Light Mode Toggle */}
      <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="p-2 rounded-md border border-neutral-300 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800"
        aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? '🌙' : '☀️'}
      </button>

      {/* High Contrast Toggle */}
      <button
        onClick={() => setHighContrast(!isHighContrast)}
        className={`px-3 py-1 rounded text-sm border ${
          isHighContrast
            ? 'bg-yellow-400 text-black border-black'
            : 'border-neutral-300 hover:bg-neutral-100 dark:border-neutral-600 dark:hover:bg-neutral-800'
        }`}
        aria-label={`${isHighContrast ? 'Disable' : 'Enable'} high contrast mode`}
      >
        {isHighContrast ? 'High Contrast ON' : 'High Contrast'}
      </button>
    </div>
  );
};

export default { ThemeProvider, useTheme, ThemedExerciseComponents, ThemeToggle };
