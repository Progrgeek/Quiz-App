import { formatBytes } from '../utils/formatting';

/**
 * Bundle Analysis and Performance Monitoring System
 * Provides insights into bundle size, chunk distribution, and optimization opportunities
 */
export class BundleAnalyzer {
  static performanceBudgets = {
    totalBundle: 500000, // 500KB total budget
    chunkSize: 100000,   // 100KB per chunk
    vendorBundle: 200000, // 200KB for vendor libraries
    exerciseChunk: 50000  // 50KB per exercise type
  };

  /**
   * Analyze current bundle composition and performance
   * @returns {Object} Comprehensive bundle analysis report
   */
  static analyzeBundle() {
    const chunks = this.getChunkSizes();
    const totalSize = this.getTotalBundleSize();
    const performance = this.getPerformanceMetrics();
    
    return {
      totalSize,
      chunks,
      performance,
      budgetStatus: this.checkBudgetCompliance(chunks, totalSize),
      recommendations: this.getOptimizationRecommendations(chunks, totalSize)
    };
  }

  /**
   * Get estimated chunk sizes based on current imports
   * @returns {Object} Chunk size breakdown
   */
  static getChunkSizes() {
    // In a real implementation, this would analyze webpack/vite build output
    // For now, we'll provide estimated sizes based on typical component sizes
    return {
      main: 45000,        // Main app bundle ~45KB
      vendor: 180000,     // React, React-DOM, other libraries ~180KB
      exercises: {
        'multiple-choice': 25000,
        'fill-in-the-blanks': 28000,
        'drag-and-drop': 35000,
        'highlight': 22000,
        'gap-fill': 24000,
        'click-to-change': 26000,
        'multiple-answers': 27000,
        'single-answer': 20000,
        'sequencing': 32000,
        'syllable-counting': 23000,
        'rhyme-exercises': 25000,
        'table-exercise': 30000
      },
      designSystem: 18000, // Design system components ~18KB
      utils: 12000,       // Utility functions ~12KB
      i18n: 15000         // Internationalization ~15KB
    };
  }

  /**
   * Calculate total bundle size
   * @returns {number} Total bundle size in bytes
   */
  static getTotalBundleSize() {
    const chunks = this.getChunkSizes();
    let total = chunks.main + chunks.vendor + chunks.designSystem + chunks.utils + chunks.i18n;
    
    // Add all exercise chunks
    Object.values(chunks.exercises).forEach(size => {
      total += size;
    });
    
    return total;
  }

  /**
   * Get performance metrics for the current bundle
   * @returns {Object} Performance metrics
   */
  static getPerformanceMetrics() {
    return {
      loadTime: this.estimateLoadTime(),
      gzipRatio: 0.3, // Typical gzip compression ratio
      parseTime: this.estimateParseTime(),
      cacheability: this.analyzeCacheability()
    };
  }

  /**
   * Estimate load time based on bundle size and network conditions
   * @returns {Object} Load time estimates for different connection speeds
   */
  static estimateLoadTime() {
    const totalSize = this.getTotalBundleSize();
    const gzippedSize = totalSize * 0.3; // Assuming 30% compression
    
    return {
      '3G': Math.round((gzippedSize / (1.6 * 1024 * 1024)) * 1000), // 1.6 Mbps
      '4G': Math.round((gzippedSize / (10 * 1024 * 1024)) * 1000),  // 10 Mbps
      'WiFi': Math.round((gzippedSize / (25 * 1024 * 1024)) * 1000), // 25 Mbps
      units: 'milliseconds'
    };
  }

  /**
   * Estimate JavaScript parse time
   * @returns {number} Estimated parse time in milliseconds
   */
  static estimateParseTime() {
    const totalSize = this.getTotalBundleSize();
    // Rough estimate: 1ms per 1KB on average mobile device
    return Math.round(totalSize / 1000);
  }

  /**
   * Analyze cache effectiveness
   * @returns {Object} Cacheability analysis
   */
  static analyzeCacheability() {
    return {
      vendorStability: 'high',    // Vendor libraries change infrequently
      appStability: 'medium',     // App code changes moderately
      exerciseStability: 'high',  // Exercise components are stable
      cacheStrategy: 'long-term-vendor-short-term-app'
    };
  }

  /**
   * Check if current bundle meets performance budgets
   * @param {Object} chunks - Chunk size breakdown
   * @param {number} totalSize - Total bundle size
   * @returns {Object} Budget compliance status
   */
  static checkBudgetCompliance(chunks, totalSize) {
    const status = {
      total: totalSize <= this.performanceBudgets.totalBundle,
      vendor: chunks.vendor <= this.performanceBudgets.vendorBundle,
      exercises: {},
      overall: true
    };

    // Check each exercise chunk
    Object.entries(chunks.exercises).forEach(([name, size]) => {
      status.exercises[name] = size <= this.performanceBudgets.exerciseChunk;
      if (!status.exercises[name]) {
        status.overall = false;
      }
    });

    // Check overall status
    if (!status.total || !status.vendor) {
      status.overall = false;
    }

    return status;
  }

