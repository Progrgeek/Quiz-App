/**
 * Achievement System Architecture
 * Comprehensive achievement taxonomy and condition engine
 * Based on learning science and gamification best practices
 */

// Achievement Categories and Definitions
export const ACHIEVEMENT_CATEGORIES = {
  PROGRESS: {
    name: 'Progress',
    description: 'Achievements for learning milestones',
    color: '#3B82F6',
    icon: '📈',
    achievements: [
      {
        id: 'first_steps',
        name: 'First Steps',
        description: 'Complete your first exercise',
        icon: '👶',
        points: 10,
        rarity: 'common',
        condition: (stats) => stats.exercisesCompleted >= 1,
        category: 'progress',
        unlockMessage: 'Welcome to your learning journey!',
        celebrationType: 'basic'
      },
      {
        id: 'getting_started',
        name: 'Getting Started',
        description: 'Complete 10 exercises',
        icon: '🚀',
        points: 50,
        rarity: 'common',
        condition: (stats) => stats.exercisesCompleted >= 10,
        category: 'progress',
        unlockMessage: 'You\'re building momentum!',
        celebrationType: 'basic'
      },
      {
        id: 'dedicated_learner',
        name: 'Dedicated Learner',
        description: 'Complete 50 exercises',
        icon: '📚',
        points: 150,
        rarity: 'uncommon',
        condition: (stats) => stats.exercisesCompleted >= 50,
        category: 'progress',
        unlockMessage: 'Your dedication is showing!',
        celebrationType: 'enhanced'
      },
      {
        id: 'century_club',
        name: 'Century Club',
        description: 'Complete 100 exercises',
        icon: '💯',
        points: 500,
        rarity: 'epic',
        condition: (stats) => stats.exercisesCompleted >= 100,
        category: 'progress',
        unlockMessage: 'One hundred exercises completed! Amazing!',
        celebrationType: 'spectacular'
      },
      {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Complete 500 exercises',
        icon: '🌟',
        points: 1500,
        rarity: 'legendary',
        condition: (stats) => stats.exercisesCompleted >= 500,
        category: 'progress',
        unlockMessage: 'You are truly unstoppable!',
        celebrationType: 'legendary'
      }
    ]
  },

  MASTERY: {
    name: 'Mastery',
    description: 'Achievements for skill excellence',
    color: '#10B981',
    icon: '🎯',
    achievements: [
      {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Score 100% on 5 exercises in a row',
        icon: '🎯',
        points: 100,
        rarity: 'rare',
        condition: (stats) => stats.perfectStreakMax >= 5,
        category: 'mastery',
        unlockMessage: 'Perfect execution! You\'re mastering this!',
        celebrationType: 'perfect'
      },
      {
        id: 'flawless_ten',
        name: 'Flawless Ten',
        description: 'Score 100% on 10 exercises in a row',
        icon: '💎',
        points: 250,
        rarity: 'epic',
        condition: (stats) => stats.perfectStreakMax >= 10,
        category: 'mastery',
        unlockMessage: 'Flawless performance! You\'re a true master!',
        celebrationType: 'spectacular'
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Complete 20 exercises in under 2 minutes each',
        icon: '⚡',
        points: 200,
        rarity: 'rare',
        condition: (stats) => stats.fastCompletions >= 20,
        category: 'mastery',
        unlockMessage: 'Lightning fast! Speed and accuracy combined!',
        celebrationType: 'speed'
      },
      {
        id: 'skill_master',
        name: 'Skill Master',
        description: 'Reach level 10 in any skill',
        icon: '👑',
        points: 300,
        rarity: 'epic',
        condition: (stats) => Math.max(...Object.values(stats.skillLevels || {})) >= 10,
        category: 'mastery',
        unlockMessage: 'You\'ve mastered a skill! Incredible achievement!',
        celebrationType: 'mastery'
      },
      {
        id: 'grand_master',
        name: 'Grand Master',
        description: 'Reach level 15 in any skill',
        icon: '🏆',
        points: 750,
        rarity: 'legendary',
        condition: (stats) => Math.max(...Object.values(stats.skillLevels || {})) >= 15,
        category: 'mastery',
        unlockMessage: 'Grand Master achieved! You are among the elite!',
        celebrationType: 'legendary'
      }
    ]
  },

  CONSISTENCY: {
    name: 'Consistency',
    description: 'Achievements for regular practice',
    color: '#F59E0B',
    icon: '🔥',
    achievements: [
      {
        id: 'on_fire',
        name: 'On Fire',
        description: 'Practice 3 days in a row',
        icon: '🔥',
        points: 50,
        rarity: 'common',
        condition: (stats) => stats.streakDays >= 3,
        category: 'consistency',
        unlockMessage: 'You\'re on fire! Keep the streak going!',
        celebrationType: 'streak'
      },
      {
        id: 'week_warrior',
        name: 'Week Warrior',
        description: 'Practice 7 days in a row',
        icon: '⚔️',
        points: 150,
        rarity: 'rare',
        condition: (stats) => stats.streakDays >= 7,
        category: 'consistency',
        unlockMessage: 'A full week of dedication! You\'re a warrior!',
        celebrationType: 'enhanced'
      },
      {
        id: 'monthly_champion',
        name: 'Monthly Champion',
        description: 'Practice 30 days in a row',
        icon: '🏅',
        points: 500,
        rarity: 'epic',
        condition: (stats) => stats.streakDays >= 30,
        category: 'consistency',
        unlockMessage: 'Thirty days straight! You\'re a true champion!',
        celebrationType: 'spectacular'
      },
      {
        id: 'habit_master',
        name: 'Habit Master',
        description: 'Practice 60 days in a row',
        icon: '🎖️',
        points: 1000,
        rarity: 'legendary',
        condition: (stats) => stats.streakDays >= 60,
        category: 'consistency',
        unlockMessage: 'Sixty days! You\'ve mastered the habit of learning!',
        celebrationType: 'legendary'
      },
      {
        id: 'daily_devotion',
        name: 'Daily Devotion',
        description: 'Practice every day for 100 days',
        icon: '🌅',
        points: 2000,
        rarity: 'mythic',
        condition: (stats) => stats.streakDays >= 100,
        category: 'consistency',
        unlockMessage: 'One hundred days of devotion! Legendary commitment!',
        celebrationType: 'mythic'
      }
    ]
  },

  EXPLORATION: {
    name: 'Exploration',
    description: 'Achievements for trying new things',
    color: '#8B5CF6',
    icon: '🗺️',
    achievements: [
      {
        id: 'curious_mind',
        name: 'Curious Mind',
        description: 'Try 3 different exercise types',
        icon: '🤔',
        points: 30,
        rarity: 'common',
        condition: (stats) => stats.exerciseTypesCompleted >= 3,
        category: 'exploration',
        unlockMessage: 'Curiosity is the key to learning!',
        celebrationType: 'basic'
      },
      {
        id: 'explorer',
        name: 'Explorer',
        description: 'Try all exercise types',
        icon: '🗺️',
        points: 200,
        rarity: 'rare',
        condition: (stats) => stats.exerciseTypesCompleted >= 10,
        category: 'exploration',
        unlockMessage: 'You\'ve explored all corners of learning!',
        celebrationType: 'enhanced'
      },
      {
        id: 'skill_sampler',
        name: 'Skill Sampler',
        description: 'Practice 5 different skills',
        icon: '🎨',
        points: 100,
        rarity: 'uncommon',
        condition: (stats) => Object.keys(stats.skillLevels || {}).length >= 5,
        category: 'exploration',
        unlockMessage: 'Diverse skills make a versatile learner!',
        celebrationType: 'enhanced'
      },
      {
        id: 'difficulty_climber',
        name: 'Difficulty Climber',
        description: 'Complete exercises at every difficulty level',
        icon: '🏔️',
        points: 250,
        rarity: 'epic',
        condition: (stats) => stats.difficultiesCompleted >= 10,
        category: 'exploration',
        unlockMessage: 'From easy to expert, you\'ve climbed every mountain!',
        celebrationType: 'spectacular'
      }
    ]
  },

  SOCIAL: {
    name: 'Social',
    description: 'Achievements for community engagement',
    color: '#EC4899',
    icon: '🤝',
    achievements: [
      {
        id: 'friendly',
        name: 'Friendly',
        description: 'Add your first friend',
        icon: '👋',
        points: 25,
        rarity: 'common',
        condition: (stats) => stats.friendsCount >= 1,
        category: 'social',
        unlockMessage: 'Learning is better with friends!',
        celebrationType: 'basic'
      },
      {
        id: 'helpful_helper',
        name: 'Helpful Helper',
        description: 'Help 5 friends with exercises',
        icon: '🤝',
        points: 100,
        rarity: 'uncommon',
        condition: (stats) => stats.friendsHelped >= 5,
        category: 'social',
        unlockMessage: 'Helping others helps you learn too!',
        celebrationType: 'enhanced'
      },
      {
        id: 'mentor',
        name: 'Mentor',
        description: 'Help 20 friends with exercises',
        icon: '👨‍🏫',
        points: 300,
        rarity: 'rare',
        condition: (stats) => stats.friendsHelped >= 20,
        category: 'social',
        unlockMessage: 'You\'re becoming a true mentor!',
        celebrationType: 'enhanced'
      },
      {
        id: 'team_player',
        name: 'Team Player',
        description: 'Complete 10 group challenges',
        icon: '⚽',
        points: 200,
        rarity: 'rare',
        condition: (stats) => stats.groupChallengesCompleted >= 10,
        category: 'social',
        unlockMessage: 'Teamwork makes the dream work!',
        celebrationType: 'enhanced'
      },
      {
        id: 'community_leader',
        name: 'Community Leader',
        description: 'Create and lead a study group',
        icon: '👑',
        points: 400,
        rarity: 'epic',
        condition: (stats) => stats.studyGroupsLed >= 1,
        category: 'social',
        unlockMessage: 'Leadership through learning - inspiring!',
        celebrationType: 'spectacular'
      }
    ]
  },

  SPECIAL: {
    name: 'Special',
    description: 'Unique and seasonal achievements',
    color: '#6366F1',
    icon: '✨',
    achievements: [
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Complete 10 exercises before 8 AM',
        icon: '🐦',
        points: 150,
        rarity: 'rare',
        condition: (stats) => stats.earlyMorningExercises >= 10,
        category: 'special',
        unlockMessage: 'The early bird catches the worm!',
        celebrationType: 'enhanced'
      },
      {
        id: 'night_owl',
        name: 'Night Owl',
        description: 'Complete 10 exercises after 10 PM',
        icon: '🦉',
        points: 150,
        rarity: 'rare',
        condition: (stats) => stats.lateNightExercises >= 10,
        category: 'special',
        unlockMessage: 'Burning the midnight oil to learn!',
        celebrationType: 'enhanced'
      },
      {
        id: 'weekend_warrior',
        name: 'Weekend Warrior',
        description: 'Complete 50 exercises on weekends',
        icon: '🏖️',
        points: 200,
        rarity: 'rare',
        condition: (stats) => stats.weekendExercises >= 50,
        category: 'special',
        unlockMessage: 'Learning never takes a break!',
        celebrationType: 'enhanced'
      },
      {
        id: 'comeback_kid',
        name: 'Comeback Kid',
        description: 'Return to learning after a 30-day break',
        icon: '💪',
        points: 100,
        rarity: 'uncommon',
        condition: (stats) => stats.comebackAfterBreak === true,
        category: 'special',
        unlockMessage: 'Welcome back! It\'s never too late to restart!',
        celebrationType: 'comeback'
      },
      {
        id: 'birthday_learner',
        name: 'Birthday Learner',
        description: 'Practice on your birthday',
        icon: '🎂',
        points: 100,
        rarity: 'special',
        condition: (stats) => stats.birthdayPractice === true,
        category: 'special',
        unlockMessage: 'Learning on your special day - what a gift to yourself!',
        celebrationType: 'birthday'
      }
    ]
  }
};

