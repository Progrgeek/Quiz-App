/**
 * Analytics Storage System
 * Day 21: Data Storage Architecture
 * 
 * Handles local storage, data synchronization, export functionality,
 * and data privacy controls for the analytics system.
 */

class LocalDatabase {
  constructor(dbName) {
    this.dbName = dbName;
    this.version = 1;
    this.db = null;
    this.init();
  }

  async init() {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        // Fallback to localStorage for environments without IndexedDB
        this.useLocalStorage = true;
        resolve();
        return;
      }

      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create events store
        if (!db.objectStoreNames.contains('events')) {
          const eventsStore = db.createObjectStore('events', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          eventsStore.createIndex('userId', 'userId', { unique: false });
          eventsStore.createIndex('timestamp', 'timestamp', { unique: false });
          eventsStore.createIndex('type', 'type', { unique: false });
        }
        
        // Create sessions store
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionsStore = db.createObjectStore('sessions', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          sessionsStore.createIndex('userId', 'userId', { unique: false });
          sessionsStore.createIndex('startTime', 'startTime', { unique: false });
        }
        
        // Create sync queue store
        if (!db.objectStoreNames.contains('syncQueue')) {
          const syncStore = db.createObjectStore('syncQueue', { 
            keyPath: 'id', 
            autoIncrement: true 
          });
          syncStore.createIndex('timestamp', 'timestamp', { unique: false });
          syncStore.createIndex('retryCount', 'retryCount', { unique: false });
        }
      };
    });
  }

  async store(storeName, data) {
    if (this.useLocalStorage) {
      return this.storeInLocalStorage(storeName, data);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now(),
        id: data.id || Date.now() + Math.random()
      };
      
      const request = store.add(dataWithTimestamp);
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async query(storeName, filters = {}) {
    if (this.useLocalStorage) {
      return this.queryLocalStorage(storeName, filters);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readonly');
      const store = transaction.objectStore(storeName);
      const results = [];
      
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const data = cursor.value;
          
          // Apply filters
          let matches = true;
          for (const [key, value] of Object.entries(filters)) {
            if (key === 'userId' && data.userId !== value) {
              matches = false;
              break;
            }
            if (key === 'type' && data.type !== value) {
              matches = false;
              break;
            }
            if (key === 'startDate' && data.timestamp < value) {
              matches = false;
              break;
            }
            if (key === 'endDate' && data.timestamp > value) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            results.push(data);
          }
          
          cursor.continue();
        } else {
          resolve(results);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  async delete(storeName, filters = {}) {
    if (this.useLocalStorage) {
      return this.deleteFromLocalStorage(storeName, filters);
    }

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([storeName], 'readwrite');
      const store = transaction.objectStore(storeName);
      let deletedCount = 0;
      
      const request = store.openCursor();
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          const data = cursor.value;
          
          // Apply filters
          let matches = true;
          for (const [key, value] of Object.entries(filters)) {
            if (data[key] !== value) {
              matches = false;
              break;
            }
          }
          
          if (matches) {
            cursor.delete();
            deletedCount++;
          }
          
          cursor.continue();
        } else {
          resolve(deletedCount);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // LocalStorage fallback methods
  storeInLocalStorage(storeName, data) {
    try {
      const key = `${this.dbName}_${storeName}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      
      const dataWithTimestamp = {
        ...data,
        timestamp: Date.now(),
        id: data.id || Date.now() + Math.random()
      };
      
      existing.push(dataWithTimestamp);
      localStorage.setItem(key, JSON.stringify(existing));
      
      return Promise.resolve(dataWithTimestamp.id);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  queryLocalStorage(storeName, filters = {}) {
    try {
      const key = `${this.dbName}_${storeName}`;
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      
      return Promise.resolve(data.filter(item => {
        for (const [filterKey, filterValue] of Object.entries(filters)) {
          if (item[filterKey] !== filterValue) {
            return false;
          }
        }
        return true;
      }));
    } catch (error) {
      return Promise.reject(error);
    }
  }

  deleteFromLocalStorage(storeName, filters = {}) {
    try {
      const key = `${this.dbName}_${storeName}`;
      const data = JSON.parse(localStorage.getItem(key) || '[]');
      
      const filtered = data.filter(item => {
        for (const [filterKey, filterValue] of Object.entries(filters)) {
          if (item[filterKey] === filterValue) {
            return false; // Remove matching items
          }
        }
        return true; // Keep non-matching items
      });
      
      localStorage.setItem(key, JSON.stringify(filtered));
      return Promise.resolve(data.length - filtered.length);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}

class SyncQueue {
  constructor(storage) {
    this.storage = storage;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 second base delay
  }

  async add(event) {
    await this.storage.store('syncQueue', {
      event,
      retryCount: 0,
      addedAt: Date.now(),
      status: 'pending'
    });
  }

  async getAll() {
    return await this.storage.query('syncQueue', { status: 'pending' });
  }

  async markAsSynced(id) {
    // In a real implementation, we'd update the status
    // For now, we'll delete the synced item
    await this.storage.delete('syncQueue', { id });
  }

  async markAsFailed(id) {
    const items = await this.storage.query('syncQueue', { id });
    if (items.length > 0) {
      const item = items[0];
      item.retryCount = (item.retryCount || 0) + 1;
      item.lastRetry = Date.now();
      
      if (item.retryCount >= this.maxRetries) {
        item.status = 'failed';
      }
      
      // Store updated item (simplified implementation)
      await this.storage.delete('syncQueue', { id });
      await this.storage.store('syncQueue', item);
    }
  }

  async clear() {
    await this.storage.delete('syncQueue', {});
  }

  async getFailedItems() {
    return await this.storage.query('syncQueue', { status: 'failed' });
  }
}

class DataCompression {
  compress(data) {
    try {
      // Simple compression: remove unnecessary whitespace and compress common patterns
      const jsonString = JSON.stringify(data);
      
      // Replace common patterns to reduce size
      const compressed = jsonString
        .replace(/"timestamp":/g, '"t":')
        .replace(/"userId":/g, '"u":')
        .replace(/"sessionId":/g, '"s":')
        .replace(/"exerciseType":/g, '"e":')
        .replace(/"isCorrect":/g, '"c":')
        .replace(/"responseTime":/g, '"r":')
        .replace(/true/g, '1')
        .replace(/false/g, '0');
      
      return {
        data: compressed,
        compressed: true,
        originalSize: jsonString.length,
        compressedSize: compressed.length,
        compressionRatio: compressed.length / jsonString.length
      };
    } catch (error) {
      // Return original data if compression fails
      return {
        data: JSON.stringify(data),
        compressed: false,
        error: error.message
      };
    }
  }

  decompress(compressedData) {
    try {
      if (!compressedData.compressed) {
        return JSON.parse(compressedData.data);
      }
      
      // Reverse the compression
      const decompressed = compressedData.data
        .replace(/"t":/g, '"timestamp":')
        .replace(/"u":/g, '"userId":')
        .replace(/"s":/g, '"sessionId":')
        .replace(/"e":/g, '"exerciseType":')
        .replace(/"c":/g, '"isCorrect":')
        .replace(/"r":/g, '"responseTime":')
        .replace(/(?<!")1(?!")/g, 'true')
        .replace(/(?<!")0(?!")/g, 'false');
      
      return JSON.parse(decompressed);
    } catch (error) {
      console.error('Decompression failed:', error);
      return null;
    }
  }

  getCompressionStats(data) {
    const original = JSON.stringify(data);
    const compressed = this.compress(data);
    
    return {
      originalSize: original.length,
      compressedSize: compressed.compressedSize || original.length,
      savings: original.length - (compressed.compressedSize || original.length),
      ratio: (compressed.compressedSize || original.length) / original.length
    };
  }
}

import { SyncManager } from './SyncManager.js';

class AnalyticsStorage {
  constructor() {
    this.localDB = new LocalDatabase('quiz_analytics');
    this.syncQueue = new SyncQueue(this.localDB);
    this.compressionEngine = new DataCompression();
    this.syncManager = null; // Will be initialized after localDB
    this.syncInProgress = false;
    this.lastSyncTime = null;
    this.syncInterval = 5 * 60 * 1000; // 5 minutes
    
    this.init();
  }

  async init() {
    await this.localDB.init();
    
    // Initialize sync manager after database is ready
    this.syncManager = new SyncManager(this);
    
    this.startPeriodicSync();
  }

  // Store analytics event with compression
  async storeEvent(event) {
    try {
      const compressedEvent = this.compressionEngine.compress(event);
      const result = await this.localDB.store('events', compressedEvent);
      
      // Add to sync queue for server upload
      await this.syncQueue.add(event);
      
      return result;
    } catch (error) {
      console.error('Failed to store analytics event:', error);
      throw error;
    }
  }

  // Store session data
  async storeSession(sessionData) {
    try {
      const compressedSession = this.compressionEngine.compress(sessionData);
      const result = await this.localDB.store('sessions', compressedSession);
      
      // Add to sync queue
      await this.syncQueue.add({ type: 'session', data: sessionData });
      
      return result;
    } catch (error) {
      console.error('Failed to store session data:', error);
      throw error;
    }
  }

  // Get events with optional filtering
  async getEvents(filters = {}) {
    try {
      const compressedEvents = await this.localDB.query('events', filters);
      return compressedEvents.map(event => {
        const decompressed = this.compressionEngine.decompress(event);
        return decompressed || event; // Fallback to original if decompression fails
      });
    } catch (error) {
      console.error('Failed to retrieve events:', error);
      return [];
    }
  }

  // Get sessions with optional filtering
  async getSessions(filters = {}) {
    try {
      const compressedSessions = await this.localDB.query('sessions', filters);
      return compressedSessions.map(session => {
        const decompressed = this.compressionEngine.decompress(session);
        return decompressed || session;
      });
    } catch (error) {
      console.error('Failed to retrieve sessions:', error);
      return [];
    }
  }

  // Batch sync data to server (now uses SyncManager)
  async syncData() {
    if (this.syncManager) {
      return await this.syncManager.performSync();
    } else {
      // Fallback to original sync method if sync manager not ready
      return await this.legacySyncData();
    }
  }

  // Legacy sync method (kept as fallback)
  async legacySyncData() {
    if (this.syncInProgress) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    this.syncInProgress = true;
    
    try {
      const pendingEvents = await this.syncQueue.getAll();
      
      if (pendingEvents.length === 0) {
        console.log('No events to sync');
        return;
      }

      console.log(`Syncing ${pendingEvents.length} events...`);
      
      // Simulate server upload (replace with actual API call)
      const success = await this.uploadEvents(pendingEvents.map(item => item.event));
      
      if (success) {
        // Mark events as synced (remove from queue)
        for (const item of pendingEvents) {
          await this.syncQueue.markAsSynced(item.id);
        }
        
        this.lastSyncTime = Date.now();
        console.log('Sync completed successfully');
      } else {
        // Mark events for retry
        for (const item of pendingEvents) {
          await this.syncQueue.markAsFailed(item.id);
        }
        console.error('Sync failed, events marked for retry');
      }
    } catch (error) {
      console.error('Sync error:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  // Simulate server upload (replace with actual implementation)
  async uploadEvents(events) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
      
      // Simulate occasional failures for testing retry logic
      if (Math.random() < 0.1) { // 10% failure rate
        throw new Error('Simulated network error');
      }
      
      console.log(`Successfully uploaded ${events.length} events to server`);
      return true;
    } catch (error) {
      console.error('Upload failed:', error);
      return false;
    }
  }

  // Start periodic sync
  startPeriodicSync() {
    setInterval(() => {
      this.syncData();
    }, this.syncInterval);
    
    // Also sync on visibility change (when user returns to tab)
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', () => {
        if (!document.hidden && this.shouldSync()) {
          this.syncData();
        }
      });
    }
  }

  shouldSync() {
    if (!this.lastSyncTime) return true;
    return Date.now() - this.lastSyncTime > this.syncInterval;
  }

  // Export user data (GDPR compliance)
  async exportUserData(userId, includePersonalData = true) {
    try {
      const events = await this.getEvents({ userId });
      const sessions = await this.getSessions({ userId });
      
      const exportData = {
        userId,
        exportDate: new Date().toISOString(),
        events: includePersonalData ? events : this.anonymizeEvents(events),
        sessions: includePersonalData ? sessions : this.anonymizeSessions(sessions),
        statistics: this.generateStatistics(events, sessions)
      };
      
      return this.formatForExport(exportData);
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  // Delete user data (GDPR compliance)
  async deleteUserData(userId) {
    try {
      const eventsDeleted = await this.localDB.delete('events', { userId });
      const sessionsDeleted = await this.localDB.delete('sessions', { userId });
      
      // Also notify server about deletion
      await this.syncDeletion(userId);
      
      return {
        eventsDeleted,
        sessionsDeleted,
        deletionTime: new Date().toISOString()
      };
    } catch (error) {
      console.error('Failed to delete user data:', error);
      throw error;
    }
  }

  // Anonymize events for privacy
  anonymizeEvents(events) {
    return events.map(event => ({
      ...event,
      userId: 'anonymized',
      timestamp: Math.floor(event.timestamp / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000), // Round to day
      sessionId: 'anonymized'
    }));
  }

  // Anonymize sessions for privacy
  anonymizeSessions(sessions) {
    return sessions.map(session => ({
      ...session,
      userId: 'anonymized',
      startTime: Math.floor(session.startTime / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000),
      endTime: session.endTime ? Math.floor(session.endTime / (24 * 60 * 60 * 1000)) * (24 * 60 * 60 * 1000) : null
    }));
  }

  // Generate statistics for export
  generateStatistics(events, sessions) {
    return {
      totalEvents: events.length,
      totalSessions: sessions.length,
      firstActivity: events.length > 0 ? new Date(Math.min(...events.map(e => e.timestamp))) : null,
      lastActivity: events.length > 0 ? new Date(Math.max(...events.map(e => e.timestamp))) : null,
      exerciseTypes: [...new Set(events.map(e => e.exerciseType))],
      averageSessionDuration: sessions.length > 0 
        ? sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length 
        : 0
    };
  }

  // Format data for export (JSON download)
  formatForExport(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: 'application/json' 
    });
    
    return {
      blob,
      filename: `quiz-analytics-export-${data.userId}-${Date.now()}.json`,
      size: blob.size,
      data: data
    };
  }

  // Sync deletion with server
  async syncDeletion(userId) {
    try {
      // Simulate API call to delete user data on server
      console.log(`Syncing deletion of user ${userId} with server...`);
      
      // Add to sync queue with special deletion marker
      await this.syncQueue.add({
        type: 'user_deletion',
        userId,
        timestamp: Date.now()
      });
      
      return true;
    } catch (error) {
      console.error('Failed to sync deletion:', error);
      return false;
    }
  }

  // Get storage statistics
  async getStorageStats() {
    try {
      const events = await this.localDB.query('events');
      const sessions = await this.localDB.query('sessions');
      const syncQueue = await this.syncQueue.getAll();
      const failedItems = await this.syncQueue.getFailedItems();
      
      return {
        events: {
          count: events.length,
          size: JSON.stringify(events).length
        },
        sessions: {
          count: sessions.length,
          size: JSON.stringify(sessions).length
        },
        syncQueue: {
          pending: syncQueue.length,
          failed: failedItems.length
        },
        lastSync: this.lastSyncTime ? new Date(this.lastSyncTime) : null,
        compressionStats: this.getCompressionStats(events.concat(sessions))
      };
    } catch (error) {
      console.error('Failed to get storage stats:', error);
      return null;
    }
  }

  getCompressionStats(data) {
    if (data.length === 0) return null;
    
    const sample = data.slice(0, 10); // Sample first 10 items
    return this.compressionEngine.getCompressionStats(sample);
  }

  // Get sync status from SyncManager
  getSyncStatus() {
    if (this.syncManager) {
      return this.syncManager.getSyncStatus();
    }
    
    return {
      isActive: this.syncInProgress,
      lastSync: this.lastSyncTime,
      retryCount: 0,
      errors: [],
      isOnline: navigator.onLine
    };
  }

  // Force immediate sync
  async forceSync() {
    if (this.syncManager) {
      return await this.syncManager.forcSync();
    } else {
      return await this.syncData();
    }
  }

  // Update sync configuration
  updateSyncConfig(config) {
    if (this.syncManager) {
      this.syncManager.updateConfig(config);
    }
  }

  // Clear all data (for testing/reset)
  async clearAllData() {
    try {
      await this.localDB.delete('events', {});
      await this.localDB.delete('sessions', {});
      await this.syncQueue.clear();
      
      console.log('All analytics data cleared');
      return true;
    } catch (error) {
      console.error('Failed to clear data:', error);
      return false;
    }
  }
}

// Export singleton instance
export const analyticsStorage = new AnalyticsStorage();
export { AnalyticsStorage, LocalDatabase, SyncQueue, DataCompression };
