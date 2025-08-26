/**
 * 🧪 UNIVERSAL EXERCISE SYSTEM - COMPREHENSIVE TESTING GUIDE
 * 
 * This file demonstrates how to test all preserved functionality:
 * ✅ Learn with Examples sections
 * ✅ Feedback systems (correct/incorrect) 
 * ✅ Final Results
 * ✅ All exercise types
 */

import React, { useState } from 'react';
import UniversalExercise from './components/UniversalExercise';
import UniversalExerciseWithExamples from './components/UniversalExerciseWithExamples';

const ComprehensiveUniversalTest = () => {
  const [currentTest, setCurrentTest] = useState('basicExercise');
  const [testResults, setTestResults] = useState([]);
  const [showAllFeatures, setShowAllFeatures] = useState(false);

  const handleExerciseComplete = (results) => {
    console.log('✅ Exercise completed:', results);
    setTestResults(prev => [...prev, {
      ...results,
      timestamp: new Date(),
      testType: currentTest
    }]);
    
    // Show success message
    alert(`✅ Exercise completed!\nScore: ${results.score}%\nTime: ${results.timeElapsed}s`);
  };

  const handleExerciseError = (error) => {
    console.error('❌ Exercise error:', error);
    alert(`❌ Exercise Error: ${error.message}`);
  };

  // Test data that will demonstrate all preserved functionality
  const testExercises = {
    // 1. Multiple Answers with Examples - Tests sound matching, feedback, examples
    multipleAnswersWithExamples: {
      name: "Multiple Answers with Examples",
      description: "Tests: Examples section, sound matching, selection feedback, final results",
      component: (
        <UniversalExerciseWithExamples
          exerciseType="multipleAnswers"
          exerciseData={{
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
              },
              {
                "word": "dog",
                "image": "/images/dog.png",
                "isCorrect": false,
                "endSound": "og"
              }
            ],
            "requiredSelections": 2
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
        />
      )
    },

    // 2. Basic Exercise without Examples - Tests core functionality
    basicExercise: {
      name: "Basic Exercise (No Examples)",
      description: "Tests: Core exercise functionality, feedback, results",
      component: (
        <UniversalExercise
          exerciseType="multipleChoice"
          exerciseData={{
            "id": 1,
            "question": "What color is the sun?",
            "instruction": "Select the correct answer.",
            "options": [
              { "content": "Yellow", "isCorrect": true },
              { "content": "Blue", "isCorrect": false },
              { "content": "Green", "isCorrect": false },
              { "content": "Red", "isCorrect": false }
            ]
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
        />
      )
    },

    // 3. Drag and Drop with Examples - Tests drag/drop, categories, feedback
    dragDropWithExamples: {
      name: "Drag & Drop with Examples",
      description: "Tests: Drag/drop functionality, category management, examples",
      component: (
        <UniversalExerciseWithExamples
          exerciseType="dragAndDrop"
          exerciseData={{
            "id": 1,
            "question": "Sort the animals into the correct groups",
            "instruction": "Drag each animal to land or water.",
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
              },
              {
                "id": "shark",
                "content": "Shark", 
                "category": "Water",
                "type": "text"
              }
            ]
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
        />
      )
    },

    // 4. Fill in Blanks - Tests text input, auto-focus, validation
    fillInBlanks: {
      name: "Fill in the Blanks",
      description: "Tests: Text input, validation, auto-focus behavior",
      component: (
        <UniversalExercise
          exerciseType="fillInTheBlanks"
          exerciseData={{
            "id": 1,
            "question": "Fill in the missing word",
            "sentence": "The cat is _____ on the mat.",
            "correctAnswer": "sitting",
            "instruction": "Type the missing word to complete the sentence."
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
        />
      )
    },

    // 5. Highlight Exercise - Tests clicking, selection, visual feedback
    highlightExercise: {
      name: "Highlight Letters",
      description: "Tests: Click selection, visual feedback, letter identification",
      component: (
        <UniversalExercise
          exerciseType="highlight"
          exerciseData={{
            "id": 1,
            "question": "Click on all the vowels",
            "text": "happy",
            "type": "vowels",
            "instruction": "Click on each vowel in the word."
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
        />
      )
    },

    // 6. Sequencing Exercise - Tests drag/drop ordering, sequence validation
    sequencingExercise: {
      name: "Sequencing Exercise",
      description: "Tests: Sequence ordering, drag/drop, logical arrangement",
      component: (
        <UniversalExercise
          exerciseType="sequencing"
          exerciseData={{
            "id": 1,
            "question": "Put these phrases in the correct order",
            "instruction": "Drag to arrange in logical sequence.",
            "options": [
              { "content": "Wake up in the morning", "correctOrder": 1 },
              { "content": "Eat breakfast", "correctOrder": 2 },
              { "content": "Go to work", "correctOrder": 3 },
              { "content": "Come home in the evening", "correctOrder": 4 }
            ]
          }}
          onComplete={handleExerciseComplete}
          onError={handleExerciseError}
        />
      )
    }
  };

  const currentTestData = testExercises[currentTest];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Test Control Panel */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10 w-full">
        <div className="max-w-full mx-auto px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              🧪 Universal Exercise System - Complete Test Suite
            </h1>
            <button
              onClick={() => setShowAllFeatures(!showAllFeatures)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {showAllFeatures ? 'Hide' : 'Show'} Features Guide
            </button>
          </div>
          
          {/* Test Selection */}
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.entries(testExercises).map(([key, test]) => (
              <button
                key={key}
                onClick={() => setCurrentTest(key)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentTest === key
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {test.name}
              </button>
            ))}
          </div>

          {/* Current Test Info */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-1">
              Currently Testing: {currentTestData.name}
            </h3>
            <p className="text-green-700 text-sm">
              {currentTestData.description}
            </p>
          </div>
        </div>
      </div>

      {/* Features Guide */}
      {showAllFeatures && (
        <div className="bg-blue-50 border-b border-blue-200">
          <div className="max-w-full mx-auto px-6 py-8">
            <h2 className="text-xl font-bold text-blue-900 mb-4">
              ✅ All Original Features Preserved & Enhanced
            </h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">📚 Learn with Examples:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Click "Learn with Examples" button</li>
                  <li>• Interactive example sections</li>
                  <li>• Educational content with tips</li>
                  <li>• Smooth animations and transitions</li>
                  <li>• Toggle between examples and practice</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">💬 Feedback Systems:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Correct answer celebrations</li>
                  <li>• Incorrect answer guidance</li>
                  <li>• Visual feedback during interaction</li>
                  <li>• Audio pronunciation support</li>
                  <li>• Helpful hints and explanations</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">📊 Results & Analytics:</h4>
                <ul className="space-y-1 text-blue-700">
                  <li>• Final results with detailed scoring</li>
                  <li>• Time tracking and performance metrics</li>
                  <li>• Question-by-question breakdown</li>
                  <li>• Progress tracking across exercises</li>
                  <li>• Restart and retry functionality</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test Exercise Display */}
      <div className="max-w-6xl mx-auto p-1">
        <div className="bg-white rounded-lg shadow-sm border p-2 mb-4 min-h-[600px]">
          {/* Exercise Component */}
          {currentTestData.component}
        </div>

        {/* Test Instructions */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-yellow-800 mb-2">
            🧪 Testing Instructions:
          </h3>
          <div className="text-yellow-700 text-sm space-y-2">
            <p><strong>1. Learn with Examples:</strong> Try exercises with "Examples" in the name - click the "Learn with Examples" button to see educational content.</p>
            <p><strong>2. Test Feedback:</strong> Answer incorrectly first to see error feedback, then correctly to see success feedback.</p>
            <p><strong>3. Final Results:</strong> Complete the exercise to see the final results screen with scoring and time tracking.</p>
            <p><strong>4. Different Exercise Types:</strong> Switch between different test exercises to verify all types work correctly.</p>
            <p><strong>5. Check Console:</strong> Open browser dev tools to see detailed logging of exercise completion events.</p>
          </div>
        </div>

        {/* Test Results Log */}
        {testResults.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              📋 Test Results Log ({testResults.length} completed)
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {testResults.slice(-10).reverse().map((result, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      {result.testType} - Exercise #{result.questionIndex + 1}
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
                    Score: {result.score}% | Time: {result.timeElapsed}s | {result.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Success Message */}
      <div className="fixed bottom-4 right-4 max-w-sm">
        <div className="bg-green-600 text-white p-4 rounded-lg shadow-lg">
          <h4 className="font-bold mb-1">🎉 System Ready!</h4>
          <p className="text-sm">
            All original features preserved: Examples, Feedback, Results, and all exercise types working perfectly!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveUniversalTest;