// Achievement Rarity System
export const ACHIEVEMENT_RARITY = {
  common: {
    name: 'Common',
    color: '#9CA3AF',
    borderColor: '#6B7280',
    pointsMultiplier: 1.0,
    celebrationIntensity: 'basic'
  },
  uncommon: {
    name: 'Uncommon',
    color: '#10B981',
    borderColor: '#059669',
    pointsMultiplier: 1.2,
    celebrationIntensity: 'enhanced'
  },
  rare: {
    name: 'Rare',
    color: '#3B82F6',
    borderColor: '#2563EB',
    pointsMultiplier: 1.5,
    celebrationIntensity: 'enhanced'
  },
  epic: {
    name: 'Epic',
    color: '#8B5CF6',
    borderColor: '#7C3AED',
    pointsMultiplier: 2.0,
    celebrationIntensity: 'spectacular'
  },
  legendary: {
    name: 'Legendary',
    color: '#F59E0B',
    borderColor: '#D97706',
    pointsMultiplier: 3.0,
    celebrationIntensity: 'legendary'
  },
  mythic: {
    name: 'Mythic',
    color: '#EF4444',
    borderColor: '#DC2626',
    pointsMultiplier: 5.0,
    celebrationIntensity: 'mythic'
  },
  special: {
    name: 'Special',
    color: '#EC4899',
    borderColor: '#DB2777',
    pointsMultiplier: 1.5,
    celebrationIntensity: 'special'
  }
};

