/**
 * Analytics Dashboard Component
 * Displays user performance analytics and insights
 */

import React, { useState, useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
// import { useAI } from '../../hooks/useAI';
import AdvancedAnalyticsDashboard from './AdvancedAnalyticsDashboard.jsx';

const AnalyticsDashboard = () => {
  const { insights, analytics } = useAnalytics({ componentName: 'AnalyticsDashboard' });
  // const { userInsights, recommendations } = useAI();
  const userInsights = null;
  const recommendations = [];
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    analytics.track('dashboard_viewed', {
      selectedPeriod,
      activeTab
    });
  }, [analytics, selectedPeriod, activeTab]);

  if (!insights) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  const session = insights.session || {};
  const performanceMetrics = insights.performanceMetrics || {};
  const learningPatterns = insights.learningPatterns || {};

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Track your learning progress and performance insights</p>
      </div>

      {/* Period Selector */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow p-4">
          <div className="flex space-x-4">
            {['today', 'week', 'month', 'all'].map(period => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-4 py-2 rounded-md capitalize transition-colors ${
                  selectedPeriod === period
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {period === 'all' ? 'All Time' : period}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8">
              {[
                { id: 'overview', label: 'Overview' },
                { id: 'performance', label: 'Performance' },
                { id: 'learning', label: 'Learning Patterns' },
                { id: 'recommendations', label: 'AI Insights' },
                { id: 'advanced', label: '🧠 Advanced Analytics', highlight: true }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : tab.highlight 
                        ? 'border-transparent text-purple-600 hover:text-purple-700 hover:border-purple-300'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <OverviewTab 
            session={session} 
            performanceMetrics={performanceMetrics}
            userInsights={userInsights}
          />
        )}
        
        {activeTab === 'performance' && (
          <PerformanceTab 
            performanceMetrics={performanceMetrics}
            learningPatterns={learningPatterns}
          />
        )}
        
        {activeTab === 'learning' && (
          <LearningPatternsTab 
            learningPatterns={learningPatterns}
            userInsights={userInsights}
          />
        )}
        
        {activeTab === 'recommendations' && (
          <RecommendationsTab 
            recommendations={recommendations}
            userInsights={userInsights}
          />
        )}

        {activeTab === 'advanced' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <AdvancedAnalyticsDashboard userId="demo-user" />
          </div>
        )}
      </div>
    </div>
  );
};

const OverviewTab = ({ session, performanceMetrics, userInsights }) => {
  const sessionDuration = session.duration ? Math.round(session.duration / 60000) : 0;
  const userLevel = userInsights?.currentLevel || 'beginner';
  const accuracy = userInsights?.profile?.performance?.averageAccuracy || 0;

  const stats = [
    {
      label: 'Session Duration',
      value: `${sessionDuration} min`,
      icon: '⏱️',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      label: 'Current Level',
      value: userLevel.charAt(0).toUpperCase() + userLevel.slice(1),
      icon: '🎯',
      color: 'bg-green-100 text-green-800'
    },
    {
      label: 'Average Accuracy',
      value: `${Math.round(accuracy * 100)}%`,
      icon: '✅',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      label: 'Events Tracked',
      value: session.eventsCount || 0,
      icon: '📊',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-2 rounded-md ${stat.color}`}>
                <span className="text-lg">{stat.icon}</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {Object.entries(performanceMetrics).slice(0, 5).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-sm text-gray-600 capitalize">
                {key.replace(/_/g, ' ').replace('count', '')}
              </span>
              <span className="text-sm font-medium text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PerformanceTab = ({ performanceMetrics, learningPatterns }) => {
  const strengths = learningPatterns.strengths || [];
  const weaknesses = learningPatterns.weaknesses || [];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(performanceMetrics).map(([key, value]) => (
            <div key={key} className="p-4 bg-gray-50 rounded-md">
              <p className="text-sm text-gray-600 capitalize">
                {key.replace(/_/g, ' ').replace('count', '')}
              </p>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-green-500 mr-2">💪</span>
            Strengths
          </h3>
          {strengths.length > 0 ? (
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="p-3 bg-green-50 rounded-md">
                  <p className="font-medium text-green-800">{strength.type}</p>
                  <p className="text-sm text-green-600">
                    Accuracy: {Math.round(strength.accuracy * 100)}%
                  </p>
                  <p className="text-sm text-green-600">
                    Avg Time: {Math.round(strength.averageTime / 1000)}s
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Keep practicing to identify your strengths!</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-orange-500 mr-2">🎯</span>
            Areas for Improvement
          </h3>
          {weaknesses.length > 0 ? (
            <div className="space-y-3">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="p-3 bg-orange-50 rounded-md">
                  <p className="font-medium text-orange-800">{weakness.type}</p>
                  <p className="text-sm text-orange-600">
                    Accuracy: {Math.round(weakness.accuracy * 100)}%
                  </p>
                  <div className="mt-2">
                    {weakness.recommendedActions?.slice(0, 2).map((action, i) => (
                      <p key={i} className="text-xs text-orange-600">• {action}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">Great job! No significant weaknesses detected.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const LearningPatternsTab = ({ learningPatterns, userInsights }) => {
  const learningSpeed = learningPatterns.learningSpeed || 0;
  const preferredDifficulty = learningPatterns.preferredDifficulty || 'medium';
  const retentionRate = learningPatterns.retentionRate || 0;

  return (
    <div className="space-y-6">
      {/* Learning Metrics */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Patterns</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {learningSpeed.toFixed(1)}
            </p>
            <p className="text-sm text-blue-800">Questions/Minute</p>
            <p className="text-xs text-blue-600 mt-1">Learning Speed</p>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600 capitalize">
              {preferredDifficulty}
            </p>
            <p className="text-sm text-green-800">Preferred Level</p>
            <p className="text-xs text-green-600 mt-1">Difficulty</p>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {Math.round(retentionRate * 100)}%
            </p>
            <p className="text-sm text-purple-800">Retention Rate</p>
            <p className="text-xs text-purple-600 mt-1">Knowledge Retention</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      {userInsights?.profile && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Learning Profile</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Preferences</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Learning Style: <span className="font-medium">
                  {userInsights.profile.learningStyle || 'Not determined'}
                </span></p>
                <p>Preferred Pace: <span className="font-medium">
                  {userInsights.profile.preferredPace}
                </span></p>
                <p>Hint Style: <span className="font-medium">
                  {userInsights.profile.preferences?.hintStyle}
                </span></p>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Performance Summary</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p>Sessions Completed: <span className="font-medium">
                  {userInsights.profile.performance?.sessionCount || 0}
                </span></p>
                <p>Total Questions: <span className="font-medium">
                  {userInsights.profile.performance?.totalQuestions || 0}
                </span></p>
                <p>Overall Accuracy: <span className="font-medium">
                  {Math.round((userInsights.profile.performance?.averageAccuracy || 0) * 100)}%
                </span></p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const RecommendationsTab = ({ recommendations, userInsights }) => {
  const practiceRecs = recommendations?.filter(r => r.type === 'practice') || [];
  const scheduleRecs = recommendations?.filter(r => r.type === 'schedule') || [];
  const adaptationRecs = recommendations?.filter(r => r.type === 'adaptation') || [];

  return (
    <div className="space-y-6">
      {/* AI Recommendations Overview */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">🤖 AI-Powered Recommendations</h3>
        <p className="opacity-90">
          Based on your learning patterns and performance, here are personalized suggestions to enhance your learning experience.
        </p>
      </div>

      {/* Practice Recommendations */}
      {practiceRecs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-blue-500 mr-2">📚</span>
            Practice Recommendations
          </h3>
          <div className="space-y-4">
            {practiceRecs.map((rec, index) => (
              <div key={index} className="p-4 border border-blue-200 rounded-lg bg-blue-50">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-blue-900">{rec.topic}</h4>
                  <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">
                    Priority: {Math.round(rec.priority * 100)}%
                  </span>
                </div>
                <p className="text-sm text-blue-700 mb-2">{rec.reason}</p>
                <p className="text-sm font-medium text-blue-800">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schedule Recommendations */}
      {scheduleRecs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-green-500 mr-2">📅</span>
            Schedule Recommendations
          </h3>
          <div className="space-y-3">
            {scheduleRecs.map((rec, index) => (
              <div key={index} className="p-4 border border-green-200 rounded-lg bg-green-50">
                <p className="text-sm font-medium text-green-800">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Style Adaptations */}
      {adaptationRecs.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="text-purple-500 mr-2">🎨</span>
            Learning Style Adaptations
          </h3>
          <div className="space-y-3">
            {adaptationRecs.map((rec, index) => (
              <div key={index} className="p-4 border border-purple-200 rounded-lg bg-purple-50">
                <p className="text-sm font-medium text-purple-800">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Recommendations */}
      {(!recommendations || recommendations.length === 0) && (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <div className="text-6xl mb-4">🌱</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Keep Learning!</h3>
          <p className="text-gray-600">
            Complete more exercises to get personalized AI recommendations tailored to your learning style and performance.
          </p>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
