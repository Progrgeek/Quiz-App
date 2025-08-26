/**
 * Leveling System Implementation
 * Experience points (XP) calculation and level progression
 * Skill-specific levels and rewards system
 */

// Experience Point Calculation System
export class LevelingSystem {
  constructor() {
    this.globalLevelCurve = this.generateLevelCurve();
    this.skillMultipliers = {
      reading: 1.0,
      grammar: 1.2,    // Harder skill, more XP
      vocabulary: 0.9,  // Easier skill, less XP
      listening: 1.1,
      writing: 1.3,     // Hardest skill, most XP
      pronunciation: 1.2,
      comprehension: 1.1,
      conversation: 1.4,
      academic: 1.5,
      business: 1.3
    };
    
    this.difficultyMultipliers = {
      1: 0.5,   // Very Easy
      2: 0.7,   // Easy
      3: 0.9,   // Normal
      4: 1.0,   // Medium (baseline)
      5: 1.2,   // Hard
      6: 1.5,   // Very Hard
      7: 1.8,   // Expert
      8: 2.2,   // Master
      9: 2.7,   // Legendary
      10: 3.5   // Mythic
    };
  }

  // Calculate XP for exercise completion
  calculateXP(exerciseResult) {
    const baseXP = this.getBaseXP(exerciseResult.difficulty);
    const scoreMultiplier = this.calculateScoreMultiplier(exerciseResult.score);
    const speedBonus = this.calculateSpeedBonus(exerciseResult.timeToComplete, exerciseResult.difficulty);
    const streakBonus = this.calculateStreakBonus(exerciseResult.currentStreak);
    const skillMultiplier = this.skillMultipliers[exerciseResult.skill] || 1.0;
    const difficultyMultiplier = this.difficultyMultipliers[exerciseResult.difficulty] || 1.0;
    
    const totalXP = Math.round(
      baseXP * scoreMultiplier * speedBonus * streakBonus * skillMultiplier * difficultyMultiplier
    );
    
    return {
      totalXP,
      breakdown: {
        base: baseXP,
        scoreBonus: Math.round(baseXP * (scoreMultiplier - 1)),
        speedBonus: Math.round(baseXP * (speedBonus - 1)),
        streakBonus: Math.round(baseXP * (streakBonus - 1)),
        skillBonus: Math.round(baseXP * (skillMultiplier - 1)),
        difficultyBonus: Math.round(baseXP * (difficultyMultiplier - 1))
      },
      multipliers: {
        score: scoreMultiplier,
        speed: speedBonus,
        streak: streakBonus,
        skill: skillMultiplier,
        difficulty: difficultyMultiplier
      }
    };
  }

  // Get base XP for difficulty level
  getBaseXP(difficulty) {
    const baseValues = {
      1: 10,   // Very Easy
      2: 15,   // Easy
      3: 20,   // Normal
      4: 25,   // Medium
      5: 35,   // Hard
      6: 50,   // Very Hard
      7: 70,   // Expert
      8: 100,  // Master
      9: 150,  // Legendary
      10: 250  // Mythic
    };
    
    return baseValues[difficulty] || 25; // Default to medium
  }

  // Calculate score-based multiplier
  calculateScoreMultiplier(score) {
    if (score >= 100) return 2.0;      // Perfect score - double XP
    if (score >= 95) return 1.8;       // Near perfect
    if (score >= 90) return 1.5;       // Excellent
    if (score >= 80) return 1.2;       // Good
    if (score >= 70) return 1.0;       // Baseline
    if (score >= 60) return 0.8;       // Below average
    if (score >= 50) return 0.6;       // Poor
    return 0.4;                        // Very poor
  }

