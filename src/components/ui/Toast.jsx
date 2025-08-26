/**
 * Toast Notification Component
 * Accessible, animated toast notifications for user feedback
 */

import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// Toast context and provider for managing toast state
const ToastContext = React.createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast = { ...toast, id };
    setToasts(prev => [...prev, newToast]);
    
    // Auto-remove toast after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration || 5000);
    }
    
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const removeAllToasts = () => {
    setToasts([]);
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// Hook to use toast context
export const useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Toast container component
const ToastContainer = ({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 right-4 z-toast space-y-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map(toast => (
          <Toast
            key={toast.id}
            {...toast}
            onClose={() => onRemove(toast.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

// Individual toast component
export const Toast = ({
  id,
  title,
  description,
  type = 'info',
  action,
  onClose,
  closable = true,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 200);
  };

  // Icon for each toast type
  const icons = {
    success: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    error: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
  };

  // Color classes for each type
  const colorClasses = {
    success: 'bg-success-50 border-success-200 text-success-800',
    error: 'bg-error-50 border-error-200 text-error-800',
    warning: 'bg-warning-50 border-warning-200 text-warning-800',
    info: 'bg-info-50 border-info-200 text-info-800',
  };

  const iconColorClasses = {
    success: 'text-success-400',
    error: 'text-error-400',
    warning: 'text-warning-400',
    info: 'text-info-400',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ 
        opacity: isVisible ? 1 : 0, 
        y: isVisible ? 0 : -50, 
        scale: isVisible ? 1 : 0.9 
      }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={clsx(
        'max-w-sm w-full shadow-lg rounded-lg pointer-events-auto border',
        'backdrop-blur-sm bg-opacity-95',
        colorClasses[type]
      )}
      role="alert"
      aria-live="polite"
    >
      <div className="p-4">
        <div className="flex items-start">
          {/* Icon */}
          <div className={clsx('flex-shrink-0', iconColorClasses[type])}>
            {icons[type]}
          </div>
          
          {/* Content */}
          <div className="ml-3 w-0 flex-1">
            {title && (
              <p className="text-sm font-medium">
                {title}
              </p>
            )}
            {description && (
              <p className={clsx(
                'text-sm',
                title ? 'mt-1 text-opacity-80' : ''
              )}>
                {description}
              </p>
            )}
            
            {/* Action button */}
            {action && (
              <div className="mt-3">
                {action}
              </div>
            )}
          </div>
          
          {/* Close button */}
          {closable && (
            <div className="ml-4 flex-shrink-0 flex">
              <button
                type="button"
                className={clsx(
                  'inline-flex rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'text-opacity-60 hover:text-opacity-100 transition-colors',
                  iconColorClasses[type],
                  type === 'success' && 'focus:ring-success-500',
                  type === 'error' && 'focus:ring-error-500',
                  type === 'warning' && 'focus:ring-warning-500',
                  type === 'info' && 'focus:ring-info-500'
                )}
                onClick={handleClose}
                aria-label="Close notification"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Helper functions for common toast types
export const toast = {
  success: (message, options = {}) => {
    const { addToast } = React.useContext(ToastContext);
    return addToast({
      type: 'success',
      title: typeof message === 'string' ? message : message.title,
      description: typeof message === 'string' ? undefined : message.description,
      ...options,
    });
  },
  
  error: (message, options = {}) => {
    const { addToast } = React.useContext(ToastContext);
    return addToast({
      type: 'error',
      title: typeof message === 'string' ? message : message.title,
      description: typeof message === 'string' ? undefined : message.description,
      duration: 7000, // Error toasts stay longer
      ...options,
    });
  },
  
  warning: (message, options = {}) => {
    const { addToast } = React.useContext(ToastContext);
    return addToast({
      type: 'warning',
      title: typeof message === 'string' ? message : message.title,
      description: typeof message === 'string' ? undefined : message.description,
      ...options,
    });
  },
  
  info: (message, options = {}) => {
    const { addToast } = React.useContext(ToastContext);
    return addToast({
      type: 'info',
      title: typeof message === 'string' ? message : message.title,
      description: typeof message === 'string' ? undefined : message.description,
      ...options,
    });
  },
};

Toast.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  action: PropTypes.node,
  onClose: PropTypes.func,
  closable: PropTypes.bool,
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

ToastContainer.propTypes = {
  toasts: PropTypes.array.isRequired,
  onRemove: PropTypes.func.isRequired,
};

export default Toast;
