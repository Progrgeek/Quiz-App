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

const DragAndDrop = () => {
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

  const { sensoryExamples } = exercisesData;
  const currentExercise = exercisesData.exercises[currentExerciseIndex] || {};
  const totalExercises = exercisesData.exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  useEffect(() => {
    if (currentExercise) {
      const initialCategories = {};
      currentExercise.categories.forEach((category) => {
        initialCategories[category] = [];
      });
      setCategoryItems(initialCategories);
      setMovedItems(new Set());
      setTimeElapsed(0);
    }
  }, [currentExerciseIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    const draggedItemId = active.id;

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
    let sourceCategory = null;
    Object.entries(categoryItems).forEach(([category, items]) => {
      if (items.some((item) => item.id === draggedItemId)) {
        sourceCategory = category;
      }
    });

    if (!sourceCategory) {
      const draggedItem = currentExercise.options.find(
        (item) => item.id === draggedItemId
      );
      if (draggedItem) {
        setCategoryItems((prev) => ({
          ...prev,
          [targetCategory]: [...prev[targetCategory], draggedItem],
        }));
        setMovedItems((prev) => new Set(prev).add(draggedItemId));
      }
    } else if (sourceCategory !== targetCategory) {
      setCategoryItems((prev) => {
        const draggedItem = prev[sourceCategory].find(
          (item) => item.id === draggedItemId
        );
        return {
          ...prev,
          [sourceCategory]: prev[sourceCategory].filter(
            (item) => item.id !== draggedItemId
          ),
          [targetCategory]: [...prev[targetCategory], draggedItem],
        };
      });
    }
  };

  const getAllPlacedItems = () => {
    return Object.values(categoryItems).reduce(
      (acc, items) => acc + items.length,
      0
    );
  };

  const handleResetItem = (itemId) => {
    let sourceCategory = null;
    Object.entries(categoryItems).forEach(([category, items]) => {
      if (items.some((item) => item.id === itemId)) {
        sourceCategory = category;
      }
    });

    if (sourceCategory) {
      setCategoryItems((prev) => ({
        ...prev,
        [sourceCategory]: prev[sourceCategory].filter(
          (item) => item.id !== itemId
        ),
      }));
      setMovedItems((prev) => {
        const newSet = new Set(prev);
        newSet.delete(itemId);
        return newSet;
      });
    }
  };

  const checkAnswers = () => {
    let isAllCorrect = true;
    const userAnswersByCategory = {};
    const correctAnswersByCategory = {};
  
    // Initialize the answer objects with empty arrays for each category
    currentExercise.categories.forEach(category => {
      userAnswersByCategory[category] = [];
      correctAnswersByCategory[category] = [];
    });
  
    // Collect user answers based on where they actually placed items
    Object.entries(categoryItems).forEach(([category, items]) => {
      userAnswersByCategory[category] = items.map(item => item.content);
    });
  
    // Collect correct answers
    currentExercise.options.forEach(item => {
      correctAnswersByCategory[item.category].push(item.content);
    });
  
    // Check if answers are correct
    Object.entries(categoryItems).forEach(([category, items]) => {
      items.forEach(item => {
        if (item.category !== category) {
          isAllCorrect = false;
        }
      });
    });
  
    // Format the answers for FinalResults
    // We want to preserve the category structure in the results
    const formattedResult = {
      question: currentExercise.question,
      isCorrect: isAllCorrect,
      userAnswer: userAnswersByCategory,
      correctAnswer: correctAnswersByCategory,
      categories: currentExercise.categories, // Pass categories to know the order
      exerciseType: "dragAndDrop"
    };
  
    const newResults = {
      ...results,
      questions: [...results.questions, formattedResult],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAllCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAllCorrect ? 0 : 1),
    };
  
    setResults(newResults);
    setIsCorrect(isAllCorrect);
  
    if (isAllCorrect) {
      setShowCorrectFeedback(true);
      setScore((prev) => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowCorrectFeedback(false);
        if (currentExerciseIndex + 1 < totalExercises) {
          setCurrentExerciseIndex((prev) => prev + 1);
        } else {
          setShowFinalResults(true);
        }
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setShowFinalResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setTimeElapsed(0);
    setScore(0);
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
    setShowFinalResults(false);
    setCategoryItems({});
    setMovedItems(new Set());
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={{
          ...results,
          finalScore: score,
        }}
        exercises={exercisesData.exercises}
        exerciseType="dragAndDrop"
        onRestart={handleRestart}
      />
    );
  }

  const placedItems = new Set(
    Object.values(categoryItems)
      .flat()
      .map((item) => item.id)
  );

  return (
    <ExerciseContainer layout="standard" withExample={true}>
      <div className="hidden sm:block absolute top-8 right-3 z-10 w-auto">
        <Stats
          questionNumber={currentExerciseIndex + 1}
          totalQuestions={totalExercises}
          timeElapsed={timeElapsed}
          score={score}
        />
      </div>

      <div className="flex-1 sm:pr-[80px] w-full">
        <div className="relative">
          <div className="sm:hidden sm:pr-[0px] mb-4">
            <Stats
              questionNumber={currentExerciseIndex + 1}
              totalQuestions={totalExercises}
              timeElapsed={timeElapsed}
              score={score}
            />
          </div>

          <div className="max-w-[1000px] mx-auto w-full mt-4 sm:mt-8">
            <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
              <ExerciseQuestion variant="primary" level={1} className="mx-4 mb-8 mt-4">
                {currentExercise.question}
              </ExerciseQuestion>
              
              <Feedback
                isVisible={showCorrectFeedback}
                isCorrect={isCorrect}
                questionNumber={currentExerciseIndex + 1}
              />
              
              <IncorrectFeedback
                isVisible={showIncorrectFeedback}
                currentExercise={currentExercise}
                userAnswers={categoryItems}
                onGotIt={handleGotIt}
                sensoryExamples={sensoryExamples}
              />

              <ExerciseGrid exerciseType="drag-and-drop" className="px-5 sm:px-10">
                {currentExercise.options.map((item) => {
                  const isPlaced = placedItems.has(item.id);
                  return isPlaced ? (
                    <div
                      key={`placed-${item.id}`}
                      className="p-3 rounded-base text-center h-10 w-full max-w-64 mx-auto bg-neutral-200 text-neutral-400"
                    >
                      <span></span>
                    </div>
                  ) : (
                    <div
                      key={`unplaced-${item.id}`}
                      className={`transform transition-all duration-300 hover:-translate-y-1 ${
                        movedItems.has(item.id) ? "scale-105" : ""
                      } w-full`}
                    >
                      <DraggableItem
                        id={item.id}
                        content={item.content}
                        type={item.type || "text"}
                        label={item.label}
                      />
                    </div>
                  );
                })}
              </ExerciseGrid>

              <div className="grid grid-cols-1 gap-2 sm:gap-8 w-full px-2">
                <div className="flex flex-row gap-3 sm:gap-8 w-full">
                  {currentExercise.categories.map((category) => (
                    <DroppableZone
                      key={category}
                      id={category}
                      label={category}
                      items={categoryItems[category] || []}
                      onResetItem={handleResetItem}
                    />
                  ))}
                </div>
              </div>

              <div className="flex justify-center mt-8">
                <ExerciseButton
                  variant="primary"
                  size="large"
                  onClick={checkAnswers}
                  disabled={getAllPlacedItems() !== currentExercise.options.length}
                  className="sm:w-auto"
                >
                  Check Answers
                </ExerciseButton>
              </div>
            </DndContext>
          </div>
        </div>
      </div>
    </ExerciseContainer>
  );
};

export default DragAndDrop;