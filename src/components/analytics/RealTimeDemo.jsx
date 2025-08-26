import React, { useState, useEffect, useRef } from 'react';
import { realTimeAnalytics } from '../../analytics/realtime/RealTimeAnalytics.js';
import PerformanceMonitor from './PerformanceMonitor';

const RealTimeDemo = ({ userId = 'demo-user' }) => {
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [currentSession, setCurrentSession] = useState(null);
  const [recentProgress, setRecentProgress] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [performanceAlerts, setPerformanceAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('live-session');
  
  const unsubscribeRefs = useRef([]);

  useEffect(() => {
    // Subscribe to real-time events
    const unsubscribers = [
      realTimeAnalytics.subscribeToProgress(userId, handleProgressUpdate),
      realTimeAnalytics.subscribeToSessionUpdates(userId, handleSessionUpdate),
      realTimeAnalytics.subscribeToRecommendations(userId, handleRecommendation),
      realTimeAnalytics.subscribeToPerformanceAlerts(userId, handlePerformanceAlert),
      realTimeAnalytics.wsManager.subscribe('connection', handleConnectionStatus),
      realTimeAnalytics.wsManager.subscribe('achievement', handleAchievement)
    ];
    
    unsubscribeRefs.current = unsubscribers;
    
    // Initial load
    setConnectionStatus(realTimeAnalytics.getConnectionStatus());
    setCurrentSession(realTimeAnalytics.getCurrentSession());
    
    return () => {
      unsubscribeRefs.current.forEach(unsubscribe => unsubscribe());
    };
  }, [userId]);

  const handleProgressUpdate = (data) => {
    console.log('Progress update received:', data);
    setRecentProgress(prev => [...prev.slice(-9), {
      ...data,
      id: Date.now()
    }]);
  };

  const handleSessionUpdate = (session) => {
    console.log('Session update received:', session);
    setCurrentSession(session);
  };

  const handleRecommendation = (recommendation) => {
    console.log('Recommendation received:', recommendation);
    setRecommendations(prev => [{
      ...recommendation,
      id: Date.now(),
      seen: false
    }, ...prev.slice(0, 4)]);
  };

  const handlePerformanceAlert = (alert) => {
    console.log('Performance alert received:', alert);
    setPerformanceAlerts(prev => [{
      ...alert,
      id: Date.now(),
      dismissed: false
    }, ...prev.slice(0, 4)]);
  };

  const handleConnectionStatus = (status) => {
    console.log('Connection status updated:', status);
    setConnectionStatus(realTimeAnalytics.getConnectionStatus());
  };

  const handleAchievement = (achievementData) => {
    console.log('Achievement received:', achievementData);
    setAchievements(prev => [{
      ...achievementData.achievement,
      unlockedAt: achievementData.timestamp,
      id: Date.now()
    }, ...prev.slice(0, 4)]);
  };

  const simulateExerciseCompletion = () => {
    const exerciseTypes = ['multipleChoice', 'fillInTheBlanks', 'dragAndDrop'];
    const exerciseData = {
      exerciseType: exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)],
      isCorrect: Math.random() > 0.3,
      responseTime: 1000 + Math.random() * 8000,
      difficulty: Math.random() > 0.5 ? 'medium' : 'easy',
      userId
    };
    
    realTimeAnalytics.trackExerciseCompletion(exerciseData);
  };

  const dismissAlert = (alertId) => {
    setPerformanceAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  const markRecommendationSeen = (recId) => {
    setRecommendations(prev =>
      prev.map(rec =>
        rec.id === recId ? { ...rec, seen: true } : rec
      )
    );
  };

  const formatDuration = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  };

  const getConnectionStatusColor = () => {
    if (!connectionStatus) return 'gray';
    return connectionStatus.isConnected ? 'green' : 'red';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Real-Time Analytics Demo
            </h2>
            <p className="text-gray-600">
              Day 22: Live progress updates, session monitoring, and real-time recommendations
            </p>
          </div>
          
          {/* Connection Status */}
          <div className="text-center">
            <div className={`w-4 h-4 rounded-full mx-auto mb-2 ${
              getConnectionStatusColor() === 'green' ? 'bg-green-500 animate-pulse' :
              getConnectionStatusColor() === 'red' ? 'bg-red-500' : 'bg-gray-400'
            }`}></div>
            <div className="text-sm font-medium">
              {connectionStatus?.isConnected ? 'Connected' : 'Disconnected'}
            </div>
            <div className="text-xs text-gray-500">
              Real-time updates {connectionStatus?.isConnected ? 'active' : 'paused'}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'live-session', label: 'Live Session', icon: '📊' },
              { id: 'progress-stream', label: 'Progress Stream', icon: '📈' },
              { id: 'recommendations', label: 'Recommendations', icon: '💡' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'alerts', label: 'Performance Alerts', icon: '⚠️' },
              { id: 'performance', label: 'Performance Monitor', icon: '🔧' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
                {tab.id === 'recommendations' && recommendations.filter(r => !r.seen).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                    {recommendations.filter(r => !r.seen).length}
                  </span>
                )}
                {tab.id === 'alerts' && performanceAlerts.filter(a => !a.dismissed).length > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-xs rounded-full px-2 py-1">
                    {performanceAlerts.filter(a => !a.dismissed).length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Live Session Tab */}
          {activeTab === 'live-session' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">Current Session</h3>
                <button
                  onClick={simulateExerciseCompletion}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded font-medium transition-colors"
                >
                  🎯 Simulate Exercise
                </button>
              </div>
              
              {currentSession && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {currentSession.metrics.exerciseCount}
                    </div>
                    <div className="text-sm text-blue-800">Exercises Completed</div>
                  </div>
                  
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {currentSession.metrics.accuracy ? `${currentSession.metrics.accuracy.toFixed(1)}%` : '0%'}
                    </div>
                    <div className="text-sm text-green-800">Current Accuracy</div>
                  </div>
                  
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      {currentSession.metrics.streakCount || 0}
                    </div>
                    <div className="text-sm text-purple-800">Current Streak</div>
                  </div>
                  
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {formatDuration(currentSession.duration || 0)}
                    </div>
                    <div className="text-sm text-orange-800">Session Duration</div>
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Live Activity Feed</h4>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentSession?.events.slice(-5).reverse().map((event, index) => (
                    <div key={index} className="flex items-center space-x-3 p-2 bg-white rounded">
                      <span className={`w-2 h-2 rounded-full ${
                        event.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}></span>
                      <span className="text-sm text-gray-700">
                        {event.isCorrect ? '✅' : '❌'} {event.exerciseType} exercise
                      </span>
                      <span className="text-xs text-gray-500 ml-auto">
                        {new Date(event.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  ))}
                  {(!currentSession?.events || currentSession.events.length === 0) && (
                    <div className="text-center text-gray-500 py-4">
                      No activity yet. Complete an exercise to see live updates!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Progress Stream Tab */}
          {activeTab === 'progress-stream' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Real-Time Progress Stream</h3>
              
              <div className="space-y-3">
                {recentProgress.map((progress) => (
                  <div key={progress.id} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-blue-800">Progress Update</div>
                        <div className="text-sm text-blue-600">
                          Score: {progress.currentScore} | Streak: {progress.streakCount}
                        </div>
                      </div>
                      <div className="text-xs text-blue-500">
                        {new Date(progress.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {recentProgress.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">📈</div>
                    <p>Real-time progress updates will appear here.</p>
                    <p className="text-sm mt-2">Complete exercises to see live progress streaming!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recommendations Tab */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Real-Time Recommendations</h3>
              
              <div className="space-y-3">
                {recommendations.map((rec) => (
                  <div
                    key={rec.id}
                    className={`border rounded-lg p-4 transition-all ${
                      rec.seen ? 'bg-gray-50 border-gray-200' : 'bg-yellow-50 border-yellow-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`font-medium ${rec.seen ? 'text-gray-700' : 'text-yellow-800'}`}>
                          {rec.recommendation?.title || rec.title}
                        </div>
                        <div className={`text-sm mt-1 ${rec.seen ? 'text-gray-600' : 'text-yellow-700'}`}>
                          {rec.recommendation?.message || rec.message}
                        </div>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className={`text-xs px-2 py-1 rounded ${
                            rec.priority === 'high' ? 'bg-red-100 text-red-800' :
                            rec.priority === 'medium' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {rec.priority} priority
                          </span>
                          <span className="text-xs text-gray-500">
                            {new Date(rec.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                      {!rec.seen && (
                        <button
                          onClick={() => markRecommendationSeen(rec.id)}
                          className="ml-4 text-yellow-600 hover:text-yellow-800 text-sm"
                        >
                          Mark as seen
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">💡</div>
                    <p>Real-time recommendations will appear here.</p>
                    <p className="text-sm mt-2">AI-powered suggestions based on your performance!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Achievements</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-gradient-to-r from-yellow-100 to-orange-100 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <div className="font-semibold text-yellow-800">{achievement.title}</div>
                        <div className="text-sm text-yellow-700">{achievement.description}</div>
                        <div className="text-xs text-yellow-600 mt-1">
                          Unlocked at {new Date(achievement.unlockedAt).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {achievements.length === 0 && (
                  <div className="col-span-2 text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">🏆</div>
                    <p>Achievements will be unlocked here in real-time.</p>
                    <p className="text-sm mt-2">Keep practicing to earn your first achievement!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Alerts Tab */}
          {activeTab === 'alerts' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Performance Alerts</h3>
              
              <div className="space-y-3">
                {performanceAlerts.filter(alert => !alert.dismissed).map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-4 ${
                      alert.severity === 'warning' ? 'bg-red-50 border-red-200' :
                      alert.severity === 'info' ? 'bg-blue-50 border-blue-200' :
                      'bg-orange-50 border-orange-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className={`font-medium ${
                          alert.severity === 'warning' ? 'text-red-800' :
                          alert.severity === 'info' ? 'text-blue-800' :
                          'text-orange-800'
                        }`}>
                          {alert.type.replace('_', ' ').toUpperCase()} Alert
                        </div>
                        <div className={`text-sm mt-1 ${
                          alert.severity === 'warning' ? 'text-red-700' :
                          alert.severity === 'info' ? 'text-blue-700' :
                          'text-orange-700'
                        }`}>
                          {alert.message}
                        </div>
                        {alert.suggestions && (
                          <div className="mt-2">
                            <div className="text-xs font-medium mb-1">Suggestions:</div>
                            <ul className="text-xs space-y-1">
                              {alert.suggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-center space-x-2">
                                  <span>•</span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(alert.timestamp).toLocaleTimeString()}
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="ml-4 text-gray-400 hover:text-gray-600 text-sm"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
                {performanceAlerts.filter(alert => !alert.dismissed).length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <div className="text-4xl mb-4">⚠️</div>
                    <p>Performance alerts will appear here.</p>
                    <p className="text-sm mt-2">Real-time monitoring for optimal learning!</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Performance Monitor Tab */}
          {activeTab === 'performance' && (
            <div className="p-6">
              <PerformanceMonitor />
            </div>
          )}
        </div>
      </div>

      {/* Implementation Details */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-3">🚀 Real-Time Features</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
          <div className="space-y-1">
            <div>✅ WebSocket connection simulation</div>
            <div>✅ Real-time progress streaming</div>
            <div>✅ Live session monitoring</div>
            <div>✅ Instant achievement notifications</div>
          </div>
          <div className="space-y-1">
            <div>✅ AI-powered recommendations</div>
            <div>✅ Performance alert system</div>
            <div>✅ Connection status monitoring</div>
            <div>✅ Real-time metric calculations</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeDemo;
