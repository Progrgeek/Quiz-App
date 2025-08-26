# 🎮 Phase 4 Deep Integration: Gamification & Social Features - Detailed Implementation Guide

**Timeline:** 3 weeks | **Priority:** HIGH | **Goal:** Complete gamification and social integration throughout the entire app

---

## 📋 **WEEK 1: Exercise Integration (Days 1-7)**

### **Day 1: Gamification Elements in Exercise Components**

#### **Morning Session (4 hours): Enhanced Exercise Wrapper**

1. **Create Gamified Exercise Wrapper**

**File:** `src/components/exercises/enhanced/GamifiedExerciseWrapper.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGamification } from '../../../hooks/useGamification';
import { useSound } from '../../../hooks/useSound';

export const GamifiedExerciseWrapper = ({ 
  children, 
  exerciseType, 
  difficulty, 
  onComplete,
  preserveOriginalUI = true // Key: Preserve original Quiz UI
}) => {
  const { 
    xp, 
    level, 
    streak, 
    addXP, 
    updateStreak, 
    checkAchievements 
  } = useGamification();
  
  const { playSound } = useSound();
  const [showXPGain, setShowXPGain] = useState(false);
  const [xpGained, setXPGained] = useState(0);
  const [newAchievements, setNewAchievements] = useState([]);
  const [perfectStreak, setPerfectStreak] = useState(0);

  const calculateXPReward = (score, timeBonus = 1, streakMultiplier = 1) => {
    const baseXP = Math.floor(score / 10) * difficulty * 10;
    const bonusXP = Math.floor(baseXP * timeBonus * streakMultiplier);
    return baseXP + bonusXP;
  };

  const handleExerciseComplete = async (result) => {
    const { score, timeSpent, perfect } = result;
    
    // Calculate XP reward
    const timeBonus = timeSpent < 30 ? 1.5 : timeSpent < 60 ? 1.2 : 1;
    const streakMultiplier = streak > 5 ? 1.3 : streak > 2 ? 1.1 : 1;
    const earnedXP = calculateXPReward(score, timeBonus, streakMultiplier);
    
    // Update XP and show animation
    setXPGained(earnedXP);
    addXP(earnedXP);
    setShowXPGain(true);
    
    // Update streak
    if (perfect) {
      setPerfectStreak(prev => prev + 1);
      updateStreak(true);
      playSound('perfect');
    } else if (score >= 80) {
      updateStreak(true);
      playSound('success');
    } else {
      updateStreak(false);
      playSound('try-again');
    }
    
    // Check for new achievements
    const achievements = await checkAchievements({
      exerciseType,
      score,
      streak: perfectStreak,
      xpTotal: xp + earnedXP
    });
    
    if (achievements.length > 0) {
      setNewAchievements(achievements);
      playSound('achievement');
    }
    
    // Hide XP animation after delay
    setTimeout(() => setShowXPGain(false), 3000);
    
    // Call original completion handler
    onComplete({ ...result, xpGained: earnedXP, achievements });
  };

  return (
    <div className="relative">
      {/* Preserve Original Quiz UI */}
      {preserveOriginalUI && (
        <div className="mb-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              <span className="font-medium text-blue-900">
                📚 Learning Mode: Active
              </span>
              <span className="text-blue-700">
                Level {level} • {xp} XP
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-orange-600 font-medium">
                🔥 Streak: {streak}
              </span>
              <span className="text-green-600">
                ⭐ Perfect: {perfectStreak}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Exercise Content */}
      <div className="relative">
        {/* XP Gain Animation */}
        <AnimatePresence>
          {showXPGain && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -40, scale: 0.6 }}
              className="absolute top-4 right-4 z-50 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full font-bold shadow-lg"
            >
              +{xpGained} XP! 🌟
            </motion.div>
          )}
        </AnimatePresence>

        {/* Achievement Notifications */}
        <AnimatePresence>
          {newAchievements.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-20 right-4 z-50 space-y-2"
            >
              {newAchievements.map((achievement, index) => (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  delay={index * 0.2}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-lg shadow-lg max-w-sm"
                >
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div>
                      <div className="font-bold">Achievement Unlocked!</div>
                      <div className="text-sm opacity-90">{achievement.name}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Original Exercise Component Enhanced */}
        {React.cloneElement(children, {
          onComplete: handleExerciseComplete,
          gamificationEnabled: true,
          currentStreak: streak,
          perfectStreak: perfectStreak
        })}
      </div>
    </div>
  );
};
```

