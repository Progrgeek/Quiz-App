/**
 * Universal Exercise Component
 * Renders any exercise type with preserved exact functionality and UI
 * 
 * This component:
 * 1. Transforms legacy data using adapters
 * 2. Renders exercise with identical UI to original components
 * 3. Handles all interaction patterns (drag/drop, text input, selection, etc.)
 * 4. Preserves exact timing, scoring, and feedback behavior
 * 5. Integrates seamlessly with existing Stats, Feedback, and FinalResults
 */

import React, { useState, useEffect, useRef, createRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Volume2, Check, Play, Pause } from 'lucide-react';

// Import adapters
import { UniversalExerciseAdapter } from '../adapters/ExerciseAdapter.js';
import { ExtendedExerciseAdapters } from '../adapters/ExtendedExerciseAdapters.js';
import { UniversalExerciseSchema } from '../schemas/UniversalExerciseSchema.js';

// Import existing UI components to preserve exact styling
import Stats from '../../Stats';
import Feedback from '../../FeedBack';
import FinalResults from '../../FinalResults';

// Import drag and drop components
import DraggableItem from '../../dragAndDrop/DraggableItem';
import DroppableZone from '../../dragAndDrop/DroppableZone';

// Import feedback components
import IncorrectMultipleAnswersFeedback from '../../multipleAnswers/IncorrectMultipleAnswersFeedback';
import IncorrectFillFeedback from '../../fillInTheBlanks/IncorrectFillFeedback';
import IncorrectGapFillFeedback from '../../gapFill/IncorrectGapFillFeedback';
import IncorrectHighlightFeedback from '../../highlight/IncorrectHighlightFeedback';

// Import exercise renderers
import { DragAndDropRenderer } from './exercise-types/DragAndDropRenderer';
import { FillInBlanksRenderer } from './exercise-types/FillInBlanksRenderer';
import { GapFillRenderer } from './exercise-types/GapFillRenderer';
import { HighlightRenderer } from './exercise-types/HighlightRenderer';
import { SequencingRenderer } from './exercise-types/SequencingRenderer';
import MultipleChoiceRenderer from './exercise-types/MultipleChoiceRenderer';
import ClickToChangeRenderer from './exercise-types/ClickToChangeRenderer';
import SyllableCountingRenderer from './exercise-types/SyllableCountingRenderer';
import TableExerciseRenderer from './exercise-types/TableExerciseRenderer';
import RhymeExerciseRenderer from './exercise-types/RhymeExerciseRenderer';
import SingleAnswerRenderer from './exercise-types/SingleAnswerRenderer';
import MultipleAnswersRenderer from './exercise-types/MultipleAnswersRenderer';

