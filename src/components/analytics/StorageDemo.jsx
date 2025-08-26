import React, { useState, useEffect } from 'react';
import { analyticsStorage } from '../../analytics/storage/AnalyticsStorage.js';
import DataPrivacyControls from './DataPrivacyControls.jsx';

const StorageDemo = ({ userId = 'demo-user' }) => {
  const [storageStats, setStorageStats] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadData();
    
    // Refresh data every 5 seconds
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [stats, sync] = await Promise.all([
        analyticsStorage.getStorageStats(),
        analyticsStorage.getSyncStatus()
      ]);
      
      setStorageStats(stats);
      setSyncStatus(sync);
    } catch (error) {
      console.error('Failed to load storage data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTestData = async () => {
    try {
      setLoading(true);
      
      // Generate sample events
      const events = [];
      for (let i = 0; i < 10; i++) {
        events.push({
          userId,
          type: 'exercise_completed',
          exerciseType: ['multipleChoice', 'fillInTheBlanks', 'dragAndDrop'][Math.floor(Math.random() * 3)],
          isCorrect: Math.random() > 0.3,
          responseTime: 1000 + Math.random() * 5000,
          sessionId: `session_${Date.now()}`,
          timestamp: Date.now() - Math.random() * 86400000 // Random within last day
        });
      }
      
      // Store events
      for (const event of events) {
        await analyticsStorage.storeEvent(event);
      }
      
      // Generate sample session
      await analyticsStorage.storeSession({
        userId,
        startTime: Date.now() - 1000000,
        endTime: Date.now(),
        duration: 1000000,
        exerciseCount: events.length,
        correctAnswers: events.filter(e => e.isCorrect).length,
        averageResponseTime: events.reduce((sum, e) => sum + e.responseTime, 0) / events.length
      });
      
      console.log('Generated test data successfully');
      await loadData();
    } catch (error) {
      console.error('Failed to generate test data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForceSync = async () => {
    try {
      setLoading(true);
      await analyticsStorage.forceSync();
      await loadData();
    } catch (error) {
      console.error('Force sync failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      try {
        setLoading(true);
        await analyticsStorage.clearAllData();
        await loadData();
      } catch (error) {
        console.error('Failed to clear data:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getConnectionBadge = (connectionType) => {
    if (!connectionType) return <span className="text-gray-500">Unknown</span>;
    
    const typeColors = {
      'slow-2g': 'bg-red-100 text-red-800',
      '2g': 'bg-orange-100 text-orange-800',
      '3g': 'bg-yellow-100 text-yellow-800',
      '4g': 'bg-green-100 text-green-800'
    };
    
    const colorClass = typeColors[connectionType.effectiveType] || 'bg-gray-100 text-gray-800';
    
    return (
      <span className={`px-2 py-1 text-xs rounded ${colorClass}`}>
        {connectionType.effectiveType}
        {connectionType.saveData && ' (Data Saver)'}
      </span>
    );
  };

  if (loading && !storageStats) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-600">Loading storage information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Analytics Storage System Demo
        </h2>
        <p className="text-gray-600">
          Day 21: Data Storage Architecture - Local storage, synchronization, and privacy controls
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white rounded-lg border">
        <div className="border-b">
          <nav className="flex">
            {[
              { id: 'overview', label: 'Storage Overview', icon: '📊' },
              { id: 'sync', label: 'Sync Status', icon: '🔄' },
              { id: 'privacy', label: 'Privacy Controls', icon: '🛡️' },
              { id: 'actions', label: 'Data Actions', icon: '⚡' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
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
          {/* Storage Overview Tab */}
          {activeTab === 'overview' && storageStats && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Storage Statistics</h3>
              
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {storageStats.events.count}
                  </div>
                  <div className="text-sm text-blue-800">Events Stored</div>
                  <div className="text-xs text-blue-600 mt-1">
                    {formatBytes(storageStats.events.size)}
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {storageStats.sessions.count}
                  </div>
                  <div className="text-sm text-green-800">Sessions Stored</div>
                  <div className="text-xs text-green-600 mt-1">
                    {formatBytes(storageStats.sessions.size)}
                  </div>
                </div>
                
                <div className="bg-orange-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">
                    {storageStats.syncQueue.pending}
                  </div>
                  <div className="text-sm text-orange-800">Pending Sync</div>
                  <div className="text-xs text-orange-600 mt-1">
                    {storageStats.syncQueue.failed} failed
                  </div>
                </div>
                
                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">
                    {storageStats.lastSync 
                      ? new Date(storageStats.lastSync).toLocaleDateString() 
                      : 'Never'
                    }
                  </div>
                  <div className="text-sm text-purple-800">Last Sync</div>
                  <div className="text-xs text-purple-600 mt-1">
                    {storageStats.lastSync 
                      ? new Date(storageStats.lastSync).toLocaleTimeString()
                      : 'No sync yet'
                    }
                  </div>
                </div>
              </div>

              {/* Compression Stats */}
              {storageStats.compressionStats && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Compression Statistics</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">Compression Ratio:</span>
                      <div className="text-lg font-bold text-blue-600">
                        {(storageStats.compressionStats.ratio * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Space Saved:</span>
                      <div className="text-lg font-bold text-green-600">
                        {formatBytes(storageStats.compressionStats.savings)}
                      </div>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Original Size:</span>
                      <div className="text-lg font-bold text-gray-600">
                        {formatBytes(storageStats.compressionStats.originalSize)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Sync Status Tab */}
          {activeTab === 'sync' && syncStatus && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Synchronization Status</h3>
              
              {/* Sync Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${
                      syncStatus.isOnline ? 'bg-green-500' : 'bg-red-500'
                    }`}></span>
                    <span className="font-medium">
                      {syncStatus.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${
                      syncStatus.isActive ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                    }`}></span>
                    <span className="font-medium">
                      {syncStatus.isActive ? 'Sync Active' : 'Sync Idle'}
                    </span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Connection Type:</span>
                    <div className="mt-1">
                      {getConnectionBadge(syncStatus.connectionType)}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <span className="font-medium text-gray-700">Last Sync:</span>
                    <div className="text-sm text-gray-600">
                      {syncStatus.lastSync 
                        ? new Date(syncStatus.lastSync).toLocaleString()
                        : 'Never synced'
                      }
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Retry Count:</span>
                    <div className="text-sm text-gray-600">
                      {syncStatus.retryCount} attempts
                    </div>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Sync Errors:</span>
                    <div className="text-sm text-gray-600">
                      {syncStatus.errors.length} recent errors
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Sync Errors */}
              {syncStatus.errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Recent Sync Errors</h4>
                  <div className="space-y-2">
                    {syncStatus.errors.slice(-3).map((error, index) => (
                      <div key={index} className="text-sm text-red-700">
                        <span className="font-medium">
                          {new Date(error.timestamp).toLocaleTimeString()}:
                        </span>{' '}
                        {error.error}
                        {error.retryCount > 0 && (
                          <span className="text-red-600"> (Retry {error.retryCount})</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sync Configuration */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-3">Sync Configuration</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Auto Sync:</span>
                    <div>{syncStatus.config?.autoSync ? 'Enabled' : 'Disabled'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Batch Size:</span>
                    <div>{syncStatus.config?.batchSize || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Max Retries:</span>
                    <div>{syncStatus.config?.maxRetries || 'N/A'}</div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Conflict Strategy:</span>
                    <div>{syncStatus.config?.conflictStrategy || 'N/A'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Controls Tab */}
          {activeTab === 'privacy' && (
            <DataPrivacyControls userId={userId} />
          )}

          {/* Data Actions Tab */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800">Data Management Actions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Testing & Development</h4>
                  
                  <button
                    onClick={handleGenerateTestData}
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded font-medium transition-colors"
                  >
                    {loading ? '⚙️ Generating...' : '🧪 Generate Test Data'}
                  </button>
                  
                  <button
                    onClick={loadData}
                    disabled={loading}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-4 py-3 rounded font-medium transition-colors"
                  >
                    {loading ? '⏳ Loading...' : '🔄 Refresh Data'}
                  </button>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-700">Sync & Storage</h4>
                  
                  <button
                    onClick={handleForceSync}
                    disabled={loading || !syncStatus?.isOnline}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white px-4 py-3 rounded font-medium transition-colors"
                  >
                    {loading ? '⚙️ Syncing...' : '🚀 Force Sync Now'}
                  </button>
                  
                  <button
                    onClick={handleClearData}
                    disabled={loading}
                    className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-4 py-3 rounded font-medium transition-colors"
                  >
                    {loading ? '⚙️ Clearing...' : '🗑️ Clear All Data'}
                  </button>
                </div>
              </div>

              {/* Storage Implementation Details */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">📋 Implementation Features</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700">
                  <div className="space-y-1">
                    <div>✅ IndexedDB with LocalStorage fallback</div>
                    <div>✅ Data compression and optimization</div>
                    <div>✅ Offline-first synchronization</div>
                    <div>✅ Conflict resolution strategies</div>
                  </div>
                  <div className="space-y-1">
                    <div>✅ GDPR compliance (export/delete)</div>
                    <div>✅ Bandwidth optimization</div>
                    <div>✅ Retry logic with exponential backoff</div>
                    <div>✅ Real-time sync status monitoring</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StorageDemo;
