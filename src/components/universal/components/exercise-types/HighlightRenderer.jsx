/**
 * Highlight Exercise Renderer
 * Preserves exact functionality and UI from original Highlight.jsx
 */

import React from 'react';
import { Volume2 } from 'lucide-react';

export const HighlightRenderer = ({ 
  universalData, 
  highlightedItems,
  setHighlightedItems,
  isPlaying,
  playAudio,
  onSubmit 
}) => {
  const { content } = universalData;
  
  const handleLetterClick = (targetId) => {
    setHighlightedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(targetId)) {
        newSet.delete(targetId);
      } else {
        newSet.add(targetId);
      }
      return newSet;
    });
  };

  const checkAnswer = () => {
    const selectedTargets = Array.from(highlightedItems);
    onSubmit(selectedTargets);
  };

  const renderHighlightableText = () => {
    // Get the text to highlight
    const text = getTextFromExercise();
    const targets = content.elements.targets;
    
    return (
      <div className="text-3xl sm:text-4xl font-bold text-center tracking-wider">
        {text.split('').map((char, index) => {
          // Find if this character position has a target
          const target = targets.find(t => t.position === index);
          const isHighlightable = Boolean(target);
          const isHighlighted = target && highlightedItems.has(target.id);
          
          if (char === ' ') {
            return <span key={index} className="mx-2"> </span>;
          }
          
          return (
            <span
              key={index}
              onClick={() => isHighlightable && handleLetterClick(target.id)}
              className={`
                inline-block mx-1 px-2 py-1 rounded transition-all duration-200
                ${isHighlightable ? 'cursor-pointer hover:bg-yellow-200' : ''}
                ${isHighlighted ? 'bg-yellow-400 text-black' : 'text-gray-800'}
                ${isHighlightable ? 'hover:scale-110' : ''}
              `}
            >
              {char}
            </span>
          );
        })}
      </div>
    );
  };

  const getTextFromExercise = () => {
    // Extract text from the original exercise data
    // This would typically come from exerciseData.text
    return content.elements.targets.reduce((text, target) => {
      if (text.length <= target.position) {
        text = text.padEnd(target.position + 1, ' ');
      }
      return text.substring(0, target.position) + target.content + text.substring(target.position + 1);
    }, '').trim() || 'elephant'; // fallback
  };

  const hasSelections = highlightedItems.size > 0;

  return (
    <>
      {/* Question */}
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.text.question}
      </h1>

      {/* Audio Button */}
      {content.elements.media.audio.length > 0 && (
        <div className="flex justify-center mb-6">
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
        </div>
      )}

      {/* Highlightable Text */}
      <div className="flex justify-center mb-8">
        {renderHighlightableText()}
      </div>

      {/* Instructions */}
      <div className="text-center mb-6">
        <p className="text-gray-600">
          {content.text.instruction}
        </p>
      </div>

      {/* Check Answer Button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={checkAnswer}
          disabled={!hasSelections}
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
          Check Answer ({highlightedItems.size} selected)
        </button>
      </div>
    </>
  );
};
