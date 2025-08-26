/**
 * User Profile Engine - Phase 5 Day 33
 * Comprehensive user profiling and knowledge state modeling
 * Based on learning sciences and cognitive psychology research
 */

export class UserProfileEngine {
  constructor() {
    this.profileDimensions = {
      COGNITIVE: {
        processingSpeed: 'How quickly user processes information',
        workingMemoryCapacity: 'Amount of information user can hold simultaneously',
        patternRecognition: 'How well user identifies patterns and relationships',
        abstractReasoning: 'Ability to think conceptually and solve novel problems',
        spatialIntelligence: 'Understanding of spatial relationships and visualization'
      },
      LEARNING_STYLE: {
        visual: 'Preference for visual learning materials (charts, diagrams, images)',
        auditory: 'Preference for auditory learning (explanations, discussions)',
        readingWriting: 'Preference for text-based learning (reading, writing notes)',
        kinesthetic: 'Preference for hands-on, interactive learning',
        sequential: 'Preference for step-by-step, linear progression',
        global: 'Preference for seeing big picture before details'
      },
      PERSONALITY: {
        persistence: 'How long user persists through challenges',
        competitiveness: 'Drive for achievement and comparison with others',
        riskTaking: 'Willingness to attempt difficult or uncertain tasks',
        socialOrientation: 'Preference for collaborative vs individual learning',
        perfectionism: 'Tendency to aim for perfect scores vs accept good enough',
        curiosity: 'Drive to explore and discover new information'
      },
      MOTIVATION: {
        intrinsic: 'Self-motivated learning drive and personal satisfaction',
        extrinsic: 'Motivation from external rewards and recognition',
        mastery: 'Focus on understanding and skill development',
        performance: 'Focus on demonstrating ability and achieving high scores',
        autonomy: 'Preference for self-directed learning and choice',
        relatedness: 'Motivation from social connection and belonging'
      },
      METACOGNITION: {
        selfAwareness: 'Understanding of own learning strengths and weaknesses',
        strategicPlanning: 'Ability to plan and organize learning activities',
        monitoring: 'Awareness of comprehension and progress during learning',
        evaluation: 'Ability to assess learning outcomes and adjust strategies',
        reflection: 'Tendency to think about and learn from experiences'
      }
    };

    // Cognitive load factors for different content types
    this.cognitiveLoadFactors = {
      intrinsic: {
        elementInteractivity: 'Number of elements that must be processed simultaneously',
        conceptualComplexity: 'Abstract vs concrete concepts',
        prerequisiteKnowledge: 'Required background knowledge'
      },
      extraneous: {
        presentationFormat: 'How information is presented',
        distractingElements: 'Irrelevant information or design elements',
        navigationComplexity: 'Difficulty in finding or accessing information'
      },
      germane: {
        schemaConstruction: 'Mental model building activities',
        elaboration: 'Connecting new to existing knowledge',
        reflection: 'Thinking about learning process'
      }
    };

    // Store for user profiles
    this.userProfiles = new Map();
    this.knowledgeStates = new Map();
  }

  // Build comprehensive user profile from behavioral data
  buildUserProfile(userId) {
    const behaviorData = this.getUserBehaviorData(userId);
    const performanceData = this.getUserPerformanceData(userId);
    const engagementData = this.getUserEngagementData(userId);
    const interactionData = this.getUserInteractionData(userId);

    const profile = {
      userId,
      lastUpdated: new Date(),
      cognitive: this.assessCognitiveProfile(behaviorData, performanceData),
      learningStyle: this.detectLearningStyle(behaviorData, interactionData),
      personality: this.assessPersonalityTraits(engagementData, behaviorData),
      motivation: this.analyzeMotivationProfile(engagementData, performanceData),
      metacognition: this.assessMetacognitiveProficiency(behaviorData),
      preferences: this.extractUserPreferences(behaviorData, interactionData),
      strengths: this.identifyStrengths(performanceData),
      challenges: this.identifyWeaknesses(performanceData),
      goals: this.inferLearningGoals(behaviorData, engagementData),
      adaptations: this.generateAdaptationStrategies(performanceData, behaviorData)
    };

    this.userProfiles.set(userId, profile);
    return profile;
  }

