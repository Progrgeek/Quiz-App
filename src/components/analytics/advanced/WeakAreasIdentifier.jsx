import React, { useMemo, useState } from 'react';

const WeakAreasIdentifier = ({ progressData, analytics }) => {
  const [viewMode, setViewMode] = useState('areas');
  const [showRecommendations, setShowRecommendations] = useState(true);

  // Identify weak areas from performance data
  const weakAreas = useMemo(() => {
    if (!progressData) return [];
    
    const areas = [];
    const { skillProgress, sessionHistory, performance } = progressData;
    
    // Analyze skill breakdown
    if (skillProgress?.breakdown) {
      const breakdown = skillProgress.breakdown;
      const threshold = 60; // Consider below 60% as weak
      
      Object.entries(breakdown).forEach(([skill, value]) => {
        if (value < threshold) {
          areas.push({
            id: `skill-${skill}`,
            type: 'skill',
            area: skill,
            score: value,
            severity: value < 40 ? 'critical' : value < 50 ? 'high' : 'medium',
            description: `${skill.charAt(0).toUpperCase() + skill.slice(1)} performance is below average`,
            improvement: calculateImprovement(skill, sessionHistory),
            recommendations: getSkillRecommendations(skill, value)
          });
        }
      });
    }
    
    // Analyze exercise type performance
    if (sessionHistory?.length) {
      const exercisePerformance = {};
      
      sessionHistory.forEach(session => {
        session.exercises?.forEach(exercise => {
          const type = exercise.type || 'unknown';
          if (!exercisePerformance[type]) {
            exercisePerformance[type] = { scores: [], count: 0, totalTime: 0 };
          }
          exercisePerformance[type].scores.push(exercise.score || 0);
          exercisePerformance[type].count++;
          exercisePerformance[type].totalTime += exercise.timeToComplete || 0;
        });
      });
      
      Object.entries(exercisePerformance).forEach(([type, data]) => {
        if (data.count >= 3) { // Minimum sample size
          const averageScore = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
          const averageTime = data.totalTime / data.count;
          
          if (averageScore < 65) {
            areas.push({
              id: `exercise-${type}`,
              type: 'exercise',
              area: type,
              score: averageScore,
              severity: averageScore < 50 ? 'critical' : averageScore < 60 ? 'high' : 'medium',
              description: `${formatExerciseType(type)} exercises need improvement`,
              averageTime,
              attempts: data.count,
              recommendations: getExerciseRecommendations(type, averageScore, averageTime)
            });
          }
        }
      });
    }
    
    // Analyze time-based patterns
    if (performance?.averageTime) {
      const timeIssues = analyzeTimePatterns(sessionHistory);
      areas.push(...timeIssues);
    }
    
    // Sort by severity
    return areas.sort((a, b) => {
      const severityOrder = { critical: 3, high: 2, medium: 1 };
      return severityOrder[b.severity] - severityOrder[a.severity];
    });
  }, [progressData, analytics]);

  // Calculate improvement trend for a skill
  const calculateImprovement = (skill, sessionHistory) => {
    if (!sessionHistory?.length || sessionHistory.length < 4) return null;
    
    // This is a simplified calculation - in a real app, you'd track skill-specific data
    const recentSessions = sessionHistory.slice(-3);
    const olderSessions = sessionHistory.slice(0, 3);
    
    const recentAvg = recentSessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) / recentSessions.length;
    const olderAvg = olderSessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) / olderSessions.length;
    
    const change = recentAvg - olderAvg;
    return {
      change,
      trend: change > 2 ? 'improving' : change < -2 ? 'declining' : 'stable'
    };
  };

  // Get recommendations for skill improvement
  const getSkillRecommendations = (skill, score) => {
    const recommendations = {
      accuracy: [
        'Take time to read questions carefully',
        'Review incorrect answers to understand patterns',
        'Practice similar question types repeatedly',
        'Use hints strategically to learn correct approaches'
      ],
      speed: [
        'Practice timed exercises to build confidence',
        'Focus on pattern recognition',
        'Reduce second-guessing once you know the answer',
        'Build familiarity with question formats'
      ],
      consistency: [
        'Maintain regular study schedule',
        'Ensure consistent study environment',
        'Track energy levels and optimize study times',
        'Practice stress management techniques'
      ],
      retention: [
        'Review previous topics regularly',
        'Use spaced repetition techniques',
        'Connect new concepts to existing knowledge',
        'Take notes and create summaries'
      ],
      engagement: [
        'Try different exercise types to maintain interest',
        'Set smaller, achievable goals',
        'Take breaks to avoid fatigue',
        'Celebrate small victories and progress'
      ]
    };
    
    return recommendations[skill] || [
      'Practice regularly to improve this area',
      'Seek additional resources or help',
      'Focus on understanding rather than memorization',
      'Be patient with the learning process'
    ];
  };

  // Get recommendations for exercise types
  const getExerciseRecommendations = (type, score, averageTime) => {
    const baseRecommendations = {
      multipleChoice: [
        'Eliminate obviously wrong answers first',
        'Look for keywords in questions',
        'Practice identifying distractors'
      ],
      fillInTheBlanks: [
        'Pay attention to grammar and context clues',
        'Build vocabulary systematically',
        'Practice with word families and patterns'
      ],
      dragAndDrop: [
        'Understand the relationships between items',
        'Practice categorization skills',
        'Take time to analyze all options before deciding'
      ],
      gapFill: [
        'Read the entire text for context',
        'Consider grammatical requirements',
        'Practice with similar text types'
      ],
      highlight: [
        'Practice identifying key information',
        'Understand what type of information to look for',
        'Develop scanning and skimming skills'
      ]
    };
    
    const recommendations = baseRecommendations[type] || [
      'Practice this exercise type more frequently',
      'Understand the specific skills required',
      'Seek additional examples and practice materials'
    ];
    
    // Add time-specific recommendations
    if (averageTime > 60000) { // More than 1 minute
      recommendations.push('Work on increasing response speed');
      recommendations.push('Practice with timer to build confidence');
    }
    
    if (score < 50) {
      recommendations.unshift('Focus on understanding basic concepts first');
      recommendations.unshift('Consider reviewing fundamental skills');
    }
    
    return recommendations;
  };

  // Analyze time-based performance patterns
  const analyzeTimePatterns = (sessionHistory) => {
    if (!sessionHistory?.length) return [];
    
    const issues = [];
    
    // Check for sessions that are too short
    const shortSessions = sessionHistory.filter(s => (s.duration || 0) < 300000); // Less than 5 minutes
    if (shortSessions.length > sessionHistory.length * 0.3) {
      issues.push({
        id: 'short-sessions',
        type: 'behavior',
        area: 'Session Duration',
        score: 30,
        severity: 'medium',
        description: 'Many sessions are too short for effective learning',
        recommendations: [
          'Aim for at least 10-15 minute sessions',
          'Plan specific goals before starting',
          'Minimize distractions during study time',
          'Build up session length gradually'
        ]
      });
    }
    
    // Check for inconsistent performance
    const scores = sessionHistory.map(s => s.averageScore || 0);
    const variance = calculateVariance(scores);
    if (variance > 400) { // High variance
      issues.push({
        id: 'inconsistent-performance',
        type: 'behavior',
        area: 'Performance Consistency',
        score: 45,
        severity: 'medium',
        description: 'Performance varies significantly between sessions',
        recommendations: [
          'Identify factors that affect performance',
          'Maintain consistent study conditions',
          'Track mood and energy levels',
          'Consider optimal times for learning'
        ]
      });
    }
    
    return issues;
  };

  // Calculate variance
  const calculateVariance = (values) => {
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    return values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length;
  };

  // Format exercise type names
  const formatExerciseType = (type) => {
    return type.replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  };

  // Get severity color
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      default: return 'gray';
    }
  };

  // Create improvement plan
  const improvementPlan = useMemo(() => {
    const criticalAreas = weakAreas.filter(area => area.severity === 'critical');
    const highPriorityAreas = weakAreas.filter(area => area.severity === 'high');
    
    return {
      immediate: criticalAreas.slice(0, 2),
      shortTerm: highPriorityAreas.slice(0, 3),
      longTerm: weakAreas.filter(area => area.severity === 'medium').slice(0, 2)
    };
  }, [weakAreas]);

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Weak Areas Analysis</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode(viewMode === 'areas' ? 'plan' : 'areas')}
            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
          >
            {viewMode === 'areas' ? 'View Plan' : 'View Areas'}
          </button>
        </div>
      </div>

      {/* Areas View */}
      {viewMode === 'areas' && (
        <div className="space-y-4">
          {weakAreas.length > 0 ? (
            weakAreas.map((area) => (
              <WeakAreaCard
                key={area.id}
                area={area}
                severityColor={getSeverityColor(area.severity)}
                showRecommendations={showRecommendations}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <div className="text-4xl mb-4">🎉</div>
              <h4 className="text-lg font-semibold text-gray-800 mb-2">
                No Significant Weak Areas Detected!
              </h4>
              <p className="text-gray-600 mb-4">
                Your performance is solid across all measured areas.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-green-800 text-sm">
                  💡 Consider increasing difficulty level or exploring new exercise types to continue challenging yourself.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Improvement Plan View */}
      {viewMode === 'plan' && (
        <div className="space-y-6">
          <ImprovementPlanSection
            title="Immediate Focus (This Week)"
            areas={improvementPlan.immediate}
            color="red"
            description="Critical areas that need immediate attention"
          />
          
          <ImprovementPlanSection
            title="Short-term Goals (Next 2-4 Weeks)"
            areas={improvementPlan.shortTerm}
            color="orange"
            description="Important areas to work on once immediate issues are addressed"
          />
          
          <ImprovementPlanSection
            title="Long-term Development (1-3 Months)"
            areas={improvementPlan.longTerm}
            color="blue"
            description="Areas for ongoing improvement and mastery"
          />
        </div>
      )}

      {/* Toggle Recommendations */}
      <div className="mt-6 pt-6 border-t">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showRecommendations}
            onChange={(e) => setShowRecommendations(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-gray-700">Show detailed recommendations</span>
        </label>
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-3 bg-red-50 rounded">
          <div className="font-bold text-red-600">
            {weakAreas.filter(a => a.severity === 'critical').length}
          </div>
          <div className="text-red-800">Critical</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded">
          <div className="font-bold text-orange-600">
            {weakAreas.filter(a => a.severity === 'high').length}
          </div>
          <div className="text-orange-800">High Priority</div>
        </div>
        
        <div className="text-center p-3 bg-yellow-50 rounded">
          <div className="font-bold text-yellow-600">
            {weakAreas.filter(a => a.severity === 'medium').length}
          </div>
          <div className="text-yellow-800">Medium Priority</div>
        </div>
        
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="font-bold text-blue-600">
            {weakAreas.filter(a => a.improvement?.trend === 'improving').length}
          </div>
          <div className="text-blue-800">Improving</div>
        </div>
      </div>
    </div>
  );
};

// Individual Weak Area Card
const WeakAreaCard = ({ area, severityColor, showRecommendations }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`border rounded-lg p-4 bg-${severityColor}-50 border-${severityColor}-200`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h4 className="font-semibold text-gray-800">{area.area}</h4>
            <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${severityColor}-100 text-${severityColor}-800`}>
              {area.severity}
            </span>
            {area.improvement && (
              <span className={`text-xs ${
                area.improvement.trend === 'improving' ? 'text-green-600' :
                area.improvement.trend === 'declining' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {area.improvement.trend === 'improving' ? '📈' :
                 area.improvement.trend === 'declining' ? '📉' : '➡️'}
              </span>
            )}
          </div>
          
          <p className={`text-sm mb-3 text-${severityColor}-800`}>
            {area.description}
          </p>
          
          <div className="flex items-center space-x-4 text-sm">
            <div>
              <span className="text-gray-600">Score: </span>
              <span className="font-medium">{area.score.toFixed(1)}%</span>
            </div>
            
            {area.attempts && (
              <div>
                <span className="text-gray-600">Attempts: </span>
                <span className="font-medium">{area.attempts}</span>
              </div>
            )}
            
            {area.averageTime && (
              <div>
                <span className="text-gray-600">Avg Time: </span>
                <span className="font-medium">{Math.round(area.averageTime / 1000)}s</span>
              </div>
            )}
          </div>
          
          {showRecommendations && expanded && (
            <div className="mt-4 pt-4 border-t border-current border-opacity-20">
              <h5 className="font-medium mb-2">Recommendations:</h5>
              <ul className="space-y-1 text-sm">
                {area.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        {showRecommendations && (
          <button
            onClick={() => setExpanded(!expanded)}
            className={`text-${severityColor}-600 hover:text-${severityColor}-800 transition-colors ml-2`}
          >
            {expanded ? '▼' : '▶'}
          </button>
        )}
      </div>
    </div>
  );
};

// Improvement Plan Section
const ImprovementPlanSection = ({ title, areas, color, description }) => {
  if (areas.length === 0) return null;

  return (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
      <h4 className={`font-semibold text-${color}-800 mb-2`}>{title}</h4>
      <p className={`text-sm text-${color}-700 mb-4`}>{description}</p>
      
      <div className="space-y-2">
        {areas.map((area, index) => (
          <div key={area.id} className={`bg-white bg-opacity-70 rounded p-3`}>
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800">{area.area}</span>
              <span className="text-sm text-gray-600">{area.score.toFixed(1)}%</span>
            </div>
            <div className="text-sm text-gray-700">
              Priority {index + 1}: {area.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeakAreasIdentifier;
