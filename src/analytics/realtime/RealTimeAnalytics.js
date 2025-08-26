/**
 * Real-Time Analytics System
 * Day 22: Real-time Analytics Implementation
 * 
 * Provides real-time progress updates, live session monitoring,
 * real-time recommendations, and performance monitoring.
 */

class WebSocketManager {
  constructor() {
    this.ws = null;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.subscribers = new Map();
    this.messageQueue = [];
    
    // For demo purposes, we'll simulate WebSocket with EventTarget
    this.eventTarget = new EventTarget();
    this.simulateConnection();
  }

  // Simulate WebSocket connection for demo
  simulateConnection() {
    console.log('Simulating WebSocket connection...');
    setTimeout(() => {
      this.isConnected = true;
      this.onOpen();
      
      // Simulate periodic messages
      this.startMessageSimulation();
    }, 1000);
  }

  startMessageSimulation() {
    // Simulate real-time updates every 5 seconds
    setInterval(() => {
      if (this.isConnected) {
        this.simulateMessage({
          type: 'progress_update',
          data: {
            userId: 'demo-user',
            currentScore: Math.floor(Math.random() * 100),
            streakCount: Math.floor(Math.random() * 10),
            sessionTime: Date.now() - (Math.random() * 3600000),
            timestamp: Date.now()
          }
        });
      }
    }, 5000);

    // Simulate achievements
    setInterval(() => {
      if (this.isConnected && Math.random() > 0.8) {
        this.simulateMessage({
          type: 'achievement_unlocked',
          data: {
            userId: 'demo-user',
            achievement: this.getRandomAchievement(),
            timestamp: Date.now()
          }
        });
      }
    }, 15000);

    // Simulate recommendations
    setInterval(() => {
      if (this.isConnected && Math.random() > 0.7) {
        this.simulateMessage({
          type: 'recommendation',
          data: {
            userId: 'demo-user',
            recommendation: this.getRandomRecommendation(),
            priority: Math.random() > 0.5 ? 'high' : 'medium',
            timestamp: Date.now()
          }
        });
      }
    }, 12000);
  }

  getRandomAchievement() {
    const achievements = [
      { id: 'streak_5', title: '5-Day Streak', description: 'Practiced for 5 days in a row!', icon: '🔥' },
      { id: 'accuracy_80', title: '80% Accuracy', description: 'Maintained 80% accuracy!', icon: '🎯' },
      { id: 'speed_demon', title: 'Speed Demon', description: 'Completed 10 exercises in under 2 minutes!', icon: '⚡' },
      { id: 'perfectionist', title: 'Perfectionist', description: 'Got 10 questions right in a row!', icon: '💎' },
      { id: 'early_bird', title: 'Early Bird', description: 'Practiced before 8 AM!', icon: '🌅' }
    ];
    return achievements[Math.floor(Math.random() * achievements.length)];
  }

  getRandomRecommendation() {
    const recommendations = [
      {
        id: 'practice_weak_area',
        title: 'Focus on Grammar',
        message: 'Your grammar scores could use some work. Try 5 more grammar exercises.',
        action: 'practice_grammar',
        exerciseType: 'multipleChoice'
      },
      {
        id: 'take_break',
        title: 'Take a Break',
        message: 'You\'ve been practicing for 45 minutes. Consider taking a 10-minute break.',
        action: 'take_break'
      },
      {
        id: 'try_harder',
        title: 'Challenge Yourself',
        message: 'You\'re doing great! Ready for harder exercises?',
        action: 'increase_difficulty'
      },
      {
        id: 'review_mistakes',
        title: 'Review Recent Mistakes',
        message: 'Let\'s review the questions you got wrong earlier.',
        action: 'review_mistakes'
      }
    ];
    return recommendations[Math.floor(Math.random() * recommendations.length)];
  }

  simulateMessage(message) {
    const event = new CustomEvent('message', { detail: message });
    this.eventTarget.dispatchEvent(event);
    this.handleMessage({ data: JSON.stringify(message) });
  }