  // Assess cognitive capabilities from user behavior
  assessCognitiveProfile(behaviorData, performanceData) {
    return {
      processingSpeed: this.assessProcessingSpeed(behaviorData),
      workingMemoryCapacity: this.assessWorkingMemory(performanceData),
      patternRecognition: this.assessPatternRecognition(performanceData),
      abstractReasoning: this.assessAbstractReasoning(performanceData),
      spatialIntelligence: this.assessSpatialIntelligence(performanceData),
      cognitiveLoad: this.assessCognitiveLoadTolerance(behaviorData),
      attention: this.assessAttentionCapacity(behaviorData)
    };
  }

  // Detect learning style preferences
  detectLearningStyle(behaviorData, interactionData) {
    const preferences = {
      visual: this.calculateVisualPreference(interactionData),
      auditory: this.calculateAuditoryPreference(interactionData),
      readingWriting: this.calculateTextPreference(interactionData),
      kinesthetic: this.calculateInteractivePreference(interactionData),
      sequential: this.calculateSequentialPreference(behaviorData),
      global: this.calculateGlobalPreference(behaviorData)
    };

    // Normalize to sum to 1
    const total = Object.values(preferences).reduce((sum, val) => sum + val, 0);
    for (const key in preferences) {
      preferences[key] = total > 0 ? preferences[key] / total : 1 / Object.keys(preferences).length;
    }

    return {
      preferences,
      primaryStyle: this.identifyPrimaryLearningStyle(preferences),
      adaptabilityScore: this.calculateStyleAdaptability(preferences),
      recommendations: this.generateStyleRecommendations(preferences)
    };
  }

  // Assess personality traits relevant to learning
  assessPersonalityTraits(engagementData, behaviorData) {
    return {
      persistence: this.assessPersistence(engagementData),
      competitiveness: this.assessCompetitiveness(behaviorData),
      riskTaking: this.assessRiskTaking(behaviorData),
      socialOrientation: this.assessSocialOrientation(behaviorData),
      perfectionism: this.assessPerfectionism(behaviorData),
      curiosity: this.assessCuriosity(engagementData),
      openness: this.assessOpenness(behaviorData),
      conscientiousness: this.assessConscientiousness(engagementData)
    };
  }

  // Analyze motivation profile using Self-Determination Theory
  analyzeMotivationProfile(engagementData, performanceData) {
    const intrinsicMotivation = this.assessIntrinsicMotivation(engagementData);
    const extrinsicMotivation = this.assessExtrinsicMotivation(behaviorData);
    
    return {
      intrinsic: intrinsicMotivation,
      extrinsic: extrinsicMotivation,
      mastery: this.assessMasteryOrientation(performanceData),
      performance: this.assessPerformanceOrientation(performanceData),
      autonomy: this.assessAutonomyNeed(engagementData),
      competence: this.assessCompetenceNeed(performanceData),
      relatedness: this.assessRelatednessNeed(behaviorData),
      motivationBalance: this.calculateMotivationBalance(intrinsicMotivation, extrinsicMotivation),
      engagementPredictors: this.identifyEngagementPredictors(engagementData)
    };
  }

  // Knowledge state modeling for specific subjects
  modelKnowledgeState(userId, subject) {
    const masteryData = this.getUserMasteryData(userId, subject);
    const conceptGraph = this.getConceptGraph(subject);
    const learningHistory = this.getLearningHistory(userId, subject);
    
    const knowledgeState = {};
    
    for (const concept of conceptGraph.concepts) {
      knowledgeState[concept.id] = {
        masteryLevel: this.calculateMasteryLevel(userId, concept.id, masteryData),
        confidence: this.calculateMasteryConfidence(userId, concept.id, masteryData),
        lastPracticed: this.getLastPracticed(userId, concept.id, learningHistory),
        forgettingCurve: this.calculateForgettingCurve(userId, concept.id, learningHistory),
        readiness: this.assessReadinessLevel(userId, concept.id, knowledgeState),
        difficulty: this.assessPerceivedDifficulty(userId, concept.id, masteryData),
        transferAbility: this.assessTransferAbility(userId, concept.id, masteryData)
      };
    }
    
    const modeledState = {
      userId,
      subject,
      knowledgeState,
      overallMastery: this.calculateOverallMastery(knowledgeState),
      learningGaps: this.identifyLearningGaps(knowledgeState, conceptGraph),
      strongAreas: this.identifyStrongAreas(knowledgeState),
      nextConcepts: this.recommendNextConcepts(knowledgeState, conceptGraph),
      learningPath: this.generateOptimalLearningPath(knowledgeState, conceptGraph),
      estimatedTimeToMastery: this.estimateTimeToMastery(knowledgeState, learningHistory)
    };

    this.knowledgeStates.set(`${userId}_${subject}`, modeledState);
    return modeledState;
  }

