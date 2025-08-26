/**
 * useGamification Hook
 * 
 * React hook for integrating gamification features into exercises
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { AchievementEngine } from '../gamification/achievements/AchievementEngine';

export const useGamification = (config = {}) => {
  const achievementEngineRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [userStats, setUserStats] = useState({
    xp: 0,
    level: 1,
    streak: 0,
    achievements: []
  });

  // Initialize gamification engines
  useEffect(() => {
    if (config.enabled === false) return;

    try {
      achievementEngineRef.current = new AchievementEngine({
        exerciseType: config.exerciseType || 'general'
      });
      
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize Gamification:', error);
      setIsReady(false);
    }
  }, [config.enabled, config.exerciseType]);

  const checkAchievements = useCallback(async (data) => {
    if (!isReady || !achievementEngineRef.current) return [];
    
    try {
      return await achievementEngineRef.current.checkAchievements(data);
    } catch (error) {
      console.error('Error checking achievements:', error);
      return [];
    }
  }, [isReady]);

  const awardXP = useCallback(async (xpData) => {
    if (!isReady || !achievementEngineRef.current) return;
    
    try {
      const result = await achievementEngineRef.current.awardXP(xpData);
      setUserStats(prev => ({
        ...prev,
        xp: result.totalXP || prev.xp,
        level: result.level || prev.level
      }));
      return result;
    } catch (error) {
      console.error('Error awarding XP:', error);
    }
  }, [isReady]);

  const getCurrentStreak = useCallback(() => {
    if (!isReady) return 0;
    return userStats.streak;
  }, [isReady, userStats.streak]);

  const getUserStats = useCallback(() => {
    if (!isReady) return userStats;
    return userStats;
  }, [isReady, userStats]);

  const showCelebration = useCallback((celebrationData) => {
    if (!isReady) return;
    
    // Trigger celebration UI
    console.log('🎉 Celebration:', celebrationData);
  }, [isReady]);

  return {
    isReady,
    checkAchievements,
    awardXP,
    getCurrentStreak,
    getUserStats,
    showCelebration,
    engine: achievementEngineRef.current
  };
};

export default useGamification;
