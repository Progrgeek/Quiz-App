import React, { useState, useEffect } from 'react';

const SyllableCountingRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback 
}) => {
  const [selectedCount, setSelectedCount] = useState(null);

  useEffect(() => {
    if (userAnswers && userAnswers.syllableCount !== undefined) {
      setSelectedCount(userAnswers.syllableCount);
    }
  }, [userAnswers]);

  const handleCountSelect = (count) => {
    if (isAnswered) return;

    setSelectedCount(count);
    onAnswerChange({
      syllableCount: count,
      type: 'syllable_count'
    });
  };

  const { content, presentation } = universalData;
  const word = content.elements.word;
  const correctCount = content.solution.syllableCount;
  const maxCount = content.metadata?.maxCount || 5;

  // Generate count options (usually 1-5)
  const countOptions = Array.from({ length: maxCount }, (_, i) => i + 1);

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

      {/* Word Display */}
      <div className="text-center mb-8">
        <div className="inline-block bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
          <div className="text-3xl sm:text-4xl font-bold text-blue-800">
            {word?.content || word}
          </div>
          {word?.pronunciation && (
            <div className="text-lg text-blue-600 mt-2">
              /{word.pronunciation}/
            </div>
          )}
        </div>
      </div>

      {/* Syllable Count Options */}
      <div className="flex justify-center mb-8">
        <div className="grid grid-cols-5 gap-3 sm:gap-4">
          {countOptions.map((count) => {
            const isSelected = selectedCount === count;
            const isCorrectCount = correctCount === count;
            const showCorrectness = showFeedback && isAnswered;

            let buttonClasses = `
              w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 font-bold text-xl sm:text-2xl
              transition-all duration-200 flex items-center justify-center
              ${!isAnswered ? 'hover:scale-105 cursor-pointer' : 'cursor-default'}
            `;

            if (showCorrectness) {
              if (isSelected && isCorrectCount) {
                buttonClasses += ' bg-green-500 border-green-600 text-white';
              } else if (isSelected && !isCorrectCount) {
                buttonClasses += ' bg-red-500 border-red-600 text-white';
              } else if (isCorrectCount) {
                buttonClasses += ' bg-green-100 border-green-500 text-green-700';
              } else {
                buttonClasses += ' bg-gray-100 border-gray-300 text-gray-600';
              }
            } else if (isSelected) {
              buttonClasses += ' bg-blue-500 border-blue-600 text-white';
            } else {
              buttonClasses += ' bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50';
            }

            return (
              <button
                key={count}
                className={buttonClasses}
                onClick={() => handleCountSelect(count)}
                disabled={isAnswered}
              >
                {count}
              </button>
            );
          })}
        </div>
      </div>

      {/* Helper Text */}
      <div className="text-center">
        <div className="text-sm text-gray-600 mb-2">
          Count the syllables in the word above
        </div>
        <div className="text-xs text-gray-500">
          Tip: A syllable is a unit of sound that contains a vowel sound
        </div>
      </div>

      {/* Visual Syllable Breakdown (if provided) */}
      {showFeedback && isAnswered && content.metadata?.syllableBreakdown && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-green-700 mb-2">
              Syllable Breakdown:
            </div>
            <div className="text-lg font-mono text-green-800">
              {content.metadata.syllableBreakdown}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SyllableCountingRenderer;
