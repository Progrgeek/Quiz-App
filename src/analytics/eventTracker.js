/**
 * Analytics Event Tracking System
 * Comprehensive event collection and processing infrastructure
 */

import { AnalyticsEventModel } from './models.js';

// Event type definitions
export const ANALYTICS_EVENTS = {
  // Session Events
  SESSION_START: 'session_start',
  SESSION_END: 'session_end',
  SESSION_PAUSE: 'session_pause',
  SESSION_RESUME: 'session_resume',
  SESSION_IDLE: 'session_idle',
  SESSION_ACTIVE: 'session_active',
  
  // Exercise Events
  EXERCISE_START: 'exercise_start',
  EXERCISE_COMPLETE: 'exercise_complete',
  EXERCISE_ABANDON: 'exercise_abandon',
  EXERCISE_PAUSE: 'exercise_pause',
  EXERCISE_RESUME: 'exercise_resume',
  EXERCISE_RESET: 'exercise_reset',
  
  // Question Events
  QUESTION_VIEW: 'question_view',
  QUESTION_START: 'question_start',
  ANSWER_SUBMIT: 'answer_submit',
  ANSWER_CORRECT: 'answer_correct',
  ANSWER_INCORRECT: 'answer_incorrect',
  QUESTION_SKIP: 'question_skip',
  QUESTION_REVIEW: 'question_review',
  
  // Learning Events
  HINT_REQUEST: 'hint_request',
  HINT_VIEW: 'hint_view',
  EXPLANATION_VIEW: 'explanation_view',
  FEEDBACK_VIEW: 'feedback_view',
  
  // Progress Events
  SKILL_LEVEL_UP: 'skill_level_up',
  ACHIEVEMENT_UNLOCK: 'achievement_unlock',
  STREAK_MILESTONE: 'streak_milestone',
  GOAL_SET: 'goal_set',
  GOAL_ACHIEVED: 'goal_achieved',
  GOAL_UPDATED: 'goal_updated',
  
  // Engagement Events
  BOOKMARK_ADD: 'bookmark_add',
  BOOKMARK_REMOVE: 'bookmark_remove',
  RATING_PROVIDED: 'rating_provided',
  FEEDBACK_PROVIDED: 'feedback_provided',
  SETTING_CHANGED: 'setting_changed',
  HELP_ACCESSED: 'help_accessed',
  
  // Navigation Events
  PAGE_VIEW: 'page_view',
  NAVIGATION_CLICK: 'navigation_click',
  SEARCH_PERFORMED: 'search_performed',
  FILTER_APPLIED: 'filter_applied',
  
  // Error Events
  ERROR_OCCURRED: 'error_occurred',
  PERFORMANCE_ISSUE: 'performance_issue',
  CONNECTION_LOST: 'connection_lost',
  DATA_SYNC_FAILED: 'data_sync_failed'
};

// Event priority levels
export const EVENT_PRIORITY = {
  CRITICAL: 'critical',    // Must be processed immediately
  HIGH: 'high',           // Should be processed within 1 minute
  MEDIUM: 'medium',       // Should be processed within 5 minutes
  LOW: 'low'             // Can be processed in batch
};

// Event validation rules
const EVENT_VALIDATION_RULES = {
  [ANALYTICS_EVENTS.SESSION_START]: {
    required: ['userId', 'sessionId'],
    optional: ['deviceType', 'userAgent', 'timestamp']
  },
  [ANALYTICS_EVENTS.EXERCISE_START]: {
    required: ['userId', 'sessionId', 'exerciseId', 'exerciseType'],
    optional: ['difficulty', 'topic', 'timestamp']
  },
  [ANALYTICS_EVENTS.ANSWER_SUBMIT]: {
    required: ['userId', 'sessionId', 'exerciseId', 'questionId', 'answer'],
    optional: ['timeToAnswer', 'hintsUsed', 'confidence', 'timestamp']
  }
};

