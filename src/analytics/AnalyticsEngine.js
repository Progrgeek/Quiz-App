/**
 * Analytics Engine
 * Tracks user behavior, performance metrics, and learning patterns
 */

export class AnalyticsEngine {
  constructor(config = {}) {
    this.config = {
      enableRealTime: config.enableRealTime ?? true,
      enablePersistence: config.enablePersistence ?? true,
      batchSize: config.batchSize ?? 10,
      flushInterval: config.flushInterval ?? 30000, // 30 seconds
      ...config
    };
    
    this.events = [];
    this.sessionData = this.initializeSession();
    this.metrics = new Map();
    
    if (this.config.enableRealTime) {
      this.startRealTimeTracking();
    }
  }
  
  initializeSession() {
    return {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      userId: this.getUserId(),
      deviceInfo: this.getDeviceInfo(),
      userAgent: navigator.userAgent,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    };
  }
  
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  getUserId() {
    // Try to get from localStorage, generate if not exists
    let userId = localStorage.getItem('quiz_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('quiz_user_id', userId);
    }
    return userId;
  }
  
  getDeviceInfo() {
    return {
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        availWidth: window.screen.availWidth,
        availHeight: window.screen.availHeight
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      },
      devicePixelRatio: window.devicePixelRatio,
      touchDevice: 'ontouchstart' in window,
      mobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    };
  }
  
  // Core tracking methods
  track(eventName, properties = {}) {
    const event = {
      id: this.generateEventId(),
      name: eventName,
      timestamp: Date.now(),
      sessionId: this.sessionData.sessionId,
      userId: this.sessionData.userId,
      properties: {
        ...properties,
        url: window.location.href,
        referrer: document.referrer,
        sessionDuration: Date.now() - this.sessionData.startTime
      }
    };
    
    this.events.push(event);
    
    if (this.config.enableRealTime) {
      this.processEventRealTime(event);
    }
    
    if (this.events.length >= this.config.batchSize) {
      this.flush();
    }
    
    return event;
  }
  
  // Exercise-specific tracking
  trackExerciseStart(exerciseData) {
    return this.track('exercise_started', {
      exerciseId: exerciseData.id,
      exerciseType: exerciseData.type,
      difficulty: exerciseData.difficulty,
      questionCount: exerciseData.questions?.length,
      estimatedDuration: exerciseData.estimatedDuration,
      tags: exerciseData.tags
    });
  }
  
  trackQuestionViewed(questionData) {
    return this.track('question_viewed', {
      questionId: questionData.id,
      questionType: questionData.type,
      difficulty: questionData.difficulty,
      estimatedTime: questionData.estimatedTime,
      hasHints: !!questionData.hints?.length,
      hasMedia: !!questionData.media
    });
  }
  
  trackAnswerSubmitted(answerData) {
    return this.track('answer_submitted', {
      questionId: answerData.questionId,
      answer: answerData.answer,
      isCorrect: answerData.isCorrect,
      timeToAnswer: answerData.timeToAnswer,
      hintsUsed: answerData.hintsUsed,
      attemptsCount: answerData.attemptsCount,
      confidence: answerData.confidence,
      score: answerData.score
    });
  }
  
  trackHintUsed(hintData) {
    return this.track('hint_used', {
      questionId: hintData.questionId,
      hintLevel: hintData.level,
      hintContent: hintData.content,
      timeBeforeHint: hintData.timeBeforeHint,
      previousAttempts: hintData.previousAttempts
    });
  }
  
  trackExerciseCompleted(completionData) {
    return this.track('exercise_completed', {
      exerciseId: completionData.exerciseId,
      totalDuration: completionData.totalDuration,
      finalScore: completionData.finalScore,
      questionsCorrect: completionData.questionsCorrect,
      questionsTotal: completionData.questionsTotal,
      hintsUsed: completionData.hintsUsed,
      averageTimePerQuestion: completionData.averageTimePerQuestion,
      completion: completionData.completion,
      abandoned: completionData.abandoned
    });
  }
  
  // Performance tracking
  trackPerformance(performanceData) {
    return this.track('performance_metric', {
      metric: performanceData.metric,
      value: performanceData.value,
      context: performanceData.context,
      timestamp: performanceData.timestamp || Date.now()
    });
  }
  
  // Error tracking
  trackError(errorData) {
    return this.track('error_occurred', {
      errorType: errorData.type,
      errorMessage: errorData.message,
      errorStack: errorData.stack,
      component: errorData.component,
      action: errorData.action,
      severity: errorData.severity || 'error'
    });
  }
  
  // User behavior tracking
  trackUserInteraction(interactionData) {
    return this.track('user_interaction', {
      interactionType: interactionData.type, // click, hover, focus, etc.
      target: interactionData.target,
      component: interactionData.component,
      value: interactionData.value,
      coordinates: interactionData.coordinates
    });
  }
  
  // Learning pattern analysis
  analyzeLearningPatterns() {
    const patterns = {
      strengths: this.identifyStrengths(),
      weaknesses: this.identifyWeaknesses(),
      learningSpeed: this.calculateLearningSpeed(),
      preferredDifficulty: this.getPreferredDifficulty(),
      optimalStudyTime: this.getOptimalStudyTime(),
      retentionRate: this.calculateRetentionRate()
    };
    
    this.track('learning_analysis', patterns);
    return patterns;
  }
  
  identifyStrengths() {
    const exerciseTypes = this.groupEventsByProperty('exerciseType');
    const strengths = [];
    
    for (const [type, events] of exerciseTypes.entries()) {
      const correctAnswers = events.filter(e => 
        e.name === 'answer_submitted' && e.properties.isCorrect
      );
      const accuracy = correctAnswers.length / events.length;
      
      if (accuracy > 0.8) {
        strengths.push({
          type,
          accuracy,
          averageTime: this.calculateAverageTime(events)
        });
      }
    }
    
    return strengths;
  }
  
  identifyWeaknesses() {
    const exerciseTypes = this.groupEventsByProperty('exerciseType');
    const weaknesses = [];
    
    for (const [type, events] of exerciseTypes.entries()) {
      const correctAnswers = events.filter(e => 
        e.name === 'answer_submitted' && e.properties.isCorrect
      );
      const accuracy = correctAnswers.length / events.length;
      
      if (accuracy < 0.6) {
        weaknesses.push({
          type,
          accuracy,
          commonErrors: this.analyzeCommonErrors(events),
          recommendedActions: this.generateRecommendations(type, accuracy)
        });
      }
    }
    
    return weaknesses;
  }
  
  calculateLearningSpeed() {
    const sessions = this.groupEventsBySession();
    const speeds = [];
    
    for (const sessionEvents of sessions.values()) {
      const startTime = Math.min(...sessionEvents.map(e => e.timestamp));
      const endTime = Math.max(...sessionEvents.map(e => e.timestamp));
      const duration = endTime - startTime;
      
      const questionsAnswered = sessionEvents.filter(e => 
        e.name === 'answer_submitted'
      ).length;
      
      if (questionsAnswered > 0) {
        speeds.push(questionsAnswered / (duration / 60000)); // questions per minute
      }
    }
    
    return speeds.length > 0 ? 
      speeds.reduce((a, b) => a + b) / speeds.length : 0;
  }
  
  // Real-time processing
  startRealTimeTracking() {
    setInterval(() => {
      this.processRealTimeMetrics();
    }, this.config.flushInterval);
  }
  
  processEventRealTime(event) {
    // Immediate processing for critical events
    if (this.isCriticalEvent(event)) {
      this.handleCriticalEvent(event);
    }
    
    // Update real-time metrics
    this.updateMetrics(event);
  }
  
  isCriticalEvent(event) {
    const criticalEvents = [
      'error_occurred',
      'exercise_abandoned',
      'performance_degradation'
    ];
    return criticalEvents.includes(event.name);
  }
  
  handleCriticalEvent(event) {
    console.warn('Critical event detected:', event);
    
    // Could trigger alerts, auto-help, or adaptive content
    if (event.name === 'performance_degradation') {
      this.suggestPerformanceOptimization();
    }
  }
  
  updateMetrics(event) {
    const metricKey = `${event.name}_count`;
    const currentCount = this.metrics.get(metricKey) || 0;
    this.metrics.set(metricKey, currentCount + 1);
    
    // Update session metrics
    this.updateSessionMetrics(event);
  }
  
  updateSessionMetrics(event) {
    const sessionMetrics = this.metrics.get('session') || {
      eventsCount: 0,
      startTime: this.sessionData.startTime,
      lastActivity: Date.now()
    };
    
    sessionMetrics.eventsCount++;
    sessionMetrics.lastActivity = Date.now();
    sessionMetrics.duration = Date.now() - sessionMetrics.startTime;
    
    this.metrics.set('session', sessionMetrics);
  }
  
  // Data persistence and retrieval
  flush() {
    if (this.events.length === 0) return;
    
    if (this.config.enablePersistence) {
      this.persistEvents(this.events);
    }
    
    // Could send to analytics service here
    this.sendToAnalyticsService(this.events);
    
    this.events = [];
  }
  
  persistEvents(events) {
    try {
      const existingEvents = JSON.parse(
        localStorage.getItem('quiz_analytics_events') || '[]'
      );
      
      const allEvents = [...existingEvents, ...events];
      
      // Keep only last 1000 events to prevent storage overflow
      const recentEvents = allEvents.slice(-1000);
      
      localStorage.setItem(
        'quiz_analytics_events', 
        JSON.stringify(recentEvents)
      );
    } catch (error) {
      console.error('Failed to persist analytics events:', error);
    }
  }
  
  sendToAnalyticsService(events) {
    // Placeholder for external analytics service integration
    console.log('Analytics events:', events);
    
    // Example: Send to Google Analytics, Mixpanel, etc.
    // analytics.track(events);
  }
  
  // Utility methods
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  groupEventsByProperty(property) {
    const groups = new Map();
    
    for (const event of this.events) {
      const value = event.properties[property];
      if (value) {
        if (!groups.has(value)) {
          groups.set(value, []);
        }
        groups.get(value).push(event);
      }
    }
    
    return groups;
  }
  
  groupEventsBySession() {
    const sessions = new Map();
    
    for (const event of this.events) {
      const sessionId = event.sessionId;
      if (!sessions.has(sessionId)) {
        sessions.set(sessionId, []);
      }
      sessions.get(sessionId).push(event);
    }
    
    return sessions;
  }
  
  calculateAverageTime(events) {
    const answerEvents = events.filter(e => 
      e.name === 'answer_submitted' && e.properties.timeToAnswer
    );
    
    if (answerEvents.length === 0) return 0;
    
    const totalTime = answerEvents.reduce((sum, e) => 
      sum + e.properties.timeToAnswer, 0
    );
    
    return totalTime / answerEvents.length;
  }
  
  analyzeCommonErrors(events) {
    const errorEvents = events.filter(e => 
      e.name === 'answer_submitted' && !e.properties.isCorrect
    );
    
    // Group by error patterns
    const errorPatterns = new Map();
    
    errorEvents.forEach(event => {
      const pattern = this.categorizeError(event);
      const count = errorPatterns.get(pattern) || 0;
      errorPatterns.set(pattern, count + 1);
    });
    
    return Array.from(errorPatterns.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3); // Top 3 error patterns
  }
  
  categorizeError(errorEvent) {
    // Simple error categorization - could be enhanced with ML
    const timeToAnswer = errorEvent.properties.timeToAnswer;
    
    if (timeToAnswer < 5000) return 'rushed_answer';
    if (timeToAnswer > 30000) return 'overthinking';
    
    return 'knowledge_gap';
  }
  
  generateRecommendations(exerciseType, accuracy) {
    const recommendations = [];
    
    if (accuracy < 0.4) {
      recommendations.push('Review fundamental concepts');
      recommendations.push('Practice with easier exercises first');
    } else if (accuracy < 0.6) {
      recommendations.push('Focus on common mistake patterns');
      recommendations.push('Use hints more strategically');
    }
    
    recommendations.push(`Practice more ${exerciseType} exercises`);
    
    return recommendations;
  }

  getPreferredDifficulty() {
    const attempts = this.events.filter(e => e.name === 'exercise_completed');
    if (attempts.length === 0) return 'medium';
    
    const difficultySuccess = {};
    attempts.forEach(attempt => {
      const difficulty = attempt.data?.difficulty || 'medium';
      if (!difficultySuccess[difficulty]) {
        difficultySuccess[difficulty] = { correct: 0, total: 0 };
      }
      difficultySuccess[difficulty].total++;
      if (attempt.data?.isCorrect) {
        difficultySuccess[difficulty].correct++;
      }
    });
    
    // Find difficulty with best success rate (>70%)
    let preferred = 'medium';
    let bestScore = 0;
    
    for (const [difficulty, stats] of Object.entries(difficultySuccess)) {
      const successRate = stats.correct / stats.total;
      if (successRate > 0.7 && successRate > bestScore) {
        preferred = difficulty;
        bestScore = successRate;
      }
    }
    
    return preferred;
  }

  getOptimalStudyTime() {
    const sessionEvents = this.events.filter(e => e.name === 'session_start');
    if (sessionEvents.length === 0) return 30; // 30 minutes default
    
    // Calculate average session duration
    const durations = sessionEvents.map(e => {
      const sessionMetrics = this.metrics.get('session');
      return sessionMetrics?.duration || 0;
    });
    
    if (durations.length === 0) return 30;
    
    const avgDuration = durations.reduce((sum, d) => sum + d, 0) / durations.length;
    return Math.round(avgDuration / (1000 * 60)); // Convert to minutes
  }

  calculateRetentionRate() {
    const now = Date.now();
    const oneDayAgo = now - (24 * 60 * 60 * 1000);
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);
    
    // Get exercises from different time periods
    const recentExercises = this.events.filter(e => 
      e.name === 'exercise_completed' && e.timestamp > oneDayAgo
    );
    
    const olderExercises = this.events.filter(e => 
      e.name === 'exercise_completed' && 
      e.timestamp > oneWeekAgo && 
      e.timestamp <= oneDayAgo
    );
    
    if (recentExercises.length === 0 || olderExercises.length === 0) {
      return 0.75; // Default retention rate
    }
    
    // Calculate accuracy for each period
    const recentAccuracy = recentExercises.filter(e => e.data?.isCorrect).length / recentExercises.length;
    const olderAccuracy = olderExercises.filter(e => e.data?.isCorrect).length / olderExercises.length;
    
    // Retention rate based on accuracy maintenance
    const retentionRate = Math.min(recentAccuracy / Math.max(olderAccuracy, 0.1), 1.0);
    
    return Math.round(retentionRate * 100) / 100; // Round to 2 decimal places
  }
  
  // Public API for getting insights
  getInsights() {
    return {
      session: this.metrics.get('session'),
      learningPatterns: this.analyzeLearningPatterns(),
      performanceMetrics: this.getPerformanceMetrics(),
      recommendations: this.getPersonalizedRecommendations()
    };
  }
  
  getPerformanceMetrics() {
    const metrics = {};
    
    for (const [key, value] of this.metrics.entries()) {
      if (key.endsWith('_count')) {
        metrics[key] = value;
      }
    }
    
    return metrics;
  }
  
  getPersonalizedRecommendations() {
    const patterns = this.analyzeLearningPatterns();
    const recommendations = [];
    
    // Add recommendations based on weaknesses
    patterns.weaknesses.forEach(weakness => {
      recommendations.push(...weakness.recommendedActions);
    });
    
    // Add general recommendations
    if (patterns.learningSpeed < 1) {
      recommendations.push('Consider taking more time to read questions carefully');
    }
    
    return recommendations;
  }
}

export default AnalyticsEngine;
