/**
 * Enhanced Exercise Controls Component
 * Implements Day 15 advanced features: pause/resume, hints, bookmarks, auto-save
 */

import React, { useState } from 'react';
import { useAdvancedQuizEngine, useHints, useBookmarks, usePauseResume, useAutoSave } from '../../hooks/useQuizEngine';

const AdvancedExerciseControls = ({ engine, className = '' }) => {
  const [showHintDialog, setShowHintDialog] = useState(false);
  const [hintLevel, setHintLevel] = useState(1);
  
  // Advanced features hooks
  const hints = useHints(engine);
  const bookmarks = useBookmarks(engine);
  const pauseResume = usePauseResume(engine);
  const autoSave = useAutoSave(engine);

  const handleHintRequest = () => {
    const hint = hints.getHint(hintLevel);
    if (hint) {
      setShowHintDialog(true);
      if (hintLevel < 3) {
        setHintLevel(prev => prev + 1);
      }
    }
  };

  const handleBookmarkToggle = () => {
    bookmarks.bookmarkQuestion();
  };

  const handlePauseToggle = () => {
    if (pauseResume.isPaused) {
      pauseResume.resume();
    } else {
      pauseResume.pause();
    }
  };

  if (!engine) {
    return (
      <div className={`bg-gray-100 p-4 rounded-lg ${className}`}>
        <p className="text-gray-500 text-center">Loading exercise controls...</p>
      </div>
    );
  }

  return (
    <div className={`bg-white border rounded-lg shadow-sm p-4 ${className}`}>
      {/* Main Controls Row */}
      <div className="flex items-center justify-between mb-4">
        {/* Left Controls */}
        <div className="flex items-center space-x-2">
          {/* Pause/Resume Button */}
          <button
            onClick={handlePauseToggle}
            disabled={!pauseResume.canPause && !pauseResume.canResume}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              pauseResume.isPaused
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            } disabled:bg-gray-300 disabled:cursor-not-allowed`}
          >
            {pauseResume.isPaused ? (
              <>
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                Resume
              </>
            ) : (
              <>
                <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Pause
              </>
            )}
          </button>

          {/* Hint Button */}
          <button
            onClick={handleHintRequest}
            disabled={hints.available === 0}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              hints.available > 0
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            title={`${hints.available} hints remaining`}
          >
            💡 Hint ({hints.available})
          </button>

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkToggle}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              bookmarks.currentIsBookmarked
                ? 'bg-amber-500 text-white hover:bg-amber-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            title={bookmarks.currentIsBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
          >
            {bookmarks.currentIsBookmarked ? '🔖 Bookmarked' : '📑 Bookmark'}
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-2">
          {/* Auto-save Status */}
          {autoSave.enabled && (
            <div className="flex items-center text-sm text-gray-600">
              <div className={`w-2 h-2 rounded-full mr-2 ${
                autoSave.saving ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
              }`} />
              {autoSave.saving ? 'Saving...' : 'Auto-saved'}
              {autoSave.lastSave && (
                <span className="ml-1">
                  {new Date(autoSave.lastSave).toLocaleTimeString()}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Status Information Row */}
      <div className="flex items-center justify-between text-sm text-gray-600 pt-3 border-t">
        {/* Left Status */}
        <div className="flex items-center space-x-4">
          <span>Hints used: {hints.totalUsed}</span>
          <span>Bookmarks: {bookmarks.totalBookmarks}</span>
          {pauseResume.totalPausedTime > 0 && (
            <span>Paused time: {Math.round(pauseResume.totalPausedTime / 1000)}s</span>
          )}
        </div>

        {/* Right Status */}
        <div className="flex items-center space-x-4">
          {pauseResume.isPaused && (
            <span className="text-yellow-600 font-medium">⏸️ Exercise Paused</span>
          )}
        </div>
      </div>

      {/* Hint Dialog */}
      {showHintDialog && hints.current && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                💡 Hint {hints.current.level}
              </h3>
              <button
                onClick={() => setShowHintDialog(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-gray-700">{hints.current.hint}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">
                {hints.available} hints remaining
              </span>
              <button
                onClick={() => setShowHintDialog(false)}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedExerciseControls;