// Achievement Engine Class
export class AchievementEngine {
  constructor() {
    this.unlockedAchievements = new Set();
    this.achievementProgress = new Map();
    this.listeners = [];
    this.allAchievements = this.flattenAchievements();
  }

  // Flatten all achievements from categories
  flattenAchievements() {
    const achievements = [];
    Object.values(ACHIEVEMENT_CATEGORIES).forEach(category => {
      achievements.push(...category.achievements);
    });
    return achievements;
  }

  // Add achievement unlock listener
  addListener(callback) {
    this.listeners.push(callback);
  }

  // Remove achievement unlock listener
  removeListener(callback) {
    this.listeners = this.listeners.filter(listener => listener !== callback);
  }

  // Notify listeners of achievement unlock
  notifyListeners(achievement, isNewUnlock) {
    this.listeners.forEach(callback => {
      try {
        callback(achievement, isNewUnlock);
      } catch (error) {
        console.error('Achievement listener error:', error);
      }
    });
  }

  // Check all achievements for a user
  checkAchievements(userStats) {
    const newlyUnlocked = [];
    
    this.allAchievements.forEach(achievement => {
      const wasUnlocked = this.unlockedAchievements.has(achievement.id);
      const isUnlocked = this.isAchievementUnlocked(achievement, userStats);
      
      if (isUnlocked && !wasUnlocked) {
        this.unlockedAchievements.add(achievement.id);
        newlyUnlocked.push(achievement);
        this.notifyListeners(achievement, true);
      }
      
      // Update progress for locked achievements
      if (!isUnlocked) {
        const progress = this.calculateAchievementProgress(achievement, userStats);
        this.achievementProgress.set(achievement.id, progress);
      }
    });

    return newlyUnlocked;
  }