  // Calculate mastery level for a specific concept
  calculateMasteryLevel(userId, conceptId, masteryData) {
    const conceptData = masteryData[conceptId];
    if (!conceptData || conceptData.attempts === 0) {
      return 0;
    }

    const recentPerformance = conceptData.recentScores || [];
    const overallPerformance = conceptData.allScores || [];
    
    // Weight recent performance more heavily
    const recentWeight = 0.7;
    const overallWeight = 0.3;
    
    const recentMastery = recentPerformance.length > 0 ? 
      recentPerformance.reduce((sum, score) => sum + score, 0) / recentPerformance.length : 0;
    
    const overallMastery = overallPerformance.length > 0 ?
      overallPerformance.reduce((sum, score) => sum + score, 0) / overallPerformance.length : 0;
    
    const weightedMastery = (recentMastery * recentWeight) + (overallMastery * overallWeight);
    
    // Apply learning curve adjustments
    const practiceBonus = Math.min(0.1, conceptData.attempts * 0.01); // Up to 10% bonus for practice
    const consistencyBonus = this.calculateConsistencyBonus(overallPerformance);
    
    return Math.min(1.0, weightedMastery + practiceBonus + consistencyBonus);
  }

  // Assess readiness for learning new concepts
  assessReadinessLevel(userId, conceptId, knowledgeState) {
    const concept = this.getConcept(conceptId);
    const prerequisites = concept.prerequisites || [];
    
    if (prerequisites.length === 0) {
      return 1.0; // No prerequisites, fully ready
    }
    
    const prerequisiteMastery = prerequisites.map(prereqId => 
      knowledgeState[prereqId]?.masteryLevel || 0
    );
    
    const averagePrerequisiteMastery = prerequisiteMastery.reduce((sum, mastery) => sum + mastery, 0) / prerequisites.length;
    const minimumPrerequisiteMastery = Math.min(...prerequisiteMastery);
    
    // Readiness requires both good average and no weak prerequisites
    const readiness = (averagePrerequisiteMastery * 0.7) + (minimumPrerequisiteMastery * 0.3);
    
    return Math.max(0, Math.min(1, readiness));
  }

  // Identify learning gaps and generate remediation plan
  identifyLearningGaps(knowledgeState, conceptGraph) {
    const gaps = [];
    
    for (const [conceptId, state] of Object.entries(knowledgeState)) {
      if (state.masteryLevel < 0.7) { // Below mastery threshold
        const concept = conceptGraph.concepts.find(c => c.id === conceptId);
        
        gaps.push({
          conceptId,
          conceptName: concept?.name || conceptId,
          currentMastery: state.masteryLevel,
          targetMastery: 0.8,
          gap: 0.8 - state.masteryLevel,
          priority: this.calculateGapPriority(conceptId, state, knowledgeState, conceptGraph),
          remediationStrategies: this.generateRemediationStrategies(conceptId, state),
          estimatedPracticeTime: this.estimatePracticeTimeNeeded(state.masteryLevel, 0.8)
        });
      }
    }
    
    return gaps.sort((a, b) => b.priority - a.priority);
  }

  // Generate personalized adaptation strategies
  generateAdaptationStrategies(performanceData, behaviorData) {
    const adaptations = {
      difficulty: this.generateDifficultyAdaptations(performanceData),
      content: this.generateContentAdaptations(behaviorData),
      pacing: this.generatePacingAdaptations(behaviorData),
      feedback: this.generateFeedbackAdaptations(performanceData),
      motivation: this.generateMotivationAdaptations(behaviorData),
      interface: this.generateInterfaceAdaptations(behaviorData)
    };

    return {
      adaptations,
      priority: this.prioritizeAdaptations(adaptations),
      implementation: this.generateImplementationPlan(adaptations)
    };
  }

  // Helper methods for assessment calculations
  assessProcessingSpeed(behaviorData) {
    const responseTimes = behaviorData.responseTimes || [];
    if (responseTimes.length === 0) return 0.5; // Default medium speed
    
    const averageTime = responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length;
    const benchmark = 10000; // 10 seconds benchmark
    
    // Faster = higher score (inverted relationship)
    return Math.max(0.1, Math.min(1.0, benchmark / averageTime));
  }

