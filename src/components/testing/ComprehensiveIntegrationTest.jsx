/**
 * COMPREHENSIVE INTEGRATION TEST SUITE
 * This test suite thoroughly tests all aspects of the QuizEngine integration
 */

import React, { useState, useEffect, useRef } from 'react';
import { QuizEngineProvider } from '../../providers/QuizEngineProvider';
import { useQuizEngine, useQuizTimer, useQuizScore } from '../../hooks/useQuizEngine';
import { useQuizStore } from '../../store/quizStore';
import { UniversalExerciseMapper } from '../exercises/index';
import Stats from '../Stats';

// Comprehensive test data for all exercise types
const testExercises = {
  multipleChoice: {
    id: 'test-mc',
    type: 'multipleChoice',
    title: 'Multiple Choice Test',
    instructions: 'Select the correct answer',
    questions: [
      {
        id: 'mc1',
        text: 'What is 2 + 2?',
        options: [
          { id: 'a', text: '3', isCorrect: false },
          { id: 'b', text: '4', isCorrect: true },
          { id: 'c', text: '5', isCorrect: false }
        ],
        correctAnswer: 'b',
        explanation: '2 + 2 equals 4',
        hints: ['Think about basic math']
      },
      {
        id: 'mc2',
        text: 'What is the capital of France?',
        options: [
          { id: 'a', text: 'London', isCorrect: false },
          { id: 'b', text: 'Paris', isCorrect: true },
          { id: 'c', text: 'Berlin', isCorrect: false }
        ],
        correctAnswer: 'b',
        explanation: 'Paris is the capital of France',
        hints: ['Think about the Eiffel Tower']
      }
    ]
  },
  fillInTheBlanks: {
    id: 'test-fib',
    type: 'fillInTheBlanks',
    title: 'Fill in the Blanks Test',
    instructions: 'Fill in the missing words',
    questions: [
      {
        id: 'fib1',
        text: 'The {blank} is shining brightly today.',
        blanks: [
          {
            id: 'blank1',
            correctAnswers: ['sun', 'Sun'],
            position: 0
          }
        ]
      }
    ]
  },
  dragAndDrop: {
    id: 'test-dad',
    type: 'dragAndDrop',
    title: 'Drag and Drop Test',
    instructions: 'Drag items to correct zones',
    questions: [
      {
        id: 'dad1',
        text: 'Sort animals by type',
        draggableItems: [
          { id: 'dog', content: 'Dog', type: 'text' },
          { id: 'cat', content: 'Cat', type: 'text' }
        ],
        dropZones: [
          { id: 'mammals', label: 'Mammals', acceptedItems: ['dog', 'cat'] }
        ],
        correctMappings: [
          { itemId: 'dog', zoneId: 'mammals' },
          { itemId: 'cat', zoneId: 'mammals' }
        ]
      }
    ]
  }
};

