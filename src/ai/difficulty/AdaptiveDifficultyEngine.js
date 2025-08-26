/**
 * Adaptive Difficulty Engine - Phase 5 Day 34
 * Dynamic difficulty adjustment and personalized challenge optimization
 * Based on Zone of Proximal Development and Flow Theory
 */

export class AdaptiveDifficultyEngine {
  constructor() {
    this.difficultyFactors = {
      CONTENT_COMPLEXITY: {
        vocabulary: 'Word difficulty and frequency in language',
        syntax: 'Grammatical complexity and sentence structure',
        conceptual: 'Abstract vs concrete concepts',
        procedural: 'Number of steps required to solve',
        mathematical: 'Mathematical operations complexity',
        logical: 'Logical reasoning requirements'
      },
      PRESENTATION_FACTORS: {
        textLength: 'Amount of text to process',
        visualComplexity: 'Number of visual elements',
        distractors: 'Number of incorrect options in multiple choice',
        timeConstraints: 'Time pressure applied',
        informationDensity: 'Amount of information per screen',
        navigationComplexity: 'Interface navigation requirements'
      },
      COGNITIVE_LOAD: {
        workingMemory: 'Information to hold simultaneously',
        attention: 'Focus and concentration requirements',
        processing: 'Mental processing demands',
        multitasking: 'Parallel task demands',
        metacognition: 'Thinking about thinking requirements',
        transfer: 'Application to new contexts'
      },
      CONTEXTUAL_FACTORS: {
        prerequisites: 'Required background knowledge',
        domain_familiarity: 'User familiarity with subject area',
        motivation_level: 'Current user motivation state',
        fatigue_level: 'User mental fatigue indicators',
        session_progress: 'Progress within current session',
        time_of_day: 'Optimal performance time for user'
      }
    };
    
    this.adaptationStrategies = {
      TOO_EASY: {
        threshold: 0.9, // 90%+ accuracy indicates too easy
        adjustments: [
          'increase_complexity',
          'add_distractors',
          'reduce_hints',
          'increase_time_pressure',
          'introduce_novel_elements',
          'combine_multiple_concepts'
        ],
        urgency: 'high' // Boredom sets in quickly
      },
      TOO_HARD: {
        threshold: 0.4, // Below 40% accuracy indicates too hard
        adjustments: [
          'decrease_complexity',
          'provide_scaffolding',
          'break_into_smaller_steps',
          'add_visual_aids',
          'increase_hints',
          'reduce_time_pressure'
        ],
        urgency: 'immediate' // Frustration damages motivation
      },
      OPTIMAL: {
        threshold: [0.6, 0.8], // 60-80% accuracy is optimal challenge
        adjustments: [
          'maintain_current_level',
          'gradual_progression',
          'vary_presentation',
          'periodic_challenges'
        ],
        urgency: 'low' // Small adjustments to maintain flow
      },
      FLUCTUATING: {
        threshold: 'high_variance', // Inconsistent performance
        adjustments: [
          'stabilize_difficulty',
          'identify_knowledge_gaps',
          'provide_targeted_practice',
          'check_prerequisites'
        ],
        urgency: 'medium'
      }
    };

    // Zone of Proximal Development parameters
    this.zpdParameters = {
      current_level: 'What user can do independently',
      potential_level: 'What user can do with guidance',
      learning_zone: 'Optimal difficulty range for growth',
      frustration_zone: 'Too difficult, causes stress',
      comfort_zone: 'Too easy, minimal learning'
    };

    // Flow state indicators
    this.flowStateIndicators = {
      performance: 'Consistent, improving performance',
      engagement: 'Sustained attention and focus',
      time_perception: 'Loss of time awareness',
      intrinsic_motivation: 'Self-driven engagement',
      immediate_feedback: 'Clear progress indicators',
      challenge_skill_balance: 'Perfect difficulty match'
    };
  }

