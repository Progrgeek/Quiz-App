/**
 * Updated App.jsx with QuizEngine Integration
 * Main application component using the new QuizEngine system
 */

import React, { useState, useEffect } from 'react';
import { QuizEngineProvider } from './providers/QuizEngineProvider';
import UniversalExerciseWrapper from './components/exercises/UniversalExerciseWrapper';
import StatsIntegrationTest from './components/testing/StatsIntegrationTest';
import IntegrationTest from './components/testing/IntegrationTest';
import { useQuizStore } from './store/quizStore';

// Import exercise data - you would replace these with your actual data imports
import multipleChoiceExercises from './components/multipleChoice/multipleChoiceExercises.json';
import fillInTheBlanksExercises from './components/fillInTheBlanks/fillnTheBlanksExercises.json';
import dragAndDropExercises from './components/dragAndDrop/data/dragAndDropExercises.json';
// ... import other exercise data files

import './App.css';

const AppContent = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [isSelectingExercise, setIsSelectingExercise] = useState(true);
  
  const { currentView, showResults } = useQuizStore();
  
  // Sample exercise selector - replace with your actual exercise selection logic
  const exercises = [
    {
      id: 'test-stats',
      title: 'Test Original Stats Counters',
      type: 'test',
      component: StatsIntegrationTest,
      description: 'Test the original Stats component with QuizEngine integration'
    },
    {
      id: 'test-integration',
      title: 'Run Integration Tests',
      type: 'test',
      component: IntegrationTest,
      description: 'Comprehensive integration test suite'
    },
    {
      id: 'mc1',
      title: 'Multiple Choice Exercise',
      type: 'multipleChoice',
      data: multipleChoiceExercises?.[0],
      description: 'Test your knowledge with multiple choice questions'
    },
    {
      id: 'fib1',
      title: 'Fill in the Blanks',
      type: 'fillInTheBlanks',
      data: fillInTheBlanksExercises?.[0],
      description: 'Complete the sentences by filling in the missing words'
    },
    {
      id: 'dad1',
      title: 'Drag and Drop',
      type: 'dragAndDrop',
      data: dragAndDropExercises?.[0],
      description: 'Drag items to their correct positions'
    }
    // Add more exercises as needed
  ];
  
  const handleExerciseSelect = (exercise) => {
    setSelectedExercise(exercise);
    setIsSelectingExercise(false);
  };
  
  const handleExerciseComplete = (results) => {
    console.log('Exercise completed:', results);
    // Handle completion (save results, show summary, etc.)
  };
  
  const handleExerciseError = (error) => {
    console.error('Exercise error:', error);
    // Handle errors (show error message, fallback, etc.)
  };
  
  const handleBackToSelection = () => {
    setSelectedExercise(null);
    setIsSelectingExercise(true);
  };
  
  // Exercise selection screen
  if (isSelectingExercise) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to Quiz App
            </h1>
            <p className="text-lg text-gray-600">
              Choose an exercise to get started
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercises.map((exercise) => (
              <div
                key={exercise.id}
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleExerciseSelect(exercise)}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {exercise.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {exercise.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                    {exercise.type}
                  </span>
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    Start →
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500">
              Powered by QuizEngine v2.0
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  // Exercise view
  if (selectedExercise) {
    // Handle test components
    if (selectedExercise.type === 'test') {
      const TestComponent = selectedExercise.component;
      return (
        <div className="min-h-screen bg-gray-50">
          {/* Back button */}
          <div className="bg-white border-b px-4 py-2">
            <button
              onClick={handleBackToSelection}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Exercises</span>
            </button>
          </div>
          
          <TestComponent />
        </div>
      );
    }
    
    // Handle regular exercises
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Back button */}
        {(currentView === 'exercise' || showResults) && (
          <div className="bg-white border-b px-4 py-2">
            <button
              onClick={handleBackToSelection}
              className="text-blue-600 hover:text-blue-800 flex items-center space-x-2"
            >
              <span>←</span>
              <span>Back to Exercises</span>
            </button>
          </div>
        )}
        
        {/* Exercise wrapper */}
        <UniversalExerciseWrapper
          exerciseData={selectedExercise.data}
          config={{
            allowSkip: true,
            allowHints: true,
            showFeedback: true,
            enableScoring: true,
            enableTimer: true
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
          className="min-h-screen"
        />
      </div>
    );
  }
  
  // Fallback
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          No Exercise Selected
        </h2>
        <button
          onClick={() => setIsSelectingExercise(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Select Exercise
        </button>
      </div>
    </div>
  );
};

const App = () => {
  // QuizEngine configuration
  const engineConfig = {
    // Timing
    enableGlobalTimer: true,
    globalTimeLimit: null, // No global limit
    enableQuestionTimer: false,
    questionTimeLimit: null,
    
    // Behavior
    allowSkip: true,
    allowBack: true,
    allowRetry: false,
    maxAttempts: 1,
    
    // Hints and Help
    enableHints: true,
    maxHints: 3,
    hintPenalty: 0.1,
    
    // Feedback
    showImmediateFeedback: true,
    showCorrectAnswer: true,
    showExplanation: true,
    
    // Scoring
    enableScoring: true,
    scoringSystem: 'points',
    enablePartialCredit: true,
    enableTimeBonus: true,
    enableStreakBonus: true,
    
    // Randomization
    shuffleQuestions: false,
    shuffleAnswers: false,
    
    // Progress
    enableSaveProgress: true,
    autoSave: true,
    saveInterval: 30000,
    
    // UI
    showProgress: true,
    showScore: true,
    showTimer: true,
    theme: 'default'
  };
  
  const handleEngineReady = (engine) => {
    console.log('QuizEngine initialized successfully:', engine);
  };
  
  const handleEngineError = (error) => {
    console.error('QuizEngine initialization error:', error);
  };
  
  return (
    <QuizEngineProvider
      config={engineConfig}
      onEngineReady={handleEngineReady}
      onEngineError={handleEngineError}
    >
      <div className="App">
        <AppContent />
      </div>
    </QuizEngineProvider>
  );
};

export default App;
