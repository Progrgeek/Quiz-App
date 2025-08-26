import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { achievementEngine, ACHIEVEMENT_CATEGORIES, ACHIEVEMENT_RARITY } from '../../gamification/achievements/AchievementEngine.js';
import { levelingSystem } from '../../gamification/leveling/LevelingSystem.js';
import { gamificationPsychology } from '../../gamification/psychology/MotivationEngine.js';

const GamificationDashboard = ({ userId = 'demo-user' }) => {
  const [userStats, setUserStats] = useState(null);
  const [levelInfo, setLevelInfo] = useState(null);
  const [achievementStats, setAchievementStats] = useState(null);
  const [motivationProfile, setMotivationProfile] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [recentUnlocks, setRecentUnlocks] = useState([]);

  useEffect(() => {
    generateGamificationData();
  }, [userId]);

  const generateGamificationData = () => {
    // Generate comprehensive mock user data
    const mockStats = generateMockUserStats();
    const mockBehavior = generateMockUserBehavior();
    
    // Calculate levels and achievements
    const userLevel = levelingSystem.calculateLevel(mockStats.totalXP);
    const achievementData = achievementEngine.getAchievementStats();
    const motivation = gamificationPsychology.analyzeMotivationProfile(mockBehavior, mockStats.preferences);
    
    // Check for new achievements
    const newAchievements = achievementEngine.checkAchievements(mockStats);
    
    setUserStats(mockStats);
    setLevelInfo(userLevel);
    setAchievementStats(achievementData);
    setMotivationProfile(motivation);
    setRecentUnlocks(newAchievements.slice(0, 3)); // Show last 3 unlocks
    setLoading(false);
  };

  const generateMockUserStats = () => ({
    totalXP: 8500,
    exercisesCompleted: 127,
    streakDays: 12,
    perfectStreakMax: 7,
    exerciseTypesCompleted: 8,
    skillLevels: {
      reading: 8,
      grammar: 6,
      vocabulary: 9,
      writing: 5,
      listening: 7
    },
    friendsCount: 5,
    friendsHelped: 3,
    groupChallengesCompleted: 2,
    studyGroupsLed: 0,
    fastCompletions: 15,
    earlyMorningExercises: 8,
    lateNightExercises: 3,
    weekendExercises: 25,
    difficultiesCompleted: 6,
    comebackAfterBreak: false,
    birthdayPractice: false,
    preferences: {
      difficulty: 'medium',
      exerciseTypes: ['reading', 'grammar'],
      studyTime: 'morning'
    }
  });

  const generateMockUserBehavior = () => ({
    customizationActions: 8,
    personalGoalsSet: 3,
    learningPathChanges: 2,
    difficultyChanges: 5,
    skillLevelGains: 15,
    achievementsUnlocked: 12,
    perfectScores: 7,
    difficultChallengesAttempted: 4,
    friendInteractions: 8,
    groupStudyTime: 120,
    peersHelped: 3,
    challengesJoined: 2
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your gamification profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          🎮 Gamification Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Your learning journey, achievements, and progress
        </p>
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-300 rounded-lg p-4 inline-block">
          <div className="text-purple-800 font-semibold">
            🚀 Phase 4: Gamification & Engagement Features
          </div>
          <div className="text-purple-600 text-sm">
            Achievement System • Leveling • Motivation Psychology • Social Features
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-600 text-sm font-medium">Current Level</p>
              <p className="text-3xl font-bold text-blue-800">{levelInfo.level}</p>
              <p className="text-blue-600 text-xs">{levelInfo.title}</p>
            </div>
            <div className="text-4xl">🏆</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${levelInfo.progress * 100}%` }}
              ></div>
            </div>
            <p className="text-blue-600 text-xs mt-1">
              {levelInfo.xpToNext} XP to level {levelInfo.level + 1}
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-600 text-sm font-medium">Total XP</p>
              <p className="text-3xl font-bold text-green-800">{userStats.totalXP.toLocaleString()}</p>
              <p className="text-green-600 text-xs">Experience Points</p>
            </div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-600 text-sm font-medium">Achievements</p>
              <p className="text-3xl font-bold text-orange-800">
                {achievementStats.overall.unlocked}/{achievementStats.overall.total}
              </p>
              <p className="text-orange-600 text-xs">{achievementStats.overall.percentage}% Complete</p>
            </div>
            <div className="text-4xl">🏅</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Streak</p>
              <p className="text-3xl font-bold text-purple-800">{userStats.streakDays}</p>
              <p className="text-purple-600 text-xs">Days in a row</p>
            </div>
            <div className="text-4xl">🔥</div>
          </div>
        </div>
      </div>

      {/* Recent Achievement Unlocks */}
      {recentUnlocks.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200 mb-8">
          <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
            <span className="mr-2">🎉</span>
            Recent Achievement Unlocks
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentUnlocks.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-lg p-4 border border-yellow-300 shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{achievement.icon}</div>
                  <div>
                    <p className="font-semibold text-gray-800">{achievement.name}</p>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        ACHIEVEMENT_RARITY[achievement.rarity]?.color === '#F59E0B' ? 'bg-yellow-100 text-yellow-800' :
                        ACHIEVEMENT_RARITY[achievement.rarity]?.color === '#8B5CF6' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {ACHIEVEMENT_RARITY[achievement.rarity]?.name}
                      </span>
                      <span className="ml-2 text-xs text-gray-500">+{achievement.points} XP</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Overview', icon: '📊' },
              { id: 'achievements', label: 'Achievements', icon: '🏆' },
              { id: 'levels', label: 'Levels & Skills', icon: '📈' },
              { id: 'motivation', label: 'Motivation Profile', icon: '🧠' },
              { id: 'progress', label: 'Progress Tracking', icon: '📋' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Learning Overview</h3>
              
              {/* Exercise Statistics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Exercise Progress</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Total Completed</span>
                      <span className="font-semibold">{userStats.exercisesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Exercise Types Tried</span>
                      <span className="font-semibold">{userStats.exerciseTypesCompleted}/10</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Perfect Streak Record</span>
                      <span className="font-semibold">{userStats.perfectStreakMax}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fast Completions</span>
                      <span className="font-semibold">{userStats.fastCompletions}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold mb-4">Social Engagement</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Friends</span>
                      <span className="font-semibold">{userStats.friendsCount}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Friends Helped</span>
                      <span className="font-semibold">{userStats.friendsHelped}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Group Challenges</span>
                      <span className="font-semibold">{userStats.groupChallengesCompleted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Study Groups Led</span>
                      <span className="font-semibold">{userStats.studyGroupsLed}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Level Progress */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold mb-4">Level Progress</h4>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold text-purple-800">Level {levelInfo.level}</p>
                    <p className="text-purple-600">{levelInfo.title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-purple-600">XP Progress</p>
                    <p className="text-lg font-semibold text-purple-800">
                      {levelInfo.currentXP} / {levelInfo.xpRequired}
                    </p>
                  </div>
                </div>
                <div className="w-full bg-purple-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${levelInfo.progress * 100}%` }}
                  ></div>
                </div>
                <p className="text-purple-600 text-sm">
                  {levelInfo.xpToNext} XP needed for level {levelInfo.level + 1}
                </p>
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Achievement Collection</h3>
              
              {/* Achievement Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(ACHIEVEMENT_CATEGORIES).map(([categoryKey, category]) => (
                  <div key={categoryKey} className="bg-gray-50 rounded-lg p-6 border">
                    <div className="flex items-center mb-4">
                      <span className="text-2xl mr-3">{category.icon}</span>
                      <div>
                        <h4 className="font-semibold text-gray-800">{category.name}</h4>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {category.achievements.slice(0, 3).map(achievement => (
                        <div key={achievement.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-lg">{achievement.icon}</span>
                            <div>
                              <p className="text-sm font-medium">{achievement.name}</p>
                              <p className="text-xs text-gray-500">{achievement.points} XP</p>
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full ${
                            achievementEngine.unlockedAchievements.has(achievement.id)
                              ? 'bg-green-500' 
                              : 'bg-gray-300'
                          }`}></div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{achievementStats.byCategory[categoryKey]?.percentage || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${achievementStats.byCategory[categoryKey]?.percentage || 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Achievement Statistics */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="text-lg font-semibold mb-4">Achievement Statistics</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(achievementStats.byRarity).map(([rarity, stats]) => (
                    <div key={rarity} className="text-center">
                      <p className="text-2xl font-bold" style={{ color: ACHIEVEMENT_RARITY[rarity]?.color }}>
                        {stats.unlocked}
                      </p>
                      <p className="text-sm text-gray-600 capitalize">{rarity}</p>
                      <p className="text-xs text-gray-500">of {stats.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Levels & Skills Tab */}
          {activeTab === 'levels' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Levels & Skills</h3>
              
              {/* Global Level */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 border">
                <h4 className="text-lg font-semibold mb-4">Global Level</h4>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-3xl font-bold text-blue-800">Level {levelInfo.level}</p>
                    <p className="text-blue-600">{levelInfo.title}</p>
                    {levelInfo.prestigeLevel > 0 && (
                      <p className="text-purple-600 text-sm">⭐ Prestige {levelInfo.prestigeLevel}</p>
                    )}
                  </div>
                  <div className="text-6xl">👑</div>
                </div>
                
                <div className="w-full bg-blue-200 rounded-full h-4 mb-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full"
                    style={{ width: `${levelInfo.progress * 100}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-sm text-blue-600">
                  <span>{levelInfo.currentXP} XP</span>
                  <span>{levelInfo.xpRequired} XP</span>
                </div>
              </div>

              {/* Skill Levels */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(userStats.skillLevels).map(([skill, level]) => {
                  const skillInfo = levelingSystem.calculateSkillLevel(level * 100, skill);
                  return (
                    <div key={skill} className="bg-white rounded-lg border p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-800 capitalize">{skill}</h4>
                          <p className="text-sm text-gray-600">{skillInfo.mastery}</p>
                        </div>
                        <div className="text-2xl font-bold text-blue-600">
                          Level {level}
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                        <div 
                          className="bg-blue-500 h-3 rounded-full"
                          style={{ width: `${(level / 20) * 100}%` }}
                        ></div>
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        Benefits: {skillInfo.benefits.slice(0, 2).join(', ') || 'Keep practicing!'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Motivation Profile Tab */}
          {activeTab === 'motivation' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Motivation Profile</h3>
              
              {/* Motivation Scores */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Autonomy</h4>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {motivationProfile.autonomyScore}/100
                  </div>
                  <p className="text-sm text-blue-600">Control & Choice</p>
                  <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${motivationProfile.autonomyScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">Competence</h4>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {motivationProfile.competenceScore}/100
                  </div>
                  <p className="text-sm text-green-600">Skill & Mastery</p>
                  <div className="w-full bg-green-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${motivationProfile.competenceScore}%` }}
                    ></div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">Relatedness</h4>
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    {motivationProfile.relatednessScore}/100
                  </div>
                  <p className="text-sm text-purple-600">Social Connection</p>
                  <div className="w-full bg-purple-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-purple-500 h-2 rounded-full"
                      style={{ width: `${motivationProfile.relatednessScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Dominant Motivation */}
              <div className="bg-gray-50 rounded-lg p-6 border">
                <h4 className="text-lg font-semibold mb-4">Your Learning Style</h4>
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">
                    {motivationProfile.dominantMotivation === 'autonomy' ? '🎯' :
                     motivationProfile.dominantMotivation === 'competence' ? '🏆' : '🤝'}
                  </div>
                  <div>
                    <p className="text-xl font-semibold text-gray-800 capitalize">
                      {motivationProfile.dominantMotivation}-Driven Learner
                    </p>
                    <p className="text-gray-600">
                      {motivationProfile.dominantMotivation === 'autonomy' && 
                        "You thrive when you have control over your learning path and can make choices."}
                      {motivationProfile.dominantMotivation === 'competence' && 
                        "You're motivated by skill development, achievements, and mastering new challenges."}
                      {motivationProfile.dominantMotivation === 'relatedness' && 
                        "You learn best through social interaction, collaboration, and community engagement."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                <h4 className="text-lg font-semibold">Personalized Recommendations</h4>
                {motivationProfile.recommendations.map((rec, index) => (
                  <div key={index} className="bg-white rounded-lg border p-4">
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${
                        rec.priority === 'high' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}></div>
                      <div>
                        <p className="font-medium text-gray-800 capitalize">{rec.type} Focus</p>
                        <ul className="mt-2 space-y-1">
                          {rec.suggestions.map((suggestion, i) => (
                            <li key={i} className="text-sm text-gray-600">• {suggestion}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress Tracking Tab */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Progress Tracking</h3>
              
              {/* Recent Progress */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-6 border">
                <h4 className="text-lg font-semibold mb-4">Recent Progress</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">This Week</p>
                    <p className="text-2xl font-bold text-green-600">+{Math.floor(userStats.totalXP * 0.1)} XP</p>
                    <p className="text-sm text-green-600">12 exercises completed</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Average Session</p>
                    <p className="text-2xl font-bold text-blue-600">+{Math.floor(userStats.totalXP / userStats.exercisesCompleted)} XP</p>
                    <p className="text-sm text-blue-600">per exercise</p>
                  </div>
                </div>
              </div>

              {/* Next Goals */}
              <div className="bg-white rounded-lg border p-6">
                <h4 className="text-lg font-semibold mb-4">Next Goals</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Reach Level {levelInfo.level + 1}</p>
                      <p className="text-sm text-gray-600">{levelInfo.xpToNext} XP remaining</p>
                    </div>
                    <div className="text-2xl">🎯</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Complete 150 Exercises</p>
                      <p className="text-sm text-gray-600">{150 - userStats.exercisesCompleted} exercises to go</p>
                    </div>
                    <div className="text-2xl">📚</div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Maintain 15-Day Streak</p>
                      <p className="text-sm text-gray-600">{15 - userStats.streakDays} days to go</p>
                    </div>
                    <div className="text-2xl">🔥</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Implementation Summary */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
        <h4 className="font-semibold text-purple-800 mb-3">🎮 Gamification Features Implemented</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
          <div className="space-y-1">
            <div>✅ Achievement System with 25+ achievements</div>
            <div>✅ Leveling system with XP calculation</div>
            <div>✅ Skill-specific progression tracking</div>
            <div>✅ Motivation psychology analysis (SDT)</div>
            <div>✅ Multiple achievement categories & rarities</div>
          </div>
          <div className="space-y-1">
            <div>✅ Dynamic XP calculation with bonuses</div>
            <div>✅ Progress tracking and visualization</div>
            <div>✅ Personalized motivation profiling</div>
            <div>✅ Achievement unlock celebrations</div>
            <div>✅ Comprehensive gamification dashboard</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamificationDashboard;
