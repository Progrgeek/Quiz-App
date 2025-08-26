import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Friend System - Core functionality
export class FriendSystem {
  constructor() {
    this.friends = new Map();
    this.friendRequests = new Map();
    this.studyGroups = new Map();
    this.socialFeeds = new Map();
    this.currentUserId = 'current-user';
    
    this.initializeSampleData();
  }

  // Initialize with sample friends and data
  initializeSampleData() {
    const sampleFriends = [
      {
        id: 'friend-1',
        name: 'Sarah Wilson',
        avatar: '👩‍🎓',
        level: 12,
        xp: 15300,
        streak: 28,
        status: 'online',
        lastSeen: Date.now(),
        mutualFriends: 3,
        studyStreak: 5,
        sharedAchievements: 8,
        favoriteSubjects: ['Math', 'Science'],
        recentActivity: [
          { type: 'achievement', content: 'Unlocked Math Master!', timestamp: Date.now() - 3600000 },
          { type: 'exercise', content: 'Completed 10 algebra exercises', timestamp: Date.now() - 7200000 }
        ]
      },
      {
        id: 'friend-2',
        name: 'Jake Martinez',
        avatar: '👨‍💻',
        level: 9,
        xp: 11200,
        streak: 15,
        status: 'studying',
        lastSeen: Date.now() - 1800000,
        mutualFriends: 5,
        studyStreak: 3,
        sharedAchievements: 6,
        favoriteSubjects: ['Programming', 'Logic'],
        recentActivity: [
          { type: 'study_session', content: 'Studied for 2 hours', timestamp: Date.now() - 1800000 },
          { type: 'challenge', content: 'Joined Speed Learning Sprint', timestamp: Date.now() - 5400000 }
        ]
      },
      {
        id: 'friend-3',
        name: 'Emma Chen',
        avatar: '👩‍🔬',
        level: 14,
        xp: 17800,
        streak: 42,
        status: 'offline',
        lastSeen: Date.now() - 14400000,
        mutualFriends: 2,
        studyStreak: 7,
        sharedAchievements: 12,
        favoriteSubjects: ['Chemistry', 'Biology'],
        recentActivity: [
          { type: 'milestone', content: 'Reached 42-day streak!', timestamp: Date.now() - 14400000 },
          { type: 'achievement', content: 'Unlocked Consistency Champion', timestamp: Date.now() - 18000000 }
        ]
      },
      {
        id: 'friend-4',
        name: 'Alex Thompson',
        avatar: '👨‍🎨',
        level: 8,
        xp: 9100,
        streak: 22,
        status: 'online',
        lastSeen: Date.now() - 300000,
        mutualFriends: 4,
        studyStreak: 2,
        sharedAchievements: 5,
        favoriteSubjects: ['Art', 'History'],
        recentActivity: [
          { type: 'exercise', content: 'Aced history quiz!', timestamp: Date.now() - 900000 },
          { type: 'social', content: 'Invited you to study group', timestamp: Date.now() - 1800000 }
        ]
      }
    ];

    // Add friends to the system
    sampleFriends.forEach(friend => {
      this.friends.set(friend.id, friend);
    });

    // Add sample friend requests
    this.friendRequests.set('request-1', {
      id: 'request-1',
      fromUserId: 'user-pending-1',
      fromUserName: 'Maya Patel',
      fromUserAvatar: '👩‍💼',
      fromUserLevel: 10,
      toUserId: this.currentUserId,
      message: 'Hey! I saw we both love math exercises. Want to be study buddies?',
      timestamp: Date.now() - 3600000,
      status: 'pending'
    });

    this.friendRequests.set('request-2', {
      id: 'request-2',
      fromUserId: 'user-pending-2',
      fromUserName: 'Carlos Rodriguez',
      fromUserAvatar: '👨‍🔬',
      fromUserLevel: 13,
      toUserId: this.currentUserId,
      message: 'Want to join our study group? We meet every Tuesday!',
      timestamp: Date.now() - 7200000,
      status: 'pending'
    });

    // Initialize study groups
    this.createStudyGroup({
      name: 'Math Masters',
      description: 'Daily math problem solving group',
      subject: 'Mathematics',
      privacy: 'public',
      memberLimit: 10,
      schedule: 'Daily at 7 PM EST'
    });

    this.createStudyGroup({
      name: 'Science Squad',
      description: 'Exploring the wonders of science together',
      subject: 'Science',
      privacy: 'private',
      memberLimit: 8,
      schedule: 'Mon, Wed, Fri at 6 PM EST'
    });
  }

  // Friend management
  getFriends() {
    return Array.from(this.friends.values());
  }

  addFriend(userId, userData) {
    this.friends.set(userId, {
      ...userData,
      addedAt: Date.now()
    });
  }

  removeFriend(userId) {
    return this.friends.delete(userId);
  }

  getFriend(userId) {
    return this.friends.get(userId);
  }

  // Friend requests
  sendFriendRequest(toUserId, message = '') {
    const requestId = `request-${Date.now()}`;
    const request = {
      id: requestId,
      fromUserId: this.currentUserId,
      toUserId,
      message,
      timestamp: Date.now(),
      status: 'pending'
    };

    this.friendRequests.set(requestId, request);
    return request;
  }

  getFriendRequests(userId = this.currentUserId) {
    return Array.from(this.friendRequests.values())
      .filter(request => request.toUserId === userId && request.status === 'pending');
  }

  getSentFriendRequests(userId = this.currentUserId) {
    return Array.from(this.friendRequests.values())
      .filter(request => request.fromUserId === userId && request.status === 'pending');
  }

  acceptFriendRequest(requestId) {
    const request = this.friendRequests.get(requestId);
    if (!request) return false;

    request.status = 'accepted';
    // In a real app, you'd fetch the user data and add them as a friend
    return true;
  }

