/**
 * Radio Group Component
 * Professional radio buttons with group management and accessibility
 */

import React, { forwardRef, createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

// Radio Group Context
const RadioGroupContext = createContext();

// Individual Radio Component
export const Radio = forwardRef(({
  id,
  name,
  value,
  checked,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
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
  const groupContext = useContext(RadioGroupContext);
  
  // Use group context if available
  const isChecked = groupContext 
    ? groupContext.value === value
    : checked;
  
  const isDisabled = disabled || groupContext?.disabled;
  const radioName = name || groupContext?.name;
  
  const handleChange = (event) => {
    if (groupContext) {
      groupContext.onChange(value, event);
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
  const radioId = id || `radio-${Math.random().toString(36).substr(2, 9)}`;

  // Label text size based on radio size
  const labelTextSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  return (
    <div className={`relative flex items-start ${className}`}>
      {/* Hidden input for form submission */}
      <input
        ref={ref}
        id={radioId}
        name={radioName}
        type="radio"
        value={value}
        checked={isChecked}
        disabled={isDisabled}
        required={required}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        className="sr-only"
        aria-invalid={invalid}
        aria-describedby={description ? `${radioId}-description` : undefined}
        {...props}
      />

      {/* Custom radio */}
      <motion.label
        htmlFor={radioId}
        className={`
          relative flex items-center cursor-pointer
          ${isDisabled ? 'cursor-not-allowed opacity-50' : ''}
        `}
        whileHover={!isDisabled ? { scale: 1.05 } : {}}
        whileTap={!isDisabled ? { scale: 0.95 } : {}}
      >
        {/* Radio circle */}
        <div className={`
          relative flex items-center justify-center border-2 rounded-full
          transition-all duration-200
          ${sizeStyles[size]}
          ${isChecked
            ? `${colorStyles[color]} border-current`
            : `border-gray-300 bg-white hover:border-gray-400`
          }
          ${isDisabled ? 'bg-gray-100 border-gray-200' : ''}
          focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-opacity-50
        `}>
          {/* Inner dot */}
          <motion.div
            className={`
              rounded-full bg-current
              ${size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'}
            `}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: isChecked ? 1 : 0, 
              opacity: isChecked ? 1 : 0 
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          />
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
                id={`${radioId}-description`}
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

Radio.displayName = 'Radio';

// Radio Group Component
export const RadioGroup = ({
  name,
  value,
  defaultValue,
  disabled = false,
  required = false,
  invalid = false,
  size = 'md',
  color = 'primary',
  orientation = 'vertical',
  spacing = 'md',
  children,
  onChange,
  className = '',
  ...props
}) => {
  const [groupValue, setGroupValue] = useState(value || defaultValue);

  // Update local state when prop changes
  React.useEffect(() => {
    if (value !== undefined) {
      setGroupValue(value);
    }
  }, [value]);

  const handleChange = (radioValue, event) => {
    setGroupValue(radioValue);
    onChange?.(radioValue, event);
  };

  // Spacing styles
  const spacingStyles = {
    sm: orientation === 'vertical' ? 'space-y-2' : 'space-x-2',
    md: orientation === 'vertical' ? 'space-y-3' : 'space-x-4',
    lg: orientation === 'vertical' ? 'space-y-4' : 'space-x-6',
  };

  const contextValue = {
    name: name || `radio-group-${Math.random().toString(36).substr(2, 9)}`,
    value: groupValue,
    disabled,
    required,
    invalid,
    size,
    color,
    onChange: handleChange,
  };

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div
        className={`
          ${orientation === 'vertical' ? 'flex flex-col' : 'flex flex-wrap items-center'}
          ${spacingStyles[spacing]}
          ${className}
        `}
        role="radiogroup"
        {...props}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  );
};

// Hook to use radio group context
export const useRadioGroup = () => {
  const context = useContext(RadioGroupContext);
  return context;
};

// Card-style Radio component for quiz answers
export const RadioCard = forwardRef(({
  children,
  value,
  icon,
  image,
  badge,
  className = '',
  ...props
}, ref) => {
  const groupContext = useContext(RadioGroupContext);
  const isSelected = groupContext?.value === value;
  const isDisabled = props.disabled || groupContext?.disabled;

  return (
    <div className={`relative ${className}`}>
      <input
        ref={ref}
        type="radio"
        value={value}
        checked={isSelected}
        onChange={(e) => groupContext?.onChange(value, e)}
        className="sr-only"
        disabled={isDisabled}
        {...props}
      />
      
      <motion.label
        className={`
          relative block p-4 border-2 rounded-lg cursor-pointer transition-all duration-200
          ${isSelected 
            ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500 ring-opacity-20' 
            : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
          }
          ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        whileHover={!isDisabled ? { scale: 1.02 } : {}}
        whileTap={!isDisabled ? { scale: 0.98 } : {}}
      >
        <div className="flex items-center space-x-3">
          {/* Radio indicator */}
          <div className={`
            flex-shrink-0 w-5 h-5 border-2 rounded-full transition-all duration-200
            ${isSelected 
              ? 'border-primary-500 bg-primary-500' 
              : 'border-gray-300'
            }
          `}>
            {isSelected && (
              <motion.div
                className="w-full h-full rounded-full bg-white"
                initial={{ scale: 0 }}
                animate={{ scale: 0.6 }}
                transition={{ duration: 0.15 }}
              />
            )}
          </div>

          {/* Icon */}
          {icon && (
            <div className="flex-shrink-0 text-gray-500">
              {icon}
            </div>
          )}

          {/* Image */}
          {image && (
            <div className="flex-shrink-0">
              <img 
                src={image} 
                alt="" 
                className="w-12 h-12 object-cover rounded-md"
              />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            {children}
          </div>

          {/* Badge */}
          {badge && (
            <div className="flex-shrink-0">
              {badge}
            </div>
          )}
        </div>

        {/* Selection indicator */}
        {isSelected && (
          <motion.div
            className="absolute top-2 right-2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <svg className="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          </motion.div>
        )}
      </motion.label>
    </div>
  );
});

RadioCard.displayName = 'RadioCard';

// PropTypes
Radio.propTypes = {
  id: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.any.isRequired,
  checked: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'success', 'error', 'warning']),
  children: PropTypes.node,
  label: PropTypes.string,
  description: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
};

RadioGroup.propTypes = {
  name: PropTypes.string,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  invalid: PropTypes.bool,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  color: PropTypes.oneOf(['primary', 'success', 'error', 'warning']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  spacing: PropTypes.oneOf(['sm', 'md', 'lg']),
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func,
  className: PropTypes.string,
};

RadioCard.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.any.isRequired,
  icon: PropTypes.node,
  image: PropTypes.string,
  badge: PropTypes.node,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Radio;
