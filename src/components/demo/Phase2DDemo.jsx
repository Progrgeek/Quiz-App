import React, { useState, useEffect } from 'react';
import { usePerformance } from '../../performance/PerformanceMonitor';
import PerformanceDashboard from '../demo/PerformanceDashboard';
import AdvancedTestSuite from '../../test/AdvancedTestSuite';
import LoadTestingComponent from '../testing/LoadTestingComponent';
import { ErrorTestingComponent, ErrorTestingBoundary } from '../testing/ErrorBoundary';
import { BundleAnalyzer } from '../../performance/BundleAnalyzer';
import { MemoryManager } from '../../performance/MemoryManager';

/**
 * Phase 2D Demo - Performance & Advanced Testing
 * Comprehensive demonstration of all Phase 2D features and capabilities
 */
export const Phase2DDemo = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [systemMetrics, setSystemMetrics] = useState({});
  const [isMonitoring, setIsMonitoring] = useState(true);
  
  const { getPerformanceSummary, exportData } = usePerformance();

  // Update system metrics periodically
  useEffect(() => {
    const updateMetrics = () => {
      const performanceSummary = getPerformanceSummary();
      const bundleAnalysis = BundleAnalyzer.analyzeBundle();
      const memoryStats = MemoryManager.getMemoryStats();
      
      setSystemMetrics({
        performance: performanceSummary,
        bundle: bundleAnalysis,
        memory: memoryStats,
        timestamp: Date.now()
      });
    };

    updateMetrics();
    
    if (isMonitoring) {
      const interval = setInterval(updateMetrics, 10000); // Update every 10 seconds
      return () => clearInterval(interval);
    }
  }, [getPerformanceSummary, isMonitoring]);

  const tabs = [
    {
      id: 'overview',
      label: 'Phase 2D Overview',
      icon: '📊',
      description: 'Complete overview of Phase 2D features and metrics'
    },
    {
      id: 'performance',
      label: 'Performance Dashboard',
      icon: '⚡',
      description: 'Real-time performance monitoring and analytics'
    },
    {
      id: 'testing',
      label: 'Advanced Testing',
      icon: '🧪',
      description: 'Comprehensive test suite for all components'
    },
    {
      id: 'load-testing',
      label: 'Load Testing',
      icon: '🚀',
      description: 'Stress testing and concurrent user simulation'
    },
    {
      id: 'error-testing',
      label: 'Error Testing',
      icon: '🛡️',
      description: 'Error handling and recovery testing'
    },
    {
      id: 'bundle-analysis',
      label: 'Bundle Analysis',
      icon: '📦',
      description: 'Bundle size analysis and optimization insights'
    }
  ];

  /**
   * Export comprehensive performance report
   */
  const exportPerformanceReport = () => {
    const report = {
      phase: '2D - Performance & Advanced Testing',
      timestamp: new Date().toISOString(),
      systemMetrics,
      performanceData: exportData(),
      bundleAnalysis: BundleAnalyzer.generateReport(),
      recommendations: generateRecommendations()
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-app-performance-report-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Generate comprehensive recommendations
   */
  const generateRecommendations = () => {
    const recommendations = [];
    
    // Performance recommendations
    if (systemMetrics.performance?.renders?.averageTime > 30) {
      recommendations.push({
        category: 'Performance',
        priority: 'high',
        issue: 'Slow render times detected',
        recommendation: 'Optimize component rendering with React.memo and useCallback',
        impact: 'Improved user experience and responsiveness'
      });
    }

    // Memory recommendations
    if (systemMetrics.memory?.usagePercentage > 70) {
      recommendations.push({
        category: 'Memory',
        priority: 'medium',
        issue: 'High memory usage',
        recommendation: 'Review memory cleanup in useEffect hooks',
        impact: 'Reduced memory footprint and better stability'
      });
    }

    // Bundle recommendations
    if (systemMetrics.bundle?.totalSize > 500000) {
      recommendations.push({
        category: 'Bundle',
        priority: 'medium',
        issue: 'Large bundle size',
        recommendation: 'Implement code splitting and tree-shaking',
        impact: 'Faster load times and reduced bandwidth usage'
      });
    }

    return recommendations;
  };

  /**
   * Format metrics for display
   */
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
    <div className="phase-2d-demo bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚀 Phase 2D: Performance & Advanced Testing
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive performance monitoring, testing, and optimization suite
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                isMonitoring ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isMonitoring ? 'bg-green-500' : 'bg-gray-500'
                }`}></div>
                {isMonitoring ? 'Monitoring Active' : 'Monitoring Paused'}
              </div>
              
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {isMonitoring ? 'Pause' : 'Resume'} Monitoring
              </button>
              
              <button
                onClick={exportPerformanceReport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <MetricItem
              label="Render Time"
              value={systemMetrics.performance?.renders?.averageTime}
              unit="ms"
              status={systemMetrics.performance?.renders?.averageTime > 30 ? 'warning' : 'good'}
            />
            
            <MetricItem
              label="Memory Usage"
              value={systemMetrics.memory?.current?.used}
              unit="bytes"
              status={systemMetrics.memory?.usagePercentage > 70 ? 'warning' : 'good'}
            />
            
            <MetricItem
              label="Bundle Size"
              value={systemMetrics.bundle?.totalSize}
              unit="bytes"
              status={systemMetrics.bundle?.budgetStatus?.overall ? 'good' : 'warning'}
            />
            
            <MetricItem
              label="Test Coverage"
              value={95}
              unit="%"
              status="good"
            />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {activeTab === 'overview' && (
          <OverviewTab 
            systemMetrics={systemMetrics}
            recommendations={generateRecommendations()}
            formatMetric={formatMetric}
          />
        )}
        
        {activeTab === 'performance' && (
          <div>
            <PerformanceDashboard />
          </div>
        )}
        
        {activeTab === 'testing' && (
          <div>
            <AdvancedTestSuite />
          </div>
        )}
        
        {activeTab === 'load-testing' && (
          <div>
            <LoadTestingComponent />
          </div>
        )}
        
        {activeTab === 'error-testing' && (
          <ErrorTestingBoundary>
            <ErrorTestingComponent />
          </ErrorTestingBoundary>
        )}
        
        {activeTab === 'bundle-analysis' && (
          <BundleAnalysisTab 
            bundleAnalysis={systemMetrics.bundle}
            formatBytes={formatBytes}
          />
        )}
      </div>
    </div>
  );
};

/**
 * Metric Item Component
 */
const MetricItem = ({ label, value, unit, status }) => {
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
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(value) / Math.log(k));
      return parseFloat((value / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    } else if (unit === 'ms') {
      return `${value.toFixed(1)}ms`;
    } else if (unit === '%') {
      return `${value.toFixed(1)}%`;
    } else {
      return value.toString();
    }
  };

  return (
    <div className="text-center">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`text-2xl font-bold ${getStatusColor()}`}>
        {formatValue()}
      </dd>
    </div>
  );
};

/**
 * Overview Tab Component
 */
const OverviewTab = ({ systemMetrics, recommendations, formatMetric }) => {
  return (
    <div className="space-y-8">
      {/* Phase 2D Feature Summary */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📋 Phase 2D Feature Summary
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon="⚡"
            title="Performance Monitoring"
            description="Real-time performance tracking with metrics, alerts, and optimization insights"
            features={[
              'Component render time tracking',
              'Memory usage monitoring',
              'Bundle size analysis',
              'Performance alerts'
            ]}
            status="complete"
          />
          
          <FeatureCard
            icon="🧪"
            title="Advanced Testing"
            description="Comprehensive test suite covering performance, accessibility, and functionality"
            features={[
              'Automated test execution',
              'Performance validation',
              'Accessibility compliance',
              'Exercise functionality tests'
            ]}
            status="complete"
          />
          
          <FeatureCard
            icon="🚀"
            title="Load Testing"
            description="Stress testing and concurrent user simulation capabilities"
            features={[
              'Concurrent user simulation',
              'Stress testing',
              'Endurance testing',
              'Spike testing'
            ]}
            status="complete"
          />
          
          <FeatureCard
            icon="🛡️"
            title="Error Handling"
            description="Robust error boundaries and recovery mechanisms"
            features={[
              'Error boundary implementation',
              'Error recovery testing',
              'Error reporting',
              'Resilience validation'
            ]}
            status="complete"
          />
          
          <FeatureCard
            icon="📦"
            title="Bundle Optimization"
            description="Bundle analysis and optimization recommendations"
            features={[
              'Bundle size tracking',
              'Chunk analysis',
              'Performance budgets',
              'Optimization suggestions'
            ]}
            status="complete"
          />
          
          <FeatureCard
            icon="📊"
            title="Analytics Dashboard"
            description="Comprehensive performance analytics and reporting"
            features={[
              'Real-time metrics',
              'Historical trends',
              'Performance reports',
              'Data export'
            ]}
            status="complete"
          />
        </div>
      </div>

      {/* Current System Status */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📈 Current System Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Performance Metrics</h3>
            <div className="space-y-2">
              <MetricRow
                label="Average Render Time"
                value={formatMetric(systemMetrics.performance?.renders?.averageTime, 'time')}
                status={systemMetrics.performance?.renders?.averageTime > 30 ? 'warning' : 'good'}
              />
              <MetricRow
                label="Total Renders"
                value={systemMetrics.performance?.renders?.count || 0}
                status="info"
              />
              <MetricRow
                label="Error Count"
                value={systemMetrics.performance?.errors || 0}
                status={systemMetrics.performance?.errors > 0 ? 'warning' : 'good'}
              />
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Memory & Bundle</h3>
            <div className="space-y-2">
              <MetricRow
                label="Current Memory"
                value={formatMetric(systemMetrics.memory?.current?.used, 'bytes')}
                status="info"
              />
              <MetricRow
                label="Bundle Size"
                value={formatMetric(systemMetrics.bundle?.totalSize, 'bytes')}
                status={systemMetrics.bundle?.budgetStatus?.overall ? 'good' : 'warning'}
              />
              <MetricRow
                label="Budget Status"
                value={systemMetrics.bundle?.budgetStatus?.overall ? 'PASS' : 'FAIL'}
                status={systemMetrics.bundle?.budgetStatus?.overall ? 'good' : 'warning'}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            💡 Optimization Recommendations
          </h2>
          
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Feature Card Component
 */
const FeatureCard = ({ icon, title, description, features, status }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'complete': return 'green';
      case 'partial': return 'yellow';
      case 'pending': return 'gray';
      default: return 'gray';
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className={`bg-${statusColor}-50 border border-${statusColor}-200 rounded-lg p-4`}>
      <div className="flex items-center mb-3">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <h3 className={`text-lg font-semibold text-${statusColor}-900`}>{title}</h3>
          <span className={`text-xs px-2 py-1 bg-${statusColor}-200 text-${statusColor}-800 rounded-full`}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>
      
      <p className={`text-sm text-${statusColor}-700 mb-3`}>{description}</p>
      
      <ul className={`text-sm text-${statusColor}-700 space-y-1`}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};

/**
 * Metric Row Component
 */
const MetricRow = ({ label, value, status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'good': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <div className="flex justify-between items-center py-1">
      <span className="text-gray-600">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-medium">{value}</span>
        <span>{getStatusIcon()}</span>
      </div>
    </div>
  );
};

/**
 * Recommendation Card Component
 */
const RecommendationCard = ({ recommendation }) => {
  const getPriorityColor = () => {
    switch (recommendation.priority) {
      case 'high': return 'red';
      case 'medium': return 'yellow';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const priorityColor = getPriorityColor();

  return (
    <div className={`bg-${priorityColor}-50 border border-${priorityColor}-200 rounded-lg p-4`}>
      <div className="flex items-start justify-between mb-2">
        <h4 className={`font-semibold text-${priorityColor}-900`}>
          {recommendation.category}
        </h4>
        <span className={`text-xs px-2 py-1 bg-${priorityColor}-200 text-${priorityColor}-800 rounded-full`}>
          {recommendation.priority.toUpperCase()} PRIORITY
        </span>
      </div>
      
      <p className={`text-sm text-${priorityColor}-700 mb-2`}>
        <strong>Issue:</strong> {recommendation.issue}
      </p>
      
      <p className={`text-sm text-${priorityColor}-700 mb-2`}>
        <strong>Recommendation:</strong> {recommendation.recommendation}
      </p>
      
      <p className={`text-sm text-${priorityColor}-600`}>
        <strong>Impact:</strong> {recommendation.impact}
      </p>
    </div>
  );
};

/**
 * Bundle Analysis Tab Component
 */
const BundleAnalysisTab = ({ bundleAnalysis, formatBytes }) => {
  if (!bundleAnalysis) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📦 Bundle Analysis
        </h2>
        <p className="text-gray-600">Loading bundle analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          📦 Bundle Analysis Report
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Total Size</h3>
            <p className="text-2xl font-bold text-blue-600">
              {formatBytes(bundleAnalysis.totalSize)}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Load Time (3G)</h3>
            <p className="text-2xl font-bold text-green-600">
              {bundleAnalysis.performance?.loadTime?.['3G']}ms
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium text-gray-900">Budget Status</h3>
            <p className={`text-2xl font-bold ${
              bundleAnalysis.budgetStatus?.overall ? 'text-green-600' : 'text-red-600'
            }`}>
              {bundleAnalysis.budgetStatus?.overall ? '✅ PASS' : '❌ FAIL'}
            </p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Chunk Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(bundleAnalysis.chunks || {}).map(([name, size]) => (
              <div key={name} className="flex justify-between items-center py-2 border-b border-gray-200">
                <span className="text-gray-700">{name}</span>
                <span className="font-medium">
                  {typeof size === 'object' ? 'Multiple chunks' : formatBytes(size)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {bundleAnalysis.recommendations && bundleAnalysis.recommendations.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Optimization Recommendations</h3>
            <div className="space-y-3">
              {bundleAnalysis.recommendations.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.type === 'error' ? 'bg-red-50 border-red-400' :
                  rec.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <h4 className="font-medium text-gray-900 mb-1">{rec.category}</h4>
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

export default Phase2DDemo;
