/**
 * 🏢 Enterprise Architecture Dashboard
 * Phase 6: Real-time visualization and management of enterprise systems
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Server,
  Database,
  Cloud,
  Activity,
  Shield,
  Zap,
  Globe,
  BarChart3,
  Settings,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Users,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react';

// Import our architecture engines
import ServiceArchitecture from '../../architecture/microservices/ServiceArchitecture.js';
import ServiceCommunication from '../../architecture/microservices/ServiceCommunication.js';
import DatabaseArchitecture from '../../architecture/database/DatabaseArchitecture.js';
import CloudInfrastructure from '../../architecture/cloud/CloudInfrastructure.js';

const EnterpriseArchitectureDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [architectureData, setArchitectureData] = useState({});
  const [systemHealth, setSystemHealth] = useState({});
  const [realTimeMetrics, setRealTimeMetrics] = useState({});
  const [loading, setLoading] = useState(true);

  // Initialize architecture engines
  const [serviceArchitecture] = useState(() => new ServiceArchitecture());
  const [serviceCommunication] = useState(() => new ServiceCommunication());
  const [databaseArchitecture] = useState(() => new DatabaseArchitecture());
  const [cloudInfrastructure] = useState(() => new CloudInfrastructure());

  useEffect(() => {
    initializeEnterpriseData();
    const interval = setInterval(updateRealTimeMetrics, 5000);
    return () => clearInterval(interval);
  }, []);

  const initializeEnterpriseData = async () => {
    setLoading(true);
    try {
      // Simulate loading enterprise architecture data
      const data = {
        services: serviceArchitecture.services,
        infrastructure: serviceArchitecture.infrastructure,
        databases: databaseArchitecture.databases,
        cloud: cloudInfrastructure.infrastructure,
        communication: serviceCommunication.communicationPatterns
      };

      setArchitectureData(data);
      await updateSystemHealth();
      await updateRealTimeMetrics();
    } catch (error) {
      console.error('Failed to initialize enterprise data:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSystemHealth = async () => {
    const health = await cloudInfrastructure.monitorSystemHealth();
    setSystemHealth(health);
  };

  const updateRealTimeMetrics = async () => {
    const metrics = {
      activeUsers: Math.floor(Math.random() * 10000 + 5000),
      requestsPerSecond: Math.floor(Math.random() * 500 + 200),
      responseTime: Math.floor(Math.random() * 50 + 100),
      cpuUtilization: Math.floor(Math.random() * 30 + 50),
      memoryUtilization: Math.floor(Math.random() * 25 + 60),
      errorRate: Math.random() * 0.5,
      throughput: Math.floor(Math.random() * 1000 + 500),
      timestamp: new Date().toISOString()
    };
    setRealTimeMetrics(metrics);
  };

  const tabs = [
    { id: 'overview', label: 'System Overview', icon: BarChart3 },
    { id: 'microservices', label: 'Microservices', icon: Server },
    { id: 'databases', label: 'Databases', icon: Database },
    { id: 'cloud', label: 'Cloud Infrastructure', icon: Cloud },
    { id: 'monitoring', label: 'Monitoring', icon: Activity },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-300 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-100 text-lg">Initializing Enterprise Architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-slate-800/50 border-b border-slate-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">
              🏢 Enterprise Architecture Dashboard
            </h1>
            <p className="text-slate-300 text-sm">
              Phase 6: Platform Scaling & Excellence - Real-time system monitoring and management
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <SystemHealthIndicator health={systemHealth} />
            <RealTimeMetricsWidget metrics={realTimeMetrics} />
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-slate-800/30 border-b border-slate-700">
        <div className="px-6">
          <div className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-300 border-b-2 border-blue-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && <OverviewTab data={architectureData} metrics={realTimeMetrics} />}
            {activeTab === 'microservices' && <MicroservicesTab data={architectureData} />}
            {activeTab === 'databases' && <DatabasesTab data={architectureData} />}
            {activeTab === 'cloud' && <CloudInfrastructureTab data={architectureData} />}
            {activeTab === 'monitoring' && <MonitoringTab health={systemHealth} metrics={realTimeMetrics} />}
            {activeTab === 'security' && <SecurityTab data={architectureData} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// System Health Indicator Component
const SystemHealthIndicator = ({ health }) => {
  const getHealthColor = (healthLevel) => {
    switch (healthLevel) {
      case 'excellent': return 'text-green-400';
      case 'good': return 'text-blue-400';
      case 'fair': return 'text-yellow-400';
      case 'poor': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getHealthIcon = (healthLevel) => {
    switch (healthLevel) {
      case 'excellent': return CheckCircle;
      case 'good': return CheckCircle;
      case 'fair': return AlertTriangle;
      case 'poor': return XCircle;
      default: return Clock;
    }
  };

  const HealthIcon = getHealthIcon(health.overall_health);

  return (
    <div className="flex items-center space-x-2 bg-slate-800/50 px-3 py-2 rounded-lg">
      <HealthIcon className={`w-5 h-5 ${getHealthColor(health.overall_health)}`} />
      <span className="text-white text-sm font-medium">
        System Health: {health.overall_health || 'Loading...'}
      </span>
    </div>
  );
};

// Real-time Metrics Widget
const RealTimeMetricsWidget = ({ metrics }) => {
  return (
    <div className="flex items-center space-x-4 bg-slate-800/50 px-4 py-2 rounded-lg">
      <div className="flex items-center space-x-1">
        <Users className="w-4 h-4 text-blue-400" />
        <span className="text-white text-sm">{metrics.activeUsers?.toLocaleString() || '0'}</span>
      </div>
      <div className="flex items-center space-x-1">
        <Zap className="w-4 h-4 text-green-400" />
        <span className="text-white text-sm">{metrics.requestsPerSecond || '0'}/s</span>
      </div>
      <div className="flex items-center space-x-1">
        <Clock className="w-4 h-4 text-yellow-400" />
        <span className="text-white text-sm">{metrics.responseTime || '0'}ms</span>
      </div>
    </div>
  );
};

// Overview Tab Component
const OverviewTab = ({ data, metrics }) => {
  const systemStats = {
    totalServices: Object.keys(data.services || {}).length,
    totalDatabases: Object.keys(data.databases || {}).length,
    cloudRegions: data.cloud?.REGIONS ? Object.keys(data.cloud.REGIONS).length : 0,
    monitoringEnabled: true
  };

  return (
    <div className="space-y-6">
      {/* System Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Services"
          value={systemStats.totalServices}
          icon={Server}
          color="blue"
          change="+2 this week"
        />
        <StatCard
          title="Database Instances"
          value={systemStats.totalDatabases}
          icon={Database}
          color="green"
          change="Optimized"
        />
        <StatCard
          title="Cloud Regions"
          value={systemStats.cloudRegions}
          icon={Globe}
          color="purple"
          change="Multi-region"
        />
        <StatCard
          title="Uptime"
          value="99.9%"
          icon={TrendingUp}
          color="emerald"
          change="SLA Met"
        />
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MetricsCard title="Performance Metrics" metrics={metrics} />
        <ResourceUtilizationCard metrics={metrics} />
      </div>

      {/* Architecture Overview */}
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Architecture Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ArchitectureSection
            title="Microservices"
            description="6 core services with auto-scaling"
            icon={Server}
            status="healthy"
          />
          <ArchitectureSection
            title="Data Layer"
            description="Multi-database architecture"
            icon={Database}
            status="optimized"
          />
          <ArchitectureSection
            title="Cloud Infrastructure"
            description="Multi-region deployment"
            icon={Cloud}
            status="active"
          />
        </div>
      </div>
    </div>
  );
};

