import React, { useState, useEffect } from 'react';

// Streak & Habits System - Core functionality
export class StreakSystem {
  constructor() {
    this.streaks = new Map();
    this.habits = new Map();
    this.habitTemplates = new Map();
    this.streakHistory = new Map();
    this.motivationSupport = new Map();
    
    this.initializeSystem();
  }

  initializeSystem() {
    // Initialize default habit templates
    this.createHabitTemplates();
    
    // Initialize user's current streaks and habits
    this.initializeUserData();
  }

  // Habit Templates
  createHabitTemplates() {
    const templates = [
      {
        id: 'daily-study',
        name: 'Daily Study Session',
        description: 'Complete at least one learning session each day',
        category: 'learning',
        difficulty: 'easy',
        targetFrequency: 'daily',
        minDuration: 15, // minutes
        icon: '📚',
        color: '#3B82F6',
        motivationTips: [
          'Start with just 15 minutes a day',
          'Study at the same time each day to build routine',
          'Choose a quiet, dedicated study space'
        ],
        rewards: {
          7: { type: 'badge', name: 'Week Warrior', points: 500 },
          14: { type: 'badge', name: 'Fortnight Fighter', points: 1000 },
          30: { type: 'badge', name: 'Monthly Master', points: 2500 },
          100: { type: 'badge', name: 'Century Scholar', points: 10000 }
        }
      },
      {
        id: 'exercise-complete',
        name: 'Complete 5 Exercises',
        description: 'Finish at least 5 exercises daily',
        category: 'practice',
        difficulty: 'medium',
        targetFrequency: 'daily',
        targetCount: 5,
        icon: '✏️',
        color: '#10B981',
        motivationTips: [
          'Mix different exercise types for variety',
          'Focus on quality over speed',
          'Review mistakes to improve understanding'
        ],
        rewards: {
          5: { type: 'badge', name: 'Practice Starter', points: 250 },
          15: { type: 'badge', name: 'Exercise Expert', points: 750 },
          30: { type: 'badge', name: 'Daily Doer', points: 2000 }
        }
      },
      {
        id: 'perfect-scores',
        name: 'Perfect Score Streak',
        description: 'Achieve perfect scores on exercises',
        category: 'mastery',
        difficulty: 'hard',
        targetFrequency: 'daily',
        targetCount: 1,
        icon: '💯',
        color: '#F59E0B',
        motivationTips: [
          'Take your time to think through each answer',
          'Review concepts before attempting exercises',
          'Practice makes perfect - keep trying!'
        ],
        rewards: {
          3: { type: 'badge', name: 'Triple Perfect', points: 300 },
          7: { type: 'badge', name: 'Perfect Week', points: 1000 },
          21: { type: 'badge', name: 'Perfection Master', points: 5000 }
        }
      },
      {
        id: 'consistency',
        name: 'Learning Consistency',
        description: 'Study for at least 30 minutes daily',
        category: 'consistency',
        difficulty: 'medium',
        targetFrequency: 'daily',
        minDuration: 30,
        icon: '⏰',
        color: '#8B5CF6',
        motivationTips: [
          'Break study time into smaller chunks if needed',
          'Use a timer to track your progress',
          'Reward yourself after each session'
        ],
        rewards: {
          7: { type: 'badge', name: 'Consistent Learner', points: 700 },
          30: { type: 'badge', name: 'Dedication Defender', points: 3000 }
        }
      },
      {
        id: 'social-interaction',
        name: 'Social Learning',
        description: 'Interact with friends or study groups daily',
        category: 'social',
        difficulty: 'easy',
        targetFrequency: 'daily',
        targetCount: 1,
        icon: '👥',
        color: '#EF4444',
        motivationTips: [
          'Join study groups that match your interests',
          'Help others with their learning challenges',
          'Share your progress with friends'
        ],
        rewards: {
          7: { type: 'badge', name: 'Social Butterfly', points: 500 },
          14: { type: 'badge', name: 'Community Builder', points: 1200 }
        }
      },
      {
        id: 'weekly-challenge',
        name: 'Weekly Challenge',
        description: 'Complete weekly challenges consistently',
        category: 'challenge',
        difficulty: 'medium',
        targetFrequency: 'weekly',
        targetCount: 1,
        icon: '🏆',
        color: '#06B6D4',
        motivationTips: [
          'Set aside time each weekend for challenges',
          'Choose challenges that align with your goals',
          'Celebrate completing difficult challenges'
        ],
        rewards: {
          4: { type: 'badge', name: 'Challenge Champion', points: 1000 },
          12: { type: 'badge', name: 'Challenge Master', points: 3000 }
        }
      }
    ];

    templates.forEach(template => {
      this.habitTemplates.set(template.id, template);
    });
  }

