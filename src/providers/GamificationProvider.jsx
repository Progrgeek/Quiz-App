/**
 * Gamification Provider
 * Context provider for sharing gamification engines across components
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { AchievementEngine } from '../gamification/achievements/AchievementEngine';

const GamificationContext = createContext(null);

export const useGamificationContext = () => {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
};

export const GamificationProvider = ({ 
  children, 
  config = {},
  onGamificationReady,
  onGamificationError 
}) => {
  const [achievementEngine, setAchievementEngine] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    achievements: [],
    badges: []
  });
  
  useEffect(() => {
    const initializeEngine = async () => {
      try {
        setError(null);
        
        // Create achievement engine instance
        const newAchievementEngine = new AchievementEngine({
          userId: config.userId || 'anonymous',
          ...config
        });
        
        setAchievementEngine(newAchievementEngine);
        setIsReady(true);
        
        if (onGamificationReady) {
          onGamificationReady(newAchievementEngine);
        }
      } catch (err) {
        console.error('Failed to initialize GamificationEngine:', err);
        setError(err);
        setIsReady(false);
        
        if (onGamificationError) {
          onGamificationError(err);
        }
      }
    };
    
    initializeEngine();
  }, []);
  
  const value = {
    achievementEngine,
    isReady,
    error,
    userStats,
    
    // Convenience methods
    checkAchievements: async (data) => {
      if (!achievementEngine || !isReady) {
        console.warn('Gamification engine not ready');
        return [];
      }
      
      try {
        const achievements = await achievementEngine.checkAchievements(data);
        if (achievements.length > 0) {
          setUserStats(prev => ({
            ...prev,
            achievements: [...prev.achievements, ...achievements]
          }));
        }
        return achievements;
      } catch (error) {
        console.error('Error checking achievements:', error);
        return [];
      }
    },
    
    awardXP: async (xpData) => {
      if (!achievementEngine || !isReady) return;
      
      try {
        const result = await achievementEngine.awardXP(xpData);
        setUserStats(prev => ({
          ...prev,
          xp: prev.xp + (xpData.amount || 0),
          level: result.newLevel || prev.level
        }));
        return result;
      } catch (error) {
        console.error('Error awarding XP:', error);
        return null;
      }
    },
    
    updateStreak: (streakData) => {
      setUserStats(prev => ({
        ...prev,
        streak: streakData.currentStreak || 0
      }));
    },
    
    getLeaderboard: () => {
      if (!achievementEngine || !isReady) return [];
      return achievementEngine.getLeaderboard?.() || [];
    },
    
    getUserProgress: () => {
      if (!achievementEngine || !isReady) return null;
      return achievementEngine.getUserProgress?.() || userStats;
    },
    
    resetProgress: () => {
      setUserStats({
        xp: 0,
        level: 1,
        streak: 0,
        achievements: [],
        badges: []
      });
    }
  };
  
  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};

export default GamificationProvider;
