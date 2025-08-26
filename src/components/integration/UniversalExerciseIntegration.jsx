/**
 * Universal Exercise Integration Component
 * Connects any original exercise component to the backend systems (QuizEngine, AI, Analytics, Gamification)
 * while preserving the original UI and functionality
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

// Import all original exercise components
import MultipleAnswers from '../multipleAnswers/MultipleAnswers';
import DragAndDrop from '../dragAndDrop/DragAndDrop';
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

// Exercise type mapping
const EXERCISE_COMPONENTS = {
  'multiple-answers': MultipleAnswers,
  'multiple-choice': MultipleChoice,
  'drag-and-drop': DragAndDrop,
  'fill-in-blanks': FillInTheBlanks,
  'gap-fill': GapFill,
  'highlight': Highlight,
  'click-to-change': ClickToChange,
  'sequencing': Sequencing,
  'table-exercise': TableExercise,
  'single-answer': SingleAnswer,
  'syllable-counting': SyllableCounting,
  'rhyme-exercises': RhymeExercises
};

export const UniversalExerciseIntegration = ({
  exerciseType,
  exerciseData = null,
  enableAI = true,
  enableAnalytics = true,
  enableGamification = true,
  onComplete = null,
  ...originalProps
}) => {
  // Backend Systems Integration
  const { 
    engine, 
    isReady: isEngineReady,
    currentQuestion,
    progress,
    submitAnswer,
    nextQuestion,
    getScore,
    getTimeElapsed,
    complete: completeExercise,
    reset: resetExercise
  } = useQuizEngine({
    type: exerciseType,
    questions: exerciseData?.questions || [],
    settings: {
      allowIncorrectProgression: true,
      maxHints: 3,
      autoSaveFrequency: 30000
    }
  });

  const ai = useAI({
    enabled: enableAI,
    exerciseType,
    adaptiveDifficulty: true,
    intelligentHints: true
  });

  const analytics = useAnalytics({
    enabled: enableAnalytics,
    trackingLevel: 'detailed'
  });

  const gamification = useGamification({
    enabled: enableGamification,
    exerciseType
  });

  const [integrationState, setIntegrationState] = useState({
    isInitialized: false,
    backendConnected: false,
    enhancedFeatures: {
      aiHints: false,
      adaptiveDifficulty: false,
      realTimeAnalytics: false,
      gamificationActive: false
    }
  });

  // Initialize integration
  useEffect(() => {
    const initializeIntegration = async () => {
      if (!isEngineReady) return;

      try {
        // Load exercise data into QuizEngine
        if (exerciseData?.questions) {
          await engine.loadExercise({
            type: exerciseType,
            questions: exerciseData.questions
          });
        }

        // Track exercise start
        if (analytics.isReady) {
          analytics.trackExerciseStart({
            id: `${exerciseType}-${Date.now()}`,
            type: exerciseType,
            difficulty: exerciseData?.difficulty || 'medium',
            questionCount: exerciseData?.questions?.length || 0
          });
        }

        setIntegrationState(prev => ({
          ...prev,
          isInitialized: true,
          backendConnected: true,
          enhancedFeatures: {
            aiHints: ai.isReady,
            adaptiveDifficulty: ai.isReady,
            realTimeAnalytics: analytics.isReady,
            gamificationActive: gamification.isReady
          }
        }));

      } catch (error) {
        console.error('Failed to initialize exercise integration:', error);
      }
    };

    initializeIntegration();
  }, [isEngineReady, exerciseType, exerciseData]);

  // Enhanced submit handler
  const createEnhancedSubmitHandler = useCallback((originalHandler) => {
    return async (answer, ...args) => {
      try {
        // Use QuizEngine for validation and scoring
        const validation = engine?.validate?.(answer);
        const score = engine?.calculateScore?.(validation);

        // Update QuizEngine state
        if (engine) {
          await submitAnswer(answer, validation, score);
        }

        // Track analytics
        if (analytics.isReady) {
          analytics.trackAnswerSubmitted({
            questionId: currentQuestion?.id || `question-${progress?.current}`,
            answer,
            isCorrect: validation?.isCorrect || false,
            timeSpent: engine?.getQuestionTime?.() || 0,
            exerciseType
          });
        }

        // AI enhancement
        if (ai.isReady && !validation?.isCorrect) {
          const hint = ai.generateIntelligentHint({
            question: currentQuestion,
            userAnswer: answer,
            exerciseType,
            currentQuestion: progress?.current,
            userAttempts: engine?.getUserAttempts?.()
          });
          console.log('AI Hint:', hint);
        }

        // Gamification
        if (gamification.isReady && validation?.isCorrect) {
          await gamification.awardXP({
            amount: score?.points || 10,
            reason: 'correct_answer',
            exerciseType
          });
        }

        // Call original handler with enhanced data
        if (originalHandler) {
          return originalHandler(answer, {
            validation,
            score,
            engineData: engine?.getState?.(),
            aiInsight: ai.isReady ? ai.getLastHint() : null,
            ...args
          });
        }

        return { validation, score };
      } catch (error) {
        console.error('Enhanced submit handler error:', error);
        
        // Track error
        if (analytics.isReady) {
          analytics.trackError({
            type: 'submit_handler',
            message: error.message,
            component: exerciseType
          });
        }

        // Fallback to original handler
        if (originalHandler) {
          return originalHandler(answer, ...args);
        }
      }
    };
  }, [engine, analytics.isReady, ai.isReady, gamification.isReady, currentQuestion, progress]);

  // Get the original component
  const OriginalComponent = EXERCISE_COMPONENTS[exerciseType];

  if (!OriginalComponent) {
    return (
      <div className="exercise-error p-8 text-center">
        <h2 className="text-xl font-bold text-red-600 mb-4">Exercise Type Not Found</h2>
        <p className="text-gray-600">Exercise type "{exerciseType}" is not supported.</p>
        <p className="text-sm text-gray-500 mt-2">
          Available types: {Object.keys(EXERCISE_COMPONENTS).join(', ')}
        </p>
      </div>
    );
  }

  // Show loading state while initializing
  if (!integrationState.isInitialized) {
    return (
      <div className="exercise-loading flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing enhanced exercise...</p>
          <div className="mt-4 space-y-1 text-sm text-gray-500">
            <div className="flex items-center justify-center gap-2">
              <span className={isEngineReady ? 'text-green-600' : 'text-gray-400'}>
                {isEngineReady && '✓'} QuizEngine
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={ai.isReady ? 'text-green-600' : 'text-gray-400'}>
                {ai.isReady && '✓'} AI Engine
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={analytics.isReady ? 'text-green-600' : 'text-gray-400'}>
                {analytics.isReady && '✓'} Analytics
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className={gamification.isReady ? 'text-green-600' : 'text-gray-400'}>
                {gamification.isReady && '✓'} Gamification
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced props to pass to original component
  const enhancedProps = {
    ...originalProps,
    
    // Backend integration data
    exerciseData: exerciseData || originalProps.exerciseData,
    
    // QuizEngine integration
    ...(engine && {
      currentQuestion,
      state: engine.getState(),
      currentScore: getScore(),
      timeElapsed: getTimeElapsed(),
      progress,
      // Enhanced handlers
      onSubmit: createEnhancedSubmitHandler(originalProps.onSubmit),
      onComplete: async (results) => {
        const completionData = await completeExercise();
        
        // Enhanced completion tracking
        if (analytics.isReady) {
          analytics.trackExerciseCompleted({
            exerciseId: `${exerciseType}-${Date.now()}`,
            totalDuration: getTimeElapsed(),
            finalScore: getScore().current,
            completion: 100
          });
        }

        if (onComplete) {
          onComplete({
            ...results,
            engineData: completionData,
            aiInsights: ai.isReady ? ai.getUserInsights() : null,
            analytics: analytics.isReady ? analytics.getInsights() : null,
            gamification: gamification.isReady ? gamification.getUserStats() : null
          });
        }
      }
    }),

    // AI enhancements
    ...(ai.isReady && {
      aiHint: ai.getLastHint(),
      adaptiveDifficulty: true,
      aiInsights: ai.getUserInsights()
    }),

    // Analytics enhancements
    ...(analytics.isReady && {
      trackInteraction: analytics.trackUserInteraction,
      trackPerformance: analytics.trackPerformance
    }),

    // Gamification enhancements
    ...(gamification.isReady && {
      currentStreak: gamification.getCurrentStreak(),
      userStats: gamification.getUserStats(),
      showCelebration: gamification.showCelebration
    })
  };

  return (
    <div className="universal-exercise-wrapper">
      {/* Integration Status Indicator (Development Only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="integration-status bg-gray-100 p-2 text-xs rounded mb-4">
          <div className="flex gap-4">
            <span className={`px-2 py-1 rounded text-xs ${engine ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
              QuizEngine: {engine ? 'Connected' : 'Disconnected'}
            </span>
            {ai.isReady && <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">AI ✓</span>}
            {analytics.isReady && <span className="px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">Analytics ✓</span>}
            {gamification.isReady && <span className="px-2 py-1 rounded text-xs bg-yellow-100 text-yellow-800">Gamification ✓</span>}
          </div>
        </div>
      )}

      {/* Original Component with Enhanced Features */}
      <OriginalComponent {...enhancedProps} />
    </div>
  );
};

export default UniversalExerciseIntegration;
