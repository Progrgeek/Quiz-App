/**
 * Universal Exercise Renderer
 * 
 * A flexible rendering system that preserves the original UI and functionality
 * while providing a universal interface for all exercise types.
 * 
 * This renderer:
 * - Maintains backward compatibility with existing components
 * - Provides consistent theming and responsive design
 * - Handles accessibility automatically
 * - Supports multiple layout variants
 */

import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Check, X, ArrowRight, ArrowLeft, RotateCcw, Lightbulb } from 'lucide-react';

/**
 * Universal Exercise Renderer Component
 */
export function UniversalExerciseRenderer({ 
  exercise, 
  theme = {}, 
  layout = 'standard',
  showStats = true,
  showNavigation = true,
  className = '',
  ...props 
}) {
  const [exerciseState, setExerciseState] = useState(exercise.getState());
  const [renderData, setRenderData] = useState(exercise.render());
  const containerRef = useRef(null);

  // Subscribe to exercise state changes
  useEffect(() => {
    const handleStateChange = (event) => {
      setExerciseState(event.newState);
      setRenderData(exercise.render());
    };

    exercise.on('stateChange', handleStateChange);
    
    return () => {
      exercise.off('stateChange', handleStateChange);
    };
  }, [exercise]);

  // Initialize exercise when component mounts
  useEffect(() => {
    if (!exercise.initialized) {
      exercise.initialize();
    }
    
    if (containerRef.current) {
      exercise.mount(containerRef.current);
    }

    return () => {
      exercise.unmount();
    };
  }, [exercise]);

  const {
    type,
    config = {},
    state = {},
    methods = {},
    content = {}
  } = renderData;

  // Determine exercise type renderer
  const ExerciseTypeRenderer = getExerciseTypeRenderer(type);

  return (
    <div 
      ref={containerRef}
      className={`universal-exercise-renderer ${layout} ${className}`}
      style={{
        direction: exercise.i18n.getDirection(),
        textAlign: exercise.i18n.getTextAlign()
      }}
      {...props}
    >
      {/* Stats Section */}
      {showStats && (
        <StatsSection 
          exercise={exercise}
          state={exerciseState}
          theme={theme}
        />
      )}

      {/* Main Exercise Content */}
      <div className="exercise-content">
        <ExerciseTypeRenderer
          exercise={exercise}
          config={config}
          state={state}
          methods={methods}
          content={content}
          theme={theme}
          layout={layout}
        />
      </div>

      {/* Navigation Section */}
      {showNavigation && (
        <NavigationSection
          exercise={exercise}
          state={exerciseState}
          methods={methods}
          theme={theme}
        />
      )}

      {/* Feedback Section */}
      <FeedbackSection
        exercise={exercise}
        state={exerciseState}
        theme={theme}
      />

      {/* Accessibility Live Region */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {state.announcements && state.announcements[state.announcements.length - 1]}
      </div>
    </div>
  );
}

/**
 * Stats Section Component
 */
function StatsSection({ exercise, state, theme }) {
  return (
    <div className="exercise-stats bg-gray-50 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium text-gray-600">
          {exercise.t('progress.questionOf', {
            current: (state.currentIndex || 0) + 1,
            total: getTotalQuestions(exercise)
          })}
        </span>
        <span className="font-medium text-gray-600">
          {exercise.t('progress.timeElapsed', {
            time: exercise.i18n.formatTime(state.timeElapsed || 0)
          })}
        </span>
        <span className="font-medium text-primary-600">
          {exercise.t('progress.score', {
            score: Math.round(state.score || 0)
          })}
        </span>
      </div>
      
      {/* Progress Bar */}
      <div className="mt-2 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${(((state.currentIndex || 0) + 1) / getTotalQuestions(exercise)) * 100}%` 
          }}
        />
      </div>
    </div>
  );
}

/**
 * Navigation Section Component
 */