  // Real WebSocket methods (would be used in production)
  connect(wsUrl = 'ws://localhost:8080/ws') {
    try {
      this.ws = new WebSocket(wsUrl);
      this.setupEventHandlers();
    } catch (error) {
      console.error('Failed to connect to WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  setupEventHandlers() {
    if (!this.ws) return;

    this.ws.onopen = this.onOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.onClose.bind(this);
    this.ws.onerror = this.onError.bind(this);
  }

  onOpen() {
    console.log('Real-time connection established');
    this.isConnected = true;
    this.reconnectAttempts = 0;
    
    // Send queued messages
    this.flushMessageQueue();
    
    // Notify subscribers
    this.notifySubscribers('connection', { status: 'connected' });
  }

  onClose() {
    console.log('Real-time connection closed');
    this.isConnected = false;
    this.notifySubscribers('connection', { status: 'disconnected' });
    this.scheduleReconnect();
  }

  onError(error) {
    console.error('Real-time connection error:', error);
    this.notifySubscribers('connection', { status: 'error', error });
  }

  handleMessage(event) {
    try {
      const message = JSON.parse(event.data);
      console.log('Received real-time message:', message);
      
      // Route message to appropriate handlers
      switch (message.type) {
        case 'progress_update':
          this.notifySubscribers('progress', message.data);
          break;
        case 'achievement_unlocked':
          this.notifySubscribers('achievement', message.data);
          break;
        case 'recommendation':
          this.notifySubscribers('recommendation', message.data);
          break;
        case 'session_update':
          this.notifySubscribers('session', message.data);
          break;
        case 'performance_alert':
          this.notifySubscribers('performance', message.data);
          break;
        default:
          console.warn('Unknown message type:', message.type);
      }
    } catch (error) {
      console.error('Failed to parse WebSocket message:', error);
    }
  }

  send(message) {
    if (this.isConnected && this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    } else {
      // Queue message for later
      this.messageQueue.push(message);
    }
  }

  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  scheduleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts);
      console.log(`Scheduling reconnect in ${delay}ms (attempt ${this.reconnectAttempts + 1})`);
      
      setTimeout(() => {
        this.reconnectAttempts++;
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
      this.notifySubscribers('connection', { status: 'failed' });
    }
  }

  subscribe(event, callback) {
    if (!this.subscribers.has(event)) {
      this.subscribers.set(event, new Set());
    }
    this.subscribers.get(event).add(callback);
    
    return () => {
      const eventSubscribers = this.subscribers.get(event);
      if (eventSubscribers) {
        eventSubscribers.delete(callback);
      }
    };
  }

  notifySubscribers(event, data) {
    const eventSubscribers = this.subscribers.get(event);
    if (eventSubscribers) {
      eventSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Subscriber callback error:', error);
        }
      });
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      queuedMessages: this.messageQueue.length
    };
  }
}

class RealTimeAnalytics {
  constructor() {
    this.wsManager = new WebSocketManager();
    this.eventBuffer = [];
    this.subscribers = new Map();
    this.sessionStart = Date.now();
    this.currentSession = {
      userId: 'demo-user',
      startTime: this.sessionStart,
      events: [],
      metrics: {
        exerciseCount: 0,
        correctAnswers: 0,
        totalTime: 0,
        averageResponseTime: 0
      }
    };
    
    this.setupRealTimeHandlers();
  }

  setupRealTimeHandlers() {
    // Subscribe to real-time events from WebSocket
    this.wsManager.subscribe('progress', (data) => {
      this.handleProgressUpdate(data);
    });

    this.wsManager.subscribe('achievement', (data) => {
      this.handleAchievement(data);
    });

    this.wsManager.subscribe('recommendation', (data) => {
      this.handleRecommendation(data);
    });

    this.wsManager.subscribe('connection', (data) => {
      this.handleConnectionStatus(data);
    });
  }

