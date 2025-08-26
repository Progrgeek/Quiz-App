/**
 * 🌐 Internationalization Dashboard
 * Phase 6: Advanced multi-language management and monitoring interface
 */

import React, { useState, useEffect } from 'react';
import AdvancedI18nSystem from '../../i18n/advanced/AdvancedI18nSystem';
import ContentLocalizationEngine from '../../i18n/advanced/ContentLocalizationEngine';

const InternationalizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [i18nSystem, setI18nSystem] = useState(null);
  const [localizationEngine, setLocalizationEngine] = useState(null);
  const [languageStats, setLanguageStats] = useState(null);
  const [localizationStats, setLocalizationStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeI18nSystems();
  }, []);

  const initializeI18nSystems = async () => {
    try {
      const i18n = new AdvancedI18nSystem();
      const locEngine = new ContentLocalizationEngine();
      
      const i18nInstance = await i18n.initialize();
      
      setI18nSystem(i18n);
      setLocalizationEngine(locEngine);
      setLanguageStats(i18n.getLocalizationStatistics());
      setLocalizationStats(await locEngine.getLocalizationCapabilities());
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to initialize i18n systems:', error);
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '🌍' },
    { id: 'languages', label: 'Languages', icon: '🗣️' },
    { id: 'localization', label: 'Localization', icon: '🔄' },
    { id: 'quality', label: 'Quality', icon: '✅' },
    { id: 'cultural', label: 'Cultural', icon: '🎭' },
    { id: 'performance', label: 'Performance', icon: '⚡' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Initializing Internationalization Systems...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🌐 Internationalization Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Advanced multi-language management and cultural adaptation platform
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {activeTab === 'overview' && <OverviewTab languageStats={languageStats} />}
          {activeTab === 'languages' && <LanguagesTab i18nSystem={i18nSystem} />}
          {activeTab === 'localization' && <LocalizationTab localizationEngine={localizationEngine} />}
          {activeTab === 'quality' && <QualityTab />}
          {activeTab === 'cultural' && <CulturalTab />}
          {activeTab === 'performance' && <PerformanceTab />}
        </div>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ languageStats }) => {
  const [systemHealth, setSystemHealth] = useState({
    overall: 95,
    translation: 92,
    localization: 88,
    performance: 96
  });

  const quickStats = [
    { label: 'Supported Languages', value: languageStats?.totalLanguages || 0, change: '+3', icon: '🌍' },
    { label: 'Localized Content', value: '85%', change: '+12%', icon: '📄' },
    { label: 'Cultural Adaptations', value: '127', change: '+8', icon: '🎭' },
    { label: 'Translation Quality', value: '94%', change: '+2%', icon: '✅' }
  ];

  return (
    <div className="space-y-6">
      {/* System Health */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {Object.entries(systemHealth).map(([metric, value]) => (
            <div key={metric} className="text-center">
              <div className="relative w-16 h-16 mx-auto mb-2">
                <svg className="w-16 h-16 transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke={value >= 90 ? "#10b981" : value >= 80 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray={`${(value / 100) * 175.84} 175.84`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-gray-900">{value}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-700 capitalize">{metric}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="text-2xl mr-3">{stat.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <div className="flex items-center">
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  <span className="ml-2 text-sm text-green-600">
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {[
            { action: 'German localization completed', time: '2 hours ago', status: 'success' },
            { action: 'Arabic RTL layout implemented', time: '4 hours ago', status: 'success' },
            { action: 'Japanese content review in progress', time: '6 hours ago', status: 'pending' },
            { action: 'French cultural adaptation updated', time: '1 day ago', status: 'success' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`w-2 h-2 rounded-full ${
                activity.status === 'success' ? 'bg-green-500' : 
                activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
              }`}></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.action}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Languages Tab Component
const LanguagesTab = ({ i18nSystem }) => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [languageStatuses, setLanguageStatuses] = useState([]);

  useEffect(() => {
    if (i18nSystem) {
      const statuses = i18nSystem.getLanguageStatus();
      setLanguageStatuses(statuses);
    }
  }, [i18nSystem]);

  const getStatusColor = (status) => {
    const colors = {
      'complete': 'bg-green-100 text-green-800',
      'in_progress': 'bg-blue-100 text-blue-800',
      'planned': 'bg-yellow-100 text-yellow-800',
      'research': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.research;
  };

  return (
    <div className="space-y-6">
      {/* Language Grid */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Supported Languages</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {languageStatuses.map((language) => (
            <div
              key={language.code}
              className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedLanguage(language)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{language.flag}</span>
                  <span className="font-medium text-gray-900">{language.name}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(language.status)}`}>
                  {language.status.replace('_', ' ')}
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Coverage:</span>
                  <span className="font-medium">{language.coverage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Priority:</span>
                  <span className="font-medium">#{language.priority}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Region:</span>
                  <span className="font-medium capitalize">{language.region.replace('_', ' ')}</span>
                </div>
                {language.rtl && (
                  <div className="text-xs text-blue-600 mt-1">
                    ← RTL Support
                  </div>
                )}
              </div>
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: language.coverage }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Language Details Modal */}
      {selectedLanguage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{selectedLanguage.flag}</span>
                  <h3 className="text-xl font-bold text-gray-900">{selectedLanguage.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedLanguage(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Language Code</p>
                    <p className="text-lg text-gray-900">{selectedLanguage.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedLanguage.status)}`}>
                      {selectedLanguage.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Coverage</p>
                    <p className="text-lg text-gray-900">{selectedLanguage.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Priority</p>
                    <p className="text-lg text-gray-900">#{selectedLanguage.priority}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2">Features</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguage.rtl && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        RTL Support
                      </span>
                    )}
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      Unicode Support
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Cultural Adaptation
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Localization Tab Component
const LocalizationTab = ({ localizationEngine }) => {
  const [localizationJobs, setLocalizationJobs] = useState([
    { id: 1, content: 'Exercise Set A', languages: ['de', 'fr'], status: 'in_progress', progress: 75 },
    { id: 2, content: 'UI Components', languages: ['es', 'pt'], status: 'completed', progress: 100 },
    { id: 3, content: 'Help Documentation', languages: ['zh', 'ja'], status: 'queued', progress: 0 },
    { id: 4, content: 'Error Messages', languages: ['ar', 'hi'], status: 'in_progress', progress: 45 }
  ]);

  const getStatusIcon = (status) => {
    const icons = {
      'completed': '✅',
      'in_progress': '🔄',
      'queued': '⏳',
      'failed': '❌'
    };
    return icons[status] || '📝';
  };

  return (
    <div className="space-y-6">
      {/* Localization Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">📊</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Active Jobs</p>
              <p className="text-2xl font-bold text-gray-900">
                {localizationJobs.filter(job => job.status === 'in_progress').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">✅</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {localizationJobs.filter(job => job.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <div className="text-2xl mr-3">⏳</div>
            <div>
              <p className="text-sm font-medium text-gray-600">Queued</p>
              <p className="text-2xl font-bold text-gray-900">
                {localizationJobs.filter(job => job.status === 'queued').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Localization Jobs */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Localization Jobs</h3>
        <div className="space-y-4">
          {localizationJobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <span className="text-lg">{getStatusIcon(job.status)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900">{job.content}</h4>
                    <p className="text-sm text-gray-600">
                      Languages: {job.languages.join(', ').toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900 capitalize">{job.status.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-600">{job.progress}% complete</p>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    job.status === 'completed' ? 'bg-green-500' :
                    job.status === 'in_progress' ? 'bg-blue-500' :
                    job.status === 'failed' ? 'bg-red-500' : 'bg-gray-400'
                  }`}
                  style={{ width: `${job.progress}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Quality Tab Component
const QualityTab = () => {
  const qualityMetrics = [
    { metric: 'Translation Accuracy', score: 94, target: 90, trend: '+2%' },
    { metric: 'Cultural Appropriateness', score: 88, target: 85, trend: '+5%' },
    { metric: 'Technical Quality', score: 96, target: 95, trend: '+1%' },
    { metric: 'User Satisfaction', score: 91, target: 88, trend: '+3%' }
  ];

  return (
    <div className="space-y-6">
      {/* Quality Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Metrics</h3>
        <div className="space-y-4">
          {qualityMetrics.map((metric, index) => (
            <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-green-600">{metric.trend}</span>
                  <span className="font-bold text-gray-900">{metric.score}%</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${
                    metric.score >= metric.target ? 'bg-green-500' : 'bg-yellow-500'
                  }`}
                  style={{ width: `${metric.score}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Target: {metric.target}%</span>
                <span>{metric.score >= metric.target ? 'Above target' : 'Below target'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Cultural Tab Component
const CulturalTab = () => {
  const culturalAdaptations = [
    { region: 'North America', adaptations: 42, status: 'Active', lastUpdate: '2024-01-15' },
    { region: 'Europe', adaptations: 38, status: 'Active', lastUpdate: '2024-01-14' },
    { region: 'Asia Pacific', adaptations: 29, status: 'In Progress', lastUpdate: '2024-01-13' },
    { region: 'Middle East', adaptations: 15, status: 'Planning', lastUpdate: '2024-01-12' },
    { region: 'Latin America', adaptations: 33, status: 'Active', lastUpdate: '2024-01-11' }
  ];

  return (
    <div className="space-y-6">
      {/* Cultural Adaptations */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Cultural Adaptations by Region</h3>
        <div className="space-y-4">
          {culturalAdaptations.map((region, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{region.region}</h4>
                <p className="text-sm text-gray-600">{region.adaptations} adaptations</p>
              </div>
              <div className="text-right">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  region.status === 'Active' ? 'bg-green-100 text-green-800' :
                  region.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {region.status}
                </span>
                <p className="text-xs text-gray-500 mt-1">Updated: {region.lastUpdate}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Performance Tab Component
const PerformanceTab = () => {
  const performanceData = [
    { metric: 'Translation Load Time', value: '120ms', target: '150ms', status: 'good' },
    { metric: 'Language Switch Time', value: '45ms', target: '50ms', status: 'excellent' },
    { metric: 'Content Rendering', value: '230ms', target: '200ms', status: 'warning' },
    { metric: 'Font Loading', value: '85ms', target: '100ms', status: 'good' }
  ];

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
        <div className="space-y-4">
          {performanceData.map((metric, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{metric.metric}</h4>
                <p className="text-sm text-gray-600">Target: {metric.target}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  metric.status === 'excellent' ? 'bg-green-100 text-green-800' :
                  metric.status === 'good' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {metric.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InternationalizationDashboard;
