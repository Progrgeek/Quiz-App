/**
 * Analytics Integration Module
 * Connects QuizEngine with Analytics System for seamless data collection
 */

import { analyticsTracker, ANALYTICS_EVENTS } from './eventTracker.js';
import { progressEngine } from './progressEngine.js';

class AnalyticsIntegration {
  constructor() {
    this.sessionData = {
      sessionId: null,
      startTime: null,
      exercises: [],
      currentExercise: null
    };
    
    this.isInitialized = false;
  }
  
  // Initialize analytics for a new session
  initializeSession(userId, sessionConfig = {}) {
    this.sessionData = {
      sessionId: this.generateSessionId(),
      userId,
      startTime: new Date().toISOString(),
      exercises: [],
      currentExercise: null,
      config: sessionConfig
    };
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.SESSION_START, {
      sessionId: this.sessionData.sessionId,
      userId,
      startTime: this.sessionData.startTime,
      ...sessionConfig
    });
    
    this.isInitialized = true;
    return this.sessionData.sessionId;
  }
  
  // Track exercise start
  startExercise(exerciseData) {
    if (!this.isInitialized) {
      console.warn('Analytics not initialized. Call initializeSession first.');
      return;
    }
    
    const exerciseStartData = {
      exerciseId: exerciseData.id || this.generateExerciseId(),
      type: exerciseData.type,
      difficulty: exerciseData.difficulty || 'medium',
      questionCount: exerciseData.questions?.length || 0,
      startTime: new Date().toISOString(),
      sessionId: this.sessionData.sessionId
    };
    
    this.sessionData.currentExercise = exerciseStartData;
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.EXERCISE_START, exerciseStartData);
    
    return exerciseStartData.exerciseId;
  }
  
  // Track question attempt
  trackQuestionAttempt(questionData, userAnswer, isCorrect, timeToAnswer) {
    if (!this.sessionData.currentExercise) {
      console.warn('No active exercise. Call startExercise first.');
      return;
    }
    
    const attemptData = {
      sessionId: this.sessionData.sessionId,
      exerciseId: this.sessionData.currentExercise.exerciseId,
      questionId: questionData.id || this.generateQuestionId(),
      questionType: questionData.type || this.sessionData.currentExercise.type,
      userAnswer,
      correctAnswer: questionData.correctAnswer,
      isCorrect,
      timeToAnswer,
      difficulty: questionData.difficulty || this.sessionData.currentExercise.difficulty,
      hintsUsed: questionData.hintsUsed || 0,
      attempts: questionData.attempts || 1,
      timestamp: new Date().toISOString()
    };
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.QUESTION_ATTEMPT, attemptData);
    
    return attemptData;
  }
  
  // Track hint usage
  trackHintUsage(questionId, hintType, hintContent) {
    if (!this.sessionData.currentExercise) return;
    
    const hintData = {
      sessionId: this.sessionData.sessionId,
      exerciseId: this.sessionData.currentExercise.exerciseId,
      questionId,
      hintType,
      hintContent,
      timestamp: new Date().toISOString()
    };
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.HINT_REQUESTED, hintData);
  }
  
  // Track exercise completion
  completeExercise(results) {
    if (!this.sessionData.currentExercise) {
      console.warn('No active exercise to complete.');
      return;
    }
    
    const endTime = new Date().toISOString();
    const duration = new Date(endTime) - new Date(this.sessionData.currentExercise.startTime);
    
    const completionData = {
      sessionId: this.sessionData.sessionId,
      exerciseId: this.sessionData.currentExercise.exerciseId,
      type: this.sessionData.currentExercise.type,
      difficulty: this.sessionData.currentExercise.difficulty,
      startTime: this.sessionData.currentExercise.startTime,
      endTime,
      duration,
      score: results.score || 0,
      totalQuestions: results.totalQuestions || 0,
      correctAnswers: results.correctAnswers || 0,
      accuracy: results.accuracy || 0,
      averageTimePerQuestion: results.averageTimePerQuestion || 0,
      hintsUsed: results.hintsUsed || 0,
      completed: results.completed || false
    };
    
    // Add to session exercises
    this.sessionData.exercises.push(completionData);
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.EXERCISE_COMPLETE, completionData);
    
    // Clear current exercise
    this.sessionData.currentExercise = null;
    
    return completionData;
  }
  
  // Track session pause
  pauseSession(reason = 'user_action') {
    if (!this.isInitialized) return;
    
    const pauseData = {
      sessionId: this.sessionData.sessionId,
      timestamp: new Date().toISOString(),
      reason,
      currentExercise: this.sessionData.currentExercise?.exerciseId || null
    };
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.SESSION_PAUSE, pauseData);
  }
  
  // Track session resume
  resumeSession() {
    if (!this.isInitialized) return;
    
    const resumeData = {
      sessionId: this.sessionData.sessionId,
      timestamp: new Date().toISOString(),
      currentExercise: this.sessionData.currentExercise?.exerciseId || null
    };
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.SESSION_RESUME, resumeData);
  }
  
  // End session
  endSession(reason = 'completed') {
    if (!this.isInitialized) return null;
    
    const endTime = new Date().toISOString();
    const totalDuration = new Date(endTime) - new Date(this.sessionData.startTime);
    
    const sessionSummary = {
      sessionId: this.sessionData.sessionId,
      userId: this.sessionData.userId,
      startTime: this.sessionData.startTime,
      endTime,
      totalDuration,
      exerciseCount: this.sessionData.exercises.length,
      totalScore: this.calculateSessionScore(),
      averageScore: this.calculateAverageScore(),
      totalCorrectAnswers: this.calculateTotalCorrect(),
      totalQuestions: this.calculateTotalQuestions(),
      overallAccuracy: this.calculateOverallAccuracy(),
      reason
    };
    
    analyticsTracker.trackEvent(ANALYTICS_EVENTS.SESSION_END, sessionSummary);
    
    // Reset session data
    this.isInitialized = false;
    const finalSessionData = { ...this.sessionData };
    this.sessionData = {
      sessionId: null,
      startTime: null,
      exercises: [],
      currentExercise: null
    };
    
    return sessionSummary;
  }
  
  // Get current session progress
  getSessionProgress() {
    if (!this.isInitialized) return null;
    
    return {
      sessionId: this.sessionData.sessionId,
      exercises: this.sessionData.exercises,
      currentExercise: this.sessionData.currentExercise,
      duration: new Date() - new Date(this.sessionData.startTime),
      score: this.calculateSessionScore(),
      accuracy: this.calculateOverallAccuracy()
    };
  }
  
  // Calculate real-time performance prediction
  async getPredictiveInsights(exerciseType, difficulty) {
    if (!this.sessionData.userId) return null;
    
    try {
      const userHistory = await analyticsTracker.getUserExerciseHistory(
        this.sessionData.userId,
        exerciseType
      );
      
      return progressEngine.predictPerformance(userHistory, exerciseType, difficulty);
    } catch (error) {
      console.error('Error getting predictive insights:', error);
      return null;
    }
  }
  
  // Get learning recommendations
  async getLearningRecommendations() {
    if (!this.sessionData.userId) return null;
    
    try {
      const sessionHistory = await analyticsTracker.getSessionHistory(this.sessionData.userId);
      const patterns = progressEngine.identifyLearningPatterns(sessionHistory);
      
      return patterns.recommendations;
    } catch (error) {
      console.error('Error getting learning recommendations:', error);
      return null;
    }
  }
  
  // Helper methods
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateExerciseId() {
    return `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  generateQuestionId() {
    return `question_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  calculateSessionScore() {
    return this.sessionData.exercises.reduce((sum, ex) => sum + (ex.score || 0), 0);
  }
  
  calculateAverageScore() {
    if (this.sessionData.exercises.length === 0) return 0;
    return this.calculateSessionScore() / this.sessionData.exercises.length;
  }
  
  calculateTotalCorrect() {
    return this.sessionData.exercises.reduce((sum, ex) => sum + (ex.correctAnswers || 0), 0);
  }
  
  calculateTotalQuestions() {
    return this.sessionData.exercises.reduce((sum, ex) => sum + (ex.totalQuestions || 0), 0);
  }
  
  calculateOverallAccuracy() {
    const totalQuestions = this.calculateTotalQuestions();
    if (totalQuestions === 0) return 0;
    return (this.calculateTotalCorrect() / totalQuestions) * 100;
  }
}

