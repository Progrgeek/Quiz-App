/**
 * Optimized Import Utilities for Tree Shaking
 * Provides selective imports from large libraries to minimize bundle size
 */

import React from 'react';

// ============================================================================
// LODASH OPTIMIZED IMPORTS
// ============================================================================
// Instead of: import _ from 'lodash' (full library ~70KB)
// Use specific functions for tree shaking

// Utility functions (commonly used)
export { debounce } from 'lodash/debounce';     // ~2KB
export { throttle } from 'lodash/throttle';     // ~2KB
export { cloneDeep } from 'lodash/cloneDeep';   // ~3KB
export { merge } from 'lodash/merge';           // ~4KB
export { pick } from 'lodash/pick';             // ~1KB
export { omit } from 'lodash/omit';             // ~2KB
export { uniq } from 'lodash/uniq';             // ~1KB
export { flatten } from 'lodash/flatten';       // ~1KB
export { groupBy } from 'lodash/groupBy';       // ~2KB
export { sortBy } from 'lodash/sortBy';         // ~2KB

// ============================================================================
// HEROICONS OPTIMIZED IMPORTS
// ============================================================================
// Instead of: import * from '@heroicons/react/24/outline' (full icon set ~50KB+)
// Use specific icons for tree shaking

// Common UI icons
export {
  CheckIcon,
  XMarkIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

// Exercise-specific icons
export {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon
} from '@heroicons/react/24/outline';

// Navigation icons
export {
  ArrowLeftIcon,
  ArrowRightIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  HomeIcon,
  Cog6ToothIcon as SettingsIcon
} from '@heroicons/react/24/outline';

// Interactive icons
export {
  HandRaisedIcon,
  CursorArrowRaysIcon,
  EyeIcon,
  EyeSlashIcon,
  LightBulbIcon
} from '@heroicons/react/24/outline';

// ============================================================================
// DATE-FNS OPTIMIZED IMPORTS
// ============================================================================
// Instead of: import * from 'date-fns' (full library ~30KB+)
// Use specific functions for tree shaking

// Date formatting
export { format } from 'date-fns/format';              // ~3KB
export { formatDistanceToNow } from 'date-fns/formatDistanceToNow'; // ~2KB
export { formatRelative } from 'date-fns/formatRelative'; // ~2KB

// Date manipulation
export { addDays } from 'date-fns/addDays';            // ~1KB
export { addHours } from 'date-fns/addHours';          // ~1KB
export { subDays } from 'date-fns/subDays';            // ~1KB
export { startOfDay } from 'date-fns/startOfDay';      // ~1KB
export { endOfDay } from 'date-fns/endOfDay';          // ~1KB

// Date comparison
export { isAfter } from 'date-fns/isAfter';            // ~1KB
export { isBefore } from 'date-fns/isBefore';          // ~1KB
export { isToday } from 'date-fns/isToday';            // ~1KB
export { differenceInDays } from 'date-fns/differenceInDays'; // ~1KB

// ============================================================================
// CUSTOM OPTIMIZED UTILITIES
// ============================================================================

/**
 * Tree-shakeable utility functions
 * Replaces need for larger utility libraries
 */

// Array utilities (replaces lodash for simple cases)
export const arrayUtils = {
  /**
   * Remove duplicates from array
   * @param {Array} arr - Input array
   * @returns {Array} Array with unique values
   */
  unique: (arr) => [...new Set(arr)],

  /**
   * Chunk array into smaller arrays
   * @param {Array} arr - Input array
   * @param {number} size - Chunk size
   * @returns {Array} Array of chunks
   */
  chunk: (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  },

  /**
   * Shuffle array in place
   * @param {Array} arr - Array to shuffle
   * @returns {Array} Shuffled array
   */
  shuffle: (arr) => {
    const result = [...arr];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  },

  /**
   * Find last matching element
   * @param {Array} arr - Input array
   * @param {Function} predicate - Test function
   * @returns {*} Last matching element
   */
  findLast: (arr, predicate) => {
    for (let i = arr.length - 1; i >= 0; i--) {
      if (predicate(arr[i], i, arr)) {
        return arr[i];
      }
    }
    return undefined;
  }
};

// Object utilities (replaces lodash for simple cases)
export const objectUtils = {
  /**
   * Deep clone object (simple version)
   * @param {Object} obj - Object to clone
   * @returns {Object} Cloned object
   */
  deepClone: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime());
    if (obj instanceof Array) return obj.map(item => objectUtils.deepClone(item));
    
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = objectUtils.deepClone(obj[key]);
      }
    }
    return cloned;
  },

  /**
   * Check if object is empty
   * @param {Object} obj - Object to check
   * @returns {boolean} True if empty
   */
  isEmpty: (obj) => {
    if (!obj) return true;
    return Object.keys(obj).length === 0;
  },

  /**
   * Get nested property safely
   * @param {Object} obj - Source object
   * @param {string} path - Dot-separated path
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Property value or default
   */
  get: (obj, path, defaultValue = undefined) => {
    const keys = path.split('.');
    let result = obj;
    
    for (const key of keys) {
      if (result?.[key] === undefined) {
        return defaultValue;
      }
      result = result[key];
    }
    
    return result;
  }
};

