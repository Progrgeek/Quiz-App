import { useState, useEffect } from 'react';
import Stats from './Stats';
import { Card } from './ui';

const ResponsiveTest = () => {
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(75);
  const [questionNumber, setQuestionNumber] = useState(5);
  const totalQuestions = 10;

  // Simulate time progression
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Simulate score changes
  useEffect(() => {
    const scoreTimer = setInterval(() => {
      setScore(prev => (prev + 5) % 100);
    }, 3000);

    return () => clearInterval(scoreTimer);
  }, []);

  // Simulate question progression
  useEffect(() => {
    const questionTimer = setInterval(() => {
      setQuestionNumber(prev => (prev % totalQuestions) + 1);
    }, 4000);

    return () => clearInterval(questionTimer);
  }, [totalQuestions]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-blue-300 to-green-300 p-4">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8 p-6">
          <h1 className="text-3xl font-bold text-center mb-4">
            Responsive Stats Component Test
          </h1>
          <p className="text-center text-gray-600 mb-6">
            Test the Stats component responsiveness across different screen sizes.
            Values change automatically to test animations.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded">
              <strong>Mobile (&lt; 640px):</strong> Compact row layout with icons and short values
            </div>
            <div className="bg-green-50 p-3 rounded">
              <strong>Tablet (640px - 1024px):</strong> Horizontal grid layout with full labels
            </div>
            <div className="bg-purple-50 p-3 rounded">
              <strong>Desktop (&gt; 1024px):</strong> Vertical sidebar layout with progress bars
            </div>
          </div>
        </Card>

        <div className="flex justify-center">
          <Stats
            questionNumber={questionNumber}
            totalQuestions={totalQuestions}
            timeElapsed={timeElapsed}
            score={score}
          />
        </div>

        {/* Test Controls */}
        <Card className="mt-8 p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Question:</label>
              <input
                type="range"
                min="1"
                max={totalQuestions}
                value={questionNumber}
                onChange={(e) => setQuestionNumber(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{questionNumber} / {totalQuestions}</span>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Score:</label>
              <input
                type="range"
                min="0"
                max="100"
                value={score}
                onChange={(e) => setScore(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{score} / 100</span>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Time (seconds):</label>
              <input
                type="range"
                min="0"
                max="600"
                value={timeElapsed}
                onChange={(e) => setTimeElapsed(parseInt(e.target.value))}
                className="w-full"
              />
              <span className="text-sm text-gray-600">{Math.floor(timeElapsed / 60)}:{(timeElapsed % 60).toString().padStart(2, '0')}</span>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium">Actions:</label>
              <button
                onClick={() => {
                  setScore(0);
                  setTimeElapsed(0);
                  setQuestionNumber(1);
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              >
                Reset All
              </button>
            </div>
          </div>
        </Card>

        {/* Screen Size Indicator */}
        <Card className="mt-8 p-4">
          <h3 className="text-lg font-semibold mb-2">Current Screen Size:</h3>
          <div className="flex gap-2">
            <div className="block sm:hidden px-3 py-1 bg-red-200 text-red-800 rounded">
              📱 Mobile (&lt; 640px)
            </div>
            <div className="hidden sm:block lg:hidden px-3 py-1 bg-yellow-200 text-yellow-800 rounded">
              📱 Tablet (640px - 1024px)
            </div>
            <div className="hidden lg:block px-3 py-1 bg-green-200 text-green-800 rounded">
              🖥️ Desktop (&gt; 1024px)
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveTest;
