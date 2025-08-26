import { useState, useEffect } from 'react';
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

export default useAI;
