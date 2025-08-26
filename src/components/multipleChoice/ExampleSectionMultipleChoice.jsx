import React from 'react';

const ExampleSectionMultipleChoice = () => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-blue-800">
            Multiple Choice Example
          </h3>
          <div className="mt-2 text-sm text-blue-700">
            <p>In a multiple choice question, you need to select ONE correct answer from the given options.</p>
            <div className="mt-2">
              <strong>Example:</strong>
              <p className="mt-1">Question: What is 2 + 2?</p>
              <ul className="mt-1 ml-4">
                <li>• A) 3</li>
                <li>• B) 4 ✓ (Correct)</li>
                <li>• C) 5</li>
                <li>• D) 6</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleSectionMultipleChoice;
