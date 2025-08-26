import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import MemoryManager from './MemoryManager';

/**
 * Performance Monitoring Context
 */
const PerformanceContext = createContext();

/**
 * Performance metrics collection and monitoring system
 * Tracks render times, user interactions, and system performance
 */
export const PerformanceProvider = ({ children }) => {
  const [metrics, setMetrics] = useState({
    renderTimes: [],
    interactionTimes: [],
    memoryUsage: [],
    navigationTimes: [],
    errorCount: 0,
    sessionStart: Date.now()
  });

  const [isMonitoring, setIsMonitoring] = useState(false);
  const performanceObserver = useRef(null);

  /**
   * Record component render time
   * @param {string} componentName - Name of the component
   * @param {number} duration - Render duration in milliseconds
   */
  const recordRenderTime = useCallback((componentName, duration) => {
    setMetrics(prev => ({
      ...prev,
      renderTimes: [
        ...prev.renderTimes.slice(-99), // Keep last 100 entries
        { 
          componentName, 
          duration, 
          timestamp: Date.now(),
          sessionTime: Date.now() - prev.sessionStart
        }
      ]
    }));
  }, []);

  /**
   * Record user interaction performance
   * @param {string} action - Type of interaction (click, input, etc.)
   * @param {number} duration - Interaction response time in milliseconds
   * @param {Object} details - Additional interaction details
   */
  const recordInteraction = useCallback((action, duration, details = {}) => {
    setMetrics(prev => ({
      ...prev,
      interactionTimes: [
        ...prev.interactionTimes.slice(-99),
        { 
          action, 
          duration, 
          details,
          timestamp: Date.now(),
          sessionTime: Date.now() - prev.sessionStart
        }
      ]
    }));
  }, []);

  /**
   * Record navigation timing
   * @param {string} route - Route navigated to
   * @param {number} duration - Navigation duration
   */
  const recordNavigation = useCallback((route, duration) => {
    setMetrics(prev => ({
      ...prev,
      navigationTimes: [
        ...prev.navigationTimes.slice(-49),
        {
          route,
          duration,
          timestamp: Date.now(),
          sessionTime: Date.now() - prev.sessionStart
        }
      ]
    }));
  }, []);

  /**
   * Record memory usage snapshot
   */
  const recordMemoryUsage = useCallback(() => {
    const memoryInfo = MemoryManager.monitorMemoryUsage();
    if (memoryInfo) {
      setMetrics(prev => ({
        ...prev,
        memoryUsage: [
          ...prev.memoryUsage.slice(-99),
          memoryInfo
        ]
      }));
    }
  }, []);

  /**
   * Increment error count
   * @param {Error} error - Error that occurred
   */
  const recordError = useCallback((error) => {
    console.error('Performance Monitor - Error recorded:', error);
    setMetrics(prev => ({
      ...prev,
      errorCount: prev.errorCount + 1
    }));
  }, []);

  /**
   * Start performance monitoring
   */
  const startMonitoring = useCallback(() => {
    if (isMonitoring) return;

    setIsMonitoring(true);

    // Start memory monitoring
    MemoryManager.startMemoryMonitoring(10000); // Every 10 seconds

    // Set up Performance Observer for measuring performance
    if (typeof PerformanceObserver !== 'undefined') {
      performanceObserver.current = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure') {
            recordRenderTime(entry.name, entry.duration);
          } else if (entry.entryType === 'navigation') {
            recordNavigation(window.location.pathname, entry.duration);
          }
        });
      });

      try {
        performanceObserver.current.observe({ 
          entryTypes: ['measure', 'navigation', 'paint'] 
        });
      } catch (error) {
        console.warn('Performance Observer not fully supported:', error);
      }
    }

    // Set up periodic memory recording
    const memoryInterval = setInterval(recordMemoryUsage, 30000); // Every 30 seconds

    // Cleanup function
    return () => {
      setIsMonitoring(false);
      MemoryManager.stopMemoryMonitoring();
      
      if (performanceObserver.current) {
        performanceObserver.current.disconnect();
      }
      
      clearInterval(memoryInterval);
    };
  }, [isMonitoring, recordRenderTime, recordNavigation, recordMemoryUsage]);

  /**
   * Stop performance monitoring
   */
  const stopMonitoring = useCallback(() => {
    setIsMonitoring(false);
    MemoryManager.stopMemoryMonitoring();
    
    if (performanceObserver.current) {
      performanceObserver.current.disconnect();
      performanceObserver.current = null;
    }
  }, []);

  /**
   * Get performance summary
   * @returns {Object} Performance summary statistics
   */
  const getPerformanceSummary = useCallback(() => {
    const { renderTimes, interactionTimes, memoryUsage, navigationTimes } = metrics;

    // Render time statistics
    const renderDurations = renderTimes.map(r => r.duration);
    const avgRenderTime = renderDurations.length > 0 
      ? renderDurations.reduce((a, b) => a + b, 0) / renderDurations.length 
      : 0;

    // Interaction time statistics
    const interactionDurations = interactionTimes.map(i => i.duration);
    const avgInteractionTime = interactionDurations.length > 0
      ? interactionDurations.reduce((a, b) => a + b, 0) / interactionDurations.length
      : 0;

    // Memory statistics
    const memoryStats = MemoryManager.getMemoryStats();

    // Navigation statistics
    const navDurations = navigationTimes.map(n => n.duration);
    const avgNavigationTime = navDurations.length > 0
      ? navDurations.reduce((a, b) => a + b, 0) / navDurations.length
      : 0;

    return {
      renders: {
        count: renderTimes.length,
        averageTime: Math.round(avgRenderTime * 100) / 100,
        slowest: renderDurations.length > 0 ? Math.max(...renderDurations) : 0
      },
      interactions: {
        count: interactionTimes.length,
        averageTime: Math.round(avgInteractionTime * 100) / 100,
        slowest: interactionDurations.length > 0 ? Math.max(...interactionDurations) : 0
      },
      navigation: {
        count: navigationTimes.length,
        averageTime: Math.round(avgNavigationTime * 100) / 100
      },
      memory: memoryStats,
      errors: metrics.errorCount,
      sessionDuration: Date.now() - metrics.sessionStart
    };
  }, [metrics]);

  /**
   * Clear all performance data
   */
  const clearMetrics = useCallback(() => {
    setMetrics({
      renderTimes: [],
      interactionTimes: [],
      memoryUsage: [],
      navigationTimes: [],
      errorCount: 0,
      sessionStart: Date.now()
    });
    MemoryManager.clearMemoryLog();
  }, []);

  /**
   * Export performance data for analysis
   * @returns {Object} Complete performance data export
   */
  const exportData = useCallback(() => {
    return {
      ...metrics,
      summary: getPerformanceSummary(),
      exportTime: Date.now()
    };
  }, [metrics, getPerformanceSummary]);

  // Auto-start monitoring on mount
  useEffect(() => {
    const cleanup = startMonitoring();
    return cleanup;
  }, [startMonitoring]);

  const value = {
    metrics,
    isMonitoring,
    recordRenderTime,
    recordInteraction,
    recordNavigation,
    recordMemoryUsage,
    recordError,
    startMonitoring,
    stopMonitoring,
    getPerformanceSummary,
    clearMetrics,
    exportData
  };

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  );
};