  // Initialize user data with sample streaks and habits
  initializeUserData() {
    const currentUser = 'current-user';
    
    // Current active streaks
    this.streaks.set('daily-study', {
      id: 'daily-study',
      userId: currentUser,
      habitId: 'daily-study',
      currentStreak: 12,
      longestStreak: 28,
      startDate: Date.now() - (12 * 24 * 60 * 60 * 1000), // 12 days ago
      lastActivityDate: Date.now() - (0 * 24 * 60 * 60 * 1000), // Today
      isActive: true,
      history: this.generateStreakHistory(12, 'daily-study')
    });

    this.streaks.set('exercise-complete', {
      id: 'exercise-complete',
      userId: currentUser,
      habitId: 'exercise-complete',
      currentStreak: 8,
      longestStreak: 15,
      startDate: Date.now() - (8 * 24 * 60 * 60 * 1000),
      lastActivityDate: Date.now() - (0 * 24 * 60 * 60 * 1000),
      isActive: true,
      history: this.generateStreakHistory(8, 'exercise-complete')
    });

    this.streaks.set('perfect-scores', {
      id: 'perfect-scores',
      userId: currentUser,
      habitId: 'perfect-scores',
      currentStreak: 3,
      longestStreak: 7,
      startDate: Date.now() - (3 * 24 * 60 * 60 * 1000),
      lastActivityDate: Date.now() - (0 * 24 * 60 * 60 * 1000),
      isActive: true,
      history: this.generateStreakHistory(3, 'perfect-scores')
    });

    // Active habits
    this.habits.set('daily-study', {
      id: 'daily-study',
      userId: currentUser,
      templateId: 'daily-study',
      isActive: true,
      startDate: Date.now() - (30 * 24 * 60 * 60 * 1000),
      currentProgress: {
        todayCompleted: true,
        weekProgress: 6, // out of 7
        monthProgress: 28 // out of 30
      },
      statistics: {
        totalCompletions: 28,
        completionRate: 93.3,
        averageSessionDuration: 25,
        bestStreak: 28,
        currentStreak: 12
      }
    });

    this.habits.set('exercise-complete', {
      id: 'exercise-complete',
      userId: currentUser,
      templateId: 'exercise-complete',
      isActive: true,
      startDate: Date.now() - (20 * 24 * 60 * 60 * 1000),
      currentProgress: {
        todayCompleted: true,
        weekProgress: 5,
        monthProgress: 18
      },
      statistics: {
        totalCompletions: 18,
        completionRate: 90,
        averageExercisesPerDay: 6.2,
        bestStreak: 15,
        currentStreak: 8
      }
    });
  }

  // Generate sample streak history
  generateStreakHistory(streakLength, habitId) {
    const history = [];
    const template = this.habitTemplates.get(habitId);
    
    for (let i = streakLength - 1; i >= 0; i--) {
      const date = new Date(Date.now() - (i * 24 * 60 * 60 * 1000));
      history.push({
        date: date.toISOString().split('T')[0],
        completed: true,
        value: this.generateActivityValue(template),
        notes: i === 0 ? 'Completed today!' : `Day ${streakLength - i} of streak`
      });
    }
    
    return history;
  }

  generateActivityValue(template) {
    switch (template.category) {
      case 'learning':
        return Math.floor(Math.random() * 30 + 15); // 15-45 minutes
      case 'practice':
        return Math.floor(Math.random() * 5 + 5); // 5-10 exercises
      case 'mastery':
        return 1; // 1 perfect score
      case 'consistency':
        return Math.floor(Math.random() * 45 + 30); // 30-75 minutes
      case 'social':
        return Math.floor(Math.random() * 3 + 1); // 1-4 interactions
      case 'challenge':
        return 1; // 1 challenge completed
      default:
        return 1;
    }
  }

