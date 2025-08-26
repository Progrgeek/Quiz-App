// useUnifiedExerciseData.js - Enhanced version for all 12 exercise types
import { useState, useEffect } from 'react';

/**
 * Unified data loading hook for all exercise types
 * Dynamically imports unified data files and provides fallback support
 * 
 * @param {string} exerciseType - The type of exercise (dragAndDrop, singleAnswer, etc.)
 * @returns {Object} - Contains data, ui, loading state, and error handling
 */
const useUnifiedExerciseData = (exerciseType) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mapping of exercise types to their unified data file paths
  const exerciseTypeMap = {
    dragAndDrop: () => import('../components/dragAndDrop/data/unifiedDragAndDropData.json'),
    singleAnswer: () => import('../components/singleAnswer/unifiedSingleAnswerData.json'),
    multipleChoice: () => import('../components/multipleChoice/unifiedMultipleChoiceData.json'),
    multipleAnswers: () => import('../components/multipleAnswers/unifiedMultipleAnswersData.json'),
    fillInTheBlanks: () => import('../components/fillInTheBlanks/unifiedFillInTheBlanksData.json'),
    gapFill: () => import('../components/gapFill/unifiedGapFillData.json'),
    highlight: () => import('../components/highlight/unifiedHighlightData.json'),
    clickToChange: () => import('../components/clickToChange/unifiedClickToChangeData.json'),
    sequencing: () => import('../components/sequencing/unifiedSequencingData.json'),
    rhymeExercises: () => import('../components/rhymeExercises/unifiedRhymeExercisesData.json'),
    syllableCounting: () => import('../components/syllableCounting/unifiedSyllableCountingData.json'),
    tableExercise: () => import('../components/tableExercise/unifiedTableExerciseData.json')
  };

  // Fallback data for legacy support
  const fallbackMap = {
    dragAndDrop: () => import('../components/dragAndDrop/data/dragAndDropExercises.json'),
    singleAnswer: () => import('../components/singleAnswer/singleAnswerExercises.json'),
    multipleChoice: () => import('../components/multipleChoice/multipleChoiceData.json'),
    multipleAnswers: () => import('../components/multipleAnswers/multipleAnswersExercises.json'),
    fillInTheBlanks: () => import('../components/fillInTheBlanks/fillnTheBlanksExercises.json'),
    gapFill: () => import('../components/gapFill/gapFillExercises.json'),
    highlight: () => import('../components/highlight/highlightExercises.json'),
    clickToChange: () => import('../components/clickToChange/ClickToChangeExercises.json'),
    sequencing: () => import('../components/sequencing/sequencingExercises.json'),
    rhymeExercises: () => import('../components/rhymeExercises/rhymeExercisesData.json'),
    syllableCounting: () => import('../components/syllableCounting/syllableCountingData.json'),
    tableExercise: () => import('../components/tableExercise/tableExercises.json')
  };

  useEffect(() => {
    const loadData = async () => {
      if (!exerciseType) {
        setError('Exercise type is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Try to load unified data first
        const importFunction = exerciseTypeMap[exerciseType];
        if (!importFunction) {
          throw new Error(`Unknown exercise type: ${exerciseType}`);
        }

        let exerciseData;
        
        try {
          // Attempt to load unified data
          const module = await importFunction();
          exerciseData = module.default || module;
          
          // Validate unified data structure
          if (!exerciseData.ui || !exerciseData.exampleContent || !exerciseData.exercises) {
            throw new Error('Invalid unified data structure');
          }
        } catch (unifiedError) {
          console.warn(`Failed to load unified data for ${exerciseType}, falling back to legacy:`, unifiedError);
          
          // Fallback to legacy data
          const fallbackFunction = fallbackMap[exerciseType];
          if (fallbackFunction) {
            const fallbackModule = await fallbackFunction();
            const legacyData = fallbackModule.default || fallbackModule;
            
            // Transform legacy data to unified structure
            exerciseData = transformLegacyData(legacyData, exerciseType);
          } else {
            throw new Error(`No fallback available for ${exerciseType}`);
          }
        }

        setData(exerciseData);
      } catch (err) {
        console.error(`Error loading data for ${exerciseType}:`, err);
        setError(err.message);
        
        // Provide minimal fallback structure
        setData(createMinimalFallback(exerciseType));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [exerciseType]);

  /**
   * Transform legacy data structure to unified format
   */
  const transformLegacyData = (legacyData, type) => {
    const baseUI = {
      buttons: {
        learnWithExamples: "Learn with examples",
        backToPractice: "Back to practice",
        submit: "Submit",
        next: "Next",
        previous: "Previous"
      },
      labels: {
        question: "Question",
        explanation: "Explanation",
        hint: "Hint",
        progress: "Progress",
        score: "Score"
      },
      messages: {
        correct: "Correct!",
        incorrect: "Try again",
        completed: "Exercise completed!",
        loading: "Loading..."
      }
    };

    const baseExampleContent = {
      title: `${type} Examples`,
      description: "Learn how to complete this type of exercise",
      learningPoints: [
        "Read instructions carefully",
        "Take your time to understand the question",
        "Use context clues to help you",
        "Practice makes perfect"
      ],
      sections: []
    };

    return {
      ui: baseUI,
      exampleContent: baseExampleContent,
      exercises: legacyData.exercises || legacyData || []
    };
  };

  /**
   * Create minimal fallback when all else fails
   */
  const createMinimalFallback = (type) => ({
    ui: {
      buttons: {
        learnWithExamples: "Learn with examples",
        backToPractice: "Back to practice"
      },
      labels: {
        question: "Question"
      },
      messages: {
        loading: "Loading..."
      }
    },
    exampleContent: {
      title: `${type} Examples`,
      description: "Loading examples...",
      learningPoints: [],
      sections: []
    },
    exercises: []
  });

  // Utility functions for accessing data
  const getUI = (section = null, key = null) => {
    if (!data?.ui) return '';
    
    if (!section) return data.ui;
    if (!key) return data.ui[section] || {};
    
    return data.ui[section]?.[key] || '';
  };

  const getExampleContent = () => data?.exampleContent || null;

  const getExercises = () => data?.exercises || [];

  const getExerciseById = (id) => {
    return getExercises().find(exercise => exercise.id === id);
  };

  const getTotalExercises = () => getExercises().length;

  // Legacy compatibility functions
  const getUIText = (section, key) => getUI(section, key);
  const getButton = (buttonName) => getUIText('buttons', buttonName);
  const getLabel = (labelName) => getUIText('labels', labelName);
  const getMessage = (messageName) => getUIText('messages', messageName);

  // Return comprehensive data object
  return {
    // Core data
    data,
    exercises: getExercises(),
    exampleContent: getExampleContent(),
    
    // UI utilities
    ui: data?.ui || {},
    getUI,
    getUIText, // Legacy compatibility
    getButton, // Legacy compatibility
    getLabel,  // Legacy compatibility
    getMessage, // Legacy compatibility
    
    // Exercise utilities
    getExerciseById,
    getTotalExercises,
    
    // State
    loading,
    error,
    
    // Status checks
    isReady: !loading && !error && data !== null,
    hasError: !!error,
    isEmpty: !loading && !error && getTotalExercises() === 0
  };
};

/**
 * Hook specifically for UI text
 * @param {string} exerciseType - Type of exercise
 * @returns {Object} - UI text object with buttons, labels, feedback
 */
export const useUIText = (exerciseType) => {
  const { ui } = useUnifiedExerciseData(exerciseType);
  return ui;
};

/**
 * Hook for getting specific button text
 * @param {string} exerciseType - Type of exercise
 * @param {string} buttonKey - Key for the button text (e.g., 'checkAnswer', 'nextExercise')
 * @returns {string} - Button text
 */
export const useButtonText = (exerciseType, buttonKey) => {
  const { getButton } = useUnifiedExerciseData(exerciseType);
  return getButton(buttonKey);
};

/**
 * Hook for getting feedback text
 * @param {string} exerciseType - Type of exercise  
 * @param {string} feedbackKey - Key for feedback text (e.g., 'correct', 'incorrect')
 * @returns {string} - Feedback text
 */
export const useFeedbackText = (exerciseType, feedbackKey) => {
  const { getMessage } = useUnifiedExerciseData(exerciseType);
  return getMessage(feedbackKey);
};

export default useUnifiedExerciseData;
