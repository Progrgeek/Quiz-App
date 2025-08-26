import { useState, useEffect } from 'react';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseButton 
} from '../../design-system/ExerciseComponents';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import FinalResults from '../FinalResults';
import IncorrectTableFeedback from './IncorrectTableFeedback';
import exercisesData from './tableExercises.json';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

export default function TableExercise({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
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
    exerciseType: 'tableExercise',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'tableExercise',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'tableExercise',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'tableExercise'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [columnClickCounts, setColumnClickCounts] = useState({});
  const [rowCompletionTimes, setRowCompletionTimes] = useState({});

  const exercises = exercisesData.exercises;
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
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
          exerciseType: 'tableExercise',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'tableExercise',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
        
        // Update QuizEngine timer if backend is enabled
        if (enableBackendIntegration && quizEngine.isReady) {
          quizEngine.updateTimer(timeElapsed + 1);
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults, enableBackendIntegration, quizEngine.isReady, timeElapsed]);

  useEffect(() => {
    // Reset enhanced state when exercise changes
    setSelectionHistory([]);
    setColumnClickCounts({});
    setRowCompletionTimes({});
  }, [currentExerciseIndex]);

  const handleAnswerSelect = async (rowIndex, columnId) => {
    const previousAnswer = userAnswers[rowIndex];
    
    setUserAnswers(prev => ({
      ...prev,
      [rowIndex]: columnId
    }));

    // Track table selection for backend integration
    if (enableBackendIntegration) {
      const selectionEvent = {
        rowIndex,
        columnId,
        previousAnswer,
        timestamp: Date.now(),
        isCorrect: currentExercise.rows[rowIndex].correctAnswer === columnId
      };
      
      setSelectionHistory(prev => [...prev, selectionEvent]);
      setColumnClickCounts(prev => ({
        ...prev,
        [columnId]: (prev[columnId] || 0) + 1
      }));

      // Track completion time for this row
      if (!rowCompletionTimes[rowIndex]) {
        setRowCompletionTimes(prev => ({
          ...prev,
          [rowIndex]: timeElapsed
        }));
      }

      // Track table interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'table_selection',
          rowIndex: rowIndex,
          columnId: columnId,
          previousAnswer: previousAnswer,
          isCorrect: selectionEvent.isCorrect,
          completedRows: Object.keys(userAnswers).length + 1,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        tableData: currentExercise.rows,
        columnHeaders: currentExercise.columns,
        userAnswers: userAnswers,
        selectionHistory: selectionHistory,
        context: {
          exerciseType: 'tableExercise',
          tableType: currentExercise.type || 'general',
          difficulty: currentExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        completedRows: Object.keys(userAnswers).length,
        totalSelections: selectionHistory.length
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAnswers = async () => {
    if (!currentExercise) return;

    const allCorrect = currentExercise.rows.every(
      (row, index) => userAnswers[index] === row.correctAnswer
    );

    setIsCorrect(allCorrect);

    const currentResults = {
      question: currentExercise.question,
      userAnswer: currentExercise.rows.map((_, index) => userAnswers[index] || ""),
      correctAnswer: currentExercise.rows.map(row => row.correctAnswer),
      isCorrect: allCorrect,
      explanation: currentExercise.explanation,
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      selectionHistory: selectionHistory,
      totalSelections: selectionHistory.length,
      columnClickDistribution: columnClickCounts,
      avgRowCompletionTime: Object.values(rowCompletionTimes).reduce((a, b) => a + b, 0) / Math.max(Object.keys(rowCompletionTimes).length, 1)
    };

    const newResults = {
      questions: [...results.questions, currentResults],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (allCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (allCorrect ? 0 : 1),
      finalScore: (results.correctAnswers + (allCorrect ? 1 : 0)) * pointsPerQuestion,
    };

    setResults(newResults);
    setScore(newResults.finalScore);

    // Backend integration for answer submission
    if (enableBackendIntegration) {
      try {
        // Submit answer to QuizEngine
        if (quizEngine.isReady) {
          await quizEngine.submitAnswer({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            userAnswer: userAnswers,
            correctAnswer: currentExercise.rows.map(row => row.correctAnswer),
            isCorrect: allCorrect,
            timeSpent: currentResults.timeSpent,
            hintsUsed: currentResults.hintsUsed,
            selectionHistory: selectionHistory,
            columnClickDistribution: columnClickCounts,
            rowCompletionTimes: rowCompletionTimes
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'tableExercise',
            subType: currentExercise.type || 'general',
            userAnswer: JSON.stringify(userAnswers),
            correctAnswer: JSON.stringify(currentExercise.rows.map(row => row.correctAnswer)),
            isCorrect: allCorrect,
            timeSpent: currentResults.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: currentResults.hintsUsed,
            totalSelections: selectionHistory.length,
            columnClicks: Object.values(columnClickCounts).reduce((a, b) => a + b, 0),
            avgRowTime: currentResults.avgRowCompletionTime
          });
        }
      } catch (error) {
        console.error('Error submitting answer to backend systems:', error);
      }
    }

    setShowFeedback(true);

    if (allCorrect) {
      setTimeout(() => {
        setShowFeedback(false);
        moveToNextQuestion();
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const moveToNextQuestion = async () => {
    setShowHint(false);
    setAiHint(null);

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
      setUserAnswers({});
      setTimeElapsed(0);
    } else {
      await finalizeExercise();
    }
  };

  const finalizeExercise = async () => {
    setShowFinalResults(true);

    if (enableBackendIntegration) {
      try {
        // Finalize QuizEngine
        if (quizEngine.isReady) {
          const quizResults = await quizEngine.completeExercise();
          console.log('Quiz Engine Results:', quizResults);
        }

        // Process Gamification rewards
        if (gamification.isReady) {
          const totalSelections = selectionHistory.length;
          const avgRowTime = Object.values(rowCompletionTimes).reduce((a, b) => a + b, 0) / Math.max(Object.keys(rowCompletionTimes).length, 1);
          
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 22,
            speedBonus: avgRowTime < 30 ? 90 : 0,
            efficiencyBonus: totalSelections === currentExercise.rows.length ? 70 : 0,
            exerciseType: 'tableExercise'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'tableExercise',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            selectionEfficiency: totalSelections / currentExercise.rows.length,
            avgRowTime: avgRowTime
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
            ...results,
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
    }
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    setShowFeedback(false);
    moveToNextQuestion();
  };

  const resetExercise = () => {
    setCurrentExerciseIndex(0);
    setUserAnswers({});
    setTimeElapsed(0);
    setScore(0);
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    setIsCorrect(false);
    setShowFinalResults(false);
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
    setShowHint(false);
    setAiHint(null);
    setSelectionHistory([]);
    setColumnClickCounts({});
    setRowCompletionTimes({});

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  const hasRequiredAnswers = () => {
    return currentExercise?.rows.every((_, index) => userAnswers[index]);
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="tableExercise"
        enableBackendIntegration={enableBackendIntegration}
        onRestart={resetExercise}
      />
    );
  }

  return (
    <ExerciseContainer layout="standard" withExample={true}>
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
          <div className="block sm:hidden mb-4">
            <Stats
              questionNumber={currentExerciseIndex + 1}
              totalQuestions={totalExercises}
              timeElapsed={timeElapsed}
              score={score}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:mx-5 sm:mt-10">
            <div className="flex flex-col flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <ExerciseQuestion variant="primary" level={1}>
                  {currentExercise?.question}
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
                {/* Table Exercise */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr>
                          <th className="text-left py-3 px-4 font-medium text-gray-700 border-b">
                            {currentExercise?.rowHeader || 'Item'}
                          </th>
                          {currentExercise?.columns.map((column) => (
                            <th key={column.id} className="text-center py-3 px-4 font-medium text-gray-700 border-b">
                              {column.title}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentExercise?.rows.map((row, rowIndex) => (
                          <tr key={rowIndex} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4 font-medium text-gray-800">
                              {row.label}
                            </td>
                            {currentExercise.columns.map((column) => (
                              <td key={column.id} className="py-4 px-4 text-center">
                                <button
                                  onClick={() => handleAnswerSelect(rowIndex, column.id)}
                                  className={`
                                    w-6 h-6 rounded-full border-2 transition-all duration-200
                                    ${userAnswers[rowIndex] === column.id
                                      ? 'bg-blue-500 border-blue-500 shadow-md'
                                      : 'border-gray-300 hover:border-blue-400'
                                    }
                                  `}
                                >
                                  {userAnswers[rowIndex] === column.id && (
                                    <div className="w-2 h-2 bg-white rounded-full mx-auto" />
                                  )}
                                </button>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswers}
                    disabled={!hasRequiredAnswers() || showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answers
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({Object.keys(userAnswers).length}/{currentExercise?.rows.length || 0} rows, {selectionHistory.length} selections)
                      </span>
                    )}
                  </ExerciseButton>
                </div>
              </div>
            </div>

            <div className="hidden sm:block ml-8">
              <Stats
                questionNumber={currentExerciseIndex + 1}
                totalQuestions={totalExercises}
                timeElapsed={timeElapsed}
                score={score}
              />
            </div>
          </div>

          <Feedback
            isVisible={showFeedback}
            isCorrect={isCorrect}
            questionNumber={currentExerciseIndex + 1}
          />
          <IncorrectTableFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            userAnswers={userAnswers}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}
