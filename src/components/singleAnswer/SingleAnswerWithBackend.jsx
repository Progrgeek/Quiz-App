import { useState, useEffect } from 'react';
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseButton, 
  ExerciseAudioButton 
} from '../../design-system/ExerciseComponents';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import IncorrectSingleAnswerFeedback from './IncorrectSingleAnswerFeedback';
import FinalResults from '../FinalResults';
import exercisesData from './singleAnswerExercises.json';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

export default function SingleAnswer({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCurrentAnswerCorrect, setIsCurrentAnswerCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [highlightedWord, setHighlightedWord] = useState(null);
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
    exerciseType: 'singleAnswer',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'singleAnswer',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'singleAnswer',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'singleAnswer'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [audioPlayCount, setAudioPlayCount] = useState(0);
  const [answerChangeCount, setAnswerChangeCount] = useState(0);

  const allExercises = [
    ...exercisesData.syllableExercises.map(ex => ({ ...ex, exerciseType: 'syllable' })),
    ...exercisesData.rhymingExercises.map(ex => ({ ...ex, exerciseType: 'rhyme' }))
  ];
  
  const currentExercise = allExercises[currentExerciseIndex];
  const totalExercises = allExercises.length;
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
          exerciseType: 'singleAnswer',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'singleAnswer',
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
        setTimeElapsed(prev => prev + 1);
        
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
    setAudioPlayCount(0);
    setAnswerChangeCount(0);
  }, [currentExerciseIndex]);

  const speak = async (text, options = {}) => {
    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(
        voice => voice.lang.startsWith('en-') && voice.localService === true
      ) || voices.find(voice => voice.lang.startsWith('en-'));
      
      if (englishVoice) {
        utterance.voice = englishVoice;
      }

      utterance.onend = () => resolve();
      window.speechSynthesis.speak(utterance);
    });
  };

  const playWordAudio = async (word) => {
    if (isPlaying) return;
    setIsPlaying(true);
    setHighlightedWord(word);
    
    // Track audio plays for backend integration
    if (enableBackendIntegration && analytics.isReady) {
      await analytics.trackUserInteraction({
        type: 'word_audio_play',
        word: word,
        questionIndex: currentExerciseIndex,
        totalAudioPlays: audioPlayCount + 1
      });
    }
    
    try {
      await speak(word, { rate: 0.8, pitch: 1 });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
      setHighlightedWord(null);
    }
  };

  const playAudio = async () => {
    if (isPlaying) return;
    setIsPlaying(true);
    setAudioPlayCount(prev => prev + 1);

    // Track main audio play for backend integration
    if (enableBackendIntegration && analytics.isReady) {
      await analytics.trackUserInteraction({
        type: 'main_audio_play',
        exerciseType: currentExercise.exerciseType,
        questionIndex: currentExerciseIndex,
        playCount: audioPlayCount + 1
      });
    }
  
    try {
      if (currentExercise.exerciseType === "syllable") {
        setHighlightedWord(currentExercise.word);
        await speak(currentExercise.word, { rate: 0.8, pitch: 1 });
        await new Promise(resolve => setTimeout(resolve, 300));
  
        for (const syllable of currentExercise.syllables) {
          await speak(syllable, { rate: 0.7, pitch: 1.05, volume: 1.2 });
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        setHighlightedWord(null);
      } else if (currentExercise.exerciseType === "rhyme") {
        for (const word of currentExercise.words) {
          setHighlightedWord(word);
          await speak(word, { rate: 0.8, pitch: 1 });
          await new Promise(resolve => setTimeout(resolve, 200));
        }
        setHighlightedWord(null);
      }
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleAnswerSelect = async (answerIndex) => {
    const previousAnswer = selectedAnswer;
    setSelectedAnswer(answerIndex);

    // Track answer changes for backend integration
    if (enableBackendIntegration) {
      if (previousAnswer !== null && previousAnswer !== answerIndex) {
        setAnswerChangeCount(prev => prev + 1);
      }

      const selectionEvent = {
        answerIndex,
        previousAnswer,
        timestamp: Date.now(),
        isCorrect: answerIndex === currentExercise.correctAnswer
      };
      
      setSelectionHistory(prev => [...prev, selectionEvent]);

      // Track answer selection
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'answer_selection',
          answerIndex: answerIndex,
          previousAnswer: previousAnswer,
          isCorrect: selectionEvent.isCorrect,
          exerciseType: currentExercise.exerciseType,
          changeCount: answerChangeCount + (previousAnswer !== null && previousAnswer !== answerIndex ? 1 : 0),
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        exerciseType: currentExercise.exerciseType,
        word: currentExercise.word,
        words: currentExercise.words,
        syllables: currentExercise.syllables,
        options: currentExercise.options,
        userSelection: selectedAnswer,
        context: {
          exerciseType: 'singleAnswer',
          subType: currentExercise.exerciseType,
          difficulty: currentExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentSelection: selectedAnswer,
        audioPlays: audioPlayCount,
        answerChanges: answerChangeCount
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAnswer = async () => {
    const isAnswerCorrect = selectedAnswer === currentExercise.correctAnswer;
    setIsCurrentAnswerCorrect(isAnswerCorrect);

    const questionResult = {
      question: currentExercise.question,
      exerciseType: currentExercise.exerciseType,
      isCorrect: isAnswerCorrect,
      userAnswer: selectedAnswer,
      correctAnswer: currentExercise.correctAnswer,
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      audioPlays: audioPlayCount,
      answerChanges: answerChangeCount,
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
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            userAnswer: selectedAnswer,
            correctAnswer: currentExercise.correctAnswer,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            audioPlays: audioPlayCount,
            answerChanges: answerChangeCount,
            selectionHistory: selectionHistory
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'singleAnswer',
            subType: currentExercise.exerciseType,
            userAnswer: JSON.stringify(selectedAnswer),
            correctAnswer: JSON.stringify(currentExercise.correctAnswer),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            audioPlays: audioPlayCount,
            answerChanges: answerChangeCount,
            totalSelections: selectionHistory.length
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
      setShowIncorrectFeedback(true);
    }
  };

  const moveToNextQuestion = async () => {
    setShowHint(false);
    setAiHint(null);

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
      setSelectedAnswer(null);
    } else {
      await finalizeExercise();
    }
  };

  const finalizeExercise = async () => {
    setResults(prev => ({
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
          const totalInteractions = selectionHistory.length + audioPlayCount;
          
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 25,
            speedBonus: timeElapsed < 200 ? 100 : 0,
            efficiencyBonus: answerChangeCount < 2 ? 80 : 0,
            exerciseType: 'singleAnswer'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'singleAnswer',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            answerChanges: answerChangeCount,
            audioUsage: audioPlayCount
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
    setSelectedAnswer(null);
    setTimeElapsed(0);
    setScore(0);
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    setIsCurrentAnswerCorrect(false);
    setShowFinalResults(false);
    setIsPlaying(false);
    setHighlightedWord(null);
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
    setAudioPlayCount(0);
    setAnswerChangeCount(0);

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={allExercises}
        exerciseType="singleAnswer"
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
                {/* Word/Audio Display */}
                <div className="text-center py-8 bg-white rounded-lg shadow-sm border">
                  {currentExercise?.exerciseType === "syllable" && (
                    <div className="space-y-4">
                      <div className="text-4xl font-bold text-blue-600">
                        <span className={highlightedWord === currentExercise.word ? 'bg-yellow-200' : ''}>
                          {currentExercise.word}
                        </span>
                      </div>
                      <div className="text-lg text-gray-600">
                        {currentExercise.syllables?.map((syllable, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 mx-1 rounded ${
                              highlightedWord === syllable ? 'bg-yellow-200' : ''
                            }`}
                          >
                            {syllable}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {currentExercise?.exerciseType === "rhyme" && (
                    <div className="space-y-4">
                      <div className="text-lg text-gray-700 mb-4">Listen to these words:</div>
                      <div className="flex flex-wrap justify-center gap-4">
                        {currentExercise.words?.map((word, index) => (
                          <button
                            key={index}
                            onClick={() => playWordAudio(word)}
                            className={`
                              text-2xl font-semibold px-4 py-2 rounded-lg transition-all duration-200
                              ${highlightedWord === word ? 'bg-yellow-200 text-blue-800' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}
                            `}
                          >
                            {word}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="mt-6">
                    <ExerciseAudioButton
                      onClick={playAudio}
                      disabled={isPlaying}
                      variant="primary"
                    >
                      {isPlaying ? '🔊 Playing...' : '🔊 Listen'}
                      {enableBackendIntegration && audioPlayCount > 0 && (
                        <span className="ml-2 text-xs opacity-75">({audioPlayCount} plays)</span>
                      )}
                    </ExerciseAudioButton>
                  </div>
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {currentExercise?.options?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`
                        p-4 rounded-lg border-2 transition-all duration-200 text-left
                        ${selectedAnswer === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50'
                        }
                      `}
                    >
                      <div className="font-medium">{option}</div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswer}
                    disabled={selectedAnswer === null || showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answer
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({audioPlayCount} plays, {answerChangeCount} changes)
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
          <IncorrectSingleAnswerFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            selectedAnswer={selectedAnswer}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}
