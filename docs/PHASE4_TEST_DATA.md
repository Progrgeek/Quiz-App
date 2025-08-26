# 🎮 Phase 4 Test Data: Gamification & Social Features Testing

**Purpose:** Comprehensive JSON test data for all Phase 4 gamification and social features

---

## 📊 **GAMIFICATION TEST DATA**

### **1. User Profiles & Progress**

**File:** `src/test-data/gamification/userProfiles.json`
```json
{
  "testUsers": [
    {
      "id": "user_001",
      "username": "EagerLearner",
      "avatar": "🎓",
      "level": 15,
      "xp": 14750,
      "streak": 12,
      "bestStreak": 25,
      "totalXPEarned": 18200,
      "joinDate": "2024-01-15",
      "lastActivity": "2024-02-20T10:30:00Z",
      "preferences": {
        "soundEnabled": true,
        "animationsEnabled": true,
        "competitiveMode": true,
        "studyReminders": true
      },
      "achievements": [
        "first_perfect",
        "streak_5",
        "streak_10",
        "xp_1000",
        "xp_5000",
        "xp_10000",
        "exercise_master_mc",
        "speed_demon"
      ],
      "statistics": {
        "exercisesCompleted": 234,
        "perfectScores": 89,
        "averageScore": 87.3,
        "totalTimeSpent": 18900,
        "favoriteExerciseType": "multiple-choice"
      }
    },
    {
      "id": "user_002", 
      "username": "ConsistentStudy",
      "avatar": "📚",
      "level": 8,
      "xp": 7230,
      "streak": 45,
      "bestStreak": 45,
      "totalXPEarned": 8100,
      "joinDate": "2024-01-20",
      "lastActivity": "2024-02-20T09:15:00Z",
      "preferences": {
        "soundEnabled": false,
        "animationsEnabled": true,
        "competitiveMode": false,
        "studyReminders": true
      },
      "achievements": [
        "first_perfect",
        "streak_5",
        "streak_10",
        "streak_30",
        "steady_progress",
        "xp_5000"
      ],
      "statistics": {
        "exercisesCompleted": 156,
        "perfectScores": 67,
        "averageScore": 91.2,
        "totalTimeSpent": 12400,
        "favoriteExerciseType": "fill-in-blanks"
      }
    },
    {
      "id": "user_003",
      "username": "QuickLearner",
      "avatar": "⚡",
      "level": 22,
      "xp": 21890,
      "streak": 8,
      "bestStreak": 18,
      "totalXPEarned": 25600,
      "joinDate": "2024-01-10",
      "lastActivity": "2024-02-20T11:45:00Z",
      "preferences": {
        "soundEnabled": true,
        "animationsEnabled": true,
        "competitiveMode": true,
        "studyReminders": false
      },
      "achievements": [
        "first_perfect",
        "streak_5",
        "streak_10",
        "xp_1000",
        "xp_5000",
        "xp_10000",
        "xp_20000",
        "speed_demon",
        "perfectionist",
        "exercise_variety"
      ],
      "statistics": {
        "exercisesCompleted": 412,
        "perfectScores": 198,
        "averageScore": 93.1,
        "totalTimeSpent": 15200,
        "favoriteExerciseType": "drag-and-drop"
      }
    }
  ]
}
```

### **2. Achievement System Data**