  // Calculate speed bonus multiplier
  calculateSpeedBonus(timeToComplete, difficulty) {
    // Expected time based on difficulty (in seconds)
    const expectedTimes = {
      1: 30,   // Very Easy - 30 seconds
      2: 45,   // Easy - 45 seconds
      3: 60,   // Normal - 1 minute
      4: 90,   // Medium - 1.5 minutes
      5: 120,  // Hard - 2 minutes
      6: 180,  // Very Hard - 3 minutes
      7: 240,  // Expert - 4 minutes
      8: 300,  // Master - 5 minutes
      9: 420,  // Legendary - 7 minutes
      10: 600  // Mythic - 10 minutes
    };
    
    const expectedTime = expectedTimes[difficulty] || 90;
    const timeRatio = expectedTime / timeToComplete;
    
    if (timeRatio >= 2.0) return 1.5;      // Twice as fast - bonus
    if (timeRatio >= 1.5) return 1.3;      // 50% faster - good bonus
    if (timeRatio >= 1.2) return 1.1;      // 20% faster - small bonus
    if (timeRatio >= 0.8) return 1.0;      // Normal speed - no bonus/penalty
    if (timeRatio >= 0.6) return 0.9;      // Slow - small penalty
    return 0.8;                            // Very slow - penalty
  }

  // Calculate streak bonus multiplier
  calculateStreakBonus(currentStreak) {
    if (currentStreak >= 30) return 1.5;    // Month+ streak
    if (currentStreak >= 14) return 1.3;    // Two week streak
    if (currentStreak >= 7) return 1.2;     // Week streak
    if (currentStreak >= 3) return 1.1;     // Few days streak
    return 1.0;                             // No streak bonus
  }

  // Generate level progression curve
  generateLevelCurve() {
    const levels = [];
    let cumulativeXP = 0;
    
    for (let level = 1; level <= 100; level++) {
      // Exponential curve: each level requires ~15% more XP than previous
      const xpRequired = Math.round(100 * Math.pow(1.15, level - 1));
      cumulativeXP += xpRequired;
      
      levels.push({
        level,
        xpRequired,
        xpTotal: cumulativeXP,
        rewards: this.getLevelRewards(level),
        title: this.getLevelTitle(level),
        prestigeLevel: this.getPrestigeLevel(level)
      });
    }
    return levels;
  }

  // Get rewards for reaching a level
  getLevelRewards(level) {
    const rewards = [];
    
    // Every level: XP bonus for next exercises
    rewards.push({
      type: 'xp_bonus',
      item: `xp_boost_${level}`,
      name: `${level}% XP Boost`,
      description: `${level}% bonus XP for the next 5 exercises`,
      value: level,
      duration: 5
    });
    
    // Every 5 levels: unlock new customization
    if (level % 5 === 0) {
      rewards.push({
        type: 'customization',
        item: `avatar_${level}`,
        name: `Level ${level} Avatar`,
        description: `Exclusive avatar unlocked at level ${level}`,
        rarity: level >= 50 ? 'epic' : level >= 25 ? 'rare' : 'uncommon'
      });
    }
    
    // Every 10 levels: unlock new features
    if (level % 10 === 0) {
      rewards.push({
        type: 'feature',
        item: this.getFeatureUnlock(level),
        name: `Level ${level} Feature`,
        description: `New functionality unlocked!`,
        feature: this.getFeatureUnlock(level)
      });
    }
    
    // Milestone levels: special rewards
    if ([25, 50, 75, 100].includes(level)) {
      rewards.push({
        type: 'special',
        item: `milestone_${level}`,
        name: `${level} Level Master`,
        description: `Special milestone achievement!`,
        rarity: 'legendary',
        exclusive: true
      });
    }
    
    // High level rewards
    if (level >= 90) {
      rewards.push({
        type: 'prestige',
        item: `prestige_${level}`,
        name: 'Prestige Status',
        description: 'Elite learner recognition',
        rarity: 'mythic'
      });
    }
    
    return rewards;
  }

  // Get feature unlocks for specific levels
  getFeatureUnlock(level) {
    const features = {
      10: 'advanced_statistics',
      20: 'custom_exercises',
      30: 'mentor_mode',
      40: 'ai_tutor',
      50: 'expert_challenges',
      60: 'learning_paths',
      70: 'community_features',
      80: 'content_creation',
      90: 'beta_features',
      100: 'everything_unlocked'
    };
    
    return features[level] || 'bonus_content';
  }

