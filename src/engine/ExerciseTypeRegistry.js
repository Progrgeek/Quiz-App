/**
 * Exercise Type Registry
 * Centralizes all exercise type definitions and their components
 */

import React from 'react';

// Import existing working components (preserving original UI)
import MultipleAnswerWithExample from '../components/multipleAnswers/MultipleAnswersWithAnExample';
import DragAndDropWithExample from '../components/dragAndDrop/DragAndDropWithAnExample';
import FillInTheBlanksWithExample from '../components/fillInTheBlanks/FillInTheBlanksWithAnExample';
import GapFillWithExample from '../components/gapFill/GapFillWithAnExample';
import HighlightWithExample from '../components/highlight/HighlightWithAnExample';
import ClickToChangeWithExample from '../components/clickToChange/ClickToChangeWithAnExample';
import SequencingWithExample from '../components/sequencing/SequincingWithAnExample';
import SingleAnswerWithExample from '../components/singleAnswer/SingleAnswerWithAnExample';
import TableWithExample from '../components/tableExercise/TableExercisesWithAnExample';

// Import core components (fallbacks)
import MultipleAnswers from '../components/multipleAnswers/MultipleAnswers';
import DragAndDrop from '../components/dragAndDrop/DragAndDrop';
import FillInTheBlanks from '../components/fillInTheBlanks/FillInTheBlanks';
import GapFill from '../components/gapFill/GapFill';
import Highlight from '../components/highlight/Highlight';
import ClickToChange from '../components/clickToChange/ClickToChange';

/**
 * Exercise Type Registry Class
 * Manages exercise types, validators, and scorers
 */
export class ExerciseTypeRegistry {
  constructor() {
    this.types = new Map();
    this.initialized = false;
    this.initializeBuiltInTypes();
  }

  initializeBuiltInTypes() {
    if (this.initialized) return;

    // Multiple Choice Exercise Type
    this.register({
      id: 'multipleChoice',
      name: 'Multiple Choice',
      aliases: ['multiple-choice', 'multiple_choice', 'mc'],
      component: MultipleAnswerWithExample,
      fallbackComponent: MultipleAnswers,
      validator: this.createMultipleChoiceValidator(),
      scorer: this.createMultipleChoiceScorer(),
      config: {
        allowMultiple: false,
        shuffleOptions: true,
        showFeedback: true,
        timeLimit: null
      }
    });

    // Multiple Answers Exercise Type
    this.register({
      id: 'multipleAnswers',
      name: 'Multiple Answers',
      aliases: ['multiple-answers', 'multiple_answers', 'checkbox'],
      component: MultipleAnswerWithExample,
      fallbackComponent: MultipleAnswers,
      validator: this.createMultipleAnswersValidator(),
      scorer: this.createMultipleAnswersScorer(),
      config: {
        allowMultiple: true,
        shuffleOptions: true,
        showFeedback: true,
        partialCredit: true
      }
    });

    // Single Answer Exercise Type
    this.register({
      id: 'singleAnswer',
      name: 'Single Answer',
      aliases: ['single-answer', 'single_answer', 'radio'],
      component: SingleAnswerWithExample,
      fallbackComponent: MultipleAnswers,
      validator: this.createSingleAnswerValidator(),
      scorer: this.createSingleAnswerScorer(),
      config: {
        allowMultiple: false,
        caseSensitive: false,
        trimWhitespace: true
      }
    });

    // Drag and Drop Exercise Type
    this.register({
      id: 'dragAndDrop',
      name: 'Drag and Drop',
      aliases: ['drag-and-drop', 'drag_and_drop', 'dnd'],
      component: DragAndDropWithExample,
      fallbackComponent: DragAndDrop,
      validator: this.createDragAndDropValidator(),
      scorer: this.createDragAndDropScorer(),
      config: {
        allowPartialCredit: true,
        snapToGrid: false,
        showDropZones: true
      }
    });

    // Fill in the Blanks Exercise Type
    this.register({
      id: 'fillInBlanks',
      name: 'Fill in the Blanks',
      aliases: ['fill-in-blanks', 'fill_in_blanks', 'fill-blanks'],
      component: FillInTheBlanksWithExample,
      fallbackComponent: FillInTheBlanks,
      validator: this.createFillInBlanksValidator(),
      scorer: this.createFillInBlanksScorer(),
      config: {
        caseSensitive: false,
        allowPartialCredit: true,
        acceptAlternatives: true
      }
    });

    // Gap Fill Exercise Type
    this.register({
      id: 'gapFill',
      name: 'Gap Fill',
      aliases: ['gap-fill', 'gap_fill', 'cloze'],
      component: GapFillWithExample,
      fallbackComponent: GapFill,
      validator: this.createGapFillValidator(),
      scorer: this.createGapFillScorer(),
      config: {
        caseSensitive: false,
        allowPartialCredit: true,
        showWordBank: true
      }
    });

    // Highlight Exercise Type
    this.register({
      id: 'highlight',
      name: 'Highlight',
      aliases: ['text-highlight', 'text_highlight', 'selection'],
      component: HighlightWithExample,
      fallbackComponent: Highlight,
      validator: this.createHighlightValidator(),
      scorer: this.createHighlightScorer(),
      config: {
        allowMultipleSelections: true,
        highlightColor: '#ffeb3b',
        showProgress: true
      }
    });

    // Click to Change Exercise Type
    this.register({
      id: 'clickToChange',
      name: 'Click to Change',
      aliases: ['click-to-change', 'click_to_change', 'toggle'],
      component: ClickToChangeWithExample,
      fallbackComponent: ClickToChange,
      validator: this.createClickToChangeValidator(),
      scorer: this.createClickToChangeScorer(),
      config: {
        allowUndo: true,
        showChangesCount: true,
        maxChanges: null
      }
    });

    // Sequencing Exercise Type
    this.register({
      id: 'sequencing',
      name: 'Sequencing',
      aliases: ['sequence', 'ordering', 'arrange'],
      component: SequencingWithExample,
      fallbackComponent: DragAndDrop, // Use drag-drop as fallback
      validator: this.createSequencingValidator(),
      scorer: this.createSequencingScorer(),
      config: {
        allowPartialCredit: true,
        showPositions: false,
        adjacentPenalty: 0.5
      }
    });

    // Table Exercise Type
    this.register({
      id: 'tableExercise',
      name: 'Table Exercise',
      aliases: ['table', 'organize-information', 'categorize'],
      component: TableWithExample,
      fallbackComponent: DragAndDrop, // Use drag-drop as fallback
      validator: this.createTableValidator(),
      scorer: this.createTableScorer(),
      config: {
        allowPartialCredit: true,
        validateColumns: true,
        validateRows: true
      }
    });

    this.initialized = true;
  }

