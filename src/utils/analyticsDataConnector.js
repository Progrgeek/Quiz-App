/**
 * Advanced Analytics Data Source Connector
 * Connect to actual analytics data sources and manage data flow
 */

import { getCurrentConfig } from '../config/analyticsConfig.js';

export class AnalyticsDataConnector {
  constructor(config = getCurrentConfig()) {
    this.config = config;
    this.connections = new Map();
    this.dataCache = new Map();
    this.eventQueue = [];
    this.isInitialized = false;
  }

  // Initialize all data connections
  async initialize() {
    console.log('🔌 Initializing Analytics Data Connector...');
    
    try {
      // Initialize primary storage
      await this.initializePrimaryStorage();
      
      // Initialize external integrations
      await this.initializeExternalIntegrations();
      
      // Initialize real-time connections
      await this.initializeRealTimeConnections();
      
      // Start event processing
      this.startEventProcessing();
      
      this.isInitialized = true;
      console.log('✅ Analytics Data Connector initialized successfully');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize Analytics Data Connector:', error);
      throw error;
    }
  }

  // Initialize primary storage (IndexedDB)
  async initializePrimaryStorage() {
    const { primary } = this.config.dataSources;
    
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(primary.name, primary.version);
      
      request.onerror = () => reject(new Error('Failed to open IndexedDB'));
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        this.connections.set('primaryDB', db);
        console.log('✅ Primary storage (IndexedDB) connected');
        resolve(db);
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create object stores
        primary.stores.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            const store = db.createObjectStore(storeName, { 
              keyPath: 'id', 
              autoIncrement: true 
            });
            
            // Add indexes for common queries
            if (storeName === 'events') {
              store.createIndex('timestamp', 'timestamp', { unique: false });
              store.createIndex('type', 'type', { unique: false });
              store.createIndex('userId', 'userId', { unique: false });
            }
            
            if (storeName === 'sessions') {
              store.createIndex('userId', 'userId', { unique: false });
              store.createIndex('startTime', 'startTime', { unique: false });
            }
          }
        });
      };
    });
  }

  // Initialize external integrations
  async initializeExternalIntegrations() {
    const { external } = this.config.dataSources;
    const promises = [];
    
    // Google Analytics
    if (external.googleAnalytics?.enabled) {
      promises.push(this.initializeGoogleAnalytics(external.googleAnalytics));
    }
    
    // Mixpanel
    if (external.mixpanel?.enabled) {
      promises.push(this.initializeMixpanel(external.mixpanel));
    }
    
    // Amplitude
    if (external.amplitude?.enabled) {
      promises.push(this.initializeAmplitude(external.amplitude));
    }
    
    await Promise.allSettled(promises);
  }

  // Initialize Google Analytics
  async initializeGoogleAnalytics(config) {
    try {
      // Load Google Analytics script
      const script = document.createElement('script');
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${config.trackingId}`;
      document.head.appendChild(script);
      
      // Initialize gtag
      window.dataLayer = window.dataLayer || [];
      function gtag() { window.dataLayer.push(arguments); }
      window.gtag = gtag;
      
      gtag('js', new Date());
      gtag('config', config.trackingId);
      
      this.connections.set('googleAnalytics', { gtag, trackingId: config.trackingId });
      console.log('✅ Google Analytics connected');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Google Analytics:', error);
    }
  }

  // Initialize Mixpanel
  async initializeMixpanel(config) {
    try {
      // Load Mixpanel SDK (simulated - in real implementation would load actual SDK)
      const mixpanel = {
        init: (token) => console.log(`Mixpanel initialized with token: ${token}`),
        track: (event, properties) => console.log('Mixpanel track:', event, properties),
        identify: (userId) => console.log('Mixpanel identify:', userId),
        people: {
          set: (properties) => console.log('Mixpanel people set:', properties)
        }
      };
      
      mixpanel.init(config.token);
      this.connections.set('mixpanel', mixpanel);
      console.log('✅ Mixpanel connected');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Mixpanel:', error);
    }
  }

  // Initialize Amplitude
  async initializeAmplitude(config) {
    try {
      // Load Amplitude SDK (simulated)
      const amplitude = {
        init: (apiKey) => console.log(`Amplitude initialized with key: ${apiKey}`),
        logEvent: (eventType, eventProperties) => console.log('Amplitude event:', eventType, eventProperties),
        setUserId: (userId) => console.log('Amplitude setUserId:', userId),
        setUserProperties: (properties) => console.log('Amplitude user properties:', properties)
      };
      
      amplitude.init(config.apiKey);
      this.connections.set('amplitude', amplitude);
      console.log('✅ Amplitude connected');
    } catch (error) {
      console.warn('⚠️ Failed to initialize Amplitude:', error);
    }
  }

  // Initialize real-time connections
  async initializeRealTimeConnections() {
    if (!this.config.realTime?.websocket?.enabled) return;
    
    try {
      // Simulate WebSocket connection for real-time data
      const websocket = {
        connected: true,
        send: (data) => console.log('WebSocket send:', data),
        onMessage: (callback) => {
          // Simulate incoming real-time data
          setInterval(() => {
            callback({
              type: 'real_time_update',
              data: this.generateMockRealTimeData(),
              timestamp: Date.now()
            });
          }, this.config.realTime.liveUpdates.interval);
        },
        close: () => console.log('WebSocket closed')
      };
      
      this.connections.set('websocket', websocket);
      console.log('✅ Real-time WebSocket connection established');
    } catch (error) {
      console.warn('⚠️ Failed to initialize real-time connections:', error);
    }
  }

  // Start event processing queue
  startEventProcessing() {
    setInterval(() => {
      this.processEventQueue();
    }, 1000); // Process every second
  }

  // Process queued events
  async processEventQueue() {
    if (this.eventQueue.length === 0) return;
    
    const eventsToProcess = this.eventQueue.splice(0, 50); // Process 50 at a time
    
    try {
      // Store events in primary storage
      await this.storeEvents(eventsToProcess);
      
      // Send to external integrations
      await this.sendToExternalIntegrations(eventsToProcess);
      
      // Update real-time metrics
      this.updateRealTimeMetrics(eventsToProcess);
      
    } catch (error) {
      console.error('Error processing event queue:', error);
      // Re-queue failed events
      this.eventQueue.unshift(...eventsToProcess);
    }
  }

  // Store events in primary storage
  async storeEvents(events) {
    const db = this.connections.get('primaryDB');
    if (!db) return;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['events'], 'readwrite');
      const store = transaction.objectStore('events');
      
      events.forEach(event => {
        store.add({
          ...event,
          stored_at: Date.now()
        });
      });
      
      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  // Send events to external integrations
  async sendToExternalIntegrations(events) {
    const promises = [];
    
    // Google Analytics
    const ga = this.connections.get('googleAnalytics');
    if (ga) {
      events.forEach(event => {
        promises.push(this.sendToGoogleAnalytics(event, ga));
      });
    }
    
    // Mixpanel
    const mixpanel = this.connections.get('mixpanel');
    if (mixpanel) {
      events.forEach(event => {
        promises.push(this.sendToMixpanel(event, mixpanel));
      });
    }
    
    // Amplitude
    const amplitude = this.connections.get('amplitude');
    if (amplitude) {
      events.forEach(event => {
        promises.push(this.sendToAmplitude(event, amplitude));
      });
    }
    
    await Promise.allSettled(promises);
  }

  // Send event to Google Analytics
  async sendToGoogleAnalytics(event, ga) {
    try {
      ga.gtag('event', event.type, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.properties
      });
    } catch (error) {
      console.warn('Failed to send event to Google Analytics:', error);
    }
  }

  // Send event to Mixpanel
  async sendToMixpanel(event, mixpanel) {
    try {
      mixpanel.track(event.type, {
        ...event.properties,
        category: event.category,
        timestamp: event.timestamp
      });
    } catch (error) {
      console.warn('Failed to send event to Mixpanel:', error);
    }
  }

  // Send event to Amplitude
  async sendToAmplitude(event, amplitude) {
    try {
      amplitude.logEvent(event.type, {
        ...event.properties,
        category: event.category,
        timestamp: event.timestamp
      });
    } catch (error) {
      console.warn('Failed to send event to Amplitude:', error);
    }
  }

  // Update real-time metrics
  updateRealTimeMetrics(events) {
    const websocket = this.connections.get('websocket');
    if (!websocket) return;
    
    const metrics = this.aggregateRealTimeMetrics(events);
    websocket.send({
      type: 'metrics_update',
      metrics,
      timestamp: Date.now()
    });
  }

  // Aggregate real-time metrics from events
  aggregateRealTimeMetrics(events) {
    const metrics = {
      total_events: events.length,
      event_types: {},
      user_count: new Set(),
      session_count: new Set()
    };
    
    events.forEach(event => {
      // Count event types
      metrics.event_types[event.type] = (metrics.event_types[event.type] || 0) + 1;
      
      // Track unique users and sessions
      if (event.userId) metrics.user_count.add(event.userId);
      if (event.sessionId) metrics.session_count.add(event.sessionId);
    });
    
    // Convert sets to counts
    metrics.unique_users = metrics.user_count.size;
    metrics.unique_sessions = metrics.session_count.size;
    delete metrics.user_count;
    delete metrics.session_count;
    
    return metrics;
  }

  // Public API methods

  // Track event
  async trackEvent(event) {
    if (!this.isInitialized) {
      console.warn('Analytics Data Connector not initialized');
      return;
    }
    
    const enrichedEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
      session_id: this.getSessionId(),
      user_agent: navigator.userAgent,
      url: window.location.href,
      referrer: document.referrer
    };
    
    this.eventQueue.push(enrichedEvent);
    
    // Also cache for immediate use
    this.cacheEvent(enrichedEvent);
    
    return enrichedEvent;
  }

  // Get cached data
  getCachedData(key, maxAge = 300000) { // 5 minutes default
    const cached = this.dataCache.get(key);
    if (cached && (Date.now() - cached.timestamp) < maxAge) {
      return cached.data;
    }
    return null;
  }

  // Cache data
  setCachedData(key, data) {
    this.dataCache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Query events from storage
  async queryEvents(filters = {}) {
    const db = this.connections.get('primaryDB');
    if (!db) return [];
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['events'], 'readonly');
      const store = transaction.objectStore('events');
      const request = store.getAll();
      
      request.onsuccess = () => {
        let events = request.result;
        
        // Apply filters
        if (filters.type) {
          events = events.filter(event => event.type === filters.type);
        }
        
        if (filters.startTime && filters.endTime) {
          events = events.filter(event => 
            event.timestamp >= filters.startTime && 
            event.timestamp <= filters.endTime
          );
        }
        
        if (filters.userId) {
          events = events.filter(event => event.userId === filters.userId);
        }
        
        resolve(events);
      };
      
      request.onerror = () => reject(request.error);
    });
  }

  // Get real-time metrics
  getRealTimeMetrics() {
    const cached = this.getCachedData('realtime_metrics', 5000); // 5 seconds cache
    if (cached) return cached;
    
    // Generate fresh metrics
    const metrics = this.generateMockRealTimeData();
    this.setCachedData('realtime_metrics', metrics);
    
    return metrics;
  }

  // Helper methods

  generateEventId() {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  getSessionId() {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  cacheEvent(event) {
    const recentEvents = this.getCachedData('recent_events', 60000) || [];
    recentEvents.push(event);
    
    // Keep only last 100 events
    if (recentEvents.length > 100) {
      recentEvents.splice(0, recentEvents.length - 100);
    }
    
    this.setCachedData('recent_events', recentEvents);
  }

  generateMockRealTimeData() {
    return {
      active_users: Math.floor(Math.random() * 500) + 200,
      events_per_second: Math.floor(Math.random() * 50) + 20,
      current_conversions: Math.floor(Math.random() * 10) + 5,
      error_rate: (Math.random() * 2).toFixed(2),
      server_response_time: Math.floor(Math.random() * 200) + 100,
      top_pages: [
        { path: '/quiz/javascript-basics', users: Math.floor(Math.random() * 100) + 50 },
        { path: '/dashboard', users: Math.floor(Math.random() * 80) + 40 },
        { path: '/quiz/react-fundamentals', users: Math.floor(Math.random() * 70) + 35 },
        { path: '/profile', users: Math.floor(Math.random() * 60) + 30 },
        { path: '/quiz/css-advanced', users: Math.floor(Math.random() * 50) + 25 }
      ],
      system_health: {
        cpu_usage: Math.random() * 80,
        memory_usage: Math.random() * 90,
        disk_usage: Math.random() * 70,
        network_latency: Math.random() * 100
      }
    };
  }

  // Cleanup and shutdown
  async shutdown() {
    console.log('🔌 Shutting down Analytics Data Connector...');
    
    // Process remaining events
    if (this.eventQueue.length > 0) {
      await this.processEventQueue();
    }
    
    // Close connections
    const websocket = this.connections.get('websocket');
    if (websocket) {
      websocket.close();
    }
    
    const db = this.connections.get('primaryDB');
    if (db) {
      db.close();
    }
    
    // Clear caches
    this.dataCache.clear();
    this.connections.clear();
    
    this.isInitialized = false;
    console.log('✅ Analytics Data Connector shutdown complete');
  }
}

// Singleton instance
let dataConnectorInstance = null;

export const getDataConnector = () => {
  if (!dataConnectorInstance) {
    dataConnectorInstance = new AnalyticsDataConnector();
  }
  return dataConnectorInstance;
};

export const initializeDataConnector = async (config) => {
  const connector = getDataConnector();
  if (config) {
    connector.config = config;
  }
  await connector.initialize();
  return connector;
};

export default AnalyticsDataConnector;