**File:** `src/test-data/gamification/achievements.json`
```json
{
  "categories": [
    {
      "id": "progress",
      "name": "Progress Milestones",
      "icon": "📈",
      "color": "blue",
      "achievements": [
        {
          "id": "first_perfect",
          "name": "Perfect Score!",
          "description": "Get your first perfect score",
          "icon": "🎯",
          "xpReward": 100,
          "rarity": "common",
          "unlockCondition": {
            "type": "score",
            "value": 100,
            "count": 1
          }
        },
        {
          "id": "xp_1000",
          "name": "Rising Star",
          "description": "Earn 1000 XP",
          "icon": "⭐",
          "xpReward": 200,
          "rarity": "common",
          "unlockCondition": {
            "type": "totalXP",
            "value": 1000
          }
        },
        {
          "id": "xp_5000",
          "name": "Dedicated Learner",
          "description": "Earn 5000 XP",
          "icon": "🌟",
          "xpReward": 500,
          "rarity": "uncommon",
          "unlockCondition": {
            "type": "totalXP",
            "value": 5000
          }
        },
        {
          "id": "xp_10000",
          "name": "Knowledge Seeker",
          "description": "Earn 10000 XP",
          "icon": "✨",
          "xpReward": 1000,
          "rarity": "rare",
          "unlockCondition": {
            "type": "totalXP",
            "value": 10000
          }
        },
        {
          "id": "xp_20000",
          "name": "Master Student",
          "description": "Earn 20000 XP",
          "icon": "💎",
          "xpReward": 2000,
          "rarity": "legendary",
          "unlockCondition": {
            "type": "totalXP",
            "value": 20000
          }
        }
      ]
    },
    {
      "id": "consistency",
      "name": "Consistency & Streaks",
      "icon": "🔥",
      "color": "orange",
      "achievements": [
        {
          "id": "streak_5",
          "name": "On Fire!",
          "description": "Maintain a 5-day streak",
          "icon": "🔥",
          "xpReward": 250,
          "rarity": "common",
          "unlockCondition": {
            "type": "streak",
            "value": 5
          }
        },
        {
          "id": "streak_10",
          "name": "Burning Bright!",
          "description": "Maintain a 10-day streak",
          "icon": "🔥🔥",
          "xpReward": 500,
          "rarity": "uncommon",
          "unlockCondition": {
            "type": "streak",
            "value": 10
          }
        },
        {
          "id": "streak_30",
          "name": "Unstoppable Force!",
          "description": "Maintain a 30-day streak",
          "icon": "🔥🔥🔥",
          "xpReward": 1500,
          "rarity": "rare",
          "unlockCondition": {
            "type": "streak",
            "value": 30
          }
        },
        {
          "id": "steady_progress",
          "name": "Steady Progress",
          "description": "Complete exercises for 7 consecutive days",
          "icon": "📅",
          "xpReward": 300,
          "rarity": "common",
          "unlockCondition": {
            "type": "consecutiveDays",
            "value": 7
          }
        }
      ]
    },
    {
      "id": "mastery",
      "name": "Skill Mastery",
      "icon": "🎓",
      "color": "purple",
      "achievements": [
        {
          "id": "exercise_master_mc",
          "name": "Multiple Choice Master",
          "description": "Complete 50 multiple choice exercises",
          "icon": "🎯",
          "xpReward": 400,
          "rarity": "uncommon",
          "unlockCondition": {
            "type": "exerciseTypeCount",
            "exerciseType": "multiple-choice",
            "value": 50
          }
        },
        {
          "id": "exercise_master_fill",
          "name": "Fill Master",
          "description": "Complete 50 fill-in-the-blank exercises",
          "icon": "✏️",
          "xpReward": 400,
          "rarity": "uncommon",
          "unlockCondition": {
            "type": "exerciseTypeCount",
            "exerciseType": "fill-in-blanks",
            "value": 50
          }
        },
        {
          "id": "perfectionist",
          "name": "Perfectionist",
          "description": "Get 100 perfect scores",
          "icon": "💯",
          "xpReward": 1000,
          "rarity": "rare",
          "unlockCondition": {
            "type": "perfectScores",
            "value": 100
          }
        },
        {
          "id": "speed_demon",
          "name": "Speed Demon",
          "description": "Complete an exercise in under 10 seconds",
          "icon": "⚡",
          "xpReward": 300,
          "rarity": "uncommon",
          "unlockCondition": {
            "type": "fastCompletion",
            "value": 10
          }
        },
        {
          "id": "exercise_variety",
          "name": "Variety Seeker",
          "description": "Complete at least 10 exercises of each type",
          "icon": "🌈",
          "xpReward": 600,
          "rarity": "rare",
          "unlockCondition": {
            "type": "exerciseVariety",
            "typesRequired": ["multiple-choice", "fill-in-blanks", "drag-and-drop", "sequencing"],
            "minPerType": 10
          }
        }
      ]
    }
  ]
}
```

### **3. Leaderboard Test Data**

