// utils/ValidationManager.js - Comprehensive validation management system
import { validateExerciseData } from '../schemas/UniversalExerciseSchema';

/**
 * Central validation manager for the Quiz App
 * Provides comprehensive validation services across all exercise types
 */
class ValidationManager {
  constructor() {
    this.validationCache = new Map();
    this.validationHistory = [];
    this.listeners = new Set();
    this.config = {
      enableCaching: true,
      maxHistorySize: 100,
      enableMetrics: true,
      logLevel: 'warn' // 'silent', 'error', 'warn', 'info', 'debug'
    };
  }

  // Configuration methods
  setConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    this.log('info', 'Configuration updated', newConfig);
  }

  setLogLevel(level) {
    this.config.logLevel = level;
  }

  // Event listener management
  addListener(callback) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  emit(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        this.log('error', 'Listener error', { error: error.message, event });
      }
    });
  }

  // Logging utility
  log(level, message, data = null) {
    const levels = ['silent', 'error', 'warn', 'info', 'debug'];
    const currentLevel = levels.indexOf(this.config.logLevel);
    const messageLevel = levels.indexOf(level);

    if (currentLevel >= messageLevel) {
      const timestamp = new Date().toISOString();
      const logData = { timestamp, level, message, data };
      
      switch (level) {
        case 'error':
          console.error('🔴 ValidationManager:', message, data);
          break;
        case 'warn':
          console.warn('🟡 ValidationManager:', message, data);
          break;
        case 'info':
          console.info('🔵 ValidationManager:', message, data);
          break;
        case 'debug':
          console.log('⚪ ValidationManager:', message, data);
          break;
      }

      this.emit('log', logData);
    }
  }

  // Cache management
  getCacheKey(exerciseType, data) {
    const dataHash = this.simpleHash(JSON.stringify(data));
    return `${exerciseType}:${dataHash}`;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }

  clearCache() {
    this.validationCache.clear();
    this.log('info', 'Validation cache cleared');
    this.emit('cacheCleared', { timestamp: new Date().toISOString() });
  }

  // Core validation methods
  async validateExerciseType(exerciseType, data) {
    const startTime = Date.now();
    const cacheKey = this.getCacheKey(exerciseType, data);

    // Check cache first
    if (this.config.enableCaching && this.validationCache.has(cacheKey)) {
      const cached = this.validationCache.get(cacheKey);
      this.log('debug', 'Validation result served from cache', { exerciseType, cacheKey });
      this.emit('validationFromCache', { exerciseType, cached });
      return cached;
    }

    try {
      // Perform validation
      const result = validateExerciseData(data, exerciseType);
      const duration = Date.now() - startTime;

      // Enhanced result with metadata
      const enhancedResult = {
        ...result,
        metadata: {
          exerciseType,
          validatedAt: new Date().toISOString(),
          duration,
          dataSize: JSON.stringify(data).length,
          cacheKey
        }
      };

      // Cache the result
      if (this.config.enableCaching) {
        this.validationCache.set(cacheKey, enhancedResult);
      }

      // Add to history
      this.addToHistory(enhancedResult);

      // Log result
      if (result.success) {
        this.log('info', `Validation passed for ${exerciseType}`, {
          duration: `${duration}ms`,
          exerciseCount: data.exercises?.length || 0
        });
      } else {
        this.log('warn', `Validation failed for ${exerciseType}`, {
          duration: `${duration}ms`,
          errorCount: result.errors?.length || 0,
          errors: result.errors?.slice(0, 3) // First 3 errors for summary
        });
      }

      // Emit event
      this.emit('validationComplete', enhancedResult);

      return enhancedResult;

    } catch (error) {
      const errorResult = {
        success: false,
        data: null,
        errors: [{ message: `Validation error: ${error.message}`, code: 'validation_error' }],
        metadata: {
          exerciseType,
          validatedAt: new Date().toISOString(),
          duration: Date.now() - startTime,
          error: error.message
        }
      };

      this.log('error', `Validation error for ${exerciseType}`, { error: error.message });
      this.emit('validationError', errorResult);

      return errorResult;
    }
  }

  // Batch validation
  async validateMultipleTypes(exerciseTypesData) {
    const startTime = Date.now();
    const results = {};
    const summary = {
      total: Object.keys(exerciseTypesData).length,
      successful: 0,
      failed: 0,
      errors: []
    };

    this.log('info', 'Starting batch validation', { 
      types: Object.keys(exerciseTypesData) 
    });

    for (const [exerciseType, data] of Object.entries(exerciseTypesData)) {
      try {
        const result = await this.validateExerciseType(exerciseType, data);
        results[exerciseType] = result;

        if (result.success) {
          summary.successful++;
        } else {
          summary.failed++;
          summary.errors.push({
            exerciseType,
            errorCount: result.errors?.length || 0,
            firstError: result.errors?.[0]?.message
          });
        }
      } catch (error) {
        summary.failed++;
        summary.errors.push({
          exerciseType,
          error: error.message
        });

        results[exerciseType] = {
          success: false,
          data: null,
          errors: [{ message: error.message, code: 'batch_validation_error' }]
        };
      }
    }

    const batchResult = {
      results,
      summary: {
        ...summary,
        duration: Date.now() - startTime,
        completedAt: new Date().toISOString()
      }
    };

    this.log('info', 'Batch validation completed', batchResult.summary);
    this.emit('batchValidationComplete', batchResult);

    return batchResult;
  }

  // History management
  addToHistory(result) {
    this.validationHistory.unshift(result);
    
    // Limit history size
    if (this.validationHistory.length > this.config.maxHistorySize) {
      this.validationHistory = this.validationHistory.slice(0, this.config.maxHistorySize);
    }
  }

  getValidationHistory(exerciseType = null) {
    if (exerciseType) {
      return this.validationHistory.filter(
        result => result.metadata?.exerciseType === exerciseType
      );
    }
    return [...this.validationHistory];
  }

  clearHistory() {
    this.validationHistory = [];
    this.log('info', 'Validation history cleared');
    this.emit('historyCleared', { timestamp: new Date().toISOString() });
  }

  // Analytics and reporting
  getValidationMetrics() {
    const history = this.validationHistory;
    const now = new Date();
    const lastHour = new Date(now.getTime() - 60 * 60 * 1000);
    const lastDay = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const recentValidations = history.filter(
      result => new Date(result.metadata?.validatedAt) > lastHour
    );

    const dailyValidations = history.filter(
      result => new Date(result.metadata?.validatedAt) > lastDay
    );

    const metrics = {
      total: {
        validations: history.length,
        successful: history.filter(r => r.success).length,
        failed: history.filter(r => !r.success).length
      },
      recent: {
        validations: recentValidations.length,
        successful: recentValidations.filter(r => r.success).length,
        failed: recentValidations.filter(r => !r.success).length
      },
      daily: {
        validations: dailyValidations.length,
        successful: dailyValidations.filter(r => r.success).length,
        failed: dailyValidations.filter(r => !r.success).length
      },
      performance: {
        averageDuration: this.calculateAverageDuration(history),
        fastestValidation: this.getFastestValidation(history),
        slowestValidation: this.getSlowestValidation(history)
      },
      cache: {
        size: this.validationCache.size,
        hitRate: this.calculateCacheHitRate()
      },
      exerciseTypes: this.getExerciseTypeMetrics(history)
    };

    return metrics;
  }

  calculateAverageDuration(history) {
    if (!history.length) return 0;
    const totalDuration = history.reduce((sum, result) => 
      sum + (result.metadata?.duration || 0), 0
    );
    return Math.round(totalDuration / history.length);
  }

  getFastestValidation(history) {
    return history.reduce((fastest, current) => {
      const currentDuration = current.metadata?.duration || Infinity;
      const fastestDuration = fastest?.metadata?.duration || Infinity;
      return currentDuration < fastestDuration ? current : fastest;
    }, null);
  }

  getSlowestValidation(history) {
    return history.reduce((slowest, current) => {
      const currentDuration = current.metadata?.duration || 0;
      const slowestDuration = slowest?.metadata?.duration || 0;
      return currentDuration > slowestDuration ? current : slowest;
    }, null);
  }

  calculateCacheHitRate() {
    // This would need to be tracked through validation calls
    // For now, return estimated based on cache size and history
    const cacheSize = this.validationCache.size;
    const totalValidations = this.validationHistory.length;
    
    if (totalValidations === 0) return 0;
    
    // Rough estimate - actual implementation would track hits/misses
    return Math.min(100, (cacheSize / totalValidations) * 100);
  }

  getExerciseTypeMetrics(history) {
    const typeMetrics = {};
    
    history.forEach(result => {
      const exerciseType = result.metadata?.exerciseType;
      if (!exerciseType) return;

      if (!typeMetrics[exerciseType]) {
        typeMetrics[exerciseType] = {
          total: 0,
          successful: 0,
          failed: 0,
          averageDuration: 0,
          lastValidation: null
        };
      }

      typeMetrics[exerciseType].total++;
      
      if (result.success) {
        typeMetrics[exerciseType].successful++;
      } else {
        typeMetrics[exerciseType].failed++;
      }

      if (!typeMetrics[exerciseType].lastValidation || 
          new Date(result.metadata.validatedAt) > new Date(typeMetrics[exerciseType].lastValidation)) {
        typeMetrics[exerciseType].lastValidation = result.metadata.validatedAt;
      }
    });

    // Calculate average durations
    Object.keys(typeMetrics).forEach(exerciseType => {
      const typeHistory = history.filter(r => r.metadata?.exerciseType === exerciseType);
      typeMetrics[exerciseType].averageDuration = this.calculateAverageDuration(typeHistory);
    });

    return typeMetrics;
  }

  // Validation reports
  generateValidationReport(options = {}) {
    const {
      includeMetrics = true,
      includeHistory = true,
      includeCacheInfo = true,
      exerciseType = null
    } = options;

    const report = {
      generatedAt: new Date().toISOString(),
      config: this.config
    };

    if (includeMetrics) {
      report.metrics = this.getValidationMetrics();
    }

    if (includeHistory) {
      report.history = this.getValidationHistory(exerciseType);
    }

    if (includeCacheInfo) {
      report.cache = {
        size: this.validationCache.size,
        keys: Array.from(this.validationCache.keys())
      };
    }

    return report;
  }

  // Export validation report as JSON
  exportReport(options = {}) {
    const report = this.generateValidationReport(options);
    const blob = new Blob([JSON.stringify(report, null, 2)], { 
      type: 'application/json' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `validation-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.log('info', 'Validation report exported');
    return report;
  }
}

// Singleton instance
const validationManager = new ValidationManager();

// Development utilities
if (process.env.NODE_ENV === 'development') {
  window.validationManager = validationManager;
}

export default validationManager;
