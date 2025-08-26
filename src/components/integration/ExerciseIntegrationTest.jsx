/**
 * Exercise Integration Test - Week 1, Day 3-4
 * 
 * Tests all 12 exercise types with QuizEngine, ValidationEngine, 
 * ScoreCalculator, and TimerManager integration.
 */

import React, { useState, useEffect } from 'react';
import { exerciseEnhancer, EnhancedExercises } from '../../integration/ExerciseEnhancer';
import { useExerciseIntegration } from '../../hooks/useExerciseIntegration';

// Sample exercise data for all 12 types
const SAMPLE_EXERCISE_DATA = {
  'multiple-answers': {
    question: "Which words rhyme with 'cat'?",
    options: [
      { id: 1, word: "bat", isCorrect: true },
      { id: 2, word: "hat", isCorrect: true },
      { id: 3, word: "dog", isCorrect: false },
      { id: 4, word: "rat", isCorrect: true }
    ],
    difficulty: 'easy'
  },

  'multiple-choice': {
    question: "What color is the sun?",
    options: [
      { id: 1, text: "Blue", isCorrect: false },
      { id: 2, text: "Yellow", isCorrect: true },
      { id: 3, text: "Green", isCorrect: false },
      { id: 4, text: "Purple", isCorrect: false }
    ],
    difficulty: 'easy'
  },

  'single-answer': {
    question: "What is 2 + 2?",
    correctAnswer: "4",
    acceptableAnswers: ["4", "four", "Four"],
    difficulty: 'easy'
  },

  'drag-and-drop': {
    question: "Sort these animals by size:",
    items: [
      { id: 1, content: "Mouse", category: "Small" },
      { id: 2, content: "Elephant", category: "Large" },
      { id: 3, content: "Cat", category: "Medium" },
      { id: 4, content: "Whale", category: "Large" }
    ],
    categories: ["Small", "Medium", "Large"],
    difficulty: 'medium'
  },

  'fill-in-the-blanks': {
    question: "Complete the sentence:",
    text: "The _____ is shining brightly in the _____.",
    blanks: [
      { id: 1, correctAnswer: "sun" },
      { id: 2, correctAnswer: "sky" }
    ],
    difficulty: 'easy'
  },

  'gap-fill': {
    question: "Choose the correct words:",
    text: "I went to the _____ to buy some _____.",
    gaps: [
      { id: 1, options: ["store", "park", "school"], correct: "store" },
      { id: 2, options: ["books", "toys", "food"], correct: "food" }
    ],
    difficulty: 'easy'
  },

  'click-to-change': {
    question: "Click the words in alphabetical order:",
    elements: [
      { id: 1, word: "Dog", order: 2 },
      { id: 2, word: "Apple", order: 1 },
      { id: 3, word: "Zoo", order: 4 },
      { id: 4, word: "Hat", order: 3 }
    ],
    difficulty: 'medium'
  },

  'highlight': {
    question: "Highlight all the nouns:",
    text: "The dog ran quickly to the park.",
    correctHighlights: ["dog", "park"],
    difficulty: 'medium'
  },

  'rhyme-exercises': {
    question: "Find words that rhyme with 'tree':",
    words: ["bee", "car", "free", "dog", "sea", "hat"],
    rhymePattern: "ee",
    correctMatches: ["bee", "free", "sea"],
    difficulty: 'medium'
  },

  'syllable-counting': {
    question: "How many syllables are in this word?",
    word: "butterfly",
    correctCount: 3,
    audioSupport: true,
    difficulty: 'medium'
  },

  'sequencing': {
    question: "Put these events in order:",
    items: [
      { id: 1, content: "Wake up", order: 1 },
      { id: 2, content: "Go to sleep", order: 4 },
      { id: 3, content: "Eat lunch", order: 3 },
      { id: 4, content: "Eat breakfast", order: 2 }
    ],
    difficulty: 'easy'
  },

  'table-exercise': {
    question: "Complete the multiplication table:",
    table: {
      headers: ["×", "2", "3", "4"],
      rows: [
        ["2", "4", "6", "8"],
        ["3", "6", "", "12"],
        ["4", "8", "12", ""]
      ]
    },
    emptyCells: [{ row: 1, col: 2, answer: "9" }, { row: 2, col: 3, answer: "16" }],
    difficulty: 'medium'
  }
};

