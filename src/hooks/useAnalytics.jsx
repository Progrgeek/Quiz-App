/**
 * React Hook for Analytics Integration
 * Provides easy-to-use analytics tracking for React components
 */

import { useEffect, useRef, useState } from 'react';
import AnalyticsEngine from '../analytics/AnalyticsEngine';

// Global analytics instance
let analyticsInstance = null;

export const useAnalytics = (config = {}) => {
  const [analytics] = useState(() => {
    if (!analyticsInstance) {
      analyticsInstance = new AnalyticsEngine(config);
    }
    return analyticsInstance;
  });
  
  const [insights, setInsights] = useState(null);
  
  // Track component mount/unmount
  useEffect(() => {
    analytics.track('component_mounted', {
      component: config.componentName || 'Unknown'
    });
    
    return () => {
      analytics.track('component_unmounted', {
        component: config.componentName || 'Unknown'
      });
    };
  }, [analytics, config.componentName]);
  
  // Refresh insights periodically
  useEffect(() => {
    const updateInsights = () => {
      setInsights(analytics.getInsights());
    };
    
    updateInsights();
    const interval = setInterval(updateInsights, 30000); // Every 30 seconds
    
    return () => clearInterval(interval);
  }, [analytics]);
  
  // Tracking methods
  const trackEvent = (eventName, properties = {}) => {
    return analytics.track(eventName, properties);
  };
  
  const trackExerciseStart = (exerciseData) => {
    return analytics.trackExerciseStart(exerciseData);
  };
  
  const trackQuestionViewed = (questionData) => {
    return analytics.trackQuestionViewed(questionData);
  };
  
  const trackAnswerSubmitted = (answerData) => {
    return analytics.trackAnswerSubmitted(answerData);
  };
  
  const trackHintUsed = (hintData) => {
    return analytics.trackHintUsed(hintData);
  };
  
  const trackExerciseCompleted = (completionData) => {
    return analytics.trackExerciseCompleted(completionData);
  };

  const trackExerciseComplete = (completionData) => {
    return analytics.trackExerciseCompleted(completionData);
  };

  const trackProgress = (progressData) => {
    return analytics.trackProgress(progressData);
  };
  
  const trackUserInteraction = (interactionData) => {
    return analytics.trackUserInteraction(interactionData);
  };
  
  const trackError = (errorData) => {
    return analytics.trackError(errorData);
  };
  
  const trackPerformance = (performanceData) => {
    return analytics.trackPerformance(performanceData);
  };
  
  return {
    // Core tracking methods
    track: trackEvent,
    trackExerciseStart,
    trackQuestionViewed,
    trackAnswerSubmitted,
    trackHintUsed,
    trackExerciseCompleted,
    trackExerciseComplete,
    trackProgress,
    trackUserInteraction,
    trackError,
    trackPerformance,
    
    // Analytics data
    insights,
    analytics,
    
    // Utility methods
    flush: () => analytics.flush(),
    getInsights: () => analytics.getInsights()
  };
};

// Hook for tracking user interactions automatically
export const useInteractionTracking = (componentName) => {
  const { trackUserInteraction } = useAnalytics({ componentName });
  
  const trackClick = (target, value = null) => {
    trackUserInteraction({
      type: 'click',
      target,
      component: componentName,
      value,
      coordinates: null // Could add mouse coordinates if needed
    });
  };
  
  const trackHover = (target) => {
    trackUserInteraction({
      type: 'hover',
      target,
      component: componentName
    });
  };
  
  const trackFocus = (target) => {
    trackUserInteraction({
      type: 'focus',
      target,
      component: componentName
    });
  };
  
  const trackScroll = (position) => {
    trackUserInteraction({
      type: 'scroll',
      target: 'page',
      component: componentName,
      value: position
    });
  };
  
  return {
    trackClick,
    trackHover,
    trackFocus,
    trackScroll
  };
};

// Hook for tracking exercise performance
export const useExerciseTracking = () => {
  const analytics = useAnalytics();
  const startTimeRef = useRef(null);
  const currentExerciseRef = useRef(null);
  const questionStartTimeRef = useRef(null);
  const hintsUsedRef = useRef(0);
  
  const startExercise = (exerciseData) => {
    startTimeRef.current = Date.now();
    currentExerciseRef.current = exerciseData;
    hintsUsedRef.current = 0;
    
    return analytics.trackExerciseStart(exerciseData);
  };
  
  const startQuestion = (questionData) => {
    questionStartTimeRef.current = Date.now();
    return analytics.trackQuestionViewed(questionData);
  };
  
  const submitAnswer = (questionId, answer, isCorrect, confidence = null) => {
    const timeToAnswer = questionStartTimeRef.current ? 
      Date.now() - questionStartTimeRef.current : 0;
    
    return analytics.trackAnswerSubmitted({
      questionId,
      answer,
      isCorrect,
      timeToAnswer,
      hintsUsed: hintsUsedRef.current,
      confidence,
      attemptsCount: 1 // Could track multiple attempts
    });
  };
  
  const useHint = (questionId, hintLevel, hintContent) => {
    hintsUsedRef.current++;
    const timeBeforeHint = questionStartTimeRef.current ? 
      Date.now() - questionStartTimeRef.current : 0;
    
    return analytics.trackHintUsed({
      questionId,
      level: hintLevel,
      content: hintContent,
      timeBeforeHint,
      previousAttempts: 0 // Could track attempts before hint
    });
  };
  
  const completeExercise = (results) => {
    const totalDuration = startTimeRef.current ? 
      Date.now() - startTimeRef.current : 0;
    
    const completionData = {
      exerciseId: currentExerciseRef.current?.id,
      totalDuration,
      finalScore: results.score,
      questionsCorrect: results.correctAnswers,
      questionsTotal: results.totalQuestions,
      hintsUsed: hintsUsedRef.current,
      averageTimePerQuestion: totalDuration / results.totalQuestions,
      completion: results.completion || 100,
      abandoned: results.abandoned || false
    };
    
    return analytics.trackExerciseCompleted(completionData);
  };
  
  return {
    startExercise,
    startQuestion,
    submitAnswer,
    useHint,
    completeExercise,
    ...analytics
  };
};

// Higher-order component for automatic analytics tracking
export const withAnalytics = (WrappedComponent, config = {}) => {
  return function AnalyticsWrappedComponent(props) {
    const analytics = useAnalytics({
      componentName: WrappedComponent.name || config.componentName,
      ...config
    });
    
    return <WrappedComponent {...props} analytics={analytics} />;
  };
};

export default useAnalytics;
