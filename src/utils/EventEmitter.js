/**
 * Browser-compatible EventEmitter implementation
 * Simple pub/sub system for QuizEngine events
 */

export class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(eventName, listener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(listener);
    
    // Return unsubscribe function
    return () => this.off(eventName, listener);
  }

  off(eventName, listener) {
    if (!this.events[eventName]) return;
    
    const index = this.events[eventName].indexOf(listener);
    if (index > -1) {
      this.events[eventName].splice(index, 1);
    }
  }

  emit(eventName, ...args) {
    if (!this.events[eventName]) return;
    
    this.events[eventName].forEach(listener => {
      try {
        listener(...args);
      } catch (error) {
        console.error('Error in event listener:', error);
      }
    });
  }

  once(eventName, listener) {
    const onceWrapper = (...args) => {
      this.off(eventName, onceWrapper);
      listener(...args);
    };
    this.on(eventName, onceWrapper);
  }

  removeAllListeners(eventName) {
    if (eventName) {
      delete this.events[eventName];
    } else {
      this.events = {};
    }
  }

  listenerCount(eventName) {
    return this.events[eventName] ? this.events[eventName].length : 0;
  }

  eventNames() {
    return Object.keys(this.events);
  }
}
