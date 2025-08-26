/**
 * 📊 Performance Monitoring Dashboard
 * Phase 6: Real-time performance analytics and monitoring interface
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PerformanceMonitoringDashboard = () => {
  const [performanceData, setPerformanceData] = useState({
    coreWebVitals: {},
    resourceMetrics: [],
    systemHealth: {},
    userBehavior: {},
    realTimeEvents: []
  });
  
  const [activeTab, setActiveTab] = useState('overview');
  const [timeRange, setTimeRange] = useState('1h');
  const [alerts, setAlerts] = useState([]);
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const wsRef = useRef(null);

  useEffect(() => {
    initializePerformanceMonitoring();
    if (isRealTimeEnabled) {
      setupRealTimeConnection();
    }
    
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [isRealTimeEnabled]);

  const initializePerformanceMonitoring = () => {
    // Simulate initial performance data
    setPerformanceData({
      coreWebVitals: {
        lcp: { value: 2.1, status: 'good', target: 2.5 },
        fid: { value: 45, status: 'good', target: 100 },
        cls: { value: 0.08, status: 'good', target: 0.1 }
      },
      resourceMetrics: generateResourceMetrics(),
      systemHealth: {
        cpuUsage: 23,
        memoryUsage: 67,
        networkLatency: 89,
        errorRate: 0.2
      },
      userBehavior: {
        activeUsers: 1247,
        bounceRate: 32.5,
        avgSessionDuration: 285,
        pagesPerSession: 3.2
      },
      realTimeEvents: []
    });
  };

  const setupRealTimeConnection = () => {
    // Simulate WebSocket connection for real-time updates
    const mockWebSocket = {
      close: () => {},
      send: () => {}
    };
    
    wsRef.current = mockWebSocket;
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      if (isRealTimeEnabled) {
        updateRealTimeData();
      }
    }, 2000);

    return () => clearInterval(interval);
  };

  const updateRealTimeData = () => {
    setPerformanceData(prev => {
      const newEvent = generateRealTimeEvent();
      
      return {
        ...prev,
        coreWebVitals: updateCoreWebVitals(prev.coreWebVitals),
        systemHealth: updateSystemHealth(prev.systemHealth),
        userBehavior: updateUserBehavior(prev.userBehavior),
        realTimeEvents: [newEvent, ...prev.realTimeEvents.slice(0, 99)]
      };
    });
  };

  const generateResourceMetrics = () => {
    const resources = ['JavaScript', 'CSS', 'Images', 'Fonts', 'API Calls'];
    return resources.map(resource => ({
      name: resource,
      loadTime: Math.random() * 1000 + 100,
      size: Math.random() * 500 + 50,
      cached: Math.random() > 0.3,
      errorRate: Math.random() * 5
    }));
  };

  const generateRealTimeEvent = () => {
    const eventTypes = ['page_view', 'click', 'error', 'performance_alert', 'user_action'];
    const eventType = eventTypes[Math.floor(Math.random() * eventTypes.length)];
    
    return {
      id: Date.now() + Math.random(),
      timestamp: new Date(),
      type: eventType,
      data: generateEventData(eventType),
      severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)]
    };
  };

  const generateEventData = (type) => {
    switch (type) {
      case 'page_view':
        return { page: '/quiz', loadTime: Math.random() * 2000 + 500 };
      case 'click':
        return { element: 'button', location: 'header' };
      case 'error':
        return { message: 'Failed to load resource', url: '/api/quiz/123' };
      case 'performance_alert':
        return { metric: 'LCP', value: 3.2, threshold: 2.5 };
      case 'user_action':
        return { action: 'quiz_completed', duration: Math.random() * 300 + 60 };
      default:
        return {};
    }
  };

  const updateCoreWebVitals = (current) => {
    return {
      lcp: {
        ...current.lcp,
        value: Math.max(0.5, current.lcp.value + (Math.random() - 0.5) * 0.2),
        status: current.lcp.value <= current.lcp.target ? 'good' : 'needs-improvement'
      },
      fid: {
        ...current.fid,
        value: Math.max(10, current.fid.value + (Math.random() - 0.5) * 10),
        status: current.fid.value <= current.fid.target ? 'good' : 'needs-improvement'
      },
      cls: {
        ...current.cls,
        value: Math.max(0, current.cls.value + (Math.random() - 0.5) * 0.02),
        status: current.cls.value <= current.cls.target ? 'good' : 'needs-improvement'
      }
    };
  };

  const updateSystemHealth = (current) => {
    return {
      cpuUsage: Math.max(0, Math.min(100, current.cpuUsage + (Math.random() - 0.5) * 10)),
      memoryUsage: Math.max(0, Math.min(100, current.memoryUsage + (Math.random() - 0.5) * 5)),
      networkLatency: Math.max(10, current.networkLatency + (Math.random() - 0.5) * 20),
      errorRate: Math.max(0, current.errorRate + (Math.random() - 0.5) * 0.1)
    };
  };

  const updateUserBehavior = (current) => {
    return {
      activeUsers: Math.max(0, current.activeUsers + Math.floor((Math.random() - 0.5) * 50)),
      bounceRate: Math.max(0, Math.min(100, current.bounceRate + (Math.random() - 0.5) * 2)),
      avgSessionDuration: Math.max(30, current.avgSessionDuration + (Math.random() - 0.5) * 20),
      pagesPerSession: Math.max(1, current.pagesPerSession + (Math.random() - 0.5) * 0.2)
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return 'text-green-600';
      case 'needs-improvement': return 'text-yellow-600';
      case 'poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const MetricCard = ({ title, value, unit, status, target, icon }) => (
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
          <div className={`text-2xl font-bold ${getStatusColor(status)}`}>
            {typeof value === 'number' ? value.toFixed(2) : value}
            <span className="text-sm font-normal ml-1">{unit}</span>
          </div>
          {target && (
            <div className="text-xs text-gray-500 mt-1">
              Target: {target}{unit}
            </div>
          )}
        </div>
        
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          status === 'good' ? 'bg-green-100 text-green-800' :
          status === 'needs-improvement' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
        }`}>
          {status === 'good' ? 'Good' : 
           status === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
        </div>
      </div>
    </motion.div>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Core Web Vitals */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Largest Contentful Paint"
            value={performanceData.coreWebVitals.lcp?.value}
            unit="s"
            status={performanceData.coreWebVitals.lcp?.status}
            target={performanceData.coreWebVitals.lcp?.target}
            icon="🎯"
          />
          <MetricCard
            title="First Input Delay"
            value={performanceData.coreWebVitals.fid?.value}
            unit="ms"
            status={performanceData.coreWebVitals.fid?.status}
            target={performanceData.coreWebVitals.fid?.target}
            icon="⚡"
          />
          <MetricCard
            title="Cumulative Layout Shift"
            value={performanceData.coreWebVitals.cls?.value}
            unit=""
            status={performanceData.coreWebVitals.cls?.status}
            target={performanceData.coreWebVitals.cls?.target}
            icon="📐"
          />
        </div>
      </div>

      {/* System Health */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="CPU Usage"
            value={performanceData.systemHealth.cpuUsage}
            unit="%"
            status={performanceData.systemHealth.cpuUsage > 80 ? 'poor' : 'good'}
            icon="💻"
          />
          <MetricCard
            title="Memory Usage"
            value={performanceData.systemHealth.memoryUsage}
            unit="%"
            status={performanceData.systemHealth.memoryUsage > 85 ? 'poor' : 'good'}
            icon="🧠"
          />
          <MetricCard
            title="Network Latency"
            value={performanceData.systemHealth.networkLatency}
            unit="ms"
            status={performanceData.systemHealth.networkLatency > 200 ? 'poor' : 'good'}
            icon="🌐"
          />
          <MetricCard
            title="Error Rate"
            value={performanceData.systemHealth.errorRate}
            unit="%"
            status={performanceData.systemHealth.errorRate > 1 ? 'poor' : 'good'}
            icon="⚠️"
          />
        </div>
      </div>

      {/* User Behavior */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">User Behavior</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <MetricCard
            title="Active Users"
            value={performanceData.userBehavior.activeUsers}
            unit=""
            status="good"
            icon="👥"
          />
          <MetricCard
            title="Bounce Rate"
            value={performanceData.userBehavior.bounceRate}
            unit="%"
            status={performanceData.userBehavior.bounceRate > 40 ? 'needs-improvement' : 'good'}
            icon="📊"
          />
          <MetricCard
            title="Avg Session Duration"
            value={Math.floor(performanceData.userBehavior.avgSessionDuration / 60)}
            unit="m"
            status="good"
            icon="⏱️"
          />
          <MetricCard
            title="Pages per Session"
            value={performanceData.userBehavior.pagesPerSession}
            unit=""
            status={performanceData.userBehavior.pagesPerSession > 3 ? 'good' : 'needs-improvement'}
            icon="📄"
          />
        </div>
      </div>
    </div>
  );

  const ResourcesTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Resource Performance</h3>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Resource Loading Metrics</h4>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resource Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Load Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cache Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Error Rate
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {performanceData.resourceMetrics.map((resource, index) => (
                <motion.tr
                  key={resource.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {resource.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.loadTime.toFixed(0)}ms
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.size.toFixed(1)}KB
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      resource.cached ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {resource.cached ? 'Cached' : 'Fresh'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {resource.errorRate.toFixed(1)}%
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const RealTimeTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Real-Time Events</h3>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isRealTimeEnabled}
              onChange={(e) => setIsRealTimeEnabled(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-600">Real-time updates</span>
          </label>
          <div className={`w-2 h-2 rounded-full ${
            isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-h-96 overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h4 className="font-medium text-gray-900">Live Event Stream</h4>
        </div>
        <div className="divide-y divide-gray-200">
          <AnimatePresence>
            {performanceData.realTimeEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="px-6 py-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      getSeverityColor(event.severity)
                    }`}>
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-900">
                      {JSON.stringify(event.data)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {event.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );

  const AlertsTab = () => (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">Performance Alerts</h3>
      <div className="grid gap-4">
        {alerts.length === 0 ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <div className="text-green-600 text-4xl mb-2">✅</div>
            <h4 className="text-lg font-medium text-green-900 mb-2">All Systems Operational</h4>
            <p className="text-green-700">No performance alerts at this time.</p>
          </div>
        ) : (
          alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`border rounded-lg p-4 ${
                alert.severity === 'high' ? 'border-red-200 bg-red-50' :
                alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                'border-blue-200 bg-blue-50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
                  <div className="mt-2 text-xs text-gray-500">
                    {alert.timestamp.toLocaleString()}
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  getSeverityColor(alert.severity)
                }`}>
                  {alert.severity}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊', component: OverviewTab },
    { id: 'resources', label: 'Resources', icon: '📦', component: ResourcesTab },
    { id: 'realtime', label: 'Real-Time', icon: '⚡', component: RealTimeTab },
    { id: 'alerts', label: 'Alerts', icon: '🚨', component: AlertsTab }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Performance Monitoring Dashboard
          </h1>
          <p className="text-gray-600">
            Real-time performance analytics and system health monitoring
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="rounded-lg border-gray-300 text-sm focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="5m">Last 5 minutes</option>
                <option value="1h">Last hour</option>
                <option value="24h">Last 24 hours</option>
                <option value="7d">Last 7 days</option>
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
                  {isRealTimeEnabled ? 'Live' : 'Paused'}
                </span>
              </div>
              
              <button
                onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isRealTimeEnabled
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {isRealTimeEnabled ? 'Pause' : 'Resume'} Monitoring
              </button>
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

export default PerformanceMonitoringDashboard;
