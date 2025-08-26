/**
 * Timer Manager
 * Handles exercise timing with multiple timer types
 */

export class TimerManager {
  constructor(config = {}) {
    this.config = {
      autoStart: false,
      enablePauseResume: true,
      globalTimeLimit: null, // No global limit by default
      questionTimeLimit: null, // No per-question limit by default
      warningThreshold: 0.8, // Warning at 80% of time
      ...config
    };
    
    this.timers = new Map();
    this.intervals = new Map();
    this.callbacks = new Map();
    this.isGlobalPaused = false;
    
    // Event handling
    this.eventHandlers = new Map();
    
    this.initializeTimers();
  }
  
  initializeTimers() {
    // Global exercise timer
    this.timers.set('global', {
      type: 'global',
      startTime: null,
      endTime: null,
      pausedTime: 0,
      isPaused: false,
      limit: this.config.globalTimeLimit,
      elapsed: 0
    });
    
    // Current question timer
    this.timers.set('question', {
      type: 'question',
      startTime: null,
      endTime: null,
      pausedTime: 0,
      isPaused: false,
      limit: this.config.questionTimeLimit,
      elapsed: 0,
      questionIndex: null
    });
    
    // Individual question timings
    this.timers.set('questions', new Map());
  }
  
  // Event handling
  on(event, callback) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(callback);
  }
  
  off(event, callback) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      const index = handlers.indexOf(callback);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }
  
  emit(event, data) {
    if (this.eventHandlers.has(event)) {
      this.eventHandlers.get(event).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Timer event error for ${event}:`, error);
        }
      });
    }
  }
  
  // Generic start method (alias for startGlobal)
  start() {
    return this.startGlobal();
  }
  
  // Start global timer
  startGlobal() {
    const globalTimer = this.timers.get('global');
    
    if (globalTimer.startTime === null) {
      globalTimer.startTime = Date.now();
      
      // Start interval for updates
      this.intervals.set('global', setInterval(() => {
        this.updateTimer('global');
      }, 100)); // Update every 100ms for smooth display
      
      this.emit('globalStarted', {
        startTime: globalTimer.startTime,
        limit: globalTimer.limit
      });
    }
  }
  
  // Start question timer
  startQuestion(questionIndex) {
    const questionTimer = this.timers.get('question');
    const questionsMap = this.timers.get('questions');
    
    // End previous question if any
    if (questionTimer.startTime !== null && questionTimer.questionIndex !== null) {
      this.endQuestion();
    }
    
    // Start new question timer
    questionTimer.startTime = Date.now();
    questionTimer.endTime = null;
    questionTimer.pausedTime = 0;
    questionTimer.isPaused = false;
    questionTimer.elapsed = 0;
    questionTimer.questionIndex = questionIndex;
    
    // Initialize question in questions map
    questionsMap.set(questionIndex, {
      startTime: questionTimer.startTime,
      endTime: null,
      elapsed: 0,
      pausedTime: 0
    });
    
    // Start question interval
    this.intervals.set('question', setInterval(() => {
      this.updateTimer('question');
    }, 100));
    
    this.emit('questionStarted', {
      questionIndex,
      startTime: questionTimer.startTime,
      limit: questionTimer.limit
    });
  }
  
  // End question timer
  endQuestion() {
    const questionTimer = this.timers.get('question');
    const questionsMap = this.timers.get('questions');
    
    if (questionTimer.startTime !== null && questionTimer.questionIndex !== null) {
      const now = Date.now();
      questionTimer.endTime = now;
      
      // Calculate final elapsed time
      const elapsed = this.calculateElapsed(questionTimer);
      questionTimer.elapsed = elapsed;
      
      // Update questions map
      const questionData = questionsMap.get(questionTimer.questionIndex);
      if (questionData) {
        questionData.endTime = now;
        questionData.elapsed = elapsed;
      }
      
      // Clear interval
      if (this.intervals.has('question')) {
        clearInterval(this.intervals.get('question'));
        this.intervals.delete('question');
      }
      
      this.emit('questionEnded', {
        questionIndex: questionTimer.questionIndex,
        elapsed,
        endTime: now
      });
      
      // Reset for next question
      const completedQuestionIndex = questionTimer.questionIndex;
      questionTimer.startTime = null;
      questionTimer.questionIndex = null;
      
      return { questionIndex: completedQuestionIndex, elapsed };
    }
    
    return null;
  }
  
  // Pause timers
  pause() {
    if (this.isGlobalPaused) return;
    
    this.isGlobalPaused = true;
    const now = Date.now();
    
    // Pause global timer
    const globalTimer = this.timers.get('global');
    if (globalTimer.startTime && !globalTimer.isPaused) {
      globalTimer.isPaused = true;
      globalTimer.pauseStartTime = now;
    }
    
    // Pause question timer
    const questionTimer = this.timers.get('question');
    if (questionTimer.startTime && !questionTimer.isPaused) {
      questionTimer.isPaused = true;
      questionTimer.pauseStartTime = now;
    }
    
    // Clear all intervals
    this.intervals.forEach((interval, key) => {
      clearInterval(interval);
    });
    this.intervals.clear();
    
    this.emit('paused', { pauseTime: now });
  }
  
  // Resume timers
  resume() {
    if (!this.isGlobalPaused) return;
    
    this.isGlobalPaused = false;
    const now = Date.now();
    
    // Resume global timer
    const globalTimer = this.timers.get('global');
    if (globalTimer.isPaused) {
      globalTimer.pausedTime += now - globalTimer.pauseStartTime;
      globalTimer.isPaused = false;
      delete globalTimer.pauseStartTime;
      
      // Restart global interval
      this.intervals.set('global', setInterval(() => {
        this.updateTimer('global');
      }, 100));
    }
    
    // Resume question timer
    const questionTimer = this.timers.get('question');
    if (questionTimer.isPaused) {
      questionTimer.pausedTime += now - questionTimer.pauseStartTime;
      questionTimer.isPaused = false;
      delete questionTimer.pauseStartTime;
      
      // Restart question interval
      this.intervals.set('question', setInterval(() => {
        this.updateTimer('question');
      }, 100));
    }
    
    this.emit('resumed', { resumeTime: now });
  }
  
  // Update timer and check limits
  updateTimer(timerKey) {
    const timer = this.timers.get(timerKey);
    if (!timer || timer.isPaused) return;
    
    const elapsed = this.calculateElapsed(timer);
    timer.elapsed = elapsed;
    
    // Emit update event
    this.emit('timerUpdate', {
      type: timerKey,
      elapsed,
      limit: timer.limit,
      remaining: timer.limit ? timer.limit - elapsed : null
    });
    
    // Check time warnings and limits
    this.checkTimeWarnings(timerKey, timer);
    this.checkTimeLimits(timerKey, timer);
  }
  
  checkTimeWarnings(timerKey, timer) {
    if (!timer.limit || timer.elapsed < timer.limit * this.config.warningThreshold) {
      return;
    }
    
    // Emit warning only once
    if (!timer.warningEmitted) {
      timer.warningEmitted = true;
      this.emit('timeWarning', {
        type: timerKey,
        elapsed: timer.elapsed,
        limit: timer.limit,
        remaining: timer.limit - timer.elapsed
      });
    }
  }
  
  checkTimeLimits(timerKey, timer) {
    if (!timer.limit || timer.elapsed < timer.limit) {
      return;
    }
    
    // Time limit exceeded
    this.emit('timeLimitExceeded', {
      type: timerKey,
      elapsed: timer.elapsed,
      limit: timer.limit
    });
    
    // Auto-handle limit exceeded
    if (timerKey === 'global') {
      this.stopAll();
    } else if (timerKey === 'question') {
      this.endQuestion();
    }
  }
  
  calculateElapsed(timer) {
    if (!timer.startTime) return 0;
    
    const now = Date.now();
    let elapsed;
    
    if (timer.endTime) {
      // Timer has ended
      elapsed = timer.endTime - timer.startTime - timer.pausedTime;
    } else if (timer.isPaused) {
      // Timer is currently paused
      elapsed = timer.pauseStartTime - timer.startTime - timer.pausedTime;
    } else {
      // Timer is running
      elapsed = now - timer.startTime - timer.pausedTime;
    }
    
    return Math.max(0, elapsed);
  }
  
  // Stop all timers
  stopAll() {
    // End current question
    this.endQuestion();
    
    // Stop global timer
    const globalTimer = this.timers.get('global');
    if (globalTimer.startTime && !globalTimer.endTime) {
      globalTimer.endTime = Date.now();
      globalTimer.elapsed = this.calculateElapsed(globalTimer);
    }
    
    // Clear all intervals
    this.intervals.forEach(interval => clearInterval(interval));
    this.intervals.clear();
    
    this.emit('allStopped', {
      globalElapsed: globalTimer.elapsed,
      totalQuestions: this.timers.get('questions').size
    });
  }
  
  // Get current state
  getState() {
    const globalTimer = this.timers.get('global');
    const questionTimer = this.timers.get('question');
    const questionsMap = this.timers.get('questions');
    
    return {
      global: {
        elapsed: this.calculateElapsed(globalTimer),
        isRunning: globalTimer.startTime !== null && globalTimer.endTime === null,
        isPaused: globalTimer.isPaused,
        limit: globalTimer.limit,
        remaining: globalTimer.limit ? globalTimer.limit - this.calculateElapsed(globalTimer) : null
      },
      currentQuestion: {
        elapsed: questionTimer.startTime ? this.calculateElapsed(questionTimer) : 0,
        isRunning: questionTimer.startTime !== null && questionTimer.endTime === null,
        isPaused: questionTimer.isPaused,
        questionIndex: questionTimer.questionIndex,
        limit: questionTimer.limit,
        remaining: questionTimer.limit ? questionTimer.limit - this.calculateElapsed(questionTimer) : null
      },
      completedQuestions: Array.from(questionsMap.entries()).map(([index, data]) => ({
        questionIndex: index,
        elapsed: data.elapsed || this.calculateElapsed(data),
        completed: data.endTime !== null
      })),
      isPaused: this.isGlobalPaused
    };
  }
  
  // Get question timing
  getQuestionTime(questionIndex) {
    const questionsMap = this.timers.get('questions');
    const questionData = questionsMap.get(questionIndex);
    
    if (questionData) {
      return questionData.elapsed || this.calculateElapsed(questionData);
    }
    
    return 0;
  }
  
  // Get total time
  getTotalTime() {
    return this.calculateElapsed(this.timers.get('global'));
  }
  
  // Format time for display
  formatTime(milliseconds) {
    if (milliseconds < 0) return '00:00';
    
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  // Update configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    
    // Update timer limits if changed
    if (newConfig.globalTimeLimit !== undefined) {
      this.timers.get('global').limit = newConfig.globalTimeLimit;
    }
    
    if (newConfig.questionTimeLimit !== undefined) {
      this.timers.get('question').limit = newConfig.questionTimeLimit;
    }
  }
  
  // Reset all timers
  reset() {
    this.stopAll();
    this.timers.clear();
    this.intervals.clear();
    this.isGlobalPaused = false;
    this.initializeTimers();
    
    this.emit('reset');
  }
  
  // Clean up
  destroy() {
    this.stopAll();
    this.eventHandlers.clear();
    this.callbacks.clear();
  }
}

export default TimerManager;