// String utilities
export const stringUtils = {
  /**
   * Capitalize first letter
   * @param {string} str - Input string
   * @returns {string} Capitalized string
   */
  capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),

  /**
   * Convert to kebab-case
   * @param {string} str - Input string
   * @returns {string} Kebab-case string
   */
  kebabCase: (str) => str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase(),

  /**
   * Convert to camelCase
   * @param {string} str - Input string
   * @returns {string} CamelCase string
   */
  camelCase: (str) => str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : '')),

  /**
   * Truncate string with ellipsis
   * @param {string} str - Input string
   * @param {number} length - Max length
   * @returns {string} Truncated string
   */
  truncate: (str, length) => 
    str.length > length ? str.slice(0, length - 3) + '...' : str
};

// ============================================================================
// PERFORMANCE OPTIMIZED IMPORTS
// ============================================================================

/**
 * Lazy loading utilities for components
 */
export const lazyUtils = {
  /**
   * Create lazy component with error boundary
   * @param {Function} importFn - Dynamic import function
   * @param {Object} options - Loading options
   * @returns {React.Component} Lazy component
   */
  createLazyComponent: (importFn, options = {}) => {
    const LazyComponent = React.lazy(importFn);
    
    return React.forwardRef((props, ref) => (
      <React.Suspense 
        fallback={options.fallback || <div>Loading...</div>}
      >
        <LazyComponent {...props} ref={ref} />
      </React.Suspense>
    ));
  },

  /**
   * Preload component
   * @param {Function} importFn - Dynamic import function
   */
  preload: (importFn) => {
    // Start loading the component
    importFn();
  }
};

// ============================================================================
// BUNDLE SIZE OPTIMIZATION CONSTANTS
// ============================================================================

export const OPTIMIZATION_CONFIG = {
  // Bundle size targets (in bytes)
  BUNDLE_TARGETS: {
    MAIN: 50000,        // 50KB main bundle
    VENDOR: 200000,     // 200KB vendor bundle
    EXERCISE: 30000,    // 30KB per exercise
    UTILS: 15000        // 15KB utilities
  },

  // Tree shaking guidelines
  TREE_SHAKING: {
    // Prefer named imports over default imports
    PREFER_NAMED: true,
    // Avoid importing entire modules
    AVOID_BARREL_IMPORTS: true,
    // Use webpack comments for dynamic imports
    USE_WEBPACKCHUNKNAME: true
  },

  // Code splitting recommendations
  CODE_SPLITTING: {
    // Split at route level
    ROUTE_LEVEL: true,
    // Split heavy components
    COMPONENT_LEVEL: true,
    // Split third-party libraries
    VENDOR_SPLITTING: true
  }
};

export default {
  arrayUtils,
  objectUtils,
  stringUtils,
  lazyUtils,
  OPTIMIZATION_CONFIG
};
