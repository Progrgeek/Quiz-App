/**
 * Gamification Psychology Foundation
 * Based on Self-Determination Theory (SDT) and Flow State research
 * Implements motivation psychology principles for learning engagement
 */

// Self-Determination Theory (SDT) Implementation
export const MOTIVATION_PILLARS = {
  AUTONOMY: {
    name: 'Autonomy',
    description: 'User feels in control of their learning',
    features: [
      'custom_goals',
      'flexible_scheduling', 
      'topic_choice',
      'learning_path_selection',
      'difficulty_adjustment',
      'session_length_control'
    ],
    rewards: [
      'unlock_new_areas',
      'customize_experience',
      'avatar_customization',
      'theme_selection',
      'goal_setting_tools'
    ],
    metrics: [
      'user_choice_frequency',
      'customization_usage',
      'goal_completion_rate',
      'self_directed_learning_time'
    ]
  },
  
  COMPETENCE: {
    name: 'Competence',
    description: 'User feels capable and improving',
    features: [
      'skill_progression',
      'achievement_unlocks',
      'mastery_indicators',
      'performance_tracking',
      'difficulty_adaptation',
      'progress_visualization'
    ],
    rewards: [
      'level_up',
      'skill_badges',
      'perfect_score_celebrations',
      'mastery_certificates',
      'expert_titles'
    ],
    metrics: [
      'skill_improvement_rate',
      'achievement_unlock_frequency',
      'mastery_progression',
      'confidence_indicators'
    ]
  },
  
  RELATEDNESS: {
    name: 'Relatedness',
    description: 'User feels connected to community',
    features: [
      'leaderboards',
      'friend_challenges',
      'study_groups',
      'peer_comparison',
      'collaborative_exercises',
      'mentorship_programs'
    ],
    rewards: [
      'social_recognition',
      'team_achievements',
      'mentor_badges',
      'community_contributions',
      'helping_rewards'
    ],
    metrics: [
      'social_interaction_frequency',
      'peer_collaboration_time',
      'community_engagement_score',
      'helping_behavior_count'
    ]
  }
};

// Flow State Optimization Framework
export const FLOW_STATE_FACTORS = {
  CLEAR_GOALS: {
    name: 'Clear Goals',
    description: 'Well-defined learning objectives',
    implementation: [
      'explicit_exercise_objectives',
      'progress_indicators',
      'completion_criteria',
      'success_metrics'
    ],
    measurement: 'goal_clarity_rating'
  },
  
  IMMEDIATE_FEEDBACK: {
    name: 'Immediate Feedback',
    description: 'Instant response to user actions',
    implementation: [
      'real_time_validation',
      'instant_score_updates',
      'visual_feedback_effects',
      'audio_confirmation'
    ],
    measurement: 'feedback_response_time'
  },
  
  CHALLENGE_SKILL_BALANCE: {
    name: 'Challenge-Skill Balance',
    description: 'Adaptive difficulty matching user ability',
    implementation: [
      'dynamic_difficulty_adjustment',
      'skill_based_recommendations',
      'adaptive_content_selection',
      'personalized_pacing'
    ],
    measurement: 'challenge_appropriateness_score'
  },
  
  DEEP_CONCENTRATION: {
    name: 'Deep Concentration',
    description: 'Distraction-free learning environment',
    implementation: [
      'focused_ui_design',
      'notification_management',
      'immersive_experiences',
      'attention_restoration'
    ],
    measurement: 'engagement_duration'
  },
  
  SENSE_OF_CONTROL: {
    name: 'Sense of Control',
    description: 'User agency in learning path',
    implementation: [
      'user_driven_navigation',
      'choice_in_activities',
      'customizable_interface',
      'optional_features'
    ],
    measurement: 'control_perception_rating'
  },
  
  INTRINSIC_MOTIVATION: {
    name: 'Intrinsic Motivation',
    description: 'Learning for personal satisfaction',
    implementation: [
      'curiosity_driven_content',
      'meaningful_applications',
      'personal_relevance',
      'creative_expression'
    ],
    measurement: 'intrinsic_motivation_score'
  }
};

// Gamification Psychology Engine
export class GamificationPsychologyEngine {
  constructor() {
    this.motivationProfile = null;
    this.flowStateMetrics = {};
    this.engagementHistory = [];
  }

