import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';

/**
 * Enhanced Card Component
 * Consistent card layout for exercises and content sections
 */
const Card = ({
  children,
  title,
  subtitle,
  variant = 'default',
  size = 'md',
  hover = false,
  clickable = false,
  loading = false,
  status,
  progress,
  onClick,
  className = '',
  headerActions,
  footer,
  ...props
}) => {
  // Base card styles
  const baseStyles = `
    bg-white rounded-card-md shadow-md border border-gray-200
    transition-all duration-200 relative overflow-hidden
  `;

  // Variant styles
  const variantStyles = {
    default: '',
    exercise: 'border-primary-200',
    success: 'border-success-200 bg-success-50',
    error: 'border-error-200 bg-error-50',
    warning: 'border-warning-200 bg-warning-50',
    info: 'border-info-200 bg-info-50'
  };

  // Size styles
  const sizeStyles = {
    sm: 'p-card-sm',
    md: 'p-card-md',
    lg: 'p-card-lg'
  };

  // Interactive styles
  const interactiveStyles = clickable || onClick ? `
    cursor-pointer hover:shadow-lg active:shadow-md
    hover:border-primary-300 focus:outline-none focus:ring-2
    focus:ring-primary-500 focus:ring-offset-2
  ` : '';

  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1' : '';

  // Status indicator styles
  const statusStyles = {
    completed: 'bg-success-500',
    'in-progress': 'bg-warning-500',
    locked: 'bg-gray-400',
    error: 'bg-error-500'
  };

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  );

  // Progress bar component
  const ProgressBar = ({ value }) => (
    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
      <motion.div
        className="bg-primary-500 h-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
    </div>
  );

  // Combine styles
  const cardClasses = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${interactiveStyles}
    ${hoverStyles}
    ${className}
  `.replace(/\s+/g, ' ').trim();

  const CardContent = () => (
    <>
      {/* Status indicator */}
      {status && (
        <div className={`absolute top-0 right-0 w-3 h-3 rounded-bl-md ${statusStyles[status]}`} />
      )}

      {/* Header */}
      {(title || subtitle || headerActions) && (
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600">
                {subtitle}
              </p>
            )}
          </div>
          {headerActions && (
            <div className="flex-shrink-0 ml-4">
              {headerActions}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex-1">
        {loading ? <LoadingSkeleton /> : children}
      </div>

      {/* Progress bar */}
      {progress !== undefined && progress !== null && (
        <ProgressBar value={progress} />
      )}

      {/* Footer */}
      {footer && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          {footer}
        </div>
      )}
    </>
  );

  if (clickable || onClick) {
    return (
      <motion.div
        className={cardClasses}
        onClick={onClick}
        whileHover={{ y: hover ? -4 : 0 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "tween", duration: 0.2 }}
        tabIndex={0}
        role="button"
        onKeyDown={(e) => {
          if ((e.key === 'Enter' || e.key === ' ') && onClick) {
            e.preventDefault();
            onClick(e);
          }
        }}
        {...props}
      >
        <CardContent />
      </motion.div>
    );
  }

  return (
    <motion.div
      className={cardClasses}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <CardContent />
    </motion.div>
  );
};

Card.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'elevated', 'bordered', 'flat', 'exercise', 'success', 'error', 'warning', 'info']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  hover: PropTypes.bool,
  clickable: PropTypes.bool,
  loading: PropTypes.bool,
  status: PropTypes.oneOf(['completed', 'in-progress', 'locked', 'error']),
  progress: PropTypes.number,
  onClick: PropTypes.func,
  className: PropTypes.string,
  headerActions: PropTypes.node,
  footer: PropTypes.node,
  exerciseType: PropTypes.string
};

// Compound Components
Card.Header = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-b border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

Card.Content = ({ children, className = '', ...props }) => (
  <div className={`p-4 ${className}`} {...props}>
    {children}
  </div>
);

Card.Footer = ({ children, className = '', ...props }) => (
  <div className={`p-4 border-t border-gray-200 ${className}`} {...props}>
    {children}
  </div>
);

Card.Header.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Card.Content.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

Card.Footer.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string
};

export default Card;