2. **Create Gamification Hook**

**File:** `src/hooks/useGamification.js`
```javascript
import { useState, useEffect, useContext } from 'react';
import { GamificationContext } from '../context/GamificationContext';

export const useGamification = () => {
  const context = useContext(GamificationContext);
  
  if (!context) {
    throw new Error('useGamification must be used within GamificationProvider');
  }

  const {
    user,
    updateUser,
    achievements,
    leaderboard,
    addAchievement
  } = context;

  const addXP = (amount) => {
    const newXP = user.xp + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    updateUser({
      ...user,
      xp: newXP,
      level: newLevel,
      totalXPEarned: (user.totalXPEarned || 0) + amount
    });

    // Save to localStorage for persistence
    localStorage.setItem('gamification_user', JSON.stringify({
      ...user,
      xp: newXP,
      level: newLevel,
      totalXPEarned: (user.totalXPEarned || 0) + amount
    }));
  };

  const updateStreak = (success) => {
    const newStreak = success ? user.streak + 1 : 0;
    const newBestStreak = Math.max(user.bestStreak || 0, newStreak);
    
    updateUser({
      ...user,
      streak: newStreak,
      bestStreak: newBestStreak,
      lastActivity: new Date().toISOString()
    });
  };

  const checkAchievements = async (activityData) => {
    const newAchievements = [];
    
    // Define achievement rules
    const achievementRules = [
      {
        id: 'first_perfect',
        name: 'Perfect Score!',
        description: 'Get your first perfect score',
        icon: '🎯',
        condition: (data) => data.score === 100 && !user.achievements?.includes('first_perfect')
      },
      {
        id: 'streak_5',
        name: 'On Fire!',
        description: 'Maintain a 5-day streak',
        icon: '🔥',
        condition: (data) => data.streak >= 5 && !user.achievements?.includes('streak_5')
      },
      {
        id: 'xp_1000',
        name: 'Rising Star',
        description: 'Earn 1000 XP',
        icon: '⭐',
        condition: (data) => data.xpTotal >= 1000 && !user.achievements?.includes('xp_1000')
      }
    ];

    achievementRules.forEach(rule => {
      if (rule.condition(activityData)) {
        newAchievements.push(rule);
        addAchievement(rule);
      }
    });

    return newAchievements;
  };

  return {
    xp: user.xp || 0,
    level: user.level || 1,
    streak: user.streak || 0,
    bestStreak: user.bestStreak || 0,
    achievements: user.achievements || [],
    addXP,
    updateStreak,
    checkAchievements
  };
};
```

#### **Afternoon Session (4 hours): Exercise Type Integration**

3. **Enhance Multiple Choice with Gamification**

