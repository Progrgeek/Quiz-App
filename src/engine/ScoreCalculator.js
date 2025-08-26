/**
 * Score Calculator
 * Advanced scoring system with bonuses and penalties
 */

export class ScoreCalculator {
  constructor(scoringConfig = {}) {
    this.config = {
      baseScore: 100,
      timeBonus: {
        enabled: true,
        maxBonus: 50, // Maximum 50% bonus
        fastAnswerThreshold: 10000 // 10 seconds
      },
      difficultyMultiplier: {
        easy: 1.0,
        medium: 1.25,
        hard: 1.5
      },
      hintPenalty: {
        enabled: true,
        penaltyPerHint: 10 // 10% penalty per hint
      },
      partialCredit: {
        enabled: true,
        minimumScore: 0.1 // Minimum 10% for any attempt
      },
      streakBonus: {
        enabled: true,
        bonusPerStreak: 5, // 5% bonus per consecutive correct
        maxStreak: 10
      },
      ...scoringConfig
    };
  }
  
  calculateScore(validation, metadata = {}) {
    const {
      timeToAnswer = 0,
      difficulty = 'medium',
      hintsUsed = 0,
      isPartOfStreak = false,
      streakLength = 0
    } = metadata;
    
    let score = 0;
    const breakdown = {};
    
    // Base score
    if (validation.isCorrect) {
      score = this.config.baseScore;
      breakdown.base = this.config.baseScore;
    } else if (validation.partialCredit && this.config.partialCredit.enabled) {
      score = this.config.baseScore * Math.max(
        validation.partialCredit, 
        this.config.partialCredit.minimumScore
      );
      breakdown.base = score;
      breakdown.partialCredit = validation.partialCredit;
    }
    
    // Difficulty multiplier
    const difficultyBonus = (this.config.difficultyMultiplier[difficulty] - 1) * score;
    score *= this.config.difficultyMultiplier[difficulty];
    breakdown.difficultyMultiplier = this.config.difficultyMultiplier[difficulty];
    breakdown.difficultyBonus = difficultyBonus;
    
    // Time bonus (only for correct answers)
    if (validation.isCorrect && this.config.timeBonus.enabled && timeToAnswer > 0) {
      const timeBonus = this.calculateTimeBonus(timeToAnswer, score);
      score += timeBonus;
      breakdown.timeBonus = timeBonus;
    }
    
    // Hint penalty
    if (this.config.hintPenalty.enabled && hintsUsed > 0) {
      const penalty = score * (hintsUsed * this.config.hintPenalty.penaltyPerHint / 100);
      score -= penalty;
      breakdown.hintPenalty = -penalty;
    }
    
    // Streak bonus
    if (validation.isCorrect && this.config.streakBonus.enabled && streakLength > 1) {
      const streakBonus = this.calculateStreakBonus(streakLength, score);
      score += streakBonus;
      breakdown.streakBonus = streakBonus;
    }
    
    // Ensure minimum score of 0
    score = Math.max(0, score);
    
    return {
      points: Math.round(score),
      breakdown,
      metadata: {
        timeToAnswer,
        difficulty,
        hintsUsed,
        streakLength,
        isCorrect: validation.isCorrect,
        partialCredit: validation.partialCredit
      }
    };
  }
  
  calculateTimeBonus(timeToAnswer, baseScore) {
    if (timeToAnswer >= this.config.timeBonus.fastAnswerThreshold) {
      return 0;
    }
    
    // Linear decrease from max bonus to 0
    const timeRatio = 1 - (timeToAnswer / this.config.timeBonus.fastAnswerThreshold);
    const bonusMultiplier = timeRatio * (this.config.timeBonus.maxBonus / 100);
    
    return baseScore * bonusMultiplier;
  }
  
  calculateStreakBonus(streakLength, baseScore) {
    const effectiveStreak = Math.min(streakLength - 1, this.config.streakBonus.maxStreak);
    const bonusMultiplier = effectiveStreak * (this.config.streakBonus.bonusPerStreak / 100);
    
    return baseScore * bonusMultiplier;
  }
  
