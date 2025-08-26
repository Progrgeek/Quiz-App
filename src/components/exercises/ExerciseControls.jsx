/**
 * Exercise Controls Component
 * Provides navigation and control buttons for exercises
 */

import React from 'react';

const ExerciseControls = ({ 
  engine,
  onNext,
  onPrevious,
  onPause,
  onResume,
  onComplete,
  config = {}
}) => {
  const canGoNext = engine?.hasNextQuestion() || false;
  const canGoPrevious = engine?.hasPreviousQuestion() || false;
  const isPaused = engine?.isPaused() || false;
  const isCompleted = engine?.isCompleted() || false;
  const progress = engine?.getProgress() || { current: 0, total: 0 };

  const handlePauseResume = () => {
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
  };

  const handleComplete = () => {
    const results = engine?.getFinalResults();
    onComplete?.(results);
  };

  if (isCompleted) {
    return (
      <div className="exercise-controls bg-white rounded-lg shadow-sm border p-4">
        <div className="text-center">
          <div className="text-4xl mb-3">🎉</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercise Completed!</h3>
          <p className="text-gray-600 mb-4">
            Great job! You've finished all {progress.total} questions.
          </p>
          <button
            onClick={handleComplete}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            View Results
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exercise-controls bg-white rounded-lg shadow-sm border p-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left side - Previous button */}
        <div className="flex items-center">
          {config.showPreviousButton !== false && (
            <button
              onClick={onPrevious}
              disabled={!canGoPrevious}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                canGoPrevious
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              <span className="mr-2">←</span>
              Previous
            </button>
          )}
        </div>

        {/* Center - Pause/Resume and Progress info */}
        <div className="flex items-center gap-4">
          {config.showPauseButton !== false && (
            <button
              onClick={handlePauseResume}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                isPaused
                  ? 'bg-green-100 text-green-700 hover:bg-green-200'
                  : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
              }`}
            >
              <span className="mr-2">{isPaused ? '▶️' : '⏸️'}</span>
              {isPaused ? 'Resume' : 'Pause'}
            </button>
          )}

          {config.showProgressInfo !== false && (
            <div className="text-sm text-gray-600 text-center">
              <p>Question {progress.current} of {progress.total}</p>
              {progress.completed && (
                <p className="text-xs text-green-600">
                  {progress.completed} completed
                </p>
              )}
            </div>
          )}
        </div>

        {/* Right side - Next button */}
        <div className="flex items-center">
          {config.showNextButton !== false && (
            <button
              onClick={onNext}
              disabled={!canGoNext}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                canGoNext
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-50 text-gray-400 cursor-not-allowed'
              }`}
            >
              Next
              <span className="ml-2">→</span>
            </button>
          )}
        </div>
      </div>

      {/* Additional controls row */}
      {(config.showHelpButton || config.showResetButton || config.showBookmarkButton) && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex justify-center gap-2">
            
            {config.showHelpButton && (
              <button
                onClick={() => engine?.showHelp?.()}
                className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
              >
                💡 Help
              </button>
            )}

            {config.showBookmarkButton && (
              <button
                onClick={() => engine?.bookmarkQuestion?.()}
                className="px-3 py-1 text-sm bg-orange-100 text-orange-700 rounded-md hover:bg-orange-200 transition-colors"
              >
                🔖 Bookmark
              </button>
            )}

            {config.showResetButton && (
              <button
                onClick={() => engine?.reset?.()}
                className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
              >
                🔄 Reset
              </button>
            )}
          </div>
        </div>
      )}

      {/* Debug info (only in development) */}
      {import.meta.env.MODE === 'development' && config.showDebugInfo && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <details className="text-xs text-gray-500">
            <summary className="cursor-pointer hover:text-gray-700">Debug Info</summary>
            <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-auto">
              {JSON.stringify({
                canGoNext,
                canGoPrevious,
                isPaused,
                isCompleted,
                progress,
                engineState: engine?.getState?.()
              }, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
};

export default ExerciseControls;