  register(exerciseType) {
    if (!exerciseType.id) {
      throw new Error('Exercise type must have an id');
    }

    this.types.set(exerciseType.id, exerciseType);

    // Register aliases
    if (exerciseType.aliases) {
      exerciseType.aliases.forEach(alias => {
        this.types.set(alias, exerciseType);
      });
    }
  }

  get(typeId) {
    if (!typeId) return null;
    
    // Normalize type ID
    const normalizedId = typeId.toLowerCase().replace(/[-_\s]/g, '');
    
    // Direct lookup
    let type = this.types.get(typeId);
    if (type) return type;

    // Normalized lookup
    type = this.types.get(normalizedId);
    if (type) return type;

    // Fuzzy search
    for (const [key, value] of this.types.entries()) {
      const normalizedKey = key.toLowerCase().replace(/[-_\s]/g, '');
      if (normalizedKey.includes(normalizedId) || normalizedId.includes(normalizedKey)) {
        return value;
      }
    }

    return null;
  }

  getRenderer(typeId) {
    const type = this.get(typeId);
    return type?.component || type?.fallbackComponent || null;
  }

  getValidator(typeId) {
    const type = this.get(typeId);
    return type?.validator || this.createDefaultValidator();
  }

  getScorer(typeId) {
    const type = this.get(typeId);
    return type?.scorer || this.createDefaultScorer();
  }

  getConfig(typeId) {
    const type = this.get(typeId);
    return type?.config || {};
  }

  getAllTypes() {
    return Array.from(new Set(Array.from(this.types.values())));
  }

  // Validator Factories
  createMultipleChoiceValidator() {
    return (answer, question) => {
      const correctAnswer = question.correctAnswer || question.correct;
      const isCorrect = answer === correctAnswer;
      
      return {
        isCorrect,
        score: isCorrect ? 1 : 0,
        feedback: isCorrect 
          ? 'Correct!' 
          : `Incorrect. The correct answer is ${question.options?.[correctAnswer] || correctAnswer}`,
        partial: false
      };
    };
  }

