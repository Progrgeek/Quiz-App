/**
 * Alert Component
 * Alert and banner components for displaying important messages
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../styles/tokens';

// Default icons
const InfoIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 16V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const SuccessIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4905 2.02168 11.3363C2.16356 9.18211 2.99721 7.13634 4.39828 5.49467C5.79935 3.85301 7.69279 2.71112 9.79619 2.24618C11.8996 1.78124 14.1003 1.01843 16.07 2.04" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WarningIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 9V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 17H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const ErrorIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M15 9L9 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M9 9L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

// Get icon component by variant
const getIconByVariant = (variant) => {
  switch (variant) {
    case 'success':
      return <SuccessIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'error':
      return <ErrorIcon />;
    case 'info':
    default:
      return <InfoIcon />;
  }
};

// Main Alert Component
export const Alert = ({
  children,
  title,
  variant = 'info',
  size = 'md',
  icon: customIcon,
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-50 text-green-800';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      case 'error':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'p-3 text-sm';
      case 'lg':
        return 'p-6 text-lg';
      default:
        return 'p-4 text-base';
    }
  };

  const getIconColorClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      case 'info':
      default:
        return 'text-blue-500';
    }
  };

  const classes = `
    relative flex items-start gap-3 border rounded-lg
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  const icon = customIcon || (showIcon ? getIconByVariant(variant) : null);

  return (
    <motion.div
      className={classes.trim()}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      role="alert"
      {...props}
    >
      {/* Icon */}
      {icon && (
        <div className={`flex-shrink-0 ${getIconColorClasses()}`}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        {title && (
          <div className="font-semibold mb-1">
            {title}
          </div>
        )}
        <div className={title ? 'text-sm opacity-90' : ''}>
          {children}
        </div>
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={`
            flex-shrink-0 rounded p-1 transition-colors
            hover:bg-black hover:bg-opacity-10
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500
            ${getIconColorClasses()}
          `}
          aria-label="Dismiss alert"
        >
          <CloseIcon />
        </button>
      )}
    </motion.div>
  );
};

// Alert variants for common use cases
export const InfoAlert = (props) => <Alert variant="info" {...props} />;
export const SuccessAlert = (props) => <Alert variant="success" {...props} />;
export const WarningAlert = (props) => <Alert variant="warning" {...props} />;
export const ErrorAlert = (props) => <Alert variant="error" {...props} />;

// Banner variant for full-width alerts
export const AlertBanner = ({
  children,
  variant = 'info',
  showIcon = true,
  dismissible = false,
  onDismiss,
  className = '',
  ...props
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'success':
        return 'border-green-200 bg-green-100 text-green-900';
      case 'warning':
        return 'border-yellow-200 bg-yellow-100 text-yellow-900';
      case 'error':
        return 'border-red-200 bg-red-100 text-red-900';
      case 'info':
      default:
        return 'border-blue-200 bg-blue-100 text-blue-900';
    }
  };

  const getIconColorClasses = () => {
    switch (variant) {
      case 'success':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'error':
        return 'text-red-600';
      case 'info':
      default:
        return 'text-blue-600';
    }
  };

  const classes = `
    flex items-center justify-center gap-3 w-full
    px-4 py-3 border-y text-sm font-medium
    ${getVariantClasses()}
    ${className}
  `;

  return (
    <motion.div
      className={classes.trim()}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{
        duration: 0.3,
        ease: "easeInOut",
      }}
      role="alert"
      {...props}
    >
      {/* Icon */}
      {showIcon && (
        <div className={`flex-shrink-0 ${getIconColorClasses()}`}>
          {getIconByVariant(variant)}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 text-center">
        {children}
      </div>

      {/* Dismiss button */}
      {dismissible && (
        <button
          type="button"
          onClick={onDismiss}
          className={`
            flex-shrink-0 rounded p-1 transition-colors
            hover:bg-black hover:bg-opacity-10
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500
            ${getIconColorClasses()}
          `}
          aria-label="Dismiss banner"
        >
          <CloseIcon />
        </button>
      )}
    </motion.div>
  );
};

// Alert Provider for managing multiple alerts
export const AlertProvider = ({ children }) => {
  return (
    <div className="relative">
      {children}
    </div>
  );
};

// PropTypes
Alert.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  icon: PropTypes.node,
  showIcon: PropTypes.bool,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

AlertBanner.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['info', 'success', 'warning', 'error']),
  showIcon: PropTypes.bool,
  dismissible: PropTypes.bool,
  onDismiss: PropTypes.func,
  className: PropTypes.string,
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Alert;
