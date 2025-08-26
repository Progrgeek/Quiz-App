import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ACHIEVEMENT_RARITY } from '../../../gamification/achievements/AchievementEngine.js';

// Achievement Toast Notification Component
export const AchievementToast = ({ achievement, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);
  const rarity = ACHIEVEMENT_RARITY[achievement.rarity] || ACHIEVEMENT_RARITY.common;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8, rotate: -10 }}
          animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, y: -50, scale: 0.8, rotate: 10 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 25,
            duration: 0.5 
          }}
          className="fixed bottom-4 right-4 z-50 max-w-sm"
        >
          <div 
            className="relative p-6 rounded-xl shadow-2xl border-2"
            style={{ 
              backgroundColor: rarity.color + '20',
              borderColor: rarity.borderColor,
              background: `linear-gradient(135deg, ${rarity.color}20, ${rarity.color}10)`
            }}
          >
            {/* Celebration particles */}
            <div className="absolute inset-0 overflow-hidden rounded-xl">
              {[...Array(12)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 rounded-full"
                  style={{ backgroundColor: rarity.color }}
                  initial={{ 
                    x: '50%', 
                    y: '50%', 
                    scale: 0,
                    rotate: Math.random() * 360
                  }}
                  animate={{ 
                    x: Math.random() * 200 - 100 + '%',
                    y: Math.random() * 200 - 100 + '%',
                    scale: [0, 1, 0],
                    rotate: Math.random() * 720
                  }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.1,
                    ease: "easeOut"
                  }}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-3">
                <motion.div 
                  className="text-5xl"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 0.6,
                    times: [0, 0.5, 0.8, 1],
                    repeat: 2
                  }}
                >
                  {achievement.icon}
                </motion.div>
                <div className="flex-1">
                  <motion.h3 
                    className="font-bold text-lg text-gray-800"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    🎉 Achievement Unlocked!
                  </motion.h3>
                  <motion.p 
                    className="text-gray-700 font-semibold"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {achievement.name}
                  </motion.p>
                </div>
                <button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <motion.p 
                className="text-gray-600 text-sm mb-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {achievement.description}
              </motion.p>

              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: "spring" }}
                  className="flex items-center gap-2"
                >
                  <span 
                    className="px-3 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: rarity.color }}
                  >
                    {rarity.name}
                  </span>
                  <span className="text-sm font-bold text-gray-700">
                    +{Math.round(achievement.points * rarity.pointsMultiplier)} XP
                  </span>
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleClose}
                  className="px-3 py-1 bg-gray-800 text-white rounded-lg text-xs font-medium hover:bg-gray-700 transition-colors"
                >
                  Awesome!
                </motion.button>
              </div>
            </div>

            {/* Glow effect */}
            <div 
              className="absolute inset-0 rounded-xl opacity-50"
              style={{
                background: `radial-gradient(circle at center, ${rarity.color}30, transparent 70%)`
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Achievement Gallery Component
export const AchievementGallery = ({ achievements, unlockedAchievements, onAchievementClick }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const categories = ['all', ...new Set(achievements.map(a => a.category))];
  const rarities = ['all', ...Object.keys(ACHIEVEMENT_RARITY)];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rarity</label>
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
          >
            {rarities.map(rarity => (
              <option key={rarity} value={rarity}>
                {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredAchievements.map(achievement => {
          const isUnlocked = unlockedAchievements.has(achievement.id);
          const rarity = ACHIEVEMENT_RARITY[achievement.rarity];

          return (
            <motion.div
              key={achievement.id}
              whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onAchievementClick && onAchievementClick(achievement)}
              className={`
                p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                ${isUnlocked 
                  ? 'bg-white shadow-lg hover:shadow-xl' 
                  : 'bg-gray-100 opacity-60 hover:opacity-80'
                }
              `}
              style={{
                borderColor: isUnlocked ? rarity.borderColor : '#E5E7EB'
              }}
            >
              {/* Achievement Icon */}
              <div className="text-center mb-3">
                <div className={`text-4xl mb-2 ${isUnlocked ? '' : 'grayscale'}`}>
                  {achievement.icon}
                </div>
                <div 
                  className="w-3 h-3 rounded-full mx-auto"
                  style={{ 
                    backgroundColor: isUnlocked ? rarity.color : '#9CA3AF'
                  }}
                />
              </div>

              {/* Achievement Info */}
              <div className="text-center">
                <h4 className={`font-semibold text-sm mb-1 ${
                  isUnlocked ? 'text-gray-800' : 'text-gray-500'
                }`}>
                  {achievement.name}
                </h4>
                <p className={`text-xs mb-2 ${
                  isUnlocked ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>

                <div className="flex items-center justify-between text-xs">
                  <span 
                    className="px-2 py-1 rounded-full text-white font-medium"
                    style={{ 
                      backgroundColor: isUnlocked ? rarity.color : '#9CA3AF'
                    }}
                  >
                    {rarity.name}
                  </span>
                  <span className={`font-bold ${
                    isUnlocked ? 'text-gray-700' : 'text-gray-400'
                  }`}>
                    {achievement.points} XP
                  </span>
                </div>
              </div>

              {/* Unlock Status */}
              {isUnlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Achievement Progress Tracker
export const AchievementProgress = ({ achievements, userStats, onAchievementClick }) => {
  const nearCompletion = achievements
    .filter(achievement => !achievement.isUnlocked && achievement.progress > 50)
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5);

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Close to Unlocking</h3>
      
      {nearCompletion.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🎯</div>
          <p>Keep learning to unlock new achievements!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {nearCompletion.map(achievement => {
            const rarity = ACHIEVEMENT_RARITY[achievement.rarity];
            
            return (
              <motion.div
                key={achievement.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => onAchievementClick && onAchievementClick(achievement)}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{achievement.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-gray-800">{achievement.name}</h4>
                      <span className="text-sm text-gray-600">{Math.round(achievement.progress)}%</span>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                    
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <motion.div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${achievement.progress}%`,
                          backgroundColor: rarity.color 
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${achievement.progress}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div 
                      className="px-3 py-1 rounded-full text-xs font-medium text-white mb-1"
                      style={{ backgroundColor: rarity.color }}
                    >
                      {rarity.name}
                    </div>
                    <div className="text-sm font-bold text-gray-700">
                      {achievement.points} XP
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Achievement Statistics Component
export const AchievementStats = ({ achievementStats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Overall Progress */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
        <div className="text-center">
          <div className="text-3xl mb-2">🏆</div>
          <div className="text-2xl font-bold text-blue-800">
            {achievementStats.overall.unlocked}/{achievementStats.overall.total}
          </div>
          <div className="text-blue-600 text-sm">Achievements</div>
          <div className="w-full bg-blue-200 rounded-full h-2 mt-3">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${achievementStats.overall.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Total Points */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
        <div className="text-center">
          <div className="text-3xl mb-2">⭐</div>
          <div className="text-2xl font-bold text-green-800">
            {achievementStats.totalPoints.toLocaleString()}
          </div>
          <div className="text-green-600 text-sm">Achievement Points</div>
        </div>
      </div>

      {/* Rarity Breakdown */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
        <div className="text-center">
          <div className="text-3xl mb-2">💎</div>
          <div className="text-2xl font-bold text-purple-800">
            {achievementStats.byRarity.rare?.unlocked || 0}
          </div>
          <div className="text-purple-600 text-sm">Rare+ Unlocked</div>
        </div>
      </div>

      {/* Completion Rate */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
        <div className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-orange-800">
            {achievementStats.overall.percentage}%
          </div>
          <div className="text-orange-600 text-sm">Completion Rate</div>
        </div>
      </div>
    </div>
  );
};