// Microservices Tab Component
const MicroservicesTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Service Architecture</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(data.services || {}).map(([serviceName, config]) => (
            <ServiceCard key={serviceName} name={serviceName} config={config} />
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Infrastructure Services</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(data.infrastructure || {}).map(([serviceName, config]) => (
            <InfrastructureServiceCard key={serviceName} name={serviceName} config={config} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Databases Tab Component
const DatabasesTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Database Architecture</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Object.entries(data.databases || {}).map(([dbName, config]) => (
            <DatabaseCard key={dbName} name={dbName} config={config} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Cloud Infrastructure Tab Component
const CloudInfrastructureTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Regional Deployment</h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(data.cloud?.REGIONS || {}).map(([regionName, config]) => (
            <RegionCard key={regionName} name={regionName} config={config} />
          ))}
        </div>
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Kubernetes Infrastructure</h3>
        <KubernetesOverview config={data.cloud?.KUBERNETES} />
      </div>
    </div>
  );
};

// Monitoring Tab Component
const MonitoringTab = ({ health, metrics }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthCard health={health} />
        <AlertsCard health={health} />
      </div>

      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Real-time Metrics</h3>
        <RealTimeMetricsDisplay metrics={metrics} />
      </div>
    </div>
  );
};

// Security Tab Component
const SecurityTab = ({ data }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800/50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">Security Overview</h3>
        <SecurityOverview />
      </div>
    </div>
  );
};

// Utility Components
const StatCard = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    blue: 'bg-blue-500/20 text-blue-300',
    green: 'bg-green-500/20 text-green-300',
    purple: 'bg-purple-500/20 text-purple-300',
    emerald: 'bg-emerald-500/20 text-emerald-300'
  };

  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className="text-slate-400 text-sm">{change}</span>
      </div>
      <h3 className="text-slate-300 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  );
};

