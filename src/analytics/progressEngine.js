/**
 * Progress Calculation Engine
 * Advanced algorithms for calculating skill progression, learning patterns, and performance analytics
 */

import { analyticsTracker, ANALYTICS_EVENTS } from './eventTracker.js';

class ProgressEngine {
  constructor() {
    this.skillWeights = {
      accuracy: 0.4,      // How often they get answers correct
      speed: 0.2,         // How quickly they answer
      consistency: 0.2,   // How consistent their performance is
      retention: 0.1,     // How well they retain knowledge over time
      engagement: 0.1     // How engaged they are with the material
    };
    
    this.difficultyMultipliers = {
      easy: 0.8,
      medium: 1.0,
      hard: 1.3,
      expert: 1.6
    };
  }
  
  // Calculate overall skill level based on performance
  calculateSkillLevel(userPerformance, skillType = 'overall') {
    const {
      correctAnswers = 0,
      totalAnswers = 1,
      averageTime = 30,
      sessions = [],
      exerciseHistory = []
    } = userPerformance;
    
    // Base accuracy calculation
    const accuracy = correctAnswers / Math.max(totalAnswers, 1);
    
    // Speed factor (optimal time varies by exercise type)
    const optimalTime = this.getOptimalTimeForSkill(skillType);
    const speedFactor = this.calculateSpeedFactor(averageTime, optimalTime);
    
    // Consistency factor based on performance variance
    const consistencyFactor = this.calculateConsistency(exerciseHistory);
    
    // Retention factor based on performance over time
    const retentionFactor = this.calculateRetention(sessions);
    
    // Engagement factor based on session completion and interaction
    const engagementFactor = this.calculateEngagement(sessions);
    
    // Weighted skill level calculation
    const weightedScore = (
      accuracy * this.skillWeights.accuracy +
      speedFactor * this.skillWeights.speed +
      consistencyFactor * this.skillWeights.consistency +
      retentionFactor * this.skillWeights.retention +
      engagementFactor * this.skillWeights.engagement
    );
    
    // Convert to 1-10 scale with difficulty consideration
    const difficultyBonus = this.calculateDifficultyBonus(exerciseHistory);
    const skillLevel = Math.min(10, Math.max(1, 
      Math.floor((weightedScore + difficultyBonus) * 10)
    ));
    
    return {
      level: skillLevel,
      breakdown: {
        accuracy: accuracy * 100,
        speed: speedFactor * 100,
        consistency: consistencyFactor * 100,
        retention: retentionFactor * 100,
        engagement: engagementFactor * 100
      },
      xp: this.calculateXP(weightedScore, exerciseHistory.length),
      nextLevelXP: this.getXPRequiredForLevel(skillLevel + 1),
      progress: this.calculateLevelProgress(weightedScore, skillLevel)
    };
  }
  
  // Calculate speed factor (higher is better, but not linearly)
  calculateSpeedFactor(actualTime, optimalTime) {
    if (actualTime <= 0) return 0;
    
    const ratio = optimalTime / actualTime;
    
    // Optimal performance is at the target time
    if (ratio >= 0.8 && ratio <= 1.2) {
      return 1.0; // Perfect speed
    } else if (ratio > 1.2) {
      // Too fast - might be guessing
      return Math.max(0.7, 1.0 - (ratio - 1.2) * 0.5);
    } else {
      // Too slow
      return Math.max(0.3, ratio * 1.25);
    }
  }
  
  // Calculate consistency based on score variance
  calculateConsistency(exerciseHistory) {
    if (exerciseHistory.length < 3) return 0.5; // Not enough data
    
    const scores = exerciseHistory.map(ex => ex.score || 0);
    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower standard deviation = higher consistency
    // Normalize to 0-1 scale (assuming max reasonable SD is 30)
    return Math.max(0, 1 - (standardDeviation / 30));
  }
  
  // Calculate retention based on performance over time
  calculateRetention(sessions) {
    if (sessions.length < 2) return 0.5; // Not enough data
    
    // Look at performance trend over recent sessions
    const recentSessions = sessions.slice(-10); // Last 10 sessions
    const scores = recentSessions.map(s => s.averageScore || 0);
    
    if (scores.length < 2) return 0.5;
    
    // Calculate trend - are they maintaining or improving?
    const trend = this.calculateTrend(scores);
    
    // Also look at gaps between sessions
    const sessionGaps = this.calculateSessionGaps(recentSessions);
    const gapPenalty = this.calculateGapPenalty(sessionGaps);
    
    return Math.max(0, Math.min(1, 0.5 + trend * 0.3 + (1 - gapPenalty) * 0.2));
  }
  
