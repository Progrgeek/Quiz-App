/**
 * AI-Powered Adaptive Engine
 * Provides intelligent hints, adaptive difficulty, and personalized learning paths
 */

export class AIEngine {
  constructor(config = {}) {
    this.config = {
      enableAdaptiveDifficulty: config.enableAdaptiveDifficulty ?? true,
      enableIntelligentHints: config.enableIntelligentHints ?? true,
      enablePersonalization: config.enablePersonalization ?? true,
      adaptationThreshold: config.adaptationThreshold ?? 0.7,
      hintDelay: config.hintDelay ?? 15000, // 15 seconds
      ...config
    };
    
    this.userProfile = this.initializeUserProfile();
    this.knowledgeGraph = new Map();
    this.difficultyModel = this.initializeDifficultyModel();
    this.hintStrategies = this.initializeHintStrategies();
  }
  
  initializeUserProfile() {
    const stored = localStorage.getItem('ai_user_profile');
    return stored ? JSON.parse(stored) : {
      learningStyle: null, // visual, auditory, kinesthetic, reading
      preferredPace: 'medium', // slow, medium, fast
      knowledgeLevel: new Map(),
      strengths: [],
      weaknesses: [],
      preferences: {
        hintStyle: 'progressive', // direct, progressive, socratic
        feedbackDetail: 'medium', // brief, medium, detailed
        challengeLevel: 'balanced' // easy, balanced, challenging
      },
      performance: {
        averageAccuracy: 0,
        averageTime: 0,
        sessionCount: 0,
        totalQuestions: 0
      }
    };
  }
  
  initializeDifficultyModel() {
    return {
      factors: {
        accuracy: 0.4,
        speed: 0.2,
        consistency: 0.2,
        improvement: 0.2
      },
      levels: ['beginner', 'intermediate', 'advanced', 'expert'],
      thresholds: {
        beginner: 0.3,
        intermediate: 0.6,
        advanced: 0.8,
        expert: 0.95
      }
    };
  }
  
  initializeHintStrategies() {
    return {
      progressive: {
        name: 'Progressive Hints',
        description: 'Start with subtle hints, gradually become more specific',
        generateHint: this.generateProgressiveHint.bind(this)
      },
      socratic: {
        name: 'Socratic Method',
        description: 'Guide learning through questions',
        generateHint: this.generateSocraticHint.bind(this)
      },
      direct: {
        name: 'Direct Guidance',
        description: 'Provide clear, direct assistance',
        generateHint: this.generateDirectHint.bind(this)
      },
      contextual: {
        name: 'Contextual Clues',
        description: 'Provide hints based on context and patterns',
        generateHint: this.generateContextualHint.bind(this)
      }
    };
  }
  
  // Core AI Methods
  
  /**
   * Analyze user performance and update profile
   */
  analyzePerformance(performanceData) {
    this.updateUserProfile(performanceData);
    this.updateKnowledgeGraph(performanceData);
    
    const insights = {
      currentLevel: this.assessCurrentLevel(),
      recommendations: this.generateRecommendations(),
      nextDifficulty: this.calculateNextDifficulty(),
      learningPath: this.optimizeLearningPath()
    };
    
    this.saveUserProfile();
    return insights;
  }
  
  /**
   * Generate intelligent hints based on context and user profile
   */
  generateIntelligentHint(context) {
    if (!this.config.enableIntelligentHints) {
      return this.generateBasicHint(context);
    }
    
    const strategy = this.selectHintStrategy(context);
    const hint = strategy.generateHint(context);
    
    // Track hint effectiveness for learning
    this.trackHintUsage(context, hint, strategy.name);
    
    return {
      content: hint.content,
      level: hint.level,
      strategy: strategy.name,
      confidence: hint.confidence,
      followUp: hint.followUp
    };
  }
  
