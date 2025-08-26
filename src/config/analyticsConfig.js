/**
 * Advanced Analytics Customization Configuration
 * Tailor metrics and insights to your specific needs
 */

export const AnalyticsConfiguration = {
  // Application-specific settings
  app: {
    name: 'Quiz-App',
    version: '6.0.0',
    environment: import.meta.env.MODE || 'development',
    domain: 'quiz-app.example.com'
  },

  // Core metrics configuration
  metrics: {
    // Performance metrics to track
    performance: {
      coreWebVitals: {
        enabled: true,
        thresholds: {
          lcp: { good: 2500, needsImprovement: 4000 }, // Largest Contentful Paint (ms)
          fid: { good: 100, needsImprovement: 300 },   // First Input Delay (ms)
          cls: { good: 0.1, needsImprovement: 0.25 }   // Cumulative Layout Shift
        }
      },
      
      pageLoad: {
        enabled: true,
        thresholds: {
          domReady: { good: 1500, warning: 3000 },
          windowLoad: { good: 3000, warning: 5000 },
          firstPaint: { good: 1000, warning: 2000 }
        }
      },

      apiResponse: {
        enabled: true,
        thresholds: {
          fast: 200,      // ms
          moderate: 500,  // ms
          slow: 1000      // ms
        }
      }
    },

    // User engagement metrics
    engagement: {
      quiz: {
        completionRate: { enabled: true, target: 0.75 },
        averageScore: { enabled: true, target: 0.70 },
        timePerQuestion: { enabled: true, target: 30000 }, // 30 seconds
        retryRate: { enabled: true, acceptable: 0.20 }
      },

      session: {
        duration: { enabled: true, target: 300000 }, // 5 minutes
        pageViews: { enabled: true, target: 3 },
        bounceRate: { enabled: true, target: 0.40 },
        returnVisitor: { enabled: true, target: 0.30 }
      },

      learning: {
        progressRate: { enabled: true, target: 0.15 }, // 15% improvement per week
        skillProgression: { enabled: true, trackingPeriod: '7d' },
        streakMaintenance: { enabled: true, target: 7 } // 7-day streak
      }
    },

    // Business metrics
    business: {
      conversion: {
        signUp: { enabled: true, target: 0.05 },
        quizCompletion: { enabled: true, target: 0.80 },
        featureAdoption: { enabled: true, target: 0.60 }
      },

      retention: {
        daily: { enabled: true, target: 0.25 },
        weekly: { enabled: true, target: 0.15 },
        monthly: { enabled: true, target: 0.10 }
      }
    }
  },

  // User behavior tracking configuration
  userBehavior: {
    // Events to track automatically
    autoTrack: {
      pageViews: true,
      clicks: true,
      scrolling: true,
      formInteractions: true,
      errors: true,
      performance: true
    },

    // Custom events specific to quiz app
    customEvents: {
      quiz: [
        'quiz_started',
        'question_answered',
        'quiz_completed',
        'quiz_abandoned',
        'hint_used',
        'answer_changed'
      ],
      
      learning: [
        'skill_level_up',
        'achievement_unlocked',
        'streak_maintained',
        'goal_set',
        'goal_achieved'
      ],

      social: [
        'leaderboard_viewed',
        'challenge_accepted',
        'result_shared',
        'friend_invited'
      ]
    },

    // Heatmap configuration
    heatmaps: {
      enabled: true,
      sampleRate: 0.1, // Track 10% of sessions
      pages: [
        '/quiz/*',
        '/dashboard',
        '/profile',
        '/leaderboard'
      ]
    },

    // User journey mapping
    journeyMapping: {
      enabled: true,
      sessionTimeout: 1800000, // 30 minutes
      keyPaths: [
        'home → quiz → completion',
        'dashboard → quiz → results',
        'profile → settings → save'
      ]
    }
  },

  // A/B testing configuration
  abTesting: {
    // Default experiment settings
    defaults: {
      trafficSplit: 50, // 50/50 split
      minSampleSize: 100,
      confidenceLevel: 0.95,
      powerLevel: 0.8,
      maxDuration: 30 // days
    },

    // Quiz-specific experiments
    experiments: {
      quizUI: {
        name: 'Quiz Interface Optimization',
        variants: ['control', 'simplified', 'gamified'],
        metrics: ['completion_rate', 'average_score', 'time_spent'],
        audience: 'new_users'
      },

      onboarding: {
        name: 'Onboarding Flow Test',
        variants: ['standard', 'interactive', 'minimal'],
        metrics: ['completion_rate', 'feature_adoption', 'retention_7d'],
        audience: 'all_users'
      },

      difficulty: {
        name: 'Adaptive Difficulty Testing',
        variants: ['static', 'adaptive', 'user_choice'],
        metrics: ['engagement_time', 'completion_rate', 'user_satisfaction'],
        audience: 'active_learners'
      }
    }
  },

  // Real-time analytics configuration
  realTime: {
    // WebSocket settings
    websocket: {
      enabled: true,
      reconnectAttempts: 5,
      heartbeatInterval: 30000, // 30 seconds
      bufferSize: 1000
    },

    // Live dashboard updates
    liveUpdates: {
      interval: 5000, // 5 seconds
      metrics: [
        'active_users',
        'quiz_completions',
        'error_rate',
        'page_views'
      ]
    },

    // Real-time alerts
    alerts: {
      performance: {
        highErrorRate: { threshold: 0.05, window: '5m' },
        slowResponse: { threshold: 2000, window: '5m' },
        highBounceRate: { threshold: 0.80, window: '10m' }
      },
      
      business: {
        lowConversion: { threshold: 0.02, window: '1h' },
        unusualTraffic: { threshold: 2.0, window: '15m' }, // 200% of normal
        systemDown: { threshold: 0.95, window: '2m' } // 95% error rate
      }
    }
  },

  // Privacy and compliance settings
  privacy: {
    // GDPR/CCPA compliance
    compliance: {
      gdpr: true,
      ccpa: true,
      cookieConsent: true,
      dataRetention: 365, // days
      anonymization: true
    },

    // Data collection settings
    dataCollection: {
      personalData: false, // Don't collect PII by default
      deviceInfo: true,
      locationData: false,
      biometricData: false,
      crossSiteTracking: false
    },

    // User controls
    userControls: {
      optOut: true,
      dataExport: true,
      dataDelete: true,
      consentManagement: true
    }
  },

  // Data sources configuration
  dataSources: {
    // Primary data storage
    primary: {
      type: 'indexedDB',
      name: 'QuizAppAnalytics',
      version: 1,
      stores: [
        'events',
        'sessions',
        'experiments',
        'performance'
      ]
    },

    // External integrations
    external: {
      googleAnalytics: {
        enabled: false,
        trackingId: 'GA-XXXXXXXX-X'
      },
      
      mixpanel: {
        enabled: false,
        token: 'your-mixpanel-token'
      },
      
      amplitude: {
        enabled: false,
        apiKey: 'your-amplitude-key'
      }
    },

    // API endpoints
    api: {
      baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:3001',
      endpoints: {
        events: '/api/analytics/events',
        experiments: '/api/analytics/experiments',
        performance: '/api/analytics/performance',
        insights: '/api/analytics/insights'
      }
    }
  },

  // Dashboard customization
  dashboard: {
    // Default views
    defaultViews: [
      'overview',
      'performance',
      'user_behavior',
      'ab_testing'
    ],

    // Widget configurations
    widgets: {
      overview: {
        keyMetrics: [
          'total_users',
          'active_users',
          'quiz_completions',
          'average_score'
        ],
        chartType: 'line',
        timeRange: '7d'
      },

      performance: {
        metrics: [
          'page_load_time',
          'api_response_time',
          'error_rate',
          'core_web_vitals'
        ],
        alertThresholds: true,
        realTimeUpdates: true
      },

      userBehavior: {
        features: [
          'user_journeys',
          'heatmaps',
          'session_recordings',
          'cohort_analysis'
        ],
        sampleRate: 0.1
      }
    },

    // Customization options
    customization: {
      theme: 'light', // 'light', 'dark', 'auto'
      refreshInterval: 30000, // 30 seconds
      autoRefresh: true,
      animations: true,
      notifications: true
    }
  },

  // Feature flags
  features: {
    // Phase 6 features
    advancedAnalytics: true,
    realTimeMonitoring: true,
    abTestingFramework: true,
    userBehaviorAnalysis: true,
    performanceMonitoring: true,
    
    // Experimental features
    aiInsights: false,
    predictiveAnalytics: false,
    anomalyDetection: false,
    automaticOptimization: false
  }
};

