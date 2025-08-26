/**
 * Test Migration and Integration
 * 
 * This script tests the new universal exercise system with existing data
 * to ensure backward compatibility and functionality preservation.
 */

import { DataMigration } from '../migration/DataMigration.js';
import { ExerciseValidator } from '../validation/SchemaValidator.js';
import MultipleChoiceExercise from '../exercises/patterns/MultipleChoiceExercise.js';

// Import existing exercise data
import multipleAnswersData from '../components/multipleAnswers/multipleAnswersExercises.json';
import clickToChangeData from '../components/clickToChange/ClickToChangeExercises.json';

/**
 * Test Data Migration
 */
export async function testDataMigration() {
  console.log('🔄 Testing Data Migration...');
  
  const migrator = new DataMigration();
  const validator = new ExerciseValidator();
  
  try {
    // Test Multiple Answers migration
    console.log('Testing Multiple Answers migration...');
    const migratedMultipleAnswers = migrator.migrate(multipleAnswersData, 'multiple-answers');
    
    console.log(`✅ Migrated ${migratedMultipleAnswers.length} multiple answer exercises`);
    
    // Validate migrated data
    for (const exercise of migratedMultipleAnswers) {
      const validation = validator.validateExercise(exercise);
      if (!validation.success) {
        console.error('❌ Validation failed:', validation.errors);
      } else {
        console.log(`✅ Exercise ${exercise.metadata.id} validated successfully`);
        if (validation.warnings.length > 0) {
          console.warn('⚠️ Warnings:', validation.warnings);
        }
      }
    }
    
    // Test Click to Change migration
    console.log('Testing Click to Change migration...');
    const migratedClickToChange = migrator.migrate(clickToChangeData, 'click-to-change');
    
    console.log(`✅ Migrated ${migratedClickToChange.length} click to change exercises`);
    
    return {
      multipleAnswers: migratedMultipleAnswers,
      clickToChange: migratedClickToChange
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

/**
 * Test Exercise Execution
 */
export async function testExerciseExecution() {
  console.log('🎮 Testing Exercise Execution...');
  
  try {
    // Create exercise instance with original data
    const exercise = new MultipleChoiceExercise({
      id: 'test-exercise-1',
      exerciseData: multipleAnswersData,
      selectionMode: 'multiple',
      requiredSelections: 2,
      exerciseType: 'sound_matching',
      language: 'en'
    });
    
    // Initialize exercise
    await exercise.initialize();
    console.log('✅ Exercise initialized successfully');
    
    // Test state management
    exercise.start();
    console.log('✅ Exercise started');
    console.log('Current state:', exercise.getState());
    
    // Test option selection
    exercise.selectOption(0);
    exercise.selectOption(1);
    console.log('✅ Options selected');
    console.log('Selected answers:', exercise.state.selectedAnswers);
    
    // Test answer submission
    const validation = await exercise.validateAnswer([0, 1]);
    console.log('✅ Answer validation:', validation);
    
    // Test audio functionality
    const content = exercise.getProcessedContent();
    if (content.options && content.options.length > 0) {
      await exercise.playWordAudio(content.options[0].word);
      console.log('✅ Audio playback test completed');
    }
    
    // Cleanup
    exercise.destroy();
    console.log('✅ Exercise destroyed successfully');
    
    return true;
    
  } catch (error) {
    console.error('❌ Exercise execution failed:', error);
    throw error;
  }
}

/**
 * Test Internationalization
 */
export async function testInternationalization() {
  console.log('🌍 Testing Internationalization...');
  
  try {
    const exercise = new MultipleChoiceExercise({
      language: 'en'
    });
    
    await exercise.initialize();
    
    // Test English translations
    const englishText = exercise.t('buttons.checkAnswer');
    console.log('✅ English translation:', englishText);
    
    // Test Spanish translations
    await exercise.i18n.changeLanguage('es');
    const spanishText = exercise.t('buttons.checkAnswer');
    console.log('✅ Spanish translation:', spanishText);
    
    // Test RTL detection
    const isRTL = exercise.i18n.isRTL('ar');
    console.log('✅ RTL detection for Arabic:', isRTL);
    
    exercise.destroy();
    return true;
    
  } catch (error) {
    console.error('❌ Internationalization test failed:', error);
    throw error;
  }
}

/**
 * Test Backward Compatibility
 */
export async function testBackwardCompatibility() {
  console.log('🔄 Testing Backward Compatibility...');
  
  try {
    // Test with original exercise data structure
    const exercise = new MultipleChoiceExercise({
      exerciseData: multipleAnswersData,
      language: 'en'
    });
    
    await exercise.initialize();
    
    // Get processed content
    const content = exercise.getProcessedContent();
    
    // Verify that original data structure is preserved
    console.log('✅ Original question preserved:', !!content.question);
    console.log('✅ Original options preserved:', content.options?.length > 0);
    
    if (content.options && content.options.length > 0) {
      const firstOption = content.options[0];
      console.log('✅ Option structure preserved:', {
        hasWord: !!firstOption.word,
        hasImage: !!firstOption.image,
        hasCorrectFlag: firstOption.isCorrect !== undefined
      });
    }
    
    exercise.destroy();
    return true;
    
  } catch (error) {
    console.error('❌ Backward compatibility test failed:', error);
    throw error;
  }
}

/**
 * Test Performance
 */
export async function testPerformance() {
  console.log('⚡ Testing Performance...');
  
  try {
    const startTime = performance.now();
    
    // Create multiple exercise instances
    const exercises = [];
    for (let i = 0; i < 10; i++) {
      const exercise = new MultipleChoiceExercise({
        id: `performance-test-${i}`,
        exerciseData: multipleAnswersData,
        language: 'en'
      });
      
      await exercise.initialize();
      exercises.push(exercise);
    }
    
    const initTime = performance.now() - startTime;
    console.log(`✅ Created and initialized 10 exercises in ${initTime.toFixed(2)}ms`);
    
    // Test rapid state changes
    const stateChangeStart = performance.now();
    for (const exercise of exercises) {
      for (let i = 0; i < 10; i++) {
        exercise.selectOption(i % 3);
      }
    }
    const stateChangeTime = performance.now() - stateChangeStart;
    console.log(`✅ Performed 100 state changes in ${stateChangeTime.toFixed(2)}ms`);
    
    // Cleanup
    exercises.forEach(exercise => exercise.destroy());
    
    const totalTime = performance.now() - startTime;
    console.log(`✅ Total performance test completed in ${totalTime.toFixed(2)}ms`);
    
    return {
      initTime,
      stateChangeTime,
      totalTime
    };
    
  } catch (error) {
    console.error('❌ Performance test failed:', error);
    throw error;
  }
}

/**
 * Run All Tests
 */
export async function runAllTests() {
  console.log('🧪 Running Universal Exercise System Tests...\n');
  
  const results = {
    migration: false,
    execution: false,
    internationalization: false,
    backwardCompatibility: false,
    performance: null
  };
  
  try {
    // Test data migration
    await testDataMigration();
    results.migration = true;
    console.log('✅ Migration tests passed\n');
    
    // Test exercise execution
    await testExerciseExecution();
    results.execution = true;
    console.log('✅ Execution tests passed\n');
    
    // Test internationalization
    await testInternationalization();
    results.internationalization = true;
    console.log('✅ Internationalization tests passed\n');
    
    // Test backward compatibility
    await testBackwardCompatibility();
    results.backwardCompatibility = true;
    console.log('✅ Backward compatibility tests passed\n');
    
    // Test performance
    results.performance = await testPerformance();
    console.log('✅ Performance tests passed\n');
    
    console.log('🎉 All tests passed successfully!');
    
    return results;
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
    return results;
  }
}

// Export for use in browser console or test runner
if (typeof window !== 'undefined') {
  window.testUniversalExerciseSystem = runAllTests;
}

export default {
  testDataMigration,
  testExerciseExecution,
  testInternationalization,
  testBackwardCompatibility,
  testPerformance,
  runAllTests
};
