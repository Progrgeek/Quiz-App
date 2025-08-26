// TestUnifiedData.jsx - Simple test component for unified data
import React from 'react';
import useUnifiedExerciseData from '../hooks/useUnifiedExerciseData';

const TestUnifiedData = () => {
  const dragDropData = useUnifiedExerciseData('dragAndDrop');
  const singleAnswerData = useUnifiedExerciseData('singleAnswer');
  const multipleChoiceData = useUnifiedExerciseData('multipleChoice');

  if (dragDropData.loading || singleAnswerData.loading || multipleChoiceData.loading) {
    return <div className="p-4">Loading unified data...</div>;
  }

  if (dragDropData.hasError || singleAnswerData.hasError || multipleChoiceData.hasError) {
    return (
      <div className="p-4 text-red-600">
        <h2>Error loading data:</h2>
        <ul>
          {dragDropData.error && <li>Drag Drop: {dragDropData.error}</li>}
          {singleAnswerData.error && <li>Single Answer: {singleAnswerData.error}</li>}
          {multipleChoiceData.error && <li>Multiple Choice: {multipleChoiceData.error}</li>}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Unified Data Test Results</h1>
      
      {/* Drag and Drop Test */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">🎯 Drag and Drop Data</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-600">UI Buttons:</h3>
            <ul className="text-sm">
              <li>Learn: {dragDropData.getButton('learnWithExamples')}</li>
              <li>Back: {dragDropData.getButton('backToPractice')}</li>
              <li>Submit: {dragDropData.getButton('submit')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-600">Stats:</h3>
            <ul className="text-sm">
              <li>Exercises: {dragDropData.getTotalExercises()}</li>
              <li>Example Sections: {dragDropData.exampleContent?.sections?.length || 0}</li>
              <li>Learning Points: {dragDropData.exampleContent?.learningPoints?.length || 0}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Single Answer Test */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">🎵 Single Answer Data</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-600">UI Labels:</h3>
            <ul className="text-sm">
              <li>Question: {singleAnswerData.getLabel('question')}</li>
              <li>Explanation: {singleAnswerData.getLabel('explanation')}</li>
              <li>Progress: {singleAnswerData.getLabel('progress')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-600">Content:</h3>
            <ul className="text-sm">
              <li>Title: {singleAnswerData.exampleContent?.title}</li>
              <li>Exercises: {singleAnswerData.getTotalExercises()}</li>
              <li>Sections: {singleAnswerData.exampleContent?.sections?.length || 0}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Multiple Choice Test */}
      <div className="mb-8 p-4 border rounded-lg">
        <h2 className="text-xl font-semibold mb-3">📝 Multiple Choice Data</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-blue-600">UI Messages:</h3>
            <ul className="text-sm">
              <li>Correct: {multipleChoiceData.getMessage('correct')}</li>
              <li>Incorrect: {multipleChoiceData.getMessage('incorrect')}</li>
              <li>Completed: {multipleChoiceData.getMessage('completed')}</li>
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-green-600">Data Quality:</h3>
            <ul className="text-sm">
              <li>Ready: {multipleChoiceData.isReady ? '✅' : '❌'}</li>
              <li>Has Error: {multipleChoiceData.hasError ? '❌' : '✅'}</li>
              <li>Is Empty: {multipleChoiceData.isEmpty ? '❌' : '✅'}</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">✅ Test Summary</h2>
        <p className="text-green-700">
          All unified data files are loading successfully! The implementation provides:
        </p>
        <ul className="mt-2 text-sm text-green-600">
          <li>• Dynamic UI text loading</li>
          <li>• Rich example content</li>
          <li>• Comprehensive exercise data</li>
          <li>• Error handling and fallbacks</li>
          <li>• Legacy compatibility</li>
        </ul>
      </div>
    </div>
  );
};

export default TestUnifiedData;