  // Real-time progress updates
  subscribeToProgress(userId, callback) {
    const key = `progress:${userId}`;
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) subs.delete(callback);
    };
  }

  // Live session monitoring
  subscribeToSessionUpdates(userId, callback) {
    const key = `session:${userId}`;
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) subs.delete(callback);
    };
  }

  // Real-time recommendations
  subscribeToRecommendations(userId, callback) {
    const key = `recommendations:${userId}`;
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) subs.delete(callback);
    };
  }

  // Performance monitoring
  subscribeToPerformanceAlerts(userId, callback) {
    const key = `performance:${userId}`;
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    return () => {
      const subs = this.subscribers.get(key);
      if (subs) subs.delete(callback);
    };
  }

  // Handle incoming real-time events
  handleProgressUpdate(data) {
    console.log('Real-time progress update:', data);
    this.notifySubscribers(`progress:${data.userId}`, data);
    
    // Update current session
    this.updateCurrentSession(data);
  }

  handleAchievement(data) {
    console.log('Achievement unlocked:', data);
    this.notifySubscribers(`achievements:${data.userId}`, data);
    
    // Show achievement notification
    this.showAchievementNotification(data.achievement);
  }

  handleRecommendation(data) {
    console.log('New recommendation:', data);
    this.notifySubscribers(`recommendations:${data.userId}`, data);
  }

  handleConnectionStatus(data) {
    console.log('Connection status update:', data);
    this.notifySubscribers('connection', data);
  }

  // Update current session with real-time data
  updateCurrentSession(data) {
    this.currentSession.metrics = {
      ...this.currentSession.metrics,
      currentScore: data.currentScore,
      streakCount: data.streakCount,
      sessionTime: Date.now() - this.sessionStart
    };
    
    // Notify session subscribers
    this.notifySubscribers(`session:${data.userId}`, this.currentSession);
  }

  // Track exercise completion in real-time
  trackExerciseCompletion(exerciseData) {
    const event = {
      type: 'exercise_completed',
      timestamp: Date.now(),
      ...exerciseData
    };
    
    // Add to current session
    this.currentSession.events.push(event);
    this.currentSession.metrics.exerciseCount++;
    
    if (exerciseData.isCorrect) {
      this.currentSession.metrics.correctAnswers++;
    }
    
    // Calculate metrics
    this.calculateRealTimeMetrics();
    
    // Send to server via WebSocket
    this.wsManager.send({
      type: 'exercise_completed',
      data: event
    });
    
    // Check for performance alerts
    this.checkPerformanceAlerts();
  }

  calculateRealTimeMetrics() {
    const { events, metrics } = this.currentSession;
    
    if (events.length > 0) {
      // Calculate average response time
      const responseTimes = events
        .filter(e => e.responseTime)
        .map(e => e.responseTime);
      
      if (responseTimes.length > 0) {
        metrics.averageResponseTime = responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length;
      }
      
      // Calculate accuracy
      metrics.accuracy = (metrics.correctAnswers / metrics.exerciseCount) * 100;
      
      // Calculate session duration
      metrics.sessionDuration = Date.now() - this.sessionStart;
    }
  }

  checkPerformanceAlerts() {
    const { metrics } = this.currentSession;
    
    // Alert if accuracy drops below 60%
    if (metrics.exerciseCount >= 5 && metrics.accuracy < 60) {
      this.triggerPerformanceAlert({
        type: 'low_accuracy',
        message: 'Your accuracy has dropped below 60%. Consider taking a break or reviewing the material.',
        severity: 'warning',
        suggestions: ['Take a 5-minute break', 'Review recent mistakes', 'Try easier exercises']
      });
    }
    
    // Alert if response time is too slow
    if (metrics.averageResponseTime > 10000) { // 10 seconds
      this.triggerPerformanceAlert({
        type: 'slow_response',
        message: 'You might be overthinking. Trust your instincts!',
        severity: 'info',
        suggestions: ['Read questions more quickly', 'Trust your first instinct', 'Practice time management']
      });
    }
    
    // Alert for extended session
    if (metrics.sessionDuration > 3600000) { // 1 hour
      this.triggerPerformanceAlert({
        type: 'long_session',
        message: 'You\'ve been practicing for over an hour. Great dedication! Consider taking a break.',
        severity: 'info',
        suggestions: ['Take a 15-minute break', 'Do some physical exercise', 'Hydrate yourself']
      });
    }
  }

  triggerPerformanceAlert(alert) {
    console.log('Performance alert triggered:', alert);
    this.notifySubscribers(`performance:${this.currentSession.userId}`, {
      ...alert,
      timestamp: Date.now()
    });
  }

  showAchievementNotification(achievement) {
    // In a real app, this would show a toast notification
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`🎉 ${achievement.title}`, {
          body: achievement.description,
          icon: '/favicon.ico'
        });
      }
    }
  }

  // Get current session stats
  getCurrentSession() {
    return {
      ...this.currentSession,
      duration: Date.now() - this.sessionStart,
      isActive: true
    };
  }

  // Get real-time recommendations
  async generateRealTimeRecommendations(userId) {
    const session = this.getCurrentSession();
    const recommendations = [];
    
    // Analyze recent performance
    const recentEvents = session.events.slice(-10);
    const recentAccuracy = recentEvents.length > 0 
      ? (recentEvents.filter(e => e.isCorrect).length / recentEvents.length) * 100
      : 0;
    
    if (recentAccuracy < 70) {
      recommendations.push({
        type: 'practice_focus',
        priority: 'high',
        title: 'Focus on Weak Areas',
        message: 'Your recent accuracy is below 70%. Let\'s focus on your weak areas.',
        action: 'show_weak_areas'
      });
    }
    
    if (session.metrics.exerciseCount > 0 && session.metrics.exerciseCount % 10 === 0) {
      recommendations.push({
        type: 'milestone',
        priority: 'medium',
        title: 'Great Progress!',
        message: `You've completed ${session.metrics.exerciseCount} exercises this session!`,
        action: 'celebrate'
      });
    }
    
    return recommendations;
  }

  notifySubscribers(key, data) {
    const subs = this.subscribers.get(key);
    if (subs) {
      subs.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error('Real-time subscriber error:', error);
        }
      });
    }
  }

  // Clean up resources
  disconnect() {
    this.wsManager.disconnect();
    this.subscribers.clear();
  }

  getConnectionStatus() {
    return this.wsManager.getConnectionStatus();
  }
}

// Export singleton instance
export const realTimeAnalytics = new RealTimeAnalytics();
export { RealTimeAnalytics, WebSocketManager };
