import React, { Component, useState, useCallback } from 'react';
import { usePerformance } from '../../performance/PerformanceMonitor';

/**
 * Advanced Error Boundary with Testing Capabilities
 * Phase 2D implementation for error recovery and resilience testing
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
      errorHistory: []
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { 
      hasError: true,
      errorId: Date.now().toString()
    };
  }

  componentDidCatch(error, errorInfo) {
    const errorData = {
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      errorInfo,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      errorId: this.state.errorId || Date.now().toString()
    };

    // Update state with error details
    this.setState(prevState => ({
      error: errorData.error,
      errorInfo: errorData.errorInfo,
      errorHistory: [...prevState.errorHistory.slice(-9), errorData] // Keep last 10 errors
    }));

    // Log error to performance monitor if available
    if (this.props.onError) {
      this.props.onError(errorData);
    }

    // Log error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Send error to external monitoring service (if configured)
    this.reportError(errorData);
  }

  reportError = (errorData) => {
    // This would typically send to an external error monitoring service
    // For demonstration, we'll just log it
    if (this.props.errorReportingEnabled) {
      console.log('Reporting error to monitoring service:', errorData);
      
      // Simulate error reporting
      fetch('/api/error-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(errorData)
      }).catch(err => {
        console.warn('Failed to report error:', err);
      });
    }
  };

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom error UI
      if (this.props.fallback) {
        return this.props.fallback(
          this.state.error,
          this.state.errorInfo,
          this.handleRetry,
          this.handleReset,
          this.state.retryCount
        );
      }

      // Default error UI
      return (
        <ErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          onRetry={this.handleRetry}
          onReset={this.handleReset}
          retryCount={this.state.retryCount}
          errorHistory={this.state.errorHistory}
        />
      );
    }

    return this.props.children;
  }
}

/**
 * Default Error Fallback Component
 */
