import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { streakSystem } from '../../../gamification/streaks/StreakSystem.js';
import { 
  StreakCard, 
  HabitTracker, 
  StreakCalendar, 
  MotivationWidget, 
  HabitRecommendationCard,
  StreakAnalyticsWidget 
} from './StreakComponents.jsx';

// Streaks & Habits Dashboard - Main Container
export const StreaksHabitsDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [streaks, setStreaks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [selectedStreak, setSelectedStreak] = useState(null);

  useEffect(() => {
    // Load data
    const userStreaks = streakSystem.getActiveStreaks();
    const userHabits = streakSystem.getActiveHabits();
    const habitRecommendations = streakSystem.getHabitRecommendations();

    setStreaks(userStreaks);
    setHabits(userHabits);
    setRecommendations(habitRecommendations);
  }, []);

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'streaks', name: 'Streaks', icon: '🔥' },
    { id: 'habits', name: 'Daily Habits', icon: '📅' },
    { id: 'calendar', name: 'Calendar', icon: '🗓️' },
    { id: 'recommendations', name: 'Discover', icon: '🌟' }
  ];

  const handleCompleteHabit = (habitId) => {
    // Refresh data after completion
    const updatedHabits = streakSystem.getActiveHabits();
    const updatedStreaks = streakSystem.getActiveStreaks();
    setHabits(updatedHabits);
    setStreaks(updatedStreaks);
  };

  const handleAddHabit = (templateId) => {
    streakSystem.createHabit(templateId);
    const updatedHabits = streakSystem.getActiveHabits();
    const updatedRecommendations = streakSystem.getHabitRecommendations();
    setHabits(updatedHabits);
    setRecommendations(updatedRecommendations);
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Streaks & Habits</h1>
        <p className="text-gray-600">Build consistency and create lasting learning habits</p>
      </div>

      {/* Quick Stats */}
      <StreakAnalyticsWidget />

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-6 py-3 rounded-xl font-medium transition-all duration-300
              ${activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <span className="text-lg">{tab.icon}</span>
              <span>{tab.name}</span>
            </span>
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'overview' && (
            <OverviewTab 
              streaks={streaks} 
              habits={habits}
              onCompleteHabit={handleCompleteHabit}
              onViewStreak={setSelectedStreak}
            />
          )}
          
          {activeTab === 'streaks' && (
            <StreaksTab 
              streaks={streaks} 
              onViewDetails={setSelectedStreak}
            />
          )}
          
          {activeTab === 'habits' && (
            <HabitsTab 
              habits={habits} 
              onCompleteHabit={handleCompleteHabit}
            />
          )}
          
          {activeTab === 'calendar' && (
            <CalendarTab 
              streaks={streaks}
              selectedStreak={selectedStreak}
            />
          )}
          
          {activeTab === 'recommendations' && (
            <RecommendationsTab 
              recommendations={recommendations}
              onAddHabit={handleAddHabit}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ streaks, habits, onCompleteHabit, onViewStreak }) => {
  const topStreaks = streaks.slice(0, 3);
  const todayHabits = habits.filter(habit => !habit.currentProgress.todayCompleted);

  return (
    <div className="space-y-8">
      {/* Today's Tasks */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Today's Habits</h2>
        {todayHabits.length === 0 ? (
          <div className="text-center py-8 bg-green-50 rounded-xl border border-green-200">
            <div className="text-4xl mb-2">🎉</div>
            <h3 className="font-semibold text-green-800">All Done for Today!</h3>
            <p className="text-green-600">You've completed all your daily habits. Great job!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayHabits.map(habit => {
              const template = streakSystem.getHabitTemplate(habit.templateId);
              return (
                <HabitTracker
                  key={habit.id}
                  habit={habit}
                  template={template}
                  onComplete={onCompleteHabit}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Active Streaks */}
      <div>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Your Top Streaks</h2>
        {topStreaks.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">🔥</div>
            <p>Start building your first streak today!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topStreaks.map(streak => {
              const template = streakSystem.getHabitTemplate(streak.habitId);
              return (
                <StreakCard
                  key={streak.id}
                  streak={streak}
                  template={template}
                  onViewDetails={onViewStreak}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Motivation */}
      {streaks.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Daily Motivation</h2>
          <MotivationWidget habitId={streaks[0].habitId} />
        </div>
      )}
    </div>
  );
};

// Streaks Tab Component
const StreaksTab = ({ streaks, onViewDetails }) => {
  const [sortBy, setSortBy] = useState('current'); // current, longest, recent

  const sortedStreaks = [...streaks].sort((a, b) => {
    switch (sortBy) {
      case 'longest':
        return b.longestStreak - a.longestStreak;
      case 'recent':
        return new Date(b.lastActivityDate) - new Date(a.lastActivityDate);
      default: // current
        return b.currentStreak - a.currentStreak;
    }
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">All Streaks ({streaks.length})</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
        >
          <option value="current">Sort by Current Streak</option>
          <option value="longest">Sort by Longest Streak</option>
          <option value="recent">Sort by Recent Activity</option>
        </select>
      </div>

      {/* Streaks Grid */}
      {sortedStreaks.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-6xl mb-4">🔥</div>
          <h3 className="text-xl font-semibold mb-2">No Streaks Yet</h3>
          <p>Start a habit to begin building your first streak!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedStreaks.map(streak => {
            const template = streakSystem.getHabitTemplate(streak.habitId);
            return (
              <StreakCard
                key={streak.id}
                streak={streak}
                template={template}
                onViewDetails={onViewDetails}
                size="medium"
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Habits Tab Component
const HabitsTab = ({ habits, onCompleteHabit }) => {
  const [filter, setFilter] = useState('all'); // all, completed, pending

  const filteredHabits = habits.filter(habit => {
    if (filter === 'completed') return habit.currentProgress.todayCompleted;
    if (filter === 'pending') return !habit.currentProgress.todayCompleted;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Daily Habits ({habits.length})</h2>
        
        <div className="flex gap-2">
          {['all', 'pending', 'completed'].map(filterType => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Habits List */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">📅</div>
          <p>No habits found for this filter</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHabits.map(habit => {
            const template = streakSystem.getHabitTemplate(habit.templateId);
            return (
              <HabitTracker
                key={habit.id}
                habit={habit}
                template={template}
                onComplete={onCompleteHabit}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

// Calendar Tab Component
const CalendarTab = ({ streaks, selectedStreak }) => {
  const [currentStreak, setCurrentStreak] = useState(selectedStreak || streaks[0]);

  useEffect(() => {
    if (selectedStreak) {
      setCurrentStreak(selectedStreak);
    }
  }, [selectedStreak]);

  if (!currentStreak) {
    return (
      <div className="text-center py-12 text-gray-500">
        <div className="text-6xl mb-4">🗓️</div>
        <h3 className="text-xl font-semibold mb-2">No Streaks to Display</h3>
        <p>Start a habit to see your progress calendar!</p>
      </div>
    );
  }

  const template = streakSystem.getHabitTemplate(currentStreak.habitId);

  return (
    <div className="space-y-6">
      {/* Streak Selector */}
      {streaks.length > 1 && (
        <div className="flex items-center gap-4">
          <label className="font-medium text-gray-700">View Calendar for:</label>
          <select
            value={currentStreak.id}
            onChange={(e) => {
              const streak = streaks.find(s => s.id === e.target.value);
              setCurrentStreak(streak);
            }}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            {streaks.map(streak => {
              const tmpl = streakSystem.getHabitTemplate(streak.habitId);
              return (
                <option key={streak.id} value={streak.id}>
                  {tmpl?.name || 'Unknown Habit'}
                </option>
              );
            })}
          </select>
        </div>
      )}

      {/* Calendar */}
      <StreakCalendar streak={currentStreak} template={template} />

      {/* Streak Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Streak Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{currentStreak.currentStreak}</div>
            <div className="text-gray-600">Current Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">{currentStreak.longestStreak}</div>
            <div className="text-gray-600">Longest Streak</div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{currentStreak.history.length}</div>
            <div className="text-gray-600">Total Days</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Recommendations Tab Component
const RecommendationsTab = ({ recommendations, onAddHabit }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...new Set(recommendations.map(r => r.category))];
  
  const filteredRecommendations = recommendations.filter(rec => 
    selectedCategory === 'all' || rec.category === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Discover New Habits</h2>
        <p className="text-gray-600">Add new habits to build a stronger learning routine</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedCategory === category
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Recommendations Grid */}
      {filteredRecommendations.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">🌟</div>
          <p>No recommendations available for this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecommendations.map(recommendation => (
            <HabitRecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onAddHabit={onAddHabit}
            />
          ))}
        </div>
      )}
    </div>
  );
};
