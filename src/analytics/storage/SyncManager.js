/**
 * Data Synchronization Manager
 * Day 21: Advanced Sync Features
 * 
 * Handles intelligent data synchronization with conflict resolution,
 * offline support, and bandwidth optimization.
 */

class NetworkMonitor {
  constructor() {
    this.isOnline = navigator.onLine;
    this.connectionType = this.getConnectionType();
    this.listeners = new Set();
    
    this.setupEventListeners();
  }

  setupEventListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.notifyListeners({ type: 'online' });
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.notifyListeners({ type: 'offline' });
    });

    // Monitor connection changes
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', () => {
        this.connectionType = this.getConnectionType();
        this.notifyListeners({ 
          type: 'connection-change', 
          connectionType: this.connectionType 
        });
      });
    }
  }

  getConnectionType() {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType,
        downlink: connection.downlink,
        rtt: connection.rtt,
        saveData: connection.saveData
      };
    }
    return null;
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Network listener error:', error);
      }
    });
  }

  isSlowConnection() {
    if (!this.connectionType) return false;
    
    const slowTypes = ['slow-2g', '2g'];
    return slowTypes.includes(this.connectionType.effectiveType) || 
           this.connectionType.saveData;
  }

  getOptimalBatchSize() {
    if (!this.isOnline) return 0;
    if (this.isSlowConnection()) return 5;
    
    switch (this.connectionType?.effectiveType) {
      case '3g': return 20;
      case '4g': return 50;
      default: return 30;
    }
  }
}

class ConflictResolver {
  constructor() {
    this.strategies = new Map([
      ['last-write-wins', this.lastWriteWins.bind(this)],
      ['merge-data', this.mergeData.bind(this)],
      ['user-choice', this.userChoice.bind(this)],
      ['smart-merge', this.smartMerge.bind(this)]
    ]);
  }

  async resolve(localData, serverData, strategy = 'smart-merge') {
    const resolver = this.strategies.get(strategy);
    if (!resolver) {
      throw new Error(`Unknown conflict resolution strategy: ${strategy}`);
    }
    
    return await resolver(localData, serverData);
  }

  lastWriteWins(localData, serverData) {
    const localTime = localData.lastModified || localData.timestamp;
    const serverTime = serverData.lastModified || serverData.timestamp;
    
    return localTime > serverTime ? localData : serverData;
  }

  mergeData(localData, serverData) {
    // Simple merge strategy - combine arrays, merge objects
    const merged = { ...serverData, ...localData };
    
    // Special handling for arrays
    Object.keys(merged).forEach(key => {
      if (Array.isArray(localData[key]) && Array.isArray(serverData[key])) {
        const combined = [...serverData[key], ...localData[key]];
        merged[key] = this.deduplicateArray(combined);
      }
    });
    
    merged.lastModified = Math.max(
      localData.lastModified || 0,
      serverData.lastModified || 0
    );
    
    return merged;
  }

  async userChoice(localData, serverData) {
    // In a real app, this would show a UI dialog
    return new Promise((resolve) => {
      const choice = confirm(
        'Data conflict detected. Use local data? (Cancel for server data)'
      );
      resolve(choice ? localData : serverData);
    });
  }

  smartMerge(localData, serverData) {
    // Intelligent merge based on data type and context
    const result = { ...localData };
    
    // Merge analytics events intelligently
    if (localData.events && serverData.events) {
      result.events = this.mergeEvents(localData.events, serverData.events);
    }
    
    // Merge session data
    if (localData.sessions && serverData.sessions) {
      result.sessions = this.mergeSessions(localData.sessions, serverData.sessions);
    }
    
    // For numerical data, take the maximum (assuming it's cumulative)
    ['totalScore', 'totalTime', 'exerciseCount'].forEach(key => {
      if (typeof localData[key] === 'number' && typeof serverData[key] === 'number') {
        result[key] = Math.max(localData[key], serverData[key]);
      }
    });
    
    // For dates, take the latest
    ['lastActivity', 'createdAt'].forEach(key => {
      if (localData[key] && serverData[key]) {
        result[key] = new Date(Math.max(
          new Date(localData[key]).getTime(),
          new Date(serverData[key]).getTime()
        )).toISOString();
      }
    });
    
    result.lastModified = Date.now();
    result.mergeStrategy = 'smart-merge';
    
    return result;
  }

