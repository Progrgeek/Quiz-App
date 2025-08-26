/**
 * Advanced Recommendation Engine
 * Provides personalized content suggestions, difficulty optimization, and learning path generation
 */

import { LearningPatternAnalyzer } from './LearningPatternAnalyzer.js';

export class RecommendationEngine {
  constructor() {
    this.patternAnalyzer = new LearningPatternAnalyzer();
    this.contentMatcher = new ContentMatcher();
    this.difficultyOptimizer = new DifficultyOptimizer();
    this.learningPathGenerator = new LearningPathGenerator();
    
    this.recommendationTypes = {
      EXERCISE: 'exercise_recommendation',
      DIFFICULTY: 'difficulty_adjustment',
      TIMING: 'optimal_timing',
      CONTENT: 'content_suggestion',
      LEARNING_PATH: 'learning_path',
      MOTIVATION: 'motivational_content'
    };
  }

  /**
   * Generate comprehensive personalized recommendations
   */
  generateRecommendations(user, context = {}) {
    const patterns = this.patternAnalyzer.analyzeLearningCurve(user.history);
    const weakAreas = this.identifyWeakAreas(user.skillLevels);
    const preferences = this.analyzePreferences(user.exerciseHistory);
    const optimalConditions = this.patternAnalyzer.findOptimalConditions(user.history);

    return {
      nextExercises: this.recommendNextExercises(weakAreas, preferences, user.currentLevel),
      difficultyAdjustments: this.recommendDifficultyChanges(patterns, user.recentPerformance),
      studyTiming: this.recommendStudyTimes(optimalConditions, user.schedule),
      learningGoals: this.suggestLearningGoals(user.currentLevel, user.goals, patterns),
      motivationalMessages: this.generateMotivationalContent(user.streaks, user.achievements),
      contentSuggestions: this.suggestContent(user.interests, user.progress),
      learningPath: this.optimizeLearningPath(user, context.targetSkills),
      priority: this.calculateRecommendationPriority(user, patterns)
    };
  }

  /**
   * Recommend next exercises based on learning patterns and weak areas
   */
  recommendNextExercises(weakAreas, preferences, currentLevel) {
    const recommendations = [];

    // Focus on weak areas
    weakAreas.forEach(area => {
      const exercises = this.contentMatcher.findExercisesForSkill(area.skill, currentLevel[area.skill]);
      const filtered = this.filterByPreferences(exercises, preferences);
      
      recommendations.push({
        type: 'skill_improvement',
        skill: area.skill,
        reason: `Improve ${area.skill} (current level: ${area.level}/10)`,
        exercises: filtered.slice(0, 3),
        priority: this.calculateWeakAreaPriority(area),
        estimatedImpact: this.estimateImpact(area, exercises)
      });
    });

    // Maintain strong areas
    const strongAreas = this.identifyStrongAreas(currentLevel);
    strongAreas.forEach(area => {
      const exercises = this.contentMatcher.findChallengeExercises(area.skill, area.level);
      
      recommendations.push({
        type: 'skill_maintenance',
        skill: area.skill,
        reason: `Maintain excellence in ${area.skill}`,
        exercises: exercises.slice(0, 2),
        priority: 'medium',
        estimatedImpact: 'maintenance'
      });
    });

    // Exploration recommendations
    const unexploredSkills = this.findUnexploredSkills(currentLevel, preferences);
    unexploredSkills.forEach(skill => {
      const exercises = this.contentMatcher.findIntroductoryExercises(skill);
      
      recommendations.push({
        type: 'exploration',
        skill: skill,
        reason: `Explore new skill: ${skill}`,
        exercises: exercises.slice(0, 2),
        priority: 'low',
        estimatedImpact: 'discovery'
      });
    });

    return this.rankRecommendations(recommendations);
  }

  /**
   * Adaptive difficulty recommendations
   */
  recommendDifficultyChanges(patterns, recentPerformance) {
    const recommendations = [];
    
    Object.entries(recentPerformance).forEach(([skill, performance]) => {
      const recommendation = this.difficultyOptimizer.optimizeDifficulty(skill, performance, patterns);
      recommendations.push(recommendation);
    });

    return recommendations;
  }