// Enhanced QuizEngine Analytics Mixin
export const withAnalytics = (QuizEngineClass) => {
  return class AnalyticsEnabledQuizEngine extends QuizEngineClass {
    constructor(config = {}) {
      super(config);
      this.analytics = new AnalyticsIntegration();
      this.analyticsEnabled = config.enableAnalytics !== false;
      
      // Bind analytics to existing events
      this.initializeAnalyticsBindings();
    }
    
    initializeAnalyticsBindings() {
      if (!this.analyticsEnabled) return;
      
      // Override start method
      const originalStart = this.start.bind(this);
      this.start = (exercises, userId) => {
        if (userId) {
          this.analytics.initializeSession(userId, {
            exerciseCount: exercises?.length || 0,
            difficulty: this.config.difficulty || 'medium'
          });
        }
        return originalStart(exercises);
      };
      
      // Override startExercise method
      const originalStartExercise = this.startExercise.bind(this);
      this.startExercise = (exercise) => {
        this.analytics.startExercise(exercise);
        return originalStartExercise(exercise);
      };
      
      // Override submitAnswer method
      const originalSubmitAnswer = this.submitAnswer.bind(this);
      this.submitAnswer = (answer) => {
        const result = originalSubmitAnswer(answer);
        
        if (result && this.currentQuestion) {
          this.analytics.trackQuestionAttempt(
            this.currentQuestion,
            answer,
            result.isCorrect,
            result.timeToAnswer || 0
          );
        }
        
        return result;
      };
      
      // Override hint methods
      const originalGetHint = this.getHint?.bind(this);
      if (originalGetHint) {
        this.getHint = (type) => {
          const hint = originalGetHint(type);
          if (hint && this.currentQuestion) {
            this.analytics.trackHintUsage(
              this.currentQuestion.id,
              type,
              hint
            );
          }
          return hint;
        };
      }
      
      // Override pause/resume
      const originalPause = this.pause?.bind(this);
      if (originalPause) {
        this.pause = () => {
          this.analytics.pauseSession();
          return originalPause();
        };
      }
      
      const originalResume = this.resume?.bind(this);
      if (originalResume) {
        this.resume = () => {
          this.analytics.resumeSession();
          return originalResume();
        };
      }
      
      // Override finish
      const originalFinish = this.finish?.bind(this);
      if (originalFinish) {
        this.finish = () => {
          const results = originalFinish();
          
          // Complete current exercise if any
          if (this.analytics.sessionData.currentExercise) {
            this.analytics.completeExercise(results);
          }
          
          // End session
          this.analytics.endSession('completed');
          
          return results;
        };
      }
    }
    
    // Analytics-specific methods
    getAnalyticsProgress() {
      return this.analytics.getSessionProgress();
    }
    
    async getPredictiveInsights(exerciseType, difficulty) {
      return this.analytics.getPredictiveInsights(exerciseType, difficulty);
    }
    
    async getLearningRecommendations() {
      return this.analytics.getLearningRecommendations();
    }
    
    enableAnalytics() {
      this.analyticsEnabled = true;
    }
    
    disableAnalytics() {
      this.analyticsEnabled = false;
    }
  };
};

// Create global analytics integration instance
export const analyticsIntegration = new AnalyticsIntegration();

export default AnalyticsIntegration;