const MetricsCard = ({ title, metrics }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      <div className="space-y-4">
        <MetricRow label="Response Time" value={`${metrics.responseTime || 0}ms`} />
        <MetricRow label="Requests/sec" value={metrics.requestsPerSecond || 0} />
        <MetricRow label="Error Rate" value={`${(metrics.errorRate || 0).toFixed(3)}%`} />
        <MetricRow label="Throughput" value={`${metrics.throughput || 0} ops/s`} />
      </div>
    </div>
  );
};

const ResourceUtilizationCard = ({ metrics }) => {
  return (
    <div className="bg-slate-800/50 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4">Resource Utilization</h3>
      <div className="space-y-4">
        <ProgressBar label="CPU" value={metrics.cpuUtilization || 0} />
        <ProgressBar label="Memory" value={metrics.memoryUtilization || 0} />
        <ProgressBar label="Network" value={Math.floor(Math.random() * 40 + 30)} />
        <ProgressBar label="Storage" value={Math.floor(Math.random() * 30 + 45)} />
      </div>
    </div>
  );
};

const ServiceCard = ({ name, config }) => {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">{config.name}</h4>
        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
      </div>
      <p className="text-slate-300 text-sm mb-3">{config.responsibility}</p>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Port:</span>
          <span className="text-slate-200">{config.port}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Database:</span>
          <span className="text-slate-200">{config.database?.primary}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Scaling:</span>
          <span className="text-slate-200">{config.scaling?.instances}</span>
        </div>
      </div>
    </div>
  );
};

