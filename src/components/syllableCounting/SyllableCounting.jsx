import React, { useState } from 'react';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseButton, 
  ExerciseFeedback 
} from '../../design-system/ExerciseComponents';
import syllableData from './syllableCountingData.json';

const SyllableCounting = ({ exercise, onComplete, onAnswerSubmit }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  // Handle different data formats
  const baseExercise = exercise || syllableData[0];
  const currentExercise = {
    ...baseExercise,
    correctAnswer: baseExercise.correctAnswer || baseExercise.correctCount,
    options: baseExercise.options || [2, 3, 4, 5]
  };

  const handleOptionClick = (option) => {
    if (submitted) return;
    setSelectedAnswer(option);
  };

  const handleSubmit = () => {
    if (submitted || selectedAnswer === null) return;
    
    const isCorrect = selectedAnswer === currentExercise.correctAnswer;
    
    setSubmitted(true);
    setFeedback(isCorrect ? 'Correct! Great job counting syllables!' : `Try again! The word "${currentExercise.word}" has ${currentExercise.correctAnswer} syllables.`);
    
    if (onAnswerSubmit) {
      onAnswerSubmit({
        answer: selectedAnswer,
        isCorrect,
        score: isCorrect ? 10 : 0
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setSubmitted(false);
    setFeedback('');
  };

  return (
    <ExerciseContainer>
      <div className="text-center mb-6">
        <ExerciseQuestion>
          {currentExercise.question}
        </ExerciseQuestion>
        
        <div className="text-center mb-6">
          <span className="text-3xl font-bold text-primary-600 bg-primary-50 px-6 py-3 rounded-lg">
            {currentExercise.word}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-3">
          {currentExercise.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={submitted}
              className={`p-4 rounded-lg border-2 transition-all duration-200 text-xl font-semibold ${
                selectedAnswer === option
                  ? 'bg-primary-100 border-primary-500 text-primary-700'
                  : 'bg-neutral-50 border-neutral-300 hover:bg-neutral-100'
              } ${submitted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <ExerciseFeedback
        feedback={feedback}
        isCorrect={feedback.includes('Correct')}
      />

      <div className="flex gap-3">
        <ExerciseButton
          onClick={handleSubmit}
          disabled={selectedAnswer === null || submitted}
          variant="primary"
        >
          Submit Answer
        </ExerciseButton>
        
        <ExerciseButton
          onClick={handleReset}
          variant="secondary"
        >
          Reset
        </ExerciseButton>
      </div>
    </ExerciseContainer>
  );
};

export default SyllableCounting;