  // Get title for level
  getLevelTitle(level) {
    if (level >= 90) return 'Grandmaster';
    if (level >= 80) return 'Master';
    if (level >= 70) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 50) return 'Proficient';
    if (level >= 40) return 'Skilled';
    if (level >= 30) return 'Competent';
    if (level >= 20) return 'Developing';
    if (level >= 10) return 'Learner';
    return 'Beginner';
  }

  // Get prestige level (for very high levels)
  getPrestigeLevel(level) {
    if (level >= 100) return Math.floor((level - 100) / 25) + 1;
    return 0;
  }

  // Calculate current level from XP
  calculateLevel(totalXP) {
    for (let i = 0; i < this.globalLevelCurve.length; i++) {
      if (totalXP < this.globalLevelCurve[i].xpTotal) {
        return {
          level: this.globalLevelCurve[i].level,
          currentXP: totalXP - (i > 0 ? this.globalLevelCurve[i - 1].xpTotal : 0),
          xpRequired: this.globalLevelCurve[i].xpRequired,
          xpToNext: this.globalLevelCurve[i].xpTotal - totalXP,
          progress: i > 0 ? 
            (totalXP - this.globalLevelCurve[i - 1].xpTotal) / this.globalLevelCurve[i].xpRequired :
            totalXP / this.globalLevelCurve[i].xpRequired,
          title: this.globalLevelCurve[i].title,
          rewards: this.globalLevelCurve[i].rewards,
          prestigeLevel: this.globalLevelCurve[i].prestigeLevel
        };
      }
    }
    
    // Max level reached
    const maxLevel = this.globalLevelCurve[this.globalLevelCurve.length - 1];
    return {
      level: maxLevel.level,
      currentXP: totalXP - maxLevel.xpTotal + maxLevel.xpRequired,
      xpRequired: maxLevel.xpRequired,
      xpToNext: 0,
      progress: 1.0,
      title: 'Legendary Master',
      rewards: maxLevel.rewards,
      prestigeLevel: this.getPrestigeLevel(maxLevel.level)
    };
  }

  // Skill-specific leveling
  calculateSkillLevel(skillXP, skillName) {
    // Skills have separate level curves
    const skillCurve = this.generateSkillLevelCurve(skillName);
    
    for (let i = 0; i < skillCurve.length; i++) {
      if (skillXP < skillCurve[i].xpTotal) {
        return {
          level: skillCurve[i].level,
          currentXP: skillXP - (i > 0 ? skillCurve[i - 1].xpTotal : 0),
          xpRequired: skillCurve[i].xpRequired,
          xpToNext: skillCurve[i].xpTotal - skillXP,
          progress: i > 0 ? 
            (skillXP - skillCurve[i - 1].xpTotal) / skillCurve[i].xpRequired :
            skillXP / skillCurve[i].xpRequired,
          skillName,
          mastery: this.getSkillMastery(skillCurve[i].level),
          benefits: this.getSkillBenefits(skillName, skillCurve[i].level)
        };
      }
    }
    
    // Max skill level
    const maxLevel = skillCurve[skillCurve.length - 1];
    return {
      level: maxLevel.level,
      currentXP: skillXP,
      xpRequired: maxLevel.xpRequired,
      xpToNext: 0,
      progress: 1.0,
      skillName,
      mastery: 'Grandmaster',
      benefits: this.getSkillBenefits(skillName, maxLevel.level)
    };
  }

  // Generate skill-specific level curve
  generateSkillLevelCurve(skillName) {
    const skillCurve = [];
    const multiplier = this.skillMultipliers[skillName] || 1.0;
    let cumulativeXP = 0;
    
    for (let level = 1; level <= 20; level++) {
      // Skills have shorter curves but steeper requirements
      const baseXP = Math.round(50 * Math.pow(1.2, level - 1) * multiplier);
      cumulativeXP += baseXP;
      
      skillCurve.push({
        level,
        xpRequired: baseXP,
        xpTotal: cumulativeXP,
        mastery: this.getSkillMastery(level),
        benefits: this.getSkillBenefits(skillName, level)
      });
    }
    
    return skillCurve;
  }

  // Get skill mastery level
  getSkillMastery(level) {
    if (level >= 20) return 'Grandmaster';
    if (level >= 18) return 'Master';
    if (level >= 15) return 'Expert';
    if (level >= 12) return 'Advanced';
    if (level >= 10) return 'Proficient';
    if (level >= 8) return 'Competent';
    if (level >= 6) return 'Developing';
    if (level >= 4) return 'Basic';
    if (level >= 2) return 'Novice';
    return 'Beginner';
  }

  // Get benefits for skill levels
  getSkillBenefits(skillName, level) {
    const benefits = [];
    
    // Universal benefits
    if (level >= 5) benefits.push('Reduced hint cooldown');
    if (level >= 10) benefits.push('Bonus XP for this skill');
    if (level >= 15) benefits.push('Unlock expert exercises');
    if (level >= 20) benefits.push('Master trainer status');
    
    // Skill-specific benefits
    const skillBenefits = {
      reading: [
        'Faster reading comprehension',
        'Advanced text analysis',
        'Speed reading techniques'
      ],
      writing: [
        'Grammar assistance',
        'Style suggestions',
        'Creative writing prompts'
      ],
      speaking: [
        'Pronunciation feedback',
        'Accent training',
        'Conversation partners'
      ],
      listening: [
        'Audio speed control',
        'Accent variety',
        'Background noise training'
      ]
    };
    
    const specific = skillBenefits[skillName] || [];
    if (level >= 5 && specific[0]) benefits.push(specific[0]);
    if (level >= 10 && specific[1]) benefits.push(specific[1]);
    if (level >= 15 && specific[2]) benefits.push(specific[2]);
    
    return benefits;
  }

  // Calculate level-up celebration
  calculateLevelUpCelebration(oldLevel, newLevel, rewards) {
    const celebration = {
      type: 'level_up',
      oldLevel,
      newLevel,
      levelGain: newLevel - oldLevel,
      rewards,
      animationType: this.getCelebrationType(newLevel),
      duration: this.getCelebrationDuration(newLevel),
      effects: this.getCelebrationEffects(newLevel)
    };
    
    // Special celebrations for milestone levels
    if ([10, 25, 50, 75, 100].includes(newLevel)) {
      celebration.special = true;
      celebration.animationType = 'milestone';
      celebration.duration *= 2;
    }
    
    return celebration;
  }

  // Get celebration type based on level
  getCelebrationType(level) {
    if (level >= 75) return 'legendary';
    if (level >= 50) return 'epic';
    if (level >= 25) return 'enhanced';
    if (level >= 10) return 'standard';
    return 'basic';
  }

  // Get celebration duration in milliseconds
  getCelebrationDuration(level) {
    if (level >= 75) return 5000;  // 5 seconds for legendary
    if (level >= 50) return 4000;  // 4 seconds for epic
    if (level >= 25) return 3000;  // 3 seconds for enhanced
    if (level >= 10) return 2500;  // 2.5 seconds for standard
    return 2000;                   // 2 seconds for basic
  }

  // Get celebration effects
  getCelebrationEffects(level) {
    const effects = ['level_up_sound', 'xp_burst_animation'];
    
    if (level >= 10) effects.push('confetti');
    if (level >= 25) effects.push('fireworks');
    if (level >= 50) effects.push('screen_shake');
    if (level >= 75) effects.push('golden_effects');
    if (level >= 100) effects.push('legendary_aura');
    
    return effects;
  }

  // Get XP required for next level
  getXPForNextLevel(currentLevel) {
    if (currentLevel >= this.globalLevelCurve.length) {
      return this.globalLevelCurve[this.globalLevelCurve.length - 1].xpRequired;
    }
    return this.globalLevelCurve[currentLevel].xpRequired;
  }

  // Get total XP required to reach a specific level
  getTotalXPForLevel(targetLevel) {
    if (targetLevel <= 1) return 0;
    if (targetLevel > this.globalLevelCurve.length) {
      return this.globalLevelCurve[this.globalLevelCurve.length - 1].xpTotal;
    }
    return this.globalLevelCurve[targetLevel - 2].xpTotal; // -2 because array is 0-indexed and we want XP to reach level
  }

  // Estimate time to next level
  estimateTimeToNextLevel(currentXP, avgXPPerSession) {
    const currentLevelInfo = this.calculateLevel(currentXP);
    if (currentLevelInfo.xpToNext === 0) return null; // Max level
    
    const sessionsNeeded = Math.ceil(currentLevelInfo.xpToNext / avgXPPerSession);
    return {
      sessionsNeeded,
      xpNeeded: currentLevelInfo.xpToNext,
      estimatedDays: Math.ceil(sessionsNeeded / 2) // Assuming 2 sessions per day average
    };
  }
}

// Export default instance
export const levelingSystem = new LevelingSystem();
