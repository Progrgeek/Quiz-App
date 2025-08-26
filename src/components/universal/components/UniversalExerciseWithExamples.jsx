import React from 'react';
import UniversalExampleSection from './UniversalExampleSection';
import { UniversalExercise } from './UniversalExercise';

/**
 * Universal Exercise with Examples
 * 
 * This component provides the complete exercise experience including:
 * - "Learn with Examples" section with educational content
 * - Main exercise with preserved exact functionality
 * - Feedback and results
 * 
 * Usage:
 * <UniversalExerciseWithExamples
 *   exerciseData={yourData}
 *   exerciseType="multipleAnswers"
 *   exampleData={customExamples} // Optional
 * />
 */
export const UniversalExerciseWithExamples = ({
  exerciseData,
  exerciseType,
  exampleData,
  onComplete,
  onError,
  className = '',
  preserveOriginalUI = true,
  learnWithExamplesText = "Learn with Examples",
  backToPracticeText = "Back to Practice",
  ...props
}) => {
  return (
    <UniversalExampleSection
      exerciseType={exerciseType}
      exampleData={exampleData}
      learnWithExamplesText={learnWithExamplesText}
      backToPracticeText={backToPracticeText}
    >
      <UniversalExercise
        exerciseData={exerciseData}
        exerciseType={exerciseType}
        preserveOriginalUI={preserveOriginalUI}
        onComplete={onComplete}
        onError={onError}
        className={className}
        {...props}
      />
    </UniversalExampleSection>
  );
};

export default UniversalExerciseWithExamples;