  // Streak management
  updateStreak(habitId, completed = true, value = 1) {
    const streak = this.streaks.get(habitId);
    const today = new Date().toISOString().split('T')[0];
    
    if (!streak) {
      // Create new streak
      if (completed) {
        this.streaks.set(habitId, {
          id: habitId,
          habitId,
          currentStreak: 1,
          longestStreak: 1,
          startDate: Date.now(),
          lastActivityDate: Date.now(),
          isActive: true,
          history: [{
            date: today,
            completed: true,
            value,
            notes: 'Streak started!'
          }]
        });
      }
      return;
    }

    const lastActivity = new Date(streak.lastActivityDate);
    const todayDate = new Date();
    const daysDiff = Math.floor((todayDate - lastActivity) / (1000 * 60 * 60 * 24));

    if (completed) {
      if (daysDiff === 0) {
        // Already completed today, update value
        const todayEntry = streak.history.find(h => h.date === today);
        if (todayEntry) {
          todayEntry.value += value;
        }
      } else if (daysDiff === 1) {
        // Continuing streak
        streak.currentStreak += 1;
        streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
        streak.lastActivityDate = Date.now();
        streak.history.push({
          date: today,
          completed: true,
          value,
          notes: `Day ${streak.currentStreak} of streak!`
        });
      } else {
        // Streak broken, restart
        streak.currentStreak = 1;
        streak.startDate = Date.now();
        streak.lastActivityDate = Date.now();
        streak.history.push({
          date: today,
          completed: true,
          value,
          notes: 'Streak restarted!'
        });
      }
    } else if (daysDiff > 1) {
      // Streak broken
      streak.currentStreak = 0;
      streak.isActive = false;
    }

    // Update habit progress
    this.updateHabitProgress(habitId, completed, value);
  }

  updateHabitProgress(habitId, completed, value) {
    const habit = this.habits.get(habitId);
    if (!habit) return;

    const today = new Date().toISOString().split('T')[0];
    
    if (completed) {
      habit.currentProgress.todayCompleted = true;
      habit.statistics.totalCompletions += 1;
      
      // Update weekly and monthly progress
      // This is simplified - in a real app you'd calculate based on actual dates
      habit.currentProgress.weekProgress = Math.min(7, habit.currentProgress.weekProgress + 1);
      habit.currentProgress.monthProgress = Math.min(30, habit.currentProgress.monthProgress + 1);
    }
  }

  // Get streak data
  getStreak(habitId) {
    return this.streaks.get(habitId);
  }

  getAllStreaks(userId = 'current-user') {
    return Array.from(this.streaks.values()).filter(streak => streak.userId === userId);
  }

  getActiveStreaks(userId = 'current-user') {
    return this.getAllStreaks(userId).filter(streak => streak.isActive && streak.currentStreak > 0);
  }

  // Habit management
  createHabit(templateId, userId = 'current-user') {
    const template = this.habitTemplates.get(templateId);
    if (!template) return null;

    const habit = {
      id: `${templateId}-${userId}`,
      userId,
      templateId,
      isActive: true,
      startDate: Date.now(),
      currentProgress: {
        todayCompleted: false,
        weekProgress: 0,
        monthProgress: 0
      },
      statistics: {
        totalCompletions: 0,
        completionRate: 0,
        bestStreak: 0,
        currentStreak: 0
      }
    };

    this.habits.set(habit.id, habit);
    return habit;
  }

  getHabit(habitId) {
    return this.habits.get(habitId);
  }

  getUserHabits(userId = 'current-user') {
    return Array.from(this.habits.values()).filter(habit => habit.userId === userId);
  }

  getActiveHabits(userId = 'current-user') {
    return this.getUserHabits(userId).filter(habit => habit.isActive);
  }

  // Habit templates
  getHabitTemplate(templateId) {
    return this.habitTemplates.get(templateId);
  }

  getAllHabitTemplates() {
    return Array.from(this.habitTemplates.values());
  }

  getHabitTemplatesByCategory(category) {
    return this.getAllHabitTemplates().filter(template => template.category === category);
  }

