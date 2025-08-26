import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { streakSystem } from '../../../gamification/streaks/StreakSystem.js';

// Streak Card Component
export const StreakCard = ({ streak, template, onViewDetails, size = 'medium' }) => {
  const getStreakStatus = () => {
    if (streak.currentStreak === 0) return 'broken';
    if (streak.currentStreak >= 30) return 'legendary';
    if (streak.currentStreak >= 14) return 'excellent';
    if (streak.currentStreak >= 7) return 'good';
    return 'building';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'legendary': return 'from-purple-500 to-pink-500';
      case 'excellent': return 'from-green-500 to-blue-500';
      case 'good': return 'from-blue-500 to-cyan-500';
      case 'building': return 'from-yellow-500 to-orange-500';
      case 'broken': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'legendary': return 'Legendary';
      case 'excellent': return 'Excellent';
      case 'good': return 'Great';
      case 'building': return 'Building';
      case 'broken': return 'Restart';
      default: return 'Unknown';
    }
  };

  const status = getStreakStatus();
  const cardSize = size === 'small' ? 'p-4' : size === 'large' ? 'p-8' : 'p-6';
  const iconSize = size === 'small' ? 'text-3xl' : size === 'large' ? 'text-6xl' : 'text-4xl';
  const titleSize = size === 'small' ? 'text-sm' : size === 'large' ? 'text-xl' : 'text-lg';

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onViewDetails && onViewDetails(streak)}
      className={`
        bg-white rounded-xl border border-gray-200 shadow-lg cursor-pointer transition-all duration-300
        ${cardSize}
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={iconSize}>{template?.icon || '📅'}</div>
        <div 
          className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getStatusColor(status)}`}
        >
          {getStatusText(status)}
        </div>
      </div>

      {/* Content */}
      <div className="mb-4">
        <h3 className={`font-bold text-gray-800 mb-1 ${titleSize}`}>
          {template?.name || 'Unknown Habit'}
        </h3>
        <p className="text-gray-600 text-sm">{template?.description}</p>
      </div>

      {/* Streak Info */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Current Streak</span>
          <span className="font-bold text-2xl text-gray-800">
            {streak.currentStreak} 
            <span className="text-sm ml-1">days</span>
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 text-sm">Best Streak</span>
          <span className="font-semibold text-gray-700">
            {streak.longestStreak} days
          </span>
        </div>

        {/* Progress visualization */}
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress to next milestone</span>
            <span>{Math.min(streak.currentStreak % 7 || 7, 7)}/7</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div 
              className={`h-2 rounded-full bg-gradient-to-r ${getStatusColor(status)}`}
              initial={{ width: 0 }}
              animate={{ width: `${(streak.currentStreak % 7 || 7) / 7 * 100}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>
      </div>

      {/* Recent activity indicator */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1">
          {[...Array(Math.min(7, streak.currentStreak))].map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full bg-gradient-to-r ${getStatusColor(status)}`}
            />
          ))}
          {[...Array(Math.max(0, 7 - streak.currentStreak))].map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-2 h-2 rounded-full bg-gray-200"
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// Habit Tracker Component
export const HabitTracker = ({ habit, template, onComplete, onViewDetails }) => {
  const [todayCompleted, setTodayCompleted] = useState(habit.currentProgress.todayCompleted);

  const handleComplete = () => {
    if (!todayCompleted) {
      setTodayCompleted(true);
      streakSystem.updateStreak(habit.templateId, true, 1);
      onComplete && onComplete(habit.id);
    }
  };

  const getCompletionColor = () => {
    if (todayCompleted) return 'from-green-500 to-green-600';
    return 'from-gray-300 to-gray-400';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm"
    >
      <div className="flex items-center gap-4">
        {/* Icon and info */}
        <div className="flex items-center gap-3 flex-1">
          <div className="text-3xl">{template?.icon || '📅'}</div>
          <div>
            <h4 className="font-semibold text-gray-800">{template?.name}</h4>
            <p className="text-sm text-gray-600">{template?.description}</p>
          </div>
        </div>

        {/* Progress info */}
        <div className="text-center">
          <div className="text-lg font-bold text-gray-800">
            {habit.statistics.currentStreak}
          </div>
          <div className="text-xs text-gray-500">day streak</div>
        </div>

        {/* Complete button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleComplete}
          disabled={todayCompleted}
          className={`
            px-6 py-3 rounded-lg font-medium transition-all duration-300
            ${todayCompleted 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white cursor-default' 
              : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700'
            }
          `}
        >
          {todayCompleted ? '✓ Done Today' : 'Mark Complete'}
        </motion.button>
      </div>

      {/* Weekly progress */}
      <div className="mt-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>This Week</span>
          <span>{habit.currentProgress.weekProgress}/7 days</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full bg-gradient-to-r ${getCompletionColor()}`}
            initial={{ width: 0 }}
            animate={{ width: `${(habit.currentProgress.weekProgress / 7) * 100}%` }}
            transition={{ duration: 0.8 }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Streak Calendar Component
export const StreakCalendar = ({ streak, template }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInStreak = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return streak.history.some(entry => entry.date === dateStr && entry.completed);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const firstDay = getFirstDayOfMonth(selectedMonth, selectedYear);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(selectedYear, selectedMonth, day);
      const isInStreak = isDateInStreak(date);
      const isToday = date.toDateString() === new Date().toDateString();
      const isFuture = date > new Date();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: isInStreak ? 1.1 : 1 }}
          className={`
            h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer
            ${isInStreak 
              ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md' 
              : isFuture
                ? 'bg-gray-100 text-gray-400'
                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
            }
            ${isToday ? 'ring-2 ring-blue-500' : ''}
          `}
        >
          {day}
        </motion.div>
      );
    }

    return days;
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">
          {template?.name} Calendar
        </h3>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedMonth(prev => prev === 0 ? 11 : prev - 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <span className="font-medium text-gray-700 min-w-[120px] text-center">
            {monthNames[selectedMonth]} {selectedYear}
          </span>
          <button
            onClick={() => setSelectedMonth(prev => prev === 11 ? 0 : prev + 1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
        </div>
      </div>

      {/* Calendar grid */}
      <div className="mb-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-200" />
          <span>Incomplete</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-gray-100 border-2 border-blue-500" />
          <span>Today</span>
        </div>
      </div>
    </div>
  );
};

// Motivation Widget Component
export const MotivationWidget = ({ habitId }) => {
  const [motivation, setMotivation] = useState(null);

  useEffect(() => {
    const motivationData = streakSystem.getMotivationMessage(habitId);
    setMotivation(motivationData);
  }, [habitId]);

  if (!motivation) return null;

  const getMotivationIcon = (type) => {
    switch (type) {
      case 'milestone': return '🎉';
      case 'encouragement': return '💪';
      case 'comeback': return '🌱';
      default: return '⭐';
    }
  };

  const getMotivationColor = (type) => {
    switch (type) {
      case 'milestone': return 'from-purple-500 to-pink-500';
      case 'encouragement': return 'from-blue-500 to-green-500';
      case 'comeback': return 'from-orange-500 to-red-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-r ${getMotivationColor(motivation.type)} rounded-xl p-6 text-white`}
    >
      <div className="flex items-start gap-4">
        <div className="text-4xl">{getMotivationIcon(motivation.type)}</div>
        <div className="flex-1">
          <h3 className="font-bold text-lg mb-2">{motivation.message}</h3>
          {motivation.tips && motivation.tips.length > 0 && (
            <div className="space-y-1">
              <p className="text-sm opacity-90 font-medium">Tips for success:</p>
              <ul className="text-sm opacity-80 space-y-1">
                {motivation.tips.slice(0, 2).map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span>•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Habit Recommendation Card
export const HabitRecommendationCard = ({ recommendation, onAddHabit }) => {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="text-4xl">{recommendation.icon}</div>
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 mb-1">{recommendation.name}</h4>
          <p className="text-gray-600 text-sm mb-2">{recommendation.description}</p>
          <p className="text-blue-600 text-sm">{recommendation.recommendationReason}</p>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(recommendation.difficulty)}`}>
          {recommendation.difficulty}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Match: <span className="font-medium">{recommendation.difficultyMatch}%</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onAddHabit && onAddHabit(recommendation.id)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Habit
        </motion.button>
      </div>
    </motion.div>
  );
};

// Streak Analytics Widget
export const StreakAnalyticsWidget = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const analyticsData = streakSystem.getStreakAnalytics();
    setAnalytics(analyticsData);
  }, []);

  if (!analytics) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
        <div className="text-center">
          <div className="text-3xl mb-2">🔥</div>
          <div className="text-2xl font-bold text-blue-800">{analytics.totalActiveStreaks}</div>
          <div className="text-blue-600 text-sm">Active Streaks</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
        <div className="text-center">
          <div className="text-3xl mb-2">📈</div>
          <div className="text-2xl font-bold text-green-800">{analytics.longestCurrentStreak}</div>
          <div className="text-green-600 text-sm">Longest Streak</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
        <div className="text-center">
          <div className="text-3xl mb-2">📊</div>
          <div className="text-2xl font-bold text-purple-800">{Math.round(analytics.habitCompletionRate)}%</div>
          <div className="text-purple-600 text-sm">Completion Rate</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
        <div className="text-center">
          <div className="text-3xl mb-2">🎯</div>
          <div className="text-2xl font-bold text-orange-800">{Math.round(analytics.weeklyConsistency)}%</div>
          <div className="text-orange-600 text-sm">Weekly Consistency</div>
        </div>
      </div>
    </div>
  );
};
