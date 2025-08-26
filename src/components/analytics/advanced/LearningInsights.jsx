import React, { useMemo, useState } from 'react';

const LearningInsights = ({ analytics, progressData }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Generate AI-like insights based on performance data
  const insights = useMemo(() => {
    if (!progressData) return [];
    
    const generatedInsights = [];
    const { skillProgress, sessionHistory, performance } = progressData;
    
    // Performance insights
    if (skillProgress?.breakdown) {
      const breakdown = skillProgress.breakdown;
      
      // Accuracy insights
      if (breakdown.accuracy > 90) {
        generatedInsights.push({
          id: 'high-accuracy',
          type: 'achievement',
          category: 'performance',
          title: 'Exceptional Accuracy',
          description: `Outstanding ${breakdown.accuracy.toFixed(1)}% accuracy rate! You consistently provide correct answers.`,
          actionable: 'Consider increasing difficulty level to maintain challenge.',
          confidence: 'high',
          priority: 'medium',
          icon: '🎯'
        });
      } else if (breakdown.accuracy < 60) {
        generatedInsights.push({
          id: 'low-accuracy',
          type: 'improvement',
          category: 'performance',
          title: 'Accuracy Opportunity',
          description: `Current accuracy is ${breakdown.accuracy.toFixed(1)}%. This suggests room for improvement.`,
          actionable: 'Focus on understanding concepts before speed. Use hints when needed.',
          confidence: 'high',
          priority: 'high',
          icon: '🎯'
        });
      }
      
      // Speed insights
      if (breakdown.speed > 85 && breakdown.accuracy > 80) {
        generatedInsights.push({
          id: 'speed-accuracy-balance',
          type: 'strength',
          category: 'performance',
          title: 'Excellent Speed-Accuracy Balance',
          description: 'You maintain high accuracy while answering quickly. This shows mastery.',
          actionable: 'You\'re ready for more challenging exercises or complex topics.',
          confidence: 'high',
          priority: 'low',
          icon: '⚡'
        });
      } else if (breakdown.speed < 40) {
        generatedInsights.push({
          id: 'speed-improvement',
          type: 'suggestion',
          category: 'performance',
          title: 'Speed Enhancement Opportunity',
          description: 'Taking time to think is good, but building confidence can help with speed.',
          actionable: 'Practice similar question types to build pattern recognition.',
          confidence: 'medium',
          priority: 'medium',
          icon: '⚡'
        });
      }
      
      // Consistency insights
      if (breakdown.consistency > 80) {
        generatedInsights.push({
          id: 'high-consistency',
          type: 'strength',
          category: 'behavior',
          title: 'Remarkable Consistency',
          description: `${breakdown.consistency.toFixed(1)}% consistency shows reliable performance across sessions.`,
          actionable: 'Your steady approach is working well. Maintain your routine.',
          confidence: 'high',
          priority: 'low',
          icon: '📊'
        });
      } else if (breakdown.consistency < 50) {
        generatedInsights.push({
          id: 'consistency-concern',
          type: 'improvement',
          category: 'behavior',
          title: 'Consistency Opportunity',
          description: 'Performance varies significantly between sessions.',
          actionable: 'Try to maintain similar study conditions and energy levels.',
          confidence: 'medium',
          priority: 'medium',
          icon: '📊'
        });
      }
      
      // Engagement insights
      if (breakdown.engagement > 85) {
        generatedInsights.push({
          id: 'high-engagement',
          type: 'achievement',
          category: 'behavior',
          title: 'Exceptional Engagement',
          description: 'You show high engagement with diverse exercise types and sustained sessions.',
          actionable: 'Your engagement level is excellent. Consider setting advanced goals.',
          confidence: 'high',
          priority: 'low',
          icon: '🎮'
        });
      }
    }
    
    // Session pattern insights
    if (sessionHistory?.length >= 5) {
      const recentSessions = sessionHistory.slice(-5);
      const averageScore = recentSessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) / recentSessions.length;
      
      if (averageScore > 85) {
        generatedInsights.push({
          id: 'recent-excellence',
          type: 'achievement',
          category: 'progress',
          title: 'Recent Excellence Streak',
          description: `Your last 5 sessions averaged ${averageScore.toFixed(1)}% - exceptional performance!`,
          actionable: 'You\'re in a great flow state. Consider tackling more challenging content.',
          confidence: 'high',
          priority: 'medium',
          icon: '🔥'
        });
      }
      
      // Check for improvement trend
      const firstHalf = sessionHistory.slice(0, Math.floor(sessionHistory.length / 2));
      const secondHalf = sessionHistory.slice(Math.floor(sessionHistory.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, s) => sum + (s.averageScore || 0), 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, s) => sum + (s.averageScore || 0), 0) / secondHalf.length;
      
      const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
      
      if (improvement > 15) {
        generatedInsights.push({
          id: 'strong-improvement',
          type: 'achievement',
          category: 'progress',
          title: 'Strong Learning Curve',
          description: `You've improved by ${improvement.toFixed(1)}% from your earlier sessions. Excellent progress!`,
          actionable: 'Your learning strategy is working. Continue with your current approach.',
          confidence: 'high',
          priority: 'low',
          icon: '📈'
        });
      } else if (improvement < -10) {
        generatedInsights.push({
          id: 'performance-decline',
          type: 'concern',
          category: 'progress',
          title: 'Performance Trend Alert',
          description: `Performance has declined by ${Math.abs(improvement).toFixed(1)}% recently.`,
          actionable: 'Consider taking a break, reviewing fundamentals, or trying different exercise types.',
          confidence: 'medium',
          priority: 'high',
          icon: '📉'
        });
      }
    }
    
    // Learning behavior insights
    if (performance?.averageTime) {
      if (performance.averageTime < 15) {
        generatedInsights.push({
          id: 'fast-learner',
          type: 'strength',
          category: 'behavior',
          title: 'Quick Decision Making',
          description: `Average response time of ${performance.averageTime}s shows quick thinking.`,
          actionable: 'Balance speed with accuracy. Ensure you\'re not rushing through content.',
          confidence: 'medium',
          priority: 'low',
          icon: '🏃'
        });
      } else if (performance.averageTime > 60) {
        generatedInsights.push({
          id: 'thoughtful-learner',
          type: 'strength',
          category: 'behavior',
          title: 'Thoughtful Approach',
          description: 'You take time to consider your answers carefully before responding.',
          actionable: 'Your thorough approach is valuable. Practice building confidence to increase pace.',
          confidence: 'medium',
          priority: 'low',
          icon: '🤔'
        });
      }
    }
    
    // Add motivational insights
    generatedInsights.push({
      id: 'motivation',
      type: 'motivation',
      category: 'general',
      title: 'Learning Journey Progress',
      description: `You've completed ${performance?.totalAnswers || 0} questions across ${sessionHistory?.length || 0} sessions.`,
      actionable: 'Every question answered is progress. Keep building your knowledge step by step.',
      confidence: 'high',
      priority: 'low',
      icon: '🌟'
    });
    
    return generatedInsights.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }, [analytics, progressData]);

  // Filter insights by category
  const filteredInsights = useMemo(() => {
    if (selectedCategory === 'all') return insights;
    return insights.filter(insight => insight.category === selectedCategory);
  }, [insights, selectedCategory]);

  // Get insight type styles
  const getInsightStyles = (type) => {
    switch (type) {
      case 'achievement':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'improvement':
      case 'concern':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'suggestion':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'strength':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'motivation':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  // Get confidence indicator
  const getConfidenceIndicator = (confidence) => {
    switch (confidence) {
      case 'high':
        return { icon: '🟢', text: 'High Confidence' };
      case 'medium':
        return { icon: '🟡', text: 'Medium Confidence' };
      case 'low':
        return { icon: '🔴', text: 'Low Confidence' };
      default:
        return { icon: '⚪', text: 'Unknown' };
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Personalized Learning Insights</h3>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">AI-Generated</span>
          <span className="text-xl">🤖</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {['all', 'performance', 'behavior', 'progress', 'general'].map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
              {category !== 'all' && (
                <span className="ml-1 text-xs">
                  ({insights.filter(i => i.category === category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-4">
        {filteredInsights.length > 0 ? (
          filteredInsights.map((insight) => (
            <InsightCard
              key={insight.id}
              insight={insight}
              styles={getInsightStyles(insight.type)}
              confidenceIndicator={getConfidenceIndicator(insight.confidence)}
            />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No insights available for this category</p>
            <p className="text-sm">Complete more exercises to generate insights</p>
          </div>
        )}
      </div>

      {/* Insights Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Insights Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="font-bold text-green-600">
              {insights.filter(i => i.type === 'achievement').length}
            </div>
            <div className="text-gray-600">Achievements</div>
          </div>
          
          <div className="text-center">
            <div className="font-bold text-blue-600">
              {insights.filter(i => i.type === 'strength').length}
            </div>
            <div className="text-gray-600">Strengths</div>
          </div>
          
          <div className="text-center">
            <div className="font-bold text-yellow-600">
              {insights.filter(i => i.type === 'suggestion').length}
            </div>
            <div className="text-gray-600">Suggestions</div>
          </div>
          
          <div className="text-center">
            <div className="font-bold text-red-600">
              {insights.filter(i => i.type === 'improvement' || i.type === 'concern').length}
            </div>
            <div className="text-gray-600">Areas to Focus</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Individual Insight Card Component
const InsightCard = ({ insight, styles, confidenceIndicator }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg p-4 ${styles}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <span className="text-2xl flex-shrink-0">{insight.icon}</span>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold">{insight.title}</h4>
              <span className="text-xs px-2 py-1 bg-white bg-opacity-70 rounded-full">
                {insight.type}
              </span>
            </div>
            
            <p className="text-sm mb-3 opacity-90">
              {insight.description}
            </p>
            
            {insight.actionable && (
              <div className="text-sm">
                <strong>Action:</strong> {insight.actionable}
              </div>
            )}
            
            {expanded && (
              <div className="mt-3 pt-3 border-t border-current border-opacity-20">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2">
                    <span>{confidenceIndicator.icon}</span>
                    <span>{confidenceIndicator.text}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>Priority:</span>
                    <span className="font-medium capitalize">{insight.priority}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs opacity-70 hover:opacity-100 transition-opacity ml-2"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>
    </div>
  );
};

export default LearningInsights;
