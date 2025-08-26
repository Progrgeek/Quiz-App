import React, { useMemo } from 'react';

const SkillRadar = ({ skills, progressData }) => {
  // Format skills data for radar chart
  const radarData = useMemo(() => {
    if (!progressData?.skillProgress?.breakdown) return [];
    
    const breakdown = progressData.skillProgress.breakdown;
    
    return [
      { skill: 'Accuracy', value: breakdown.accuracy || 0, maxValue: 100 },
      { skill: 'Speed', value: breakdown.speed || 0, maxValue: 100 },
      { skill: 'Consistency', value: breakdown.consistency || 0, maxValue: 100 },
      { skill: 'Retention', value: breakdown.retention || 0, maxValue: 100 },
      { skill: 'Engagement', value: breakdown.engagement || 0, maxValue: 100 }
    ];
  }, [progressData]);

  // Calculate skill improvements
  const skillTrends = useMemo(() => {
    const trends = {};
    radarData.forEach(skill => {
      // Simulate trend calculation (in real app, compare with historical data)
      const trend = Math.random() * 20 - 10; // -10 to +10
      trends[skill.skill] = {
        change: trend,
        direction: trend > 2 ? 'up' : trend < -2 ? 'down' : 'stable'
      };
    });
    return trends;
  }, [radarData]);

  // Simple SVG radar chart implementation
  const renderRadarChart = () => {
    if (radarData.length === 0) return null;
    
    const size = 280;
    const center = size / 2;
    const maxRadius = center - 40;
    const levels = 5;
    
    // Calculate angles for each skill
    const angleStep = (2 * Math.PI) / radarData.length;
    
    // Generate grid levels
    const gridLevels = Array.from({ length: levels }, (_, i) => {
      const radius = maxRadius * (i + 1) / levels;
      const points = radarData.map((_, index) => {
        const angle = index * angleStep - Math.PI / 2;
        const x = center + radius * Math.cos(angle);
        const y = center + radius * Math.sin(angle);
        return { x, y };
      });
      
      return {
        radius,
        level: ((i + 1) / levels) * 100,
        points
      };
    });
    
    // Calculate data points
    const dataPoints = radarData.map((skill, index) => {
      const angle = index * angleStep - Math.PI / 2;
      const normalizedValue = skill.value / skill.maxValue;
      const radius = maxRadius * normalizedValue;
      const x = center + radius * Math.cos(angle);
      const y = center + radius * Math.sin(angle);
      
      // Label position (outside the chart)
      const labelRadius = maxRadius + 20;
      const labelX = center + labelRadius * Math.cos(angle);
      const labelY = center + labelRadius * Math.sin(angle);
      
      return {
        x, y, labelX, labelY,
        skill: skill.skill,
        value: skill.value,
        angle
      };
    });
    
    // Create path for data area
    const dataPath = dataPoints.map((point, i) => 
      i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
    ).join(' ') + ' Z';
    
    return (
      <div className="flex justify-center">
        <svg width={size} height={size} className="border rounded">
          {/* Grid circles */}
          {gridLevels.map((level, i) => (
            <g key={i}>
              <circle
                cx={center}
                cy={center}
                r={level.radius}
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="1"
              />
              <text
                x={center + 5}
                y={center - level.radius + 5}
                fontSize="10"
                fill="#9ca3af"
              >
                {level.level.toFixed(0)}
              </text>
            </g>
          ))}
          
          {/* Grid lines to axes */}
          {dataPoints.map((point, i) => (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={center + maxRadius * Math.cos(point.angle)}
              y2={center + maxRadius * Math.sin(point.angle)}
              stroke="#e5e7eb"
              strokeWidth="1"
            />
          ))}
          
          {/* Data area */}
          <path
            d={dataPath}
            fill="rgba(59, 130, 246, 0.3)"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          
          {/* Data points */}
          {dataPoints.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
          ))}
          
          {/* Labels */}
          {dataPoints.map((point, i) => (
            <text
              key={i}
              x={point.labelX}
              y={point.labelY}
              fontSize="11"
              fill="#374151"
              textAnchor={point.labelX > center ? 'start' : point.labelX < center ? 'end' : 'middle'}
              dominantBaseline={point.labelY > center ? 'hanging' : 'auto'}
              fontWeight="500"
            >
              {point.skill}
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
        <h3 className="text-xl font-semibold text-gray-800">Skill Levels</h3>
        <div className="text-sm text-gray-600">
          Overall Level: <span className="font-bold text-blue-600">
            {progressData?.skillProgress?.level || 1}
          </span>
        </div>
      </div>

      {/* Radar Chart */}
      <div className="mb-6">
        {radarData.length > 0 ? (
          renderRadarChart()
        ) : (
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p>No skill data available</p>
            </div>
          </div>
        )}
      </div>

      {/* Skill Breakdown */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-800">Detailed Breakdown</h4>
        {radarData.map((skill, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              </div>
              <div>
                <div className="font-medium text-gray-800">{skill.skill}</div>
                <div className="text-sm text-gray-600">
                  {skill.value.toFixed(1)}% proficiency
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Progress Bar */}
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${skill.value}%` }}
                ></div>
              </div>
              
              {/* Trend Indicator */}
              <div className={`text-sm font-medium ${
                skillTrends[skill.skill]?.direction === 'up' ? 'text-green-600' :
                skillTrends[skill.skill]?.direction === 'down' ? 'text-red-600' :
                'text-gray-500'
              }`}>
                {skillTrends[skill.skill]?.direction === 'up' ? '↗️' :
                 skillTrends[skill.skill]?.direction === 'down' ? '↘️' : '➡️'}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Skill Insights */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-400">
        <h5 className="font-semibold text-blue-800 mb-2">Skill Analysis</h5>
        <div className="text-sm text-blue-700 space-y-1">
          {(() => {
            const strongest = radarData.reduce((max, skill) => 
              skill.value > max.value ? skill : max, radarData[0] || { skill: 'None', value: 0 });
            const weakest = radarData.reduce((min, skill) => 
              skill.value < min.value ? skill : min, radarData[0] || { skill: 'None', value: 100 });
            const average = radarData.reduce((sum, skill) => sum + skill.value, 0) / radarData.length;
            
            return (
              <>
                <p>💪 <strong>Strongest skill:</strong> {strongest.skill} ({strongest.value.toFixed(1)}%)</p>
                <p>🎯 <strong>Focus area:</strong> {weakest.skill} ({weakest.value.toFixed(1)}%)</p>
                <p>📊 <strong>Overall average:</strong> {average.toFixed(1)}%</p>
                <p>💡 <strong>Recommendation:</strong> {
                  weakest.value < 50 
                    ? `Focus on improving ${weakest.skill} through targeted practice.`
                    : average > 80 
                    ? 'Excellent performance! Consider increasing difficulty level.'
                    : 'Good progress! Maintain consistent practice across all skills.'
                }</p>
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default SkillRadar;
