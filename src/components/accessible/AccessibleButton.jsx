import React, { forwardRef } from 'react';
import { useAccessibility } from '../../accessibility/AccessibilityProvider';
import { useMobile } from '../../mobile/MobileProvider';
import { useTheme } from '../../design-system/theme/ThemeProvider';

const AccessibleButton = forwardRef(({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  ariaLabel,
  ariaDescribedBy,
  ariaPressed,
  onClick,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  const { 
    handleKeyNavigation, 
    announceToScreenReader, 
    touchTargetProps,
    getAriaProps 
  } = useAccessibility();
  
  const { 
    getMobileOptimizedProps, 
    isMobile,
    touchSupport 
  } = useMobile();
  
  const { theme } = useTheme();

  const handleClick = (e) => {
    if (disabled || loading) return;
    
    // Announce action to screen readers
    if (ariaLabel) {
      announceToScreenReader(`${ariaLabel} activated`);
    }
    
    // Add haptic feedback on mobile if available
    if (touchSupport && navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    onClick?.(e);
  };

  const handleKeyDown = (e) => {
    handleKeyNavigation(e, () => handleClick(e));
  };

  // Variant styles
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white border-primary-600',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 border-gray-300',
    outline: 'bg-transparent hover:bg-primary-50 text-primary-600 border-primary-600',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-900 border-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white border-red-600',
    success: 'bg-green-600 hover:bg-green-700 text-white border-green-600'
  };

  // Size styles
  const sizes = {
    small: isMobile ? 'px-3 py-2 text-sm min-h-[40px]' : 'px-3 py-2 text-sm min-h-[36px]',
    medium: isMobile ? 'px-4 py-3 text-base min-h-[48px]' : 'px-4 py-2 text-sm min-h-[40px]',
    large: isMobile ? 'px-6 py-4 text-lg min-h-[56px]' : 'px-6 py-3 text-base min-h-[48px]'
  };

  const baseClasses = `
    button-accessible touch-target interactive
    inline-flex items-center justify-center
    font-semibold rounded-lg border-2
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none
    ${isMobile ? 'w-full' : 'min-w-[100px]'}
    ${touchSupport ? 'touch-feedback' : ''}
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  const mobileProps = getMobileOptimizedProps('button');
  const accessibilityProps = getAriaProps(ariaLabel, ariaDescribedBy, ariaPressed);

  return (
    <button
      ref={ref}
      type={type}
      className={baseClasses}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...accessibilityProps}
      {...mobileProps}
      {...touchTargetProps}
      {...props}
    >
      {loading && (
        <svg 
          className="animate-spin -ml-1 mr-3 h-5 w-5" 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
      
      {/* Screen reader loading state */}
      {loading && (
        <span className="sr-only">Loading...</span>
      )}
    </button>
  );
});

AccessibleButton.displayName = 'AccessibleButton';

export default AccessibleButton;
