import React, { forwardRef, useState, useId } from 'react';
import { useAccessibility } from '../../accessibility/AccessibilityProvider';
import { useMobile } from '../../mobile/MobileProvider';

const AccessibleInput = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  helperText,
  required = false,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);
  const inputId = useId();
  const errorId = useId();
  const helperId = useId();
  
  const { 
    announceToScreenReader,
    touchTargetProps 
  } = useAccessibility();
  
  const { 
    getMobileOptimizedProps,
    isMobile 
  } = useMobile();

  const handleFocus = (e) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
    
    // Announce validation errors to screen readers
    if (error) {
      announceToScreenReader(`Error: ${error}`, 'assertive');
    }
  };

  const handleChange = (e) => {
    onChange?.(e);
  };

  const baseInputClasses = `
    input-accessible mobile-form-input
    w-full px-4 py-3 border-2 rounded-lg
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-4 focus:ring-opacity-50
    disabled:opacity-50 disabled:cursor-not-allowed
    ${isMobile ? 'text-base min-h-[48px]' : 'text-sm min-h-[40px]'}
    ${error 
      ? 'border-red-500 bg-red-50 text-red-900 focus:border-red-500 focus:ring-red-200' 
      : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-200'
    }
    ${isFocused ? 'ring-4' : ''}
    ${className}
  `;

  const labelClasses = `
    mobile-form-label
    block text-sm font-semibold mb-2
    ${error ? 'text-red-700' : 'text-gray-700'}
    ${required ? "after:content-['*'] after:text-red-500 after:ml-1" : ''}
  `;

  const mobileProps = getMobileOptimizedProps('input');

  // Build describedBy attribute
  const describedBy = [];
  if (error) describedBy.push(errorId);
  if (helperText) describedBy.push(helperId);

  return (
    <div className="mobile-form-group">
      {label && (
        <label 
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
          {required && (
            <span className="sr-only">(required)</span>
          )}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={ref}
          id={inputId}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          className={baseInputClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={describedBy.length > 0 ? describedBy.join(' ') : undefined}
          aria-required={required}
          {...mobileProps}
          {...touchTargetProps}
          {...props}
        />
        
        {/* Error Icon */}
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <svg 
              className="h-5 w-5 text-red-500" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path 
                fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
        )}
      </div>
      
      {/* Error Message */}
      {error && (
        <div 
          id={errorId}
          className="mt-2 text-sm text-red-600 flex items-center"
          role="alert"
          aria-live="polite"
        >
          <svg 
            className="h-4 w-4 mr-1 flex-shrink-0" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd" 
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
              clipRule="evenodd" 
            />
          </svg>
          {error}
        </div>
      )}
      
      {/* Helper Text */}
      {helperText && !error && (
        <div 
          id={helperId}
          className="mt-2 text-sm text-gray-600"
        >
          {helperText}
        </div>
      )}
    </div>
  );
});

AccessibleInput.displayName = 'AccessibleInput';

export default AccessibleInput;
