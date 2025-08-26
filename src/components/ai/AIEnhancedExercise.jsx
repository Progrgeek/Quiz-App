/**
 * AI-Enhanced Exercise Component
 * Integrates AI-powered hints, adaptive difficulty, and personalized content
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useAI, useIntelligentHints, useAdaptiveDifficulty } from '../../hooks/useAI';
import { useExerciseTracking } from '../../hooks/useAnalytics';

const AIEnhancedExercise = ({ 
  exercise, 
  onComplete, 
  onNext, 
  children 
}) => {
  const ai = useAI();
  const exerciseTracking = useExerciseTracking();
  const { 
    currentHint, 
    requestHint, 
    resetHints, 
    startAutoHintTimer,
    hasHints 
  } = useIntelligentHints(exercise.currentQuestion);
  
  const {
    currentDifficulty,
    recordPerformance,
    adaptCurrentDifficulty
  } = useAdaptiveDifficulty(exercise.difficulty);

  const [showHint, setShowHint] = useState(false);
  const [personalizedContent, setPersonalizedContent] = useState(null);
  const [adaptiveFeatures, setAdaptiveFeatures] = useState({
    hintsEnabled: true,
    adaptiveDifficulty: true,
    personalizedContent: true
  });

  // Initialize exercise tracking
  useEffect(() => {
    exerciseTracking.startExercise({
      id: exercise.id,
      type: exercise.type,
      difficulty: currentDifficulty,
      questions: exercise.questions,
      estimatedDuration: exercise.estimatedDuration,
      tags: exercise.tags
    });
  }, [exercise, currentDifficulty, exerciseTracking]);

  // Personalize content on load
  useEffect(() => {
    if (adaptiveFeatures.personalizedContent) {
      const personalized = ai.personalizeContent(exercise);
      setPersonalizedContent(personalized);
    }
  }, [exercise, ai, adaptiveFeatures.personalizedContent]);

  // Start auto-hint timer when question changes
  useEffect(() => {
    if (exercise.currentQuestion && adaptiveFeatures.hintsEnabled) {
      resetHints();
      startAutoHintTimer(20000); // Auto-hint after 20 seconds
      
      exerciseTracking.startQuestion({
        id: exercise.currentQuestion.id,
        type: exercise.currentQuestion.type,
        difficulty: exercise.currentQuestion.difficulty,
        estimatedTime: exercise.currentQuestion.estimatedTime
      });
    }
  }, [exercise.currentQuestion, adaptiveFeatures.hintsEnabled, resetHints, startAutoHintTimer, exerciseTracking]);

  const handleHintRequest = useCallback(() => {
    if (!adaptiveFeatures.hintsEnabled) return;
    
    const hint = requestHint();
    setShowHint(true);
    
    exerciseTracking.useHint(
      exercise.currentQuestion?.id,
      hint.level,
      hint.content
    );
  }, [adaptiveFeatures.hintsEnabled, requestHint, exerciseTracking, exercise.currentQuestion]);

  const handleAnswerSubmit = useCallback((answer, isCorrect, confidence = null) => {
    // Track the answer
    exerciseTracking.submitAnswer(
      exercise.currentQuestion?.id,
      answer,
      isCorrect,
      confidence
    );

    // Record performance for adaptation
    recordPerformance({
      questionId: exercise.currentQuestion?.id,
      isCorrect,
      timeToAnswer: Date.now() - (exercise.currentQuestion?.startTime || Date.now()),
      hintsUsed: hasHints,
      difficulty: currentDifficulty
    });

    // Adapt difficulty if enabled
    if (adaptiveFeatures.adaptiveDifficulty) {
      adaptCurrentDifficulty(exercise);
    }

    // Hide hint after answer
    setShowHint(false);
  }, [
    exerciseTracking,
    exercise.currentQuestion,
    recordPerformance,
    adaptiveFeatures.adaptiveDifficulty,
    adaptCurrentDifficulty,
    exercise,
    hasHints,
    currentDifficulty
  ]);

  const handleExerciseComplete = useCallback((results) => {
    exerciseTracking.completeExercise(results);
    
    // Analyze performance for AI insights
    ai.analyzePerformance({
      exerciseId: exercise.id,
      accuracy: results.accuracy,
      averageTime: results.averageTime,
      questionsAnswered: results.questionsAnswered,
      topics: exercise.topics || []
    });

    if (onComplete) {
      onComplete({
        ...results,
        adaptedDifficulty: currentDifficulty,
        hintsUsed: hasHints
      });
    }
  }, [exerciseTracking, ai, exercise, currentDifficulty, hasHints, onComplete]);

  const toggleAdaptiveFeature = useCallback((feature) => {
    setAdaptiveFeatures(prev => ({
      ...prev,
      [feature]: !prev[feature]
    }));
  }, []);

  const content = personalizedContent || exercise;

  return (
    <div className="ai-enhanced-exercise relative">
      {/* AI Features Control Panel */}
      <AIControlPanel 
        features={adaptiveFeatures}
        onToggle={toggleAdaptiveFeature}
        currentDifficulty={currentDifficulty}
        userLevel={ai.userInsights?.currentLevel}
      />

      {/* Main Exercise Content */}
      <div className="exercise-content">
        {React.cloneElement(children, {
          exercise: content,
          onAnswerSubmit: handleAnswerSubmit,
          onComplete: handleExerciseComplete,
          difficulty: currentDifficulty
        })}
      </div>

      {/* AI Hint System */}
      {adaptiveFeatures.hintsEnabled && (
        <AIHintSystem
          currentHint={currentHint}
          showHint={showHint}
          onRequestHint={handleHintRequest}
          onCloseHint={() => setShowHint(false)}
        />
      )}

      {/* Adaptive Difficulty Indicator */}
      {adaptiveFeatures.adaptiveDifficulty && (
        <DifficultyIndicator
          currentDifficulty={currentDifficulty}
          originalDifficulty={exercise.difficulty}
        />
      )}
    </div>
  );
};

