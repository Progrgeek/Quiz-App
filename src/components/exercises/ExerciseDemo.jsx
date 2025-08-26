import React, { useState } from 'react';
import { UniversalExerciseMapper } from './index';

/**
 * Simple Exercise Demo Component
 * Demonstrates the cleaned-up exercise system
 */
const ExerciseDemo = () => {
  const [currentExercise, setCurrentExercise] = useState('multiple-answers');

  const exerciseTypes = [
    'multiple-answers',
    'drag-and-drop', 
    'fill-in-blanks',
    'gap-fill',
    'highlight',
    'click-to-change',
    'single-answer',
    'sequencing',
    'table'
  ];

  const sampleExerciseData = {
    content: {
      question: "Sample exercise question",
      options: ["Option 1", "Option 2", "Option 3"],
      correctAnswers: [0]
    }
  };

  return (
    <div className="exercise-demo p-6">
      <div className="demo-header mb-6">
        <h1 className="text-3xl font-bold mb-4">Quiz App - Exercise Demo</h1>
        <p className="text-gray-600 mb-4">
          Select an exercise type to see it in action. This demonstrates our cleaned-up, 
          simplified exercise system.
        </p>
        
        <div className="exercise-selector mb-6">
          <label htmlFor="exercise-type" className="block text-sm font-medium mb-2">
            Choose Exercise Type:
          </label>
          <select 
            id="exercise-type"
            value={currentExercise}
            onChange={(e) => setCurrentExercise(e.target.value)}
            className="border rounded px-3 py-2 bg-white"
          >
            {exerciseTypes.map(type => (
              <option key={type} value={type}>
                {type.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join(' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="demo-content">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">
            Current Exercise: {currentExercise.split('-').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </h2>
          
          <UniversalExerciseMapper
            exerciseType={currentExercise}
            exerciseData={sampleExerciseData}
          />
        </div>
      </div>

      <div className="demo-info mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">✅ Cleanup Completed:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• Removed overcomplicated pattern system</li>
          <li>• Simplified exercise mapping</li>
          <li>• Direct component imports</li>
          <li>• Clean, maintainable code structure</li>
          <li>• Preserved original UI functionality</li>
        </ul>
      </div>
    </div>
  );
};

export default ExerciseDemo;
