import React, { useState, useMemo } from 'react';

const SessionSummary = ({ currentSession, progressData, isActive = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  // Calculate current session stats
  const sessionStats = useMemo(() => {
    if (!currentSession && !progressData?.sessionHistory?.length) {
      return {
        exercisesCompleted: 0,
        currentScore: 0,
        timeSpent: 0,
        accuracy: 0,
        questionsAnswered: 0,
        hintsUsed: 0,
        streak: 0
      };
    }

    // If there's an active session, use it; otherwise use the latest session
    const session = currentSession || progressData.sessionHistory[progressData.sessionHistory.length - 1];
    
    return {
      exercisesCompleted: session.exercises?.length || 0,
      currentScore: session.averageScore || 0,
      timeSpent: session.duration || 0,
      accuracy: session.accuracy || 0,
      questionsAnswered: session.questionsAnswered || 0,
      hintsUsed: session.hintsUsed || 0,
      streak: calculateStreak(progressData?.sessionHistory || []),
      status: session.status || (isActive ? 'active' : 'completed'),
      startTime: session.startTime,
      exercises: session.exercises || []
    };
  }, [currentSession, progressData, isActive]);

  // Calculate learning streak
  function calculateStreak(sessions) {
    if (!sessions.length) return 0;
    
    let streak = 0;
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    // Check sessions from most recent
    for (let i = sessions.length - 1; i >= 0; i--) {
      const sessionDate = new Date(sessions[i].startTime);
      const daysDiff = Math.floor((today - sessionDate) / msPerDay);
      
      if (daysDiff === streak) {
        streak++;
      } else if (daysDiff > streak + 1) {
        break; // Gap in streak
      }
    }
    
    return streak;
  }

  // Format time duration
  const formatDuration = (seconds) => {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  };

  // Get session status indicator
  const getStatusIndicator = () => {
    switch (sessionStats.status) {
      case 'active':
        return { color: 'green', icon: '🟢', text: 'Active Session' };
      case 'paused':
        return { color: 'yellow', icon: '⏸️', text: 'Paused' };
      case 'completed':
        return { color: 'blue', icon: '✅', text: 'Completed' };
      default:
        return { color: 'gray', icon: '⚪', text: 'Inactive' };
    }
  };

  const statusInfo = getStatusIndicator();

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Current Session</h3>
        <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
          <span>{statusInfo.icon}</span>
          <span>{statusInfo.text}</span>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {sessionStats.exercisesCompleted}
          </div>
          <div className="text-sm text-blue-800">Exercises</div>
        </div>
        
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {Math.round(sessionStats.currentScore)}%
          </div>
          <div className="text-sm text-green-800">Score</div>
        </div>
        
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 mb-1">
            {formatDuration(Math.floor(sessionStats.timeSpent / 1000))}
          </div>
          <div className="text-sm text-purple-800">Time</div>
        </div>
        
        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {Math.round(sessionStats.accuracy)}%
          </div>
          <div className="text-sm text-orange-800">Accuracy</div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="font-bold text-gray-700">{sessionStats.questionsAnswered}</div>
          <div className="text-gray-600">Questions</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="font-bold text-gray-700">{sessionStats.hintsUsed}</div>
          <div className="text-gray-600">Hints Used</div>
        </div>
        
        <div className="text-center p-3 bg-gray-50 rounded">
          <div className="font-bold text-gray-700">{sessionStats.streak}</div>
          <div className="text-gray-600">Day Streak</div>
        </div>
      </div>

      {/* Session Timeline */}
      {sessionStats.startTime && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Session Timeline</div>
          <div className="text-sm">
            <span className="font-medium">Started:</span> {new Date(sessionStats.startTime).toLocaleString()}
            {sessionStats.status === 'active' && (
              <span className="ml-4 text-green-600">● Live</span>
            )}
          </div>
        </div>
      )}

      {/* Exercise Breakdown Toggle */}
      {sessionStats.exercises.length > 0 && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <span className="font-medium text-gray-700">Exercise Breakdown</span>
            <span className={`transform transition-transform ${showDetails ? 'rotate-180' : ''}`}>
              ⬇️
            </span>
          </button>
          
          {showDetails && (
            <div className="mt-4 space-y-2">
              {sessionStats.exercises.map((exercise, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white border rounded">
                  <div>
                    <div className="font-medium text-gray-800 capitalize">
                      {exercise.type?.replace(/([A-Z])/g, ' $1').trim() || 'Unknown Exercise'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {exercise.difficulty || 'Medium'} • {exercise.timeToComplete ? formatDuration(Math.floor(exercise.timeToComplete / 1000)) : 'No time'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-bold ${
                      exercise.score >= 80 ? 'text-green-600' :
                      exercise.score >= 60 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {Math.round(exercise.score || 0)}%
                    </div>
                    <div className="text-sm text-gray-500">
                      {exercise.score >= 80 ? '🌟' : exercise.score >= 60 ? '👍' : '💪'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Performance Indicators */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-center">
          <div className="text-lg font-bold">{sessionStats.streak} 🔥</div>
          <div className="text-sm opacity-90">Learning Streak</div>
        </div>
        
        <div className={`p-3 rounded-lg text-white text-center ${
          sessionStats.currentScore >= 80 ? 'bg-gradient-to-r from-green-500 to-emerald-600' :
          sessionStats.currentScore >= 60 ? 'bg-gradient-to-r from-yellow-500 to-orange-600' :
          'bg-gradient-to-r from-red-500 to-pink-600'
        }`}>
          <div className="text-lg font-bold">
            {sessionStats.currentScore >= 80 ? 'Excellent' :
             sessionStats.currentScore >= 60 ? 'Good' : 'Needs Work'}
          </div>
          <div className="text-sm opacity-90">Performance</div>
        </div>
      </div>

      {/* Quick Actions */}
      {isActive && (
        <div className="mt-6 flex space-x-2">
          <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            Continue Learning
          </button>
          <button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-medium transition-colors">
            Pause Session
          </button>
        </div>
      )}

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border-l-4 border-indigo-400">
        <p className="text-sm text-indigo-800">
          {sessionStats.streak > 7 ? '🏆 Amazing streak! You\'re on fire!' :
           sessionStats.streak > 3 ? '🎯 Great consistency! Keep it up!' :
           sessionStats.currentScore > 80 ? '⭐ Outstanding performance today!' :
           sessionStats.exercisesCompleted > 0 ? '💪 Good progress! Every step counts!' :
           '🚀 Ready to start your learning journey?'}
        </p>
      </div>
    </div>
  );
};

export default SessionSummary;