const AIControlPanel = ({ features, onToggle, currentDifficulty, userLevel }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="ai-control-panel absolute top-4 right-4 z-10">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow"
        title="AI Features"
      >
        <span className="text-xl">🤖</span>
      </button>

      {isExpanded && (
        <div className="absolute right-0 top-12 bg-white rounded-lg shadow-xl p-4 min-w-64 border">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
            <span className="mr-2">🤖</span>
            AI Features
          </h3>
          
          <div className="space-y-3">
            <FeatureToggle
              label="Intelligent Hints"
              description="AI-powered contextual hints"
              enabled={features.hintsEnabled}
              onToggle={() => onToggle('hintsEnabled')}
              icon="💡"
            />
            
            <FeatureToggle
              label="Adaptive Difficulty"
              description="Auto-adjust based on performance"
              enabled={features.adaptiveDifficulty}
              onToggle={() => onToggle('adaptiveDifficulty')}
              icon="🎯"
            />
            
            <FeatureToggle
              label="Personalized Content"
              description="Content adapted to your learning style"
              enabled={features.personalizedContent}
              onToggle={() => onToggle('personalizedContent')}
              icon="🎨"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <p>Current Level: <span className="font-medium capitalize">{userLevel}</span></p>
              <p>Difficulty: <span className="font-medium capitalize">{currentDifficulty}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const FeatureToggle = ({ label, description, enabled, onToggle, icon }) => (
  <div className="flex items-start space-x-3">
    <span className="text-lg mt-0.5">{icon}</span>
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <span className="font-medium text-sm text-gray-900">{label}</span>
        <button
          onClick={onToggle}
          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
            enabled ? 'bg-blue-500' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-5' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-0.5">{description}</p>
    </div>
  </div>
);

const AIHintSystem = ({ currentHint, showHint, onRequestHint, onCloseHint }) => {
  if (!showHint && !currentHint) {
    return (
      <div className="fixed bottom-6 right-6">
        <button
          onClick={onRequestHint}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all"
          title="Get AI Hint"
        >
          <span className="text-xl">💡</span>
        </button>
      </div>
    );
  }

  if (!showHint) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-sm">
      <div className="bg-white rounded-lg shadow-xl border-l-4 border-blue-500 p-4">
        <div className="flex justify-between items-start mb-2">
          <h4 className="font-semibold text-gray-900 flex items-center">
            <span className="mr-2">💡</span>
            AI Hint (Level {currentHint?.level})
          </h4>
          <button
            onClick={onCloseHint}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>
        
        <p className="text-sm text-gray-700 mb-3">
          {currentHint?.content}
        </p>
        
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span>Strategy: {currentHint?.strategy}</span>
          <span>Confidence: {Math.round((currentHint?.confidence || 0) * 100)}%</span>
        </div>
        
        {currentHint?.followUp && (
          <p className="text-xs text-blue-600 mt-2 italic">
            {currentHint.followUp}
          </p>
        )}
        
        <div className="mt-3 flex space-x-2">
          <button
            onClick={onRequestHint}
            className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
          >
            More Specific
          </button>
          <button
            onClick={onCloseHint}
            className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

const DifficultyIndicator = ({ currentDifficulty, originalDifficulty }) => {
  const isAdapted = currentDifficulty !== originalDifficulty;
  
  if (!isAdapted) return null;

  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    easy: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    medium: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-orange-100 text-orange-800',
    hard: 'bg-red-100 text-red-800',
    expert: 'bg-red-100 text-red-800'
  };

  const colorClass = difficultyColors[currentDifficulty] || 'bg-gray-100 text-gray-800';

  return (
    <div className="fixed top-6 left-6">
      <div className={`px-3 py-1 rounded-full text-xs font-medium ${colorClass} flex items-center space-x-1`}>
        <span>🎯</span>
        <span>Adapted to {currentDifficulty}</span>
        <span className="text-xs opacity-75">(was {originalDifficulty})</span>
      </div>
    </div>
  );
};

export default AIEnhancedExercise;