**File:** `src/test-data/gamification/leaderboards.json`
```json
{
  "globalLeaderboard": {
    "lastUpdated": "2024-02-20T12:00:00Z",
    "season": "Winter 2024",
    "rankings": [
      {
        "rank": 1,
        "userId": "user_003",
        "username": "QuickLearner",
        "avatar": "⚡",
        "level": 22,
        "xp": 21890,
        "weeklyXP": 1250,
        "change": "+2",
        "badge": "🏆"
      },
      {
        "rank": 2,
        "userId": "user_001",
        "username": "EagerLearner", 
        "avatar": "🎓",
        "level": 15,
        "xp": 14750,
        "weeklyXP": 890,
        "change": "-1",
        "badge": "🥈"
      },
      {
        "rank": 3,
        "userId": "user_002",
        "username": "ConsistentStudy",
        "avatar": "📚",
        "level": 8,
        "xp": 7230,
        "weeklyXP": 1100,
        "change": "+3",
        "badge": "🥉"
      },
      {
        "rank": 4,
        "userId": "user_004",
        "username": "StudyBuddy",
        "avatar": "🤝",
        "level": 12,
        "xp": 11200,
        "weeklyXP": 450,
        "change": "-2",
        "badge": null
      },
      {
        "rank": 5,
        "userId": "user_005",
        "username": "NightOwl",
        "avatar": "🦉",
        "level": 9,
        "xp": 8900,
        "weeklyXP": 670,
        "change": "0",
        "badge": null
      }
    ]
  },
  "weeklyLeaderboard": {
    "week": "2024-W08",
    "startDate": "2024-02-19",
    "endDate": "2024-02-25",
    "rankings": [
      {
        "rank": 1,
        "userId": "user_003",
        "username": "QuickLearner",
        "weeklyXP": 1250,
        "exercisesCompleted": 23,
        "perfectScores": 18,
        "averageScore": 94.2
      },
      {
        "rank": 2,
        "userId": "user_002",
        "username": "ConsistentStudy",
        "weeklyXP": 1100,
        "exercisesCompleted": 18,
        "perfectScores": 16,
        "averageScore": 96.1
      },
      {
        "rank": 3,
        "userId": "user_001",
        "username": "EagerLearner",
        "weeklyXP": 890,
        "exercisesCompleted": 19,
        "perfectScores": 12,
        "averageScore": 89.7
      }
    ]
  },
  "friendsLeaderboard": {
    "currentUser": "user_001",
    "friends": [
      {
        "rank": 1,
        "userId": "user_002",
        "username": "ConsistentStudy",
        "relationship": "friend",
        "level": 8,
        "weeklyXP": 1100,
        "status": "online"
      },
      {
        "rank": 2,
        "userId": "user_001",
        "username": "EagerLearner",
        "relationship": "self",
        "level": 15,
        "weeklyXP": 890,
        "status": "online"
      },
      {
        "rank": 3,
        "userId": "user_004",
        "username": "StudyBuddy",
        "relationship": "friend",
        "level": 12,
        "weeklyXP": 450,
        "status": "offline"
      }
    ]
  }
}
```

---

## 🤝 **SOCIAL FEATURES TEST DATA**

### **4. Social Interactions**

