/**
 * Learning Analytics Engine - Phase 5 Day 33
 * Comprehensive user behavior tracking and learning pattern analysis
 * Based on educational data mining and learning analytics research
 */

import { v4 as uuidv4 } from 'uuid';

export class LearningAnalyticsEngine {
  constructor() {
    this.trackingEvents = {
      EXERCISE_START: 'exercise_start',
      EXERCISE_COMPLETE: 'exercise_complete',
      ANSWER_SUBMIT: 'answer_submit',
      HINT_REQUEST: 'hint_request',
      PAUSE_SESSION: 'pause_session',
      RESUME_SESSION: 'resume_session',
      DIFFICULTY_CHANGE: 'difficulty_change',
      LEARNING_PATH_CHANGE: 'learning_path_change',
      SOCIAL_INTERACTION: 'social_interaction',
      ACHIEVEMENT_UNLOCK: 'achievement_unlock',
      STREAK_UPDATE: 'streak_update'
    };
    
    this.behaviorPatterns = {
      STRUGGLING: {
        indicators: ['low_accuracy', 'high_hint_usage', 'long_response_times', 'frequent_pauses'],
        interventions: ['easier_content', 'additional_examples', 'concept_review', 'motivational_support'],
        threshold: 0.4 // Below 40% performance
      },
      MASTERING: {
        indicators: ['high_accuracy', 'fast_response_times', 'consistent_performance', 'exploration_behavior'],
        interventions: ['harder_content', 'advanced_topics', 'challenge_exercises', 'peer_mentoring'],
        threshold: 0.85 // Above 85% performance
      },
      DISENGAGED: {
        indicators: ['frequent_pauses', 'declining_accuracy', 'reduced_session_time', 'irregular_practice'],
        interventions: ['gamification_boost', 'social_features', 'motivational_content', 'break_reminder'],
        threshold: 0.3 // Engagement score below 30%
      },
      EXPLORING: {
        indicators: ['diverse_exercise_types', 'curious_clicks', 'exploration_patterns', 'help_seeking'],
        interventions: ['varied_content', 'discovery_exercises', 'bonus_materials', 'exploration_rewards'],
        threshold: 0.6 // High exploration index
      },
      OPTIMAL: {
        indicators: ['balanced_performance', 'steady_progress', 'consistent_engagement', 'goal_oriented'],
        interventions: ['maintain_difficulty', 'gradual_progression', 'periodic_challenges', 'progress_celebration'],
        threshold: [0.6, 0.8] // 60-80% performance range
      }
    };

    // Store for events (in real app would be database)
    this.eventStore = [];
    this.userSessions = new Map();
    this.learningProfiles = new Map();
  }

  // Track learning event with comprehensive context
  trackEvent(userId, eventType, context = {}) {
    const timestamp = Date.now();
    const sessionId = this.getOrCreateSession(userId);
    
    const event = {
      id: uuidv4(),
      userId,
      sessionId,
      eventType,
      timestamp,
      context: {
        ...context,
        environmentContext: this.getEnvironmentContext(),
        deviceContext: this.getDeviceContext(),
        userState: this.getCurrentUserState(userId)
      },
      metadata: {
        userLevel: this.getUserLevel(userId),
        sessionDuration: this.getSessionDuration(userId),
        timeOfDay: new Date(timestamp).getHours(),
        dayOfWeek: new Date(timestamp).getDay()
      }
    };
    
    // Real-time processing
    this.processEventRealTime(event);
    
    // Store for batch analysis
    this.storeEvent(event);
    
    // Update user session
    this.updateSession(userId, event);
    
    return event;
  }

  // Real-time event processing for immediate insights
  processEventRealTime(event) {
    const { userId, eventType, context } = event;
    
    // Update real-time metrics
    this.updateRealTimeMetrics(userId, event);
    
    // Check for immediate intervention needs
    const interventionNeeds = this.checkImmediateInterventions(event);
    
    if (interventionNeeds.length > 0) {
      this.triggerRealTimeInterventions(userId, interventionNeeds);
    }
    
    // Update learning state predictions
    this.updateLearningStatePredictions(userId, event);
  }

  // Analyze comprehensive learning patterns
  analyzeLearningPatterns(userId, timeframe = '7days') {
    const events = this.getUserEvents(userId, timeframe);
    
    if (events.length === 0) {
      return this.getDefaultAnalysis(userId);
    }

    const patterns = {
      performance: this.analyzePerformancePatterns(events),
      engagement: this.analyzeEngagementPatterns(events),
      learning: this.analyzeLearningEfficiency(events),
      behavior: this.identifyBehaviorPatterns(events),
      temporal: this.analyzeTemporalPatterns(events),
      social: this.analyzeSocialPatterns(events)
    };
    
    return {
      userId,
      timeframe,
      patterns,
      insights: this.generateInsights(patterns),
      recommendations: this.generateRecommendations(patterns),
      predictions: this.makePredictions(patterns),
      riskFactors: this.identifyRiskFactors(patterns),
      strengths: this.identifyStrengths(patterns)
    };
  }

