/**
 * Exercise Integration Adapters
 * Adapters to make existing exercise components work with the new QuizEngine
 */

import React, { forwardRef, useImperativeHandle } from 'react';

// Base adapter for all exercise types
export const createExerciseAdapter = (OriginalComponent, exerciseType) => {
  const AdaptedComponent = forwardRef((props, ref) => {
    const {
      question,
      onAnswer,
      onNext,
      onPrevious,
      onHint,
      onSkip,
      currentAnswer,
      canGoNext,
      canGoPrevious,
      progress,
      score,
      showFeedback,
      isSessionActive,
      ...originalProps
    } = props;
    
    // Expose methods to parent components
    useImperativeHandle(ref, () => ({
      submitAnswer: onAnswer,
      nextQuestion: onNext,
      previousQuestion: onPrevious,
      getHint: onHint,
      skipQuestion: onSkip,
      getCurrentAnswer: () => currentAnswer,
      getProgress: () => progress,
      getScore: () => score
    }));
    
    // Transform new engine props to match original component interface
    const adaptedProps = {
      ...originalProps,
      // Map common props
      exercise: { type: exerciseType, questions: [question] },
      currentQuestionIndex: 0,
      totalQuestions: 1,
      
      // Map state props
      currentAnswer,
      showFeedback,
      isActive: isSessionActive,
      
      // Map callback props
      onSubmitAnswer: onAnswer,
      onNextQuestion: onNext,
      onPreviousQuestion: onPrevious,
      onRequestHint: onHint,
      onSkipQuestion: onSkip,
      
      // Map progress props
      progress: progress?.percentage || 0,
      score: score?.current || 0,
      streak: score?.streak || 0,
      
      // Map navigation props
      canMoveNext: canGoNext,
      canMovePrevious: canGoPrevious
    };
    
    return <OriginalComponent {...adaptedProps} />;
  });
  
  AdaptedComponent.displayName = `Adapted${OriginalComponent.displayName || OriginalComponent.name}`;
  
  return AdaptedComponent;
};

// Specific adapters for each exercise type

export const MultipleChoiceAdapter = createExerciseAdapter(
  // Assuming we import the original component
  null, // Will be replaced with actual import
  'multipleChoice'
);

export const FillInTheBlanksAdapter = createExerciseAdapter(
  null,
  'fillInTheBlanks'
);

export const DragAndDropAdapter = createExerciseAdapter(
  null,
  'dragAndDrop'
);

export const SequencingAdapter = createExerciseAdapter(
  null,
  'sequencing'
);

export const HighlightAdapter = createExerciseAdapter(
  null,
  'highlight'
);

export const GapFillAdapter = createExerciseAdapter(
  null,
  'gapFill'
);

export const TableExerciseAdapter = createExerciseAdapter(
  null,
  'tableExercise'
);

export const SingleAnswerAdapter = createExerciseAdapter(
  null,
  'singleAnswer'
);

export const MultipleAnswersAdapter = createExerciseAdapter(
  null,
  'multipleAnswers'
);

export const ClickToChangeAdapter = createExerciseAdapter(
  null,
  'clickToChange'
);

export const RhymeExerciseAdapter = createExerciseAdapter(
  null,
  'rhymeExercise'
);

export const SyllableCountingAdapter = createExerciseAdapter(
  null,
  'syllableCounting'
);

// Higher-order component for automatic adaptation
export const withQuizEngine = (OriginalComponent, exerciseType) => {
  return createExerciseAdapter(OriginalComponent, exerciseType);
};

// Hook for easy component adaptation
export const useExerciseAdapter = (exerciseType) => {
  return (OriginalComponent) => createExerciseAdapter(OriginalComponent, exerciseType);
};

export default {
  createExerciseAdapter,
  withQuizEngine,
  useExerciseAdapter,
  MultipleChoiceAdapter,
  FillInTheBlanksAdapter,
  DragAndDropAdapter,
  SequencingAdapter,
  HighlightAdapter,
  GapFillAdapter,
  TableExerciseAdapter,
  SingleAnswerAdapter,
  MultipleAnswersAdapter,
  ClickToChangeAdapter,
  RhymeExerciseAdapter,
  SyllableCountingAdapter
};
