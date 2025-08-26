import { useState, useEffect, useRef, createRef } from "react";
import { Volume2 } from "lucide-react";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectGapFill from "./IncorrectGapFillFeedback";
import exercisesData from "./gapFillExercises.json";
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseButton,
  ExerciseAudioButton 
} from '../../design-system/ExerciseComponents';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

export default function GapFill({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
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
    exerciseType: 'gap-fill',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'gap-fill',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'gap-fill',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'gap-fill'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [inputFocusPattern, setInputFocusPattern] = useState([]);
  const [audioPlayCount, setAudioPlayCount] = useState(0);

  const inputRefs = useRef([]);
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
          exerciseType: 'gap-fill',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'gap-fill',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  useEffect(() => {
    const focusTimeout = setTimeout(() => {
      if (currentExercise && inputRefs.current[0]?.current && isInitialized) {
        inputRefs.current[0].current.focus();
      }
    }, 100);
  
    return () => clearTimeout(focusTimeout);
  }, [currentExerciseIndex, isInitialized]);

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
    if (currentExercise) {
      setUserAnswers(new Array(currentExercise.word.length).fill(""));
      inputRefs.current = currentExercise.blanks.map(() => createRef());
      setIsInitialized(true);
      setInputFocusPattern([]);
      setAudioPlayCount(0);
    }
  }, [currentExerciseIndex]);

  const handleInputChange = async (index, value) => {
    const newValue = value.toLowerCase().trim();
    const newAnswers = [...userAnswers];
    newAnswers[index] = newValue;
    setUserAnswers(newAnswers);

    // Track input focus pattern
    if (enableBackendIntegration) {
      const focusEvent = {
        inputIndex: index,
        value: newValue,
        timestamp: Date.now()
      };
      setInputFocusPattern(prev => [...prev, focusEvent]);

      // Track input interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'gap_fill_input',
          inputIndex: index,
          inputValue: newValue,
          wordLength: currentExercise.word.length,
          questionIndex: currentExerciseIndex
        });
      }
    }

    // Auto-advance to next input if available
    if (newValue && currentExercise) {
      const currentBlankIndex = currentExercise.blanks.indexOf(index);
      if (currentBlankIndex < currentExercise.blanks.length - 1) {
        const nextInputRef = inputRefs.current[currentBlankIndex + 1];
        nextInputRef?.current?.focus();
      }
    }
  };

  const playAudio = async () => {
    if (!currentExercise) return;
    
    setIsPlaying(true);
    setAudioPlayCount(prev => prev + 1);

    // Track audio play
    if (enableBackendIntegration && analytics.isReady) {
      await analytics.trackUserInteraction({
        type: 'audio_play',
        word: currentExercise.word,
        playCount: audioPlayCount + 1,
        questionIndex: currentExerciseIndex
      });
    }

    const utterance = new SpeechSynthesisUtterance(currentExercise.word);
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => {
      setIsPlaying(false);
      console.error("Error playing audio");
    };
    window.speechSynthesis.speak(utterance);
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        word: currentExercise.word,
        blanks: currentExercise.blanks,
        userInputs: userAnswers,
        definition: currentExercise.definition,
        context: {
          exerciseType: 'gap-fill',
          difficulty: currentExercise.difficulty || 'medium',
          audioPlays: audioPlayCount
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentInputs: userAnswers,
        audioPlays: audioPlayCount
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAnswer = async () => {
    if (!currentExercise) return;

    const word = currentExercise.word.toLowerCase();
    const isAnswerCorrect = currentExercise.blanks.every(
      (blankIndex) => userAnswers[blankIndex] === word[blankIndex]
    );

    setIsCorrect(isAnswerCorrect);

    const questionResult = {
      question: currentExercise.question,
      word: currentExercise.word,
      definition: currentExercise.definition,
      isCorrect: isAnswerCorrect,
      userAnswers: [...userAnswers],
      correctAnswers: word.split(''),
      exerciseType: 'gap-fill',
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      audioPlays: audioPlayCount,
      inputFocusPattern: inputFocusPattern.length
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
            userAnswer: userAnswers,
            correctAnswer: word.split(''),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            audioPlays: audioPlayCount,
            inputPattern: inputFocusPattern
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'gap-fill',
            userAnswer: userAnswers.join(''),
            correctAnswer: word,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            audioPlays: audioPlayCount,
            inputInteractions: inputFocusPattern.length
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
            performanceBonus: results.correctAnswers * 18,
            speedBonus: timeElapsed < 200 ? 70 : 0,
            audioEfficiencyBonus: audioPlayCount < totalExercises * 2 ? 30 : 0,
            exerciseType: 'gap-fill'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'gap-fill',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            audioPlays: audioPlayCount
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
    setUserAnswers([]);
    setTimeElapsed(0);
    setScore(0);
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    setIsCorrect(false);
    setShowFinalResults(false);
    setIsInitialized(false);
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
    setShowHint(false);
    setAiHint(null);
    setInputFocusPattern([]);
    setAudioPlayCount(0);

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  const renderWordWithInputs = () => {
    if (!currentExercise) return null;

    const word = currentExercise.word;
    const blanks = currentExercise.blanks;

    return word.split("").map((letter, index) => {
      const isBlank = blanks.includes(index);
      const blankIndex = blanks.indexOf(index);

      if (isBlank) {
        return (
          <input
            key={index}
            ref={inputRefs.current[blankIndex]}
            type="text"
            maxLength="1"
            value={userAnswers[index] || ""}
            onChange={(e) => handleInputChange(index, e.target.value)}
            className="w-10 h-12 mx-1 text-center border-2 border-primary-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-xl font-bold"
            disabled={showFeedback || showIncorrectFeedback}
          />
        );
      } else {
        return (
          <span
            key={index}
            className="inline-block w-10 h-12 mx-1 text-center leading-12 text-xl font-bold text-neutral-700"
          >
            {letter}
          </span>
        );
      }
    });
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="gap-fill"
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
                
                <div className="flex gap-2">
                  <ExerciseAudioButton 
                    onPlay={playAudio}
                    isPlaying={isPlaying}
                    label="Listen to word"
                  />
                  
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
                {/* Definition */}
                {currentExercise?.definition && (
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-lg font-medium text-blue-900">
                      Definition: {currentExercise.definition}
                    </p>
                  </div>
                )}

                {/* Word with inputs */}
                <div className="flex justify-center items-center flex-wrap p-8 bg-white rounded-lg shadow-sm border">
                  {renderWordWithInputs()}
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswer}
                    disabled={currentExercise?.blanks.some(blankIndex => !userAnswers[blankIndex]) || showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answer
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({audioPlayCount} audio plays, {inputFocusPattern.length} inputs)
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
          <IncorrectGapFill
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
