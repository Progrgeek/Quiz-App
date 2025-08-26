/**
 * Exercise Renderers Registry
 * Maps exercise types to their respective renderer components
 */

import React from 'react';

// Import all exercise renderers
import MultipleChoiceRenderer from './MultipleChoiceRenderer';
import FillInTheBlanksRenderer from './FillInTheBlanksRenderer';
import DragAndDropRenderer from './DragAndDropRenderer';
import SequencingRenderer from './SequencingRenderer';
import HighlightRenderer from './HighlightRenderer';
import GapFillRenderer from './GapFillRenderer';
import ClickToChangeRenderer from './ClickToChangeRenderer';
import SingleAnswerRenderer from './SingleAnswerRenderer';
import MultipleAnswersRenderer from './MultipleAnswersRenderer';
import TableExerciseRenderer from './TableExerciseRenderer';
import SyllableCountingRenderer from './SyllableCountingRenderer';
import RhymeExercisesRenderer from './RhymeExercisesRenderer';

// Exercise type registry
const EXERCISE_RENDERERS = {
  multipleChoice: MultipleChoiceRenderer,
  fillInTheBlanks: FillInTheBlanksRenderer,
  dragAndDrop: DragAndDropRenderer,
  sequencing: SequencingRenderer,
  highlight: HighlightRenderer,
  gapFill: GapFillRenderer,
  clickToChange: ClickToChangeRenderer,
  singleAnswer: SingleAnswerRenderer,
  multipleAnswers: MultipleAnswersRenderer,
  tableExercise: TableExerciseRenderer,
  syllableCounting: SyllableCountingRenderer,
  rhymeExercises: RhymeExercisesRenderer
};

/**
 * Get renderer component for an exercise type
 */
export const getExerciseRenderer = (exerciseType) => {
  const renderer = EXERCISE_RENDERERS[exerciseType];
  
  if (!renderer) {
    console.warn(`No renderer found for exercise type: ${exerciseType}`);
    return null;
  }
  
  return renderer;
};

/**
 * Get all available exercise types
 */
export const getAvailableExerciseTypes = () => {
  return Object.keys(EXERCISE_RENDERERS);
};

/**
 * Check if exercise type is supported
 */
export const isExerciseTypeSupported = (exerciseType) => {
  return exerciseType in EXERCISE_RENDERERS;
};

/**
 * Register a new exercise renderer
 */
export const registerExerciseRenderer = (exerciseType, rendererComponent) => {
  EXERCISE_RENDERERS[exerciseType] = rendererComponent;
};

/**
 * Default fallback renderer for unsupported exercise types
 */
const UnsupportedExerciseRenderer = ({ exerciseType }) => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
    <div className="text-yellow-500 text-4xl mb-4">🚧</div>
    <h3 className="text-lg font-semibold text-yellow-800 mb-2">Unsupported Exercise Type</h3>
    <p className="text-yellow-600">
      No renderer available for exercise type: <code className="bg-yellow-100 px-2 py-1 rounded">{exerciseType}</code>
    </p>
    <p className="text-sm text-yellow-500 mt-2">
      Available types: {getAvailableExerciseTypes().join(', ')}
    </p>
  </div>
);

export { UnsupportedExerciseRenderer };
export default getExerciseRenderer;
