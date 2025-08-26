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

export default function WordCompletion() {
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

  // Add ref for input focus management
  const inputRef = useRef(null);

  const exercises = exercisesData.exercises;
  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

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
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isAnswerCorrect =
      userAnswer.toLowerCase().trim() ===
      currentExercise.answer.toLowerCase().trim();
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);

    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          isCorrect: isAnswerCorrect,
          userAnswer: userAnswer,
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
        setUserAnswer("");
        if (currentExerciseIndex + 1 < totalExercises) {
          setCurrentExerciseIndex((prev) => prev + 1);
        } else {
          setResults((prev) => ({
            ...prev,
            finalScore: score + pointsPerQuestion,
          }));
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
    setUserAnswer("");

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

  const renderWordCompletion = () => {
    const parts = currentExercise.sentence.split("{answer}");
    const [before, after] = parts;
    const given = currentExercise.given;

    return (
      <div className="flex items-center gap-2 flex-wrap">
        <span
          dangerouslySetInnerHTML={{
            __html: before.replace("{given}", `<strong>${given}</strong>`),
          }}
        />
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border-b-2 border-primary-500 focus:outline-none focus:border-primary-700 px-2 py-1 w-32"
        />
        <span
          dangerouslySetInnerHTML={{
            __html: after.replace("{given}", `<strong>${given}</strong>`),
          }}
        />
      </div>
    );
  };

  const renderSimpleAddition = () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{currentExercise.given}</span>
          <span className="text-2xl">+</span>
          <span className="text-2xl">{currentExercise.suffix}</span>
          <span className="text-2xl">=</span>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          className="border-2 border-primary-500 rounded px-3 py-1 w-32 text-2xl"
        />
      </div>
    );
  };

  const renderPossessiveWithHint = () => {
    const parts = currentExercise.sentence.split("{answer}");
    const [before, after] = parts;

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="bg-green-100 p-2 rounded-lg inline-block">
            <span className="font-medium">{currentExercise.hintWord}</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span
              dangerouslySetInnerHTML={{
                __html: before.replace(
                  "{given}",
                  `<strong>${currentExercise.given}</strong>`
                ),
              }}
            />
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="border-b-2 border-primary-500 focus:outline-none focus:border-primary-700 px-2 py-1 w-32"
              />
            </div>
            <span>{after}</span>
          </div>
        </div>
      </div>
    );
  };

  const renderExercise = () => {
    switch (currentExercise.type) {
      case "word_completion":
        return renderWordCompletion();
      case "simple_addition":
        return renderSimpleAddition();
      case "possessive_hint":
        return renderPossessiveWithHint();
      default:
        return renderWordCompletion();
    }
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises.map((exercise) => ({
          sentence: exercise.sentence,
          given: exercise.given,
          suffix: exercise.suffix || "",
          answer: exercise.answer,
          explanation: exercise.explanation,
        }))}
        exerciseType="fillInTheBlanks"
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
          setUserAnswer("");
        }}
      />
    );
  }

  return (
    <ExerciseContainer layout="standard" withExample={true}>
      <div className="max-w-[1000px] mx-auto">
        <div className="sm:min-h-[75vh] relative overflow-hidden">
          <div className="block sm:hidden mb-6">
            <Stats
              questionNumber={currentExerciseIndex + 1}
              totalQuestions={totalExercises}
              timeElapsed={timeElapsed}
              score={score}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start m-5 sm:mt-20">
            <div className="flex flex-col flex-1">
              <ExerciseQuestion variant="primary" level={1} className="mb-4">
                {currentExercise.question}
              </ExerciseQuestion>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-lg">{renderExercise()}</div>
                <div className="flex justify-center mt-8">
                  <ExerciseButton
                    type="submit"
                    variant="primary"
                    size="large"
                    disabled={!userAnswer.trim()}
                    className="sm:w-auto"
                  >
                    Check Answers
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
            isVisible={showFeedback && isCorrect}
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