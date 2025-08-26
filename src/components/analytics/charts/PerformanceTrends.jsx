import React, { useMemo, useState } from 'react';

const PerformanceTrends = ({ progressData, timeRange = '30d' }) => {
  const [selectedTrend, setSelectedTrend] = useState('overall');
  const [viewMode, setViewMode] = useState('trends');

  // Calculate performance trends
  const trendAnalysis = useMemo(() => {
    if (!progressData?.sessionHistory?.length) return null;
    
    const sessions = progressData.sessionHistory;
    const now = new Date();
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000
    };
    
    const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange]);
    const filteredSessions = sessions.filter(session => new Date(session.startTime) >= cutoffDate);
    
    if (filteredSessions.length < 2) return null;
    
    // Split sessions into periods for comparison
    const midpoint = Math.floor(filteredSessions.length / 2);
    const earlierSessions = filteredSessions.slice(0, midpoint);
    const recentSessions = filteredSessions.slice(midpoint);
    
    const calculateAverage = (sessions, metric) => {
      const values = sessions.map(s => s[metric] || 0);
      return values.reduce((a, b) => a + b, 0) / values.length;
    };
    
    const metrics = {
      score: {
        earlier: calculateAverage(earlierSessions, 'averageScore'),
        recent: calculateAverage(recentSessions, 'averageScore'),
        unit: '%'
      },
      accuracy: {
        earlier: calculateAverage(earlierSessions, 'accuracy'),
        recent: calculateAverage(recentSessions, 'accuracy'),
        unit: '%'
      },
      duration: {
        earlier: calculateAverage(earlierSessions, 'duration'),
        recent: calculateAverage(recentSessions, 'duration'),
        unit: 'min'
      },
      engagement: {
        earlier: calculateAverage(earlierSessions, 'questionsAnswered'),
        recent: calculateAverage(recentSessions, 'questionsAnswered'),
        unit: 'questions'
      }
    };
    
    // Calculate trends
    const trends = {};
    Object.entries(metrics).forEach(([key, data]) => {
      const change = data.recent - data.earlier;
      const percentChange = data.earlier ? (change / data.earlier) * 100 : 0;
      
      trends[key] = {
        ...data,
        change,
        percentChange,
        direction: percentChange > 5 ? 'up' : percentChange < -5 ? 'down' : 'stable',
        strength: Math.abs(percentChange) > 20 ? 'strong' : Math.abs(percentChange) > 10 ? 'moderate' : 'weak'
      };
    });
    
    return trends;
  }, [progressData, timeRange]);

  // Generate insights based on trends
  const insights = useMemo(() => {
    if (!trendAnalysis) return [];
    
    const insightsList = [];
    
    Object.entries(trendAnalysis).forEach(([metric, trend]) => {
      if (trend.strength !== 'weak') {
        const icon = trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️';
        const color = trend.direction === 'up' ? 'green' : trend.direction === 'down' ? 'red' : 'blue';
        
        insightsList.push({
          metric,
          message: `${metric.charAt(0).toUpperCase() + metric.slice(1)} has ${trend.direction === 'up' ? 'improved' : trend.direction === 'down' ? 'declined' : 'remained stable'} by ${Math.abs(trend.percentChange).toFixed(1)}%`,
          icon,
          color,
          strength: trend.strength,
          recommendation: generateRecommendation(metric, trend)
        });
      }
    });
    
    return insightsList;
  }, [trendAnalysis]);

  // Generate recommendations
  const generateRecommendation = (metric, trend) => {
    if (trend.direction === 'up') {
      switch (metric) {
        case 'score':
        case 'accuracy':
          return 'Excellent progress! Consider increasing difficulty level for continued growth.';
        case 'duration':
          return 'Great engagement! Ensure you\'re maintaining quality alongside quantity.';
        case 'engagement':
          return 'Wonderful activity level! Keep up the consistent practice.';
        default:
          return 'Keep up the good work!';
      }
    } else if (trend.direction === 'down') {
      switch (metric) {
        case 'score':
        case 'accuracy':
          return 'Consider reviewing fundamental concepts or reducing difficulty temporarily.';
        case 'duration':
          return 'Try shorter, more focused sessions to rebuild momentum.';
        case 'engagement':
          return 'Mix up your exercise types to re-engage with the learning process.';
        default:
          return 'Don\'t worry - temporary dips are normal. Stay consistent!';
      }
    } else {
      return 'Stable performance. Consider new challenges to continue growing.';
    }
  };

  // Performance prediction
  const predictionData = useMemo(() => {
    if (!trendAnalysis) return null;
    
    const scoreChange = trendAnalysis.score?.percentChange || 0;
    const accuracyChange = trendAnalysis.accuracy?.percentChange || 0;
    
    const currentScore = trendAnalysis.score?.recent || 0;
    const projectedScore = Math.min(100, Math.max(0, currentScore + (scoreChange * 0.5)));
    
    return {
      current: currentScore,
      projected: projectedScore,
      confidence: Math.abs(scoreChange) < 10 ? 'high' : Math.abs(scoreChange) < 20 ? 'medium' : 'low',
      trajectory: scoreChange > 0 ? 'improving' : scoreChange < 0 ? 'declining' : 'stable'
    };
  }, [trendAnalysis]);

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Performance Trends</h3>
        <div className="flex space-x-2">
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="trends">Trends</option>
            <option value="insights">Insights</option>
            <option value="prediction">Prediction</option>
          </select>
        </div>
      </div>

      {/* Trends View */}
      {viewMode === 'trends' && trendAnalysis && (
        <div className="space-y-4">
          {Object.entries(trendAnalysis).map(([metric, trend]) => (
            <div key={metric} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-800 capitalize">{metric}</h4>
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                  trend.direction === 'up' ? 'bg-green-100 text-green-800' :
                  trend.direction === 'down' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  <span>
                    {trend.direction === 'up' ? '📈' : trend.direction === 'down' ? '📉' : '➡️'}
                  </span>
                  <span className="font-medium">
                    {trend.percentChange > 0 ? '+' : ''}{trend.percentChange.toFixed(1)}%
                  </span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-gray-600">Earlier Period</div>
                  <div className="font-semibold">
                    {metric === 'duration' 
                      ? `${Math.round(trend.earlier / 60000)}m` 
                      : `${trend.earlier.toFixed(1)}${trend.unit}`}
                  </div>
                </div>
                <div>
                  <div className="text-gray-600">Recent Period</div>
                  <div className="font-semibold">
                    {metric === 'duration' 
                      ? `${Math.round(trend.recent / 60000)}m` 
                      : `${trend.recent.toFixed(1)}${trend.unit}`}
                  </div>
                </div>
              </div>
              
              {/* Trend Visualization */}
              <div className="mt-3">
                <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                  <span>Earlier</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-400 transition-all duration-500"
                      style={{ width: `${(trend.earlier / Math.max(trend.earlier, trend.recent)) * 100}%` }}
                    ></div>
                  </div>
                  <span>Recent</span>
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        trend.direction === 'up' ? 'bg-green-500' :
                        trend.direction === 'down' ? 'bg-red-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${(trend.recent / Math.max(trend.earlier, trend.recent)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Insights View */}
      {viewMode === 'insights' && (
        <div className="space-y-4">
          {insights.length > 0 ? (
            insights.map((insight, index) => (
              <div key={index} className={`p-4 rounded-lg border-l-4 ${
                insight.color === 'green' ? 'bg-green-50 border-green-400' :
                insight.color === 'red' ? 'bg-red-50 border-red-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex items-start space-x-3">
                  <span className="text-xl">{insight.icon}</span>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-800 mb-1">
                      {insight.message}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      Strength: <span className="font-medium">{insight.strength}</span>
                    </div>
                    <div className={`text-sm ${
                      insight.color === 'green' ? 'text-green-700' :
                      insight.color === 'red' ? 'text-red-700' :
                      'text-blue-700'
                    }`}>
                      💡 {insight.recommendation}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No significant trends detected yet</p>
              <p className="text-sm">Complete more exercises to see insights</p>
            </div>
          )}
        </div>
      )}

      {/* Prediction View */}
      {viewMode === 'prediction' && predictionData && (
        <div className="space-y-6">
          <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">Performance Prediction</h4>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Score</div>
                <div className="text-3xl font-bold text-blue-600">
                  {predictionData.current.toFixed(1)}%
                </div>
              </div>
              
              <div>
                <div className="text-sm text-gray-600 mb-1">Projected Score</div>
                <div className={`text-3xl font-bold ${
                  predictionData.projected > predictionData.current ? 'text-green-600' :
                  predictionData.projected < predictionData.current ? 'text-red-600' :
                  'text-blue-600'
                }`}>
                  {predictionData.projected.toFixed(1)}%
                </div>
              </div>
            </div>
            
            <div className="mt-4 text-sm text-gray-600">
              <div className="flex justify-center items-center space-x-4">
                <span>Trajectory: <span className={`font-medium ${
                  predictionData.trajectory === 'improving' ? 'text-green-600' :
                  predictionData.trajectory === 'declining' ? 'text-red-600' :
                  'text-blue-600'
                }`}>{predictionData.trajectory}</span></span>
                
                <span>Confidence: <span className={`font-medium ${
                  predictionData.confidence === 'high' ? 'text-green-600' :
                  predictionData.confidence === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>{predictionData.confidence}</span></span>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h5 className="font-semibold text-gray-800 mb-2">What This Means</h5>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                📈 Based on your recent performance trends, your score is predicted to{' '}
                {predictionData.trajectory === 'improving' ? 'improve' :
                 predictionData.trajectory === 'declining' ? 'decline' : 'remain stable'}.
              </p>
              <p>
                🎯 This prediction has {predictionData.confidence} confidence based on{' '}
                {predictionData.confidence === 'high' ? 'consistent patterns' :
                 predictionData.confidence === 'medium' ? 'moderate patterns' :
                 'limited or inconsistent data'}.
              </p>
              <p>
                💡 {predictionData.trajectory === 'improving' 
                  ? 'Keep up your current study approach to reach your projected improvement!'
                  : predictionData.trajectory === 'declining'
                  ? 'Consider adjusting your study strategy to reverse the downward trend.'
                  : 'Try new challenges or study methods to break through the plateau.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Statistics */}
      <div className="mt-6 pt-6 border-t">
        <h4 className="font-semibold text-gray-800 mb-3">Quick Stats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">
              {progressData?.sessionHistory?.length || 0}
            </div>
            <div className="text-gray-600">Total Sessions</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">
              {trendAnalysis ? Object.values(trendAnalysis).filter(t => t.direction === 'up').length : 0}
            </div>
            <div className="text-gray-600">Improving Areas</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">
              {insights.filter(i => i.strength === 'strong').length}
            </div>
            <div className="text-gray-600">Strong Trends</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded">
            <div className="font-bold text-gray-700">
              {predictionData?.confidence || 'N/A'}
            </div>
            <div className="text-gray-600">Prediction</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceTrends;
