import React, { useState, useEffect } from 'react';
import { Volume2 } from 'lucide-react';

const MultipleChoiceRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback,
  onAudioPlay 
}) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Early return if data is not ready
  if (!universalData || !universalData.content) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="text-gray-600">Loading exercise...</div>
      </div>
    );
  }

  useEffect(() => {
    if (userAnswers && userAnswers.selectedOption) {
      setSelectedOption(userAnswers.selectedOption);
    }
  }, [userAnswers]);

  const handleOptionSelect = (optionId) => {
    if (isAnswered) return;

    setSelectedOption(optionId);
    onAnswerChange({
      selectedOption: optionId,
      type: 'single'
    });
  };

  const handleAudioPlay = (audioPath) => {
    if (onAudioPlay) {
      onAudioPlay(audioPath);
    }
  };

  const { content, presentation } = universalData;
  const options = content?.elements?.options || [];

  return (
    <div className={presentation?.styles?.container || "relative bg-white pt-3 sm:pt-5 px-2 sm:px-4"}>
      {/* Question */}
      {content?.text?.question && (
        <div className={presentation?.styles?.question || "text-lg sm:text-xl font-bold text-green-600 mb-6 text-center"}>
          {content.text.question}
        </div>
      )}

      {/* Instruction */}
      {content?.text?.instruction && (
        <div className="text-base sm:text-lg text-gray-700 mb-8 text-center">
          {content.text.instruction}
        </div>
      )}

      {/* Options Grid */}
      <div className="grid gap-4 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 max-w-4xl mx-auto">
        {options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrectOption = content?.solution?.correctOption === option.id;
          const showCorrectness = showFeedback && isAnswered;

          let optionClasses = `
            h-full cursor-pointer transition-all duration-200 bg-white rounded-lg border-2 p-4
            ${!isAnswered ? 'hover:border-blue-300 hover:shadow-md' : 'cursor-default'}
          `;

          if (isSelected && !showCorrectness) {
            optionClasses += ' border-blue-500 bg-blue-50';
          } else if (showCorrectness) {
            if (isSelected && isCorrectOption) {
              optionClasses += ' border-green-500 bg-green-50';
            } else if (isSelected && !isCorrectOption) {
              optionClasses += ' border-red-500 bg-red-50';
            } else if (isCorrectOption) {
              optionClasses += ' border-green-500 bg-green-50';
            } else {
              optionClasses += ' border-gray-300';
            }
          } else {
            optionClasses += ' border-gray-300';
          }

          return (
            <div
              key={option.id}
              className={optionClasses}
              onClick={() => handleOptionSelect(option.id)}
            >
              {/* Option Image */}
              {option.image && (
                <div className="mb-3">
                  <img 
                    src={option.image} 
                    alt={typeof option.content === 'string' ? option.content : 'Option image'}
                    className="w-full h-32 sm:h-40 object-cover rounded-lg"
                  />
                </div>
              )}

              {/* Option Content */}
              <div className="flex items-center justify-between">
                <span className="text-base sm:text-lg font-medium text-gray-800">
                  {typeof option.content === 'string' ? option.content : JSON.stringify(option.content)}
                </span>

                {/* Audio Button */}
                {option.audio && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAudioPlay(option.audio);
                    }}
                    className="ml-2 p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-full transition-colors duration-200"
                    aria-label={`Play audio for ${option.content}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>
                )}

                {/* Selection Indicator */}
                {isSelected && (
                  <div className="ml-2 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Feedback Icons */}
              {showCorrectness && (
                <div className="mt-2 flex justify-end">
                  {isSelected && isCorrectOption && (
                    <div className="text-green-600 font-bold">✓</div>
                  )}
                  {isSelected && !isCorrectOption && (
                    <div className="text-red-600 font-bold">✗</div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Exercise Instructions */}
      {content.metadata?.instructions && (
        <div className="text-sm text-gray-600 text-center mt-4">
          {content.metadata.instructions}
        </div>
      )}
    </div>
  );
};

export default MultipleChoiceRenderer;
