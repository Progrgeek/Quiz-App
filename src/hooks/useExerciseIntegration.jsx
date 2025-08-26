/**
 * Exercise-Specific QuizEngine Integration
 * Week 1, Day 3-4: Connects each exercise type to QuizEngine systems
 */

import { useCallback, useEffect, useState } from 'react';
import { useQuizEngine } from './useQuizEngine';

/**
 * Validation Engine Integration
 * Handles exercise-specific validation logic
 */
export const useValidationEngine = (exerciseType) => {
  const { engine, isEngineReady } = useQuizEngine();
  const [validationConfig, setValidationConfig] = useState(null);

  useEffect(() => {
    if (!engine || !isEngineReady) return;

    // Configure validation based on exercise type
    const config = getValidationConfig(exerciseType);
    setValidationConfig(config);
    
    if (engine.validationEngine) {
      engine.validationEngine.configure(config);
    }
  }, [engine, isEngineReady, exerciseType]);

  const validateAnswer = useCallback(async (answer, questionData) => {
    if (!engine?.validationEngine || !validationConfig) {
      return { isCorrect: false, feedback: 'Validation not ready' };
    }

    try {
      return await engine.validationEngine.validate(answer, questionData, validationConfig);
    } catch (error) {
      console.error('Validation error:', error);
      return { isCorrect: false, feedback: 'Validation failed', error };
    }
  }, [engine, validationConfig]);

  const getValidationRules = useCallback(() => {
    return validationConfig?.rules || [];
  }, [validationConfig]);

  return {
    validateAnswer,
    getValidationRules,
    validationConfig,
    isReady: !!validationConfig
  };
};

/**
 * Score Calculator Integration
 * Handles exercise-specific scoring logic
 */
export const useScoreCalculator = (exerciseType) => {
  const { engine, isEngineReady } = useQuizEngine();
  const [scoringConfig, setScoringConfig] = useState(null);
  const [currentScore, setCurrentScore] = useState(0);

  useEffect(() => {
    if (!engine || !isEngineReady) return;

    // Configure scoring based on exercise type
    const config = getScoringConfig(exerciseType);
    setScoringConfig(config);
    
    if (engine.scoreCalculator) {
      engine.scoreCalculator.configure(config);
    }
  }, [engine, isEngineReady, exerciseType]);

  const calculateScore = useCallback((validation, questionData, timeSpent) => {
    if (!engine?.scoreCalculator || !scoringConfig) {
      return { score: 0, breakdown: null };
    }

    try {
      const scoreResult = engine.scoreCalculator.calculate(validation, questionData, timeSpent, scoringConfig);
      setCurrentScore(prev => prev + scoreResult.score);
      return scoreResult;
    } catch (error) {
      console.error('Score calculation error:', error);
      return { score: 0, breakdown: null, error };
    }
  }, [engine, scoringConfig]);

  const resetScore = useCallback(() => {
    setCurrentScore(0);
    if (engine?.scoreCalculator) {
      engine.scoreCalculator.reset();
    }
  }, [engine]);

  return {
    calculateScore,
    resetScore,
    currentScore,
    scoringConfig,
    isReady: !!scoringConfig
  };
};

/**
 * Timer Manager Integration
 * Handles exercise-specific timing logic
 */
export const useTimerManager = (exerciseType) => {
  const { engine, isEngineReady } = useQuizEngine();
  const [timerConfig, setTimerConfig] = useState(null);
  const [timeState, setTimeState] = useState({
    exerciseTime: 0,
    questionTime: 0,
    isRunning: false,
    isPaused: false
  });

  useEffect(() => {
    if (!engine || !isEngineReady) return;

    // Configure timing based on exercise type
    const config = getTimerConfig(exerciseType);
    setTimerConfig(config);
    
    if (engine.timerManager) {
      engine.timerManager.configure(config);
      
      // Listen for timer events
      const handleTimerUpdate = (timerData) => {
        setTimeState(prev => ({
          ...prev,
          exerciseTime: timerData.exerciseTime || prev.exerciseTime,
          questionTime: timerData.questionTime || prev.questionTime,
          isRunning: timerData.isRunning ?? prev.isRunning,
          isPaused: timerData.isPaused ?? prev.isPaused
        }));
      };

      engine.timerManager.on('update', handleTimerUpdate);
      
      return () => {
        engine.timerManager.off('update', handleTimerUpdate);
      };
    }
  }, [engine, isEngineReady, exerciseType]);

  const startTimer = useCallback((type = 'question') => {
    if (engine?.timerManager) {
      engine.timerManager.start(type);
    }
  }, [engine]);

  const pauseTimer = useCallback(() => {
    if (engine?.timerManager) {
      engine.timerManager.pause();
    }
  }, [engine]);

  const resumeTimer = useCallback(() => {
    if (engine?.timerManager) {
      engine.timerManager.resume();
    }
  }, [engine]);

  const stopTimer = useCallback(() => {
    if (engine?.timerManager) {
      engine.timerManager.stop();
    }
  }, [engine]);

  return {
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    timeState,
    timerConfig,
    isReady: !!timerConfig
  };
};

