import React, { useMemo, useState } from 'react';

const StreakTracker = ({ progressData, sessionHistory }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Calculate current streak and streak history
  const streakData = useMemo(() => {
    if (!sessionHistory?.length) return null;
    
    const sessions = [...sessionHistory].sort((a, b) => 
      new Date(a.startTime) - new Date(b.startTime)
    );
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    // Group sessions by date
    const sessionsByDate = {};
    sessions.forEach(session => {
      const date = new Date(session.startTime).toDateString();
      if (!sessionsByDate[date]) {
        sessionsByDate[date] = [];
      }
      sessionsByDate[date].push(session);
    });
    
    const sessionDates = Object.keys(sessionsByDate).sort((a, b) => 
      new Date(b) - new Date(a)
    );
    
    // Calculate current streak from today backwards
    let streakDate = new Date(today);
    streakDate.setHours(0, 0, 0, 0);
    
    while (true) {
      const dateString = streakDate.toDateString();
      if (sessionsByDate[dateString] && sessionsByDate[dateString].length > 0) {
        currentStreak++;
        streakDate.setDate(streakDate.getDate() - 1);
      } else {
        // Allow for today if no session yet
        if (streakDate.toDateString() === today.toDateString()) {
          streakDate.setDate(streakDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate = null;
    
    sessionDates.reverse().forEach(dateString => {
      const date = new Date(dateString);
      if (lastDate) {
        const daysDiff = Math.floor((date - lastDate) / msPerDay);
        if (daysDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      lastDate = date;
    });
    longestStreak = Math.max(longestStreak, tempStreak);
    
    // Calculate streak history for visualization
    const streakHistory = [];
    const last30Days = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dateString = date.toDateString();
      const daySession = sessionsByDate[dateString];
      
      last30Days.push({
        date,
        dateString,
        hasSession: !!daySession,
        sessionCount: daySession?.length || 0,
        totalScore: daySession ? daySession.reduce((sum, s) => sum + (s.averageScore || 0), 0) / daySession.length : 0,
        dayOfWeek: date.getDay()
      });
    }
    
    // Calculate streak milestones
    const milestones = [
      { days: 3, icon: '🔥', title: 'Getting Started', achieved: currentStreak >= 3 },
      { days: 7, icon: '⭐', title: 'One Week Warrior', achieved: currentStreak >= 7 },
      { days: 14, icon: '💪', title: 'Two Week Champion', achieved: currentStreak >= 14 },
      { days: 30, icon: '🏆', title: 'Monthly Master', achieved: currentStreak >= 30 },
      { days: 50, icon: '🌟', title: 'Dedication Star', achieved: currentStreak >= 50 },
      { days: 100, icon: '👑', title: 'Century Club', achieved: currentStreak >= 100 }
    ];
    
    // Calculate weekly patterns
    const weeklyPattern = Array(7).fill(0);
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    Object.values(sessionsByDate).forEach(daySessions => {
      if (daySessions.length > 0) {
        const dayOfWeek = new Date(daySessions[0].startTime).getDay();
        weeklyPattern[dayOfWeek] += daySessions.length;
      }
    });
    
    return {
      currentStreak,
      longestStreak,
      totalDays: sessionDates.length,
      last30Days,
      milestones,
      weeklyPattern: weeklyPattern.map((count, index) => ({
        day: weekDays[index],
        count,
        percentage: count / Math.max(1, Math.max(...weeklyPattern)) * 100
      })),
      streakBreaks: calculateStreakBreaks(sessionsByDate),
      averageSessionsPerDay: sessions.length / Math.max(1, sessionDates.length)
    };
  }, [sessionHistory]);

  // Calculate streak breaks
  const calculateStreakBreaks = (sessionsByDate) => {
    const breaks = [];
    const dates = Object.keys(sessionsByDate).sort((a, b) => new Date(a) - new Date(b));
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currDate = new Date(dates[i]);
      const daysDiff = Math.floor((currDate - prevDate) / (24 * 60 * 60 * 1000));
      
      if (daysDiff > 1) {
        breaks.push({
          startDate: prevDate,
          endDate: currDate,
          daysGap: daysDiff - 1
        });
      }
    }
    
    return breaks;
  };

  // Get streak status and motivation
  const getStreakStatus = () => {
    if (!streakData) return { status: 'inactive', message: 'Start your learning journey!' };
    
    const { currentStreak } = streakData;
    
    if (currentStreak === 0) {
      return {
        status: 'broken',
        message: 'Ready to restart your streak?',
        color: 'red',
        icon: '💔'
      };
    } else if (currentStreak < 3) {
      return {
        status: 'starting',
        message: 'Great start! Keep building momentum.',
        color: 'blue',
        icon: '🚀'
      };
    } else if (currentStreak < 7) {
      return {
        status: 'building',
        message: 'You\'re on fire! Keep it going.',
        color: 'orange',
        icon: '🔥'
      };
    } else if (currentStreak < 30) {
      return {
        status: 'strong',
        message: 'Amazing consistency! You\'re unstoppable.',
        color: 'green',
        icon: '⭐'
      };
    } else {
      return {
        status: 'legendary',
        message: 'Legendary dedication! You\'re an inspiration.',
        color: 'purple',
        icon: '👑'
      };
    }
  };

  const streakStatus = getStreakStatus();

  // Render calendar heatmap
  const renderCalendarHeatmap = () => {
    if (!streakData) return null;
    
    return (
      <div className="space-y-2">
        <h5 className="font-medium text-gray-800">Last 30 Days Activity</h5>
        <div className="grid grid-cols-10 gap-1">
          {streakData.last30Days.map((day, index) => (
            <div
              key={index}
              className={`w-6 h-6 rounded border text-xs flex items-center justify-center ${
                day.hasSession
                  ? day.totalScore > 80
                    ? 'bg-green-500 text-white'
                    : day.totalScore > 60
                    ? 'bg-green-300 text-gray-800'
                    : 'bg-green-100 text-gray-800'
                  : 'bg-gray-100 text-gray-400'
              }`}
              title={`${day.dateString}: ${day.hasSession ? `${day.sessionCount} session(s)` : 'No activity'}`}
            >
              {day.date.getDate()}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Less</span>
          <div className="flex space-x-1">
            <div className="w-3 h-3 bg-gray-100 rounded"></div>
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <div className="w-3 h-3 bg-green-300 rounded"></div>
            <div className="w-3 h-3 bg-green-500 rounded"></div>
          </div>
          <span>More</span>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Learning Streak</h3>
        <div className="text-2xl">{streakStatus.icon}</div>
      </div>

      {streakData ? (
        <div className="space-y-6">
          {/* Current Streak Display */}
          <div className={`text-center p-6 rounded-lg bg-gradient-to-br from-${streakStatus.color}-500 to-${streakStatus.color}-600 text-white`}>
            <div className="text-5xl font-bold mb-2">{streakData.currentStreak}</div>
            <div className="text-lg opacity-90">
              {streakData.currentStreak === 1 ? 'Day' : 'Days'} Streak
            </div>
            <div className="text-sm opacity-80 mt-2">{streakStatus.message}</div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{streakData.longestStreak}</div>
              <div className="text-sm text-blue-800">Longest Streak</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{streakData.totalDays}</div>
              <div className="text-sm text-green-800">Total Active Days</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {streakData.averageSessionsPerDay.toFixed(1)}
              </div>
              <div className="text-sm text-purple-800">Avg Sessions/Day</div>
            </div>
            
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {streakData.streakBreaks.length}
              </div>
              <div className="text-sm text-orange-800">Streak Breaks</div>
            </div>
          </div>

          {/* Calendar Heatmap */}
          <div className="bg-gray-50 rounded-lg p-4">
            {renderCalendarHeatmap()}
          </div>

          {/* Milestones */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Streak Milestones</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {streakData.milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    milestone.achieved
                      ? 'bg-green-50 border-green-200 text-green-800'
                      : 'bg-gray-50 border-gray-200 text-gray-600'
                  }`}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-lg">{milestone.icon}</span>
                    <span className="font-medium text-sm">{milestone.title}</span>
                    {milestone.achieved && <span className="text-xs">✅</span>}
                  </div>
                  <div className="text-xs">{milestone.days} days</div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Pattern */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-4">Weekly Activity Pattern</h4>
            <div className="space-y-2">
              {streakData.weeklyPattern.map((day, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-600">{day.day}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-500"
                      style={{ width: `${day.percentage}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                      {day.count} sessions
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivational Messages */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-400">
            <h5 className="font-semibold text-indigo-800 mb-2">Stay Motivated!</h5>
            <div className="text-sm text-indigo-700">
              {streakData.currentStreak === 0 ? (
                <p>🎯 Every expert was once a beginner. Start your streak today!</p>
              ) : streakData.currentStreak < 7 ? (
                <p>🔥 You're building great momentum. Consistency is key to mastery!</p>
              ) : streakData.currentStreak < 30 ? (
                <p>⭐ Your dedication is paying off. You're developing a powerful learning habit!</p>
              ) : (
                <p>👑 You're a learning machine! Your consistency is truly inspiring.</p>
              )}
            </div>
          </div>

          {/* Next Milestone */}
          {(() => {
            const nextMilestone = streakData.milestones.find(m => !m.achieved);
            if (nextMilestone) {
              const daysToGo = nextMilestone.days - streakData.currentStreak;
              return (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{nextMilestone.icon}</span>
                    <div>
                      <div className="font-semibold text-gray-800">
                        Next: {nextMilestone.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {daysToGo === 1 ? 'Just 1 more day!' : `${daysToGo} days to go`}
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 bg-yellow-100 rounded-full h-2">
                    <div
                      className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${(streakData.currentStreak / nextMilestone.days) * 100}%` }}
                    ></div>
                  </div>
                </div>
              );
            }
            return null;
          })()}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-4">🚀</div>
          <h4 className="text-lg font-semibold text-gray-800 mb-2">
            Start Your Learning Streak Today!
          </h4>
          <p className="text-gray-600 mb-4">
            Complete your first exercise to begin tracking your daily learning streak.
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
            Start Learning
          </button>
        </div>
      )}
    </div>
  );
};

export default StreakTracker;