  mergeEvents(localEvents, serverEvents) {
    const combined = [...serverEvents, ...localEvents];
    return this.deduplicateArray(combined, 'id');
  }

  mergeSessions(localSessions, serverSessions) {
    const combined = [...serverSessions, ...localSessions];
    return this.deduplicateArray(combined, 'id');
  }

  deduplicateArray(array, keyField = 'id') {
    const seen = new Set();
    return array.filter(item => {
      const key = keyField ? item[keyField] : JSON.stringify(item);
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

class SyncManager {
  constructor(storage) {
    this.storage = storage;
    this.networkMonitor = new NetworkMonitor();
    this.conflictResolver = new ConflictResolver();
    
    this.syncState = {
      isActive: false,
      lastSync: null,
      retryCount: 0,
      errors: []
    };
    
    this.config = {
      maxRetries: 5,
      retryDelay: 1000,
      batchSize: 30,
      conflictStrategy: 'smart-merge',
      enableOfflineQueue: true,
      autoSync: true,
      syncInterval: 5 * 60 * 1000 // 5 minutes
    };
    
    this.setupNetworkHandling();
    this.startAutoSync();
  }

  setupNetworkHandling() {
    this.networkMonitor.addListener((event) => {
      switch (event.type) {
        case 'online':
          console.log('Network restored, resuming sync...');
          this.syncWhenOnline();
          break;
        case 'offline':
          console.log('Network lost, queuing changes...');
          break;
        case 'connection-change':
          console.log('Connection changed:', event.connectionType);
          this.adjustSyncStrategy();
          break;
      }
    });
  }

  async syncWhenOnline() {
    if (this.networkMonitor.isOnline && !this.syncState.isActive) {
      await this.performSync();
    }
  }

  adjustSyncStrategy() {
    const optimalBatchSize = this.networkMonitor.getOptimalBatchSize();
    if (optimalBatchSize !== this.config.batchSize) {
      this.config.batchSize = optimalBatchSize;
      console.log(`Adjusted batch size to ${optimalBatchSize} for current connection`);
    }
  }

  startAutoSync() {
    if (this.config.autoSync) {
      setInterval(() => {
        if (this.networkMonitor.isOnline) {
          this.performSync();
        }
      }, this.config.syncInterval);
    }
  }

  async performSync() {
    if (this.syncState.isActive) {
      console.log('Sync already in progress, skipping...');
      return;
    }

    if (!this.networkMonitor.isOnline) {
      console.log('Offline, deferring sync...');
      return;
    }

    this.syncState.isActive = true;
    this.syncState.errors = [];

    try {
      console.log('Starting sync operation...');
      
      // Step 1: Get pending data
      const pendingData = await this.getPendingData();
      
      if (pendingData.length === 0) {
        console.log('No data to sync');
        this.syncState.lastSync = Date.now();
        return;
      }

      console.log(`Syncing ${pendingData.length} items...`);

      // Step 2: Process in batches
      const batches = this.createBatches(pendingData, this.config.batchSize);
      
      for (const batch of batches) {
        await this.syncBatch(batch);
      }

      // Step 3: Handle conflicts if any
      await this.resolveConflicts();

      this.syncState.lastSync = Date.now();
      this.syncState.retryCount = 0;
      
      console.log('Sync completed successfully');
      
    } catch (error) {
      console.error('Sync failed:', error);
      this.handleSyncError(error);
    } finally {
      this.syncState.isActive = false;
    }
  }

  async getPendingData() {
    try {
      const syncQueue = await this.storage.syncQueue.getAll();
      return syncQueue.filter(item => item.status !== 'synced');
    } catch (error) {
      console.error('Failed to get pending data:', error);
      return [];
    }
  }

  createBatches(data, batchSize) {
    const batches = [];
    for (let i = 0; i < data.length; i += batchSize) {
      batches.push(data.slice(i, i + batchSize));
    }
    return batches;
  }

  async syncBatch(batch) {
    try {
      // Upload batch to server
      const response = await this.uploadBatch(batch);
      
      if (response.success) {
        // Mark items as synced
        for (const item of batch) {
          await this.storage.syncQueue.markAsSynced(item.id);
        }
      } else {
        throw new Error(response.error || 'Batch upload failed');
      }
      
    } catch (error) {
      console.error('Batch sync failed:', error);
      
      // Mark items for retry
      for (const item of batch) {
        await this.storage.syncQueue.markAsFailed(item.id);
      }
      
      throw error;
    }
  }

  async uploadBatch(batch) {
    try {
      // Simulate API call to server
      await new Promise(resolve => setTimeout(resolve, 200 + Math.random() * 300));
      
      // Simulate occasional failures
      if (Math.random() < 0.05) { // 5% failure rate
        throw new Error('Simulated server error');
      }
      
      return {
        success: true,
        uploadedCount: batch.length,
        timestamp: Date.now()
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async resolveConflicts() {
    try {
      // Check for conflicts with server data
      const serverData = await this.fetchServerData();
      const localData = await this.getLocalData();
      
      if (this.hasConflicts(localData, serverData)) {
        console.log('Conflicts detected, resolving...');
        
        const resolved = await this.conflictResolver.resolve(
          localData,
          serverData,
          this.config.conflictStrategy
        );
        
        await this.updateLocalData(resolved);
        await this.uploadResolution(resolved);
        
        console.log('Conflicts resolved successfully');
      }
      
    } catch (error) {
      console.error('Conflict resolution failed:', error);
    }
  }

  async fetchServerData() {
    // Simulate fetching server data
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          lastModified: Date.now() - 1000,
          events: [],
          sessions: []
        });
      }, 100);
    });
  }

  async getLocalData() {
    try {
      const events = await this.storage.getEvents();
      const sessions = await this.storage.getSessions();
      
      return {
        lastModified: Date.now(),
        events,
        sessions
      };
    } catch (error) {
      console.error('Failed to get local data:', error);
      return { events: [], sessions: [] };
    }
  }

  hasConflicts(localData, serverData) {
    // Simple conflict detection based on modification times
    const localTime = localData.lastModified || 0;
    const serverTime = serverData.lastModified || 0;
    
    // Consider it a conflict if both have been modified recently
    const timeDiff = Math.abs(localTime - serverTime);
    return timeDiff < 60000; // Within 1 minute
  }

  async updateLocalData(data) {
    // Update local storage with resolved data
    try {
      if (data.events) {
        for (const event of data.events) {
          await this.storage.storeEvent(event);
        }
      }
      
      if (data.sessions) {
        for (const session of data.sessions) {
          await this.storage.storeSession(session);
        }
      }
    } catch (error) {
      console.error('Failed to update local data:', error);
    }
  }

  async uploadResolution(data) {
    // Upload resolved data to server
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('Resolution uploaded to server');
    } catch (error) {
      console.error('Failed to upload resolution:', error);
    }
  }

