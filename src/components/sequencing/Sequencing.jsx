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

export default function Sequence() {
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

  useEffect(() => {
    setItems(currentExercise.options);
  }, [currentExerciseIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    
    const dragElement = document.getElementById(active.id);
    if (dragElement) {
      dragElement.classList.add('touch-none', 'select-none', 'z-50');
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const activeIndex = items.findIndex((item) => item.id === active.id);
    const overIndex = items.findIndex((item) => item.id === over.id);

    if (activeIndex !== overIndex) {
      setItems((items) => arrayMove(items, activeIndex, overIndex));
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }

    const dragElement = document.getElementById(active.id);
    if (dragElement) {
      dragElement.classList.remove('touch-none', 'select-none', 'z-50');
    }

    setActiveId(null);
  };

  const handleDragCancel = () => {
    if (activeId) {
      const dragElement = document.getElementById(activeId);
      if (dragElement) {
        dragElement.classList.remove('touch-none', 'select-none', 'z-50');
      }
    }

    setActiveId(null);
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    setShowFeedback(false);

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setResults((prev) => ({
        ...prev,
        finalScore: score,
      }));
      setShowFinalResults(true);
    }
  };

  const checkAnswer = () => {
    const isSequenceCorrect = items.every(
      (item, index) => item.order === index + 1
    );

    setIsCorrect(isSequenceCorrect);
    setShowFeedback(true);

    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          isCorrect: isSequenceCorrect,
          userAnswer: items.map((item) => item.content),
          correctAnswer: currentExercise.correctOrder,
          explanation: currentExercise.solution,
        },
      ],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isSequenceCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isSequenceCorrect ? 0 : 1),
      finalScore: isSequenceCorrect ? score + pointsPerQuestion : score,
    };

    setResults(newResults);

    if (isSequenceCorrect) {
      setScore((prev) => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowFeedback(false);
        if (currentExerciseIndex < totalExercises - 1) {
          setCurrentExerciseIndex((prev) => prev + 1);
        } else {
          setShowFinalResults(true);
        }
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  const getContainerClass = (type) => {
    const baseClass = "touch-none select-none relative w-full max-w-full overflow-hidden";
    
    if (type === 'phrases') {
      return `${baseClass} flex flex-col items-start p-4 backdrop-blur-sm`;
    }
    
    if (type === 'image-word') {
      const itemCount = items.length;
      const gridCols = itemCount <= 4 ? `grid-cols-${itemCount}` : 'grid-cols-4';
      return `${baseClass} grid ${gridCols} gap-2 p-4 rounded-xl mx-auto`;
    }
    
    if (type === 'sentence') {
      return `${baseClass} flex flex-row flex-nowrap items-center gap-2 p-4`;
    }
    
    return `${baseClass} grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4`;
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercisesData.exercises}
        exerciseType="sequencing"
        onRestart={() => {
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
        }}
      />
    );
  }

  return (
    <ExerciseContainer layout="standard" withExample={true}>
      <div className="max-w-[1000px] w-full mx-auto">
        <div className="sm:min-h-[75vh] relative w-full max-w-full">
          {/* Stats for mobile */}
          <div className="block sm:hidden mb-4 sm:mb-6">
            <Stats
              questionNumber={currentExerciseIndex + 1}
              totalQuestions={totalExercises}
              timeElapsed={timeElapsed}
              score={score}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:m-5 sm:mt-20 w-full max-w-full">
            <div className="flex flex-col flex-1 w-full max-w-full">
              <ExerciseQuestion variant="primary" level={1} className="mb-3 sm:mb-4 break-words">
                {currentExercise.question}
              </ExerciseQuestion>

              {currentExercise.contentType === "mixed" && (
                <img
                  src={currentExercise.image}
                  alt="Exercise"
                  className="mb-4 sm:mb-8 mx-auto rounded-lg shadow-md max-w-full h-auto max-h-[200px] sm:max-h-[300px]"
                />
              )}

              <div className="space-y-4 sm:space-y-6 w-full">
                <DndContext
                  sensors={sensors}
                  collisionDetection={pointerWithin}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDragEnd={handleDragEnd}
                  onDragCancel={handleDragCancel}
                  modifiers={[restrictToWindowEdges]}
                  measuring={{
                    droppable: {
                      strategy: MeasuringStrategy.Always,
                    },
                  }}
                >
                  <div className="text-base sm:text-lg w-full max-w-full">
                    <SortableContext
                      items={items}
                      strategy={
                        currentExercise.type === "sentence" || currentExercise.type === "phrases"
                          ? horizontalListSortingStrategy
                          : rectSwappingStrategy
                      }
                    >
                      <div className={getContainerClass(currentExercise.type)}>
                        {items.map((item) => (
                          <SortableItem
                            key={item.id}
                            id={item.id}
                            content={item.content}
                            type={currentExercise.type}
                            isActive={item.id === activeId}
                          />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                </DndContext>

                <div className="flex justify-center mt-4 sm:mt-8">
                  <ExerciseButton
                    variant="primary"
                    size="large"
                    onClick={checkAnswer}
                    className="w-full sm:w-auto"
                  >
                    Check Answer
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
            isVisible={showFeedback && isCorrect}
            isCorrect={isCorrect}
            questionNumber={currentExerciseIndex + 1}
          />

          <IncorrectSequencingFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            userAnswer={items.map((item) => item.content)}
            onGotIt={handleGotIt}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}