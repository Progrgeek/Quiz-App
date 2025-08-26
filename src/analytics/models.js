/**
 * Analytics Data Models
 * Comprehensive data structures for tracking user learning progress and patterns
 */

// User Progress Model
export const UserProgressModel = {
  userId: '',
  totalExercises: 0,
  completedExercises: 0,
  averageScore: 0,
  totalTimeSpent: 0, // seconds
  streakDays: 0,
  skillLevels: {
    reading: { level: 0, xp: 0, exercises: 0 },
    grammar: { level: 0, xp: 0, exercises: 0 },
    vocabulary: { level: 0, xp: 0, exercises: 0 },
    listening: { level: 0, xp: 0, exercises: 0 },
    speaking: { level: 0, xp: 0, exercises: 0 },
    writing: { level: 0, xp: 0, exercises: 0 }
  },
  weakAreas: [],
  strongAreas: [],
  lastActivity: null,
  learningGoals: [],
  achievements: [],
  preferences: {
    preferredDifficulty: 'medium',
    preferredExerciseTypes: [],
    optimalSessionLength: 1800, // 30 minutes
    bestPerformanceTime: null
  },
  statistics: {
    totalSessions: 0,
    averageSessionLength: 0,
    longestStreak: 0,
    bestScore: 0,
    improvementRate: 0
  }
};

// Session Analytics Model
export const SessionDataModel = {
  sessionId: '',
  userId: '',
  startTime: null,
  endTime: null,
  duration: 0, // seconds
  exercisesCompleted: 0,
  exercisesAttempted: 0,
  averageScore: 0,
  totalScore: 0,
  questionsAnswered: 0,
  correctAnswers: 0,
  hintsUsed: 0,
  pauseTime: 0, // seconds paused
  deviceType: 'desktop', // desktop, mobile, tablet
  browserInfo: '',
  location: 'unknown', // home, school, etc.
  exerciseBreakdown: [],
  performanceByType: {},
  engagementMetrics: {
    focusTime: 0,
    distractionEvents: 0,
    pauseCount: 0,
    resumeCount: 0
  }
};

// Exercise Analytics Model
export const ExerciseAnalyticsModel = {
  exerciseId: '',
  userId: '',
  sessionId: '',
  exerciseType: '',
  difficulty: 'medium',
  topic: '',
  subtopic: '',
  startTime: null,
  completionTime: null,
  timeToComplete: 0, // seconds
  score: 0,
  maxScore: 100,
  questionsCount: 0,
  correctAnswers: 0,
  incorrectAnswers: 0,
  skippedQuestions: 0,
  hintsUsed: 0,
  attempts: 1,
  abandoned: false,
  completionRate: 0, // percentage
  questionAnalytics: [],
  difficultyRating: 0, // user-provided feedback
  enjoymentRating: 0, // user-provided feedback
  metadata: {
    platform: 'web',
    version: '1.0.0',
    experimentGroup: null
  }
};

// Question Analytics Model
export const QuestionAnalyticsModel = {
  questionId: '',
  exerciseId: '',
  userId: '',
  questionType: '',
  topic: '',
  difficulty: 'medium',
  timeToAnswer: 0, // seconds
  correct: false,
  attempts: 1,
  hintsUsed: 0,
  hintsAvailable: 0,
  userAnswer: null,
  correctAnswer: null,
  confidence: 0, // user-provided confidence level
  timestamp: null,
  responsePattern: [], // tracking user interaction patterns
  metadata: {
    position: 0, // question position in exercise
    timeOfDay: 0, // hour of day (0-23)
    dayOfWeek: 0 // day of week (0-6)
  }
};

// Learning Goal Model
export const LearningGoalModel = {
  goalId: '',
  userId: '',
  goalType: 'skill', // skill, score, time, streak
  targetSkill: '',
  targetValue: 0,
  currentValue: 0,
  deadline: null,
  created: null,
  status: 'active', // active, completed, paused, abandoned
  progress: 0, // percentage
  milestones: [],
  motivationalMessage: '',
  priority: 'medium' // low, medium, high
};