// Fallback transform function for unknown exercise types
const createFallbackTransform = (exerciseData, exerciseType) => {
  return {
    metadata: {
      id: exerciseData.id || `fallback_${Date.now()}`,
      type: 'multipleChoice',
      subtype: exerciseType,
      title: exerciseData.question || 'Exercise',
      question: exerciseData.question,
      difficulty: 'medium',
      estimatedTime: 60,
      tags: ['fallback'],
      version: '1.0',
      language: 'en',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    content: {
      text: {
        question: exerciseData.question || 'Please complete this exercise',
        instruction: exerciseData.instruction || 'Select the correct answer',
      },
      elements: {
        options: exerciseData.options || ['Option 1', 'Option 2', 'Option 3'],
      },
      solution: {
        type: 'single',
        correct: exerciseData.correctAnswer || exerciseData.options?.[0] || 'Option 1',
      }
    },
    presentation: {
      styles: {
        container: 'space-y-6',
        question: 'text-xl font-bold mb-4',
      },
    },
    flow: {
      totalQuestions: 1,
    },
    learning: {
      feedback: {
        correct: { message: 'Correct!', delay: 2000 },
        incorrect: { message: 'Try again!', delay: 2000 },
      }
    }
  };
};

export const UniversalExercise = ({ 
  exerciseData, 
  exerciseType,
  preserveOriginalUI = true,
  onComplete,
  onError,
  className = '',
  ...props 
}) => {
  // Transform legacy data to universal schema
  const [universalData, setUniversalData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Exercise state - mirrors original components exactly
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showIncorrectFeedback, setShowIncorrectFeedback] = useState(false);
  const [showFinalResults, setShowFinalResults] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Exercise-specific state
  const [userAnswers, setUserAnswers] = useState({}); // Universal answer storage
  const [selectedAnswers, setSelectedAnswers] = useState([]); // Multiple answers
  const [userAnswer, setUserAnswer] = useState(''); // Single text input
  const [categoryItems, setCategoryItems] = useState({}); // Drag and drop
  const [movedItems, setMovedItems] = useState(new Set()); // Drag and drop tracking
  const [highlightedItems, setHighlightedItems] = useState(new Set()); // Highlight tracking
  const [sequenceItems, setSequenceItems] = useState([]); // Sequencing
  const [fillAnswers, setFillAnswers] = useState({}); // Fill-in-blanks and gap-fill
  const [isAnswered, setIsAnswered] = useState(false); // Exercise completion state
  const [activeId, setActiveId] = useState(null); // Drag and drop active item
  
  // Refs for inputs - preserves focus behavior
  const inputRef = useRef(null);
  const inputRefs = useRef([]);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // Results tracking - matches original exactly
  const [results, setResults] = useState({
    questions: [],
    times: [],
    correctAnswers: 0,
    wrongAnswers: 0,
    finalScore: 0,
  });

  // Drag and drop sensors
  const mouseSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 200,
      tolerance: 5,
    },
  });
  
  const sensors = useSensors(mouseSensor, touchSensor);

  // Initialize exercise data
  useEffect(() => {
    const transformExerciseData = async () => {
      try {
        setLoading(true);
        
        let transformed;
        
        // Route to appropriate transformer
        switch (exerciseType) {
          case 'multipleAnswers':
          case 'multiple-answers':
            transformed = UniversalExerciseAdapter.transformMultipleAnswers(exerciseData);
            break;
            
          case 'multipleChoice':
          case 'multiple-choice':
            transformed = UniversalExerciseAdapter.transformMultipleChoice(exerciseData);
            break;
            
          case 'singleAnswer':
          case 'single-answer':
            transformed = ExtendedExerciseAdapters.transformSingleAnswer?.(exerciseData);
            break;
            
          case 'clickToChange':
          case 'click-to-change':
            transformed = ExtendedExerciseAdapters.transformClickToChange?.(exerciseData);
            break;
            
          case 'syllableCounting':
          case 'syllable-counting':
            transformed = ExtendedExerciseAdapters.transformSyllableCounting?.(exerciseData);
            break;
            
          case 'tableExercise':
          case 'table-exercise':
            transformed = ExtendedExerciseAdapters.transformTableExercise?.(exerciseData);
            break;
            
          case 'rhymeExercise':
          case 'rhyme-exercise':
            transformed = ExtendedExerciseAdapters.transformRhymeExercise?.(exerciseData);
            break;
            
          case 'dragAndDrop':
          case 'drag-and-drop':
            transformed = UniversalExerciseAdapter.transformDragAndDrop(exerciseData);
            break;
            
          case 'fillInTheBlanks':
          case 'fill-in-blanks':
            transformed = UniversalExerciseAdapter.transformFillInTheBlanks(exerciseData);
            break;
            
          case 'gapFill':
          case 'gap-fill':
            transformed = UniversalExerciseAdapter.transformGapFill(exerciseData);
            break;
            
          case 'highlight':
            transformed = ExtendedExerciseAdapters.transformHighlight(exerciseData);
            break;
            
          case 'sequencing':
            transformed = ExtendedExerciseAdapters.transformSequencing(exerciseData);
            break;
            
          default:
            // Create a fallback transform for unknown types
            transformed = createFallbackTransform(exerciseData, exerciseType);
            console.warn(`Using fallback transform for unsupported exercise type: ${exerciseType}`);
        }
        
        setUniversalData(transformed);
        
        // Initialize exercise-specific state
        initializeExerciseState(transformed, exerciseType);
        
      } catch (error) {
        console.error('Failed to transform exercise data:', error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    };

    if (exerciseData) {
      transformExerciseData();
    }
  }, [exerciseData, exerciseType]);

  // Initialize exercise-specific state
  const initializeExerciseState = (transformedData, type) => {
    switch (type) {
      case 'dragAndDrop':
      case 'drag-and-drop':
        const initialCategories = {};
        transformedData.content.elements.dropZones.forEach((zone) => {
          initialCategories[zone.id] = [];
        });
        setCategoryItems(initialCategories);
        setMovedItems(new Set());
        break;
        
      case 'sequencing':
        setSequenceItems(transformedData.content.elements.sequence || []);
        break;
        
      case 'gapFill':
      case 'gap-fill':
        const blankCount = transformedData.content.elements.blanks.length;
        inputRefs.current = Array(blankCount).fill().map(() => createRef());
        setUserAnswers(new Array(blankCount).fill(''));
        setIsInitialized(true);
        break;
        
      case 'fillInTheBlanks':
      case 'fill-in-blanks':
        setIsInitialized(true);
        break;
        
      default:
        setIsInitialized(true);
    }
  };

  // Timer logic - exactly like original components
  useEffect(() => {
    if (!universalData?.presentation?.showTimer || showFinalResults) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [universalData, showFinalResults]);

  // Focus management for inputs - preserves original behavior
  useEffect(() => {
    if (exerciseType === 'gapFill' || exerciseType === 'gap-fill') {
      const focusTimeout = setTimeout(() => {
        if (inputRefs.current[0]?.current && isInitialized) {
          inputRefs.current[0].current.focus();
        }
      }, 100);
      return () => clearTimeout(focusTimeout);
    }
    
    if ((exerciseType === 'fillInTheBlanks' || exerciseType === 'fill-in-blanks') && inputRef.current) {
      if (!showFinalResults && !showFeedback && !showIncorrectFeedback) {
        inputRef.current.focus();
      }
    }
  }, [currentExerciseIndex, showFeedback, showIncorrectFeedback, showFinalResults, isInitialized, exerciseType]);

  // Audio/Speech synthesis - preserves original functionality
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

  const playAudio = async (text) => {
    if (isPlaying) return;
    setIsPlaying(true);
    
    try {
      await speak(text, { rate: 0.8, pitch: 1 });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlaying(false);
    }
  };

  // Generic answer change handler for all exercise types
  const handleAnswerChange = (answerData) => {
    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      ...answerData
    }));
  };

  // Fallback transform for unknown exercise types
  const createFallbackTransform = (exerciseData, exerciseType) => {
    const baseSchema = UniversalExerciseSchema.createBaseStructure();
    
    return {
      ...baseSchema,
      metadata: {
        ...baseSchema.metadata,
        id: exerciseData.id || `fallback_${Date.now()}`,
        type: exerciseType,
        title: exerciseData.question || exerciseData.title || 'Exercise',
        difficulty: exerciseData.difficulty || 3,
        estimatedTime: exerciseData.estimatedTime || 60
      },
      content: {
        ...baseSchema.content,
        text: {
          question: exerciseData.question || 'Complete this exercise',
          instruction: exerciseData.instruction || 'Follow the exercise instructions'
        },
        elements: {
          options: exerciseData.options || [],
          rawData: exerciseData // Preserve original data for custom renderers
        },
        solution: {
          type: 'custom',
          rawSolution: exerciseData.solution || exerciseData.correctAnswer
        }
      }
    };
  };

  // Answer submission logic - universal handler
  const handleAnswerSubmit = async (answer) => {
    if (!universalData) return;
    
    const isAnswerCorrect = validateAnswer(answer, universalData.content.solution);
    setIsCorrect(isAnswerCorrect);
    
    const pointsPerQuestion = 100 / (universalData.flow.totalQuestions || 1);
    
    // Update results - matches original format exactly
    const newResults = {
      ...results,
      questions: [
        ...results.questions,
        {
          question: universalData.content.text.question,
          isCorrect: isAnswerCorrect,
          userAnswers: Array.isArray(answer) ? answer : [answer],
          correctAnswers: getCorrectAnswersForDisplay(),
          exerciseType: universalData.metadata.subtype || universalData.metadata.type,
        },
      ],
      times: [...results.times, timeElapsed],
      correctAnswers: results.correctAnswers + (isAnswerCorrect ? 1 : 0),
      wrongAnswers: results.wrongAnswers + (isAnswerCorrect ? 0 : 1),
      finalScore: isAnswerCorrect ? score + pointsPerQuestion : score,
    };

    setResults(newResults);

    if (isAnswerCorrect) {
      setShowFeedback(true);
      setScore(prev => prev + pointsPerQuestion);
      
      // Auto-advance after delay
      setTimeout(() => {
        setShowFeedback(false);
        if (currentExerciseIndex + 1 < (universalData.flow.totalQuestions || 1)) {
          moveToNextQuestion();
        } else {
          completeExercise(newResults);
        }
      }, universalData.learning.feedback.correct.delay || 2000);
    } else {
      setShowIncorrectFeedback(true);
    }
  };

  // Answer validation - universal logic
  const validateAnswer = (answer, solution) => {
    switch (solution.type) {
      case 'single':
        return solution.correctOptions.includes(answer);
        
      case 'multiple':
        if (!Array.isArray(answer)) return false;
        return answer.length === solution.requiredSelections &&
               answer.every(a => solution.correctOptions.includes(a));
               
      case 'text':
        const userText = answer.toLowerCase().trim();
        return solution.correctAnswers.some(correct => 
          correct.toLowerCase().trim() === userText
        );
        
      case 'position':
        return JSON.stringify(answer) === JSON.stringify(solution.correctPositions);
        
      case 'sequence':
        return JSON.stringify(answer) === JSON.stringify(solution.correctSequence);
        
      case 'highlight':
        if (!Array.isArray(answer)) return false;
        return answer.length === solution.correctTargets.length &&
               answer.every(target => solution.correctTargets.includes(target));
               
      default:
        return false;
    }
  };

  const getCorrectAnswersForDisplay = () => {
    if (!universalData) return [];
    
    const solution = universalData.content.solution;
    
    switch (solution.type) {
      case 'single':
      case 'multiple':
        return universalData.content.elements.options
          .filter(opt => solution.correctOptions.includes(opt.id))
          .map(opt => opt.content);
          
      case 'text':
        return solution.correctAnswers;
        
      case 'position':
        return Object.values(solution.correctPositions).flat();
        
      case 'sequence':
        return universalData.content.elements.sequence
          .sort((a, b) => a.correctOrder - b.correctOrder)
          .map(item => item.content);
          
      case 'highlight':
        return universalData.content.elements.targets
          .filter(target => solution.correctTargets.includes(target.id))
          .map(target => target.content);
          
      default:
        return [];
    }
  };

  const moveToNextQuestion = () => {
    // Reset state for next question
    setSelectedAnswers([]);
    setUserAnswer('');
    setHighlightedItems(new Set());
    
    if (currentExerciseIndex + 1 < (universalData?.flow.totalQuestions || 1)) {
      setCurrentExerciseIndex(prev => prev + 1);
    } else {
      setShowFinalResults(true);
    }
  };

  const completeExercise = (finalResults) => {
    setResults(finalResults);
    setShowFinalResults(true);
    onComplete?.(finalResults);
  };

  const handleGotIt = () => {
    setShowIncorrectFeedback(false);
    moveToNextQuestion();
  };

  const handleRestart = () => {
    setCurrentExerciseIndex(0);
    setTimeElapsed(0);
    setScore(0);
    setShowFinalResults(false);
    setShowFeedback(false);
    setShowIncorrectFeedback(false);
    setResults({
      questions: [],
      times: [],
      correctAnswers: 0,
      wrongAnswers: 0,
      finalScore: 0,
    });
    
    // Reset exercise-specific state
    setSelectedAnswers([]);
    setUserAnswer('');
    setCategoryItems({});
    setMovedItems(new Set());
    setHighlightedItems(new Set());
    setSequenceItems([]);
    
    // Reinitialize if needed
    if (universalData) {
      initializeExerciseState(universalData, exerciseType);
    }
  };

  // Loading state
  if (loading || !universalData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-lg text-neutral-600">Loading exercise...</p>
        </div>
      </div>
    );
  }

  // Show final results
  if (showFinalResults) {
    return (
      <FinalResults
        results={results}
        exercises={[exerciseData]} // Pass original exercise data
        exerciseType={universalData.metadata.subtype || universalData.metadata.type}
        onRestart={handleRestart}
      />
    );
  }

  // Calculate totals for Stats component
  const totalExercises = universalData?.flow?.totalQuestions || 1;
  const questionNumber = currentExerciseIndex + 1;

  // Add loading state and null checks
  if (loading || !universalData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">Loading exercise...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`universal-exercise ${universalData?.presentation?.styles?.container || ''} ${className}`}>
      <div className="relative max-w-[1400px] mx-auto">
        <div className="flex-1 w-full">
          <div className="max-w-[1000px] mx-auto">
            <div className="min-h-[60vh] sm:min-h-[75vh] relative overflow-hidden">
              
              {/* Mobile Stats */}
              <div className="block sm:hidden mb-4">
                <Stats
                  questionNumber={questionNumber}
                  totalQuestions={totalExercises}
                  timeElapsed={timeElapsed}
                  score={score}
                />
              </div>

              {/* Main Content Area */}
              <div className="flex flex-col sm:flex-row justify-between items-start mx-2 sm:mx-5 sm:mt-10">
                <div className="flex flex-col flex-1 w-full">
                  
                  {/* Render Exercise Content */}
                  {renderExerciseContent()}
                  
                </div>

                {/* Desktop Stats */}
                <div className="hidden sm:block ml-8">
                  <Stats
                    questionNumber={questionNumber}
                    totalQuestions={totalExercises}
                    timeElapsed={timeElapsed}
                    score={score}
                  />
                </div>
              </div>

              {/* Feedback Overlays */}
              <Feedback
                isVisible={showFeedback}
                isCorrect={isCorrect}
                questionNumber={questionNumber}
              />

              {renderIncorrectFeedback()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Exercise content renderer - routes to specific renderers
  function renderExerciseContent() {
    if (!universalData) return null;
    
    const rendererProps = {
      universalData,
      userAnswers,
      onAnswerChange: handleAnswerChange,
      isAnswered,
      isCorrect,
      showFeedback: showFeedback,
      onAudioPlay: speak,
      isPlaying,
      selectedAnswers,
      onSubmit: (answers) => {
        if (answers?.selectedAnswers) {
          handleAnswerSubmit(answers.selectedAnswers);
        }
      },
      onOptionSelect: (optionId) => {
        setSelectedAnswers(prev => {
          const isSelected = prev.includes(optionId);
          if (isSelected) {
            return prev.filter(id => id !== optionId);
          } else {
            const requiredSelections = universalData.content.solution.requiredSelections || 1;
            if (prev.length < requiredSelections) {
              return [...prev, optionId];
            }
            return prev;
          }
        });
      }
    };
    
    switch (universalData.metadata.type) {
      case 'multiple-answers':
        return (
          <MultipleAnswersRenderer 
            {...rendererProps}
          />
        );
      
      case 'multiple-choice':
        return (
          <MultipleChoiceRenderer 
            {...rendererProps}
          />
        );
      
      case 'single-answer':
        return (
          <SingleAnswerRenderer 
            {...rendererProps}
          />
        );
      
      case 'click-to-change':
        return (
          <ClickToChangeRenderer 
            {...rendererProps}
          />
        );
      
      case 'syllable-counting':
        return (
          <SyllableCountingRenderer 
            {...rendererProps}
          />
        );
      
      case 'table-exercise':
        return (
          <TableExerciseRenderer 
            {...rendererProps}
          />
        );
      
      case 'rhyme-exercise':
        return (
          <RhymeExerciseRenderer 
            {...rendererProps}
          />
        );
      
      case 'drag-and-drop':
        return (
          <DragAndDropRenderer 
            {...rendererProps}
            categoryItems={categoryItems}
            setCategoryItems={setCategoryItems}
          />
        );
      
      case 'fill-in-blanks':
        return (
          <FillInBlanksRenderer 
            {...rendererProps}
            fillAnswers={fillAnswers}
            setFillAnswers={setFillAnswers}
            inputRefs={inputRefs}
          />
        );
      
      case 'gap-fill':
        return (
          <GapFillRenderer 
            {...rendererProps}
            fillAnswers={fillAnswers}
            setFillAnswers={setFillAnswers}
            inputRefs={inputRefs}
          />
        );
      
      case 'highlight':
        return (
          <HighlightRenderer 
            {...rendererProps}
            highlightedItems={highlightedItems}
            setHighlightedItems={setHighlightedItems}
          />
        );
      
      case 'sequencing':
        return (
          <SequencingRenderer 
            {...rendererProps}
            sequenceItems={sequenceItems}
            setSequenceItems={setSequenceItems}
          />
        );
      
      default:
        return <div>Unsupported exercise type: {universalData.metadata.type}</div>;
    }
  }

  // Multiple Answers renderer - preserves exact UI from MultipleAnswers.jsx
  function renderMultipleAnswers() {
    const { content } = universalData;
    const isImageBased = content.elements.options.some(opt => opt.type === 'image');
    
    const handleOptionSelect = (optionId) => {
      setSelectedAnswers(prev => {
        const isSelected = prev.includes(optionId);
        if (isSelected) {
          return prev.filter(id => id !== optionId);
        } else {
          if (prev.length < content.solution.requiredSelections) {
            return [...prev, optionId];
          }
          return prev;
        }
      });
    };

    const checkAnswer = () => {
      if (selectedAnswers.length !== content.solution.requiredSelections) return;
      handleAnswerSubmit(selectedAnswers);
    };

    const playAllAudio = async () => {
      if (isPlaying) return;
      setIsPlaying(true);
      
      try {
        for (const option of content.elements.options) {
          await speak(option.content, { rate: 0.8, pitch: 1 });
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error('Error playing audio:', error);
      } finally {
        setIsPlaying(false);
      }
    };

    return (
      <>
        {/* Question and Audio Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h1 className={universalData?.presentation?.styles?.question || "text-xl font-bold mb-4"}>
            {content.text.question}
          </h1>
          {content.elements.media.audio.length > 0 && (
            <button
              onClick={playAllAudio}
              disabled={isPlaying}
              className={`
                flex items-center px-4 py-2 rounded-lg bg-primary-50 text-primary-500
                ${isPlaying ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-100'}
              `}
            >
              <Volume2 className="w-5 h-5" />
              <span className="ml-2 whitespace-nowrap">Listen to all</span>
            </button>
          )}
        </div>

        {/* Options Grid */}
        <div className={`
          grid gap-4 mb-8
          ${isImageBased 
            ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3' 
            : 'grid-cols-1 md:grid-cols-3'}
        `}>
          {content.elements.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.id);
            
            if (option.type === 'image') {
              return (
                <div 
                  key={option.id}
                  className={`
                    h-full cursor-pointer transition-all duration-200 bg-white rounded-lg shadow-sm
                    ${isSelected ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
                  `}
                  onClick={() => handleOptionSelect(option.id)}
                >
                  <div className="aspect-square w-full h-32 sm:h-40 lg:h-48 relative">
                    <img
                      src={option.image}
                      alt={option.content}
                      className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
                    />
                  </div>
                  <div className="p-2 bg-white border-t flex items-center justify-between rounded-b-lg">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        playAudio(option.content);
                      }}
                      className="p-1.5 text-primary-500 hover:text-primary-600 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            }

            return (
              <div 
                key={option.id}
                className={`
                  relative cursor-pointer transition-all duration-200 rounded-lg
                  ${isSelected ? 'bg-blue-200 border-blue-500' : 'bg-blue-50 border-transparent hover:bg-blue-75'}
                  border min-h-[60px] flex items-center px-4 py-3
                `}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className={`
                  absolute left-4 flex items-center justify-center
                  w-6 h-6 rounded-full transition-colors duration-200
                  ${isSelected ? 'bg-blue-600' : 'bg-white border-2 border-blue-400'}
                `}>
                  <Check 
                    className={`w-4 h-4 ${isSelected ? 'text-white ' : 'text-transparent'}`}
                  />
                </div>

                <span className="text-lg font-semibold text-gray-700 ml-10">
                  {option.content}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playAudio(option.content);
                  }}
                  className="absolute right-4 text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Check Answer Button */}
        <div className="flex justify-center">
          <button
            onClick={checkAnswer}
            disabled={selectedAnswers.length !== content.solution.requiredSelections}
            className={`
              w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 
              disabled:to-gray-500 text-white font-semibold py-2 sm:py-3 
              px-6 sm:px-8 rounded-lg text-sm sm:text-base transform 
              transition-all duration-200 hover:-translate-y-1 
              hover:shadow-lg disabled:hover:translate-y-0 
              disabled:hover:shadow-none disabled:cursor-not-allowed 
              mx-2 sm:mx-0
            `}
          >
            Check Answer ({selectedAnswers.length}/{content.solution.requiredSelections} selected)
          </button>
        </div>
      </>
    );
  }

  // [Continue with other render functions for each exercise type...]
  // Due to length constraints, I'll create separate files for the remaining renderers

  function renderIncorrectFeedback() {
    if (!showIncorrectFeedback || !universalData) return null;
    
    const props = {
      isVisible: showIncorrectFeedback,
      onGotIt: handleGotIt,
      currentExercise: exerciseData // Pass original exercise data
    };
    
    switch (universalData.metadata.type) {
      case 'multiple-answers':
        return (
          <IncorrectMultipleAnswersFeedback
            {...props}
            selectedAnswers={selectedAnswers}
          />
        );
      case 'fill-in-blanks':
        return <IncorrectFillFeedback {...props} />;
      case 'gap-fill':
        return <IncorrectGapFillFeedback {...props} />;
      case 'highlight':
        return <IncorrectHighlightFeedback {...props} />;
      default:
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">Try Again!</h3>
              <p className="mb-4">{universalData.learning.feedback.incorrect.message}</p>
              <button
                onClick={handleGotIt}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Got it!
              </button>
            </div>
          </div>
        );
    }
  }

  // Placeholder render functions for other exercise types
  function renderMultipleChoice() {
    // Similar to MultipleAnswers but only one selection allowed
    const { content } = universalData;
    
    const handleOptionSelect = (optionId) => {
      setSelectedAnswers([optionId]); // Only one selection
    };

    const checkAnswer = () => {
      if (selectedAnswers.length !== 1) return;
      handleAnswerSubmit(selectedAnswers[0]); // Single answer
    };

    return (
      <>
        <h1 className={universalData?.presentation?.styles?.question || "text-xl font-bold mb-4"}>
          {content.text.question}
        </h1>

        <div className="space-y-3 mb-8">
          {content.elements.options.map((option) => {
            const isSelected = selectedAnswers.includes(option.id);
            
            return (
              <div 
                key={option.id}
                className={`
                  relative cursor-pointer transition-all duration-200 rounded-lg
                  ${isSelected ? 'bg-blue-200 border-blue-500' : 'bg-blue-50 border-transparent hover:bg-blue-75'}
                  border min-h-[60px] flex items-center px-4 py-3
                `}
                onClick={() => handleOptionSelect(option.id)}
              >
                <div className={`
                  absolute left-4 flex items-center justify-center
                  w-6 h-6 rounded-full transition-colors duration-200
                  ${isSelected ? 'bg-blue-600' : 'bg-white border-2 border-blue-400'}
                `}>
                  <Check 
                    className={`w-4 h-4 ${isSelected ? 'text-white ' : 'text-transparent'}`}
                  />
                </div>

                <span className="text-lg font-semibold text-gray-700 ml-10">
                  {option.content}
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={checkAnswer}
            disabled={selectedAnswers.length !== 1}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-2 sm:py-3 px-6 sm:px-8 rounded-lg"
          >
            Check Answer
          </button>
        </div>
      </>
    );
  }

  function renderSingleAnswer() {
    return renderMultipleChoice(); // Same implementation
  }

  function renderDragAndDrop() {
    return (
      <DragAndDropRenderer
        universalData={universalData}
        categoryItems={categoryItems}
        setCategoryItems={setCategoryItems}
        movedItems={movedItems}
        setMovedItems={setMovedItems}
        sensors={sensors}
        onSubmit={handleAnswerSubmit}
      />
    );
  }

  function renderFillInBlanks() {
    return (
      <FillInBlanksRenderer
        universalData={universalData}
        userAnswer={userAnswer}
        setUserAnswer={setUserAnswer}
        onSubmit={handleAnswerSubmit}
      />
    );
  }

  function renderGapFill() {
    return (
      <GapFillRenderer
        universalData={universalData}
        userAnswers={userAnswers}
        setUserAnswers={setUserAnswers}
        inputRefs={inputRefs}
        isPlaying={isPlaying}
        playAudio={playAudio}
        onSubmit={handleAnswerSubmit}
      />
    );
  }

  function renderHighlight() {
    return (
      <HighlightRenderer
        universalData={universalData}
        highlightedItems={highlightedItems}
        setHighlightedItems={setHighlightedItems}
        isPlaying={isPlaying}
        playAudio={playAudio}
        onSubmit={handleAnswerSubmit}
      />
    );
  }

  function renderSequencing() {
    return (
      <SequencingRenderer
        universalData={universalData}
        sequenceItems={sequenceItems}
        setSequenceItems={setSequenceItems}
        sensors={sensors}
        activeId={activeId}
        setActiveId={setActiveId}
        onSubmit={handleAnswerSubmit}
      />
    );
  }
};

export default UniversalExercise;
