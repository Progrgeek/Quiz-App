import { useState, useEffect } from "react";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  pointerWithin,
  MeasuringStrategy,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  rectSwappingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";
import SortableItem from "./SortableItem";
import Stats from "../Stats";
import Feedback from "../FeedBack";
import FinalResults from "../FinalResults";
import IncorrectSequencingFeedback from "./IncorrectSequencingFeedback";
import exercisesData from "./sequencingExercises.json";
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

export default function Sequence({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) {
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [activeId, setActiveId] = useState(null);
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
    exerciseType: 'sequencing',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'sequencing',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'sequencing',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'sequencing'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [dragSequence, setDragSequence] = useState([]);
  const [sequenceChanges, setSequenceChanges] = useState(0);
  const [dragEfficiency, setDragEfficiency] = useState([]);

  // Drag and drop sensors
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 0,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 0,
      tolerance: 0,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  const currentExercise = exercisesData.exercises[currentExerciseIndex];
  const totalExercises = exercisesData.exercises.length;
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
          exerciseType: 'sequencing',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'sequencing',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  useEffect(() => {
    setItems(currentExercise.options);
    setDragSequence([]);
    setSequenceChanges(0);
    setDragEfficiency([]);
  }, [currentExerciseIndex]);

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

  const handleDragStart = async (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    const dragElement = document.getElementById(active.id);
    if (dragElement) {
      dragElement.classList.add('touch-none', 'select-none', 'z-50');
    }

    // Track drag start for backend integration
    if (enableBackendIntegration) {
      const dragEvent = {
        itemId: active.id,
        action: 'drag_start',
        timestamp: Date.now(),
        fromPosition: items.findIndex(item => item.id === active.id)
      };
      setDragSequence(prev => [...prev, dragEvent]);

      // Track drag interaction
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'drag_start',
          itemId: active.id,
          fromPosition: dragEvent.fromPosition,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const handleDragOver = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== overIndex) {
      setItems((items) => arrayMove(items, activeIndex, overIndex));
      
      // Track sequence change for backend integration
      if (enableBackendIntegration) {
        setSequenceChanges(prev => prev + 1);
        
        const moveEvent = {
          itemId: active.id,
          action: 'position_change',
          timestamp: Date.now(),
          fromPosition: activeIndex,
          toPosition: overIndex,
          distance: Math.abs(overIndex - activeIndex)
        };
        setDragSequence(prev => [...prev, moveEvent]);
        setDragEfficiency(prev => [...prev, moveEvent.distance]);

        // Track drag move interaction
        if (analytics.isReady) {
          await analytics.trackUserInteraction({
            type: 'drag_move',
            itemId: active.id,
            fromPosition: activeIndex,
            toPosition: overIndex,
            distance: moveEvent.distance,
            totalChanges: sequenceChanges + 1,
            questionIndex: currentExerciseIndex
          });
        }
      }
    }
  };

  const handleDragEnd = async (event) => {
    const { active } = event;
    setActiveId(null);
    
    const dragElement = document.getElementById(active.id);
    if (dragElement) {
      dragElement.classList.remove('touch-none', 'select-none', 'z-50');
    }

    // Track drag end for backend integration
    if (enableBackendIntegration) {
      const dragEvent = {
        itemId: active.id,
        action: 'drag_end',
        timestamp: Date.now(),
        finalPosition: items.findIndex(item => item.id === active.id)
      };
      setDragSequence(prev => [...prev, dragEvent]);

      // Track drag completion
      if (analytics.isReady) {
        await analytics.trackUserInteraction({
          type: 'drag_end',
          itemId: active.id,
          finalPosition: dragEvent.finalPosition,
          totalSequenceChanges: sequenceChanges,
          questionIndex: currentExerciseIndex
        });
      }
    }
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        currentSequence: items.map(item => item.text),
        correctSequence: currentExercise.correctOrder,
        sequenceType: currentExercise.type || 'general',
        context: {
          exerciseType: 'sequencing',
          difficulty: currentExercise.difficulty || 'medium',
          sequenceChanges: sequenceChanges
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex,
        sequenceChanges: sequenceChanges,
        dragActions: dragSequence.length
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAnswer = async () => {
    const currentOrder = items.map((item) => item.text);
    const isAnswerCorrect = JSON.stringify(currentOrder) === JSON.stringify(currentExercise.correctOrder);
    
    setIsCorrect(isAnswerCorrect);

    const questionResult = {
      question: currentExercise.question,
      exerciseType: 'sequencing',
      isCorrect: isAnswerCorrect,
      userAnswer: currentOrder,
      correctAnswer: currentExercise.correctOrder,
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      hintsUsed: showHint ? 1 : 0,
      sequenceChanges: sequenceChanges,
      dragActions: dragSequence.length,
      dragEfficiency: dragEfficiency.reduce((a, b) => a + b, 0) / Math.max(dragEfficiency.length, 1)
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
            userAnswer: currentOrder,
            correctAnswer: currentExercise.correctOrder,
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            dragSequence: dragSequence,
            sequenceChanges: sequenceChanges,
            dragEfficiency: questionResult.dragEfficiency
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'sequencing',
            subType: currentExercise.type || 'general',
            userAnswer: JSON.stringify(currentOrder),
            correctAnswer: JSON.stringify(currentExercise.correctOrder),
            isCorrect: isAnswerCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            sequenceChanges: sequenceChanges,
            dragActions: dragSequence.length,
            dragEfficiency: questionResult.dragEfficiency
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
          const avgEfficiency = dragEfficiency.reduce((a, b) => a + b, 0) / Math.max(dragEfficiency.length, 1);
          const totalDragActions = dragSequence.length;
          
          const xpData = {
            baseXP: Math.round(score),
            performanceBonus: results.correctAnswers * 20,
            speedBonus: timeElapsed < 240 ? 80 : 0,
            efficiencyBonus: avgEfficiency < 2 ? 60 : 0,
            exerciseType: 'sequencing'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'sequencing',
            score: score,
            correctAnswers: results.correctAnswers,
            totalQuestions: totalExercises,
            dragEfficiency: avgEfficiency,
            totalDragActions: totalDragActions
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
    setItems(exercisesData.exercises[0].options);
    setActiveId(null);
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
    setDragSequence([]);
    setSequenceChanges(0);
    setDragEfficiency([]);

    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercisesData.exercises}
        exerciseType="sequencing"
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
                <DndContext
                  sensors={sensors}
                  collisionDetection={pointerWithin}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  modifiers={[restrictToWindowEdges]}
                  measuring={{
                    strategy: MeasuringStrategy.Always,
                  }}
                >
                  <SortableContext
                    items={items}
                    strategy={window.innerWidth < 768 ? rectSwappingStrategy : horizontalListSortingStrategy}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg min-h-[200px]">
                      {items.map((item) => (
                        <SortableItem
                          key={item.id}
                          id={item.id}
                          text={item.text}
                          image={item.image}
                          isActive={activeId === item.id}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>

                <div className="flex justify-center">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswer}
                    disabled={showFeedback || showIncorrectFeedback}
                    className="w-full sm:w-auto mx-2 sm:mx-0"
                  >
                    Check Sequence
                    {enableBackendIntegration && (
                      <span className="ml-2 text-xs opacity-75">
                        ({sequenceChanges} changes, {dragSequence.length} actions)
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
          <IncorrectSequencingFeedback
            isVisible={showIncorrectFeedback}
            correctOrder={currentExercise?.correctOrder}
            userOrder={items.map((item) => item.text)}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}