**File:** `src/test-data/social/interactions.json`
```json
{
  "friendRequests": [
    {
      "id": "req_001",
      "fromUserId": "user_006",
      "fromUsername": "NewLearner",
      "fromAvatar": "🌱",
      "toUserId": "user_001",
      "message": "Hey! I saw you on the leaderboard. Want to study together?",
      "timestamp": "2024-02-20T09:30:00Z",
      "status": "pending"
    },
    {
      "id": "req_002",
      "fromUserId": "user_007",
      "fromUsername": "QuizMaster",
      "fromAvatar": "🧠",
      "toUserId": "user_001",
      "message": "Let's be study partners!",
      "timestamp": "2024-02-19T15:20:00Z",
      "status": "pending"
    }
  ],
  "studyGroups": [
    {
      "id": "group_001",
      "name": "Morning Learners",
      "description": "Early birds who love learning before 10 AM",
      "avatar": "🌅",
      "members": [
        {
          "userId": "user_001",
          "username": "EagerLearner",
          "role": "admin",
          "joinDate": "2024-02-15",
          "status": "online"
        },
        {
          "userId": "user_002",
          "username": "ConsistentStudy", 
          "role": "member",
          "joinDate": "2024-02-16",
          "status": "online"
        },
        {
          "userId": "user_005",
          "username": "NightOwl",
          "role": "member",
          "joinDate": "2024-02-18",
          "status": "offline"
        }
      ],
      "stats": {
        "totalXP": 4580,
        "averageLevel": 10.7,
        "weeklyGoal": 5000,
        "weeklyProgress": 3240
      },
      "recentActivity": [
        {
          "userId": "user_002",
          "action": "completed_exercise",
          "exerciseType": "multiple-choice",
          "xpGained": 150,
          "timestamp": "2024-02-20T08:45:00Z"
        },
        {
          "userId": "user_001",
          "action": "achievement_unlocked",
          "achievement": "streak_5",
          "timestamp": "2024-02-20T07:30:00Z"
        }
      ]
    },
    {
      "id": "group_002",
      "name": "Speed Runners",
      "description": "For those who love completing exercises quickly!",
      "avatar": "🏃‍♀️",
      "members": [
        {
          "userId": "user_003",
          "username": "QuickLearner",
          "role": "admin",
          "joinDate": "2024-02-10",
          "status": "online"
        },
        {
          "userId": "user_001",
          "username": "EagerLearner",
          "role": "member",
          "joinDate": "2024-02-12",
          "status": "online"
        }
      ],
      "stats": {
        "totalXP": 8920,
        "averageLevel": 18.5,
        "weeklyGoal": 3000,
        "weeklyProgress": 2100
      }
    }
  ],
  "challenges": [
    {
      "id": "challenge_001",
      "title": "Perfect Week Challenge",
      "description": "Get perfect scores on all exercises for a week",
      "type": "group",
      "groupId": "group_001",
      "startDate": "2024-02-19",
      "endDate": "2024-02-25",
      "reward": {
        "xp": 1000,
        "badge": "Perfect Week",
        "icon": "💯"
      },
      "participants": [
        {
          "userId": "user_001",
          "progress": 5,
          "target": 7,
          "completed": false
        },
        {
          "userId": "user_002",
          "progress": 7,
          "target": 7,
          "completed": true
        }
      ],
      "status": "active"
    },
    {
      "id": "challenge_002",
      "title": "Speed Master",
      "description": "Complete 20 exercises in under 30 seconds each",
      "type": "individual",
      "startDate": "2024-02-18",
      "endDate": "2024-02-24",
      "reward": {
        "xp": 500,
        "badge": "Speed Master",
        "icon": "⚡"
      },
      "participants": [
        {
          "userId": "user_003",
          "progress": 15,
          "target": 20,
          "completed": false
        }
      ],
      "status": "active"
    }
  ]
}
```

### **5. Messages & Notifications**

