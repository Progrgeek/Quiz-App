/**
 * Enhanced Exercise Demo
 * Demonstrates the Universal Exercise Integration with all 12 exercise types
 * Shows before/after comparison of original vs enhanced components
 */

import React, { useState } from 'react';
import { UniversalExerciseIntegration } from '../integration/UniversalExerciseIntegration';
import { Button } from '../ui';

// Sample exercise data for each type
const SAMPLE_EXERCISE_DATA = {
  'multiple-answers': {
    questions: [
      {
        id: 'ma-1',
        question: 'Which animals are mammals?',
        options: [
          { word: 'Dog', isCorrect: true },
          { word: 'Cat', isCorrect: true },
          { word: 'Fish', isCorrect: false },
          { word: 'Bird', isCorrect: false }
        ],
        requiredSelections: 2,
        exerciseType: 'multiple-answers'
      }
    ],
    difficulty: 'medium'
  },
  
  'multiple-choice': {
    questions: [
      {
        id: 'mc-1',
        question: 'What is the capital of France?',
        options: ['London', 'Berlin', 'Paris', 'Madrid'],
        correctAnswer: 2,
        exerciseType: 'multiple-choice'
      }
    ],
    difficulty: 'easy'
  },

  'drag-and-drop': {
    questions: [
      {
        id: 'dd-1',
        question: 'Match the colors to their categories',
        items: ['Red', 'Blue', 'Green', 'Yellow'],
        categories: ['Primary Colors', 'Secondary Colors'],
        correctMatches: {
          'Red': 'Primary Colors',
          'Blue': 'Primary Colors',
          'Green': 'Secondary Colors',
          'Yellow': 'Primary Colors'
        },
        exerciseType: 'drag-and-drop'
      }
    ],
    difficulty: 'medium'
  },

  'fill-in-blanks': {
    questions: [
      {
        id: 'fib-1',
        question: 'Fill in the missing words',
        text: 'The quick brown ____ jumps over the lazy ____.',
        blanks: ['fox', 'dog'],
        exerciseType: 'fill-in-blanks'
      }
    ],
    difficulty: 'easy'
  },

  'gap-fill': {
    questions: [
      {
        id: 'gf-1',
        question: 'Complete the sentence',
        sentence: 'I ____ to school every day.',
        options: ['go', 'goes', 'going'],
        correctAnswer: 'go',
        exerciseType: 'gap-fill'
      }
    ],
    difficulty: 'easy'
  },

  'highlight': {
    questions: [
      {
        id: 'h-1',
        question: 'Highlight all the nouns in the sentence',
        text: 'The cat sat on the mat.',
        correctHighlights: ['cat', 'mat'],
        exerciseType: 'highlight'
      }
    ],
    difficulty: 'medium'
  },

  'click-to-change': {
    questions: [
      {
        id: 'ctc-1',
        question: 'Click on the words to change them to past tense',
        words: ['walk', 'run', 'jump'],
        correctChanges: ['walked', 'ran', 'jumped'],
        exerciseType: 'click-to-change'
      }
    ],
    difficulty: 'medium'
  },

  'sequencing': {
    questions: [
      {
        id: 's-1',
        question: 'Put these events in chronological order',
        items: ['Wake up', 'Eat breakfast', 'Go to school', 'Come home'],
        correctOrder: [0, 1, 2, 3],
        exerciseType: 'sequencing'
      }
    ],
    difficulty: 'easy'
  },

  'table-exercise': {
    questions: [
      {
        id: 'te-1',
        question: 'Complete the multiplication table',
        table: {
          headers: ['×', '2', '3', '4'],
          rows: [
            ['2', '4', '6', '8'],
            ['3', '6', '9', '?'],
            ['4', '8', '?', '16']
          ]
        },
        answers: ['12', '12'],
        exerciseType: 'table-exercise'
      }
    ],
    difficulty: 'medium'
  },

  'single-answer': {
    questions: [
      {
        id: 'sa-1',
        question: 'What is 2 + 2?',
        correctAnswer: '4',
        exerciseType: 'single-answer'
      }
    ],
    difficulty: 'easy'
  },

  'syllable-counting': {
    questions: [
      {
        id: 'sc-1',
        question: 'How many syllables are in these words?',
        words: ['butterfly', 'cat', 'elephant'],
        correctCounts: [3, 1, 3],
        exerciseType: 'syllable-counting'
      }
    ],
    difficulty: 'medium'
  },

  'rhyme-exercises': {
    questions: [
      {
        id: 're-1',
        question: 'Which words rhyme with "cat"?',
        targetWord: 'cat',
        options: ['bat', 'dog', 'hat', 'car'],
        correctRhymes: ['bat', 'hat'],
        exerciseType: 'rhyme-exercises'
      }
    ],
    difficulty: 'easy'
  }
};