  // Calculate optimal difficulty for user and context
  calculateOptimalDifficulty(userId, exerciseType, currentContext = {}) {
    const userProfile = this.getUserProfile(userId);
    const performanceHistory = this.getPerformanceHistory(userId, exerciseType);
    const currentState = this.getCurrentLearningState(userId);
    const environmentalContext = this.getEnvironmentalContext(currentContext);
    
    // Base difficulty from user's current level
    let baseDifficulty = this.calculateBaseDifficulty(userProfile, exerciseType);
    
    // Adjust based on recent performance patterns
    const recentPerformance = this.analyzeRecentPerformance(performanceHistory);
    const performanceAdjustment = this.calculatePerformanceAdjustment(recentPerformance);
    
    // Factor in current state (fatigue, motivation, streak)
    const stateAdjustment = this.calculateStateAdjustment(currentState);
    
    // Consider learning objectives and goals
    const objectiveAdjustment = this.calculateObjectiveAdjustment(
      userProfile.currentGoals,
      exerciseType
    );
    
    // Apply time-based factors (forgetting curve, spaced repetition)
    const timeAdjustment = this.calculateTimeAdjustment(
      userId,
      exerciseType,
      currentContext.lastPracticed
    );
    
    // Environmental and contextual adjustments
    const environmentalAdjustment = this.calculateEnvironmentalAdjustment(environmentalContext);
    
    // Combine all adjustments with confidence weighting
    const optimalDifficulty = this.combineAdjustments({
      base: baseDifficulty,
      performance: performanceAdjustment,
      state: stateAdjustment,
      objective: objectiveAdjustment,
      time: timeAdjustment,
      environmental: environmentalAdjustment
    });
    
    // Ensure difficulty stays within reasonable bounds
    const boundedDifficulty = Math.max(0.1, Math.min(1.0, optimalDifficulty));
    
    return {
      difficulty: boundedDifficulty,
      reasoning: {
        base: baseDifficulty,
        adjustments: {
          performance: performanceAdjustment,
          state: stateAdjustment,
          objective: objectiveAdjustment,
          time: timeAdjustment,
          environmental: environmentalAdjustment
        },
        factors: this.explainDifficultyFactors(boundedDifficulty, userProfile)
      },
      confidence: this.calculateConfidence(performanceHistory.length, currentState),
      recommendations: this.getRecommendedAdjustments(boundedDifficulty, recentPerformance),
      zpdAnalysis: this.analyzeZoneOfProximalDevelopment(userProfile, boundedDifficulty),
      flowPotential: this.assessFlowStatePotential(userProfile, boundedDifficulty, currentState)
    };
  }

  // Real-time difficulty adaptation during exercise
  adaptDifficultyRealTime(userId, exerciseId, userResponse, sessionContext) {
    const currentDifficulty = this.getCurrentDifficulty(exerciseId);
    const responseAnalysis = this.analyzeResponse(userResponse, sessionContext);
    const userState = this.getCurrentUserState(userId);
    
    let adaptationNeeded = false;
    let newDifficulty = currentDifficulty;
    let adaptationType = 'none';
    let reasoning = [];
    
    // Analyze response patterns for adaptation triggers
    const adaptationTriggers = this.identifyAdaptationTriggers(responseAnalysis, userState);
    
    if (adaptationTriggers.tooEasy) {
      newDifficulty = this.adjustDifficultyUp(currentDifficulty, adaptationTriggers.tooEasy);
      adaptationType = 'increase';
      reasoning.push('User showing mastery, increasing challenge');
      adaptationNeeded = true;
    } else if (adaptationTriggers.tooHard) {
      newDifficulty = this.adjustDifficultyDown(currentDifficulty, adaptationTriggers.tooHard);
      adaptationType = 'decrease';
      reasoning.push('User struggling, providing support');
      adaptationNeeded = true;
    } else if (adaptationTriggers.disengagement) {
      newDifficulty = this.adjustForEngagement(currentDifficulty, userState);
      adaptationType = 'engagement';
      reasoning.push('Adjusting to maintain engagement');
      adaptationNeeded = true;
    }
    
    if (adaptationNeeded) {
      const adaptationPlan = this.createAdaptationPlan(
        currentDifficulty,
        newDifficulty,
        adaptationType,
        userState
      );
      
      return {
        shouldAdapt: true,
        newDifficulty,
        adaptationType,
        reasoning,
        adaptationPlan,
        nextExerciseAdjustments: this.planNextExerciseAdjustments(newDifficulty),
        userFeedback: this.generateUserFeedback(adaptationType, reasoning)
      };
    }
    
    return { 
      shouldAdapt: false,
      maintainDifficulty: currentDifficulty,
      reasoning: ['Performance within optimal range']
    };
  }