  // Analyze user's motivation profile based on SDT
  analyzeMotivationProfile(userBehavior, preferences) {
    const profile = {
      autonomyScore: this.calculateAutonomyScore(userBehavior),
      competenceScore: this.calculateCompetenceScore(userBehavior),
      relatednessScore: this.calculateRelatednessScore(userBehavior),
      dominantMotivation: null,
      recommendations: []
    };

    // Determine dominant motivation pillar
    const scores = {
      autonomy: profile.autonomyScore,
      competence: profile.competenceScore,
      relatedness: profile.relatednessScore
    };
    
    profile.dominantMotivation = Object.keys(scores).reduce((a, b) => 
      scores[a] > scores[b] ? a : b
    );

    // Generate personalized recommendations
    profile.recommendations = this.generateMotivationRecommendations(profile, preferences);
    
    this.motivationProfile = profile;
    return profile;
  }

  // Calculate autonomy motivation score
  calculateAutonomyScore(userBehavior) {
    const autonomyIndicators = {
      customizationUsage: userBehavior.customizationActions || 0,
      goalSetting: userBehavior.personalGoalsSet || 0,
      pathChoices: userBehavior.learningPathChanges || 0,
      difficultyAdjustments: userBehavior.difficultyChanges || 0
    };

    const maxScore = 100;
    const weightedScore = (
      autonomyIndicators.customizationUsage * 0.3 +
      autonomyIndicators.goalSetting * 0.3 +
      autonomyIndicators.pathChoices * 0.2 +
      autonomyIndicators.difficultyAdjustments * 0.2
    );

    return Math.min(weightedScore, maxScore);
  }

  // Calculate competence motivation score
  calculateCompetenceScore(userBehavior) {
    const competenceIndicators = {
      skillProgression: userBehavior.skillLevelGains || 0,
      achievementRate: userBehavior.achievementsUnlocked || 0,
      masteryBehavior: userBehavior.perfectScores || 0,
      challengeAcceptance: userBehavior.difficultChallengesAttempted || 0
    };

    const maxScore = 100;
    const weightedScore = (
      competenceIndicators.skillProgression * 0.4 +
      competenceIndicators.achievementRate * 0.3 +
      competenceIndicators.masteryBehavior * 0.2 +
      competenceIndicators.challengeAcceptance * 0.1
    );

    return Math.min(weightedScore, maxScore);
  }

  // Calculate relatedness motivation score
  calculateRelatednessScore(userBehavior) {
    const relatednessIndicators = {
      socialInteractions: userBehavior.friendInteractions || 0,
      collaborativeTime: userBehavior.groupStudyTime || 0,
      helpingBehavior: userBehavior.peersHelped || 0,
      competitiveParticipation: userBehavior.challengesJoined || 0
    };

    const maxScore = 100;
    const weightedScore = (
      relatednessIndicators.socialInteractions * 0.3 +
      relatednessIndicators.collaborativeTime * 0.3 +
      relatednessIndicators.helpingBehavior * 0.2 +
      relatednessIndicators.competitiveParticipation * 0.2
    );

    return Math.min(weightedScore, maxScore);
  }

  // Generate personalized motivation recommendations
  generateMotivationRecommendations(profile, preferences) {
    const recommendations = [];
    
    // Autonomy-focused recommendations
    if (profile.dominantMotivation === 'autonomy' || profile.autonomyScore < 50) {
      recommendations.push({
        type: 'autonomy',
        priority: profile.dominantMotivation === 'autonomy' ? 'high' : 'medium',
        suggestions: [
          'Enable more customization options',
          'Provide learning path choices',
          'Allow goal personalization',
          'Offer difficulty control'
        ]
      });
    }

    // Competence-focused recommendations
    if (profile.dominantMotivation === 'competence' || profile.competenceScore < 50) {
      recommendations.push({
        type: 'competence',
        priority: profile.dominantMotivation === 'competence' ? 'high' : 'medium',
        suggestions: [
          'Highlight skill progression',
          'Create achievement milestones',
          'Show mastery indicators',
          'Provide performance feedback'
        ]
      });
    }

    // Relatedness-focused recommendations
    if (profile.dominantMotivation === 'relatedness' || profile.relatednessScore < 50) {
      recommendations.push({
        type: 'relatedness',
        priority: profile.dominantMotivation === 'relatedness' ? 'high' : 'medium',
        suggestions: [
          'Encourage social features',
          'Promote group activities',
          'Enable peer interactions',
          'Create team challenges'
        ]
      });
    }

    return recommendations;
  }

