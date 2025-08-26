import React from 'react';
import { useTheme } from '../../design-system/ThemeSystem';

/**
 * Exercise-specific loading spinner with type-aware messaging
 * Provides visual feedback during lazy loading of exercise components
 */
export const ExerciseLoadingSpinner = ({ exerciseType = 'exercise' }) => {
  const { theme } = useTheme();
  
  // Exercise type display names for better UX
  const exerciseDisplayNames = {
    'multiple-choice': 'Multiple Choice',
    'fill-in-the-blanks': 'Fill in the Blanks',
    'drag-and-drop': 'Drag and Drop',
    'highlight': 'Highlight Text',
    'gap-fill': 'Gap Fill',
    'click-to-change': 'Click to Change',
    'multiple-answers': 'Multiple Answers',
    'single-answer': 'Single Answer',
    'sequencing': 'Sequencing',
    'syllable-counting': 'Syllable Counting',
    'rhyme-exercises': 'Rhyme Exercises',
    'table-exercise': 'Table Exercise'
  };

  const displayName = exerciseDisplayNames[exerciseType] || 'Exercise';

  return (
    <div className="flex flex-col items-center justify-center min-h-48 p-8 text-center">
      {/* Animated loading spinner */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute top-0 left-0 w-full h-full border-4 border-neutral-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
      
      {/* Loading text */}
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">
        Loading {displayName}
      </h3>
      
      {/* Subtitle */}
      <p className="text-sm text-neutral-500 max-w-xs">
        Preparing your interactive exercise...
      </p>
      
      {/* Progress dots animation */}
      <div className="flex space-x-1 mt-4">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-primary-400 rounded-full animate-pulse"
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: '1s'
            }}
          ></div>
        ))}
      </div>
    </div>
  );
};

/**
 * Minimal loading spinner for smaller UI elements
 */
export const MiniLoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <div className="w-full h-full border-2 border-neutral-200 rounded-full"></div>
      <div className="absolute top-0 left-0 w-full h-full border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
};

/**
 * Skeleton loader for exercise content
 */
export const ExerciseSkeleton = () => {
  return (
    <div className="animate-pulse space-y-4 p-6">
      {/* Question skeleton */}
      <div className="space-y-3">
        <div className="h-6 bg-neutral-200 rounded w-3/4"></div>
        <div className="h-4 bg-neutral-200 rounded w-1/2"></div>
      </div>
      
      {/* Options skeleton */}
      <div className="space-y-3 mt-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center space-x-3">
            <div className="w-4 h-4 bg-neutral-200 rounded"></div>
            <div className="h-4 bg-neutral-200 rounded flex-1"></div>
          </div>
        ))}
      </div>
      
      {/* Button skeleton */}
      <div className="mt-6">
        <div className="h-10 bg-neutral-200 rounded w-32"></div>
      </div>
    </div>
  );
};

export default ExerciseLoadingSpinner;
