// design-system/components/Input.jsx - Comprehensive input component
import React, { forwardRef, useState } from 'react';
import { useTheme, useComponentTheme } from '../theme/ThemeProvider.jsx';
import { cn } from '../../utils/classNames.js';

// Input size variants
const sizeVariants = {
  sm: {
    input: 'px-2.5 py-1.5 text-sm h-8',
    label: 'text-sm',
    helper: 'text-xs'
  },
  md: {
    input: 'px-3 py-2 text-base h-10',
    label: 'text-sm',
    helper: 'text-sm'
  },
  lg: {
    input: 'px-4 py-3 text-lg h-12',
    label: 'text-base',
    helper: 'text-sm'
  }
};

// Input state variants
const stateVariants = {
  default: {
    border: 'border-gray-300',
    focus: 'focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20',
    background: 'bg-white'
  },
  error: {
    border: 'border-red-500',
    focus: 'focus:border-red-500 focus:ring-2 focus:ring-red-500 focus:ring-opacity-20',
    background: 'bg-red-50'
  },
  success: {
    border: 'border-green-500',
    focus: 'focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:ring-opacity-20',
    background: 'bg-green-50'
  },
  warning: {
    border: 'border-yellow-500',
    focus: 'focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-20',
    background: 'bg-yellow-50'
  },
  disabled: {
    border: 'border-gray-200',
    focus: '',
    background: 'bg-gray-50'
  }
};

export const Input = forwardRef(({
  // Basic props
  type = 'text',
  value,
  defaultValue,
  placeholder,
  disabled = false,
  required = false,
  readOnly = false,
  
  // Styling props
  size = 'md',
  variant = 'default',
  fullWidth = false,
  
  // Label and helper text
  label,
  helperText,
  errorText,
  successText,
  
  // Icons
  leftIcon,
  rightIcon,
  
  // Validation
  error = false,
  success = false,
  
  // Event handlers
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  
  // Additional props
  className = '',
  containerClassName = '',
  labelClassName = '',
  
  // Accessibility
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const { currentTheme } = useTheme();
  const componentTheme = useComponentTheme('input');
  
  // Determine current state
  const currentState = disabled ? 'disabled' : 
                     error ? 'error' : 
                     success ? 'success' : 
                     'default';
  
  // Get size and state configurations
  const sizeConfig = sizeVariants[size] || sizeVariants.md;
  const stateConfig = stateVariants[currentState] || stateVariants.default;
  
  // Generate unique IDs for accessibility
  const inputId = props.id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const helperTextId = `${inputId}-helper`;
  const errorTextId = `${inputId}-error`;
  
  // Build input classes
  const inputClasses = cn(
    // Base styles
    'w-full border rounded-md transition-all duration-200',
    'placeholder-gray-400 focus:outline-none',
    
    // Size styles
    sizeConfig.input,
    
    // State styles
    stateConfig.border,
    stateConfig.background,
    !disabled && stateConfig.focus,
    
    // Disabled styles
    disabled && 'cursor-not-allowed text-gray-500',
    
    // ReadOnly styles
    readOnly && 'cursor-default',
    
    // Icon padding adjustments
    leftIcon && 'pl-10',
    rightIcon && 'pr-10',
    
    className
  );
  
  // Build container classes
  const containerClasses = cn(
    fullWidth ? 'w-full' : 'w-auto',
    containerClassName
  );
  
  // Build label classes
  const labelClasses = cn(
    'block font-medium mb-1',
    sizeConfig.label,
    disabled ? 'text-gray-400' : 'text-gray-700',
    required && "after:content-['*'] after:ml-0.5 after:text-red-500",
    labelClassName
  );
  
  // Handle focus events
  const handleFocus = (event) => {
    setFocused(true);
    onFocus?.(event);
  };
  
  const handleBlur = (event) => {
    setFocused(false);
    onBlur?.(event);
  };
  
  // Handle change events
  const handleChange = (event) => {
    onChange?.(event);
  };
  
  // Render icon
  const renderIcon = (icon, position) => {
    if (!icon) return null;
    
    const iconClasses = cn(
      'absolute top-1/2 transform -translate-y-1/2 pointer-events-none',
      position === 'left' ? 'left-3' : 'right-3',
      'text-gray-400',
      disabled && 'text-gray-300'
    );
    
    return (
      <div className={iconClasses}>
        {typeof icon === 'string' ? (
          <span className="w-5 h-5 flex items-center justify-center">{icon}</span>
        ) : (
          icon
        )}
      </div>
    );
  };
  
  // Determine helper text to show
  const displayHelperText = errorText || successText || helperText;
  const helperTextColor = error ? 'text-red-600' : 
                         success ? 'text-green-600' : 
                         'text-gray-600';
  
  // Build aria-describedby
  const describedBy = [
    ariaDescribedBy,
    displayHelperText && helperTextId,
    error && errorTextId
  ].filter(Boolean).join(' ') || undefined;
  
  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={inputId}
          className={labelClasses}
        >
          {label}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {renderIcon(leftIcon, 'left')}
        
        {/* Input element */}
        <input
          ref={ref}
          id={inputId}
          type={type}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          className={inputClasses}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
          aria-describedby={describedBy}
          aria-invalid={error}
          data-focused={focused}
          data-state={currentState}
          {...props}
        />
        
        {/* Right icon */}
        {renderIcon(rightIcon, 'right')}
      </div>
      
      {/* Helper text */}
      {displayHelperText && (
        <p 
          id={helperTextId}
          className={cn(
            'mt-1',
            sizeConfig.helper,
            helperTextColor
          )}
        >
          {displayHelperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// Textarea component variant
export const Textarea = forwardRef(({
  rows = 3,
  resize = 'vertical',
  autoResize = false,
  maxRows = 10,
  className = '',
  ...props
}, ref) => {
  const [textareaRows, setTextareaRows] = useState(rows);
  
  // Auto-resize functionality
  const handleChange = (event) => {
    if (autoResize) {
      const textarea = event.target;
      const lineHeight = parseInt(getComputedStyle(textarea).lineHeight);
      const padding = parseInt(getComputedStyle(textarea).paddingTop) * 2;
      
      // Reset height to auto to get accurate scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new rows based on scroll height
      const newRows = Math.min(
        Math.max(Math.ceil((textarea.scrollHeight - padding) / lineHeight), rows),
        maxRows
      );
      
      setTextareaRows(newRows);
    }
    
    props.onChange?.(event);
  };
  
  // Resize classes
  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x',
    both: 'resize'
  };
  
  return (
    <Input
      {...props}
      ref={ref}
      as="textarea"
      rows={autoResize ? textareaRows : rows}
      onChange={handleChange}
      className={cn(
        resizeClasses[resize] || resizeClasses.vertical,
        'min-h-[2.5rem]', // Minimum height
        className
      )}
    />
  );
});

Textarea.displayName = 'Textarea';

// Input group for complex input layouts
export const InputGroup = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn('flex', className)} 
      {...props}
    >
      {children}
    </div>
  );
};

// Input addon for prefixes and suffixes
export const InputAddon = ({
  children,
  position = 'left',
  className = '',
  ...props
}) => {
  const addonClasses = cn(
    'inline-flex items-center px-3 border border-gray-300 bg-gray-50 text-gray-500 text-sm',
    position === 'left' && 'rounded-l-md border-r-0',
    position === 'right' && 'rounded-r-md border-l-0',
    className
  );
  
  return (
    <span className={addonClasses} {...props}>
      {children}
    </span>
  );
};

export default Input;
