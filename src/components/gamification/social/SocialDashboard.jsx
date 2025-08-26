import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { leaderboardSystem } from '../../../gamification/social/LeaderboardSystem.js';
import { friendSystem } from '../../../gamification/social/FriendSystem.js';
import { Leaderboard, TournamentCard, ChallengeCard } from './LeaderboardComponents.jsx';
import { FriendsList, FriendRequests, StudyGroups, SocialFeed, StudyBuddyFinder } from './FriendComponents.jsx';

// Social Dashboard - Main Container
export const SocialDashboard = () => {
  const [activeTab, setActiveTab] = useState('friends');
  const [notifications, setNotifications] = useState({
    friendRequests: 2,
    challenges: 3,
    tournaments: 1
  });

  const tabs = [
    { id: 'friends', name: 'Friends', icon: '👥', badge: notifications.friendRequests },
    { id: 'leaderboards', name: 'Leaderboards', icon: '🏆' },
    { id: 'competitions', name: 'Competitions', icon: '⚡', badge: notifications.tournaments + notifications.challenges },
    { id: 'groups', name: 'Study Groups', icon: '📚' },
    { id: 'discover', name: 'Discover', icon: '🔍' }
  ];

  // Handle various social actions
  const handleFriendAction = (action, data) => {
    console.log(`Friend action: ${action}`, data);
    // Handle friend-related actions
  };

  const handleTournamentAction = (action, data) => {
    console.log(`Tournament action: ${action}`, data);
    // Handle tournament-related actions
  };

  const handleChallengeAction = (action, data) => {
    console.log(`Challenge action: ${action}`, data);
    // Handle challenge-related actions
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Social Learning Hub</h1>
        <p className="text-gray-600">Connect, compete, and learn together with your community</p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {tabs.map(tab => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveTab(tab.id)}
            className={`
              relative px-6 py-3 rounded-xl font-medium transition-all duration-300
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
            
            {tab.badge && tab.badge > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
              >
                {tab.badge}
              </motion.div>
            )}
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
          {activeTab === 'friends' && (
            <FriendsTab onAction={handleFriendAction} />
          )}
          
          {activeTab === 'leaderboards' && (
            <LeaderboardsTab />
          )}
          
          {activeTab === 'competitions' && (
            <CompetitionsTab 
              onTournamentAction={handleTournamentAction}
              onChallengeAction={handleChallengeAction}
            />
          )}
          
          {activeTab === 'groups' && (
            <StudyGroupsTab onAction={handleFriendAction} />
          )}
          
          {activeTab === 'discover' && (
            <DiscoverTab onAction={handleFriendAction} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Friends Tab Component
const FriendsTab = ({ onAction }) => {
  const [friendsSubTab, setFriendsSubTab] = useState('list');

  const friendsSubTabs = [
    { id: 'list', name: 'Friends List', icon: '👥' },
    { id: 'requests', name: 'Requests', icon: '📬' },
    { id: 'feed', name: 'Activity Feed', icon: '📱' }
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation */}
      <div className="flex gap-2 justify-center">
        {friendsSubTabs.map(subTab => (
          <button
            key={subTab.id}
            onClick={() => setFriendsSubTab(subTab.id)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-colors
              ${friendsSubTab === subTab.id
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {subTab.icon} {subTab.name}
          </button>
        ))}
      </div>

      {/* Sub-tab content */}
      <div>
        {friendsSubTab === 'list' && (
          <FriendsList
            onStartChat={friend => onAction('startChat', friend)}
            onViewProfile={friend => onAction('viewProfile', friend)}
            onRemoveFriend={friendId => onAction('removeFriend', friendId)}
          />
        )}
        
        {friendsSubTab === 'requests' && (
          <FriendRequests
            onAccept={requestId => onAction('acceptRequest', requestId)}
            onReject={requestId => onAction('rejectRequest', requestId)}
          />
        )}
        
        {friendsSubTab === 'feed' && (
          <SocialFeed
            onLike={postId => onAction('likePost', postId)}
            onComment={postId => onAction('commentPost', postId)}
          />
        )}
      </div>
    </div>
  );
};

// Leaderboards Tab Component
const LeaderboardsTab = () => {
  const [leaderboardType, setLeaderboardType] = useState('global');

  const leaderboardTypes = [
    { id: 'global', name: 'Global', icon: '🌍' },
    { id: 'friends', name: 'Friends', icon: '👥' },
    { id: 'local', name: 'Local', icon: '📍' },
    { id: 'weekly', name: 'Weekly', icon: '📅' },
    { id: 'monthly', name: 'Monthly', icon: '🗓️' }
  ];

  return (
    <div className="space-y-6">
      {/* Leaderboard type selector */}
      <div className="flex flex-wrap gap-2 justify-center">
        {leaderboardTypes.map(type => (
          <button
            key={type.id}
            onClick={() => setLeaderboardType(type.id)}
            className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-colors
              ${leaderboardType === type.id
                ? 'bg-yellow-100 text-yellow-700'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {type.icon} {type.name}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <Leaderboard type={leaderboardType} limit={15} />
      </div>
    </div>
  );
};

// Competitions Tab Component
const CompetitionsTab = ({ onTournamentAction, onChallengeAction }) => {
  const [competitionTab, setCompetitionTab] = useState('tournaments');
  const [tournaments, setTournaments] = useState([]);
  const [challenges, setChallenges] = useState([]);

  useEffect(() => {
    const allTournaments = leaderboardSystem.getAllTournaments();
    const activeChallenges = leaderboardSystem.getActiveChallenges();
    
    setTournaments(allTournaments);
    setChallenges(activeChallenges);
  }, []);

  const competitionTabs = [
    { id: 'tournaments', name: 'Tournaments', icon: '🏆' },
    { id: 'challenges', name: 'Challenges', icon: '⚡' }
  ];

  return (
    <div className="space-y-6">
      {/* Competition type selector */}
      <div className="flex gap-2 justify-center">
        {competitionTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setCompetitionTab(tab.id)}
            className={`
              px-6 py-3 rounded-lg font-medium transition-colors
              ${competitionTab === tab.id
                ? 'bg-purple-100 text-purple-700'
                : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            {tab.icon} {tab.name}
          </button>
        ))}
      </div>

      {/* Competition content */}
      <div>
        {competitionTab === 'tournaments' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center">Active Tournaments</h3>
            {tournaments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🏆</div>
                <p>No tournaments available at the moment</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tournaments.map(tournament => (
                  <TournamentCard
                    key={tournament.id}
                    tournament={tournament}
                    onJoin={tournamentId => onTournamentAction('join', tournamentId)}
                    onViewDetails={tournament => onTournamentAction('viewDetails', tournament)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {competitionTab === 'challenges' && (
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-gray-800 text-center">Active Challenges</h3>
            {challenges.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">⚡</div>
                <p>No active challenges right now</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map(challenge => (
                  <ChallengeCard
                    key={challenge.id}
                    challenge={challenge}
                    onJoin={challengeId => onChallengeAction('join', challengeId)}
                    onViewProgress={challenge => onChallengeAction('viewProgress', challenge)}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Study Groups Tab Component
const StudyGroupsTab = ({ onAction }) => {
  return (
    <div className="space-y-6">
      <StudyGroups
        onJoinGroup={groupId => onAction('joinGroup', groupId)}
        onCreateGroup={() => onAction('createGroup')}
        onViewGroup={group => onAction('viewGroup', group)}
      />
    </div>
  );
};

// Discover Tab Component
const DiscoverTab = ({ onAction }) => {
  return (
    <div className="space-y-6">
      <StudyBuddyFinder
        onSendRequest={userId => onAction('sendFriendRequest', userId)}
        onViewProfile={user => onAction('viewProfile', user)}
      />
    </div>
  );
};

// Social Stats Widget (for use in main gamification dashboard)
export const SocialStatsWidget = () => {
  const [stats, setStats] = useState({
    friends: 4,
    studyGroups: 2,
    challengesActive: 3,
    leaderboardRank: 5
  });

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
      <h3 className="text-lg font-bold text-green-800 mb-4">Social Stats</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">{stats.friends}</div>
          <div className="text-sm text-green-600">Friends</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">#{stats.leaderboardRank}</div>
          <div className="text-sm text-green-600">Global Rank</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">{stats.studyGroups}</div>
          <div className="text-sm text-green-600">Study Groups</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-700">{stats.challengesActive}</div>
          <div className="text-sm text-green-600">Active Challenges</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-green-200">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          View Social Dashboard
        </motion.button>
      </div>
    </div>
  );
};
