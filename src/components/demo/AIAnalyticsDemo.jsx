/**
 * Demo Component to Test AI and Analytics Features
 * Showcases the new AI-powered hints, adaptive difficulty, and analytics tracking
 */

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAI } from '../../hooks/useAI';
import AnalyticsDashboard from '../analytics/AnalyticsDashboard';

const AIAnalyticsDemo = () => {
  const [activeDemo, setActiveDemo] = useState('overview');
  const [demoData, setDemoData] = useState({
    currentQuestion: {
      id: 'demo-1',
      type: 'multipleChoice',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correctAnswer: 2,
      difficulty: 'easy',
      startTime: Date.now()
    },
    exercise: {
      id: 'demo-exercise',
      type: 'multipleChoice',
      difficulty: 'intermediate',
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: `demo-${i + 1}`,
        type: 'multipleChoice',
        difficulty: i < 2 ? 'easy' : i < 4 ? 'medium' : 'hard'
      }))
    }
  });

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🤖 AI & Analytics Demo</h1>
        <p className="text-gray-600">Test and explore the new AI-powered features and analytics capabilities</p>
      </div>

      {/* Demo Navigation */}
      <div className="mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'overview', label: '📊 Overview', desc: 'Feature overview' },
              { id: 'analytics', label: '📈 Analytics', desc: 'Test analytics tracking' },
              { id: 'ai-hints', label: '💡 AI Hints', desc: 'Intelligent hint system' },
              { id: 'adaptive', label: '🎯 Adaptive Difficulty', desc: 'Dynamic difficulty adjustment' },
              { id: 'dashboard', label: '📋 Dashboard', desc: 'Analytics dashboard' }
            ].map(demo => (
              <button
                key={demo.id}
                onClick={() => setActiveDemo(demo.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeDemo === demo.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={demo.desc}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="space-y-6">
        {activeDemo === 'overview' && <OverviewDemo />}
        {activeDemo === 'analytics' && <AnalyticsDemo demoData={demoData} />}
        {activeDemo === 'ai-hints' && <AIHintsDemo demoData={demoData} />}
        {activeDemo === 'adaptive' && <AdaptiveDifficultyDemo demoData={demoData} />}
        {activeDemo === 'dashboard' && <DashboardDemo />}
      </div>
    </div>
  );
};

const OverviewDemo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Analytics Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">📊</span>
          <h3 className="text-lg font-semibold text-gray-900">Analytics Engine</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Real-time user behavior tracking</li>
          <li>✅ Performance metrics calculation</li>
          <li>✅ Learning pattern analysis</li>
          <li>✅ Session and device information</li>
          <li>✅ Data persistence and batching</li>
        </ul>
      </div>

      {/* AI Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🤖</span>
          <h3 className="text-lg font-semibold text-gray-900">AI Engine</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Intelligent hint generation</li>
          <li>✅ Adaptive difficulty adjustment</li>
          <li>✅ Learning style detection</li>
          <li>✅ Personalized recommendations</li>
          <li>✅ Performance-based insights</li>
        </ul>
      </div>

      {/* Integration Features */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🔗</span>
          <h3 className="text-lg font-semibold text-gray-900">React Integration</h3>
        </div>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>✅ Custom React hooks</li>
          <li>✅ Component-level tracking</li>
          <li>✅ Real-time UI updates</li>
          <li>✅ Analytics dashboard</li>
          <li>✅ AI-enhanced exercises</li>
        </ul>
      </div>
    </div>
  );
};

const AnalyticsDemo = ({ demoData }) => {
  const analytics = useAnalytics({ componentName: 'AnalyticsDemo' });
  const [events, setEvents] = useState([]);

  const simulateEvent = (eventType) => {
    let event;
    switch (eventType) {
      case 'exercise_start':
        event = analytics.trackExerciseStart(demoData.exercise);
        break;
      case 'question_viewed':
        event = analytics.trackQuestionViewed(demoData.currentQuestion);
        break;
      case 'answer_submitted':
        event = analytics.trackAnswerSubmitted({
          questionId: demoData.currentQuestion.id,
          answer: 'Paris',
          isCorrect: true,
          timeToAnswer: Math.random() * 10000 + 5000,
          hintsUsed: Math.floor(Math.random() * 3),
          confidence: Math.random()
        });
        break;
      case 'hint_used':
        event = analytics.trackHintUsed({
          questionId: demoData.currentQuestion.id,
          level: Math.floor(Math.random() * 3) + 1,
          content: 'Think about famous European capitals...',
          timeBeforeHint: Math.random() * 15000 + 5000
        });
        break;
      case 'exercise_completed':
        event = analytics.trackExerciseCompleted({
          exerciseId: demoData.exercise.id,
          totalDuration: Math.random() * 300000 + 60000,
          finalScore: Math.random() * 100 + 50,
          questionsCorrect: Math.floor(Math.random() * 5) + 3,
          questionsTotal: 5,
          hintsUsed: Math.floor(Math.random() * 5),
          completion: 100
        });
        break;
      default:
        event = analytics.track('demo_interaction', { action: eventType });
    }
    
    setEvents(prev => [event, ...prev.slice(0, 9)]); // Keep last 10 events
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Event Simulation */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📊 Simulate Analytics Events</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { key: 'exercise_start', label: 'Start Exercise', icon: '🚀' },
            { key: 'question_viewed', label: 'View Question', icon: '👁️' },
            { key: 'answer_submitted', label: 'Submit Answer', icon: '✅' },
            { key: 'hint_used', label: 'Use Hint', icon: '💡' },
            { key: 'exercise_completed', label: 'Complete Exercise', icon: '🏁' },
            { key: 'error', label: 'Log Error', icon: '❌' }
          ].map(eventType => (
            <button
              key={eventType.key}
              onClick={() => simulateEvent(eventType.key)}
              className="flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors text-sm"
            >
              <span className="mr-2">{eventType.icon}</span>
              {eventType.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Events */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Recent Events</h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {events.length > 0 ? events.map((event, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded text-xs">
              <div className="font-medium text-gray-900">{event.name}</div>
              <div className="text-gray-600">
                {new Date(event.timestamp).toLocaleTimeString()}
              </div>
              <div className="text-gray-500 truncate">
                {JSON.stringify(event.properties, null, 0)}
              </div>
            </div>
          )) : (
            <p className="text-gray-500 italic">No events yet. Click buttons above to generate events.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const AIHintsDemo = ({ demoData }) => {
  const { 
    currentHint, 
    requestHint, 
    resetHints, 
    hintLevel,
    hintsUsed 
  } = useIntelligentHints(demoData.currentQuestion);

  const [showHint, setShowHint] = useState(false);

  const handleRequestHint = () => {
    const hint = requestHint();
    setShowHint(true);
    console.log('Generated hint:', hint);
  };

  const handleResetHints = () => {
    resetHints();
    setShowHint(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Hint Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 AI Hint System</h3>
        
        <div className="mb-4 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Demo Question:</h4>
          <p className="text-blue-800">{demoData.currentQuestion.question}</p>
          <div className="mt-2 space-y-1">
            {demoData.currentQuestion.options.map((option, index) => (
              <div key={index} className="text-sm text-blue-700">
                {String.fromCharCode(65 + index)}. {option}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleRequestHint}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Request AI Hint (Level {hintLevel + 1})
          </button>
          
          <button
            onClick={handleResetHints}
            className="w-full px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            Reset Hints
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          <p>Hints used: {hintsUsed.length}</p>
          <p>Current level: {hintLevel}</p>
        </div>
      </div>

      {/* Hint Display */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Generated Hints</h3>
        
        {showHint && currentHint ? (
          <div className="space-y-4">
            <div className="p-4 border-l-4 border-blue-500 bg-blue-50">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium text-blue-900">
                  Hint Level {currentHint.level}
                </h4>
                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                  {currentHint.strategy}
                </span>
              </div>
              <p className="text-blue-800 mb-2">{currentHint.content}</p>
              <div className="text-xs text-blue-600">
                <p>Confidence: {Math.round((currentHint.confidence || 0) * 100)}%</p>
                {currentHint.followUp && (
                  <p className="italic">"{currentHint.followUp}"</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <span className="text-4xl mb-2 block">💡</span>
            <p>Request a hint to see AI-generated guidance</p>
          </div>
        )}

        {/* Previous Hints */}
        {hintsUsed.length > 0 && (
          <div className="mt-6">
            <h4 className="font-medium text-gray-900 mb-2">Previous Hints:</h4>
            <div className="space-y-2">
              {hintsUsed.map((hint, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                  <span className="font-medium">L{hint.level}:</span> {hint.content}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdaptiveDifficultyDemo = ({ demoData }) => {
  const {
    currentDifficulty,
    recordPerformance,
    adaptCurrentDifficulty,
    performanceHistory,
    userLevel
  } = useAdaptiveDifficulty(demoData.exercise.difficulty);

  const simulatePerformance = (isCorrect, timeToAnswer = null) => {
    const performance = {
      questionId: `demo-${Date.now()}`,
      isCorrect,
      timeToAnswer: timeToAnswer || Math.random() * 15000 + 5000,
      hintsUsed: Math.random() > 0.7,
      difficulty: currentDifficulty
    };
    
    recordPerformance(performance);
    adaptCurrentDifficulty(demoData.exercise);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Difficulty Controls */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">🎯 Adaptive Difficulty</h3>
        
        <div className="mb-4 p-4 bg-green-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-900">Current Difficulty:</span>
              <p className="text-green-800 capitalize">{currentDifficulty}</p>
            </div>
            <div>
              <span className="font-medium text-green-900">User Level:</span>
              <p className="text-green-800 capitalize">{userLevel}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3 mb-4">
          <button
            onClick={() => simulatePerformance(true, 3000)}
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
          >
            ✅ Simulate Correct Answer (Fast)
          </button>
          
          <button
            onClick={() => simulatePerformance(true, 12000)}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            ✅ Simulate Correct Answer (Slow)
          </button>
          
          <button
            onClick={() => simulatePerformance(false, 8000)}
            className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
          >
            ❌ Simulate Incorrect Answer
          </button>
        </div>

        <div className="text-sm text-gray-600">
          <p>Performance History: {performanceHistory.length} entries</p>
          <p>Last 5 accuracy: {
            performanceHistory.slice(-5).filter(p => p.isCorrect).length
          }/5</p>
        </div>
      </div>

      {/* Performance History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📈 Performance History</h3>
        
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {performanceHistory.length > 0 ? performanceHistory.slice(-10).reverse().map((perf, index) => (
            <div key={index} className={`p-2 rounded text-sm ${
              perf.isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              <div className="flex justify-between items-center">
                <span className="font-medium">
                  {perf.isCorrect ? '✅ Correct' : '❌ Incorrect'}
                </span>
                <span className="text-xs opacity-75">
                  {Math.round(perf.timeToAnswer / 1000)}s
                </span>
              </div>
              <div className="text-xs opacity-75">
                Difficulty: {perf.difficulty} | Hints: {perf.hintsUsed ? 'Yes' : 'No'}
              </div>
            </div>
          )) : (
            <p className="text-gray-500 italic text-center py-4">
              No performance data yet. Simulate some answers to see adaptation in action.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const DashboardDemo = () => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Analytics Dashboard</h3>
      <p className="text-gray-600 mb-6">
        Full analytics dashboard with real-time insights, learning patterns, and AI recommendations.
      </p>
      <AnalyticsDashboard />
    </div>
  );
};

export default AIAnalyticsDemo;
