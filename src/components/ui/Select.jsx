/**
 * Select/Dropdown Component
 * Professional select component with search, multi-select, and custom rendering
 */

import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { motion, AnimatePresence } from 'framer-motion';
import { tokens } from '../../styles/tokens';

export const Select = ({
  label = '',
  placeholder = 'Select an option...',
  options = [],
  value = null,
  defaultValue = null,
  multiple = false,
  searchable = false,
  clearable = false,
  disabled = false,
  required = false,
  loading = false,
  error = '',
  success = '',
  helperText = '',
  size = 'md',
  fullWidth = false,
  maxHeight = '200px',
  noOptionsMessage = 'No options found',
  renderOption = null,
  renderValue = null,
  onChange,
  onFocus,
  onBlur,
  className = '',
  id,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [selectedValue, setSelectedValue] = useState(value || defaultValue || (multiple ? [] : null));

  const selectRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  // Filter options based on search query
  const filteredOptions = options.filter(option => {
    if (!searchQuery) return true;
    const searchText = typeof option === 'object' ? option.label : option;
    return searchText.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Handle option selection
  const handleSelectOption = (option) => {
    let newValue;
    
    if (multiple) {
      const optionValue = typeof option === 'object' ? option.value : option;
      const currentValues = selectedValue || [];
      
      if (currentValues.includes(optionValue)) {
        newValue = currentValues.filter(v => v !== optionValue);
      } else {
        newValue = [...currentValues, optionValue];
      }
    } else {
      newValue = typeof option === 'object' ? option.value : option;
      setIsOpen(false);
    }
    
    setSelectedValue(newValue);
    onChange?.(newValue);
    setSearchQuery('');
    setFocusedIndex(-1);
  };

  // Handle clear selection
  const handleClear = (e) => {
    e.stopPropagation();
    const newValue = multiple ? [] : null;
    setSelectedValue(newValue);
    onChange?.(newValue);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex(prev => 
            prev < filteredOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex(prev => 
            prev > 0 ? prev - 1 : filteredOptions.length - 1
          );
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelectOption(filteredOptions[focusedIndex]);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setFocusedIndex(-1);
        selectRef.current?.blur();
        break;
      case 'Tab':
        setIsOpen(false);
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  // Render selected value(s)
  const renderSelectedValue = () => {
    if (multiple) {
      const values = selectedValue || [];
      if (values.length === 0) return placeholder;
      
      if (renderValue) return renderValue(values);
      
      return values.length === 1 
        ? `${values.length} item selected`
        : `${values.length} items selected`;
    }
    
    if (!selectedValue) return placeholder;
    
    if (renderValue) return renderValue(selectedValue);
    
    const selected = options.find(opt => 
      (typeof opt === 'object' ? opt.value : opt) === selectedValue
    );
    
    return typeof selected === 'object' ? selected.label : selected;
  };

  // Size styles
  const sizeStyles = {
    sm: 'h-8 px-3 text-sm',
    md: 'h-10 px-4 text-base',
    lg: 'h-12 px-5 text-lg'
  };

  // State styles
  const getStateStyles = () => {
    if (error) return 'border-error-300 focus:border-error-500 focus:ring-error-500/20';
    if (success) return 'border-success-300 focus:border-success-500 focus:ring-success-500/20';
    return 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20';
  };

  // Dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, y: -5, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -5, scale: 0.95 }
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : 'w-auto'}`} ref={selectRef}>
      {/* Label */}
      {label && (
        <label className={`block text-sm font-medium mb-1 ${
          error ? 'text-error-700' : success ? 'text-success-700' : 'text-gray-700'
        }`}>
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}

      {/* Select trigger */}
      <div
        className={`
          relative flex items-center justify-between cursor-pointer
          border rounded-md transition-all duration-200
          ${sizeStyles[size]} ${getStateStyles()}
          ${disabled ? 'bg-gray-100 cursor-not-allowed opacity-50' : 'bg-white hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-opacity-50' : ''}
          ${className}
        `}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? `${id}-label` : undefined}
        {...props}
      >
        {/* Selected value display */}
        <div className="flex-1 flex items-center min-w-0">
          <span className={`truncate ${
            selectedValue ? 'text-gray-900' : 'text-gray-500'
          }`}>
            {renderSelectedValue()}
          </span>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-1">
          {/* Loading spinner */}
          {loading && (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-gray-300 border-t-primary-500 rounded-full"
            />
          )}

          {/* Clear button */}
          {clearable && selectedValue && !loading && (
            <button
              onClick={handleClear}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              tabIndex={-1}
            >
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {/* Dropdown arrow */}
          <motion.svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </motion.svg>
        </div>
      </div>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg"
            style={{ maxHeight }}
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-gray-100">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search options..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                />
              </div>
            )}

            {/* Options list */}
            <div
              ref={listRef}
              className="max-h-48 overflow-auto"
              role="listbox"
              aria-multiselectable={multiple}
            >
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500 text-center">
                  {noOptionsMessage}
                </div>
              ) : (
                filteredOptions.map((option, index) => {
                  const optionValue = typeof option === 'object' ? option.value : option;
                  const optionLabel = typeof option === 'object' ? option.label : option;
                  const isSelected = multiple 
                    ? (selectedValue || []).includes(optionValue)
                    : selectedValue === optionValue;
                  const isFocused = index === focusedIndex;

                  return (
                    <motion.div
                      key={optionValue}
                      className={`
                        px-3 py-2 cursor-pointer flex items-center justify-between
                        ${isFocused ? 'bg-gray-100' : ''}
                        ${isSelected ? 'bg-primary-50 text-primary-700' : 'text-gray-900'}
                        hover:bg-gray-50 transition-colors
                      `}
                      onClick={() => handleSelectOption(option)}
                      role="option"
                      aria-selected={isSelected}
                      whileHover={{ backgroundColor: isSelected ? undefined : '#f9fafb' }}
                    >
                      <span className="flex-1">
                        {renderOption ? renderOption(option, { isSelected, isFocused }) : optionLabel}
                      </span>
                      
                      {/* Selection indicator */}
                      {isSelected && (
                        <motion.svg
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 text-primary-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </motion.svg>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Helper text */}
      <AnimatePresence mode="wait">
        {(error || success || helperText) && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className={`mt-1 text-sm ${
              error ? 'text-error-600' : success ? 'text-success-600' : 'text-gray-500'
            }`}
          >
            {error || success || helperText}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

Select.propTypes = {
  label: PropTypes.string,
  placeholder: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
      })
    ])
  ).isRequired,
  value: PropTypes.any,
  defaultValue: PropTypes.any,
  multiple: PropTypes.bool,
  searchable: PropTypes.bool,
  clearable: PropTypes.bool,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  loading: PropTypes.bool,
  error: PropTypes.string,
  success: PropTypes.string,
  helperText: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  fullWidth: PropTypes.bool,
  maxHeight: PropTypes.string,
  noOptionsMessage: PropTypes.string,
  renderOption: PropTypes.func,
  renderValue: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default Select;
