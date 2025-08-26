/**
 * Quiz Engine Provider
 * Context provider for sharing QuizEngine instance across components
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { QuizEngine } from '../engine/QuizEngine';
import { useQuizStore } from '../store/quizStore';

const QuizEngineContext = createContext(null);

export const useQuizEngineContext = () => {
  const context = useContext(QuizEngineContext);
  if (!context) {
    throw new Error('useQuizEngineContext must be used within a QuizEngineProvider');
  }
  return context;
};

export const QuizEngineProvider = ({ 
  children, 
  config = {},
  onEngineReady,
  onEngineError 
}) => {
  const [engine, setEngine] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  
  const quizStore = useQuizStore();
  
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setError(null);
        
        // Create new engine instance
        const newEngine = new QuizEngine(config);
        
        // Initialize the engine
        await newEngine.initialize();
        
        // Connect engine events to Zustand store
  setupEngineStoreIntegration(newEngine, useQuizStore);
        
        setEngine(newEngine);
        setIsReady(true);
        
        if (onEngineReady) {
          onEngineReady(newEngine);
        }
      } catch (err) {
        console.error('Failed to initialize QuizEngine:', err);
        setError(err);
        setIsReady(false);
        
        if (onEngineError) {
          onEngineError(err);
        }
      }
    };
    
    initializeEngine();
    
    // Cleanup on unmount
    return () => {
      if (engine) {
        engine.destroy();
      }
    };
  }, []);
  
  const value = {
    engine,
    isReady,
    error,
    
    // Convenience methods
    startExercise: async (exerciseData, exerciseConfig) => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      await engine.loadExercise(exerciseData, exerciseConfig);
      return engine.startExercise();
    },
    
    submitAnswer: async (answer) => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      return engine.submitAnswer(answer);
    },
    
    nextQuestion: () => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      return engine.nextQuestion();
    },
    
    previousQuestion: () => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      return engine.previousQuestion();
    },
    
    pauseExercise: () => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      return engine.pauseExercise();
    },
    
    resumeExercise: () => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      return engine.resumeExercise();
    },
    
    endExercise: () => {
      if (!engine || !isReady) {
        throw new Error('Engine not ready');
      }
      
      return engine.endExercise();
    },
    
    getResults: () => {
      if (!engine || !isReady) {
        return null;
      }
      
      return engine.getResults();
    }
  };
  
  return (
    <QuizEngineContext.Provider value={value}>
      {children}
    </QuizEngineContext.Provider>
  );
};

// Setup integration between engine events and Zustand store
function setupEngineStoreIntegration(engine, store) {
  const { actions } = store.getState();
  
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
  
  // Navigation events
  engine.on('nextQuestion', () => {
    actions.nextQuestion();
  });
  
  engine.on('previousQuestion', () => {
    actions.previousQuestion();
  });
  
  // Hint events
  engine.on('hintUsed', () => {
    actions.useHint();
  });
  
  // Score events
  engine.on('scoreUpdated', (data) => {
    actions.setScore(data.totalScore);
  });
  
  // UI state events
  engine.on('loadingStateChanged', (data) => {
    actions.setLoading(data.isLoading);
  });
  
  engine.on('feedbackShown', () => {
    // Feedback is already handled by submitAnswer action
  });
  
  engine.on('resultsReady', () => {
    actions.showResultsView();
  });
  
  // Error events
  engine.on('error', (error) => {
    console.error('QuizEngine error:', error);
    // Could add error state to store if needed
  });
}

export default QuizEngineProvider;