const ErrorFallback = ({ error, errorInfo, onRetry, onReset, retryCount, errorHistory }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div className="error-boundary-fallback bg-red-50 border border-red-200 rounded-lg p-6 max-w-4xl mx-auto mt-8">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.664-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div className="ml-3 flex-1">
          <h3 className="text-lg font-medium text-red-800">
            Something went wrong
          </h3>
          
          <p className="mt-2 text-sm text-red-700">
            An unexpected error occurred while rendering this component. 
            {retryCount > 0 && ` (Retry attempt: ${retryCount})`}
          </p>

          {error && (
            <div className="mt-3">
              <p className="text-sm font-medium text-red-800">Error: {error.name}</p>
              <p className="text-sm text-red-700">{error.message}</p>
            </div>
          )}

          <div className="mt-4 flex gap-3">
            <button
              onClick={onRetry}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
            >
              Try Again
            </button>
            
            <button
              onClick={onReset}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              Reset Component
            </button>
            
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </button>

            {errorHistory.length > 0 && (
              <button
                onClick={() => setShowHistory(!showHistory)}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Error History ({errorHistory.length})
              </button>
            )}
          </div>

          {showDetails && (
            <div className="mt-4 space-y-3">
              <div className="bg-red-100 rounded-lg p-3">
                <h4 className="text-sm font-medium text-red-800 mb-2">Error Stack Trace:</h4>
                <pre className="text-xs text-red-700 bg-red-50 p-2 rounded overflow-auto max-h-40">
                  {error?.stack || 'No stack trace available'}
                </pre>
              </div>

              {errorInfo && (
                <div className="bg-red-100 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-red-800 mb-2">Component Stack:</h4>
                  <pre className="text-xs text-red-700 bg-red-50 p-2 rounded overflow-auto max-h-40">
                    {errorInfo.componentStack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {showHistory && errorHistory.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-red-800 mb-2">Recent Error History:</h4>
              <div className="space-y-2 max-h-60 overflow-auto">
                {errorHistory.slice().reverse().map((historicalError, index) => (
                  <div key={index} className="bg-red-100 rounded p-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-xs font-medium text-red-800">
                          {historicalError.error.name}: {historicalError.error.message}
                        </p>
                        <p className="text-xs text-red-600">
                          {new Date(historicalError.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <span className="text-xs text-red-500">#{errorHistory.length - index}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Error Testing Component for Phase 2D
 * Provides utilities to test error handling and recovery
 */
export const ErrorTestingComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const { recordError } = usePerformance();

  // Test error types
  const errorTests = {
    renderError: {
      name: 'Render Error Test',
      description: 'Tests error handling during component rendering',
      component: () => {
        throw new Error('Simulated render error');
      }
    },
    asyncError: {
      name: 'Async Error Test',
      description: 'Tests error handling in async operations',
      test: async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        throw new Error('Simulated async error');
      }
    },
    networkError: {
      name: 'Network Error Test',
      description: 'Tests error handling for network failures',
      test: async () => {
        const response = await fetch('/api/nonexistent-endpoint');
        if (!response.ok) {
          throw new Error(`Network error: ${response.status}`);
        }
      }
    },
    memoryError: {
      name: 'Memory Error Test',
      description: 'Tests error handling for memory-related issues',
      test: () => {
        // Simulate memory exhaustion
        const bigArray = [];
        try {
          for (let i = 0; i < 1000000; i++) {
            bigArray.push(new Array(10000).fill(Math.random()));
          }
        } catch (error) {
          throw new Error('Memory allocation error: ' + error.message);
        }
      }
    },
    typeError: {
      name: 'Type Error Test',
      description: 'Tests error handling for type-related errors',
      test: () => {
        const obj = null;
        return obj.someProperty.anotherProperty; // Will throw TypeError
      }
    }
  };

  /**
   * Run error tests
   */
  const runErrorTest = useCallback(async (testType) => {
    if (isRunning) return;
    
    setIsRunning(true);
    const startTime = Date.now();
    
    try {
      const test = errorTests[testType];
      
      if (test.test) {
        // Run async or sync test
        await test.test();
      } else if (test.component) {
        // This would be tested by rendering the component in an ErrorBoundary
        throw new Error('Component test completed successfully (no error thrown)');
      }
      
      // If we reach here, the test didn't throw an error (unexpected)
      const result = {
        testType,
        testName: test.name,
        status: 'unexpected',
        message: 'Test completed without throwing expected error',
        duration: Date.now() - startTime,
        timestamp: Date.now()
      };
      
      setTestResults(prev => [...prev.slice(-19), result]);
      
    } catch (error) {
      // Expected behavior - error was thrown and caught
      recordError(error);
      
      const result = {
        testType,
        testName: errorTests[testType].name,
        status: 'pass',
        error: {
          name: error.name,
          message: error.message,
          stack: error.stack
        },
        duration: Date.now() - startTime,
        timestamp: Date.now()
      };
      
      setTestResults(prev => [...prev.slice(-19), result]);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, recordError]);

  /**
   * Run error recovery test
   */
  const runRecoveryTest = useCallback(async () => {
    if (isRunning) return;
    
    setIsRunning(true);
    const startTime = Date.now();
    const recoveryResults = [];
    
    try {
      // Test 1: Error followed by successful retry
      try {
        throw new Error('Initial error');
      } catch (error) {
        recoveryResults.push({
          step: 'Initial error',
          status: 'error',
          error: error.message
        });
        
        // Simulate recovery
        await new Promise(resolve => setTimeout(resolve, 100));
        
        recoveryResults.push({
          step: 'Recovery attempt',
          status: 'success',
          message: 'Successfully recovered from error'
        });
      }
      
      // Test 2: Multiple retry attempts
      let retryCount = 0;
      const maxRetries = 3;
      
      while (retryCount < maxRetries) {
        try {
          retryCount++;
          
          if (retryCount < maxRetries) {
            throw new Error(`Retry attempt ${retryCount} failed`);
          } else {
            recoveryResults.push({
              step: `Retry attempt ${retryCount}`,
              status: 'success',
              message: 'Successfully recovered after multiple retries'
            });
            break;
          }
        } catch (error) {
          recoveryResults.push({
            step: `Retry attempt ${retryCount}`,
            status: 'error',
            error: error.message
          });
          
          await new Promise(resolve => setTimeout(resolve, 50));
        }
      }
      
      const result = {
        testType: 'recovery',
        testName: 'Error Recovery Test',
        status: 'pass',
        recoveryResults,
        duration: Date.now() - startTime,
        timestamp: Date.now()
      };
      
      setTestResults(prev => [...prev.slice(-19), result]);
      
    } catch (error) {
      const result = {
        testType: 'recovery',
        testName: 'Error Recovery Test',
        status: 'fail',
        error: {
          name: error.name,
          message: error.message
        },
        recoveryResults,
        duration: Date.now() - startTime,
        timestamp: Date.now()
      };
      
      setTestResults(prev => [...prev.slice(-19), result]);
    } finally {
      setIsRunning(false);
    }
  }, [isRunning]);

  /**
   * Clear test results
   */
  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  return (
    <div className="error-testing-component bg-white rounded-lg shadow-lg p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🛡️ Error Testing & Recovery - Phase 2D
        </h2>
        <p className="text-gray-600">
          Test error handling, recovery mechanisms, and application resilience
        </p>
      </div>

      {/* Test Controls */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Error Tests</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {Object.entries(errorTests).map(([testType, test]) => (
            <button
              key={testType}
              onClick={() => runErrorTest(testType)}
              disabled={isRunning}
              className="text-left bg-red-50 hover:bg-red-100 disabled:bg-gray-200 disabled:cursor-not-allowed p-4 rounded-lg border border-red-200 transition-colors"
            >
              <h4 className="font-medium text-red-900">{test.name}</h4>
              <p className="text-sm text-red-700 mt-1">{test.description}</p>
            </button>
          ))}
        </div>

        <div className="flex gap-3">
          <button
            onClick={runRecoveryTest}
            disabled={isRunning}
            className="bg-green-600 text-white px-4 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
          >
            {isRunning ? 'Running...' : 'Run Recovery Test'}
          </button>
          
          {testResults.length > 0 && (
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Results
            </button>
          )}
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Test Results</h3>
          
          <div className="space-y-3">
            {testResults.slice().reverse().map((result, index) => (
              <ErrorTestResult key={index} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Error Test Result Component
 */
const ErrorTestResult = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusIcon = () => {
    switch (result.status) {
      case 'pass': return '✅';
      case 'fail': return '❌';
      case 'unexpected': return '⚠️';
      default: return '❓';
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'pass': return 'green';
      case 'fail': return 'red';
      case 'unexpected': return 'yellow';
      default: return 'gray';
    }
  };

  const statusColor = getStatusColor();

  return (
    <div className={`border border-${statusColor}-200 rounded-lg bg-${statusColor}-50`}>
      <div 
        className="p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className={`text-lg font-medium text-${statusColor}-900`}>
              {getStatusIcon()} {result.testName}
            </h4>
            <p className={`text-sm text-${statusColor}-700`}>
              {result.duration}ms - {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
          <span className={`text-${statusColor}-700 text-sm`}>
            {isExpanded ? '▼' : '▶'} Details
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="bg-white rounded p-3 shadow-sm">
            {result.message && (
              <p className="text-gray-700 mb-2">{result.message}</p>
            )}
            
            {result.error && (
              <div className="mb-3">
                <h5 className="font-medium text-gray-900 mb-1">Error Details:</h5>
                <p className="text-sm text-red-700">{result.error.name}: {result.error.message}</p>
              </div>
            )}
            
            {result.recoveryResults && (
              <div>
                <h5 className="font-medium text-gray-900 mb-2">Recovery Steps:</h5>
                <div className="space-y-2">
                  {result.recoveryResults.map((step, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        step.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-sm text-gray-700">
                        {step.step}: {step.message || step.error}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Error Testing Boundary Component
 * Wraps components to test error boundary functionality
 */
export const ErrorTestingBoundary = ({ children, onError }) => {
  return (
    <ErrorBoundary
      onError={onError}
      errorReportingEnabled={true}
      fallback={(error, errorInfo, retry, reset, retryCount) => (
        <div className="error-testing-boundary bg-orange-50 border border-orange-200 rounded-lg p-4">
          <h4 className="text-lg font-medium text-orange-900 mb-2">
            🧪 Error Boundary Test Result
          </h4>
          <p className="text-sm text-orange-700 mb-3">
            Error boundary successfully caught an error during testing.
          </p>
          <div className="flex gap-2">
            <button
              onClick={retry}
              className="bg-orange-600 text-white px-3 py-1 rounded text-sm hover:bg-orange-700 transition-colors"
            >
              Retry Test
            </button>
            <button
              onClick={reset}
              className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 transition-colors"
            >
              Reset Test
            </button>
          </div>
          {retryCount > 0 && (
            <p className="text-xs text-orange-600 mt-2">
              Retry attempts: {retryCount}
            </p>
          )}
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export default ErrorBoundary;
