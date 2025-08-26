import { useState, useEffect, useRef } from "react";
import ExercisesData from "./highlightExercises.json";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectHighlightFeedback from "./IncorrectHighlightFeedback";
import { X } from 'lucide-react';
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

export default function Highlight({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  const exercises = ExercisesData.exercises;
  const inputRef = useRef(null);
  const wordRefs = useRef({});
  
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [corrections, setCorrections] = useState({});
  const [selectedWord, setSelectedWord] = useState(null);
  const [popupPosition, setPopupPosition] = useState({ left: '50%', transform: 'translateX(-50%)' });
  const [showInput, setShowInput] = useState(false);
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
    exerciseType: 'highlight',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'highlight',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'highlight',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'highlight'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [highlightPattern, setHighlightPattern] = useState([]);
  const [wordClickCounts, setWordClickCounts] = useState({});

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
          exerciseType: 'highlight',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'highlight',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  const hasSelection = () => {
    if (currentExercise.type === "pronouns") {
      return Object.keys(corrections).length > 0;
    }
    return selectedItems.size > 0;
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
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Reset enhanced state when exercise changes
    setHighlightPattern([]);
    setWordClickCounts({});
  }, [currentExerciseIndex]);

  const handleVowelClick = async (char, index) => {
    const newSelected = new Set(selectedItems);
    const key = `${char}-${index}`;

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);

    // Track highlight pattern
    if (enableBackendIntegration) {
      const highlightEvent = {
        char,
        index,
        action: newSelected.has(key) ? 'highlight' : 'unhighlight',
        timestamp: Date.now()
      };
      setHighlightPattern(prev => [...prev, highlightEvent]);

      // Track highlight interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'vowel_highlight',
          character: char,
          position: index,
          action: newSelected.has(key) ? 'highlight' : 'unhighlight',
          totalHighlighted: newSelected.size,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const handleWordClick = async (word, wordIndex) => {
    if (currentExercise.type !== "pronouns") return;

    // Track word clicks
    if (enableBackendIntegration) {
      setWordClickCounts(prev => ({
        ...prev,
        [word]: (prev[word] || 0) + 1
      }));

      // Track word click interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'word_click',
          word: word,
          wordIndex: wordIndex,
          clickCount: (wordClickCounts[word] || 0) + 1,
          questionIndex: currentExerciseIndex
        });
      }
    }

    setSelectedWord({ word, index: wordIndex });
    
    const wordElement = wordRefs.current[wordIndex];
    if (wordElement) {
      const position = calculatePopupPosition(wordElement);
      setPopupPosition(position);
    }
    
    setShowInput(true);
    
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  };

  const calculatePopupPosition = (wordElement) => {
    if (!wordElement) return;

    const rect = wordElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 156;
    const containerRect = wordElement.closest('.text-base')?.getBoundingClientRect();
    const isFirstWordInLine = containerRect && Math.abs(rect.left - containerRect.left) < 20;
    
    const spaceOnRight = viewportWidth - rect.left;
    
    if (isFirstWordInLine || rect.left < popupWidth / 2) {
      return { left: '0px', transform: 'none' };
    } else if (spaceOnRight < popupWidth / 2) {
      const rightAlignedLeft = `calc(100% - ${popupWidth}px)`;
      return { left: rightAlignedLeft, transform: 'none' };
    } else {
      return { left: '50%', transform: 'translateX(-50%)' };
    }
  };

  const handleInputSubmit = async (e) => {
    e.preventDefault();
    if (!selectedWord || !inputRef.current) return;

    const correction = inputRef.current.value.trim();
    if (!correction) return;

    setCorrections(prev => ({
      ...prev,
      [selectedWord.index]: correction
    }));

    // Track correction input
    if (enableBackendIntegration && analytics.isReady) {
      await analytics.trackUserInteraction({
        type: 'pronoun_correction',
        originalWord: selectedWord.word,
        correction: correction,
        wordIndex: selectedWord.index,
        questionIndex: currentExerciseIndex
      });
    }

    setShowInput(false);
    setSelectedWord(null);
    inputRef.current.value = '';
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        text: currentExercise.text,
        exerciseType: currentExercise.type,
        correctItems: currentExercise.correctItems || currentExercise.corrections,
        userSelections: currentExercise.type === 'pronouns' ? corrections : Array.from(selectedItems),
        context: {
          exerciseType: 'highlight',
          highlightType: currentExercise.type,
          difficulty: currentExercise.difficulty || 'medium'
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        currentSelections: currentExercise.type === 'pronouns' ? Object.keys(corrections).length : selectedItems.size
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAnswer = async () => {
    let isAnswerCorrect = false;
    let userAnswer = null;
    let correctAnswer = null;

    if (currentExercise.type === "vowels") {
      const correctIndices = new Set(currentExercise.correctItems.map(item => `${item.char}-${item.index}`));
      isAnswerCorrect = selectedItems.size === correctIndices.size && 
                       [...selectedItems].every(item => correctIndices.has(item));
      userAnswer = Array.from(selectedItems);
      correctAnswer = currentExercise.correctItems;
    } else if (currentExercise.type === "pronouns") {
      const expectedCorrections = currentExercise.corrections;
      const userCorrections = corrections;
      
      isAnswerCorrect = Object.keys(expectedCorrections).length === Object.keys(userCorrections).length &&
                       Object.keys(expectedCorrections).every(key => 
                         userCorrections[key] && userCorrections[key].toLowerCase() === expectedCorrections[key].toLowerCase()
                       );
      userAnswer = userCorrections;
      correctAnswer = expectedCorrections;
    }

    setIsCorrect(isAnswerCorrect);

    const questionResult = {
      question: currentExercise.question,
      text: currentExercise.text,
      type: currentExercise.type,
      isCorrect: isAnswerCorrect,
      userAnswer: userAnswer,
      correctAnswer: correctAnswer,
      exerciseType: 'highlight',
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      highlightActions: highlightPattern.length,
      wordClicks: Object.values(wordClickCounts).reduce((a, b) => a + b, 0)
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
            correctAnswer: correctAnswer,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            highlightPattern: highlightPattern,
            wordClickCounts: wordClickCounts
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'highlight',
            subType: currentExercise.type,
            userAnswer: JSON.stringify(userAnswer),
            correctAnswer: JSON.stringify(correctAnswer),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            highlightActions: highlightPattern.length,
            wordClicks: Object.values(wordClickCounts).reduce((a, b) => a + b, 0)
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
      setSelectedItems(new Set());
      setCorrections({});
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
          const totalInteractions = highlightPattern.length + Object.values(wordClickCounts).reduce((a, b) => a + b, 0);
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 16,
            speedBonus: timeElapsed < 300 ? 65 : 0,
            precisionBonus: totalInteractions < totalExercises * 5 ? 40 : 0,
            exerciseType: 'highlight'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'highlight',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            interactions: totalInteractions
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
    setSelectedItems(new Set());
    setTimeElapsed(0);
    setScore(0);
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    setIsCorrect(false);
    setShowFinalResults(false);
    setCorrections({});
    setSelectedWord(null);
    setShowInput(false);
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
    setShowHint(false);
    setAiHint(null);
    setHighlightPattern([]);
    setWordClickCounts({});

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  const renderText = () => {
    if (!currentExercise) return null;

    if (currentExercise.type === "vowels") {
      return (
        <div className="text-2xl sm:text-3xl font-medium leading-relaxed text-center">
          {currentExercise.text.split("").map((char, index) => {
            const isVowel = /[aeiouAEIOU]/.test(char);
            const key = `${char}-${index}`;
            const isSelected = selectedItems.has(key);

            if (isVowel) {
              return (
                <span
                  key={index}
                  onClick={() => handleVowelClick(char, index)}
                  className={`cursor-pointer px-1 py-0.5 rounded transition-colors duration-200 hover:bg-primary-100 ${
                    isSelected ? 'bg-primary-200 text-primary-800' : ''
                  }`}
                >
                  {char}
                </span>
              );
            } else {
              return <span key={index}>{char}</span>;
            }
          })}
        </div>
      );
    } else if (currentExercise.type === "pronouns") {
      const words = currentExercise.text.split(/(\s+)/);
      
      return (
        <div className="text-base sm:text-lg leading-relaxed">
          {words.map((word, index) => {
            if (word.trim()) {
              const correction = corrections[index];
              const isHighlighted = correction !== undefined;
              
              return (
                <span key={index} className="relative inline-block">
                  <span
                    ref={(el) => wordRefs.current[index] = el}
                    onClick={() => handleWordClick(word, index)}
                    className={`cursor-pointer px-1 py-0.5 rounded transition-colors duration-200 hover:bg-primary-100 ${
                      isHighlighted ? 'bg-primary-200 text-primary-800' : ''
                    }`}
                  >
                    {correction || word}
                  </span>
                  
                  {selectedWord?.index === index && showInput && (
                    <div 
                      className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
                      style={popupPosition}
                    >
                      <form onSubmit={handleInputSubmit} className="p-2">
                        <input
                          ref={inputRef}
                          type="text"
                          className="w-32 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                          placeholder="Correction"
                          autoComplete="off"
                        />
                      </form>
                    </div>
                  )}
                </span>
              );
            } else {
              return <span key={index}>{word}</span>;
            }
          })}
        </div>
      );
    }

    return null;
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="highlight"
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
                <div className="p-8 bg-white rounded-lg shadow-sm border min-h-[200px] flex items-center justify-center">
                  {renderText()}
                </div>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswer}
                    disabled={!hasSelection() || showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Answer
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({highlightPattern.length} highlights, {Object.values(wordClickCounts).reduce((a, b) => a + b, 0)} clicks)
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
          <IncorrectHighlightFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            selectedItems={selectedItems}
            corrections={corrections}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}