function NavigationSection({ exercise, state, methods, theme }) {
  const canSubmit = methods.canSubmitAnswer ? methods.canSubmitAnswer() : true;
  
  return (
    <div className="exercise-navigation mt-6 space-y-4">
      {/* Primary Action Button */}
      <div className="flex justify-center">
        <button
          onClick={() => methods.submitAnswer && methods.submitAnswer()}
          disabled={!canSubmit || state.loading}
          className={`
            px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
            ${canSubmit && !state.loading
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transform hover:-translate-y-1 hover:shadow-lg'
              : 'bg-gray-400 cursor-not-allowed'
            }
          `}
          aria-label={exercise.t('buttons.checkAnswer')}
        >
          {state.loading ? (
            <span className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {exercise.t('accessibility.loading')}
            </span>
          ) : (
            <>
              {exercise.t('buttons.checkAnswer')}
              {methods.getSelectionCountText && (
                <span className="ml-2 text-sm opacity-90">
                  ({methods.getSelectionCountText()})
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Secondary Actions */}
      <div className="flex justify-center space-x-4">
        {methods.showHint && (
          <button
            onClick={() => methods.showHint()}
            className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
            aria-label={exercise.t('buttons.hint')}
          >
            <Lightbulb className="w-4 h-4 mr-2" />
            {exercise.t('buttons.hint')}
          </button>
        )}
        
        {methods.reset && (
          <button
            onClick={() => methods.reset()}
            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-700 transition-colors"
            aria-label={exercise.t('buttons.reset')}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            {exercise.t('buttons.reset')}
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * Feedback Section Component
 */
function FeedbackSection({ exercise, state, theme }) {
  if (!state.showFeedback) return null;

  const isCorrect = state.lastAnswerCorrect;
  const feedbackClass = isCorrect 
    ? 'bg-green-100 border-green-500 text-green-800'
    : 'bg-red-100 border-red-500 text-red-800';

  return (
    <div className={`
      fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50
      transition-opacity duration-300 ${state.showFeedback ? 'opacity-100' : 'opacity-0'}
    `}>
      <div className={`
        ${feedbackClass} border-l-4 p-6 rounded-lg shadow-lg max-w-md mx-4
        transform transition-transform duration-300 ${state.showFeedback ? 'scale-100' : 'scale-95'}
      `}>
        <div className="flex items-center">
          {isCorrect ? (
            <Check className="w-6 h-6 mr-3" />
          ) : (
            <X className="w-6 h-6 mr-3" />
          )}
          <div>
            <h3 className="font-semibold">
              {exercise.t(isCorrect ? 'feedback.correct' : 'feedback.incorrect')}
            </h3>
            {state.feedbackMessage && (
              <p className="mt-1">{state.feedbackMessage}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Multiple Choice Exercise Renderer
 */
function MultipleChoiceRenderer({ exercise, config, state, methods, content, theme, layout }) {
  const { question, options = [], exerciseType } = content;
  const { selectedAnswers = [] } = state;

  return (
    <div className="multiple-choice-exercise">
      {/* Question Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-green-600">
            {question}
          </h1>
          
          {/* Audio Control for Sound Matching */}
          {exerciseType === 'sound_matching' && methods.playAllAudio && (
            <button
              onClick={() => methods.playAllAudio()}
              disabled={state.isPlayingAudio}
              className={`
                flex items-center px-4 py-2 rounded-lg bg-blue-50 text-blue-500
                ${state.isPlayingAudio ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-100'}
              `}
              aria-label={exercise.t('buttons.listenToAll')}
            >
              <Volume2 className="w-5 h-5 mr-2" />
              {exercise.t('buttons.listenToAll')}
            </button>
          )}
        </div>
      </div>

      {/* Options Grid/List */}
      <div className={`
        ${exerciseType === 'sound_matching' 
          ? 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-4' 
          : 'grid grid-cols-1 md:grid-cols-3 gap-4'
        }
        mb-8
      `}>
        {options.map((option, index) => (
          <OptionRenderer
            key={option.id || index}
            option={option}
            index={index}
            selected={selectedAnswers.includes(index)}
            exerciseType={exerciseType}
            onSelect={() => methods.selectOption && methods.selectOption(index)}
            onPlayAudio={() => methods.playAudio && methods.playAudio(option.word)}
            exercise={exercise}
            isPlayingAudio={state.isPlayingAudio}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * Option Renderer Component
 */
function OptionRenderer({ 
  option, 
  index, 
  selected, 
  exerciseType, 
  onSelect, 
  onPlayAudio, 
  exercise,
  isPlayingAudio 
}) {
  if (exerciseType === 'sound_matching') {
    return (
      <SoundMatchingOption
        option={option}
        selected={selected}
        onSelect={onSelect}
        onPlayAudio={onPlayAudio}
        exercise={exercise}
        isPlayingAudio={isPlayingAudio}
      />
    );
  }

  return (
    <TextOption
      option={option}
      selected={selected}
      onSelect={onSelect}
      onPlayAudio={onPlayAudio}
      exercise={exercise}
    />
  );
}

/**
 * Sound Matching Option Component
 */
function SoundMatchingOption({ option, selected, onSelect, onPlayAudio, exercise, isPlayingAudio }) {
  return (
    <div 
      className={`
        h-full cursor-pointer transition-all duration-200 bg-white rounded-lg shadow-sm
        ${selected ? 'ring-4 ring-blue-500' : 'hover:ring-2 hover:ring-blue-300'}
      `}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${option.word}${selected ? ', selected' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className="aspect-square w-full h-32 sm:h-40 lg:h-48 relative">
        <img
          src={option.image}
          alt={option.word}
          className="absolute inset-0 w-full h-full object-cover rounded-t-lg"
        />
      </div>
      <div className="p-2 bg-white border-t flex items-center justify-between rounded-b-lg">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayAudio();
          }}
          className="p-1.5 text-blue-500 hover:text-blue-600 transition-colors"
          aria-label={exercise.t('accessibility.playAudio')}
          disabled={isPlayingAudio}
        >
          <Volume2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

/**
 * Text Option Component
 */
function TextOption({ option, selected, onSelect, onPlayAudio, exercise }) {
  return (
    <div 
      className={`
        relative cursor-pointer transition-all duration-200 rounded-lg
        ${selected ? 'bg-blue-200 border-blue-500' : 'bg-blue-50 border-transparent hover:bg-blue-75'}
        border min-h-[60px] flex items-center px-4 py-3
      `}
      onClick={onSelect}
      role="button"
      tabIndex={0}
      aria-pressed={selected}
      aria-label={`${option.word}${selected ? ', selected' : ''}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect();
        }
      }}
    >
      <div className={`
        absolute left-4 flex items-center justify-center
        w-6 h-6 rounded-full transition-colors duration-200
        ${selected ? 'bg-blue-600' : 'bg-white border-2 border-blue-400'}
      `}>
        <Check 
          className={`w-4 h-4 ${selected ? 'text-white' : 'text-transparent'}`}
        />
      </div>

      <span className="text-lg font-semibold text-gray-700 ml-10">
        {option.word}
      </span>

      {option.audio && onPlayAudio && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPlayAudio();
          }}
          className="absolute right-4 text-blue-500 hover:text-blue-600 transition-colors"
          aria-label={exercise.t('accessibility.playAudio')}
        >
          <Volume2 className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

/**
 * Click to Change Exercise Renderer
 */
function ClickToChangeRenderer({ exercise, config, state, methods, content, theme, layout }) {
  // Implementation for click to change exercises
  return (
    <div className="click-to-change-exercise">
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.question}
      </h1>
      {/* Word list would go here */}
    </div>
  );
}

/**
 * Drag and Drop Exercise Renderer
 */
function DragDropRenderer({ exercise, config, state, methods, content, theme, layout }) {
  // Implementation for drag and drop exercises
  return (
    <div className="drag-drop-exercise">
      <h1 className="text-xl font-bold text-green-600 mb-6">
        {content.question}
      </h1>
      {/* Drag and drop interface would go here */}
    </div>
  );
}

/**
 * Get Exercise Type Renderer
 */
function getExerciseTypeRenderer(type) {
  const renderers = {
    'multiple-choice': MultipleChoiceRenderer,
    'multiple-answers': MultipleChoiceRenderer, // Alias for backward compatibility
    'click-to-change': ClickToChangeRenderer,
    'drag-drop': DragDropRenderer,
    // Add more exercise types as they are implemented
  };

  return renderers[type] || MultipleChoiceRenderer; // Default fallback
}

/**
 * Helper Functions
 */
function getTotalQuestions(exercise) {
  // This would calculate total questions based on exercise data
  // For now, return 1 as default
  return 1;
}

export default UniversalExerciseRenderer;