**File:** `src/test-data/social/messages.json`
```json
{
  "conversations": [
    {
      "id": "conv_001",
      "type": "direct",
      "participants": ["user_001", "user_002"],
      "lastMessage": {
        "id": "msg_005",
        "senderId": "user_002",
        "content": "Great job on that streak! 🔥",
        "timestamp": "2024-02-20T10:15:00Z",
        "type": "text"
      },
      "unreadCount": 0,
      "messages": [
        {
          "id": "msg_001",
          "senderId": "user_001",
          "content": "Hey! Want to do some exercises together?",
          "timestamp": "2024-02-20T09:00:00Z",
          "type": "text",
          "readBy": ["user_001", "user_002"]
        },
        {
          "id": "msg_002",
          "senderId": "user_002",
          "content": "Sure! I'm working on fill-in-the-blanks today",
          "timestamp": "2024-02-20T09:02:00Z",
          "type": "text",
          "readBy": ["user_001", "user_002"]
        },
        {
          "id": "msg_003",
          "senderId": "user_001",
          "content": "Perfect! I need practice with those too",
          "timestamp": "2024-02-20T09:05:00Z",
          "type": "text",
          "readBy": ["user_001", "user_002"]
        },
        {
          "id": "msg_004",
          "senderId": "user_002",
          "content": "I just completed one and got 95%! 🎉",
          "timestamp": "2024-02-20T10:00:00Z",
          "type": "achievement",
          "metadata": {
            "exerciseType": "fill-in-blanks",
            "score": 95,
            "xpGained": 180
          },
          "readBy": ["user_001", "user_002"]
        },
        {
          "id": "msg_005",
          "senderId": "user_002",
          "content": "Great job on that streak! 🔥",
          "timestamp": "2024-02-20T10:15:00Z",
          "type": "text",
          "readBy": ["user_001", "user_002"]
        }
      ]
    },
    {
      "id": "conv_002",
      "type": "group",
      "groupId": "group_001",
      "participants": ["user_001", "user_002", "user_005"],
      "lastMessage": {
        "id": "msg_010",
        "senderId": "user_001",
        "content": "Let's aim for our weekly goal! Only 1760 XP to go 💪",
        "timestamp": "2024-02-20T11:00:00Z",
        "type": "text"
      },
      "unreadCount": 1,
      "messages": [
        {
          "id": "msg_008",
          "senderId": "user_002",
          "content": "Good morning everyone! Ready for another productive day? ☀️",
          "timestamp": "2024-02-20T07:30:00Z",
          "type": "text",
          "readBy": ["user_001", "user_002"]
        },
        {
          "id": "msg_009",
          "senderId": "user_001",
          "content": "Absolutely! I just unlocked the 5-day streak achievement 🎯",
          "timestamp": "2024-02-20T08:15:00Z",
          "type": "achievement",
          "metadata": {
            "achievementId": "streak_5",
            "achievementName": "On Fire!",
            "xpGained": 250
          },
          "readBy": ["user_001", "user_002"]
        },
        {
          "id": "msg_010",
          "senderId": "user_001",
          "content": "Let's aim for our weekly goal! Only 1760 XP to go 💪",
          "timestamp": "2024-02-20T11:00:00Z",
          "type": "text",
          "readBy": ["user_001"]
        }
      ]
    }
  ],
  "notifications": [
    {
      "id": "notif_001",
      "type": "friend_request",
      "title": "New Friend Request",
      "message": "NewLearner wants to be your friend",
      "timestamp": "2024-02-20T09:30:00Z",
      "read": false,
      "actionUrl": "/social/friends",
      "metadata": {
        "fromUserId": "user_006",
        "requestId": "req_001"
      }
    },
    {
      "id": "notif_002", 
      "type": "achievement",
      "title": "Achievement Unlocked!",
      "message": "You earned 'On Fire!' for your 5-day streak",
      "timestamp": "2024-02-20T08:15:00Z",
      "read": true,
      "actionUrl": "/profile/achievements",
      "metadata": {
        "achievementId": "streak_5",
        "xpGained": 250
      }
    },
    {
      "id": "notif_003",
      "type": "challenge_complete",
      "title": "Challenge Completed!",
      "message": "ConsistentStudy completed the Perfect Week Challenge",
      "timestamp": "2024-02-20T07:00:00Z",
      "read": false,
      "actionUrl": "/social/challenges",
      "metadata": {
        "challengeId": "challenge_001",
        "completerId": "user_002"
      }
    },
    {
      "id": "notif_004",
      "type": "group_activity",
      "title": "Group Activity",
      "message": "Morning Learners is 65% towards weekly goal!",
      "timestamp": "2024-02-20T06:00:00Z",
      "read": true,
      "actionUrl": "/social/groups/group_001",
      "metadata": {
        "groupId": "group_001",
        "progress": 3240,
        "goal": 5000
      }
    },
    {
      "id": "notif_005",
      "type": "leaderboard",
      "title": "Leaderboard Update",
      "message": "You moved up 2 positions to rank #2!",
      "timestamp": "2024-02-19T23:59:00Z",
      "read": true,
      "actionUrl": "/leaderboard",
      "metadata": {
        "previousRank": 4,
        "currentRank": 2,
        "change": "+2"
      }
    }
  ]
}
```

---

## 🎲 **EXERCISE GAMIFICATION DATA**

### **6. Enhanced Exercise Data**