class AnalyticsEventTracker {
  constructor() {
    this.eventQueue = [];
    this.batchSize = 50;
    this.flushInterval = 30000; // 30 seconds
    this.sessionId = this.generateSessionId();
    this.userId = null;
    this.isOnline = navigator.onLine;
    this.retryQueue = [];
    
    // Setup automatic flushing
    this.setupAutoFlush();
    
    // Listen for online/offline events
    this.setupConnectionListeners();
    
    // Setup page unload handling
    this.setupUnloadHandlers();
  }
  
  // Generate unique session ID
  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Set user ID for tracking
  setUserId(userId) {
    this.userId = userId;
    this.track(ANALYTICS_EVENTS.SESSION_START, {
      userId,
      sessionId: this.sessionId,
      timestamp: new Date().toISOString()
    });
  }
  
  // Main tracking method
  track(eventType, data = {}, priority = EVENT_PRIORITY.MEDIUM) {
    try {
      const event = this.createEvent(eventType, data, priority);
      
      // Validate event
      const validation = this.validateEvent(event);
      if (!validation.isValid) {
        console.warn('Invalid analytics event:', validation.errors);
        return false;
      }
      
      // Add to queue
      this.eventQueue.push(event);
      
      // Flush immediately for critical events
      if (priority === EVENT_PRIORITY.CRITICAL) {
        this.flush();
      }
      
      // Flush if queue is full
      if (this.eventQueue.length >= this.batchSize) {
        this.flush();
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      return false;
    }
  }
  
  // Create standardized event object
  createEvent(eventType, data, priority) {
    const event = {
      ...AnalyticsEventModel,
      eventId: this.generateEventId(),
      userId: this.userId || 'anonymous',
      sessionId: this.sessionId,
      eventType,
      timestamp: new Date().toISOString(),
      data: { ...data },
      metadata: {
        source: 'web',
        version: '1.0.0',
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        priority,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      processed: false,
      batchId: null
    };
    
    return event;
  }
  
  // Generate unique event ID
  generateEventId() {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Validate event against rules
  validateEvent(event) {
    const rules = EVENT_VALIDATION_RULES[event.eventType];
    const errors = [];
    
    if (!rules) {
      return { isValid: true, errors: [] }; // No specific validation rules
    }
    
    // Check required fields
    for (const field of rules.required || []) {
      if (!(field in event.data) && !(field in event)) {
        errors.push(`Missing required field: ${field}`);
      }
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  
  // Flush events to storage/server
  async flush() {
    if (this.eventQueue.length === 0) return;
    
    const events = [...this.eventQueue];
    this.eventQueue = [];
    
    const batchId = this.generateBatchId();
    events.forEach(event => event.batchId = batchId);
    
    try {
      // Store locally first
      await this.storeEventsLocally(events);
      
      // Try to send to server if online
      if (this.isOnline) {
        await this.sendEventsToServer(events);
      } else {
        // Add to retry queue for when back online
        this.retryQueue.push(...events);
      }
    } catch (error) {
      console.error('Error flushing analytics events:', error);
      // Put events back in queue for retry
      this.retryQueue.push(...events);
    }
  }
  
  // Generate batch ID
  generateBatchId() {
    return `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  // Store events in local storage
  async storeEventsLocally(events) {
    try {
      const existingEvents = JSON.parse(localStorage.getItem('analytics_events') || '[]');
      const allEvents = [...existingEvents, ...events];
      
      // Keep only last 1000 events to prevent storage overflow
      const recentEvents = allEvents.slice(-1000);
      
      localStorage.setItem('analytics_events', JSON.stringify(recentEvents));
    } catch (error) {
      console.error('Error storing events locally:', error);
    }
  }
  
  // Send events to server
  async sendEventsToServer(events) {
    try {
      const response = await fetch('/api/analytics/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events })
      });
      
      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }
      
      // Mark events as processed
      events.forEach(event => event.processed = true);
      
    } catch (error) {
      // For demo purposes, just log - in production would retry
      console.log('Analytics events (would be sent to server):', events);
    }
  }
  
  // Setup automatic flushing
  setupAutoFlush() {
    setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }
  
  // Setup connection listeners
  setupConnectionListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.processRetryQueue();
    });
    
    window.addEventListener('offline', () => {
      this.isOnline = false;
    });
  }
  
  // Process retry queue when back online
  async processRetryQueue() {
    if (this.retryQueue.length === 0) return;
    
    const events = [...this.retryQueue];
    this.retryQueue = [];
    
    try {
      await this.sendEventsToServer(events);
    } catch (error) {
      console.error('Error processing retry queue:', error);
      // Put events back for another retry
      this.retryQueue.push(...events);
    }
  }
  
  // Setup page unload handlers
  setupUnloadHandlers() {
    const handleUnload = () => {
      // Track session end
      this.track(ANALYTICS_EVENTS.SESSION_END, {
        sessionDuration: Date.now() - this.sessionStartTime,
        timestamp: new Date().toISOString()
      }, EVENT_PRIORITY.CRITICAL);
      
      // Force flush remaining events
      this.flush();
    };
    
    window.addEventListener('beforeunload', handleUnload);
    window.addEventListener('unload', handleUnload);
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.track(ANALYTICS_EVENTS.SESSION_PAUSE, {
          timestamp: new Date().toISOString()
        });
      } else {
        this.track(ANALYTICS_EVENTS.SESSION_RESUME, {
          timestamp: new Date().toISOString()
        });
      }
    });
  }
  
  // Convenience methods for common events
  trackExerciseStart(exerciseData) {
    return this.track(ANALYTICS_EVENTS.EXERCISE_START, exerciseData, EVENT_PRIORITY.HIGH);
  }
  
  trackExerciseComplete(exerciseData) {
    return this.track(ANALYTICS_EVENTS.EXERCISE_COMPLETE, exerciseData, EVENT_PRIORITY.HIGH);
  }
  
  trackAnswerSubmit(answerData) {
    return this.track(ANALYTICS_EVENTS.ANSWER_SUBMIT, answerData, EVENT_PRIORITY.MEDIUM);
  }
  
  trackHintRequest(hintData) {
    return this.track(ANALYTICS_EVENTS.HINT_REQUEST, hintData, EVENT_PRIORITY.LOW);
  }
  
  trackSkillLevelUp(skillData) {
    return this.track(ANALYTICS_EVENTS.SKILL_LEVEL_UP, skillData, EVENT_PRIORITY.HIGH);
  }
  
  trackAchievementUnlock(achievementData) {
    return this.track(ANALYTICS_EVENTS.ACHIEVEMENT_UNLOCK, achievementData, EVENT_PRIORITY.HIGH);
  }
  
  trackError(errorData) {
    return this.track(ANALYTICS_EVENTS.ERROR_OCCURRED, errorData, EVENT_PRIORITY.CRITICAL);
  }
  
  // Get stored events (for debugging/analysis)
  getStoredEvents() {
    try {
      return JSON.parse(localStorage.getItem('analytics_events') || '[]');
    } catch (error) {
      console.error('Error retrieving stored events:', error);
      return [];
    }
  }
  
  // Clear stored events
  clearStoredEvents() {
    localStorage.removeItem('analytics_events');
  }
  
  // Get session statistics
  getSessionStats() {
    const events = this.getStoredEvents().filter(e => e.sessionId === this.sessionId);
    
    const stats = {
      sessionId: this.sessionId,
      eventsCount: events.length,
      exercisesStarted: events.filter(e => e.eventType === ANALYTICS_EVENTS.EXERCISE_START).length,
      exercisesCompleted: events.filter(e => e.eventType === ANALYTICS_EVENTS.EXERCISE_COMPLETE).length,
      answersSubmitted: events.filter(e => e.eventType === ANALYTICS_EVENTS.ANSWER_SUBMIT).length,
      hintsRequested: events.filter(e => e.eventType === ANALYTICS_EVENTS.HINT_REQUEST).length,
      errors: events.filter(e => e.eventType === ANALYTICS_EVENTS.ERROR_OCCURRED).length
    };
    
    return stats;
  }
}

// Create global instance
export const analyticsTracker = new AnalyticsEventTracker();

// Export for use in other modules
export default AnalyticsEventTracker;
