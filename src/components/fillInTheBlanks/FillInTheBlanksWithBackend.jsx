import { useState, useEffect, useRef } from "react";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectFeedback from "./IncorrectFillFeedback";
import exercisesData from "./fillnTheBlanksExercises.json";
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

export default function FillInTheBlanks({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
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
    exerciseType: 'fill-in-blanks',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'fill-in-blanks',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'fill-in-blanks',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'fill-in-blanks'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [typingPattern, setTypingPattern] = useState([]);

  // Add ref for input focus management
  const inputRef = useRef(null);

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
          exerciseType: 'fill-in-blanks',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'fill-in-blanks',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  // Auto-focus input when component mounts and when exercise changes
  useEffect(() => {
    if (inputRef.current && !showFinalResults && !showFeedback && !showIncorrectFeedback) {
      inputRef.current.focus();
    }
  }, [currentExerciseIndex, showFeedback, showIncorrectFeedback, showFinalResults]);

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

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setUserAnswer(value);

    // Track typing pattern for analytics
    if (enableBackendIntegration) {
      const keystroke = {
        timestamp: Date.now(),
        value: value,
        length: value.length
      };
      setTypingPattern(prev => [...prev, keystroke]);

      // Track typing interaction
      if (analytics.isReady && value.length % 3 === 0) { // Sample every 3 characters
        await analytics.trackUserInteraction({
          type: 'typing',
          currentLength: value.length,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        question: currentExercise.question,
        sentence: currentExercise.sentence,
        correctAnswer: currentExercise.answer,
        userInput: userAnswer,
        context: {
          exerciseType: 'fill-in-blanks',
          difficulty: currentExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentInput: userAnswer
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() ===
      currentExercise.answer.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);

    const questionResult = {
      question: currentExercise.question,
      sentence: currentExercise.sentence,
      isCorrect: isAnswerCorrect,
      userAnswer: userAnswer,
      correctAnswer: currentExercise.answer,
      exerciseType: 'fill-in-blanks',
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      typingPattern: typingPattern.length
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
            userAnswer: userAnswer,
            correctAnswer: currentExercise.answer,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            typingPattern: typingPattern
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'fill-in-blanks',
            userAnswer: userAnswer,
            correctAnswer: currentExercise.answer,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            typingKeystrokes: typingPattern.length
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
    setUserAnswer("");
    setShowHint(false);
    setAiHint(null);
    setTypingPattern([]);

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      await finalizeExercise();
    }
  };

  const finalizeExercise = async () => {
    setResults((prev) => ({
      ...prev,
      finalScore: score + (isCorrect ? pointsPerQuestion : 0),
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
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 15,
            speedBonus: timeElapsed < 240 ? 60 : 0,
            exerciseType: 'fill-in-blanks'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'fill-in-blanks',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises
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
    setUserAnswer("");
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
    setTypingPattern([]);

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  const renderSentenceWithBlank = () => {
    const sentence = currentExercise.sentence;
    const blankPlaceholder = "____";
    const parts = sentence.split(blankPlaceholder);

    if (parts.length === 2) {
      return (
        <>
          {parts[0]}
          <input
            ref={inputRef}
            type="text"
            value={userAnswer}
            onChange={handleInputChange}
            className="mx-2 px-3 py-2 border border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-w-[120px] text-center font-semibold"
            placeholder="Type here..."
            disabled={showFeedback || showIncorrectFeedback}
          />
          {parts[1]}
        </>
      );
    }

    return sentence;
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="fill-in-blanks"
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
                  {currentExercise.question}
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

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center p-8 bg-white rounded-lg shadow-sm border">
                  <p className="text-xl sm:text-2xl font-medium text-neutral-700 leading-relaxed">
                    {renderSentenceWithBlank()}
                  </p>
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={!userAnswer.trim() || showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answer
                    {enableBackendIntegration && typingPattern.length > 0 && (
                      <span className="ml-2 text-xs opacity-75">
                        ({typingPattern.length} keystrokes)
                      </span>
                    )}
                  </ExerciseButton>
                </div>
              </form>
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
          <IncorrectFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            userAnswer={userAnswer}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}