  createMultipleAnswersValidator() {
    return (answer, question) => {
      const correctAnswers = Array.isArray(question.correctAnswer) 
        ? question.correctAnswer 
        : [question.correctAnswer];
      const userAnswers = Array.isArray(answer) ? answer : [answer];
      
      const correctCount = userAnswers.filter(ans => correctAnswers.includes(ans)).length;
      const incorrectCount = userAnswers.filter(ans => !correctAnswers.includes(ans)).length;
      const missedCount = correctAnswers.filter(ans => !userAnswers.includes(ans)).length;
      
      const score = Math.max(0, (correctCount - incorrectCount) / correctAnswers.length);
      const isCorrect = score === 1;
      
      return {
        isCorrect,
        score,
        feedback: isCorrect 
          ? 'Correct!' 
          : `Partial credit: ${correctCount}/${correctAnswers.length} correct`,
        partial: score > 0 && score < 1,
        breakdown: { correctCount, incorrectCount, missedCount }
      };
    };
  }

  createSingleAnswerValidator() {
    return (answer, question) => {
      const correctAnswer = question.correctAnswer || question.correct;
      const userAnswer = typeof answer === 'string' ? answer.trim().toLowerCase() : answer;
      const correct = typeof correctAnswer === 'string' ? correctAnswer.trim().toLowerCase() : correctAnswer;
      
      const isCorrect = userAnswer === correct;
      
      return {
        isCorrect,
        score: isCorrect ? 1 : 0,
        feedback: isCorrect 
          ? 'Correct!' 
          : `Incorrect. The correct answer is "${correctAnswer}"`,
        partial: false
      };
    };
  }

  createDragAndDropValidator() {
    return (answer, question) => {
      const correctPositions = question.correctAnswer || question.correctPositions;
      if (!correctPositions || !answer) {
        return { isCorrect: false, score: 0, feedback: 'Invalid answer format' };
      }

      let correctCount = 0;
      let totalCount = Object.keys(correctPositions).length;

      for (const [item, position] of Object.entries(answer)) {
        if (correctPositions[item] === position) {
          correctCount++;
        }
      }

      const score = correctCount / totalCount;
      const isCorrect = score === 1;

      return {
        isCorrect,
        score,
        feedback: isCorrect 
          ? 'Perfect!' 
          : `${correctCount}/${totalCount} items in correct position`,
        partial: score > 0 && score < 1,
        breakdown: { correctCount, totalCount }
      };
    };
  }

  createFillInBlanksValidator() {
    return (answer, question) => {
      const correctAnswers = question.correctAnswer || question.answers;
      if (!Array.isArray(correctAnswers) || !Array.isArray(answer)) {
        return { isCorrect: false, score: 0, feedback: 'Invalid answer format' };
      }

      let correctCount = 0;
      const results = [];

      for (let i = 0; i < correctAnswers.length; i++) {
        const userAnswer = (answer[i] || '').trim().toLowerCase();
        const correctAnswer = correctAnswers[i];
        const isCorrect = Array.isArray(correctAnswer) 
          ? correctAnswer.some(ans => ans.toLowerCase() === userAnswer)
          : correctAnswer.toLowerCase() === userAnswer;

        if (isCorrect) correctCount++;
        results.push({ isCorrect, userAnswer, correctAnswer });
      }

      const score = correctCount / correctAnswers.length;
      const isComplete = score === 1;

      return {
        isCorrect: isComplete,
        score,
        feedback: isComplete 
          ? 'All blanks filled correctly!' 
          : `${correctCount}/${correctAnswers.length} blanks correct`,
        partial: score > 0 && score < 1,
        breakdown: { correctCount, totalCount: correctAnswers.length, results }
      };
    };
  }

  createGapFillValidator() {
    return this.createFillInBlanksValidator(); // Same logic
  }

  createHighlightValidator() {
    return (answer, question) => {
      const correctSelections = question.correctAnswer || question.correctSelections;
      if (!Array.isArray(correctSelections) || !Array.isArray(answer)) {
        return { isCorrect: false, score: 0, feedback: 'Invalid selection format' };
      }

      const correctCount = answer.filter(selection => 
        correctSelections.some(correct => 
          correct.start === selection.start && correct.end === selection.end
        )
      ).length;

      const incorrectCount = answer.length - correctCount;
      const missedCount = correctSelections.length - correctCount;
      
      const score = Math.max(0, (correctCount - incorrectCount * 0.5) / correctSelections.length);
      const isCorrect = score === 1;

      return {
        isCorrect,
        score,
        feedback: isCorrect 
          ? 'Perfect highlighting!' 
          : `${correctCount}/${correctSelections.length} correct selections`,
        partial: score > 0 && score < 1,
        breakdown: { correctCount, incorrectCount, missedCount }
      };
    };
  }

