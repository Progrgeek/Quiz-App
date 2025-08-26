/**
 * 👤 User Behavior Analysis Dashboard
 * Phase 6: Advanced user journey mapping and behavioral insights
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const UserBehaviorAnalysis = () => {
  const [behaviorData, setBehaviorData] = useState({
    userJourneys: [],
    heatmaps: {},
    sessionRecordings: [],
    cohortAnalysis: {},
    funnelAnalysis: {},
    segmentation: {}
  });
  
  const [activeTab, setActiveTab] = useState('journeys');
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedSegment, setSelectedSegment] = useState('all');
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);

  useEffect(() => {
    initializeBehaviorData();
    if (isRealTimeEnabled) {
      const interval = setInterval(updateRealTimeData, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, selectedSegment, isRealTimeEnabled]);

  const initializeBehaviorData = () => {
    setBehaviorData({
      userJourneys: generateUserJourneys(),
      heatmaps: generateHeatmapData(),
      sessionRecordings: generateSessionRecordings(),
      cohortAnalysis: generateCohortData(),
      funnelAnalysis: generateFunnelData(),
      segmentation: generateSegmentationData()
    });
  };

  const generateUserJourneys = () => {
    const journeyTemplates = [
      {
        type: 'new_user_onboarding',
        steps: ['landing_page', 'signup_form', 'email_verification', 'profile_setup', 'first_quiz'],
        conversionRates: [100, 65, 85, 72, 58],
        avgDuration: [0, 30, 120, 180, 300],
        dropOffReasons: ['too_complex', 'email_issues', 'lost_interest', 'technical_error']
      },
      {
        type: 'returning_user_engagement',
        steps: ['homepage', 'quiz_browse', 'quiz_start', 'quiz_complete', 'results_share'],
        conversionRates: [100, 78, 89, 67, 34],
        avgDuration: [0, 45, 60, 240, 90],
        dropOffReasons: ['distraction', 'difficulty', 'time_constraint', 'technical_issue']
      },
      {
        type: 'premium_conversion',
        steps: ['free_trial', 'feature_exploration', 'paywall_encounter', 'pricing_page', 'checkout'],
        conversionRates: [100, 82, 45, 67, 23],
        avgDuration: [0, 300, 60, 120, 180],
        dropOffReasons: ['price_sensitivity', 'feature_confusion', 'payment_issues', 'changed_mind']
      }
    ];

    return journeyTemplates.map(template => ({
      ...template,
      id: `journey_${template.type}`,
      totalUsers: Math.floor(Math.random() * 5000) + 1000,
      completionRate: template.conversionRates[template.conversionRates.length - 1],
      avgTotalDuration: template.avgDuration.reduce((sum, duration) => sum + duration, 0),
      lastUpdated: new Date(Date.now() - Math.random() * 86400000) // Random time in last 24h
    }));
  };

  const generateHeatmapData = () => {
    const pages = ['homepage', 'quiz_page', 'results_page', 'profile_page'];
    const heatmaps = {};

    pages.forEach(page => {
      heatmaps[page] = {
        clicks: generateClickData(),
        scrolls: generateScrollData(),
        hovers: generateHoverData(),
        attention: generateAttentionData()
      };
    });

    return heatmaps;
  };

  const generateClickData = () => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      intensity: Math.random(),
      element: ['button', 'link', 'image', 'text'][Math.floor(Math.random() * 4)],
      count: Math.floor(Math.random() * 1000) + 10
    }));
  };

  const generateScrollData = () => {
    return {
      depths: [0, 25, 50, 75, 100].map(depth => ({
        depth,
        percentage: Math.max(0, 100 - depth * 0.8 + Math.random() * 20)
      })),
      avgScrollDepth: Math.random() * 100,
      bounceAtTop: Math.random() * 30
    };
  };

  const generateHoverData = () => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 5000,
      element: ['nav', 'content', 'sidebar', 'footer'][Math.floor(Math.random() * 4)]
    }));
  };

  const generateAttentionData = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      width: Math.random() * 20 + 10,
      height: Math.random() * 10 + 5,
      intensity: Math.random(),
      viewTime: Math.random() * 10000
    }));
  };

  const generateSessionRecordings = () => {
    return Array.from({ length: 20 }, (_, i) => ({
      id: `session_${i}`,
      userId: `user_${Math.floor(Math.random() * 1000)}`,
      duration: Math.floor(Math.random() * 1800) + 300, // 5-35 minutes
      pages: Math.floor(Math.random() * 10) + 1,
      interactions: Math.floor(Math.random() * 50) + 10,
      errors: Math.floor(Math.random() * 3),
      startTime: new Date(Date.now() - Math.random() * 604800000), // Random time in last week
      device: ['desktop', 'mobile', 'tablet'][Math.floor(Math.random() * 3)],
      browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
      conversionEvent: Math.random() > 0.7,
      tags: generateSessionTags()
    }));
  };

  const generateSessionTags = () => {
    const allTags = ['high_engagement', 'quick_bounce', 'error_encountered', 'conversion', 'help_seeking', 'mobile_user'];
    return allTags.filter(() => Math.random() > 0.7);
  };

  const generateCohortData = () => {
    const weeks = 12;
    const cohorts = Array.from({ length: weeks }, (_, i) => ({
      cohortWeek: i + 1,
      users: Math.floor(Math.random() * 500) + 100,
      retentionByWeek: Array.from({ length: weeks - i }, (_, j) => 
        Math.max(0, 100 - j * 15 + Math.random() * 20)
      )
    }));

    return {
      cohorts,
      avgRetention: {
        week1: 85,
        week4: 42,
        week8: 28,
        week12: 18
      },
      churnPredictors: ['low_initial_engagement', 'no_quiz_completion', 'mobile_only_usage']
    };
  };

  const generateFunnelData = () => {
    return {
      signupFunnel: {
        steps: [
          { name: 'Visit Homepage', users: 10000, conversionRate: 100 },
          { name: 'Click Sign Up', users: 2500, conversionRate: 25 },
          { name: 'Fill Form', users: 2000, conversionRate: 80 },
          { name: 'Verify Email', users: 1700, conversionRate: 85 },
          { name: 'Complete Profile', users: 1400, conversionRate: 82 }
        ],
        overallConversion: 14,
        avgTimeToComplete: 720 // seconds
      },
      quizFunnel: {
        steps: [
          { name: 'Browse Quizzes', users: 5000, conversionRate: 100 },
          { name: 'Select Quiz', users: 3500, conversionRate: 70 },
          { name: 'Start Quiz', users: 2800, conversionRate: 80 },
          { name: 'Complete Quiz', users: 2100, conversionRate: 75 },
          { name: 'View Results', users: 2000, conversionRate: 95 }
        ],
        overallConversion: 40,
        avgTimeToComplete: 480
      }
    };
  };

  const generateSegmentationData = () => {
    return {
      segments: [
        {
          id: 'power_users',
          name: 'Power Users',
          size: 1250,
          percentage: 12.5,
          characteristics: ['high_engagement', 'frequent_return', 'feature_adoption'],
          metrics: {
            avgSessionDuration: 420,
            quizzesPerMonth: 15,
            retentionRate: 85
          }
        },
        {
          id: 'casual_users',
          name: 'Casual Users',
          size: 6500,
          percentage: 65,
          characteristics: ['moderate_engagement', 'periodic_return', 'basic_features'],
          metrics: {
            avgSessionDuration: 180,
            quizzesPerMonth: 4,
            retentionRate: 45
          }
        },
        {
          id: 'at_risk',
          name: 'At Risk',
          size: 1500,
          percentage: 15,
          characteristics: ['declining_engagement', 'infrequent_return', 'support_tickets'],
          metrics: {
            avgSessionDuration: 90,
            quizzesPerMonth: 1,
            retentionRate: 15
          }
        },
        {
          id: 'new_users',
          name: 'New Users',
          size: 750,
          percentage: 7.5,
          characteristics: ['exploring', 'onboarding', 'learning_curve'],
          metrics: {
            avgSessionDuration: 240,
            quizzesPerMonth: 2,
            retentionRate: 62
          }
        }
      ],
      segmentationCriteria: ['engagement_level', 'usage_frequency', 'feature_adoption', 'support_interaction']
    };
  };

  const updateRealTimeData = () => {
    setBehaviorData(prev => ({
      ...prev,
      userJourneys: prev.userJourneys.map(journey => ({
        ...journey,
        totalUsers: journey.totalUsers + Math.floor(Math.random() * 10),
        lastUpdated: new Date()
      }))
    }));
  };

  // Journey Mapping Tab
  const JourneyMappingTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Journey Analysis</h3>
        <div className="flex items-center space-x-4">
          <select
            value={selectedSegment}
            onChange={(e) => setSelectedSegment(e.target.value)}
            className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Users</option>
            <option value="new">New Users</option>
            <option value="returning">Returning Users</option>
            <option value="premium">Premium Users</option>
          </select>
        </div>
      </div>

      <div className="grid gap-6">
        {behaviorData.userJourneys.map((journey, index) => (
          <motion.div
            key={journey.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-1">
                  {journey.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>{journey.totalUsers.toLocaleString()} users</span>
                  <span>{journey.completionRate}% completion</span>
                  <span>{Math.floor(journey.avgTotalDuration / 60)}m avg duration</span>
                </div>
              </div>
              
              <div className="text-right">
                <div className={`text-2xl font-bold ${
                  journey.completionRate > 60 ? 'text-green-600' :
                  journey.completionRate > 30 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {journey.completionRate}%
                </div>
                <div className="text-xs text-gray-500">Completion Rate</div>
              </div>
            </div>

            {/* Journey Steps */}
            <div className="relative">
              <div className="flex justify-between items-center mb-4">
                {journey.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex-1 text-center">
                    <div className="relative">
                      {/* Step Circle */}
                      <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-sm font-medium ${
                        journey.conversionRates[stepIndex] > 70 ? 'bg-green-500' :
                        journey.conversionRates[stepIndex] > 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}>
                        {stepIndex + 1}
                      </div>
                      
                      {/* Connection Line */}
                      {stepIndex < journey.steps.length - 1 && (
                        <div className="absolute top-4 left-1/2 w-full h-0.5 bg-gray-300 transform -translate-y-1/2 -translate-x-1/2 z-0" />
                      )}
                    </div>
                    
                    <div className="text-xs font-medium text-gray-900 mb-1">
                      {step.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </div>
                    <div className="text-xs text-gray-500">
                      {journey.conversionRates[stepIndex]}%
                    </div>
                    <div className="text-xs text-gray-400">
                      {Math.floor(journey.avgDuration[stepIndex] / 60)}m
                    </div>
                  </div>
                ))}
              </div>

              {/* Drop-off Analysis */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-medium text-gray-900 mb-2">Top Drop-off Reasons</h5>
                <div className="flex flex-wrap gap-2">
                  {journey.dropOffReasons.map((reason, reasonIndex) => (
                    <span
                      key={reasonIndex}
                      className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs"
                    >
                      {reason.replace(/_/g, ' ')}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  // Heatmaps Tab
  const HeatmapsTab = () => {
    const [selectedPage, setSelectedPage] = useState('homepage');
    const [heatmapType, setHeatmapType] = useState('clicks');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Heatmap Analysis</h3>
          <div className="flex items-center space-x-4">
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="homepage">Homepage</option>
              <option value="quiz_page">Quiz Page</option>
              <option value="results_page">Results Page</option>
              <option value="profile_page">Profile Page</option>
            </select>
            
            <select
              value={heatmapType}
              onChange={(e) => setHeatmapType(e.target.value)}
              className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="clicks">Click Heatmap</option>
              <option value="scrolls">Scroll Map</option>
              <option value="attention">Attention Map</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900 mb-2">
              {heatmapType.charAt(0).toUpperCase() + heatmapType.slice(1)} Heatmap - {selectedPage.replace('_', ' ')}
            </h4>
            <p className="text-sm text-gray-600">
              {heatmapType === 'clicks' && 'Shows where users click most frequently'}
              {heatmapType === 'scrolls' && 'Shows how far users scroll down the page'}
              {heatmapType === 'attention' && 'Shows areas that receive the most visual attention'}
            </p>
          </div>

          {/* Heatmap Visualization */}
          <div className="relative bg-gray-100 rounded-lg" style={{ height: '600px' }}>
            <div className="absolute inset-0 p-4">
              {heatmapType === 'clicks' && behaviorData.heatmaps[selectedPage]?.clicks.map((click) => (
                <div
                  key={click.id}
                  className="absolute w-4 h-4 rounded-full pointer-events-none"
                  style={{
                    left: `${click.x}%`,
                    top: `${click.y}%`,
                    backgroundColor: `rgba(255, 0, 0, ${click.intensity * 0.8})`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  title={`${click.count} clicks`}
                />
              ))}
              
              {heatmapType === 'attention' && behaviorData.heatmaps[selectedPage]?.attention.map((area) => (
                <div
                  key={area.id}
                  className="absolute border-2 border-yellow-400 bg-yellow-200 pointer-events-none"
                  style={{
                    left: `${area.x}%`,
                    top: `${area.y}%`,
                    width: `${area.width}%`,
                    height: `${area.height}%`,
                    opacity: area.intensity * 0.6
                  }}
                  title={`${(area.viewTime / 1000).toFixed(1)}s avg view time`}
                />
              ))}
              
              {heatmapType === 'scrolls' && (
                <div className="space-y-2">
                  {behaviorData.heatmaps[selectedPage]?.scrolls.depths.map((depth, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white rounded p-2"
                    >
                      <span className="text-sm">{depth.depth}% depth</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${depth.percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{depth.percentage.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Session Recordings Tab
  const SessionRecordingsTab = () => {
    const [selectedRecording, setSelectedRecording] = useState(null);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Session Recordings</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="errors-only"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="errors-only" className="text-sm text-gray-600">
                Errors only
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="conversions-only"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="conversions-only" className="text-sm text-gray-600">
                Conversions only
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Session
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tags
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {behaviorData.sessionRecordings.map((recording, index) => (
                  <motion.tr
                    key={recording.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{recording.id}</div>
                      <div className="text-sm text-gray-500">{recording.userId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Math.floor(recording.duration / 60)}m {recording.duration % 60}s
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {recording.pages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {recording.device} • {recording.browser}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {recording.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag.replace(/_/g, ' ')}
                          </span>
                        ))}
                        {recording.conversionEvent && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            conversion
                          </span>
                        )}
                        {recording.errors > 0 && (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            {recording.errors} errors
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedRecording(recording)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Watch
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // Cohort Analysis Tab
  const CohortAnalysisTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Cohort Analysis</h3>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h4 className="font-medium text-gray-900 mb-4">User Retention by Cohort</h4>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                  Cohort
                </th>
                <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                  Size
                </th>
                {Array.from({ length: 12 }, (_, i) => (
                  <th key={i} className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider py-2">
                    Week {i + 1}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {behaviorData.cohortAnalysis.cohorts?.map((cohort, index) => (
                <tr key={index}>
                  <td className="py-2 text-sm font-medium text-gray-900">
                    Week {cohort.cohortWeek}
                  </td>
                  <td className="py-2 text-sm text-gray-500">
                    {cohort.users.toLocaleString()}
                  </td>
                  {Array.from({ length: 12 }, (_, weekIndex) => (
                    <td key={weekIndex} className="py-2 text-center">
                      {cohort.retentionByWeek[weekIndex] !== undefined ? (
                        <div
                          className="inline-block px-2 py-1 rounded text-xs font-medium"
                          style={{
                            backgroundColor: `rgba(59, 130, 246, ${cohort.retentionByWeek[weekIndex] / 100})`,
                            color: cohort.retentionByWeek[weekIndex] > 50 ? 'white' : 'black'
                          }}
                        >
                          {cohort.retentionByWeek[weekIndex].toFixed(0)}%
                        </div>
                      ) : (
                        <span className="text-gray-300">-</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Average Retention Rates</h4>
          <div className="space-y-3">
            {Object.entries(behaviorData.cohortAnalysis.avgRetention || {}).map(([period, rate]) => (
              <div key={period} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{period.replace(/(\d+)/, 'Week $1')}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${rate}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium">{rate}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h4 className="font-medium text-gray-900 mb-4">Churn Predictors</h4>
          <div className="space-y-2">
            {(behaviorData.cohortAnalysis.churnPredictors || []).map((predictor, index) => (
              <div
                key={index}
                className="bg-red-50 text-red-800 px-3 py-2 rounded-lg text-sm"
              >
                {predictor.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'journeys', label: 'User Journeys', icon: '🗺️', component: JourneyMappingTab },
    { id: 'heatmaps', label: 'Heatmaps', icon: '🔥', component: HeatmapsTab },
    { id: 'recordings', label: 'Session Recordings', icon: '📹', component: SessionRecordingsTab },
    { id: 'cohorts', label: 'Cohort Analysis', icon: '👥', component: CohortAnalysisTab }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            👤 User Behavior Analysis
          </h1>
          <p className="text-gray-600">
            Deep insights into user journeys, interactions, and behavior patterns
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="1d">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${
                isRealTimeEnabled ? 'text-green-600' : 'text-gray-400'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
                }`} />
                <span className="text-sm font-medium">
                  {isRealTimeEnabled ? 'Live Updates' : 'Static View'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                {tabs.find(tab => tab.id === activeTab)?.component()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserBehaviorAnalysis;
