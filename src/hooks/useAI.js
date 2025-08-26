import { useState, useEffect, useCallback, useRef } from 'react';
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
    const interval = setInterval(updateInsights, 30000);
    
    return () => clearInterval(interval);
  }, [ai]);
  
  return {
    ai,
    userInsights,
    recommendations,
    isAnalyzing
  };
};

export const useIntelligentHints = (questionData) => {
  const { ai } = useAI();
  const [currentHint, setCurrentHint] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [hintsUsed, setHintsUsed] = useState([]);
  
  const requestHint = useCallback(() => {
    try {
      const hint = ai.generateHint({
        question: questionData,
        hintLevel: hintLevel + 1,
        previousHints: hintsUsed
      });
      setCurrentHint(hint);
      setHintLevel(prev => prev + 1);
      setHintsUsed(prev => [...prev, hint]);
    } catch (error) {
      console.error('Failed to generate hint:', error);
    }
  }, [ai, questionData, hintLevel, hintsUsed]);
  
  const resetHints = useCallback(() => {
    setCurrentHint(null);
    setHintLevel(0);
    setHintsUsed([]);
  }, []);
  
  return {
    currentHint,
    hintLevel,
    hintsUsed,
    requestHint,
    resetHints,
    hasHints: hintsUsed.length > 0
  };
};

export const useAdaptiveDifficulty = (initialDifficulty = 'intermediate') => {
  const { ai } = useAI();
  const [currentDifficulty, setCurrentDifficulty] = useState(initialDifficulty);
  const [performanceHistory, setPerformanceHistory] = useState([]);
  
  const recordPerformance = useCallback((performanceData) => {
    setPerformanceHistory(prev => [...prev, performanceData].slice(-10));
  }, []);
  
  const adaptCurrentDifficulty = useCallback((currentExercise) => {
    try {
      if (performanceHistory.length >= 3) {
        const recentPerformance = performanceHistory.slice(-3);
        const newDifficulty = ai.adaptDifficulty(currentExercise, recentPerformance);
        setCurrentDifficulty(newDifficulty);
        return newDifficulty;
      }
      return currentDifficulty;
    } catch (error) {
      console.error('Failed to adapt difficulty:', error);
      return currentDifficulty;
    }
  }, [ai, performanceHistory, currentDifficulty]);
  
  return {
    currentDifficulty,
    performanceHistory,
    recordPerformance,
    adaptCurrentDifficulty
  };
};

export default useAI;
