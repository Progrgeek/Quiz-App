import React from 'react';
import SyllableCounting from './SyllableCounting';
import ExampleSectionSyllable from './ExampleSectionSyllable';

const SyllableCountingWithAnExample = ({ exercise, onComplete, onAnswerSubmit }) => {
  return (
    <div className="space-y-6">
      {/* Example Section */}
      <ExampleSectionSyllable />
      
      {/* Main Exercise */}
      <div className="border-t pt-6">
        <SyllableCounting 
          exercise={exercise}
          onComplete={onComplete}
          onAnswerSubmit={onAnswerSubmit}
        />
      </div>
    </div>
  );
};

export default SyllableCountingWithAnExample;
