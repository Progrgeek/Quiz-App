import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Leaderboard System - Core functionality
export class LeaderboardSystem {
  constructor() {
    this.leaderboards = {
      global: { users: [], lastUpdated: null },
      friends: { users: [], lastUpdated: null },
      local: { users: [], lastUpdated: null },
      weekly: { users: [], lastUpdated: null },
      monthly: { users: [], lastUpdated: null }
    };
    
    this.competitiveEvents = new Map();
    this.tournaments = new Map();
    this.challenges = new Map();
  }

  // Generate sample leaderboard data
  generateLeaderboardData() {
    const sampleUsers = [
      { id: 'user-1', name: 'Alex Chen', avatar: '👨‍💻', level: 15, xp: 18750, streak: 45, achievements: 23, country: 'US' },
      { id: 'user-2', name: 'Maria Rodriguez', avatar: '👩‍🎓', level: 14, xp: 17200, streak: 38, achievements: 21, country: 'ES' },
      { id: 'user-3', name: 'Yuki Tanaka', avatar: '👨‍🔬', level: 13, xp: 16100, streak: 52, achievements: 19, country: 'JP' },
      { id: 'user-4', name: 'Emma Johnson', avatar: '👩‍💼', level: 12, xp: 15300, streak: 29, achievements: 18, country: 'CA' },
      { id: 'user-5', name: 'current-user', name: 'You', avatar: '🎯', level: 8, xp: 8500, streak: 12, achievements: 12, country: 'US' },
      { id: 'user-6', name: 'David Kim', avatar: '👨‍🎨', level: 11, xp: 14200, streak: 33, achievements: 17, country: 'KR' },
      { id: 'user-7', name: 'Sophie Dubois', avatar: '👩‍🔬', level: 10, xp: 13100, streak: 41, achievements: 16, country: 'FR' },
      { id: 'user-8', name: 'Lucas Silva', avatar: '👨‍🚀', level: 9, xp: 11800, streak: 27, achievements: 14, country: 'BR' },
      { id: 'user-9', name: 'Priya Patel', avatar: '👩‍💻', level: 7, xp: 7900, streak: 19, achievements: 11, country: 'IN' },
      { id: 'user-10', name: 'Ahmad Hassan', avatar: '👨‍🏫', level: 6, xp: 6500, streak: 15, achievements: 9, country: 'EG' }
    ];

    // Sort by XP for global leaderboard
    const globalRanking = [...sampleUsers].sort((a, b) => b.xp - a.xp);
    
    // Generate friends leaderboard (subset of users)
    const friendsRanking = globalRanking.filter((_, index) => index < 6);
    
    // Generate weekly rankings with some variation
    const weeklyRanking = [...sampleUsers]
      .map(user => ({ ...user, weeklyXP: Math.floor(user.xp * 0.1 + Math.random() * 500) }))
      .sort((a, b) => b.weeklyXP - a.weeklyXP);

    this.leaderboards.global.users = globalRanking;
    this.leaderboards.friends.users = friendsRanking;
    this.leaderboards.local.users = globalRanking.filter(user => user.country === 'US');
    this.leaderboards.weekly.users = weeklyRanking;
    this.leaderboards.monthly.users = globalRanking;

    // Set last updated timestamps
    const now = Date.now();
    Object.keys(this.leaderboards).forEach(key => {
      this.leaderboards[key].lastUpdated = now;
    });
  }

  getLeaderboard(type = 'global', limit = 10) {
    if (!this.leaderboards[type]) {
      throw new Error(`Invalid leaderboard type: ${type}`);
    }

    return {
      ...this.leaderboards[type],
      users: this.leaderboards[type].users.slice(0, limit)
    };
  }

  getUserRank(userId, type = 'global') {
    const leaderboard = this.leaderboards[type];
    if (!leaderboard) return null;

    const rank = leaderboard.users.findIndex(user => user.id === userId);
    return rank === -1 ? null : rank + 1;
  }

  // Tournament System
  createTournament(config) {
    const tournament = {
      id: `tournament-${Date.now()}`,
      name: config.name,
      description: config.description,
      type: config.type || 'bracket', // bracket, points, survival
      startDate: config.startDate,
      endDate: config.endDate,
      maxParticipants: config.maxParticipants || 64,
      participants: [],
      prizes: config.prizes || [],
      status: 'upcoming', // upcoming, active, completed
      rounds: [],
      settings: config.settings || {}
    };

    this.tournaments.set(tournament.id, tournament);
    return tournament;
  }