  /**
   * Adapt difficulty based on performance
   */
  adaptDifficulty(currentExercise, recentPerformance) {
    if (!this.config.enableAdaptiveDifficulty) {
      return currentExercise.difficulty;
    }
    
    const performanceScore = this.calculatePerformanceScore(recentPerformance);
    const currentDifficulty = this.normalizeDifficulty(currentExercise.difficulty);
    
    let adaptedDifficulty = currentDifficulty;
    
    if (performanceScore > this.config.adaptationThreshold) {
      // Increase difficulty
      adaptedDifficulty = Math.min(1.0, currentDifficulty + 0.1);
    } else if (performanceScore < (1 - this.config.adaptationThreshold)) {
      // Decrease difficulty
      adaptedDifficulty = Math.max(0.1, currentDifficulty - 0.1);
    }
    
    return this.denormalizeDifficulty(adaptedDifficulty);
  }
  
  /**
   * Personalize content based on user profile
   */
  personalizeContent(content) {
    if (!this.config.enablePersonalization) {
      return content;
    }
    
    const personalizedContent = { ...content };
    
    // Adapt based on learning style
    if (this.userProfile.learningStyle === 'visual') {
      personalizedContent.emphasis = 'visual';
      personalizedContent.includeImages = true;
    } else if (this.userProfile.learningStyle === 'auditory') {
      personalizedContent.emphasis = 'audio';
      personalizedContent.includeAudio = true;
    }
    
    // Adapt explanation detail
    const detailLevel = this.userProfile.preferences.feedbackDetail;
    personalizedContent.explanationDetail = detailLevel;
    
    // Prioritize topics based on weaknesses
    if (this.userProfile.weaknesses.length > 0) {
      personalizedContent.focusAreas = this.userProfile.weaknesses;
    }
    
    return personalizedContent;
  }
  
  // Hint Generation Strategies
  
  generateProgressiveHint(context) {
    const hintLevel = context.currentHintLevel || 1;
    const maxLevel = 4;
    
    let content, confidence;
    
    switch (hintLevel) {
      case 1:
        content = this.generateSubtleHint(context);
        confidence = 0.6;
        break;
      case 2:
        content = this.generateModeratehint(context);
        confidence = 0.75;
        break;
      case 3:
        content = this.generateSpecificHint(context);
        confidence = 0.85;
        break;
      case 4:
        content = this.generateDirectAnswer(context);
        confidence = 0.95;
        break;
      default:
        content = this.generateBasicHint(context);
        confidence = 0.5;
    }
    
    return {
      content,
      level: hintLevel,
      confidence,
      followUp: hintLevel < maxLevel ? 
        "Need a more specific hint?" : "This is the most direct guidance available."
    };
  }
  
  generateSocraticHint(context) {
    const questions = this.generateGuidingQuestions(context);
    
    return {
      content: questions[0] || "What do you think is the key concept here?",
      level: context.currentHintLevel || 1,
      confidence: 0.8,
      followUp: "Think about this question and try again."
    };
  }
  
  generateDirectHint(context) {
    const directGuidance = this.generateDirectGuidance(context);
    
    return {
      content: directGuidance,
      level: 1,
      confidence: 0.9,
      followUp: "Apply this guidance to solve the problem."
    };
  }
  
  generateContextualHint(context) {
    const patterns = this.identifyPatterns(context);
    const hint = this.generatePatternBasedHint(patterns);
    
    return {
      content: hint,
      level: context.currentHintLevel || 1,
      confidence: 0.85,
      followUp: "Look for similar patterns in the question."
    };
  }
  
  // Hint Content Generators
  
  generateSubtleHint(context) {
    const question = context.question;
    
    switch (question.type) {
      case 'multipleChoice':
        return "Consider each option carefully. What key concept is being tested?";
      case 'fillInTheBlanks':
        return "Think about the context of the sentence. What type of word fits here?";
      case 'dragAndDrop':
        return "Look for logical relationships between the items.";
      case 'highlight':
        return "Focus on the most important elements in the text.";
      default:
        return "Take a moment to understand what the question is really asking.";
    }
  }
  
  generateModeratehint(context) {
    const question = context.question;
    
    // Analyze user's previous attempts for more specific guidance
    if (context.previousAttempts && context.previousAttempts.length > 0) {
      return this.generateAttemptBasedHint(context);
    }
    
    // Provide type-specific moderate hints
    switch (question.type) {
      case 'multipleChoice':
        return this.generateMCModeratehint(question);
      case 'fillInTheBlanks':
        return this.generateFillModeratehint(question);
      default:
        return "Think about the fundamental concepts involved in this problem.";
    }
  }
  