  // Calculate engagement based on session behavior
  calculateEngagement(sessions) {
    if (sessions.length === 0) return 0;
    
    let engagementScore = 0;
    let factors = 0;
    
    // Session completion rate
    const completedSessions = sessions.filter(s => s.status === 'completed').length;
    const completionRate = completedSessions / sessions.length;
    engagementScore += completionRate * 0.3;
    factors += 0.3;
    
    // Average session length vs optimal
    const avgSessionLength = sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length;
    const optimalLength = 1800; // 30 minutes
    const lengthScore = Math.min(1, avgSessionLength / optimalLength);
    engagementScore += lengthScore * 0.2;
    factors += 0.2;
    
    // Interaction diversity (different exercise types)
    const exerciseTypes = new Set();
    sessions.forEach(s => s.exercises?.forEach(e => exerciseTypes.add(e.type)));
    const diversityScore = Math.min(1, exerciseTypes.size / 5); // Assume 5 main types
    engagementScore += diversityScore * 0.2;
    factors += 0.2;
    
    // Help-seeking behavior (optimal amount of hint usage)
    const totalHints = sessions.reduce((sum, s) => sum + (s.hintsUsed || 0), 0);
    const totalQuestions = sessions.reduce((sum, s) => sum + (s.questionsAnswered || 0), 0);
    const hintRatio = totalQuestions > 0 ? totalHints / totalQuestions : 0;
    const optimalHintRatio = 0.1; // 10% is considered optimal
    const hintScore = 1 - Math.abs(hintRatio - optimalHintRatio) / optimalHintRatio;
    engagementScore += Math.max(0, hintScore) * 0.15;
    factors += 0.15;
    
    // Recent activity (recency bonus)
    const lastSession = sessions[sessions.length - 1];
    const daysSinceLastSession = lastSession ? 
      (Date.now() - new Date(lastSession.endTime).getTime()) / (1000 * 60 * 60 * 24) : 30;
    const recencyScore = Math.max(0, 1 - daysSinceLastSession / 7); // Drops to 0 after a week
    engagementScore += recencyScore * 0.15;
    factors += 0.15;
    
    return factors > 0 ? engagementScore / factors : 0;
  }
  
  // Calculate difficulty bonus based on exercise difficulty distribution
  calculateDifficultyBonus(exerciseHistory) {
    if (exerciseHistory.length === 0) return 0;
    
    const difficultyDistribution = {
      easy: 0,
      medium: 0,
      hard: 0,
      expert: 0
    };
    
    exerciseHistory.forEach(ex => {
      const difficulty = ex.difficulty || 'medium';
      if (difficulty in difficultyDistribution) {
        difficultyDistribution[difficulty]++;
      }
    });
    
    const total = exerciseHistory.length;
    let bonus = 0;
    
    // Apply multipliers based on difficulty
    Object.entries(difficultyDistribution).forEach(([difficulty, count]) => {
      const ratio = count / total;
      const multiplier = this.difficultyMultipliers[difficulty] || 1;
      bonus += ratio * (multiplier - 1) * 0.1; // 10% max bonus per difficulty level
    });
    
    return bonus;
  }
  
  // Calculate XP (Experience Points)
  calculateXP(skillScore, exerciseCount) {
    const baseXP = skillScore * 1000; // Base XP from skill level
    const activityBonus = Math.min(500, exerciseCount * 10); // Bonus for activity
    return Math.floor(baseXP + activityBonus);
  }
  
  // Get XP required for specific level
  getXPRequiredForLevel(level) {
    // Exponential XP curve: level^2 * 100
    return level * level * 100;
  }
  
