/**
 * Exercise Integration Bridge
 * 
 * This bridge connects original exercise components to the sophisticated
 * backend systems (QuizEngine, AI, Analytics, Gamification) while preserving
 * their original UI and functionality.
 * 
 * Key Features:
 * - Preserves original component UI/UX exactly
 * - Enhances with QuizEngine state management
 * - Adds AI adaptive difficulty and hints
 * - Integrates Analytics tracking
 * - Connects Gamification system
 * - Maintains backward compatibility
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useQuizEngine } from '../hooks/useQuizEngine';
import { useAnalytics } from '../hooks/useAnalytics';
import { useAI } from '../hooks/useAI';
import { useGamification } from '../hooks/useGamification';

// For now, use simple fallbacks for design system components
const SimpleButton = ({ children, ...props }) => <button {...props}>{children}</button>;
const SimpleCard = ({ children, ...props }) => <div {...props}>{children}</div>;
const SimpleInput = ({ ...props }) => <input {...props} />;

// Simple design system fallback
const designSystemFallback = {
  Button: SimpleButton,
  Card: SimpleCard,
  Input: SimpleInput
};

/**
 * Exercise Integration Bridge Class
 * Wraps original components with enhanced backend systems
 */
export class ExerciseIntegrationBridge {
  constructor(originalComponent, options = {}) {
    this.OriginalComponent = originalComponent;
    this.options = {
      preserveOriginalUI: true,
      enableQuizEngine: true,
      enableAI: true,
      enableAnalytics: true,
      enableGamification: true,
      enableUIComponents: true,
      ...options
    };
  }

  /**
   * Create enhanced component with integrated systems
   */
  enhance() {
    const { OriginalComponent, options } = this;

    return React.forwardRef((props, ref) => {
      // Enhanced state management
      const [integrationState, setIntegrationState] = useState({
        isEnhanced: true,
        backendConnected: false,
        originalProps: props,
        enhancedProps: {}
      });

      // Backend system hooks
      const quizEngine = options.enableQuizEngine ? useQuizEngine() : null;
      const analytics = options.enableAnalytics ? useAnalytics() : null;
      const ai = options.enableAI ? useAI() : null;
      const gamification = options.enableGamification ? useGamification() : null;

      // Initialize integration when component mounts
      useEffect(() => {
        const initializeIntegration = async () => {
          try {
            // Initialize backend systems if enabled
            if (quizEngine && props.exerciseData) {
              await quizEngine.initialize({
                type: props.exerciseType || 'multiple-answers',
                data: props.exerciseData,
                config: props.config || {}
              });
            }

            if (analytics && props.exerciseType) {
              analytics.trackExerciseStart(props.exerciseType, props.difficulty || 'medium');
            }

            if (ai && props.exerciseData) {
              await ai.initializeForExercise({
                type: props.exerciseType,
                data: props.exerciseData,
                userProfile: ai.getUserProfile()
              });
            }

            setIntegrationState(prev => ({
              ...prev,
              backendConnected: true
            }));

          } catch (error) {
            console.warn('Integration initialization failed:', error);
            // Fallback to original functionality
          }
        };

        initializeIntegration();
      }, [props.exerciseType, props.exerciseData]);

      // Enhanced props that integrate backend systems with original component
      const enhancedProps = useMemo(() => {
        const baseProps = { ...props };

        // If integration is disabled or failed, return original props
        if (!integrationState.backendConnected) {
          return baseProps;
        }

        // Enhance original props with backend systems
        const enhanced = {
          ...baseProps,
          
          // QuizEngine integration
          ...(quizEngine && {
            // Enhanced state management
            state: quizEngine.getState(),
            currentScore: quizEngine.getScore(),
            timeElapsed: quizEngine.getTimeElapsed(),
            
            // Enhanced submission handling
            onSubmitAnswer: this.createEnhancedSubmitHandler(
              baseProps.onSubmitAnswer,
              quizEngine,
              analytics,
              ai,
              gamification
            ),
            
            // Enhanced reset functionality
            onReset: this.createEnhancedResetHandler(
              baseProps.onReset,
              quizEngine,
              analytics
            )
          }),

          // AI integration
          ...(ai && {
            // AI-powered hints
            getHint: () => ai.generateHint({
              exerciseType: props.exerciseType,
              currentQuestion: quizEngine?.getCurrentQuestion(),
              userAttempts: quizEngine?.getUserAttempts()
            }),
            
            // Adaptive difficulty
            difficulty: ai.getAdaptiveDifficulty(),
            
            // Personalized content
            personalizedContent: ai.personalizeContent(props.exerciseData)
          }),

          // UI Component integration (if enabled)
          ...(options.enableUIComponents && {
            Button: designSystemFallback.Button,
            Card: designSystemFallback.Card,
            Input: designSystemFallback.Input,
            designTokens: { colors: { primary: '#3B82F6' } } // Simple fallback
          })
        };

        return enhanced;
      }, [integrationState.backendConnected, quizEngine, analytics, ai, gamification, props]);

      // Render original component with enhanced props
      return (
        <div className="exercise-integration-bridge" ref={ref}>
          {/* Integration status indicator (dev mode only) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="integration-status bg-blue-50 border-l-4 border-blue-400 p-2 mb-4 text-xs">
              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${integrationState.backendConnected ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                <span>
                  Backend Integration: {integrationState.backendConnected ? 'Connected' : 'Connecting...'}
                </span>
                {quizEngine && <span>• QuizEngine ✓</span>}
                {analytics && <span>• Analytics ✓</span>}
                {ai && <span>• AI ✓</span>}
                {gamification && <span>• Gamification ✓</span>}
              </div>
            </div>
          )}

          {/* Original component with enhanced functionality */}
          <OriginalComponent {...enhancedProps} />

          {/* Enhanced features overlay (if needed) */}
          {integrationState.backendConnected && ai && (
            <AIHintsOverlay
              show={ai.shouldShowHints()}
              hint={ai.getCurrentHint()}
              onDismiss={() => ai.dismissHint()}
            />
          )}
        </div>
      );
    });
  }

