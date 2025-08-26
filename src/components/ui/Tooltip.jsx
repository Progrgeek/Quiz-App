/**
 * Tooltip Component
 * Accessible tooltip with positioning and animation
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export const Tooltip = ({
  children,
  content,
  placement = 'top',
  trigger = 'hover',
  delay = 0,
  offset = 8,
  arrow = true,
  disabled = false,
  className = '',
  contentClassName = '',
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const timeoutRef = useRef(null);

  // Calculate tooltip position
  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    // Calculate position based on placement
    switch (placement) {
      case 'top':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom':
        x = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        y = triggerRect.bottom + offset;
        break;
      case 'left':
        x = triggerRect.left - tooltipRect.width - offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'right':
        x = triggerRect.right + offset;
        y = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        break;
      case 'top-start':
        x = triggerRect.left;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'top-end':
        x = triggerRect.right - tooltipRect.width;
        y = triggerRect.top - tooltipRect.height - offset;
        break;
      case 'bottom-start':
        x = triggerRect.left;
        y = triggerRect.bottom + offset;
        break;
      case 'bottom-end':
        x = triggerRect.right - tooltipRect.width;
        y = triggerRect.bottom + offset;
        break;
    }

    // Keep tooltip within viewport
    x = Math.max(8, Math.min(x, viewport.width - tooltipRect.width - 8));
    y = Math.max(8, Math.min(y, viewport.height - tooltipRect.height - 8));

    setPosition({ x, y });
  };

  // Show tooltip
  const showTooltip = () => {
    if (disabled || !content) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  // Hide tooltip
  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Handle trigger events
  const handleMouseEnter = () => {
    if (trigger === 'hover' || trigger === 'hover-focus') {
      showTooltip();
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover' || trigger === 'hover-focus') {
      hideTooltip();
    }
  };

  const handleFocus = () => {
    if (trigger === 'focus' || trigger === 'hover-focus') {
      showTooltip();
    }
  };

  const handleBlur = () => {
    if (trigger === 'focus' || trigger === 'hover-focus') {
      hideTooltip();
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      if (isVisible) {
        hideTooltip();
      } else {
        showTooltip();
      }
    }
  };

  // Update position when tooltip becomes visible
  useEffect(() => {
    if (isVisible) {
      calculatePosition();
      
      const handleResize = () => calculatePosition();
      const handleScroll = () => calculatePosition();
      
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleScroll);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isVisible, placement, offset]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Arrow position classes
  const arrowClasses = {
    top: 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    bottom: 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    left: 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent border-l-gray-900',
    right: 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent border-r-gray-900',
    'top-start': 'bottom-0 left-4 transform translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    'top-end': 'bottom-0 right-4 transform translate-y-full border-l-transparent border-r-transparent border-b-transparent border-t-gray-900',
    'bottom-start': 'top-0 left-4 transform -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
    'bottom-end': 'top-0 right-4 transform -translate-y-full border-l-transparent border-r-transparent border-t-transparent border-b-gray-900',
  };

  // Animation variants
  const tooltipVariants = {
    initial: {
      opacity: 0,
      scale: 0.95,
      y: placement.includes('top') ? 4 : placement.includes('bottom') ? -4 : 0,
      x: placement.includes('left') ? 4 : placement.includes('right') ? -4 : 0,
    },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      x: 0,
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      y: placement.includes('top') ? 4 : placement.includes('bottom') ? -4 : 0,
      x: placement.includes('left') ? 4 : placement.includes('right') ? -4 : 0,
    },
  };

  if (!content) {
    return children;
  }

  return (
    <>
      {/* Trigger element */}
      <div
        ref={triggerRef}
        className={clsx('inline-block', className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        aria-describedby={isVisible ? 'tooltip' : undefined}
      >
        {children}
      </div>

      {/* Tooltip portal */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            id="tooltip"
            role="tooltip"
            className={clsx(
              'fixed z-tooltip max-w-xs px-2 py-1 text-sm font-medium text-white bg-gray-900 rounded-md shadow-lg pointer-events-none',
              contentClassName
            )}
            style={{
              left: position.x,
              top: position.y,
            }}
            variants={tooltipVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              type: "tween",
              duration: 0.15,
            }}
          >
            {content}
            
            {/* Arrow */}
            {arrow && (
              <div
                className={clsx(
                  'absolute w-0 h-0 border-4',
                  arrowClasses[placement] || arrowClasses.top
                )}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

Tooltip.propTypes = {
  children: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  placement: PropTypes.oneOf([
    'top', 'bottom', 'left', 'right',
    'top-start', 'top-end', 'bottom-start', 'bottom-end'
  ]),
  trigger: PropTypes.oneOf(['hover', 'focus', 'click', 'hover-focus']),
  delay: PropTypes.number,
  offset: PropTypes.number,
  arrow: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
};

export default Tooltip;
