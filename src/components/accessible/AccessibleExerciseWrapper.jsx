import React, { useEffect, useRef } from 'react';
import { AccessibilityProvider, useAccessibility } from '../../accessibility/AccessibilityProvider';
import { MobileProvider, useMobile } from '../../mobile/MobileProvider';
import { useTheme } from '../../design-system/theme/ThemeProvider';

const AccessibleExerciseWrapper = ({ 
  children, 
  title, 
  description, 
  exerciseType,
  className = '' 
}) => {
  const mainRef = useRef(null);
  
  const { 
    announceToScreenReader, 
    manageFocus,
    getLiveRegionProps 
  } = useAccessibility();
  
  const { 
    isMobile, 
    getSafeAreaProps 
  } = useMobile();
  
  const { theme } = useTheme();

  // Announce exercise load to screen readers
  useEffect(() => {
    if (title) {
      announceToScreenReader(`${title} exercise loaded`, 'polite');
    }
  }, [title, announceToScreenReader]);

  // Focus management for keyboard users
  useEffect(() => {
    if (mainRef.current) {
      manageFocus(mainRef, true);
    }
  }, [manageFocus]);

  const safeAreaProps = getSafeAreaProps();

  return (
    <div 
      className={`
        accessible-exercise-wrapper
        mobile-optimized
        safe-area-all
        ${className}
      `}
      {...safeAreaProps}
    >
      {/* Skip Links for Keyboard Navigation */}
      <div className="sr-only">
        <a href="#exercise-content" className="skip-link">
          Skip to exercise content
        </a>
        <a href="#exercise-controls" className="skip-link">
          Skip to exercise controls
        </a>
      </div>

      {/* Exercise Header */}
      <header 
        className="exercise-header mobile-container"
        role="banner"
      >
        {title && (
          <h1 
            className="responsive-heading text-gray-900"
            id="exercise-title"
          >
            {title}
          </h1>
        )}
        
        {description && (
          <p 
            className="text-gray-600 mb-4 mobile-text"
            id="exercise-description"
          >
            {description}
          </p>
        )}

        {/* Exercise Type Badge */}
        {exerciseType && (
          <div className="status-indicator info mb-4">
            <span>Exercise Type:</span>
            <strong>{exerciseType}</strong>
          </div>
        )}
      </header>

      {/* Main Exercise Content */}
      <main
        ref={mainRef}
        id="exercise-content"
        className="exercise-content mobile-container"
        role="main"
        aria-labelledby={title ? "exercise-title" : undefined}
        aria-describedby={description ? "exercise-description" : undefined}
        tabIndex={-1}
      >
        {/* Live Region for Exercise Updates */}
        <div 
          {...getLiveRegionProps('polite')}
          id="exercise-announcements"
          className="sr-only"
        />

        {/* Exercise Content with Enhanced Accessibility */}
        <div className="exercise-wrapper mobile-card">
          {children}
        </div>
      </main>

      {/* Mobile-Specific Navigation */}
      {isMobile && (
        <nav 
          className="mobile-nav"
          role="navigation"
          aria-label="Exercise navigation"
          id="exercise-controls"
        >
          <div className="flex">
            <button
              className="mobile-nav-item"
              onClick={() => window.history.back()}
              aria-label="Go back to previous page"
            >
              <div className="mobile-nav-icon">←</div>
              <span className="mobile-nav-label">Back</span>
            </button>
            
            <button
              className="mobile-nav-item"
              onClick={() => {
                window.location.reload();
                announceToScreenReader('Exercise restarted');
              }}
              aria-label="Restart exercise"
            >
              <div className="mobile-nav-icon">↻</div>
              <span className="mobile-nav-label">Restart</span>
            </button>
            
            <button
              className="mobile-nav-item"
              onClick={() => announceToScreenReader('Help information available')}
              aria-label="Get help"
            >
              <div className="mobile-nav-icon">?</div>
              <span className="mobile-nav-label">Help</span>
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

// HOC to wrap existing exercises with accessibility features
export const withAccessibility = (WrappedComponent, options = {}) => {
  const EnhancedComponent = (props) => {
    return (
      <AccessibilityProvider>
        <MobileProvider>
          <AccessibleExerciseWrapper
            title={options.title || props.title}
            description={options.description || props.description}
            exerciseType={options.exerciseType || props.exerciseType}
            className={options.className || props.className}
          >
            <WrappedComponent {...props} />
          </AccessibleExerciseWrapper>
        </MobileProvider>
      </AccessibilityProvider>
    );
  };

  EnhancedComponent.displayName = `withAccessibility(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return EnhancedComponent;
};

export default AccessibleExerciseWrapper;
