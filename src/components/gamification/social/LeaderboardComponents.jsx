import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leaderboardSystem } from '../../../gamification/social/LeaderboardSystem.js';
import { friendSystem } from '../../../gamification/social/FriendSystem.js';

// Leaderboard Component
export const Leaderboard = ({ type = 'global', limit = 10 }) => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = () => {
      try {
        const data = leaderboardSystem.getLeaderboard(type, limit);
        setLeaderboardData(data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, [type, limit]);

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-600 mt-2">Loading leaderboard...</p>
      </div>
    );
  }

  if (!leaderboardData || !leaderboardData.users.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📊</div>
        <p>No leaderboard data available</p>
      </div>
    );
  }

  const currentUserRank = leaderboardSystem.getUserRank('current-user', type);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-800 mb-2">
          {type.charAt(0).toUpperCase() + type.slice(1)} Leaderboard
        </h3>
        {currentUserRank && (
          <p className="text-gray-600">
            Your rank: <span className="font-bold text-blue-600">#{currentUserRank}</span>
          </p>
        )}
      </div>

      {/* Top 3 Podium */}
      {leaderboardData.users.length >= 3 && (
        <div className="flex justify-center items-end gap-4 mb-8">
          {/* 2nd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center"
          >
            <div className="w-20 h-16 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-lg flex items-end justify-center mb-2">
              <span className="text-white font-bold pb-1">2</span>
            </div>
            <div className="text-3xl mb-1">{leaderboardData.users[1].avatar}</div>
            <div className="font-semibold text-sm">{leaderboardData.users[1].name}</div>
            <div className="text-blue-600 font-bold text-sm">{leaderboardData.users[1].xp.toLocaleString()} XP</div>
            <div className="text-gray-500 text-xs">Level {leaderboardData.users[1].level}</div>
          </motion.div>

          {/* 1st Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-center"
          >
            <div className="w-24 h-20 bg-gradient-to-t from-yellow-400 to-yellow-300 rounded-t-lg flex items-end justify-center mb-2 relative">
              <span className="text-white font-bold pb-1">1</span>
              <div className="absolute -top-2 text-yellow-500">👑</div>
            </div>
            <div className="text-4xl mb-1">{leaderboardData.users[0].avatar}</div>
            <div className="font-bold">{leaderboardData.users[0].name}</div>
            <div className="text-blue-600 font-bold">{leaderboardData.users[0].xp.toLocaleString()} XP</div>
            <div className="text-gray-500 text-sm">Level {leaderboardData.users[0].level}</div>
          </motion.div>

          {/* 3rd Place */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <div className="w-20 h-12 bg-gradient-to-t from-amber-600 to-amber-500 rounded-t-lg flex items-end justify-center mb-2">
              <span className="text-white font-bold pb-1">3</span>
            </div>
            <div className="text-3xl mb-1">{leaderboardData.users[2].avatar}</div>
            <div className="font-semibold text-sm">{leaderboardData.users[2].name}</div>
            <div className="text-blue-600 font-bold text-sm">{leaderboardData.users[2].xp.toLocaleString()} XP</div>
            <div className="text-gray-500 text-xs">Level {leaderboardData.users[2].level}</div>
          </motion.div>
        </div>
      )}

      {/* Full Ranking List */}
      <div className="space-y-2">
        {leaderboardData.users.map((user, index) => {
          const isCurrentUser = user.id === 'current-user';
          const rank = index + 1;
          
          return (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`
                p-4 rounded-lg border flex items-center gap-4 transition-all
                ${isCurrentUser 
                  ? 'bg-blue-50 border-blue-200 ring-2 ring-blue-200' 
                  : 'bg-white border-gray-200 hover:border-gray-300'
                }
              `}
            >
              {/* Rank */}
              <div className="text-center min-w-[40px]">
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
                  ${rank <= 3 
                    ? 'text-white ' + (rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-amber-600')
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {rank}
                </div>
              </div>

              {/* Avatar & Name */}
              <div className="flex items-center gap-3 flex-1">
                <div className="text-3xl">{user.avatar}</div>
                <div>
                  <div className={`font-semibold ${isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                    {user.name}
                    {isCurrentUser && <span className="text-blue-600 ml-1">(You)</span>}
                  </div>
                  <div className="text-sm text-gray-600">
                    Level {user.level} • {user.achievements || 0} achievements
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="text-right">
                <div className={`font-bold ${isCurrentUser ? 'text-blue-600' : 'text-gray-800'}`}>
                  {user.xp.toLocaleString()} XP
                </div>
                <div className="text-sm text-gray-600">
                  {user.streak} day streak
                </div>
              </div>

              {/* Country Flag */}
              {type === 'global' && user.country && (
                <div className="text-xl">
                  {user.country === 'US' ? '🇺🇸' : 
                   user.country === 'ES' ? '🇪🇸' :
                   user.country === 'JP' ? '🇯🇵' :
                   user.country === 'CA' ? '🇨🇦' :
                   user.country === 'KR' ? '🇰🇷' :
                   user.country === 'FR' ? '🇫🇷' :
                   user.country === 'BR' ? '🇧🇷' :
                   user.country === 'IN' ? '🇮🇳' :
                   user.country === 'EG' ? '🇪🇬' : '🌍'}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* View More Button */}
      {leaderboardData.users.length >= limit && (
        <div className="text-center">
          <button className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors">
            View Full Leaderboard
          </button>
        </div>
      )}

      {/* Last Updated */}
      <div className="text-center text-sm text-gray-500">
        Last updated: {new Date(leaderboardData.lastUpdated).toLocaleTimeString()}
      </div>
    </div>
  );
};

// Tournament Component
export const TournamentCard = ({ tournament, onJoin, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeDisplay = (tournament) => {
    const now = Date.now();
    const start = tournament.startDate;
    const end = tournament.endDate;

    if (now < start) {
      const timeUntilStart = start - now;
      const hours = Math.floor(timeUntilStart / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return `Starts in ${days} day${days !== 1 ? 's' : ''}`;
      } else {
        return `Starts in ${hours} hour${hours !== 1 ? 's' : ''}`;
      }
    } else if (now < end) {
      const timeUntilEnd = end - now;
      const hours = Math.floor(timeUntilEnd / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return `${days} day${days !== 1 ? 's' : ''} remaining`;
      } else {
        return `${hours} hour${hours !== 1 ? 's' : ''} remaining`;
      }
    } else {
      return 'Tournament ended';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{tournament.name}</h3>
          <p className="text-gray-600 text-sm">{tournament.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(tournament.status)}`}>
          {tournament.status.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🏆</span>
          <span>Type: {tournament.type}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>👥</span>
          <span>{tournament.participants.length}/{tournament.maxParticipants} participants</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>⏰</span>
          <span>{getTimeDisplay(tournament)}</span>
        </div>
      </div>

      {/* Prizes */}
      {tournament.prizes && tournament.prizes.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Prizes:</h4>
          <div className="space-y-1">
            {tournament.prizes.slice(0, 3).map((prize, index) => (
              <div key={index} className="text-sm text-gray-600">
                {prize.rank === 1 ? '🥇' : prize.rank === 2 ? '🥈' : '🥉'} {prize.reward}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(tournament.participants.length / tournament.maxParticipants) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewDetails && onViewDetails(tournament)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Details
        </button>
        
        {tournament.status === 'upcoming' && (
          <button
            onClick={() => onJoin && onJoin(tournament.id)}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Tournament
          </button>
        )}
        
        {tournament.status === 'active' && (
          <button
            onClick={() => onViewDetails && onViewDetails(tournament)}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            View Progress
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Challenge Component
export const ChallengeCard = ({ challenge, onJoin, onViewProgress }) => {
  const getTypeColor = (type) => {
    switch (type) {
      case 'daily': return 'bg-orange-100 text-orange-800';
      case 'weekly': return 'bg-blue-100 text-blue-800';
      case 'monthly': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimeRemaining = (endDate) => {
    const timeLeft = endDate - Date.now();
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `${days}d ${hours}h remaining`;
    } else if (hours > 0) {
      return `${hours}h remaining`;
    } else {
      return 'Ending soon';
    }
  };

  const sampleProgress = Math.floor(Math.random() * 80 + 10); // 10-90% for demo

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-1">{challenge.name}</h3>
          <p className="text-gray-600 text-sm">{challenge.description}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(challenge.type)}`}>
          {challenge.type.toUpperCase()}
        </span>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🎯</span>
          <span>Goal: {challenge.goal.target} {challenge.goal.type.replace('_', ' ')}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>🏆</span>
          <span>{challenge.reward}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>⏰</span>
          <span>{getTimeRemaining(challenge.endDate)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>👥</span>
          <span>{challenge.participants.length} participants</span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-1">
          <span>Progress</span>
          <span>{sampleProgress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${sampleProgress}%` }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onViewProgress && onViewProgress(challenge)}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Progress
        </button>
        
        <button
          onClick={() => onJoin && onJoin(challenge.id)}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Join Challenge
        </button>
      </div>
    </motion.div>
  );
};
