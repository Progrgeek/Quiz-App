import React, { useEffect, useState, useCallback } from 'react';
import { Volume2, Check } from 'lucide-react';
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAI } from '../../hooks/useAI';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useGamification } from '../../hooks/useGamification';
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

export default function EnhancedMultipleAnswers({ 
  exerciseData = null, 
  onComplete = null,
  enableAI = true,
  enableAnalytics = true,
  enableGamification = true
}) {
    // Backend Systems Integration
    const { 
        engine, 
        isReady: isEngineReady,
        currentQuestion,
        progress,
        submitAnswer,
        nextQuestion,
        getScore,
        getTimeElapsed,
        complete: completeExercise,
        reset: resetExercise
    } = useQuizEngine({
        type: 'multiple-answers',
        questions: exerciseData?.questions || allExercises,
        settings: {
            allowIncorrectProgression: true,
            maxHints: 3,
            autoSaveFrequency: 30000
        }
    });

    const ai = useAI({
        enabled: enableAI,
        exerciseType: 'multiple-answers',
        adaptiveDifficulty: true,
        intelligentHints: true
    });

    const analytics = useAnalytics({
        enabled: enableAnalytics,
        trackingLevel: 'detailed'
    });

    const gamification = useGamification({
        enabled: enableGamification,
        exerciseType: 'multiple-answers'
    });

    // Local UI State (preserved from original)
    const [selectedAnswers, setSelectedAnswers] = useState([]);
    const [showFeedback, setShowFeedback] = useState(false);
    const [isLastAnswerCorrect, setIsLastAnswerCorrect] = useState(false);
    const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
    const [showFinalResults, setShowFinalResults] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    // Exercise data (use provided or default)
    const allExercises = exerciseData?.questions || [
        ...exercisesData.soundMatchingExercises.map(ex => ({ ...ex, exerciseType: 'sound_matching' })),
        ...exercisesData.synonymExercises.map(ex => ({ ...ex, exerciseType: 'synonym' }))
    ];

    // Get current exercise from QuizEngine or fallback
    const currentExercise = currentQuestion || allExercises[progress?.current - 1] || allExercises[0];
    const totalExercises = allExercises.length;

    // Initialize exercise when engine is ready
    useEffect(() => {
        if (isEngineReady && !currentQuestion) {
            engine.loadExercise({
                type: 'multiple-answers',
                questions: allExercises
            });
            
            // Track exercise start
            if (analytics.isReady) {
                analytics.trackExerciseStart({
                    id: `multiple-answers-${Date.now()}`,
                    type: 'multiple-answers',
                    difficulty: 'medium',
                    questionCount: allExercises.length
                });
            }
        }
    }, [isEngineReady, allExercises]);

    // Track question views
    useEffect(() => {
        if (currentExercise && analytics.isReady) {
            analytics.trackQuestionViewed({
                id: currentExercise.id || `question-${progress?.current}`,
                type: 'multiple-answers',
                difficulty: currentExercise.difficulty || 'medium'
            });
        }
    }, [currentExercise, analytics.isReady]);

    // AI Adaptive Difficulty
    useEffect(() => {
        if (ai.isReady && currentExercise) {
            const adaptedDifficulty = ai.adaptDifficulty(currentExercise, {
                recentPerformance: progress?.accuracy || 0.7
            });
            console.log('AI adapted difficulty:', adaptedDifficulty);
        }
    }, [currentExercise, ai.isReady]);

    const getCurrentExerciseType = () => {
        if (currentExercise) {
            return currentExercise.exerciseType || currentExercise.type || 'multiple';
        }
        return 'multiple';
    };

    // Enhanced Audio Functions (preserved from original)
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
            
            // Track interaction
            if (analytics.isReady) {
                analytics.trackUserInteraction({
                    type: 'audio_play',
                    target: 'word',
                    value: word,
                    component: 'multiple-answers'
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
            
            // Track interaction
            if (analytics.isReady) {
                analytics.trackUserInteraction({
                    type: 'audio_play',
                    target: 'all_options',
                    component: 'multiple-answers'
                });
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

        // Track selection
        if (analytics.isReady) {
            analytics.trackUserInteraction({
                type: 'option_select',
                target: 'option',
                value: index,
                component: 'multiple-answers'
            });
        }
    };

    const moveToNextQuestion = () => {
        setSelectedAnswers([]);
        
        if (progress?.current < totalExercises) {
            nextQuestion();
        } else {
            handleExerciseComplete();
        }
    };

    const handleExerciseComplete = async () => {
        const completionData = await completeExercise();
        
        // Track completion
        if (analytics.isReady) {
            analytics.trackExerciseCompleted({
                exerciseId: `multiple-answers-${Date.now()}`,
                totalDuration: getTimeElapsed(),
                finalScore: getScore().current,
                questionsCorrect: completionData.score?.correct || 0,
                questionsTotal: totalExercises,
                completion: 100
            });
        }

        // Award gamification points
        if (gamification.isReady) {
            await gamification.awardXP({
                amount: completionData.score?.total || 0,
                reason: 'exercise_completion',
                exerciseType: 'multiple-answers'
            });

            // Check for achievements
            await gamification.checkAchievements({
                exerciseCompleted: true,
                exerciseType: 'multiple-answers',
                score: completionData.score?.total || 0,
                accuracy: (completionData.score?.correct / totalExercises) * 100
            });
        }

        setShowFinalResults(true);
        
        if (onComplete) {
            onComplete(completionData);
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

        // Submit answer to QuizEngine
        const result = await submitAnswer({
            selectedIndices: selectedAnswers,
            selectedWords,
            isCorrect: isAllCorrect
        });

        setIsLastAnswerCorrect(isAllCorrect);

        // Track answer submission
        if (analytics.isReady) {
            analytics.trackAnswerSubmitted({
                questionId: currentExercise.id || `question-${progress?.current}`,
                answer: selectedWords,
                isCorrect: isAllCorrect,
                timeToAnswer: result.timeToAnswer || 0,
                hintsUsed: 0, // TODO: integrate with hint system
                attemptsCount: 1
            });
        }

        if (isAllCorrect) {
            setShowFeedback(true);
            
            // Award immediate gamification feedback
            if (gamification.isReady) {
                gamification.showCelebration({
                    type: 'correct_answer',
                    points: result.scoreData?.points || 0
                });
            }
            
            setTimeout(() => {
                setShowFeedback(false);
                moveToNextQuestion();
            }, 2000);
        } else {
            setShowIncorrectFeedback(true);
            
            // Get AI hint for incorrect answer
            if (ai.isReady) {
                const hint = ai.generateIntelligentHint({
                    question: currentExercise,
                    userAnswer: selectedWords,
                    correctAnswer: correctWords,
                    attemptsCount: 1
                });
                console.log('AI Generated Hint:', hint);
            }
        }
    };

    const handleGotIt = () => {
        setShowIncorrectFeedback(false);
        moveToNextQuestion();
    };

    const handleRestart = () => {
        resetExercise();
        setSelectedAnswers([]);
        setShowFinalResults(false);
    };

    // Get enhanced results with backend data
    const getEnhancedResults = () => {
        const engineScore = getScore();
        return {
            questions: engine?.getAllAnswers() || [],
            times: [getTimeElapsed()],
            correctAnswers: engineScore.current,
            wrongAnswers: totalExercises - engineScore.current,
            finalScore: engineScore.percentage,
            // Enhanced data from backend systems
            aiInsights: ai.isReady ? ai.getUserInsights() : null,
            analyticsData: analytics.isReady ? analytics.getInsights() : null,
            gamificationData: gamification.isReady ? gamification.getUserStats() : null
        };
    };

    const renderOption = (option, index) => {
        const isSelected = selectedAnswers.includes(index);

        if (getCurrentExerciseType() === 'sound_matching') {
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

    // Show loading state while engine initializes
    if (!isEngineReady || !currentExercise) {
        return (
            <ExerciseContainer layout="standard">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading exercise...</p>
                    </div>
                </div>
            </ExerciseContainer>
        );
    }

   if (showFinalResults) {
        return (
            <FinalResults
                results={getEnhancedResults()}
                exercises={allExercises}
                exerciseType={getCurrentExerciseType()}
                onRestart={handleRestart}
                // Enhanced features
                showAIInsights={ai.isReady}
                showAnalytics={analytics.isReady}
                showGamification={gamification.isReady}
            />
        );
    }

    return (
        <ExerciseContainer layout="standard" withExample={true}>
            <div className="max-w-[1000px] mx-auto">
                <div className="min-h-[60vh] sm:min-h-[75vh] relative overflow-hidden">
                    <div className="block sm:hidden mb-4">
                        <Stats
                            questionNumber={progress?.current || 1}
                            totalQuestions={totalExercises}
                            timeElapsed={getTimeElapsed()}
                            score={getScore().current}
                            // Enhanced stats
                            accuracy={progress?.accuracy}
                            streak={gamification.isReady ? gamification.getCurrentStreak() : 0}
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
                                questionNumber={progress?.current || 1}
                                totalQuestions={totalExercises}
                                timeElapsed={getTimeElapsed()}
                                score={getScore().current}
                                // Enhanced stats
                                accuracy={progress?.accuracy}
                                streak={gamification.isReady ? gamification.getCurrentStreak() : 0}
                            />
                        </div>
                    </div>

                    <Feedback
                        isVisible={showFeedback}
                        isCorrect={isLastAnswerCorrect}
                        questionNumber={progress?.current || 1}
                    />
                    <IncorrectMultipleAnswersFeedback
                        isVisible={showIncorrectFeedback}
                        currentExercise={currentExercise}
                        selectedAnswers={selectedAnswers}
                        onGotIt={handleGotIt}
                        // Enhanced with AI hints
                        aiHint={ai.isReady ? ai.getLastHint() : null}
                        showHint={ai.isReady}
                    />
                </div>
            </div>
        </ExerciseContainer>
    );
}
