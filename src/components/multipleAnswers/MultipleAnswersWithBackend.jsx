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

// Backend Integration Imports
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';

export default function MultipleAnswers({ 
    enableBackendIntegration = false,
    exerciseConfig = {},
    onExerciseComplete = null
}) {
    // Original state
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

    // Backend Integration Hooks
    const quizEngine = useQuizEngine({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-answers',
        ...exerciseConfig
    });

    const aiEngine = useAI({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-answers',
        difficulty: exerciseConfig.difficulty || 'medium'
    });

    const analytics = useAnalytics({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-answers',
        userId: exerciseConfig.userId || 'user_' + Date.now()
    });

    const gamification = useGamification({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-answers'
    });

    // Enhanced state for backend integration
    const [aiHint, setAiHint] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [adaptedDifficulty, setAdaptedDifficulty] = useState(null);

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
                    exerciseType: 'multiple-answers',
                    totalQuestions: totalExercises,
                    timeLimit: exerciseConfig.timeLimit || null
                });
            }

            // Track exercise start with Analytics
            if (analytics.isReady) {
                await analytics.trackExerciseStart({
                    exerciseType: 'multiple-answers',
                    totalQuestions: totalExercises,
                    difficulty: exerciseConfig.difficulty || 'medium'
                });
            }

            // Initialize AI for first question
            if (aiEngine.isReady && currentExercise) {
                const adaptedQuestion = await aiEngine.adaptDifficulty({
                    currentQuestion: currentExercise,
                    userPerformance: {
                        correctAnswers: 0,
                        totalAnswers: 0,
                        averageTime: 0
                    }
                });
                setAdaptedDifficulty(adaptedQuestion);
            }
        } catch (error) {
            console.error('Error initializing backend systems:', error);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (!showFinalResults) {
                setTimeElapsed(prev => prev + 1);
                
                // Update QuizEngine timer if backend is enabled
                if (enableBackendIntegration && quizEngine.isReady) {
                    quizEngine.updateTimer(timeElapsed + 1);
                }
            }
        }, 1000);
        return () => clearInterval(timer);
    }, [showFinalResults, enableBackendIntegration, quizEngine.isReady, timeElapsed]);

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
            
            // Track audio interaction
            if (enableBackendIntegration && analytics.isReady) {
                await analytics.trackUserInteraction({
                    type: 'audio_play',
                    word: word,
                    questionIndex: currentExerciseIndex
                });
            }
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

            // Track audio interaction
            if (enableBackendIntegration && analytics.isReady) {
                await analytics.trackUserInteraction({
                    type: 'audio_play_all',
                    questionIndex: currentExerciseIndex
                });
            }
        } catch (error) {
            console.error('Error playing audio:', error);
        } finally {
            setIsPlaying(false);
        }
    };

    const handleOptionSelect = async (index) => {
        setSelectedAnswers(prev => {
            const isSelected = prev.includes(index);
            let newSelection;
            
            if (isSelected) {
                newSelection = prev.filter(i => i !== index);
            } else {
                if (prev.length < currentExercise.requiredSelections) {
                    newSelection = [...prev, index];
                } else {
                    return prev;
                }
            }

            // Track selection with backend systems
            if (enableBackendIntegration && analytics.isReady) {
                analytics.trackUserInteraction({
                    type: 'option_select',
                    optionIndex: index,
                    optionText: currentExercise.options[index].word,
                    isSelected: !isSelected,
                    currentSelections: newSelection,
                    questionIndex: currentExerciseIndex
                });
            }

            return newSelection;
        });
    };

    const requestAIHint = async () => {
        if (!enableBackendIntegration || !aiEngine.isReady) return;

        try {
            const hint = await aiEngine.generateIntelligentHint({
                question: currentExercise.question,
                options: currentExercise.options,
                userSelections: selectedAnswers,
                context: {
                    exerciseType: 'multiple-answers',
                    requiredSelections: currentExercise.requiredSelections
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

    const moveToNextQuestion = async () => {
        setSelectedAnswers([]);
        setShowHint(false);
        setAiHint(null);

        if (currentExerciseIndex + 1 < totalExercises) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);

            // Get AI adaptation for next question
            if (enableBackendIntegration && aiEngine.isReady) {
                const nextQuestion = allExercises[nextIndex];
                const adaptedQuestion = await aiEngine.adaptDifficulty({
                    currentQuestion: nextQuestion,
                    userPerformance: {
                        correctAnswers: results.correctAnswers,
                        totalAnswers: results.questions.length,
                        averageTime: results.times.reduce((a, b) => a + b, 0) / results.times.length || 0
                    }
                });
                setAdaptedDifficulty(adaptedQuestion);
            }
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

                // Get Analytics insights
                if (analytics.isReady) {
                    const insights = await analytics.getInsights();
                    console.log('Analytics Insights:', insights);
                }

                // Process Gamification rewards
                if (gamification.isReady) {
                    const xpData = {
                        baseXP: Math.round(score),
                        performanceBonus: results.correctAnswers * 10,
                        timeBonus: timeElapsed < 300 ? 50 : 0,
                        exerciseType: 'multiple-answers'
                    };

                    const xpResult = await gamification.awardXP(xpData);
                    const achievements = await gamification.checkAchievements({
                        exerciseCompleted: 'multiple-answers',
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

    const checkAnswer = async () => {
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

        const questionResult = {
            question: currentExercise.question,
            isCorrect: isAllCorrect,
            userAnswers: selectedWords,
            correctAnswers: correctWords,
            exerciseType: currentExercise.exerciseType,
            timeSpent: timeElapsed - (results.times.reduce((a, b) => a + b, 0)),
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
                        userAnswer: selectedAnswers,
                        correctAnswer: correctIndices,
                        isCorrect: isAllCorrect,
                        timeSpent: questionResult.timeSpent,
                        hintsUsed: questionResult.hintsUsed
                    });
                }

                // Track answer with Analytics
                if (analytics.isReady) {
                    await analytics.trackAnswerSubmitted({
                        questionId: currentExercise.id || `q_${currentExerciseIndex}`,
                        questionType: 'multiple-answers',
                        userAnswer: selectedWords,
                        correctAnswer: correctWords,
                        isCorrect: isAllCorrect,
                        timeSpent: questionResult.timeSpent,
                        difficulty: currentExercise.difficulty || 'medium',
                        hintsUsed: questionResult.hintsUsed
                    });
                }
            } catch (error) {
                console.error('Error submitting answer to backend systems:', error);
            }
        }

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
                exerciseType={getCurrentExerciseType()}
                enableBackendIntegration={enableBackendIntegration}
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
                    setShowHint(false);
                    setAiHint(null);
                    
                    // Restart backend systems
                    if (enableBackendIntegration) {
                        initializeBackendSystems();
                    }
                }}
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
                                    {adaptedDifficulty && enableBackendIntegration && (
                                        <span className="ml-2 text-sm text-blue-600">
                                            (AI-adapted: {adaptedDifficulty.difficulty})
                                        </span>
                                    )}
                                </ExerciseQuestion>
                                
                                <div className="flex gap-2">
                                    <ExerciseAudioButton 
                                        onPlay={playAllAudio}
                                        isPlaying={isPlaying}
                                        label="Listen to all"
                                    />
                                    
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
