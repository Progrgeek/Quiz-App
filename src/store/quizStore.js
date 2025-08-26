import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

/**
 * Global Quiz Store
 * Centralized state management for the entire quiz system
 */
export const useQuizStore = create(
  immer((set, get) => ({
    // Core state
    currentExercise: null,
    currentQuestionIndex: 0,
    totalQuestions: 0,
    exercises: new Map(),
    
    // Session state
    sessionId: null,
    sessionStartTime: null,
    sessionEndTime: null,
    isSessionActive: false,
    
    // UI state
    isLoading: false,
    showResults: false,
    showFeedback: false,
    currentView: 'exercise', // exercise, results, review
    
    // Exercise progress
    completedQuestions: new Set(),
    skippedQuestions: new Set(),
    answers: new Map(),
    
    // Scoring and performance
    currentScore: 0,
    streakCount: 0,
    longestStreak: 0,
    hintsUsed: 0,
    
    // Timing
    globalStartTime: null,
    questionStartTime: null,
    totalTime: 0,
    questionTimes: new Map(),
    
    // Configuration
    config: {
      allowSkip: true,
      allowHints: true,
      showFeedback: true,
      timeLimit: null,
      questionTimeLimit: null,
      autoNext: false,
      shuffleQuestions: false,
      shuffleAnswers: false,
    },
    
    // Actions
    actions: {
      // Session management
      startSession: (exerciseData, config = {}) => set((state) => {
        state.sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        state.sessionStartTime = Date.now();
        state.sessionEndTime = null;
        state.isSessionActive = true;
        state.currentExercise = exerciseData;
        state.totalQuestions = exerciseData?.questions?.length || 0;
        state.currentQuestionIndex = 0;
        state.config = { ...state.config, ...config };
        state.globalStartTime = Date.now();
        
        // Reset progress
        state.completedQuestions.clear();
        state.skippedQuestions.clear();
        state.answers.clear();
        state.currentScore = 0;
        state.streakCount = 0;
        state.longestStreak = 0;
        state.hintsUsed = 0;
        state.totalTime = 0;
        state.questionTimes.clear();
        
        // Reset UI state
        state.showResults = false;
        state.showFeedback = false;
        state.currentView = 'exercise';
      }),
      
      endSession: () => set((state) => {
        state.sessionEndTime = Date.now();
        state.isSessionActive = false;
        state.totalTime = state.sessionEndTime - state.sessionStartTime;
        state.currentView = 'results';
        state.showResults = true;
      }),
      
      pauseSession: () => set((state) => {
        state.isSessionActive = false;
      }),
      
      resumeSession: () => set((state) => {
        state.isSessionActive = true;
      }),
      
      // Question navigation
      nextQuestion: () => set((state) => {
        if (state.currentQuestionIndex < state.totalQuestions - 1) {
          state.currentQuestionIndex += 1;
          state.questionStartTime = Date.now();
          state.showFeedback = false;
        } else {
          // End of exercise
          get().actions.endSession();
        }
      }),
      
      previousQuestion: () => set((state) => {
        if (state.currentQuestionIndex > 0) {
          state.currentQuestionIndex -= 1;
          state.questionStartTime = Date.now();
          state.showFeedback = false;
        }
      }),
      
      goToQuestion: (questionIndex) => set((state) => {
        if (questionIndex >= 0 && questionIndex < state.totalQuestions) {
          state.currentQuestionIndex = questionIndex;
          state.questionStartTime = Date.now();
          state.showFeedback = false;
        }
      }),
      
      // Answer handling
      submitAnswer: (answer, validation) => set((state) => {
        const questionIndex = state.currentQuestionIndex;
        const now = Date.now();
        
        // Record timing
        const timeToAnswer = now - (state.questionStartTime || now);
        state.questionTimes.set(questionIndex, timeToAnswer);
        
        // Store answer and validation
        state.answers.set(questionIndex, {
          answer,
          validation,
          timeToAnswer,
          timestamp: now,
          hintsUsed: state.hintsUsed
        });
        
        // Update progress
        state.completedQuestions.add(questionIndex);
        state.skippedQuestions.delete(questionIndex);
        
        // Update streak
        if (validation.isCorrect) {
          state.streakCount += 1;
          state.longestStreak = Math.max(state.longestStreak, state.streakCount);
        } else {
          state.streakCount = 0;
        }
        
        // Show feedback
        if (state.config.showFeedback) {
          state.showFeedback = true;
        }
        
        // Auto-advance if configured
        if (state.config.autoNext) {
          setTimeout(() => {
            get().actions.nextQuestion();
          }, 2000);
        }
      }),
      
      skipQuestion: () => set((state) => {
        if (state.config.allowSkip) {
          const questionIndex = state.currentQuestionIndex;
          state.skippedQuestions.add(questionIndex);
          state.completedQuestions.delete(questionIndex);
          state.streakCount = 0;
          
          get().actions.nextQuestion();
        }
      }),
      
      // Hints
      useHint: () => set((state) => {
        if (state.config.allowHints) {
          state.hintsUsed += 1;
        }
      }),
      
      // Scoring
      updateScore: (points) => set((state) => {
        state.currentScore += points;
      }),
      
      setScore: (score) => set((state) => {
        state.currentScore = score;
      }),
      
      // UI state
      setLoading: (loading) => set((state) => {
        state.isLoading = loading;
      }),
      
      setCurrentView: (view) => set((state) => {
        state.currentView = view;
      }),
      
      showResultsView: () => set((state) => {
        state.currentView = 'results';
        state.showResults = true;
      }),
      
      hideFeedback: () => set((state) => {
        state.showFeedback = false;
      }),
      
      // Configuration
      updateConfig: (newConfig) => set((state) => {
        state.config = { ...state.config, ...newConfig };
      }),
      
      // Exercise management
      setCurrentExercise: (exercise) => set((state) => {
        state.currentExercise = exercise;
        state.totalQuestions = exercise?.questions?.length || 0;
      }),
      
      // Reset state
      reset: () => set((state) => {
        // Reset all state to initial values
        state.currentExercise = null;
        state.currentQuestionIndex = 0;
        state.totalQuestions = 0;
        state.sessionId = null;
        state.sessionStartTime = null;
        state.sessionEndTime = null;
        state.isSessionActive = false;
        state.isLoading = false;
        state.showResults = false;
        state.showFeedback = false;
        state.currentView = 'exercise';
        state.completedQuestions.clear();
        state.skippedQuestions.clear();
        state.answers.clear();
        state.currentScore = 0;
        state.streakCount = 0;
        state.longestStreak = 0;
        state.hintsUsed = 0;
        state.globalStartTime = null;
        state.questionStartTime = null;
        state.totalTime = 0;
        state.questionTimes.clear();
      }),
    },
    
    // Computed selectors
    selectors: {
      getCurrentQuestion: () => {
        const state = get();
        return state.currentExercise?.questions?.[state.currentQuestionIndex] || null;
      },
      
      getProgress: () => {
        const state = get();
        return {
          completed: state.completedQuestions.size,
          total: state.totalQuestions,
          percentage: state.totalQuestions > 0 ? 
            (state.completedQuestions.size / state.totalQuestions) * 100 : 0,
          skipped: state.skippedQuestions.size
        };
      },
      
      getScore: () => {
        const state = get();
        return {
          current: state.currentScore,
          streak: state.streakCount,
          longestStreak: state.longestStreak,
          hintsUsed: state.hintsUsed
        };
      },
      
      getAnswer: (questionIndex) => {
        const state = get();
        return state.answers.get(questionIndex) || null;
      },
      
      getCurrentAnswer: () => {
        const state = get();
        return state.answers.get(state.currentQuestionIndex) || null;
      },
      
      isQuestionCompleted: (questionIndex) => {
        const state = get();
        return state.completedQuestions.has(questionIndex);
      },
      
      isQuestionSkipped: (questionIndex) => {
        const state = get();
        return state.skippedQuestions.has(questionIndex);
      },
      
      canGoNext: () => {
        const state = get();
        return state.currentQuestionIndex < state.totalQuestions - 1;
      },
      
      canGoPrevious: () => {
        const state = get();
        return state.currentQuestionIndex > 0;
      },
      
      getSessionDuration: () => {
        const state = get();
        if (!state.sessionStartTime) return 0;
        
        const endTime = state.sessionEndTime || Date.now();
        return endTime - state.sessionStartTime;
      },
      
      getQuestionTime: (questionIndex) => {
        const state = get();
        return state.questionTimes.get(questionIndex) || 0;
      },
      
      getCurrentQuestionTime: () => {
        const state = get();
        return state.questionTimes.get(state.currentQuestionIndex) || 0;
      },
      
      getResults: () => {
        const state = get();
        const answers = Array.from(state.answers.entries());
        const correctAnswers = answers.filter(([_, data]) => data.validation.isCorrect).length;
        const accuracy = answers.length > 0 ? correctAnswers / answers.length : 0;
        
        return {
          sessionId: state.sessionId,
          totalQuestions: state.totalQuestions,
          answeredQuestions: answers.length,
          correctAnswers,
          skippedQuestions: state.skippedQuestions.size,
          accuracy: Math.round(accuracy * 100),
          score: state.currentScore,
          longestStreak: state.longestStreak,
          hintsUsed: state.hintsUsed,
          totalTime: state.totalTime,
          averageTimePerQuestion: answers.length > 0 ? 
            Array.from(state.questionTimes.values()).reduce((a, b) => a + b, 0) / answers.length : 0,
          sessionStartTime: state.sessionStartTime,
          sessionEndTime: state.sessionEndTime,
          answers: Object.fromEntries(state.answers)
        };
      }
    }
  }))
);

