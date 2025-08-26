/**
 * QuizEngine Core Class
 * Unified system for handling all exercise types, state management, scoring, and validation
 */

import { EventEmitter } from '../utils/EventEmitter';
import { ExerciseState } from './ExerciseState';
import { ValidationEngine } from './ValidationEngine';
import { ScoreCalculator } from './ScoreCalculator';
import { TimerManager } from './TimerManager';
import { StorageManager } from './StorageManager';

export class QuizEngine {
  constructor(storeOrConfig = {}) {
    this.id = this.generateId();
    
    // Handle both store-based and legacy config-based initialization
    if (typeof storeOrConfig === 'function') {
      // Store-based initialization (modern approach)
      this.store = storeOrConfig;
      this.type = null; // Will be set when exercise is loaded
      this.questions = [];
      this.settings = {};
    } else {
      // Legacy config-based initialization
      this.store = null;
      this.type = storeOrConfig.type;
      this.questions = storeOrConfig.questions || [];
      this.settings = storeOrConfig.settings || {};
    }
    
    // Core systems
    this.state = new ExerciseState(this.id);
    this.validator = new ValidationEngine();
    this.scoreCalculator = new ScoreCalculator(this.settings.scoring);
    this.timer = new TimerManager();
    this.storage = new StorageManager(this.id);
    
    // Current exercise state
    this.currentQuestionIndex = 0;
    this.answers = new Map();
    this.score = 0;
    this.startTime = null;
    this.endTime = null;
    this.hints = new Map();
    this.isCompleted = false;
    this.isPaused = false;
    this.isReady = false;
    
    // Advanced features for Day 15
    this.autoSaveInterval = null;
    this.autoSaveFrequency = this.settings.autoSaveFrequency || 30000; // 30 seconds
    this.bookmarkedQuestions = new Set();
    this.maxHints = this.settings.maxHints || 3;
    this.currentStreak = 0;
    this.lastAutoSave = null;
    
    // Event system
    this.events = new EventEmitter();
    this.setupEventHandlers();
  }
  
