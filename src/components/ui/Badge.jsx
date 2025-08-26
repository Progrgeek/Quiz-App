import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Badge Component
 * Versatile badge component for status indicators, labels, and notifications
 */
const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  rounded = 'md',
  icon,
  iconPosition = 'left',
  removable = false,
  onRemove,
  pulse = false,
  className = '',
  ...props
}) => {
  // Base badge styles
  const baseStyles = `
    inline-flex items-center font-medium transition-all duration-200
    ${removable ? 'pr-1' : ''}
  `;

  // Variant styles
  const variantStyles = {
    default: 'bg-gray-100 text-gray-800 border border-gray-200',
    primary: 'bg-primary-100 text-primary-800 border border-primary-200',
    secondary: 'bg-secondary-100 text-secondary-800 border border-secondary-200',
    success: 'bg-success-100 text-success-800 border border-success-200',
    warning: 'bg-warning-100 text-warning-800 border border-warning-200',
    error: 'bg-error-100 text-error-800 border border-error-200',
    info: 'bg-info-100 text-info-800 border border-info-200',
    // Solid variants
    'primary-solid': 'bg-primary-500 text-white border border-primary-500',
    'secondary-solid': 'bg-secondary-500 text-white border border-secondary-500',
    'success-solid': 'bg-success-500 text-white border border-success-500',
    'warning-solid': 'bg-warning-500 text-white border border-warning-500',
    'error-solid': 'bg-error-500 text-white border border-error-500',
    'info-solid': 'bg-info-500 text-white border border-info-500',
    // Outline variants
    'primary-outline': 'bg-transparent text-primary-600 border border-primary-300',
    'secondary-outline': 'bg-transparent text-secondary-600 border border-secondary-300',
    'success-outline': 'bg-transparent text-success-600 border border-success-300',
    'warning-outline': 'bg-transparent text-warning-600 border border-warning-300',
    'error-outline': 'bg-transparent text-error-600 border border-error-300',
    'info-outline': 'bg-transparent text-info-600 border border-info-300',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  // Rounded styles
  const roundedStyles = {
    none: 'rounded-none',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full'
  };

  // Icon size based on badge size
  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  // Combine styles
  const badgeClasses = `
    ${baseStyles}
    ${variantStyles[variant] || variantStyles.default}
    ${sizeStyles[size]}
    ${roundedStyles[rounded]}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  // Remove button
  const RemoveButton = () => (
    <button
      type="button"
      onClick={onRemove}
      className={`ml-1 inline-flex items-center justify-center rounded-full 
        hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current
        transition-colors duration-200 ${
          size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6'
        }`}
      aria-label="Remove badge"
    >
      <svg 
        className={size === 'sm' ? 'w-2.5 h-2.5' : size === 'md' ? 'w-3 h-3' : 'w-3.5 h-3.5'} 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" 
          clipRule="evenodd" 
        />
      </svg>
    </button>
  );

  const badgeContent = (
    <>
      {/* Left icon */}
      {icon && iconPosition === 'left' && (
        <span className={`${iconSizes[size]} mr-1 flex-shrink-0`}>
          {icon}
        </span>
      )}

      {/* Badge content */}
      <span className="truncate">{children}</span>

      {/* Right icon */}
      {icon && iconPosition === 'right' && !removable && (
        <span className={`${iconSizes[size]} ml-1 flex-shrink-0`}>
          {icon}
        </span>
      )}

      {/* Remove button */}
      {removable && <RemoveButton />}
    </>
  );

  if (pulse) {
    return (
      <motion.span
        className={badgeClasses}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        {...props}
      >
        {badgeContent}
      </motion.span>
    );
  }

  return (
    <motion.span
      className={badgeClasses}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.15 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      {...props}
    >
      {badgeContent}
    </motion.span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    'default', 'primary', 'secondary', 'success', 'warning', 'error', 'info',
    'primary-solid', 'secondary-solid', 'success-solid', 'warning-solid', 'error-solid', 'info-solid',
    'primary-outline', 'secondary-outline', 'success-outline', 'warning-outline', 'error-outline', 'info-outline'
  ]),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  rounded: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'full']),
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
  pulse: PropTypes.bool,
  className: PropTypes.string
};

export default Badge;