// Hook for easy access to actions
export const useQuizActions = () => {
  const actions = useQuizStore(state => state.actions);
  return actions;
};

// Hook for easy access to selectors
export const useQuizSelectors = () => {
  const selectors = useQuizStore(state => state.selectors);
  return selectors;
};

// Hook for specific state slices
export const useQuizProgress = () => {
  return useQuizStore(state => ({
    currentQuestionIndex: state.currentQuestionIndex,
    totalQuestions: state.totalQuestions,
    completedQuestions: state.completedQuestions.size,
    skippedQuestions: state.skippedQuestions.size,
    progress: (state.completedQuestions.size / state.totalQuestions) * 100
  }));
};

export const useQuizScore = () => {
  return useQuizStore(state => ({
    currentScore: state.currentScore,
    streakCount: state.streakCount,
    longestStreak: state.longestStreak,
    hintsUsed: state.hintsUsed
  }));
};

export const useQuizSession = () => {
  return useQuizStore(state => ({
    sessionId: state.sessionId,
    isSessionActive: state.isSessionActive,
    sessionStartTime: state.sessionStartTime,
    sessionEndTime: state.sessionEndTime,
    duration: state.sessionEndTime ? 
      state.sessionEndTime - state.sessionStartTime : 
      (state.sessionStartTime ? Date.now() - state.sessionStartTime : 0)
  }));
};

export const useQuizUI = () => {
  return useQuizStore(state => ({
    isLoading: state.isLoading,
    showResults: state.showResults,
    showFeedback: state.showFeedback,
    currentView: state.currentView
  }));
};

export default useQuizStore;
