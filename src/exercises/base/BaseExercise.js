/**
 * Base Exercise Class
 * 
 * Universal foundation for all exercise types that preserves original functionality
 * while providing a scalable, extensible architecture.
 * 
 * This class implements the Template Method pattern and provides:
 * - Common lifecycle management
 * - State management
 * - Event handling
 * - Plugin system
 * - Internationalization integration
 * - Analytics integration
 * - Accessibility features
 */

import { ExerciseI18n } from '../../i18n/ExerciseI18n.js';
import { validateExercise } from '../../validation/SchemaValidator.js';

/**
 * Base Exercise Class
 * Abstract base class that all exercise types extend
 */
export class BaseExercise {
  constructor(config = {}) {
    // Core configuration
    this.id = config.id || this.generateId();
    this.schema = config.schema || {};
    this.exerciseData = config.exerciseData || {};
    
    // Initialize systems
    this.i18n = new ExerciseI18n(config.language || 'en');
    this.analytics = config.analytics || new MockAnalytics();
    this.accessibility = config.accessibility || new AccessibilityHelper();
    
    // State management
    this.state = this.initializeState();
    this.listeners = new Map();
    this.plugins = new Map();
    
    // Lifecycle flags
    this.initialized = false;
    this.mounted = false;
    this.destroyed = false;
    
    // Performance tracking
    this.startTime = null;
    this.endTime = null;
    
    // Bind methods
    this.handleStateChange = this.handleStateChange.bind(this);
    this.handleUserInteraction = this.handleUserInteraction.bind(this);
  }

  /**
   * Initialize the exercise state
   * @returns {Object} Initial state
   */
  initializeState() {
    return {
      // Exercise progress
      currentIndex: 0,
      completed: false,
      started: false,
      paused: false,
      
      // User interactions
      userAnswers: [],
      selectedOptions: new Set(),
      attempts: 0,
      hintsUsed: 0,
      
      // Timing
      timeElapsed: 0,
      timeRemaining: null,
      
      // Scoring
      score: 0,
      accuracy: 0,
      pointsEarned: 0,
      
      // Feedback
      showFeedback: false,
      lastAnswerCorrect: false,
      showIncorrectFeedback: false,
      
      // UI state
      loading: false,
      error: null,
      disabled: false,
      
      // Accessibility
      announcements: [],
      focusedElement: null
    };
  }

  /**
   * Initialize the exercise (Template method)
   * This method orchestrates the initialization process
   */
  async initialize() {
    if (this.initialized) return;
    
    try {
      // 1. Validate schema
      await this.validateSchema();
      
      // 2. Load content and translations
      await this.loadContent();
      
      // 3. Setup interactions
      this.setupInteractions();
      
      // 4. Bind events
      this.bindEvents();
      
      // 5. Initialize plugins
      this.initializePlugins();
      
      // 6. Setup accessibility
      this.setupAccessibility();
      
      // 7. Start analytics tracking
      this.startTracking();
      
      this.initialized = true;
      this.emit('initialized', { exercise: this });
      
    } catch (error) {
      this.handleError('initialization', error);
      throw error;
    }
  }

  /**
   * Validate the exercise schema
   */
  async validateSchema() {
    if (!this.schema || Object.keys(this.schema).length === 0) {
      console.warn('No schema provided, skipping validation');
      return;
    }
    
    const validation = validateExercise(this.schema);
    if (!validation.success) {
      console.error('Schema validation failed:', validation.errors);
      // Don't throw error to maintain backward compatibility
      // throw new Error(`Schema validation failed: ${validation.errors.map(e => e.message).join(', ')}`);
    }
    
    if (validation.warnings && validation.warnings.length > 0) {
      console.warn('Schema validation warnings:', validation.warnings);
    }
  }

  /**
   * Load exercise content and translations
   */
  async loadContent() {
    // Load translations
    await this.i18n.initializeTranslations();
    
    // Load any additional content (media, etc.)
    await this.loadMediaContent();
    
    // Process exercise data
    this.processExerciseData();
  }

  /**
   * Load media content (images, audio, etc.)
   */
  async loadMediaContent() {
    // This would be implemented to preload media content
    // For now, it's a placeholder
    return Promise.resolve();
  }

  /**
   * Process exercise data for compatibility
   */
  processExerciseData() {
    // Transform legacy data format if needed
    if (this.exerciseData && !this.schema) {
      console.log('Processing legacy exercise data...');
      // This would use DataMigration to transform legacy data
    }
  }

