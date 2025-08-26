import { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import IncorrectMultipleAnswersFeedback from './IncorrectMultipleAnswersFeedback';
import FinalResults from '../FinalResults';
import exercisesData from './multipleAnswersExercises.json';
import { 
    ExerciseContainer, 
    ExerciseQuestion, 
    ExerciseOption, 
    ExerciseGrid, 
    ExerciseButton, 
    ExerciseAudioButton 
} from '../../design-system/ExerciseComponents';

export default function MultipleAnswers() {
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
    const [showFinalResults, setShowFinalResults] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [results, setResults] = useState({
        questions: [],
        times: [],
        correctAnswers: 0,
        wrongAnswers: 0,
        finalScore: 0,
    });

    const allExercises = [
        ...exercisesData.soundMatchingExercises.map(ex => ({ ...ex, exerciseType: 'sound_matching' })),
        ...exercisesData.synonymExercises.map(ex => ({ ...ex, exerciseType: 'synonym' }))
    ];
      
    const currentExercise = allExercises[currentExerciseIndex];
    const totalExercises = allExercises.length;
    const pointsPerQuestion = 100 / totalExercises;

    const getCurrentExerciseType = () => {
        if (currentExercise) {
            return currentExercise.exerciseType || currentExercise.type || 'multiple';
        }
        return 'multiple';
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (!showFinalResults) {
                setTimeElapsed(prev => prev + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [showFinalResults]);

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
        
        try {
            await speak(word, { rate: 0.8, pitch: 1 });
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    const playAllAudio = async () => {
        if (isPlaying) return;
        setIsPlaying(true);
      
        try {
            for (const option of currentExercise.options) {
                await speak(option.word, { rate: 0.8, pitch: 1 });
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    const handleOptionSelect = (index) => {
        setSelectedAnswers(prev => {
            const isSelected = prev.includes(index);
            if (isSelected) {
                return prev.filter(i => i !== index);
            } else {
                if (prev.length < currentExercise.requiredSelections) {
                    return [...prev, index];
                }
                return prev;
            }
        });
    };

    const moveToNextQuestion = () => {
        setSelectedAnswers([]);
        if (currentExerciseIndex + 1 < totalExercises) {
            setCurrentExerciseIndex(prev => prev + 1);
        } else {
            setShowFinalResults(true);
        }
    };

    const checkAnswer = () => {
        if (selectedAnswers.length !== currentExercise.requiredSelections) return;

        const correctIndices = currentExercise.options
            .map((option, index) => option.isCorrect ? index : null)
            .filter(index => index !== null);

        const isAllCorrect = selectedAnswers.every(index => 
            correctIndices.includes(index)) && 
            selectedAnswers.length === correctIndices.length;

        const selectedWords = selectedAnswers.map(index => currentExercise.options[index].word);
        const correctWords = correctIndices.map(index => currentExercise.options[index].word);

        setIsLastAnswerCorrect(isAllCorrect);

        const newResults = {
            ...results,
            questions: [
                ...results.questions,
                {
                    question: currentExercise.question,
                    isCorrect: isAllCorrect,
                    userAnswers: selectedWords,
                    correctAnswers: correctWords,
                    exerciseType: currentExercise.exerciseType,
                },
            ],
            times: [...results.times, timeElapsed],
            correctAnswers: results.correctAnswers + (isAllCorrect ? 1 : 0),
            wrongAnswers: results.wrongAnswers + (isAllCorrect ? 0 : 1),
            finalScore: isAllCorrect ? score + pointsPerQuestion : score,
        };

        setResults(newResults);

        if (isAllCorrect) {
            setShowFeedback(true);
            setScore(prev => prev + pointsPerQuestion);
            setTimeout(() => {
                setShowFeedback(false);
                moveToNextQuestion();
            }, 2000);
        } else {
            setShowIncorrectFeedback(true);
        }
    };

    const handleGotIt = () => {
        setShowIncorrectFeedback(false);
        moveToNextQuestion();
    };

    const renderOption = (option, index) => {
        const isSelected = selectedAnswers.includes(index);

        if (currentExercise.exerciseType === 'sound_matching') {
            return (
                <ExerciseOption
                    selected={isSelected}
                    onClick={() => handleOptionSelect(index)}
                    className="h-full"
                >
                    <div className="aspect-square w-full h-32 sm:h-40 lg:h-48 relative">
                        <img
                            src={option.image}
                            alt={option.word}
                            className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                        />
                    </div>
                    <div className="p-2 bg-white border-t flex items-center justify-between rounded-b-lg">
                        <ExerciseAudioButton
                            onPlay={(e) => {
                                e.stopPropagation();
                                playWordAudio(option.word);
                            }}
                            isPlaying={false}
                            label={`Play ${option.word}`}
                            size="small"
                            asButton={false}
                        />
                    </div>
                </ExerciseOption>
            );
        }

        return (
            <ExerciseOption
                selected={isSelected}
                onClick={() => handleOptionSelect(index)}
                className="min-h-[60px] flex items-center px-4 py-3"
            >
                <div className={`
                    absolute left-4 flex items-center justify-center
                    w-6 h-6 rounded-full transition-colors duration-200
                    ${isSelected ? 'bg-primary-600' : 'bg-white border-2 border-primary-400'}
                `}>
                    <Check 
                        className={`w-4 h-4 ${isSelected ? 'text-white ' : 'text-transparent'}`}
                    />
                </div>

                <span className="text-lg font-semibold text-neutral-700 ml-10">
                    {option.word}
                </span>

                <ExerciseAudioButton
                    onPlay={(e) => {
                        e.stopPropagation();
                        playWordAudio(option.word);
                    }}
                    isPlaying={false}
                    label={`Play ${option.word}`}
                    className="absolute right-4"
                    size="small"
                />
            </ExerciseOption>
        );
    };

   if (showFinalResults) {
        return (
            <FinalResults
                results={results}
                exercises={allExercises}
                exerciseType={getCurrentExerciseType()} // Add this line
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
                    setSelectedAnswers([]);
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

                    <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:mx-5 sm:mt-10">
                        <div className="flex flex-col flex-1 w-full">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                                <ExerciseQuestion variant="primary" level={1}>
                                    {currentExercise.question}
                                </ExerciseQuestion>
                                <ExerciseAudioButton 
                                    onPlay={playAllAudio}
                                    isPlaying={isPlaying}
                                    label="Listen to all"
                                />
                            </div>

                            <ExerciseGrid exerciseType="multiple-answers">
                                {currentExercise.options.map((option, index) => (
                                    <div key={index} className="relative">
                                        {renderOption(option, index)}
                                    </div>
                                ))}
                            </ExerciseGrid>

                            <div className="flex justify-center">
                                <ExerciseButton
                                    variant="primary"
                                    size="large"
                                    onClick={checkAnswer}
                                    disabled={selectedAnswers.length !== currentExercise.requiredSelections}
                                    className="w-full sm:w-auto mx-2 sm:mx-0"
                                >
                                    Check Answer ({selectedAnswers.length}/{currentExercise.requiredSelections} selected)
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
                        isCorrect={isLastAnswerCorrect}
                        questionNumber={currentExerciseIndex + 1}
                    />
                    <IncorrectMultipleAnswersFeedback
                        isVisible={showIncorrectFeedback}
                        currentExercise={currentExercise}
                        selectedAnswers={selectedAnswers}
                        onGotIt={handleGotIt}
                    />
                </div>
            </div>
        </ExerciseContainer>
    );
}