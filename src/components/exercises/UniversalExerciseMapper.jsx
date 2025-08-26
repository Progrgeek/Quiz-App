import React from 'react';
import PropTypes from 'prop-types';
import UniversalExercise from '../../core/UniversalExercise';

// Import Universal Exercise Components
import UniversalMultipleAnswers from '../multipleAnswers/UniversalMultipleAnswers';
import UniversalSingleAnswer from '../singleAnswer/UniversalSingleAnswer';
import UniversalDragAndDrop from '../dragAndDrop/UniversalDragAndDrop';
import UniversalFillInTheBlanks from '../fillInTheBlanks/UniversalFillInTheBlanks';
import UniversalGapFill from '../gapFill/UniversalGapFill';
import UniversalHighlight from '../highlight/UniversalHighlight';
import UniversalClickToChange from '../clickToChange/UniversalClickToChange';
import UniversalSequencing from '../sequencing/UniversalSequencing';
import UniversalTableExercise from '../tableExercise/UniversalTableExercise';
import UniversalSyllableCounting from '../syllableCounting/UniversalSyllableCounting';
import UniversalRhymeExercises from '../rhymeExercises/UniversalRhymeExercises';
import UniversalMultipleChoice from '../multipleChoice/UniversalMultipleChoice';

// Import working WithAnExample components
import MultipleAnswerWithExample from '../multipleAnswers/MultipleAnswersWithAnExample';
import DragAndDropWithExample from '../dragAndDrop/DragAndDropWithAnExample';
import FillInTheBlanksWithExample from '../fillInTheBlanks/FillInTheBlanksWithAnExample';
import GapFillWithExample from '../gapFill/GapFillWithAnExample';
import HighlightWithExample from '../highlight/HighlightWithAnExample';
import ClickToChangeWithExample from '../clickToChange/ClickToChangeWithAnExample';
import SequencingWithExample from '../sequencing/SequincingWithAnExample';
import SingleAnswerWithExample from '../singleAnswer/SingleAnswerWithAnExample';
import TableWithExample from '../tableExercise/TableExercisesWithAnExample';

// Import core components where they exist
import MultipleAnswers from '../multipleAnswers/MultipleAnswers';
import DragAndDrop from '../dragAndDrop/DragAndDrop';
import FillInTheBlanks from '../fillInTheBlanks/FillInTheBlanks';
import GapFill from '../gapFill/GapFill';
import Highlight from '../highlight/Highlight';
import ClickToChange from '../clickToChange/ClickToChange';

/**
 * Simple Exercise Type Mapping
 * Maps exercise types directly to their respective components
 */
const EXERCISE_COMPONENTS = {
  // Universal Components (preferred when available)
  'multiple-answers': UniversalMultipleAnswers,
  'single-answer': UniversalSingleAnswer,
  'drag-and-drop': UniversalDragAndDrop,
  'fill-in-blanks': UniversalFillInTheBlanks,
  'gap-fill': UniversalGapFill,
  'highlight': UniversalHighlight,
  'click-to-change': UniversalClickToChange,
  'sequencing': UniversalSequencing,
  'table': UniversalTableExercise,
  'syllable-counting': UniversalSyllableCounting,
  'rhyme-exercises': UniversalRhymeExercises,
  'multiple-choice': UniversalMultipleChoice,
  
  // Interactive exercises
  'drag-and-drop-example': DragAndDropWithExample,
  'sequencing-example': SequencingWithExample,
  'click-to-change-example': ClickToChangeWithExample,
  'highlight-example': HighlightWithExample,
  
  // Text-based exercises
  'fill-in-blanks-example': FillInTheBlanksWithExample,
  'gap-fill-example': GapFillWithExample,
  
  // Specialized exercises
  'table-example': TableWithExample,
  
  // Core components (without examples) - fallbacks
  'multiple-answers-core': MultipleAnswers,
  'drag-and-drop-core': DragAndDrop,
  'fill-in-blanks-core': FillInTheBlanks,
  'gap-fill-core': GapFill,
  'highlight-core': Highlight,
  'click-to-change-core': ClickToChange,
  
  // Aliases for backward compatibility
  'multipleChoice': UniversalMultipleChoice,
  'multipleAnswers': UniversalMultipleAnswers,
  'singleAnswer': UniversalSingleAnswer,
  'dragAndDrop': UniversalDragAndDrop,
  'fillInBlanks': UniversalFillInTheBlanks,
  'gapFill': UniversalGapFill,
  'clickToChange': UniversalClickToChange,
  'tableExercise': UniversalTableExercise,
  'syllableCounting': UniversalSyllableCounting,
  'rhymeExercises': UniversalRhymeExercises
};

/**
 * Get the appropriate component for an exercise type
 */
