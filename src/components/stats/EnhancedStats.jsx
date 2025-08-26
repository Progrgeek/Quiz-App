/**
 * Enhanced Stats Component with QuizEngine Integration
 * Real-time statistics display powered by the new QuizEngine
 */

import React, { useState, useEffect } from 'react';
import { useQuizTimer, useQuizScore } from '../../hooks/useQuizEngine';
import { useQuizStore } from '../../store/quizStore';

const EnhancedStats = ({ 
  showDetailed = false,
  showChart = false,
  className = "",
  position = "top" // "top", "sidebar", "bottom"
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Get timer data
  const {
    globalTime,
    questionTime,
    globalTimeFormatted,
    questionTimeFormatted,
    isRunning,
    isPaused
  } = useQuizTimer();
  
  // Get score data
  const {
    currentScore,
    maxPossibleScore,
    percentage,
    streak,
    longestStreak
  } = useQuizScore();
  
  // Get quiz progress
  const {
    currentQuestionIndex,
    totalQuestions,
    completedQuestions,
    skippedQuestions,
    answers,
    hintsUsed
  } = useQuizStore();
  
  // Calculate additional stats
  const answeredQuestions = answers.size;
  const correctAnswers = Array.from(answers.values())
    .filter(answer => answer.validation?.isCorrect).length;
  const accuracy = answeredQuestions > 0 ? 
    Math.round((correctAnswers / answeredQuestions) * 100) : 0;
  const progressPercentage = totalQuestions > 0 ? 
    Math.round((answeredQuestions / totalQuestions) * 100) : 0;
  const averageTimePerQuestion = answeredQuestions > 0 ?
    Math.round(globalTime / answeredQuestions / 1000) : 0;
  
  // Performance indicators
  const getPerformanceLevel = () => {
    if (accuracy >= 90) return { level: 'Excellent', color: 'text-green-600', icon: '🌟' };
    if (accuracy >= 80) return { level: 'Very Good', color: 'text-blue-600', icon: '👍' };
    if (accuracy >= 70) return { level: 'Good', color: 'text-yellow-600', icon: '👌' };
    if (accuracy >= 60) return { level: 'Fair', color: 'text-orange-600', icon: '📈' };
    return { level: 'Needs Work', color: 'text-red-600', icon: '💪' };
  };
  
  const performance = getPerformanceLevel();
  
  // Compact view for sidebar/top positions
  const CompactStats = () => (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Progress */}
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{progressPercentage}%</div>
          <div className="text-sm text-gray-600">Progress</div>
          <div className="text-xs text-gray-500">
            {answeredQuestions}/{totalQuestions}
          </div>
        </div>
        
        {/* Score */}
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{currentScore}</div>
          <div className="text-sm text-gray-600">Score</div>
          {maxPossibleScore > 0 && (
            <div className="text-xs text-gray-500">
              of {maxPossibleScore}
            </div>
          )}
        </div>
        
        {/* Accuracy */}
        <div className="text-center">
          <div className={`text-2xl font-bold ${performance.color}`}>
            {accuracy}%
          </div>
          <div className="text-sm text-gray-600">Accuracy</div>
          <div className="text-xs text-gray-500">
            {correctAnswers} correct
          </div>
        </div>
        
        {/* Time */}
        <div className="text-center">
          <div className={`text-lg font-mono ${isPaused ? 'text-yellow-600' : 'text-green-600'}`}>
            {globalTimeFormatted}
          </div>
          <div className="text-sm text-gray-600">Time</div>
          <div className="text-xs text-gray-500">
            {averageTimePerQuestion}s avg
          </div>
        </div>
      </div>
      
      {/* Expand button for detailed view */}
      {showDetailed && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="mt-2 w-full text-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          {isExpanded ? '▲ Less' : '▼ More Details'}
        </button>
      )}
    </div>
  );
  
  // Detailed view
  const DetailedStats = () => (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Exercise Statistics</h3>
        <div className="flex items-center space-x-2">
          <span className={performance.color}>{performance.icon}</span>
          <span className={`text-sm font-medium ${performance.color}`}>
            {performance.level}
          </span>
        </div>
      </div>
      
      {/* Main stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Progress section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Progress</h4>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-sm font-medium">{answeredQuestions}/{totalQuestions}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-medium text-green-700">{correctAnswers}</div>
              <div className="text-green-600">Correct</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded">
              <div className="font-medium text-red-700">{answeredQuestions - correctAnswers}</div>
              <div className="text-red-600">Incorrect</div>
            </div>
          </div>
          
          {skippedQuestions.size > 0 && (
            <div className="text-center p-2 bg-yellow-50 rounded text-sm">
              <div className="font-medium text-yellow-700">{skippedQuestions.size}</div>
              <div className="text-yellow-600">Skipped</div>
            </div>
          )}
        </div>
        
        {/* Performance section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Performance</h4>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Accuracy</span>
              <span className={`text-sm font-medium ${performance.color}`}>
                {accuracy}%
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Streak</span>
              <span className="text-sm font-medium text-orange-600">
                {streak > 0 ? `🔥 ${streak}` : '-'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Best Streak</span>
              <span className="text-sm font-medium text-orange-700">
                {longestStreak > 0 ? `⭐ ${longestStreak}` : '-'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Hints Used</span>
              <span className="text-sm font-medium text-blue-600">
                {hintsUsed > 0 ? `💡 ${hintsUsed}` : '-'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Timing section */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-700">Timing</h4>
          
          <div className="space-y-3">
            <div className="text-center p-3 bg-blue-50 rounded">
              <div className={`text-xl font-mono ${isPaused ? 'text-yellow-600' : 'text-blue-600'}`}>
                {globalTimeFormatted}
              </div>
              <div className="text-sm text-blue-600">Total Time</div>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Current Question</span>
              <span className="text-sm font-mono text-green-600">
                {questionTimeFormatted}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Average/Question</span>
              <span className="text-sm font-medium">
                {averageTimePerQuestion}s
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-sm text-gray-600">Status</span>
              <span className={`text-sm font-medium ${
                isPaused ? 'text-yellow-600' : isRunning ? 'text-green-600' : 'text-red-600'
              }`}>
                {isPaused ? '⏸️ Paused' : isRunning ? '▶️ Running' : '⏹️ Stopped'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Score breakdown */}
      <div className="border-t pt-4">
        <h4 className="font-medium text-gray-700 mb-3">Score Breakdown</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded">
            <div className="text-lg font-bold text-purple-600">{currentScore}</div>
            <div className="text-sm text-purple-600">Current Score</div>
          </div>
          
          {maxPossibleScore > 0 && (
            <div className="text-center p-3 bg-gray-50 rounded">
              <div className="text-lg font-bold text-gray-600">{maxPossibleScore}</div>
              <div className="text-sm text-gray-600">Max Possible</div>
            </div>
          )}
          
          <div className="text-center p-3 bg-green-50 rounded">
            <div className="text-lg font-bold text-green-600">{percentage}%</div>
            <div className="text-sm text-green-600">Score %</div>
          </div>
          
          <div className="text-center p-3 bg-blue-50 rounded">
            <div className="text-lg font-bold text-blue-600">
              {totalQuestions > 0 ? Math.round((currentScore / totalQuestions)) : 0}
            </div>
            <div className="text-sm text-blue-600">Avg/Question</div>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Render based on position and detail level
  return (
    <div className={`enhanced-stats ${className}`}>
      {isExpanded || showDetailed ? <DetailedStats /> : <CompactStats />}
    </div>
  );
};

export default EnhancedStats;