  createClickToChangeValidator() {
    return (answer, question) => {
      const correctStates = question.correctAnswer || question.finalStates;
      if (!correctStates || !answer) {
        return { isCorrect: false, score: 0, feedback: 'Invalid answer format' };
      }

      let correctCount = 0;
      let totalCount = Object.keys(correctStates).length;

      for (const [element, state] of Object.entries(answer)) {
        if (correctStates[element] === state) {
          correctCount++;
        }
      }

      const score = correctCount / totalCount;
      const isCorrect = score === 1;

      return {
        isCorrect,
        score,
        feedback: isCorrect 
          ? 'All elements in correct state!' 
          : `${correctCount}/${totalCount} elements correct`,
        partial: score > 0 && score < 1,
        breakdown: { correctCount, totalCount }
      };
    };
  }

  createSequencingValidator() {
    return (answer, question) => {
      const correctSequence = question.correctAnswer || question.correctSequence;
      if (!Array.isArray(correctSequence) || !Array.isArray(answer)) {
        return { isCorrect: false, score: 0, feedback: 'Invalid sequence format' };
      }

      // Exact match check
      const isExactMatch = JSON.stringify(answer) === JSON.stringify(correctSequence);
      if (isExactMatch) {
        return {
          isCorrect: true,
          score: 1,
          feedback: 'Perfect sequence!',
          partial: false
        };
      }

      // Partial credit for correct adjacent pairs
      let correctPairs = 0;
      let totalPairs = correctSequence.length - 1;

      for (let i = 0; i < totalPairs; i++) {
        const currentItem = correctSequence[i];
        const nextItem = correctSequence[i + 1];
        
        const currentIndex = answer.indexOf(currentItem);
        const nextIndex = answer.indexOf(nextItem);
        
        if (currentIndex !== -1 && nextIndex !== -1 && nextIndex === currentIndex + 1) {
          correctPairs++;
        }
      }

      const score = correctPairs / totalPairs;

      return {
        isCorrect: false,
        score,
        feedback: `${correctPairs}/${totalPairs} adjacent pairs correct`,
        partial: score > 0,
        breakdown: { correctPairs, totalPairs }
      };
    };
  }

  createTableValidator() {
    return (answer, question) => {
      const correctTable = question.correctAnswer || question.correctTable;
      if (!correctTable || !answer) {
        return { isCorrect: false, score: 0, feedback: 'Invalid table format' };
      }

      let correctCells = 0;
      let totalCells = 0;

      // Count correct cells
      for (const [row, columns] of Object.entries(correctTable)) {
        for (const [col, correctValue] of Object.entries(columns)) {
          totalCells++;
          if (answer[row]?.[col] === correctValue) {
            correctCells++;
          }
        }
      }

      const score = totalCells > 0 ? correctCells / totalCells : 0;
      const isCorrect = score === 1;

      return {
        isCorrect,
        score,
        feedback: isCorrect 
          ? 'Table completed correctly!' 
          : `${correctCells}/${totalCells} cells correct`,
        partial: score > 0 && score < 1,
        breakdown: { correctCells, totalCells }
      };
    };
  }

  createDefaultValidator() {
    return (answer, question) => {
      const correctAnswer = question.correctAnswer || question.correct;
      const isCorrect = JSON.stringify(answer) === JSON.stringify(correctAnswer);
      
      return {
        isCorrect,
        score: isCorrect ? 1 : 0,
        feedback: isCorrect ? 'Correct!' : 'Incorrect',
        partial: false
      };
    };
  }