const getExerciseComponent = (exerciseType) => {
  // Normalize exercise type (handle kebab-case, camelCase, snake_case)
  const normalizedType = exerciseType.toLowerCase().replace(/[_\s]/g, '-');
  
  // Direct mapping
  if (EXERCISE_COMPONENTS[normalizedType]) {
    return EXERCISE_COMPONENTS[normalizedType];
  }
  
  // Fallback search with partial matching
  const componentKey = Object.keys(EXERCISE_COMPONENTS).find(key => 
    key.includes(normalizedType) || normalizedType.includes(key.replace('-', ''))
  );
  
  if (componentKey) {
    return EXERCISE_COMPONENTS[componentKey];
  }
  
  // Ultimate fallback to multiple answers (since it's working)
  return MultipleAnswerWithExample;
};

/**
 * Universal Exercise Mapper Component
 * Handles field mismatch by normalizing all exercise types
 * Maintains backward compatibility with existing components
 */
const UniversalExerciseMapper = ({ 
  exerciseType, 
  exerciseData, 
  subject = null,
  ...props 
}) => {
  try {
    // Step 1: Create UniversalExercise instance to normalize data
    const universalExercise = new UniversalExercise(exerciseData);
    
    // Step 2: Get normalized exercise type
    const normalizedType = universalExercise.getMetadata().type;
    
    // Step 3: Get component for this exercise type
    const ExerciseComponent = getExerciseComponent(normalizedType);
    
    if (!ExerciseComponent) {
      console.warn(`Unknown exercise type: ${normalizedType}. Using MultipleAnswers as fallback.`);
      return <MultipleAnswerWithExample exerciseData={exerciseData} {...props} />;
    }
    
    // Step 4: Convert universal format back to component-expected format
    const componentData = universalExercise.getForRenderer();
    
    // Step 5: Get example data if available
    const exampleData = universalExercise.getExampleForRenderer();
    
    // Step 6: Render component with normalized data
    return (
      <ExerciseComponent 
        exerciseData={componentData}
        exampleData={exampleData}
        metadata={universalExercise.getMetadata()}
        presentation={universalExercise.getPresentation()}
        {...props}
      />
    );
    
  } catch (error) {
    console.error('UniversalExerciseMapper error:', error);
    console.warn('Falling back to direct component rendering');
    
    // Fallback: Use original approach if normalization fails
    const ExerciseComponent = getExerciseComponent(exerciseType);
    
    if (!ExerciseComponent) {
      // Final fallback: render a simple message
      return (
        <div className="p-8 text-center bg-gray-100 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Exercise Loading...</h3>
          <p className="text-gray-600">
            Unable to load exercise of type: {exerciseType}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Please check the exercise data format.
          </p>
        </div>
      );
    }
    
    // Try to render with minimal data structure
    return (
      <ExerciseComponent 
        exerciseData={exerciseData || {}}
        {...props}
      />
    );
  }
};

/**
 * Utility function to get supported exercise types
 */
export const getSupportedExerciseTypes = () => {
  return Object.keys(EXERCISE_COMPONENTS);
};

/**
 * Utility function to check if exercise type is supported
 */
export const isExerciseTypeSupported = (exerciseType) => {
  const normalizedType = exerciseType.toLowerCase().replace(/[_\s]/g, '-');
  return EXERCISE_COMPONENTS[normalizedType] !== undefined;
};

/**
 * Simple exercise data validation with UniversalExercise
 */
export const validateExerciseData = (exerciseType, exerciseData) => {
  if (!exerciseData) {
    return { valid: false, errors: ['Exercise data is required'] };
  }
  
  try {
    // Use UniversalExercise to validate
    const universalExercise = new UniversalExercise(exerciseData);
    return { valid: true, errors: [], normalizedData: universalExercise.getForRenderer() };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
};

/**
 * Convert legacy exercise data to universal format
 */
export const normalizeExerciseData = (exerciseData) => {
  try {
    const universalExercise = new UniversalExercise(exerciseData);
    return {
      success: true,
      universalData: universalExercise.data,
      componentData: universalExercise.getForRenderer(),
      metadata: universalExercise.getMetadata()
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      originalData: exerciseData
    };
  }
};

/**
 * Get example data for any exercise
 */
export const getExampleData = (exerciseData) => {
  try {
    const universalExercise = new UniversalExercise(exerciseData);
    return universalExercise.getExampleForRenderer();
  } catch (error) {
    console.warn('Could not extract example data:', error.message);
    return null;
  }
};

UniversalExerciseMapper.propTypes = {
  exerciseType: PropTypes.string.isRequired,
  exerciseData: PropTypes.object.isRequired,
  subject: PropTypes.string,
  answers: PropTypes.object,
  updateAnswer: PropTypes.func,
  isCompleted: PropTypes.bool
};

export default UniversalExerciseMapper;
