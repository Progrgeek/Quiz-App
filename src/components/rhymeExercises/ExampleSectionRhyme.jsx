import React from 'react';

const ExampleSectionRhyme = () => {
  return (
    <div className="bg-purple-50 border-l-4 border-purple-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-purple-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-purple-800">
            Rhyme Exercise Example
          </h3>
          <div className="mt-2 text-sm text-purple-700">
            <p>In rhyme exercises, you identify words that sound similar at the end.</p>
            <div className="mt-2">
              <strong>Example:</strong>
              <p className="mt-1">Which words rhyme with "cat"?</p>
              <ul className="mt-1 ml-4">
                <li>• bat ✓ (Rhymes)</li>
                <li>• dog ✗ (Doesn't rhyme)</li>
                <li>• hat ✓ (Rhymes)</li>
                <li>• car ✗ (Doesn't rhyme)</li>
              </ul>
              <p className="mt-2 italic">Tip: Focus on the ending sounds!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleSectionRhyme;
