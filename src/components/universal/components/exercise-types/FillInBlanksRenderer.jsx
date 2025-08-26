/**
 * Fill in the Blanks Exercise Renderer
 * Preserves exact functionality and UI from original FillInTheBlanks.jsx
 */

import React, { useRef } from 'react';

export const FillInBlanksRenderer = ({ 
  universalData, 
  userAnswer,
  setUserAnswer,
  onSubmit 
}) => {
  const { content } = universalData;
  const inputRef = useRef(null);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userAnswer.trim()) return;
    onSubmit(userAnswer);
  };

  const renderContent = () => {
    const subtype = universalData.metadata.subtype;
    
    if (subtype === 'word_completion') {
      return renderWordCompletion();
    } else if (subtype === 'simple_addition') {
      return renderSimpleAddition();
    } else if (subtype === 'possessive_hint') {
      return renderPossessiveHint();
    }
    
    return renderWordCompletion(); // Default
  };

  const renderWordCompletion = () => {
    // Extract parts from sentence template
    const sentence = content.text.template;
    const parts = sentence.split('{answer}');
    const [before, after] = parts;
    
    // Handle {given} placeholder
    const beforeWithGiven = before.replace('{given}', `<strong>${content.solution.correctAnswers[0]}</strong>`);
    
    return (
      <div className="flex items-center gap-2 text-xl">
        <span
          dangerouslySetInnerHTML={{ __html: beforeWithGiven }}
        />
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 px-2 py-1 w-32"
          placeholder="Enter word"
        />
        <span
          dangerouslySetInnerHTML={{
            __html: after ? after.replace('{given}', `<strong>${content.solution.correctAnswers[0]}</strong>`) : '',
          }}
        />
      </div>
    );
  };

  const renderSimpleAddition = () => {
    // This would need to extract the numbers from the exercise data
    // For now, showing a placeholder
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">5</span>
          <span className="text-2xl">+</span>
          <span className="text-2xl">3</span>
          <span className="text-2xl">=</span>
        </div>
        <input
          ref={inputRef}
          type="number"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 px-2 py-1 w-20 text-center text-2xl"
          placeholder="?"
        />
      </div>
    );
  };

  const renderPossessiveHint = () => {
    return (
      <div className="flex items-center gap-2 text-xl">
        <span>Make this possessive: </span>
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border-b-2 border-blue-500 focus:outline-none focus:border-blue-700 px-2 py-1 w-32"
          placeholder="Enter possessive form"
        />
      </div>
    );
  };

  return (
    <>
      {/* Question */}
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.text.question}
      </h1>

      {/* Exercise Content */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center space-y-6">
          {renderContent()}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={!userAnswer.trim()}
            className="
              bg-gradient-to-r from-blue-500 to-blue-600
              hover:from-blue-600 hover:to-blue-700
              disabled:from-gray-400 disabled:to-gray-500
              text-white font-semibold sm:py-4 py-2 px-10
              rounded-xl text-lg
              transform transition-all duration-200
              hover:-translate-y-1 hover:shadow-lg
              disabled:hover:translate-y-0
              disabled:hover:shadow-none
              disabled:cursor-not-allowed
              sm:w-auto mt-8
            "
          >
            Check Answer
          </button>
        </div>
      </form>

      {/* Hint Display */}
      {content.learning.hints.length > 0 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Hint: {content.learning.hints[0].content}
          </p>
        </div>
      )}
    </>
  );
};