**File:** `src/components/multipleChoice/GamifiedMultipleChoice.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MultipleChoice } from './MultipleChoice'; // Original component
import { GamifiedExerciseWrapper } from '../exercises/enhanced/GamifiedExerciseWrapper';

export const GamifiedMultipleChoice = ({ exerciseData, preserveOriginalUI = true }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [startTime] = useState(Date.now());
  const [confidenceLevel, setConfidenceLevel] = useState(null);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === exerciseData.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

    // Calculate completion result
    const timeSpent = (Date.now() - startTime) / 1000;
    const score = correct ? 100 : 0;
    const perfect = correct && timeSpent < 10; // Perfect if correct and fast

    // Enhanced result with gamification data
    const result = {
      score,
      timeSpent,
      perfect,
      confidence: confidenceLevel,
      answerSelected: answerIndex,
      correctAnswer: exerciseData.correctAnswer
    };

    return result;
  };

  return (
    <GamifiedExerciseWrapper
      exerciseType="multiple-choice"
      difficulty={exerciseData.difficulty || 3}
      preserveOriginalUI={preserveOriginalUI}
      onComplete={(result) => {
        console.log('Exercise completed with gamification:', result);
      }}
    >
      {/* Original Multiple Choice Component Enhanced */}
      <div className="space-y-6">
        {/* Confidence Selector - New Enhancement */}
        {!showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 rounded-lg p-4 border border-blue-200"
          >
            <h4 className="font-medium text-blue-900 mb-3">How confident are you?</h4>
            <div className="flex space-x-2">
              {[
                { level: 1, label: 'Guessing', emoji: '🤔' },
                { level: 2, label: 'Somewhat Sure', emoji: '🙂' },
                { level: 3, label: 'Very Confident', emoji: '😎' }
              ].map((option) => (
                <button
                  key={option.level}
                  onClick={() => setConfidenceLevel(option.level)}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    confidenceLevel === option.level
                      ? 'border-blue-500 bg-blue-100'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="text-lg">{option.emoji}</div>
                  <div className="text-sm font-medium">{option.label}</div>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Original Multiple Choice Interface */}
        <MultipleChoice
          exerciseData={exerciseData}
          onAnswerSelect={handleAnswerSelect}
          selectedAnswer={selectedAnswer}
          showFeedback={showFeedback}
          enhancedMode={true}
        />

        {/* Enhanced Feedback with Gamification */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-lg p-6 border-2 ${
              isCorrect 
                ? 'bg-green-50 border-green-200' 
                : 'bg-red-50 border-red-200'
            }`}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="text-3xl">
                {isCorrect ? '🎉' : '💪'}
              </div>
              <div>
                <h3 className={`text-lg font-bold ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? 'Excellent!' : 'Keep Learning!'}
                </h3>
                <p className={`text-sm ${
                  isCorrect ? 'text-green-600' : 'text-red-600'
                }`}>
                  {isCorrect 
                    ? 'Perfect! Your understanding is solid.'
                    : 'Not quite right, but you\'re learning!'
                  }
                </p>
              </div>
            </div>

            {/* Confidence Analysis */}
            {confidenceLevel && (
              <div className="mb-4 p-3 bg-white rounded border">
                <h4 className="font-medium mb-2">Confidence Analysis</h4>
                <div className="text-sm text-gray-600">
                  You were {confidenceLevel === 1 ? 'guessing' : confidenceLevel === 2 ? 'somewhat sure' : 'very confident'} 
                  {isCorrect && confidenceLevel === 3 && (
                    <span className="text-green-600 font-medium"> - Excellent self-assessment! 🎯</span>
                  )}
                  {!isCorrect && confidenceLevel === 3 && (
                    <span className="text-orange-600 font-medium"> - This suggests a knowledge gap to review 📚</span>
                  )}
                </div>
              </div>
            )}

            {/* Original explanation preserved */}
            <div className="text-gray-700">
              {exerciseData.explanation}
            </div>
          </motion.div>
        )}
      </div>
    </GamifiedExerciseWrapper>
  );
};
```

### **Day 2: Fill in the Blanks Enhancement**

**File:** `src/components/fillInTheBlanks/GamifiedFillInBlanks.jsx`
```jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FillInTheBlanks } from './FillInTheBlanks'; // Original component
import { GamifiedExerciseWrapper } from '../exercises/enhanced/GamifiedExerciseWrapper';

export const GamifiedFillInBlanks = ({ exerciseData, preserveOriginalUI = true }) => {
  const [answers, setAnswers] = useState({});
  const [hints, setHints] = useState({});
  const [showHints, setShowHints] = useState({});
  const [attempts, setAttempts] = useState({});
  const [completionTime, setCompletionTime] = useState(null);
  const [startTime] = useState(Date.now());
  const [streak, setStreak] = useState(0);

  // Enhanced with typing speed tracking
  const [typingSpeed, setTypingSpeed] = useState({});
  const inputRefs = useRef({});

  const handleInputChange = (blankIndex, value) => {
    setAnswers(prev => ({ ...prev, [blankIndex]: value }));
    
    // Track typing speed
    const now = Date.now();
    const chars = value.length;
    const timeElapsed = (now - startTime) / 1000;
    const wpm = chars > 0 ? (chars / 5) / (timeElapsed / 60) : 0;
    
    setTypingSpeed(prev => ({ ...prev, [blankIndex]: wpm }));
  };

  const handleHintRequest = (blankIndex) => {
    const hintText = exerciseData.hints?.[blankIndex] || 'Think about the context...';
    setHints(prev => ({ ...prev, [blankIndex]: hintText }));
    setShowHints(prev => ({ ...prev, [blankIndex]: true }));
    setAttempts(prev => ({ ...prev, [blankIndex]: (prev[blankIndex] || 0) + 1 }));
  };

  const checkCompletion = () => {
    const totalBlanks = exerciseData.blanks.length;
    const filledBlanks = Object.keys(answers).filter(key => answers[key]?.trim()).length;
    
    if (filledBlanks === totalBlanks) {
      const endTime = Date.now();
      setCompletionTime((endTime - startTime) / 1000);
      
      // Calculate score with gamification factors
      const correctAnswers = exerciseData.blanks.filter((blank, index) => 
        answers[index]?.toLowerCase().trim() === blank.correctAnswer.toLowerCase()
      ).length;
      
      const accuracy = (correctAnswers / totalBlanks) * 100;
      const timeBonus = completionTime < 60 ? 20 : completionTime < 120 ? 10 : 0;
      const hintPenalty = Object.keys(hints).length * 5;
      const finalScore = Math.max(0, accuracy + timeBonus - hintPenalty);
      
      return {
        score: finalScore,
        timeSpent: completionTime,
        perfect: correctAnswers === totalBlanks && Object.keys(hints).length === 0,
        accuracy: accuracy,
        hintsUsed: Object.keys(hints).length,
        avgTypingSpeed: Object.values(typingSpeed).reduce((a, b) => a + b, 0) / Object.values(typingSpeed).length || 0
      };
    }
    return null;
  };

  useEffect(() => {
    const result = checkCompletion();
    if (result) {
      // Auto-submit when complete
      console.log('Fill in blanks completed:', result);
    }
  }, [answers]);

  return (
    <GamifiedExerciseWrapper
      exerciseType="fill-in-blanks"
      difficulty={exerciseData.difficulty || 3}
      preserveOriginalUI={preserveOriginalUI}
      onComplete={checkCompletion}
    >
      <div className="space-y-6">
        {/* Progress Indicator */}
        <div className="bg-gray-50 rounded-lg p-4 border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">
              {Object.keys(answers).filter(key => answers[key]?.trim()).length} / {exerciseData.blanks.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(Object.keys(answers).filter(key => answers[key]?.trim()).length / exerciseData.blanks.length) * 100}%` 
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Enhanced Fill in Blanks Interface */}
        <div className="bg-white rounded-lg p-6 border">
          <div className="prose max-w-none">
            {exerciseData.text.split(/(\[BLANK_\d+\])/).map((part, index) => {
              const blankMatch = part.match(/\[BLANK_(\d+)\]/);
              
              if (blankMatch) {
                const blankIndex = parseInt(blankMatch[1]);
                const isCorrect = answers[blankIndex]?.toLowerCase().trim() === 
                  exerciseData.blanks[blankIndex]?.correctAnswer.toLowerCase();
                
                return (
                  <span key={index} className="relative inline-block">
                    <input
                      ref={el => inputRefs.current[blankIndex] = el}
                      type="text"
                      value={answers[blankIndex] || ''}
                      onChange={(e) => handleInputChange(blankIndex, e.target.value)}
                      className={`inline-block min-w-[120px] px-3 py-1 mx-1 border-b-2 bg-transparent focus:outline-none transition-colors ${
                        answers[blankIndex] 
                          ? isCorrect 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-red-500 bg-red-50'
                          : 'border-gray-300 focus:border-blue-500'
                      }`}
                      placeholder="..."
                    />
                    
                    {/* Hint Button */}
                    <button
                      onClick={() => handleHintRequest(blankIndex)}
                      className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                      title="Get a hint"
                    >
                      💡
                    </button>
                    
                    {/* Hint Display */}
                    <AnimatePresence>
                      {showHints[blankIndex] && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute top-full left-0 mt-1 p-2 bg-yellow-100 border border-yellow-300 rounded text-sm text-yellow-800 z-10 whitespace-nowrap"
                        >
                          💡 {hints[blankIndex]}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </span>
                );
              }
              
              return <span key={index}>{part}</span>;
            })}
          </div>
        </div>

        {/* Performance Metrics */}
        {Object.keys(answers).length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
              <div className="text-sm text-blue-600 font-medium">Typing Speed</div>
              <div className="text-lg font-bold text-blue-900">
                {Math.round(Object.values(typingSpeed).reduce((a, b) => a + b, 0) / Object.values(typingSpeed).length || 0)} WPM
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
              <div className="text-sm text-green-600 font-medium">Completed</div>
              <div className="text-lg font-bold text-green-900">
                {Object.keys(answers).filter(key => answers[key]?.trim()).length}/{exerciseData.blanks.length}
              </div>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <div className="text-sm text-yellow-600 font-medium">Hints Used</div>
              <div className="text-lg font-bold text-yellow-900">
                {Object.keys(hints).length}
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
              <div className="text-sm text-purple-600 font-medium">Time</div>
              <div className="text-lg font-bold text-purple-900">
                {Math.round((Date.now() - startTime) / 1000)}s
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </GamifiedExerciseWrapper>
  );
};
```

### **Day 3: Drag & Drop Gamification**

**File:** `src/components/dragAndDrop/GamifiedDragAndDrop.jsx`
```jsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DragAndDrop } from './DragAndDrop'; // Original component
import { GamifiedExerciseWrapper } from '../exercises/enhanced/GamifiedExerciseWrapper';

