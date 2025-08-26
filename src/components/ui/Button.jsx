import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Enhanced Button Component
 * Professional, accessible, and consistent button with multiple variants
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  icon = null,
  iconPosition = 'left',
  onClick,
  type = 'button',
  className = '',
  ariaLabel,
  ...props
}) => {
  // Base button styles
  const baseStyles = `
    inline-flex items-center justify-center font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed
    touch-target rounded-lg
  `;

  // Variant styles
  const variantStyles = {
    primary: `
      bg-primary-500 text-white hover:bg-primary-600 focus:ring-primary-500
      disabled:bg-primary-300 disabled:text-primary-100
      shadow-sm hover:shadow-md active:shadow-sm
    `,
    secondary: `
      bg-white text-primary-700 border border-primary-300 hover:bg-primary-50
      focus:ring-primary-500 disabled:bg-gray-50 disabled:text-gray-400
      disabled:border-gray-200 shadow-sm hover:shadow-md active:shadow-sm
    `,
    success: `
      bg-success-500 text-white hover:bg-success-600 focus:ring-success-500
      disabled:bg-success-300 disabled:text-success-100
      shadow-sm hover:shadow-md active:shadow-sm
    `,
    error: `
      bg-error-500 text-white hover:bg-error-600 focus:ring-error-500
      disabled:bg-error-300 disabled:text-error-100
      shadow-sm hover:shadow-md active:shadow-sm
    `,
    warning: `
      bg-warning-500 text-white hover:bg-warning-600 focus:ring-warning-500
      disabled:bg-warning-300 disabled:text-warning-100
      shadow-sm hover:shadow-md active:shadow-sm
    `,
    ghost: `
      bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-500
      disabled:text-gray-400 disabled:hover:bg-transparent
    `,
    link: `
      bg-transparent text-primary-600 hover:text-primary-700 underline
      focus:ring-primary-500 disabled:text-primary-400 p-0 h-auto min-h-0
    `
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-button-sm px-3 text-sm gap-1.5',
    md: 'h-button-md px-4 text-base gap-2',
    lg: 'h-button-lg px-6 text-lg gap-2.5'
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
    />
  );

  // Combine all styles
  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'cursor-wait' : ''}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      aria-label={ariaLabel}
      className={buttonClasses}
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ type: "tween", duration: 0.15 }}
      {...props}
    >
      {/* Icon on left */}
      {icon && iconPosition === 'left' && !loading && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}

      {/* Loading spinner */}
      {loading && (
        <LoadingSpinner />
      )}

      {/* Button text */}
      <span className={loading ? 'opacity-75' : ''}>
        {children}
      </span>

      {/* Icon on right */}
      {icon && iconPosition === 'right' && !loading && (
        <span className="flex-shrink-0">
          {icon}
        </span>
      )}
    </motion.button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'ghost', 'link']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  ariaLabel: PropTypes.string
};

export default Button;
