import React, { useState, useEffect } from 'react';

const SingleAnswerRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback 
}) => {
  const [textAnswer, setTextAnswer] = useState('');

  useEffect(() => {
    if (userAnswers && userAnswers.textAnswer) {
      setTextAnswer(userAnswers.textAnswer);
    }
  }, [userAnswers]);

  const handleTextChange = (value) => {
    if (isAnswered) return;

    setTextAnswer(value);
    onAnswerChange({
      textAnswer: value,
      type: 'text'
    });
  };

  const { content, presentation } = universalData;
  const correctAnswer = content.solution.correctAnswer;
  const isCorrectAnswer = showFeedback && isAnswered && 
    textAnswer.toLowerCase().trim() === correctAnswer?.toLowerCase().trim();

  let inputClasses = `
    w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
    ${!isAnswered ? 'bg-white' : 'bg-gray-100'}
  `;

  if (showFeedback && isAnswered) {
    if (isCorrectAnswer) {
      inputClasses += ' border-green-500 bg-green-50';
    } else {
      inputClasses += ' border-red-500 bg-red-50';
    }
  } else {
    inputClasses += ' border-gray-300';
  }

  return (
    <div className={presentation?.styles?.container || "relative bg-white pt-3 sm:pt-5 px-2 sm:px-4"}>
      {/* Question */}
      {content.text.question && (
        <div className={presentation?.styles?.question || "text-lg sm:text-xl font-bold text-green-600 mb-6 text-center"}>
          {content.text.question}
        </div>
      )}

      {/* Instruction */}
      {content.text.instruction && (
        <div className="text-base sm:text-lg text-gray-700 mb-8 text-center">
          {content.text.instruction}
        </div>
      )}

      {/* Context or Prompt (if provided) */}
      {content.elements.context && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <div className="text-lg text-gray-800">
            {content.elements.context}
          </div>
        </div>
      )}

      {/* Image (if provided) */}
      {content.elements.image && (
        <div className="text-center mb-6">
          <img 
            src={content.elements.image.src} 
            alt={content.elements.image.alt || 'Exercise image'}
            className="max-w-sm mx-auto rounded-lg shadow-sm"
          />
          {content.elements.image.caption && (
            <div className="text-sm text-gray-600 mt-2">
              {content.elements.image.caption}
            </div>
          )}
        </div>
      )}

      {/* Answer Input */}
      <div className="max-w-md mx-auto mb-6">
        <div className="mb-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Answer:
          </label>
          <input
            type="text"
            value={textAnswer}
            onChange={(e) => handleTextChange(e.target.value)}
            disabled={isAnswered}
            placeholder={content.metadata?.placeholder || "Type your answer here..."}
            className={inputClasses}
            autoComplete="off"
          />
        </div>

        {/* Character Count (if specified) */}
        {content.metadata?.maxLength && (
          <div className="text-xs text-gray-500 text-right">
            {textAnswer.length} / {content.metadata.maxLength} characters
          </div>
        )}
      </div>

      {/* Feedback */}
      {showFeedback && isAnswered && (
        <div className="max-w-md mx-auto">
          {isCorrectAnswer ? (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-green-800 text-center">
                ✓ Correct!
              </div>
            </div>
          ) : (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-red-800 text-center">
                ✗ Incorrect. The correct answer is: <strong>{correctAnswer}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hints (if provided and not answered) */}
      {!isAnswered && content.metadata?.hints && content.metadata.hints.length > 0 && (
        <div className="mt-6 max-w-md mx-auto">
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="text-sm text-blue-700">
              💡 <strong>Hints:</strong>
              <ul className="mt-2 list-disc list-inside">
                {content.metadata.hints.map((hint, index) => (
                  <li key={index}>{hint}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Word Count Display (for longer answers) */}
      {content.metadata?.showWordCount && textAnswer && (
        <div className="text-center mt-4">
          <div className="text-sm text-gray-500">
            Word count: {textAnswer.trim().split(/\s+/).filter(word => word.length > 0).length}
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleAnswerRenderer;