/**
 * Unified Exercise Hook
 * Combines all exercise-specific integrations
 */
export const useExerciseIntegration = (exerciseType, exerciseData) => {
  const quizEngine = useQuizEngine();
  const validation = useValidationEngine(exerciseType);
  const scoring = useScoreCalculator(exerciseType);
  const timing = useTimerManager(exerciseType);

  const [exerciseState, setExerciseState] = useState({
    isInitialized: false,
    currentQuestion: null,
    exerciseCompleted: false,
    totalScore: 0,
    questionResults: []
  });

  // Initialize exercise
  const initializeExercise = useCallback(async () => {
    if (!quizEngine.isEngineReady) return false;

    try {
      await quizEngine.initialize({
        id: `${exerciseType}_${Date.now()}`,
        type: exerciseType,
        data: exerciseData
      });

      setExerciseState(prev => ({
        ...prev,
        isInitialized: true
      }));

      timing.startTimer('exercise');
      return true;
    } catch (error) {
      console.error('Exercise initialization failed:', error);
      return false;
    }
  }, [quizEngine, exerciseType, exerciseData, timing]);

  // Submit answer for current question
  const submitAnswer = useCallback(async (answer) => {
    if (!exerciseState.isInitialized) {
      throw new Error('Exercise not initialized');
    }

    timing.startTimer('question');
    
    try {
      // Validate answer
      const validationResult = await validation.validateAnswer(answer, exerciseData);
      
      // Calculate score
      const scoreResult = scoring.calculateScore(
        validationResult, 
        exerciseData, 
        timing.timeState.questionTime
      );

      // Submit to QuizEngine
      const submissionResult = await quizEngine.submitAnswer(answer);

      const questionResult = {
        answer,
        validation: validationResult,
        score: scoreResult,
        timeSpent: timing.timeState.questionTime,
        timestamp: Date.now()
      };

      setExerciseState(prev => ({
        ...prev,
        questionResults: [...prev.questionResults, questionResult],
        totalScore: prev.totalScore + scoreResult.score
      }));

      timing.stopTimer();
      
      return {
        ...submissionResult,
        validation: validationResult,
        score: scoreResult
      };
    } catch (error) {
      console.error('Answer submission failed:', error);
      throw error;
    }
  }, [exerciseState.isInitialized, validation, scoring, timing, quizEngine, exerciseData]);

  // Complete exercise
  const completeExercise = useCallback(() => {
    timing.stopTimer();
    
    setExerciseState(prev => ({
      ...prev,
      exerciseCompleted: true
    }));

    return {
      completed: true,
      totalScore: exerciseState.totalScore,
      results: exerciseState.questionResults,
      totalTime: timing.timeState.exerciseTime
    };
  }, [timing, exerciseState]);

  return {
    // Engine states
    quizEngine: quizEngine.isEngineReady,
    validation: validation.isReady,
    scoring: scoring.isReady,
    timing: timing.isReady,
    
    // Exercise state
    exerciseState,
    
    // Actions
    initializeExercise,
    submitAnswer,
    completeExercise,
    
    // Individual engine access
    engines: {
      quiz: quizEngine,
      validation,
      scoring,
      timing
    }
  };
};

// =================================================================
// CONFIGURATION FUNCTIONS
// =================================================================

