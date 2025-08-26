import React, { useState, useEffect } from 'react';
import rhymeData from './rhymeExercisesData.json';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseOption, 
  ExerciseGrid, 
  ExerciseButton,
  ExerciseFeedback 
} from '../../design-system/ExerciseComponents';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import FinalResults from '../FinalResults';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

const RhymeExercises = ({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null,
  exercise, 
  onComplete, 
  onAnswerSubmit 
}) => {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

  // Backend Integration Hooks
  const quizEngine = useQuizEngine({
    enabled: enableBackendIntegration,
    exerciseType: 'rhymeExercises',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'rhymeExercises',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'rhymeExercises',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'rhymeExercises'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [rhymePatternAnalysis, setRhymePatternAnalysis] = useState({});
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Handle different data formats - use multiple exercises for full experience
  const exercises = Array.isArray(rhymeData) ? rhymeData : [rhymeData];
  const currentExercise = exercise || exercises[currentExerciseIndex] || rhymeData[0];
  
  const totalExercises = enableBackendIntegration ? exercises.length : 1;
  const pointsPerQuestion = 100 / totalExercises;

  // Initialize backend systems
  useEffect(() => {
    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  }, [enableBackendIntegration]);

  const initializeBackendSystems = async () => {
    try {
      // Initialize QuizEngine
      if (quizEngine.isReady) {
        await quizEngine.startExercise({
          exerciseType: 'rhymeExercises',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'rhymeExercises',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  useEffect(() => {
    if (enableBackendIntegration) {
      const timer = setInterval(() => {
        if (!showFinalResults) {
          setTimeElapsed((prev) => prev + 1);
          
          // Update QuizEngine timer if backend is enabled
          if (quizEngine.isReady) {
            quizEngine.updateTimer(timeElapsed + 1);
          }
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showFinalResults, enableBackendIntegration, quizEngine.isReady, timeElapsed]);

  useEffect(() => {
    // Reset enhanced state when exercise changes
    setSelectionHistory([]);
    setRhymePatternAnalysis({});
    setQuestionStartTime(Date.now());
  }, [currentExerciseIndex]);

  const handleOptionClick = async (option) => {
    if (!enableBackendIntegration && onAnswerSubmit) {
      // Original single exercise mode
      setSelectedAnswers(prev => 
        prev.includes(option) 
          ? prev.filter(item => item !== option)
          : [...prev, option]
      );
      return;
    }

    // Enhanced multi-exercise mode
    const newSelection = selectedAnswers.includes(option) 
      ? selectedAnswers.filter(item => item !== option)
      : [...selectedAnswers, option];
    
    setSelectedAnswers(newSelection);

    // Track selection for backend integration
    if (enableBackendIntegration) {
      const selectionEvent = {
        option,
        action: selectedAnswers.includes(option) ? 'deselect' : 'select',
        timestamp: Date.now(),
        responseTime: Date.now() - questionStartTime,
        isCorrect: currentExercise.correctAnswers.includes(option)
      };
      
      setSelectionHistory(prev => [...prev, selectionEvent]);

      // Analyze rhyme patterns
      const patterns = {};
      newSelection.forEach(selected => {
        const rhymeGroup = findRhymeGroup(selected, currentExercise.options);
        if (rhymeGroup) {
          patterns[rhymeGroup] = (patterns[rhymeGroup] || 0) + 1;
        }
      });
      setRhymePatternAnalysis(patterns);

      // Track rhyme selection interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'rhyme_selection',
          selectedWord: option,
          action: selectionEvent.action,
          isCorrect: selectionEvent.isCorrect,
          totalSelected: newSelection.length,
          rhymePatterns: patterns,
          responseTime: selectionEvent.responseTime,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const findRhymeGroup = (word, options) => {
    // Simple rhyme detection based on ending sounds
    const endings = {
      'at': ['cat', 'hat', 'bat', 'rat', 'mat', 'fat'],
      'og': ['dog', 'log', 'frog', 'hog'],
      'un': ['sun', 'run', 'fun', 'gun'],
      'ake': ['cake', 'lake', 'make', 'take', 'wake'],
      'all': ['ball', 'wall', 'call', 'fall', 'tall']
    };
    
    for (const [ending, words] of Object.entries(endings)) {
      if (words.includes(word.toLowerCase())) {
        return ending;
      }
    }
    return word.slice(-2); // fallback to last 2 letters
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        options: currentExercise.options,
        correctAnswers: currentExercise.correctAnswers,
        userSelections: selectedAnswers,
        rhymePatterns: rhymePatternAnalysis,
        context: {
          exerciseType: 'rhymeExercises',
          difficulty: currentExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentSelections: selectedAnswers.length,
        rhymePatterns: rhymePatternAnalysis
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const handleSubmit = async () => {
    const isAnswerCorrect = selectedAnswers.length === currentExercise.correctAnswers.length &&
                           selectedAnswers.every(answer => currentExercise.correctAnswers.includes(answer));
    
    setIsCorrect(isAnswerCorrect);

    if (!enableBackendIntegration && onAnswerSubmit) {
      // Original single exercise mode
      onAnswerSubmit({
        answers: selectedAnswers,
        isCorrect: isAnswerCorrect,
        score: isAnswerCorrect ? 10 : 0
      });
      return;
    }

    // Enhanced multi-exercise mode
    const questionResult = {
      question: currentExercise.question,
      isCorrect: isAnswerCorrect,
      userAnswer: selectedAnswers,
      correctAnswer: currentExercise.correctAnswers,
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      selectionHistory: selectionHistory,
      rhymePatternAnalysis: rhymePatternAnalysis,
      totalSelections: selectionHistory.length
    };

    const newResults = {
      ...results,
      questions: [...results.questions, questionResult],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAnswerCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAnswerCorrect ? 0 : 1),
      finalScore: isAnswerCorrect ? score + pointsPerQuestion : score,
    };

    setResults(newResults);

    // Backend integration for answer submission
    if (enableBackendIntegration) {
      try {
        // Submit answer to QuizEngine
        if (quizEngine.isReady) {
          await quizEngine.submitAnswer({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            userAnswer: selectedAnswers,
            correctAnswer: currentExercise.correctAnswers,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            selectionHistory: selectionHistory,
            rhymePatternAnalysis: rhymePatternAnalysis
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'rhymeExercises',
            userAnswer: JSON.stringify(selectedAnswers),
            correctAnswer: JSON.stringify(currentExercise.correctAnswers),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            totalSelections: selectionHistory.length,
            rhymePatterns: Object.keys(rhymePatternAnalysis).length,
            accuracy: selectedAnswers.filter(ans => currentExercise.correctAnswers.includes(ans)).length / Math.max(selectedAnswers.length, 1)
          });
        }
      } catch (error) {
        console.error('Error submitting answer to backend systems:', error);
      }
    }

    setShowFeedback(true);

    if (isAnswerCorrect) {
      setScore(prev => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowFeedback(false);
        moveToNextQuestion();
      }, 2000);
    } else {
      setTimeout(() => {
        setShowFeedback(false);
        moveToNextQuestion();
      }, 3000);
    }
  };

  const moveToNextQuestion = async () => {
    setShowHint(false);
    setAiHint(null);

    if (enableBackendIntegration && currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswers([]);
    } else {
      await finalizeExercise();
    }
  };

  const finalizeExercise = async () => {
    if (enableBackendIntegration) {
      setResults(prev => ({
        ...prev,
        finalScore: score + (isCorrect ? pointsPerQuestion : 0),
      }));
      setShowFinalResults(true);

      try {
        // Finalize QuizEngine
        if (quizEngine.isReady) {
          const quizResults = await quizEngine.completeExercise();
          console.log('Quiz Engine Results:', quizResults);
        }

        // Process Gamification rewards
        if (gamification.isReady) {
          const totalPatterns = Object.keys(rhymePatternAnalysis).length;
          const avgAccuracy = results.questions.reduce((sum, q) => 
            sum + (q.userAnswer.filter(ans => q.correctAnswer.includes(ans)).length / Math.max(q.userAnswer.length, 1)), 0
          ) / Math.max(results.questions.length, 1);
          
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 35,
            speedBonus: timeElapsed < 250 ? 140 : 0,
            patternBonus: totalPatterns > 3 ? 120 : 0,
            exerciseType: 'rhymeExercises'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'rhymeExercises',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            rhymePatterns: totalPatterns,
            accuracy: avgAccuracy
          });

          if (achievements.length > 0) {
            gamification.showCelebration({
              achievements,
              xpGained: xpResult.xpGained
            });
          }
        }

        // Call completion callback with enhanced data
        if (onExerciseComplete) {
          onExerciseComplete({
            ...newResults,
            backendData: {
              quizEngine: quizEngine.getState ? quizEngine.getState() : null,
              analytics: analytics.getSessionData ? analytics.getSessionData() : null,
              gamification: gamification.getUserStats ? gamification.getUserStats() : null
            }
          });
        }
      } catch (error) {
        console.error('Error finalizing exercise with backend systems:', error);
      }
    } else if (onComplete) {
      onComplete();
    }
  };

  const handleReset = () => {
    if (enableBackendIntegration) {
      setCurrentExerciseIndex(0);
      setTimeElapsed(0);
      setScore(0);
      setShowFinalResults(false);
      setResults({
        questions: [],
        times: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        finalScore: 0,
      });
    }
    
    setSelectedAnswers([]);
    setShowFeedback(false);
    setShowHint(false);
    setAiHint(null);
    setSelectionHistory([]);
    setRhymePatternAnalysis({});
    setQuestionStartTime(Date.now());

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  if (enableBackendIntegration && showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="rhymeExercises"
        enableBackendIntegration={enableBackendIntegration}
        onRestart={handleReset}
      />
    );
  }

  return (
    <ExerciseContainer layout="standard" withExample={enableBackendIntegration}>
      <div className="max-w-[1000px] mx-auto">
        {/* Backend Integration Status Indicator */}
        {enableBackendIntegration && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <span className="text-green-800 font-medium">🚀 Enhanced Mode Active</span>
              <div className="flex gap-2">
                {quizEngine.isReady && <span className="text-green-600">⚙️ QuizEngine</span>}
                {aiEngine.isReady && <span className="text-blue-600">🤖 AI</span>}
                {analytics.isReady && <span className="text-purple-600">📊 Analytics</span>}
                {gamification.isReady && <span className="text-yellow-600">🎮 Gamification</span>}
              </div>
            </div>
          </div>
        )}

        <div className="min-h-[60vh] sm:min-h-[75vh] relative overflow-hidden">
          {enableBackendIntegration && (
            <div className="block sm:hidden mb-4">
              <Stats
                questionNumber={currentExerciseIndex + 1}
                totalQuestions={totalExercises}
                timeElapsed={timeElapsed}
                score={score}
              />
            </div>
          )}

          <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:mx-5 sm:mt-10">
            <div className="flex flex-col flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <ExerciseQuestion variant="primary" level={2}>
                  🎵 {currentExercise.question}
                </ExerciseQuestion>
                
                {/* AI Hint Button */}
                {enableBackendIntegration && aiEngine.isReady && !showHint && (
                  <ExerciseButton
                    variant="secondary"
                    size="small"
                    onClick={requestAIHint}
                  >
                    💡 Hint
                  </ExerciseButton>
                )}
              </div>

              {/* AI Hint Display */}
              {showHint && aiHint && enableBackendIntegration && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start">
                    <span className="text-blue-600 mr-2">💡</span>
                    <div className="text-blue-800">
                      <div className="font-medium">AI Hint:</div>
                      <div className="text-sm">{aiHint.hint}</div>
                      {aiHint.explanation && (
                        <div className="text-xs mt-1 opacity-75">{aiHint.explanation}</div>
                      )}
                    </div>
                    <button
                      onClick={() => setShowHint(false)}
                      className="ml-auto text-blue-400 hover:text-blue-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <ExerciseGrid exerciseType="rhyme">
                    {currentExercise.options.map((option, index) => (
                      <ExerciseOption
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        selected={selectedAnswers.includes(option)}
                      >
                        {option}
                      </ExerciseOption>
                    ))}
                  </ExerciseGrid>
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={handleSubmit}
                    disabled={selectedAnswers.length === 0 || showFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answer
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({selectedAnswers.length} selected, {Object.keys(rhymePatternAnalysis).length} patterns)
                      </span>
                    )}
                  </ExerciseButton>
                </div>
              </div>
            </div>

            {enableBackendIntegration && (
              <div className="hidden sm:block ml-8">
                <Stats
                  questionNumber={currentExerciseIndex + 1}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>
            )}
          </div>

          {enableBackendIntegration && (
            <Feedback
              isVisible={showFeedback}
              isCorrect={isCorrect}
              questionNumber={currentExerciseIndex + 1}
            />
          )}

          {!enableBackendIntegration && selectedAnswers.length > 0 && (
            <ExerciseFeedback 
              isCorrect={selectedAnswers.length === currentExercise.correctAnswers.length &&
                         selectedAnswers.every(answer => currentExercise.correctAnswers.includes(answer))}
              message={selectedAnswers.length === currentExercise.correctAnswers.length &&
                      selectedAnswers.every(answer => currentExercise.correctAnswers.includes(answer))
                        ? 'Correct! Well done!' 
                        : 'Try again! Listen for words that sound similar.'}
            />
          )}
        </div>
      </div>
    </ExerciseContainer>
  );
};

export default RhymeExercises;
