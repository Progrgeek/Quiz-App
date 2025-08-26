import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LearningAnalyticsEngine from '../../ai/analytics/LearningAnalyticsEngine';
import UserProfileEngine from '../../ai/profiling/UserProfileEngine';
import AdaptiveDifficultyEngine from '../../ai/difficulty/AdaptiveDifficultyEngine';

const AIAnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics] = useState(new LearningAnalyticsEngine());
  const [profiler] = useState(new UserProfileEngine());
  const [difficultyEngine] = useState(new AdaptiveDifficultyEngine());
  const [userId] = useState('demo-user-123');
  
  const [analyticsData, setAnalyticsData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [difficultyAnalysis, setDifficultyAnalysis] = useState(null);
  const [realTimeInsights, setRealTimeInsights] = useState(null);

  const tabs = [
    { id: 'analytics', name: 'Learning Analytics', icon: '📊' },
    { id: 'profile', name: 'User Profile', icon: '👤' },
    { id: 'difficulty', name: 'Adaptive Difficulty', icon: '🎯' },
    { id: 'insights', name: 'Real-time Insights', icon: '🧠' }
  ];

  useEffect(() => {
    // Initialize demo data and analysis
    const initializeData = async () => {
      // Simulate some learning events
      analytics.trackEvent(userId, 'exercise_start', { exerciseType: 'reading', difficulty: 0.6 });
      analytics.trackEvent(userId, 'exercise_complete', { 
        exerciseType: 'reading', 
        score: 85, 
        timeToComplete: 120000,
        difficulty: 0.6 
      });
      
      // Generate analytics
      const patterns = analytics.analyzeLearningPatterns(userId, '7days');
      setAnalyticsData(patterns);
      
      // Build user profile
      const profile = profiler.buildUserProfile(userId);
      setUserProfile(profile);
      
      // Analyze difficulty
      const difficulty = difficultyEngine.calculateOptimalDifficulty(userId, 'reading');
      setDifficultyAnalysis(difficulty);
      
      // Get real-time insights
      const insights = analytics.generateRealTimeInsights(userId);
      setRealTimeInsights(insights);
    };

    initializeData();
  }, [analytics, profiler, difficultyEngine, userId]);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            🤖 AI & Personalization Dashboard
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            Phase 5: Advanced AI-driven learning analytics and personalization
          </p>
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
            <span>🚀 Live AI Analysis</span>
          </div>
        </motion.div>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'analytics' && (
            <LearningAnalyticsTab data={analyticsData} />
          )}
          
          {activeTab === 'profile' && (
            <UserProfileTab profile={userProfile} />
          )}
          
          {activeTab === 'difficulty' && (
            <AdaptiveDifficultyTab analysis={difficultyAnalysis} />
          )}
          
          {activeTab === 'insights' && (
            <RealTimeInsightsTab insights={realTimeInsights} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Learning Analytics Tab
const LearningAnalyticsTab = ({ data }) => {
  if (!data) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Performance Patterns */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📈 Performance Patterns</h3>
        
        {data.patterns?.performance ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="text-sm text-blue-600 font-medium">Current Accuracy</div>
                <div className="text-2xl font-bold text-blue-700">
                  {Math.round((data.patterns.performance.accuracy?.current || 0) * 100)}%
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <div className="text-sm text-green-600 font-medium">Overall Trend</div>
                <div className="text-2xl font-bold text-green-700 capitalize">
                  {data.patterns.performance.trend || 'Stable'}
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Consistency Score</span>
                <span className="font-medium">
                  {Math.round((data.patterns.performance.consistency || 0) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(data.patterns.performance.consistency || 0) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No performance data available</div>
        )}
      </div>

      {/* Engagement Patterns */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Engagement Analysis</h3>
        
        {data.patterns?.engagement ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 font-medium">Session Quality</div>
                <div className="text-2xl font-bold text-purple-700">
                  {Math.round((data.patterns.engagement.sessionQuality?.consistency || 0) * 100)}%
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 font-medium">Motivation Level</div>
                <div className="text-2xl font-bold text-orange-700">
                  {Math.round((data.patterns.engagement.motivation?.persistence || 0) * 100)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pause Frequency</span>
                <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                  {data.patterns.engagement.interaction?.pauseFrequency || 0} per session
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Hint Usage</span>
                <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  {Math.round((data.patterns.engagement.interaction?.hintUsage || 0) * 100)}%
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No engagement data available</div>
        )}
      </div>

      {/* Behavior Patterns */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 Identified Behavior Patterns</h3>
        
        {data.patterns?.behavior && data.patterns.behavior.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.patterns.behavior.map((pattern, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium text-gray-800 capitalize">
                    {pattern.name.replace('_', ' ').toLowerCase()}
                  </div>
                  <div className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {Math.round(pattern.strength * 100)}%
                  </div>
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  Confidence: {Math.round(pattern.confidence * 100)}%
                </div>
                <div className="space-y-1">
                  {pattern.recommendations.slice(0, 2).map((rec, idx) => (
                    <div key={idx} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                      {rec.replace('_', ' ')}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-8">
            More practice needed to identify behavior patterns
          </div>
        )}
      </div>
    </div>
  );
};

// User Profile Tab
const UserProfileTab = ({ profile }) => {
  if (!profile) {
    return <div className="text-center py-8">Building user profile...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Cognitive Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🧠 Cognitive Profile</h3>
        
        <div className="space-y-4">
          {Object.entries(profile.cognitive || {}).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">
                  {typeof value === 'number' ? Math.round(value * 100) + '%' : 'N/A'}
                </span>
              </div>
              {typeof value === 'number' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${value * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Learning Style */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Learning Style</h3>
        
        {profile.learningStyle ? (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-3">
              Primary Style: <span className="font-medium text-purple-600 capitalize">
                {profile.learningStyle.primaryStyle || 'Mixed'}
              </span>
            </div>
            
            <div className="space-y-3">
              {Object.entries(profile.learningStyle.preferences || {}).map(([style, preference]) => (
                <div key={style} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 capitalize">{style}</span>
                    <span className="text-sm font-medium">
                      {Math.round(preference * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${preference * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Learning style assessment in progress...</div>
        )}
      </div>

      {/* Personality Traits */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎭 Personality Traits</h3>
        
        <div className="space-y-4">
          {Object.entries(profile.personality || {}).map(([trait, score]) => (
            <div key={trait} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">
                  {trait.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">
                  {typeof score === 'number' ? Math.round(score * 100) + '%' : 'N/A'}
                </span>
              </div>
              {typeof score === 'number' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${score * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Motivation Profile */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🔥 Motivation Profile</h3>
        
        <div className="space-y-4">
          {Object.entries(profile.motivation || {}).map(([factor, level]) => (
            <div key={factor} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 capitalize">
                  {factor.replace(/([A-Z])/g, ' $1').trim()}
                </span>
                <span className="font-medium">
                  {typeof level === 'number' ? Math.round(level * 100) + '%' : 'N/A'}
                </span>
              </div>
              {typeof level === 'number' && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-600 h-2 rounded-full"
                    style={{ width: `${level * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Adaptive Difficulty Tab
const AdaptiveDifficultyTab = ({ analysis }) => {
  if (!analysis) {
    return <div className="text-center py-8">Analyzing optimal difficulty...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current Difficulty Analysis */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Optimal Difficulty</h3>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">
              {Math.round(analysis.difficulty * 100)}%
            </div>
            <div className="text-gray-600">Recommended Difficulty Level</div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Confidence Level</span>
              <span className="font-medium">
                {Math.round(analysis.confidence * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${analysis.confidence * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium mb-2">Key Factors</div>
            <div className="space-y-1 text-sm text-blue-700">
              <div>Base Level: {Math.round(analysis.reasoning.base * 100)}%</div>
              {Object.entries(analysis.reasoning.adjustments).map(([key, value]) => (
                <div key={key} className="capitalize">
                  {key}: {value > 0 ? '+' : ''}{Math.round(value * 100)}%
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Zone of Proximal Development */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">📚 Learning Zone Analysis</h3>
        
        {analysis.zpdAnalysis ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="text-lg font-medium text-purple-600 capitalize mb-2">
                {analysis.zpdAnalysis.zoneStatus.replace('_', ' ')}
              </div>
              <div className="text-sm text-gray-600">Current Zone Status</div>
            </div>

            <div className="relative">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Comfort</span>
                <span>Learning</span>
                <span>Frustration</span>
              </div>
              <div className="w-full bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded-full h-4 relative">
                <div 
                  className="absolute top-0 left-0 w-2 h-4 bg-blue-600 rounded-full transform -translate-x-1"
                  style={{ left: `${analysis.zpdAnalysis.proposedDifficulty * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-sm text-purple-600 font-medium mb-2">Recommendations</div>
              <div className="space-y-1 text-sm text-purple-700">
                {analysis.zpdAnalysis.recommendations?.map((rec, index) => (
                  <div key={index}>• {rec}</div>
                )) || <div>Optimal difficulty level</div>}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">ZPD analysis not available</div>
        )}
      </div>

      {/* Flow State Potential */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🌊 Flow State Potential</h3>
        
        {analysis.flowPotential ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {Math.round(analysis.flowPotential.flowPotential * 100)}%
                </div>
                <div className="text-gray-600">Flow State Potential</div>
                <div className={`text-sm px-3 py-1 rounded-full inline-block mt-2 ${
                  analysis.flowPotential.flowState === 'high' ? 'bg-green-100 text-green-800' :
                  analysis.flowPotential.flowState === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {analysis.flowPotential.flowState.toUpperCase()} POTENTIAL
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="text-sm font-medium text-gray-700 mb-3">Flow Factors</div>
              {Object.entries(analysis.flowPotential.flowFactors).map(([factor, score]) => (
                <div key={factor} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600 capitalize">
                      {factor.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs font-medium">
                      {Math.round(score * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div 
                      className="bg-green-600 h-1.5 rounded-full"
                      style={{ width: `${score * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-gray-500">Flow analysis not available</div>
        )}
      </div>
    </div>
  );
};

// Real-time Insights Tab
const RealTimeInsightsTab = ({ insights }) => {
  if (!insights) {
    return <div className="text-center py-8">Generating real-time insights...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Current State */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">⚡ Current State</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(insights.motivationLevel * 100)}%
              </div>
              <div className="text-sm text-blue-700">Motivation</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {insights.engagementRisk === 'low' ? '✅' : 
                 insights.engagementRisk === 'medium' ? '⚠️' : '🚨'}
              </div>
              <div className="text-sm text-green-700">Engagement Risk</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Struggle Level</span>
              <span className="font-medium">
                {Math.round(insights.currentStruggleLevel * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  insights.currentStruggleLevel < 0.3 ? 'bg-green-600' :
                  insights.currentStruggleLevel < 0.7 ? 'bg-yellow-600' : 'bg-red-600'
                }`}
                style={{ width: `${insights.currentStruggleLevel * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm text-gray-600 font-medium mb-2">Learning State</div>
            <div className="text-lg font-medium text-gray-800 capitalize">
              {insights.learningState || 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Recommendations</h3>
        
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium mb-2">Next Best Action</div>
            <div className="text-purple-800 capitalize">
              {insights.nextBestAction?.replace('_', ' ') || 'Continue practicing'}
            </div>
          </div>

          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-sm text-orange-600 font-medium mb-2">Optimal Difficulty</div>
            <div className="text-2xl font-bold text-orange-700">
              {Math.round(insights.optimalDifficulty * 100)}%
            </div>
          </div>

          {insights.interventionSuggestions && insights.interventionSuggestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-700">Suggested Interventions</div>
              {insights.interventionSuggestions.map((suggestion, index) => (
                <div key={index} className="text-sm bg-blue-50 text-blue-700 px-3 py-2 rounded">
                  {suggestion.replace('_', ' ')}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🤖 AI System Status</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🧠</div>
            <div className="font-medium text-green-800">Learning Analytics</div>
            <div className="text-sm text-green-600">Active & Monitoring</div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">👤</div>
            <div className="font-medium text-blue-800">User Profiling</div>
            <div className="text-sm text-blue-600">Continuously Learning</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-3xl mb-2">🎯</div>
            <div className="font-medium text-purple-800">Adaptive Difficulty</div>
            <div className="text-sm text-purple-600">Real-time Optimization</div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="text-sm text-blue-700">
            <strong>🚀 Phase 5 AI Features:</strong> Advanced learning analytics, user profiling, and adaptive difficulty 
            are now actively personalizing the learning experience. The system continuously learns from user 
            behavior to optimize engagement and learning outcomes.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalyticsDashboard;
