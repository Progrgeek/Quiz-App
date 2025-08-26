import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QuizEngine } from './QuizEngine.js';

// Mock exercise data
const mockExercise = {
  id: 'test-exercise-1',
  type: 'multipleChoice',
  title: 'Test Exercise',
  question: 'What is 2 + 2?',
  options: ['3', '4', '5', '6'],
  correctAnswer: '4'
};

describe('QuizEngine Integration Tests', () => {
  let engine;
  let mockStore;

  beforeEach(() => {
    // Mock Zustand store
    mockStore = {
      exercises: [mockExercise],
      currentExerciseIndex: 0,
      currentExercise: mockExercise,
      score: 0,
      answers: {},
      setCurrentExerciseIndex: vi.fn(),
      setCurrentExercise: vi.fn(),
      updateScore: vi.fn(),
      setAnswer: vi.fn(),
      reset: vi.fn()
    };

    // Create engine instance
    engine = new QuizEngine(mockStore);
  });

  describe('ENGINE Phase - Core Functionality', () => {
    it('should create QuizEngine instance', () => {
      expect(engine).toBeDefined();
      expect(engine.constructor.name).toBe('QuizEngine');
    });

    it('should have required components', () => {
      expect(engine.timer).toBeDefined();
      expect(engine.storage).toBeDefined();
      expect(engine.scoreCalculator).toBeDefined();
      expect(engine.validator).toBeDefined();
    });

    it('should emit events', (done) => {
      engine.on('test-event', (data) => {
        expect(data).toEqual({ test: true });
        done();
      });
      engine.emit('test-event', { test: true });
    });
  });

  describe('INTEGRATION Phase - Method Testing', () => {
    it('should have timer start method', () => {
      expect(engine.timer.start).toBeDefined();
      expect(typeof engine.timer.start).toBe('function');
    });

    it('should start timer without errors', () => {
      expect(() => {
        engine.timer.start();
      }).not.toThrow();
    });

    it('should have startExercise method', () => {
      expect(engine.startExercise).toBeDefined();
      expect(typeof engine.startExercise).toBe('function');
    });

    it('should load exercise', () => {
      expect(() => {
        engine.loadExercise(mockExercise);
      }).not.toThrow();
    });

    it('should navigate exercises', () => {
      expect(engine.canGoNext).toBeDefined();
      expect(engine.canGoPrevious).toBeDefined();
      expect(typeof engine.canGoNext).toBe('function');
      expect(typeof engine.canGoPrevious).toBe('function');
    });
  });

  describe('UI Phase - Store Integration', () => {
    it('should have store reference', () => {
      expect(engine.store).toBeDefined();
      expect(engine.store).toBe(mockStore);
    });

    it('should handle store methods', () => {
      engine.store.setCurrentExerciseIndex(1);
      expect(mockStore.setCurrentExerciseIndex).toHaveBeenCalledWith(1);
    });

    it('should validate answers', () => {
      const result = engine.validateAnswer('4', mockExercise);
      expect(result).toBeDefined();
    });
  });
});
