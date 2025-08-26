/**
 * Week 2 Days 11-14: Accessibility Implementation
 * WCAG 2.1 AA Compliance System
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

// Accessibility Context
const AccessibilityContext = createContext({
  screenReaderEnabled: false,
  highContrast: false,
  keyboardNavigation: false,
  reducedMotion: false,
  announcements: [],
  announce: () => {},
  setScreenReaderEnabled: () => {},
  setHighContrast: () => {},
  setKeyboardNavigation: () => {},
  setReducedMotion: () => {}
});

// Accessibility Provider
export const AccessibilityProvider = ({ children }) => {
  const [screenReaderEnabled, setScreenReaderEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  
  // Auto-detect accessibility preferences
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReducedMotion(prefersReducedMotion);
    
    // Check for high contrast preference
    const prefersHighContrast = window.matchMedia('(prefers-contrast: high)').matches;
    setHighContrast(prefersHighContrast);
    
    // Detect keyboard navigation
    const handleKeyDown = (e) => {
      if (e.key === 'Tab') {
        setKeyboardNavigation(true);
      }
    };
    
    const handleMouseDown = () => {
      setKeyboardNavigation(false);
    };
    
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);
  
  // Screen reader announcements
  const announce = (message, priority = 'polite') => {
    const id = Date.now();
    setAnnouncements(prev => [...prev, { id, message, priority }]);
    
    // Remove announcement after it's been read
    setTimeout(() => {
      setAnnouncements(prev => prev.filter(a => a.id !== id));
    }, 3000);
  };
  
  const value = {
    screenReaderEnabled,
    highContrast,
    keyboardNavigation,
    reducedMotion,
    announcements,
    announce,
    setScreenReaderEnabled,
    setHighContrast,
    setKeyboardNavigation,
    setReducedMotion
  };
  
  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};

// Accessibility Hook
export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};

// ARIA-compliant Exercise Components
export const AccessibleExerciseComponents = {
  /**
   * Accessible Question with proper heading structure
   */
  Question: ({ children, id, level = 2, ...props }) => {
    const Component = `h${level}`;
    
    return React.createElement(
      Component,
      {
        id: `question-${id}`,
        className: "text-xl sm:text-2xl font-semibold mb-4 text-neutral-900",
        role: "heading",
        "aria-level": level,
        tabIndex: -1, // Allow programmatic focus
        ...props
      },
      children
    );
  },

  /**
   * Accessible Option List with proper ARIA attributes
   */
  OptionList: ({ children, questionId, ariaLabel, selectionMode = 'single' }) => {
    return (
      <div
        role={selectionMode === 'single' ? 'radiogroup' : 'group'}
        aria-labelledby={`question-${questionId}`}
        aria-label={ariaLabel}
        className="space-y-3"
      >
        {children}
      </div>
    );
  },

  /**
   * Accessible Option with comprehensive ARIA support
   */
  Option: ({ 
    children, 
    id, 
    selected, 
    correct, 
    incorrect, 
    disabled = false,
    onClick, 
    onKeyDown,
    selectionMode = 'single',
    ...props 
  }) => {
    const { announce, keyboardNavigation, highContrast } = useAccessibility();
    const optionRef = useRef(null);
    
    const handleClick = () => {
      if (disabled) return;
      onClick && onClick();
      
      // Announce selection to screen readers
      if (selected) {
        announce(`${children} selected`, 'assertive');
      } else {
        announce(`${children} deselected`, 'assertive');
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick();
      }
      onKeyDown && onKeyDown(e);
    };
    
    // Build className based on state and accessibility needs
    let className = 'w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none min-h-[44px] cursor-pointer';
    
    // State-based styling
    if (disabled) {
      className += ' bg-neutral-100 border-neutral-200 text-neutral-400 cursor-not-allowed';
    } else if (correct) {
      className += ' bg-success-100 border-success-500 text-success-800';
      if (highContrast) className += ' ring-4 ring-success-400 font-bold';
    } else if (incorrect) {
      className += ' bg-error-100 border-error-500 text-error-800';
      if (highContrast) className += ' ring-4 ring-error-400 font-bold';
    } else if (selected) {
      className += ' bg-primary-100 border-primary-500 text-primary-800';
      if (highContrast) className += ' ring-4 ring-primary-400 font-bold';
    } else {
      className += ' bg-white border-neutral-300 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400';
    }
    
    // Keyboard navigation focus styles
    if (keyboardNavigation) {
      className += ' focus:ring-4 focus:ring-primary-300 focus:ring-offset-2';
    } else {
      className += ' focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    }
    
    return (
      <button
        ref={optionRef}
        role={selectionMode === 'single' ? 'radio' : 'checkbox'}
        aria-checked={selected}
        aria-disabled={disabled}
        aria-describedby={`${id}-feedback`}
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={className}
        {...props}
      >
        <div className="flex items-center">
          {/* Visual indicator for screen readers */}
          <span 
            className={`
              flex-shrink-0 w-5 h-5 rounded-full border-2 mr-3
              ${selected 
                ? 'bg-primary-500 border-primary-500' 
                : 'bg-white border-neutral-400'
              }
            `}
            aria-hidden="true"
          >
            {selected && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
            )}
          </span>
          
          <span className="flex-1">{children}</span>
          
          {/* Status indicators for screen readers */}
          {correct && (
            <span className="sr-only" id={`${id}-feedback`}>
              Correct answer
            </span>
          )}
          {incorrect && (
            <span className="sr-only" id={`${id}-feedback`}>
              Incorrect answer
            </span>
          )}
        </div>
      </button>
    );
  },

  /**
   * Live Region for announcements
   */
  LiveRegion: () => {
    const { announcements } = useAccessibility();
    
    return (
      <div className="sr-only">
        {announcements.map(({ id, message, priority }) => (
          <div
            key={id}
            aria-live={priority}
            aria-atomic="true"
          >
            {message}
          </div>
        ))}
      </div>
    );
  },

  /**
   * Skip Links for keyboard navigation
   */
  SkipLinks: () => {
    return (
      <div className="sr-only focus:not-sr-only">
        <a
          href="#main-content"
          className="absolute top-2 left-2 bg-primary-500 text-white px-4 py-2 rounded z-50 focus:not-sr-only"
        >
          Skip to main content
        </a>
        <a
          href="#exercise-content"
          className="absolute top-2 left-32 bg-primary-500 text-white px-4 py-2 rounded z-50 focus:not-sr-only"
        >
          Skip to exercise
        </a>
      </div>
    );
  },

  /**
   * Progress indicator with ARIA labels
   */
  Progress: ({ current, total, score, questionId }) => {
    const { announce } = useAccessibility();
    
    useEffect(() => {
      announce(`Question ${current} of ${total}. Current score: ${score}%`, 'polite');
    }, [current, announce, total, score]);
    
    return (
      <div 
        className="flex items-center justify-between mb-6 p-4 bg-neutral-50 rounded-md"
        role="status"
        aria-label={`Question ${current} of ${total}, score ${score}%`}
      >
        <span className="font-medium text-neutral-700">
          Question {current} of {total}
        </span>
        <span className="font-medium text-primary-600">
          Score: {score}%
        </span>
      </div>
    );
  },

  /**
   * Accessible Button with loading states
   */
  Button: ({ 
    children, 
    loading = false, 
    disabled = false,
    variant = 'primary',
    'aria-describedby': ariaDescribedBy,
    ...props 
  }) => {
    const { keyboardNavigation, highContrast } = useAccessibility();
    
    const variants = {
      primary: 'bg-primary-500 text-white hover:bg-primary-600 border-primary-500',
      secondary: 'bg-white text-primary-500 border-primary-500 hover:bg-primary-50'
    };
    
    let className = `
      px-6 py-3 rounded-lg border-2 font-medium transition-all duration-200 
      focus:outline-none min-h-[44px] disabled:opacity-50 disabled:cursor-not-allowed
      ${variants[variant]}
    `;
    
    // Accessibility enhancements
    if (keyboardNavigation) {
      className += ' focus:ring-4 focus:ring-primary-300 focus:ring-offset-2';
    } else {
      className += ' focus:ring-2 focus:ring-primary-500 focus:ring-offset-2';
    }
    
    if (highContrast) {
      className += ' font-bold border-4';
    }
    
    return (
      <button
        className={className}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        aria-describedby={ariaDescribedBy}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <div className="flex items-center justify-center">
            <div 
              className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"
              aria-hidden="true"
            ></div>
            <span className="ml-2">Loading...</span>
            <span className="sr-only">Please wait, processing your request</span>
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
};

// Keyboard Navigation System
export class KeyboardNavigationManager {
  constructor(containerElement) {
    this.container = containerElement;
    this.focusableElements = [];
    this.currentFocus = -1;
    this.setupKeyboardHandlers();
  }
  
  setupKeyboardHandlers() {
    this.container.addEventListener('keydown', this.handleKeyDown.bind(this));
  }
  
  handleKeyDown(e) {
    this.updateFocusableElements();
    
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        this.moveFocus(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
        e.preventDefault();
        this.moveFocus(-1);
        break;
      case 'Home':
        e.preventDefault();
        this.focusFirst();
        break;
      case 'End':
        e.preventDefault();
        this.focusLast();
        break;
    }
  }
  
  updateFocusableElements() {
    this.focusableElements = Array.from(
      this.container.querySelectorAll(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    );
  }
  
  moveFocus(direction) {
    this.currentFocus += direction;
    
    if (this.currentFocus >= this.focusableElements.length) {
      this.currentFocus = 0;
    } else if (this.currentFocus < 0) {
      this.currentFocus = this.focusableElements.length - 1;
    }
    
    this.focusableElements[this.currentFocus]?.focus();
  }
  
  focusFirst() {
    this.currentFocus = 0;
    this.focusableElements[0]?.focus();
  }
  
  focusLast() {
    this.currentFocus = this.focusableElements.length - 1;
    this.focusableElements[this.currentFocus]?.focus();
  }
}

export default {
  AccessibilityProvider,
  useAccessibility,
  AccessibleExerciseComponents,
  KeyboardNavigationManager
};
