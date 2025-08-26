/**
 * QuizEngine Stats Wrapper
 * Integrates the original Stats component with the new QuizEngine
 * Preserves the original UI while adding QuizEngine compatibility
 */

import React from 'react';
import Stats from '../Stats'; // Original Stats component
import { useQuizTimer, useQuizScore } from '../../hooks/useQuizEngine';
import { useQuizStore } from '../../store/quizStore';

const QuizEngineStats = ({ 
  className = "",
  ...props // Pass through any additional props to original Stats
}) => {
  // Get data from QuizEngine
  const { globalTime } = useQuizTimer();
  const { currentScore } = useQuizScore();
  const {
    currentQuestionIndex,
    totalQuestions
  } = useQuizStore();
  
  // Convert QuizEngine data to original Stats format
  const statsProps = {
    questionNumber: currentQuestionIndex + 1, // Convert 0-based to 1-based
    totalQuestions: totalQuestions,
    timeElapsed: Math.floor(globalTime / 1000), // Convert ms to seconds
    score: currentScore,
    ...props // Allow prop overrides
  };
  
  return (
    <div className={className}>
      <Stats {...statsProps} />
    </div>
  );
};

export default QuizEngineStats;