function getValidationConfig(exerciseType) {
  const configs = {
    'multiple-answers': {
      mode: 'multiple-selection',
      rules: [
        { type: 'min-selections', value: 1 },
        { type: 'partial-credit', enabled: true },
        { type: 'case-sensitive', enabled: false }
      ],
      feedback: {
        correct: 'Great! You selected all correct answers.',
        partial: 'Good! You got some correct answers.',
        incorrect: 'Try again. Look for words that sound similar.'
      }
    },

    'multiple-choice': {
      mode: 'single-selection',
      rules: [
        { type: 'exact-match', enabled: true },
        { type: 'partial-credit', enabled: false }
      ],
      feedback: {
        correct: 'Correct! Well done.',
        incorrect: 'Not quite right. Try again.'
      }
    },

    'single-answer': {
      mode: 'text-input',
      rules: [
        { type: 'exact-match', enabled: true },
        { type: 'case-sensitive', enabled: false },
        { type: 'trim-whitespace', enabled: true },
        { type: 'alternative-answers', enabled: true }
      ],
      feedback: {
        correct: 'Perfect! That\'s the right answer.',
        incorrect: 'Not quite. Check your spelling and try again.'
      }
    },

    'drag-and-drop': {
      mode: 'position-mapping',
      rules: [
        { type: 'position-accuracy', threshold: 0.8 },
        { type: 'partial-credit', enabled: true }
      ],
      feedback: {
        correct: 'Excellent! All items are in the right place.',
        partial: 'Good! Some items are correctly placed.',
        incorrect: 'Try again. Think about where each item belongs.'
      }
    },

    'fill-in-the-blanks': {
      mode: 'text-blanks',
      rules: [
        { type: 'per-blank-validation', enabled: true },
        { type: 'case-sensitive', enabled: false },
        { type: 'partial-credit', enabled: true }
      ],
      feedback: {
        correct: 'Perfect! All blanks filled correctly.',
        partial: 'Good work! Some blanks are correct.',
        incorrect: 'Review the context and try again.'
      }
    },

    'gap-fill': {
      mode: 'gap-selection',
      rules: [
        { type: 'context-awareness', enabled: true },
        { type: 'partial-credit', enabled: false }
      ],
      feedback: {
        correct: 'Great! You chose the right words.',
        incorrect: 'Think about what makes sense in context.'
      }
    },

    'click-to-change': {
      mode: 'click-sequence',
      rules: [
        { type: 'sequence-order', strict: true },
        { type: 'timing-sensitive', enabled: false }
      ],
      feedback: {
        correct: 'Perfect sequence! Well done.',
        incorrect: 'Check the order and try again.'
      }
    },

    'highlight': {
      mode: 'text-selection',
      rules: [
        { type: 'selection-accuracy', enabled: true },
        { type: 'partial-credit', enabled: true }
      ],
      feedback: {
        correct: 'Excellent! You highlighted all correct text.',
        partial: 'Good! You found some correct highlights.',
        incorrect: 'Look more carefully at the instructions.'
      }
    },

    'rhyme-exercises': {
      mode: 'rhyme-matching',
      rules: [
        { type: 'phonetic-matching', enabled: true },
        { type: 'pattern-recognition', enabled: true }
      ],
      feedback: {
        correct: 'Great! You found all the rhyming words.',
        incorrect: 'Listen to the sounds and try again.'
      }
    },

    'syllable-counting': {
      mode: 'number-input',
      rules: [
        { type: 'exact-count', enabled: true },
        { type: 'audio-support', enabled: true }
      ],
      feedback: {
        correct: 'Perfect! You counted the syllables correctly.',
        incorrect: 'Try clapping along with each syllable.'
      }
    },

    'sequencing': {
      mode: 'order-arrangement',
      rules: [
        { type: 'logical-order', enabled: true },
        { type: 'partial-credit', enabled: true }
      ],
      feedback: {
        correct: 'Excellent! Perfect sequence.',
        partial: 'Good! Some items are in the right order.',
        incorrect: 'Think about the logical order and try again.'
      }
    },

    'table-exercise': {
      mode: 'table-completion',
      rules: [
        { type: 'cell-by-cell', enabled: true },
        { type: 'partial-credit', enabled: true }
      ],
      feedback: {
        correct: 'Perfect! All cells completed correctly.',
        partial: 'Good! Some cells are correct.',
        incorrect: 'Review the patterns and try again.'
      }
    }
  };

  return configs[exerciseType] || configs['multiple-choice'];
}

