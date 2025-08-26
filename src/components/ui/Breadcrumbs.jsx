/**
 * Breadcrumbs Component
 * Navigation breadcrumbs with customizable separators and responsive behavior
 */

import React from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

// Default icons (can be replaced with actual icon library)
const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SlashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 18L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 9L12 2L21 9V20C21 21.1 20.1 22 19 22H5C3.9 22 3 21.1 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="19" cy="12" r="1" fill="currentColor"/>
    <circle cx="5" cy="12" r="1" fill="currentColor"/>
  </svg>
);

// Individual Breadcrumb Item
const BreadcrumbItem = ({ 
  children, 
  href, 
  onClick, 
  isLast = false, 
  icon,
  className = '',
  ...props 
}) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const baseClasses = `
    inline-flex items-center gap-1 transition-colors duration-200
    ${isLast 
      ? 'text-gray-900 font-medium cursor-default' 
      : 'text-gray-600 hover:text-gray-900 focus:text-gray-900'
    }
    ${href || onClick ? 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded' : ''}
    ${className}
  `;

  const content = (
    <motion.span
      className="flex items-center gap-1"
      whileHover={!isLast ? { scale: 1.02 } : {}}
      whileTap={!isLast ? { scale: 0.98 } : {}}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </motion.span>
  );

  if (href && !isLast) {
    return (
      <a
        href={href}
        onClick={handleClick}
        className={baseClasses}
        aria-current={isLast ? 'page' : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  if (onClick && !isLast) {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={baseClasses}
        aria-current={isLast ? 'page' : undefined}
        {...props}
      >
        {content}
      </button>
    );
  }

  return (
    <span
      className={baseClasses}
      aria-current={isLast ? 'page' : undefined}
      {...props}
    >
      {content}
    </span>
  );
};

// Main Breadcrumbs Component
export const Breadcrumbs = ({
  children,
  separator = 'chevron',
  size = 'md',
  maxItems = null,
  showHome = false,
  homeHref = '/',
  onHomeClick,
  className = '',
  ...props
}) => {
  // Convert children to array and process
  const items = React.Children.toArray(children).filter(Boolean);
  
  // Handle collapsed items when maxItems is set
  const getDisplayItems = () => {
    if (!maxItems || items.length <= maxItems) {
      return items;
    }

    const firstItem = items[0];
    const lastItems = items.slice(-(maxItems - 2));
    
    const collapsedIndicator = (
      <BreadcrumbItem key="collapsed" className="cursor-default">
        <MoreIcon />
      </BreadcrumbItem>
    );

    return [firstItem, collapsedIndicator, ...lastItems];
  };

  const displayItems = getDisplayItems();

  // Get separator icon
  const getSeparatorIcon = () => {
    switch (separator) {
      case 'slash':
        return <SlashIcon />;
      case 'chevron':
      default:
        return <ChevronRightIcon />;
    }
  };

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'text-sm gap-1';
      case 'lg':
        return 'text-lg gap-3';
      default:
        return 'text-base gap-2';
    }
  };

  const classes = `
    flex items-center flex-wrap
    ${getSizeClasses()}
    ${className}
  `;

  return (
    <nav 
      aria-label="Breadcrumb"
      className={classes.trim()}
      {...props}
    >
      <ol className="flex items-center gap-2">
        {/* Home icon if enabled */}
        {showHome && (
          <>
            <li>
              <BreadcrumbItem
                href={homeHref}
                onClick={onHomeClick}
                icon={<HomeIcon />}
                aria-label="Home"
              />
            </li>
            {displayItems.length > 0 && (
              <li className="flex items-center text-gray-400">
                {getSeparatorIcon()}
              </li>
            )}
          </>
        )}

        {/* Regular breadcrumb items */}
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <React.Fragment key={item.key || index}>
              <li>
                {React.cloneElement(item, { isLast })}
              </li>
              {!isLast && (
                <li className="flex items-center text-gray-400">
                  {getSeparatorIcon()}
                </li>
              )}
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

// Export individual item for external use
export { BreadcrumbItem };

// PropTypes
Breadcrumbs.propTypes = {
  children: PropTypes.node.isRequired,
  separator: PropTypes.oneOf(['chevron', 'slash']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  maxItems: PropTypes.number,
  showHome: PropTypes.bool,
  homeHref: PropTypes.string,
  onHomeClick: PropTypes.func,
  className: PropTypes.string,
};

BreadcrumbItem.propTypes = {
  children: PropTypes.node.isRequired,
  href: PropTypes.string,
  onClick: PropTypes.func,
  isLast: PropTypes.bool,
  icon: PropTypes.node,
  className: PropTypes.string,
};

export default Breadcrumbs;
