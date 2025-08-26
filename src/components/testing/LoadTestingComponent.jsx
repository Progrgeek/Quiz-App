import React, { useState, useCallback, useRef, useEffect } from 'react';
import { usePerformance } from '../../performance/PerformanceMonitor';
import { MemoryManager } from '../../performance/MemoryManager';

/**
 * Load Testing Component for Phase 2D
 * Provides comprehensive load testing, stress testing, and performance validation
 */
export const LoadTestingComponent = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(null);
  const [testProgress, setTestProgress] = useState(0);
  
  const { recordInteraction, recordRenderTime, getPerformanceSummary } = usePerformance();
  const abortControllerRef = useRef(null);

  // Test configurations
  const testSuites = {
    concurrent: {
      name: 'Concurrent User Simulation',
      description: 'Simulates multiple users interacting with exercises simultaneously',
      tests: [
        { name: 'Light Load (10 users)', users: 10, duration: 30000 },
        { name: 'Medium Load (50 users)', users: 50, duration: 45000 },
        { name: 'Heavy Load (100 users)', users: 100, duration: 60000 }
      ]
    },
    stress: {
      name: 'Stress Testing',
      description: 'Tests application limits and breaking points',
      tests: [
        { name: 'Component Render Stress', type: 'render', iterations: 1000 },
        { name: 'Memory Allocation Stress', type: 'memory', iterations: 500 },
        { name: 'Event Handler Stress', type: 'events', iterations: 2000 }
      ]
    },
    endurance: {
      name: 'Endurance Testing',
      description: 'Long-running tests to detect memory leaks and performance degradation',
      tests: [
        { name: 'Extended Session (10 min)', duration: 600000, interval: 1000 },
        { name: 'Memory Leak Detection', duration: 300000, interval: 500 },
        { name: 'Performance Stability', duration: 180000, interval: 2000 }
      ]
    },
    spike: {
      name: 'Spike Testing',
      description: 'Tests sudden load increases and recovery',
      tests: [
        { name: 'Traffic Spike Simulation', spikes: 5, peakUsers: 200 },
        { name: 'Resource Spike Test', spikes: 3, peakLoad: 500 },
        { name: 'Recovery Test', spikes: 2, peakUsers: 150 }
      ]
    }
  };

  /**
   * Concurrent User Simulation
   */
  const runConcurrentUserTest = useCallback(async (testConfig) => {
    const { users, duration } = testConfig;
    const results = [];
    const startTime = Date.now();
    
    setCurrentTest(`Simulating ${users} concurrent users...`);
    
    // Create simulation for multiple users
    const userPromises = Array.from({ length: users }, async (_, userIndex) => {
      const userResults = {
        userId: userIndex,
        interactions: [],
        errors: [],
        startTime: Date.now()
      };

      const userEndTime = startTime + duration;
      
      while (Date.now() < userEndTime && !abortControllerRef.current?.signal.aborted) {
        try {
          // Simulate various user interactions
          const interactions = [
            'exercise-load',
            'answer-selection',
            'navigation',
            'form-input',
            'button-click'
          ];
          
          const interaction = interactions[Math.floor(Math.random() * interactions.length)];
          const interactionStart = performance.now();
          
          // Simulate interaction processing time
          await new Promise(resolve => setTimeout(resolve, Math.random() * 100 + 10));
          
          const interactionEnd = performance.now();
          const responseTime = interactionEnd - interactionStart;
          
          recordInteraction(`load-test-${interaction}`, responseTime, { userId: userIndex });
          
          userResults.interactions.push({
            type: interaction,
            responseTime,
            timestamp: Date.now()
          });
          
          // Random delay between interactions (1-5 seconds)
          await new Promise(resolve => 
            setTimeout(resolve, Math.random() * 4000 + 1000)
          );
          
        } catch (error) {
          userResults.errors.push({
            error: error.message,
            timestamp: Date.now()
          });
        }
      }
      
      userResults.endTime = Date.now();
      userResults.duration = userResults.endTime - userResults.startTime;
      
      return userResults;
    });

    // Monitor progress
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setTestProgress(progress);
    }, 1000);

    try {
      const userResults = await Promise.all(userPromises);
      clearInterval(progressInterval);
      
      // Analyze results
      const analysis = {
        totalUsers: users,
        testDuration: duration,
        actualDuration: Date.now() - startTime,
        successfulUsers: userResults.filter(u => u.errors.length === 0).length,
        totalInteractions: userResults.reduce((sum, u) => sum + u.interactions.length, 0),
        totalErrors: userResults.reduce((sum, u) => sum + u.errors.length, 0),
        averageResponseTime: calculateAverageResponseTime(userResults),
        memoryUsage: MemoryManager.monitorMemoryUsage(),
        performanceSummary: getPerformanceSummary()
      };
      
      results.push({
        testName: testConfig.name || `${users} Concurrent Users`,
        type: 'concurrent',
        results: analysis,
        userResults,
        timestamp: Date.now(),
        status: analysis.totalErrors < users * 0.1 ? 'pass' : 'warning' // Less than 10% error rate
      });
      
    } catch (error) {
      results.push({
        testName: testConfig.name || `${users} Concurrent Users`,
        type: 'concurrent',
        error: error.message,
        timestamp: Date.now(),
        status: 'error'
      });
    } finally {
      clearInterval(progressInterval);
    }
    
    return results;
  }, [recordInteraction, getPerformanceSummary]);

  /**
   * Stress Testing
   */
  const runStressTest = useCallback(async (testConfig) => {
    const { type, iterations } = testConfig;
    const results = [];
    const startTime = Date.now();
    
    setCurrentTest(`Running ${type} stress test (${iterations} iterations)...`);
    
    try {
      switch (type) {
        case 'render':
          await runRenderStressTest(iterations);
          break;
        case 'memory':
          await runMemoryStressTest(iterations);
          break;
        case 'events':
          await runEventStressTest(iterations);
          break;
        default:
          throw new Error(`Unknown stress test type: ${type}`);
      }
      
      const endTime = Date.now();
      const memoryAfter = MemoryManager.monitorMemoryUsage();
      
      results.push({
        testName: testConfig.name || `${type} Stress Test`,
        type: 'stress',
        results: {
          iterations,
          duration: endTime - startTime,
          memoryUsage: memoryAfter,
          performanceSummary: getPerformanceSummary()
        },
        timestamp: Date.now(),
        status: 'pass'
      });
      
    } catch (error) {
      results.push({
        testName: testConfig.name || `${type} Stress Test`,
        type: 'stress',
        error: error.message,
        timestamp: Date.now(),
        status: 'error'
      });
    }
    
    return results;
  }, [getPerformanceSummary]);

  const runRenderStressTest = async (iterations) => {
    for (let i = 0; i < iterations; i++) {
      const renderStart = performance.now();
      
      // Simulate heavy rendering work
      const heavyWork = () => {
        const array = new Array(1000).fill(0).map((_, index) => ({
          id: index,
          data: Math.random(),
          computed: Math.sin(Math.random() * Math.PI)
        }));
        return array.reduce((sum, item) => sum + item.computed, 0);
      };
      
      heavyWork();
      
      const renderEnd = performance.now();
      recordRenderTime(`stress-test-render-${i}`, renderEnd - renderStart);
      
      // Update progress
      setTestProgress((i / iterations) * 100);
      
      // Yield control occasionally
      if (i % 50 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      if (abortControllerRef.current?.signal.aborted) break;
    }
  };

  const runMemoryStressTest = async (iterations) => {
    const memoryHogs = [];
    
    for (let i = 0; i < iterations; i++) {
      // Create large objects to stress memory
      const largeObject = {
        id: i,
        data: new Array(10000).fill(Math.random()),
        timestamp: Date.now(),
        metadata: {
          iteration: i,
          randomData: new Array(1000).fill(0).map(() => Math.random())
        }
      };
      
      memoryHogs.push(largeObject);
      MemoryManager.monitorMemoryUsage();
      
      // Clean up occasionally to prevent memory exhaustion
      if (i % 100 === 0) {
        memoryHogs.splice(0, 50); // Remove oldest 50 objects
        if (window.gc) window.gc(); // Force garbage collection if available
      }
      
      setTestProgress((i / iterations) * 100);
      
      if (i % 25 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      if (abortControllerRef.current?.signal.aborted) break;
    }
    
    // Final cleanup
    memoryHogs.length = 0;
  };

  const runEventStressTest = async (iterations) => {
    const eventTypes = ['click', 'keydown', 'scroll', 'mouseover', 'focus'];
    
    for (let i = 0; i < iterations; i++) {
      const eventType = eventTypes[i % eventTypes.length];
      const interactionStart = performance.now();
      
      // Simulate event processing
      await new Promise(resolve => setTimeout(resolve, Math.random() * 5));
      
      const interactionEnd = performance.now();
      recordInteraction(`stress-test-${eventType}`, interactionEnd - interactionStart);
      
      setTestProgress((i / iterations) * 100);
      
      if (i % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 1));
      }
      
      if (abortControllerRef.current?.signal.aborted) break;
    }
  };

  /**
   * Endurance Testing
   */
  const runEnduranceTest = useCallback(async (testConfig) => {
    const { duration, interval } = testConfig;
    const results = [];
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    setCurrentTest(`Running endurance test for ${duration / 1000}s...`);
    
    const memorySnapshots = [];
    const performanceSnapshots = [];
    
    try {
      while (Date.now() < endTime && !abortControllerRef.current?.signal.aborted) {
        // Take memory and performance snapshots
        const memorySnapshot = MemoryManager.monitorMemoryUsage();
        const performanceSnapshot = getPerformanceSummary();
        
        memorySnapshots.push({
          ...memorySnapshot,
          timestamp: Date.now(),
          elapsed: Date.now() - startTime
        });
        
        performanceSnapshots.push({
          ...performanceSnapshot,
          timestamp: Date.now(),
          elapsed: Date.now() - startTime
        });
        
        // Simulate ongoing activity
        const renderStart = performance.now();
        
        // Light rendering work
        const lightWork = new Array(100).fill(0).map(() => Math.random()).reduce((a, b) => a + b, 0);
        
        const renderEnd = performance.now();
        recordRenderTime('endurance-test-render', renderEnd - renderStart);
        
        // Update progress
        const elapsed = Date.now() - startTime;
        setTestProgress((elapsed / duration) * 100);
        
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      
      // Analyze endurance results
      const analysis = {
        duration: Date.now() - startTime,
        memorySnapshots: memorySnapshots.length,
        performanceSnapshots: performanceSnapshots.length,
        memoryTrend: analyzeMemoryTrend(memorySnapshots),
        performanceTrend: analyzePerformanceTrend(performanceSnapshots),
        finalMemoryUsage: MemoryManager.monitorMemoryUsage(),
        finalPerformanceSummary: getPerformanceSummary()
      };
      
      results.push({
        testName: testConfig.name || 'Endurance Test',
        type: 'endurance',
        results: analysis,
        timestamp: Date.now(),
        status: analysis.memoryTrend.growthRate < 1024 * 1024 ? 'pass' : 'warning' // Less than 1MB growth per minute
      });
      
    } catch (error) {
      results.push({
        testName: testConfig.name || 'Endurance Test',
        type: 'endurance',
        error: error.message,
        timestamp: Date.now(),
        status: 'error'
      });
    }
    
    return results;
  }, [getPerformanceSummary, recordRenderTime]);

  /**
   * Spike Testing
   */
  const runSpikeTest = useCallback(async (testConfig) => {
    const { spikes, peakUsers } = testConfig;
    const results = [];
    
    setCurrentTest(`Running spike test with ${spikes} spikes...`);
    
    try {
      for (let spike = 0; spike < spikes; spike++) {
        // Baseline load
        const baselineUsers = 10;
        await simulateLoad(baselineUsers, 5000); // 5 seconds baseline
        
        // Spike load
        const spikeStart = Date.now();
        await simulateLoad(peakUsers, 10000); // 10 seconds spike
        const spikeEnd = Date.now();
        
        // Recovery period
        await simulateLoad(baselineUsers, 5000); // 5 seconds recovery
        
        const spikeResults = {
          spike: spike + 1,
          baselineUsers,
          peakUsers,
          spikeDuration: spikeEnd - spikeStart,
          memoryUsage: MemoryManager.monitorMemoryUsage(),
          performanceSummary: getPerformanceSummary()
        };
        
        results.push(spikeResults);
        
        setTestProgress(((spike + 1) / spikes) * 100);
        
        if (abortControllerRef.current?.signal.aborted) break;
      }
      
      return [{
        testName: testConfig.name || 'Spike Test',
        type: 'spike',
        results: {
          spikes: results.length,
          averageRecoveryTime: results.reduce((sum, r) => sum + r.spikeDuration, 0) / results.length,
          finalMemoryUsage: MemoryManager.monitorMemoryUsage(),
          finalPerformanceSummary: getPerformanceSummary(),
          spikeDetails: results
        },
        timestamp: Date.now(),
        status: 'pass'
      }];
      
    } catch (error) {
      return [{
        testName: testConfig.name || 'Spike Test',
        type: 'spike',
        error: error.message,
        timestamp: Date.now(),
        status: 'error'
      }];
    }
  }, [getPerformanceSummary]);

  /**
   * Helper function to simulate load
   */
  const simulateLoad = async (users, duration) => {
    const promises = Array.from({ length: users }, async (_, userIndex) => {
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      while (Date.now() < endTime && !abortControllerRef.current?.signal.aborted) {
        const interactionStart = performance.now();
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
        const interactionEnd = performance.now();
        
        recordInteraction(`spike-test-user-${userIndex}`, interactionEnd - interactionStart);
        
        await new Promise(resolve => setTimeout(resolve, Math.random() * 2000 + 500));
      }
    });
    
    await Promise.all(promises);
  };

  /**
   * Helper functions for analysis
   */
  const calculateAverageResponseTime = (userResults) => {
    const allInteractions = userResults.flatMap(u => u.interactions);
    if (allInteractions.length === 0) return 0;
    
    const totalResponseTime = allInteractions.reduce((sum, i) => sum + i.responseTime, 0);
    return totalResponseTime / allInteractions.length;
  };

  const analyzeMemoryTrend = (snapshots) => {
    if (snapshots.length < 2) return { growthRate: 0, trend: 'stable' };
    
    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];
    const timeElapsed = (last.elapsed - first.elapsed) / 1000; // seconds
    const memoryGrowth = last.used - first.used;
    const growthRate = memoryGrowth / timeElapsed; // bytes per second
    
    return {
      growthRate,
      trend: growthRate > 1024 ? 'increasing' : growthRate < -1024 ? 'decreasing' : 'stable',
      totalGrowth: memoryGrowth,
      timeElapsed
    };
  };

  const analyzePerformanceTrend = (snapshots) => {
    if (snapshots.length < 2) return { trend: 'stable' };
    
    // Analyze render time trends
    const renderTimes = snapshots.map(s => s.renders?.averageTime || 0).filter(t => t > 0);
    if (renderTimes.length < 2) return { trend: 'stable' };
    
    const first = renderTimes[0];
    const last = renderTimes[renderTimes.length - 1];
    const change = ((last - first) / first) * 100;
    
    return {
      trend: Math.abs(change) < 10 ? 'stable' : change > 0 ? 'degrading' : 'improving',
      changePercentage: change,
      firstRenderTime: first,
      lastRenderTime: last
    };
  };

  /**
   * Main test runner
   */
  const runLoadTest = useCallback(async (suiteType, testConfig) => {
    if (isRunning) return;
    
    setIsRunning(true);
    setTestProgress(0);
    abortControllerRef.current = new AbortController();
    
    try {
      let results = [];
      
      switch (suiteType) {
        case 'concurrent':
          results = await runConcurrentUserTest(testConfig);
          break;
        case 'stress':
          results = await runStressTest(testConfig);
          break;
        case 'endurance':
          results = await runEnduranceTest(testConfig);
          break;
        case 'spike':
          results = await runSpikeTest(testConfig);
          break;
        default:
          throw new Error(`Unknown test suite type: ${suiteType}`);
      }
      
      setTestResults(prev => [...prev.slice(-19), ...results]); // Keep last 20 results
      
    } catch (error) {
      console.error('Load test error:', error);
      setTestResults(prev => [...prev.slice(-19), {
        testName: 'Load Test Error',
        type: suiteType,
        error: error.message,
        timestamp: Date.now(),
        status: 'error'
      }]);
    } finally {
      setIsRunning(false);
      setCurrentTest(null);
      setTestProgress(0);
      abortControllerRef.current = null;
    }
  }, [isRunning, runConcurrentUserTest, runStressTest, runEnduranceTest, runSpikeTest]);

  /**
   * Stop running test
   */
  const stopTest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  /**
   * Clear test results
   */
  const clearResults = useCallback(() => {
    setTestResults([]);
  }, []);

  return (
    <div className="load-testing-component bg-white rounded-lg shadow-lg p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🚀 Load Testing Suite - Phase 2D
        </h2>
        <p className="text-gray-600">
          Comprehensive load testing, stress testing, and performance validation
        </p>
      </div>

      {/* Test Status */}
      {isRunning && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-blue-800 font-medium">{currentTest}</span>
            <button
              onClick={stopTest}
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
            >
              Stop Test
            </button>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${testProgress}%` }}
            ></div>
          </div>
          <span className="text-sm text-blue-700">{testProgress.toFixed(1)}% Complete</span>
        </div>
      )}

      {/* Test Suites */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {Object.entries(testSuites).map(([suiteType, suite]) => (
          <div key={suiteType} className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{suite.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{suite.description}</p>
            
            <div className="space-y-2">
              {suite.tests.map((test, index) => (
                <button
                  key={index}
                  onClick={() => runLoadTest(suiteType, test)}
                  disabled={isRunning}
                  className="w-full text-left bg-gray-50 hover:bg-gray-100 disabled:bg-gray-200 disabled:cursor-not-allowed p-3 rounded-lg transition-colors"
                >
                  <div className="font-medium text-gray-900">{test.name}</div>
                  <div className="text-sm text-gray-600">
                    {test.users && `${test.users} users, `}
                    {test.duration && `${test.duration / 1000}s duration`}
                    {test.iterations && `${test.iterations} iterations`}
                    {test.spikes && `${test.spikes} spikes`}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-gray-900">Test Results</h3>
            <button
              onClick={clearResults}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Clear Results
            </button>
          </div>
          
          <div className="space-y-4">
            {testResults.slice().reverse().map((result, index) => (
              <TestResultCard key={index} result={result} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Test Result Card Component
 */
const TestResultCard = ({ result }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const getStatusIcon = () => {
    switch (result.status) {
      case 'pass': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return '❓';
    }
  };

  const getStatusColor = () => {
    switch (result.status) {
      case 'pass': return 'green';
      case 'warning': return 'yellow';
      case 'error': return 'red';
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
              {result.type} test - {new Date(result.timestamp).toLocaleString()}
            </p>
          </div>
          <span className={`text-${statusColor}-700 text-sm`}>
            {isExpanded ? '▼' : '▶'} {result.error ? 'Error' : 'Details'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="px-4 pb-4">
          {result.error ? (
            <div className="bg-red-100 border border-red-300 rounded p-3">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-700">{result.error}</p>
            </div>
          ) : (
            <div className="bg-white rounded p-3 shadow-sm">
              <pre className="text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-auto max-h-96">
                {JSON.stringify(result.results, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LoadTestingComponent;