  // Performance pattern analysis
  analyzePerformancePatterns(events) {
    const exerciseEvents = events.filter(e => e.eventType === this.trackingEvents.EXERCISE_COMPLETE);
    
    if (exerciseEvents.length === 0) {
      return { trend: 'insufficient_data', metrics: {} };
    }

    const scores = exerciseEvents.map(e => e.context.score || 0);
    const times = exerciseEvents.map(e => e.context.timeToComplete || 0);
    const difficulties = exerciseEvents.map(e => e.context.difficulty || 0.5);

    return {
      trend: this.calculateTrend(scores),
      accuracy: {
        current: this.average(scores.slice(-5)), // Last 5 exercises
        overall: this.average(scores),
        improvement: this.calculateImprovement(scores)
      },
      speed: {
        current: this.average(times.slice(-5)),
        overall: this.average(times),
        improvement: this.calculateSpeedImprovement(times)
      },
      difficulty: {
        current: this.average(difficulties.slice(-5)),
        progression: this.calculateDifficultyProgression(difficulties),
        comfort_zone: this.identifyComfortZone(scores, difficulties)
      },
      consistency: this.calculateConsistency(scores),
      momentum: this.calculateMomentum(scores, times)
    };
  }

  // Engagement pattern analysis
  analyzeEngagementPatterns(events) {
    const sessionEvents = this.groupEventsBySession(events);
    
    const sessionLengths = sessionEvents.map(session => 
      Math.max(...session.map(e => e.timestamp)) - Math.min(...session.map(e => e.timestamp))
    );
    
    const pauseEvents = events.filter(e => e.eventType === this.trackingEvents.PAUSE_SESSION);
    const hintEvents = events.filter(e => e.eventType === this.trackingEvents.HINT_REQUEST);

    return {
      sessionQuality: {
        averageLength: this.average(sessionLengths),
        consistency: this.calculateSessionConsistency(sessionLengths),
        frequency: sessionEvents.length
      },
      interaction: {
        pauseFrequency: pauseEvents.length / sessionEvents.length,
        hintUsage: hintEvents.length / events.length,
        explorationLevel: this.calculateExplorationLevel(events)
      },
      motivation: {
        persistence: this.calculatePersistence(events),
        curiosity: this.calculateCuriosity(events),
        goalOrientation: this.calculateGoalOrientation(events)
      },
      flowState: this.assessFlowState(events)
    };
  }

  // Learning efficiency analysis
  analyzeLearningEfficiency(events) {
    const learningEvents = events.filter(e => 
      [this.trackingEvents.EXERCISE_COMPLETE, this.trackingEvents.ANSWER_SUBMIT].includes(e.eventType)
    );

    return {
      learningRate: this.calculateLearningRate(learningEvents),
      retentionRate: this.calculateRetentionRate(learningEvents),
      transferAbility: this.calculateTransferAbility(learningEvents),
      metacognition: this.assessMetacognition(events),
      optimization: {
        timeEfficiency: this.calculateTimeEfficiency(learningEvents),
        effortEfficiency: this.calculateEffortEfficiency(events),
        resourceUtilization: this.calculateResourceUtilization(events)
      }
    };
  }

  // Behavior pattern identification
  identifyBehaviorPatterns(events) {
    const patterns = [];
    
    for (const [patternName, patternConfig] of Object.entries(this.behaviorPatterns)) {
      const indicators = this.checkPatternIndicators(events, patternConfig.indicators);
      const strength = this.calculatePatternStrength(indicators);
      
      if (strength > 0.6) { // 60% threshold for pattern recognition
        patterns.push({
          name: patternName,
          strength,
          indicators: indicators,
          confidence: this.calculatePatternConfidence(events, patternConfig),
          recommendations: patternConfig.interventions
        });
      }
    }
    
    return patterns.sort((a, b) => b.strength - a.strength);
  }

  // Generate real-time learning insights
  generateRealTimeInsights(userId) {
    const recentActivity = this.getRecentActivity(userId, '1hour');
    const currentSession = this.getCurrentSession(userId);
    
    if (!currentSession || recentActivity.length === 0) {
      return this.getDefaultInsights(userId);
    }

    return {
      currentStruggleLevel: this.assessCurrentStruggle(recentActivity),
      optimalDifficulty: this.calculateOptimalDifficulty(userId),
      engagementRisk: this.assessEngagementRisk(currentSession),
      nextBestAction: this.recommendNextAction(userId),
      interventionSuggestions: this.suggestInterventions(userId),
      learningState: this.getCurrentLearningState(userId),
      motivationLevel: this.assessCurrentMotivation(recentActivity),
      flowStateIndicators: this.assessCurrentFlowState(currentSession)
    };
  }