  // Motivation and support
  getMotivationMessage(habitId) {
    const streak = this.getStreak(habitId);
    const template = this.getHabitTemplate(habitId);
    
    if (!streak || !template) return null;

    const messages = {
      encouragement: [
        "You're doing great! Keep up the momentum! 🌟",
        "Every day counts - you're building something amazing! 💪",
        "Consistency is key, and you're nailing it! 🔑",
        "Small steps lead to big achievements! 🚀",
        "You're creating a powerful habit! 🏆"
      ],
      milestone: [
        `Amazing! You've reached ${streak.currentStreak} days! 🎉`,
        `Incredible streak of ${streak.currentStreak} days! 🔥`,
        `You're on fire with ${streak.currentStreak} consecutive days! ⚡`,
        `${streak.currentStreak} days strong! You're unstoppable! 💫`
      ],
      motivation: template.motivationTips || [
        "Remember why you started this journey! 💭",
        "Focus on progress, not perfection! 📈",
        "You're investing in your future self! 🌱"
      ],
      comeback: [
        "Every expert was once a beginner - start again! 🌱",
        "Setbacks are setups for comebacks! 💪",
        "Today is a new opportunity to restart! ☀️",
        "One day at a time - you've got this! 🎯"
      ]
    };

    if (streak.currentStreak === 0) {
      return {
        type: 'comeback',
        message: messages.comeback[Math.floor(Math.random() * messages.comeback.length)],
        tips: messages.motivation
      };
    } else if (streak.currentStreak % 7 === 0) {
      return {
        type: 'milestone',
        message: messages.milestone[Math.floor(Math.random() * messages.milestone.length)],
        tips: messages.motivation
      };
    } else {
      return {
        type: 'encouragement',
        message: messages.encouragement[Math.floor(Math.random() * messages.encouragement.length)],
        tips: messages.motivation
      };
    }
  }

  // Analytics and insights
  getStreakAnalytics(userId = 'current-user') {
    const userStreaks = this.getAllStreaks(userId);
    const userHabits = this.getUserHabits(userId);
    
    return {
      totalActiveStreaks: userStreaks.filter(s => s.isActive && s.currentStreak > 0).length,
      longestCurrentStreak: Math.max(...userStreaks.map(s => s.currentStreak), 0),
      totalStreakDays: userStreaks.reduce((sum, s) => sum + s.currentStreak, 0),
      averageStreakLength: userStreaks.length > 0 ? 
        userStreaks.reduce((sum, s) => sum + s.longestStreak, 0) / userStreaks.length : 0,
      habitCompletionRate: userHabits.length > 0 ?
        userHabits.reduce((sum, h) => sum + h.statistics.completionRate, 0) / userHabits.length : 0,
      categoriesActive: [...new Set(userHabits.map(h => this.getHabitTemplate(h.templateId)?.category))],
      weeklyConsistency: this.calculateWeeklyConsistency(userHabits),
      monthlyProgress: this.calculateMonthlyProgress(userHabits)
    };
  }

  calculateWeeklyConsistency(habits) {
    if (habits.length === 0) return 0;
    return habits.reduce((sum, habit) => sum + (habit.currentProgress.weekProgress / 7 * 100), 0) / habits.length;
  }

  calculateMonthlyProgress(habits) {
    if (habits.length === 0) return 0;
    return habits.reduce((sum, habit) => sum + (habit.currentProgress.monthProgress / 30 * 100), 0) / habits.length;
  }

  // Recommendations
  getHabitRecommendations(userId = 'current-user') {
    const userHabits = this.getUserHabits(userId);
    const activeTemplateIds = userHabits.map(h => h.templateId);
    const availableTemplates = this.getAllHabitTemplates().filter(t => !activeTemplateIds.includes(t.id));
    
    return availableTemplates.map(template => ({
      ...template,
      recommendationReason: this.getRecommendationReason(template, userHabits),
      difficultyMatch: this.calculateDifficultyMatch(template, userHabits)
    })).sort((a, b) => b.difficultyMatch - a.difficultyMatch);
  }

  getRecommendationReason(template, userHabits) {
    if (userHabits.length === 0) {
      return "Perfect for getting started with habit building!";
    }
    
    const categories = userHabits.map(h => this.getHabitTemplate(h.templateId)?.category);
    
    if (!categories.includes(template.category)) {
      return `Add variety with a ${template.category} habit!`;
    }
    
    return "Complement your existing habits with this one!";
  }

  calculateDifficultyMatch(template, userHabits) {
    if (userHabits.length === 0) {
      return template.difficulty === 'easy' ? 100 : 50;
    }
    
    const avgCompletionRate = userHabits.reduce((sum, h) => sum + h.statistics.completionRate, 0) / userHabits.length;
    
    if (avgCompletionRate > 80) {
      return template.difficulty === 'hard' ? 100 : template.difficulty === 'medium' ? 80 : 60;
    } else if (avgCompletionRate > 60) {
      return template.difficulty === 'medium' ? 100 : 80;
    } else {
      return template.difficulty === 'easy' ? 100 : 50;
    }
  }
}

// Initialize and export singleton instance
export const streakSystem = new StreakSystem();