  // Calculate progress within current level
  calculateLevelProgress(skillScore, currentLevel) {
    const currentLevelXP = this.getXPRequiredForLevel(currentLevel);
    const nextLevelXP = this.getXPRequiredForLevel(currentLevel + 1);
    const userXP = this.calculateXP(skillScore, 0); // Just base XP for level calculation
    
    if (userXP <= currentLevelXP) return 0;
    if (userXP >= nextLevelXP) return 100;
    
    return ((userXP - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  }
  
  // Get optimal time for different skills
  getOptimalTimeForSkill(skillType) {
    const optimalTimes = {
      reading: 45,      // seconds per question
      grammar: 30,
      vocabulary: 20,
      listening: 60,
      speaking: 90,
      writing: 120,
      overall: 40
    };
    
    return optimalTimes[skillType] || optimalTimes.overall;
  }
  
  // Calculate trend from array of values
  calculateTrend(values) {
    if (values.length < 2) return 0;
    
    // Simple linear regression slope
    const n = values.length;
    const sumX = (n * (n - 1)) / 2; // Sum of indices
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, x) => sum + x * y, 0);
    const sumXX = (n * (n - 1) * (2 * n - 1)) / 6; // Sum of squares of indices
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    
    // Normalize slope to -1 to 1 range
    return Math.max(-1, Math.min(1, slope / 10));
  }
  
  // Calculate gaps between sessions
  calculateSessionGaps(sessions) {
    if (sessions.length < 2) return [];
    
    const gaps = [];
    for (let i = 1; i < sessions.length; i++) {
      const prevEnd = new Date(sessions[i - 1].endTime);
      const currentStart = new Date(sessions[i].startTime);
      const gapDays = (currentStart - prevEnd) / (1000 * 60 * 60 * 24);
      gaps.push(gapDays);
    }
    
    return gaps;
  }
  
  // Calculate penalty for large gaps between sessions
  calculateGapPenalty(gaps) {
    if (gaps.length === 0) return 0;
    
    const averageGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    const optimalGap = 1; // 1 day between sessions is optimal
    
    // Penalty increases with gap size
    return Math.min(0.5, Math.max(0, (averageGap - optimalGap) / 7)); // Max 50% penalty
  }
  
  // Identify learning patterns
  identifyLearningPatterns(sessionHistory) {
    if (sessionHistory.length < 5) {
      return {
        confidence: 'low',
        patterns: [],
        insights: ['Need more data to identify patterns'],
        recommendations: ['Continue practicing to build learning profile']
      };
    }
    
    const patterns = {
      peakPerformanceTime: this.findPeakHours(sessionHistory),
      optimalSessionLength: this.calculateOptimalDuration(sessionHistory),
      learningVelocity: this.calculateLearningRate(sessionHistory),
      retentionRate: this.calculateRetention(sessionHistory),
      preferredDifficulty: this.identifyPreferredDifficulty(sessionHistory),
      strongDays: this.identifyStrongDays(sessionHistory),
      exercisePreferences: this.identifyExercisePreferences(sessionHistory)
    };
    
    const insights = this.generateInsights(patterns);
    const recommendations = this.generateRecommendations(patterns);
    
    return {
      confidence: this.calculatePatternConfidence(sessionHistory),
      patterns,
      insights,
      recommendations
    };
  }
  
  // Find peak performance hours
  findPeakHours(sessions) {
    const hourlyPerformance = {};
    
    sessions.forEach(session => {
      const hour = new Date(session.startTime).getHours();
      if (!hourlyPerformance[hour]) {
        hourlyPerformance[hour] = { scores: [], count: 0 };
      }
      hourlyPerformance[hour].scores.push(session.averageScore || 0);
      hourlyPerformance[hour].count++;
    });
    
    // Calculate average performance for each hour
    const hourlyAverages = {};
    Object.entries(hourlyPerformance).forEach(([hour, data]) => {
      hourlyAverages[hour] = {
        average: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
        count: data.count
      };
    });
    
    // Find the hour with highest average (minimum 3 sessions)
    const validHours = Object.entries(hourlyAverages)
      .filter(([_, data]) => data.count >= 3)
      .sort(([_, a], [__, b]) => b.average - a.average);
    
    return validHours.length > 0 ? {
      hour: parseInt(validHours[0][0]),
      average: validHours[0][1].average,
      sessions: validHours[0][1].count
    } : null;
  }
  
