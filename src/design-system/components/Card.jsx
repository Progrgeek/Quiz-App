// design-system/components/Card.jsx - Comprehensive card component
import React, { forwardRef } from 'react';
import { useTheme, useComponentTheme } from '../theme/ThemeProvider.jsx';
import { cn } from '../../utils/classNames.js';

// Card size variants
const sizeVariants = {
  sm: {
    padding: 'p-4',
    gap: 'space-y-3'
  },
  md: {
    padding: 'p-6',
    gap: 'space-y-4'
  },
  lg: {
    padding: 'p-8',
    gap: 'space-y-6'
  }
};

// Card variant styles
const cardVariants = {
  default: {
    background: 'bg-white',
    border: 'border border-gray-200',
    shadow: 'shadow-md'
  },
  elevated: {
    background: 'bg-white',
    border: 'border-0',
    shadow: 'shadow-lg'
  },
  outlined: {
    background: 'bg-white',
    border: 'border-2 border-gray-300',
    shadow: 'shadow-none'
  },
  filled: {
    background: 'bg-gray-50',
    border: 'border-0',
    shadow: 'shadow-sm'
  },
  success: {
    background: 'bg-green-50',
    border: 'border border-green-200',
    shadow: 'shadow-sm'
  },
  warning: {
    background: 'bg-yellow-50',
    border: 'border border-yellow-200',
    shadow: 'shadow-sm'
  },
  error: {
    background: 'bg-red-50',
    border: 'border border-red-200',
    shadow: 'shadow-sm'
  },
  info: {
    background: 'bg-blue-50',
    border: 'border border-blue-200',
    shadow: 'shadow-sm'
  }
};

export const Card = forwardRef(({
  children,
  variant = 'default',
  size = 'md',
  interactive = false,
  disabled = false,
  loading = false,
  className = '',
  onClick,
  onKeyDown,
  ...props
}, ref) => {
  const { currentTheme } = useTheme();
  const componentTheme = useComponentTheme('card');
  
  // Get variant configurations
  const sizeConfig = sizeVariants[size] || sizeVariants.md;
  const variantConfig = cardVariants[variant] || cardVariants.default;
  
  // Build card classes
  const cardClasses = cn(
    // Base styles
    'rounded-lg transition-all duration-200',
    
    // Size styles
    sizeConfig.padding,
    
    // Variant styles
    variantConfig.background,
    variantConfig.border,
    variantConfig.shadow,
    
    // Interactive styles
    interactive && !disabled && 'cursor-pointer hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    interactive && !disabled && 'transform hover:-translate-y-0.5',
    
    // Disabled styles
    disabled && 'opacity-50 cursor-not-allowed',
    
    // Loading styles
    loading && 'relative overflow-hidden',
    
    className
  );
  
  // Handle keyboard navigation for interactive cards
  const handleKeyDown = (event) => {
    if (interactive && !disabled) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onClick?.(event);
      }
    }
    onKeyDown?.(event);
  };
  
  // Handle click events
  const handleClick = (event) => {
    if (disabled) {
      event.preventDefault();
      return;
    }
    onClick?.(event);
  };
  
  // Determine element type and props
  const elementProps = {
    ref,
    className: cardClasses,
    onClick: interactive ? handleClick : undefined,
    onKeyDown: interactive ? handleKeyDown : onKeyDown,
    tabIndex: interactive && !disabled ? 0 : undefined,
    role: interactive ? 'button' : undefined,
    'aria-disabled': disabled,
    'data-variant': variant,
    'data-size': size,
    'data-interactive': interactive,
    'data-loading': loading,
    ...props
  };
  
  const CardElement = interactive ? 'div' : 'div';
  
  return (
    <CardElement {...elementProps}>
      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}
      
      {/* Card content */}
      <div className={cn(sizeConfig.gap)}>
        {children}
      </div>
    </CardElement>
  );
});

Card.displayName = 'Card';

// Card header component
export const CardHeader = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card title component
export const CardTitle = ({
  children,
  level = 3,
  className = '',
  ...props
}) => {
  const titleClasses = cn(
    'font-semibold text-gray-900',
    level === 1 && 'text-2xl',
    level === 2 && 'text-xl',
    level === 3 && 'text-lg',
    level === 4 && 'text-base',
    level === 5 && 'text-sm',
    level === 6 && 'text-xs',
    className
  );
  
  const TitleElement = `h${level}`;
  
  return React.createElement(TitleElement, {
    className: titleClasses,
    ...props
  }, children);
};

// Card content component
export const CardContent = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn('text-gray-600', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card footer component
export const CardFooter = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <div 
      className={cn('flex items-center justify-between pt-4 border-t border-gray-200', className)}
      {...props}
    >
      {children}
    </div>
  );
};

// Card actions component
export const CardActions = ({
  children,
  justify = 'end',
  className = '',
  ...props
}) => {
  const actionClasses = cn(
    'flex items-center gap-2',
    justify === 'start' && 'justify-start',
    justify === 'center' && 'justify-center',
    justify === 'end' && 'justify-end',
    justify === 'between' && 'justify-between',
    className
  );
  
  return (
    <div className={actionClasses} {...props}>
      {children}
    </div>
  );
};

// Exercise-specific card variant
export const ExerciseCard = forwardRef(({
  title,
  description,
  difficulty,
  type,
  status = 'pending',
  progress,
  actions,
  children,
  className = '',
  ...props
}, ref) => {
  // Status variants
  const statusVariants = {
    pending: 'default',
    active: 'info',
    completed: 'success',
    error: 'error'
  };
  
  // Difficulty colors
  const difficultyColors = {
    easy: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    hard: 'text-red-600 bg-red-100'
  };
  
  return (
    <Card
      ref={ref}
      variant={statusVariants[status]}
      interactive
      className={cn('min-h-[200px]', className)}
      {...props}
    >
      <CardHeader>
        <div className="flex-1">
          <CardTitle level={3}>{title}</CardTitle>
          {type && (
            <span className="text-sm text-gray-500 capitalize">{type}</span>
          )}
        </div>
        {difficulty && (
          <span className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            difficultyColors[difficulty] || difficultyColors.medium
          )}>
            {difficulty}
          </span>
        )}
      </CardHeader>
      
      <CardContent>
        {description && <p className="mb-4">{description}</p>}
        {children}
      </CardContent>
      
      {/* Progress bar */}
      {progress !== undefined && (
        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(progress * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>
      )}
      
      {actions && (
        <CardFooter>
          <CardActions>
            {actions}
          </CardActions>
        </CardFooter>
      )}
    </Card>
  );
});

ExerciseCard.displayName = 'ExerciseCard';

export default Card;
