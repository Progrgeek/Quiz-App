import React, { useState } from 'react';
import { useQuizStore } from '../store/quizStore';
import Stats from './Stats';

const SimpleTest = () => {
  const [testResults, setTestResults] = useState([]);
  const { 
    setCurrentQuestionIndex, 
    setTotalQuestions, 
    setTimeRemaining, 
    setCurrentScore,
    incrementScore,
    currentQuestionIndex,
    totalQuestions,
    timeRemaining,
    currentScore
  } = useQuizStore();

  const runBasicTests = () => {
    const tests = [];
    
    // Test 1: Store initialization
    try {
      tests.push({
        name: 'Store Initialization',
        success: typeof currentQuestionIndex === 'number',
        details: `Current question index: ${currentQuestionIndex}`
      });
    } catch (error) {
      tests.push({
        name: 'Store Initialization',
        success: false,
        details: error.message
      });
    }

    // Test 2: Update question index
    try {
      setCurrentQuestionIndex(5);
      const newIndex = useQuizStore.getState().currentQuestionIndex;
      tests.push({
        name: 'Update Question Index',
        success: newIndex === 5,
        details: `Set to 5, got: ${newIndex}`
      });
    } catch (error) {
      tests.push({
        name: 'Update Question Index',
        success: false,
        details: error.message
      });
    }

    // Test 3: Update total questions
    try {
      setTotalQuestions(20);
      const newTotal = useQuizStore.getState().totalQuestions;
      tests.push({
        name: 'Update Total Questions',
        success: newTotal === 20,
        details: `Set to 20, got: ${newTotal}`
      });
    } catch (error) {
      tests.push({
        name: 'Update Total Questions',
        success: false,
        details: error.message
      });
    }

    // Test 4: Update timer
    try {
      setTimeRemaining(45);
      const newTime = useQuizStore.getState().timeRemaining;
      tests.push({
        name: 'Update Timer',
        success: newTime === 45,
        details: `Set to 45, got: ${newTime}`
      });
    } catch (error) {
      tests.push({
        name: 'Update Timer',
        success: false,
        details: error.message
      });
    }

    // Test 5: Update score
    try {
      setCurrentScore(100);
      const newScore = useQuizStore.getState().currentScore;
      tests.push({
        name: 'Update Score',
        success: newScore === 100,
        details: `Set to 100, got: ${newScore}`
      });
    } catch (error) {
      tests.push({
        name: 'Update Score',
        success: false,
        details: error.message
      });
    }

    // Test 6: Increment score
    try {
      const initialScore = useQuizStore.getState().currentScore;
      incrementScore(25);
      const finalScore = useQuizStore.getState().currentScore;
      tests.push({
        name: 'Increment Score',
        success: finalScore === initialScore + 25,
        details: `${initialScore} + 25 = ${finalScore}`
      });
    } catch (error) {
      tests.push({
        name: 'Increment Score',
        success: false,
        details: error.message
      });
    }

    setTestResults(tests);
  };

  const resetStore = () => {
    setCurrentQuestionIndex(0);
    setTotalQuestions(0);
    setTimeRemaining(0);
    setCurrentScore(0);
    setTestResults([]);
  };

  const passedTests = testResults.filter(t => t.success).length;
  const totalTests = testResults.length;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
        Basic Store Integration Test
      </h1>
      
      {/* Current Store State */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Current Store State</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong>Question Index:</strong> {currentQuestionIndex}
          </div>
          <div>
            <strong>Total Questions:</strong> {totalQuestions}
          </div>
          <div>
            <strong>Time Remaining:</strong> {timeRemaining}s
          </div>
          <div>
            <strong>Current Score:</strong> {currentScore}
          </div>
        </div>
      </div>

      {/* Stats Component Test */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Stats Component (Original Restored)</h2>
        <Stats />
      </div>

      {/* Test Controls */}
      <div className="bg-white border rounded-lg p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={runBasicTests}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Run Store Tests
          </button>
          <button
            onClick={resetStore}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reset Store
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <div className="bg-white border rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Test Results</h2>
            <div className="text-lg">
              <span className="text-green-600 font-bold">{passedTests}</span>
              <span className="text-gray-400"> / </span>
              <span className="text-blue-600 font-bold">{totalTests}</span>
              <span className="text-sm text-gray-600 ml-2">
                ({Math.round((passedTests / totalTests) * 100)}% passed)
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 rounded border ${
                  result.success 
                    ? 'bg-green-50 border-green-200' 
                    : 'bg-red-50 border-red-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className={`text-lg ${result.success ? 'text-green-600' : 'text-red-600'}`}>
                      {result.success ? '✅' : '❌'}
                    </span>
                    <span className="font-medium">{result.name}</span>
                  </div>
                </div>
                <div className={`mt-1 text-sm ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}>
                  {result.details}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Banner */}
      {testResults.length > 0 && passedTests === totalTests && (
        <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🎉</span>
            <div>
              <strong>All tests passed!</strong> The Quiz Store integration is working correctly.
              The original Stats component is restored and functional.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleTest;
