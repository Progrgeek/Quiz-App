// design-system/components/Button.jsx - Comprehensive button component
import React, { forwardRef } from 'react';
import { useTheme, useComponentTheme } from '../theme/ThemeProvider.jsx';
import { cn } from '../../utils/classNames.js';

// Button size variants
const sizeVariants = {
  sm: {
    padding: 'px-3 py-1.5',
    fontSize: 'text-sm',
    height: 'h-8',
    minWidth: 'min-w-16'
  },
  md: {
    padding: 'px-4 py-2',
    fontSize: 'text-base',
    height: 'h-10',
    minWidth: 'min-w-20'
  },
  lg: {
    padding: 'px-6 py-3',
    fontSize: 'text-lg',
    height: 'h-12',
    minWidth: 'min-w-24'
  },
  xl: {
    padding: 'px-8 py-4',
    fontSize: 'text-xl',
    height: 'h-14',
    minWidth: 'min-w-28'
  }
};

// Button style variants
const styleVariants = {
  primary: {
    base: 'bg-blue-600 text-white border-blue-600',
    hover: 'hover:bg-blue-700 hover:border-blue-700',
    active: 'active:bg-blue-800',
    focus: 'focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
    disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed'
  },
  secondary: {
    base: 'bg-gray-100 text-gray-900 border-gray-300',
    hover: 'hover:bg-gray-200 hover:border-gray-400',
    active: 'active:bg-gray-300',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'disabled:bg-gray-50 disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed'
  },
  success: {
    base: 'bg-green-600 text-white border-green-600',
    hover: 'hover:bg-green-700 hover:border-green-700',
    active: 'active:bg-green-800',
    focus: 'focus:ring-2 focus:ring-green-500 focus:ring-offset-2',
    disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed'
  },
  warning: {
    base: 'bg-yellow-500 text-white border-yellow-500',
    hover: 'hover:bg-yellow-600 hover:border-yellow-600',
    active: 'active:bg-yellow-700',
    focus: 'focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2',
    disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed'
  },
  error: {
    base: 'bg-red-600 text-white border-red-600',
    hover: 'hover:bg-red-700 hover:border-red-700',
    active: 'active:bg-red-800',
    focus: 'focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
    disabled: 'disabled:bg-gray-300 disabled:text-gray-500 disabled:border-gray-300 disabled:cursor-not-allowed'
  },
  outline: {
    base: 'bg-transparent text-gray-700 border-gray-300',
    hover: 'hover:bg-gray-50 hover:border-gray-400',
    active: 'active:bg-gray-100',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-200 disabled:cursor-not-allowed'
  },
  ghost: {
    base: 'bg-transparent text-gray-700 border-transparent',
    hover: 'hover:bg-gray-100',
    active: 'active:bg-gray-200',
    focus: 'focus:ring-2 focus:ring-gray-500 focus:ring-offset-2',
    disabled: 'disabled:bg-transparent disabled:text-gray-400 disabled:cursor-not-allowed'
  }
};

// Button shape variants
const shapeVariants = {
  rounded: 'rounded-md',
  pill: 'rounded-full',
  square: 'rounded-none'
};

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  shape = 'rounded',
  fullWidth = false,
  loading = false,
  disabled = false,
  leftIcon = null,
  rightIcon = null,
  loadingText = 'Loading...',
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const { currentTheme } = useTheme();
  const componentTheme = useComponentTheme('button');
  
  // Determine if button should be disabled
  const isDisabled = disabled || loading;
  
  // Get size configuration
  const sizeConfig = sizeVariants[size] || sizeVariants.md;
  
  // Get style configuration
  const styleConfig = styleVariants[variant] || styleVariants.primary;
  
  // Get shape configuration
  const shapeConfig = shapeVariants[shape] || shapeVariants.rounded;
  
  // Build className
  const buttonClasses = cn(
    // Base button styles
    'inline-flex items-center justify-center font-medium transition-all duration-200 border',
    'focus:outline-none focus:ring-offset-2',
    
    // Size styles
    sizeConfig.padding,
    sizeConfig.fontSize,
    sizeConfig.height,
    !fullWidth && sizeConfig.minWidth,
    
    // Shape styles
    shapeConfig,
    
    // Variant styles
    styleConfig.base,
    !isDisabled && styleConfig.hover,
    !isDisabled && styleConfig.active,
    styleConfig.focus,
    isDisabled && styleConfig.disabled,
    
    // Width styles
    fullWidth && 'w-full',
    
    // Loading state
    loading && 'relative',
    
    // Custom className
    className
  );
  
  // Handle click events
  const handleClick = (event) => {
    if (isDisabled) {
      event.preventDefault();
      return;
    }
    
    onClick?.(event);
  };
  
  // Render icon with proper spacing
  const renderIcon = (icon, position) => {
    if (!icon) return null;
    
    const iconClasses = cn(
      'flex-shrink-0',
      position === 'left' && children && 'mr-2',
      position === 'right' && children && 'ml-2'
    );
    
    if (typeof icon === 'string') {
      return <span className={iconClasses}>{icon}</span>;
    }
    
    return <span className={iconClasses}>{icon}</span>;
  };
  
  // Loading spinner component
  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-4 w-4 mr-2"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
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
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={isDisabled}
      onClick={handleClick}
      aria-disabled={isDisabled}
      data-loading={loading}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      {loading ? (
        <>
          <LoadingSpinner />
          {loadingText}
        </>
      ) : (
        <>
          {renderIcon(leftIcon, 'left')}
          {children}
          {renderIcon(rightIcon, 'right')}
        </>
      )}
    </button>
  );
});

Button.displayName = 'Button';

// Button group component for related actions
export const ButtonGroup = ({
  children,
  size = 'md',
  variant = 'secondary',
  orientation = 'horizontal',
  attached = false,
  className = '',
  ...props
}) => {
  const groupClasses = cn(
    'inline-flex',
    orientation === 'horizontal' ? 'flex-row' : 'flex-col',
    attached && orientation === 'horizontal' && '[&>button]:rounded-none [&>button:first-child]:rounded-l-md [&>button:last-child]:rounded-r-md [&>button:not(:last-child)]:border-r-0',
    attached && orientation === 'vertical' && '[&>button]:rounded-none [&>button:first-child]:rounded-t-md [&>button:last-child]:rounded-b-md [&>button:not(:last-child)]:border-b-0',
    !attached && orientation === 'horizontal' && 'space-x-2',
    !attached && orientation === 'vertical' && 'space-y-2',
    className
  );
  
  return (
    <div className={groupClasses} role="group" {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child) && child.type === Button) {
          return React.cloneElement(child, {
            size: child.props.size || size,
            variant: child.props.variant || variant
          });
        }
        return child;
      })}
    </div>
  );
};

// Icon button variant for actions with only icons
export const IconButton = forwardRef(({
  icon,
  'aria-label': ariaLabel,
  size = 'md',
  variant = 'ghost',
  shape = 'rounded',
  ...props
}, ref) => {
  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };
  
  return (
    <Button
      ref={ref}
      variant={variant}
      size={size}
      shape={shape}
      aria-label={ariaLabel}
      className="aspect-square"
      {...props}
    >
      {typeof icon === 'string' ? (
        <span className={iconSizes[size]}>{icon}</span>
      ) : (
        <span className={cn('flex items-center justify-center', iconSizes[size])}>
          {icon}
        </span>
      )}
    </Button>
  );
});

IconButton.displayName = 'IconButton';

export default Button;
