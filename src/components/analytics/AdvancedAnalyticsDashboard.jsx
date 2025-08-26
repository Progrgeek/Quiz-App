/**
 * 📊 Advanced Analytics Dashboard
 * Phase 6: Comprehensive analytics and monitoring hub
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PerformanceMonitoringDashboard from './PerformanceMonitoringDashboard';
import ABTestingFramework from './ABTestingFramework';
import UserBehaviorAnalysis from './UserBehaviorAnalysis';
import AdvancedAnalyticsEngine from '../../analytics/AdvancedAnalyticsEngine';

const AdvancedAnalyticsDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [analyticsEngine, setAnalyticsEngine] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    overview: {},
    realTimeMetrics: {},
    keyInsights: [],
    alerts: []
  });

  useEffect(() => {
    initializeAnalytics();
  }, []);

  const initializeAnalytics = async () => {
    try {
      const engine = new AdvancedAnalyticsEngine();
      const analytics = await engine.initializeAdvancedAnalytics({
        enableRealTime: true,
        enableABTesting: true,
        enablePerformanceMonitoring: true,
        privacyMode: 'compliant'
      });

      setAnalyticsEngine(analytics);
      
      // Initialize dashboard data
      setDashboardData({
        overview: generateOverviewData(),
        realTimeMetrics: generateRealTimeMetrics(),
        keyInsights: generateKeyInsights(),
        alerts: generateAlerts()
      });

    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  };

  const generateOverviewData = () => ({
    totalUsers: 125847,
    activeUsers: 8934,
    conversionRate: 23.4,
    avgSessionDuration: 324,
    bounceRate: 28.7,
    pageViews: 2847593,
    engagement: {
      high: 32,
      medium: 48,
      low: 20
    },
    growth: {
      users: 15.2,
      sessions: 12.8,
      conversions: 18.6
    }
  });

  const generateRealTimeMetrics = () => ({
    activeNow: Math.floor(Math.random() * 500) + 200,
    eventsPerSecond: Math.floor(Math.random() * 50) + 20,
    currentConversions: Math.floor(Math.random() * 10) + 5,
    errorRate: (Math.random() * 2).toFixed(2),
    serverResponse: Math.floor(Math.random() * 200) + 100,
    topPages: [
      { path: '/quiz/javascript-basics', users: 234 },
      { path: '/dashboard', users: 187 },
      { path: '/quiz/react-fundamentals', users: 156 },
      { path: '/profile', users: 143 },
      { path: '/quiz/css-advanced', users: 128 }
    ]
  });

  const generateKeyInsights = () => ([
    {
      id: 1,
      type: 'performance',
      title: 'Page Load Speed Improvement',
      description: 'Homepage LCP improved by 23% after image optimization',
      impact: 'positive',
      metric: '+23%',
      timestamp: new Date(Date.now() - 3600000) // 1 hour ago
    },
    {
      id: 2,
      type: 'conversion',
      title: 'Quiz Completion Rate Increased',
      description: 'Mobile quiz completion rate up 18% this week',
      impact: 'positive',
      metric: '+18%',
      timestamp: new Date(Date.now() - 7200000) // 2 hours ago
    },
    {
      id: 3,
      type: 'behavior',
      title: 'User Engagement Patterns',
      description: 'Peak activity shifted to 2-4 PM, consider content scheduling',
      impact: 'neutral',
      metric: 'Trend',
      timestamp: new Date(Date.now() - 10800000) // 3 hours ago
    },
    {
      id: 4,
      type: 'ab_test',
      title: 'CTA Button Test Results',
      description: 'Green button variant shows 14.8% higher conversion rate',
      impact: 'positive',
      metric: '+14.8%',
      timestamp: new Date(Date.now() - 14400000) // 4 hours ago
    }
  ]);

  const generateAlerts = () => ([
    {
      id: 1,
      severity: 'medium',
      title: 'High Error Rate on Quiz Submission',
      description: 'Error rate increased to 3.2% in the last hour',
      timestamp: new Date(Date.now() - 1800000), // 30 minutes ago
      status: 'active'
    },
    {
      id: 2,
      severity: 'low',
      title: 'Unusual Traffic Pattern',
      description: 'Traffic from mobile devices 40% higher than usual',
      timestamp: new Date(Date.now() - 5400000), // 1.5 hours ago
      status: 'investigating'
    }
  ]);

  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Users"
          value={dashboardData.overview.totalUsers?.toLocaleString()}
          change={`+${dashboardData.overview.growth?.users}%`}
          trend="up"
          icon="👥"
        />
        <MetricCard
          title="Active Users"
          value={dashboardData.overview.activeUsers?.toLocaleString()}
          change="Live"
          trend="neutral"
          icon="🟢"
        />
        <MetricCard
          title="Conversion Rate"
          value={`${dashboardData.overview.conversionRate}%`}
          change={`+${dashboardData.overview.growth?.conversions}%`}
          trend="up"
          icon="📈"
        />
        <MetricCard
          title="Avg Session"
          value={`${Math.floor(dashboardData.overview.avgSessionDuration / 60)}m`}
          change={`${dashboardData.overview.bounceRate}% bounce`}
          trend="down"
          icon="⏱️"
        />
      </div>

      {/* Real-time Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Real-time Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live</span>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Users online now</span>
              <span className="text-xl font-bold text-green-600">
                {dashboardData.realTimeMetrics.activeNow}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Events per second</span>
              <span className="text-lg font-semibold text-blue-600">
                {dashboardData.realTimeMetrics.eventsPerSecond}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Conversions (last hour)</span>
              <span className="text-lg font-semibold text-purple-600">
                {dashboardData.realTimeMetrics.currentConversions}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages (Live)</h3>
          <div className="space-y-3">
            {dashboardData.realTimeMetrics.topPages?.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {page.path}
                  </div>
                </div>
                <div className="ml-4 flex items-center">
                  <div className="text-sm text-gray-600 mr-2">{page.users}</div>
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(page.users / 234) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
        <div className="space-y-4">
          {dashboardData.keyInsights.map((insight) => (
            <motion.div
              key={insight.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                insight.impact === 'positive' ? 'bg-green-500' :
                insight.impact === 'negative' ? 'bg-red-500' : 'bg-blue-500'
              }`}>
                {insight.type === 'performance' ? '⚡' :
                 insight.type === 'conversion' ? '📈' :
                 insight.type === 'behavior' ? '👤' : '🧪'}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">{insight.title}</h4>
                  <span className={`text-sm font-semibold ${
                    insight.impact === 'positive' ? 'text-green-600' :
                    insight.impact === 'negative' ? 'text-red-600' : 'text-blue-600'
                  }`}>
                    {insight.metric}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                <div className="text-xs text-gray-400">
                  {insight.timestamp.toRelativeTimeString?.() || insight.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {dashboardData.alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Active Alerts</h3>
          <div className="space-y-3">
            {dashboardData.alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === 'high' ? 'border-red-500 bg-red-50' :
                  alert.severity === 'medium' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {alert.timestamp.toLocaleTimeString()}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.status === 'active' ? 'bg-red-100 text-red-700' :
                    alert.status === 'investigating' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const MetricCard = ({ title, value, change, trend, icon }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span className="text-2xl">{icon}</span>
      </div>
      
      <div className="flex items-end justify-between">
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          {change && (
            <div className={`text-sm font-medium ${
              trend === 'up' ? 'text-green-600' :
              trend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {change}
            </div>
          )}
        </div>
        
        {trend !== 'neutral' && (
          <div className={`text-lg ${
            trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {trend === 'up' ? '↗️' : '↘️'}
          </div>
        )}
      </div>
    </motion.div>
  );

  const sections = [
    { 
      id: 'overview', 
      label: 'Overview', 
      icon: '📊', 
      component: OverviewSection 
    },
    { 
      id: 'performance', 
      label: 'Performance', 
      icon: '⚡', 
      component: () => <PerformanceMonitoringDashboard /> 
    },
    { 
      id: 'behavior', 
      label: 'User Behavior', 
      icon: '👤', 
      component: () => <UserBehaviorAnalysis /> 
    },
    { 
      id: 'abtesting', 
      label: 'A/B Testing', 
      icon: '🧪', 
      component: () => <ABTestingFramework /> 
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                📊 Advanced Analytics Dashboard
              </h1>
              <p className="text-gray-600 mt-1">
                Comprehensive analytics, performance monitoring, and user insights
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">System Healthy</span>
              </div>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Export Report
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeSection === section.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-2">{section.icon}</span>
                {section.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {sections.find(section => section.id === activeSection)?.component()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdvancedAnalyticsDashboard;
