import { useState, useEffect } from "react";
import {
  DndContext,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DraggableItem from "./DraggableItem";
import DroppableZone from "./DroppableZone";
import Feedback from "../FeedBack";
import Stats from "../Stats";
import FinalResults from "../FinalResults";
import exercisesData from "./data/dragAndDropExercises.json";
import IncorrectFeedback from "./InCorrectAnswerFeedBackComponent";
import { 
  ExerciseContainer, 
  ExerciseQuestion, 
  ExerciseGrid, 
  ExerciseButton 
} from '../../design-system/ExerciseComponents';

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

const DragAndDrop = ({ 
  enableBackendIntegration = false,
  exerciseConfig = {},
  onExerciseComplete = null
}) => {
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
  
  // Original state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [categoryItems, setCategoryItems] = useState({});
  const [movedItems, setMovedItems] = useState(new Set());
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showCorrectFeedback, setShowCorrectFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
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
    exerciseType: 'drag-and-drop',
    ...exerciseConfig
  });

  const aiEngine = useAI({
    enabled: enableBackendIntegration,
    exerciseType: 'drag-and-drop',
    difficulty: exerciseConfig.difficulty || 'medium'
  });

  const analytics = useAnalytics({
    enabled: enableBackendIntegration,
    exerciseType: 'drag-and-drop',
    userId: exerciseConfig.userId || 'user_' + Date.now()
  });

  const gamification = useGamification({
    enabled: enableBackendIntegration,
    exerciseType: 'drag-and-drop'
  });

  // Enhanced state for backend integration
  const [aiHint, setAiHint] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [dragInteractions, setDragInteractions] = useState([]);

  const { sensoryExamples } = exercisesData;
  const currentExercise = exercisesData.exercises[currentExerciseIndex] || {};
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
          exerciseType: 'drag-and-drop',
          totalQuestions: totalExercises,
          timeLimit: exerciseConfig.timeLimit || null
        });
      }

      // Track exercise start with Analytics
      if (analytics.isReady) {
        await analytics.trackExerciseStart({
          exerciseType: 'drag-and-drop',
          totalQuestions: totalExercises,
          difficulty: exerciseConfig.difficulty || 'medium'
        });
      }
    } catch (error) {
      console.error('Error initializing backend systems:', error);
    }
  };

  useEffect(() => {
    if (currentExercise) {
      const initialCategories = {};
      currentExercise.categories.forEach((category) => {
        initialCategories[category] = [];
      });
      setCategoryItems(initialCategories);
      setMovedItems(new Set());
      setTimeElapsed(0);
      setDragInteractions([]);
    }
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

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    const draggedItemId = active.id;

    // Track drag interaction
    const interaction = {
      type: 'drag_end',
      itemId: draggedItemId,
      targetId: over?.id || null,
      timestamp: new Date().toISOString()
    };
    
    setDragInteractions(prev => [...prev, interaction]);

    // Track with Analytics
    if (enableBackendIntegration && analytics.isReady) {
      await analytics.trackUserInteraction({
        type: 'drag_drop',
        itemId: draggedItemId,
        sourceCategory: findItemCategory(draggedItemId),
        targetCategory: over?.id || null,
        questionIndex: currentExerciseIndex
      });
    }

    if (!over) {
      let sourceCategory = null;
      Object.entries(categoryItems).forEach(([category, items]) => {
        if (items.some((item) => item.id === draggedItemId)) {
          sourceCategory = category;
        }
      });

      if (sourceCategory) {
        setCategoryItems((prev) => ({
          ...prev,
          [sourceCategory]: prev[sourceCategory].filter(
            (item) => item.id !== draggedItemId
          ),
        }));
        setMovedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(draggedItemId);
          return newSet;
        });
      }
      return;
    }

    const targetCategory = over.id;
    const draggedItem = currentExercise.items.find(
      (item) => item.id === draggedItemId
    );

    if (!draggedItem) return;

    let sourceCategory = null;
    Object.entries(categoryItems).forEach(([category, items]) => {
      if (items.some((item) => item.id === draggedItemId)) {
        sourceCategory = category;
      }
    });

    if (sourceCategory === targetCategory) return;

    setCategoryItems((prev) => {
      const newState = { ...prev };

      if (sourceCategory) {
        newState[sourceCategory] = newState[sourceCategory].filter(
          (item) => item.id !== draggedItemId
        );
      }

      if (!newState[targetCategory].some((item) => item.id === draggedItemId)) {
        newState[targetCategory] = [...newState[targetCategory], draggedItem];
      }

      return newState;
    });

    setMovedItems((prev) => new Set(prev).add(draggedItemId));
  };

  const findItemCategory = (itemId) => {
    for (const [category, items] of Object.entries(categoryItems)) {
      if (items.some(item => item.id === itemId)) {
        return category;
      }
    }
    return null;
  };

  const requestAIHint = async () => {
    if (!enableBackendIntegration || !aiEngine.isReady) return;

    try {
      const hint = await aiEngine.generateIntelligentHint({
        question: currentExercise.question,
        items: currentExercise.items,
        categories: currentExercise.categories,
        currentPlacements: categoryItems,
        context: {
          exerciseType: 'drag-and-drop',
          correctMappings: currentExercise.correctMapping
        }
      });

      setAiHint(hint);
      setShowHint(true);

      // Track hint request
      await analytics.trackUserInteraction({
        type: 'hint_requested',
        questionIndex: currentExerciseIndex
      });
    } catch (error) {
      console.error('Error getting AI hint:', error);
    }
  };

  const checkAllPlacements = async () => {
    let correctCount = 0;
    let totalItems = currentExercise.items.length;
    const userAnswers = {};
    const correctAnswers = currentExercise.correctMapping;

    Object.entries(categoryItems).forEach(([category, items]) => {
      items.forEach((item) => {
        userAnswers[item.id] = category;
        if (correctAnswers[item.id] === category) {
          correctCount++;
        }
      });
    });

    const isAllCorrect = correctCount === totalItems && totalItems > 0;
    setIsCorrect(isAllCorrect);

    const questionResult = {
      question: currentExercise.question,
      isCorrect: isAllCorrect,
      userAnswers: userAnswers,
      correctAnswers: correctAnswers,
      exerciseType: 'drag-and-drop',
      timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
      dragInteractions: dragInteractions.length,
      hintsUsed: showHint ? 1 : 0
    };

    const newResults = {
      ...results,
      questions: [...results.questions, questionResult],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAllCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAllCorrect ? 0 : 1),
      finalScore: isAllCorrect ? score + pointsPerQuestion : score,
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
            correctAnswer: correctAnswers,
            isCorrect: isAllCorrect,
            timeSpent: questionResult.timeSpent,
            hintsUsed: questionResult.hintsUsed,
            interactions: dragInteractions
          });
        }

        // Track answer with Analytics
        if (analytics.isReady) {
          await analytics.trackAnswerSubmitted({
            questionId: currentExercise.id || `q_${currentExerciseIndex}`,
            questionType: 'drag-and-drop',
            userAnswer: userAnswers,
            correctAnswer: correctAnswers,
            isCorrect: isAllCorrect,
            timeSpent: questionResult.timeSpent,
            difficulty: currentExercise.difficulty || 'medium',
            hintsUsed: questionResult.hintsUsed,
            dragInteractions: dragInteractions.length
          });
        }
      } catch (error) {
        console.error('Error submitting answer to backend systems:', error);
      }
    }

    if (isAllCorrect) {
      setShowCorrectFeedback(true);
      setScore((prev) => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowCorrectFeedback(false);
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
            timeBonus: timeElapsed < 300 ? 50 : 0,
            interactionBonus: dragInteractions.length > 20 ? 25 : 0,
            exerciseType: 'drag-and-drop'
          };

          const xpResult = await gamification.awardXP(xpData);
          const achievements = await gamification.checkAchievements({
            exerciseCompleted: 'drag-and-drop',
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
    moveToNextQuestion();
  };

  const resetExercise = () => {
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
    setShowHint(false);
    setAiHint(null);
    
    if (enableBackendIntegration) {
      initializeBackendSystems();
    }
  };

  const getAvailableItems = () => {
    const placedItemIds = new Set();
    Object.values(categoryItems).forEach((items) => {
      items.forEach((item) => placedItemIds.add(item.id));
    });

    return currentExercise.items?.filter(
      (item) => !placedItemIds.has(item.id)
    ) || [];
  };

  const getAllItemsPlaced = () => {
    const totalPlaced = Object.values(categoryItems).reduce(
      (sum, items) => sum + items.length,
      0
    );
    return totalPlaced === (currentExercise.items?.length || 0);
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercisesData.exercises}
        exerciseType="drag-and-drop"
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

              <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
                <div className="space-y-6">
                  {/* Available Items */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-neutral-700">
                      Drag the items to the correct categories:
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                      {getAvailableItems().map((item) => (
                        <DraggableItem
                          key={item.id}
                          id={item.id}
                          content={item.content}
                          image={item.image}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Drop Zones */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-neutral-700">
                      Categories:
                    </h3>
                    <ExerciseGrid exerciseType="drag-and-drop">
                      {currentExercise.categories?.map((category) => (
                        <DroppableZone
                          key={category}
                          id={category}
                          category={category}
                          items={categoryItems[category] || []}
                        />
                      ))}
                    </ExerciseGrid>
                  </div>
                </div>
              </DndContext>

              <div className="flex justify-center mt-6">
                <ExerciseButton
                  variant="primary"
                  size="large"
                  onClick={checkAllPlacements}
                  disabled={!getAllItemsPlaced()}
                  className="w-full sm:w-auto mx-2 sm:mx-0"
                >
                  Check Answer
                  {enableBackendIntegration && (
                    <span className="ml-2 text-xs opacity-75">
                      ({dragInteractions.length} interactions)
                    </span>
                  )}
                </ExerciseButton>
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
            isVisible={showCorrectFeedback}
            isCorrect={true}
            questionNumber={currentExerciseIndex + 1}
          />
          <IncorrectFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            categoryItems={categoryItems}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
};

export default DragAndDrop;
