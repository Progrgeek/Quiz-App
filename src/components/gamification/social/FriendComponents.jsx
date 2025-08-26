import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { friendSystem } from '../../../gamification/social/FriendSystem.js';

// Friends List Component
export const FriendsList = ({ onStartChat, onViewProfile, onRemoveFriend }) => {
  const [friends, setFriends] = useState([]);
  const [filter, setFilter] = useState('all'); // all, online, studying

  useEffect(() => {
    const friendsData = friendSystem.getFriends();
    setFriends(friendsData);
  }, []);

  const filteredFriends = friends.filter(friend => {
    if (filter === 'online') return friend.status === 'online';
    if (filter === 'studying') return friend.status === 'studying';
    return true;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'studying': return 'bg-blue-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getLastSeenText = (lastSeen, status) => {
    if (status === 'online') return 'Online now';
    if (status === 'studying') return 'Studying';
    
    const timeDiff = Date.now() - lastSeen;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days} day${days !== 1 ? 's' : ''} ago`;
    } else if (hours > 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return 'Recently active';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-800">
          Friends ({friends.length})
        </h3>
        
        <div className="flex gap-2">
          {['all', 'online', 'studying'].map(filterType => (
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

      {/* Friends grid */}
      {filteredFriends.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <div className="text-4xl mb-2">👥</div>
          <p>No friends found for this filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredFriends.map(friend => (
            <motion.div
              key={friend.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
            >
              {/* Friend header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative">
                  <div className="text-4xl">{friend.avatar}</div>
                  <div 
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(friend.status)}`}
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{friend.name}</h4>
                  <p className="text-sm text-gray-600">{getLastSeenText(friend.lastSeen, friend.status)}</p>
                </div>
              </div>

              {/* Friend stats */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{friend.level}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Streak</span>
                  <span className="font-medium">{friend.streak} days</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Achievements</span>
                  <span className="font-medium">{friend.achievements}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Study Streak</span>
                  <span className="font-medium">{friend.studyStreak} days</span>
                </div>
              </div>

              {/* Shared interests */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-1">Favorite Subjects</p>
                <div className="flex flex-wrap gap-1">
                  {friend.favoriteSubjects.map(subject => (
                    <span 
                      key={subject}
                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                    >
                      {subject}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => onStartChat && onStartChat(friend)}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  💬 Chat
                </button>
                <button
                  onClick={() => onViewProfile && onViewProfile(friend)}
                  className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                >
                  👤 Profile
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

// Friend Requests Component
export const FriendRequests = ({ onAccept, onReject }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const requestsData = friendSystem.getFriendRequests();
    setRequests(requestsData);
  }, []);

  if (requests.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📬</div>
        <p>No pending friend requests</p>
      </div>
    );
  }

  const handleAccept = (requestId) => {
    friendSystem.acceptFriendRequest(requestId);
    setRequests(prev => prev.filter(req => req.id !== requestId));
    onAccept && onAccept(requestId);
  };

  const handleReject = (requestId) => {
    friendSystem.rejectFriendRequest(requestId);
    setRequests(prev => prev.filter(req => req.id !== requestId));
    onReject && onReject(requestId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">
        Friend Requests ({requests.length})
      </h3>
      
      <div className="space-y-3">
        {requests.map(request => (
          <motion.div
            key={request.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center gap-4">
              <div className="text-3xl">{request.fromUserAvatar}</div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-gray-800">{request.fromUserName}</h4>
                  <span className="text-sm text-gray-500">Level {request.fromUserLevel}</span>
                </div>
                
                {request.message && (
                  <p className="text-sm text-gray-600 mb-2">"{request.message}"</p>
                )}
                
                <p className="text-xs text-gray-500">
                  {new Date(request.timestamp).toLocaleDateString()}
                </p>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={() => handleAccept(request.id)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(request.id)}
                  className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Decline
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Study Groups Component
export const StudyGroups = ({ onJoinGroup, onCreateGroup, onViewGroup }) => {
  const [studyGroups, setStudyGroups] = useState([]);
  const [userGroups, setUserGroups] = useState([]);

  useEffect(() => {
    const allGroups = friendSystem.getStudyGroups();
    const userGroupsData = friendSystem.getUserStudyGroups();
    
    setStudyGroups(allGroups);
    setUserGroups(userGroupsData);
  }, []);

  const handleJoinGroup = (groupId) => {
    const success = friendSystem.joinStudyGroup(groupId);
    if (success) {
      // Refresh data
      const updatedGroups = friendSystem.getStudyGroups();
      const updatedUserGroups = friendSystem.getUserStudyGroups();
      setStudyGroups(updatedGroups);
      setUserGroups(updatedUserGroups);
      
      onJoinGroup && onJoinGroup(groupId);
    }
  };

  const isUserMember = (groupId) => {
    return userGroups.some(group => group.id === groupId);
  };

  return (
    <div className="space-y-6">
      {/* Your Groups */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Your Study Groups ({userGroups.length})
        </h3>
        
        {userGroups.length === 0 ? (
          <div className="text-center py-6 bg-gray-50 rounded-lg">
            <div className="text-3xl mb-2">📚</div>
            <p className="text-gray-600">You haven't joined any study groups yet</p>
            <button
              onClick={() => onCreateGroup && onCreateGroup()}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your First Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userGroups.map(group => (
              <StudyGroupCard
                key={group.id}
                group={group}
                isUserMember={true}
                onJoin={handleJoinGroup}
                onView={onViewGroup}
              />
            ))}
          </div>
        )}
      </div>

      {/* All Groups */}
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Discover Study Groups
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {studyGroups.filter(group => !isUserMember(group.id)).map(group => (
            <StudyGroupCard
              key={group.id}
              group={group}
              isUserMember={false}
              onJoin={handleJoinGroup}
              onView={onViewGroup}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// Study Group Card Component
const StudyGroupCard = ({ group, isUserMember, onJoin, onView }) => {
  const getPrivacyIcon = (privacy) => {
    return privacy === 'private' ? '🔒' : '🌐';
  };

  const getSubjectColor = (subject) => {
    const colors = {
      'Mathematics': 'bg-blue-100 text-blue-800',
      'Science': 'bg-green-100 text-green-800',
      'Programming': 'bg-purple-100 text-purple-800',
      'History': 'bg-yellow-100 text-yellow-800',
      'Literature': 'bg-pink-100 text-pink-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-bold text-gray-800 mb-1">{group.name}</h4>
          <p className="text-sm text-gray-600">{group.description}</p>
        </div>
        <div className="text-lg">{getPrivacyIcon(group.privacy)}</div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <span 
            className={`px-2 py-1 rounded-full text-xs font-medium ${getSubjectColor(group.subject)}`}
          >
            {group.subject}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>👥</span>
          <span>{group.members.length}/{group.memberLimit} members</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>📅</span>
          <span>{group.schedule}</span>
        </div>
        
        {group.stats && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📊</span>
            <span>{group.stats.totalSessions} sessions completed</span>
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${(group.members.length / group.memberLimit) * 100}%` 
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onView && onView(group)}
          className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
        >
          View Details
        </button>
        
        {!isUserMember && group.members.length < group.memberLimit && (
          <button
            onClick={() => onJoin && onJoin(group.id)}
            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Join Group
          </button>
        )}
        
        {isUserMember && (
          <button
            onClick={() => onView && onView(group)}
            className="flex-1 px-3 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            Open Group
          </button>
        )}
      </div>
    </motion.div>
  );
};

// Social Feed Component
export const SocialFeed = ({ onLike, onComment }) => {
  const [feedItems, setFeedItems] = useState([]);

  useEffect(() => {
    const feed = friendSystem.generateSocialFeed();
    setFeedItems(feed);
  }, []);

  const getActivityIcon = (type) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'exercise': return '📝';
      case 'study_session': return '📚';
      case 'milestone': return '🎯';
      case 'challenge': return '⚡';
      case 'social': return '👥';
      default: return '📱';
    }
  };

  const getTimeAgo = (timestamp) => {
    const timeDiff = Date.now() - timestamp;
    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else {
      return 'Just now';
    }
  };

  if (feedItems.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📱</div>
        <p>No recent activity from friends</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
      
      <div className="space-y-3">
        {feedItems.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-2xl">{item.userAvatar}</div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-800">{item.userName}</span>
                  <span className="text-sm text-gray-500">Level {item.userLevel}</span>
                  <span className="text-xl">{getActivityIcon(item.type)}</span>
                </div>
                
                <p className="text-gray-700 mb-2">{item.content}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{getTimeAgo(item.timestamp)}</span>
                  
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => onLike && onLike(item.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600 transition-colors"
                    >
                      ❤️ {item.likes}
                    </button>
                    <button
                      onClick={() => onComment && onComment(item.id)}
                      className="flex items-center gap-1 text-sm text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      💬 {item.comments}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Study Buddy Finder Component
export const StudyBuddyFinder = ({ onSendRequest, onViewProfile }) => {
  const [matches, setMatches] = useState([]);
  const [preferences, setPreferences] = useState({
    subjects: [],
    timezone: '',
    level: ''
  });

  useEffect(() => {
    const buddyMatches = friendSystem.findStudyBuddies(preferences);
    setMatches(buddyMatches);
  }, [preferences]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-800">Find Study Buddies</h3>
      
      {/* Preferences */}
      <div className="bg-blue-50 rounded-lg p-4">
        <h4 className="font-medium text-blue-800 mb-2">Preferences</h4>
        <p className="text-blue-600 text-sm">
          Adjust your preferences to find better study buddy matches
        </p>
        {/* Add preference controls here */}
      </div>

      {/* Matches */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map(match => (
          <motion.div
            key={match.id}
            whileHover={{ scale: 1.02 }}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-all"
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{match.avatar}</div>
              <h4 className="font-semibold text-gray-800">{match.name}</h4>
              <p className="text-sm text-gray-600">Level {match.level}</p>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Compatibility</span>
                <span className="font-medium text-green-600">{match.compatibility}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${match.compatibility}%` }}
                />
              </div>
            </div>

            <div className="mb-4">
              <p className="text-xs text-gray-500 mb-1">Subjects</p>
              <div className="flex flex-wrap gap-1">
                {match.subjects.map(subject => (
                  <span 
                    key={subject}
                    className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onViewProfile && onViewProfile(match)}
                className="flex-1 px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Profile
              </button>
              <button
                onClick={() => onSendRequest && onSendRequest(match.id)}
                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Request
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
