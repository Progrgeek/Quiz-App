import { useState, useEffect } from 'react';
import { Volume2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Design System Components
import { Button, Card, Badge } from '../ui';

// Existing Components (will be updated gradually)
import Stats from '../Stats';
import Feedback from '../FeedBack';
import IncorrectMultipleAnswersFeedback from './IncorrectMultipleAnswersFeedback';
import FinalResults from '../FinalResults';

// Content and Data
import { useContent } from '../../hooks/useContent';
import exercisesData from './multipleAnswersExercises.json';

export default function MultipleAnswersEnhanced() {
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

    // Content hook for internationalization
    const { getContent } = useContent();

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

    // Timer effect
    useEffect(() => {
        const timer = setInterval(() => {
            if (!showFinalResults) {
                setTimeElapsed(prev => prev + 1);
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [showFinalResults]);

    // Audio functions
    const playWordAudio = async (word) => {
        try {
            setIsPlaying(true);
            const utterance = new SpeechSynthesisUtterance(word);
            utterance.rate = 0.8;
            utterance.volume = 0.8;
            speechSynthesis.speak(utterance);
            
            utterance.onend = () => setIsPlaying(false);
            utterance.onerror = () => setIsPlaying(false);
        } catch (error) {
            console.error('Audio playback failed:', error);
            setIsPlaying(false);
        }
    };

    const playAllAudio = async () => {
        if (isPlaying) return;
        
        setIsPlaying(true);
        const words = currentExercise.options.map(option => option.word || option);
        
        for (const word of words) {
            await new Promise(resolve => {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.rate = 0.8;
                utterance.volume = 0.8;
                utterance.onend = resolve;
                speechSynthesis.speak(utterance);
            });
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        setIsPlaying(false);
    };

    // Exercise logic
    const handleOptionSelect = (index) => {
        setSelectedAnswers(prev => {
            if (prev.includes(index)) {
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
        if (currentExerciseIndex < totalExercises - 1) {
            setCurrentExerciseIndex(prev => prev + 1);
            setSelectedAnswers([]);
            setTimeElapsed(0);
        } else {
            setShowFinalResults(true);
        }
    };

    const checkAnswer = () => {
        const isAllCorrect = selectedAnswers.every(index => 
            currentExercise.correctAnswers.includes(index)
        ) && selectedAnswers.length === currentExercise.requiredSelections;

        setIsLastAnswerCorrect(isAllCorrect);

        const selectedWords = selectedAnswers.map(index => 
            currentExercise.options[index].word || currentExercise.options[index]
        );
        const correctWords = currentExercise.correctAnswers.map(index => 
            currentExercise.options[index].word || currentExercise.options[index]
        );

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

    // Enhanced option rendering with design system
    const renderOption = (option, index) => {
        const isSelected = selectedAnswers.includes(index);

        if (currentExercise.exerciseType === 'sound_matching') {
            return (
                <Card
                    variant="elevated"
                    exerciseType="multipleAnswers"
                    className={`
                        cursor-pointer transition-all duration-200 overflow-hidden
                        ${isSelected ? 'ring-4 ring-primary-500 scale-[1.02]' : 'hover:ring-2 hover:ring-primary-300'}
                    `}
                    onClick={() => handleOptionSelect(index)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <div className="aspect-square w-full h-32 sm:h-40 lg:h-48 relative">
                        <img
                            src={option.image}
                            alt={option.word}
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {isSelected && (
                            <motion.div
                                className="absolute inset-0 bg-primary-500/20 flex items-center justify-center"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="bg-primary-500 text-white rounded-full p-2">
                                    <Check className="w-6 h-6" />
                                </div>
                            </motion.div>
                        )}
                    </div>
                    
                    <Card.Footer className="p-3 bg-white border-t flex items-center justify-between">
                        <span className="text-gray-700 font-medium">{option.word}</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                                e.stopPropagation();
                                playWordAudio(option.word);
                            }}
                            icon={<Volume2 className="w-4 h-4" />}
                            className="text-primary-500 hover:text-primary-600"
                        />
                    </Card.Footer>
                </Card>
            );
        }

        return (
            <Card
                variant="bordered"
                exerciseType="multipleAnswers"
                className={`
                    cursor-pointer transition-all duration-200 min-h-[60px]
                    ${isSelected ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'hover:bg-primary-25 hover:border-primary-300'}
                `}
                onClick={() => handleOptionSelect(index)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <Card.Content className="flex items-center justify-between p-4">
                    <span className={`font-medium ${isSelected ? 'text-primary-700' : 'text-gray-700'}`}>
                        {option.word || option}
                    </span>
                    
                    <AnimatePresence>
                        {isSelected && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="bg-primary-500 text-white rounded-full p-1"
                            >
                                <Check className="w-4 h-4" />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </Card.Content>
            </Card>
        );
    };

    // Show final results
    if (showFinalResults) {
        return (
            <FinalResults
                results={results}
                onRestart={() => {
                    setCurrentExerciseIndex(0);
                    setScore(0);
                    setTimeElapsed(0);
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
        <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen pt-3 sm:pt-5 px-2 sm:px-4">
            <div className="relative max-w-[1400px] mx-auto">
                <div className="flex-1 w-full">
                    <div className="max-w-[1000px] mx-auto">
                        <Card variant="elevated" className="min-h-[60vh] sm:min-h-[75vh] relative overflow-hidden">
                            {/* Mobile Stats */}
                            <div className="block sm:hidden p-4 border-b border-gray-200">
                                <Stats
                                    questionNumber={currentExerciseIndex + 1}
                                    totalQuestions={totalExercises}
                                    timeElapsed={timeElapsed}
                                    score={score}
                                />
                            </div>

                            <Card.Content className="p-4 sm:p-8">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-6">
                                    <div className="flex flex-col flex-1 w-full">
                                        {/* Header */}
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                                            <div className="flex items-center gap-3">
                                                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                                                    {currentExercise.question}
                                                </h1>
                                                <Badge variant="primary" className="shrink-0">
                                                    {getContent('exercises', 'multipleAnswers', 'instruction')}
                                                </Badge>
                                            </div>
                                            
                                            <Button
                                                variant="outline"
                                                onClick={playAllAudio}
                                                disabled={isPlaying}
                                                icon={<Volume2 className="w-5 h-5" />}
                                                loading={isPlaying}
                                                className="shrink-0"
                                            >
                                                {getContent('exercises', 'common', 'listenToAll') || 'Listen to all'}
                                            </Button>
                                        </div>

                                        {/* Options Grid */}
                                        <motion.div 
                                            className={`
                                                grid gap-4 mb-8
                                                ${currentExercise.exerciseType === 'sound_matching' 
                                                    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3' 
                                                    : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}
                                            `}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.5, staggerChildren: 0.1 }}
                                        >
                                            {currentExercise.options.map((option, index) => (
                                                <motion.div 
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: index * 0.1 }}
                                                >
                                                    {renderOption(option, index)}
                                                </motion.div>
                                            ))}
                                        </motion.div>

                                        {/* Submit Button */}
                                        <div className="flex justify-center">
                                            <Button
                                                variant="primary"
                                                size="lg"
                                                onClick={checkAnswer}
                                                disabled={selectedAnswers.length !== currentExercise.requiredSelections}
                                                className="w-full sm:w-auto"
                                            >
                                                {getContent('exercises', 'common', 'checkAnswer')} 
                                                ({selectedAnswers.length}/{currentExercise.requiredSelections} selected)
                                            </Button>
                                        </div>
                                    </div>

                                    {/* Desktop Stats */}
                                    <div className="hidden sm:block">
                                        <Card variant="bordered" className="p-4">
                                            <Stats
                                                questionNumber={currentExerciseIndex + 1}
                                                totalQuestions={totalExercises}
                                                timeElapsed={timeElapsed}
                                                score={score}
                                            />
                                        </Card>
                                    </div>
                                </div>
                            </Card.Content>
                        </Card>

                        {/* Feedback Components */}
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
            </div>
        </div>
    );
}
