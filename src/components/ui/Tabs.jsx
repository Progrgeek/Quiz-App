/**
 * Tabs Component
 * A flexible tabs component with keyboard navigation and multiple variants
 */

import React, { useState, createContext, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../styles/tokens';

// Tabs Context
const TabsContext = createContext({
  activeTab: '',
  setActiveTab: () => {},
  variant: 'default',
  size: 'md',
  orientation: 'horizontal',
});

// Main Tabs Container
export const Tabs = ({
  children,
  defaultValue,
  value: controlledValue,
  onChange,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className = '',
  ...props
}) => {
  const [internalValue, setInternalValue] = useState(defaultValue || '');
  const isControlled = controlledValue !== undefined;
  const activeTab = isControlled ? controlledValue : internalValue;

  const setActiveTab = (value) => {
    if (!isControlled) {
      setInternalValue(value);
    }
    onChange?.(value);
  };

  const contextValue = {
    activeTab,
    setActiveTab,
    variant,
    size,
    orientation,
  };

  const baseClasses = `
    tabs
    ${orientation === 'vertical' ? 'flex' : 'block'}
    ${className}
  `;

  return (
    <TabsContext.Provider value={contextValue}>
      <div className={baseClasses.trim()} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

// Tabs List (Container for tab buttons)
export const TabsList = ({
  children,
  className = '',
  ...props
}) => {
  const { variant, size, orientation } = useContext(TabsContext);
  const listRef = useRef(null);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!listRef.current) return;

    const tabs = Array.from(listRef.current.querySelectorAll('[role="tab"]:not([disabled])'));
    const currentIndex = tabs.findIndex(tab => tab === e.target);

    let nextIndex = currentIndex;

    switch (e.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        e.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        e.preventDefault();
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        e.preventDefault();
        nextIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        nextIndex = tabs.length - 1;
        break;
      default:
        return;
    }

    tabs[nextIndex]?.focus();
    tabs[nextIndex]?.click();
  };

  const getVariantClasses = () => {
    const baseClasses = 'inline-flex items-center';
    
    switch (variant) {
      case 'pills':
        return `${baseClasses} p-1 bg-gray-100 rounded-lg`;
      case 'underline':
        return `${baseClasses} border-b border-gray-200`;
      case 'card':
        return `${baseClasses} border-b border-gray-200 bg-gray-50`;
      default:
        return `${baseClasses} border-b border-gray-200`;
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'gap-1';
      case 'lg':
        return 'gap-4';
      default:
        return 'gap-2';
    }
  };

  const orientationClasses = orientation === 'vertical' 
    ? 'flex-col items-start' 
    : 'flex-row';

  const classes = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${orientationClasses}
    ${className}
  `;

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-orientation={orientation}
      className={classes.trim()}
      onKeyDown={handleKeyDown}
      {...props}
    >
      {children}
    </div>
  );
};

// Individual Tab Button
export const TabsTrigger = ({
  children,
  value,
  disabled = false,
  icon,
  className = '',
  ...props
}) => {
  const { activeTab, setActiveTab, variant, size } = useContext(TabsContext);
  const isActive = activeTab === value;

  const handleClick = () => {
    if (!disabled) {
      setActiveTab(value);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-1.5 text-sm';
      case 'lg':
        return 'px-6 py-3 text-lg';
      default:
        return 'px-4 py-2 text-base';
    }
  };

  const getVariantClasses = () => {
    const baseClasses = `
      relative inline-flex items-center justify-center
      font-medium transition-all duration-200
      focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    switch (variant) {
      case 'pills':
        return `${baseClasses} rounded-md ${
          isActive 
            ? 'bg-white text-blue-600 shadow-sm' 
            : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
        }`;
      case 'underline':
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`;
      case 'card':
        return `${baseClasses} border-t-2 bg-white ${
          isActive 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900'
        }`;
      default:
        return `${baseClasses} border-b-2 ${
          isActive 
            ? 'border-blue-500 text-blue-600' 
            : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
        }`;
    }
  };

  const classes = `
    ${getVariantClasses()}
    ${getSizeClasses()}
    ${className}
  `;

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      aria-controls={`tabpanel-${value}`}
      id={`tab-${value}`}
      tabIndex={isActive ? 0 : -1}
      disabled={disabled}
      className={classes.trim()}
      onClick={handleClick}
      {...props}
    >
      <motion.div
        className="flex items-center gap-2"
        initial={false}
        animate={{
          scale: isActive ? 1.02 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      >
        {icon && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        {children}
      </motion.div>

      {/* Active indicator for underline variant */}
      {variant === 'underline' && isActive && (
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
          layoutId="activeTab"
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 30,
          }}
        />
      )}
    </button>
  );
};

// Tab Content Panel
export const TabsContent = ({
  children,
  value,
  className = '',
  ...props
}) => {
  const { activeTab } = useContext(TabsContext);
  const isActive = activeTab === value;

  if (!isActive) return null;

  const classes = `
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    ${className}
  `;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={value}
        role="tabpanel"
        id={`tabpanel-${value}`}
        aria-labelledby={`tab-${value}`}
        tabIndex={0}
        className={classes.trim()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// PropTypes
Tabs.propTypes = {
  children: PropTypes.node.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'pills', 'underline', 'card']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
};

TabsList.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

TabsTrigger.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

TabsContent.propTypes = {
  children: PropTypes.node.isRequired,
  value: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default Tabs;