  /**
   * Create enhanced submit handler that integrates all backend systems
   */
  createEnhancedSubmitHandler(originalHandler, quizEngine, analytics, ai, gamification) {
    return async (answer, ...args) => {
      try {
        // Enhanced validation using ValidationEngine
        const validation = quizEngine?.validate(answer);
        
        // Enhanced scoring using ScoreCalculator
        const score = quizEngine?.calculateScore(validation);
        
        // Update QuizEngine state
        if (quizEngine) {
          quizEngine.submitAnswer(answer, validation, score);
        }

        // Analytics tracking
        if (analytics) {
          analytics.trackAnswerSubmit({
            answer,
            isCorrect: validation?.isCorrect,
            score,
            timeSpent: quizEngine?.getQuestionTime(),
            exerciseType: quizEngine?.getType()
          });
        }

        // AI learning updates
        if (ai) {
          ai.updateLearning({
            answer,
            result: validation,
            adaptDifficulty: true
          });
        }

        // Gamification rewards
        if (gamification && validation?.isCorrect) {
          const xp = gamification.calculateXP({
            exerciseType: quizEngine?.getType(),
            difficulty: ai?.getDifficulty(),
            score,
            bonuses: validation.bonuses || []
          });
          
          gamification.awardXP(xp);
          gamification.checkAchievements();
        }

        // Call original handler with enhanced results
        if (originalHandler) {
          return originalHandler({
            answer,
            validation,
            score,
            enhancedData: {
              quizEngineState: quizEngine?.getState(),
              aiRecommendations: ai?.getRecommendations(),
              achievements: gamification?.getRecentAchievements()
            }
          }, ...args);
        }

        return { validation, score };

      } catch (error) {
        console.error('Enhanced submit handler error:', error);
        // Fallback to original handler
        return originalHandler ? originalHandler(answer, ...args) : null;
      }
    };
  }

  /**
   * Create enhanced reset handler
   */
  createEnhancedResetHandler(originalHandler, quizEngine, analytics) {
    return (...args) => {
      try {
        // Reset QuizEngine state
        if (quizEngine) {
          quizEngine.reset();
        }

        // Track reset in analytics
        if (analytics) {
          analytics.trackExerciseReset();
        }

        // Call original handler
        if (originalHandler) {
          return originalHandler(...args);
        }

      } catch (error) {
        console.error('Enhanced reset handler error:', error);
        // Fallback to original handler
        return originalHandler ? originalHandler(...args) : null;
      }
    };
  }
}

/**
 * AI Hints Overlay Component
 */
const AIHintsOverlay = ({ show, hint, onDismiss }) => {
  if (!show || !hint) return null;

  return (
    <div className="fixed bottom-4 right-4 max-w-sm bg-blue-100 border border-blue-300 rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start space-x-2">
        <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">
          💡
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-blue-900 mb-1">AI Hint</h4>
          <p className="text-blue-800 text-sm">{hint}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-blue-600 hover:text-blue-800 text-lg"
          aria-label="Dismiss hint"
        >
          ×
        </button>
      </div>
    </div>
  );
};

/**
 * Factory function to create enhanced components
 */
export const createEnhancedExercise = (originalComponent, options = {}) => {
  const bridge = new ExerciseIntegrationBridge(originalComponent, options);
  return bridge.enhance();
};

/**
 * Higher-order component for easy integration
 */
export const withBackendIntegration = (options = {}) => (WrappedComponent) => {
  return createEnhancedExercise(WrappedComponent, options);
};

export default ExerciseIntegrationBridge;
