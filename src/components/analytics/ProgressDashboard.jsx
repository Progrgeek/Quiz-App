import React, { useState, useEffect } from 'react';
import { analyticsTracker } from '../../analytics/eventTracker.js';
import { progressEngine } from '../../analytics/progressEngine.js';
import ProgressChart from './charts/ProgressChart';
import SkillRadar from './charts/SkillRadar';
import SessionSummary from './charts/SessionSummary';
import PerformanceTrends from './charts/PerformanceTrends';
import LearningInsights from './advanced/LearningInsights';
import WeakAreasIdentifier from './advanced/WeakAreasIdentifier';
import StreakTracker from './advanced/StreakTracker';
import GoalProgress from './advanced/GoalProgress';

const ProgressDashboard = ({ userId }) => {
  const [progressData, setProgressData] = useState(null);
  const [learningPatterns, setLearningPatterns] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProgressData();
  }, [userId]);

  const loadProgressData = async () => {
    setLoading(true);
    try {
      // Get user data from analytics tracker
      const userData = await analyticsTracker.getUserAnalytics(userId);
      const sessionHistory = await analyticsTracker.getSessionHistory(userId);
      
      // Calculate skill levels and progress
      const skillProgress = progressEngine.calculateSkillLevel(userData.performance);
      const patterns = progressEngine.identifyLearningPatterns(sessionHistory);
      
      setProgressData({
        ...userData,
        skillProgress,
        sessionHistory
      });
      setLearningPatterns(patterns);
    } catch (error) {
      console.error('Error loading progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Learning Progress Dashboard</h1>
        <p className="text-gray-600">Track your learning journey and discover your patterns</p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'skills', label: 'Skills' },
            { id: 'patterns', label: 'Learning Patterns' },
            { id: 'predictions', label: 'Performance Insights' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab progressData={progressData} />
      )}
      
      {activeTab === 'skills' && (
        <SkillsTab progressData={progressData} />
      )}
      
      {activeTab === 'patterns' && (
        <PatternsTab learningPatterns={learningPatterns} />
      )}
      
      {activeTab === 'predictions' && (
        <PredictionsTab progressData={progressData} />
      )}
    </div>
  );
};