  handleSyncError(error) {
    this.syncState.retryCount++;
    this.syncState.errors.push({
      error: error.message,
      timestamp: Date.now(),
      retryCount: this.syncState.retryCount
    });

    if (this.syncState.retryCount < this.config.maxRetries) {
      const delay = this.config.retryDelay * Math.pow(2, this.syncState.retryCount - 1);
      console.log(`Retrying sync in ${delay}ms (attempt ${this.syncState.retryCount})`);
      
      setTimeout(() => {
        this.performSync();
      }, delay);
    } else {
      console.error('Max retry attempts reached, giving up sync');
    }
  }

  // Public API methods
  async forcSync() {
    console.log('Force sync requested');
    await this.performSync();
  }

  getSyncStatus() {
    return {
      ...this.syncState,
      isOnline: this.networkMonitor.isOnline,
      connectionType: this.networkMonitor.connectionType,
      config: this.config
    };
  }

  updateConfig(newConfig) {
    this.config = { ...this.config, ...newConfig };
    console.log('Sync config updated:', this.config);
  }

  async getConflictHistory() {
    return this.syncState.errors.filter(error => 
      error.error.includes('conflict')
    );
  }

  async clearSyncErrors() {
    this.syncState.errors = [];
    this.syncState.retryCount = 0;
  }

  // Bandwidth optimization
  shouldDelaySyncForBandwidth() {
    return this.networkMonitor.isSlowConnection() && 
           this.config.enableBandwidthOptimization;
  }

  async optimizeForBandwidth(data) {
    if (!this.shouldDelaySyncForBandwidth()) {
      return data;
    }

    // Compress data more aggressively for slow connections
    return data.map(item => ({
      ...item,
      data: this.storage.compressionEngine.compress(item.data)
    }));
  }
}

// Export for use in analytics system
export { SyncManager, NetworkMonitor, ConflictResolver };
