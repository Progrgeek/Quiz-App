/**
 * Temporary placeholder for MultipleChoice component
 * TODO: Implement proper multiple choice component
 */

import React from 'react';

const MultipleChoice = ({ exercise, onAnswerSubmit, onNext, ...props }) => {
  return (
    <div className="exercise-placeholder p-6 text-center">
      <h2 className="text-xl font-bold mb-4">Multiple Choice Exercise</h2>
      <p className="text-gray-600 mb-4">
        This component is under development.
      </p>
      <p className="text-sm text-gray-500">
        Exercise Type: {exercise?.type || 'multipleChoice'}
      </p>
      <button 
        onClick={() => onNext && onNext()}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Skip (Development Mode)
      </button>
    </div>
  );
};

export default MultipleChoice;