  /**
   * Recommend optimal study timing
   */
  recommendStudyTimes(optimalConditions, userSchedule = {}) {
    const recommendations = [];
    
    // Best time of day
    recommendations.push({
      type: 'optimal_timing',
      timeSlot: optimalConditions.bestTimeOfDay,
      reason: `Your peak performance is at ${optimalConditions.bestTimeOfDay.timeRange}`,
      expectedImprovement: '15-25% better performance',
      scheduling: this.generateScheduleSuggestions(optimalConditions.bestTimeOfDay, userSchedule)
    });

    // Session length optimization
    recommendations.push({
      type: 'session_duration',
      duration: optimalConditions.optimalSessionLength,
      reason: `${optimalConditions.optimalSessionLength.range} sessions work best for you`,
      tips: this.generateSessionTips(optimalConditions.optimalSessionLength)
    });

    // Day of week patterns
    if (optimalConditions.bestDayOfWeek) {
      recommendations.push({
        type: 'weekly_scheduling',
        bestDays: optimalConditions.bestDayOfWeek,
        reason: 'Schedule intensive practice on your most productive days',
        weeklyPlan: this.generateWeeklyPlan(optimalConditions.bestDayOfWeek)
      });
    }

    return recommendations;
  }

  /**
   * Suggest learning goals based on current progress and patterns
   */
  suggestLearningGoals(currentLevel, existingGoals, patterns) {
    const suggestions = [];
    
    // Skill-based goals
    Object.entries(currentLevel).forEach(([skill, level]) => {
      if (level < 8) { // Room for improvement
        const targetLevel = Math.min(10, level + 2);
        const timeEstimate = this.estimateTimeToReachLevel(skill, level, targetLevel, patterns);
        
        suggestions.push({
          type: 'skill_mastery',
          skill: skill,
          currentLevel: level,
          targetLevel: targetLevel,
          timeEstimate: timeEstimate,
          milestones: this.generateMilestones(skill, level, targetLevel),
          motivation: this.generateGoalMotivation(skill, targetLevel)
        });
      }
    });

    // Performance goals
    const currentAverage = this.calculateAverageScore(patterns.curve);
    if (currentAverage < 90) {
      suggestions.push({
        type: 'performance',
        target: Math.min(100, currentAverage + 10),
        current: currentAverage,
        timeframe: '30 days',
        strategies: this.generatePerformanceStrategies(currentAverage)
      });
    }

    // Consistency goals
    const consistencyScore = this.calculateConsistencyScore(patterns);
    if (consistencyScore < 0.8) {
      suggestions.push({
        type: 'consistency',
        target: 'Practice 5 days per week',
        current: `Currently ${Math.round(consistencyScore * 7)} days per week`,
        benefits: ['Better retention', 'Faster progress', 'Habit formation']
      });
    }

    return this.prioritizeGoals(suggestions, existingGoals);
  }

  /**
   * Generate motivational content based on achievements and progress
   */
  generateMotivationalContent(streaks, achievements) {
    const messages = [];
    
    // Streak-based motivation
    if (streaks.current > 0) {
      messages.push({
        type: 'streak_encouragement',
        message: `Amazing! You're on a ${streaks.current}-day streak! 🔥`,
        action: 'Keep the momentum going with today\'s practice!',
        milestone: this.getNextStreakMilestone(streaks.current)
      });
    } else {
      messages.push({
        type: 'restart_motivation',
        message: 'Every expert was once a beginner. Today is a perfect day to start fresh!',
        action: 'Begin a new streak with just one exercise',
        encouragement: 'Your longest streak was ' + streaks.longest + ' days - you can do it again!'
      });
    }

    // Achievement-based motivation
    const recentAchievements = achievements.filter(a => 
      Date.now() - new Date(a.unlockedAt).getTime() < 7 * 24 * 60 * 60 * 1000 // Last 7 days
    );
    
    if (recentAchievements.length > 0) {
      messages.push({
        type: 'achievement_celebration',
        message: `You've unlocked ${recentAchievements.length} achievements this week!`,
        achievements: recentAchievements,
        nextAchievement: this.findNextAchievement(achievements)
      });
    }

    // Progress-based motivation
    messages.push({
      type: 'progress_highlight',
      message: this.generateProgressMessage(streaks, achievements),
      personalizedTip: this.generatePersonalizedTip(streaks, achievements)
    });

    return messages;
  }