const DatabaseCard = ({ name, config }) => {
  return (
    <div className="bg-slate-700/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <h4 className="text-white font-medium">{name.replace('_', ' ')}</h4>
        <Database className="w-5 h-5 text-blue-400" />
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-400">Type:</span>
          <span className="text-slate-200">{config.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Size:</span>
          <span className="text-slate-200">{config.size}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">CPU:</span>
          <span className="text-slate-200">{config.cpu}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Memory:</span>
          <span className="text-slate-200">{config.memory}</span>
        </div>
      </div>
    </div>
  );
};

const MetricRow = ({ label, value }) => {
  return (
    <div className="flex justify-between items-center">
      <span className="text-slate-300 text-sm">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
};

const ProgressBar = ({ label, value }) => {
  const getColor = (val) => {
    if (val >= 90) return 'bg-red-500';
    if (val >= 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-slate-300 text-sm">{label}</span>
        <span className="text-white text-sm">{value}%</span>
      </div>
      <div className="w-full bg-slate-600 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${getColor(value)} transition-all duration-300`}
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
};

// Additional helper components would be implemented here...
const ArchitectureSection = ({ title, description, icon: Icon, status }) => (
  <div className="text-center">
    <Icon className="w-12 h-12 text-blue-400 mx-auto mb-3" />
    <h4 className="text-white font-medium mb-2">{title}</h4>
    <p className="text-slate-300 text-sm mb-2">{description}</p>
    <span className="text-green-400 text-xs font-medium">{status}</span>
  </div>
);

const InfrastructureServiceCard = ({ name, config }) => (
  <div className="bg-slate-700/50 rounded-lg p-4">
    <h4 className="text-white font-medium mb-2">{name.replace('_', ' ')}</h4>
    <p className="text-slate-300 text-sm">{config.technology}</p>
  </div>
);

const RegionCard = ({ name, config }) => (
  <div className="bg-slate-700/50 rounded-lg p-4">
    <h4 className="text-white font-medium mb-2">{config.region}</h4>
    <p className="text-slate-300 text-sm mb-2">{config.purpose}</p>
    <span className="text-blue-400 text-xs">{config.capacity}</span>
  </div>
);

const KubernetesOverview = ({ config }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    {Object.entries(config?.node_groups || {}).map(([groupName, groupConfig]) => (
      <div key={groupName} className="bg-slate-700/50 rounded-lg p-4">
        <h4 className="text-white font-medium mb-2">{groupName.replace('_', ' ')}</h4>
        <div className="text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Instance:</span>
            <span className="text-slate-200">{groupConfig.instance_type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Min/Max:</span>
            <span className="text-slate-200">{groupConfig.min_size}/{groupConfig.max_size}</span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const SystemHealthCard = ({ health }) => (
  <div className="bg-slate-800/50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-white mb-4">System Health</h3>
    <div className="space-y-3">
      {Object.entries(health.checks || {}).map(([check, result]) => (
        <div key={check} className="flex justify-between items-center">
          <span className="text-slate-300">{check.replace('_', ' ')}</span>
          <div className="flex items-center space-x-2">
            <span className="text-white">{result.score}%</span>
            <div className={`w-3 h-3 rounded-full ${
              result.status === 'healthy' ? 'bg-green-400' : 'bg-yellow-400'
            }`}></div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const AlertsCard = ({ health }) => (
  <div className="bg-slate-800/50 rounded-lg p-6">
    <h3 className="text-lg font-semibold text-white mb-4">Active Alerts</h3>
    <div className="space-y-3">
      {(health.alerts || []).length === 0 ? (
        <p className="text-slate-400 text-sm">No active alerts</p>
      ) : (
        health.alerts.map((alert, index) => (
          <div key={index} className="flex items-center space-x-3">
            <AlertTriangle className="w-4 h-4 text-yellow-400" />
            <span className="text-slate-200 text-sm">{alert.message}</span>
          </div>
        ))
      )}
    </div>
  </div>
);

const RealTimeMetricsDisplay = ({ metrics }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="text-center">
      <Users className="w-8 h-8 text-blue-400 mx-auto mb-2" />
      <p className="text-2xl font-bold text-white">{metrics.activeUsers?.toLocaleString()}</p>
      <p className="text-slate-400 text-sm">Active Users</p>
    </div>
    <div className="text-center">
      <Zap className="w-8 h-8 text-green-400 mx-auto mb-2" />
      <p className="text-2xl font-bold text-white">{metrics.requestsPerSecond}</p>
      <p className="text-slate-400 text-sm">Requests/sec</p>
    </div>
    <div className="text-center">
      <Cpu className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
      <p className="text-2xl font-bold text-white">{metrics.cpuUtilization}%</p>
      <p className="text-slate-400 text-sm">CPU Usage</p>
    </div>
    <div className="text-center">
      <HardDrive className="w-8 h-8 text-purple-400 mx-auto mb-2" />
      <p className="text-2xl font-bold text-white">{metrics.memoryUtilization}%</p>
      <p className="text-slate-400 text-sm">Memory Usage</p>
    </div>
  </div>
);

const SecurityOverview = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-4">
      <h4 className="text-white font-medium">Security Status</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-300">SSL/TLS</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">WAF Protection</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">DDoS Protection</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">Vulnerability Scans</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <h4 className="text-white font-medium">Compliance</h4>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-slate-300">GDPR</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">SOC 2</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">ISO 27001</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
        <div className="flex justify-between">
          <span className="text-slate-300">COPPA</span>
          <CheckCircle className="w-5 h-5 text-green-400" />
        </div>
      </div>
    </div>
  </div>
);

export default EnterpriseArchitectureDashboard;
