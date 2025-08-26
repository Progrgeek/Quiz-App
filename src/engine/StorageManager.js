/**
 * Storage Manager
 * Handles persistence with multiple storage strategies
 */

export class StorageManager {
  constructor(config = {}) {
    this.config = {
      namespace: 'quiz-app',
      enableLocalStorage: true,
      enableSessionStorage: true,
      enableIndexedDB: false, // Advanced storage for large data
      autoSave: true,
      saveInterval: 5000, // 5 seconds
      compression: false,
      encryption: false,
      ...config
    };
    
    this.storage = new Map();
    this.isInitialized = false;
    this.saveQueue = new Set();
    this.saveTimeout = null;
    
    this.init();
  }
  
  async init() {
    try {
      // Test storage availability
      await this.testStorageAvailability();
      
      // Initialize IndexedDB if enabled
      if (this.config.enableIndexedDB) {
        await this.initIndexedDB();
      }
      
      // Load existing data
      await this.loadAllData();
      
      // Setup auto-save
      if (this.config.autoSave) {
        this.setupAutoSave();
      }
      
      this.isInitialized = true;
    } catch (error) {
      console.error('Storage initialization failed:', error);
      this.isInitialized = false;
    }
  }
  
  async testStorageAvailability() {
    const tests = [];
    
    // Test localStorage
    if (this.config.enableLocalStorage) {
      try {
        const testKey = `${this.config.namespace}-test`;
        localStorage.setItem(testKey, 'test');
        localStorage.removeItem(testKey);
        this.storage.set('localStorage', localStorage);
      } catch (error) {
        console.warn('localStorage not available:', error);
        this.config.enableLocalStorage = false;
      }
    }
    
    // Test sessionStorage
    if (this.config.enableSessionStorage) {
      try {
        const testKey = `${this.config.namespace}-test`;
        sessionStorage.setItem(testKey, 'test');
        sessionStorage.removeItem(testKey);
        this.storage.set('sessionStorage', sessionStorage);
      } catch (error) {
        console.warn('sessionStorage not available:', error);
        this.config.enableSessionStorage = false;
      }
    }
  }
  
  async initIndexedDB() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(`${this.config.namespace}-db`, 1);
      
      request.onerror = () => {
        console.warn('IndexedDB not available');
        this.config.enableIndexedDB = false;
        resolve();
      };
      