  generateId() {
    return `exercise_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  setupEventHandlers() {
    this.events.on('answer:submitted', (data) => {
      console.log('Answer submitted:', data);
    });
    
    this.events.on('exercise:completed', (data) => {
      console.log('Exercise completed:', data);
    });
    
    this.events.on('question:changed', (question) => {
      console.log('Question changed:', question);
    });
  }
  
  // ==================== LIFECYCLE METHODS ====================
  
  async loadExercise(exerciseData, exerciseConfig = {}) {
    if (!exerciseData) {
      throw new Error('Exercise data is required');
    }
    
    // Update exercise configuration
    this.type = exerciseData.type;
    this.questions = exerciseData.questions || [];
    this.settings = { ...this.settings, ...exerciseConfig };
    
    // Reset state for new exercise
    this.currentQuestionIndex = 0;
    this.answers.clear();
    this.score = 0;
    this.startTime = null;
    this.endTime = null;
    this.hints.clear();
    this.isCompleted = false;
    this.isPaused = false;
    
    // Initialize state
    this.state.status = 'ready';
    this.timer.reset();
    
    this.events.emit('exercise:loaded', this.getState());
    await this.storage.save(this.getState());
    
    return this.getState();
  }
  
  async start() {
    if (this.startTime) {
      throw new Error('Exercise already started');
    }
    
    this.startTime = Date.now();
    this.timer.start();
    this.state.status = 'in_progress';
    this.events.emit('exercise:started', this.getState());
    await this.storage.save(this.getState());
    
    return this.getState();
  }
  // Alias for compatibility with integration tests
  async startExercise(...args) {
    return this.start(...args);
  }
  
  async submitAnswer(answer) {
    if (this.isCompleted || this.isPaused) {
      throw new Error('Cannot submit answer: exercise is completed or paused');
    }
    
    const question = this.getCurrentQuestion();
    if (!question) {
      throw new Error('No current question available');
    }
    
    const validation = this.validator.validate(answer, question, this.type);
    
    // Record answer with metadata
    const answerData = {
      answer,
      validation,
      timestamp: Date.now(),
      timeToAnswer: this.timer.getQuestionTime(),
      hintsUsed: this.hints.get(this.currentQuestionIndex)?.length || 0
    };
    
    this.answers.set(this.currentQuestionIndex, answerData);
    
    // Calculate score with bonuses
    const scoreData = this.scoreCalculator.calculateScore(validation, {
      timeToAnswer: this.timer.getQuestionTime(),
      difficulty: question.difficulty || 'medium',
      hintsUsed: answerData.hintsUsed
    });
    
    this.score += scoreData.points;
    
    this.events.emit('answer:submitted', {
      questionIndex: this.currentQuestionIndex,
      answer,
      validation,
      scoreData
    });
    
    await this.storage.save(this.getState());
    
    return {
      validation,
      scoreData,
      canProceed: validation.isCorrect || this.settings.allowIncorrectProgression !== false
    };
  }
  
  nextQuestion() {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
      this.timer.nextQuestion();
      this.events.emit('question:changed', this.getCurrentQuestion());
    } else {
      this.complete();
    }
    
    return this.getCurrentQuestion();
  }
  
  previousQuestion() {
    if (this.hasPreviousQuestion()) {
      this.currentQuestionIndex--;
      this.timer.nextQuestion();
      this.events.emit('question:changed', this.getCurrentQuestion());
    }
    
    return this.getCurrentQuestion();
  }
  
  async complete() {
    if (this.isCompleted) {
      return this.getState();
    }
    
    this.endTime = Date.now();
    this.timer.stop();
    this.state.status = 'completed';
    this.isCompleted = true;
    
    const finalScore = this.scoreCalculator.calculateFinalScore({
      answers: this.answers,
      totalTime: this.getTotalTime(),
      questionsCount: this.questions.length
    });
    
    this.score = finalScore.total;
    
    const completionData = {
      score: finalScore,
      answers: Array.from(this.answers.entries()),
      totalTime: this.getTotalTime(),
      questionsAnswered: this.answers.size,
      totalQuestions: this.questions.length
    };
    
    this.events.emit('exercise:completed', completionData);
    
    await this.storage.save(this.getState());
    
    return completionData;
  }
  
  canGoNext() {
    return this.hasNextQuestion();
  }
  canGoPrevious() {
    return this.hasPreviousQuestion();
  }
  endExercise(...args) {
    return this.complete(...args);
  }
  pause() {
    if (!this.isPaused && !this.isCompleted) {
      this.isPaused = true;
      this.timer.pause();
      this.events.emit('exercise:paused', this.getState());
    }
  }
  
  resume() {
    if (this.isPaused && !this.isCompleted) {
      this.isPaused = false;
      this.timer.resume();
      this.events.emit('exercise:resumed', this.getState());
    }
  }
  
  reset() {
    this.currentQuestionIndex = 0;
    this.answers.clear();
    this.score = 0;
    this.startTime = null;
    this.endTime = null;
    this.hints.clear();
    this.isCompleted = false;
    this.isPaused = false;
    this.timer.reset();
    this.state.status = 'ready';
    
    this.events.emit('exercise:reset', this.getState());
  }
  
  // ==================== GETTERS AND HELPERS ====================
  
  getCurrentQuestion() {
    return this.questions[this.currentQuestionIndex] || null;
  }
  
  hasNextQuestion() {
    return this.currentQuestionIndex < this.questions.length - 1;
  }
  
  hasPreviousQuestion() {
    return this.currentQuestionIndex > 0;
  }
  
  getProgress() {
    return {
      current: this.currentQuestionIndex + 1,
      total: this.questions.length,
      percentage: Math.round(((this.currentQuestionIndex + 1) / this.questions.length) * 100),
      answered: this.answers.size,
      remaining: this.questions.length - this.answers.size
    };
  }
  
  getTotalTime() {
    if (!this.startTime) return 0;
    const endTime = this.endTime || Date.now();
    return endTime - this.startTime;
  }
  
  getAnswer(questionIndex = this.currentQuestionIndex) {
    return this.answers.get(questionIndex);
  }
  
  getAllAnswers() {
    return Array.from(this.answers.entries()).map(([index, data]) => ({
      questionIndex: index,
      question: this.questions[index],
      ...data
    }));
  }
  
  getScore() {
    return {
      current: this.score,
      maximum: this.scoreCalculator.getMaximumPossibleScore(this.questions.length),
      percentage: this.scoreCalculator.getScorePercentage(this.score, this.questions.length)
    };
  }
  
  // ==================== STATE MANAGEMENT ====================
  
  getState() {
    return {
      id: this.id,
      type: this.type,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: Array.from(this.answers.entries()),
      score: this.score,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.state.status,
      isCompleted: this.isCompleted,
      isPaused: this.isPaused,
      timer: this.timer.getState(),
      progress: this.getProgress(),
      hints: Array.from(this.hints.entries())
    };
  }
  
  async loadState(savedState) {
    Object.assign(this, {
      currentQuestionIndex: savedState.currentQuestionIndex,
      score: savedState.score,
      startTime: savedState.startTime,
      endTime: savedState.endTime,
      isCompleted: savedState.isCompleted,
      isPaused: savedState.isPaused
    });
    
    this.answers = new Map(savedState.answers);
    this.hints = new Map(savedState.hints || []);
    this.timer.loadState(savedState.timer);
    this.state.status = savedState.status;
    
    this.events.emit('exercise:loaded', this.getState());
  }
  
  // ==================== HINT SYSTEM ====================
  
  getHint(level = 1) {
    const question = this.getCurrentQuestion();
    if (!question || !question.hints) {
      return null;
    }
    
    const questionHints = this.hints.get(this.currentQuestionIndex) || [];
    
    if (level <= question.hints.length && level > questionHints.length) {
      const hint = question.hints[level - 1];
      questionHints.push({
        level,
        text: hint,
        timestamp: Date.now()
      });
      
      this.hints.set(this.currentQuestionIndex, questionHints);
      this.events.emit('hint:used', { questionIndex: this.currentQuestionIndex, level, hint });
      
      return hint;
    }
    
    return null;
  }
  
  getUsedHints(questionIndex = this.currentQuestionIndex) {
    return this.hints.get(questionIndex) || [];
  }
  
  // ==================== EVENT SYSTEM ====================
  
  on(event, callback) {
    this.events.on(event, callback);
  }
  
  off(event, callback) {
    this.events.off(event, callback);
  }
  
  emit(event, data) {
    this.events.emit(event, data);
  }

  // ==================== LIFECYCLE METHODS ====================
  
  async initialize() {
    try {
      // Initialize storage system
      await this.storage.init();
      
      // Load previous state if available
      const savedState = await this.storage.loadAllData();
      if (savedState && savedState.currentQuestionIndex !== undefined) {
        this.currentQuestionIndex = savedState.currentQuestionIndex;
        this.answers = new Map(savedState.answers || []);
        this.score = savedState.score || 0;
        this.hints = new Map(savedState.hints || []);
      }
      
      // Initialize timer
      this.timer.reset();
      
      // Mark as ready
      this.isReady = true;
      this.events.emit('engine:initialized', this.getState());
      
      return true;
    } catch (error) {
      console.error('Failed to initialize QuizEngine:', error);
      this.events.emit('engine:error', { type: 'initialization', error });
      return false;
    }
  }
  
  // ==================== ADVANCED FEATURES (Day 15) ====================
  
  // Auto-save functionality
  enableAutoSave(interval = this.autoSaveFrequency) {
    this.disableAutoSave(); // Clear any existing interval
    
    this.autoSaveInterval = setInterval(async () => {
      if (this.storage && this.isReady) {
        await this.storage.save('quiz-state', this.getState());
        this.lastAutoSave = Date.now();
        this.events.emit('auto:saved', { timestamp: this.lastAutoSave });
      }
    }, interval);
    
    this.events.emit('auto:save:enabled', { interval });
  }

  disableAutoSave() {
    if (this.autoSaveInterval) {
      clearInterval(this.autoSaveInterval);
      this.autoSaveInterval = null;
      this.events.emit('auto:save:disabled');
    }
  }

  // Progressive hint system
  getHint(level = 1) {
    const question = this.getCurrentQuestion();
    const questionIndex = this.currentQuestionIndex;
    
    if (!question || !question.hint) {
      return { hint: 'No hint available for this question.', level: 0, remaining: 0 };
    }

    // Initialize hints for this question if not exists
    if (!this.hints.has(questionIndex)) {
      this.hints.set(questionIndex, []);
    }

    const questionHints = this.hints.get(questionIndex);
    
    if (questionHints.length >= this.maxHints) {
      return { hint: 'No more hints available for this question.', level: -1, remaining: 0 };
    }

    // Create progressive hints based on level
    let hint;
    switch (level) {
      case 1:
        hint = `💡 Hint: ${question.hint}`;
        break;
      case 2:
        hint = `🎯 Stronger Hint: ${question.hint} Think about the key concept.`;
        break;
      case 3:
        hint = `🔍 Final Hint: ${question.hint} Focus on the most important part.`;
        break;
      default:
        hint = question.hint;
    }

    const hintData = { level, hint, timestamp: Date.now() };
    questionHints.push(hintData);
    
    this.events.emit('hint:used', {
      questionIndex,
      level,
      hint,
      totalHintsUsed: questionHints.length
    });

    return { 
      hint, 
      level, 
      remaining: this.maxHints - questionHints.length,
      totalUsed: questionHints.length
    };
  }

  getHintsUsed(questionIndex = this.currentQuestionIndex) {
    return this.hints.get(questionIndex) || [];
  }

  getTotalHintsUsed() {
    return Array.from(this.hints.values()).reduce((total, hints) => total + hints.length, 0);
  }

  // Exercise bookmarking system
  bookmarkQuestion(questionIndex = this.currentQuestionIndex) {
    if (this.bookmarkedQuestions.has(questionIndex)) {
      this.bookmarkedQuestions.delete(questionIndex);
      this.events.emit('bookmark:removed', { questionIndex });
      return false;
    } else {
      this.bookmarkedQuestions.add(questionIndex);
      this.events.emit('bookmark:added', { questionIndex });
      return true;
    }
  }

  isBookmarked(questionIndex = this.currentQuestionIndex) {
    return this.bookmarkedQuestions.has(questionIndex);
  }

  getBookmarkedQuestions() {
    return Array.from(this.bookmarkedQuestions);
  }

  removeBookmark(questionIndex) {
    const removed = this.bookmarkedQuestions.delete(questionIndex);
    if (removed) {
      this.events.emit('bookmark:removed', { questionIndex });
    }
    return removed;
  }

  clearAllBookmarks() {
    const count = this.bookmarkedQuestions.size;
    this.bookmarkedQuestions.clear();
    this.events.emit('bookmarks:cleared', { count });
    return count;
  }

  // Enhanced statistics with advanced features
  getAdvancedStatistics() {
    const answered = Array.from(this.answers.values());
    const correct = answered.filter(a => a.validation && a.validation.isCorrect);
    
    return {
      // Basic stats
      questionsAnswered: answered.length,
      correctAnswers: correct.length,
      accuracy: answered.length > 0 ? (correct.length / answered.length) * 100 : 0,
      currentScore: this.score,
      
      // Time stats
      totalTime: this.getTotalTime(),
      averageTimePerQuestion: answered.length > 0 ? 
        answered.reduce((sum, a) => sum + (a.timeToAnswer || 0), 0) / answered.length : 0,
      
      // Advanced features stats
      hintsUsed: this.getTotalHintsUsed(),
      bookmarksCount: this.bookmarkedQuestions.size,
      currentStreak: this.currentStreak,
      autoSaveEnabled: !!this.autoSaveInterval,
      lastAutoSave: this.lastAutoSave,
      
      // Progress
      progress: this.getProgress(),
      
      // State
      isPaused: this.isPaused,
      isCompleted: this.isCompleted
    };
  }

  // Enhanced pause/resume with auto-save management
  pause() {
    if (!this.isPaused && !this.isCompleted) {
      this.isPaused = true;
      this.timer.pause();
      this.disableAutoSave(); // Pause auto-save when paused
      this.events.emit('exercise:paused', this.getState());
    }
  }
  
  resume() {
    if (this.isPaused && !this.isCompleted) {
      this.isPaused = false;
      this.timer.resume();
      this.enableAutoSave(); // Resume auto-save when resumed
      this.events.emit('exercise:resumed', this.getState());
    }
  }

  destroy() {
    try {
      // Disable auto-save before destroying
      this.disableAutoSave();
      
      // Save current state before destroying
      if (this.storage && this.isReady) {
        this.storage.save('quiz-state', {
          currentQuestionIndex: this.currentQuestionIndex,
          answers: Array.from(this.answers.entries()),
          score: this.score,
          hints: Array.from(this.hints.entries()),
          bookmarkedQuestions: Array.from(this.bookmarkedQuestions),
          isCompleted: this.isCompleted,
          lastAutoSave: this.lastAutoSave
        });
      }
      
      // Stop timer
      if (this.timer) {
        this.timer.pause();
      }
      
      // Clear all event listeners
      if (this.events) {
        this.events.removeAllListeners();
      }
      
      // Clear references
      this.isReady = false;
      this.events.emit('engine:destroyed');
      
      return true;
    } catch (error) {
      console.error('Failed to destroy QuizEngine:', error);
      return false;
    }
  }
  
  // Method aliases for integration compatibility
  validateAnswer(answer, exercise) {
    if (!exercise) {
      const currentQuestion = this.getCurrentQuestion();
      if (!currentQuestion) return { isValid: false, score: 0 };
      return this.validator.validate(answer, currentQuestion, this.type);
    }
    return this.validator.validate(answer, exercise, exercise.type);
  }
}

export default QuizEngine;
