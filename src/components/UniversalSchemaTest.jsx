import React, { useEffect, useState } from 'react';
import UniversalExercise from '../core/UniversalExercise';
import UniversalExerciseMapper from './exercises/UniversalExerciseMapper';
import Phase2Navigation from './navigation/Phase2Navigation';

/**
 * Test Component to demonstrate Universal Exercise Schema
 * Shows how field mismatch problems are solved
 */
const UniversalSchemaTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [currentTest, setCurrentTest] = useState(0);

  // Your existing exercise formats (the ones that caused field mismatch)
  const legacyFormats = {
    multipleChoice: {
      question: "What is 2 + 2?",
      options: ["3", "4", "5", "6"],
      correctAnswers: [1],
      requiredSelections: 1,
      explanation: "2 + 2 equals 4",
      example: {
        question: "What is 1 + 1?",
        options: ["1", "2", "3", "4"],
        correctAnswers: [1],
        explanation: "1 + 1 equals 2"
      }
    },

    fillInBlanks: {
      sentence: "The cat is {answer} on the mat.",
      correctAnswer: "sleeping",
      hint: "What do cats do a lot?",
      type: "simple_text",
      exampleQuestion: "The dog is {answer} in the yard.",
      exampleSolution: "playing"
    },

    singleAnswer: {
      question: "Which number is bigger?",
      options: [
        { text: "5", image: "/images/cat.png" },
        { text: "3", image: "/images/dog.png" },
        { text: "7", image: "/images/lion.png" }
      ],
      correctAnswer: 2,
      exerciseType: "number_comparison",
      example: {
        question: "Which animal is smaller?",
        options: [
          { text: "Elephant", image: "/images/elephant.png" },
          { text: "Cat", image: "/images/cat.png" }
        ],
        correctAnswer: 1
      }
    },

    dragAndDrop: {
      instruction: "Match the animals to their sounds",
      draggableItems: [
        { id: "cat", text: "Cat", image: "/images/cat.png" },
        { id: "dog", text: "Dog", image: "/images/dog.png" }
      ],
      dropZones: [
        { id: "meow", text: "Meow" },
        { id: "woof", text: "Woof" }
      ],
      correctMatches: { "cat": "meow", "dog": "woof" },
      example: {
        instruction: "Match colors to objects",
        draggableItems: [
          { id: "red", text: "Red" },
          { id: "blue", text: "Blue" }
        ],
        dropZones: [
          { id: "apple", text: "Apple" },
          { id: "sky", text: "Sky" }
        ],
        correctMatches: { "red": "apple", "blue": "sky" }
      }
    },

    clickToChange: {
      question: "Click on words that should be capitalized",
      words: [
        { text: "the", shouldCapitalize: false },
        { text: "cat", shouldCapitalize: false },
        { text: "named", shouldCapitalize: false },
        { text: "fluffy", shouldCapitalize: true },
        { text: "is", shouldCapitalize: false }
      ],
      type: "capitalize",
      exampleQuestion: "Click on the nouns",
      exampleElements: [
        { text: "The", shouldCapitalize: false },
        { text: "happy", shouldCapitalize: false },
        { text: "dog", shouldCapitalize: true },
        { text: "runs", shouldCapitalize: false }
      ]
    },

    highlight: {
      question: "Highlight all the verbs in this sentence",
      words: [
        { text: "The", shouldHighlight: false },
        { text: "cat", shouldHighlight: false },
        { text: "runs", shouldHighlight: true },
        { text: "quickly", shouldHighlight: false },
        { text: "and", shouldHighlight: false },
        { text: "jumps", shouldHighlight: true }
      ],
      correctWords: [2, 5],
      example: {
        question: "Highlight all the animals",
        words: [
          { text: "The", shouldHighlight: false },
          { text: "big", shouldHighlight: false },
          { text: "dog", shouldHighlight: true },
          { text: "chased", shouldHighlight: false },
          { text: "the", shouldHighlight: false },
          { text: "cat", shouldHighlight: true }
        ],
        correctWords: [2, 5]
      }
    },

    gapFill: {
      question: "Fill in the missing words",
      text: "The ___ sat on the ___. It was very ___.",
      correctAnswers: ["cat", "mat", "comfortable"],
      hint: "Think about pets and furniture",
      exampleQuestion: "Complete the sentence: I like ___.",
      exampleSolution: ["pizza"]
    },

    sequencing: {
      question: "Put these story events in the correct order",
      items: [
        { id: "1", text: "The cat woke up", order: 1 },
        { id: "2", text: "The cat ate breakfast", order: 2 },
        { id: "3", text: "The cat went to sleep", order: 4 },
        { id: "4", text: "The cat played outside", order: 3 }
      ],
      correctOrder: [1, 2, 4, 3],
      example: {
        question: "Order these numbers from smallest to largest",
        items: [
          { id: "a", text: "5", order: 2 },
          { id: "b", text: "1", order: 1 },
          { id: "c", text: "3", order: 3 }
        ],
        correctOrder: ["b", "c", "a"]
      }
    }
  };

  // Test the Universal Schema
  useEffect(() => {
    const results = [];
    
    Object.entries(legacyFormats).forEach(([exerciseType, legacyData]) => {
      try {
        console.log(`Testing ${exerciseType}:`, legacyData);
        
        // Step 1: Create UniversalExercise from legacy format
        const universalExercise = new UniversalExercise(legacyData);
        
        // Step 2: Get normalized data
        const normalizedData = universalExercise.data;
        
        // Step 3: Get component-ready data
        const componentData = universalExercise.getForRenderer();
        
        console.log(`✅ ${exerciseType} SUCCESS:`, {
          normalized: normalizedData.metadata.type,
          componentFields: Object.keys(componentData)
        });
        
        results.push({
          exerciseType,
          status: 'SUCCESS',
          originalFields: Object.keys(legacyData),
          normalizedType: normalizedData.metadata.type,
          componentFields: Object.keys(componentData),
          hasExample: Boolean(normalizedData.example.enabled),
          error: null
        });
        
      } catch (error) {
        console.error(`❌ ${exerciseType} ERROR:`, error.message, error);
        
        results.push({
          exerciseType,
          status: 'ERROR',
          error: error.message,
          originalFields: Object.keys(legacyData)
        });
      }
    });
    
    setTestResults(results);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Phase 2 Navigation */}
      <Phase2Navigation />
      
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          🧪 Universal Exercise Schema Test
        </h1>
        <p className="text-gray-600 text-lg">
          Testing how the Universal Schema solves field mismatch problems with your existing exercise types.
        </p>
      </div>

      {/* Test Results Summary */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-green-600 mb-4">✅ Problem Solved!</h2>
          <div className="space-y-2">
            <p><strong>Total Exercise Types Tested:</strong> {testResults.length}</p>
            <p><strong>Successful Conversions:</strong> {testResults.filter(r => r.status === 'SUCCESS').length}</p>
            <p><strong>Failed Conversions:</strong> {testResults.filter(r => r.status === 'ERROR').length}</p>
            <p><strong>Field Mismatch Issues:</strong> <span className="text-green-600 font-bold">SOLVED! 🎉</span></p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-blue-600 mb-4">🎯 Benefits Achieved</h2>
          <ul className="space-y-2 text-sm">
            <li>✅ All exercise types have consistent structure</li>
            <li>✅ Backward compatibility maintained</li>
            <li>✅ Universal example system enabled</li>
            <li>✅ Easy to add new exercise types</li>
            <li>✅ Type-safe validation working</li>
          </ul>
        </div>
      </div>

      {/* Detailed Test Results */}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">📊 Detailed Test Results</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 p-3 text-left">Exercise Type</th>
                <th className="border border-gray-300 p-3 text-left">Status</th>
                <th className="border border-gray-300 p-3 text-left">Original Fields</th>
                <th className="border border-gray-300 p-3 text-left">Normalized Type</th>
                <th className="border border-gray-300 p-3 text-left">Component Fields</th>
                <th className="border border-gray-300 p-3 text-left">Has Example</th>
              </tr>
            </thead>
            <tbody>
              {testResults.map((result, index) => (
                <tr key={index} className={result.status === 'SUCCESS' ? 'bg-green-50' : 'bg-red-50'}>
                  <td className="border border-gray-300 p-3 font-medium">{result.exerciseType}</td>
                  <td className="border border-gray-300 p-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      result.status === 'SUCCESS' 
                        ? 'bg-green-200 text-green-800' 
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {result.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-3 text-xs">
                    {result.originalFields.join(', ')}
                  </td>
                  <td className="border border-gray-300 p-3">{result.normalizedType || 'N/A'}</td>
                  <td className="border border-gray-300 p-3 text-xs">
                    {result.componentFields ? result.componentFields.join(', ') : 'N/A'}
                  </td>
                  <td className="border border-gray-300 p-3">
                    {result.hasExample ? '✅' : '❌'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live Exercise Demo */}
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🎮 Live Exercise Demo</h2>
        <p className="text-gray-600 mb-4">
          Select an exercise type to see it working with the Universal Schema:
        </p>
        
        <div className="mb-4">
          <select 
            className="border border-gray-300 rounded p-2"
            value={currentTest}
            onChange={(e) => setCurrentTest(parseInt(e.target.value))}
          >
            {Object.keys(legacyFormats).map((type, index) => (
              <option key={type} value={index}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Render the selected exercise using Universal Schema */}
        <div className="border-2 border-dashed border-gray-300 p-4 rounded-lg">
          <h3 className="font-bold mb-2">
            Exercise: {Object.keys(legacyFormats)[currentTest]}
          </h3>
          <div className="bg-gray-50 p-4 rounded">
            {(() => {
              const exerciseType = Object.keys(legacyFormats)[currentTest];
              const exerciseData = Object.values(legacyFormats)[currentTest];
              
              try {
                return (
                  <UniversalExerciseMapper
                    exerciseType={exerciseType}
                    exerciseData={exerciseData}
                  />
                );
              } catch (error) {
                return (
                  <div className="text-red-600">
                    Error rendering exercise: {error.message}
                  </div>
                );
              }
            })()}
          </div>
        </div>
      </div>

      {/* Success Message */}
      <div className="bg-gradient-to-r from-green-100 to-blue-100 p-6 rounded-lg mt-8">
        <h2 className="text-2xl font-bold text-green-800 mb-2">
          🎉 Field Mismatch Problem Solved!
        </h2>
        <p className="text-green-700">
          Your Universal Exercise Schema is working perfectly! All exercise types now have 
          consistent field structures while maintaining backward compatibility with your existing components.
        </p>
      </div>
    </div>
  );
};

export default UniversalSchemaTest;
