/**
 * React Hook for AI Engine Integration
 * Provides AI-powered features for React components
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import AIEngine from '../ai/AIEngine';

// Global AI instance
let aiInstance = null;

export const useAI = (config = {}) => {
  const [ai] = useState(() => {
    if (!aiInstance) {
      aiInstance = new AIEngine(config);
    }
    return aiInstance;
  });
  
  const [userInsights, setUserInsights] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [adaptedDifficulty, setAdaptedDifficulty] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Update insights periodically
  useEffect(() => {
    const updateInsights = () => {
      try {
        const insights = ai.getUserInsights();
        setUserInsights(insights);
        setRecommendations(insights.recommendations || []);
      } catch (error) {
        console.error('Failed to get AI insights:', error);
      }
    };
    
    updateInsights();
    const interval = setInterval(updateInsights, 60000); // Every minute
    
    return () => clearInterval(interval);
  }, [ai]);
  
  // AI-powered methods
  const analyzePerformance = useCallback(async (performanceData) => {
    setIsAnalyzing(true);
    try {
      const analysis = ai.analyzePerformance(performanceData);
      setUserInsights(ai.getUserInsights());
      setRecommendations(analysis.recommendations || []);
      setAdaptedDifficulty(analysis.nextDifficulty);
      return analysis;
    } catch (error) {
      console.error('Performance analysis failed:', error);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [ai]);
  
  const generateHint = useCallback((context) => {
    try {
      return ai.generateIntelligentHint(context);
    } catch (error) {
      console.error('Hint generation failed:', error);
      return {
        content: "Consider reviewing the question more carefully.",
        level: 1,
        strategy: 'fallback',
        confidence: 0.5
      };
    }
  }, [ai]);
  
  const adaptDifficulty = useCallback((currentExercise, recentPerformance) => {
    try {
      const adapted = ai.adaptDifficulty(currentExercise, recentPerformance);
      setAdaptedDifficulty(adapted);
      return adapted;
    } catch (error) {
      console.error('Difficulty adaptation failed:', error);
      return currentExercise.difficulty;
    }
  }, [ai]);
  
  const personalizeContent = useCallback((content) => {
    try {
      return ai.personalizeContent(content);
    } catch (error) {
      console.error('Content personalization failed:', error);
      return content;
    }
  }, [ai]);
  
  const configureAI = useCallback((newConfig) => {
    ai.configureAI(newConfig);
  }, [ai]);
  
  // Initialize AI for specific exercise
  const initializeForExercise = useCallback(async (exerciseConfig) => {
    if (!ai) return false;
    try {
      return await ai.initialize(exerciseConfig);
    } catch (error) {
      console.error('Failed to initialize AI for exercise:', error);
      return false;
    }
  }, [ai]);

  // Get user profile
  const getUserProfile = useCallback(() => {
    if (!ai) return {};
    return ai.getUserProfile() || {};
  }, [ai]);

  // Get current difficulty
  const getDifficulty = useCallback(() => {
    if (!ai) return 'medium';
    return ai.getDifficulty() || adaptedDifficulty || 'medium';
  }, [ai, adaptedDifficulty]);

  // Check if hints should be shown
  const shouldShowHints = useCallback(() => {
    if (!ai) return false;
    return ai.shouldShowHints() || false;
  }, [ai]);

  // Get current hint
  const getCurrentHint = useCallback(() => {
    if (!ai) return null;
    return ai.getCurrentHint() || null;
  }, [ai]);

  // Dismiss current hint
  const dismissHint = useCallback(() => {
    if (!ai) return false;
    return ai.dismissHint() || false;
  }, [ai]);

  return {
    // AI instance
    ai,
    
    // State
    userInsights,
    recommendations,
    adaptedDifficulty,
    isAnalyzing,
    
    // Methods
    analyzePerformance,
    generateHint,
    adaptDifficulty,
    personalizeContent,
    configureAI,
    initializeForExercise,
    getUserProfile,
    getDifficulty,
    shouldShowHints,
    getCurrentHint,
    dismissHint,
    
    // Direct access to insights
    getPersonalizedRecommendations: () => ai.getPersonalizedRecommendations(),
    getUserInsights: () => ai.getUserInsights()
  };
};

// Hook for intelligent hint system
export const useIntelligentHints = (questionData) => {
  const { generateHint } = useAI();
  const [currentHint, setCurrentHint] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);
  const hintTimerRef = useRef(null);
  
  const requestHint = useCallback(() => {
    const newHintLevel = hintLevel + 1;
    const context = {
      question: questionData,
      currentHintLevel: newHintLevel,
      previousHints: hintsUsed,
      timeSpent: Date.now() - (questionData.startTime || Date.now())
    };
    
    const hint = generateHint(context);
    setCurrentHint(hint);
    setHintLevel(newHintLevel);
    setHintsUsed(prev => [...prev, hint]);
    
    return hint;
  }, [generateHint, questionData, hintLevel, hintsUsed]);
  
  const startAutoHintTimer = useCallback((delay = 30000) => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    
    hintTimerRef.current = setTimeout(() => {
      if (hintLevel === 0) { // Only auto-suggest first hint
        const autoHint = requestHint();
        console.log('Auto hint generated:', autoHint);
      }
    }, delay);
  }, [requestHint, hintLevel]);
  
  const resetHints = useCallback(() => {
    setCurrentHint(null);
    setHintLevel(0);
    setHintsUsed([]);
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
  }, []);
  
  useEffect(() => {
    return () => {
      if (hintTimerRef.current) {
        clearTimeout(hintTimerRef.current);
      }
    };
  }, []);
  
  return {
    currentHint,
    hintLevel,
    hintsUsed,
    requestHint,
    resetHints,
    startAutoHintTimer,
    hasHints: hintsUsed.length > 0
  };
};

// Hook for adaptive difficulty
export const useAdaptiveDifficulty = (initialDifficulty = 'intermediate') => {
  const { adaptDifficulty, userInsights } = useAI();
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  
  const recordPerformance = useCallback((performanceData) => {
    setPerformanceHistory(prev => {
      const updated = [...prev, performanceData];
      // Keep only last 10 performances for adaptation
      return updated.slice(-10);
    });
  }, []);
  
  const adaptCurrentDifficulty = useCallback((currentExercise) => {
    if (performanceHistory.length >= 3) { // Need some history for adaptation
      const newDifficulty = adaptDifficulty(currentExercise, performanceHistory);
      setCurrentDifficulty(newDifficulty);
      return newDifficulty;
    }
    return currentDifficulty;
  }, [adaptDifficulty, currentDifficulty, performanceHistory]);
  
  return {
    currentDifficulty,
    performanceHistory,
    recordPerformance,
    adaptCurrentDifficulty,
    userLevel: userInsights?.currentLevel || 'intermediate'
  };
};

// Hook for personalized learning recommendations
export const usePersonalizedLearning = () => {
  const { recommendations, personalizeContent, userInsights } = useAI();
  const [personalizedExercises, setPersonalizedExercises] = useState([]);
  
  const personalizeExercise = useCallback((exercise) => {
    return personalizeContent(exercise);
  }, [personalizeContent]);
  
  const getRecommendedExercises = useCallback((availableExercises) => {
    if (!userInsights || !recommendations.length) {
      return availableExercises;
    }
    
    // Sort exercises based on recommendations
    const recommended = availableExercises.filter(exercise => {
      return recommendations.some(rec => 
        rec.type === 'practice' && 
        exercise.topics?.includes(rec.topic)
      );
    });
    
    // Add variety - don't only show weak areas
    const variety = availableExercises.filter(exercise => 
      !recommended.includes(exercise)
    ).slice(0, Math.max(2, Math.floor(availableExercises.length * 0.3)));
    
    setPersonalizedExercises([...recommended, ...variety]);
    return [...recommended, ...variety];
  }, [userInsights, recommendations]);
  
  const getStudyPlan = useCallback(() => {
    if (!recommendations.length) {
      return {
        message: "Keep practicing to get personalized recommendations!",
        actions: []
      };
    }
    
    const plan = {
      message: "Based on your performance, here's your personalized study plan:",
      actions: recommendations.slice(0, 5).map(rec => ({
        type: rec.type,
        description: rec.action,
        priority: rec.priority,
        topic: rec.topic
      }))
    };
    
    return plan;
  }, [recommendations]);
  
  return {
    recommendations,
    personalizedExercises,
    personalizeExercise,
    getRecommendedExercises,
    getStudyPlan,
    userProfile: userInsights?.profile
  };
};

// Higher-order component for AI-enhanced components
export const withAI = (WrappedComponent, config = {}) => {
  return function AIEnhancedComponent(props) {
    const ai = useAI(config);
    
    return <WrappedComponent {...props} ai={ai} />;
  };
};

export default useAI;
