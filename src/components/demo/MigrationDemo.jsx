import React, { useState } from 'react';

// Import exercise components
import MultipleChoice from '../multipleChoice/MultipleChoice';
import MultipleChoiceWithAnExample from '../multipleChoice/MultipleChoiceWithAnExample';
import MultipleAnswers from '../multipleAnswers/MultipleAnswers';
import MultipleAnswersWithAnExample from '../multipleAnswers/MultipleAnswersWithAnExample';
import SingleAnswer from '../singleAnswer/SingleAnswer';
import SingleAnswerWithAnExample from '../singleAnswer/SingleAnswerWithAnExample';
import DragAndDrop from '../dragAndDrop/DragAndDrop';
import DragAndDropWithAnExample from '../dragAndDrop/DragAndDropWithAnExample';
import FillInTheBlanks from '../fillInTheBlanks/FillInTheBlanks';
import FillInTheBlanksWithAnExample from '../fillInTheBlanks/FillInTheBlanksWithAnExample';
import GapFill from '../gapFill/GapFill';
import GapFillWithAnExample from '../gapFill/GapFillWithAnExample';
import Highlight from '../highlight/Highlight';
import HighlightWithAnExample from '../highlight/HighlightWithAnExample';
import ClickToChange from '../clickToChange/ClickToChange';
import ClickToChangeWithAnExample from '../clickToChange/ClickToChangeWithAnExample';
import Sequencing from '../sequencing/Sequencing';
import SequencingWithAnExample from '../sequencing/SequincingWithAnExample';
import TableExercise from '../tableExercise/TableExercise';
import TableExerciseWithAnExample from '../tableExercise/TableExercisesWithAnExample';
import RhymeExercises from '../rhymeExercises/RhymeExercises';
import RhymeExercisesWithAnExample from '../rhymeExercises/RhymeExercisesWithAnExample';
import SyllableCounting from '../syllableCounting/SyllableCounting';
import SyllableCountingWithAnExample from '../syllableCounting/SyllableCountingWithAnExample';

