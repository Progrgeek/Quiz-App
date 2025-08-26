/**
 * Universal Exercise Component
 * Central component that handles all exercise types through the unified engine
 * Preserves original Quiz UI while providing modern functionality
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { exerciseTypeRegistry } from '../../engine/ExerciseTypeRegistry';
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAI } from '../../hooks/useAI';
import ExerciseLayout, { QuestionHeader } from '../layout/ExerciseLayout';
import AIEnhancedExercise from '../ai/AIEnhancedExercise';

/**
 * Main Universal Exercise Component
 */
const UniversalExercise = ({ 
  exerciseId, 
  exerciseType, 
  exerciseData,
  config = {},
  onComplete,
  onProgress,
  onError,
  enableAI = true,
  enableAnalytics = true,
  preserveOriginalUI = true
}) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize quiz engine with configuration
  const engine = useQuizEngine(exerciseId, exerciseType, {
    ...config,
    enableAI,
    enableAnalytics
  });

  // Get the appropriate renderer for this exercise type
  const ExerciseRenderer = getExerciseRenderer(exerciseType);

  // Initialize exercise when component mounts
  useEffect(() => {
    const initializeExercise = async () => {
      try {
        setError(null);
        await engine.start();
        setIsInitialized(true);
      } catch (err) {
        console.error('Failed to initialize exercise:', err);
        setError(err.message || 'Failed to initialize exercise');
      }
    };

    if (engine && !isInitialized) {
      initializeExercise();
    }
  }, [engine, isInitialized]);

  // Handle exercise completion
  const handleComplete = useCallback((results) => {
    if (onComplete) {
      onComplete({
        ...results,
        exerciseId,
        exerciseType,
        engineState: engine.getState()
      });
    }
  }, [onComplete, exerciseId, exerciseType, engine]);

  // Handle progress updates
  const handleProgress = useCallback((progress) => {
    if (onProgress) {
      onProgress({
        ...progress,
        exerciseId,
        exerciseType
      });
    }
  }, [onProgress, exerciseId, exerciseType]);

  // Handle answer submission
  const handleAnswerSubmit = useCallback(async (answer) => {
    try {
      const result = await engine.submitAnswer(answer);
      
      // Handle automatic progression or completion
      if (engine.hasNextQuestion()) {
        setTimeout(() => {
          engine.nextQuestion();
        }, config.autoProgressDelay || 1500);
      } else {
        const finalResults = engine.getFinalResults();
        handleComplete(finalResults);
      }
      
      return result;
    } catch (err) {
      console.error('Failed to submit answer:', err);
      setError(err.message || 'Failed to submit answer');
      return null;
    }
  }, [engine, config.autoProgressDelay, handleComplete]);

  // Handle navigation
  const handleNext = useCallback(() => {
    if (engine.hasNextQuestion()) {
      engine.nextQuestion();
      handleProgress(engine.getProgress());
    }
  }, [engine, handleProgress]);

  const handlePrevious = useCallback(() => {
    if (engine.hasPreviousQuestion()) {
      engine.previousQuestion();
      handleProgress(engine.getProgress());
    }
  }, [engine, handleProgress]);

  // Handle pause/resume
  const handlePause = useCallback(() => {
    engine.pause();
  }, [engine]);

  const handleResume = useCallback(() => {
    engine.resume();
  }, [engine]);

  // Error state
  if (error) {
    return (
      <div className={`universal-exercise error ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Exercise Error</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            Reload Exercise
          </button>
        </div>
      </div>
    );
  }

  // Loading state
  if (!isInitialized || !engine.getCurrentQuestion()) {
    return (
      <div className={`universal-exercise loading ${className}`}>
        <LoadingSpinner message="Initializing exercise..." />
      </div>
    );
  }

  // No renderer available
  if (!ExerciseRenderer) {
    return (
      <div className={`universal-exercise error ${className}`}>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <div className="text-yellow-500 text-4xl mb-4">🚧</div>
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unsupported Exercise Type</h3>
          <p className="text-yellow-600">
            No renderer available for exercise type: <code>{exerciseType}</code>
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`universal-exercise ${exerciseType} ${className}`}>
        <ExerciseLayout engine={engine}>
          {/* Question Header with Progress */}
          <QuestionHeader 
            question={engine.getCurrentQuestion()}
            progress={engine.getProgress()}
            timer={engine.getTimer()}
            score={engine.getScore()}
            showScore={config.showScore !== false}
            showTimer={config.showTimer !== false}
            showProgress={config.showProgress !== false}
          />

          {/* Dynamic Exercise Renderer */}
          <div className="exercise-content">
            <ExerciseRenderer 
              question={engine.getCurrentQuestion()}
              onAnswer={handleAnswerSubmit}
              state={engine.getQuestionState()}
              config={config}
              engine={engine}
            />
          </div>

          {/* Exercise Controls */}
          <ExerciseControls 
            engine={engine}
            onNext={handleNext}
            onPrevious={handlePrevious}
            onPause={handlePause}
            onResume={handleResume}
            onComplete={handleComplete}
            config={config}
          />
        </ExerciseLayout>
      </div>
    </ErrorBoundary>
  );
};

// Higher-order component for adding exercise lifecycle management
export const withExerciseLifecycle = (WrappedComponent) => {
  return function ExerciseWithLifecycle(props) {
    const [exerciseState, setExerciseState] = useState('idle'); // idle, starting, active, paused, completed, error
    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);

    const handleStart = useCallback(() => {
      setExerciseState('starting');
      setStartTime(Date.now());
    }, []);

    const handleReady = useCallback(() => {
      setExerciseState('active');
    }, []);

    const handlePause = useCallback(() => {
      setExerciseState('paused');
    }, []);

    const handleResume = useCallback(() => {
      setExerciseState('active');
    }, []);

    const handleComplete = useCallback((results) => {
      setExerciseState('completed');
      setEndTime(Date.now());
      
      if (props.onComplete) {
        props.onComplete({
          ...results,
          startTime,
          endTime: Date.now(),
          totalDuration: Date.now() - startTime
        });
      }
    }, [props, startTime]);

    const handleError = useCallback((error) => {
      setExerciseState('error');
      console.error('Exercise error:', error);
    }, []);

    return (
      <WrappedComponent
        {...props}
        exerciseState={exerciseState}
        onStart={handleStart}
        onReady={handleReady}
        onPause={handlePause}
        onResume={handleResume}
        onComplete={handleComplete}
        onError={handleError}
        startTime={startTime}
        endTime={endTime}
      />
    );
  };
};

// Wrapper component for backward compatibility
export const UniversalExerciseWrapper = ({ children, ...exerciseProps }) => {
  return (
    <UniversalExercise {...exerciseProps}>
      {children}
    </UniversalExercise>
  );
};

export default UniversalExercise;