  /**
   * Suggest content based on interests and progress
   */
  suggestContent(interests, progress) {
    const suggestions = [];
    
    // Interest-based content
    interests.forEach(interest => {
      const content = this.contentMatcher.findContentByInterest(interest, progress.level);
      suggestions.push({
        type: 'interest_based',
        interest: interest,
        content: content,
        reason: `Matches your interest in ${interest}`
      });
    });

    // Trending content
    const trendingContent = this.contentMatcher.getTrendingContent(progress.level);
    suggestions.push({
      type: 'trending',
      content: trendingContent,
      reason: 'Popular with learners at your level'
    });

    // Seasonal content
    const seasonalContent = this.contentMatcher.getSeasonalContent();
    if (seasonalContent.length > 0) {
      suggestions.push({
        type: 'seasonal',
        content: seasonalContent,
        reason: 'Special seasonal content available now'
      });
    }

    return suggestions;
  }

  /**
   * Optimize learning path for target skills
   */
  optimizeLearningPath(user, targetSkills = []) {
    if (targetSkills.length === 0) {
      targetSkills = this.inferTargetSkills(user);
    }

    const currentSkills = user.skillLevels;
    const skillGaps = this.calculateSkillGaps(currentSkills, targetSkills);
    const dependencies = this.getSkillDependencies();
    
    return this.learningPathGenerator.generateOptimalPath(skillGaps, dependencies, user.preferences);
  }

  /**
   * Calculate recommendation priority based on user data and patterns
   */
  calculateRecommendationPriority(user, patterns) {
    const factors = {
      urgency: this.calculateUrgency(user, patterns),
      impact: this.calculatePotentialImpact(user, patterns),
      feasibility: this.calculateFeasibility(user, patterns),
      engagement: this.calculateEngagementLevel(user)
    };

    return {
      overall: this.combineFactors(factors),
      factors: factors,
      explanation: this.explainPriority(factors)
    };
  }

  // Helper Classes and Methods

  identifyWeakAreas(skillLevels) {
    return Object.entries(skillLevels)
      .filter(([skill, level]) => level < 6)
      .map(([skill, level]) => ({
        skill,
        level,
        priority: this.calculateWeakAreaPriority({ skill, level }),
        improvementPotential: 10 - level
      }))
      .sort((a, b) => b.priority - a.priority);
  }

  identifyStrongAreas(skillLevels) {
    return Object.entries(skillLevels)
      .filter(([skill, level]) => level >= 7)
      .map(([skill, level]) => ({ skill, level }));
  }

  analyzePreferences(exerciseHistory) {
    const typeFrequency = {};
    const typePerformance = {};
    
    exerciseHistory.forEach(exercise => {
      const type = exercise.exerciseType;
      typeFrequency[type] = (typeFrequency[type] || 0) + 1;
      
      if (!typePerformance[type]) typePerformance[type] = [];
      typePerformance[type].push(exercise.score);
    });

    const preferences = Object.entries(typeFrequency).map(([type, frequency]) => {
      const avgPerformance = typePerformance[type].reduce((sum, score) => sum + score, 0) / typePerformance[type].length;
      return {
        exerciseType: type,
        frequency: frequency,
        averagePerformance: avgPerformance,
        preference: this.calculatePreferenceScore(frequency, avgPerformance)
      };
    }).sort((a, b) => b.preference - a.preference);

    return preferences;
  }

  calculatePreferenceScore(frequency, performance) {
    // Combine frequency and performance to determine preference
    const normalizedFreq = Math.min(frequency / 10, 1); // Normalize to 0-1
    const normalizedPerf = performance / 100;
    return (normalizedFreq * 0.4 + normalizedPerf * 0.6) * 100;
  }

  filterByPreferences(exercises, preferences) {
    const preferredTypes = preferences.slice(0, 3).map(p => p.exerciseType);
    return exercises.filter(ex => preferredTypes.includes(ex.type) || Math.random() > 0.7);
  }