const ExerciseIntegrationTest = () => {
  const [selectedExercise, setSelectedExercise] = useState('multiple-answers');
  const [testResults, setTestResults] = useState({});
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);

  const exerciseTypes = Object.keys(SAMPLE_EXERCISE_DATA);
  const exerciseData = SAMPLE_EXERCISE_DATA[selectedExercise];

  // Integration hook for the current exercise
  const integration = useExerciseIntegration(selectedExercise, exerciseData);

  useEffect(() => {
    // Initialize exercise when selection changes
    if (integration.quizEngine) {
      integration.initializeExercise();
    }
  }, [selectedExercise, integration.quizEngine]);

  const handleExerciseComplete = (result) => {
    console.log('Exercise completed:', result);
    
    setTestResults(prev => ({
      ...prev,
      [selectedExercise]: {
        timestamp: new Date().toISOString(),
        result,
        integration: {
          quizEngine: integration.quizEngine,
          validation: integration.validation,
          scoring: integration.scoring,
          timing: integration.timing
        },
        exerciseState: integration.exerciseState
      }
    }));
  };

  const testAllExercises = async () => {
    setIsTestingAll(true);
    setCurrentTestIndex(0);
    
    for (let i = 0; i < exerciseTypes.length; i++) {
      setCurrentTestIndex(i);
      const exerciseType = exerciseTypes[i];
      
      console.log(`Testing ${exerciseType}...`);
      
      // Simulate exercise interaction
      await new Promise(resolve => {
        setSelectedExercise(exerciseType);
        setTimeout(() => {
          // Simulate completion
          handleExerciseComplete({
            completed: true,
            exerciseType,
            testMode: true,
            timestamp: Date.now()
          });
          resolve();
        }, 1000);
      });
    }
    
    setIsTestingAll(false);
    setCurrentTestIndex(0);
  };

  const clearResults = () => {
    setTestResults({});
  };

  // Get Enhanced Component for current exercise
  const EnhancedComponent = EnhancedExercises[selectedExercise];

  return (
    <div className="exercise-integration-test max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Exercise Integration Test - Day 3-4
          </h1>
          <p className="text-gray-600">
            Testing all 12 exercise types with QuizEngine, ValidationEngine, ScoreCalculator, and TimerManager
          </p>
        </div>

        {/* Test Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-wrap items-center gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Exercise Type:
              </label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                disabled={isTestingAll}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm min-w-48"
              >
                {exerciseTypes.map(type => (
                  <option key={type} value={type}>
                    {type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex space-x-2">
              <button
                onClick={testAllExercises}
                disabled={isTestingAll}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
              >
                {isTestingAll ? `Testing ${currentTestIndex + 1}/${exerciseTypes.length}...` : 'Test All Exercises'}
              </button>
              
              <button
                onClick={clearResults}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear Results
              </button>
            </div>
          </div>

          {/* Integration Status */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Backend Integration Status</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${integration.quizEngine ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>QuizEngine</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${integration.validation ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Validation</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${integration.scoring ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Scoring</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${integration.timing ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Timing</span>
              </div>
            </div>
          </div>
        </div>

        {/* Exercise Display */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">
                Current Exercise: {selectedExercise.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </h2>
              
              {integration.exerciseState.isInitialized && (
                <div className="flex items-center space-x-4 text-sm">
                  <span className="text-green-600">✓ Initialized</span>
                  <span>Score: {integration.exerciseState.totalScore}</span>
                  <span>Questions: {integration.exerciseState.questionResults.length}</span>
                </div>
              )}
            </div>

            {/* Enhanced Exercise Component */}
            {EnhancedComponent && (
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <EnhancedComponent
                  data={exerciseData}
                  exerciseData={exerciseData}
                  onComplete={handleExerciseComplete}
                  key={selectedExercise} // Force re-render on exercise change
                />
              </div>
            )}
          </div>
        </div>

        {/* Test Results */}
        {Object.keys(testResults).length > 0 && (
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold mb-4">
              Test Results ({Object.keys(testResults).length}/{exerciseTypes.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(testResults).map(([exerciseType, result]) => (
                <div key={exerciseType} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">
                      {exerciseType.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div className={`px-2 py-1 rounded ${result.integration.quizEngine ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        QuizEngine: {result.integration.quizEngine ? '✓' : '✗'}
                      </div>
                      <div className={`px-2 py-1 rounded ${result.integration.validation ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Validation: {result.integration.validation ? '✓' : '✗'}
                      </div>
                      <div className={`px-2 py-1 rounded ${result.integration.scoring ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Scoring: {result.integration.scoring ? '✓' : '✗'}
                      </div>
                      <div className={`px-2 py-1 rounded ${result.integration.timing ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        Timing: {result.integration.timing ? '✓' : '✗'}
                      </div>
                    </div>
                    
                    {result.exerciseState && (
                      <div className="mt-2 p-2 bg-white rounded text-xs">
                        <div>Initialized: {result.exerciseState.isInitialized ? '✓' : '✗'}</div>
                        <div>Total Score: {result.exerciseState.totalScore}</div>
                        <div>Questions: {result.exerciseState.questionResults.length}</div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Integration Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {['quizEngine', 'validation', 'scoring', 'timing'].map(system => {
                  const successful = Object.values(testResults).filter(r => r.integration[system]).length;
                  const total = Object.keys(testResults).length;
                  const percentage = total > 0 ? Math.round((successful / total) * 100) : 0;
                  
                  return (
                    <div key={system} className="text-center">
                      <div className="text-lg font-semibold text-blue-900">{percentage}%</div>
                      <div className="text-blue-700 capitalize">{system}</div>
                      <div className="text-xs text-blue-600">{successful}/{total}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Exercise Configuration Display */}
        <div className="p-6 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Current Exercise Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold mb-2">Validation Config</h4>
              {integration.engines.validation.validationConfig && (
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(integration.engines.validation.validationConfig, null, 2)}
                </pre>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold mb-2">Scoring Config</h4>
              {integration.engines.scoring.scoringConfig && (
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(integration.engines.scoring.scoringConfig, null, 2)}
                </pre>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-3">
              <h4 className="font-semibold mb-2">Timer Config</h4>
              {integration.engines.timing.timerConfig && (
                <pre className="text-xs bg-white p-2 rounded overflow-auto max-h-32">
                  {JSON.stringify(integration.engines.timing.timerConfig, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseIntegrationTest;