  joinTournament(tournamentId, userId) {
    const tournament = this.tournaments.get(tournamentId);
    if (!tournament) return false;

    if (tournament.participants.length >= tournament.maxParticipants) {
      return false;
    }

    tournament.participants.push({
      userId,
      joinedAt: Date.now(),
      score: 0,
      status: 'active'
    });

    return true;
  }

  // Challenge System
  createChallenge(config) {
    const challenge = {
      id: `challenge-${Date.now()}`,
      name: config.name,
      description: config.description,
      type: config.type, // daily, weekly, monthly, custom
      goal: config.goal,
      reward: config.reward,
      participants: [],
      startDate: config.startDate,
      endDate: config.endDate,
      status: 'active'
    };

    this.challenges.set(challenge.id, challenge);
    return challenge;
  }

  joinChallenge(challengeId, userId) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return false;

    challenge.participants.push({
      userId,
      progress: 0,
      joinedAt: Date.now()
    });

    return true;
  }

  updateChallengeProgress(challengeId, userId, progress) {
    const challenge = this.challenges.get(challengeId);
    if (!challenge) return false;

    const participant = challenge.participants.find(p => p.userId === userId);
    if (participant) {
      participant.progress = Math.max(participant.progress, progress);
      return true;
    }

    return false;
  }

  // Generate sample tournaments and challenges
  generateSampleCompetitions() {
    // Sample tournaments
    this.createTournament({
      name: "Winter Learning Championship",
      description: "Compete in the ultimate knowledge showdown!",
      type: "bracket",
      startDate: Date.now() + 86400000, // Tomorrow
      endDate: Date.now() + 604800000, // Next week
      maxParticipants: 32,
      prizes: [
        { rank: 1, reward: "🏆 Champion Badge + 5000 XP" },
        { rank: 2, reward: "🥈 Runner-up Badge + 3000 XP" },
        { rank: 3, reward: "🥉 Bronze Badge + 2000 XP" }
      ]
    });

    this.createTournament({
      name: "Speed Learning Sprint",
      description: "How fast can you complete exercises?",
      type: "points",
      startDate: Date.now() - 3600000, // 1 hour ago (active)
      endDate: Date.now() + 3600000, // 1 hour from now
      maxParticipants: 100,
      prizes: [
        { rank: 1, reward: "⚡ Speed Master Badge + 2500 XP" }
      ]
    });

    // Sample challenges
    this.createChallenge({
      name: "7-Day Streak Master",
      description: "Maintain a 7-day learning streak",
      type: "weekly",
      goal: { type: "streak", target: 7 },
      reward: "🔥 Streak Master Badge + 1000 XP",
      startDate: Date.now() - 86400000,
      endDate: Date.now() + 518400000
    });

    this.createChallenge({
      name: "Exercise Marathon",
      description: "Complete 50 exercises this month",
      type: "monthly",
      goal: { type: "exercises", target: 50 },
      reward: "🏃‍♂️ Marathon Badge + 2000 XP",
      startDate: Date.now() - 2592000000,
      endDate: Date.now() + 2592000000
    });

    this.createChallenge({
      name: "Perfect Score Challenge",
      description: "Get 10 perfect scores in a row",
      type: "custom",
      goal: { type: "perfect_scores", target: 10 },
      reward: "💯 Perfectionist Badge + 1500 XP",
      startDate: Date.now() - 86400000,
      endDate: Date.now() + 604800000
    });
  }

  getAllTournaments() {
    return Array.from(this.tournaments.values());
  }

  getAllChallenges() {
    return Array.from(this.challenges.values());
  }

  getActiveChallenges() {
    return Array.from(this.challenges.values())
      .filter(challenge => challenge.status === 'active' && Date.now() < challenge.endDate);
  }

  getUpcomingTournaments() {
    return Array.from(this.tournaments.values())
      .filter(tournament => tournament.status === 'upcoming');
  }

  getActiveTournaments() {
    return Array.from(this.tournaments.values())
      .filter(tournament => tournament.status === 'active');
  }
}

// Initialize and export singleton instance
export const leaderboardSystem = new LeaderboardSystem();

// Generate initial data
leaderboardSystem.generateLeaderboardData();
leaderboardSystem.generateSampleCompetitions();
