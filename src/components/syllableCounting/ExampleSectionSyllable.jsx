import React from 'react';

const ExampleSectionSyllable = () => {
  return (
    <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-green-800">
            Syllable Counting Example
          </h3>
          <div className="mt-2 text-sm text-green-700">
            <p>Count the number of syllables (beats) in each word by clapping as you say it.</p>
            <div className="mt-2">
              <strong>Example:</strong>
              <p className="mt-1">How many syllables in "elephant"?</p>
              <ul className="mt-1 ml-4">
                <li>• Say it slowly: "el-e-phant"</li>
                <li>• Clap for each beat: 👏 👏 👏</li>
                <li>• Answer: 3 syllables ✓</li>
              </ul>
              <p className="mt-2 italic">Tip: Put your hand under your chin - it drops with each syllable!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleSectionSyllable;