const MigrationDemo = () => {
  const [selectedExercise, setSelectedExercise] = useState('multipleChoice');
  const [showExample, setShowExample] = useState(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);

  // Exercise types with their components
  const exerciseTypes = {
    multipleChoice: {
      name: 'Multiple Choice',
      component: MultipleChoice,
      exampleComponent: MultipleChoiceWithAnExample,
      sampleData: {
        id: 1,
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: "Paris",
        hint: "It's known as the City of Light"
      }
    },
    multipleAnswers: {
      name: 'Multiple Answers',
      component: MultipleAnswers,
      exampleComponent: MultipleAnswersWithAnExample,
      sampleData: {
        id: 2,
        question: "Which of these are programming languages?",
        options: ["JavaScript", "HTML", "Python", "CSS", "Java"],
        correctAnswers: ["JavaScript", "Python", "Java"],
        hint: "Think about languages that can execute logic, not markup or styling"
      }
    },
    singleAnswer: {
      name: 'Single Answer',
      component: SingleAnswer,
      exampleComponent: SingleAnswerWithAnExample,
      sampleData: {
        id: 3,
        question: "Complete the sentence: 'The quick brown fox _____ over the lazy dog'",
        correctAnswer: "jumps",
        hint: "It's a common verb of movement"
      }
    },
    dragAndDrop: {
      name: 'Drag and Drop',
      component: DragAndDrop,
      exampleComponent: DragAndDropWithAnExample,
      sampleData: {
        id: 4,
        question: "Match the animals to their sounds",
        items: [
          { id: 1, content: "Cat", category: "animal" },
          { id: 2, content: "Dog", category: "animal" },
          { id: 3, content: "Meow", category: "sound" },
          { id: 4, content: "Bark", category: "sound" }
        ],
        correctMatches: [
          { animal: "Cat", sound: "Meow" },
          { animal: "Dog", sound: "Bark" }
        ],
        hint: "Think about what sounds these animals make"
      }
    },
    fillInTheBlanks: {
      name: 'Fill in the Blanks',
      component: FillInTheBlanks,
      exampleComponent: FillInTheBlanksWithAnExample,
      sampleData: {
        id: 5,
        question: "Fill in the blanks: 'The ____ is shining and the ____ are singing'",
        blanks: ["sun", "birds"],
        hint: "Think about a beautiful day outside"
      }
    },
    gapFill: {
      name: 'Gap Fill',
      component: GapFill,
      exampleComponent: GapFillWithAnExample,
      sampleData: {
        id: 6,
        question: "Choose the correct word to fill the gap: 'I am _____ to the store'",
        options: ["going", "go", "went"],
        correctAnswer: "going",
        hint: "Present continuous tense is needed here"
      }
    },
    highlight: {
      name: 'Highlight',
      component: Highlight,
      exampleComponent: HighlightWithAnExample,
      sampleData: {
        id: 7,
        question: "Highlight all the nouns in this sentence",
        text: "The quick brown fox jumps over the lazy dog",
        correctHighlights: ["fox", "dog"],
        hint: "Nouns are people, places, or things"
      }
    },
    clickToChange: {
      name: 'Click to Change',
      component: ClickToChange,
      exampleComponent: ClickToChangeWithAnExample,
      sampleData: {
        id: 8,
        question: "Click on the incorrect words to fix the sentence",
        text: "I are going to the store yesterday",
        corrections: [
          { original: "are", correct: "am" },
          { original: "yesterday", correct: "today" }
        ],
        hint: "Check the verb tense and time reference"
      }
    },
    sequencing: {
      name: 'Sequencing',
      component: Sequencing,
      exampleComponent: SequencingWithAnExample,
      sampleData: {
        id: 9,
        question: "Put these steps in the correct order to make coffee",
        items: ["Drink", "Add coffee grounds", "Pour hot water", "Boil water"],
        correctOrder: ["Boil water", "Add coffee grounds", "Pour hot water", "Drink"],
        hint: "Think about the logical sequence of making coffee"
      }
    },
    tableExercise: {
      name: 'Table Exercise',
      component: TableExercise,
      exampleComponent: TableExerciseWithAnExample,
      sampleData: {
        id: 10,
        question: "Complete the multiplication table",
        tableData: {
          rows: ["2", "3", "4"],
          columns: ["5", "6", "7"],
          answers: {
            "2x5": "10", "2x6": "12", "2x7": "14",
            "3x5": "15", "3x6": "18", "3x7": "21",
            "4x5": "20", "4x6": "24", "4x7": "28"
          }
        },
        hint: "Multiply the row number by the column number"
      }
    },
    rhymeExercises: {
      name: 'Rhyme Exercises',
      component: RhymeExercises,
      exampleComponent: RhymeExercisesWithAnExample,
      sampleData: {
        id: 11,
        question: "Find words that rhyme with 'cat'",
        targetWord: "cat",
        options: ["bat", "dog", "hat", "car", "mat", "sun"],
        correctAnswers: ["bat", "hat", "mat"],
        hint: "Words that rhyme have similar ending sounds"
      }
    },
    syllableCounting: {
      name: 'Syllable Counting',
      component: SyllableCounting,
      exampleComponent: SyllableCountingWithAnExample,
      sampleData: {
        id: 12,
        question: "Count the syllables in 'beautiful'",
        word: "beautiful",
        correctAnswer: 3,
        options: [2, 3, 4, 5],
        hint: "Break the word into parts: beau-ti-ful"
      }
    }
  };

  const exerciseTypeKeys = Object.keys(exerciseTypes);
  const currentExercise = exerciseTypes[selectedExercise];
  const ExerciseComponent = showExample ? 
    currentExercise.exampleComponent : 
    currentExercise.component;

  const handleExerciseComplete = (results) => {
    console.log('Exercise completed with results:', results);
    // Move to next exercise
    const nextIndex = (currentExerciseIndex + 1) % exerciseTypeKeys.length;
    setCurrentExerciseIndex(nextIndex);
    setSelectedExercise(exerciseTypeKeys[nextIndex]);
  };

  const handleAnswerSubmit = (answer) => {
    console.log('Answer submitted:', answer);
    // Process answer based on exercise type
    const isCorrect = validateAnswer(answer);
    return {
      isCorrect,
      feedback: isCorrect ? "Correct!" : "Try again!",
      score: isCorrect ? 10 : 0
    };
  };

  const validateAnswer = (answer) => {
    const exercise = currentExercise.sampleData;
    
    switch (selectedExercise) {
      case 'multipleChoice':
        return answer === exercise.correctAnswer;
      case 'multipleAnswers':
        return Array.isArray(answer) && 
               answer.length === exercise.correctAnswers.length &&
               answer.every(ans => exercise.correctAnswers.includes(ans));
      case 'singleAnswer':
        return answer.toLowerCase().trim() === exercise.correctAnswer.toLowerCase();
      case 'fillInTheBlanks':
        return Array.isArray(answer) && 
               answer.every((ans, idx) => 
                 ans.toLowerCase().trim() === exercise.blanks[idx].toLowerCase()
               );
      case 'gapFill':
        return answer === exercise.correctAnswer;
      default:
        return Math.random() > 0.5; // Random for demo purposes
    }
  };

  if (!ExerciseComponent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Component Not Found
          </h2>
          <p className="text-gray-600">
            The exercise component for "{selectedExercise}" could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 Universal Exercise Demo
          </h1>
          <p className="text-gray-600">
            Test all 10 exercise types with the new Universal Exercise Component
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* Exercise Type Selector */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Type ({exerciseTypeKeys.indexOf(selectedExercise) + 1}/{exerciseTypeKeys.length})
              </label>
              <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {exerciseTypeKeys.map((key) => (
                  <option key={key} value={key}>
                    {exerciseTypes[key].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Example Toggle */}
            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showExample}
                  onChange={(e) => setShowExample(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  📚 Learn with Example
                </span>
              </label>
            </div>

            {/* Hint Toggle */}
            <div className="flex items-end">
              <button
                onClick={() => setShowHint(!showHint)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  showHint 
                    ? 'bg-yellow-500 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                💡 {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            </div>
          </div>

          {/* Hint Display */}
          {showHint && (
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    <strong>Hint:</strong> {currentExercise.sampleData.hint}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Exercise Container */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {currentExercise.name}
              {showExample && (
                <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  With Example
                </span>
              )}
            </h2>
          </div>

          {/* Exercise Component */}
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 min-h-[400px]">
            <ExerciseComponent
              key={`${selectedExercise}-${showExample}`}
              exercise={currentExercise.sampleData}
              onComplete={handleExerciseComplete}
              onAnswerSubmit={handleAnswerSubmit}
            />
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => {
              const prevIndex = currentExerciseIndex === 0 ? 
                exerciseTypeKeys.length - 1 : 
                currentExerciseIndex - 1;
              setCurrentExerciseIndex(prevIndex);
              setSelectedExercise(exerciseTypeKeys[prevIndex]);
            }}
            className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            ← Previous Exercise
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Exercise {currentExerciseIndex + 1} of {exerciseTypeKeys.length}
            </p>
          </div>

          <button
            onClick={() => {
              const nextIndex = (currentExerciseIndex + 1) % exerciseTypeKeys.length;
              setCurrentExerciseIndex(nextIndex);
              setSelectedExercise(exerciseTypeKeys[nextIndex]);
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Next Exercise →
          </button>
        </div>
      </div>
    </div>
  );
};

export default MigrationDemo;