function getScoringConfig(exerciseType) {
  const configs = {
    'multiple-answers': {
      method: 'partial-credit',
      maxScore: 100,
      penalties: { incorrect: -10, skip: -5 },
      bonuses: { perfect: 20, speed: 10 }
    },

    'multiple-choice': {
      method: 'all-or-nothing',
      maxScore: 100,
      penalties: { incorrect: 0, skip: -10 },
      bonuses: { speed: 15 }
    },

    'single-answer': {
      method: 'exact-match',
      maxScore: 100,
      penalties: { incorrect: -5, skip: -10 },
      bonuses: { 'first-try': 25, speed: 10 }
    },

    'drag-and-drop': {
      method: 'position-based',
      maxScore: 100,
      penalties: { misplaced: -15, skip: -10 },
      bonuses: { perfect: 30, efficient: 15 }
    },

    'fill-in-the-blanks': {
      method: 'per-blank',
      maxScore: 100,
      penalties: { incorrect: -8, skip: -5 },
      bonuses: { perfect: 25, speed: 10 }
    },

    'gap-fill': {
      method: 'all-or-nothing',
      maxScore: 100,
      penalties: { incorrect: 0, skip: -15 },
      bonuses: { speed: 20 }
    },

    'click-to-change': {
      method: 'sequence-based',
      maxScore: 100,
      penalties: { 'wrong-order': -20, skip: -10 },
      bonuses: { perfect: 35, speed: 15 }
    },

    'highlight': {
      method: 'partial-credit',
      maxScore: 100,
      penalties: { 'over-highlight': -5, skip: -10 },
      bonuses: { precise: 20, complete: 25 }
    },

    'rhyme-exercises': {
      method: 'pattern-based',
      maxScore: 100,
      penalties: { incorrect: -10, skip: -15 },
      bonuses: { 'pattern-mastery': 30, speed: 10 }
    },

    'syllable-counting': {
      method: 'exact-match',
      maxScore: 100,
      penalties: { incorrect: -15, skip: -10 },
      bonuses: { 'first-try': 30, consistency: 20 }
    },

    'sequencing': {
      method: 'sequence-accuracy',
      maxScore: 100,
      penalties: { 'wrong-position': -12, skip: -10 },
      bonuses: { perfect: 35, logical: 20 }
    },

    'table-exercise': {
      method: 'cell-based',
      maxScore: 100,
      penalties: { incorrect: -8, skip: -5 },
      bonuses: { complete: 30, efficient: 15 }
    }
  };

  return configs[exerciseType] || configs['multiple-choice'];
}

function getTimerConfig(exerciseType) {
  const configs = {
    'multiple-answers': {
      strategy: 'per-question',
      defaultTime: 45000, // 45 seconds
      showWarning: true,
      warningTime: 10000 // 10 seconds
    },

    'multiple-choice': {
      strategy: 'per-question',
      defaultTime: 30000, // 30 seconds
      showWarning: true,
      warningTime: 5000 // 5 seconds
    },

    'single-answer': {
      strategy: 'per-question',
      defaultTime: 60000, // 60 seconds
      showWarning: true,
      warningTime: 15000 // 15 seconds
    },

    'drag-and-drop': {
      strategy: 'extended',
      defaultTime: 120000, // 2 minutes
      showWarning: true,
      warningTime: 30000 // 30 seconds
    },

    'fill-in-the-blanks': {
      strategy: 'per-question',
      defaultTime: 90000, // 90 seconds
      showWarning: true,
      warningTime: 20000 // 20 seconds
    },

    'gap-fill': {
      strategy: 'per-question',
      defaultTime: 60000, // 60 seconds
      showWarning: true,
      warningTime: 15000 // 15 seconds
    },

    'click-to-change': {
      strategy: 'per-question',
      defaultTime: 45000, // 45 seconds
      showWarning: true,
      warningTime: 10000 // 10 seconds
    },

    'highlight': {
      strategy: 'per-question',
      defaultTime: 75000, // 75 seconds
      showWarning: true,
      warningTime: 15000 // 15 seconds
    },

    'rhyme-exercises': {
      strategy: 'per-question',
      defaultTime: 60000, // 60 seconds
      showWarning: true,
      warningTime: 15000 // 15 seconds
    },

    'syllable-counting': {
      strategy: 'per-question',
      defaultTime: 30000, // 30 seconds
      showWarning: true,
      warningTime: 10000 // 10 seconds
    },

    'sequencing': {
      strategy: 'extended',
      defaultTime: 150000, // 2.5 minutes
      showWarning: true,
      warningTime: 30000 // 30 seconds
    },

    'table-exercise': {
      strategy: 'extended',
      defaultTime: 180000, // 3 minutes
      showWarning: true,
      warningTime: 45000 // 45 seconds
    }
  };

  return configs[exerciseType] || configs['multiple-choice'];
}