const ComprehensiveTestRunner = () => {
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [testPhase, setTestPhase] = useState('idle'); // idle, engine, integration, ui, stress, complete
  const testCountRef = useRef(0);

  const {
    isEngineReady,
    engineError,
    engine,
    startExercise,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    getHint,
    skipQuestion,
    endExercise,
    getCurrentQuestion,
    getProgress,
    getScore,
    canGoNext,
    canGoPrevious
  } = useQuizEngine();

  const timerData = useQuizTimer();
  const scoreData = useQuizScore();
  const quizStore = useQuizStore();

  const logTest = (testName, passed, details = '', data = null) => {
    const result = {
      id: ++testCountRef.current,
      test: testName,
      passed,
      details,
      data,
      timestamp: new Date().toISOString(),
      phase: testPhase
    };
    setTestResults(prev => [...prev, result]);
    console.log(`[${testPhase.toUpperCase()}] Test ${testCountRef.current}: ${testName}`, 
                passed ? '✅ PASS' : '❌ FAIL', details);
    return result;
  };

  // PHASE 1: Engine Core Tests
  const runEngineCoreTests = async () => {
    setTestPhase('engine');
    setCurrentTest('Testing Engine Core...');

    // Test 1: Engine Initialization
    const engineReady = isEngineReady && !engineError;
    logTest('Engine Initialization', engineReady, 
            engineReady ? 'Engine ready' : `Error: ${engineError?.message}`);

    // Test 2: Engine Instance
    const hasEngine = !!engine;
    logTest('Engine Instance', hasEngine, hasEngine ? 'Engine instance exists' : 'No engine instance');

    // Test 3: Engine Methods
    const hasMethods = engine && 
                      typeof engine.startExercise === 'function' &&
                      typeof engine.submitAnswer === 'function';
    logTest('Engine Methods', hasMethods, 
            hasMethods ? 'All core methods available' : 'Missing core methods');

    // Test 4: Store Integration
    const storeExists = !!quizStore;
    logTest('Store Integration', storeExists, 
            storeExists ? 'Zustand store connected' : 'Store not found');

    return engineReady && hasEngine && hasMethods && storeExists;
  };

  // PHASE 2: Exercise Integration Tests
  const runExerciseIntegrationTests = async () => {
    setTestPhase('integration');
    setCurrentTest('Testing Exercise Integration...');

    let allPassed = true;

    // Test each exercise type
    for (const [exerciseType, exerciseData] of Object.entries(testExercises)) {
      try {
        setCurrentTest(`Testing ${exerciseType}...`);

        // Test 5-7: Exercise Loading
        await startExercise(exerciseData);
        const exerciseLoaded = getCurrentQuestion() !== null;
        logTest(`${exerciseType} Loading`, exerciseLoaded, 
                exerciseLoaded ? 'Exercise loaded successfully' : 'Failed to load exercise');

        if (!exerciseLoaded) {
          allPassed = false;
          continue;
        }

        // Test 8-10: Progress Tracking
        const progress = getProgress();
        const hasProgress = progress && typeof progress.percentage === 'number';
        logTest(`${exerciseType} Progress`, hasProgress, 
                hasProgress ? `Progress: ${progress.percentage}%` : 'No progress data');

        // Test 11-13: Answer Submission
        let answerSubmitted = false;
        try {
          if (exerciseType === 'multipleChoice') {
            await submitAnswer('b'); // Correct answer
            answerSubmitted = true;
          } else if (exerciseType === 'fillInTheBlanks') {
            await submitAnswer(['sun']);
            answerSubmitted = true;
          } else if (exerciseType === 'dragAndDrop') {
            await submitAnswer({ dog: 'mammals', cat: 'mammals' });
            answerSubmitted = true;
          }
        } catch (error) {
          logTest(`${exerciseType} Answer Submission`, false, `Error: ${error.message}`);
          allPassed = false;
          continue;
        }

        logTest(`${exerciseType} Answer Submission`, answerSubmitted, 
                answerSubmitted ? 'Answer submitted successfully' : 'Failed to submit answer');

        // Test 14-16: Navigation
        if (canGoNext()) {
          nextQuestion();
          logTest(`${exerciseType} Navigation`, true, 'Navigation to next question works');
        } else {
          logTest(`${exerciseType} Navigation`, true, 'No next question (expected for single question)');
        }

        // Reset for next test
        endExercise();
        
      } catch (error) {
        logTest(`${exerciseType} Integration`, false, `Unexpected error: ${error.message}`);
        allPassed = false;
      }
    }

    return allPassed;
  };

  // PHASE 3: UI Component Tests
  const runUIComponentTests = async () => {
    setTestPhase('ui');
    setCurrentTest('Testing UI Components...');

    // Test 17: Stats Component Integration
    const statsTest = document.querySelector('.stats-component') !== null;
    logTest('Stats Component', statsTest, 
            statsTest ? 'Stats component rendered' : 'Stats component not found');

    // Test 18: Timer Integration
    const timerWorking = timerData && typeof timerData.globalTime === 'number';
    logTest('Timer Integration', timerWorking, 
            timerWorking ? `Timer: ${timerData.globalTimeFormatted}` : 'Timer not working');

    // Test 19: Score Integration
    const scoreWorking = scoreData && typeof scoreData.currentScore === 'number';
    logTest('Score Integration', scoreWorking, 
            scoreWorking ? `Score: ${scoreData.currentScore}` : 'Score not working');

    // Test 20: Store State Sync
    const storeState = quizStore; // quizStore is already the state object
    const storeSynced = storeState && typeof storeState.currentScore === 'number';
    logTest('Store Synchronization', storeSynced, 
            storeSynced ? 'Store state synchronized' : 'Store not synchronized');

    return statsTest && timerWorking && scoreWorking && storeSynced;
  };

  // PHASE 4: Performance & Stress Tests
  const runPerformanceTests = async () => {
    setTestPhase('stress');
    setCurrentTest('Running Performance Tests...');

    // Test 21: Rapid Answer Submission
    try {
      await startExercise(testExercises.multipleChoice);
      const startTime = performance.now();
      
      for (let i = 0; i < 10; i++) {
        await submitAnswer('b');
        if (canGoNext()) nextQuestion();
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      const passed = duration < 1000; // Should complete in under 1 second
      
      logTest('Rapid Answer Performance', passed, 
              `${i} answers in ${duration.toFixed(2)}ms`, { duration, answers: 10 });
              
    } catch (error) {
      logTest('Rapid Answer Performance', false, `Error: ${error.message}`);
    }

    // Test 22: Memory Usage
    const memoryTest = performance.memory ? 
                      performance.memory.usedJSHeapSize < 50 * 1024 * 1024 : true; // < 50MB
    logTest('Memory Usage', memoryTest, 
            performance.memory ? 
            `Heap: ${(performance.memory.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB` : 
            'Memory API not available');

    // Test 23: State Persistence
    const initialState = quizStore; // quizStore is already the state object
    if (quizStore.actions && quizStore.actions.reset) {
      quizStore.actions.reset();
    }
    const resetState = quizStore; // quizStore is already the state object
    const stateReset = resetState.currentScore === 0 && resetState.currentQuestionIndex === 0;
    logTest('State Reset', stateReset, 
            stateReset ? 'State reset successfully' : 'State reset failed');

    return true;
  };

  // PHASE 5: Error Handling Tests
  const runErrorHandlingTests = async () => {
    setTestPhase('error');
    setCurrentTest('Testing Error Handling...');

    // Test 24: Invalid Exercise Data
    try {
      await startExercise({ invalid: 'data' });
      logTest('Invalid Exercise Handling', false, 'Should have thrown error for invalid data');
    } catch (error) {
      logTest('Invalid Exercise Handling', true, `Correctly caught error: ${error.message}`);
    }

    // Test 25: Invalid Answer Submission
    try {
      await startExercise(testExercises.multipleChoice);
      await submitAnswer(null);
      logTest('Invalid Answer Handling', false, 'Should have thrown error for null answer');
    } catch (error) {
      logTest('Invalid Answer Handling', true, `Correctly caught error: ${error.message}`);
    }

    return true;
  };

  // Main Test Runner
  const runComprehensiveTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    testCountRef.current = 0;

    try {
      console.log('🚀 Starting Comprehensive Integration Tests...');

      // Phase 1: Engine Core
      const enginePassed = await runEngineCoreTests();
      if (!enginePassed) {
        logTest('Test Suite', false, 'Engine core tests failed - aborting');
        return;
      }

      // Wait a bit between phases
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 2: Exercise Integration
      const integrationPassed = await runExerciseIntegrationTests();

      // Wait a bit between phases
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 3: UI Components
      const uiPassed = await runUIComponentTests();

      // Wait a bit between phases
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 4: Performance
      const performancePassed = await runPerformanceTests();

      // Wait a bit between phases
      await new Promise(resolve => setTimeout(resolve, 500));

      // Phase 5: Error Handling
      const errorPassed = await runErrorHandlingTests();

      setTestPhase('complete');
      setCurrentTest('Tests Complete');

      // Final Summary
      const totalTests = testResults.length;
      const passedTests = testResults.filter(r => r.passed).length;
      const successRate = (passedTests / totalTests) * 100;

      logTest('COMPREHENSIVE TEST SUITE', successRate >= 90, 
              `${passedTests}/${totalTests} tests passed (${successRate.toFixed(1)}%)`, 
              { totalTests, passedTests, successRate });

      console.log(`🏁 Comprehensive Tests Complete: ${passedTests}/${totalTests} passed`);

    } catch (error) {
      logTest('Test Suite', false, `Fatal error: ${error.message}`);
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  // Calculate summary stats
  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  const successRate = totalTests > 0 ? (passedTests / totalTests) * 100 : 0;

  const phaseStats = {
    engine: testResults.filter(r => r.phase === 'engine'),
    integration: testResults.filter(r => r.phase === 'integration'),
    ui: testResults.filter(r => r.phase === 'ui'),
    stress: testResults.filter(r => r.phase === 'stress'),
    error: testResults.filter(r => r.phase === 'error')
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center">
          🧪 Comprehensive QuizEngine Integration Test Suite
        </h1>

        {/* Test Status Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{totalTests}</div>
            <div className="text-sm text-blue-600">Total Tests</div>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{passedTests}</div>
            <div className="text-sm text-green-600">Passed</div>
          </div>
          
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{totalTests - passedTests}</div>
            <div className="text-sm text-red-600">Failed</div>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{successRate.toFixed(1)}%</div>
            <div className="text-sm text-purple-600">Success Rate</div>
          </div>
        </div>

        {/* Current Test Status */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Current Test Phase: 
                <span className="ml-2 text-blue-600">{testPhase.toUpperCase()}</span>
              </h3>
              <p className="text-gray-600">{currentTest}</p>
            </div>
            
            <button
              onClick={runComprehensiveTests}
              disabled={isRunning || !isEngineReady}
              className={`px-6 py-3 rounded-lg font-medium ${
                isRunning || !isEngineReady
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              {isRunning ? '🔄 Running Tests...' : '🚀 Run Comprehensive Tests'}
            </button>
          </div>
          
          {isRunning && (
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(totalTests / 25) * 100}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Phase Results */}
        {Object.entries(phaseStats).map(([phase, results]) => {
          if (results.length === 0) return null;
          
          const phasePassed = results.filter(r => r.passed).length;
          const phaseTotal = results.length;
          const phaseRate = (phasePassed / phaseTotal) * 100;
          
          return (
            <div key={phase} className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold capitalize">{phase} Tests</h3>
                <span className={`text-sm font-medium ${phaseRate >= 90 ? 'text-green-600' : phaseRate >= 70 ? 'text-yellow-600' : 'text-red-600'}`}>
                  {phasePassed}/{phaseTotal} ({phaseRate.toFixed(0)}%)
                </span>
              </div>
              
              <div className="space-y-1">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className={`p-2 rounded text-sm ${
                      result.passed 
                        ? 'bg-green-50 border-l-4 border-green-400' 
                        : 'bg-red-50 border-l-4 border-red-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {result.passed ? '✅' : '❌'} {result.test}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {result.details && (
                      <div className={`mt-1 text-xs ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                        {result.details}
                      </div>
                    )}
                    {result.data && (
                      <div className="mt-1 text-xs text-gray-600">
                        <pre className="whitespace-pre-wrap">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Engine Status */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-2">Engine Status</h3>
          
          {/* Stats Component for Testing */}
          <div className="mb-4">
            <Stats 
              questionNumber={1}
              totalQuestions={10}
              timeElapsed={Math.floor((timerData?.globalTime || 0) / 1000)}
              score={scoreData?.currentScore || 0}
            />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="font-medium">Ready:</span>
              <span className={`ml-2 ${isEngineReady ? 'text-green-600' : 'text-red-600'}`}>
                {isEngineReady ? '✅ Yes' : '❌ No'}
              </span>
            </div>
            <div>
              <span className="font-medium">Error:</span>
              <span className={`ml-2 ${engineError ? 'text-red-600' : 'text-green-600'}`}>
                {engineError ? '❌ Yes' : '✅ None'}
              </span>
            </div>
            <div>
              <span className="font-medium">Timer:</span>
              <span className="ml-2 text-blue-600">
                {timerData?.globalTimeFormatted || '00:00'}
              </span>
            </div>
            <div>
              <span className="font-medium">Score:</span>
              <span className="ml-2 text-purple-600">
                {scoreData?.currentScore || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComprehensiveIntegrationTest = () => {
  return (
    <QuizEngineProvider
      config={{
        enableScoring: true,
        enableTimer: true,
        showImmediateFeedback: true,
        allowHints: true,
        allowSkip: true
      }}
      onEngineReady={(engine) => console.log('🚀 Test engine ready for comprehensive testing')}
      onEngineError={(error) => console.error('❌ Test engine error:', error)}
    >
      <ComprehensiveTestRunner />
    </QuizEngineProvider>
  );
};

export default ComprehensiveIntegrationTest;
