import React, { useState, useEffect } from 'react';

const RhymeExerciseRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback 
}) => {
  const [selectedWords, setSelectedWords] = useState([]);

  useEffect(() => {
    if (userAnswers && userAnswers.selectedWords) {
      setSelectedWords(userAnswers.selectedWords);
    }
  }, [userAnswers]);

  const handleWordSelect = (wordId) => {
    if (isAnswered) return;

    let newSelectedWords;
    if (selectedWords.includes(wordId)) {
      newSelectedWords = selectedWords.filter(id => id !== wordId);
    } else {
      newSelectedWords = [...selectedWords, wordId];
    }

    setSelectedWords(newSelectedWords);
    onAnswerChange({
      selectedWords: newSelectedWords,
      type: 'rhyme_selection'
    });
  };

  const { content, presentation } = universalData;
  const targetWord = content.elements.targetWord;
  const options = content.elements.options || [];
  const correctRhymes = content.solution.correctWords || [];

  const getWordStatus = (wordId) => {
    const isSelected = selectedWords.includes(wordId);
    const isCorrectRhyme = correctRhymes.includes(wordId);
    const showCorrectness = showFeedback && isAnswered;

    if (showCorrectness) {
      if (isSelected && isCorrectRhyme) return 'correct';
      if (isSelected && !isCorrectRhyme) return 'incorrect';
      if (!isSelected && isCorrectRhyme) return 'missed';
    }
    if (isSelected) return 'selected';
    return 'unselected';
  };

  const getWordClasses = (status) => {
    const baseClasses = `
      px-4 py-3 rounded-lg border-2 font-medium text-lg transition-all duration-200 cursor-pointer
      flex items-center justify-center min-h-[60px]
      ${!isAnswered ? 'hover:scale-105' : 'cursor-default'}
    `;

    switch (status) {
      case 'correct':
        return baseClasses + ' bg-green-100 border-green-500 text-green-800';
      case 'incorrect':
        return baseClasses + ' bg-red-100 border-red-500 text-red-800';
      case 'missed':
        return baseClasses + ' bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'selected':
        return baseClasses + ' bg-blue-100 border-blue-500 text-blue-800';
      case 'unselected':
        return baseClasses + ' bg-white border-gray-300 text-gray-700 hover:border-blue-400 hover:bg-blue-50';
      default:
        return baseClasses + ' bg-white border-gray-300 text-gray-700';
    }
  };

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

      {/* Target Word */}
      <div className="text-center mb-8">
        <div className="inline-block bg-purple-50 border-2 border-purple-200 rounded-lg p-6">
          <div className="text-2xl sm:text-3xl font-bold text-purple-800 mb-2">
            {targetWord?.content || targetWord}
          </div>
          {targetWord?.pronunciation && (
            <div className="text-lg text-purple-600">
              /{targetWord.pronunciation}/
            </div>
          )}
        </div>
      </div>

      {/* Word Options Grid */}
      <div className="grid gap-3 sm:gap-4 mb-8 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-4xl mx-auto">
        {options.map((option) => {
          const status = getWordStatus(option.id);
          const classes = getWordClasses(status);

          return (
            <div
              key={option.id}
              className={classes}
              onClick={() => handleWordSelect(option.id)}
            >
              <div className="text-center">
                <div className="font-medium">
                  {option.content}
                </div>
                {option.pronunciation && (
                  <div className="text-sm opacity-75 mt-1">
                    /{option.pronunciation}/
                  </div>
                )}
              </div>

              {/* Selection Indicator */}
              {selectedWords.includes(option.id) && (
                <div className="ml-2 w-6 h-6 rounded-full bg-current bg-opacity-20 flex items-center justify-center">
                  <div className="w-2 h-2 bg-current rounded-full"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Selection Counter */}
      <div className="text-center mb-4">
        <div className="text-sm text-gray-600">
          Selected: {selectedWords.length} words
          {content.solution.requiredSelections && (
            <span> (Select {content.solution.requiredSelections} rhyming words)</span>
          )}
        </div>
      </div>

      {/* Rhyme Pattern Explanation (if shown after answer) */}
      {showFeedback && isAnswered && content.metadata?.rhymePattern && (
        <div className="mt-6 p-4 bg-purple-50 border border-purple-200 rounded-lg">
          <div className="text-center">
            <div className="text-sm font-medium text-purple-700 mb-2">
              Rhyme Pattern:
            </div>
            <div className="text-lg text-purple-800">
              {content.metadata.rhymePattern}
            </div>
          </div>
        </div>
      )}

      {/* Hint */}
      {!isAnswered && content.metadata?.hint && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-sm text-blue-700 text-center">
            💡 <strong>Hint:</strong> {content.metadata.hint}
          </div>
        </div>
      )}
    </div>
  );
};

export default RhymeExerciseRenderer;
