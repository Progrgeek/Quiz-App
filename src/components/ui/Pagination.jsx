/**
 * Pagination Component
 * A comprehensive pagination component with various display modes and navigation options
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { tokens } from '../../styles/tokens';

// Default icons
const ChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DoubleChevronLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 18L5 12L11 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 18L13 12L19 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const DoubleChevronRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 6L19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 6L11 12L5 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const MoreHorizontalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="1" fill="currentColor"/>
    <circle cx="19" cy="12" r="1" fill="currentColor"/>
    <circle cx="5" cy="12" r="1" fill="currentColor"/>
  </svg>
);

// Individual Pagination Button
const PaginationButton = ({
  children,
  onClick,
  disabled = false,
  active = false,
  variant = 'default',
  size = 'md',
  className = '',
  ...props
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-8 h-8 text-sm';
      case 'lg':
        return 'w-12 h-12 text-lg';
      default:
        return 'w-10 h-10 text-base';
    }
  };

  const getVariantClasses = () => {
    if (disabled) {
      return 'text-gray-400 cursor-not-allowed bg-gray-50';
    }

    if (active) {
      switch (variant) {
        case 'outline':
          return 'bg-blue-50 border-blue-500 text-blue-600';
        case 'ghost':
          return 'bg-blue-100 text-blue-600';
        default:
          return 'bg-blue-500 text-white';
      }
    }

    switch (variant) {
      case 'outline':
        return 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50';
      case 'ghost':
        return 'text-gray-700 hover:bg-gray-100';
      default:
        return 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50';
    }
  };

  const classes = `
    inline-flex items-center justify-center
    ${getSizeClasses()}
    ${getVariantClasses()}
    rounded transition-all duration-200
    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
    ${className}
  `;

  return (
    <motion.button
      type="button"
      className={classes.trim()}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30,
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

// Generate page numbers with ellipsis
const generatePageNumbers = (currentPage, totalPages, siblingCount = 1) => {
  const totalPageNumbers = siblingCount + 5; // 2 * siblingCount + 3 (first, last, current)

  if (totalPages <= totalPageNumbers) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
  const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

  const shouldShowLeftEllipsis = leftSiblingIndex > 2;
  const shouldShowRightEllipsis = rightSiblingIndex < totalPages - 2;

  const firstPageIndex = 1;
  const lastPageIndex = totalPages;

  if (!shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const leftItemCount = 3 + 2 * siblingCount;
    const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
    return [...leftRange, 'ellipsis', totalPages];
  }

  if (shouldShowLeftEllipsis && !shouldShowRightEllipsis) {
    const rightItemCount = 3 + 2 * siblingCount;
    const rightRange = Array.from(
      { length: rightItemCount },
      (_, i) => totalPages - rightItemCount + i + 1
    );
    return [firstPageIndex, 'ellipsis', ...rightRange];
  }

  if (shouldShowLeftEllipsis && shouldShowRightEllipsis) {
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [firstPageIndex, 'ellipsis', ...middleRange, 'ellipsis', lastPageIndex];
  }

  return [];
};

// Main Pagination Component
export const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  siblingCount = 1,
  showFirstLast = true,
  showPrevNext = true,
  showPageInfo = false,
  variant = 'default',
  size = 'md',
  disabled = false,
  className = '',
  ...props
}) => {
  const pageNumbers = useMemo(
    () => generatePageNumbers(currentPage, totalPages, siblingCount),
    [currentPage, totalPages, siblingCount]
  );

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePageChange = (page) => {
    if (page !== currentPage && page >= 1 && page <= totalPages && !disabled) {
      onPageChange?.(page);
    }
  };

  const handleFirstPage = () => handlePageChange(1);
  const handleLastPage = () => handlePageChange(totalPages);
  const handlePreviousPage = () => handlePageChange(currentPage - 1);
  const handleNextPage = () => handlePageChange(currentPage + 1);

  if (totalPages <= 1) {
    return null;
  }

  const classes = `
    flex items-center justify-center gap-1
    ${className}
  `;

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={classes.trim()}
      {...props}
    >
      <div className="flex items-center gap-1">
        {/* First page button */}
        {showFirstLast && (
          <PaginationButton
            onClick={handleFirstPage}
            disabled={!canGoPrevious || disabled}
            variant={variant}
            size={size}
            aria-label="Go to first page"
          >
            <DoubleChevronLeftIcon />
          </PaginationButton>
        )}

        {/* Previous page button */}
        {showPrevNext && (
          <PaginationButton
            onClick={handlePreviousPage}
            disabled={!canGoPrevious || disabled}
            variant={variant}
            size={size}
            aria-label="Go to previous page"
          >
            <ChevronLeftIcon />
          </PaginationButton>
        )}

        {/* Page numbers */}
        {pageNumbers.map((pageNumber, index) => {
          if (pageNumber === 'ellipsis') {
            return (
              <div
                key={`ellipsis-${index}`}
                className="flex items-center justify-center w-10 h-10 text-gray-400"
              >
                <MoreHorizontalIcon />
              </div>
            );
          }

          return (
            <PaginationButton
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              active={pageNumber === currentPage}
              disabled={disabled}
              variant={variant}
              size={size}
              aria-label={`Go to page ${pageNumber}`}
              aria-current={pageNumber === currentPage ? 'page' : undefined}
            >
              {pageNumber}
            </PaginationButton>
          );
        })}

        {/* Next page button */}
        {showPrevNext && (
          <PaginationButton
            onClick={handleNextPage}
            disabled={!canGoNext || disabled}
            variant={variant}
            size={size}
            aria-label="Go to next page"
          >
            <ChevronRightIcon />
          </PaginationButton>
        )}

        {/* Last page button */}
        {showFirstLast && (
          <PaginationButton
            onClick={handleLastPage}
            disabled={!canGoNext || disabled}
            variant={variant}
            size={size}
            aria-label="Go to last page"
          >
            <DoubleChevronRightIcon />
          </PaginationButton>
        )}
      </div>

      {/* Page info */}
      {showPageInfo && (
        <div className="ml-4 text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      )}
    </nav>
  );
};

