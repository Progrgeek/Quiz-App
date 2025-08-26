import React, { useState, useEffect } from 'react';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseButton, 
  ExerciseFeedback 
} from '../../design-system/ExerciseComponents';
import syllableData from './syllableCountingData.json';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import FinalResults from '../FinalResults';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

const SyllableCounting = ({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null,
  exercise, 
  onComplete, 
  onAnswerSubmit 
}) => {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
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
    exerciseType: 'syllableCounting',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'syllableCounting',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'syllableCounting',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'syllableCounting'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [responseTime, setResponseTime] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Handle different data formats - use multiple exercises for full experience
  const exercises = Array.isArray(syllableData) ? syllableData : [syllableData];
  const currentExercise = exercise || exercises[currentExerciseIndex] || syllableData[0];
  const normalizedExercise = {
    ...currentExercise,
    correctAnswer: currentExercise.correctAnswer || currentExercise.correctCount,
    options: currentExercise.options || [1, 2, 3, 4, 5]
  };
  
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
          exerciseType: 'syllableCounting',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'syllableCounting',
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
    setQuestionStartTime(Date.now());
  }, [currentExerciseIndex]);

  const handleOptionClick = async (option) => {
    if (!enableBackendIntegration && onAnswerSubmit) {
      // Original single exercise mode
      if (selectedAnswer !== null) return;
      setSelectedAnswer(option);
      handleSubmit(option);
      return;
    }

    // Enhanced multi-exercise mode
    setSelectedAnswer(option);
    setResponseTime(Date.now() - questionStartTime);

    // Track selection for backend integration
    if (enableBackendIntegration) {
      const selectionEvent = {
        option,
        timestamp: Date.now(),
        responseTime: Date.now() - questionStartTime,
        isCorrect: option === normalizedExercise.correctAnswer
      };
      
      setSelectionHistory(prev => [...prev, selectionEvent]);

      // Track syllable counting interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'syllable_selection',
          selectedCount: option,
          correctCount: normalizedExercise.correctAnswer,
          word: normalizedExercise.word,
          isCorrect: selectionEvent.isCorrect,
          responseTime: selectionEvent.responseTime,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        word: normalizedExercise.word,
        correctSyllableCount: normalizedExercise.correctAnswer,
        userSelection: selectedAnswer,
        context: {
          exerciseType: 'syllableCounting',
          difficulty: normalizedExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentSelection: selectedAnswer,
        responseTime: responseTime
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const handleSubmit = async (answerOverride = null) => {
    const finalAnswer = answerOverride || selectedAnswer;
    if (finalAnswer === null) return;
    
    const isAnswerCorrect = finalAnswer === normalizedExercise.correctAnswer;
    setIsCorrect(isAnswerCorrect);

    if (!enableBackendIntegration && onAnswerSubmit) {
      // Original single exercise mode
      onAnswerSubmit({
        answer: finalAnswer,
        isCorrect: isAnswerCorrect,
        score: isAnswerCorrect ? 10 : 0
      });
      return;
    }

    // Enhanced multi-exercise mode
    const questionResult = {
      question: normalizedExercise.question,
      word: normalizedExercise.word,
      isCorrect: isAnswerCorrect,
      userAnswer: finalAnswer,
      correctAnswer: normalizedExercise.correctAnswer,
      timeSpent: responseTime || (timeElapsed - (results.times.reduce((a, b) => a + b, 0))),
      hintsUsed: showHint ? 1 : 0,
      responseTime: responseTime,
      selectionHistory: selectionHistory
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
            questionId: normalizedExercise.id || `q_${currentExerciseIndex}`,
            userAnswer: finalAnswer,
            correctAnswer: normalizedExercise.correctAnswer,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            responseTime: responseTime,
            selectionHistory: selectionHistory
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: normalizedExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'syllableCounting',
            word: normalizedExercise.word,
            userAnswer: JSON.stringify(finalAnswer),
            correctAnswer: JSON.stringify(normalizedExercise.correctAnswer),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: normalizedExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            responseTime: responseTime,
            selectionAttempts: selectionHistory.length
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
      setSelectedAnswer(null);
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
          const avgResponseTime = selectionHistory.reduce((sum, sel) => sum + sel.responseTime, 0) / Math.max(selectionHistory.length, 1);
          
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 30,
            speedBonus: avgResponseTime < 5000 ? 120 : 0,
            precisionBonus: selectionHistory.length === totalExercises ? 100 : 0,
            exerciseType: 'syllableCounting'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'syllableCounting',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            avgResponseTime: avgResponseTime,
            precision: selectionHistory.length === totalExercises ? 1 : 0
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
    
    setSelectedAnswer(null);
    setShowFeedback(false);
    setShowHint(false);
    setAiHint(null);
    setSelectionHistory([]);
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
        exerciseType="syllableCounting"
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
                <ExerciseQuestion variant="primary" level={1}>
                  {normalizedExercise.question}
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
                <div className="text-center mb-6 bg-white rounded-lg shadow-sm border p-8">
                  <span className="text-4xl font-bold text-primary-600 bg-primary-50 px-6 py-3 rounded-lg">
                    {normalizedExercise.word}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {normalizedExercise.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleOptionClick(option)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-xl font-semibold ${
                        selectedAnswer === option
                          ? 'bg-primary-100 border-primary-500 text-primary-700'
                          : 'bg-neutral-50 border-neutral-300 hover:bg-neutral-100'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {enableBackendIntegration && (
                  <div className="flex justify-center">
                    <ExerciseButton
                      variant="primary"
                      size="large"
                      onClick={() => handleSubmit()}
                      disabled={selectedAnswer === null || showFeedback}
                      className="w-full sm:w-auto mx-2 sm:mx-0"
                    >
                      Check Answer
                      {responseTime > 0 && (
                        <span className="ml-2 text-xs opacity-75">({(responseTime/1000).toFixed(1)}s)</span>
                      )}
                    </ExerciseButton>
                  </div>
                )}
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

          {!enableBackendIntegration && (
            <ExerciseFeedback
              feedback={selectedAnswer !== null ? (selectedAnswer === normalizedExercise.correctAnswer ? 'Correct! Great job counting syllables!' : `The word "${normalizedExercise.word}" has ${normalizedExercise.correctAnswer} syllables.`) : ''}
              isCorrect={selectedAnswer === normalizedExercise.correctAnswer}
            />
          )}
        </div>
      </div>
    </ExerciseContainer>
  );
};

export default SyllableCounting;
