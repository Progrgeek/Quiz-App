# 🎯 Phase 3 Completion: UI/UX Enhancement - Detailed Implementation Guide

**Timeline:** 3 weeks | **Priority:** HIGH | **Goal:** Complete user experience with advanced UI components and mobile optimization

---

## 📋 **WEEK 1: Advanced Analytics Dashboard & Visualization (Days 19-20)**

### **Day 1: Interactive Analytics Visualizations**

#### **Morning Session (4 hours): Chart Components Library**

1. **Create Advanced Chart Components**
```bash
# Create chart components directory
mkdir -p src/components/analytics/charts/advanced
```

**File:** `src/components/analytics/charts/advanced/InteractiveChart.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';

export const InteractiveChart = ({ 
  type = 'line', 
  data, 
  options = {}, 
  interactive = true,
  exportable = true 
}) => {
  const [chartData, setChartData] = useState(data);
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Chart type mapping
  const ChartComponents = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut
  };

  const ChartComponent = ChartComponents[type] || Line;

  // Enhanced options with interactivity
  const enhancedOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        position: 'top',
        onClick: interactive ? handleLegendClick : undefined
      },
      tooltip: {
        enabled: true,
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      },
      y: {
        grid: {
          display: true,
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
    onClick: interactive ? handleChartClick : undefined,
    ...options
  };

  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const element = elements[0];
      const dataPoint = {
        datasetIndex: element.datasetIndex,
        index: element.index,
        value: chartData.datasets[element.datasetIndex].data[element.index],
        label: chartData.labels[element.index]
      };
      setSelectedDataPoint(dataPoint);
    }
  };

  const handleLegendClick = (event, legendItem) => {
    const index = legendItem.datasetIndex;
    const newData = { ...chartData };
    newData.datasets[index].hidden = !newData.datasets[index].hidden;
    setChartData(newData);
  };

  const exportChart = () => {
    // Export functionality
    const canvas = document.querySelector('canvas');
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `chart-${Date.now()}.png`;
    link.href = url;
    link.click();
  };

  return (
    <motion.div 
      className="relative bg-white rounded-lg shadow-sm border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Chart Controls */}
      {interactive && (
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Zoom Out
            </button>
            <span className="text-sm text-gray-600">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
            >
              Zoom In
            </button>
          </div>
          
          {exportable && (
            <button
              onClick={exportChart}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Export Chart
            </button>
          )}
        </div>
      )}

      {/* Chart Container */}
      <div className="relative h-96" style={{ transform: `scale(${zoomLevel})` }}>
        <ChartComponent data={chartData} options={enhancedOptions} />
      </div>

      {/* Selected Data Point Info */}
      <AnimatePresence>
        {selectedDataPoint && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200"
          >
            <h4 className="font-semibold text-blue-900">Selected Data Point</h4>
            <p className="text-blue-700">
              <span className="font-medium">{selectedDataPoint.label}:</span> {selectedDataPoint.value}
            </p>
            <button
              onClick={() => setSelectedDataPoint(null)}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800"
            >
              Clear selection
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
```

2. **Create Chart Data Generator**

**File:** `src/data/chartData.json`
```json
{
  "performanceData": {
    "labels": ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    "datasets": [
      {
        "label": "Quiz Scores",
        "data": [65, 72, 78, 85, 89, 92],
        "borderColor": "rgb(59, 130, 246)",
        "backgroundColor": "rgba(59, 130, 246, 0.1)",
        "tension": 0.4
      },
      {
        "label": "Time Spent (hours)",
        "data": [8, 12, 15, 18, 22, 25],
        "borderColor": "rgb(34, 197, 94)",
        "backgroundColor": "rgba(34, 197, 94, 0.1)",
        "tension": 0.4
      }
    ]
  },
  "skillProgressData": {
    "labels": ["Grammar", "Vocabulary", "Reading", "Writing", "Listening"],
    "datasets": [
      {
        "label": "Current Level",
        "data": [85, 92, 78, 65, 88],
        "backgroundColor": [
          "rgba(59, 130, 246, 0.8)",
          "rgba(34, 197, 94, 0.8)",
          "rgba(251, 191, 36, 0.8)",
          "rgba(239, 68, 68, 0.8)",
          "rgba(139, 92, 246, 0.8)"
        ],
        "borderWidth": 2
      }
    ]
  },
  "exerciseTypesData": {
    "labels": ["Multiple Choice", "Fill in Blanks", "Drag & Drop", "Highlight", "Sequencing"],
    "datasets": [
      {
        "label": "Completion Rate",
        "data": [95, 87, 92, 79, 84],
        "backgroundColor": "rgba(59, 130, 246, 0.6)",
        "borderColor": "rgba(59, 130, 246, 1)",
        "borderWidth": 1
      }
    ]
  }
}
```

