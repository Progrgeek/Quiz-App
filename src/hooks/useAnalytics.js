/**
 * useAnalytics Hook
 * 
 * React hook for integrating analytics tracking into exercises
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';

export const useAnalytics = (config = {}) => {
  const analyticsEngineRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [sessionData, setSessionData] = useState({
    sessionId: null,
    startTime: null,
    interactions: []
  });

  // Initialize analytics engine
  useEffect(() => {
    if (config.enabled === false) return;

    try {
      analyticsEngineRef.current = new AnalyticsEngine({
        exerciseType: config.exerciseType || 'general',
        userId: config.userId || 'anonymous'
      });
      
      const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setSessionData(prev => ({
        ...prev,
        sessionId,
        startTime: new Date().toISOString()
      }));
      
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize Analytics:', error);
      setIsReady(false);
    }
  }, [config.enabled, config.exerciseType, config.userId]);

  const trackExerciseStart = useCallback(async (exerciseData) => {
    if (!isReady || !analyticsEngineRef.current) return;
    
    try {
      return await analyticsEngineRef.current.trackExerciseStart({
        ...exerciseData,
        sessionId: sessionData.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking exercise start:', error);
    }
  }, [isReady, sessionData.sessionId]);

  const trackAnswerSubmitted = useCallback(async (answerData) => {
    if (!isReady || !analyticsEngineRef.current) return;
    
    try {
      const trackingData = {
        ...answerData,
        sessionId: sessionData.sessionId,
        timestamp: new Date().toISOString()
      };
      
      setSessionData(prev => ({
        ...prev,
        interactions: [...prev.interactions, trackingData]
      }));
      
      return await analyticsEngineRef.current.trackAnswerSubmitted(trackingData);
    } catch (error) {
      console.error('Error tracking answer:', error);
    }
  }, [isReady, sessionData.sessionId]);

  const trackUserInteraction = useCallback(async (interactionData) => {
    if (!isReady || !analyticsEngineRef.current) return;
    
    try {
      return await analyticsEngineRef.current.trackUserInteraction({
        ...interactionData,
        sessionId: sessionData.sessionId,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error tracking interaction:', error);
    }
  }, [isReady, sessionData.sessionId]);

  const getInsights = useCallback(async () => {
    if (!isReady || !analyticsEngineRef.current) return null;
    
    try {
      return await analyticsEngineRef.current.getInsights();
    } catch (error) {
      console.error('Error getting insights:', error);
      return null;
    }
  }, [isReady]);

  const getSessionData = useCallback(() => {
    return sessionData;
  }, [sessionData]);

  return {
    isReady,
    trackExerciseStart,
    trackAnswerSubmitted,
    trackUserInteraction,
    getInsights,
    getSessionData,
    engine: analyticsEngineRef.current
  };
};

// Hook for exercise-specific tracking
export const useExerciseTracking = (exerciseType) => {
  const analytics = useAnalytics();
  const [exerciseStartTime, setExerciseStartTime] = useState(null);
  const [questionStartTime, setQuestionStartTime] = useState(null);

  const startExercise = useCallback(() => {
    const startTime = Date.now();
    setExerciseStartTime(startTime);
    if (analytics.isReady) {
      analytics.trackExerciseStart({
        exerciseType,
        startTime
      });
    }
  }, [analytics, exerciseType]);

  const startQuestion = useCallback(() => {
    setQuestionStartTime(Date.now());
  }, []);

  const endQuestion = useCallback((questionData) => {
    if (questionStartTime && analytics.isReady) {
      const timeSpent = Date.now() - questionStartTime;
      analytics.trackUserInteraction({
        type: 'question_completed',
        timeSpent,
        ...questionData
      });
    }
  }, [analytics, questionStartTime]);

  return {
    startExercise,
    startQuestion,
    endQuestion,
    trackInteraction: analytics.trackUserInteraction,
    isReady: analytics.isReady
  };
};

// Hook for interaction tracking
export const useInteractionTracking = (componentName) => {
  const analytics = useAnalytics();

  const trackClick = useCallback((elementType, elementData = {}) => {
    if (analytics.isReady) {
      analytics.trackUserInteraction({
        type: 'click',
        component: componentName,
        elementType,
        ...elementData
      });
    }
  }, [analytics, componentName]);

  const trackHover = useCallback((elementType, elementData = {}) => {
    if (analytics.isReady) {
      analytics.trackUserInteraction({
        type: 'hover',
        component: componentName,
        elementType,
        ...elementData
      });
    }
  }, [analytics, componentName]);

  return {
    trackClick,
    trackHover,
    trackInteraction: analytics.trackUserInteraction,
    isReady: analytics.isReady
  };
};

export default useAnalytics;
