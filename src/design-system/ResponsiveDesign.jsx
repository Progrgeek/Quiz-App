/**
 * Week 2 Day 9: Responsive Design Implementation
 * Touch-friendly interactions & mobile optimization
 */

import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeSystem';

// Responsive Hook for breakpoint detection
export const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState('mobile');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch capability
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0);

    // Breakpoint detection
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= 1024) {
        setBreakpoint('desktop');
      } else if (width >= 768) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return { breakpoint, isTouchDevice, isMobile: breakpoint === 'mobile' };
};

// Responsive Exercise Layout System
export const ResponsiveExerciseLayout = {
  /**
   * Adaptive Container that adjusts to screen size
   */
  Container: ({ children, className = '' }) => {
    const { breakpoint } = useResponsive();
    
    const containerClasses = {
      mobile: 'px-4 py-4 min-h-screen',
      tablet: 'px-6 py-6 min-h-screen',
      desktop: 'px-8 py-8 max-w-6xl mx-auto'
    };

    return (
      <div className={`${containerClasses[breakpoint]} ${className}`}>
        {children}
      </div>
    );
  },

  /**
   * Adaptive Grid that changes layout based on screen size
   */
  Grid: ({ children, exerciseType = 'multiple-choice', minItemWidth = 200 }) => {
    const { breakpoint, isTouchDevice } = useResponsive();
    
    // Touch-optimized spacing
    const touchSpacing = isTouchDevice ? 'gap-4' : 'gap-3';
    
    const layoutConfigs = {
      mobile: {
        'multiple-choice': 'grid-cols-1',
        'multiple-answers': 'grid-cols-1',
        'drag-drop': 'grid-cols-1',
        'fill-blanks': 'grid-cols-1',
        'single-answer': 'grid-cols-1'
      },
      tablet: {
        'multiple-choice': 'grid-cols-2',
        'multiple-answers': 'grid-cols-2',
        'drag-drop': 'grid-cols-2',
        'fill-blanks': 'grid-cols-1',
        'single-answer': 'grid-cols-1'
      },
      desktop: {
        'multiple-choice': 'grid-cols-2',
        'multiple-answers': 'grid-cols-3',
        'drag-drop': 'grid-cols-3',
        'fill-blanks': 'grid-cols-2',
        'single-answer': 'grid-cols-1'
      }
    };

    return (
      <div className={`
        grid ${layoutConfigs[breakpoint][exerciseType]} ${touchSpacing}
        auto-rows-fr
      `}>
        {children}
      </div>
    );
  },

  /**
   * Touch-optimized Option Button
   */
  Option: ({ 
    children, 
    selected, 
    correct, 
    incorrect, 
    onClick, 
    disabled = false,
    ...props 
  }) => {
    const { isTouchDevice, breakpoint } = useResponsive();
    
    // Touch-optimized sizing
    const touchClasses = isTouchDevice
      ? 'min-h-[56px] text-lg' // Larger touch targets
      : 'min-h-[44px] text-base';
    
    // Responsive padding
    const paddingClasses = {
      mobile: 'p-4',
      tablet: 'p-5',
      desktop: 'p-4'
    };
    
    // State-based styling with better contrast for mobile
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
      stateClasses = isTouchDevice
        ? 'bg-white border-neutral-400 text-neutral-900 active:bg-neutral-50' // Better touch feedback
        : 'bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400';
    }

    // Focus styles optimized for keyboard vs touch
    const focusClasses = isTouchDevice
      ? 'focus:ring-4 focus:ring-primary-300' // Larger focus ring for touch
      : 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`
          w-full text-left rounded-lg border-2 transition-all duration-200 
          focus:outline-none font-medium
          ${touchClasses} ${paddingClasses[breakpoint]} ${stateClasses} ${focusClasses}
        `}
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
   * Responsive Question with adaptive typography
   */
  Question: ({ children, level = 2 }) => {
    const { breakpoint } = useResponsive();
    
    const Component = `h${level}`;
    
    const typographyClasses = {
      mobile: 'text-xl leading-tight',
      tablet: 'text-2xl leading-tight',
      desktop: 'text-3xl leading-tight'
    };
    
    const spacingClasses = {
      mobile: 'mb-4',
      tablet: 'mb-6',
      desktop: 'mb-8'
    };

    return React.createElement(
      Component,
      {
        className: `font-bold text-neutral-900 ${typographyClasses[breakpoint]} ${spacingClasses[breakpoint]}`,
        role: 'heading',
        'aria-level': level
      },
      children
    );
  },

  /**
   * Adaptive Progress Indicator
   */
  Progress: ({ current, total, score, timeElapsed = 0 }) => {
    const { breakpoint } = useResponsive();
    
    const layoutClasses = {
      mobile: 'flex-col space-y-2 text-center',
      tablet: 'flex-row justify-between items-center',
      desktop: 'flex-row justify-between items-center'
    };
    
    const textClasses = {
      mobile: 'text-sm',
      tablet: 'text-base',
      desktop: 'text-base'
    };

    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className={`
        ${layoutClasses[breakpoint]} ${textClasses[breakpoint]}
        p-4 bg-neutral-50 rounded-lg mb-6
      `}>
        <div className="font-semibold text-neutral-700">
          Question {current} of {total}
        </div>
        
        {breakpoint !== 'mobile' && (
          <div className="text-neutral-500">
            Time: {formatTime(timeElapsed)}
          </div>
        )}
        
        <div className="font-semibold text-primary-600">
          Score: {score}%
        </div>
      </div>
    );
  },

  /**
   * Touch-optimized Button
   */
  Button: ({ 
    children, 
    variant = 'primary', 
    size = 'md', 
    fullWidth = false,
    loading = false,
    ...props 
  }) => {
    const { isTouchDevice, breakpoint } = useResponsive();
    
    const variants = {
      primary: 'bg-primary-500 text-white border-primary-500 hover:bg-primary-600 active:bg-primary-700',
      secondary: 'bg-white text-primary-500 border-primary-500 hover:bg-primary-50 active:bg-primary-100',
      success: 'bg-success-500 text-white border-success-500 hover:bg-success-600 active:bg-success-700',
      error: 'bg-error-500 text-white border-error-500 hover:bg-error-600 active:bg-error-700'
    };

    // Touch-optimized sizing
    const touchSizes = isTouchDevice ? {
      sm: 'min-h-[48px] px-4 py-3 text-base',
      md: 'min-h-[56px] px-6 py-4 text-lg',
      lg: 'min-h-[64px] px-8 py-5 text-xl'
    } : {
      sm: 'min-h-[36px] px-3 py-2 text-sm',
      md: 'min-h-[44px] px-4 py-2.5 text-base',
      lg: 'min-h-[52px] px-6 py-3 text-lg'
    };

    const baseClasses = 'font-semibold rounded-lg border-2 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed';
    const widthClass = fullWidth ? 'w-full' : '';
    
    // Touch-optimized focus
    const focusClasses = isTouchDevice
      ? 'focus:ring-4 focus:ring-primary-300'
      : 'focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';

    return (
      <button
        className={`${baseClasses} ${variants[variant]} ${touchSizes[size]} ${widthClass} ${focusClasses}`}
        disabled={loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            <span className="ml-3">Loading...</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
};

// Responsive Utilities
export const ResponsiveUtils = {
  /**
   * Get responsive classes based on breakpoint
   */
  getResponsiveClasses: (classes) => {
    return Object.entries(classes)
      .map(([breakpoint, className]) => {
        if (breakpoint === 'mobile') return className;
        return `${breakpoint}:${className}`;
      })
      .join(' ');
  },

  /**
   * Touch-optimized event handlers
   */
  getTouchHandlers: (onClick) => {
    return {
      onClick,
      onTouchStart: (e) => {
        // Add touch feedback
        e.currentTarget.style.transform = 'scale(0.98)';
      },
      onTouchEnd: (e) => {
        // Remove touch feedback
        setTimeout(() => {
          e.currentTarget.style.transform = 'scale(1)';
        }, 100);
      }
    };
  }
};

export default ResponsiveExerciseLayout;