  /**
   * Setup user interactions
   */
  setupInteractions() {
    // Override in subclasses to setup specific interactions
    this.setupCommonInteractions();
  }

  /**
   * Setup common interactions available to all exercise types
   */
  setupCommonInteractions() {
    // Timer management
    this.setupTimer();
    
    // Keyboard shortcuts
    this.setupKeyboardShortcuts();
    
    // Touch/mouse interactions
    this.setupPointerInteractions();
  }

  /**
   * Setup timer functionality
   */
  setupTimer() {
    this.timer = setInterval(() => {
      if (this.state.started && !this.state.paused && !this.state.completed) {
        this.updateState({ timeElapsed: this.state.timeElapsed + 1 });
        
        // Check time limit
        if (this.schema.metadata?.configuration?.timeLimit) {
          const remaining = this.schema.metadata.configuration.timeLimit - this.state.timeElapsed;
          this.updateState({ timeRemaining: Math.max(0, remaining) });
          
          if (remaining <= 0) {
            this.handleTimeUp();
          }
        }
      }
    }, 1000);
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts() {
    const shortcuts = {
      'Enter': () => this.submitAnswer(),
      'Space': () => this.submitAnswer(),
      'Escape': () => this.reset(),
      'h': () => this.showHint(),
      'r': () => this.reset(),
      '1': () => this.selectOption(0),
      '2': () => this.selectOption(1),
      '3': () => this.selectOption(2),
      '4': () => this.selectOption(3),
      '5': () => this.selectOption(4)
    };
    
    this.keyboardHandler = (event) => {
      const key = event.key;
      if (shortcuts[key] && !event.ctrlKey && !event.altKey && !event.metaKey) {
        event.preventDefault();
        shortcuts[key]();
      }
    };
  }

  /**
   * Setup pointer interactions (mouse, touch)
   */
  setupPointerInteractions() {
    // This would setup common pointer interactions
    // Implementation depends on specific exercise needs
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Bind keyboard events
    if (this.keyboardHandler) {
      document.addEventListener('keydown', this.keyboardHandler);
    }
    
    // Bind state change events
    this.on('stateChange', this.handleStateChange);
    this.on('userInteraction', this.handleUserInteraction);
  }

  /**
   * Initialize plugins
   */
  initializePlugins() {
    for (const [name, plugin] of this.plugins) {
      try {
        plugin.initialize(this);
      } catch (error) {
        console.error(`Failed to initialize plugin ${name}:`, error);
      }
    }
  }

  /**
   * Setup accessibility features
   */
  setupAccessibility() {
    this.accessibility.setup(this);
  }

  /**
   * Start analytics tracking
   */
  startTracking() {
    this.startTime = Date.now();
    this.analytics.trackEvent('exercise_started', {
      exerciseId: this.id,
      exerciseType: this.getType(),
      timestamp: this.startTime
    });
  }

  /**
   * Abstract methods to be implemented by subclasses
   */
  
  render() {
    throw new Error('render() must be implemented by subclass');
  }
  
  validateAnswer(answer) {
    throw new Error('validateAnswer() must be implemented by subclass');
  }
  
  calculateScore(answer) {
    throw new Error('calculateScore() must be implemented by subclass');
  }
  
  getType() {
    throw new Error('getType() must be implemented by subclass');
  }

  /**
   * Common methods available to all exercise types
   */

  /**
   * Start the exercise
   */
  start() {
    if (this.state.started) return;
    
    this.updateState({ 
      started: true, 
      startTime: Date.now() 
    });
    
    this.emit('started', { exercise: this });
    this.announceToScreenReader(this.t('accessibility.exerciseStarted'));
  }

  /**
   * Pause the exercise
   */
  pause() {
    this.updateState({ paused: true });
    this.emit('paused', { exercise: this });
  }

  /**
   * Resume the exercise
   */
  resume() {
    this.updateState({ paused: false });
    this.emit('resumed', { exercise: this });
  }

  /**
   * Reset the exercise
   */
  reset() {
    const newState = this.initializeState();
    this.setState(newState);
    this.emit('reset', { exercise: this });
    this.announceToScreenReader(this.t('accessibility.exerciseReset'));
  }

  /**
   * Submit user's answer
   */
  async submitAnswer(answer = null) {
    if (this.state.completed || this.state.loading) return;
    
    this.updateState({ loading: true });
    
    try {
      // Get the answer to validate
      const answerToValidate = answer || this.getCurrentAnswer();
      
      // Validate the answer
      const validation = await this.validateAnswer(answerToValidate);
      
      // Calculate score
      const score = this.calculateScore(answerToValidate);
      
      // Update state
      this.updateState({
        userAnswers: [...this.state.userAnswers, answerToValidate],
        attempts: this.state.attempts + 1,
        score: this.state.score + score,
        lastAnswerCorrect: validation.isCorrect,
        showFeedback: true,
        loading: false
      });
      
      // Track the answer
      this.analytics.trackEvent('answer_submitted', {
        exerciseId: this.id,
        answer: answerToValidate,
        correct: validation.isCorrect,
        score: score,
        attempts: this.state.attempts + 1
      });
      
      // Provide feedback
      this.provideFeedback(validation);
      
      // Emit event
      this.emit('answerSubmitted', {
        exercise: this,
        answer: answerToValidate,
        validation: validation,
        score: score
      });
      
    } catch (error) {
      this.handleError('answer_submission', error);
      this.updateState({ loading: false });
    }
  }

  /**
   * Get current answer from UI state
   * Should be overridden by subclasses
   */
  getCurrentAnswer() {
    return Array.from(this.state.selectedOptions);
  }

  /**
   * Provide feedback to the user
   */
  provideFeedback(validation) {
    const feedbackKey = validation.isCorrect ? 'feedback.correct' : 'feedback.incorrect';
    const feedbackText = this.t(feedbackKey);
    
    // Announce to screen reader
    this.announceToScreenReader(feedbackText);
    
    // Show visual feedback (this would be handled by the UI component)
    this.updateState({
      feedbackMessage: feedbackText,
      feedbackType: validation.isCorrect ? 'success' : 'error'
    });
  }

  /**
   * Show hint to the user
   */
  showHint() {
    const hints = this.schema.solution?.hints || [];
    const hintsUsed = this.state.hintsUsed;
    
    if (hintsUsed < hints.length) {
      const hint = hints[hintsUsed];
      const hintText = this.getLocalizedText(hint);
      
      this.updateState({ 
        hintsUsed: hintsUsed + 1,
        currentHint: hintText 
      });
      
      this.announceToScreenReader(hintText);
      this.analytics.trackEvent('hint_used', {
        exerciseId: this.id,
        hintIndex: hintsUsed,
        hintText: hintText
      });
    }
  }

  /**
   * Handle time up scenario
   */
  handleTimeUp() {
    this.updateState({ 
      completed: true,
      timeUp: true 
    });
    
    this.announceToScreenReader(this.t('errors.timeUp'));
    this.emit('timeUp', { exercise: this });
  }

  /**
   * Complete the exercise
   */
  complete() {
    if (this.state.completed) return;
    
    this.endTime = Date.now();
    const totalTime = this.endTime - this.startTime;
    
    this.updateState({ 
      completed: true,
      endTime: this.endTime,
      totalTime: totalTime
    });
    
    this.analytics.trackEvent('exercise_completed', {
      exerciseId: this.id,
      totalTime: totalTime,
      score: this.state.score,
      attempts: this.state.attempts,
      hintsUsed: this.state.hintsUsed
    });
    
    this.emit('completed', { 
      exercise: this,
      results: this.getResults()
    });
    
    this.announceToScreenReader(this.t('accessibility.exerciseCompleted'));
  }

  /**
   * Get exercise results
   */
  getResults() {
    return {
      exerciseId: this.id,
      exerciseType: this.getType(),
      score: this.state.score,
      accuracy: this.calculateAccuracy(),
      totalTime: this.state.totalTime,
      attempts: this.state.attempts,
      hintsUsed: this.state.hintsUsed,
      completed: this.state.completed,
      userAnswers: this.state.userAnswers
    };
  }

  /**
   * Calculate accuracy percentage
   */
  calculateAccuracy() {
    if (this.state.attempts === 0) return 0;
    const correctAnswers = this.state.userAnswers.filter(answer => 
      this.validateAnswer(answer).isCorrect
    ).length;
    return Math.round((correctAnswers / this.state.attempts) * 100);
  }

  /**
   * Select an option (for multiple choice exercises)
   */
  selectOption(index) {
    const selectedOptions = new Set(this.state.selectedOptions);
    
    if (selectedOptions.has(index)) {
      selectedOptions.delete(index);
      this.announceToScreenReader(this.t('accessibility.optionDeselected'));
    } else {
      selectedOptions.add(index);
      this.announceToScreenReader(this.t('accessibility.optionSelected'));
    }
    
    this.updateState({ selectedOptions: selectedOptions });
    this.emit('userInteraction', { 
      type: 'option_select', 
      option: index, 
      selected: selectedOptions.has(index) 
    });
  }

  /**
   * State management methods
   */

  updateState(updates) {
    const oldState = { ...this.state };
    this.state = { ...this.state, ...updates };
    
    this.emit('stateChange', {
      oldState: oldState,
      newState: this.state,
      updates: updates
    });
  }

  setState(newState) {
    const oldState = { ...this.state };
    this.state = newState;
    
    this.emit('stateChange', {
      oldState: oldState,
      newState: this.state,
      updates: newState
    });
  }

  getState() {
    return { ...this.state };
  }

  /**
   * Event system
   */

  on(event, listener) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event).push(listener);
  }

  off(event, listener) {
    if (this.listeners.has(event)) {
      const listeners = this.listeners.get(event);
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  emit(event, data) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`Error in event listener for ${event}:`, error);
        }
      });
    }
  }

  /**
   * Utility methods
   */

  generateId() {
    return `exercise-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  getTranslation(key, params = {}) {
    return this.i18n.translate(key, params);
  }

  t(key, params = {}) {
    return this.getTranslation(key, params);
  }

  getLocalizedText(textObject) {
    if (typeof textObject === 'string') return textObject;
    if (typeof textObject === 'object') {
      return textObject[this.i18n.currentLanguage] || 
             textObject[this.i18n.fallbackLanguage] || 
             Object.values(textObject)[0] || '';
    }
    return '';
  }

  announceToScreenReader(message) {
    this.accessibility.announce(message);
  }

  handleStateChange(event) {
    // Override in subclasses for specific state change handling
  }

  handleUserInteraction(event) {
    // Track user interactions
    this.analytics.trackEvent('user_interaction', {
      exerciseId: this.id,
      interactionType: event.type,
      ...event
    });
  }

  handleError(context, error) {
    console.error(`Error in ${context}:`, error);
    this.updateState({
      error: {
        context: context,
        message: error.message,
        timestamp: Date.now()
      }
    });
    this.emit('error', { context, error });
  }

  /**
   * Plugin system
   */

  registerPlugin(name, plugin) {
    this.plugins.set(name, plugin);
    if (this.initialized) {
      plugin.initialize(this);
    }
  }

  unregisterPlugin(name) {
    const plugin = this.plugins.get(name);
    if (plugin && plugin.destroy) {
      plugin.destroy();
    }
    this.plugins.delete(name);
  }

  getPlugin(name) {
    return this.plugins.get(name);
  }

  /**
   * Cleanup and destruction
   */

  destroy() {
    if (this.destroyed) return;
    
    // Stop timer
    if (this.timer) {
      clearInterval(this.timer);
    }
    
    // Remove event listeners
    if (this.keyboardHandler) {
      document.removeEventListener('keydown', this.keyboardHandler);
    }
    
    // Destroy plugins
    for (const [name, plugin] of this.plugins) {
      if (plugin.destroy) {
        plugin.destroy();
      }
    }
    
    // Clear listeners
    this.listeners.clear();
    
    // Mark as destroyed
    this.destroyed = true;
    this.mounted = false;
    
    this.emit('destroyed', { exercise: this });
  }

  /**
   * Lifecycle methods for React integration
   */

  mount(container) {
    this.container = container;
    this.mounted = true;
    this.emit('mounted', { exercise: this, container });
  }

  unmount() {
    this.mounted = false;
    this.emit('unmounted', { exercise: this });
  }
}

/**
 * Mock Analytics class for development
 */
class MockAnalytics {
  trackEvent(event, data) {
    console.log(`Analytics Event: ${event}`, data);
  }
}

/**
 * Accessibility Helper class
 */
class AccessibilityHelper {
  constructor() {
    this.announcer = null;
  }

  setup(exercise) {
    // Create live region for announcements
    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    document.body.appendChild(this.announcer);
  }

  announce(message) {
    if (this.announcer) {
      this.announcer.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        this.announcer.textContent = '';
      }, 1000);
    }
  }

  destroy() {
    if (this.announcer && this.announcer.parentNode) {
      this.announcer.parentNode.removeChild(this.announcer);
    }
  }
}

export default BaseExercise;
