import React from 'react';
import DragAndDrop from './DragAndDrop';
import UnifiedExampleSection from '../common/UnifiedExampleSection';
import { useUnifiedExerciseData } from '../../hooks/useUnifiedExerciseData';
import { ExerciseLoadingSpinner } from '../common/LoadingSpinner';

/**
 * Modernized Drag and Drop with Unified Data
 * Uses unified JSON structure for all content including UI text and examples
 */
const ModernDragAndDropWithExample = () => {
  const { data, loading, error } = useUnifiedExerciseData('drag-and-drop');

  if (loading) {
    return <ExerciseLoadingSpinner exerciseType="drag-and-drop" />;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-error-600 bg-error-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Loading Error</h3>
        <p>Failed to load drag and drop exercises. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="bg-white mt-3 sm:bg-white sm:rounded-lg sm:p-8 sm:shadow-lg lg:mx-48">
      <div className="w-auto">
        <UnifiedExampleSection data={data}>
          <DragAndDrop exerciseData={data.exercises} uiText={data.ui} />
        </UnifiedExampleSection>
      </div>
    </div>
  );
};

export default ModernDragAndDropWithExample;
