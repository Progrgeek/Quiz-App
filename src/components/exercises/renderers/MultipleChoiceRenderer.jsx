/**
 * Multiple Choice Exercise Renderer
 * Renders multiple choice questions through the Universal Exercise system
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useInteractionTracking } from '../../../hooks/useAnalytics';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseOption, 
  ExerciseButton 
} from '../../../design-system/ExerciseComponents';

const MultipleChoiceRenderer = ({ 
  question, 
  onAnswer, 
  state, 
  config = {},
  engine 
}) => {
  const [selectedOption, setSelectedOption] = useState(state?.selectedAnswer || null);
  const [isSubmitted, setIsSubmitted] = useState(state?.isSubmitted || false);
  const [feedback, setFeedback] = useState(state?.feedback || null);
  const { trackClick } = useInteractionTracking('MultipleChoiceRenderer');

  // Reset state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsSubmitted(false);
    setFeedback(null);
  }, [question.id]);

  const handleOptionSelect = useCallback((optionIndex) => {
    if (isSubmitted) return;
    
    setSelectedOption(optionIndex);
    trackClick(`option-${optionIndex}`, question.options[optionIndex]);
  }, [isSubmitted, trackClick, question.options]);

  const handleSubmit = useCallback(async () => {
    if (selectedOption === null || isSubmitted) return;

    const answer = {
      questionId: question.id,
      selectedOption,
      value: question.options[selectedOption],
      timestamp: Date.now()
    };

    setIsSubmitted(true);
    
    try {
      const result = await onAnswer(answer);
      
      if (result) {
        setFeedback(result.feedback);
      }
    } catch (error) {
      console.error('Failed to submit answer:', error);
      setIsSubmitted(false);
    }
  }, [selectedOption, isSubmitted, question, onAnswer]);

  const getOptionClassName = (optionIndex) => {
    const baseClasses = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500";
    
    if (isSubmitted) {
      if (optionIndex === question.correctAnswer) {
        return `${baseClasses} bg-success-100 border-success-500 text-success-800`;
      } else if (optionIndex === selectedOption) {
        return `${baseClasses} bg-error-100 border-error-500 text-error-800`;
      } else {
        return `${baseClasses} bg-neutral-100 border-neutral-300 text-neutral-600`;
      }
    } else if (selectedOption === optionIndex) {
      return `${baseClasses} bg-primary-100 border-primary-500 text-primary-800`;
    } else {
      return `${baseClasses} bg-neutral-0 border-neutral-300 text-neutral-800 hover:bg-neutral-50 hover:border-neutral-400`;
    }
  };

  const getOptionIcon = (optionIndex) => {
    if (isSubmitted) {
      if (optionIndex === question.correctAnswer) {
        return "✅";
      } else if (optionIndex === selectedOption && optionIndex !== question.correctAnswer) {
        return "❌";
      }
    } else if (selectedOption === optionIndex) {
      return "🔵";
    }
    return "⚪";
  };

  if (!question) {
    return (
      <div className="text-center py-8 text-neutral-500">
        <div className="text-4xl mb-2">❓</div>
        <p>No question data available</p>
      </div>
    );
  }

  return (
    <ExerciseContainer layout="standard" withExample={true}>
      {/* Question */}
      <div className="mb-8">
        <ExerciseQuestion variant="primary" level={2}>
          {question.question}
        </ExerciseQuestion>
        
        {question.questionImage && (
          <div className="mb-4">
            <img 
              src={question.questionImage} 
              alt="Question visual" 
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        )}

        {question.context && (
          <div className="mb-4 p-4 bg-primary-50 rounded-lg border-l-4 border-primary-500">
            <p className="text-primary-800 text-sm">{question.context}</p>
          </div>
        )}
      </div>

      {/* Options */}
      <div className="mb-8">
        <div className="space-y-3">
          {question.options?.map((option, index) => (
            <ExerciseOption
              key={index}
              onClick={() => handleOptionSelect(index)}
              disabled={isSubmitted}
              selected={selectedOption === index}
              correct={isSubmitted && index === question.correctAnswer}
              incorrect={isSubmitted && index === selectedOption && index !== question.correctAnswer}
            >
              <div className="flex items-center">
                <span className="text-lg mr-3">{getOptionIcon(index)}</span>
                <div className="flex-1">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span>{option}</span>
                  </div>
                </div>
              </div>
            </ExerciseOption>
          )) || (
            <div className="text-center py-4 text-neutral-500">
              <p>No options available for this question</p>
            </div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="text-center mb-6">
          <ExerciseButton
            variant="primary"
            size="large"
            onClick={handleSubmit}
            disabled={selectedOption === null}
          >
            Submit Answer
          </ExerciseButton>
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="mb-6">
          <div className={`p-4 rounded-lg border-l-4 ${
            feedback.isCorrect 
              ? 'bg-success-50 border-success-500' 
              : 'bg-error-50 border-error-500'
          }`}>
            <div className="flex items-start">
              <span className="text-lg mr-2">
                {feedback.isCorrect ? '🎉' : '💡'}
              </span>
              <div>
                <p className={`font-medium ${
                  feedback.isCorrect ? 'text-success-800' : 'text-error-800'
                }`}>
                  {feedback.isCorrect ? 'Correct!' : 'Not quite right'}
                </p>
                {feedback.explanation && (
                  <p className={`text-sm mt-1 ${
                    feedback.isCorrect ? 'text-success-700' : 'text-error-700'
                  }`}>
                    {feedback.explanation}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Question Metadata */}
      {config.showMetadata && (
        <div className="text-xs text-neutral-500 text-center">
          <p>Difficulty: {question.difficulty || 'Not specified'}</p>
          {question.estimatedTime && (
            <p>Estimated time: {question.estimatedTime}s</p>
          )}
          {question.category && (
            <p>Category: {question.category}</p>
          )}
        </div>
      )}
    </ExerciseContainer>
  );
};

export default MultipleChoiceRenderer;