// Environment-specific configurations
export const EnvironmentConfigs = {
  development: {
    ...AnalyticsConfiguration,
    privacy: {
      ...AnalyticsConfiguration.privacy,
      dataCollection: {
        ...AnalyticsConfiguration.privacy.dataCollection,
        personalData: true // Allow in development
      }
    },
    realTime: {
      ...AnalyticsConfiguration.realTime,
      liveUpdates: {
        ...AnalyticsConfiguration.realTime.liveUpdates,
        interval: 1000 // Faster updates in development
      }
    }
  },

  production: {
    ...AnalyticsConfiguration,
    privacy: {
      ...AnalyticsConfiguration.privacy,
      compliance: {
        ...AnalyticsConfiguration.privacy.compliance,
        gdpr: true,
        ccpa: true,
        cookieConsent: true
      }
    },
    realTime: {
      ...AnalyticsConfiguration.realTime,
      alerts: {
        ...AnalyticsConfiguration.realTime.alerts,
        performance: {
          highErrorRate: { threshold: 0.02, window: '5m' }, // Stricter in production
          slowResponse: { threshold: 1000, window: '5m' },
          highBounceRate: { threshold: 0.70, window: '10m' }
        }
      }
    }
  }
};

// Get configuration for current environment
export const getCurrentConfig = () => {
  const env = import.meta.env.MODE || 'development';
  return EnvironmentConfigs[env] || AnalyticsConfiguration;
};

