/**
 * Advanced Learning Pattern Analysis Engine
 * Implements learning curve analysis, performance prediction, and retention analysis
 */

export class LearningPatternAnalyzer {
  constructor() {
    this.analysisTypes = {
      LEARNING_CURVE: 'learning_curve',
      RETENTION_ANALYSIS: 'retention_analysis',
      PERFORMANCE_PREDICTION: 'performance_prediction',
      OPTIMAL_CONDITIONS: 'optimal_conditions',
      PEER_COMPARISON: 'peer_comparison'
    };
  }

  /**
   * Analyze learning curves to identify improvement patterns
   */
  analyzeLearningCurve(userHistory) {
    const sessions = this.groupBySession(userHistory);
    const curve = sessions.map((session, index) => ({
      sessionNumber: index + 1,
      averageScore: session.averageScore,
      timeToComplete: session.averageTime,
      efficiency: session.averageScore / (session.averageTime / 60), // Score per minute
      exerciseCount: session.exercises.length,
      date: session.date,
      improvements: this.calculateImprovements(session, sessions[index - 1])
    }));

    const analysis = {
      curve,
      trend: this.calculateTrend(curve),
      plateauPoints: this.identifyPlateaus(curve),
      breakthroughPoints: this.identifyBreakthroughs(curve),
      learningVelocity: this.calculateLearningVelocity(curve),
      prediction: this.predictNextPerformance(curve),
      recommendations: this.generateCurveRecommendations(curve)
    };

    return analysis;
  }

