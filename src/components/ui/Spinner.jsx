/**
 * Spinner Loading Component
 * Accessible loading indicators with multiple variants and sizes
 */

import React from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

export const Spinner = ({
  size = 'md',
  variant = 'default',
  color = 'primary',
  label = 'Loading...',
  className = '',
}) => {
  // Size classes
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  // Color classes
  const colorClasses = {
    primary: 'text-primary-600',
    secondary: 'text-gray-600',
    success: 'text-success-600',
    error: 'text-error-600',
    warning: 'text-warning-600',
    white: 'text-white',
  };

  // Spinner variants
  const SpinnerVariants = {
    // Default circular spinner
    default: () => (
      <motion.svg
        className={clsx(sizeClasses[size], colorClasses[color], className)}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        aria-label={label}
        role="status"
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
          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </motion.svg>
    ),

    // Dots spinner
    dots: () => (
      <div
        className={clsx('flex space-x-1', className)}
        role="status"
        aria-label={label}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={clsx(
              'rounded-full',
              colorClasses[color].replace('text-', 'bg-'),
              {
                'w-1 h-1': size === 'xs',
                'w-1.5 h-1.5': size === 'sm',
                'w-2 h-2': size === 'md',
                'w-2.5 h-2.5': size === 'lg',
                'w-3 h-3': size === 'xl',
              }
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.15,
            }}
          />
        ))}
      </div>
    ),

    // Pulse spinner
    pulse: () => (
      <motion.div
        className={clsx(
          'rounded-full border-2',
          sizeClasses[size],
          colorClasses[color].replace('text-', 'border-'),
          className
        )}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [1, 0.8, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        role="status"
        aria-label={label}
      />
    ),

    // Bars spinner
    bars: () => (
      <div
        className={clsx('flex space-x-0.5', className)}
        role="status"
        aria-label={label}
      >
        {[0, 1, 2, 3].map((index) => (
          <motion.div
            key={index}
            className={clsx(
              colorClasses[color].replace('text-', 'bg-'),
              {
                'w-0.5 h-3': size === 'xs',
                'w-0.5 h-4': size === 'sm',
                'w-1 h-6': size === 'md',
                'w-1 h-8': size === 'lg',
                'w-1.5 h-12': size === 'xl',
              }
            )}
            animate={{
              scaleY: [1, 2, 1],
            }}
            transition={{
              duration: 0.8,
              repeat: Infinity,
              delay: index * 0.1,
            }}
          />
        ))}
      </div>
    ),

    // Ring spinner
    ring: () => (
      <motion.div
        className={clsx(
          'border-2 border-transparent rounded-full',
          sizeClasses[size],
          className
        )}
        style={{
          borderTopColor: 'currentColor',
          borderRightColor: 'currentColor',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
        role="status"
        aria-label={label}
      >
        <span className={colorClasses[color]} />
      </motion.div>
    ),
  };

  return (
    <div className="inline-flex items-center justify-center">
      {SpinnerVariants[variant]()}
      <span className="sr-only">{label}</span>
    </div>
  );
};

// Full-screen loading overlay
export const LoadingOverlay = ({
  isLoading = false,
  label = 'Loading...',
  variant = 'default',
  size = 'lg',
  backdrop = true,
  children,
}) => {
  if (!isLoading) {
    return children;
  }

  return (
    <div className="relative">
      {children && (
        <div className={clsx(
          backdrop && 'opacity-50 pointer-events-none'
        )}>
          {children}
        </div>
      )}
      
      <div className="absolute inset-0 flex items-center justify-center">
        {backdrop && (
          <div className="absolute inset-0 bg-white bg-opacity-75 backdrop-blur-sm" />
        )}
        <div className="relative">
          <Spinner
            variant={variant}
            size={size}
            label={label}
            color="primary"
          />
          <p className="mt-2 text-sm text-gray-600 text-center">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
};

// Inline loading component
export const InlineLoader = ({
  isLoading = false,
  label = 'Loading...',
  variant = 'dots',
  size = 'sm',
  className = '',
}) => {
  if (!isLoading) return null;

  return (
    <div className={clsx('inline-flex items-center space-x-2', className)}>
      <Spinner
        variant={variant}
        size={size}
        label={label}
        color="primary"
      />
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['default', 'dots', 'pulse', 'bars', 'ring']),
  color: PropTypes.oneOf(['primary', 'secondary', 'success', 'error', 'warning', 'white']),
  label: PropTypes.string,
  className: PropTypes.string,
};

LoadingOverlay.propTypes = {
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'dots', 'pulse', 'bars', 'ring']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  backdrop: PropTypes.bool,
  children: PropTypes.node,
};

InlineLoader.propTypes = {
  isLoading: PropTypes.bool,
  label: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'dots', 'pulse', 'bars', 'ring']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  className: PropTypes.string,
};

export default Spinner;
