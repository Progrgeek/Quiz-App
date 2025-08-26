import { useEffect, useCallback, useRef, useState } from 'react';

/**
 * Memory Management System for React Applications
 * Provides utilities for preventing memory leaks and monitoring memory usage
 */
export class MemoryManager {
  static cleanupHandlers = new Set();
  static memoryMonitorInterval = null;
  static memoryLog = [];
  static maxMemoryLogSize = 100;

  /**
   * Register a cleanup function to be called during app shutdown
   * @param {Function} cleanupFn - Cleanup function to register
   * @returns {Function} Unregister function
   */
  static registerCleanup(cleanupFn) {
    this.cleanupHandlers.add(cleanupFn);
    
    return () => {
      this.cleanupHandlers.delete(cleanupFn);
    };
  }

  /**
   * Execute all registered cleanup functions
   */
  static cleanup() {
    this.cleanupHandlers.forEach(handler => {
      try {
        handler();
      } catch (error) {
        console.warn('Cleanup handler failed:', error);
      }
    });
    this.cleanupHandlers.clear();
  }

  /**
   * Get current memory usage if available
   * @returns {Object|null} Memory usage information
   */
  static monitorMemoryUsage() {
    if (performance.memory) {
      const usage = {
        used: performance.memory.usedJSHeapSize,
        total: performance.memory.totalJSHeapSize,
        limit: performance.memory.jsHeapSizeLimit,
        timestamp: Date.now()
      };

      // Add to memory log
      this.memoryLog.push(usage);
      if (this.memoryLog.length > this.maxMemoryLogSize) {
        this.memoryLog.shift();
      }

      return usage;
    }
    return null;
  }

  /**
   * Start continuous memory monitoring
   * @param {number} interval - Monitoring interval in milliseconds (default: 5000)
   */
  static startMemoryMonitoring(interval = 5000) {
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
    }

    this.memoryMonitorInterval = setInterval(() => {
      const usage = this.monitorMemoryUsage();
      if (usage) {
        this.checkMemoryThresholds(usage);
      }
    }, interval);
  }

  /**
   * Stop memory monitoring
   */
  static stopMemoryMonitoring() {
    if (this.memoryMonitorInterval) {
      clearInterval(this.memoryMonitorInterval);
      this.memoryMonitorInterval = null;
    }
  }

  /**
   * Check if memory usage exceeds warning thresholds
   * @param {Object} usage - Current memory usage
   */
  static checkMemoryThresholds(usage) {
    const usagePercentage = (usage.used / usage.limit) * 100;
    
    if (usagePercentage > 80) {
      console.warn('High memory usage detected:', {
        percentage: `${usagePercentage.toFixed(1)}%`,
        used: this.formatBytes(usage.used),
        limit: this.formatBytes(usage.limit)
      });
      
      // Trigger garbage collection hint if available
      if (window.gc) {
        console.log('Suggesting garbage collection...');
        window.gc();
      }
    }
  }

  /**
   * Get memory usage statistics
   * @returns {Object} Memory statistics
   */
  static getMemoryStats() {
    if (this.memoryLog.length === 0) {
      return null;
    }

    const recent = this.memoryLog.slice(-10);
    const used = recent.map(entry => entry.used);
    
    return {
      current: recent[recent.length - 1],
      average: used.reduce((a, b) => a + b, 0) / used.length,
      peak: Math.max(...used),
      trend: used.length > 1 ? used[used.length - 1] - used[0] : 0,
      samples: recent.length
    };
  }

  /**
   * Format bytes for human readable output
   * @param {number} bytes - Bytes to format
   * @returns {string} Formatted string
   */
  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Clear memory log
   */
  static clearMemoryLog() {
    this.memoryLog = [];
  }
}

/**
 * Hook for automatic memory cleanup in React components
 * @param {Function} cleanupFn - Cleanup function to register
 */
export const useMemoryCleanup = (cleanupFn) => {
  useEffect(() => {
    if (typeof cleanupFn !== 'function') {
      return;
    }

    const unregister = MemoryManager.registerCleanup(cleanupFn);
    return unregister;
  }, [cleanupFn]);
};

/**
 * Hook for managing event listeners with automatic cleanup
 * @param {string} eventType - Event type to listen for
 * @param {Function} handler - Event handler function
 * @param {Element|Window} target - Target element (default: window)
 * @param {Object} options - Event listener options
 */
export const useEventListener = (eventType, handler, target = window, options = {}) => {
  const savedHandler = useRef();

  // Update ref with latest handler
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    // Make sure element supports addEventListener
    const isSupported = target && target.addEventListener;
    if (!isSupported) return;

    // Create event listener that calls handler function stored in ref
    const eventListener = (event) => savedHandler.current(event);

    // Add event listener
    target.addEventListener(eventType, eventListener, options);

    // Remove event listener on cleanup
    return () => {
      target.removeEventListener(eventType, eventListener, options);
    };
  }, [eventType, target, options]);
};

/**
 * Hook for managing timers with automatic cleanup
 * @param {Function} callback - Callback function to execute
 * @param {number} delay - Delay in milliseconds
 * @param {boolean} immediate - Whether to execute immediately
 */
export const useInterval = (callback, delay, immediate = false) => {
  const savedCallback = useRef();
  const intervalRef = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval
  useEffect(() => {
    const tick = () => savedCallback.current();

    if (immediate) {
      tick();
    }

    if (delay !== null) {
      intervalRef.current = setInterval(tick, delay);
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [delay, immediate]);

  // Return function to clear interval manually
  return useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);
};

/**
 * Hook for managing async operations with cleanup
 * @param {Function} asyncFn - Async function to execute
 * @param {Array} deps - Dependency array
 * @returns {Object} State object with loading, data, error
 */
export const useAsyncEffect = (asyncFn, deps = []) => {
  const [state, setState] = useState({
    loading: true,
    data: null,
    error: null
  });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    setState({ loading: true, data: null, error: null });

    const executeAsync = async () => {
      try {
        const result = await asyncFn();
        if (isMountedRef.current) {
          setState({ loading: false, data: result, error: null });
        }
      } catch (error) {
        if (isMountedRef.current) {
          setState({ loading: false, data: null, error });
        }
      }
    };

    executeAsync();

    return () => {
      isMountedRef.current = false;
    };
  }, deps);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return state;
};

/**
 * Hook for debouncing values with cleanup
 * @param {any} value - Value to debounce
 * @param {number} delay - Debounce delay in milliseconds
 * @returns {any} Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default MemoryManager;