  generateSpecificHint(context) {
    const question = context.question;
    
    // Generate specific hints based on question analysis
    if (question.hints && question.hints.length > 0) {
      return question.hints[0]; // Use authored hint if available
    }
    
    return this.generateAISpecificHint(question);
  }
  
  generateDirectAnswer(context) {
    const question = context.question;
    
    // Provide near-complete guidance
    if (question.explanation) {
      return `Here's the approach: ${question.explanation}`;
    }
    
    return "Let me guide you step by step through this problem...";
  }
  
  // AI Analysis Methods
  
  calculatePerformanceScore(recentPerformance) {
    if (!recentPerformance || recentPerformance.length === 0) {
      return 0.5; // Neutral starting point
    }
    
    const factors = this.difficultyModel.factors;
    
    // Calculate accuracy score
    const correctAnswers = recentPerformance.filter(p => p.isCorrect).length;
    const accuracyScore = correctAnswers / recentPerformance.length;
    
    // Calculate speed score (lower time is better, but not too fast)
    const averageTime = recentPerformance.reduce((sum, p) => sum + p.timeToAnswer, 0) / recentPerformance.length;
    const optimalTime = 15000; // 15 seconds optimal
    const speedScore = Math.min(1, optimalTime / Math.max(averageTime, 1000));
    
    // Calculate consistency score
    const accuracyVariance = this.calculateVariance(recentPerformance.map(p => p.isCorrect ? 1 : 0));
    const consistencyScore = 1 - Math.min(1, accuracyVariance);
    
    // Calculate improvement score
    const improvementScore = this.calculateImprovement(recentPerformance);
    
    return (
      accuracyScore * factors.accuracy +
      speedScore * factors.speed +
      consistencyScore * factors.consistency +
      improvementScore * factors.improvement
    );
  }
  
  assessCurrentLevel() {
    const performance = this.userProfile.performance;
    const accuracy = performance.averageAccuracy;
    
    for (const [level, threshold] of Object.entries(this.difficultyModel.thresholds)) {
      if (accuracy >= threshold) {
        continue;
      }
      return level;
    }
    
    return 'expert';
  }
  
  selectHintStrategy(context) {
    const userPreference = this.userProfile.preferences.hintStyle;
    const defaultStrategy = this.hintStrategies[userPreference] || this.hintStrategies.progressive;
    
    // Adapt strategy based on context
    if (context.attemptsCount > 2) {
      return this.hintStrategies.direct; // More direct help after multiple attempts
    }
    
    if (context.timeSpent > 30000) {
      return this.hintStrategies.socratic; // Guide thinking if taking too long
    }
    
    return defaultStrategy;
  }
  
  updateUserProfile(performanceData) {
    const profile = this.userProfile;
    
    // Update performance metrics
    profile.performance.sessionCount++;
    profile.performance.totalQuestions += performanceData.questionsAnswered || 0;
    
    if (performanceData.accuracy !== undefined) {
      profile.performance.averageAccuracy = this.updateRunningAverage(
        profile.performance.averageAccuracy,
        performanceData.accuracy,
        profile.performance.sessionCount
      );
    }
    
    if (performanceData.averageTime !== undefined) {
      profile.performance.averageTime = this.updateRunningAverage(
        profile.performance.averageTime,
        performanceData.averageTime,
        profile.performance.sessionCount
      );
    }
    
    // Update knowledge level for topics
    if (performanceData.topics) {
      performanceData.topics.forEach(topic => {
        const currentLevel = profile.knowledgeLevel.get(topic.name) || 0;
        const newLevel = this.updateKnowledgeLevel(currentLevel, topic.performance);
        profile.knowledgeLevel.set(topic.name, newLevel);
      });
    }
    
    // Detect learning style if not set
    if (!profile.learningStyle) {
      profile.learningStyle = this.detectLearningStyle(performanceData);
    }
  }
  
