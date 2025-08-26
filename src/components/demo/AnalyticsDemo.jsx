import React, { useState, useEffect } from 'react';
import ProgressDashboard from '../analytics/ProgressDashboard.jsx';
import { analyticsTracker, ANALYTICS_EVENTS } from '../../analytics/eventTracker.js';
import { progressEngine } from '../../analytics/progressEngine.js';
import { withAnalytics } from '../../analytics/integration.js';

// Mock QuizEngine for demonstration
class MockQuizEngine {
  constructor(config = {}) {
    this.config = config;
    this.currentQuestion = null;
    this.state = 'idle';
  }
  
  start(exercises) {
    this.state = 'active';
    console.log('Quiz started with', exercises?.length || 0, 'exercises');
  }
  
  startExercise(exercise) {
    this.currentQuestion = exercise.questions?.[0] || exercise;
    console.log('Started exercise:', exercise.type);
  }
  
  submitAnswer(answer) {
    const isCorrect = Math.random() > 0.3; // 70% chance of correct answer
    return {
      isCorrect,
      timeToAnswer: Math.floor(Math.random() * 30) + 10, // 10-40 seconds
      score: isCorrect ? 100 : 0
    };
  }
  
  getHint(type) {
    return `This is a ${type} hint for the current question`;
  }
  
  pause() {
    this.state = 'paused';
  }
  
  resume() {
    this.state = 'active';
  }
  
  finish() {
    this.state = 'completed';
    return {
      score: Math.floor(Math.random() * 50) + 50, // 50-100 score
      totalQuestions: 5,
      correctAnswers: Math.floor(Math.random() * 3) + 2, // 2-5 correct
      accuracy: 70 + Math.random() * 30, // 70-100% accuracy
      averageTimePerQuestion: 20 + Math.random() * 20, // 20-40 seconds
      hintsUsed: Math.floor(Math.random() * 3), // 0-2 hints
      completed: true
    };
  }
}

// Create analytics-enabled version
const AnalyticsQuizEngine = withAnalytics(MockQuizEngine);

