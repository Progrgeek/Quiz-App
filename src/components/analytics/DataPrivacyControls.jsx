import React, { useState, useEffect } from 'react';
import { analyticsStorage } from '../../analytics/storage/AnalyticsStorage.js';

const DataPrivacyControls = ({ userId }) => {
  const [storageStats, setStorageStats] = useState(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [exportResult, setExportResult] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [privacySettings, setPrivacySettings] = useState({
    shareAnalytics: true,
    includePersonalData: true,
    allowCookies: true,
    autoSync: true
  });

  useEffect(() => {
    loadStorageStats();
    loadPrivacySettings();
  }, [userId]);

  const loadStorageStats = async () => {
    try {
      const stats = await analyticsStorage.getStorageStats();
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const loadPrivacySettings = () => {
    try {
      const saved = localStorage.getItem(`privacy_settings_${userId}`);
      if (saved) {
        setPrivacySettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Failed to load privacy settings:', error);
    }
  };

  const savePrivacySettings = (newSettings) => {
    try {
      setPrivacySettings(newSettings);
      localStorage.setItem(`privacy_settings_${userId}`, JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    }
  };

  const handleExportData = async () => {
    setIsExporting(true);
    setExportResult(null);
    
    try {
      const exportData = await analyticsStorage.exportUserData(
        userId, 
        privacySettings.includePersonalData
      );
      
      // Create download link
      const url = URL.createObjectURL(exportData.blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = exportData.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setExportResult({
        success: true,
        filename: exportData.filename,
        size: exportData.size,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Export failed:', error);
      setExportResult({
        success: false,
        error: error.message,
        timestamp: new Date()
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteData = async () => {
    setIsDeleting(true);
    
    try {
      const result = await analyticsStorage.deleteUserData(userId);
      console.log('Data deletion result:', result);
      
      // Refresh stats after deletion
      await loadStorageStats();
      setShowDeleteConfirm(false);
      
      // Show success message
      alert(`Successfully deleted ${result.eventsDeleted} events and ${result.sessionsDeleted} sessions.`);
    } catch (error) {
      console.error('Deletion failed:', error);
      alert('Failed to delete data. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSyncNow = async () => {
    try {
      await analyticsStorage.syncData();
      await loadStorageStats();
    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-6">Data Privacy Controls</h3>
      
      {/* Privacy Settings */}
      <div className="mb-8">
        <h4 className="text-lg font-medium text-gray-700 mb-4">Privacy Settings</h4>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-gray-800">Share Analytics Data</div>
              <div className="text-sm text-gray-600">
                Allow anonymous analytics to improve the app
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.shareAnalytics}
                onChange={(e) => savePrivacySettings({
                  ...privacySettings,
                  shareAnalytics: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-gray-800">Include Personal Data in Exports</div>
              <div className="text-sm text-gray-600">
                Include user ID and exact timestamps in data exports
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.includePersonalData}
                onChange={(e) => savePrivacySettings({
                  ...privacySettings,
                  includePersonalData: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-gray-800">Allow Cookies</div>
              <div className="text-sm text-gray-600">
                Store preferences and settings in browser cookies
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.allowCookies}
                onChange={(e) => savePrivacySettings({
                  ...privacySettings,
                  allowCookies: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <div className="font-medium text-gray-800">Auto Sync</div>
              <div className="text-sm text-gray-600">
                Automatically sync data with cloud servers
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={privacySettings.autoSync}
                onChange={(e) => savePrivacySettings({
                  ...privacySettings,
                  autoSync: e.target.checked
                })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Data Storage Information */}
      {storageStats && (
        <div className="mb-8">
          <h4 className="text-lg font-medium text-gray-700 mb-4">Data Storage Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600">
                {storageStats.events.count}
              </div>
              <div className="text-sm text-blue-800">Events Stored</div>
              <div className="text-xs text-blue-600">
                {formatBytes(storageStats.events.size)}
              </div>
            </div>
            
            <div className="bg-green-50 p-4 rounded">
              <div className="text-2xl font-bold text-green-600">
                {storageStats.sessions.count}
              </div>
              <div className="text-sm text-green-800">Sessions Stored</div>
              <div className="text-xs text-green-600">
                {formatBytes(storageStats.sessions.size)}
              </div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded">
              <div className="text-2xl font-bold text-orange-600">
                {storageStats.syncQueue.pending}
              </div>
              <div className="text-sm text-orange-800">Pending Sync</div>
              <div className="text-xs text-orange-600">
                {storageStats.syncQueue.failed} failed
              </div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded">
              <div className="text-2xl font-bold text-purple-600">
                {storageStats.lastSync 
                  ? new Date(storageStats.lastSync).toLocaleDateString() 
                  : 'Never'
                }
              </div>
              <div className="text-sm text-purple-800">Last Sync</div>
              <div className="text-xs text-purple-600">
                {storageStats.lastSync 
                  ? new Date(storageStats.lastSync).toLocaleTimeString()
                  : 'No sync yet'
                }
              </div>
            </div>
          </div>
          
          {storageStats.compressionStats && (
            <div className="mt-4 p-3 bg-gray-50 rounded">
              <div className="text-sm font-medium text-gray-700 mb-2">
                Compression Statistics
              </div>
              <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                <div>
                  <span className="font-medium">Compression Ratio:</span>{' '}
                  {(storageStats.compressionStats.ratio * 100).toFixed(1)}%
                </div>
                <div>
                  <span className="font-medium">Space Saved:</span>{' '}
                  {formatBytes(storageStats.compressionStats.savings)}
                </div>
                <div>
                  <span className="font-medium">Original Size:</span>{' '}
                  {formatBytes(storageStats.compressionStats.originalSize)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Data Actions */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium text-gray-700">Data Management Actions</h4>
        
        <div className="flex flex-wrap gap-4">
          {/* Export Data */}
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            {isExporting ? (
              <>
                <span className="inline-block animate-spin mr-2">⏳</span>
                Exporting...
              </>
            ) : (
              '📥 Export My Data'
            )}
          </button>
          
          {/* Sync Now */}
          <button
            onClick={handleSyncNow}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            🔄 Sync Now
          </button>
          
          {/* Delete Data */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded font-medium transition-colors"
          >
            🗑️ Delete My Data
          </button>
        </div>
        
        {/* Export Result */}
        {exportResult && (
          <div className={`p-3 rounded ${
            exportResult.success 
              ? 'bg-green-50 border border-green-200 text-green-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            {exportResult.success ? (
              <div>
                <div className="font-medium">✅ Export Successful</div>
                <div className="text-sm">
                  File: {exportResult.filename} ({formatBytes(exportResult.size)})
                </div>
                <div className="text-xs">
                  Exported at: {exportResult.timestamp.toLocaleString()}
                </div>
              </div>
            ) : (
              <div>
                <div className="font-medium">❌ Export Failed</div>
                <div className="text-sm">{exportResult.error}</div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-red-600 mb-4">
              ⚠️ Confirm Data Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              This action will permanently delete all your stored analytics data, 
              including events, sessions, and progress history. This action cannot be undone.
            </p>
            <div className="text-sm text-gray-600 mb-6">
              <strong>Data to be deleted:</strong>
              <ul className="list-disc list-inside mt-2">
                <li>{storageStats?.events.count || 0} events</li>
                <li>{storageStats?.sessions.count || 0} sessions</li>
                <li>All progress history</li>
                <li>Local storage data</li>
              </ul>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteData}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white py-2 px-4 rounded transition-colors"
              >
                {isDeleting ? (
                  <>
                    <span className="inline-block animate-spin mr-2">⏳</span>
                    Deleting...
                  </>
                ) : (
                  'Delete All Data'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* GDPR Compliance Notice */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
        <h5 className="font-medium text-blue-800 mb-2">🛡️ Your Privacy Rights</h5>
        <div className="text-sm text-blue-700 space-y-1">
          <p>• <strong>Right to Access:</strong> Export your data at any time</p>
          <p>• <strong>Right to Deletion:</strong> Permanently delete all your data</p>
          <p>• <strong>Right to Portability:</strong> Download your data in JSON format</p>
          <p>• <strong>Right to Rectification:</strong> Control what data is collected</p>
        </div>
        <div className="mt-3 text-xs text-blue-600">
          We comply with GDPR, CCPA, and other privacy regulations. 
          Your data is stored locally and only synced with your consent.
        </div>
      </div>
    </div>
  );
};

export default DataPrivacyControls;
