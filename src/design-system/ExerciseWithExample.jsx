/**
 * Standardized Exercise With Example Wrapper
 * Week 2 - Day 8: Component Standardization
 */

import React from 'react';
import { ExerciseContainer } from './ExerciseComponents';

const ExerciseWithExample = ({ 
  children, 
  ExampleComponent,
  exerciseData,
  className = '',
  ...props 
}) => {
  return (
    <div className={`bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48 ${className}`}>
      <div className="w-auto">
        <ExampleComponent data={exerciseData}>
          {children}
        </ExampleComponent>
      </div>
    </div>
  );
};

export default ExerciseWithExample;
