/**
 * Quiz Engine Hooks
 * React hooks for integrating QuizEngine with React components
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { useQuizStore, useQuizActions, useQuizSelectors } from '../store/quizStore';
import { QuizEngine } from '../engine/QuizEngine';

// Main hook for QuizEngine integration
export const useQuizEngine = (config = {}) => {
  const engineRef = useRef(null);
  const [isEngineReady, setIsEngineReady] = useState(false);
  const [engineError, setEngineError] = useState(null);
  const [advancedFeatures, setAdvancedFeatures] = useState({
    autoSaveEnabled: false,
    bookmarksEnabled: true,
    hintsEnabled: true,
    lastAutoSave: null
  });
  
  const quizActions = useQuizActions();
  const quizSelectors = useQuizSelectors();
  
  // Initialize engine
  useEffect(() => {
    const initEngine = async () => {
      try {
        engineRef.current = new QuizEngine(config);
        await engineRef.current.initialize();
        
        // Connect engine events to store
        setupEngineEventHandlers(engineRef.current, quizActions);
        
        setIsEngineReady(true);
        setEngineError(null);
      } catch (error) {
        console.error('Failed to initialize QuizEngine:', error);
        setEngineError(error);
        setIsEngineReady(false);
      }
    };
    
    initEngine();
    
    // Cleanup
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy();
      }
    };
  }, []);
  
  // Engine methods wrapped with error handling
  const startExercise = useCallback(async (exerciseData, exerciseConfig = {}) => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      await engineRef.current.loadExercise(exerciseData, exerciseConfig);
      return engineRef.current.startExercise();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const submitAnswer = useCallback(async (answer) => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return await engineRef.current.submitAnswer(answer);
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const nextQuestion = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.nextQuestion();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const previousQuestion = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.previousQuestion();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const pauseExercise = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.pauseExercise();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const resumeExercise = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.resumeExercise();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const getHint = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.getHint();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const skipQuestion = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.skipQuestion();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const endExercise = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      throw new Error('QuizEngine not ready');
    }
    
    try {
      return engineRef.current.endExercise();
    } catch (error) {
      setEngineError(error);
      throw error;
    }
  }, [isEngineReady]);
  
  const getResults = useCallback(() => {
    if (!engineRef.current || !isEngineReady) {
      return null;
    }
    
    try {
      return engineRef.current.getResults();
    } catch (error) {
      setEngineError(error);
      return null;
    }
  }, [isEngineReady]);
  
  return {
    // Engine state
    isEngineReady,
    engineError,
    engine: engineRef.current,
    
    // Engine methods
    startExercise,
    submitAnswer,
    nextQuestion,
    previousQuestion,
    pauseExercise,
    resumeExercise,
    getHint,
    skipQuestion,
    endExercise,
    getResults,
    
    // Store selectors (for convenience)
    getCurrentQuestion: quizSelectors.getCurrentQuestion,
    getProgress: quizSelectors.getProgress,
    getScore: quizSelectors.getScore,
    getCurrentAnswer: quizSelectors.getCurrentAnswer,
    canGoNext: quizSelectors.canGoNext,
    canGoPrevious: quizSelectors.canGoPrevious
  };
};

// Hook for exercise-specific functionality
export const useExerciseEngine = (exerciseType) => {
  const {
    engine,
    isEngineReady,
    submitAnswer,
    getCurrentQuestion,
    getCurrentAnswer,
    ...rest
  } = useQuizEngine();
  
  // Exercise-type specific validation
  const validateAnswer = useCallback(async (answer) => {
    if (!engine || !isEngineReady) {
      return { isCorrect: false, feedback: 'Engine not ready' };
    }
    
    try {
      return await engine.validateAnswer(answer, exerciseType);
    } catch (error) {
      console.error('Validation error:', error);
      return { isCorrect: false, feedback: 'Validation failed' };
    }
  }, [engine, isEngineReady, exerciseType]);
  
  // Submit answer with exercise-specific handling
  const submitExerciseAnswer = useCallback(async (answer) => {
    const validation = await validateAnswer(answer);
    return await submitAnswer(answer, validation);
  }, [validateAnswer, submitAnswer]);
  
  return {
    ...rest,
    engine,
    isEngineReady,
    exerciseType,
    getCurrentQuestion,
    getCurrentAnswer,
    validateAnswer,
    submitAnswer: submitExerciseAnswer
  };
};

// Hook for timer integration
export const useQuizTimer = () => {
  const quizStore = useQuizStore();
  const { engine, isEngineReady } = useQuizEngine();
  
  const [timerState, setTimerState] = useState({
    globalTime: 0,
    questionTime: 0,
    isRunning: false,
    isPaused: false,
    timeRemaining: null,
    questionTimeRemaining: null
  });
  
  useEffect(() => {
    if (!engine || !isEngineReady) return;
    
    const timer = engine.timerManager;
    if (!timer) return;
    
    // Timer update handler
    const handleTimerUpdate = (data) => {
      setTimerState(prevState => ({
        ...prevState,
        globalTime: data.type === 'global' ? data.elapsed : prevState.globalTime,
        questionTime: data.type === 'question' ? data.elapsed : prevState.questionTime,
        timeRemaining: data.type === 'global' ? data.remaining : prevState.timeRemaining,
        questionTimeRemaining: data.type === 'question' ? data.remaining : prevState.questionTimeRemaining
      }));
    };
    
    // Pause/resume handlers
    const handlePaused = () => {
      setTimerState(prevState => ({
        ...prevState,
        isPaused: true,
        isRunning: false
      }));
    };
    
    const handleResumed = () => {
      setTimerState(prevState => ({
        ...prevState,
        isPaused: false,
        isRunning: true
      }));
    };
    
    // Register event handlers
    timer.on('timerUpdate', handleTimerUpdate);
    timer.on('paused', handlePaused);
    timer.on('resumed', handleResumed);
    
    // Cleanup
    return () => {
      timer.off('timerUpdate', handleTimerUpdate);
      timer.off('paused', handlePaused);
      timer.off('resumed', handleResumed);
    };
  }, [engine, isEngineReady]);
  
  const formatTime = useCallback((milliseconds) => {
    if (!engine?.timerManager) return '00:00';
    return engine.timerManager.formatTime(milliseconds);
  }, [engine]);
  
  return {
    ...timerState,
    formatTime,
    globalTimeFormatted: formatTime(timerState.globalTime),
    questionTimeFormatted: formatTime(timerState.questionTime)
  };
};

// Hook for score tracking
export const useQuizScore = () => {
  const quizStore = useQuizStore();
  const { engine, isEngineReady } = useQuizEngine();
  
  const [scoreState, setScoreState] = useState({
    currentScore: 0,
    maxPossibleScore: 0,
    percentage: 0,
    streak: 0,
    longestStreak: 0,
    breakdown: null
  });
  
  useEffect(() => {
    if (!engine || !isEngineReady) return;
    
    const scoreCalculator = engine.scoreCalculator;
    if (!scoreCalculator) return;
    
    // Update score state from store
    const updateScoreState = () => {
      const storeState = quizStore.getState();
      const questionsCount = storeState.totalQuestions;
      const maxScore = scoreCalculator.getMaximumPossibleScore(questionsCount);
      const percentage = scoreCalculator.getScorePercentage(storeState.currentScore, questionsCount);
      
      setScoreState({
        currentScore: storeState.currentScore,
        maxPossibleScore: maxScore,
        percentage,
        streak: storeState.streakCount,
        longestStreak: storeState.longestStreak,
        breakdown: null // Will be populated when exercise ends
      });
    };
    
    // Subscribe to store changes
    const unsubscribe = quizStore.subscribe(updateScoreState);
    updateScoreState(); // Initial update
    
    return unsubscribe;
  }, [engine, isEngineReady, quizStore]);
  
  return scoreState;
};

// ==================== ADVANCED FEATURES HOOKS (Day 15) ====================

// Hook for auto-save functionality
export const useAutoSave = (engine, enabled = true, interval = 30000) => {
  const [autoSaveState, setAutoSaveState] = useState({
    enabled: false,
    lastSave: null,
    saving: false
  });

  useEffect(() => {
    if (!engine || !enabled) return;

    // Enable auto-save on engine
    engine.enableAutoSave(interval);
    setAutoSaveState(prev => ({ ...prev, enabled: true }));

    // Listen for auto-save events
    const handleAutoSaved = (data) => {
      setAutoSaveState(prev => ({
        ...prev,
        lastSave: data.timestamp,
        saving: false
      }));
    };

    engine.events?.on('auto:saved', handleAutoSaved);

    return () => {
      engine.disableAutoSave();
      engine.events?.off('auto:saved', handleAutoSaved);
      setAutoSaveState(prev => ({ ...prev, enabled: false }));
    };
  }, [engine, enabled, interval]);

  return autoSaveState;
};

// Hook for hint system
export const useHints = (engine) => {
  const [hintState, setHintState] = useState({
    available: 0,
    used: 0,
    current: null,
    totalUsed: 0
  });

  useEffect(() => {
    if (!engine) return;

    const updateHintState = () => {
      const questionHints = engine.getHintsUsed();
      const totalHints = engine.getTotalHintsUsed();
      const maxHints = engine.maxHints || 3;

      setHintState({
        available: maxHints - questionHints.length,
        used: questionHints.length,
        current: questionHints[questionHints.length - 1] || null,
        totalUsed: totalHints
      });
    };

    // Listen for hint events
    engine.events?.on('hint:used', updateHintState);
    engine.events?.on('question:changed', updateHintState);

    // Initial update
    updateHintState();

    return () => {
      engine.events?.off('hint:used', updateHintState);
      engine.events?.off('question:changed', updateHintState);
    };
  }, [engine]);

  const getHint = useCallback((level = 1) => {
    if (!engine) return null;
    return engine.getHint(level);
  }, [engine]);

  return {
    ...hintState,
    getHint
  };
};

// Hook for bookmark system
export const useBookmarks = (engine) => {
  const [bookmarkState, setBookmarkState] = useState({
    bookmarkedQuestions: [],
    currentIsBookmarked: false,
    totalBookmarks: 0
  });

  useEffect(() => {
    if (!engine) return;

    const updateBookmarkState = () => {
      const bookmarked = engine.getBookmarkedQuestions();
      const currentIndex = engine.currentQuestionIndex;
      const isCurrentBookmarked = engine.isBookmarked(currentIndex);

      setBookmarkState({
        bookmarkedQuestions: bookmarked,
        currentIsBookmarked: isCurrentBookmarked,
        totalBookmarks: bookmarked.length
      });
    };

    // Listen for bookmark events
    engine.events?.on('bookmark:added', updateBookmarkState);
    engine.events?.on('bookmark:removed', updateBookmarkState);
    engine.events?.on('bookmarks:cleared', updateBookmarkState);
    engine.events?.on('question:changed', updateBookmarkState);

    // Initial update
    updateBookmarkState();

    return () => {
      engine.events?.off('bookmark:added', updateBookmarkState);
      engine.events?.off('bookmark:removed', updateBookmarkState);
      engine.events?.off('bookmarks:cleared', updateBookmarkState);
      engine.events?.off('question:changed', updateBookmarkState);
    };
  }, [engine]);

  const bookmarkQuestion = useCallback((questionIndex) => {
    if (!engine) return false;
    return engine.bookmarkQuestion(questionIndex);
  }, [engine]);

  const removeBookmark = useCallback((questionIndex) => {
    if (!engine) return false;
    return engine.removeBookmark(questionIndex);
  }, [engine]);

  const clearAllBookmarks = useCallback(() => {
    if (!engine) return 0;
    return engine.clearAllBookmarks();
  }, [engine]);

  return {
    ...bookmarkState,
    bookmarkQuestion,
    removeBookmark,
    clearAllBookmarks
  };
};

// Hook for pause/resume functionality
export const usePauseResume = (engine) => {
  const [pauseState, setPauseState] = useState({
    isPaused: false,
    canPause: false,
    canResume: false,
    totalPausedTime: 0
  });

  useEffect(() => {
    if (!engine) return;

    const updatePauseState = () => {
      setPauseState({
        isPaused: engine.isPaused,
        canPause: !engine.isPaused && !engine.isCompleted,
        canResume: engine.isPaused && !engine.isCompleted,
        totalPausedTime: engine.timer?.totalPausedDuration || 0
      });
    };

    // Listen for pause/resume events
    engine.events?.on('exercise:paused', updatePauseState);
    engine.events?.on('exercise:resumed', updatePauseState);
    engine.events?.on('exercise:completed', updatePauseState);

    // Initial update
    updatePauseState();

    return () => {
      engine.events?.off('exercise:paused', updatePauseState);
      engine.events?.off('exercise:resumed', updatePauseState);
      engine.events?.off('exercise:completed', updatePauseState);
    };
  }, [engine]);

  const pause = useCallback(() => {
    if (!engine) return false;
    engine.pause();
    return true;
  }, [engine]);

  const resume = useCallback(() => {
    if (!engine) return false;
    engine.resume();
    return true;
  }, [engine]);

  return {
    ...pauseState,
    pause,
    resume
  };
};

// Hook for advanced statistics
export const useAdvancedStats = (engine) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!engine) return;

    const updateStats = () => {
      const advancedStats = engine.getAdvancedStatistics();
      setStats(advancedStats);
    };

    // Listen for events that affect statistics
    engine.events?.on('answer:submitted', updateStats);
    engine.events?.on('hint:used', updateStats);
    engine.events?.on('bookmark:added', updateStats);
    engine.events?.on('bookmark:removed', updateStats);
    engine.events?.on('exercise:paused', updateStats);
    engine.events?.on('exercise:resumed', updateStats);

    // Initial update
    updateStats();

    return () => {
      engine.events?.off('answer:submitted', updateStats);
      engine.events?.off('hint:used', updateStats);
      engine.events?.off('bookmark:added', updateStats);
      engine.events?.off('bookmark:removed', updateStats);
      engine.events?.off('exercise:paused', updateStats);
      engine.events?.off('exercise:resumed', updateStats);
    };
  }, [engine]);

  return stats;
};

// Compound hook that combines all advanced features
export const useAdvancedQuizEngine = (config = {}) => {
  const baseEngine = useQuizEngine(config);
  const autoSave = useAutoSave(baseEngine.engine, config.enableAutoSave, config.autoSaveInterval);
  const hints = useHints(baseEngine.engine);
  const bookmarks = useBookmarks(baseEngine.engine);
  const pauseResume = usePauseResume(baseEngine.engine);
  const advancedStats = useAdvancedStats(baseEngine.engine);

  return {
    ...baseEngine,
    autoSave,
    hints,
    bookmarks,
    pauseResume,
    advancedStats
  };
};

// Setup engine event handlers to sync with store
function setupEngineEventHandlers(engine, actions) {
  // Exercise lifecycle events
  engine.on('exerciseStarted', (data) => {
    actions.startSession(data.exercise, data.config);
  });
  
  engine.on('exerciseEnded', (data) => {
    actions.endSession();
  });
  
  engine.on('exercisePaused', () => {
    actions.pauseSession();
  });
  
  engine.on('exerciseResumed', () => {
    actions.resumeSession();
  });
  
  // Question events
  engine.on('questionStarted', (data) => {
    actions.goToQuestion(data.questionIndex);
  });
  
  engine.on('answerSubmitted', (data) => {
    actions.submitAnswer(data.answer, data.validation);
  });
  
  engine.on('questionSkipped', () => {
    actions.skipQuestion();
  });
  
  // Hint events
  engine.on('hintUsed', () => {
    actions.useHint();
  });
  
  // Score events
  engine.on('scoreUpdated', (data) => {
    actions.setScore(data.totalScore);
  });
  
  // Navigation events
  engine.on('nextQuestion', () => {
    actions.nextQuestion();
  });
  
  engine.on('previousQuestion', () => {
    actions.previousQuestion();
  });
}
