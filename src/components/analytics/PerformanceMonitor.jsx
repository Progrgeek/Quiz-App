import React, { useState, useEffect } from 'react';

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    responseTime: 0,
    memoryUsage: 0,
    renderTime: 0,
    networkLatency: 0,
    errorRate: 0,
    userExperience: 'excellent'
  });

  const [alerts, setAlerts] = useState([]);
  const [isMonitoring, setIsMonitoring] = useState(false);

  useEffect(() => {
    if (isMonitoring) {
      const interval = setInterval(() => {
        updateMetrics();
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isMonitoring]);

  const updateMetrics = () => {
    // Simulate performance metrics
    const newMetrics = {
      responseTime: Math.floor(Math.random() * 500) + 100, // 100-600ms
      memoryUsage: Math.floor(Math.random() * 30) + 40, // 40-70%
      renderTime: Math.floor(Math.random() * 50) + 10, // 10-60ms
      networkLatency: Math.floor(Math.random() * 200) + 50, // 50-250ms
      errorRate: Math.random() * 5, // 0-5%
      userExperience: calculateUserExperience()
    };

    setMetrics(newMetrics);
    checkPerformanceThresholds(newMetrics);
  };

  const calculateUserExperience = () => {
    const score = Math.random() * 100;
    if (score > 80) return 'excellent';
    if (score > 60) return 'good';
    if (score > 40) return 'fair';
    return 'poor';
  };

  const checkPerformanceThresholds = (metrics) => {
    const newAlerts = [];

    if (metrics.responseTime > 400) {
      newAlerts.push({
        id: Date.now() + 1,
        type: 'warning',
        title: 'High Response Time',
        message: `Response time is ${metrics.responseTime}ms. Consider optimizing queries.`,
        timestamp: Date.now()
      });
    }

    if (metrics.memoryUsage > 80) {
      newAlerts.push({
        id: Date.now() + 2,
        type: 'critical',
        title: 'High Memory Usage',
        message: `Memory usage is at ${metrics.memoryUsage}%. Memory leak suspected.`,
        timestamp: Date.now()
      });
    }

    if (metrics.errorRate > 3) {
      newAlerts.push({
        id: Date.now() + 3,
        type: 'error',
        title: 'High Error Rate',
        message: `Error rate is ${metrics.errorRate.toFixed(1)}%. Check error logs.`,
        timestamp: Date.now()
      });
    }

    if (newAlerts.length > 0) {
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 7)]);
    }
  };

  const getMetricColor = (metric, value) => {
    switch (metric) {
      case 'responseTime':
        return value < 200 ? 'green' : value < 400 ? 'yellow' : 'red';
      case 'memoryUsage':
        return value < 60 ? 'green' : value < 80 ? 'yellow' : 'red';
      case 'renderTime':
        return value < 30 ? 'green' : value < 50 ? 'yellow' : 'red';
      case 'networkLatency':
        return value < 100 ? 'green' : value < 200 ? 'yellow' : 'red';
      case 'errorRate':
        return value < 1 ? 'green' : value < 3 ? 'yellow' : 'red';
      default:
        return 'gray';
    }
  };

  const getUXColor = (ux) => {
    switch (ux) {
      case 'excellent': return 'green';
      case 'good': return 'blue';
      case 'fair': return 'yellow';
      case 'poor': return 'red';
      default: return 'gray';
    }
  };

  const dismissAlert = (alertId) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Performance Monitor</h3>
        <button
          onClick={() => setIsMonitoring(!isMonitoring)}
          className={`px-4 py-2 rounded font-medium transition-colors ${
            isMonitoring 
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isMonitoring ? '⏹️ Stop Monitoring' : '▶️ Start Monitoring'}
        </button>
      </div>

      {/* Performance Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div className={`p-4 rounded-lg ${
          getMetricColor('responseTime', metrics.responseTime) === 'green' ? 'bg-green-50 border-green-200' :
          getMetricColor('responseTime', metrics.responseTime) === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border`}>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.responseTime}ms
          </div>
          <div className="text-sm text-gray-600">Response Time</div>
        </div>

        <div className={`p-4 rounded-lg ${
          getMetricColor('memoryUsage', metrics.memoryUsage) === 'green' ? 'bg-green-50 border-green-200' :
          getMetricColor('memoryUsage', metrics.memoryUsage) === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border`}>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.memoryUsage}%
          </div>
          <div className="text-sm text-gray-600">Memory Usage</div>
        </div>

        <div className={`p-4 rounded-lg ${
          getMetricColor('renderTime', metrics.renderTime) === 'green' ? 'bg-green-50 border-green-200' :
          getMetricColor('renderTime', metrics.renderTime) === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border`}>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.renderTime}ms
          </div>
          <div className="text-sm text-gray-600">Render Time</div>
        </div>

        <div className={`p-4 rounded-lg ${
          getMetricColor('networkLatency', metrics.networkLatency) === 'green' ? 'bg-green-50 border-green-200' :
          getMetricColor('networkLatency', metrics.networkLatency) === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border`}>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.networkLatency}ms
          </div>
          <div className="text-sm text-gray-600">Network Latency</div>
        </div>

        <div className={`p-4 rounded-lg ${
          getMetricColor('errorRate', metrics.errorRate) === 'green' ? 'bg-green-50 border-green-200' :
          getMetricColor('errorRate', metrics.errorRate) === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border`}>
          <div className="text-2xl font-bold text-gray-800">
            {metrics.errorRate.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-600">Error Rate</div>
        </div>

        <div className={`p-4 rounded-lg ${
          getUXColor(metrics.userExperience) === 'green' ? 'bg-green-50 border-green-200' :
          getUXColor(metrics.userExperience) === 'blue' ? 'bg-blue-50 border-blue-200' :
          getUXColor(metrics.userExperience) === 'yellow' ? 'bg-yellow-50 border-yellow-200' :
          'bg-red-50 border-red-200'
        } border`}>
          <div className="text-lg font-bold text-gray-800 capitalize">
            {metrics.userExperience}
          </div>
          <div className="text-sm text-gray-600">User Experience</div>
        </div>
      </div>

      {/* Performance Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6">
          <h4 className="font-semibold text-gray-800 mb-3">Performance Alerts</h4>
          <div className="space-y-2">
            {alerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded border-l-4 ${
                  alert.type === 'critical' ? 'bg-red-50 border-red-500' :
                  alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                  alert.type === 'error' ? 'bg-orange-50 border-orange-500' :
                  'bg-blue-50 border-blue-500'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{alert.title}</div>
                    <div className="text-sm text-gray-600">{alert.message}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="text-gray-400 hover:text-gray-600 ml-4"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {alerts.length > 3 && (
              <div className="text-sm text-gray-500 text-center">
                ... and {alerts.length - 3} more alerts
              </div>
            )}
          </div>
        </div>
      )}

      {/* Performance Thresholds */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-3">Performance Thresholds</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-2">
            <div>📊 Response Time: &lt;200ms (good), &lt;400ms (fair), &gt;400ms (poor)</div>
            <div>🧠 Memory Usage: &lt;60% (good), &lt;80% (fair), &gt;80% (critical)</div>
            <div>🎨 Render Time: &lt;30ms (good), &lt;50ms (fair), &gt;50ms (slow)</div>
          </div>
          <div className="space-y-2">
            <div>🌐 Network Latency: &lt;100ms (good), &lt;200ms (fair), &gt;200ms (slow)</div>
            <div>⚠️ Error Rate: &lt;1% (good), &lt;3% (concerning), &gt;3% (critical)</div>
            <div>👤 User Experience: Calculated based on combined metrics</div>
          </div>
        </div>
      </div>

      {!isMonitoring && (
        <div className="mt-4 text-center text-gray-500">
          <div className="text-2xl mb-2">📈</div>
          <p>Click "Start Monitoring" to begin real-time performance tracking.</p>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