  /**
   * Group user history data by learning sessions
   */
  groupBySession(userHistory) {
    const sessionMap = new Map();
    
    userHistory.forEach(exercise => {
      const sessionDate = new Date(exercise.timestamp).toDateString();
      
      if (!sessionMap.has(sessionDate)) {
        sessionMap.set(sessionDate, {
          date: sessionDate,
          exercises: [],
          totalScore: 0,
          totalTime: 0,
          exerciseTypes: new Set()
        });
      }
      
      const session = sessionMap.get(sessionDate);
      session.exercises.push(exercise);
      session.totalScore += exercise.score;
      session.totalTime += exercise.timeToComplete;
      session.exerciseTypes.add(exercise.exerciseType);
    });

    return Array.from(sessionMap.values()).map(session => ({
      ...session,
      averageScore: session.totalScore / session.exercises.length,
      averageTime: session.totalTime / session.exercises.length,
      exerciseTypes: Array.from(session.exerciseTypes)
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  /**
   * Calculate performance trend using linear regression
   */
  calculateTrend(curve) {
    if (curve.length < 2) return { slope: 0, direction: 'stable', confidence: 0 };

    const n = curve.length;
    const sumX = curve.reduce((sum, _, i) => sum + i, 0);
    const sumY = curve.reduce((sum, point) => sum + point.averageScore, 0);
    const sumXY = curve.reduce((sum, point, i) => sum + i * point.averageScore, 0);
    const sumXX = curve.reduce((sum, _, i) => sum + i * i, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Calculate R-squared for confidence
    const meanY = sumY / n;
    const ssRes = curve.reduce((sum, point, i) => {
      const predicted = slope * i + intercept;
      return sum + Math.pow(point.averageScore - predicted, 2);
    }, 0);
    const ssTot = curve.reduce((sum, point) => sum + Math.pow(point.averageScore - meanY, 2), 0);
    const rSquared = 1 - (ssRes / ssTot);

    return {
      slope,
      intercept,
      direction: slope > 0.5 ? 'improving' : slope < -0.5 ? 'declining' : 'stable',
      confidence: Math.max(0, rSquared),
      equation: `y = ${slope.toFixed(2)}x + ${intercept.toFixed(2)}`,
      interpretation: this.interpretTrend(slope, rSquared)
    };
  }

  /**
   * Identify plateau points in learning curve
   */
  identifyPlateaus(curve) {
    const plateaus = [];
    const windowSize = 3; // Look at 3-session windows
    
    for (let i = windowSize; i < curve.length - windowSize; i++) {
      const window = curve.slice(i - windowSize, i + windowSize + 1);
      const variance = this.calculateVariance(window.map(p => p.averageScore));
      
      // Low variance indicates plateau
      if (variance < 25) { // Threshold for plateau detection
        plateaus.push({
          startSession: i - windowSize + 1,
          endSession: i + windowSize + 1,
          averageScore: window.reduce((sum, p) => sum + p.averageScore, 0) / window.length,
          duration: windowSize * 2 + 1,
          recommendations: this.generatePlateauRecommendations(window)
        });
      }
    }

    return this.mergePlateaus(plateaus);
  }

  /**
   * Identify breakthrough points (significant improvements)
   */
  identifyBreakthroughs(curve) {
    const breakthroughs = [];
    
    for (let i = 1; i < curve.length; i++) {
      const improvement = curve[i].averageScore - curve[i - 1].averageScore;
      const efficiencyImprovement = curve[i].efficiency - curve[i - 1].efficiency;
      
      // Significant improvement threshold
      if (improvement > 10 && efficiencyImprovement > 0.5) {
        breakthroughs.push({
          sessionNumber: curve[i].sessionNumber,
          scoreImprovement: improvement,
          efficiencyImprovement,
          beforeScore: curve[i - 1].averageScore,
          afterScore: curve[i].averageScore,
          analysis: this.analyzeBreakthrough(curve[i - 1], curve[i])
        });
      }
    }

    return breakthroughs;
  }

  /**
   * Calculate learning velocity (rate of improvement)
   */
  calculateLearningVelocity(curve) {
    if (curve.length < 3) return 0;

    const recentSessions = curve.slice(-5); // Last 5 sessions
    const improvements = [];
    
    for (let i = 1; i < recentSessions.length; i++) {
      improvements.push(recentSessions[i].averageScore - recentSessions[i - 1].averageScore);
    }

    return improvements.reduce((sum, imp) => sum + imp, 0) / improvements.length;
  }

  /**
   * Predict next performance based on historical patterns
   */
  predictNextPerformance(curve) {
    if (curve.length < 3) {
      return {
        predictedScore: curve[curve.length - 1]?.averageScore || 0,
        confidence: 0,
        range: { min: 0, max: 100 }
      };
    }

    const trend = this.calculateTrend(curve);
    const recentPerformance = curve.slice(-3);
    const avgRecent = recentPerformance.reduce((sum, p) => sum + p.averageScore, 0) / recentPerformance.length;
    
    // Use trend to predict next score
    const predictedScore = Math.max(0, Math.min(100, 
      trend.slope * curve.length + trend.intercept
    ));

    // Calculate prediction confidence based on trend stability
    const confidence = trend.confidence * 0.8; // Reduce confidence for predictions

    // Calculate prediction range
    const standardDeviation = this.calculateStandardDeviation(curve.map(p => p.averageScore));
    const margin = standardDeviation * (1 - confidence);

    return {
      predictedScore: Math.round(predictedScore),
      confidence,
      range: {
        min: Math.max(0, Math.round(predictedScore - margin)),
        max: Math.min(100, Math.round(predictedScore + margin))
      },
      factors: this.identifyPredictionFactors(curve),
      recommendations: this.generatePredictionRecommendations(predictedScore, confidence)
    };
  }

  /**
   * Find optimal learning conditions
   */
  findOptimalConditions(userHistory) {
    const conditions = userHistory.map(session => ({
      timeOfDay: new Date(session.timestamp).getHours(),
      dayOfWeek: new Date(session.timestamp).getDay(),
      sessionLength: session.timeToComplete,
      exerciseType: session.exerciseType,
      performance: session.score,
      efficiency: session.score / (session.timeToComplete / 60)
    }));

    return {
      bestTimeOfDay: this.findBestTime(conditions),
      optimalSessionLength: this.findOptimalDuration(conditions),
      preferredExerciseTypes: this.findPreferredTypes(conditions),
      bestDayOfWeek: this.findBestDay(conditions),
      performanceFactors: this.identifyPerformanceFactors(conditions),
      recommendations: this.generateOptimalConditionRecommendations(conditions)
    };
  }

  /**
   * Compare user performance with peer group
   */
  compareToPeers(userStats, peerGroup = []) {
    if (peerGroup.length === 0) {
      // Generate mock peer data for demonstration
      peerGroup = this.generateMockPeerData();
    }

    const userPercentile = this.calculatePercentile(userStats.averageScore, peerGroup.map(p => p.averageScore));
    
    return {
      percentile: userPercentile,
      ranking: this.calculateRanking(userStats, peerGroup),
      strongerAreas: this.findStrongerAreas(userStats, peerGroup),
      improvementAreas: this.findImprovementAreas(userStats, peerGroup),
      peerInsights: this.generatePeerInsights(userStats, peerGroup),
      motivationalComparison: this.generateMotivationalComparison(userPercentile)
    };
  }

  /**
   * Analyze retention patterns
   */
  analyzeRetention(userHistory) {
    const sessions = this.groupBySession(userHistory);
    const retentionData = [];

    sessions.forEach((session, index) => {
      if (index > 0) {
        const daysBetween = (new Date(session.date) - new Date(sessions[index - 1].date)) / (1000 * 60 * 60 * 24);
        retentionData.push({
          sessionGap: daysBetween,
          performanceChange: session.averageScore - sessions[index - 1].averageScore,
          sessionNumber: index + 1
        });
      }
    });

    return {
      averageSessionGap: retentionData.reduce((sum, r) => sum + r.sessionGap, 0) / retentionData.length,
      retentionPattern: this.identifyRetentionPattern(retentionData),
      riskFactors: this.identifyRetentionRisks(retentionData),
      recommendations: this.generateRetentionRecommendations(retentionData)
    };
  }

  // Helper methods
  calculateVariance(values) {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
  }

  calculateStandardDeviation(values) {
    return Math.sqrt(this.calculateVariance(values));
  }

  calculatePercentile(value, dataset) {
    const sorted = dataset.sort((a, b) => a - b);
    const below = sorted.filter(v => v < value).length;
    return (below / sorted.length) * 100;
  }

  generateMockPeerData() {
    // Generate realistic peer data for demonstration
    const peers = [];
    for (let i = 0; i < 100; i++) {
      peers.push({
        averageScore: Math.max(0, Math.min(100, 
          70 + (Math.random() - 0.5) * 40 // Normal distribution around 70
        )),
        exercisesCompleted: Math.floor(Math.random() * 200) + 50,
        timeStudied: Math.floor(Math.random() * 3600) + 1800 // 30min to 90min
      });
    }
    return peers;
  }

  interpretTrend(slope, confidence) {
    if (confidence < 0.3) return "Insufficient data for reliable trend analysis";
    if (slope > 1) return "Strong improvement trend - excellent progress!";
    if (slope > 0.5) return "Steady improvement - keep up the good work!";
    if (slope > -0.5) return "Stable performance - consider new challenges";
    return "Declining trend - recommend reviewing study methods";
  }

  generateCurveRecommendations(curve) {
    const recommendations = [];
    const trend = this.calculateTrend(curve);
    
    if (trend.direction === 'declining') {
      recommendations.push("Consider taking a short break to avoid burnout");
      recommendations.push("Try switching to easier exercises to rebuild confidence");
    } else if (trend.direction === 'stable') {
      recommendations.push("Increase exercise difficulty to challenge yourself");
      recommendations.push("Try new exercise types to stimulate learning");
    } else {
      recommendations.push("Great progress! Continue with current approach");
      recommendations.push("Consider setting more ambitious goals");
    }

    return recommendations;
  }

  // Additional helper methods would be implemented here...
  findBestTime(conditions) {
    const hourlyPerformance = {};
    conditions.forEach(c => {
      if (!hourlyPerformance[c.timeOfDay]) hourlyPerformance[c.timeOfDay] = [];
      hourlyPerformance[c.timeOfDay].push(c.performance);
    });

    let bestHour = 9; // Default
    let bestAverage = 0;
    
    Object.entries(hourlyPerformance).forEach(([hour, scores]) => {
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      if (average > bestAverage) {
        bestAverage = average;
        bestHour = parseInt(hour);
      }
    });

    return {
      hour: bestHour,
      averagePerformance: bestAverage,
      timeRange: `${bestHour}:00 - ${bestHour + 1}:00`
    };
  }

  findOptimalDuration(conditions) {
    // Group by duration ranges and find optimal
    const durationRanges = {
      short: conditions.filter(c => c.sessionLength < 600), // < 10 min
      medium: conditions.filter(c => c.sessionLength >= 600 && c.sessionLength < 1800), // 10-30 min
      long: conditions.filter(c => c.sessionLength >= 1800) // > 30 min
    };

    const averages = {};
    Object.entries(durationRanges).forEach(([range, sessions]) => {
      if (sessions.length > 0) {
        averages[range] = sessions.reduce((sum, s) => sum + s.performance, 0) / sessions.length;
      }
    });

    const optimal = Object.entries(averages).reduce((best, [range, avg]) => 
      avg > best.average ? { range, average: avg } : best
    , { range: 'medium', average: 0 });

    return optimal;
  }

  generateOptimalConditionRecommendations(conditions) {
    const bestTime = this.findBestTime(conditions);
    const optimalDuration = this.findOptimalDuration(conditions);

    return [
      `Your peak performance time is around ${bestTime.timeRange}`,
      `Optimal session length appears to be ${optimalDuration.range} duration`,
      "Try to schedule practice sessions during your peak hours",
      "Monitor your energy levels and adjust accordingly"
    ];
  }
}

export default LearningPatternAnalyzer;
