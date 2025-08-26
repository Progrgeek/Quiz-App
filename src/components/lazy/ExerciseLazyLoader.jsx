import React, { Suspense, lazy } from 'react';
import { ExerciseLoadingSpinner } from '../common/LoadingSpinner';

// Lazy load all exercise types for optimal code splitting
const LazyMultipleChoice = lazy(() => import('../multipleChoice/MultipleChoice'));
const LazyFillInTheBlanks = lazy(() => import('../fillInTheBlanks/FillInTheBlanks'));
const LazyDragAndDrop = lazy(() => import('../dragAndDrop/DragAndDrop'));
const LazyHighlight = lazy(() => import('../highlight/Highlight'));
const LazyGapFill = lazy(() => import('../gapFill/GapFill'));
const LazyClickToChange = lazy(() => import('../clickToChange/ClickToChange'));
const LazyMultipleAnswers = lazy(() => import('../multipleAnswers/MultipleAnswers'));
const LazySingleAnswer = lazy(() => import('../singleAnswer/SingleAnswer'));
const LazySequencing = lazy(() => import('../sequencing/Sequencing'));
const LazySyllableCounting = lazy(() => import('../syllableCounting/SyllableCounting'));
const LazyRhymeExercises = lazy(() => import('../rhymeExercises/RhymeExercises'));
const LazyTableExercise = lazy(() => import('../tableExercise/TableExercise'));

// Exercise type mapping for dynamic component loading
const exerciseComponents = {
  'multiple-choice': LazyMultipleChoice,
  'fill-in-the-blanks': LazyFillInTheBlanks,
  'drag-and-drop': LazyDragAndDrop,
  'highlight': LazyHighlight,
  'gap-fill': LazyGapFill,
  'click-to-change': LazyClickToChange,
  'multiple-answers': LazyMultipleAnswers,
  'single-answer': LazySingleAnswer,
  'sequencing': LazySequencing,
  'syllable-counting': LazySyllableCounting,
  'rhyme-exercises': LazyRhymeExercises,
  'table-exercise': LazyTableExercise
};

/**
 * Lazy loading wrapper for exercise components
 * Implements code splitting to reduce initial bundle size
 * 
 * @param {string} exerciseType - Type of exercise to load
 * @param {Object} props - Props to pass to the exercise component
 * @returns {JSX.Element} Suspense-wrapped lazy-loaded exercise component
 */
export const ExerciseLazyLoader = ({ exerciseType, ...props }) => {
  const ExerciseComponent = exerciseComponents[exerciseType];
  
  if (!ExerciseComponent) {
    console.error(`Unknown exercise type: ${exerciseType}`);
    return (
      <div className="p-4 text-center text-error-600 bg-error-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Exercise Type Not Found</h3>
        <p>The exercise type "{exerciseType}" is not supported.</p>
      </div>
    );
  }

  return (
    <Suspense fallback={<ExerciseLoadingSpinner exerciseType={exerciseType} />}>
      <ExerciseComponent {...props} />
    </Suspense>
  );
};

/**
 * Preload specific exercise component for performance optimization
 * @param {string} exerciseType - Exercise type to preload
 */
export const preloadExercise = (exerciseType) => {
  const ExerciseComponent = exerciseComponents[exerciseType];
  if (ExerciseComponent) {
    // Trigger the lazy import to start loading
    ExerciseComponent();
  }
};

/**
 * Preload multiple exercise types
 * @param {string[]} exerciseTypes - Array of exercise types to preload
 */
export const preloadExercises = (exerciseTypes) => {
  exerciseTypes.forEach(type => preloadExercise(type));
};

/**
 * Get all available exercise types
 * @returns {string[]} Array of exercise type keys
 */
export const getAvailableExerciseTypes = () => {
  return Object.keys(exerciseComponents);
};

export default ExerciseLazyLoader;