  // Helper methods for calculations
  calculateTrend(values) {
    if (values.length < 3) return 'insufficient_data';
    
    const recent = values.slice(-5);
    const previous = values.slice(-10, -5);
    
    if (recent.length === 0 || previous.length === 0) return 'insufficient_data';
    
    const recentAvg = this.average(recent);
    const previousAvg = this.average(previous);
    
    const improvement = (recentAvg - previousAvg) / previousAvg;
    
    if (improvement > 0.1) return 'improving';
    if (improvement < -0.1) return 'declining';
    return 'stable';
  }

  average(array) {
    return array.length > 0 ? array.reduce((sum, val) => sum + val, 0) / array.length : 0;
  }

  calculateImprovement(scores) {
    if (scores.length < 2) return 0;
    
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    
    return this.average(secondHalf) - this.average(firstHalf);
  }

  calculateConsistency(values) {
    if (values.length < 2) return 0;
    
    const mean = this.average(values);
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    return Math.max(0, 1 - (standardDeviation / mean));
  }

  // Session and user state management
  getOrCreateSession(userId) {
    const now = Date.now();
    const existingSession = this.userSessions.get(userId);
    
    // Create new session if none exists or last activity was > 30 minutes ago
    if (!existingSession || (now - existingSession.lastActivity) > 30 * 60 * 1000) {
      const sessionId = uuidv4();
      this.userSessions.set(userId, {
        sessionId,
        startTime: now,
        lastActivity: now,
        events: []
      });
      return sessionId;
    }
    
    return existingSession.sessionId;
  }

  updateSession(userId, event) {
    const session = this.userSessions.get(userId);
    if (session) {
      session.lastActivity = event.timestamp;
      session.events.push(event);
    }
  }

  getCurrentSession(userId) {
    return this.userSessions.get(userId);
  }

  getSessionDuration(userId) {
    const session = this.getCurrentSession(userId);
    return session ? session.lastActivity - session.startTime : 0;
  }

  // Context gathering methods
  getEnvironmentContext() {
    return {
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      platform: navigator.platform
    };
  }

  getDeviceContext() {
    return {
      userAgent: navigator.userAgent,
      screenResolution: `${screen.width}x${screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      touchSupport: 'ontouchstart' in window
    };
  }

  getCurrentUserState(userId) {
    // This would integrate with user profile and gamification systems
    return {
      level: this.getUserLevel(userId),
      currentStreak: this.getUserStreak(userId),
      recentAchievements: this.getRecentAchievements(userId),
      motivationLevel: this.getMotivationLevel(userId)
    };
  }

  // Storage methods
  storeEvent(event) {
    this.eventStore.push(event);
    
    // In production, this would write to a database
    // For now, maintain a rolling window of recent events
    if (this.eventStore.length > 10000) {
      this.eventStore = this.eventStore.slice(-5000);
    }
  }

  getUserEvents(userId, timeframe) {
    const now = Date.now();
    let timeLimit;
    
    switch (timeframe) {
      case '1hour': timeLimit = now - (60 * 60 * 1000); break;
      case '1day': timeLimit = now - (24 * 60 * 60 * 1000); break;
      case '7days': timeLimit = now - (7 * 24 * 60 * 60 * 1000); break;
      case '30days': timeLimit = now - (30 * 24 * 60 * 60 * 1000); break;
      default: timeLimit = now - (7 * 24 * 60 * 60 * 1000);
    }
    
    return this.eventStore.filter(event => 
      event.userId === userId && event.timestamp >= timeLimit
    );
  }

  // Placeholder methods for integration with other systems
  getUserLevel(userId) { return 5; }
  getUserStreak(userId) { return 3; }
  getRecentAchievements(userId) { return []; }
  getMotivationLevel(userId) { return 0.7; }
  
  // Default responses for insufficient data
  getDefaultAnalysis(userId) {
    return {
      userId,
      patterns: { status: 'insufficient_data' },
      insights: ['Start practicing to see personalized insights!'],
      recommendations: ['Complete a few exercises to get started'],
      predictions: { confidence: 0 }
    };
  }

  getDefaultInsights(userId) {
    return {
      currentStruggleLevel: 0,
      optimalDifficulty: 0.5,
      engagementRisk: 'low',
      nextBestAction: 'start_practicing',
      interventionSuggestions: [],
      learningState: 'ready',
      motivationLevel: 0.8
    };
  }
}

export default LearningAnalyticsEngine;
