/**
 * Exercise Type Mapper
 * 
 * Maps all original exercise components to their enhanced versions with
 * backend system integration while preserving exact original functionality.
 */

import { createEnhancedExercise } from './ExerciseIntegrationBridge';

// Import all original exercise components
import MultipleAnswers from '../components/multipleAnswers/MultipleAnswers';
import DragAndDrop from '../components/dragAndDrop/DragAndDrop';
import FillInTheBlanks from '../components/fillInTheBlanks/FillInTheBlanks';
import GapFill from '../components/gapFill/GapFill';
import Highlight from '../components/highlight/Highlight';
import ClickToChange from '../components/clickToChange/ClickToChange';
import Sequencing from '../components/sequencing/Sequencing';
import TableExercise from '../components/tableExercise/TableExercise';
import MultipleChoice from '../components/multipleChoice/MultipleChoice';
import SingleAnswer from '../components/singleAnswer/SingleAnswer';
import SyllableCounting from '../components/syllableCounting/SyllableCounting';
import RhymeExercises from '../components/rhymeExercises/RhymeExercises';

/**
 * Data adapters for different exercise types
 * These ensure the original components receive data in their expected format
 */
export const DATA_ADAPTERS = {
  'multiple-answers': (data) => {
    // MultipleAnswers expects specific structure
    return {
      ...data,
      // Ensure exercisesData structure if needed
      exercisesData: data.exercisesData || data
    };
  },

  'drag-and-drop': (data) => {
    // DragAndDrop expects specific structure  
    return {
      ...data,
      items: data.items || data.draggableItems || [],
      categories: data.categories || data.dropZones || []
    };
  },

  'fill-in-blanks': (data) => {
    // FillInTheBlanks expects specific structure
    return {
      ...data,
      sentence: data.sentence || data.question,
      blanks: data.blanks || data.answers || []
    };
  },

  'gap-fill': (data) => {
    // GapFill expects specific structure
    return {
      ...data,
      word: data.word || data.targetWord,
      image: data.image || data.imageUrl
    };
  },

  'highlight': (data) => {
    // Highlight expects specific structure
    return {
      ...data,
      text: data.text || data.content,
      targets: data.targets || data.highlightTargets || []
    };
  },

  'click-to-change': (data) => {
    // ClickToChange expects specific structure
    return {
      ...data,
      words: data.words || data.textElements || []
    };
  },

  'sequencing': (data) => {
    // Sequencing expects specific structure
    return {
      ...data,
      items: data.items || data.sequence || [],
      correctOrder: data.correctOrder || data.solution
    };
  },

  'table-exercise': (data) => {
    // TableExercise expects specific structure
    return {
      ...data,
      categories: data.categories || data.columns || [],
      items: data.items || data.rows || []
    };
  },

  'multiple-choice': (data) => {
    // MultipleChoice expects specific structure
    return {
      ...data,
      question: data.question || data.prompt,
      options: data.options || data.choices || [],
      correctAnswer: data.correctAnswer || data.solution
    };
  },

  'single-answer': (data) => {
    // SingleAnswer expects specific structure - supports both syllable and rhyme
    return {
      ...data,
      type: data.type || data.exerciseType,
      exercises: data.exercises || [data]
    };
  },

  'syllable-counting': (data) => {
    // SyllableCounting expects specific structure
    return {
      ...data,
      word: data.word || data.targetWord,
      syllableCount: data.syllableCount || data.correctCount
    };
  },

  'rhyme-exercises': (data) => {
    // RhymeExercises expects specific structure
    return {
      ...data,
      targetWord: data.targetWord || data.word,
      options: data.options || data.choices || []
    };
  }
};

/**
 * Exercise type integration configuration
 * Maps original components to enhanced versions with specific settings
 */
