/**
 * Exercise Layout Component
 * Provides consistent layout structure for all exercises while preserving original UI
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ExerciseLayout = ({ 
  engine, 
  children, 
  showProgress = true,
  showTimer = true,
  showControls = true,
  className = ""
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [progress, setProgress] = useState({ current: 0, total: 0, percentage: 0 });
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [exerciseState, setExerciseState] = useState('ready');

  // Update state when engine changes
  useEffect(() => {
    if (!engine) return;

    const updateState = () => {
      setCurrentQuestion(engine.getCurrentQuestion?.() || null);
      setProgress(engine.getProgress?.() || { current: 0, total: 0, percentage: 0 });
      setExerciseState(engine.getState?.() || 'ready');
    };

    // Initial update
    updateState();

    // Listen to engine events if available
    if (engine.events) {
      engine.events.on('question:changed', updateState);
      engine.events.on('progress:updated', updateState);
      engine.events.on('state:changed', updateState);

      return () => {
        engine.events.off('question:changed', updateState);
        engine.events.off('progress:updated', updateState);
        engine.events.off('state:changed', updateState);
      };
    }
  }, [engine]);

  // Timer effect
  useEffect(() => {
    if (!showTimer || exerciseState !== 'in_progress') return;

    const interval = setInterval(() => {
      if (engine?.timer?.getElapsedTime) {
        setTimeElapsed(engine.timer.getElapsedTime());
      } else {
        setTimeElapsed(prev => prev + 1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engine, exerciseState, showTimer]);

  const formatTime = (milliseconds) => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`exercise-layout ${className}`}>
      {/* Exercise Header - preserving original Quiz UI style */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <div className="flex justify-between items-center">
          {/* Progress Section */}
          {showProgress && progress.total > 0 && (
            <div className="flex items-center space-x-3">
              <div className="text-sm font-medium text-gray-700">
                Question {progress.current} of {progress.total}
              </div>
              <div className="w-32 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress.percentage}%` }}
                />
              </div>
              <div className="text-sm text-gray-500">
                {Math.round(progress.percentage)}%
              </div>
            </div>
          )}

          {/* Timer Section */}
          {showTimer && (
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-sm font-mono text-gray-700">
                {formatTime(timeElapsed)}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Question Header - preserving original style */}
      {currentQuestion && (
        <QuestionHeader 
          question={currentQuestion}
          questionNumber={progress.current}
          totalQuestions={progress.total}
        />
      )}

      {/* Main Exercise Content - original component rendered here */}
      <div className="exercise-content">
        {children}
      </div>

      {/* Exercise Controls - preserving original button styles */}
      {showControls && (
        <ExerciseControls 
          engine={engine}
          exerciseState={exerciseState}
          currentQuestion={progress.current}
          totalQuestions={progress.total}
        />
      )}
    </div>
  );
};

/**
 * Question Header Component
 * Displays question information while preserving original UI style
 */
const QuestionHeader = ({ question, questionNumber, totalQuestions }) => {
  if (!question) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Question Title */}
      {question.title && (
        <h2 className="text-xl font-semibold text-gray-900 mb-3">
          {question.title}
        </h2>
      )}

      {/* Question Text */}
      {question.question && (
        <div className="text-gray-700 mb-4">
          {typeof question.question === 'string' ? (
            <p className="text-lg leading-relaxed">{question.question}</p>
          ) : (
            question.question
          )}
        </div>
      )}

      {/* Question Instructions */}
      {question.instructions && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <p className="text-sm text-blue-800">
            <span className="font-medium">Instructions: </span>
            {question.instructions}
          </p>
        </div>
      )}

      {/* Question Metadata */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center space-x-4">
          {question.difficulty && (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyStyle(question.difficulty)}`}>
              {question.difficulty.charAt(0).toUpperCase() + question.difficulty.slice(1)}
            </span>
          )}
          
          {question.estimatedTime && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              ~{question.estimatedTime}s
            </span>
          )}

          {question.points && (
            <span className="flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {question.points} pts
            </span>
          )}
        </div>

        {questionNumber && totalQuestions && (
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Exercise Controls Component
 * Navigation and action buttons preserving original button styles
 */
const ExerciseControls = ({ engine, exerciseState, currentQuestion, totalQuestions }) => {
  const handlePrevious = () => {
    if (engine?.previousQuestion) {
      engine.previousQuestion();
    }
  };

  const handleNext = () => {
    if (engine?.nextQuestion) {
      engine.nextQuestion();
    }
  };

  const handlePause = () => {
    if (engine?.pause) {
      engine.pause();
    }
  };

  const handleResume = () => {
    if (engine?.resume) {
      engine.resume();
    }
  };

  const handleReset = () => {
    if (engine?.reset && confirm('Are you sure you want to reset this exercise?')) {
      engine.reset();
    }
  };

  const canGoPrevious = currentQuestion > 1;
  const canGoNext = currentQuestion < totalQuestions;
  const isPaused = exerciseState === 'paused';
  const isCompleted = exerciseState === 'completed';

  if (isCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 mt-4">
        <div className="flex justify-center">
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <div className="flex justify-between items-center">
        {/* Left side - Previous button */}
        <div>
          <button
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className={`px-4 py-2 rounded-md transition-colors ${
              canGoPrevious
                ? 'bg-gray-500 text-white hover:bg-gray-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            ← Previous
          </button>
        </div>

        {/* Center - Pause/Resume controls */}
        <div className="flex space-x-2">
          {isPaused ? (
            <button
              onClick={handleResume}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
            >
              ▶ Resume
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
            >
              ⏸ Pause
            </button>
          )}
          
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            🔄 Reset
          </button>
        </div>

        {/* Right side - Next button */}
        <div>
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className={`px-4 py-2 rounded-md transition-colors ${
              canGoNext
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function for difficulty styling
const getDifficultyStyle = (difficulty) => {
  const styles = {
    beginner: 'bg-green-100 text-green-800',
    easy: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    hard: 'bg-red-100 text-red-800',
    advanced: 'bg-red-100 text-red-800',
    expert: 'bg-purple-100 text-purple-800'
  };
  return styles[difficulty?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

ExerciseLayout.propTypes = {
  engine: PropTypes.object,
  children: PropTypes.node.isRequired,
  showProgress: PropTypes.bool,
  showTimer: PropTypes.bool,
  showControls: PropTypes.bool,
  className: PropTypes.string
};

QuestionHeader.propTypes = {
  question: PropTypes.object,
  questionNumber: PropTypes.number,
  totalQuestions: PropTypes.number
};

ExerciseControls.propTypes = {
  engine: PropTypes.object,
  exerciseState: PropTypes.string,
  currentQuestion: PropTypes.number,
  totalQuestions: PropTypes.number
};

export default ExerciseLayout;
export { QuestionHeader, ExerciseControls };