      request.onsuccess = (event) => {
        this.storage.set('indexedDB', event.target.result);
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        if (!db.objectStoreNames.contains('exercises')) {
          const exerciseStore = db.createObjectStore('exercises', { keyPath: 'id' });
          exerciseStore.createIndex('type', 'type', { unique: false });
          exerciseStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('sessions')) {
          const sessionStore = db.createObjectStore('sessions', { keyPath: 'id' });
          sessionStore.createIndex('date', 'date', { unique: false });
        }
        
        if (!db.objectStoreNames.contains('progress')) {
          db.createObjectStore('progress', { keyPath: 'key' });
        }
      };
    });
  }
  
  async loadAllData() {
    const loadPromises = [];
    
    // Load from localStorage
    if (this.config.enableLocalStorage) {
      loadPromises.push(this.loadFromLocalStorage());
    }
    
    // Load from sessionStorage
    if (this.config.enableSessionStorage) {
      loadPromises.push(this.loadFromSessionStorage());
    }
    
    // Load from IndexedDB
    if (this.config.enableIndexedDB) {
      loadPromises.push(this.loadFromIndexedDB());
    }
    
    await Promise.allSettled(loadPromises);
  }
  
  async loadFromLocalStorage() {
    const localStorage = this.storage.get('localStorage');
    if (!localStorage) return;
    
    const keys = Object.keys(localStorage).filter(key => 
      key.startsWith(this.config.namespace)
    );
    
    for (const key of keys) {
      try {
        const data = this.parseStoredData(localStorage.getItem(key));
        const cleanKey = key.replace(`${this.config.namespace}-`, '');
        this.storage.set(`local-${cleanKey}`, data);
      } catch (error) {
        console.warn(`Failed to load ${key} from localStorage:`, error);
      }
    }
  }
  
  async loadFromSessionStorage() {
    const sessionStorage = this.storage.get('sessionStorage');
    if (!sessionStorage) return;
    
    const keys = Object.keys(sessionStorage).filter(key => 
      key.startsWith(this.config.namespace)
    );
    
    for (const key of keys) {
      try {
        const data = this.parseStoredData(sessionStorage.getItem(key));
        const cleanKey = key.replace(`${this.config.namespace}-`, '');
        this.storage.set(`session-${cleanKey}`, data);
      } catch (error) {
        console.warn(`Failed to load ${key} from sessionStorage:`, error);
      }
    }
  }
  
  async loadFromIndexedDB() {
    const db = this.storage.get('indexedDB');
    if (!db) return;
    
    try {
      const stores = ['exercises', 'sessions', 'progress'];
      
      for (const storeName of stores) {
        const transaction = db.transaction([storeName], 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();
        
        request.onsuccess = () => {
          this.storage.set(`idb-${storeName}`, request.result);
        };
      }
    } catch (error) {
      console.warn('Failed to load from IndexedDB:', error);
    }
  }
  
  // Save data with strategy selection
  async save(key, data, options = {}) {
    const {
      persistent = true,
      temporary = false,
      large = false,
      immediate = false
    } = options;
    
    try {
      const processedData = this.prepareDataForStorage(data);
      const strategies = this.selectStorageStrategies(persistent, temporary, large);
      
      if (immediate) {
        await this.saveImmediate(key, processedData, strategies);
      } else {
        this.queueSave(key, processedData, strategies);
      }
      
      return true;
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
      return false;
    }
  }
  
  selectStorageStrategies(persistent, temporary, large) {
    const strategies = [];
    
    if (large && this.config.enableIndexedDB) {
      strategies.push('indexedDB');
    } else if (persistent && this.config.enableLocalStorage) {
      strategies.push('localStorage');
    }
    
    if (temporary && this.config.enableSessionStorage) {
      strategies.push('sessionStorage');
    }
    
    // Fallback strategies
    if (strategies.length === 0) {
      if (this.config.enableLocalStorage) strategies.push('localStorage');
      if (this.config.enableSessionStorage) strategies.push('sessionStorage');
    }
    
    return strategies;
  }
  
  async saveImmediate(key, data, strategies) {
    const savePromises = strategies.map(strategy => 
      this.saveToStrategy(key, data, strategy)
    );
    
    await Promise.allSettled(savePromises);
  }
  
  async saveToStrategy(key, data, strategy) {
    const fullKey = `${this.config.namespace}-${key}`;
    
    switch (strategy) {
      case 'localStorage':
        const localStorage = this.storage.get('localStorage');
        if (localStorage) {
          localStorage.setItem(fullKey, this.stringifyData(data));
        }
        break;
        
      case 'sessionStorage':
        const sessionStorage = this.storage.get('sessionStorage');
        if (sessionStorage) {
          sessionStorage.setItem(fullKey, this.stringifyData(data));
        }
        break;
        
      case 'indexedDB':
        await this.saveToIndexedDB(key, data);
        break;
        
      default:
        throw new Error(`Unknown storage strategy: ${strategy}`);
    }
  }
  
  async saveToIndexedDB(key, data) {
    const db = this.storage.get('indexedDB');
    if (!db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      
      const request = store.put({
        key,
        data,
        timestamp: Date.now()
      });
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  queueSave(key, data, strategies) {
    this.saveQueue.add({ key, data, strategies });
    
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    this.saveTimeout = setTimeout(() => {
      this.processSaveQueue();
    }, this.config.saveInterval);
  }
  
  async processSaveQueue() {
    const queue = Array.from(this.saveQueue);
    this.saveQueue.clear();
    
    const savePromises = queue.map(({ key, data, strategies }) =>
      this.saveImmediate(key, data, strategies)
    );
    
    await Promise.allSettled(savePromises);
  }
  
  // Load data with fallback strategies
  async load(key, options = {}) {
    const {
      persistent = true,
      temporary = false,
      large = false,
      defaultValue = null
    } = options;
    
    const strategies = this.selectStorageStrategies(persistent, temporary, large);
    
    for (const strategy of strategies) {
      try {
        const data = await this.loadFromStrategy(key, strategy);
        if (data !== null) {
          return data;
        }
      } catch (error) {
        console.warn(`Failed to load ${key} from ${strategy}:`, error);
      }
    }
    
    return defaultValue;
  }
  
  async loadFromStrategy(key, strategy) {
    const fullKey = `${this.config.namespace}-${key}`;
    
    switch (strategy) {
      case 'localStorage':
        const localStorage = this.storage.get('localStorage');
        if (localStorage) {
          const item = localStorage.getItem(fullKey);
          return item ? this.parseStoredData(item) : null;
        }
        break;
        
      case 'sessionStorage':
        const sessionStorage = this.storage.get('sessionStorage');
        if (sessionStorage) {
          const item = sessionStorage.getItem(fullKey);
          return item ? this.parseStoredData(item) : null;
        }
        break;
        
      case 'indexedDB':
        return await this.loadFromIndexedDBByKey(key);
        
      default:
        return null;
    }
    
    return null;
  }
  
  async loadFromIndexedDBByKey(key) {
    const db = this.storage.get('indexedDB');
    if (!db) return null;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['progress'], 'readonly');
      const store = transaction.objectStore('progress');
      const request = store.get(key);
      
      request.onsuccess = () => {
        const result = request.result;
        resolve(result ? result.data : null);
      };
      
      request.onerror = () => reject(request.error);
    });
  }
  
  // Delete data
  async delete(key, options = {}) {
    const {
      persistent = true,
      temporary = false,
      large = false
    } = options;
    
    const strategies = this.selectStorageStrategies(persistent, temporary, large);
    
    const deletePromises = strategies.map(strategy =>
      this.deleteFromStrategy(key, strategy)
    );
    
    await Promise.allSettled(deletePromises);
  }
  
  async deleteFromStrategy(key, strategy) {
    const fullKey = `${this.config.namespace}-${key}`;
    
    switch (strategy) {
      case 'localStorage':
        const localStorage = this.storage.get('localStorage');
        if (localStorage) {
          localStorage.removeItem(fullKey);
        }
        break;
        
      case 'sessionStorage':
        const sessionStorage = this.storage.get('sessionStorage');
        if (sessionStorage) {
          sessionStorage.removeItem(fullKey);
        }
        break;
        
      case 'indexedDB':
        await this.deleteFromIndexedDB(key);
        break;
    }
  }
  
  async deleteFromIndexedDB(key) {
    const db = this.storage.get('indexedDB');
    if (!db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['progress'], 'readwrite');
      const store = transaction.objectStore('progress');
      const request = store.delete(key);
      
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }
  
  // Utility methods
  prepareDataForStorage(data) {
    let processedData = data;
    
    if (this.config.compression) {
      processedData = this.compress(processedData);
    }
    
    if (this.config.encryption) {
      processedData = this.encrypt(processedData);
    }
    
    return processedData;
  }
  
  stringifyData(data) {
    return JSON.stringify({
      data,
      timestamp: Date.now(),
      version: '1.0'
    });
  }
  
  parseStoredData(storedString) {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(storedString);
      
      // If it's our wrapped format with data property
      if (parsed && typeof parsed === 'object' && parsed.hasOwnProperty('data')) {
        if (this.config.encryption && parsed.data) {
          parsed.data = this.decrypt(parsed.data);
        }
        
        if (this.config.compression && parsed.data) {
          parsed.data = this.decompress(parsed.data);
        }
        
        return parsed.data;
      }
      
      // If it's a plain JSON object or array, return as is
      return parsed;
    } catch (error) {
      // If JSON parsing fails, it might be a plain string value
      // This handles cases like theme: "light" stored as plain string
      return storedString;
    }
  }
  
  // Placeholder methods for compression/encryption
  compress(data) {
    // Implement compression logic here
    return data;
  }
  
  decompress(data) {
    // Implement decompression logic here
    return data;
  }
  
  encrypt(data) {
    // Implement encryption logic here
    return data;
  }
  
  decrypt(data) {
    // Implement decryption logic here
    return data;
  }
  
  setupAutoSave() {
    // Save any pending data when page unloads
    window.addEventListener('beforeunload', () => {
      if (this.saveQueue.size > 0) {
        this.processSaveQueue();
      }
    });
    
    // Periodic save for long-running sessions
    setInterval(() => {
      if (this.saveQueue.size > 0) {
        this.processSaveQueue();
      }
    }, this.config.saveInterval);
  }
  
  // Get storage statistics
  getStorageStats() {
    const stats = {
      localStorage: { available: false, used: 0, quota: 0 },
      sessionStorage: { available: false, used: 0, quota: 0 },
      indexedDB: { available: false, used: 0, quota: 0 }
    };
    
    // localStorage stats
    if (this.config.enableLocalStorage) {
      try {
        const localStorage = this.storage.get('localStorage');
        if (localStorage) {
          stats.localStorage.available = true;
          stats.localStorage.used = this.calculateStorageUsed(localStorage);
        }
      } catch (error) {
        console.warn('Cannot calculate localStorage stats:', error);
      }
    }
    
    // sessionStorage stats
    if (this.config.enableSessionStorage) {
      try {
        const sessionStorage = this.storage.get('sessionStorage');
        if (sessionStorage) {
          stats.sessionStorage.available = true;
          stats.sessionStorage.used = this.calculateStorageUsed(sessionStorage);
        }
      } catch (error) {
        console.warn('Cannot calculate sessionStorage stats:', error);
      }
    }
    
    // IndexedDB stats
    if (this.config.enableIndexedDB) {
      stats.indexedDB.available = this.storage.has('indexedDB');
    }
    
    return stats;
  }
  
  calculateStorageUsed(storage) {
    let total = 0;
    for (let key in storage) {
      if (key.startsWith(this.config.namespace)) {
        total += storage.getItem(key).length;
      }
    }
    return total;
  }
  
  // Clear all stored data
  async clearAll() {
    const clearPromises = [];
    
    // Clear localStorage
    if (this.config.enableLocalStorage) {
      clearPromises.push(this.clearLocalStorage());
    }
    
    // Clear sessionStorage
    if (this.config.enableSessionStorage) {
      clearPromises.push(this.clearSessionStorage());
    }
    
    // Clear IndexedDB
    if (this.config.enableIndexedDB) {
      clearPromises.push(this.clearIndexedDB());
    }
    
    await Promise.allSettled(clearPromises);
    
    // Clear save queue
    this.saveQueue.clear();
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
  }
  
  clearLocalStorage() {
    const localStorage = this.storage.get('localStorage');
    if (localStorage) {
      const keys = Object.keys(localStorage).filter(key => 
        key.startsWith(this.config.namespace)
      );
      keys.forEach(key => localStorage.removeItem(key));
    }
  }
  
  clearSessionStorage() {
    const sessionStorage = this.storage.get('sessionStorage');
    if (sessionStorage) {
      const keys = Object.keys(sessionStorage).filter(key => 
        key.startsWith(this.config.namespace)
      );
      keys.forEach(key => sessionStorage.removeItem(key));
    }
  }
  
  async clearIndexedDB() {
    const db = this.storage.get('indexedDB');
    if (db) {
      const stores = ['exercises', 'sessions', 'progress'];
      
      const clearPromises = stores.map(storeName => 
        new Promise((resolve, reject) => {
          const transaction = db.transaction([storeName], 'readwrite');
          const store = transaction.objectStore(storeName);
          const request = store.clear();
          
          request.onsuccess = () => resolve();
          request.onerror = () => reject(request.error);
        })
      );
      
      await Promise.allSettled(clearPromises);
    }
  }
  
  // Cleanup
  destroy() {
    if (this.saveTimeout) {
      clearTimeout(this.saveTimeout);
    }
    
    // Process any pending saves
    if (this.saveQueue.size > 0) {
      this.processSaveQueue();
    }
    
    // Close IndexedDB connection
    const db = this.storage.get('indexedDB');
    if (db) {
      db.close();
    }
    
    this.storage.clear();
  }
}

export default StorageManager;