  // Assess current flow state
  assessFlowState(userSession) {
    const flowMetrics = {};
    
    // Calculate each flow factor
    Object.keys(FLOW_STATE_FACTORS).forEach(factor => {
      flowMetrics[factor] = this.calculateFlowFactor(factor, userSession);
    });

    // Overall flow score
    const flowScore = Object.values(flowMetrics).reduce((sum, score) => sum + score, 0) / 
                     Object.keys(flowMetrics).length;

    // Flow state classification
    let flowLevel = 'low';
    if (flowScore >= 80) flowLevel = 'high';
    else if (flowScore >= 60) flowLevel = 'medium';

    return {
      overallScore: flowScore,
      level: flowLevel,
      factors: flowMetrics,
      recommendations: this.generateFlowRecommendations(flowMetrics),
      timestamp: new Date()
    };
  }

  // Calculate individual flow factor score
  calculateFlowFactor(factor, userSession) {
    switch (factor) {
      case 'CLEAR_GOALS':
        return userSession.goalClarity || 70; // Default moderate clarity
      
      case 'IMMEDIATE_FEEDBACK':
        return Math.max(0, 100 - (userSession.avgFeedbackDelay || 100));
      
      case 'CHALLENGE_SKILL_BALANCE':
        const difficulty = userSession.avgDifficulty || 5;
        const skill = userSession.userSkillLevel || 5;
        const balance = 100 - Math.abs(difficulty - skill) * 10;
        return Math.max(0, balance);
      
      case 'DEEP_CONCENTRATION':
        return userSession.focusScore || 75; // Based on session engagement
      
      case 'SENSE_OF_CONTROL':
        return userSession.userChoices * 10 || 60; // Based on choices made
      
      case 'INTRINSIC_MOTIVATION':
        return userSession.intrinsicEngagement || 65; // Based on self-directed behavior
      
      default:
        return 50; // Neutral score
    }
  }

  // Generate flow state improvement recommendations
  generateFlowRecommendations(flowMetrics) {
    const recommendations = [];
    
    Object.entries(flowMetrics).forEach(([factor, score]) => {
      if (score < 60) {
        recommendations.push({
          factor,
          score,
          priority: score < 40 ? 'high' : 'medium',
          suggestions: this.getFactorImprovementSuggestions(factor)
        });
      }
    });

    return recommendations.sort((a, b) => 
      (a.priority === 'high' ? 0 : 1) - (b.priority === 'high' ? 0 : 1)
    );
  }

  // Get specific improvement suggestions for flow factors
  getFactorImprovementSuggestions(factor) {
    const suggestions = {
      CLEAR_GOALS: [
        'Provide clearer exercise objectives',
        'Show progress indicators more prominently',
        'Break down complex goals into smaller steps'
      ],
      IMMEDIATE_FEEDBACK: [
        'Reduce feedback delay',
        'Add visual feedback effects',
        'Implement audio confirmation'
      ],
      CHALLENGE_SKILL_BALANCE: [
        'Adjust difficulty based on performance',
        'Provide adaptive content recommendations',
        'Allow manual difficulty selection'
      ],
      DEEP_CONCENTRATION: [
        'Minimize UI distractions',
        'Create focused exercise modes',
        'Add concentration-supporting features'
      ],
      SENSE_OF_CONTROL: [
        'Increase user choice options',
        'Allow more customization',
        'Provide multiple solution paths'
      ],
      INTRINSIC_MOTIVATION: [
        'Connect learning to personal interests',
        'Add creative exercise elements',
        'Show real-world applications'
      ]
    };

    return suggestions[factor] || ['General improvement needed'];
  }

  // Generate engagement optimization strategy
  optimizeEngagement(user, currentSession) {
    const motivationProfile = this.analyzeMotivationProfile(user.behavior, user.preferences);
    const flowState = this.assessFlowState(currentSession);
    
    return {
      motivationStrategy: this.createMotivationStrategy(motivationProfile),
      flowOptimization: this.createFlowOptimization(flowState),
      personalizedFeatures: this.recommendPersonalizedFeatures(motivationProfile, flowState),
      engagementPrediction: this.predictEngagement(user, motivationProfile, flowState)
    };
  }