  // Scorer Factories
  createMultipleChoiceScorer() {
    return (validation, metadata = {}) => {
      let points = validation.isCorrect ? 100 : 0;
      
      // Time bonus (up to 50% bonus for quick answers)
      if (validation.isCorrect && metadata.timeToAnswer && metadata.timeToAnswer < 10000) {
        const timeBonus = (10000 - metadata.timeToAnswer) / 20000;
        points *= (1 + timeBonus);
      }
      
      // Difficulty multiplier
      const difficultyMultiplier = this.getDifficultyMultiplier(metadata.difficulty);
      points *= difficultyMultiplier;
      
      // Hint penalty
      const hintPenalty = this.getHintPenalty(metadata.hintsUsed);
      points *= hintPenalty;
      
      return {
        points: Math.round(points),
        breakdown: {
          base: validation.isCorrect ? 100 : 0,
          timeBonus: points - 100,
          difficultyMultiplier,
          hintPenalty: 1 - hintPenalty
        }
      };
    };
  }

  createMultipleAnswersScorer() {
    return (validation, metadata = {}) => {
      let points = validation.score * 100; // Partial credit supported
      
      // Apply standard modifiers
      const difficultyMultiplier = this.getDifficultyMultiplier(metadata.difficulty);
      const hintPenalty = this.getHintPenalty(metadata.hintsUsed);
      
      points *= difficultyMultiplier * hintPenalty;
      
      return {
        points: Math.round(points),
        breakdown: {
          base: validation.score * 100,
          difficultyMultiplier,
          hintPenalty: 1 - hintPenalty,
          partialCredit: validation.partial
        }
      };
    };
  }

  createSingleAnswerScorer() {
    return this.createMultipleChoiceScorer(); // Same logic
  }

  createDragAndDropScorer() {
    return this.createMultipleAnswersScorer(); // Supports partial credit
  }

  createFillInBlanksScorer() {
    return this.createMultipleAnswersScorer(); // Supports partial credit
  }

  createGapFillScorer() {
    return this.createMultipleAnswersScorer(); // Supports partial credit
  }

  createHighlightScorer() {
    return this.createMultipleAnswersScorer(); // Supports partial credit
  }

  createClickToChangeScorer() {
    return this.createMultipleAnswersScorer(); // Supports partial credit
  }

  createSequencingScorer() {
    return (validation, metadata = {}) => {
      let points = validation.score * 100;
      
      // Bonus for perfect sequence
      if (validation.isCorrect) {
        points += 25; // 25% bonus for perfect sequence
      }
      
      // Apply standard modifiers
      const difficultyMultiplier = this.getDifficultyMultiplier(metadata.difficulty);
      const hintPenalty = this.getHintPenalty(metadata.hintsUsed);
      
      points *= difficultyMultiplier * hintPenalty;
      
      return {
        points: Math.round(points),
        breakdown: {
          base: validation.score * 100,
          perfectBonus: validation.isCorrect ? 25 : 0,
          difficultyMultiplier,
          hintPenalty: 1 - hintPenalty
        }
      };
    };
  }

  createTableScorer() {
    return this.createMultipleAnswersScorer(); // Supports partial credit
  }

  createDefaultScorer() {
    return (validation, metadata = {}) => {
      let points = validation.score * 100;
      
      const difficultyMultiplier = this.getDifficultyMultiplier(metadata.difficulty);
      const hintPenalty = this.getHintPenalty(metadata.hintsUsed);
      
      points *= difficultyMultiplier * hintPenalty;
      
      return {
        points: Math.round(points),
        breakdown: {
          base: validation.score * 100,
          difficultyMultiplier,
          hintPenalty: 1 - hintPenalty
        }
      };
    };
  }

  // Helper methods
  getDifficultyMultiplier(difficulty) {
    const multipliers = {
      'beginner': 0.8,
      'easy': 1.0,
      'medium': 1.25,
      'intermediate': 1.25,
      'hard': 1.5,
      'advanced': 1.5,
      'expert': 1.75
    };
    return multipliers[difficulty?.toLowerCase()] || 1.0;
  }

  getHintPenalty(hintsUsed = 0) {
    return Math.max(0.5, 1 - (hintsUsed * 0.1));
  }
}

// Global registry instance
export const exerciseTypeRegistry = new ExerciseTypeRegistry();

// Export utility functions
export const getExerciseRenderer = (typeId) => exerciseTypeRegistry.getRenderer(typeId);
export const getExerciseValidator = (typeId) => exerciseTypeRegistry.getValidator(typeId);
export const getExerciseScorer = (typeId) => exerciseTypeRegistry.getScorer(typeId);
export const getExerciseConfig = (typeId) => exerciseTypeRegistry.getConfig(typeId);
export const registerExerciseType = (type) => exerciseTypeRegistry.register(type);

export default exerciseTypeRegistry;
