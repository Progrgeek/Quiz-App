import React, { createContext, useContext, useState, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
};

export const AccessibilityProvider = ({ children }) => {
  const [reducedMotion, setReducedMotion] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const [focusVisible, setFocusVisible] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  // Detect system preferences
  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);

    // Check for high contrast preference
    const contrastQuery = window.matchMedia('(prefers-contrast: high)');
    setHighContrast(contrastQuery.matches);
    
    const handleContrastChange = (e) => setHighContrast(e.matches);
    contrastQuery.addEventListener('change', handleContrastChange);

    // Detect screen reader usage
    const detectScreenReader = () => {
      const hasScreenReader = window.navigator.userAgent.includes('NVDA') ||
                            window.navigator.userAgent.includes('JAWS') ||
                            window.speechSynthesis ||
                            window.navigator.mediaDevices;
      setScreenReader(hasScreenReader);
    };

    detectScreenReader();

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      contrastQuery.removeEventListener('change', handleContrastChange);
    };
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Reduced motion
    if (reducedMotion) {
      root.style.setProperty('--animation-duration', '0.01ms');
      root.style.setProperty('--transition-duration', '0.01ms');
    } else {
      root.style.removeProperty('--animation-duration');
      root.style.removeProperty('--transition-duration');
    }

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Focus visible
    if (focusVisible) {
      root.classList.add('focus-visible');
    } else {
      root.classList.remove('focus-visible');
    }
  }, [reducedMotion, highContrast, largeText, focusVisible]);

  // Keyboard navigation helpers
  const handleKeyNavigation = (event, callback) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      callback();
    }
  };

  // Focus management
  const manageFocus = (elementRef, shouldFocus = true) => {
    if (shouldFocus && elementRef.current) {
      elementRef.current.focus();
    }
  };

  // Announce to screen readers
  const announceToScreenReader = (message, priority = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  // Touch target helpers
  const touchTargetProps = {
    style: {
      minHeight: '44px',
      minWidth: '44px',
      touchAction: 'manipulation'
    }
  };

  const value = {
    // State
    reducedMotion,
    highContrast,
    largeText,
    focusVisible,
    screenReader,
    
    // Setters
    setReducedMotion,
    setHighContrast,
    setLargeText,
    setFocusVisible,
    
    // Helpers
    handleKeyNavigation,
    manageFocus,
    announceToScreenReader,
    touchTargetProps,
    
    // ARIA helpers
    getAriaProps: (label, describedBy, expanded) => ({
      'aria-label': label,
      'aria-describedby': describedBy,
      'aria-expanded': expanded,
      role: 'button',
      tabIndex: 0
    }),
    
    // Live region helpers
    getLiveRegionProps: (priority = 'polite') => ({
      'aria-live': priority,
      'aria-atomic': 'true',
      role: 'status'
    })
  };

  return (
    <AccessibilityContext.Provider value={value}>
      {children}
    </AccessibilityContext.Provider>
  );
};