  // Create motivation-based strategy
  createMotivationStrategy(profile) {
    const strategies = {
      autonomy: {
        focus: 'User Control & Choice',
        tactics: [
          'Provide multiple learning paths',
          'Enable deep customization',
          'Allow goal modification',
          'Offer optional challenges'
        ]
      },
      competence: {
        focus: 'Skill Development & Mastery',
        tactics: [
          'Show clear progression',
          'Celebrate achievements',
          'Provide skill assessments',
          'Offer challenging content'
        ]
      },
      relatedness: {
        focus: 'Social Connection & Community',
        tactics: [
          'Encourage friend interactions',
          'Create group challenges',
          'Enable peer comparison',
          'Facilitate helping behavior'
        ]
      }
    };

    return strategies[profile.dominantMotivation];
  }

  // Create flow state optimization plan
  createFlowOptimization(flowState) {
    return {
      currentLevel: flowState.level,
      targetImprovements: flowState.recommendations.slice(0, 3), // Top 3 priorities
      quickWins: flowState.recommendations.filter(r => r.priority === 'high'),
      longTermGoals: flowState.recommendations.filter(r => r.priority === 'medium')
    };
  }

  // Recommend personalized features
  recommendPersonalizedFeatures(motivationProfile, flowState) {
    const features = [];

    // Based on motivation profile
    if (motivationProfile.dominantMotivation === 'autonomy') {
      features.push('advanced_customization', 'flexible_scheduling', 'goal_editor');
    } else if (motivationProfile.dominantMotivation === 'competence') {
      features.push('skill_tracker', 'achievement_showcase', 'mastery_challenges');
    } else if (motivationProfile.dominantMotivation === 'relatedness') {
      features.push('friend_system', 'group_challenges', 'peer_leaderboards');
    }

    // Based on flow state needs
    if (flowState.level === 'low') {
      features.push('focus_mode', 'distraction_free_ui', 'guided_experience');
    }

    return [...new Set(features)]; // Remove duplicates
  }

  // Predict engagement likelihood
  predictEngagement(user, motivationProfile, flowState) {
    const factors = {
      motivationAlignment: motivationProfile.dominantMotivation ? 80 : 60,
      flowScore: flowState.overallScore,
      historicalEngagement: user.avgEngagementScore || 70,
      personalityFit: this.calculatePersonalityFit(user.personality, motivationProfile)
    };

    const predictedEngagement = (
      factors.motivationAlignment * 0.3 +
      factors.flowScore * 0.3 +
      factors.historicalEngagement * 0.2 +
      factors.personalityFit * 0.2
    );

    return {
      score: Math.round(predictedEngagement),
      factors,
      confidence: this.calculatePredictionConfidence(factors),
      recommendations: this.generateEngagementRecommendations(predictedEngagement, factors)
    };
  }

  // Calculate personality fit score
  calculatePersonalityFit(personality, motivationProfile) {
    if (!personality) return 70; // Default moderate fit

    const personalityMotivationMap = {
      'competitive': 'competence',
      'social': 'relatedness', 
      'independent': 'autonomy',
      'collaborative': 'relatedness',
      'achievement_oriented': 'competence',
      'creative': 'autonomy'
    };

    const personalityMotivation = personalityMotivationMap[personality];
    return personalityMotivation === motivationProfile.dominantMotivation ? 90 : 60;
  }

  // Calculate prediction confidence
  calculatePredictionConfidence(factors) {
    const dataQuality = Object.values(factors).every(f => f > 0) ? 1 : 0.7;
    const consistencyScore = Math.abs(factors.motivationAlignment - factors.flowScore) < 20 ? 0.9 : 0.7;
    
    return Math.round(dataQuality * consistencyScore * 100);
  }

  // Generate engagement improvement recommendations
  generateEngagementRecommendations(score, factors) {
    const recommendations = [];

    if (score < 60) {
      recommendations.push({
        priority: 'high',
        type: 'immediate_action',
        suggestion: 'Implement motivation-aligned features immediately'
      });
    }

    if (factors.flowScore < 50) {
      recommendations.push({
        priority: 'high',
        type: 'flow_improvement',
        suggestion: 'Focus on flow state optimization'
      });
    }

    if (factors.personalityFit < 70) {
      recommendations.push({
        priority: 'medium',
        type: 'personalization',
        suggestion: 'Enhance personality-based customization'
      });
    }

    return recommendations;
  }
}

// Export default instance
export const gamificationPsychology = new GamificationPsychologyEngine();