  assessWorkingMemory(performanceData) {
    // Assess based on performance on complex, multi-step problems
    const complexProblems = performanceData.filter(p => p.complexity === 'high');
    if (complexProblems.length === 0) return 0.5;
    
    const averageScore = complexProblems.reduce((sum, p) => sum + p.score, 0) / complexProblems.length;
    return averageScore / 100; // Convert percentage to decimal
  }

  calculateVisualPreference(interactionData) {
    const visualInteractions = interactionData.filter(i => 
      ['image_click', 'diagram_view', 'chart_interaction'].includes(i.type)
    );
    
    return visualInteractions.length / Math.max(1, interactionData.length);
  }

  assessPersistence(engagementData) {
    const challengingSessions = engagementData.filter(s => s.difficulty > 0.7);
    if (challengingSessions.length === 0) return 0.5;
    
    const completionRate = challengingSessions.filter(s => s.completed).length / challengingSessions.length;
    const averageAttempts = challengingSessions.reduce((sum, s) => sum + s.attempts, 0) / challengingSessions.length;
    
    // High completion rate and willingness to retry = high persistence
    return (completionRate * 0.6) + (Math.min(1.0, averageAttempts / 3) * 0.4);
  }

  calculateConsistencyBonus(scores) {
    if (scores.length < 3) return 0;
    
    const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - mean, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    
    // Lower variance = higher consistency = higher bonus
    const consistency = Math.max(0, 1 - (standardDeviation / mean));
    return consistency * 0.05; // Up to 5% bonus for consistency
  }

  // Data retrieval methods (would integrate with actual data sources)
  getUserBehaviorData(userId) {
    // Mock data - in real implementation, this would query the learning analytics engine
    return {
      responseTimes: [8000, 12000, 6000, 15000, 9000],
      sessionLengths: [1800000, 2400000, 3000000], // in milliseconds
      interactionPatterns: ['sequential', 'exploratory', 'focused'],
      difficultyProgression: [0.3, 0.4, 0.5, 0.6, 0.5, 0.7]
    };
  }

  getUserPerformanceData(userId) {
    return [
      { exerciseId: 'ex1', score: 85, complexity: 'medium', timeToComplete: 120000 },
      { exerciseId: 'ex2', score: 92, complexity: 'high', timeToComplete: 180000 },
      { exerciseId: 'ex3', score: 78, complexity: 'low', timeToComplete: 90000 }
    ];
  }

  getUserEngagementData(userId) {
    return [
      { sessionId: 's1', duration: 1800000, completed: true, difficulty: 0.6, attempts: 2 },
      { sessionId: 's2', duration: 2400000, completed: true, difficulty: 0.8, attempts: 1 },
      { sessionId: 's3', duration: 900000, completed: false, difficulty: 0.9, attempts: 3 }
    ];
  }

  getUserInteractionData(userId) {
    return [
      { type: 'image_click', timestamp: Date.now() - 86400000 },
      { type: 'text_highlight', timestamp: Date.now() - 43200000 },
      { type: 'diagram_view', timestamp: Date.now() - 21600000 }
    ];
  }

  getUserMasteryData(userId, subject) {
    return {
      'concept1': {
        attempts: 10,
        recentScores: [85, 90, 88, 92],
        allScores: [65, 70, 75, 80, 85, 90, 88, 92]
      },
      'concept2': {
        attempts: 5,
        recentScores: [75, 78],
        allScores: [60, 65, 75, 78]
      }
    };
  }

  getConceptGraph(subject) {
    return {
      concepts: [
        { id: 'concept1', name: 'Basic Concepts', prerequisites: [] },
        { id: 'concept2', name: 'Intermediate Topics', prerequisites: ['concept1'] },
        { id: 'concept3', name: 'Advanced Applications', prerequisites: ['concept1', 'concept2'] }
      ]
    };
  }

  getLearningHistory(userId, subject) {
    return [
      { conceptId: 'concept1', timestamp: Date.now() - 86400000, score: 85 },
      { conceptId: 'concept2', timestamp: Date.now() - 43200000, score: 78 }
    ];
  }

  getConcept(conceptId) {
    const concepts = {
      'concept1': { id: 'concept1', name: 'Basic Concepts', prerequisites: [] },
      'concept2': { id: 'concept2', name: 'Intermediate Topics', prerequisites: ['concept1'] }
    };
    return concepts[conceptId];
  }
}

export default UserProfileEngine;
