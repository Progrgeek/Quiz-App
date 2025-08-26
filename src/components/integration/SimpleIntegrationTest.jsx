/**
 * Simple Integration Test - Day 1 Implementation
 * 
 * This demonstrates the first step of connecting original components
 * to the sophisticated backend systems.
 */

import React, { useState } from 'react';

// Import an original component to test integration
import MultipleAnswers from '../multipleAnswers/MultipleAnswers';
import ExampleSectionMultipleAnswer from '../multipleAnswers/ExampleSectionMultipleAnswer';

// Import hooks for backend systems
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAI } from '../../hooks/useAI';
import { useGamification } from '../../hooks/useGamification';

// Sample data for testing
const sampleData = {
  soundMatchingExercises: [
    {
      id: 1,
      exerciseType: "sound_matching",
      question: "Which words have the same sound as 'cat'?",
      options: [
        { word: "bat", image: "/images/bat.png", isCorrect: true },
        { word: "hat", image: "/images/hat.png", isCorrect: true },
        { word: "dog", image: "/images/dog.png", isCorrect: false },
        { word: "rat", image: "/images/rat.png", isCorrect: true }
      ]
    }
  ],
  synonymExercises: []
};

/**
 * Enhanced Multiple Answers Component
 * This wraps the original component with backend integration
 */
const EnhancedMultipleAnswers = ({ data, onComplete, ...props }) => {
  // Backend system hooks
  const quizEngine = useQuizEngine();
  const analytics = useAnalytics();
  const ai = useAI();
  const gamification = useGamification();

  // Enhanced completion handler
  const handleEnhancedComplete = (result) => {
    console.log('🎯 Enhanced completion handler triggered:', result);

    // Track with analytics
    if (analytics) {
      analytics.trackExerciseComplete({
        exerciseType: 'multiple-answers',
        result,
        timestamp: new Date().toISOString()
      });
    }

    // Award gamification points
    if (gamification && result.score > 0) {
      const xp = gamification.calculateXP({
        exerciseType: 'multiple-answers',
        score: result.score
      });
      gamification.awardXP(xp);
    }

    // AI learning update
    if (ai) {
      ai.updateLearning?.({
        exerciseType: 'multiple-answers',
        performance: result
      });
    }

    // Call original completion handler
    if (onComplete) {
      onComplete({
        ...result,
        enhancedData: {
          analyticsTracked: !!analytics,
          gamificationAwarded: !!gamification,
          aiUpdated: !!ai,
          backendIntegration: 'active'
        }
      });
    }
  };

  return (
    <div className="enhanced-exercise-wrapper">
      {/* Integration Status */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <span className="font-semibold text-blue-800">🔗 Backend Integration Status:</span>
          <span className={`px-2 py-1 rounded text-xs ${quizEngine ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            QuizEngine: {quizEngine ? 'Connected' : 'Disconnected'}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${analytics ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            Analytics: {analytics ? 'Connected' : 'Disconnected'}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${ai ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            AI: {ai ? 'Connected' : 'Disconnected'}
          </span>
          <span className={`px-2 py-1 rounded text-xs ${gamification ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            Gamification: {gamification ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      {/* Original Component with Enhanced Props and Example Section */}
      <ExampleSectionMultipleAnswer data={data}>
        <MultipleAnswers
          {...props}
          data={data}
          onComplete={handleEnhancedComplete}
          // Enhanced props (original component will ignore unknown props)
          quizEngine={quizEngine}
          analytics={analytics}
          ai={ai}
          gamification={gamification}
        />
      </ExampleSectionMultipleAnswer>
    </div>
  );
};

/**
 * Simple Integration Test Component
 */
const SimpleIntegrationTest = () => {
  const [results, setResults] = useState([]);

  const handleComplete = (result) => {
    console.log('✅ Exercise completed:', result);
    setResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      result
    }]);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            🎯 Simple Integration Test - Day 1
          </h1>
          <p className="text-gray-600">
            Testing original MultipleAnswers component with backend system integration
          </p>
        </div>

        {/* Exercise */}
        <div className="p-6">
          <EnhancedMultipleAnswers
            data={sampleData}
            onComplete={handleComplete}
          />
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Test Results ({results.length})</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-3 text-sm">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">Exercise Completed</span>
                    <span className="text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-xs bg-white p-2 rounded">
                    {JSON.stringify(result.result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleIntegrationTest;
