/**
 * Exercise Components Export
 * Clean, simple exercise system
 */

// Main Exercise Mapper (Primary Export)
export { 
  default as UniversalExerciseMapper,
  getSupportedExerciseTypes,
  isExerciseTypeSupported,
  validateExerciseData
} from './UniversalExerciseMapper';

// Demo Component
export { default as ExerciseDemo } from './ExerciseDemo';

// Legacy export for backward compatibility
export { default as UniversalExerciseDemo } from './ExerciseDemo';

/**
 * Usage:
 * 
 * import { UniversalExerciseMapper } from './components/exercises';
 * 
 * <UniversalExerciseMapper
 *   exerciseType="multiple-choice"
 *   exerciseData={yourData}
 *   answers={answers}
 *   updateAnswer={updateAnswer}
 * />
 * 
 * Supported Exercise Types:
 * - multiple-choice, multiple-answers, single-answer
 * - drag-and-drop, sequencing
 * - fill-in-blanks, gap-fill
 * - highlight, click-to-change
 * - rhyme-exercises, syllable-counting
 * - table
 */