**File:** `src/test-data/exercises/gamifiedExercises.json`
```json
{
  "multipleChoice": [
    {
      "id": "mc_gam_001",
      "question": "What is the capital of France?",
      "options": ["London", "Berlin", "Paris", "Madrid"],
      "correctAnswer": 2,
      "difficulty": 2,
      "category": "Geography",
      "tags": ["capitals", "europe", "basic"],
      "timeLimit": 30,
      "hints": [
        "It's known as the City of Light",
        "Home to the Eiffel Tower",
        "This city is famous for its art museums"
      ],
      "explanation": "Paris is the capital and largest city of France, known for its art, fashion, gastronomy, and culture.",
      "gamification": {
        "baseXP": 50,
        "perfectBonus": 25,
        "speedBonus": {
          "under10s": 50,
          "under20s": 25,
          "under30s": 10
        },
        "confidenceReward": {
          "high_correct": 20,
          "low_correct": 30
        },
        "streakMultiplier": true
      },
      "analytics": {
        "averageTime": 15.3,
        "successRate": 87.2,
        "commonMistakes": [
          {
            "answer": 0,
            "count": 45,
            "reason": "London confusion"
          }
        ]
      }
    },
    {
      "id": "mc_gam_002",
      "question": "Which programming language is known for its use in web development?",
      "options": ["Python", "JavaScript", "C++", "Assembly"],
      "correctAnswer": 1,
      "difficulty": 3,
      "category": "Technology",
      "tags": ["programming", "web", "languages"],
      "timeLimit": 45,
      "hints": [
        "It runs in web browsers",
        "Originally created in 10 days",
        "Name includes 'Script'"
      ],
      "explanation": "JavaScript is a programming language that is one of the core technologies of the World Wide Web, alongside HTML and CSS.",
      "gamification": {
        "baseXP": 75,
        "perfectBonus": 35,
        "speedBonus": {
          "under15s": 75,
          "under30s": 40,
          "under45s": 15
        },
        "confidenceReward": {
          "high_correct": 30,
          "low_correct": 45
        },
        "streakMultiplier": true
      },
      "analytics": {
        "averageTime": 28.7,
        "successRate": 72.1,
        "commonMistakes": [
          {
            "answer": 0,
            "count": 67,
            "reason": "Python popularity confusion"
          }
        ]
      }
    }
  ],
  "fillInBlanks": [
    {
      "id": "fib_gam_001",
      "text": "The [BLANK_0] is the largest planet in our [BLANK_1], and it has [BLANK_2] major moons.",
      "blanks": [
        {
          "index": 0,
          "correctAnswer": "Jupiter",
          "alternatives": ["jupiter"],
          "hint": "Named after the Roman king of gods"
        },
        {
          "index": 1,
          "correctAnswer": "solar system",
          "alternatives": ["Solar System", "solar-system"],
          "hint": "The collection of planets orbiting our sun"
        },
        {
          "index": 2,
          "correctAnswer": "four",
          "alternatives": ["4", "Four"],
          "hint": "The number between three and five"
        }
      ],
      "difficulty": 4,
      "category": "Science",
      "tags": ["astronomy", "planets", "solar-system"],
      "timeLimit": 120,
      "gamification": {
        "baseXP": 100,
        "perfectBonus": 50,
        "noHintBonus": 30,
        "speedBonus": {
          "under60s": 100,
          "under90s": 50,
          "under120s": 20
        },
        "typingSpeedReward": {
          "over40wpm": 25,
          "over60wpm": 50
        }
      },
      "analytics": {
        "averageTime": 78.5,
        "successRate": 68.9,
        "blankDifficulty": [
          { "index": 0, "successRate": 89.2 },
          { "index": 1, "successRate": 76.1 },
          { "index": 2, "successRate": 45.7 }
        ]
      }
    }
  ],
  "dragAndDrop": [
    {
      "id": "dad_gam_001",
      "question": "Arrange these historical events in chronological order:",
      "items": [
        {
          "id": "item_1",
          "content": "World War II ends",
          "correctPosition": 3
        },
        {
          "id": "item_2", 
          "content": "Moon landing",
          "correctPosition": 4
        },
        {
          "id": "item_3",
          "content": "World War I begins",
          "correctPosition": 1
        },
        {
          "id": "item_4",
          "content": "Berlin Wall falls",
          "correctPosition": 5
        },
        {
          "id": "item_5",
          "content": "Great Depression starts",
          "correctPosition": 2
        }
      ],
      "difficulty": 5,
      "category": "History",
      "tags": ["chronology", "20th-century", "events"],
      "timeLimit": 180,
      "gamification": {
        "baseXP": 150,
        "perfectBonus": 75,
        "partialCredit": true,
        "speedBonus": {
          "under90s": 150,
          "under120s": 100,
          "under180s": 50
        },
        "efficientMovesBonus": {
          "under10moves": 50,
          "under15moves": 25
        }
      },
      "analytics": {
        "averageTime": 142.3,
        "successRate": 54.2,
        "commonErrors": [
          {
            "description": "Confusing WWI and WWII order",
            "frequency": 23.1
          }
        ]
      }
    }
  ]
}
```