export const EXERCISE_TYPE_INTEGRATION = {
  'multiple-answers': {
    originalComponent: MultipleAnswers,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['adaptive-difficulty', 'intelligent-hints', 'performance-tracking']
    }),
    dataAdapter: DATA_ADAPTERS['multiple-answers'],
    expectedProps: ['data', 'onComplete', 'onSubmit'],
    exerciseTypes: ['sound_matching', 'synonym']
  },

  'drag-and-drop': {
    originalComponent: DragAndDrop,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['drag-tracking', 'spatial-analytics', 'difficulty-adaptation']
    }),
    dataAdapter: DATA_ADAPTERS['drag-and-drop'],
    expectedProps: ['data', 'onComplete', 'onDrop'],
    exerciseTypes: ['categorization', 'sorting']
  },

  'fill-in-blanks': {
    originalComponent: FillInTheBlanks,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['input-tracking', 'completion-hints', 'vocabulary-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['fill-in-blanks'],
    expectedProps: ['data', 'onComplete', 'onInputChange'],
    exerciseTypes: ['sentence-completion', 'vocabulary']
  },

  'gap-fill': {
    originalComponent: GapFill,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['letter-tracking', 'phonetic-hints', 'spelling-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['gap-fill'],
    expectedProps: ['data', 'onComplete', 'onLetterInput'],
    exerciseTypes: ['spelling', 'phonetics']
  },

  'highlight': {
    originalComponent: Highlight,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['selection-tracking', 'text-analytics', 'reading-patterns']
    }),
    dataAdapter: DATA_ADAPTERS['highlight'],
    expectedProps: ['data', 'onComplete', 'onHighlight'],
    exerciseTypes: ['text-analysis', 'reading-comprehension']
  },

  'click-to-change': {
    originalComponent: ClickToChange,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['click-tracking', 'grammar-hints', 'language-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['click-to-change'],
    expectedProps: ['data', 'onComplete', 'onWordClick'],
    exerciseTypes: ['grammar', 'capitalization', 'pronoun-correction']
  },

  'sequencing': {
    originalComponent: Sequencing,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['sequence-tracking', 'order-hints', 'logic-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['sequencing'],
    expectedProps: ['data', 'onComplete', 'onReorder'],
    exerciseTypes: ['logical-order', 'chronological', 'alphabetical']
  },

  'table-exercise': {
    originalComponent: TableExercise,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['table-tracking', 'categorization-hints', 'organization-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['table-exercise'],
    expectedProps: ['data', 'onComplete', 'onCellSelect'],
    exerciseTypes: ['data-organization', 'categorization']
  },

  'multiple-choice': {
    originalComponent: MultipleChoice,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['choice-tracking', 'elimination-hints', 'decision-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['multiple-choice'],
    expectedProps: ['data', 'onComplete', 'onSelect'],
    exerciseTypes: ['single-choice', 'knowledge-check']
  },

  'single-answer': {
    originalComponent: SingleAnswer,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['audio-tracking', 'phonetic-hints', 'pronunciation-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['single-answer'],
    expectedProps: ['data', 'onComplete', 'onAnswer'],
    exerciseTypes: ['syllable-counting', 'rhyme-identification']
  },

  'syllable-counting': {
    originalComponent: SyllableCounting,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['counting-tracking', 'phonetic-hints', 'syllable-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['syllable-counting'],
    expectedProps: ['data', 'onComplete', 'onCount'],
    exerciseTypes: ['phonetic-awareness']
  },

  'rhyme-exercises': {
    originalComponent: RhymeExercises,
    enhancer: (component) => createEnhancedExercise(component, {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      features: ['rhyme-tracking', 'sound-hints', 'phonological-analytics']
    }),
    dataAdapter: DATA_ADAPTERS['rhyme-exercises'],
    expectedProps: ['data', 'onComplete', 'onRhymeSelect'],
    exerciseTypes: ['phonological-awareness']
  }
};

/**
 * Get enhanced component for specific exercise type
 */
export const getEnhancedComponent = (exerciseType) => {
  const config = EXERCISE_TYPE_INTEGRATION[exerciseType];
  if (!config) {
    console.warn(`No enhanced component found for exercise type: ${exerciseType}`);
    return null;
  }

  // Create enhanced component if not already created
  if (!config.enhancedComponent) {
    config.enhancedComponent = config.enhancer(config.originalComponent);
  }

  return config.enhancedComponent;
};

/**
 * Get original component for specific exercise type (fallback)
 */
export const getOriginalComponent = (exerciseType) => {
  const config = EXERCISE_TYPE_INTEGRATION[exerciseType];
  return config?.originalComponent || null;
};

/**
 * Adapt data for specific exercise type
 */
export const adaptExerciseData = (exerciseType, rawData) => {
  const config = EXERCISE_TYPE_INTEGRATION[exerciseType];
  if (!config?.dataAdapter) {
    return rawData;
  }

  try {
    return config.dataAdapter(rawData);
  } catch (error) {
    console.warn(`Data adaptation failed for ${exerciseType}:`, error);
    return rawData;
  }
};

/**
 * Get all supported exercise types
 */
export const getSupportedExerciseTypes = () => {
  return Object.keys(EXERCISE_TYPE_INTEGRATION);
};

/**
 * Check if exercise type is supported
 */
export const isExerciseTypeSupported = (exerciseType) => {
  return exerciseType in EXERCISE_TYPE_INTEGRATION;
};

/**
 * Get exercise type configuration
 */
export const getExerciseTypeConfig = (exerciseType) => {
  return EXERCISE_TYPE_INTEGRATION[exerciseType] || null;
};

export default EXERCISE_TYPE_INTEGRATION;
