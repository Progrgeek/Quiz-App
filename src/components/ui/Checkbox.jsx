/**
 * Checkbox Component
 * Professional checkbox with group support, animations, and accessibility
 */

import React, { forwardRef, createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

// Checkbox Group Context
const CheckboxGroupContext = createContext();

// Individual Checkbox Component
export const Checkbox = forwardRef(({
  id,
  name,
  value,
  checked,
  defaultChecked,
  indeterminate = false,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  variant = 'default',
  color = 'primary',
  children,
  label,
  description,
  onChange,
  onFocus,
  onBlur,
  className = '',
  ...props
}, ref) => {
  const groupContext = useContext(CheckboxGroupContext);
  
  // Use group context if available
  const isChecked = groupContext 
    ? groupContext.value.includes(value)
    : checked;
  
  const isDisabled = disabled || groupContext?.disabled;
  const checkboxName = name || groupContext?.name;
  
  const handleChange = (event) => {
    if (groupContext) {
      groupContext.onChange(value, event.target.checked);
    } else {
      onChange?.(event);
    }
  };

  // Size styles
  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  // Color styles
  const colorStyles = {
    primary: 'text-primary-600 focus:ring-primary-500',
    success: 'text-success-600 focus:ring-success-500',
    error: 'text-error-600 focus:ring-error-500',
    warning: 'text-warning-600 focus:ring-warning-500',
  };

  // Generate unique ID if not provided
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  // Label text size based on checkbox size
  const labelTextSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  // Checkbox icon animation variants
  const checkVariants = {
    unchecked: { 
      pathLength: 0,
      opacity: 0,
      scale: 0.8
    },
    checked: { 
      pathLength: 1,
      opacity: 1,
      scale: 1
    },
    indeterminate: {
      pathLength: 1,
      opacity: 1,
      scale: 1
    }
  };

  const renderCheckIcon = () => {
    if (indeterminate) {
      return (
        <motion.line
          x1="3"
          y1="8"
          x2="13"
          y2="8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          variants={checkVariants}
          initial="unchecked"
          animate="indeterminate"
          transition={{ duration: 0.2, ease: "easeOut" }}
        />
      );
    }
    
    return (
      <motion.path
        d="M4 8l2.5 2.5L12 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        variants={checkVariants}
        initial="unchecked"
        animate={isChecked ? "checked" : "unchecked"}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    );
  };

  return (
    <div className={`relative flex items-start ${className}`}>
      {/* Hidden input for form submission */}
      <input
        ref={ref}
        id={checkboxId}
        name={checkboxName}
        type="checkbox"
        value={value}
        checked={isChecked}
        defaultChecked={defaultChecked}
        disabled={isDisabled}
        required={required}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="sr-only"
        aria-invalid={invalid}
        aria-describedby={description ? `${checkboxId}-description` : undefined}
        {...props}
      />

      {/* Custom checkbox */}
      <motion.label
        htmlFor={checkboxId}
        className={`
          relative flex items-center cursor-pointer
          ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
      >
        {/* Checkbox box */}
        <div className={`
          relative flex items-center justify-center border-2 rounded
          transition-all duration-200
          ${sizeStyles[size]}
          ${isChecked || indeterminate
            ? `${colorStyles[color]} border-current bg-current`
            : `border-gray-300 bg-white hover:border-gray-400`
          }
          ${isDisabled ? 'bg-gray-100 border-gray-200' : ''}
          focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-opacity-50
        `}>
          {/* Check/indeterminate icon */}
          <svg
            className={`${sizeStyles[size]} text-white pointer-events-none`}
            viewBox="0 0 16 16"
            fill="none"
          >
            {renderCheckIcon()}
          </svg>
        </div>

        {/* Label content */}
        {(children || label) && (
          <div className="ml-3 flex-1">
            <div className={`font-medium ${labelTextSize[size]} ${
              invalid ? 'text-error-700' : 'text-gray-900'
            }`}>
              {children || label}
              {required && <span className="text-error-500 ml-1">*</span>}
            </div>
            
            {description && (
              <div 
                id={`${checkboxId}-description`}
                className={`mt-1 ${
                  size === 'sm' ? 'text-xs' : 'text-sm'
                } text-gray-500`}
              >
                {description}
              </div>
            )}
          </div>
        )}
      </motion.label>
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

// Checkbox Group Component
export const CheckboxGroup = ({
  name,
  value = [],
  defaultValue = [],
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  orientation = 'vertical',
  spacing = 'md',
  children,
  onChange,
  className = '',
  ...props
}) => {
  const [groupValue, setGroupValue] = React.useState(value || defaultValue);

  // Update local state when prop changes
  React.useEffect(() => {
    setGroupValue(value);
  }, [value]);

  const handleChange = (checkboxValue, checked) => {
    let newValue;
    if (checked) {
      newValue = [...groupValue, checkboxValue];
    } else {
      newValue = groupValue.filter(v => v !== checkboxValue);
    }
    
    setGroupValue(newValue);
    onChange?.(newValue);
  };

  // Spacing styles
  const spacingStyles = {
    sm: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: orientation === 'vertical' ? 'space-y-3' : 'space-x-4',
    lg: orientation === 'vertical' ? 'space-y-4' : 'space-x-6',
  };

  const contextValue = {
    name,
    value: groupValue,
    disabled,
    required,
    invalid,
    size,
    onChange: handleChange,
  };

  return (
    <CheckboxGroupContext.Provider value={contextValue}>
      <div
        className={`
          ${orientation === 'vertical' ? 'flex flex-col' : 'flex flex-wrap items-center'}
          ${spacingStyles[spacing]}
          ${className}
        `}
        role="group"
        {...props}
      >
        {children}
      </div>
    </CheckboxGroupContext.Provider>
  );
};

// Hook to use checkbox group context
export const useCheckboxGroup = () => {
  const context = useContext(CheckboxGroupContext);
  return context;
};

// PropTypes
Checkbox.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any,
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  indeterminate: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default']),
  color: PropTypes.oneOf(['primary', 'success', 'error', 'warning']),
  children: PropTypes.node,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

CheckboxGroup.propTypes = {
  name: PropTypes.string,
  value: PropTypes.array,
  defaultValue: PropTypes.array,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  spacing: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

export default Checkbox;
