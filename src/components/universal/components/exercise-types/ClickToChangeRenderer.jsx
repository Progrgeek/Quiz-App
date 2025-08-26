import React, { useState, useEffect } from 'react';

const ClickToChangeRenderer = ({ 
  universalData, 
  userAnswers, 
  onAnswerChange, 
  isAnswered, 
  isCorrect,
  showFeedback 
}) => {
  const [changedWords, setChangedWords] = useState({});

  useEffect(() => {
    if (userAnswers && userAnswers.changedWords) {
      setChangedWords(userAnswers.changedWords);
    }
  }, [userAnswers]);

  const handleWordClick = (wordId, currentWord, alternatives) => {
    if (isAnswered) return;

    const currentIndex = alternatives.indexOf(currentWord);
    const nextIndex = (currentIndex + 1) % alternatives.length;
    const nextWord = alternatives[nextIndex];

    const newChangedWords = {
      ...changedWords,
      [wordId]: nextWord
    };

    setChangedWords(newChangedWords);
    onAnswerChange({
      changedWords: newChangedWords,
      type: 'word_changes'
    });
  };

  const { content, presentation } = universalData;
  const textElements = content.elements.textElements || [];

  const renderText = () => {
    return textElements.map((element, index) => {
      if (element.type === 'text') {
        return <span key={index}>{element.content}</span>;
      } else if (element.type === 'changeable') {
        const currentWord = changedWords[element.id] || element.originalWord;
        const isCorrectWord = element.correctWord === currentWord;
        const showCorrectness = showFeedback && isAnswered;

        let wordClasses = `
          inline-block px-2 py-1 mx-1 rounded cursor-pointer transition-all duration-200 border-b-2
          ${!isAnswered ? 'hover:bg-blue-100 hover:border-blue-400' : 'cursor-default'}
        `;

        if (showCorrectness) {
          if (isCorrectWord) {
            wordClasses += ' bg-green-100 border-green-500 text-green-800';
          } else {
            wordClasses += ' bg-red-100 border-red-500 text-red-800';
          }
        } else {
          wordClasses += ' bg-gray-100 border-gray-400';
        }

        return (
          <span
            key={element.id}
            className={wordClasses}
            onClick={() => handleWordClick(element.id, currentWord, element.alternatives)}
            title={!isAnswered ? 'Click to change word' : ''}
          >
            {currentWord}
          </span>
        );
      }
      return null;
    });
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

      {/* Text Content with Changeable Words */}
      <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-8">
        <div className="text-lg sm:text-xl leading-relaxed text-gray-800">
          {renderText()}
        </div>
      </div>

      {/* Instructions */}
      <div className="text-sm text-gray-600 text-center">
        Click on the highlighted words to change them to the correct form.
      </div>

      {/* Progress Indicator */}
      {!isAnswered && (
        <div className="mt-4 text-center">
          <div className="text-sm text-gray-500">
            Words changed: {Object.keys(changedWords).length} / {textElements.filter(el => el.type === 'changeable').length}
          </div>
        </div>
      )}
    </div>
  );
};

export default ClickToChangeRenderer;
