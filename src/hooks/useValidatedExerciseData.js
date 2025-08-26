// hooks/useValidatedExerciseData.js - Enhanced data loading with validation
import { useState, useEffect } from 'react';
import { validateExerciseData } from '../schemas/UniversalExerciseSchema';
import useUnifiedExerciseData from './useUnifiedExerciseData';

/**
 * Enhanced hook that adds validation to unified exercise data
 * @param {string} exerciseType - Type of exercise to load and validate
 * @param {object} options - Configuration options
 * @returns {object} - Enhanced data object with validation results
 */
const useValidatedExerciseData = (exerciseType, options = {}) => {
  const {
    strictMode = false, // Whether to reject invalid data
    onValidationError = null, // Callback for validation errors
    enableLogging = true // Whether to log validation issues
  } = options;

  const [validationState, setValidationState] = useState({
    isValid: null,
    validationErrors: null,
    validatedData: null,
    lastValidation: null
  });

  // Get base data from unified hook
  const unifiedData = useUnifiedExerciseData(exerciseType);
  const { data, loading, error, isReady } = unifiedData;

  useEffect(() => {
    if (!data || loading || error) {
      setValidationState({
        isValid: null,
        validationErrors: null,
        validatedData: null,
        lastValidation: null
      });
      return;
    }

    // Perform validation
    const validateData = () => {
      const validationResult = validateExerciseData(data, exerciseType);
      const timestamp = new Date().toISOString();

      if (validationResult.success) {
        if (enableLogging) {
          console.log(`✅ Validation passed for ${exerciseType}`, {
            timestamp,
            exerciseCount: data.exercises?.length || 0,
            hasUI: !!data.ui,
            hasExamples: !!data.exampleContent
          });
        }

        setValidationState({
          isValid: true,
          validationErrors: null,
          validatedData: validationResult.data,
          lastValidation: timestamp
        });
      } else {
        const errorSummary = {
          timestamp,
          exerciseType,
          errorCount: validationResult.errors?.length || 0,
          errors: validationResult.errors
        };

        if (enableLogging) {
          console.warn(`⚠️ Validation failed for ${exerciseType}`, errorSummary);
        }

        // Call error callback if provided
        if (onValidationError) {
          onValidationError(errorSummary);
        }

        setValidationState({
          isValid: false,
          validationErrors: validationResult.errors,
          validatedData: strictMode ? null : data, // Use original data in non-strict mode
          lastValidation: timestamp
        });
      }
    };

    validateData();
  }, [data, exerciseType, strictMode, onValidationError, enableLogging, loading, error]);

  // Enhanced data validation utilities
  const validateSpecificExercise = (exercise) => {
    try {
      const { validateSingleExercise } = require('../schemas/UniversalExerciseSchema');
      return validateSingleExercise(exercise);
    } catch (err) {
      return {
        success: false,
        data: null,
        errors: [{ message: `Validation error: ${err.message}` }]
      };
    }
  };

  const getValidationSummary = () => {
    if (!validationState.isValid) return null;

    const { validatedData } = validationState;
    if (!validatedData) return null;

    return {
      exerciseType,
      totalExercises: validatedData.exercises?.length || 0,
      hasUIConfig: !!validatedData.ui,
      hasExampleContent: !!validatedData.exampleContent,
      uiElementsCount: {
        buttons: Object.keys(validatedData.ui?.buttons || {}).length,
        labels: Object.keys(validatedData.ui?.labels || {}).length,
        messages: Object.keys(validatedData.ui?.messages || {}).length
      },
      exampleSections: validatedData.exampleContent?.sections?.length || 0,
      learningPoints: validatedData.exampleContent?.learningPoints?.length || 0,
      lastValidated: validationState.lastValidation
    };
  };

  const getValidationReport = () => {
    const summary = getValidationSummary();
    const errors = validationState.validationErrors || [];
    
    return {
      isValid: validationState.isValid,
      summary,
      errors: errors.map(error => ({
        path: error.path?.join('.') || 'root',
        message: error.message,
        code: error.code,
        received: error.received
      })),
      recommendations: generateRecommendations(errors)
    };
  };

  const generateRecommendations = (errors) => {
    const recommendations = [];

    errors.forEach(error => {
      const path = error.path?.join('.') || '';
      
      if (path.includes('ui.buttons')) {
        recommendations.push('Ensure all required UI buttons are defined with non-empty strings');
      }
      if (path.includes('exercises')) {
        recommendations.push('Check exercise data structure matches the expected schema');
      }
      if (path.includes('exampleContent')) {
        recommendations.push('Verify example content has title, description, and learning points');
      }
      if (error.code === 'too_small') {
        recommendations.push(`Add more items to ${path} (minimum required: ${error.minimum})`);
      }
      if (error.code === 'invalid_type') {
        recommendations.push(`Fix data type for ${path} - expected ${error.expected}, got ${error.received}`);
      }
    });

    return [...new Set(recommendations)]; // Remove duplicates
  };

  // Development utilities (only available in development)
  const devUtils = process.env.NODE_ENV === 'development' ? {
    validateNow: () => {
      if (data) {
        const result = validateExerciseData(data, exerciseType);
        console.log('Manual validation result:', result);
        return result;
      }
      return null;
    },
    exportValidationReport: () => {
      const report = getValidationReport();
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `validation-report-${exerciseType}-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    },
    logDataStructure: () => {
      if (data) {
        console.log(`Data structure for ${exerciseType}:`, {
          hasUI: !!data.ui,
          uiKeys: Object.keys(data.ui || {}),
          hasExamples: !!data.exampleContent,
          exampleSections: data.exampleContent?.sections?.length || 0,
          exerciseCount: data.exercises?.length || 0,
          exerciseTypes: [...new Set(data.exercises?.map(ex => ex.type) || [])]
        });
      }
    }
  } : {};

  return {
    // All original unified data properties
    ...unifiedData,
    
    // Enhanced validation data
    validatedData: validationState.validatedData,
    isValidated: validationState.isValid === true,
    hasValidationErrors: validationState.isValid === false,
    validationErrors: validationState.validationErrors,
    
    // Validation utilities
    validateSpecificExercise,
    getValidationSummary,
    getValidationReport,
    
    // Status helpers
    isDataReady: isReady && (strictMode ? validationState.isValid === true : true),
    hasValidData: validationState.validatedData !== null,
    
    // Development utilities
    ...devUtils
  };
};

// Wrapper hooks for specific validation scenarios
export const useStrictValidatedData = (exerciseType) => {
  return useValidatedExerciseData(exerciseType, { 
    strictMode: true,
    enableLogging: true 
  });
};

export const useValidatedDataWithCallback = (exerciseType, onError) => {
  return useValidatedExerciseData(exerciseType, {
    onValidationError: onError,
    enableLogging: true
  });
};

// Validation summary hook for analytics
export const useValidationAnalytics = (exerciseTypes = []) => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    if (!exerciseTypes.length) return;

    const analyzeValidation = async () => {
      const results = {};
      
      for (const type of exerciseTypes) {
        try {
          const module = await import(`../components/${type}/unified${type.charAt(0).toUpperCase() + type.slice(1)}Data.json`);
          const data = module.default;
          const validation = validateExerciseData(data, type);
          
          results[type] = {
            isValid: validation.success,
            errorCount: validation.errors?.length || 0,
            exerciseCount: data.exercises?.length || 0
          };
        } catch (error) {
          results[type] = {
            isValid: false,
            errorCount: 1,
            error: error.message
          };
        }
      }

      setAnalytics({
        totalTypes: exerciseTypes.length,
        validTypes: Object.values(results).filter(r => r.isValid).length,
        totalErrors: Object.values(results).reduce((sum, r) => sum + r.errorCount, 0),
        results,
        lastAnalyzed: new Date().toISOString()
      });
    };

    analyzeValidation();
  }, [exerciseTypes]);

  return analytics;
};

export default useValidatedExerciseData;