  // Calculate optimal session duration
  calculateOptimalDuration(sessions) {
    // Group sessions by duration ranges and calculate average performance
    const durationRanges = {
      'short': { min: 0, max: 900, sessions: [] },      // 0-15 minutes
      'medium': { min: 900, max: 2700, sessions: [] },   // 15-45 minutes
      'long': { min: 2700, max: 5400, sessions: [] },    // 45-90 minutes
      'extended': { min: 5400, max: Infinity, sessions: [] } // 90+ minutes
    };
    
    sessions.forEach(session => {
      const duration = session.duration || 0;
      Object.entries(durationRanges).forEach(([range, config]) => {
        if (duration >= config.min && duration < config.max) {
          config.sessions.push(session);
        }
      });
    });
    
    // Calculate average performance for each range
    const rangePerformance = {};
    Object.entries(durationRanges).forEach(([range, config]) => {
      if (config.sessions.length >= 2) {
        const avgScore = config.sessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) / config.sessions.length;
        rangePerformance[range] = {
          averageScore: avgScore,
          sessionCount: config.sessions.length,
          averageDuration: config.sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / config.sessions.length
        };
      }
    });
    
    // Find the range with highest performance
    const bestRange = Object.entries(rangePerformance)
      .sort(([_, a], [__, b]) => b.averageScore - a.averageScore)[0];
    
