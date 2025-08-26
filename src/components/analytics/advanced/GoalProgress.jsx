import React, { useState, useMemo } from 'react';

const GoalProgress = ({ progressData, userId }) => {
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goals, setGoals] = useState([]);

  // Initialize with sample goals (in real app, these would come from user data)
  React.useEffect(() => {
    const sampleGoals = [
      {
        id: 'goal_1',
        title: 'Complete 50 Exercises',
        description: 'Practice with 50 different exercises to build fluency',
        type: 'exercise_count',
        target: 50,
        current: progressData?.performance?.totalAnswers || 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        category: 'practice',
        difficulty: 'medium',
        reward: '🏆 Practice Champion Badge',
        isActive: true
      },
      {
        id: 'goal_2',
        title: 'Achieve 85% Accuracy',
        description: 'Maintain 85% or higher accuracy across all exercises',
        type: 'accuracy',
        target: 85,
        current: progressData?.skillProgress?.breakdown?.accuracy || 0,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
        category: 'performance',
        difficulty: 'hard',
        reward: '🎯 Accuracy Master Badge',
        isActive: true
      },
      {
        id: 'goal_3',
        title: '7-Day Learning Streak',
        description: 'Study consistently for 7 days in a row',
        type: 'streak',
        target: 7,
        current: calculateCurrentStreak(progressData?.sessionHistory || []),
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        category: 'consistency',
        difficulty: 'easy',
        reward: '🔥 Consistency Star Badge',
        isActive: true
      }
    ];
    
    setGoals(sampleGoals);
  }, [progressData]);

  // Calculate current streak
  function calculateCurrentStreak(sessionHistory) {
    if (!sessionHistory.length) return 0;
    
    const today = new Date();
    const msPerDay = 24 * 60 * 60 * 1000;
    
    // Group sessions by date
    const sessionDates = new Set();
    sessionHistory.forEach(session => {
      const date = new Date(session.startTime).toDateString();
      sessionDates.add(date);
    });
    
    let streak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dateString = checkDate.toDateString();
      if (sessionDates.has(dateString)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Allow for today if no session yet
        if (checkDate.toDateString() === today.toDateString()) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    
    return streak;
  }

  // Calculate goal progress
  const calculateProgress = (goal) => {
    const percentage = Math.min(100, (goal.current / goal.target) * 100);
    const isCompleted = goal.current >= goal.target;
    const daysLeft = Math.ceil((new Date(goal.deadline) - new Date()) / (24 * 60 * 60 * 1000));
    
    return {
      percentage,
      isCompleted,
      daysLeft,
      status: isCompleted ? 'completed' : daysLeft < 0 ? 'expired' : daysLeft <= 3 ? 'urgent' : 'active'
    };
  };

  // Goal categories
  const goalCategories = {
    practice: { icon: '📚', color: 'blue', name: 'Practice' },
    performance: { icon: '🎯', color: 'green', name: 'Performance' },
    consistency: { icon: '🔥', color: 'orange', name: 'Consistency' },
    skill: { icon: '🧠', color: 'purple', name: 'Skill Development' }
  };

  // Goal difficulty colors
  const difficultyColors = {
    easy: 'green',
    medium: 'yellow',
    hard: 'red'
  };

  // Generate goal suggestions
  const goalSuggestions = useMemo(() => {
    if (!progressData) return [];
    
    const suggestions = [];
    const { skillProgress, performance, sessionHistory } = progressData;
    
    // Suggest based on current performance
    if (skillProgress?.breakdown?.accuracy < 70) {
      suggestions.push({
        title: 'Improve Accuracy to 75%',
        description: 'Focus on careful reading and understanding',
        type: 'accuracy',
        target: 75,
        category: 'performance',
        difficulty: 'medium',
        estimatedDays: 14
      });
    }
    
    if (skillProgress?.breakdown?.speed < 60) {
      suggestions.push({
        title: 'Increase Response Speed',
        description: 'Build confidence and pattern recognition',
        type: 'speed',
        target: 70,
        category: 'performance',
        difficulty: 'medium',
        estimatedDays: 21
      });
    }
    
    if (!sessionHistory || sessionHistory.length < 10) {
      suggestions.push({
        title: 'Complete 25 Exercises',
        description: 'Build a solid foundation with regular practice',
        type: 'exercise_count',
        target: 25,
        category: 'practice',
        difficulty: 'easy',
        estimatedDays: 14
      });
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  }, [progressData]);

  // Add new goal
  const addGoal = (goalData) => {
    const newGoal = {
      id: `goal_${Date.now()}`,
      ...goalData,
      current: getCurrentValueForGoalType(goalData.type),
      isActive: true,
      createdAt: new Date()
    };
    
    setGoals(prev => [...prev, newGoal]);
    setShowGoalModal(false);
  };

  // Get current value for goal type
  const getCurrentValueForGoalType = (type) => {
    if (!progressData) return 0;
    
    switch (type) {
      case 'accuracy':
        return progressData.skillProgress?.breakdown?.accuracy || 0;
      case 'speed':
        return progressData.skillProgress?.breakdown?.speed || 0;
      case 'exercise_count':
        return progressData.performance?.totalAnswers || 0;
      case 'streak':
        return calculateCurrentStreak(progressData.sessionHistory || []);
      case 'score':
        return progressData.sessionHistory?.length 
          ? progressData.sessionHistory[progressData.sessionHistory.length - 1]?.averageScore || 0
          : 0;
      default:
        return 0;
    }
  };

  // Update goal
  const updateGoal = (goalId, updates) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId ? { ...goal, ...updates } : goal
    ));
  };

  // Delete goal
  const deleteGoal = (goalId) => {
    setGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Learning Goals</h3>
        <button
          onClick={() => setShowGoalModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Goal
        </button>
      </div>

      {/* Goals Grid */}
      <div className="space-y-4 mb-6">
        {goals.filter(goal => goal.isActive).map(goal => {
          const progress = calculateProgress(goal);
          const category = goalCategories[goal.category] || goalCategories.practice;
          
          return (
            <GoalCard
              key={goal.id}
              goal={goal}
              progress={progress}
              category={category}
              onUpdate={updateGoal}
              onDelete={deleteGoal}
            />
          );
        })}
        
        {goals.filter(goal => goal.isActive).length === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🎯</div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">
              No Active Goals
            </h4>
            <p className="text-gray-600 mb-4">
              Set learning goals to stay motivated and track your progress.
            </p>
          </div>
        )}
      </div>

      {/* Goal Suggestions */}
      {goalSuggestions.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-semibold text-gray-800 mb-3">Suggested Goals</h4>
          <div className="space-y-2">
            {goalSuggestions.map((suggestion, index) => (
              <div key={index} className="bg-white rounded p-3 border">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-gray-800">{suggestion.title}</div>
                    <div className="text-sm text-gray-600">{suggestion.description}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Estimated: {suggestion.estimatedDays} days • {suggestion.difficulty}
                    </div>
                  </div>
                  <button
                    onClick={() => addGoal({
                      ...suggestion,
                      deadline: new Date(Date.now() + suggestion.estimatedDays * 24 * 60 * 60 * 1000),
                      reward: `🌟 ${suggestion.title} Achievement`
                    })}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Goal Statistics */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div className="text-center p-3 bg-blue-50 rounded">
          <div className="font-bold text-blue-600">
            {goals.filter(g => g.isActive).length}
          </div>
          <div className="text-blue-800">Active Goals</div>
        </div>
        
        <div className="text-center p-3 bg-green-50 rounded">
          <div className="font-bold text-green-600">
            {goals.filter(g => calculateProgress(g).isCompleted).length}
          </div>
          <div className="text-green-800">Completed</div>
        </div>
        
        <div className="text-center p-3 bg-orange-50 rounded">
          <div className="font-bold text-orange-600">
            {goals.filter(g => calculateProgress(g).status === 'urgent').length}
          </div>
          <div className="text-orange-800">Urgent</div>
        </div>
        
        <div className="text-center p-3 bg-purple-50 rounded">
          <div className="font-bold text-purple-600">
            {Math.round(goals.filter(g => g.isActive).reduce((sum, g) => sum + calculateProgress(g).percentage, 0) / Math.max(1, goals.filter(g => g.isActive).length))}%
          </div>
          <div className="text-purple-800">Avg Progress</div>
        </div>
      </div>

      {/* Goal Creation Modal */}
      {showGoalModal && (
        <GoalCreationModal
          onClose={() => setShowGoalModal(false)}
          onSubmit={addGoal}
          goalCategories={goalCategories}
        />
      )}
    </div>
  );
};

// Individual Goal Card Component
const GoalCard = ({ goal, progress, category, onUpdate, onDelete }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusStyles = () => {
    switch (progress.status) {
      case 'completed':
        return 'bg-green-50 border-green-200';
      case 'urgent':
        return 'bg-red-50 border-red-200';
      case 'expired':
        return 'bg-gray-50 border-gray-300';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusStyles()}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3">
          <span className="text-2xl">{category.icon}</span>
          <div>
            <h4 className="font-semibold text-gray-800">{goal.title}</h4>
            <p className="text-sm text-gray-600">{goal.description}</p>
            <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
              <span>{category.name}</span>
              <span>•</span>
              <span className="capitalize">{goal.difficulty}</span>
              <span>•</span>
              <span>{progress.daysLeft > 0 ? `${progress.daysLeft} days left` : 'Expired'}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {progress.isCompleted && <span className="text-green-500">✅</span>}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="text-gray-400 hover:text-gray-600"
          >
            {showDetails ? '▼' : '▶'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span>Progress</span>
          <span className="font-medium">
            {goal.current} / {goal.target} ({progress.percentage.toFixed(1)}%)
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${
              progress.isCompleted ? 'bg-green-500' :
              progress.status === 'urgent' ? 'bg-red-500' :
              'bg-blue-500'
            }`}
            style={{ width: `${Math.min(100, progress.percentage)}%` }}
          ></div>
        </div>
      </div>

      {/* Reward */}
      <div className="text-sm text-gray-600 mb-3">
        🎁 <span className="font-medium">Reward:</span> {goal.reward}
      </div>

      {/* Details Section */}
      {showDetails && (
        <div className="pt-3 border-t border-gray-200 space-y-3">
          <div className="text-sm">
            <div className="font-medium mb-1">Goal Details</div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
              <div>Type: {goal.type}</div>
              <div>Target: {goal.target}</div>
              <div>Created: {new Date(goal.createdAt || Date.now()).toLocaleDateString()}</div>
              <div>Deadline: {new Date(goal.deadline).toLocaleDateString()}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => onUpdate(goal.id, { isActive: false })}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded text-sm transition-colors"
            >
              Archive
            </button>
            <button
              onClick={() => onDelete(goal.id)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded text-sm transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Goal Creation Modal Component
const GoalCreationModal = ({ onClose, onSubmit, goalCategories }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'exercise_count',
    target: 10,
    category: 'practice',
    difficulty: 'medium',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    reward: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      deadline: new Date(formData.deadline),
      target: Number(formData.target)
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold mb-4">Create New Goal</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border rounded px-3 py-2 h-20"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="exercise_count">Exercise Count</option>
                <option value="accuracy">Accuracy %</option>
                <option value="speed">Speed %</option>
                <option value="streak">Daily Streak</option>
                <option value="score">Average Score</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target</label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData(prev => ({ ...prev, target: e.target.value }))}
                className="w-full border rounded px-3 py-2"
                min="1"
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              >
                {Object.entries(goalCategories).map(([key, category]) => (
                  <option key={key} value={key}>{category.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <select
                value={formData.difficulty}
                onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                className="w-full border rounded px-3 py-2"
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
            <input
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reward</label>
            <input
              type="text"
              value={formData.reward}
              onChange={(e) => setFormData(prev => ({ ...prev, reward: e.target.value }))}
              className="w-full border rounded px-3 py-2"
              placeholder="e.g., 🏆 Achievement Badge"
            />
          </div>
          
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalProgress;
