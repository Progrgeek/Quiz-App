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

export default function ClickChange() {
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

  const exercises = exercisesData.exercises;
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

  useEffect(() => {
    const timer = setInterval(() => {
      if (!showFinalResults) {
        setTimeElapsed((prev) => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  useEffect(() => {
    setClickedWords(new Set());
  }, [currentExerciseIndex]);

  const handleWordClick = (index) => {
    const word = currentExercise.words[index];
    if (currentExercise.type === "pronoun" && !word.isPronoun) {
      return;
    }

    const newClickedWords = new Set(clickedWords);
    if (clickedWords.has(index)) {
      newClickedWords.delete(index);
    } else {
      newClickedWords.add(index);
    }
    setClickedWords(newClickedWords);
  };

  const checkAnswer = () => {
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
    setShowFeedback(true);

    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          isCorrect: isAnswerCorrect,
          userAnswer: [...clickedWords]
            .map((index) => currentExercise.words[index].text)
            .join(", "),
        },
      ],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAnswerCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAnswerCorrect ? 0 : 1),
      finalScore: isAnswerCorrect ? score + pointsPerQuestion : score,
    };

    setResults(newResults);

    if (isAnswerCorrect) {
      setScore((prev) => prev + pointsPerQuestion);
      setTimeout(() => {
        setShowFeedback(false);
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
    setShowFeedback(false);
    setClickedWords(new Set());

    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex((prev) => prev + 1);
    } else {
      setShowFinalResults(true);
    }
  };

 

  // Function to determine if the Check Answer button should be disabled
  const isCheckButtonDisabled = () => {
    if (currentExercise.type === "pronoun") {
      return false; // Never disabled for pronoun exercises
    }
    return clickedWords.size === 0; // Disabled when no words are clicked for other exercise types
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="clickToChange"
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
          setClickedWords(new Set());
        }}
      />
    );
  }

  return (
    <ExerciseContainer layout="standard" withExample={true}>
      <div className="max-w-[1000px] mx-auto">
        <div className="min-h-[60vh] sm:min-h-[75vh] relative overflow-hidden">
              <div className="block sm:hidden mb-4">
                <Stats
                  questionNumber={currentExerciseIndex + 1}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:mx-5 sm:mt-20">
                <div className="flex flex-col flex-1 w-full">
                  <ExerciseQuestion variant="primary" level={1} className="mb-3 sm:mb-4">
                    {currentExercise.question}
                  </ExerciseQuestion>

                  <div className="text-base sm:text-lg md:text-xl my-4 sm:my-8 p-3 sm:p-6 bg-neutral-50 rounded-lg break-words">
                    {currentExercise.words.map((word, index) => (
                      <span
                        key={index}
                        onClick={() => handleWordClick(index)}
                        className={`
                          inline-block mx-0.5 sm:mx-1 p-0.5 sm:p-1 rounded
                          ${currentExercise.type === "capitalize" || 
                            (currentExercise.type === "pronoun" && word.isPronoun)
                              ? "cursor-pointer"
                              : "cursor-default"}
                          ${clickedWords.has(index)
                            ? "text-primary-600 font-medium"
                            : currentExercise.type === "pronoun" && word.isPronoun
                            ? "text-primary-600"
                            : "text-neutral-800"}
                          ${
                            currentExercise.type === "capitalize" ||
                            (currentExercise.type === "pronoun" && word.isPronoun)
                              ? "hover:text-primary-400 transition-colors hover:bg-primary-50"
                              : ""
                          }
                          text-sm sm:text-base md:text-lg
                        `}
                      >
                        {clickedWords.has(index)
                          ? currentExercise.type === "capitalize"
                            ? word.text.charAt(0).toUpperCase() + word.text.slice(1)
                            : currentExercise.type === "pronoun" && word.isPronoun
                            ? word.correctForm
                            : word.text
                          : word.text}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-center mt-4 sm:mt-8">
                    <ExerciseButton
                      variant="primary"
                      size="large"
                      onClick={checkAnswer}
                      disabled={isCheckButtonDisabled()}
                      className="w-full sm:w-auto"
                    >
                      Check Answer
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
                isVisible={showFeedback}
                isCorrect={isCurrentAnswerCorrect}
                questionNumber={currentExerciseIndex + 1}
              />

              <IncorrectClickToChange
                isVisible={showIncorrectFeedback}
                currentExercise={currentExercise}
                clickedWords={clickedWords}
                onGotIt={handleGotIt}
              />
        </div>
      </div>
    </ExerciseContainer>
  );
}