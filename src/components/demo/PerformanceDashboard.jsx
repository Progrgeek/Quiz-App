import React, { useState, useEffect, useCallback } from 'react';
import { usePerformance } from '../../performance/PerformanceMonitor';
import { MemoryManager } from '../../performance/MemoryManager';
import { BundleAnalyzer } from '../../performance/BundleAnalyzer';

/**
 * Performance Dashboard - Real-time performance monitoring and analytics
 * Phase 2D implementation for comprehensive performance tracking
 */
export const PerformanceDashboard = () => {
  const { 
    performanceData, 
    isMonitoring, 
    getReport,
    measureExercise,
    measureInteraction
  } = usePerformance();
  
  const [dashboardData, setDashboardData] = useState({
    metrics: {},
    alerts: [],
    recommendations: [],
    historical: []
  });
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('1h');
  const [selectedMetric, setSelectedMetric] = useState('renderTime');
  const [isAutoRefresh, setIsAutoRefresh] = useState(true);

  // Update dashboard data
  useEffect(() => {
    const updateDashboard = () => {
      const report = getReport();
      const bundleAnalysis = BundleAnalyzer.analyzeBundle();
      const memoryStats = MemoryManager.getMemoryStats();
      
      setDashboardData(prev => ({
        metrics: {
          performance: report,
          bundle: bundleAnalysis,
          memory: memoryStats,
          timestamp: Date.now()
        },
        alerts: generateAlerts(report, bundleAnalysis, memoryStats),
        recommendations: generateRecommendations(report, bundleAnalysis),
        historical: [...prev.historical.slice(-99), {
          timestamp: Date.now(),
          renderTime: performanceData.renderTime || 0,
          memoryUsage: memoryStats?.current?.used || 0,
          loadTime: performanceData.loadTime || 0
        }]
      }));
    };

    updateDashboard();
    
    if (isAutoRefresh) {
      const interval = setInterval(updateDashboard, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [getReport, performanceData, isAutoRefresh]);

  // Generate performance alerts
  const generateAlerts = (perfReport, bundleAnalysis, memoryStats) => {
    const alerts = [];
    
    // Memory usage alerts
    if (memoryStats?.current) {
      const memoryPercentage = (memoryStats.current.used / memoryStats.current.limit) * 100;
      if (memoryPercentage > 80) {
        alerts.push({
          type: 'error',
          category: 'memory',
          message: `High memory usage: ${memoryPercentage.toFixed(1)}%`,
          timestamp: Date.now()
        });
      } else if (memoryPercentage > 60) {
        alerts.push({
          type: 'warning',
          category: 'memory',
          message: `Elevated memory usage: ${memoryPercentage.toFixed(1)}%`,
          timestamp: Date.now()
        });
      }
    }

    // Bundle size alerts
    if (bundleAnalysis.totalSize > BundleAnalyzer.performanceBudgets.totalBundle) {
      alerts.push({
        type: 'warning',
        category: 'bundle',
        message: `Bundle size exceeds budget: ${(bundleAnalysis.totalSize / 1024).toFixed(1)}KB`,
        timestamp: Date.now()
      });
    }

    // Render time alerts
    if (performanceData.renderTime > 50) {
      alerts.push({
        type: 'warning',
        category: 'performance',
        message: `Slow render detected: ${performanceData.renderTime?.toFixed(1)}ms`,
        timestamp: Date.now()
      });
    }

    return alerts.slice(-10); // Keep last 10 alerts
  };

  // Generate performance recommendations
  const generateRecommendations = (perfReport, bundleAnalysis) => {
    const recommendations = [];
    
    // Bundle optimization recommendations
    bundleAnalysis.recommendations?.forEach(rec => {
      recommendations.push({
        ...rec,
        source: 'bundle-analyzer'
      });
    });

    // Memory optimization recommendations
    const memoryStats = MemoryManager.getMemoryStats();
    if (memoryStats?.trend > 1024 * 1024) { // 1MB growth
      recommendations.push({
        type: 'info',
        category: 'memory',
        message: 'Memory usage trending upward',
        suggestions: [
          'Review component cleanup in useEffect',
          'Check for memory leaks in event listeners',
          'Optimize large data structures'
        ],
        source: 'memory-analyzer'
      });
    }

    // Performance optimization recommendations
    if (dashboardData.historical.length > 10) {
      const recentRenderTimes = dashboardData.historical.slice(-10).map(h => h.renderTime);
      const avgRenderTime = recentRenderTimes.reduce((a, b) => a + b, 0) / recentRenderTimes.length;
      
      if (avgRenderTime > 30) {
        recommendations.push({
          type: 'info',
          category: 'performance',
          message: 'Render times could be optimized',
          suggestions: [
            'Use React.memo for expensive components',
            'Optimize re-renders with useCallback',
            'Consider virtualization for long lists'
          ],
          source: 'performance-analyzer'
        });
      }
    }

    return recommendations.slice(-5); // Keep last 5 recommendations
  };

  // Performance test runner
  const runPerformanceTest = useCallback(async (testType) => {
    switch (testType) {
      case 'render-stress':
        await runRenderStressTest();
        break;
      case 'memory-stress':
        await runMemoryStressTest();
        break;
      case 'interaction-test':
        await runInteractionTest();
        break;
      case 'load-test':
        await runLoadTest();
        break;
      default:
        console.warn(`Unknown test type: ${testType}`);
    }
  }, [measureExercise, measureInteraction]);

  const runRenderStressTest = async () => {
    for (let i = 0; i < 100; i++) {
      measureExercise('stress-test', 'render', () => {
        // Simulate heavy render operation
        const start = performance.now();
        while (performance.now() - start < 10) {
          // Busy wait for 10ms
        }
      });
      
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
    }
  };

  const runMemoryStressTest = async () => {
    const largeArrays = [];
    
    for (let i = 0; i < 100; i++) {
      largeArrays.push(new Array(10000).fill(Math.random()));
      MemoryManager.monitorMemoryUsage();
      
      if (i % 10 === 0) {
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
    
    // Cleanup
    largeArrays.length = 0;
  };

  const runInteractionTest = async () => {
    const interactions = ['click', 'keypress', 'scroll', 'drag'];
    
    for (const interaction of interactions) {
      for (let i = 0; i < 20; i++) {
        measureInteraction(interaction, `stress-test-${i}`);
        await new Promise(resolve => setTimeout(resolve, 5));
      }
    }
  };

  const runLoadTest = async () => {
    // Simulate concurrent exercise loading
    const promises = [];
    
    for (let i = 0; i < 10; i++) {
      promises.push(
        measureExercise('load-test', `concurrent-${i}`, async () => {
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100));
          return `exercise-${i}`;
        })
      );
    }
    
    await Promise.all(promises);
  };

  // Format metrics for display
  const formatMetric = (value, type) => {
    if (typeof value !== 'number') return 'N/A';
    
    switch (type) {
      case 'time':
        return `${value.toFixed(1)}ms`;
      case 'bytes':
        return formatBytes(value);
      case 'percentage':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="performance-dashboard bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Performance Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time performance monitoring and optimization insights - Phase 2D
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
              isMonitoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${
                isMonitoring ? 'bg-green-500' : 'bg-red-500'
              }`}></div>
              {isMonitoring ? 'Monitoring Active' : 'Monitoring Stopped'}
            </div>
            
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={isAutoRefresh}
                onChange={(e) => setIsAutoRefresh(e.target.checked)}
                className="rounded"
              />
              Auto Refresh
            </label>
          </div>
        </div>

        {/* Alerts */}
        {dashboardData.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">🚨 Alerts</h2>
            <div className="space-y-2">
              {dashboardData.alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === 'error'
                      ? 'bg-red-50 border-red-400 text-red-700'
                      : 'bg-yellow-50 border-yellow-400 text-yellow-700'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-medium">{alert.category.toUpperCase()}</span>
                      <p>{alert.message}</p>
                    </div>
                    <span className="text-xs opacity-75">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Render Time"
            value={performanceData.renderTime}
            unit="ms"
            trend="stable"
            status={performanceData.renderTime > 50 ? 'warning' : 'good'}
          />
          
          <MetricCard
            title="Memory Usage"
            value={dashboardData.metrics.memory?.current?.used}
            unit="bytes"
            trend="increasing"
            status={
              dashboardData.metrics.memory?.current
                ? (dashboardData.metrics.memory.current.used / dashboardData.metrics.memory.current.limit) > 0.8
                  ? 'error'
                  : 'good'
                : 'unknown'
            }
          />
          
          <MetricCard
            title="Bundle Size"
            value={dashboardData.metrics.bundle?.totalSize}
            unit="bytes"
            trend="stable"
            status={
              dashboardData.metrics.bundle?.budgetStatus?.overall ? 'good' : 'warning'
            }
          />
          
          <MetricCard
            title="Load Time"
            value={performanceData.loadTime}
            unit="ms"
            trend="stable"
            status={performanceData.loadTime > 2000 ? 'warning' : 'good'}
          />
        </div>

        {/* Performance Tests */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            🧪 Performance Tests
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <button
              onClick={() => runPerformanceTest('render-stress')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Render Stress Test
            </button>
            
            <button
              onClick={() => runPerformanceTest('memory-stress')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Memory Stress Test
            </button>
            
            <button
              onClick={() => runPerformanceTest('interaction-test')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Interaction Test
            </button>
            
            <button
              onClick={() => runPerformanceTest('load-test')}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Load Test
            </button>
          </div>
        </div>

        {/* Performance Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PerformanceChart
            title="Render Time Trend"
            data={dashboardData.historical}
            dataKey="renderTime"
            color="#3B82F6"
            unit="ms"
          />
          
          <PerformanceChart
            title="Memory Usage Trend"
            data={dashboardData.historical}
            dataKey="memoryUsage"
            color="#10B981"
            unit="bytes"
          />
        </div>

        {/* Bundle Analysis */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📦 Bundle Analysis
          </h2>
          
          {dashboardData.metrics.bundle && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Total Size</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatBytes(dashboardData.metrics.bundle.totalSize)}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Load Time (3G)</h3>
                  <p className="text-2xl font-bold text-green-600">
                    {dashboardData.metrics.bundle.performance?.loadTime?.['3G']}ms
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900">Budget Status</h3>
                  <p className={`text-2xl font-bold ${
                    dashboardData.metrics.bundle.budgetStatus?.overall ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {dashboardData.metrics.bundle.budgetStatus?.overall ? '✅ PASS' : '❌ FAIL'}
                  </p>
                </div>
              </div>
              
              {/* Chunk breakdown */}
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Chunk Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(dashboardData.metrics.bundle.chunks || {}).map(([name, size]) => (
                    <div key={name} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{name}</span>
                      <span className="text-sm font-medium">
                        {typeof size === 'object' ? 'Multiple chunks' : formatBytes(size)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        {dashboardData.recommendations.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              💡 Optimization Recommendations
            </h2>
            
            <div className="space-y-4">
              {dashboardData.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.type === 'error'
                      ? 'bg-red-50 border-red-400'
                      : rec.type === 'warning'
                      ? 'bg-yellow-50 border-yellow-400'
                      : 'bg-blue-50 border-blue-400'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{rec.category}</h3>
                    <span className="text-xs text-gray-500">{rec.source}</span>
                  </div>
                  <p className="text-gray-700 mb-2">{rec.message}</p>
                  {rec.suggestions && (
                    <ul className="text-sm text-gray-600 list-disc list-inside">
                      {rec.suggestions.map((suggestion, i) => (
                        <li key={i}>{suggestion}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Metric Card Component
 */
const MetricCard = ({ title, value, unit, trend, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatValue = () => {
    if (typeof value !== 'number') return 'N/A';
    
    if (unit === 'bytes') {
      return formatBytes(value);
    } else if (unit === 'ms') {
      return `${value.toFixed(1)}ms`;
    } else {
      return value.toString();
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="flex items-baseline justify-between">
        <p className={`text-2xl font-bold ${getStatusColor()}`}>
          {formatValue()}
        </p>
        <span className="text-xs text-gray-400">{trend}</span>
      </div>
    </div>
  );
};

/**
 * Performance Chart Component
 */
const PerformanceChart = ({ title, data, dataKey, color, unit }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
        <div className="flex items-center justify-center h-48 text-gray-500">
          No data available
        </div>
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d[dataKey] || 0));
  const minValue = Math.min(...data.map(d => d[dataKey] || 0));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      
      <div className="relative h-48">
        <svg className="w-full h-full" viewBox="0 0 400 150">
          {/* Chart lines */}
          <polyline
            fill="none"
            stroke={color}
            strokeWidth="2"
            points={data.map((d, i) => {
              const x = (i / (data.length - 1)) * 380 + 10;
              const y = 140 - ((d[dataKey] - minValue) / (maxValue - minValue)) * 120;
              return `${x},${y}`;
            }).join(' ')}
          />
          
          {/* Data points */}
          {data.map((d, i) => {
            const x = (i / (data.length - 1)) * 380 + 10;
            const y = 140 - ((d[dataKey] - minValue) / (maxValue - minValue)) * 120;
            return (
              <circle
                key={i}
                cx={x}
                cy={y}
                r="3"
                fill={color}
              />
            );
          })}
        </svg>
        
        {/* Y-axis labels */}
        <div className="absolute top-0 left-0 h-full flex flex-col justify-between text-xs text-gray-500">
          <span>{unit === 'bytes' ? formatBytes(maxValue) : `${maxValue.toFixed(1)}${unit}`}</span>
          <span>{unit === 'bytes' ? formatBytes(minValue) : `${minValue.toFixed(1)}${unit}`}</span>
        </div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        Latest: {unit === 'bytes' 
          ? formatBytes(data[data.length - 1]?.[dataKey] || 0)
          : `${(data[data.length - 1]?.[dataKey] || 0).toFixed(1)}${unit}`
        }
      </div>
    </div>
  );
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default PerformanceDashboard;