  // Analyze user response for adaptation signals
  analyzeResponse(userResponse, sessionContext) {
    return {
      correctness: userResponse.correct,
      confidence: this.analyzeResponseConfidence(userResponse),
      speed: this.analyzeResponseSpeed(userResponse, sessionContext),
      pattern: this.analyzeResponsePattern(userResponse),
      effort: this.analyzeResponseEffort(userResponse),
      strategy: this.identifyProblemSolvingStrategy(userResponse),
      metacognition: this.assessMetacognitiveIndicators(userResponse)
    };
  }

  // Calculate base difficulty from user profile
  calculateBaseDifficulty(userProfile, exerciseType) {
    const skillLevel = userProfile.skillLevels?.[exerciseType] || 0.5;
    const cognitiveCapacity = userProfile.cognitive?.averageCapacity || 0.5;
    const learningStyle = userProfile.learningStyle?.preferences || {};
    
    // Adjust base difficulty based on cognitive capacity
    let baseDifficulty = skillLevel * 0.7 + cognitiveCapacity * 0.3;
    
    // Apply learning style adjustments
    if (learningStyle.visual > 0.6 && exerciseType.includes('visual')) {
      baseDifficulty += 0.1; // Can handle slightly harder visual content
    }
    
    return Math.max(0.1, Math.min(0.9, baseDifficulty));
  }

  // Calculate performance-based adjustments
  calculatePerformanceAdjustment(recentPerformance) {
    if (!recentPerformance || recentPerformance.sessions.length === 0) {
      return 0;
    }
    
    const { averageScore, trend, consistency } = recentPerformance;
    
    let adjustment = 0;
    
    // Adjust based on average score
    if (averageScore > 0.85) {
      adjustment += 0.1; // Increase difficulty
    } else if (averageScore < 0.6) {
      adjustment -= 0.1; // Decrease difficulty
    }
    
    // Adjust based on trend
    if (trend === 'improving') {
      adjustment += 0.05;
    } else if (trend === 'declining') {
      adjustment -= 0.05;
    }
    
    // Adjust based on consistency
    if (consistency < 0.5) {
      adjustment -= 0.03; // Reduce difficulty if inconsistent
    }
    
    return Math.max(-0.2, Math.min(0.2, adjustment));
  }

  // Calculate state-based adjustments
  calculateStateAdjustment(currentState) {
    let adjustment = 0;
    
    // Fatigue adjustment
    if (currentState.fatigueLevel > 0.7) {
      adjustment -= 0.1;
    }
    
    // Motivation adjustment
    if (currentState.motivationLevel > 0.8) {
      adjustment += 0.05;
    } else if (currentState.motivationLevel < 0.4) {
      adjustment -= 0.05;
    }
    
    // Session length adjustment
    if (currentState.sessionDuration > 30 * 60 * 1000) { // > 30 minutes
      adjustment -= 0.05;
    }
    
    // Streak adjustment
    if (currentState.currentStreak > 5) {
      adjustment += 0.03; // Confidence boost from streak
    }
    
    return Math.max(-0.15, Math.min(0.15, adjustment));
  }

  // Analyze Zone of Proximal Development
  analyzeZoneOfProximalDevelopment(userProfile, proposedDifficulty) {
    const currentAbility = userProfile.skillLevels?.average || 0.5;
    const assistedAbility = currentAbility + 0.2; // Estimate with scaffolding
    
    const zpdLower = currentAbility + 0.05; // Just above comfort zone
    const zpdUpper = assistedAbility - 0.05; // Just below frustration zone
    
    let zoneStatus;
    if (proposedDifficulty < zpdLower) {
      zoneStatus = 'comfort_zone';
    } else if (proposedDifficulty > zpdUpper) {
      zoneStatus = 'frustration_zone';
    } else {
      zoneStatus = 'learning_zone';
    }
    
    return {
      currentAbility,
      assistedAbility,
      zpdRange: [zpdLower, zpdUpper],
      proposedDifficulty,
      zoneStatus,
      recommendations: this.getZPDRecommendations(zoneStatus, proposedDifficulty, zpdLower, zpdUpper)
    };
  }

