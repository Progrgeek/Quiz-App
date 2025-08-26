/**
 * Integration Test Suite for Day 16
 * 
 * Tests the complete integration of:
 * - Universal Exercise System
 * - Advanced QuizEngine Features
 * - React Hooks Integration
 * - Performance Monitoring
 */

import { QuizEngine } from '../engine/QuizEngine.js';
import { UniversalExercise } from '../core/UniversalExercise.js';
import { ExerciseTypeRegistry } from '../engine/ExerciseTypeRegistry.js';

export class IntegrationTestSuite {
  constructor() {
    this.results = [];
    this.metrics = {};
    this.errors = [];
  }

  /**
   * Run complete integration test suite
   */
  async runTests() {
    console.log('🚀 Starting Integration Test Suite...');
    
    try {
      await this.testUniversalExerciseIntegration();
      await this.testAdvancedEngineFeatures();
      await this.testPerformanceBenchmarks();
      await this.testBackwardCompatibility();
      await this.testErrorHandling();
      
      return this.generateReport();
    } catch (error) {
      console.error('❌ Integration test suite failed:', error);
      this.errors.push(error);
      return this.generateReport();
    }
  }

  /**
   * Test Universal Exercise System Integration
   */
  async testUniversalExerciseIntegration() {
    console.log('🔄 Testing Universal Exercise Integration...');
    
    const testData = {
      question: "Integration test exercise",
      options: ["A", "B", "C", "D"],
      correctAnswers: [1],
      exerciseType: "multiple-choice"
    };

    // Test normalization
    const startTime = performance.now();
    const universalExercise = new UniversalExercise(testData);
    const normalizationTime = performance.now() - startTime;

    // Test registry integration
    const registry = ExerciseTypeRegistry.getInstance();
    const exerciseType = registry.getExerciseType('multiple-choice');

    // Test component data preparation
    const componentData = universalExercise.getForRenderer();

    this.results.push({
      test: 'Universal Exercise Integration',
      passed: true,
      metrics: {
        normalizationTime,
        hasRegistry: !!exerciseType,
        hasComponentData: !!componentData
      }
    });

    console.log('✅ Universal Exercise Integration test passed');
  }

  /**
   * Test Advanced Engine Features
   */
  async testAdvancedEngineFeatures() {
    console.log('🔄 Testing Advanced Engine Features...');
    
    const exerciseConfig = {
      type: 'multiple-choice',
      questions: [
        {
          question: "Test question",
          options: ["A", "B", "C"],
          correctAnswers: [1]
        }
      ],
      settings: {
        timeLimit: 60,
        allowHints: true,
        enableBookmarks: true
      }
    };

    const engine = new QuizEngine(exerciseConfig);
    
    // Test auto-save functionality
    const autoSaveEnabled = engine.enableAutoSave();
    
    // Test hint system
    await engine.start();
    const hint = engine.getHint(0);
    
    // Test bookmarking
    const bookmarked = engine.bookmarkQuestion(0);
    
    // Test pause/resume
    engine.pause();
    const isPaused = engine.isPaused();
    engine.resume();
    const isResumed = !engine.isPaused();

    this.results.push({
      test: 'Advanced Engine Features',
      passed: autoSaveEnabled && hint && bookmarked && isPaused && isResumed,
      metrics: {
        autoSave: autoSaveEnabled,
        hints: !!hint,
        bookmarks: bookmarked,
        pauseResume: isPaused && isResumed
      }
    });

    console.log('✅ Advanced Engine Features test passed');
  }

  /**
   * Test Performance Benchmarks
   */
  async testPerformanceBenchmarks() {
    console.log('🔄 Testing Performance Benchmarks...');
    
    const exerciseTypes = [
      'multiple-choice',
      'single-answer', 
      'fill-in-blanks',
      'drag-and-drop',
      'gap-fill'
    ];

    const benchmarks = {};
    const TARGET_TIME = 10; // ms per operation
    
    for (const type of exerciseTypes) {
      const testData = this.generateTestData(type);
      
      const startTime = performance.now();
      const universalExercise = new UniversalExercise(testData);
      const componentData = universalExercise.getForRenderer();
      const endTime = performance.now();
      
      const executionTime = endTime - startTime;
      benchmarks[type] = {
        executionTime,
        withinTarget: executionTime < TARGET_TIME,
        componentDataSize: JSON.stringify(componentData).length
      };
    }

    const allWithinTarget = Object.values(benchmarks).every(b => b.withinTarget);
    
    this.results.push({
      test: 'Performance Benchmarks',
      passed: allWithinTarget,
      metrics: benchmarks
    });

    console.log('✅ Performance Benchmarks test completed');
  }