  calculateFinalScore(exerciseData) {
    const { answers, totalTime, questionsCount } = exerciseData;
    
    let totalScore = 0;
    let correctAnswers = 0;
    let currentStreak = 0;
    let longestStreak = 0;
    const detailedScores = [];
    
    // Calculate scores with streak tracking
    for (const [questionIndex, answerData] of answers) {
      const { validation } = answerData;
      
      // Update streak
      if (validation.isCorrect) {
        currentStreak++;
        correctAnswers++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
      
      // Calculate score for this question
      const scoreData = this.calculateScore(validation, {
        ...answerData,
        streakLength: currentStreak
      });
      
      totalScore += scoreData.points;
      detailedScores.push({
        questionIndex,
        score: scoreData,
        answerData
      });
    }
    
    // Calculate performance metrics
    const accuracy = questionsCount > 0 ? correctAnswers / questionsCount : 0;
    const averageTimePerQuestion = questionsCount > 0 ? totalTime / questionsCount : 0;
    const efficiency = this.calculateEfficiency(accuracy, averageTimePerQuestion);
    
    // Calculate completion bonus
    const completionBonus = questionsCount === answers.size ? 
      Math.round(totalScore * 0.1) : 0; // 10% bonus for completing all questions
    
    return {
      total: totalScore + completionBonus,
      baseTotal: totalScore,
      completionBonus,
      correctAnswers,
      totalQuestions: questionsCount,
      accuracy: Math.round(accuracy * 100),
      longestStreak,
      averageTimePerQuestion: Math.round(averageTimePerQuestion),
      efficiency: Math.round(efficiency * 100),
      detailedScores,
      grade: this.calculateGrade(accuracy),
      performance: this.getPerformanceLevel(accuracy, efficiency)
    };
  }
  
  calculateEfficiency(accuracy, averageTime) {
    // Efficiency combines accuracy with speed
    // Normalize time (assume 30 seconds is average, 10 seconds is very fast)
    const timeScore = Math.max(0, Math.min(1, (30000 - averageTime) / 20000));
    return (accuracy * 0.7) + (timeScore * 0.3);
  }
  
  calculateGrade(accuracy) {
    if (accuracy >= 0.97) return 'A+';
    if (accuracy >= 0.93) return 'A';
    if (accuracy >= 0.90) return 'A-';
    if (accuracy >= 0.87) return 'B+';
    if (accuracy >= 0.83) return 'B';
    if (accuracy >= 0.80) return 'B-';
    if (accuracy >= 0.77) return 'C+';
    if (accuracy >= 0.73) return 'C';
    if (accuracy >= 0.70) return 'C-';
    if (accuracy >= 0.67) return 'D+';
    if (accuracy >= 0.60) return 'D';
    return 'F';
  }
  
  getPerformanceLevel(accuracy, efficiency) {
    const combined = (accuracy + efficiency) / 2;
    
    if (combined >= 0.9) return 'Excellent';
    if (combined >= 0.8) return 'Very Good';
    if (combined >= 0.7) return 'Good';
    if (combined >= 0.6) return 'Satisfactory';
    return 'Needs Improvement';
  }
  
  getMaximumPossibleScore(questionsCount) {
    // Calculate theoretical maximum with all bonuses
    const baseScore = this.config.baseScore * questionsCount;
    const maxDifficultyBonus = baseScore * (this.config.difficultyMultiplier.hard - 1);
    const maxTimeBonus = baseScore * (this.config.timeBonus.maxBonus / 100);
    const maxStreakBonus = baseScore * (this.config.streakBonus.maxStreak * this.config.streakBonus.bonusPerStreak / 100);
    const completionBonus = baseScore * 0.1;
    
    return Math.round(baseScore + maxDifficultyBonus + maxTimeBonus + maxStreakBonus + completionBonus);
  }
  
  getScorePercentage(currentScore, questionsCount) {
    const maxScore = this.getMaximumPossibleScore(questionsCount);
    return maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0;
  }
  
  // Update scoring configuration
  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
  }
  
  // Get current configuration
  getConfig() {
    return { ...this.config };
  }
}

export default ScoreCalculator;
