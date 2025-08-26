import React from 'react';
import RhymeExercises from './RhymeExercises';
import ExampleSectionRhyme from './ExampleSectionRhyme';

const RhymeExercisesWithAnExample = ({ exercise, onComplete, onAnswerSubmit }) => {
  return (
    <div className="space-y-6">
      {/* Example Section */}
      <ExampleSectionRhyme />
      
      {/* Main Exercise */}
      <div className="border-t pt-6">
        <RhymeExercises 
          exercise={exercise}
          onComplete={onComplete}
          onAnswerSubmit={onAnswerSubmit}
        />
      </div>
    </div>
  );
};

export default RhymeExercisesWithAnExample;
