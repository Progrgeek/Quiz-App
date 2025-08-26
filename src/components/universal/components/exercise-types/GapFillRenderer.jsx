/**
 * Gap Fill Exercise Renderer  
 * Preserves exact functionality and UI from original GapFill.jsx
 */

import React from 'react';
import { Volume2, Play } from 'lucide-react';

export const GapFillRenderer = ({ 
  universalData, 
  userAnswers,
  setUserAnswers,
  inputRefs,
  isPlaying,
  playAudio,
  onSubmit 
}) => {
  const { content } = universalData;
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!hasAnswers) return;
    onSubmit(userAnswers);
  };

  const handleInputChange = (index, value) => {
    const newValue = value.toLowerCase().trim();
    const newAnswers = [...userAnswers];
    newAnswers[index] = newValue;
    setUserAnswers(newAnswers);

    // Auto-advance to next input if available
    if (newValue && index < inputRefs.current.length - 1) {
      const nextInputRef = inputRefs.current[index + 1];
      nextInputRef?.current?.focus();
    }
  };

  const renderWord = () => {
    // Extract word and blanks from exercise data
    const word = content.solution.correctAnswers.join(''); // Reconstruct full word
    const blanks = content.elements.blanks;
    
    return (
      <div className="flex items-center">
        {word.split('').map((letter, index) => {
          const blankIndex = blanks.findIndex(blank => blank.position === index);
          
          if (blankIndex !== -1) {
            // This is a blank position
            return (
              <input
                key={index}
                ref={inputRefs.current[blankIndex]}
                type="text"
                value={userAnswers[blankIndex] || ''}
                onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                className="
                  w-12 h-12 text-2xl text-center border-2 border-blue-500 
                  rounded-md mx-1 focus:outline-none focus:border-blue-700 
                  focus:ring-2 focus:ring-blue-200
                "
                maxLength={1}
                autoComplete="off"
              />
            );
          } else {
            // This is a regular letter
            return (
              <span key={index} className="text-2xl mx-1 font-bold">
                {letter}
              </span>
            );
          }
        })}
      </div>
    );
  };

  const hasAnswers = userAnswers.every(answer => answer && answer.trim());

  return (
    <>
      {/* Question */}
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.text.question}
      </h1>

      {/* Image and Audio Section */}
      <div className="flex flex-col items-center mb-6">
        <div className="flex flex-col items-center space-y-4">
          {/* Audio Button */}
          <button
            onClick={() => playAudio(content.elements.media.audio[0])}
            disabled={isPlaying}
            className={`
              p-3 rounded-full transition-colors duration-200
              ${isPlaying ? "text-blue-600" : "text-blue-500 hover:text-blue-600"}
            `}
          >
            <Volume2 className={`w-8 h-8 ${isPlaying ? "text-blue-600" : "text-blue-500"}`} />
          </button>

          {/* Image */}
          {content.elements.media.images[0] && (
            <img
              src={content.elements.media.images[0]}
              alt={content.solution.correctAnswers.join('')}
              className="w-32 h-32 object-contain"
            />
          )}
        </div>
      </div>

      {/* Word with Blanks */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-2xl flex items-center justify-center">
          {renderWord()}
        </div>

        {/* Submit Button */}
        <div className="flex justify-center mt-8">
          <button
            type="submit"
            disabled={!hasAnswers}
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
    </>
  );
};