  // Assess flow state potential
  assessFlowStatePotential(userProfile, proposedDifficulty, currentState) {
    const skillLevel = userProfile.skillLevels?.average || 0.5;
    const challengeSkillBalance = 1 - Math.abs(proposedDifficulty - skillLevel);
    
    const flowFactors = {
      challengeSkillBalance,
      clearGoals: currentState.hasGoals ? 1 : 0.5,
      immediateFeedback: 0.8, // Our system provides good feedback
      concentration: Math.max(0, 1 - currentState.distractionLevel),
      controlSense: userProfile.personality?.autonomy || 0.7,
      intrinsicMotivation: userProfile.motivation?.intrinsic || 0.6
    };
    
    const flowPotential = Object.values(flowFactors).reduce((sum, factor) => sum + factor, 0) / Object.keys(flowFactors).length;
    
    return {
      flowPotential,
      flowFactors,
      flowState: flowPotential > 0.7 ? 'high' : flowPotential > 0.5 ? 'medium' : 'low',
      recommendations: this.getFlowRecommendations(flowFactors)
    };
  }

  // Create comprehensive adaptation plan
  createAdaptationPlan(currentDifficulty, newDifficulty, adaptationType, userState) {
    const difficultyChange = newDifficulty - currentDifficulty;
    
    return {
      immediate: {
        difficultyAdjustment: difficultyChange,
        contentModifications: this.getContentModifications(difficultyChange),
        presentationChanges: this.getPresentationChanges(adaptationType),
        feedbackAdjustments: this.getFeedbackAdjustments(adaptationType)
      },
      shortTerm: {
        exerciseSelection: this.getExerciseSelectionStrategy(newDifficulty),
        scaffoldingPlan: this.getScaffoldingPlan(adaptationType, userState),
        progressMonitoring: this.getProgressMonitoringPlan(newDifficulty)
      },
      longTerm: {
        skillDevelopment: this.getSkillDevelopmentPlan(newDifficulty),
        motivationMaintenance: this.getMotivationMaintenancePlan(userState),
        adaptationStrategy: this.getAdaptationStrategy(adaptationType)
      }
    };
  }

  // Helper methods
  identifyAdaptationTriggers(responseAnalysis, userState) {
    return {
      tooEasy: responseAnalysis.correctness && 
               responseAnalysis.confidence > 0.9 && 
               responseAnalysis.speed > 0.8,
      tooHard: !responseAnalysis.correctness && 
               responseAnalysis.confidence < 0.3 && 
               responseAnalysis.effort > 0.8,
      disengagement: userState.engagementLevel < 0.4 ||
                     userState.recentPauses > 3
    };
  }

  adjustDifficultyUp(currentDifficulty, trigger) {
    const baseIncrease = 0.1;
    const confidenceMultiplier = trigger.confidence || 1;
    const speedMultiplier = trigger.speed || 1;
    
    const increase = baseIncrease * confidenceMultiplier * speedMultiplier;
    return Math.min(1.0, currentDifficulty + increase);
  }

  adjustDifficultyDown(currentDifficulty, trigger) {
    const baseDecrease = 0.15;
    const strugglingMultiplier = trigger.effort || 1;
    
    const decrease = baseDecrease * strugglingMultiplier;
    return Math.max(0.1, currentDifficulty - decrease);
  }

  // Data retrieval methods (would integrate with other systems)
  getUserProfile(userId) {
    return {
      skillLevels: { average: 0.6, reading: 0.7, math: 0.5 },
      cognitive: { averageCapacity: 0.7 },
      learningStyle: { preferences: { visual: 0.8, auditory: 0.3 } },
      personality: { autonomy: 0.8 },
      motivation: { intrinsic: 0.7 }
    };
  }

  getPerformanceHistory(userId, exerciseType) {
    return {
      sessions: [
        { score: 0.8, timeToComplete: 120000, difficulty: 0.6 },
        { score: 0.85, timeToComplete: 100000, difficulty: 0.65 },
        { score: 0.9, timeToComplete: 90000, difficulty: 0.7 }
      ]
    };
  }

  getCurrentLearningState(userId) {
    return {
      fatigueLevel: 0.3,
      motivationLevel: 0.8,
      sessionDuration: 15 * 60 * 1000,
      currentStreak: 7,
      engagementLevel: 0.7,
      distractionLevel: 0.2,
      hasGoals: true,
      recentPauses: 1
    };
  }

  getCurrentDifficulty(exerciseId) {
    return 0.6; // Mock current difficulty
  }

  getCurrentUserState(userId) {
    return this.getCurrentLearningState(userId);
  }
}

export default AdaptiveDifficultyEngine;
