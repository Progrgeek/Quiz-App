/**
 * Enhanced NavBar with QuizEngine Integration
 * Updated NavBar component that works with the new QuizEngine system
 */

import React from 'react';
import { useQuizTimer, useQuizScore } from '../../hooks/useQuizEngine';
import { useQuizStore } from '../../store/quizStore';

const EnhancedNavBar = ({ 
  exercise, 
  onPause, 
  onEnd, 
  onSettings,
  showTimer = true,
  showScore = true,
  showProgress = true 
}) => {
  // Get timer state
  const {
    globalTimeFormatted,
    questionTimeFormatted,
    isRunning,
    isPaused
  } = useQuizTimer();
  
  // Get score state
  const {
    currentScore,
    percentage,
    streak,
    longestStreak
  } = useQuizScore();
  
  // Get quiz state
  const {
    currentQuestionIndex,
    totalQuestions,
    isSessionActive,
    config
  } = useQuizStore();
  
  const progress = totalQuestions > 0 ? 
    ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;
  
  const handlePause = () => {
    if (onPause) {
      onPause();
    }
  };
  
  const handleEnd = () => {
    if (onEnd) {
      onEnd();
    }
  };
  
  return (
    <nav className="bg-white shadow-md border-b-2 border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left section - Exercise info */}
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                {exercise?.title || 'Quiz Exercise'}
              </h1>
              {exercise?.category && (
                <p className="text-sm text-gray-500">{exercise.category}</p>
              )}
            </div>
            
            {/* Progress indicator */}
            {showProgress && (
              <div className="hidden md:flex items-center space-x-2">
                <span className="text-sm text-gray-600">Progress:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </span>
              </div>
            )}
          </div>
          
          {/* Center section - Status indicators */}
          <div className="flex items-center space-x-6">
            {/* Timer */}
            {showTimer && (
              <div className="flex items-center space-x-2">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Total Time</div>
                  <div className={`text-lg font-mono ${
                    isPaused ? 'text-yellow-600' : 'text-blue-600'
                  }`}>
                    {globalTimeFormatted}
                  </div>
                </div>
                
                {config.questionTimeLimit && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Question Time</div>
                    <div className={`text-lg font-mono ${
                      isPaused ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {questionTimeFormatted}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {/* Score */}
            {showScore && (
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-sm text-gray-500">Score</div>
                  <div className="text-lg font-bold text-purple-600">
                    {currentScore}
                  </div>
                </div>
                
                {percentage > 0 && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Accuracy</div>
                    <div className="text-lg font-bold text-green-600">
                      {percentage}%
                    </div>
                  </div>
                )}
                
                {streak > 0 && (
                  <div className="text-center">
                    <div className="text-sm text-gray-500">Streak</div>
                    <div className="text-lg font-bold text-orange-600">
                      🔥 {streak}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Right section - Controls */}
          <div className="flex items-center space-x-2">
            {/* Session status */}
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${
                isSessionActive ? (isPaused ? 'bg-yellow-400' : 'bg-green-400') : 'bg-red-400'
              }`}></div>
              <span className="text-sm text-gray-600">
                {isPaused ? 'Paused' : isSessionActive ? 'Active' : 'Stopped'}
              </span>
            </div>
            
            {/* Control buttons */}
            {isSessionActive && (
              <>
                <button
                  onClick={handlePause}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isPaused 
                      ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                  }`}
                >
                  {isPaused ? '▶️ Resume' : '⏸️ Pause'}
                </button>
                
                <button
                  onClick={handleEnd}
                  className="px-3 py-2 bg-red-100 text-red-700 rounded-md text-sm font-medium hover:bg-red-200 transition-colors"
                >
                  🏁 End
                </button>
              </>
            )}
            
            {/* Settings button */}
            {onSettings && (
              <button
                onClick={onSettings}
                className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                ⚙️ Settings
              </button>
            )}
          </div>
        </div>
        
        {/* Mobile progress bar */}
        {showProgress && (
          <div className="md:hidden pb-2">
            <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
              <span>Question {currentQuestionIndex + 1} of {totalQuestions}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default EnhancedNavBar;
