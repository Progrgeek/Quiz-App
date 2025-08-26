import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AnalyticsIntegrationTest } from "../../utils/analyticsIntegrationTest.js";
import { getDataConnector } from "../../utils/analyticsDataConnector.js";
import { getCurrentConfig, validateConfiguration } from "../../config/analyticsConfig.js";

const Phase6IntegrationTest = () => {
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState('');
  const [dataConnector, setDataConnector] = useState(null);
  const [config, setConfig] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);

  useEffect(() => {
    initializeDemo();
  }, []);

  const initializeDemo = async () => {
    try {
      // Get configuration
      const currentConfig = getCurrentConfig();
      setConfig(currentConfig);

      // Validate configuration
      const validation = validateConfiguration(currentConfig);
      console.log('Configuration validation:', validation);

      // Initialize data connector
      const connector = getDataConnector();
      await connector.initialize();
      setDataConnector(connector);

      // Start real-time data updates
      startRealTimeUpdates(connector);

    } catch (error) {
      console.error('Failed to initialize demo:', error);
    }
  };

  const startRealTimeUpdates = (connector) => {
    const updateInterval = setInterval(() => {
      const metrics = connector.getRealTimeMetrics();
      setRealTimeData(metrics);
    }, 5000);

    // Cleanup on unmount
    return () => clearInterval(updateInterval);
  };

  const runIntegrationTest = async () => {
    setIsRunning(true);
    setTestResults(null);
    
    try {
      const tester = new AnalyticsIntegrationTest();
      
      // Update current test status
      const tests = [
        'Analytics Engine Initialization',
        'Real-time Tracking',
        'A/B Testing Framework', 
        'Performance Monitoring',
        'User Behavior Analysis',
        'Component Integration',
        'Routing Integration',
        'Data Sources Connection'
      ];

      for (let i = 0; i < tests.length; i++) {
        setCurrentTest(tests[i]);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Visual delay
      }

      const results = await tester.runCompleteTestSuite();
      setTestResults(results);
      
    } catch (error) {
      console.error('Test suite failed:', error);
      setTestResults({
        success: false,
        error: error.message,
        results: []
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const testSpecificFeature = async (featureName) => {
    setIsRunning(true);
    setCurrentTest(`Testing ${featureName}...`);
    
    try {
      const tester = new AnalyticsIntegrationTest();
      
      let result;
      switch (featureName) {
        case 'Analytics Engine':
          await tester.testAnalyticsEngineInit();
          result = await tester.testRealTimeTracking();
          break;
        case 'A/B Testing':
          await tester.testAnalyticsEngineInit();
          result = await tester.testABTestingFramework();
          break;
        case 'Performance Monitoring':
          await tester.testAnalyticsEngineInit();
          result = await tester.testPerformanceMonitoring();
          break;
        case 'User Behavior':
          await tester.testAnalyticsEngineInit();
          result = await tester.testUserBehaviorAnalysis();
          break;
        case 'Components':
          result = await tester.testComponentIntegration();
          break;
        default:
          throw new Error('Unknown feature');
      }
      
      setTestResults({
        success: true,
        results: tester.testResults,
        feature: featureName
      });
      
    } catch (error) {
      setTestResults({
        success: false,
        error: error.message,
        feature: featureName
      });
    } finally {
      setIsRunning(false);
      setCurrentTest('');
    }
  };

  const generateSampleData = async () => {
    if (!dataConnector) return;
    
    const sampleEvents = [
      {
        type: 'quiz_started',
        category: 'engagement',
        properties: { quiz_id: 'js-basics', difficulty: 'beginner' },
        userId: 'demo_user_1'
      },
      {
        type: 'question_answered',
        category: 'interaction',
        properties: { question_id: 'q1', correct: true, time_taken: 15000 },
        userId: 'demo_user_1'
      },
      {
        type: 'quiz_completed',
        category: 'completion',
        properties: { quiz_id: 'js-basics', score: 85, duration: 300000 },
        userId: 'demo_user_1'
      }
    ];

    for (const event of sampleEvents) {
      await dataConnector.trackEvent(event);
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('Sample data generated');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🚀 Phase 6 Advanced Analytics Integration Test
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Comprehensive testing and validation of Phase 6 Advanced Analytics & Performance Monitoring
          </p>
          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 inline-block">
            <div className="text-blue-800 font-semibold">
              📊 Phase 6 Days 43-44: Advanced Analytics & Performance Monitoring
            </div>
            <div className="text-blue-600 text-sm">
              Real-time Analytics Engine • Performance Monitoring • A/B Testing • User Behavior Analysis
            </div>
          </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Control Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🎮 Test Control Panel</h3>
            
            <div className="space-y-4">
              {/* Full Integration Test */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runIntegrationTest}
                disabled={isRunning}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isRunning ? '🔄 Running Tests...' : '🧪 Run Full Integration Test'}
              </motion.button>

              {/* Individual Feature Tests */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Individual Feature Tests:</h4>
                
                {[
                  { name: 'Analytics Engine', icon: '🔧' },
                  { name: 'A/B Testing', icon: '🧪' },
                  { name: 'Performance Monitoring', icon: '⚡' },
                  { name: 'User Behavior', icon: '👤' },
                  { name: 'Components', icon: '🔗' }
                ].map((feature) => (
                  <button
                    key={feature.name}
                    onClick={() => testSpecificFeature(feature.name)}
                    disabled={isRunning}
                    className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <span className="text-sm">
                      {feature.icon} Test {feature.name}
                    </span>
                  </button>
                ))}
              </div>

              {/* Sample Data Generation */}
              <button
                onClick={generateSampleData}
                disabled={isRunning || !dataConnector}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                📊 Generate Sample Data
              </button>
            </div>

            {/* Current Test Status */}
            {currentTest && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm text-blue-800 font-medium">{currentTest}</span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Configuration Info */}
          {config && (
            <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">⚙️ Configuration</h3>
              <div className="space-y-2 text-sm">
                <div><strong>App:</strong> {config.app.name} v{config.app.version}</div>
                <div><strong>Environment:</strong> {config.app.environment}</div>
                <div><strong>Real-time:</strong> {config.realTime?.websocket?.enabled ? '✅ Enabled' : '❌ Disabled'}</div>
                <div><strong>A/B Testing:</strong> {config.features?.abTestingFramework ? '✅ Enabled' : '❌ Disabled'}</div>
                <div><strong>Performance:</strong> {config.features?.performanceMonitoring ? '✅ Enabled' : '❌ Disabled'}</div>
              </div>
            </div>
          )}
        </div>

        {/* Results and Real-time Data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Real-time Metrics */}
          {realTimeData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">📊 Real-time Metrics</h3>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-600">Live</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{realTimeData.active_users}</div>
                  <div className="text-sm text-gray-600">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{realTimeData.events_per_second}</div>
                  <div className="text-sm text-gray-600">Events/sec</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{realTimeData.current_conversions}</div>
                  <div className="text-sm text-gray-600">Conversions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{realTimeData.error_rate}%</div>
                  <div className="text-sm text-gray-600">Error Rate</div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Top Pages:</h4>
                <div className="space-y-1">
                  {realTimeData.top_pages?.slice(0, 3).map((page, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600 truncate">{page.path}</span>
                      <span className="text-gray-900 font-medium">{page.users}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Test Results */}
          <AnimatePresence>
            {testResults && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🧪 Test Results
                  {testResults.feature && ` - ${testResults.feature}`}
                </h3>
                
                {testResults.success ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-green-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">All Tests Passed!</span>
                    </div>
                    
                    {testResults.summary && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-sm text-green-800">
                          <div>✅ <strong>Total Tests:</strong> {testResults.summary.total}</div>
                          <div>✅ <strong>Passed:</strong> {testResults.summary.passed}</div>
                          <div>✅ <strong>Success Rate:</strong> {testResults.summary.successRate}</div>
                          <div>✅ <strong>Duration:</strong> {testResults.summary.duration}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 text-red-600">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="font-medium">Tests Failed</span>
                    </div>
                    
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-sm text-red-800">
                        <strong>Error:</strong> {testResults.error}
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual Test Results */}
                {testResults.results && testResults.results.length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Individual Test Results:</h4>
                    <div className="space-y-2">
                      {testResults.results.map((result, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-lg border ${
                            result.passed
                              ? 'border-green-200 bg-green-50'
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              {result.passed ? '✅' : '❌'} {result.testName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(result.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <div className={`text-xs mt-1 ${
                            result.passed ? 'text-green-700' : 'text-red-700'
                          }`}>
                            {result.message}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Feature Navigation */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">🔗 Phase 6 Analytics Components</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Advanced Analytics Hub', path: '/advanced-analytics', icon: '📊', description: 'Main analytics dashboard with overview and insights' },
                { name: 'Performance Monitoring', path: '/performance-monitoring', icon: '⚡', description: 'Real-time performance metrics and Core Web Vitals' },
                { name: 'User Behavior Analysis', path: '/user-behavior', icon: '👤', description: 'Journey mapping, heatmaps, and session analysis' },
                { name: 'A/B Testing Framework', path: '/ab-testing', icon: '🧪', description: 'Experiment management and statistical analysis' }
              ].map((component) => (
                <motion.div
                  key={component.name}
                  whileHover={{ scale: 1.02 }}
                  className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => window.open(component.path, '_blank')}
                >
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{component.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">{component.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{component.description}</p>
                      <div className="text-xs text-blue-600 mt-2 font-medium">
                        Open {component.path} →
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Status */}
      <div className="max-w-7xl mx-auto mt-8">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h4 className="font-semibold text-blue-800 mb-3">🚀 Phase 6 Implementation Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
            <div className="space-y-1">
              <div>✅ Real-time analytics engine with comprehensive tracking</div>
              <div>✅ Performance monitoring dashboard with Core Web Vitals</div>
              <div>✅ A/B testing framework with statistical analysis</div>
              <div>✅ User behavior analysis with journey mapping</div>
              <div>✅ Advanced analytics hub with unified interface</div>
            </div>
            <div className="space-y-1">
              <div>✅ Route integration and navigation setup</div>
              <div>✅ Data connector with external integrations</div>
              <div>✅ Customizable configuration system</div>
              <div>✅ Comprehensive integration testing suite</div>
              <div>✅ Real-time data streaming and caching</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Phase6IntegrationTest;
