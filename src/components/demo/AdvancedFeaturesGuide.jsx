import React, { useState } from 'react';
import { useAdvancedQuizEngine } from '../../hooks/useQuizEngine';

const AdvancedFeaturesGuide = () => {
  const [currentDemo, setCurrentDemo] = useState('auto-save');
  const {
    quiz,
    autoSave,
    pauseResume,
    hints,
    bookmarks,
    analytics
  } = useAdvancedQuizEngine();

  const demoSteps = {
    'auto-save': {
      title: '💾 Auto-Save Demo',
      description: 'Watch how your progress is automatically saved',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800">Auto-Save Status</h4>
            <p className="text-blue-600">
              Status: {autoSave.isEnabled ? 'Enabled ✅' : 'Disabled ❌'}
            </p>
            <p className="text-blue-600">
              Last Saved: {autoSave.lastSaved ? new Date(autoSave.lastSaved).toLocaleTimeString() : 'Never'}
            </p>
            <p className="text-sm text-blue-500 mt-2">
              Your answers are automatically saved every 10 seconds and whenever you submit an answer.
            </p>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">Try This:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm">
              <li>Answer a few questions in the live exercise above</li>
              <li>Notice the auto-save indicator updating</li>
              <li>Refresh the page - your progress will be restored!</li>
            </ol>
          </div>
        </div>
      )
    },
    
    'pause-resume': {
      title: '⏸️ Pause/Resume Demo',
      description: 'Control your quiz timing and flow',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <h4 className="font-semibold text-green-800">Pause/Resume Status</h4>
            <p className="text-green-600">
              State: {pauseResume.isPaused ? 'Paused ⏸️' : 'Active ▶️'}
            </p>
            <p className="text-green-600">
              Duration: {Math.floor(pauseResume.totalTime / 1000)}s active, {Math.floor(pauseResume.pausedTime / 1000)}s paused
            </p>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={pauseResume.pause}
              disabled={pauseResume.isPaused}
              className="px-4 py-2 bg-yellow-500 text-white rounded disabled:opacity-50"
            >
              ⏸️ Pause Quiz
            </button>
            <button 
              onClick={pauseResume.resume}
              disabled={!pauseResume.isPaused}
              className="px-4 py-2 bg-green-500 text-white rounded disabled:opacity-50"
            >
              ▶️ Resume Quiz
            </button>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">Perfect for:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Taking breaks during long quizzes</li>
              <li>Handling interruptions (phone calls, etc.)</li>
              <li>Reviewing previous answers without time pressure</li>
              <li>Managing quiz sessions across multiple days</li>
            </ul>
          </div>
        </div>
      )
    },
    
    'hints': {
      title: '💡 Progressive Hints Demo',
      description: 'Get smart, contextual help when you need it',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-purple-50 rounded-lg">
            <h4 className="font-semibold text-purple-800">Hint System</h4>
            <p className="text-purple-600">
              Available Hints: {hints.available.length}
            </p>
            <p className="text-purple-600">
              Used Hints: {hints.used.length}
            </p>
          </div>
          
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400">
            <h4 className="font-semibold">Hint Levels:</h4>
            <div className="space-y-2 mt-2 text-sm">
              <div>💡 <strong>Light Hint:</strong> Gentle nudge in the right direction</div>
              <div>🔍 <strong>Medium Hint:</strong> More specific guidance</div>
              <div>🎯 <strong>Strong Hint:</strong> Clear direction to the answer</div>
            </div>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">Smart Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Hints adapt to the question type and difficulty</li>
              <li>Progressive disclosure - start with gentle hints</li>
              <li>Track hint usage for learning analytics</li>
              <li>Contextual help based on your previous answers</li>
            </ul>
          </div>
        </div>
      )
    },
    
    'bookmarks': {
      title: '🔖 Bookmarking Demo',
      description: 'Save interesting questions for later review',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <h4 className="font-semibold text-indigo-800">Your Bookmarks</h4>
            <p className="text-indigo-600">
              Bookmarked Questions: {bookmarks.saved.length}
            </p>
            <p className="text-indigo-600">
              Categories: {bookmarks.categories?.length || 0}
            </p>
          </div>
          
          <div className="p-4 bg-blue-50 border-l-4 border-blue-400">
            <h4 className="font-semibold">How to Use Bookmarks:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm mt-2">
              <li>Click the bookmark icon (🔖) on any question</li>
              <li>Questions are automatically categorized by type</li>
              <li>Review bookmarks at the end of your session</li>
              <li>Export bookmarks for offline study</li>
            </ol>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">Great for:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li>Saving challenging questions for practice</li>
              <li>Marking interesting vocabulary or concepts</li>
              <li>Building personal study collections</li>
              <li>Sharing questions with teachers or classmates</li>
            </ul>
          </div>
        </div>
      )
    },
    
    'analytics': {
      title: '📊 Analytics Demo',
      description: 'Detailed insights into your learning progress',
      content: (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-lg">
            <h4 className="font-semibold text-emerald-800">Performance Metrics</h4>
            <div className="grid grid-cols-2 gap-4 mt-2 text-sm">
              <div>
                <span className="text-emerald-600">Accuracy Rate:</span>
                <div className="font-semibold">{analytics.accuracy || 0}%</div>
              </div>
              <div>
                <span className="text-emerald-600">Average Time:</span>
                <div className="font-semibold">{analytics.averageTime || 0}s</div>
              </div>
              <div>
                <span className="text-emerald-600">Strong Areas:</span>
                <div className="font-semibold">{analytics.strengths?.length || 0}</div>
              </div>
              <div>
                <span className="text-emerald-600">Areas to Improve:</span>
                <div className="font-semibold">{analytics.weaknesses?.length || 0}</div>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-orange-50 border-l-4 border-orange-400">
            <h4 className="font-semibold">Analytics Features:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm mt-2">
              <li><strong>Learning Patterns:</strong> Track how you learn best</li>
              <li><strong>Progress Trends:</strong> See improvement over time</li>
              <li><strong>Difficulty Analysis:</strong> Identify optimal challenge levels</li>
              <li><strong>Recommendation Engine:</strong> Get personalized suggestions</li>
            </ul>
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold">Actionable Insights:</h4>
            <div className="space-y-2 text-sm">
              <div>🎯 Focus on grammar exercises - 15% accuracy gain needed</div>
              <div>⚡ Speed up vocabulary responses - currently 25% slower than average</div>
              <div>📈 Great progress in listening comprehension - 89% accuracy!</div>
              <div>🔄 Review bookmarked questions from last week</div>
            </div>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          🚀 Advanced Features Interactive Guide
        </h1>
        <p className="text-gray-600">
          Explore the powerful features that make your quiz experience smarter and more effective
        </p>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {Object.entries(demoSteps).map(([key, step]) => (
          <button
            key={key}
            onClick={() => setCurrentDemo(key)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              currentDemo === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {step.title}
          </button>
        ))}
      </div>

      {/* Current Demo */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {demoSteps[currentDemo].title}
          </h2>
          <p className="text-gray-600 text-lg">
            {demoSteps[currentDemo].description}
          </p>
        </div>
        
        {demoSteps[currentDemo].content}
      </div>

      {/* Quick Start Guide */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">🚀 Quick Start Guide</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">For Students:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Start any quiz to see auto-save in action</li>
              <li>Use pause/resume during study breaks</li>
              <li>Try hints when you're stuck on difficult questions</li>
              <li>Bookmark interesting questions for review</li>
              <li>Check your analytics to track progress</li>
            </ol>
          </div>
          <div>
            <h4 className="font-semibold text-gray-700 mb-2">For Teachers:</h4>
            <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600">
              <li>Monitor student progress through analytics</li>
              <li>Review commonly bookmarked questions</li>
              <li>Analyze hint usage patterns</li>
              <li>Identify areas where students struggle</li>
              <li>Customize difficulty based on performance data</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedFeaturesGuide;