  rejectFriendRequest(requestId) {
    const request = this.friendRequests.get(requestId);
    if (!request) return false;

    request.status = 'rejected';
    return true;
  }

  // Study Groups
  createStudyGroup(config) {
    const groupId = `group-${Date.now()}`;
    const studyGroup = {
      id: groupId,
      name: config.name,
      description: config.description,
      subject: config.subject,
      privacy: config.privacy || 'public',
      memberLimit: config.memberLimit || 20,
      schedule: config.schedule,
      createdBy: this.currentUserId,
      createdAt: Date.now(),
      members: [
        {
          userId: this.currentUserId,
          role: 'admin',
          joinedAt: Date.now(),
          contributions: 0
        }
      ],
      activities: [],
      goals: [],
      stats: {
        totalSessions: 0,
        totalMinutes: 0,
        averageScore: 0
      }
    };

    // Add some sample members for demo
    if (groupId.includes('Math')) {
      studyGroup.members.push(
        {
          userId: 'friend-1',
          role: 'member',
          joinedAt: Date.now() - 86400000,
          contributions: 5
        },
        {
          userId: 'friend-3',
          role: 'moderator',
          joinedAt: Date.now() - 172800000,
          contributions: 12
        }
      );
    } else if (groupId.includes('Science')) {
      studyGroup.members.push(
        {
          userId: 'friend-2',
          role: 'member',
          joinedAt: Date.now() - 259200000,
          contributions: 8
        },
        {
          userId: 'friend-4',
          role: 'member',
          joinedAt: Date.now() - 345600000,
          contributions: 3
        }
      );
    }

    this.studyGroups.set(groupId, studyGroup);
    return studyGroup;
  }

  joinStudyGroup(groupId, userId = this.currentUserId) {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    if (group.members.length >= group.memberLimit) {
      return false;
    }

    const isAlreadyMember = group.members.some(member => member.userId === userId);
    if (isAlreadyMember) return false;

    group.members.push({
      userId,
      role: 'member',
      joinedAt: Date.now(),
      contributions: 0
    });

    return true;
  }

  leaveStudyGroup(groupId, userId = this.currentUserId) {
    const group = this.studyGroups.get(groupId);
    if (!group) return false;

    group.members = group.members.filter(member => member.userId !== userId);
    return true;
  }

  getStudyGroups() {
    return Array.from(this.studyGroups.values());
  }

  getUserStudyGroups(userId = this.currentUserId) {
    return Array.from(this.studyGroups.values())
      .filter(group => group.members.some(member => member.userId === userId));
  }

  // Social Feed
  generateSocialFeed(userId = this.currentUserId) {
    const friends = this.getFriends();
    const feed = [];

    friends.forEach(friend => {
      friend.recentActivity.forEach(activity => {
        feed.push({
          id: `feed-${friend.id}-${activity.timestamp}`,
          userId: friend.id,
          userName: friend.name,
          userAvatar: friend.avatar,
          userLevel: friend.level,
          type: activity.type,
          content: activity.content,
          timestamp: activity.timestamp,
          likes: Math.floor(Math.random() * 10),
          comments: Math.floor(Math.random() * 5)
        });
      });
    });

    // Add some current user activities
    feed.push(
      {
        id: `feed-current-${Date.now()}`,
        userId: this.currentUserId,
        userName: 'You',
        userAvatar: '🎯',
        userLevel: 8,
        type: 'achievement',
        content: 'Unlocked Consistency Builder!',
        timestamp: Date.now() - 1800000,
        likes: 7,
        comments: 3
      },
      {
        id: `feed-current-${Date.now() - 1}`,
        userId: this.currentUserId,
        userName: 'You',
        userAvatar: '🎯',
        userLevel: 8,
        type: 'study_session',
        content: 'Completed 15 exercises in a row!',
        timestamp: Date.now() - 3600000,
        likes: 12,
        comments: 2
      }
    );

    // Sort by timestamp (newest first)
    feed.sort((a, b) => b.timestamp - a.timestamp);

    return feed.slice(0, 20); // Return top 20 items
  }

  // Study buddy matching
  findStudyBuddies(preferences = {}) {
    const allUsers = [
      { id: 'user-match-1', name: 'Lisa Park', avatar: '👩‍🎓', level: 8, subjects: ['Math', 'Science'], timezone: 'EST', score: 85 },
      { id: 'user-match-2', name: 'Tom Anderson', avatar: '👨‍💼', level: 9, subjects: ['History', 'Literature'], timezone: 'PST', score: 92 },
      { id: 'user-match-3', name: 'Nina Popov', avatar: '👩‍💻', level: 7, subjects: ['Programming', 'Math'], timezone: 'GMT', score: 78 },
      { id: 'user-match-4', name: 'Carlos Lima', avatar: '👨‍🔬', level: 10, subjects: ['Science', 'Math'], timezone: 'EST', score: 88 }
    ];

    // Simple matching algorithm based on preferences
    return allUsers
      .filter(user => {
        // Filter out existing friends
        return !this.friends.has(user.id);
      })
      .map(user => ({
        ...user,
        compatibility: Math.floor(Math.random() * 40 + 60) // 60-100% compatibility
      }))
      .sort((a, b) => b.compatibility - a.compatibility);
  }

  // Collaborative challenges
  createCollaborativeChallenge(config) {
    return {
      id: `collab-${Date.now()}`,
      name: config.name,
      description: config.description,
      type: 'collaborative',
      participants: config.participants || [],
      goal: config.goal,
      reward: config.reward,
      deadline: config.deadline,
      progress: 0,
      status: 'active'
    };
  }
}

// Initialize and export singleton instance
export const friendSystem = new FriendSystem();