    return bestRange ? {
      range: bestRange[0],
      optimalDuration: bestRange[1].averageDuration,
      performance: bestRange[1].averageScore
    } : null;
  }
  
  // Calculate learning rate (improvement over time)
  calculateLearningRate(sessions) {
    if (sessions.length < 5) return 0;
    
    // Split sessions into early and recent groups
    const midpoint = Math.floor(sessions.length / 2);
    const earlySessions = sessions.slice(0, midpoint);
    const recentSessions = sessions.slice(midpoint);
    
    const earlyAverage = earlySessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) / earlySessions.length;
    const recentAverage = recentSessions.reduce((sum, s) => sum + (s.averageScore || 0), 0) / recentSessions.length;
    
    // Calculate improvement rate
    const improvement = recentAverage - earlyAverage;
    const timeSpan = sessions.length; // Normalize by number of sessions
    
    return improvement / timeSpan; // Points improved per session
  }
  
  // Identify preferred difficulty level
  identifyPreferredDifficulty(sessions) {
    const difficultyPerformance = {};
    
    sessions.forEach(session => {
      session.exercises?.forEach(exercise => {
        const difficulty = exercise.difficulty || 'medium';
        if (!difficultyPerformance[difficulty]) {
          difficultyPerformance[difficulty] = { scores: [], count: 0 };
        }
        difficultyPerformance[difficulty].scores.push(exercise.score || 0);
        difficultyPerformance[difficulty].count++;
      });
    });
    
    // Calculate performance and preference for each difficulty
    const preferences = {};
    Object.entries(difficultyPerformance).forEach(([difficulty, data]) => {
      if (data.count >= 3) { // Minimum sample size
        preferences[difficulty] = {
          averageScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
          count: data.count,
          preference: data.count / sessions.length // How often they choose this difficulty
        };
      }
    });
    
    return preferences;
  }
  
  // Generate insights from patterns
  generateInsights(patterns) {
    const insights = [];
    
    if (patterns.peakPerformanceTime) {
      const hour = patterns.peakPerformanceTime.hour;
      const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
      insights.push(`You perform best in the ${timeOfDay} (around ${hour}:00)`);
    }
    
    if (patterns.optimalSessionLength) {
      insights.push(`Your optimal session length is ${Math.round(patterns.optimalSessionLength.optimalDuration / 60)} minutes`);
    }
    
    if (patterns.learningVelocity > 0.5) {
      insights.push('You are improving rapidly - keep up the great work!');
    } else if (patterns.learningVelocity < -0.2) {
      insights.push('Your performance has plateaued - consider trying different exercise types');
    }
    
    return insights;
  }
  
  // Generate recommendations from patterns
  generateRecommendations(patterns) {
    const recommendations = [];
    
    if (patterns.peakPerformanceTime) {
      recommendations.push(`Schedule your study sessions around ${patterns.peakPerformanceTime.hour}:00 for best results`);
    }
    
    if (patterns.optimalSessionLength && patterns.optimalSessionLength.range === 'short') {
      recommendations.push('Try extending your sessions slightly for potentially better retention');
    }
    
    if (patterns.learningVelocity < 0) {
      recommendations.push('Consider taking a short break or trying different exercise types to overcome the plateau');
    }
    
    return recommendations;
  }
  
  // Calculate confidence in pattern analysis
  calculatePatternConfidence(sessions) {
    if (sessions.length < 5) return 'low';
    if (sessions.length < 15) return 'medium';
    return 'high';
  }
  
  // Predict future performance
  predictPerformance(userHistory, exerciseType, difficulty = 'medium') {
    if (userHistory.length < 3) {
      return {
        expectedScore: 50,
        confidence: 'low',
        recommendedDifficulty: 'easy',
        reasoning: 'Insufficient data for accurate prediction'
      };
    }
    
    // Get recent performance for similar exercises
    const similarExercises = userHistory.filter(ex => 
      ex.exerciseType === exerciseType && ex.difficulty === difficulty
    ).slice(-10); // Last 10 similar exercises
    
    if (similarExercises.length === 0) {
      // No similar exercises, use overall performance
      const overallAverage = userHistory.reduce((sum, ex) => sum + (ex.score || 0), 0) / userHistory.length;
      return {
        expectedScore: Math.round(overallAverage),
        confidence: 'low',
        recommendedDifficulty: overallAverage > 75 ? 'medium' : 'easy',
        reasoning: 'Based on overall performance (no similar exercises found)'
      };
    }
    
    // Calculate trend and average
    const scores = similarExercises.map(ex => ex.score || 0);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const trend = this.calculateTrend(scores);
    
    // Predict next score based on trend
    const trendAdjustment = trend * 5; // Trend impact
    const predictedScore = Math.max(0, Math.min(100, average + trendAdjustment));
    
    // Determine confidence based on consistency and sample size
    const consistency = this.calculateConsistency(similarExercises);
    const sampleSize = similarExercises.length;
    
    let confidence = 'low';
    if (sampleSize >= 5 && consistency > 0.7) confidence = 'high';
    else if (sampleSize >= 3 && consistency > 0.5) confidence = 'medium';
    
    // Recommend difficulty based on predicted performance
    let recommendedDifficulty = difficulty;
    if (predictedScore > 85 && trend > 0) {
      recommendedDifficulty = this.increaseDifficulty(difficulty);
    } else if (predictedScore < 60 && trend < 0) {
      recommendedDifficulty = this.decreaseDifficulty(difficulty);
    }
    
    return {
      expectedScore: Math.round(predictedScore),
      confidence,
      recommendedDifficulty,
      reasoning: `Based on ${sampleSize} similar exercises with ${Math.round(consistency * 100)}% consistency`,
      trend: trend > 0.1 ? 'improving' : trend < -0.1 ? 'declining' : 'stable'
    };
  }
  
  // Helper functions for difficulty adjustment
  increaseDifficulty(currentDifficulty) {
    const levels = ['easy', 'medium', 'hard', 'expert'];
    const currentIndex = levels.indexOf(currentDifficulty);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentDifficulty;
  }
  
  decreaseDifficulty(currentDifficulty) {
    const levels = ['easy', 'medium', 'hard', 'expert'];
    const currentIndex = levels.indexOf(currentDifficulty);
    return currentIndex > 0 ? levels[currentIndex - 1] : currentDifficulty;
  }
  
  // Additional helper methods for pattern analysis
  identifyStrongDays(sessions) {
    const dayPerformance = {};
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    
    sessions.forEach(session => {
      const day = new Date(session.startTime).getDay();
      if (!dayPerformance[day]) {
        dayPerformance[day] = { scores: [], count: 0 };
      }
      dayPerformance[day].scores.push(session.averageScore || 0);
      dayPerformance[day].count++;
    });
    
    const dayAverages = {};
    Object.entries(dayPerformance).forEach(([day, data]) => {
      if (data.count >= 2) { // Minimum sample size
        dayAverages[dayNames[day]] = {
          average: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
          count: data.count
        };
      }
    });
    
    return dayAverages;
  }
  
  identifyExercisePreferences(sessions) {
    const exercisePerformance = {};
    
    sessions.forEach(session => {
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
    
    const preferences = {};
    Object.entries(exercisePerformance).forEach(([type, data]) => {
      if (data.count >= 3) {
        preferences[type] = {
          averageScore: data.scores.reduce((a, b) => a + b, 0) / data.scores.length,
          count: data.count,
          averageTime: data.totalTime / data.count,
          efficiency: (data.scores.reduce((a, b) => a + b, 0) / data.scores.length) / (data.totalTime / data.count) * 1000 // Score per second * 1000
        };
      }
    });
    
    return preferences;
  }
}

// Create global instance
export const progressEngine = new ProgressEngine();

export default ProgressEngine;
