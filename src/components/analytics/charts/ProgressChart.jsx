import React, { useState, useMemo } from 'react';

const ProgressChart = ({ userId, progressData, timeRange = '30d' }) => {
  const [selectedMetric, setSelectedMetric] = useState('score');
  const [chartType, setChartType] = useState('line');

  // Process progress data for chart display
  const chartData = useMemo(() => {
    if (!progressData?.sessionHistory) return [];
    
    const sessions = progressData.sessionHistory;
    const now = new Date();
    const timeRangeMs = {
      '7d': 7 * 24 * 60 * 60 * 1000,
      '30d': 30 * 24 * 60 * 60 * 1000,
      '90d': 90 * 24 * 60 * 60 * 1000,
      '1y': 365 * 24 * 60 * 60 * 1000
    };
    
    const cutoffDate = new Date(now.getTime() - timeRangeMs[timeRange]);
    
    return sessions
      .filter(session => new Date(session.startTime) >= cutoffDate)
      .map(session => ({
        date: new Date(session.startTime).toLocaleDateString(),
        timestamp: new Date(session.startTime).getTime(),
        score: session.averageScore || 0,
        accuracy: session.accuracy || 0,
        speed: session.averageSpeed || 0,
        exercises: session.exercises?.length || 0,
        duration: session.duration || 0
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
  }, [progressData, timeRange]);

  // Generate trend analysis
  const trendAnalysis = useMemo(() => {
    if (chartData.length < 2) return null;
    
    const values = chartData.map(d => d[selectedMetric]);
    const firstHalf = values.slice(0, Math.floor(values.length / 2));
    const secondHalf = values.slice(Math.floor(values.length / 2));
    
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
    
    const improvement = ((secondAvg - firstAvg) / firstAvg) * 100;
    
    return {
      improvement,
      trend: improvement > 5 ? 'improving' : improvement < -5 ? 'declining' : 'stable',
      currentValue: values[values.length - 1],
      bestValue: Math.max(...values),
      averageValue: values.reduce((a, b) => a + b, 0) / values.length
    };
  }, [chartData, selectedMetric]);

  // Simple SVG line chart implementation
  const renderLineChart = () => {
    if (chartData.length === 0) return null;
    
    const width = 600;
    const height = 300;
    const padding = 40;
    
    const values = chartData.map(d => d[selectedMetric]);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const valueRange = maxValue - minValue || 1;
    
    const points = chartData.map((d, i) => {
      const x = padding + (i / (chartData.length - 1)) * (width - 2 * padding);
      const y = height - padding - ((d[selectedMetric] - minValue) / valueRange) * (height - 2 * padding);
      return { x, y, value: d[selectedMetric], date: d.date };
    });
    
    const pathData = points.map((p, i) => 
      i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`
    ).join(' ');
    
    return (
      <div className="w-full overflow-x-auto">
        <svg width={width} height={height} className="border rounded">
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
            <g key={ratio}>
              <line
                x1={padding}
                y1={padding + ratio * (height - 2 * padding)}
                x2={width - padding}
                y2={padding + ratio * (height - 2 * padding)}
                stroke="#e5e7eb"
                strokeDasharray="2,2"
              />
              <text
                x={padding - 10}
                y={padding + ratio * (height - 2 * padding) + 5}
                fontSize="12"
                fill="#6b7280"
                textAnchor="end"
              >
                {Math.round(maxValue - ratio * valueRange)}
              </text>
            </g>
          ))}
          
          {/* Chart line */}
          <path
            d={pathData}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="2"
            className="transition-all duration-300"
          />
          
          {/* Data points */}
          {points.map((point, i) => (
            <g key={i}>
              <circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="#3b82f6"
                className="hover:r-6 transition-all cursor-pointer"
                title={`${point.date}: ${point.value}`}
              />
            </g>
          ))}
          
          {/* X-axis labels */}
          {points.filter((_, i) => i % Math.ceil(points.length / 6) === 0).map((point, i) => (
            <text
              key={i}
              x={point.x}
              y={height - 10}
              fontSize="10"
              fill="#6b7280"
              textAnchor="middle"
            >
              {point.date}
            </text>
          ))}
        </svg>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Learning Progress</h3>
        <div className="flex space-x-2">
          {/* Time Range Selector */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange?.(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          
          {/* Metric Selector */}
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="border rounded px-3 py-1 text-sm"
          >
            <option value="score">Score</option>
            <option value="accuracy">Accuracy</option>
            <option value="exercises">Exercises</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      {/* Chart */}
      <div className="mb-6">
        {chartData.length > 0 ? (
          renderLineChart()
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📊</div>
              <p>No data available for selected time range</p>
            </div>
          </div>
        )}
      </div>

      {/* Insights */}
      {trendAnalysis && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold mb-3">Progress Insights</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Trend</div>
              <div className={`font-semibold ${
                trendAnalysis.trend === 'improving' ? 'text-green-600' :
                trendAnalysis.trend === 'declining' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {trendAnalysis.trend === 'improving' ? '📈' : 
                 trendAnalysis.trend === 'declining' ? '📉' : '➡️'} 
                {' '}{trendAnalysis.trend}
              </div>
            </div>
            
            <div>
              <div className="text-gray-600">Improvement</div>
              <div className={`font-semibold ${
                trendAnalysis.improvement > 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {trendAnalysis.improvement > 0 ? '+' : ''}{trendAnalysis.improvement.toFixed(1)}%
              </div>
            </div>
            
            <div>
              <div className="text-gray-600">Best {selectedMetric}</div>
              <div className="font-semibold text-blue-600">
                {trendAnalysis.bestValue.toFixed(1)}
              </div>
            </div>
            
            <div>
              <div className="text-gray-600">Average</div>
              <div className="font-semibold text-gray-600">
                {trendAnalysis.averageValue.toFixed(1)}
              </div>
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
            <p className="text-blue-800 text-sm">
              💡 {trendAnalysis.trend === 'improving' 
                ? `Great progress! You've improved by ${Math.abs(trendAnalysis.improvement).toFixed(1)}%. Keep up the momentum!`
                : trendAnalysis.trend === 'declining'
                ? `Your ${selectedMetric} has declined by ${Math.abs(trendAnalysis.improvement).toFixed(1)}%. Consider reviewing your study approach.`
                : `Your ${selectedMetric} has been stable. Try increasing difficulty or session frequency for continued growth.`
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
