/**
 * React Hook for AI Engine Integration
 */

import { useEffect, useState, useCallback, useRef } from 'react';
import { AIEngine } from '../ai/AIEngine';

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
  
  const analyzePerformance = useCallback(async (performanceData) => {
    setIsAnalyzing(true);
    try {
      const analysis = await ai.analyzePerformance(performanceData);
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
  
  return {
    ai,
    userInsights,
    recommendations,
    adaptedDifficulty,
    isAnalyzing,
    analyzePerformance,
    generateHint,
    adaptDifficulty,
    personalizeContent,
    configureAI,
    getPersonalizedRecommendations: () => ai.getPersonalizedRecommendations(),
    getUserInsights: () => ai.getUserInsights()
  };
};

export const useIntelligentHints = (questionData) => {
  const { generateHint } = useAI();
  const [currentHint, setCurrentHint] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);
  const hintTimerRef = useRef(null);
  
  const requestHint = useCallback(() => {
    const newHintLevel = hintLevel + 1;
    const hint = generateHint({
      question: questionData,
      hintLevel: newHintLevel,
      previousHints: hintsUsed
    });
    
    setCurrentHint(hint);
    setHintLevel(newHintLevel);
    setHintsUsed(prev => [...prev, hint]);
  }, [generateHint, questionData, hintLevel, hintsUsed]);
  
  const startAutoHintTimer = useCallback((delay = 30000) => {
    if (hintTimerRef.current) {
      clearTimeout(hintTimerRef.current);
    }
    
    hintTimerRef.current = setTimeout(() => {
      requestHint();
    }, delay);
  }, [requestHint]);
  
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
    startAutoHintTimer,
    resetHints,
    hasHints: hintsUsed.length > 0
  };
};

export const useAdaptiveDifficulty = (initialDifficulty = 'intermediate') => {
  const { adaptDifficulty } = useAI();
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  
  const recordPerformance = useCallback((performanceData) => {
    setPerformanceHistory(prev => [...prev, performanceData].slice(-10)); // Keep last 10
  }, []);
  
  const adaptCurrentDifficulty = useCallback((currentExercise) => {
    if (performanceHistory.length >= 3) {
      const recentPerformance = performanceHistory.slice(-3);
      const newDifficulty = adaptDifficulty(currentExercise, recentPerformance);
      setCurrentDifficulty(newDifficulty);
      return newDifficulty;
    }
    return currentDifficulty;
  }, [adaptDifficulty, performanceHistory, currentDifficulty]);
  
  return {
    currentDifficulty,
    performanceHistory,
    recordPerformance,
    adaptCurrentDifficulty
  };
};

export const usePersonalizedLearning = () => {
  const { userInsights, recommendations } = useAI();
  const [personalizedExercises, setPersonalizedExercises] = useState([]);
  
  const personalizeExercise = useCallback((exercise) => {
    return ai.personalizeContent(exercise);
  }, []);
  
  const getRecommendedExercises = useCallback((availableExercises) => {
    if (!recommendations.length) return availableExercises.slice(0, 5);
    
    const recommended = availableExercises.filter(exercise => 
      recommendations.some(rec => 
        rec.type === exercise.type || rec.topic === exercise.topic
      )
    ).slice(0, Math.min(5, recommendations.length));
    
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

export const withAI = (WrappedComponent, config = {}) => {
  return function AIEnhancedComponent(props) {
    const ai = useAI(config);
    
    return <WrappedComponent {...props} ai={ai} />;
  };
};

export default useAI;
