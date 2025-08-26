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

export default function Highlight() {
  const exercises = ExercisesData.exercises;
  const inputRef = useRef(null);
  const wordRefs = useRef({});
  
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

  const currentExercise = exercises[currentExerciseIndex];
  const totalExercises = exercises.length;
  const pointsPerQuestion = 100 / totalExercises;

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
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [showFinalResults]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputRef.current && !inputRef.current.contains(event.target)) {
        setShowInput(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleVowelClick = (char, index) => {
    const newSelected = new Set(selectedItems);
    const key = `${char}-${index}`;

    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const calculatePopupPosition = (wordElement) => {
    if (!wordElement) return;

    const rect = wordElement.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const popupWidth = 156;
    const containerRect = wordElement.closest('.text-base')?.getBoundingClientRect();
    const isFirstWordInLine = containerRect && Math.abs(rect.left - containerRect.left) < 20; // Increased threshold
    
    const spaceOnRight = viewportWidth - rect.left;
    
    if (isFirstWordInLine || rect.left < popupWidth / 2) {
      // Word is first in line or too close to left edge
      return { left: '0px', transform: 'none' }; // Increased offset
    } else if (spaceOnRight < popupWidth / 2) {
      // Word is too close to right edge
      const rightAlignedLeft = `calc(100% - ${popupWidth}px)`;
      return { left: rightAlignedLeft, transform: 'none' };
    } else {
      // Center the popup above the word
      return { left: '50%', transform: 'translateX(-50%)' };
    }
};

  const handleWordClick = (word, index, event) => {
    if (currentExercise.type === "pronouns") {
      event.stopPropagation();
      const wordElement = wordRefs.current[`${word}-${index}`];
      const newPosition = calculatePopupPosition(wordElement);
      setPopupPosition(newPosition);
      setSelectedWord({ word, index });
      setShowInput(true);
      if (!corrections[`${word}-${index}`]) {
        setCorrections(prev => ({
          ...prev,
          [`${word}-${index}`]: ""
        }));
      }
    } else {
      const newSelected = new Set(selectedItems);
      let key = currentExercise.type === "redundant-phrase"
        ? `${word}-${index}`
        : word;
      
      if (newSelected.has(key)) {
        newSelected.delete(key);
      } else {
        newSelected.add(key);
      }
      setSelectedItems(newSelected);
    }
  };


  const handleCorrectionChange = (e, word, index) => {
    setCorrections(prev => ({
      ...prev,
      [`${word}-${index}`]: e.target.value
    }));
  };

  const handleCorrectionKeyDown = (e) => {
    if (e.key === 'Enter') {
      setShowInput(false);
    }
  };

  const closeCorrection = () => {
    setShowInput(false);
    if (selectedWord) {
      const key = `${selectedWord.word}-${selectedWord.index}`;
      if (!corrections[key]) {
        setCorrections(prev => {
          const newCorrections = { ...prev };
          delete newCorrections[key];
          return newCorrections;
        });
      }
    }
  };

  const checkAnswer = () => {
    let isAnswerCorrect = false;
    let hasIncorrectSelections = false;
    let userAnswer = "";
    let correctAnswer = "";

    if (currentExercise.type === "vowels") {
      const selectedVowels = Array.from(selectedItems).map(item => item.split("-")[0]);
      const targetVowelCounts = currentExercise.targets.reduce((acc, vowel) => {
        acc[vowel] = (acc[vowel] || 0) + 1;
        return acc;
      }, {});

      const selectedVowelCounts = selectedVowels.reduce((acc, vowel) => {
        acc[vowel] = (acc[vowel] || 0) + 1;
        return acc;
      }, {});

      isAnswerCorrect =
        Object.keys(targetVowelCounts).every(vowel =>
          selectedVowelCounts[vowel] === targetVowelCounts[vowel]
        ) &&
        Object.keys(selectedVowelCounts).every(vowel =>
          targetVowelCounts[vowel] === selectedVowelCounts[vowel]
        );

      hasIncorrectSelections =
        !isAnswerCorrect ||
        Object.keys(selectedVowelCounts).some(vowel => !targetVowelCounts[vowel]);

      userAnswer = selectedVowels.join(",");
      correctAnswer = currentExercise.targets.join(",");
    } else if (currentExercise.type === "pronouns") {
        // Get the target corrections from the exercise
        const targetCorrections = currentExercise.targets.reduce((acc, target) => {
          acc[target.word] = target.correction;
          return acc;
        }, {});
  
        // Get the user's corrections
        const userCorrections = Object.entries(corrections).reduce((acc, [key, value]) => {
          const word = key.split("-")[0];
          acc[word] = value;
          return acc;
        }, {});
  
        // Check if the user has provided exactly the required corrections
        const hasExactTargets = Object.keys(targetCorrections).length === Object.keys(userCorrections).length;
        
        if (hasExactTargets) {
          // Check if all target words are corrected properly
          isAnswerCorrect = Object.entries(targetCorrections).every(([word, correction]) =>
            userCorrections[word]?.toLowerCase() === correction.toLowerCase()
          );
        } else {
          isAnswerCorrect = false;
        }
  
        userAnswer = JSON.stringify(userCorrections);
        correctAnswer = JSON.stringify(targetCorrections)
        
      } else if (currentExercise.type === "redundant" || currentExercise.type === "nouns") {
      const selectedWords = Array.from(selectedItems);
      const targetWords = currentExercise.targets.map(target => target.toLowerCase());

      // Convert selected words to lowercase for case-insensitive comparison
      const selectedWordsLower = selectedWords.map(word => word.toLowerCase());

      // Check if all selected words are in the target words
      const allSelectionsAreCorrect = selectedWordsLower.every(word =>
        targetWords.includes(word)
      );

      // Check if all target words are in the selected words
      const allTargetsAreSelected = targetWords.every(target =>
        selectedWordsLower.includes(target)
      );

      // Both conditions must be true for the answer to be correct
      isAnswerCorrect = allSelectionsAreCorrect && allTargetsAreSelected;
      
      // Only mark as having incorrect selections if the user selected words that aren't targets
      hasIncorrectSelections = !allSelectionsAreCorrect;

      userAnswer = selectedWordsLower.join(",");
      correctAnswer = targetWords.join(",");
    } else  if (currentExercise.type === "redundant-phrase") {
        // Get all selected words without indices
        const selectedWords = Array.from(selectedItems).map(item => {
          const [word] = item.split("-");
          return word.toLowerCase();
        });
    
        // Create a Set of unique selected words
        const uniqueSelectedWords = new Set(selectedWords);
        
        // Convert targets to lowercase for case-insensitive comparison
        const targetWords = currentExercise.targets.map(target => target.toLowerCase());
    
        // Check if all selected words are in targets
        const allSelectionsAreCorrect = Array.from(uniqueSelectedWords).every(word =>
          targetWords.includes(word)
        );
    
        // Check if all targets are in selected words
        const allTargetsAreSelected = targetWords.every(target =>
          uniqueSelectedWords.has(target)
        );
    
        isAnswerCorrect = allSelectionsAreCorrect && allTargetsAreSelected;
        hasIncorrectSelections = !allSelectionsAreCorrect;
    
        userAnswer = Array.from(uniqueSelectedWords).join(",");
        correctAnswer = targetWords.join(",");
      }

    setIsCorrect(isAnswerCorrect);

    if (isAnswerCorrect && !hasIncorrectSelections) {
      setShowFeedback(true);
      const newScore = score + pointsPerQuestion;
      setScore(newScore);
      updateResults(true, userAnswer, correctAnswer, newScore);
      setTimeout(() => {
        moveToNextQuestion();
      }, 2000);
    } else {
      setShowIncorrectFeedback(true);
      updateResults(false, userAnswer, correctAnswer, score);
    }
  };

  const getFormattedAnswer = (selectedItems, exercise) => {
    switch (exercise.type) {
      case "vowels":
        return Array.from(selectedItems)
          .map(item => item.split("-")[0])
          .join(", ");
      case "pronouns":
        return Object.entries(corrections)
          .map(([ value]) => value)
          .join(", ");
      case "redundant":
      case "nouns":
        return Array.from(selectedItems).join(", ");
      case "redundant-phrase":
        return Array.from(selectedItems)
          .map(item => item.split("-")[0])
          .join(", ");
      default:
        return "";
    }
  };

  const getFormattedCorrectAnswer = (exercise) => {
    switch (exercise.type) {
      case "vowels":
        return exercise.targets.join(", ");
      case "pronouns":
        return exercise.targets
          .map(target => target.correction)
          .join(", ");
      case "redundant":
      case "nouns":
      case "redundant-phrase":
        return exercise.targets.join(", ");
      default:
        return "";
    }
  }

  const updateResults = (isCorrect, userAnswer, correctAnswer, newScore) => {
    setResults(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          isCorrect,
          userAnswer: getFormattedAnswer(selectedItems, currentExercise),
          correctAnswer: getFormattedCorrectAnswer(currentExercise),
          question: currentExercise.question,
          explanation: currentExercise.explanation
        }
      ],
      times: [...prev.times, timeElapsed],
      correctAnswers: prev.correctAnswers + (isCorrect ? 1 : 0),
      wrongAnswers: prev.wrongAnswers + (!isCorrect ? 1 : 0),
      finalScore: newScore,
    }));
  };


  
  const moveToNextQuestion = () => {
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    if (currentExerciseIndex + 1 < totalExercises) {
      setCurrentExerciseIndex(prev => prev + 1);
      resetQuestionState();
    } else {
      setShowFinalResults(true);
    }
  };

  const resetQuestionState = () => {
    setSelectedItems(new Set());
    setSelectedWord(null);
    setCorrections({});
    setShowInput(false);
  };

  const renderVowels = () => {
    const text = currentExercise.text;
    return text.split("").map((char, index) => (
      <span
        key={index}
        onClick={() => handleVowelClick(char, index)}
        className={`
          cursor-pointer px-0.5 py-1 rounded inline-block
          transition-all duration-200 transform
          hover:text-blue-500 hover:scale-125
          ${selectedItems.has(`${char}-${index}`) ? "text-blue-500" : ""}
        `}
      >
        {char}
      </span>
    ));
  };

  const renderWords = () => {
    const words = currentExercise.text.split(" ");
    return words.map((word, index) => {
      const cleanWord = word.replace(/[.,!?]/g, '');
      const key = currentExercise.type === "redundant-phrase"
        ? `${cleanWord}-${index}`
        : cleanWord;
 
      return (
        <span 
          key={index} 
          className="relative inline-block mr-3 mb-2 group mt-8"
          ref={el => wordRefs.current[`${cleanWord}-${index}`] = el}
        >
          {/* Correction display */}
          {currentExercise.type === "pronouns" &&
           corrections[`${cleanWord}-${index}`] &&
           !showInput && (
            <div className="absolute left-1/2 transform -translate-x-1/2 bg-primary-50 px-2 py-1 rounded text-sm text-primary-600 whitespace-nowrap"
                 style={{
                   top: '-32px'
                 }}>
              {corrections[`${cleanWord}-${index}`]}
            </div>
          )}
          
          {/* Word itself */}
          <span
            onClick={(e) => handleWordClick(cleanWord, index, e)}
            className={`
              cursor-pointer px-1 py-1
              transition-all duration-200
              ${currentExercise.type === "pronouns"
                ? `hover:text-red-500
                   ${selectedWord?.index === index ? "text-red-500" : ""}
                   ${corrections[`${cleanWord}-${index}`] ? "text-red-500" : ""}`
                : currentExercise.type === "redundant-phrase"
                  ? `hover:line-through hover:text-gray-700
                     ${selectedItems.has(key) ? "line-through text-gray-400" : ""}`
                  : `hover:border-b-2 hover:border-primary-400 hover:border-dashed
                     ${selectedItems.has(cleanWord) ? "border-b-2 border-primary-500" : ""}`
              }
            `}
          >
            {word}
          </span>

          {/* Input popup */}
          {currentExercise.type === "pronouns" &&
           selectedWord?.index === index &&
           showInput && (
            <div
              ref={inputRef}
              className="absolute z-10 shadow-lg rounded-lg p-2 border border-gray-200 bg-white"
              style={{
                bottom: 'calc(100% + 8px)',
                ...popupPosition
              }}
            >
              <div className="relative">
                <input
                  type="text"
                  value={corrections[`${cleanWord}-${index}`] || ""}
                  onChange={(e) => handleCorrectionChange(e, cleanWord, index)}
                  onKeyDown={handleCorrectionKeyDown}
                  className="border border-gray-300 rounded px-3 py-2 text-sm w-32 pr-8"
                  placeholder="Correction..."
                  autoFocus
                />
                <button
                  onClick={closeCorrection}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div 
                className="absolute w-3 h-3 bg-white transform rotate-45 -bottom-1.5 border-b border-r border-gray-200"
                style={{
                  left: popupPosition.transform === 'none' ? '16px' : '50%',
                  transform: popupPosition.transform === 'none' ? 'none' : 'translateX(-50%)'
                }}
              ></div>
            </div>
          )}
        </span>
      );
    });
  };

  const renderText = () => {
    switch (currentExercise.type) {
      case "vowels":
        return renderVowels();
      case "nouns":
      case "redundant":
      case "pronouns":
      case "redundant-phrase":
        return renderWords();
      default:
        return null;
    }
  };

  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={exercises}
        exerciseType="highlight"
        onRestart={() => {
          setCurrentExerciseIndex(0);
          setTimeElapsed(0);
          setScore(0);
          setShowFinalResults(false);
          resetQuestionState();
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
      <div className="max-w-[1000px] mx-auto">
        <div className="min-h-[75vh] p-2 relative overflow-hidden">
          <div className="block sm:hidden mb-4 sm:mb-6">
            <Stats
              questionNumber={currentExerciseIndex + 1}
              totalQuestions={totalExercises}
              timeElapsed={timeElapsed}
              score={score}
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start mt-2 sm:mt-4 md:mt-20">
            <div className="flex flex-col flex-1 w-full">
              <ExerciseQuestion variant="primary" level={1} className="mb-3 sm:mb-4 px-2 sm:px-4 md:px-0">
                {currentExercise.question}
              </ExerciseQuestion>

              <div className="text-base sm:text-lg md:text-2xl mb-6 sm:mb-8 p-3 sm:p-4 bg-neutral-50 rounded-lg relative leading-relaxed">
                {renderText()}
              </div>

              <div className="flex justify-center mt-4 sm:mt-8 px-2 sm:px-0">
                <ExerciseButton
                  variant="primary"
                  size="large"
                  onClick={checkAnswer}
                  disabled={!hasSelection()}
                  className="w-full sm:w-auto"
                >
                  Check Answers
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
            isCorrect={isCorrect}
            questionNumber={currentExerciseIndex + 1}
            explanation={currentExercise.explanation}
          />

          <IncorrectHighlightFeedback
            isVisible={showIncorrectFeedback}
            currentExercise={currentExercise}
            selectedItems={selectedItems}
            onGotIt={moveToNextQuestion}
          />
        </div>
      </div>
    </ExerciseContainer>
  );
}