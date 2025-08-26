/**
 * Analytics Provider
 * Context provider for sharing AnalyticsEngine instance across components
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AnalyticsEngine } from '../analytics/AnalyticsEngine';

const AnalyticsContext = createContext(null);

export const useAnalyticsContext = () => {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
};

export const AnalyticsProvider = ({ 
  children, 
  config = {},
  onAnalyticsReady,
  onAnalyticsError 
}) => {
  const [engine, setEngine] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [sessionData, setSessionData] = useState({
    sessionId: null,
    startTime: null,
    events: []
  });
  
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setError(null);
        
        // Create new analytics engine instance
        const newEngine = new AnalyticsEngine({
          enableRealTime: true,
          enablePersistence: true,
          userId: config.userId || 'anonymous',
          ...config
        });
        
        // Initialize session
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setSessionData({
          sessionId,
          startTime: new Date().toISOString(),
          events: []
        });
        
        setEngine(newEngine);
        setIsReady(true);
        
        if (onAnalyticsReady) {
          onAnalyticsReady(newEngine);
        }
      } catch (err) {
        console.error('Failed to initialize AnalyticsEngine:', err);
        setError(err);
        setIsReady(false);
        
        if (onAnalyticsError) {
          onAnalyticsError(err);
        }
      }
    };
    
    initializeEngine();
    
    // Cleanup on unmount
    return () => {
      if (engine) {
        engine.flush?.();
      }
    };
  }, []);
  
  const value = {
    engine,
    isReady,
    error,
    sessionData,
    
    // Convenience methods
    trackEvent: async (eventType, eventData) => {
      if (!engine || !isReady) {
        console.warn('Analytics engine not ready');
        return;
      }
      
      const event = {
        ...eventData,
        sessionId: sessionData.sessionId,
        timestamp: new Date().toISOString()
      };
      
      setSessionData(prev => ({
        ...prev,
        events: [...prev.events, event]
      }));
      
      return engine.trackEvent(eventType, event);
    },
    
    trackExerciseStart: async (exerciseData) => {
      if (!engine || !isReady) return;
      return engine.trackExerciseStart({
        ...exerciseData,
        sessionId: sessionData.sessionId
      });
    },
    
    trackAnswerSubmission: async (answerData) => {
      if (!engine || !isReady) return;
      return engine.trackAnswerSubmission({
        ...answerData,
        sessionId: sessionData.sessionId
      });
    },
    
    trackExerciseComplete: async (completionData) => {
      if (!engine || !isReady) return;
      return engine.trackExerciseComplete({
        ...completionData,
        sessionId: sessionData.sessionId
      });
    },
    
    getAnalytics: () => {
      if (!engine || !isReady) return null;
      return engine.getAnalytics();
    },
    
    getUserInsights: () => {
      if (!engine || !isReady) return null;
      return engine.getUserInsights();
    }
  };
  
  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export default AnalyticsProvider;
