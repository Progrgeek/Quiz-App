/**
 * Exercise Integration Router
 * Real implementation that connects any exercise type to backend systems
 * This replaces all the demo components with actual working integration
 */

import React, { useState, useEffect } from 'react';
import { Button } from '../ui';

// Import enhanced components with backend integration
import MultipleAnswersWithBackend from '../multipleAnswers/MultipleAnswersWithBackend';
import DragAndDropWithBackend from '../dragAndDrop/DragAndDropWithBackend';
import MultipleChoiceWithBackend from '../multipleChoice/MultipleChoiceWithBackend';
import FillInTheBlanksWithBackend from '../fillInTheBlanks/FillInTheBlanksWithBackend';
import GapFillWithBackend from '../gapFill/GapFillWithBackend';
import HighlightWithBackend from '../highlight/HighlightWithBackend';
import ClickToChangeWithBackend from '../clickToChange/ClickToChangeWithBackend';
import SequencingWithBackend from '../sequencing/SequencingWithBackend';
import TableExerciseWithBackend from '../tableExercise/TableExerciseWithBackend';
import SingleAnswerWithBackend from '../singleAnswer/SingleAnswerWithBackend';
import SyllableCountingWithBackend from '../syllableCounting/SyllableCountingWithBackend';
import RhymeExercisesWithBackend from '../rhymeExercises/RhymeExercisesWithBackend';

// Import original components (to be enhanced)
import FillInTheBlanks from '../fillInTheBlanks/FillInTheBlanks';
import GapFill from '../gapFill/GapFill';
import Highlight from '../highlight/Highlight';
import ClickToChange from '../clickToChange/ClickToChange';
import Sequencing from '../sequencing/Sequencing';
import TableExercise from '../tableExercise/TableExercise';
import MultipleChoice from '../multipleChoice/MultipleChoice';
import SingleAnswer from '../singleAnswer/SingleAnswer';
import SyllableCounting from '../syllableCounting/SyllableCounting';
import RhymeExercises from '../rhymeExercises/RhymeExercises';

const EXERCISE_TYPES = {
  'multiple-answers': {
    component: MultipleAnswersWithBackend,
    originalComponent: null, // MultipleAnswers already enhanced
    name: 'Multiple Answers',
    status: 'enhanced',
    description: 'Select multiple correct answers from options'
  },
  'drag-and-drop': {
    component: DragAndDropWithBackend,
    originalComponent: null, // DragAndDrop already enhanced
    name: 'Drag and Drop',
    status: 'enhanced',
    description: 'Drag items to correct categories'
  },
  'multiple-choice': {
    component: MultipleChoiceWithBackend,
    originalComponent: MultipleChoice,
    name: 'Multiple Choice',
    status: 'enhanced',
    description: 'Choose one correct answer'
  },
  'fill-in-blanks': {
    component: FillInTheBlanksWithBackend,
    originalComponent: FillInTheBlanks,
    name: 'Fill in Blanks',
    status: 'enhanced',
    description: 'Fill in missing words in sentences'
  },
  'gap-fill': {
    component: GapFillWithBackend,
    originalComponent: GapFill,
    name: 'Gap Fill',
    status: 'enhanced',
    description: 'Fill gaps using audio clues'
  },
  'highlight': {
    component: HighlightWithBackend,
    originalComponent: Highlight,
    name: 'Highlight',
    status: 'enhanced',
    description: 'Highlight vowels or correct pronouns'
  },
  'click-to-change': {
    component: ClickToChangeWithBackend,
    originalComponent: ClickToChange,
    name: 'Click to Change',
    status: 'enhanced',
    description: 'Click words to capitalize or identify pronouns'
  },
  'sequencing': {
    component: SequencingWithBackend,
    originalComponent: Sequencing,
    name: 'Sequencing',
    status: 'enhanced',
    description: 'Arrange items in correct order'
  },
  'table-exercise': {
    component: TableExerciseWithBackend,
    originalComponent: TableExercise,
    name: 'Table Exercise',
    status: 'enhanced',
    description: 'Match items in table format'
  },
  'single-answer': {
    component: SingleAnswerWithBackend,
    originalComponent: SingleAnswer,
    name: 'Single Answer',
    status: 'enhanced',
    description: 'Single answer syllable and rhyme exercises'
  },
  'syllable-counting': {
    component: SyllableCountingWithBackend,
    originalComponent: SyllableCounting,
    name: 'Syllable Counting',
    status: 'enhanced',
    description: 'Count syllables in words'
  },
  'rhyme-exercises': {
    component: RhymeExercisesWithBackend,
    originalComponent: RhymeExercises,
    name: 'Rhyme Exercises',
    status: 'enhanced',
    description: 'Identify rhyming words'
  }
};