  /**
   * Generate optimization recommendations
   * @param {Object} chunks - Chunk size breakdown
   * @param {number} totalSize - Total bundle size
   * @returns {Array} Array of optimization recommendations
   */
  static getOptimizationRecommendations(chunks, totalSize) {
    const recommendations = [];
    
    // Check total bundle size
    if (totalSize > this.performanceBudgets.totalBundle) {
      recommendations.push({
        type: 'error',
        category: 'bundle-size',
        message: `Total bundle size (${formatBytes(totalSize)}) exceeds budget (${formatBytes(this.performanceBudgets.totalBundle)})`,
        impact: 'high',
        suggestions: [
          'Implement more aggressive code splitting',
          'Remove unused dependencies',
          'Consider lighter alternatives for heavy libraries'
        ]
      });
    }

    // Check vendor bundle
    if (chunks.vendor > this.performanceBudgets.vendorBundle) {
      recommendations.push({
        type: 'warning',
        category: 'vendor-bundle',
        message: `Vendor bundle (${formatBytes(chunks.vendor)}) is large`,
        impact: 'medium',
        suggestions: [
          'Use tree-shaking to remove unused library code',
          'Consider alternative lighter libraries',
          'Implement selective imports (e.g., lodash/function instead of lodash)'
        ]
      });
    }

    // Check individual exercise chunks
    Object.entries(chunks.exercises).forEach(([name, size]) => {
      if (size > this.performanceBudgets.exerciseChunk) {
        recommendations.push({
          type: 'info',
          category: 'exercise-chunk',
          message: `Exercise "${name}" chunk (${formatBytes(size)}) could be optimized`,
          impact: 'low',
          suggestions: [
            'Extract common exercise utilities',
            'Optimize component rendering',
            'Remove unused imports'
          ]
        });
      }
    });

    // Performance optimizations
    const loadTime = this.estimateLoadTime();
    if (loadTime['3G'] > 3000) { // 3 seconds on 3G
      recommendations.push({
        type: 'warning',
        category: 'load-time',
        message: `Load time on 3G (${loadTime['3G']}ms) exceeds 3 seconds`,
        impact: 'high',
        suggestions: [
          'Implement progressive loading',
          'Add service worker for caching',
          'Optimize critical rendering path'
        ]
      });
    }

    return recommendations;
  }

  /**
   * Generate a performance report suitable for developers
   * @returns {string} Formatted performance report
   */
  static generateReport() {
    const analysis = this.analyzeBundle();
    
    let report = '📦 Bundle Analysis Report\n';
    report += '========================\n\n';
    
    report += `📊 Bundle Size Summary:\n`;
    report += `  Total: ${formatBytes(analysis.totalSize)}\n`;
    report += `  Main: ${formatBytes(analysis.chunks.main)}\n`;
    report += `  Vendor: ${formatBytes(analysis.chunks.vendor)}\n`;
    report += `  Design System: ${formatBytes(analysis.chunks.designSystem)}\n\n`;
    
    report += `🏃 Performance Estimates:\n`;
    report += `  3G Load Time: ${analysis.performance.loadTime['3G']}ms\n`;
    report += `  4G Load Time: ${analysis.performance.loadTime['4G']}ms\n`;
    report += `  Parse Time: ${analysis.performance.parseTime}ms\n\n`;
    
    report += `🎯 Budget Compliance:\n`;
    report += `  Overall: ${analysis.budgetStatus.overall ? '✅ PASS' : '❌ FAIL'}\n`;
    report += `  Total Size: ${analysis.budgetStatus.total ? '✅' : '❌'}\n`;
    report += `  Vendor Size: ${analysis.budgetStatus.vendor ? '✅' : '❌'}\n\n`;
    
    if (analysis.recommendations.length > 0) {
      report += `💡 Recommendations:\n`;
      analysis.recommendations.forEach((rec, index) => {
        const icon = rec.type === 'error' ? '🚨' : rec.type === 'warning' ? '⚠️' : 'ℹ️';
        report += `  ${icon} ${rec.message}\n`;
      });
    }
    
    return report;
  }
}

// Utility function for formatting bytes (if not already available)
function formatBytesLocal(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Export both the class and utility function
export { formatBytesLocal as formatBytes };
export default BundleAnalyzer;