export const EnhancedExerciseDemo = () => {
  const [selectedExerciseType, setSelectedExerciseType] = useState('multiple-answers');
  const [showComparison, setShowComparison] = useState(false);
  const [enhancementOptions, setEnhancementOptions] = useState({
    enableAI: true,
    enableAnalytics: true,
    enableGamification: true
  });

  const exerciseTypes = Object.keys(SAMPLE_EXERCISE_DATA);

  const handleExerciseComplete = (results) => {
    console.log('Exercise completed with enhanced data:', results);
    
    // Show completion summary
    alert(`Exercise completed!\n
    - Score: ${results.finalScore || 'N/A'}
    - AI Insights: ${results.aiInsights ? 'Available' : 'Not available'}
    - Analytics: ${results.analytics ? 'Tracked' : 'Not tracked'}
    - Gamification: ${results.gamification ? 'Active' : 'Not active'}
    `);
  };

  return (
    <div className="enhanced-exercise-demo p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enhanced Exercise System Demo
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          This demo shows how all 12 exercise types are now integrated with QuizEngine, AI, Analytics, and Gamification systems.
        </p>

        {/* Controls */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h2 className="text-xl font-semibold mb-4">Demo Controls</h2>
          
          {/* Exercise Type Selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Exercise Type:
            </label>
            <select
              value={selectedExerciseType}
              onChange={(e) => setSelectedExerciseType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {exerciseTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Enhancement Options */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Backend Systems:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enhancementOptions.enableAI}
                  onChange={(e) => setEnhancementOptions(prev => ({
                    ...prev,
                    enableAI: e.target.checked
                  }))}
                  className="mr-2"
                />
                AI Engine
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enhancementOptions.enableAnalytics}
                  onChange={(e) => setEnhancementOptions(prev => ({
                    ...prev,
                    enableAnalytics: e.target.checked
                  }))}
                  className="mr-2"
                />
                Analytics
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={enhancementOptions.enableGamification}
                  onChange={(e) => setEnhancementOptions(prev => ({
                    ...prev,
                    enableGamification: e.target.checked
                  }))}
                  className="mr-2"
                />
                Gamification
              </label>
            </div>
          </div>

          {/* Comparison Toggle */}
          <div className="mb-4">
            <Button
              onClick={() => setShowComparison(!showComparison)}
              variant="secondary"
            >
              {showComparison ? 'Hide' : 'Show'} Before/After Comparison
            </Button>
          </div>
        </div>

        {/* Current Exercise Info */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Current Exercise: {selectedExerciseType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </h3>
          <div className="text-sm text-blue-700">
            <p><strong>Backend Systems Active:</strong></p>
            <ul className="list-disc list-inside ml-4">
              {enhancementOptions.enableAI && <li>🤖 AI Engine - Adaptive difficulty, intelligent hints</li>}
              {enhancementOptions.enableAnalytics && <li>📊 Analytics - Real-time tracking, learning patterns</li>}
              {enhancementOptions.enableGamification && <li>🎮 Gamification - XP, achievements, streaks</li>}
              <li>⚙️ QuizEngine - Advanced state management, scoring, validation</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Exercise Demo */}
      <div className={showComparison ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' : ''}>
        {showComparison && (
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-900 mb-4">
              ❌ Before: Original Component (Isolated)
            </h3>
            <div className="text-sm text-red-700 mb-4">
              <p>Uses local state, manual scoring, no AI/analytics</p>
            </div>
            {/* Here you would show the original component for comparison */}
            <div className="bg-white p-4 rounded border-2 border-red-200">
              <p className="text-center text-gray-500">
                Original {selectedExerciseType} component
                <br />
                (Local state management only)
              </p>
            </div>
          </div>
        )}

        <div className={`${showComparison ? 'bg-green-50' : 'bg-white'} p-6 rounded-lg`}>
          {showComparison && (
            <h3 className="text-lg font-semibold text-green-900 mb-4">
              ✅ After: Enhanced with Backend Integration
            </h3>
          )}
          
          {/* Universal Exercise Integration */}
          <UniversalExerciseIntegration
            exerciseType={selectedExerciseType}
            exerciseData={SAMPLE_EXERCISE_DATA[selectedExerciseType]}
            enableAI={enhancementOptions.enableAI}
            enableAnalytics={enhancementOptions.enableAnalytics}
            enableGamification={enhancementOptions.enableGamification}
            onComplete={handleExerciseComplete}
          />
        </div>
      </div>

      {/* Benefits Summary */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🚀 What's Enhanced:
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-blue-600 mb-2">⚙️ QuizEngine</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Unified state management</li>
              <li>• Advanced scoring algorithms</li>
              <li>• Progress persistence</li>
              <li>• Timer management</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-600 mb-2">🤖 AI Engine</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Adaptive difficulty</li>
              <li>• Intelligent hints</li>
              <li>• Personalization</li>
              <li>• Learning recommendations</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-purple-600 mb-2">📊 Analytics</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Real-time tracking</li>
              <li>• Learning pattern analysis</li>
              <li>• Performance insights</li>
              <li>• Behavior monitoring</li>
            </ul>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-yellow-600 mb-2">🎮 Gamification</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• XP and leveling</li>
              <li>• Achievement system</li>
              <li>• Streak tracking</li>
              <li>• Social features</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedExerciseDemo;
