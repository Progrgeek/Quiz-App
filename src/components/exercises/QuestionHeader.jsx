/**
 * Question Header Component
 * Displays question information, progress, timer, and score
 */

import React from 'react';

const QuestionHeader = ({ 
  question, 
  progress, 
  timer, 
  score,
  showScore = true,
  showTimer = true,
  showProgress = true
}) => {
  const formatTime = (milliseconds) => {
    if (!milliseconds) return '00:00';
    
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!progress || !progress.total) return 0;
    return Math.round((progress.current / progress.total) * 100);
  };

  const getTimerColor = () => {
    if (!timer || !timer.timeRemaining) return 'text-gray-600';
    
    const remaining = timer.timeRemaining;
    if (remaining < 30000) return 'text-red-600'; // Less than 30 seconds
    if (remaining < 60000) return 'text-yellow-600'; // Less than 1 minute
    return 'text-green-600';
  };

  return (
    <div className="question-header bg-white rounded-lg shadow-sm border p-4 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        
        {/* Question Info */}
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {question?.type && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {question.type.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
            )}
            
            {question?.difficulty && (
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                question.difficulty === 'hard' ? 'bg-red-100 text-red-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {question.difficulty}
              </span>
            )}
          </div>
          
          {question?.category && (
            <p className="text-sm text-gray-600">
              Category: {question.category}
            </p>
          )}
        </div>

        {/* Progress, Timer, and Score */}
        <div className="flex items-center gap-6">
          
          {/* Progress */}
          {showProgress && progress && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Progress:</span>
              <div className="flex items-center gap-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 min-w-0">
                  {progress.current}/{progress.total}
                </span>
              </div>
            </div>
          )}

          {/* Timer */}
          {showTimer && timer && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Time:</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">⏱️</span>
                <span className={`text-sm font-mono ${getTimerColor()}`}>
                  {timer.timeRemaining ? formatTime(timer.timeRemaining) : formatTime(timer.elapsed)}
                </span>
              </div>
            </div>
          )}

          {/* Score */}
          {showScore && score !== undefined && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Score:</span>
              <div className="flex items-center gap-1">
                <span className="text-lg">🏆</span>
                <span className="text-sm font-semibold text-blue-600">
                  {typeof score === 'object' ? score.current : score}
                  {typeof score === 'object' && score.total && `/${score.total}`}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Question-specific metadata */}
      {question && (question.tags || question.estimatedTime) && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
            
            {question.estimatedTime && (
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>Est. Time: {question.estimatedTime}s</span>
              </div>
            )}
            
            {question.tags && question.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <span>🏷️</span>
                <span>Tags: {question.tags.join(', ')}</span>
              </div>
            )}
            
            {question.points && (
              <div className="flex items-center gap-1">
                <span>⭐</span>
                <span>Worth: {question.points} points</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionHeader;