const OverviewTab = ({ progressData }) => {
  if (!progressData) return <div>No data available</div>;

  const { skillProgress, performance, sessionHistory } = progressData;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Overall Level */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg p-6 text-white">
        <h3 className="text-lg font-semibold mb-2">Overall Level</h3>
        <div className="text-3xl font-bold mb-2">{skillProgress.level}</div>
        <div className="text-sm opacity-90">
          {skillProgress.xp} XP / {skillProgress.nextLevelXP} XP
        </div>
        <div className="w-full bg-white bg-opacity-20 rounded-full h-2 mt-2">
          <div 
            className="bg-white h-2 rounded-full transition-all duration-300"
            style={{ width: `${skillProgress.progress}%` }}
          ></div>
        </div>
      </div>

      {/* Accuracy Stats */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-2">Accuracy</h3>
        <div className="text-3xl font-bold text-green-600 mb-2">
          {Math.round(skillProgress.breakdown.accuracy)}%
        </div>
        <div className="text-sm text-green-600">
          {performance.correctAnswers} / {performance.totalAnswers} correct
        </div>
      </div>

      {/* Speed Stats */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-orange-800 mb-2">Speed</h3>
        <div className="text-3xl font-bold text-orange-600 mb-2">
          {Math.round(skillProgress.breakdown.speed)}%
        </div>
        <div className="text-sm text-orange-600">
          Avg: {Math.round(performance.averageTime)}s per question
        </div>
      </div>

      {/* Sessions Count */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-800 mb-2">Sessions</h3>
        <div className="text-3xl font-bold text-purple-600 mb-2">
          {sessionHistory.length}
        </div>
        <div className="text-sm text-purple-600">
          Total learning sessions
        </div>
      </div>

      {/* Consistency */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">Consistency</h3>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {Math.round(skillProgress.breakdown.consistency)}%
        </div>
        <div className="text-sm text-blue-600">
          Performance stability
        </div>
      </div>

      {/* Engagement */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-indigo-800 mb-2">Engagement</h3>
        <div className="text-3xl font-bold text-indigo-600 mb-2">
          {Math.round(skillProgress.breakdown.engagement)}%
        </div>
        <div className="text-sm text-indigo-600">
          Learning engagement level
        </div>
      </div>
    </div>
  );
};

const SkillsTab = ({ progressData }) => {
  if (!progressData) return <div>No data available</div>;

  const skillCategories = [
    { name: 'Reading', color: 'blue', progress: 75 },
    { name: 'Grammar', color: 'green', progress: 82 },
    { name: 'Vocabulary', color: 'purple', progress: 68 },
    { name: 'Listening', color: 'orange', progress: 71 },
    { name: 'Writing', color: 'red', progress: 59 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {skillCategories.map((skill) => (
          <div key={skill.name} className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{skill.name}</h3>
              <span className={`text-${skill.color}-600 font-bold`}>
                {skill.progress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div 
                className={`bg-${skill.color}-500 h-3 rounded-full transition-all duration-500`}
                style={{ width: `${skill.progress}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              Level {Math.floor(skill.progress / 10)} • {skill.progress}% mastery
            </p>
          </div>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="bg-white border rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Skill Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(progressData.skillProgress.breakdown).map(([skill, value]) => (
            <div key={skill} className="flex items-center justify-between">
              <span className="capitalize text-gray-700 font-medium">
                {skill.replace(/([A-Z])/g, ' $1').trim()}
              </span>
              <div className="flex items-center space-x-3">
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                    style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                  ></div>
                </div>
                <span className="text-sm font-semibold w-12 text-right">
                  {Math.round(value)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const PatternsTab = ({ learningPatterns }) => {
  if (!learningPatterns || learningPatterns.confidence === 'low') {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          📊
        </div>
        <h3 className="text-lg font-semibold text-gray-600 mb-2">
          Not Enough Data Yet
        </h3>
        <p className="text-gray-500 mb-4">
          Complete more exercises to see your learning patterns
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
          <p className="text-blue-700 text-sm">
            Tip: Complete at least 10 exercises across different times and days 
            to unlock personalized insights!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Confidence Indicator */}
      <div className={`border rounded-lg p-4 ${
        learningPatterns.confidence === 'high' ? 'bg-green-50 border-green-200' :
        learningPatterns.confidence === 'medium' ? 'bg-yellow-50 border-yellow-200' :
        'bg-red-50 border-red-200'
      }`}>
        <h3 className="font-semibold mb-2">
          Analysis Confidence: {learningPatterns.confidence.toUpperCase()}
        </h3>
        <p className="text-sm text-gray-600">
          {learningPatterns.confidence === 'high' && 'High confidence in pattern analysis based on substantial data.'}
          {learningPatterns.confidence === 'medium' && 'Medium confidence - patterns are emerging but need more data.'}
          {learningPatterns.confidence === 'low' && 'Low confidence - limited data available for analysis.'}
        </p>
      </div>

      {/* Insights */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">Key Insights</h3>
        <div className="space-y-2">
          {learningPatterns.insights.map((insight, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-blue-500 mt-1">💡</span>
              <span className="text-blue-700">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-green-800 mb-4">Recommendations</h3>
        <div className="space-y-2">
          {learningPatterns.recommendations.map((rec, index) => (
            <div key={index} className="flex items-start space-x-2">
              <span className="text-green-500 mt-1">✅</span>
              <span className="text-green-700">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pattern Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Peak Performance Time */}
        {learningPatterns.patterns.peakPerformanceTime && (
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold mb-3">Best Performance Time</h4>
            <div className="text-2xl font-bold text-purple-600 mb-2">
              {learningPatterns.patterns.peakPerformanceTime.hour}:00
            </div>
            <p className="text-sm text-gray-600">
              Average score: {Math.round(learningPatterns.patterns.peakPerformanceTime.average)}%
              <br />
              Based on {learningPatterns.patterns.peakPerformanceTime.sessions} sessions
            </p>
          </div>
        )}

        {/* Optimal Session Length */}
        {learningPatterns.patterns.optimalSessionLength && (
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold mb-3">Optimal Session Length</h4>
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {Math.round(learningPatterns.patterns.optimalSessionLength.optimalDuration / 60)} min
            </div>
            <p className="text-sm text-gray-600">
              Range: {learningPatterns.patterns.optimalSessionLength.range}
              <br />
              Performance: {Math.round(learningPatterns.patterns.optimalSessionLength.performance)}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const PredictionsTab = ({ progressData }) => {
  const [selectedExercise, setSelectedExercise] = useState('multipleChoice');
  const [selectedDifficulty, setSelectedDifficulty] = useState('medium');
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    if (progressData?.performance?.exerciseHistory) {
      const pred = progressEngine.predictPerformance(
        progressData.performance.exerciseHistory,
        selectedExercise,
        selectedDifficulty
      );
      setPrediction(pred);
    }
  }, [progressData, selectedExercise, selectedDifficulty]);

  if (!progressData) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      {/* Prediction Controls */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Performance Prediction</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Exercise Type
            </label>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="multipleChoice">Multiple Choice</option>
              <option value="fillInTheBlanks">Fill in the Blanks</option>
              <option value="dragAndDrop">Drag and Drop</option>
              <option value="gapFill">Gap Fill</option>
              <option value="highlight">Highlight</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prediction Results */}
      {prediction && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-2">Expected Score</h4>
            <div className={`text-3xl font-bold mb-2 ${
              prediction.expectedScore >= 80 ? 'text-green-600' :
              prediction.expectedScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {prediction.expectedScore}%
            </div>
            <div className={`text-sm px-2 py-1 rounded-full inline-block ${
              prediction.confidence === 'high' ? 'bg-green-100 text-green-800' :
              prediction.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {prediction.confidence} confidence
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-2">Recommended Difficulty</h4>
            <div className="text-2xl font-bold text-blue-600 mb-2 capitalize">
              {prediction.recommendedDifficulty}
            </div>
            <div className={`text-sm px-2 py-1 rounded-full inline-block ${
              prediction.trend === 'improving' ? 'bg-green-100 text-green-800' :
              prediction.trend === 'declining' ? 'bg-red-100 text-red-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {prediction.trend}
            </div>
          </div>

          <div className="bg-white border rounded-lg p-6">
            <h4 className="font-semibold text-gray-800 mb-2">Analysis</h4>
            <p className="text-sm text-gray-600">
              {prediction.reasoning}
            </p>
          </div>
        </div>
      )}

      {/* Enhanced Analytics Dashboard - Days 19-20 Components */}
      <div className="space-y-6">
        {/* Day 19 Core Dashboard Components */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Progress Chart */}
          <ProgressChart progressData={progressData} />
          
          {/* Skill Radar */}
          <SkillRadar progressData={progressData} />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Session Summary */}
          <SessionSummary progressData={progressData} />
          
          {/* Performance Trends */}
          <PerformanceTrends progressData={progressData} />
        </div>

        {/* Day 20 Advanced Analytics Components */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Learning Insights */}
          <LearningInsights progressData={progressData} userId={userId} />
          
          {/* Weak Areas Identifier */}
          <WeakAreasIdentifier progressData={progressData} />
        </div>
        
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Streak Tracker */}
          <StreakTracker progressData={progressData} />
          
          {/* Goal Progress */}
          <GoalProgress progressData={progressData} userId={userId} />
        </div>
      </div>

      {/* Legacy Performance Trends Section (Hidden by default) */}
      <div className="bg-white border rounded-lg p-6" style={{display: 'none'}}>
        <h3 className="text-lg font-semibold mb-4">Performance Trends (Legacy)</h3>
        <div className="space-y-4">
          {/* This would be replaced with actual chart components */}
          <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📈</div>
              <p>Performance trend chart would go here</p>
              <p className="text-sm">(Implementation requires charting library)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