  // Check if specific achievement is unlocked
  isAchievementUnlocked(achievement, userStats) {
    try {
      return achievement.condition(userStats);
    } catch (error) {
      console.error(`Error checking achievement ${achievement.id}:`, error);
      return false;
    }
  }

  // Calculate progress towards achievement
  calculateAchievementProgress(achievement, userStats) {
    try {
      // This is a simplified progress calculation
      // In a real implementation, you'd analyze the condition more deeply
      const conditionString = achievement.condition.toString();
      
      // Extract numeric targets from common patterns
      const numericMatch = conditionString.match(/>=\s*(\d+)/);
      if (numericMatch) {
        const target = parseInt(numericMatch[1]);
        
        // Try to determine which stat is being checked
        if (conditionString.includes('exercisesCompleted')) {
          return Math.min(100, (userStats.exercisesCompleted / target) * 100);
        } else if (conditionString.includes('streakDays')) {
          return Math.min(100, (userStats.streakDays / target) * 100);
        } else if (conditionString.includes('perfectStreakMax')) {
          return Math.min(100, (userStats.perfectStreakMax / target) * 100);
        } else if (conditionString.includes('exerciseTypesCompleted')) {
          return Math.min(100, (userStats.exerciseTypesCompleted / target) * 100);
        }
      }
      
      return 0; // Default to 0% if we can't determine progress
    } catch (error) {
      console.error(`Error calculating progress for ${achievement.id}:`, error);
      return 0;
    }
  }