/**
 * Hook to access performance monitoring context
 * @returns {Object} Performance monitoring utilities
 */
export const usePerformance = () => {
  const context = useContext(PerformanceContext);
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider');
  }
  return context;
};

/**
 * Higher-order component for automatic render time tracking
 * @param {React.Component} WrappedComponent - Component to wrap
 * @param {string} componentName - Name for tracking (optional)
 * @returns {React.Component} Wrapped component with performance tracking
 */
export const withPerformanceTracking = (WrappedComponent, componentName) => {
  const displayName = componentName || WrappedComponent.displayName || WrappedComponent.name || 'Component';
  
  const PerformanceTrackedComponent = (props) => {
    const { recordRenderTime } = usePerformance();
    const renderStartTime = useRef();

    useEffect(() => {
      renderStartTime.current = performance.now();
    });

    useEffect(() => {
      if (renderStartTime.current) {
        const renderTime = performance.now() - renderStartTime.current;
        recordRenderTime(displayName, renderTime);
      }
    });

    return <WrappedComponent {...props} />;
  };

  PerformanceTrackedComponent.displayName = `withPerformanceTracking(${displayName})`;
  return PerformanceTrackedComponent;
};

/**
 * Hook for tracking component render performance
 * @param {string} componentName - Name of the component being tracked
 */
export const useRenderTracking = (componentName) => {
  const { recordRenderTime } = usePerformance();
  const renderStartTime = useRef();

  useEffect(() => {
    renderStartTime.current = performance.now();
  });

  useEffect(() => {
    if (renderStartTime.current) {
      const renderTime = performance.now() - renderStartTime.current;
      recordRenderTime(componentName, renderTime);
    }
  });
};

/**
 * Hook for tracking user interaction performance
 * @returns {Function} Function to measure interaction timing
 */
export const useInteractionTracking = () => {
  const { recordInteraction } = usePerformance();

  return useCallback((action, asyncFn) => {
    const startTime = performance.now();
    
    const measure = () => {
      const duration = performance.now() - startTime;
      recordInteraction(action, duration);
    };

    if (asyncFn) {
      return asyncFn().finally(measure);
    } else {
      return measure;
    }
  }, [recordInteraction]);
};

export default PerformanceProvider;
