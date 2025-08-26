import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Button } from '../ui';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useContent } from '../../hooks/useContent';

/**
 * Universal Feedback Display Component
 * Handles success, error, and hint feedback for all exercise types using design system
 */
const FeedbackDisplay = ({ 
  type = 'info', // 'success', 'error', 'warning', 'info'
  message, 
  isVisible = false,
  onClose,
  autoHide = true,
  duration = 3000,
  title,
  actions,
  position = 'top-center' // 'top-center', 'bottom-center', 'top-right', 'bottom-right'
}) => {
  const { getContent } = useContent();

  React.useEffect(() => {
    if (autoHide && isVisible && type === 'success') {
      const timer = setTimeout(() => {
        onClose && onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, autoHide, duration, onClose, type]);

  const feedbackConfig = {
    success: {
      icon: CheckCircle,
      variant: 'success',
      bgColor: 'bg-success-50',
      borderColor: 'border-success-200',
      textColor: 'text-success-800',
      iconColor: 'text-success-500'
    },
    error: {
      icon: XCircle,
      variant: 'error',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200',
      textColor: 'text-error-800',
      iconColor: 'text-error-500'
    },
    warning: {
      icon: AlertTriangle,
      variant: 'warning',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200',
      textColor: 'text-warning-800',
      iconColor: 'text-warning-500'
    },
    info: {
      icon: Info,
      variant: 'info',
      bgColor: 'bg-info-50',
      borderColor: 'border-info-200',
      textColor: 'text-info-800',
      iconColor: 'text-info-500'
    }
  };

  const positionClasses = {
    'top-center': 'top-4 left-1/2 transform -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 transform -translate-x-1/2',
    'top-right': 'top-4 right-4',
    'bottom-right': 'bottom-4 right-4'
  };

  const config = feedbackConfig[type];
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isVisible && message && (
        <motion.div
          className={`fixed z-50 max-w-md w-full mx-4 ${positionClasses[position]}`}
          initial={{ opacity: 0, scale: 0.9, y: position.includes('top') ? -20 : 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: position.includes('top') ? -20 : 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className={`
            ${config.bgColor} ${config.borderColor} ${config.textColor}
            border rounded-lg shadow-lg p-4 backdrop-blur-sm
          `}>
            <div className="flex items-start gap-3">
              {/* Icon */}
              <div className={`flex-shrink-0 ${config.iconColor}`}>
                <IconComponent className="w-5 h-5" />
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h4 className="text-sm font-semibold mb-1">
                    {title}
                  </h4>
                )}
                <p className="text-sm leading-relaxed">
                  {message}
                </p>
                
                {/* Actions */}
                {actions && (
                  <div className="flex gap-2 mt-3">
                    {actions.map((action, index) => (
                      <Button
                        key={index}
                        variant={action.variant || 'outline'}
                        size="sm"
                        onClick={action.onClick}
                        className="text-xs"
                      >
                        {action.label}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Close Button */}
              {onClose && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className={`flex-shrink-0 ${config.iconColor} hover:bg-black/5 p-1`}
                  icon={<X className="w-4 h-4" />}
                  aria-label={getContent('ui', 'close') || 'Close'}
                />
              )}
            </div>
            
            {/* Progress bar for auto-hide */}
            {autoHide && type === 'success' && (
              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-success-500 rounded-b-lg"
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: "linear" }}
              />
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

FeedbackDisplay.propTypes = {
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  message: PropTypes.string,
  isVisible: PropTypes.bool,
  onClose: PropTypes.func,
  autoHide: PropTypes.bool,
  duration: PropTypes.number,
  title: PropTypes.string,
  actions: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string
  })),
  position: PropTypes.oneOf(['top-center', 'bottom-center', 'top-right', 'bottom-right'])
};

export default FeedbackDisplay;
