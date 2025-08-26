import React, { useState } from 'react';
import rhymeData from './rhymeExercisesData.json';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseOption, 
  ExerciseGrid, 
  ExerciseButton,
  ExerciseFeedback 
} from '../../design-system/ExerciseComponents';

const RhymeExercises = ({ exercise, onComplete, onAnswerSubmit }) => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const currentExercise = exercise || rhymeData[0];

  const handleOptionClick = (option) => {
    if (submitted) return;
    
    setSelectedAnswers(prev => 
      prev.includes(option) 
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = () => {
    if (submitted) return;
    
    const isCorrect = selectedAnswers.length === currentExercise.correctAnswers.length &&
                     selectedAnswers.every(answer => currentExercise.correctAnswers.includes(answer));
    
    setSubmitted(true);
    setFeedback(isCorrect ? 'Correct! Well done!' : 'Try again! Listen for words that sound similar.');
    
    if (onAnswerSubmit) {
      onAnswerSubmit({
        answers: selectedAnswers,
        isCorrect,
        score: isCorrect ? 10 : 0
      });
    }
  };

  const handleReset = () => {
    setSelectedAnswers([]);
    setSubmitted(false);
    setFeedback('');
  };

  return (
    <ExerciseContainer layout="standard" withExample={true}>
      <ExerciseQuestion variant="primary" level={2} className="mb-4">
        🎵 Rhyme Exercise
      </ExerciseQuestion>
      
      <div className="mb-6">
        <p className="text-lg font-medium text-neutral-700 mb-4">
          {currentExercise.question}
        </p>
        
        <ExerciseGrid exerciseType="rhyme">
          {currentExercise.options.map((option, index) => (
            <ExerciseOption
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={submitted}
              selected={selectedAnswers.includes(option)}
            >
              {option}
            </ExerciseOption>
          ))}
        </ExerciseGrid>
      </div>

      {feedback && (
        <ExerciseFeedback 
          isCorrect={feedback.includes('Correct')}
          message={feedback}
        />
      )}

      <div className="flex gap-3">
        <ExerciseButton
          variant="primary"
          size="medium"
          onClick={handleSubmit}
          disabled={selectedAnswers.length === 0 || submitted}
        >
          Submit Answer
        </ExerciseButton>
        
        <ExerciseButton
          variant="secondary"
          size="medium"
          onClick={handleReset}
        >
          Reset
        </ExerciseButton>
      </div>
    </ExerciseContainer>
  );
};

export default RhymeExercises;
