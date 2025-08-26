/**
 * Week 2 Day 8: Enhanced Exercise Components
 * Responsive Design & Accessibility Implementation
 */

import React from 'react';
import { ExerciseContainer, ExerciseQuestion, ExerciseOption, ExerciseButton } from './ExerciseComponents';

// Enhanced Exercise Components with Responsive Design
export const ResponsiveExerciseComponents = {
  /**
   * Enhanced Question Component with responsive typography
   */
  Question: ({ children, variant = 'primary', level = 2, responsive = true }) => {
    const responsiveClasses = responsive
      ? 'text-lg sm:text-xl lg:text-2xl'
      : 'text-xl';
    
    const Component = `h${level}`;
    
    return React.createElement(
      Component,
      {
        className: `font-semibold mb-4 lg:mb-6 ${responsiveClasses} ${
          variant === 'primary' ? 'text-neutral-900' : 'text-neutral-700'
        }`,
        role: 'heading',
        'aria-level': level
      },
      children
    );
  },

  /**
   * Enhanced Option Component with responsive design and accessibility
   */
  Option: ({ 
    children, 
    selected, 
    correct, 
    incorrect, 
    onClick, 
    disabled = false,
    responsive = true,
    touchOptimized = true,
    ...props 
  }) => {
    const baseClasses = 'w-full text-left transition-all duration-200 rounded-md border-2 focus:outline-none';
    
    // Responsive sizing
    const responsiveClasses = responsive
      ? 'p-3 sm:p-4 lg:p-5 text-sm sm:text-base lg:text-lg'
      : 'p-4 text-base';
    
    // Touch optimization
    const touchClasses = touchOptimized
      ? 'min-h-[44px] sm:min-h-[48px]' // iOS minimum touch target
      : 'min-h-[3rem]';
    
    // State-based styling
    let stateClasses = '';
    if (disabled) {
      stateClasses = 'bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed';
    } else if (correct) {
      stateClasses = 'bg-success-100 border-success-500 text-success-800 ring-2 ring-success-300';
    } else if (incorrect) {
      stateClasses = 'bg-error-100 border-error-500 text-error-800 ring-2 ring-error-300';
    } else if (selected) {
      stateClasses = 'bg-primary-100 border-primary-500 text-primary-800 ring-2 ring-primary-300';
    } else {
      stateClasses = 'bg-neutral-0 border-neutral-300 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    }

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${baseClasses} ${responsiveClasses} ${touchClasses} ${stateClasses}`}
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
   * Enhanced Container with responsive layout
   */
  Container: ({ 
    children, 
    layout = 'standard', 
    responsive = true,
    maxWidth = '4xl'
  }) => {
    const layoutClasses = {
      compact: responsive ? 'p-3 sm:p-4 lg:p-6' : 'p-4',
      standard: responsive ? 'p-4 sm:p-6 lg:p-8' : 'p-6',
      expanded: responsive ? 'p-6 sm:p-8 lg:p-12' : 'p-8'
    };

    const maxWidthClasses = {
      '3xl': 'max-w-3xl',
      '4xl': 'max-w-4xl',
      '5xl': 'max-w-5xl',
      '6xl': 'max-w-6xl'
    };

    return (
      <div className={`
        w-full ${maxWidthClasses[maxWidth]} mx-auto bg-white rounded-lg shadow-md
        ${layoutClasses[layout]}
      `}>
        {children}
      </div>
    );
  },

  /**
   * Enhanced Grid with responsive breakpoints
   */
  Grid: ({ 
    children, 
    exerciseType = 'multiple-choice',
    responsive = true,
    gap = 'md'
  }) => {
    const gapClasses = {
      sm: 'gap-2',
      md: 'gap-3 sm:gap-4',
      lg: 'gap-4 sm:gap-6'
    };

    const layoutConfigs = {
      'multiple-choice': responsive 
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2'
        : 'grid-cols-2',
      'multiple-answers': responsive
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-2',
      'drag-drop': responsive
        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
        : 'grid-cols-3',
      'single-answer': responsive
        ? 'grid-cols-1 sm:grid-cols-1 lg:grid-cols-1'
        : 'grid-cols-1'
    };

    return (
      <div className={`
        grid ${layoutConfigs[exerciseType]} ${gapClasses[gap]}
      `}>
        {children}
      </div>
    );
  },

  /**
   * Enhanced Progress Indicator with responsive design
   */
  ProgressIndicator: ({ 
    current, 
    total, 
    score, 
    responsive = true,
    showTime = false,
    timeElapsed = 0
  }) => {
    const responsiveClasses = responsive
      ? 'flex-col sm:flex-row gap-2 sm:gap-0 text-sm sm:text-base'
      : 'flex-row text-base';

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className={`
        flex items-center justify-between mb-4 lg:mb-6 p-3 sm:p-4 
        bg-neutral-50 rounded-md ${responsiveClasses}
      `}>
        <span className="font-medium text-neutral-600">
          Question {current} of {total}
        </span>
        
        <div className="flex items-center gap-4">
          {showTime && (
            <span className="text-neutral-500">
              Time: {formatTime(timeElapsed)}
            </span>
          )}
          <span className="font-medium text-primary-600">
            Score: {score}%
          </span>
        </div>
      </div>
    );
  },

  /**
   * Enhanced Button with responsive sizing
   */
  Button: ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    responsive = true,
    loading = false,
    ...props 
  }) => {
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 border-primary-500 focus:ring-primary-500',
      secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border-neutral-300 focus:ring-neutral-500',
      success: 'bg-success-500 text-white hover:bg-success-600 border-success-500 focus:ring-success-500',
      error: 'bg-error-500 text-white hover:bg-error-600 border-error-500 focus:ring-error-500'
    };

    const sizes = responsive ? {
      sm: 'px-2 py-1.5 sm:px-3 sm:py-2 text-sm',
      md: 'px-3 py-2 sm:px-4 sm:py-2.5 text-sm sm:text-base',
      lg: 'px-4 py-2.5 sm:px-6 sm:py-3 text-base sm:text-lg'
    } : {
      sm: 'px-3 py-2 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    const baseClasses = 'font-medium rounded-md border transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClass = fullWidth ? 'w-full' : '';
    const touchClass = 'min-h-[44px] sm:min-h-[48px]'; // Touch-friendly

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${touchClass}`}
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

// Accessibility helpers
export const AccessibilityHelpers = {
  /**
   * Screen reader announcements
   */
  LiveRegion: ({ message, priority = 'polite' }) => (
    <div
      aria-live={priority}
      aria-atomic="true"
      className="sr-only"
    >
      {message}
    </div>
  ),

  /**
   * Skip link for keyboard navigation
   */
  SkipLink: ({ href = '#main-content', children = 'Skip to main content' }) => (
    <a
      href={href}
      className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-primary-500 text-white px-4 py-2 rounded z-50"
    >
      {children}
    </a>
  ),

  /**
   * Focus trap for modals
   */
  FocusTrap: ({ children, active = true }) => {
    // Implementation would go here for focus management
    return (
      <div data-focus-trap={active}>
        {children}
      </div>
    );
  }
};

export default ResponsiveExerciseComponents;