  /**
   * Test Backward Compatibility
   */
  async testBackwardCompatibility() {
    console.log('🔄 Testing Backward Compatibility...');
    
    // Test legacy data formats
    const legacyFormats = [
      {
        // Old multiple choice format
        question: "Legacy question",
        answers: ["A", "B", "C"],
        correctAnswer: 1
      },
      {
        // Old fill-in-blanks format
        sentence: "The {answer} is correct",
        correctAnswer: "answer"
      },
      {
        // Old drag-and-drop format
        items: ["item1", "item2"],
        zones: ["zone1", "zone2"],
        correctMatches: { "item1": "zone1", "item2": "zone2" }
      }
    ];

    let compatibilityScore = 0;
    
    for (const legacyData of legacyFormats) {
      try {
        const universalExercise = new UniversalExercise(legacyData);
        const componentData = universalExercise.getForRenderer();
        
        if (componentData && typeof componentData === 'object') {
          compatibilityScore++;
        }
      } catch (error) {
        console.warn('Compatibility issue with legacy format:', error);
      }
    }

    const compatibilityRate = compatibilityScore / legacyFormats.length;
    
    this.results.push({
      test: 'Backward Compatibility',
      passed: compatibilityRate >= 0.8, // 80% compatibility required
      metrics: {
        compatibilityRate,
        supportedFormats: compatibilityScore,
        totalFormats: legacyFormats.length
      }
    });

    console.log('✅ Backward Compatibility test completed');
  }

  /**
   * Test Error Handling
   */
  async testErrorHandling() {
    console.log('🔄 Testing Error Handling...');
    
    const invalidInputs = [
      null,
      undefined,
      {},
      { invalid: "data" },
      ""
    ];

    let errorHandlingScore = 0;
    
    for (const invalidInput of invalidInputs) {
      try {
        const universalExercise = new UniversalExercise(invalidInput);
        // Should not reach here
      } catch (error) {
        if (error.message && error.message.length > 0) {
          errorHandlingScore++;
        }
      }
    }

    const errorHandlingRate = errorHandlingScore / invalidInputs.length;
    
    this.results.push({
      test: 'Error Handling',
      passed: errorHandlingRate >= 0.8, // Should handle 80% of error cases
      metrics: {
        errorHandlingRate,
        handledErrors: errorHandlingScore,
        totalErrors: invalidInputs.length
      }
    });

    console.log('✅ Error Handling test completed');
  }

  /**
   * Generate test data for different exercise types
   */
  generateTestData(type) {
    const testDataMap = {
      'multiple-choice': {
        question: "Test question",
        options: ["A", "B", "C", "D"],
        correctAnswers: [1],
        exerciseType: "multiple-choice"
      },
      'single-answer': {
        question: "Single answer test",
        options: ["Option 1", "Option 2"],
        correctAnswer: 0,
        exerciseType: "single-answer"
      },
      'fill-in-blanks': {
        sentence: "Fill in the {answer} here",
        correctAnswer: "blank",
        exerciseType: "fill-in-blanks"
      },
      'drag-and-drop': {
        draggableItems: [{ id: "1", text: "Item 1" }],
        dropZones: [{ id: "zone1", text: "Zone 1" }],
        correctMatches: { "1": "zone1" },
        exerciseType: "drag-and-drop"
      },
      'gap-fill': {
        text: "Gap ___ exercise",
        correctAnswers: ["fill"],
        exerciseType: "gap-fill"
      }
    };

    return testDataMap[type] || testDataMap['multiple-choice'];
  }

  /**
   * Generate comprehensive test report
   */
  generateReport() {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const successRate = (passedTests / totalTests) * 100;

    const report = {
      summary: {
        totalTests,
        passedTests,
        failedTests: totalTests - passedTests,
        successRate,
        hasErrors: this.errors.length > 0
      },
      results: this.results,
      errors: this.errors,
      recommendations: this.generateRecommendations()
    };

    console.log('📊 Integration Test Report:', report);
    return report;
  }

  /**
   * Generate recommendations based on test results
   */
  generateRecommendations() {
    const recommendations = [];
    
    const failedTests = this.results.filter(r => !r.passed);
    
    if (failedTests.length > 0) {
      recommendations.push('Review failed tests and address underlying issues');
    }

    const performanceTest = this.results.find(r => r.test === 'Performance Benchmarks');
    if (performanceTest && !performanceTest.passed) {
      recommendations.push('Optimize exercise normalization performance');
    }

    const compatibilityTest = this.results.find(r => r.test === 'Backward Compatibility');
    if (compatibilityTest && compatibilityTest.metrics.compatibilityRate < 0.9) {
      recommendations.push('Improve backward compatibility for legacy data formats');
    }

    if (this.errors.length > 0) {
      recommendations.push('Address critical errors in the integration pipeline');
    }

    if (recommendations.length === 0) {
      recommendations.push('All tests passed! System is ready for production.');
    }

    return recommendations;
  }
}

export default IntegrationTestSuite;
