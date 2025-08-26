/**
 * RhymeExercise Component
 * Restored original counter-style rhyme exercise
 */

import React, { useState } from 'react';

const RhymeExercise = ({ 
  question, 
  onAnswer, 
  currentAnswer, 
  showFeedback,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious 
}) => {
  const [selectedWords, setSelectedWords] = useState(currentAnswer || []);

  const handleWordSelect = (word) => {
    const isSelected = selectedWords.includes(word);
    let newSelection;
    
    if (isSelected) {
      newSelection = selectedWords.filter(w => w !== word);
    } else {
      newSelection = [...selectedWords, word];
    }
    
    setSelectedWords(newSelection);
    
    // Auto-submit when selection changes
    if (onAnswer) {
      onAnswer(newSelection);
    }
  };

  const isWordSelected = (word) => selectedWords.includes(word);

  const getWordClass = (word) => {
    const baseClass = "px-4 py-2 m-1 border rounded-lg cursor-pointer transition-colors ";
    
    if (showFeedback) {
      if (question?.correctRhymes?.includes(word)) {
        return baseClass + "bg-green-100 border-green-500 text-green-700";
      } else if (isWordSelected(word)) {
        return baseClass + "bg-red-100 border-red-500 text-red-700";
      }
    }
    
    if (isWordSelected(word)) {
      return baseClass + "bg-blue-100 border-blue-500 text-blue-700";
    }
    
    return baseClass + "bg-gray-50 border-gray-300 hover:bg-gray-100";
  };

  if (!question) {
    return <div>Loading rhyme exercise...</div>;
  }

  return (
    <div className="rhyme-exercise max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Instructions */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Find the Rhyming Words
          </h2>
          <p className="text-gray-600 mb-4">
            Select all words that rhyme with: 
            <span className="font-bold text-blue-600 text-xl ml-2">
              "{question.word}"
            </span>
          </p>
        </div>

        {/* Word Options */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">
            Choose from these words:
          </h3>
          <div className="flex flex-wrap justify-center">
            {question.options?.map((word, index) => (
              <button
                key={index}
                onClick={() => !showFeedback && handleWordSelect(word)}
                disabled={showFeedback}
                className={getWordClass(word)}
              >
                {word}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Words Display */}
        {selectedWords.length > 0 && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-md font-semibold text-blue-800 mb-2">
              Your Selected Rhymes:
            </h4>
            <div className="flex flex-wrap">
              {selectedWords.map((word, index) => (
                <span
                  key={index}
                  className="px-3 py-1 m-1 bg-blue-200 text-blue-800 rounded-full text-sm"
                >
                  {word}
                </span>
              ))}
            </div>
            <p className="text-sm text-blue-600 mt-2">
              Count: {selectedWords.length}
            </p>
          </div>
        )}

        {/* Feedback */}
        {showFeedback && (
          <div className="mb-6 p-4 rounded-lg bg-gray-50">
            <h4 className="text-lg font-semibold mb-2">Results:</h4>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Correct rhymes: </span>
                <span className="text-green-600">
                  {question.correctRhymes?.join(', ') || 'None specified'}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Your selection: </span>
                <span className="text-blue-600">
                  {selectedWords.length > 0 ? selectedWords.join(', ') : 'None selected'}
                </span>
              </p>
              {question.explanation && (
                <p className="text-sm text-gray-600 mt-3">
                  <span className="font-medium">Explanation: </span>
                  {question.explanation}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <button
            onClick={onPrevious}
            disabled={!canGoPrevious}
            className="px-4 py-2 bg-gray-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-gray-600 transition-colors"
          >
            ← Previous
          </button>

          <div className="text-sm text-gray-500">
            Rhyme Exercise
          </div>

          <button
            onClick={onNext}
            disabled={!canGoNext}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-blue-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
};

export default RhymeExercise;