export const ExerciseIntegrationRouter = () => {
  const [selectedExerciseType, setSelectedExerciseType] = useState('multiple-answers');
  const [enableBackendIntegration, setEnableBackendIntegration] = useState(true);
  const [exerciseConfig, setExerciseConfig] = useState({
    difficulty: 'medium',
    timeLimit: null,
    userId: 'user_' + Date.now()
  });
  const [exerciseResults, setExerciseResults] = useState(null);
  const [showResults, setShowResults] = useState(false);

  const selectedExercise = EXERCISE_TYPES[selectedExerciseType];
  const SelectedComponent = selectedExercise.component;

  const handleExerciseComplete = (results) => {
    console.log('Exercise completed:', results);
    setExerciseResults(results);
    setShowResults(true);
  };

  const resetExercise = () => {
    setExerciseResults(null);
    setShowResults(false);
    // Force component re-render by changing key
    setSelectedExerciseType(prev => prev);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'enhanced': return 'text-green-600 bg-green-50 border-green-200';
      case 'original': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'enhanced' ? '✅' : '🔄';
  };

  if (showResults && exerciseResults) {
    return (
      <div className="exercise-results p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Exercise Complete!</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-green-800">Final Score</h3>
              <p className="text-3xl font-bold text-green-600">
                {Math.round(exerciseResults.finalScore)}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-blue-800">Correct Answers</h3>
              <p className="text-3xl font-bold text-blue-600">
                {exerciseResults.correctAnswers}/{exerciseResults.questions.length}
              </p>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <h3 className="text-lg font-semibold text-purple-800">Time</h3>
              <p className="text-3xl font-bold text-purple-600">
                {Math.floor(exerciseResults.times[exerciseResults.times.length - 1] / 60)}:
                {(exerciseResults.times[exerciseResults.times.length - 1] % 60).toString().padStart(2, '0')}
              </p>
            </div>
          </div>

          {/* Backend Integration Results */}
          {enableBackendIntegration && exerciseResults.backendData && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Backend Integration Data</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {exerciseResults.backendData.quizEngine && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800">⚙️ QuizEngine</h3>
                    <p className="text-sm text-gray-600">State management and scoring active</p>
                  </div>
                )}
                
                {exerciseResults.backendData.analytics && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800">📊 Analytics</h3>
                    <p className="text-sm text-gray-600">
                      Session: {exerciseResults.backendData.analytics.sessionId?.substring(0, 8)}...
                    </p>
                  </div>
                )}
                
                {exerciseResults.backendData.gamification && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-800">🎮 Gamification</h3>
                    <p className="text-sm text-gray-600">
                      XP: {exerciseResults.backendData.gamification.xp}, 
                      Level: {exerciseResults.backendData.gamification.level}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Question Results */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Question Details</h2>
            <div className="space-y-4">
              {exerciseResults.questions.map((question, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">Question {index + 1}</h3>
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      question.isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {question.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{question.question}</p>
                  {question.timeSpent && (
                    <p className="text-sm text-gray-500">
                      Time: {Math.round(question.timeSpent)}s
                      {question.hintsUsed > 0 && ` • Hints used: ${question.hintsUsed}`}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={resetExercise}
              variant="primary"
            >
              Try Again
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/'}
              variant="secondary"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-integration-router p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Exercise Integration System
        </h1>
        <p className="text-lg text-gray-600 mb-6">
          Real backend integration for all 12 exercise types - QuizEngine, AI, Analytics, and Gamification
        </p>

        {/* Configuration Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Exercise Configuration</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Exercise Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Type:
              </label>
              <select
                value={selectedExerciseType}
                onChange={(e) => setSelectedExerciseType(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Object.entries(EXERCISE_TYPES).map(([key, exercise]) => (
                  <option key={key} value={key}>
                    {getStatusIcon(exercise.status)} {exercise.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Difficulty:
              </label>
              <select
                value={exerciseConfig.difficulty}
                onChange={(e) => setExerciseConfig(prev => ({
                  ...prev,
                  difficulty: e.target.value
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            {/* Backend Integration Toggle */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Backend Integration:
              </label>
              <div className="flex items-center h-10">
                <input
                  type="checkbox"
                  checked={enableBackendIntegration}
                  onChange={(e) => setEnableBackendIntegration(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm">
                  {enableBackendIntegration ? 'Enhanced' : 'Original'}
                </span>
              </div>
            </div>

            {/* User ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                User ID:
              </label>
              <input
                type="text"
                value={exerciseConfig.userId}
                onChange={(e) => setExerciseConfig(prev => ({
                  ...prev,
                  userId: e.target.value
                }))}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Exercise Status */}
          <div className={`p-3 rounded-lg border ${getStatusColor(selectedExercise.status)}`}>
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">
                  {getStatusIcon(selectedExercise.status)} {selectedExercise.name}
                </span>
                <p className="text-sm opacity-75 mt-1">{selectedExercise.description}</p>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">
                  {selectedExercise.status === 'enhanced' ? 'Backend Integrated' : 'Original Component'}
                </div>
                {enableBackendIntegration && selectedExercise.status === 'enhanced' && (
                  <div className="text-xs mt-1">
                    ⚙️ QuizEngine • 🤖 AI • 📊 Analytics • 🎮 Gamification
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise Component */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedExercise.name} Exercise
            </h2>
            {enableBackendIntegration && selectedExercise.status === 'enhanced' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Enhanced with Backend Systems
              </span>
            )}
            {!enableBackendIntegration && (
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Original Component
              </span>
            )}
            {enableBackendIntegration && selectedExercise.status === 'original' && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Backend Integration Coming Soon
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          <SelectedComponent
            key={`${selectedExerciseType}-${enableBackendIntegration}-${Date.now()}`}
            enableBackendIntegration={enableBackendIntegration && selectedExercise.status === 'enhanced'}
            exerciseConfig={exerciseConfig}
            onExerciseComplete={handleExerciseComplete}
          />
        </div>
      </div>
    </div>
  );
};

export default ExerciseIntegrationRouter;
