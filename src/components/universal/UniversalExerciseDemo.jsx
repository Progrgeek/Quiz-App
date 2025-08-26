/**
 * Complete Universal Exercise System Usage Examples
 * 
 * This file demonstrates how to use the universal exercise system
 * to render any exercise type with preserved exact functionality.
 */

import React, { useState } from 'react';
import { UniversalExercise } from './components/universal/components/UniversalExercise';

// Import sample exercise data (these would be your existing JSON files)
import multipleAnswersData from './components/multipleAnswers/multipleAnswersExercises.json';
import dragAndDropData from './components/dragAndDrop/data/dragAndDropExercises.json';
import fillInBlanksData from './components/fillInTheBlanks/fillnTheBlanksExercises.json';
import gapFillData from './components/gapFill/gapFillExercises.json';
import highlightData from './components/highlight/highlightExercises.json';

const UniversalExerciseDemo = () => {
  const [currentExercise, setCurrentExercise] = useState('multipleAnswers');
  const [results, setResults] = useState([]);

  const handleExerciseComplete = (exerciseResults) => {
    console.log('Exercise completed:', exerciseResults);
    setResults(prev => [...prev, exerciseResults]);
  };

  const handleExerciseError = (error) => {
    console.error('Exercise error:', error);
  };

  // Example data for all exercise types
  const exerciseExamples = {
    // Multiple Answers - works with existing JSON data unchanged
    multipleAnswers: {
      type: 'multipleAnswers',
      data: multipleAnswersData.soundMatchingExercises?.[0] || {
        "id": 1,
        "type": "sound_matching",
        "question": "Which two words end with the same sound?",
        "options": [
          {
            "word": "deck",
            "image": "/images/deck.png",
            "isCorrect": true,
            "endSound": "eck"
          },
          {
            "word": "rock",
            "image": "/images/rock.png",
            "isCorrect": true,
            "endSound": "eck"
          },
          {
            "word": "cat",
            "image": "/images/cat.png",
            "isCorrect": false,
            "endSound": "at"
          }
        ],
        "requiredSelections": 2
      }
    },

    // Drag and Drop - works with existing JSON data unchanged
    dragAndDrop: {
      type: 'dragAndDrop',
      data: dragAndDropData?.exercises?.[0] || {
        "id": 1,
        "question": "Sort the animals into the correct groups",
        "instruction": "Drag each animal to the land or water category.",
        "categories": ["Land", "Water"],
        "options": [
          {
            "id": "lion",
            "content": "Lion",
            "category": "Land",
            "type": "text"
          },
          {
            "id": "dolphin",
            "content": "Dolphin", 
            "category": "Water",
            "type": "text"
          },
          {
            "id": "elephant",
            "content": "Elephant",
            "category": "Land", 
            "type": "text"
          }
        ]
      }
    },

    // Fill in the Blanks - works with existing JSON data unchanged
    fillInBlanks: {
      type: 'fillInTheBlanks',
      data: fillInBlanksData?.exercises?.[0] || {
        "id": 1,
        "question": "Fill in the missing word",
        "sentence": "The cat is _____ on the mat.",
        "correctAnswer": "sitting",
        "instruction": "Type the missing word to complete the sentence."
      }
    },

    // Gap Fill - works with existing JSON data unchanged
    gapFill: {
      type: 'gapFill',
      data: gapFillData?.exercises?.[0] || {
        "id": 1,
        "question": "Complete the word",
        "word": "h_pp_",
        "blanks": [
          { "position": 1, "correctLetter": "a" },
          { "position": 3, "correctLetter": "y" }
        ],
        "instruction": "Fill in the missing letters to complete the word."
      }
    },

    // Highlight - works with existing JSON data unchanged
    highlight: {
      type: 'highlight',
      data: highlightData?.exercises?.[0] || {
        "id": 1,
        "question": "Click on all the vowels",
        "text": "happy",
        "type": "vowels",
        "instruction": "Click on each vowel in the word."
      }
    },

    // Multiple Choice - new exercise type
    multipleChoice: {
      type: 'multipleChoice',
      data: {
        "id": 1,
        "question": "What color is the sun?",
        "instruction": "Select the correct answer.",
        "options": [
          { "content": "Yellow", "isCorrect": true },
          { "content": "Blue", "isCorrect": false },
          { "content": "Green", "isCorrect": false },
          { "content": "Red", "isCorrect": false }
        ]
      }
    },

    // Single Answer - new exercise type
    singleAnswer: {
      type: 'singleAnswer',
      data: {
        "id": 1,
        "question": "What is the capital of France?",
        "instruction": "Type your answer below.",
        "correctAnswer": "Paris",
        "placeholder": "Enter the city name...",
        "hints": ["It's known as the City of Light"]
      }
    },

    // Click to Change - new exercise type
    clickToChange: {
      type: 'clickToChange',
      data: {
        "id": 1,
        "question": "Correct the grammar in this sentence",
        "instruction": "Click on words to change them to the correct form.",
        "text": "She don't like apples",
        "changeableWords": [
          {
            "id": "word_1",
            "originalWord": "don't",
            "correctForm": "doesn't",
            "alternatives": ["don't", "doesn't"],
            "position": 4
          }
        ]
      }
    },

    // Syllable Counting - new exercise type
    syllableCounting: {
      type: 'syllableCounting',
      data: {
        "id": 1,
        "question": "How many syllables are in this word?",
        "word": "butterfly",
        "syllableCount": 3,
        "syllableBreakdown": "but-ter-fly",
        "pronunciation": "/ˈbʌtərflaɪ/"
      }
    },

    // Table Exercise - new exercise type
    tableExercise: {
      type: 'tableExercise',
      data: {
        "id": 1,
        "question": "Complete the verb conjugation table",
        "instruction": "Fill in the missing verb forms.",
        "headers": ["Pronoun", "Present Tense", "Past Tense"],
        "rows": [
          {
            "id": "row_1",
            "cells": [
              { "content": "I", "type": "static" },
              { "placeholder": "walk", "type": "input" },
              { "placeholder": "walked", "type": "input" }
            ]
          },
          {
            "id": "row_2", 
            "cells": [
              { "content": "He", "type": "static" },
              { "placeholder": "walks", "type": "input" },
              { "placeholder": "walked", "type": "input" }
            ]
          }
        ],
        "correctAnswers": {
          "row_1_Present Tense": "walk",
          "row_1_Past Tense": "walked",
          "row_2_Present Tense": "walks",
          "row_2_Past Tense": "walked"
        }
      }
    },

    // Rhyme Exercise - new exercise type
    rhymeExercise: {
      type: 'rhymeExercise',
      data: {
        "id": 1,
        "question": "Which words rhyme with 'cat'?",
        "instruction": "Select all words that rhyme with the target word.",
        "targetWord": "cat",
        "options": [
          { "content": "bat", "isCorrect": true },
          { "content": "hat", "isCorrect": true },
          { "content": "dog", "isCorrect": false },
          { "content": "rat", "isCorrect": true },
          { "content": "sun", "isCorrect": false }
        ],
        "requiredSelections": 3,
        "rhymePattern": "-at sound"
      }
    },

    // Sequencing - preserved from existing
    sequencing: {
      type: 'sequencing',
      data: {
        "id": 1,
        "question": "Put these phrases in the correct order",
        "instruction": "Drag to arrange the phrases in logical order.",
        "options": [
          { "content": "Wake up in the morning", "correctOrder": 1 },
          { "content": "Eat breakfast", "correctOrder": 2 },
          { "content": "Go to work", "correctOrder": 3 },
          { "content": "Come home in the evening", "correctOrder": 4 }
        ]
      }
    }
  };

  const currentExerciseData = exerciseExamples[currentExercise];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Exercise Type Selector */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Universal Exercise System Demo
          </h1>
          <div className="flex flex-wrap gap-2">
            {Object.keys(exerciseExamples).map((type) => (
              <button
                key={type}
                onClick={() => setCurrentExercise(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentExercise === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Display */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="mb-4">
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              {currentExercise}
            </span>
          </div>

          {/* Universal Exercise Component */}
          <UniversalExercise
            key={`${currentExercise}-${Date.now()}`} // Force re-render when switching
            exerciseData={currentExerciseData.data}
            exerciseType={currentExerciseData.type}
            preserveOriginalUI={true}
            onComplete={handleExerciseComplete}
            onError={handleExerciseError}
            className="universal-exercise-demo"
          />
        </div>

        {/* Results Display */}
        {results.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Exercise Results ({results.length})
            </h3>
            <div className="space-y-3">
              {results.slice(-5).map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">
                      {result.exerciseType || 'Exercise'} #{result.questionIndex + 1}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded ${
                      result.isCorrect 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {result.isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    Time: {result.timeElapsed}s | Score: {result.score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-bold text-blue-900 mb-4">
            ✨ Universal Exercise System Features
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Preserved Functionality:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Exact UI and styling from original components</li>
                <li>• All interaction patterns (drag/drop, selection, input)</li>
                <li>• Timer, scoring, and feedback behavior</li>
                <li>• Audio and animation support</li>
                <li>• Mobile responsiveness</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Enhanced Features:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Universal data schema for all exercise types</li>
                <li>• Modular renderer architecture</li>
                <li>• Consistent state management</li>
                <li>• Unified analytics and tracking</li>
                <li>• Easy addition of new exercise types</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversalExerciseDemo;

/**
 * Example Usage in Your App:
 * 
 * // 1. Import the component
 * import { UniversalExercise } from './components/universal/components/UniversalExercise';
 * 
 * // 2. Use with any existing exercise data (NO CHANGES NEEDED)
 * function MyQuizPage() {
 *   const handleComplete = (results) => {
 *     console.log('Exercise completed:', results);
 *   };
 * 
 *   return (
 *     <UniversalExercise
 *       exerciseData={yourExistingExerciseData}
 *       exerciseType="multipleAnswers"
 *       preserveOriginalUI={true}
 *       onComplete={handleComplete}
 *     />
 *   );
 * }
 * 
 * // 3. Works with ALL existing JSON files unchanged:
 * // - multipleAnswersExercises.json
 * // - dragAndDropExercises.json
 * // - fillnTheBlanksExercises.json
 * // - gapFillExercises.json
 * // - highlightExercises.json
 * // - And any new exercise types!
 */