export const GamifiedDragAndDrop = ({ exerciseData, preserveOriginalUI = true }) => {
  const [items, setItems] = useState(exerciseData.items);
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropZones, setDropZones] = useState([]);
  const [moveCount, setMoveCount] = useState(0);
  const [startTime] = useState(Date.now());
  const [isComplete, setIsComplete] = useState(false);
  const [accuracy, setAccuracy] = useState(0);

  // Enhanced move tracking
  const [moveHistory, setMoveHistory] = useState([]);
  const [efficiency, setEfficiency] = useState(100);

  const handleDragStart = (item) => {
    setDraggedItem(item);
  };

  const handleDrop = (targetPosition) => {
    if (!draggedItem) return;

    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);

    // Record move in history
    const move = {
      itemId: draggedItem.id,
      fromPosition: draggedItem.currentPosition || 'start',
      toPosition: targetPosition,
      timestamp: Date.now() - startTime,
      correct: targetPosition === draggedItem.correctPosition
    };
    
    setMoveHistory(prev => [...prev, move]);

    // Update item position
    const updatedItems = items.map(item => 
      item.id === draggedItem.id 
        ? { ...item, currentPosition: targetPosition }
        : item
    );
    setItems(updatedItems);

    // Calculate efficiency (fewer moves = higher efficiency)
    const optimalMoves = exerciseData.items.length;
    const currentEfficiency = Math.max(0, 100 - ((newMoveCount - optimalMoves) * 10));
    setEfficiency(currentEfficiency);

    // Check completion
    const allCorrect = updatedItems.every(item => 
      item.currentPosition === item.correctPosition
    );

    if (allCorrect) {
      setIsComplete(true);
      const timeSpent = (Date.now() - startTime) / 1000;
      const accuracyScore = (updatedItems.filter(item => 
        item.currentPosition === item.correctPosition
      ).length / updatedItems.length) * 100;
      
      setAccuracy(accuracyScore);

      // Calculate final score with gamification
      const baseScore = accuracyScore;
      const efficiencyBonus = efficiency * 0.2;
      const speedBonus = timeSpent < 60 ? 20 : timeSpent < 120 ? 10 : 0;
      const finalScore = Math.min(100, baseScore + efficiencyBonus + speedBonus);

      return {
        score: finalScore,
        timeSpent,
        perfect: accuracyScore === 100 && efficiency >= 90,
        moves: newMoveCount,
        efficiency: efficiency,
        moveHistory: moveHistory
      };
    }

    setDraggedItem(null);
  };

  return (
    <GamifiedExerciseWrapper
      exerciseType="drag-and-drop"
      difficulty={exerciseData.difficulty || 4}
      preserveOriginalUI={preserveOriginalUI}
      onComplete={(result) => {
        console.log('Drag and drop completed:', result);
      }}
    >
      <div className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Moves</div>
            <div className="text-lg font-bold text-blue-900">{moveCount}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Efficiency</div>
            <div className="text-lg font-bold text-green-900">{efficiency}%</div>
          </div>
          
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium">Time</div>
            <div className="text-lg font-bold text-purple-900">
              {Math.round((Date.now() - startTime) / 1000)}s
            </div>
          </div>
          
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
            <div className="text-sm text-yellow-600 font-medium">Accuracy</div>
            <div className="text-lg font-bold text-yellow-900">
              {Math.round((items.filter(item => item.currentPosition === item.correctPosition).length / items.length) * 100)}%
            </div>
          </div>
        </div>

        {/* Enhanced Drag and Drop Interface */}
        <div className="bg-white rounded-lg p-6 border">
          <h3 className="text-lg font-semibold mb-4">{exerciseData.question}</h3>
          
          {/* Drop Zones */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            {[1, 2, 3, 4, 5].map(position => {
              const itemInPosition = items.find(item => item.currentPosition === position);
              
              return (
                <motion.div
                  key={position}
                  className={`min-h-[80px] border-2 border-dashed rounded-lg p-4 flex items-center justify-center transition-colors ${
                    draggedItem 
                      ? 'border-blue-400 bg-blue-50' 
                      : 'border-gray-300 bg-gray-50'
                  }`}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => handleDrop(position)}
                  whileHover={{ scale: draggedItem ? 1.05 : 1 }}
                >
                  {itemInPosition ? (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className={`w-full text-center p-3 rounded border-2 cursor-move ${
                        itemInPosition.correctPosition === position
                          ? 'border-green-500 bg-green-100 text-green-800'
                          : 'border-red-500 bg-red-100 text-red-800'
                      }`}
                      draggable
                      onDragStart={() => handleDragStart(itemInPosition)}
                    >
                      {itemInPosition.content}
                    </motion.div>
                  ) : (
                    <div className="text-gray-400 text-sm">
                      Position {position}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Items Pool */}
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-700 mb-3">Items to arrange:</h4>
            <div className="flex flex-wrap gap-3">
              {items.filter(item => !item.currentPosition).map(item => (
                <motion.div
                  key={item.id}
                  className="p-3 bg-white border-2 border-gray-300 rounded-lg cursor-move hover:border-blue-400 transition-colors"
                  draggable
                  onDragStart={() => handleDragStart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileDrag={{ scale: 1.1, zIndex: 1000 }}
                >
                  {item.content}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Move History */}
        {moveHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-gray-50 rounded-lg p-4 border"
          >
            <h4 className="font-medium text-gray-700 mb-3">Move History</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {moveHistory.map((move, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${
                    move.correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  Move {index + 1}: Item to position {move.toPosition} 
                  {move.correct ? ' ✓' : ' ✗'}
                  <span className="text-gray-600 ml-2">
                    ({(move.timestamp / 1000).toFixed(1)}s)
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Completion Animation */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg p-6 text-center"
            >
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="text-xl font-bold mb-2">Exercise Complete!</h3>
              <p className="text-green-100">
                Accuracy: {accuracy}% • Efficiency: {efficiency}% • Moves: {moveCount}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GamifiedExerciseWrapper>
  );
};
```

### **Day 4: Sequence & Syllable Counting Enhancement**

**File:** `src/components/sequencing/GamifiedSequencing.jsx`
```jsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sequencing } from './Sequencing'; // Original component
import { GamifiedExerciseWrapper } from '../exercises/enhanced/GamifiedExerciseWrapper';

export const GamifiedSequencing = ({ exerciseData, preserveOriginalUI = true }) => {
  const [sequence, setSequence] = useState([]);
  const [availableItems, setAvailableItems] = useState(exerciseData.items);
  const [startTime] = useState(Date.now());
  const [attempts, setAttempts] = useState(0);
  const [showHints, setShowHints] = useState(false);

  const handleItemSelect = (item) => {
    setSequence(prev => [...prev, item]);
    setAvailableItems(prev => prev.filter(i => i.id !== item.id));
    setAttempts(prev => prev + 1);
  };

  const handleRemoveFromSequence = (itemToRemove) => {
    setSequence(prev => prev.filter(item => item.id !== itemToRemove.id));
    setAvailableItems(prev => [...prev, itemToRemove]);
  };

  const checkCompletion = () => {
    if (sequence.length === exerciseData.items.length) {
      const isCorrect = sequence.every((item, index) => 
        item.correctOrder === index + 1
      );
      
      const timeSpent = (Date.now() - startTime) / 1000;
      const score = isCorrect ? 100 : 
        (sequence.filter((item, index) => item.correctOrder === index + 1).length / sequence.length) * 100;

      return {
        score,
        timeSpent,
        perfect: isCorrect && !showHints,
        attempts,
        hintsUsed: showHints
      };
    }
    return null;
  };

  useEffect(() => {
    const result = checkCompletion();
    if (result) {
      console.log('Sequencing completed:', result);
    }
  }, [sequence]);

  return (
    <GamifiedExerciseWrapper
      exerciseType="sequencing"
      difficulty={exerciseData.difficulty || 3}
      preserveOriginalUI={preserveOriginalUI}
      onComplete={checkCompletion}
    >
      <div className="space-y-6">
        {/* Progress Tracker */}
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Progress</span>
            <span className="text-sm text-blue-600">
              {sequence.length} / {exerciseData.items.length}
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${(sequence.length / exerciseData.items.length) * 100}%` 
              }}
            />
          </div>
        </div>

        {/* Hint System */}
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">{exerciseData.question}</h3>
          <button
            onClick={() => setShowHints(true)}
            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
          >
            💡 Show Hints
          </button>
        </div>

        {/* Hints Display */}
        <AnimatePresence>
          {showHints && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
            >
              <h4 className="font-medium text-yellow-800 mb-2">Hints:</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                {exerciseData.hints?.map((hint, index) => (
                  <li key={index}>• {hint}</li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sequence Builder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Current Sequence */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Your Sequence:</h4>
            <div className="min-h-[200px] bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
              {sequence.length === 0 ? (
                <div className="text-center text-gray-500 py-8">
                  Start building your sequence...
                </div>
              ) : (
                <div className="space-y-2">
                  {sequence.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                        item.correctOrder === index + 1
                          ? 'border-green-500 bg-green-100'
                          : 'border-red-500 bg-red-100'
                      }`}
                      onClick={() => handleRemoveFromSequence(item)}
                    >
                      <div className="flex items-center justify-between">
                        <span>{index + 1}. {item.content}</span>
                        <span className="text-xs text-gray-500">Click to remove</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Available Items */}
          <div className="space-y-3">
            <h4 className="font-medium text-gray-700">Available Items:</h4>
            <div className="space-y-2">
              {availableItems.map(item => (
                <motion.div
                  key={item.id}
                  className="p-3 bg-white rounded-lg border-2 border-gray-200 cursor-pointer hover:border-blue-400 transition-colors"
                  onClick={() => handleItemSelect(item)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {item.content}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
            <div className="text-sm text-purple-600 font-medium">Attempts</div>
            <div className="text-lg font-bold text-purple-900">{attempts}</div>
          </div>
          
          <div className="bg-green-50 rounded-lg p-3 border border-green-200">
            <div className="text-sm text-green-600 font-medium">Correct</div>
            <div className="text-lg font-bold text-green-900">
              {sequence.filter((item, index) => item.correctOrder === index + 1).length}
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
            <div className="text-sm text-blue-600 font-medium">Time</div>
            <div className="text-lg font-bold text-blue-900">
              {Math.round((Date.now() - startTime) / 1000)}s
            </div>
          </div>
        </div>
      </div>
    </GamifiedExerciseWrapper>
  );
};
```

### **Day 5-7: Integration Testing & Polish**

**Day 5: Sound System Integration**

**File:** `src/hooks/useSound.js`
```javascript
import { useState, useEffect, useRef } from 'react';

export const useSound = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioRefs = useRef({});

  // Sound library
  const sounds = {
    perfect: '/sounds/perfect.mp3',
    success: '/sounds/success.mp3',
    'try-again': '/sounds/try-again.mp3',
    achievement: '/sounds/achievement.mp3',
    'level-up': '/sounds/level-up.mp3',
    click: '/sounds/click.mp3',
    notification: '/sounds/notification.mp3'
  };

  useEffect(() => {
    // Preload sounds
    Object.entries(sounds).forEach(([key, src]) => {
      const audio = new Audio(src);
      audio.preload = 'auto';
      audioRefs.current[key] = audio;
    });

    // Get user preference
    const savedPreference = localStorage.getItem('sound_enabled');
    if (savedPreference !== null) {
      setSoundEnabled(JSON.parse(savedPreference));
    }
  }, []);

  const playSound = (soundName, volume = 0.5) => {
    if (!soundEnabled || !audioRefs.current[soundName]) return;

    const audio = audioRefs.current[soundName];
    audio.volume = volume;
    audio.currentTime = 0;
    
    // Handle promise for modern browsers
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.log('Audio play failed:', error);
      });
    }
  };

  const toggleSound = () => {
    const newState = !soundEnabled;
    setSoundEnabled(newState);
    localStorage.setItem('sound_enabled', JSON.stringify(newState));
  };

  return {
    soundEnabled,
    playSound,
    toggleSound
  };
};
```

---

## 📋 **WEEK 2: Social Integration (Days 8-14)**

### **Day 8: Social Context Setup**

**File:** `src/context/GamificationContext.jsx`
```jsx
import React, { createContext, useReducer, useEffect } from 'react';

const initialState = {
  user: {
    id: null,
    username: '',
    avatar: '🎓',
    level: 1,
    xp: 0,
    streak: 0,
    bestStreak: 0,
    achievements: [],
    friends: [],
    groups: []
  },
  leaderboard: [],
  achievements: [],
  socialData: {
    friendRequests: [],
    messages: [],
    notifications: []
  }
};

const gamificationReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    
    case 'ADD_ACHIEVEMENT':
      return {
        ...state,
        user: {
          ...state.user,
          achievements: [...state.user.achievements, action.payload.id]
        }
      };
    
    case 'UPDATE_LEADERBOARD':
      return {
        ...state,
        leaderboard: action.payload
      };
    
    case 'ADD_FRIEND_REQUEST':
      return {
        ...state,
        socialData: {
          ...state.socialData,
          friendRequests: [...state.socialData.friendRequests, action.payload]
        }
      };
    
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        socialData: {
          ...state.socialData,
          notifications: [action.payload, ...state.socialData.notifications]
        }
      };
    
    default:
      return state;
  }
};

export const GamificationContext = createContext();

export const GamificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(gamificationReducer, initialState);

  // Load data on initialization
  useEffect(() => {
    const savedUser = localStorage.getItem('gamification_user');
    if (savedUser) {
      dispatch({
        type: 'UPDATE_USER',
        payload: JSON.parse(savedUser)
      });
    }
  }, []);

  const updateUser = (userData) => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  const addAchievement = (achievement) => {
    dispatch({ type: 'ADD_ACHIEVEMENT', payload: achievement });
    // Also add notification
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: {
        id: `notif_${Date.now()}`,
        type: 'achievement',
        title: 'Achievement Unlocked!',
        message: `You earned '${achievement.name}'`,
        timestamp: new Date().toISOString(),
        read: false
      }
    });
  };

  const value = {
    ...state,
    updateUser,
    addAchievement,
    dispatch
  };

  return (
    <GamificationContext.Provider value={value}>
      {children}
    </GamificationContext.Provider>
  );
};
```

### **Day 9-14: Complete Social Features**

**File:** `src/components/social/SocialDashboard.jsx`
```jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FriendsPanel } from './FriendsPanel';
import { GroupsPanel } from './GroupsPanel';
import { LeaderboardPanel } from './LeaderboardPanel';
import { NotificationsPanel } from './NotificationsPanel';

export const SocialDashboard = ({ preserveOriginalUI = true }) => {
  const [activeTab, setActiveTab] = useState('friends');

  const tabs = [
    { id: 'friends', label: 'Friends', icon: '👥' },
    { id: 'groups', label: 'Groups', icon: '🎯' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      {preserveOriginalUI && (
        <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
          <h1 className="text-2xl font-bold text-purple-900 mb-2">
            🤝 Social Learning Hub
          </h1>
          <p className="text-purple-700">
            Connect with fellow learners, join study groups, and track your progress together!
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'friends' && <FriendsPanel />}
        {activeTab === 'groups' && <GroupsPanel />}
        {activeTab === 'leaderboard' && <LeaderboardPanel />}
        {activeTab === 'notifications' && <NotificationsPanel />}
      </motion.div>
    </div>
  );
};
```

---

## 📋 **WEEK 3: Advanced Features (Days 15-21)**

### **Day 15-21: Achievement System, Challenges, Analytics Integration**

[This section would continue with detailed implementations for advanced achievement tracking, social challenges, real-time analytics integration, and comprehensive testing suites...]

---

## 🎯 **IMPLEMENTATION CHECKLIST**

### **Week 1 Checklist:**
- [ ] Gamified Exercise Wrapper implemented
- [ ] useGamification hook created
- [ ] Multiple Choice enhancement complete
- [ ] Fill in Blanks gamification added
- [ ] Drag & Drop improvements done
- [ ] Sequencing enhancements ready
- [ ] Sound system integrated
- [ ] All components preserve original UI

### **Week 2 Checklist:**
- [ ] Social context implemented
- [ ] Friends system functional
- [ ] Study groups operational
- [ ] Messaging system working
- [ ] Leaderboards updating
- [ ] Notifications delivering
- [ ] Social dashboard complete

### **Week 3 Checklist:**
- [ ] Advanced achievements system
- [ ] Challenge framework
- [ ] Real-time updates working
- [ ] Performance optimized
- [ ] Full integration testing
- [ ] Cross-browser compatibility
- [ ] Mobile responsiveness verified

**🎮 All Phase 4 implementations preserve the original Quiz UI while adding enhanced gamification and social features! Ready for dynamic JSON testing and full frontend completion! 🚀**
