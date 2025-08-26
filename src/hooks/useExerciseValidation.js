/**
 * React Hook for Exercise Validation
 * Provides validation functionality integrated with the exercise type registry
 */

import { useCallback, useState } from 'react';
import { exerciseTypeRegistry } from '../engine/ExerciseTypeRegistry';

export const useExerciseValidation = (exerciseType) => {
  const [validationHistory, setValidationHistory] = useState([]);
  const [currentValidation, setCurrentValidation] = useState(null);

  // Get validator for the exercise type
  const validator = exerciseTypeRegistry.getValidator(exerciseType);
  const scorer = exerciseTypeRegistry.getScorer(exerciseType);

  // Validate an answer
  const validateAnswer = useCallback((answer, question, metadata = {}) => {
    if (!validator) {
      console.warn(`No validator found for exercise type: ${exerciseType}`);
      return { isCorrect: false, score: 0, feedback: 'Validation not available' };
    }

    try {
      const validation = validator(answer, question);
      const score = scorer ? scorer(validation, metadata) : { points: validation.score * 100 };

      const result = {
        ...validation,
        score,
        timestamp: Date.now(),
        metadata
      };

      setCurrentValidation(result);
      setValidationHistory(prev => [...prev, result]);

      return result;

    } catch (error) {
      console.error('Validation error:', error);
      const errorResult = {
        isCorrect: false,
        score: { points: 0 },
        feedback: 'Validation failed',
        error: error.message,
        timestamp: Date.now()
      };

      setCurrentValidation(errorResult);
      return errorResult;
    }
  }, [exerciseType, validator, scorer]);

  // Batch validate multiple answers
  const validateBatch = useCallback((answers, questions, metadata = {}) => {
    return answers.map((answer, index) => 
      validateAnswer(answer, questions[index], metadata)
    );
  }, [validateAnswer]);

  // Get validation statistics
  const getValidationStats = useCallback(() => {
    if (validationHistory.length === 0) {
      return {
        totalAttempts: 0,
        correctAnswers: 0,
        accuracy: 0,
        averageScore: 0,
        totalScore: 0
      };
    }

    const correctAnswers = validationHistory.filter(v => v.isCorrect).length;
    const totalScore = validationHistory.reduce((sum, v) => sum + (v.score?.points || 0), 0);
    
    return {
      totalAttempts: validationHistory.length,
      correctAnswers,
      accuracy: correctAnswers / validationHistory.length,
      averageScore: totalScore / validationHistory.length,
      totalScore
    };
  }, [validationHistory]);

  // Reset validation state
  const resetValidation = useCallback(() => {
    setValidationHistory([]);
    setCurrentValidation(null);
  }, []);

  // Get the last validation result
  const getLastValidation = useCallback(() => {
    return validationHistory[validationHistory.length - 1] || null;
  }, [validationHistory]);

  return {
    validateAnswer,
    validateBatch,
    currentValidation,
    validationHistory,
    getValidationStats,
    getLastValidation,
    resetValidation,
    hasValidator: !!validator,
    hasScorer: !!scorer
  };
};

export default useExerciseValidation;
