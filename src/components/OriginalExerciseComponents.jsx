import React, { useState } from 'react';

// Import all backend-integrated exercise components
import MultipleAnswerWithBackend from './multipleAnswers/MultipleAnswersWithBackend';
import MultipleChoiceWithBackend from './multipleChoice/MultipleChoiceWithBackend';
import SingleAnswerWithBackend from './singleAnswer/SingleAnswerWithBackend';
import ClickToChangeWithBackend from './clickToChange/ClickToChangeWithBackend';
import DragAndDropWithBackend from './dragAndDrop/DragAndDropWithBackend';
import FillInTheBlanksWithBackend from './fillInTheBlanks/FillInTheBlanksWithBackend';
import GapFillWithBackend from './gapFill/GapFillWithBackend';
import HighlightWithBackend from './highlight/HighlightWithBackend';
import SequencingWithBackend from './sequencing/SequencingWithBackend';
import SyllableCountingWithBackend from './syllableCounting/SyllableCountingWithBackend';
import TableExerciseWithBackend from './tableExercise/TableExerciseWithBackend';
import RhymeExerciseWithBackend from './rhymeExercises/RhymeExercisesWithBackend';

/**
 * Backend-Integrated Exercise Components
 * 
 * This component uses the backend-integrated versions with AI, Analytics, and Gamification
 */
const OriginalExerciseComponents = () => {
  const [currentExercise, setCurrentExercise] = useState('multipleAnswers');

  const exercises = [
    { id: 'multipleAnswers', name: 'Multiple Answers', component: MultipleAnswerWithBackend },
    { id: 'multipleChoice', name: 'Multiple Choice', component: MultipleChoiceWithBackend },
    { id: 'singleAnswer', name: 'Single Answer', component: SingleAnswerWithBackend },
    { id: 'clickToChange', name: 'Click to Change', component: ClickToChangeWithBackend },
    { id: 'dragAndDrop', name: 'Drag and Drop', component: DragAndDropWithBackend },
    { id: 'fillInTheBlanks', name: 'Fill in the Blanks', component: FillInTheBlanksWithBackend },
    { id: 'gapFill', name: 'Gap Fill', component: GapFillWithBackend },
    { id: 'highlight', name: 'Highlight', component: HighlightWithBackend },
    { id: 'sequencing', name: 'Sequencing', component: SequencingWithBackend },
    { id: 'syllableCounting', name: 'Syllable Counting', component: SyllableCountingWithBackend },
    { id: 'tableExercise', name: 'Table Exercise', component: TableExerciseWithBackend },
    { id: 'rhymeExercise', name: 'Rhyme Exercise', component: RhymeExerciseWithBackend }
  ];

  const CurrentComponent = exercises.find(ex => ex.id === currentExercise)?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Exercise Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            🚀 AI-Enhanced Quiz App 
            <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full ml-3">
              Backend Integrated
            </span>
          </h1>
          <div className="flex flex-wrap gap-2">
            {exercises.map((exercise) => (
              <button
                key={exercise.id}
                onClick={() => setCurrentExercise(exercise.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentExercise === exercise.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {exercise.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Current Exercise */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-2">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              {exercises.find(ex => ex.id === currentExercise)?.name}
            </h2>
            {CurrentComponent && (
              <CurrentComponent 
                enableBackendIntegration={true}
                exerciseConfig={{
                  difficulty: 'medium',
                  enableAI: true,
                  enableAnalytics: true,
                  enableGamification: true
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OriginalExerciseComponents;
