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
  preserveOriginalUI = true,
  ...props 
}) => {
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exerciseConfig, setExerciseConfig] = useState(null);
  const [rendererComponent, setRendererComponent] = useState(null);

  // Initialize engine with config
  const engineConfig = useMemo(() => ({
    id: exerciseId,
    type: exerciseType,
    data: exerciseData,
    ...config
  }), [exerciseId, exerciseType, exerciseData, config]);

  // Get engine instance
  const engine = useQuizEngine(engineConfig);

  // Get analytics and AI hooks if enabled
  const analytics = useAnalytics(enableAnalytics ? { componentName: 'UniversalExercise' } : null);
  const ai = useAI(enableAI ? {} : null);

  // Initialize exercise components and config
  useEffect(() => {
    const initializeExercise = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get exercise type configuration
        const typeConfig = exerciseTypeRegistry.getConfig(exerciseType);
        const renderer = exerciseTypeRegistry.getRenderer(exerciseType);

        if (!renderer) {
          throw new Error(`No renderer found for exercise type: ${exerciseType}`);
        }

        setExerciseConfig(typeConfig);
        setRendererComponent(() => renderer);

        // Track exercise initialization
        if (enableAnalytics && analytics) {
          analytics.trackExerciseStart({
            id: exerciseId,
            type: exerciseType,
            difficulty: exerciseData?.difficulty,
            questionsCount: exerciseData?.questions?.length || 1
          });
        }

      } catch (err) {
        setError(err.message);
        if (onError) onError(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (exerciseType && exerciseData) {
      initializeExercise();
    }
  }, [exerciseType, exerciseData, exerciseId, enableAnalytics, analytics, onError]);

  // Handle engine events
  useEffect(() => {
    if (!engine?.events) return;

    const handleProgress = (progressData) => {
      if (onProgress) onProgress(progressData);
      if (enableAnalytics && analytics) {
        analytics.trackEvent('exercise_progress', progressData);
      }
    };

    const handleComplete = (completionData) => {
      if (onComplete) onComplete(completionData);
      if (enableAnalytics && analytics) {
        analytics.trackExerciseCompleted(completionData);
      }
    };

    const handleError = (errorData) => {
      setError(errorData.message);
      if (onError) onError(errorData);
      if (enableAnalytics && analytics) {
        analytics.trackError(errorData);
      }
    };

    engine.events.on('progress:updated', handleProgress);
    engine.events.on('exercise:completed', handleComplete);
    engine.events.on('error:occurred', handleError);

    return () => {
      engine.events.off('progress:updated', handleProgress);
      engine.events.off('exercise:completed', handleComplete);
      engine.events.off('error:occurred', handleError);
    };
  }, [engine, onProgress, onComplete, onError, enableAnalytics, analytics]);

  // Enhanced answer submission with validation and scoring
  const handleAnswerSubmit = useCallback(async (answer, questionId = null) => {
    if (!engine) return;

    try {
      // Get validator and scorer
      const validator = exerciseTypeRegistry.getValidator(exerciseType);
      const scorer = exerciseTypeRegistry.getScorer(exerciseType);

      // Submit through engine
      const result = await engine.submitAnswer(answer, {
        validator,
        scorer,
        questionId
      });

      // Track answer submission
      if (enableAnalytics && analytics) {
        analytics.trackAnswerSubmitted({
          questionId: questionId || engine.currentQuestionIndex,
          answer,
          isCorrect: result.validation?.isCorrect,
          score: result.score?.points,
          timeToAnswer: result.timeToAnswer
        });
      }

      return result;

    } catch (err) {
      setError(err.message);
      if (onError) onError(err);
      return { error: err.message };
    }
  }, [engine, exerciseType, enableAnalytics, analytics, onError]);

  // Enhanced component with AI features
  const renderEnhancedExercise = () => {
    if (!rendererComponent) return null;

    const RendererComponent = rendererComponent;

    const exerciseProps = {
      ...props,
      exerciseData,
      engine,
      onAnswerSubmit: handleAnswerSubmit,
      onComplete,
      preserveOriginalUI
    };

    // If AI is enabled, wrap with AI enhancement
    if (enableAI && ai) {
      return (
        <AIEnhancedExercise
          exercise={{
            id: exerciseId,
            type: exerciseType,
            data: exerciseData,
            currentQuestion: engine?.getCurrentQuestion?.(),
            difficulty: exerciseData?.difficulty
          }}
          onComplete={onComplete}
        >
          <RendererComponent {...exerciseProps} />
        </AIEnhancedExercise>
      );
    }

    // Standard exercise rendering preserving original UI
    return <RendererComponent {...exerciseProps} />;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading exercise...</span>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Exercise Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
            <div className="mt-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-red-100 px-3 py-1 rounded-md text-sm text-red-800 hover:bg-red-200"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render with layout preservation
  if (preserveOriginalUI) {
    // Preserve original UI by rendering component directly
    return renderEnhancedExercise();
  }

  // Modern layout with engine integration
  return (
    <ExerciseLayout 
      engine={engine}
      className="universal-exercise"
    >
      {renderEnhancedExercise()}
    </ExerciseLayout>
  );
};

/**
 * Utility component for easy exercise type rendering
 */
export const ExerciseRenderer = ({ type, data, ...props }) => {
  const renderer = exerciseTypeRegistry.getRenderer(type);
  
  if (!renderer) {
    console.warn(`No renderer found for type: ${type}`);
    return <div>Unsupported exercise type: {type}</div>;
  }

  const RendererComponent = renderer;
  return <RendererComponent exerciseData={data} {...props} />;
};

/**
 * Quick exercise wrapper for legacy compatibility
 */
export const QuickExercise = ({ 
  type, 
  data, 
  onAnswer, 
  onComplete,
  showLayout = false,
  ...props 
}) => {
  const handleAnswerSubmit = async (answer) => {
    const validator = exerciseTypeRegistry.getValidator(type);
    const scorer = exerciseTypeRegistry.getScorer(type);
    
    if (validator) {
      const validation = validator(answer, data);
      const score = scorer ? scorer(validation, data) : { points: validation.score * 100 };
      
      if (onAnswer) {
        onAnswer({ answer, validation, score });
      }
      
      if (validation.isCorrect && onComplete) {
        onComplete({ validation, score });
      }
      
      return { validation, score };
    }
    
    if (onAnswer) onAnswer({ answer });
    return { answer };
  };

  if (showLayout) {
    return (
      <ExerciseLayout>
        <ExerciseRenderer 
          type={type} 
          data={data} 
          onAnswerSubmit={handleAnswerSubmit}
          {...props} 
        />
      </ExerciseLayout>
    );
  }

  return (
    <ExerciseRenderer 
      type={type} 
      data={data} 
      onAnswerSubmit={handleAnswerSubmit}
      {...props} 
    />
  );
};

// PropTypes
UniversalExercise.propTypes = {
  exerciseId: PropTypes.string.isRequired,
  exerciseType: PropTypes.string.isRequired,
  exerciseData: PropTypes.object.isRequired,
  config: PropTypes.object,
  onComplete: PropTypes.func,
  onProgress: PropTypes.func,
  onError: PropTypes.func,
  enableAI: PropTypes.bool,
  enableAnalytics: PropTypes.bool,
  preserveOriginalUI: PropTypes.bool
};

ExerciseRenderer.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired
};

QuickExercise.propTypes = {
  type: PropTypes.string.isRequired,
  data: PropTypes.object.isRequired,
  onAnswer: PropTypes.func,
  onComplete: PropTypes.func,
  showLayout: PropTypes.bool
};

export default UniversalExercise;