  rankRecommendations(recommendations) {
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  calculateWeakAreaPriority(area) {
    // Priority based on level gap and skill importance
    const levelGap = 6 - area.level;
    const skillImportance = this.getSkillImportance(area.skill);
    return levelGap * skillImportance;
  }

  getSkillImportance(skill) {
    const importance = {
      'reading': 1.0,
      'grammar': 0.9,
      'vocabulary': 0.8,
      'listening': 0.7,
      'writing': 0.6
    };
    return importance[skill] || 0.5;
  }
}

// Supporting Classes

class ContentMatcher {
  findExercisesForSkill(skill, level) {
    // Mock implementation - would connect to actual exercise database
    return [
      { id: 1, type: 'multipleChoice', skill, difficulty: level, title: `${skill} Practice ${level}` },
      { id: 2, type: 'fillInBlanks', skill, difficulty: level, title: `${skill} Fill Exercise` },
      { id: 3, type: 'dragAndDrop', skill, difficulty: level, title: `${skill} Matching` }
    ];
  }

  findChallengeExercises(skill, level) {
    return [
      { id: 4, type: 'multipleChoice', skill, difficulty: Math.min(10, level + 1), title: `Advanced ${skill}` }
    ];
  }

  findIntroductoryExercises(skill) {
    return [
      { id: 5, type: 'multipleChoice', skill, difficulty: 1, title: `Introduction to ${skill}` }
    ];
  }

  findContentByInterest(interest, level) {
    return [
      { id: 6, type: 'story', interest, level, title: `${interest} Story Collection` }
    ];
  }

  getTrendingContent(level) {
    return [
      { id: 7, type: 'interactive', level, title: 'Popular Interactive Lessons' }
    ];
  }

  getSeasonalContent() {
    const month = new Date().getMonth();
    if (month === 11) return [{ id: 8, type: 'holiday', title: 'Holiday Vocabulary' }];
    return [];
  }
}

class DifficultyOptimizer {
  optimizeDifficulty(skill, performance, patterns) {
    const recentAverage = performance.averageScore;
    const trend = patterns.trend;
    
    let recommendation = 'maintain';
    let reason = 'Current difficulty is appropriate';
    
    if (recentAverage > 85 && trend.direction === 'improving') {
      recommendation = 'increase';
      reason = 'Excellent performance - ready for more challenge';
    } else if (recentAverage < 65 || trend.direction === 'declining') {
      recommendation = 'decrease';
      reason = 'Lower difficulty recommended to build confidence';
    }

    return {
      skill,
      currentDifficulty: performance.difficulty,
      recommendedAction: recommendation,
      reason,
      targetDifficulty: this.calculateTargetDifficulty(performance.difficulty, recommendation),
      expectedOutcome: this.predictOutcome(recommendation, performance)
    };
  }

  calculateTargetDifficulty(current, action) {
    switch (action) {
      case 'increase': return Math.min(10, current + 1);
      case 'decrease': return Math.max(1, current - 1);
      default: return current;
    }
  }

  predictOutcome(action, performance) {
    const outcomes = {
      'increase': 'Improved engagement and faster skill development',
      'decrease': 'Better confidence and reduced frustration',
      'maintain': 'Steady progress at current pace'
    };
    return outcomes[action];
  }
}

class LearningPathGenerator {
  generateOptimalPath(skillGaps, dependencies, preferences) {
    // Simplified implementation
    const path = [];
    
    skillGaps.forEach(gap => {
      const prereqs = dependencies[gap.skill] || [];
      path.push({
        skill: gap.skill,
        currentLevel: gap.current,
        targetLevel: gap.target,
        prerequisites: prereqs,
        estimatedTime: this.estimateCompletionTime(gap),
        milestones: this.generatePathMilestones(gap)
      });
    });

    return this.optimizePathOrder(path, preferences);
  }

  estimateCompletionTime(gap) {
    const levelDifference = gap.target - gap.current;
    return `${levelDifference * 2} weeks`; // Rough estimate
  }

  generatePathMilestones(gap) {
    const milestones = [];
    for (let level = gap.current + 1; level <= gap.target; level++) {
      milestones.push({
        level,
        description: `Reach level ${level} in ${gap.skill}`,
        exercises: Math.ceil((level - gap.current) * 10)
      });
    }
    return milestones;
  }

  optimizePathOrder(path, preferences) {
    // Sort by prerequisites first, then by preference
    return path.sort((a, b) => {
      if (a.prerequisites.includes(b.skill)) return 1;
      if (b.prerequisites.includes(a.skill)) return -1;
      return 0;
    });
  }
}

export default RecommendationEngine;