#### **Afternoon Session (4 hours): Dashboard Customization**

3. **Create Dashboard Customization Component**

**File:** `src/components/analytics/DashboardCustomizer.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { motion, Reorder } from 'framer-motion';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export const DashboardCustomizer = ({ onSave, initialLayout }) => {
  const [widgets, setWidgets] = useState(initialLayout || []);
  const [availableWidgets, setAvailableWidgets] = useState([]);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const defaultWidgets = [
    { id: 'performance-chart', name: 'Performance Chart', type: 'chart', size: 'large' },
    { id: 'skill-radar', name: 'Skill Radar', type: 'radar', size: 'medium' },
    { id: 'recent-activity', name: 'Recent Activity', type: 'list', size: 'medium' },
    { id: 'achievements', name: 'Achievements', type: 'grid', size: 'small' },
    { id: 'leaderboard', name: 'Leaderboard', type: 'list', size: 'medium' },
    { id: 'study-streak', name: 'Study Streak', type: 'metric', size: 'small' }
  ];

  useEffect(() => {
    // Load saved layout or use defaults
    const savedLayout = localStorage.getItem('dashboard-layout');
    if (savedLayout) {
      setWidgets(JSON.parse(savedLayout));
    } else {
      setWidgets(defaultWidgets.slice(0, 4)); // Default 4 widgets
    }
    
    setAvailableWidgets(defaultWidgets);
  }, []);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(widgets);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setWidgets(items);
  };

  const addWidget = (widget) => {
    if (!widgets.find(w => w.id === widget.id)) {
      setWidgets([...widgets, widget]);
    }
  };

  const removeWidget = (widgetId) => {
    setWidgets(widgets.filter(w => w.id !== widgetId));
  };

  const saveLayout = () => {
    localStorage.setItem('dashboard-layout', JSON.stringify(widgets));
    onSave(widgets);
    setIsCustomizing(false);
  };

  const resetToDefault = () => {
    setWidgets(defaultWidgets.slice(0, 4));
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Customize Dashboard</h3>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCustomizing(!isCustomizing)}
            className={`px-4 py-2 rounded ${
              isCustomizing 
                ? 'bg-gray-100 text-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isCustomizing ? 'Cancel' : 'Customize'}
          </button>
          {isCustomizing && (
            <>
              <button
                onClick={resetToDefault}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Reset
              </button>
              <button
                onClick={saveLayout}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save Layout
              </button>
            </>
          )}
        </div>
      </div>

      {isCustomizing && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <h4 className="font-medium text-gray-900 mb-3">Available Widgets</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {availableWidgets.map(widget => (
              <motion.button
                key={widget.id}
                onClick={() => addWidget(widget)}
                disabled={widgets.find(w => w.id === widget.id)}
                className={`p-3 rounded-lg border text-left ${
                  widgets.find(w => w.id === widget.id)
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
                whileHover={{ scale: widgets.find(w => w.id === widget.id) ? 1 : 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="font-medium">{widget.name}</div>
                <div className="text-sm text-gray-500">{widget.type} • {widget.size}</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Current Layout</h4>
        
        {isCustomizing ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="widgets">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {widgets.map((widget, index) => (
                    <Draggable key={widget.id} draggableId={widget.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`p-4 mb-3 bg-gray-50 rounded-lg border ${
                            snapshot.isDragging ? 'shadow-lg' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{widget.name}</div>
                              <div className="text-sm text-gray-500">{widget.type} • {widget.size}</div>
                            </div>
                            <button
                              onClick={() => removeWidget(widget.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {widgets.map(widget => (
              <div key={widget.id} className="p-4 bg-gray-50 rounded-lg border">
                <div className="font-medium">{widget.name}</div>
                <div className="text-sm text-gray-500">{widget.type} • {widget.size}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

### **Day 2: Export & Reporting Features**

#### **Morning Session (4 hours): Report Generator**

1. **Create Report Generator Component**

**File:** `src/components/analytics/ReportGenerator.jsx`
```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';

export const ReportGenerator = ({ analyticsData }) => {
  const [reportConfig, setReportConfig] = useState({
    dateRange: 'last30days',
    includeCharts: true,
    includeRawData: false,
    format: 'pdf',
    sections: {
      overview: true,
      performance: true,
      progress: true,
      achievements: true
    }
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const dateRangeOptions = [
    { value: 'last7days', label: 'Last 7 days' },
    { value: 'last30days', label: 'Last 30 days' },
    { value: 'last3months', label: 'Last 3 months' },
    { value: 'lastyear', label: 'Last year' },
    { value: 'custom', label: 'Custom range' }
  ];

  const generatePDFReport = async () => {
    const pdf = new jsPDF();
    let yPosition = 20;

    // Title
    pdf.setFontSize(20);
    pdf.text('Learning Analytics Report', 20, yPosition);
    yPosition += 20;

    // Date range
    pdf.setFontSize(12);
    pdf.text(`Report Period: ${reportConfig.dateRange}`, 20, yPosition);
    yPosition += 20;

    // Overview section
    if (reportConfig.sections.overview) {
      pdf.setFontSize(16);
      pdf.text('Overview', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.text(`Total Quiz Sessions: ${analyticsData.totalSessions || 0}`, 30, yPosition);
      yPosition += 8;
      pdf.text(`Average Score: ${analyticsData.averageScore || 0}%`, 30, yPosition);
      yPosition += 8;
      pdf.text(`Time Studied: ${analyticsData.timeStudied || 0} hours`, 30, yPosition);
      yPosition += 15;
    }

    // Performance section
    if (reportConfig.sections.performance) {
      pdf.setFontSize(16);
      pdf.text('Performance Analysis', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      const performanceData = analyticsData.performance || {};
      Object.entries(performanceData).forEach(([key, value]) => {
        pdf.text(`${key}: ${value}`, 30, yPosition);
        yPosition += 8;
      });
      yPosition += 10;
    }

    // Add charts if enabled
    if (reportConfig.includeCharts) {
      // Chart implementation would go here
      pdf.text('Charts would be embedded here', 20, yPosition);
      yPosition += 20;
    }

    return pdf;
  };

  const generateExcelReport = () => {
    const workbook = XLSX.utils.book_new();
    
    // Overview sheet
    if (reportConfig.sections.overview) {
      const overviewData = [
        ['Metric', 'Value'],
        ['Total Sessions', analyticsData.totalSessions || 0],
        ['Average Score', `${analyticsData.averageScore || 0}%`],
        ['Time Studied', `${analyticsData.timeStudied || 0} hours`]
      ];
      const overviewSheet = XLSX.utils.aoa_to_sheet(overviewData);
      XLSX.utils.book_append_sheet(workbook, overviewSheet, 'Overview');
    }

    // Performance sheet
    if (reportConfig.sections.performance) {
      const performanceData = analyticsData.performance || {};
      const perfArray = [['Metric', 'Value']];
      Object.entries(performanceData).forEach(([key, value]) => {
        perfArray.push([key, value]);
      });
      const performanceSheet = XLSX.utils.aoa_to_sheet(perfArray);
      XLSX.utils.book_append_sheet(workbook, performanceSheet, 'Performance');
    }

    return workbook;
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    
    try {
      if (reportConfig.format === 'pdf') {
        const pdf = await generatePDFReport();
        pdf.save(`analytics-report-${Date.now()}.pdf`);
      } else if (reportConfig.format === 'excel') {
        const workbook = generateExcelReport();
        XLSX.writeFile(workbook, `analytics-report-${Date.now()}.xlsx`);
      }
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <motion.div
      className="bg-white rounded-lg shadow-sm border p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Generate Report</h3>
      
      <div className="space-y-6">
        {/* Date Range Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date Range
          </label>
          <select
            value={reportConfig.dateRange}
            onChange={(e) => setReportConfig(prev => ({ ...prev, dateRange: e.target.value }))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            {dateRangeOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Format Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="pdf"
                checked={reportConfig.format === 'pdf'}
                onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                className="mr-2"
              />
              PDF Report
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="excel"
                checked={reportConfig.format === 'excel'}
                onChange={(e) => setReportConfig(prev => ({ ...prev, format: e.target.value }))}
                className="mr-2"
              />
              Excel Spreadsheet
            </label>
          </div>
        </div>

        {/* Section Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Include Sections
          </label>
          <div className="space-y-2">
            {Object.entries(reportConfig.sections).map(([section, enabled]) => (
              <label key={section} className="flex items-center">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => setReportConfig(prev => ({
                    ...prev,
                    sections: { ...prev.sections, [section]: e.target.checked }
                  }))}
                  className="mr-2"
                />
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {/* Additional Options */}
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reportConfig.includeCharts}
              onChange={(e) => setReportConfig(prev => ({ ...prev, includeCharts: e.target.checked }))}
              className="mr-2"
            />
            Include charts and visualizations
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={reportConfig.includeRawData}
              onChange={(e) => setReportConfig(prev => ({ ...prev, includeRawData: e.target.checked }))}
              className="mr-2"
            />
            Include raw data
          </label>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerateReport}
          disabled={isGenerating}
          className={`w-full py-3 px-4 rounded-lg font-medium ${
            isGenerating
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isGenerating ? 'Generating Report...' : 'Generate Report'}
        </button>
      </div>
    </motion.div>
  );
};
```

#### **Testing JSON Data**

2. **Create Test Data for Reports**

**File:** `src/data/analyticsTestData.json`
```json
{
  "totalSessions": 147,
  "averageScore": 84.5,
  "timeStudied": 32.5,
  "performance": {
    "Improvement Rate": "15.3%",
    "Consistency Score": "92%",
    "Difficulty Progression": "Steady",
    "Weak Areas": "Grammar, Writing",
    "Strong Areas": "Vocabulary, Reading"
  },
  "weeklyProgress": [
    { "week": "Week 1", "score": 72, "timeSpent": 8 },
    { "week": "Week 2", "score": 78, "timeSpent": 12 },
    { "week": "Week 3", "score": 83, "timeSpent": 15 },
    { "week": "Week 4", "score": 87, "timeSpent": 18 }
  ],
  "skillBreakdown": {
    "Grammar": 76,
    "Vocabulary": 92,
    "Reading": 88,
    "Writing": 68,
    "Listening": 85
  }
}
```

---

## 📋 **WEEK 2: Advanced UI Components (Days 21-22)**

### **Day 3: Loading Skeletons & Advanced Forms**

#### **Morning Session: Loading Skeleton System**

1. **Create Skeleton Components**

**File:** `src/components/ui/skeletons/SkeletonLoader.jsx`
```jsx
import React from 'react';
import { motion } from 'framer-motion';

export const SkeletonLoader = ({ 
  width = '100%', 
  height = '20px', 
  className = '',
  variant = 'text' 
}) => {
  const variants = {
    text: 'rounded',
    circle: 'rounded-full',
    rect: 'rounded-lg'
  };

  return (
    <motion.div
      className={`bg-gray-200 ${variants[variant]} ${className}`}
      style={{ width, height }}
      animate={{
        opacity: [0.4, 0.8, 0.4]
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

export const ExerciseSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border p-6 space-y-4">
    <SkeletonLoader height="24px" width="60%" />
    <SkeletonLoader height="16px" width="40%" />
    <div className="space-y-2">
      <SkeletonLoader height="16px" width="100%" />
      <SkeletonLoader height="16px" width="90%" />
      <SkeletonLoader height="16px" width="80%" />
    </div>
    <div className="flex space-x-3">
      <SkeletonLoader height="40px" width="120px" variant="rect" />
      <SkeletonLoader height="40px" width="120px" variant="rect" />
    </div>
  </div>
);

export const DashboardSkeleton = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <SkeletonLoader height="32px" width="200px" />
      <SkeletonLoader height="40px" width="120px" variant="rect" />
    </div>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white rounded-lg shadow-sm border p-6">
          <SkeletonLoader height="20px" width="60%" className="mb-4" />
          <SkeletonLoader height="36px" width="40%" className="mb-2" />
          <SkeletonLoader height="16px" width="80%" />
        </div>
      ))}
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <SkeletonLoader height="24px" width="40%" className="mb-6" />
        <SkeletonLoader height="300px" width="100%" variant="rect" />
      </div>
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <SkeletonLoader height="24px" width="40%" className="mb-6" />
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <SkeletonLoader height="40px" width="40px" variant="circle" />
              <div className="flex-1">
                <SkeletonLoader height="16px" width="70%" className="mb-2" />
                <SkeletonLoader height="12px" width="50%" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
```

#### **Afternoon Session: Advanced Form Components**

2. **Create Advanced Form Components**

**File:** `src/components/ui/forms/AdvancedForm.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';

export const FormField = ({ 
  label, 
  error, 
  required = false, 
  children, 
  helpText 
}) => (
  <motion.div
    className="space-y-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <label className="block text-sm font-medium text-gray-700">
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    {children}
    <AnimatePresence>
      {error && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="text-sm text-red-600"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
    {helpText && (
      <p className="text-sm text-gray-500">{helpText}</p>
    )}
  </motion.div>
);

export const SmartInput = ({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  suggestions = [],
  autoComplete = false,
  validation,
  ...props 
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [isValid, setIsValid] = useState(true);

  useEffect(() => {
    if (value && suggestions.length > 0) {
      const filtered = suggestions.filter(suggestion =>
        suggestion.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0 && value.length > 0);
    } else {
      setShowSuggestions(false);
    }

    // Validation
    if (validation && value) {
      setIsValid(validation(value));
    }
  }, [value, suggestions, validation]);

  const handleSuggestionClick = (suggestion) => {
    onChange({ target: { value: suggestion } });
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border rounded-lg transition-colors ${
          isValid 
            ? 'border-gray-300 focus:border-blue-500 focus:ring-blue-500' 
            : 'border-red-300 focus:border-red-500 focus:ring-red-500'
        }`}
        {...props}
      />
      
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto"
          >
            {filteredSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50"
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const MultiStepForm = ({ steps, onSubmit, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});
  const { control, handleSubmit, formState: { errors }, trigger } = useForm();

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      onStepChange && onStepChange(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      onStepChange && onStepChange(currentStep - 1);
    }
  };

  const handleFormSubmit = (data) => {
    const finalData = { ...formData, ...data };
    onSubmit(finalData);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index <= currentStep ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  index <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {index + 1}
              </div>
              <span className="ml-2 text-sm font-medium">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="bg-blue-600 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            {steps[currentStep].component}
            
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg font-medium ${
                  currentStep === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-600 text-white hover:bg-gray-700'
                }`}
              >
                Previous
              </button>
              
              {currentStep === steps.length - 1 ? (
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Submit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
                >
                  Next
                </button>
              )}
            </div>
          </form>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
```

**Continue to Day 4-5 in next response due to length limits...**
