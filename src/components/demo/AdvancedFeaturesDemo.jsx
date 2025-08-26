/**
 * Advanced Features Demo Component
 * Showcases Day 15 advanced features: auto-save, pause/resume, hints, bookmarks
 */

import React, { useState, useEffect } from 'react';
import { useAdvancedQuizEngine } from '../../hooks/useQuizEngine';
import AdvancedExerciseControls from '../common/AdvancedExerciseControls';

const AdvancedFeaturesDemo = () => {
  const [selectedFeature, setSelectedFeature] = useState('overview');
  const [demoConfig, setDemoConfig] = useState({
    enableAutoSave: true,
    autoSaveInterval: 10000, // 10 seconds for demo
    maxHints: 3
  });

  // Sample exercise configuration
  const exerciseConfig = {
    id: 'advanced-demo',
    type: 'multipleChoice',
    sampleData: {
      id: 1,
      question: "Which of these features does the advanced Quiz Engine support?",
      options: [
        "Auto-save functionality",
        "Exercise bookmarking", 
        "Progressive hint system",
        "All of the above"
      ],
      correctAnswer: "All of the above",
      hint: "The Quiz Engine has been enhanced with multiple advanced features for better user experience."
    },
    settings: {
      ...demoConfig
    }
  };

  const engine = useAdvancedQuizEngine(exerciseConfig);

  useEffect(() => {
    if (engine.isEngineReady && !engine.isCompleted) {
      engine.startExercise(exerciseConfig.sampleData, exerciseConfig);
    }
  }, [engine.isEngineReady]);

  const features = {
    overview: {
      title: "Advanced Features Overview",
      description: "Explore the enhanced Quiz Engine capabilities",
      content: (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-800">🚀 Day 15 Advanced Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FeatureCard
              icon="💾"
              title="Auto-save"
              description="Automatically saves progress every 30 seconds"
              status={engine.autoSave?.enabled ? "Active" : "Inactive"}
              statusColor={engine.autoSave?.enabled ? "green" : "gray"}
            />
            <FeatureCard
              icon="⏸️"
              title="Pause/Resume"
              description="Pause exercises and resume later"
              status={engine.pauseResume?.isPaused ? "Paused" : "Running"}
              statusColor={engine.pauseResume?.isPaused ? "yellow" : "blue"}
            />
            <FeatureCard
              icon="💡"
              title="Progressive Hints"
              description="Get up to 3 increasingly helpful hints"
              status={`${engine.hints?.available || 0} available`}
              statusColor="purple"
            />
            <FeatureCard
              icon="🔖"
              title="Bookmarks"
              description="Bookmark difficult questions for review"
              status={`${engine.bookmarks?.totalBookmarks || 0} bookmarked`}
              statusColor="amber"
            />
          </div>
        </div>
      )
    },
    autoSave: {
      title: "Auto-save Functionality",
      description: "Automatic progress saving with configurable intervals",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Auto-save Status</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  engine.autoSave?.enabled 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {engine.autoSave?.enabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              {engine.autoSave?.lastSave && (
                <div className="flex items-center justify-between">
                  <span>Last saved:</span>
                  <span className="text-sm text-gray-600">
                    {new Date(engine.autoSave.lastSave).toLocaleTimeString()}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <span>Interval:</span>
                <span className="text-sm">{demoConfig.autoSaveInterval / 1000}s</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Auto-save Interval (seconds)
            </label>
            <select
              value={demoConfig.autoSaveInterval / 1000}
              onChange={(e) => setDemoConfig(prev => ({
                ...prev,
                autoSaveInterval: parseInt(e.target.value) * 1000
              }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
            </select>
          </div>
        </div>
      )
    },
    hints: {
      title: "Progressive Hint System",
      description: "Multi-level hints with usage tracking",
      content: (
        <div className="space-y-4">
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800">Hint System Status</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>Available hints:</span>
                <span className="font-mono">{engine.hints?.available || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Used this question:</span>
                <span className="font-mono">{engine.hints?.used || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total used:</span>
                <span className="font-mono">{engine.hints?.totalUsed || 0}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => engine.hints?.getHint(1)}
              disabled={!engine.hints?.available}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Request Hint (Level 1)
            </button>
          </div>

          {engine.hints?.current && (
            <div className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-400">
              <h5 className="font-semibold text-yellow-800">
                💡 Current Hint (Level {engine.hints.current.level})
              </h5>
              <p className="text-yellow-700 mt-1">{engine.hints.current.hint}</p>
            </div>
          )}
        </div>
      )
    },
    bookmarks: {
      title: "Exercise Bookmarking",
      description: "Bookmark questions for later review",
      content: (
        <div className="space-y-4">
          <div className="bg-amber-50 p-4 rounded-lg">
            <h4 className="font-semibold text-amber-800">Bookmark Status</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>Current question bookmarked:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  engine.bookmarks?.currentIsBookmarked 
                    ? 'bg-amber-100 text-amber-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {engine.bookmarks?.currentIsBookmarked ? 'Yes' : 'No'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Total bookmarks:</span>
                <span className="font-mono">{engine.bookmarks?.totalBookmarks || 0}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => engine.bookmarks?.bookmarkQuestion()}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                engine.bookmarks?.currentIsBookmarked
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {engine.bookmarks?.currentIsBookmarked ? '🔖 Remove Bookmark' : '📑 Add Bookmark'}
            </button>

            {engine.bookmarks?.totalBookmarks > 0 && (
              <button
                onClick={() => engine.bookmarks?.clearAllBookmarks()}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Clear All Bookmarks
              </button>
            )}
          </div>

          {engine.bookmarks?.bookmarkedQuestions?.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h5 className="font-semibold text-gray-800">Bookmarked Questions</h5>
              <ul className="mt-2 space-y-1">
                {engine.bookmarks.bookmarkedQuestions.map((questionIndex) => (
                  <li key={questionIndex} className="text-sm text-gray-600">
                    Question {questionIndex + 1}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )
    },
    pauseResume: {
      title: "Pause/Resume Functionality", 
      description: "Pause exercises and resume later with time tracking",
      content: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800">Pause/Resume Status</h4>
            <div className="mt-2 space-y-2">
              <div className="flex items-center justify-between">
                <span>Current state:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  engine.pauseResume?.isPaused 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {engine.pauseResume?.isPaused ? 'Paused' : 'Running'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Can pause:</span>
                <span className="text-sm">{engine.pauseResume?.canPause ? 'Yes' : 'No'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Can resume:</span>
                <span className="text-sm">{engine.pauseResume?.canResume ? 'Yes' : 'No'}</span>
              </div>
              {engine.pauseResume?.totalPausedTime > 0 && (
                <div className="flex items-center justify-between">
                  <span>Total paused time:</span>
                  <span className="font-mono">
                    {Math.round(engine.pauseResume.totalPausedTime / 1000)}s
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => {
                if (engine.pauseResume?.isPaused) {
                  engine.pauseResume.resume();
                } else {
                  engine.pauseResume.pause();
                }
              }}
              disabled={!engine.pauseResume?.canPause && !engine.pauseResume?.canResume}
              className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
                engine.pauseResume?.isPaused
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              } disabled:bg-gray-300 disabled:cursor-not-allowed`}
            >
              {engine.pauseResume?.isPaused ? '▶️ Resume Exercise' : '⏸️ Pause Exercise'}
            </button>
          </div>
        </div>
      )
    }
  };

  const currentFeature = features[selectedFeature];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🚀 Advanced Quiz Engine Features
          </h1>
          <p className="text-gray-600">
            Day 15: Auto-save, Pause/Resume, Hints & Bookmarking Demo
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Feature Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Features</h3>
              <nav className="space-y-2">
                {Object.entries(features).map(([key, feature]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedFeature(key)}
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      selectedFeature === key
                        ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">{feature.title}</div>
                    <div className="text-sm text-gray-500">{feature.description}</div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Feature Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feature Details */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {currentFeature.title}
              </h2>
              <p className="text-gray-600 mb-4">{currentFeature.description}</p>
              {currentFeature.content}
            </div>

            {/* Exercise Demo */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Live Exercise Demo
              </h3>
              
              {engine.isEngineReady ? (
                <div className="space-y-4">
                  {/* Question */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">
                      Question {engine.getProgress()?.current || 1} of {engine.getProgress()?.total || 1}
                    </h4>
                    <p className="text-gray-700">{exerciseConfig.sampleData.question}</p>
                    
                    <div className="mt-4 space-y-2">
                      {exerciseConfig.sampleData.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => engine.submitAnswer(option)}
                          disabled={engine.isCompleted}
                          className="block w-full text-left px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                          {String.fromCharCode(65 + index)}. {option}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Advanced Controls */}
                  <AdvancedExerciseControls engine={engine.engine} />

                  {/* Exercise Stats */}
                  {engine.advancedStats && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">Exercise Statistics</h5>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Score:</span>
                          <span className="ml-1 font-mono">{engine.advancedStats.currentScore}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Accuracy:</span>
                          <span className="ml-1 font-mono">{engine.advancedStats.accuracy.toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hints Used:</span>
                          <span className="ml-1 font-mono">{engine.advancedStats.hintsUsed}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Bookmarks:</span>
                          <span className="ml-1 font-mono">{engine.advancedStats.bookmarksCount}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="text-gray-600 mt-4">Loading exercise...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Feature Card Component
const FeatureCard = ({ icon, title, description, status, statusColor }) => (
  <div className="bg-white p-4 rounded-lg border border-gray-200">
    <div className="flex items-start justify-between">
      <div className="flex items-center">
        <span className="text-2xl mr-3">{icon}</span>
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
      </div>
      <span className={`px-2 py-1 rounded text-xs font-medium bg-${statusColor}-100 text-${statusColor}-800`}>
        {status}
      </span>
    </div>
  </div>
);

export default AdvancedFeaturesDemo;