  // Get achievements by category
  getAchievementsByCategory(categoryName) {
    return ACHIEVEMENT_CATEGORIES[categoryName]?.achievements || [];
  }

  // Get unlocked achievements
  getUnlockedAchievements() {
    return this.allAchievements.filter(achievement => 
      this.unlockedAchievements.has(achievement.id)
    );
  }

  // Get locked achievements with progress
  getLockedAchievements() {
    return this.allAchievements
      .filter(achievement => !this.unlockedAchievements.has(achievement.id))
      .map(achievement => ({
        ...achievement,
        progress: this.achievementProgress.get(achievement.id) || 0
      }));
  }

  // Get achievements by rarity
  getAchievementsByRarity(rarity) {
    return this.allAchievements.filter(achievement => 
      achievement.rarity === rarity
    );
  }

  // Calculate total achievement points
  calculateTotalPoints() {
    return this.getUnlockedAchievements().reduce((total, achievement) => {
      const rarity = ACHIEVEMENT_RARITY[achievement.rarity];
      return total + (achievement.points * rarity.pointsMultiplier);
    }, 0);
  }

  // Get achievement statistics
  getAchievementStats() {
    const total = this.allAchievements.length;
    const unlocked = this.unlockedAchievements.size;
    const locked = total - unlocked;
    
    // Count by category
    const byCategory = {};
    Object.keys(ACHIEVEMENT_CATEGORIES).forEach(category => {
      const categoryAchievements = this.getAchievementsByCategory(category);
      const categoryUnlocked = categoryAchievements.filter(a => 
        this.unlockedAchievements.has(a.id)
      ).length;
      
      byCategory[category] = {
        total: categoryAchievements.length,
        unlocked: categoryUnlocked,
        percentage: Math.round((categoryUnlocked / categoryAchievements.length) * 100)
      };
    });

    // Count by rarity
    const byRarity = {};
    Object.keys(ACHIEVEMENT_RARITY).forEach(rarity => {
      const rarityAchievements = this.getAchievementsByRarity(rarity);
      const rarityUnlocked = rarityAchievements.filter(a => 
        this.unlockedAchievements.has(a.id)
      ).length;
      
      byRarity[rarity] = {
        total: rarityAchievements.length,
        unlocked: rarityUnlocked,
        percentage: rarityAchievements.length > 0 ? 
          Math.round((rarityUnlocked / rarityAchievements.length) * 100) : 0
      };
    });

    return {
      overall: {
        total,
        unlocked,
        locked,
        percentage: Math.round((unlocked / total) * 100)
      },
      byCategory,
      byRarity,
      totalPoints: this.calculateTotalPoints()
    };
  }

  // Get next achievements to unlock
  getNextAchievements(userStats, count = 5) {
    return this.getLockedAchievements()
      .sort((a, b) => b.progress - a.progress) // Sort by progress descending
      .slice(0, count)
      .map(achievement => ({
        ...achievement,
        estimatedExercisesToUnlock: this.estimateExercisesToUnlock(achievement, userStats)
      }));
  }

  // Estimate exercises needed to unlock achievement
  estimateExercisesToUnlock(achievement, userStats) {
    const conditionString = achievement.condition.toString();
    
    if (conditionString.includes('exercisesCompleted')) {
      const match = conditionString.match(/>=\s*(\d+)/);
      if (match) {
        const target = parseInt(match[1]);
        return Math.max(0, target - userStats.exercisesCompleted);
      }
    }
    
    return null; // Can't estimate for this type of achievement
  }

  // Reset achievement progress (for testing or user reset)
  reset() {
    this.unlockedAchievements.clear();
    this.achievementProgress.clear();
  }

  // Load achievement state from storage
  loadState(achievementData) {
    if (achievementData.unlockedAchievements) {
      this.unlockedAchievements = new Set(achievementData.unlockedAchievements);
    }
    if (achievementData.achievementProgress) {
      this.achievementProgress = new Map(achievementData.achievementProgress);
    }
  }

  // Save achievement state to storage
  saveState() {
    return {
      unlockedAchievements: Array.from(this.unlockedAchievements),
      achievementProgress: Array.from(this.achievementProgress.entries())
    };
  }
}

// Export default instance
export const achievementEngine = new AchievementEngine();