// Configuration validation
export const validateConfiguration = (config = getCurrentConfig()) => {
  const errors = [];
  
  // Validate required fields
  if (!config.app?.name) errors.push('App name is required');
  if (!config.app?.version) errors.push('App version is required');
  
  // Validate thresholds
  if (config.metrics?.performance?.coreWebVitals?.enabled) {
    const { lcp, fid, cls } = config.metrics.performance.coreWebVitals.thresholds;
    if (lcp.good >= lcp.needsImprovement) errors.push('LCP good threshold must be less than needs improvement');
    if (fid.good >= fid.needsImprovement) errors.push('FID good threshold must be less than needs improvement');
    if (cls.good >= cls.needsImprovement) errors.push('CLS good threshold must be less than needs improvement');
  }
  
  // Validate A/B testing settings
  if (config.abTesting?.defaults?.confidenceLevel) {
    const confidence = config.abTesting.defaults.confidenceLevel;
    if (confidence < 0.8 || confidence > 0.99) {
      errors.push('Confidence level must be between 0.8 and 0.99');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

// Export utility functions
export const getMetricConfig = (metricPath) => {
  const config = getCurrentConfig();
  return metricPath.split('.').reduce((obj, key) => obj?.[key], config.metrics);
};

export const isFeatureEnabled = (featureName) => {
  const config = getCurrentConfig();
  return config.features?.[featureName] === true;
};

export const getAlertThreshold = (alertType, metricName) => {
  const config = getCurrentConfig();
  return config.realTime?.alerts?.[alertType]?.[metricName];
};

export default AnalyticsConfiguration;