const AnalyticsDemo = () => {
  const [currentView, setCurrentView] = useState('demo');
  const [quizEngine, setQuizEngine] = useState(null);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [mockUserId] = useState('demo_user_123');

  useEffect(() => {
    // Initialize quiz engine with analytics
    const engine = new AnalyticsQuizEngine({
      enableAnalytics: true,
      difficulty: 'medium'
    });
    setQuizEngine(engine);
    
    // Generate some mock data for demonstration
    generateMockAnalyticsData();
  }, []);

  const generateMockAnalyticsData = async () => {
    // Simulate some past analytics data
    const mockSessions = [
      {
        sessionId: 'session_1',
        startTime: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
        endTime: new Date(Date.now() - 86400000 * 5 + 1800000).toISOString(), // 30 min later
        duration: 1800000,
        averageScore: 75,
        questionsAnswered: 10,
        hintsUsed: 2,
        exercises: [
          { type: 'multipleChoice', score: 80, difficulty: 'medium', timeToComplete: 300 },
          { type: 'fillInTheBlanks', score: 70, difficulty: 'medium', timeToComplete: 450 }
        ]
      },
      {
        sessionId: 'session_2',
        startTime: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
        endTime: new Date(Date.now() - 86400000 * 3 + 2400000).toISOString(), // 40 min later
        duration: 2400000,
        averageScore: 82,
        questionsAnswered: 12,
        hintsUsed: 1,
        exercises: [
          { type: 'dragAndDrop', score: 90, difficulty: 'medium', timeToComplete: 280 },
          { type: 'gapFill', score: 74, difficulty: 'hard', timeToComplete: 520 }
        ]
      }
    ];

    const mockPerformance = {
      correctAnswers: 18,
      totalAnswers: 22,
      averageTime: 25,
      exerciseHistory: [
        { type: 'multipleChoice', score: 80, difficulty: 'medium', timeToComplete: 300 },
        { type: 'fillInTheBlanks', score: 70, difficulty: 'medium', timeToComplete: 450 },
        { type: 'dragAndDrop', score: 90, difficulty: 'medium', timeToComplete: 280 },
        { type: 'gapFill', score: 74, difficulty: 'hard', timeToComplete: 520 }
      ]
    };

    // Store mock data
    localStorage.setItem(`analytics_user_${mockUserId}`, JSON.stringify({
      performance: mockPerformance,
      sessions: mockSessions
    }));

    // Calculate analytics
    const skillProgress = progressEngine.calculateSkillLevel(mockPerformance);
    const patterns = progressEngine.identifyLearningPatterns(mockSessions);

    setAnalyticsData({
      performance: mockPerformance,
      skillProgress,
      patterns,
      sessions: mockSessions
    });
  };

  const startSimulation = async () => {
    if (!quizEngine) return;
    
    setSimulationRunning(true);
    setIsQuizActive(true);

    try {
      // Start a new session
      quizEngine.start([
        { type: 'multipleChoice', difficulty: 'medium' },
        { type: 'fillInTheBlanks', difficulty: 'medium' },
        { type: 'dragAndDrop', difficulty: 'hard' }
      ], mockUserId);

      // Simulate exercise sequence
      const exercises = [
        { id: 'ex1', type: 'multipleChoice', difficulty: 'medium', questions: [{ id: 'q1' }] },
        { id: 'ex2', type: 'fillInTheBlanks', difficulty: 'medium', questions: [{ id: 'q2' }] },
        { id: 'ex3', type: 'dragAndDrop', difficulty: 'hard', questions: [{ id: 'q3' }] }
      ];

      for (let i = 0; i < exercises.length; i++) {
        const exercise = exercises[i];
        
        // Start exercise
        quizEngine.startExercise(exercise);
        await delay(1000);

        // Simulate questions
        for (let j = 0; j < 3; j++) {
          // Maybe use a hint
          if (Math.random() > 0.7) {
            quizEngine.getHint('explanation');
            await delay(500);
          }

          // Submit answer
          const answer = `Answer ${j + 1}`;
          quizEngine.submitAnswer(answer);
          await delay(800);
        }

        // Complete exercise
        const results = {
          score: 70 + Math.random() * 30,
          totalQuestions: 3,
          correctAnswers: Math.floor(Math.random() * 2) + 2,
          accuracy: 70 + Math.random() * 30,
          averageTimePerQuestion: 15 + Math.random() * 15,
          hintsUsed: Math.floor(Math.random() * 2),
          completed: true
        };
        
        quizEngine.analytics.completeExercise(results);
        await delay(1000);
      }

      // Finish session
      quizEngine.finish();
      
      // Refresh analytics data
      setTimeout(() => {
        generateMockAnalyticsData();
      }, 1000);

    } catch (error) {
      console.error('Simulation error:', error);
    } finally {
      setSimulationRunning(false);
      setIsQuizActive(false);
    }
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const getRealTimeInsights = async () => {
    if (!quizEngine) return;
    
    const insights = await quizEngine.getPredictiveInsights('multipleChoice', 'medium');
    const recommendations = await quizEngine.getLearningRecommendations();
    
    alert(`Predictive Insights:
Expected Score: ${insights?.expectedScore || 'N/A'}%
Confidence: ${insights?.confidence || 'N/A'}
Trend: ${insights?.trend || 'N/A'}

Recommendations:
${recommendations?.join('\n') || 'Need more data'}`);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Phase 3: Analytics & Progress Tracking Demo
        </h1>
        <p className="text-gray-600 text-lg">
          Experience the comprehensive analytics system that tracks learning progress,
          identifies patterns, and provides personalized insights.
        </p>
      </div>

      {/* Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'demo', label: 'Interactive Demo' },
            { id: 'dashboard', label: 'Progress Dashboard' },
            { id: 'features', label: 'Features Overview' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCurrentView(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                currentView === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Demo Tab */}
      {currentView === 'demo' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
            <h2 className="text-2xl font-bold mb-4">Live Analytics Simulation</h2>
            <p className="mb-6">
              Watch real-time analytics collection as we simulate a complete learning session
              with multiple exercises, hint usage, and performance tracking.
            </p>
            
            <div className="flex space-x-4">
              <button
                onClick={startSimulation}
                disabled={simulationRunning}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {simulationRunning ? 'Running Simulation...' : 'Start Analytics Simulation'}
              </button>
              
              <button
                onClick={getRealTimeInsights}
                disabled={!quizEngine}
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-purple-600 disabled:opacity-50"
              >
                Get Real-time Insights
              </button>
            </div>
          </div>

          {/* Live Status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Session Status</h3>
              <div className={`text-lg font-bold ${
                isQuizActive ? 'text-green-600' : 'text-gray-500'
              }`}>
                {isQuizActive ? 'Active Session' : 'No Active Session'}
              </div>
              {isQuizActive && (
                <div className="text-sm text-gray-600 mt-1">
                  Analytics collection in progress...
                </div>
              )}
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Analytics Engine</h3>
              <div className="text-lg font-bold text-blue-600">
                {quizEngine?.analyticsEnabled ? 'Enabled' : 'Disabled'}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Tracking events and performance
              </div>
            </div>

            <div className="bg-white border rounded-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-2">Data Points</h3>
              <div className="text-lg font-bold text-purple-600">
                {analyticsData?.performance?.totalAnswers || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Questions analyzed
              </div>
            </div>
          </div>

          {/* Real-time Progress */}
          {quizEngine && (
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-4">Real-time Session Data</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                  {JSON.stringify(quizEngine.getAnalyticsProgress?.() || 'No active session', null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Features Showcase */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                🎯 Performance Tracking
              </h3>
              <ul className="text-green-700 space-y-2 text-sm">
                <li>• Real-time accuracy calculation</li>
                <li>• Speed and efficiency metrics</li>
                <li>• Difficulty-adjusted scoring</li>
                <li>• Consistency measurement</li>
              </ul>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                🧠 Learning Patterns
              </h3>
              <ul className="text-blue-700 space-y-2 text-sm">
                <li>• Peak performance time detection</li>
                <li>• Optimal session length analysis</li>
                <li>• Learning velocity tracking</li>
                <li>• Retention rate calculation</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">
                🔮 Predictive Analytics
              </h3>
              <ul className="text-purple-700 space-y-2 text-sm">
                <li>• Performance prediction</li>
                <li>• Difficulty recommendations</li>
                <li>• Trend analysis</li>
                <li>• Personalized insights</li>
              </ul>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">
                📊 Advanced Metrics
              </h3>
              <ul className="text-orange-700 space-y-2 text-sm">
                <li>• Engagement scoring</li>
                <li>• Session quality analysis</li>
                <li>• Help-seeking behavior</li>
                <li>• Learning efficiency</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Tab */}
      {currentView === 'dashboard' && (
        <div>
          {analyticsData ? (
            <ProgressDashboard userId={mockUserId} />
          ) : (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics data...</p>
            </div>
          )}
        </div>
      )}

      {/* Features Tab */}
      {currentView === 'features' && (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Comprehensive Analytics Features
            </h2>
            <p className="text-gray-600 text-lg max-w-3xl mx-auto">
              Our analytics system provides deep insights into learning patterns,
              performance trends, and personalized recommendations to optimize the learning experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: 'Data Architecture',
                icon: '🏗️',
                description: 'Comprehensive data models for user progress, session analytics, and learning goals',
                features: ['UserProgressModel', 'SessionDataModel', 'ExerciseAnalyticsModel', 'LearningGoalModel']
              },
              {
                title: 'Event Tracking',
                icon: '📊',
                description: 'Real-time event collection with validation, batching, and offline support',
                features: ['Session tracking', 'Question attempts', 'Hint usage', 'Performance metrics']
              },
              {
                title: 'Progress Engine',
                icon: '⚙️',
                description: 'Advanced algorithms for skill calculation and learning pattern analysis',
                features: ['Skill level calculation', 'Consistency measurement', 'Retention analysis', 'Engagement scoring']
              },
              {
                title: 'Predictive Analytics',
                icon: '🔮',
                description: 'AI-powered predictions for performance and difficulty recommendations',
                features: ['Performance prediction', 'Trend analysis', 'Difficulty optimization', 'Learning velocity']
              },
              {
                title: 'Pattern Recognition',
                icon: '🧠',
                description: 'Intelligent identification of learning patterns and peak performance times',
                features: ['Peak hours detection', 'Optimal session length', 'Learning preferences', 'Strong days analysis']
              },
              {
                title: 'Dashboard Integration',
                icon: '📈',
                description: 'Beautiful, interactive dashboard with real-time progress visualization',
                features: ['Progress overview', 'Skill breakdown', 'Pattern insights', 'Performance predictions']
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.description}</p>
                <ul className="space-y-1">
                  {feature.features.map((item, i) => (
                    <li key={i} className="text-sm text-gray-500 flex items-center">
                      <span className="text-green-500 mr-2">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-8 text-white text-center">
            <h3 className="text-2xl font-bold mb-4">Phase 3: Complete Implementation</h3>
            <p className="text-lg mb-6">
              All Day 17-18 requirements successfully implemented with comprehensive analytics infrastructure,
              real-time tracking, advanced pattern recognition, and predictive insights.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-bold text-2xl">✅</div>
                <div>Data Architecture</div>
              </div>
              <div>
                <div className="font-bold text-2xl">✅</div>
                <div>Event Tracking</div>
              </div>
              <div>
                <div className="font-bold text-2xl">✅</div>
                <div>Progress Engine</div>
              </div>
              <div>
                <div className="font-bold text-2xl">✅</div>
                <div>Analytics Integration</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDemo;
