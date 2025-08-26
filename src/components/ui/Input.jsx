import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Enhanced Input Component
 * Professional form input with validation states and accessibility
 */
const Input = forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  error,
  success,
  hint,
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  className = '',
  id,
  name,
  autoComplete,
  maxLength,
  ...props
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  // Base input styles
  const baseStyles = `
    w-full border rounded-input transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-1
    disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed
    placeholder:text-gray-400
  `;

  // Size styles
  const sizeStyles = {
    sm: 'h-input-sm px-3 text-sm',
    md: 'h-input-md px-4 text-base',
    lg: 'h-input-lg px-5 text-lg'
  };

  // State styles
  const getStateStyles = () => {
    if (error) {
      return 'border-error-300 focus:border-error-500 focus:ring-error-500/20';
    }
    if (success) {
      return 'border-success-300 focus:border-success-500 focus:ring-success-500/20';
    }
    return 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20';
  };

  // Icon styles
  const iconStyles = iconPosition === 'left' ? 'pl-10' : 'pr-10';

  // Combine styles
  const inputClasses = `
    ${baseStyles}
    ${sizeStyles[size]}
    ${getStateStyles()}
    ${icon ? iconStyles : ''}
    ${fullWidth ? 'w-full' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Handle focus
  const handleFocus = (e) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  // Handle blur
  const handleBlur = (e) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  // State indicator icon
  const StateIcon = () => {
    if (error) {
      return (
        <svg className="w-5 h-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      );
    }
    if (success) {
      return (
        <svg className="w-5 h-5 text-success-500" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
      );
    }
    return null;
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-sm font-medium mb-1 ${
            error ? 'text-error-700' : success ? 'text-success-700' : 'text-gray-700'
          }`}
        >
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {icon}
            </span>
          </div>
        )}

        {/* Input field */}
        <motion.input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={disabled}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className={inputClasses}
          animate={{
            scale: isFocused ? 1.01 : 1,
            borderColor: isFocused ? (error ? '#ef4444' : success ? '#22c55e' : '#3b82f6') : undefined
          }}
          transition={{ duration: 0.2 }}
          {...props}
        />

        {/* Right icon or state indicator */}
        {(icon && iconPosition === 'right') || error || success ? (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {icon && iconPosition === 'right' && !error && !success && (
              <span className="text-gray-400">
                {icon}
              </span>
            )}
            <StateIcon />
          </div>
        ) : null}
      </div>

      {/* Hint/Error/Success message */}
      {(hint || error || success) && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className={`mt-1 text-sm ${
            error ? 'text-error-600' : success ? 'text-success-600' : 'text-gray-500'
          }`}
        >
          {error || success || hint}
        </motion.div>
      )}

      {/* Character count */}
      {maxLength && value && (
        <div className="mt-1 text-xs text-gray-500 text-right">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  hint: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
  maxLength: PropTypes.number
};

export default Input;