  updateKnowledgeGraph(performanceData) {
    // Build relationships between concepts based on performance
    if (performanceData.topics) {
      performanceData.topics.forEach(topic => {
        if (!this.knowledgeGraph.has(topic.name)) {
          this.knowledgeGraph.set(topic.name, {
            masteryLevel: 0,
            connections: new Map(),
            lastPracticed: Date.now(),
            practiceCount: 0
          });
        }
        
        const node = this.knowledgeGraph.get(topic.name);
        node.lastPracticed = Date.now();
        node.practiceCount++;
        node.masteryLevel = this.updateMasteryLevel(node.masteryLevel, topic.performance);
      });
    }
  }
  
  generateRecommendations() {
    const recommendations = [];
    
    // Analyze weaknesses and suggest improvements
    const weakTopics = Array.from(this.userProfile.knowledgeLevel.entries())
      .filter(([topic, level]) => level < 0.6)
      .sort((a, b) => a[1] - b[1])
      .slice(0, 3);
    
    weakTopics.forEach(([topic, level]) => {
      recommendations.push({
        type: 'practice',
        topic: topic,
        reason: `Low proficiency (${Math.round(level * 100)}%)`,
        action: `Practice more ${topic} exercises`,
        priority: 1 - level
      });
    });
    
    // Suggest optimal study schedule
    if (this.userProfile.performance.sessionCount > 5) {
      const optimalTime = this.calculateOptimalStudyTime();
      recommendations.push({
        type: 'schedule',
        action: `Study sessions work best for you around ${optimalTime}`,
        priority: 0.5
      });
    }
    
    // Suggest learning style adaptations
    if (this.userProfile.learningStyle) {
      recommendations.push({
        type: 'adaptation',
        action: `Try ${this.userProfile.learningStyle}-focused exercises`,
        priority: 0.6
      });
    }
    
    return recommendations.sort((a, b) => b.priority - a.priority);
  }
  
  // Utility Methods
  
  updateRunningAverage(currentAverage, newValue, count) {
    return ((currentAverage * (count - 1)) + newValue) / count;
  }
  
  calculateVariance(values) {
    if (values.length === 0) return 0;
    
    const mean = values.reduce((a, b) => a + b) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    return squaredDiffs.reduce((a, b) => a + b) / values.length;
  }
  
  calculateImprovement(recentPerformance) {
    if (recentPerformance.length < 2) return 0.5;
    
    const firstHalf = recentPerformance.slice(0, Math.floor(recentPerformance.length / 2));
    const secondHalf = recentPerformance.slice(Math.floor(recentPerformance.length / 2));
    
    const firstHalfAccuracy = firstHalf.filter(p => p.isCorrect).length / firstHalf.length;
    const secondHalfAccuracy = secondHalf.filter(p => p.isCorrect).length / secondHalf.length;
    
    return Math.max(0, Math.min(1, (secondHalfAccuracy - firstHalfAccuracy) + 0.5));
  }
  
  normalizeDifficulty(difficulty) {
    if (typeof difficulty === 'number') return Math.max(0, Math.min(1, difficulty));
    
    const difficultyMap = {
      'beginner': 0.2,
      'easy': 0.3,
      'intermediate': 0.5,
      'medium': 0.5,
      'advanced': 0.7,
      'hard': 0.8,
      'expert': 0.9
    };
    
    return difficultyMap[difficulty.toLowerCase()] || 0.5;
  }
  
  denormalizeDifficulty(normalizedDifficulty) {
    if (normalizedDifficulty <= 0.25) return 'beginner';
    if (normalizedDifficulty <= 0.4) return 'easy';
    if (normalizedDifficulty <= 0.6) return 'intermediate';
    if (normalizedDifficulty <= 0.75) return 'advanced';
    return 'expert';
  }
  
  saveUserProfile() {
    try {
      const profileData = {
        ...this.userProfile,
        knowledgeLevel: Array.from(this.userProfile.knowledgeLevel.entries())
      };
      localStorage.setItem('ai_user_profile', JSON.stringify(profileData));
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  }
  
  // Public API
  
  getPersonalizedRecommendations() {
    return this.generateRecommendations();
  }
  
  getUserInsights() {
    return {
      profile: this.userProfile,
      currentLevel: this.assessCurrentLevel(),
      knowledgeMap: Array.from(this.knowledgeGraph.entries()),
      recommendations: this.generateRecommendations()
    };
  }
  
  configureAI(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
}

export default AIEngine;
