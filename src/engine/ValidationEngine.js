/**
 * Validation Engine
 * Handles answer validation for all exercise types
 */

export class ValidationEngine {
  constructor() {
    this.validators = new Map();
    this.setupBuiltInValidators();
  }
  
  setupBuiltInValidators() {
    // Multiple Choice validator
    this.validators.set('multipleChoice', (answer, question) => {
      const isCorrect = answer === question.correctAnswer;
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Correct!' 
          : question.incorrectFeedback || `Incorrect. The correct answer is: ${question.options[question.correctAnswer]}`,
        correctAnswer: question.correctAnswer
      };
    });
    
    // Single Answer validator (similar to multiple choice)
    this.validators.set('singleAnswer', (answer, question) => {
      const isCorrect = answer === question.correctAnswer;
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Correct!' 
          : question.incorrectFeedback || 'Incorrect answer.',
        correctAnswer: question.correctAnswer
      };
    });
    
    // Multiple Answers validator (checkbox)
    this.validators.set('multipleAnswers', (answers, question) => {
      const correctAnswers = question.correctAnswers || [];
      const userAnswers = Array.isArray(answers) ? answers : [answers];
      
      const isCorrect = correctAnswers.length === userAnswers.length &&
        correctAnswers.every(answer => userAnswers.includes(answer));
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Correct!' 
          : question.incorrectFeedback || 'Incorrect selection.',
        correctAnswer: correctAnswers,
        partialCredit: this.calculatePartialCredit(userAnswers, correctAnswers)
      };
    });
    
    // Fill in the Blanks validator
    this.validators.set('fillInTheBlanks', (answers, question) => {
      const correctAnswers = question.correctAnswers || [];
      const userAnswers = Array.isArray(answers) ? answers : [answers];
      
      let correctCount = 0;
      const results = userAnswers.map((answer, index) => {
        const correct = this.compareAnswer(answer, correctAnswers[index]);
        if (correct) correctCount++;
        return { correct, userAnswer: answer, correctAnswer: correctAnswers[index] };
      });
      
      const isCorrect = correctCount === correctAnswers.length;
      const partialScore = correctCount / correctAnswers.length;
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'All blanks filled correctly!' 
          : `${correctCount}/${correctAnswers.length} blanks correct.`,
        correctAnswer: correctAnswers,
        partialCredit: partialScore,
        details: results
      };
    });
    
    // Drag and Drop validator
    this.validators.set('dragAndDrop', (positions, question) => {
      const correctPositions = question.correctPositions || {};
      let correctCount = 0;
      const totalItems = Object.keys(correctPositions).length;
      
      const results = {};
      for (const [itemId, expectedZone] of Object.entries(correctPositions)) {
        const actualZone = positions[itemId];
        const isCorrect = actualZone === expectedZone;
        if (isCorrect) correctCount++;
        
        results[itemId] = {
          correct: isCorrect,
          expected: expectedZone,
          actual: actualZone
        };
      }
      
      const isCorrect = correctCount === totalItems;
      const partialScore = correctCount / totalItems;
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Perfect placement!' 
          : `${correctCount}/${totalItems} items placed correctly.`,
        correctAnswer: correctPositions,
        partialCredit: partialScore,
        details: results
      };
    });
    
    // Sequencing validator
    this.validators.set('sequencing', (sequence, question) => {
      const correctSequence = question.correctSequence || [];
      const userSequence = Array.isArray(sequence) ? sequence : [];
      
      const isCorrect = JSON.stringify(userSequence) === JSON.stringify(correctSequence);
      
      // Calculate partial credit based on correct positions
      let correctPositions = 0;
      for (let i = 0; i < Math.min(userSequence.length, correctSequence.length); i++) {
        if (userSequence[i] === correctSequence[i]) {
          correctPositions++;
        }
      }
      
      const partialScore = correctPositions / correctSequence.length;
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Perfect sequence!' 
          : `${correctPositions}/${correctSequence.length} items in correct position.`,
        correctAnswer: correctSequence,
        partialCredit: partialScore
      };
    });
    
    // Click to Change validator
    this.validators.set('clickToChange', (answer, question) => {
      const isCorrect = answer === question.correctAnswer;
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Correct!' 
          : question.incorrectFeedback || 'Incorrect selection.',
        correctAnswer: question.correctAnswer
      };
    });
    
    // Highlight validator
    this.validators.set('highlight', (selections, question) => {
      const correctSelections = question.correctSelections || [];
      const userSelections = Array.isArray(selections) ? selections : [selections];
      
      const isCorrect = this.arraysEqual(
        userSelections.sort(), 
        correctSelections.sort()
      );
      
      let correctCount = 0;
      userSelections.forEach(selection => {
        if (correctSelections.includes(selection)) correctCount++;
      });
      
      const partialScore = correctCount / correctSelections.length;
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Perfect highlighting!' 
          : `${correctCount}/${correctSelections.length} correct selections.`,
        correctAnswer: correctSelections,
        partialCredit: partialScore
      };
    });
    
    // Gap Fill validator
    this.validators.set('gapFill', (answers, question) => {
      // Similar to fill in the blanks
      return this.validators.get('fillInTheBlanks')(answers, question);
    });
    
    // Table Exercise validator
    this.validators.set('tableExercise', (tableData, question) => {
      const correctTable = question.correctTable || {};
      let correctCells = 0;
      let totalCells = 0;
      
      const results = {};
      
      for (const [row, columns] of Object.entries(correctTable)) {
        results[row] = {};
        for (const [col, expectedValue] of Object.entries(columns)) {
          totalCells++;
          const userValue = tableData[row]?.[col];
          const isCorrect = this.compareAnswer(userValue, expectedValue);
          if (isCorrect) correctCells++;
          
          results[row][col] = {
            correct: isCorrect,
            expected: expectedValue,
            actual: userValue
          };
        }
      }
      
      const isCorrect = correctCells === totalCells;
      const partialScore = totalCells > 0 ? correctCells / totalCells : 0;
      
      return {
        isCorrect,
        feedback: isCorrect 
          ? question.correctFeedback || 'Table completed perfectly!' 
          : `${correctCells}/${totalCells} cells correct.`,
        correctAnswer: correctTable,
        partialCredit: partialScore,
        details: results
      };
    });
  }
  
  validate(answer, question, exerciseType) {
    const validator = this.validators.get(exerciseType);
    
    if (!validator) {
      console.warn(`No validator found for exercise type: ${exerciseType}`);
      return {
        isCorrect: false,
        feedback: 'Unable to validate answer - unknown exercise type.',
        correctAnswer: null
      };
    }
    
    try {
      const result = validator(answer, question);
      return {
        ...result,
        timestamp: Date.now(),
        exerciseType
      };
    } catch (error) {
      console.error('Validation error:', error);
      return {
        isCorrect: false,
        feedback: 'An error occurred while validating your answer.',
        correctAnswer: null,
        error: error.message
      };
    }
  }
  
  // Helper methods
  compareAnswer(userAnswer, correctAnswer) {
    if (typeof userAnswer === 'string' && typeof correctAnswer === 'string') {
      return userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim();
    }
    return userAnswer === correctAnswer;
  }
  
  calculatePartialCredit(userAnswers, correctAnswers) {
    if (!Array.isArray(userAnswers) || !Array.isArray(correctAnswers)) {
      return 0;
    }
    
    let correctCount = 0;
    userAnswers.forEach(answer => {
      if (correctAnswers.includes(answer)) correctCount++;
    });
    
    return correctAnswers.length > 0 ? correctCount / correctAnswers.length : 0;
  }
  
  arraysEqual(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, index) => val === arr2[index]);
  }
  
  // Register custom validator
  registerValidator(exerciseType, validatorFunction) {
    this.validators.set(exerciseType, validatorFunction);
  }
  
  // Get available exercise types
  getAvailableTypes() {
    return Array.from(this.validators.keys());
  }
}

export default ValidationEngine;
