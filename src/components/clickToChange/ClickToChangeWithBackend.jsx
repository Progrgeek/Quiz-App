import { useState, useEffect } from "react";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import exercisesData from "./ClickToChangeExercises.json";
import IncorrectClickToChange from "./IncorrectClickToCHangeFeedback";
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseButton 
} from '../../design-system/ExerciseComponents';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

export default function ClickChange({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [clickedWords, setClickedWords] = useState(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
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
    exerciseType: 'clickToChange',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'clickToChange',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'clickToChange',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'clickToChange'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [clickSequence, setClickSequence] = useState([]);
  const [wordHoverCounts, setWordHoverCounts] = useState({});
  const [clickPrecision, setClickPrecision] = useState([]);

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
          exerciseType: 'clickToChange',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'clickToChange',
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
    setClickedWords(new Set());
    setClickSequence([]);
    setWordHoverCounts({});
    setClickPrecision([]);
  }, [currentExerciseIndex]);

  const handleWordClick = async (index) => {
    const word = currentExercise.words[index];
    if (currentExercise.type === "pronoun" && !word.isPronoun) {
      return;
    }

    const newClickedWords = new Set(clickedWords);
    const wasSelected = clickedWords.has(index);
    
    if (wasSelected) {
      newClickedWords.delete(index);
    } else {
      newClickedWords.add(index);
    }
    setClickedWords(newClickedWords);

    // Track click sequence for backend integration
    if (enableBackendIntegration) {
      const clickEvent = {
        wordIndex: index,
        word: word.text,
        action: wasSelected ? 'deselect' : 'select',
        timestamp: Date.now(),
        isCorrect: (currentExercise.type === "capitalize" && word.shouldCapitalize) || 
                   (currentExercise.type === "pronoun" && word.isPronoun)
      };
      
      setClickSequence(prev => [...prev, clickEvent]);
      setClickPrecision(prev => [...prev, clickEvent.isCorrect]);

      // Track click interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'word_click',
          wordIndex: index,
          word: word.text,
          action: wasSelected ? 'deselect' : 'select',
          exerciseType: currentExercise.type,
          isCorrectWord: clickEvent.isCorrect,
          totalSelected: newClickedWords.size,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const handleWordHover = async (index) => {
    if (!enableBackendIntegration) return;

    const word = currentExercise.words[index];
    setWordHoverCounts(prev => ({
      ...prev,
      [index]: (prev[index] || 0) + 1
    }));

    // Track hover patterns
    if (analytics.isReady) {
      await analytics.trackUserInteraction({
        type: 'word_hover',
        wordIndex: index,
        word: word.text,
        hoverCount: (wordHoverCounts[index] || 0) + 1,
        questionIndex: currentExerciseIndex
      });
    }
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        exerciseType: currentExercise.type,
        words: currentExercise.words,
        userSelections: Array.from(clickedWords),
        context: {
          exerciseType: 'clickToChange',
          changeType: currentExercise.type,
          difficulty: currentExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentSelections: clickedWords.size,
        clickPrecision: clickPrecision.filter(Boolean).length / clickPrecision.length || 0
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAnswer = async () => {
    const correctWords = currentExercise.words.reduce((acc, word, index) => {
      if (
        (currentExercise.type === "capitalize" && word.shouldCapitalize) ||
        (currentExercise.type === "pronoun" && word.isPronoun)
      ) {
        acc.add(index);
      }
      return acc;
    }, new Set());

    const isAnswerCorrect =
      clickedWords.size === correctWords.size &&
      [...clickedWords].every((index) => correctWords.has(index));

    setIsCurrentAnswerCorrect(isAnswerCorrect);

    const userAnswer = [...clickedWords]
      .map((index) => currentExercise.words[index].text)
      .join(", ");

    const questionResult = {
      question: currentExercise.question,
      exerciseType: currentExercise.type,
      isCorrect: isAnswerCorrect,
      userAnswer: userAnswer,
      correctAnswer: [...correctWords].map(index => currentExercise.words[index].text).join(", "),
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      clickSequence: clickSequence,
      totalClicks: clickSequence.length,
      hoverPatterns: wordHoverCounts,
      clickPrecision: clickPrecision.filter(Boolean).length / clickPrecision.length || 0
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
            userAnswer: [...clickedWords],
            correctAnswer: [...correctWords],
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            clickSequence: clickSequence,
            clickPrecision: questionResult.clickPrecision,
            hoverPatterns: wordHoverCounts
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'clickToChange',
            subType: currentExercise.type,
            userAnswer: JSON.stringify([...clickedWords]),
            correctAnswer: JSON.stringify([...correctWords]),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            totalClicks: clickSequence.length,
            clickPrecision: questionResult.clickPrecision,
            hoverActions: Object.values(wordHoverCounts).reduce((a, b) => a + b, 0)
          });
        }
      } catch (error) {
        console.error('Error submitting answer to backend systems:', error);
      }
    }

    setShowFeedback(true);

    if (isAnswerCorrect) {
      setScore((prev) => prev + pointsPerQuestion);
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
      setCurrentExerciseIndex((prev) => prev + 1);
      setClickedWords(new Set());
    } else {
      await finalizeExercise();
    }
  };

  const finalizeExercise = async () => {
    setResults((prev) => ({
      ...prev,
      finalScore: score + (isCurrentAnswerCorrect ? pointsPerQuestion : 0),
    }));
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
          const totalInteractions = clickSequence.length + Object.values(wordHoverCounts).reduce((a, b) => a + b, 0);
          const avgPrecision = clickPrecision.filter(Boolean).length / clickPrecision.length || 0;
          
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 18,
            speedBonus: timeElapsed < 180 ? 75 : 0,
            precisionBonus: avgPrecision > 0.8 ? 50 : 0,
            exerciseType: 'clickToChange'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'clickToChange',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            clickPrecision: avgPrecision,
            totalClicks: totalInteractions
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
    }
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    setShowFeedback(false);
    moveToNextQuestion();
  };

  const resetExercise = () => {
    setCurrentExerciseIndex(0);
    setClickedWords(new Set());
    setTimeElapsed(0);
    setScore(0);
    setShowFeedback(false);
    setIsCurrentAnswerCorrect(false);
    setShowIncorrectFeedback(false);
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
    setClickSequence([]);
    setWordHoverCounts({});
    setClickPrecision([]);

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="clickToChange"
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
                <div className="text-lg leading-relaxed">
                  {currentExercise?.words.map((word, index) => (
                    <span
                      key={index}
                      className={`
                        inline-block px-2 py-1 mx-1 my-1 rounded-md transition-all duration-200 
                        ${
                          currentExercise.type === "pronoun" && !word.isPronoun
                            ? "cursor-default text-gray-600"
                            : "cursor-pointer hover:bg-gray-100"
                        }
                        ${
                          clickedWords.has(index)
                            ? "bg-blue-200 text-blue-800"
                            : "bg-gray-50"
                        }
                      `}
                      onClick={() => handleWordClick(index)}
                      onMouseEnter={() => handleWordHover(index)}
                    >
                      {word.text}
                    </span>
                  ))}
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswer}
                    disabled={clickedWords.size === 0 || showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answer
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({clickedWords.size} selected, {clickSequence.length} clicks)
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
            isCorrect={isCurrentAnswerCorrect}
            questionNumber={currentExerciseIndex + 1}
          />
          <IncorrectClickToChange
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            onGotIt={handleGotIt}
            clickedWords={clickedWords}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}