// Achievement Model
export const AchievementModel = {
  achievementId: '',
  userId: '',
  title: '',
  description: '',
  category: '', // streak, score, time, skill, special
  criteria: {},
  unlockedAt: null,
  progress: 0,
  maxProgress: 100,
  rarity: 'common', // common, rare, epic, legendary
  points: 0,
  badge: '', // badge image/icon
  shareText: ''
};

// Learning Pattern Model
export const LearningPatternModel = {
  userId: '',
  patternType: '', // time_preference, difficulty_preference, exercise_preference
  pattern: {},
  confidence: 0, // how confident we are in this pattern
  lastUpdated: null,
  dataPoints: 0, // number of sessions this pattern is based on
  insights: [],
  recommendations: []
};

// Analytics Event Model
export const AnalyticsEventModel = {
  eventId: '',
  userId: '',
  sessionId: '',
  eventType: '',
  timestamp: null,
  data: {}, // event-specific data
  metadata: {
    source: 'web', // web, mobile, api
    version: '1.0.0',
    userAgent: '',
    ip: '', // anonymized
    location: '' // anonymized
  },
  processed: false,
  batchId: ''
};

// Skill Progression Model
export const SkillProgressionModel = {
  userId: '',
  skill: '',
  level: 0,
  xp: 0,
  xpToNextLevel: 0,
  exercisesCompleted: 0,
  averageScore: 0,
  lastExerciseDate: null,
  progression: [], // historical progression data
  milestones: [],
  strengths: [], // specific areas of strength within skill
  weaknesses: [], // specific areas needing improvement
  recommendations: []
};

// Performance Metrics Model
export const PerformanceMetricsModel = {
  userId: '',
  timeframe: '', // daily, weekly, monthly, all-time
  metrics: {
    accuracy: 0,
    speed: 0, // questions per minute
    consistency: 0, // score variance
    engagement: 0, // session completion rate
    retention: 0, // knowledge retention rate
    improvement: 0 // rate of improvement
  },
  comparisons: {
    previousPeriod: {},
    peerAverage: {},
    globalAverage: {}
  },
  trends: {
    direction: 'stable', // improving, declining, stable
    strength: 0, // how strong the trend is
    reliability: 0 // how reliable the trend data is
  }
};

// Export all models
export const AnalyticsModels = {
  UserProgressModel,
  SessionDataModel,
  ExerciseAnalyticsModel,
  QuestionAnalyticsModel,
  LearningGoalModel,
  AchievementModel,
  LearningPatternModel,
  AnalyticsEventModel,
  SkillProgressionModel,
  PerformanceMetricsModel
};

// Model validation functions
export const validateModel = (data, model) => {
  const errors = [];
  
  for (const [key, expectedType] of Object.entries(model)) {
    if (!(key in data)) {
      errors.push(`Missing required field: ${key}`);
    } else if (typeof data[key] !== typeof expectedType && expectedType !== null) {
      errors.push(`Invalid type for field ${key}: expected ${typeof expectedType}, got ${typeof data[key]}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Model creation helpers
export const createUserProgress = (userId) => ({
  ...UserProgressModel,
  userId,
  lastActivity: new Date().toISOString()
});

export const createSession = (userId, sessionId) => ({
  ...SessionDataModel,
  userId,
  sessionId,
  startTime: new Date().toISOString()
});

export const createExerciseAnalytics = (exerciseId, userId, sessionId) => ({
  ...ExerciseAnalyticsModel,
  exerciseId,
  userId,
  sessionId,
  startTime: new Date().toISOString()
});

export const createQuestionAnalytics = (questionId, exerciseId, userId) => ({
  ...QuestionAnalyticsModel,
  questionId,
  exerciseId,
  userId,
  timestamp: new Date().toISOString()
});

export default AnalyticsModels;