// Simple Pagination with just Prev/Next
export const SimplePagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  variant = 'default',
  size = 'md',
  disabled = false,
  showPageInfo = true,
  className = '',
  ...props
}) => {
  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  const handlePreviousPage = () => {
    if (canGoPrevious && !disabled) {
      onPageChange?.(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (canGoNext && !disabled) {
      onPageChange?.(currentPage + 1);
    }
  };

  const classes = `
    flex items-center justify-between
    ${className}
  `;

  return (
    <nav
      role="navigation"
      aria-label="Simple pagination"
      className={classes.trim()}
      {...props}
    >
      <PaginationButton
        onClick={handlePreviousPage}
        disabled={!canGoPrevious || disabled}
        variant={variant}
        size={size}
        className="flex items-center gap-2 px-4"
      >
        <ChevronLeftIcon />
        Previous
      </PaginationButton>

      {showPageInfo && (
        <div className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </div>
      )}

      <PaginationButton
        onClick={handleNextPage}
        disabled={!canGoNext || disabled}
        variant={variant}
        size={size}
        className="flex items-center gap-2 px-4"
      >
        Next
        <ChevronRightIcon />
      </PaginationButton>
    </nav>
  );
};

// PropTypes
Pagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  siblingCount: PropTypes.number,
  showFirstLast: PropTypes.bool,
  showPrevNext: PropTypes.bool,
  showPageInfo: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};

SimplePagination.propTypes = {
  currentPage: PropTypes.number,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  showPageInfo: PropTypes.bool,
  className: PropTypes.string,
};

PaginationButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  active: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'outline', 'ghost']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Pagination;
