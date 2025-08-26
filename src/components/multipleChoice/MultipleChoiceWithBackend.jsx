import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import Stats from '../Stats';
import Feedback from '../FeedBack';
import FinalResults from '../FinalResults';
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

// Sample data - in real app this would come from props or external source
const SAMPLE_EXERCISES = [
  {
    id: 'mc1',
    question: 'What is the capital of France?',
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 2,
    difficulty: 'easy',
    explanation: 'Paris is the capital and largest city of France.'
  },
  {
    id: 'mc2',
    question: 'Which planet is closest to the Sun?',
    options: ['Venus', 'Mercury', 'Earth', 'Mars'],
    correctAnswer: 1,
    difficulty: 'medium',
    explanation: 'Mercury is the closest planet to the Sun in our solar system.'
  },
  {
    id: 'mc3',
    question: 'What is the largest mammal in the world?',
    options: ['African Elephant', 'Blue Whale', 'Giraffe', 'Polar Bear'],
    correctAnswer: 1,
    difficulty: 'easy',
    explanation: 'The Blue Whale is the largest mammal and the largest animal ever known to have lived on Earth.'
  }
];

export default function MultipleChoice({ 
    enableBackendIntegration = false,
    exerciseConfig = {},
    onExerciseComplete = null,
    exercises = SAMPLE_EXERCISES
}) {
    // Original state
    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
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
        exerciseType: 'multiple-choice',
        ...exerciseConfig
    });

    const aiEngine = useAI({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-choice',
        difficulty: exerciseConfig.difficulty || 'medium'
    });

    const analytics = useAnalytics({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-choice',
        userId: exerciseConfig.userId || 'user_' + Date.now()
    });

    const gamification = useGamification({
        enabled: enableBackendIntegration,
        exerciseType: 'multiple-choice'
    });

    // Enhanced state for backend integration
    const [aiHint, setAiHint] = useState(null);
    const [showHint, setShowHint] = useState(false);
    const [adaptedDifficulty, setAdaptedDifficulty] = useState(null);

    const currentExercise = exercises[currentExerciseIndex];
    const totalExercises = exercises.length;
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
                    exerciseType: 'multiple-choice',
                    totalQuestions: totalExercises,
                    timeLimit: exerciseConfig.timeLimit || null
                });
            }

            // Track exercise start with Analytics
            if (analytics.isReady) {
                await analytics.trackExerciseStart({
                    exerciseType: 'multiple-choice',
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

    const handleOptionSelect = async (index) => {
        setSelectedAnswer(index);

        // Track selection with backend systems
        if (enableBackendIntegration && analytics.isReady) {
            await analytics.trackUserInteraction({
                type: 'option_select',
                optionIndex: index,
                optionText: currentExercise.options[index],
                questionIndex: currentExerciseIndex
            });
        }
    };

    const requestAIHint = async () => {
        if (!enableBackendIntegration || !aiEngine.isReady) return;

        try {
            const hint = await aiEngine.generateIntelligentHint({
                question: currentExercise.question,
                options: currentExercise.options,
                correctAnswer: currentExercise.correctAnswer,
                context: {
                    exerciseType: 'multiple-choice',
                    difficulty: currentExercise.difficulty
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
        setSelectedAnswer(null);
        setShowHint(false);
        setAiHint(null);

        if (currentExerciseIndex + 1 < totalExercises) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);

            // Get AI adaptation for next question
            if (enableBackendIntegration && aiEngine.isReady) {
                const nextQuestion = exercises[nextIndex];
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

                // Process Gamification rewards
                if (gamification.isReady) {
                    const xpData = {
                        baseXP: Math.round(score),
                        performanceBonus: results.correctAnswers * 20,
                        timeBonus: timeElapsed < 180 ? 75 : 0,
                        exerciseType: 'multiple-choice'
                    };

                    const xpResult = await gamification.awardXP(xpData);
                    const achievements = await gamification.checkAchievements({
                        exerciseCompleted: 'multiple-choice',
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
        if (selectedAnswer === null) return;

        const isAllCorrect = selectedAnswer === currentExercise.correctAnswer;
        setIsLastAnswerCorrect(isAllCorrect);

        const questionResult = {
            question: currentExercise.question,
            isCorrect: isAllCorrect,
            userAnswer: currentExercise.options[selectedAnswer],
            correctAnswer: currentExercise.options[currentExercise.correctAnswer],
            exerciseType: 'multiple-choice',
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
                        userAnswer: selectedAnswer,
                        correctAnswer: currentExercise.correctAnswer,
                        isCorrect: isAllCorrect,
                        timeSpent: questionResult.timeSpent,
                        hintsUsed: questionResult.hintsUsed
                    });
                }

                // Track answer with Analytics
                if (analytics.isReady) {
                    await analytics.trackAnswerSubmitted({
                        questionId: currentExercise.id || `q_${currentExerciseIndex}`,
                        questionType: 'multiple-choice',
                        userAnswer: currentExercise.options[selectedAnswer],
                        correctAnswer: currentExercise.options[currentExercise.correctAnswer],
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
            // Show incorrect feedback with explanation
            setShowFeedback(true);
            setTimeout(() => {
                setShowFeedback(false);
                moveToNextQuestion();
            }, 3000);
        }
    };

    if (showFinalResults) {
        return (
            <FinalResults
                results={results}
                exercises={exercises}
                exerciseType="multiple-choice"
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
                    setSelectedAnswer(null);
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

                            <ExerciseGrid exerciseType="multiple-choice">
                                {currentExercise.options.map((option, index) => (
                                    <ExerciseOption
                                        key={index}
                                        selected={selectedAnswer === index}
                                        onClick={() => handleOptionSelect(index)}
                                        className="min-h-[60px] flex items-center px-4 py-3"
                                    >
                                        <div className={`
                                            absolute left-4 flex items-center justify-center
                                            w-6 h-6 rounded-full transition-colors duration-200
                                            ${selectedAnswer === index ? 'bg-primary-600' : 'bg-white border-2 border-primary-400'}
                                        `}>
                                            {selectedAnswer === index && (
                                                <div className="w-3 h-3 bg-white rounded-full"></div>
                                            )}
                                        </div>

                                        <span className="text-lg font-semibold text-neutral-700 ml-10">
                                            {option}
                                        </span>
                                    </ExerciseOption>
                                ))}
                            </ExerciseGrid>

                            <div className="flex justify-center mt-6">
                                <ExerciseButton
                                    variant="primary"
                                    size="large"
                                    onClick={checkAnswer}
                                    disabled={selectedAnswer === null}
                                    className="w-full sm:w-auto mx-2 sm:mx-0"
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
                        isCorrect={isLastAnswerCorrect}
                        questionNumber={currentExerciseIndex + 1}
                        explanation={!isLastAnswerCorrect ? currentExercise.explanation : null}
                    />
                </div>
            </div>
        </ExerciseContainer>
    );
}