---

## 🏆 **TESTING SCENARIOS**

### **7. Test Scenarios Definition**

**File:** `src/test-data/scenarios/testScenarios.json`
```json
{
  "userJourneys": [
    {
      "id": "new_user_onboarding",
      "name": "New User Gamification Onboarding",
      "description": "Complete journey from signup to first achievements",
      "steps": [
        {
          "step": 1,
          "action": "Create account",
          "expectedResult": "User profile initialized with level 1, 0 XP"
        },
        {
          "step": 2,
          "action": "Complete first exercise (MC)",
          "expectedResult": "Gain 50 XP, unlock 'First Perfect' achievement"
        },
        {
          "step": 3,
          "action": "Complete second exercise",
          "expectedResult": "Gain additional XP, start building streak"
        },
        {
          "step": 4,
          "action": "Return next day",
          "expectedResult": "Maintain streak, get daily bonus"
        },
        {
          "step": 5,
          "action": "Reach 1000 XP",
          "expectedResult": "Level up to 2, unlock 'Rising Star' achievement"
        }
      ],
      "dataFiles": [
        "userProfiles.json",
        "achievements.json",
        "gamifiedExercises.json"
      ]
    },
    {
      "id": "social_interaction_flow",
      "name": "Social Features Integration",
      "description": "Test friend requests, groups, and challenges",
      "steps": [
        {
          "step": 1,
          "action": "Send friend request",
          "expectedResult": "Request appears in recipient's notifications"
        },
        {
          "step": 2,
          "action": "Accept friend request",
          "expectedResult": "Users added to each other's friend lists"
        },
        {
          "step": 3,
          "action": "Create study group",
          "expectedResult": "Group created with admin privileges"
        },
        {
          "step": 4,
          "action": "Invite friends to group",
          "expectedResult": "Invitations sent and received"
        },
        {
          "step": 5,
          "action": "Start group challenge",
          "expectedResult": "Challenge active for all members"
        },
        {
          "step": 6,
          "action": "Complete challenge",
          "expectedResult": "Rewards distributed, notifications sent"
        }
      ],
      "dataFiles": [
        "interactions.json",
        "messages.json",
        "leaderboards.json"
      ]
    },
    {
      "id": "advanced_gamification",
      "name": "Advanced Gamification Features",
      "description": "Test complex achievement chains and multipliers",
      "steps": [
        {
          "step": 1,
          "action": "Build 5-day streak",
          "expectedResult": "Unlock 'On Fire!' achievement"
        },
        {
          "step": 2,
          "action": "Complete with high confidence",
          "expectedResult": "Bonus XP for confidence accuracy"
        },
        {
          "step": 3,
          "action": "Speed completion",
          "expectedResult": "Speed bonus multipliers applied"
        },
        {
          "step": 4,
          "action": "Chain perfect scores",
          "expectedResult": "Progressive XP multipliers"
        },
        {
          "step": 5,
          "action": "Reach leaderboard top 10",
          "expectedResult": "Special recognition and bonus rewards"
        }
      ],
      "dataFiles": [
        "achievements.json",
        "leaderboards.json",
        "gamifiedExercises.json"
      ]
    }
  ],
  "performanceTests": [
    {
      "name": "Real-time Updates",
      "description": "Test live leaderboard and notification updates",
      "targets": [
        "Sub-100ms leaderboard updates",
        "Instant notification delivery",
        "Smooth XP animations"
      ]
    },
    {
      "name": "Data Persistence",
      "description": "Test data saving and loading",
      "targets": [
        "Progress saved on exercise completion",
        "Achievements persist across sessions",
        "Social data synchronized"
      ]
    }
  ]
}
```

This comprehensive test data structure provides everything needed to test all Phase 4 gamification and social features dynamically using JSON files, exactly as requested! 🎮
