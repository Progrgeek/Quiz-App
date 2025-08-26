/**
 * Standardized Exercise Components
 * Week 2 - Day 8: Component Standardization
 */

import React from 'react';
import { colors, typography, spacing, borderRadius, shadows, exercise, animation } from './tokens.js';

// Exercise Container Component
export const ExerciseContainer = ({ 
  children, 
  layout = 'standard',
  className = '',
  withExample = false,
  ...props 
}) => {
  const layoutClasses = {
    compact: 'p-4 max-w-3xl',
    standard: 'p-6 max-w-4xl', 
    expanded: 'p-8 max-w-6xl'
  };

  const exampleMargin = withExample ? 'mt-16 sm:mt-20' : 'mt-4 sm:mt-6';

  return (
    <div 
      className={`
        relative bg-white mx-auto rounded-lg shadow-md
        ${layoutClasses[layout]}
        ${exampleMargin}
        ${className}
      `}
      style={{
        backgroundColor: colors.neutral[0],
        borderRadius: borderRadius.lg,
        boxShadow: shadows.md,
        padding: spacing[layout === 'compact' ? 4 : layout === 'expanded' ? 8 : 6]
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Question Component
export const ExerciseQuestion = ({ 
  children, 
  variant = 'primary',
  level = 1,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: colors.success[600],
    secondary: colors.neutral[700],
    accent: colors.primary[600]
  };

  const HeadingTag = `h${level}`;

  return (
    <HeadingTag
      className={`font-semibold mb-6 ${className}`}
      style={{
        color: variants[variant],
        fontSize: typography.fontSize.xl[0],
        lineHeight: typography.fontSize.xl[1].lineHeight,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing[6]
      }}
      {...props}
    >
      {children}
    </HeadingTag>
  );
};

// Option Component (for multiple choice, single answer, etc.)
export const ExerciseOption = ({ 
  children,
  selected = false,
  correct = false,
  incorrect = false,
  disabled = false,
  onClick,
  variant = 'button', // 'button', 'card', 'minimal'
  className = '',
  ...props 
}) => {
  const getStateStyles = () => {
    if (correct) return exercise.states.correct;
    if (incorrect) return exercise.states.incorrect;
    if (selected) return exercise.states.selected;
    return exercise.states.default;
  };

  const stateStyles = getStateStyles();
  
  const variantClasses = {
    button: 'px-4 py-3 rounded-lg border-2 font-medium text-center',
    card: 'p-4 rounded-xl border-2 shadow-sm',
    minimal: 'px-2 py-1 rounded border'
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full text-left transition-all duration-200 transform
        hover:-translate-y-0.5 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed
        disabled:hover:translate-y-0 disabled:hover:shadow-none
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${variantClasses[variant]}
        ${className}
      `}
      style={{
        backgroundColor: stateStyles.bg,
        borderColor: stateStyles.border,
        color: stateStyles.text,
        borderRadius: borderRadius.lg,
        minHeight: '48px', // Accessible touch target
        transition: `all ${animation.base} ease-in-out`,
        '--tw-ring-color': colors.primary[500]
      }}
      {...props}
    >
      {children}
    </button>
  );
};

// Grid Layout Component
export const ExerciseGrid = ({ 
  children,
  exerciseType = 'multiple-choice',
  className = '',
  ...props 
}) => {
  const layouts = exercise.layouts[exerciseType] || exercise.layouts['multiple-choice'];
  
  return (
    <div 
      className={`
        grid gap-4 mb-8
        ${layouts.mobile}
        md:${layouts.tablet}
        lg:${layouts.desktop}
        ${className}
      `}
      style={{
        gap: spacing[4],
        marginBottom: spacing[8]
      }}
      {...props}
    >
      {children}
    </div>
  );
};

// Action Button Component
export const ExerciseButton = ({ 
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: {
      bg: `linear-gradient(to right, ${colors.primary[500]}, ${colors.primary[600]})`,
      hover: `linear-gradient(to right, ${colors.primary[600]}, ${colors.primary[700]})`,
      text: colors.neutral[0],
      disabled: `linear-gradient(to right, ${colors.neutral[400]}, ${colors.neutral[500]})`
    },
    secondary: {
      bg: colors.neutral[100],
      hover: colors.neutral[200],
      text: colors.neutral[700],
      disabled: colors.neutral[300]
    },
    success: {
      bg: `linear-gradient(to right, ${colors.success[500]}, ${colors.success[600]})`,
      hover: `linear-gradient(to right, ${colors.success[600]}, ${colors.success[700]})`,
      text: colors.neutral[0],
      disabled: colors.neutral[400]
    }
  };

  const sizes = {
    sm: { px: spacing[3], py: spacing[2], text: typography.fontSize.sm[0] },
    small: { px: spacing[3], py: spacing[2], text: typography.fontSize.sm[0] },
    md: { px: spacing[6], py: spacing[3], text: typography.fontSize.base[0] },
    medium: { px: spacing[6], py: spacing[3], text: typography.fontSize.base[0] },
    lg: { px: spacing[8], py: spacing[4], text: typography.fontSize.lg[0] },
    large: { px: spacing[8], py: spacing[4], text: typography.fontSize.lg[0] }
  };

  const variantStyle = variants[variant];
  const sizeStyle = sizes[size];

  return (
    <button
      disabled={disabled || loading}
      className={`
        font-semibold rounded-lg transition-all duration-200 transform
        hover:-translate-y-1 hover:shadow-lg
        disabled:hover:translate-y-0 disabled:hover:shadow-none
        disabled:cursor-not-allowed
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${fullWidth ? 'w-full' : 'w-auto'}
        ${className}
      `}
      style={{
        background: disabled ? variantStyle.disabled : variantStyle.bg,
        color: variantStyle.text,
        padding: `${sizeStyle.py} ${sizeStyle.px}`,
        fontSize: sizeStyle.text,
        borderRadius: borderRadius.lg,
        minHeight: '48px', // Accessible touch target
        transition: `all ${animation.base} ease-in-out`,
        '--tw-ring-color': colors.primary[500]
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.background = variantStyle.hover;
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled && !loading) {
          e.target.style.background = variantStyle.bg;
        }
      }}
      {...props}
    >
      {loading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
          Loading...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

// Progress Indicator Component
export const ExerciseProgress = ({ 
  current,
  total,
  score,
  timeElapsed,
  className = '',
  ...props 
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`
        flex items-center justify-between p-4 rounded-lg
        ${className}
      `}
      style={{
        backgroundColor: colors.neutral[50],
        borderRadius: borderRadius.lg,
        padding: spacing[4],
        marginBottom: spacing[6]
      }}
      {...props}
    >
      <div className="flex items-center space-x-4">
        <span 
          className="font-medium"
          style={{ 
            color: colors.neutral[600],
            fontSize: typography.fontSize.sm[0]
          }}
        >
          Question {current} of {total}
        </span>
        
        {timeElapsed && (
          <span 
            className="font-medium"
            style={{ 
              color: colors.neutral[600],
              fontSize: typography.fontSize.sm[0]
            }}
          >
            Time: {formatTime(timeElapsed)}
          </span>
        )}
      </div>
      
      {score !== undefined && (
        <span 
          className="font-semibold"
          style={{ 
            color: colors.primary[600],
            fontSize: typography.fontSize.sm[0]
          }}
        >
          Score: {Math.round(score)}%
        </span>
      )}
    </div>
  );
};

// Feedback Component
export const ExerciseFeedback = ({ 
  isVisible,
  isCorrect,
  message,
  className = '',
  ...props 
}) => {
  if (!isVisible) return null;

  const feedbackStyles = isCorrect ? {
    bg: colors.success[50],
    border: colors.success[200],
    text: colors.success[800],
    icon: '✓'
  } : {
    bg: colors.error[50],
    border: colors.error[200], 
    text: colors.error[800],
    icon: '✗'
  };

  return (
    <div 
      className={`
        fixed inset-0 flex items-center justify-center z-50
        ${className}
      `}
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
      {...props}
    >
      <div 
        className="p-6 rounded-xl max-w-md mx-4 text-center"
        style={{
          backgroundColor: feedbackStyles.bg,
          borderColor: feedbackStyles.border,
          borderWidth: '2px',
          borderRadius: borderRadius.xl
        }}
      >
        <div 
          className="text-4xl mb-4"
          style={{ color: feedbackStyles.text }}
        >
          {feedbackStyles.icon}
        </div>
        <p 
          className="font-semibold"
          style={{ 
            color: feedbackStyles.text,
            fontSize: typography.fontSize.lg[0]
          }}
        >
          {message || (isCorrect ? 'Correct!' : 'Try again!')}
        </p>
      </div>
    </div>
  );
};

// Audio Button Component
export const ExerciseAudioButton = ({ 
  onClick,
  onPlay,
  isPlaying = false,
  disabled = false,
  label = 'Play audio',
  className = '',
  size = 'md',
  asButton = true,
  ...props 
}) => {
  const handleClick = onClick || onPlay;
  const Component = asButton ? 'button' : 'div';
  
  return (
    <Component
      onClick={handleClick}
      disabled={asButton ? (disabled || isPlaying) : undefined}
      className={`
        flex items-center px-3 py-2 rounded-lg transition-all duration-200
        hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2
        cursor-pointer
        ${className}
      `}
      style={{
        backgroundColor: isPlaying ? colors.primary[100] : colors.primary[50],
        color: colors.primary[600],
        borderRadius: borderRadius.lg,
        opacity: disabled ? 0.5 : 1,
        '--tw-ring-color': colors.primary[500]
      }}
      aria-label={label}
      {...props}
    >
      <svg 
        className="w-4 h-4 mr-2" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.824L4.17 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.17l4.213-3.824a1 1 0 011.383.076zM12 9a1 1 0 011.414 0L15 10.586l1.586-1.586a1 1 0 111.414 1.414L16.414 12 18 13.586a1 1 0 11-1.414 1.414L15 13.414l-1.586 1.586a1 1 0 11-1.414-1.414L13.586 12 12 10.414A1 1 0 0112 9z" 
          clipRule="evenodd" 
        />
      </svg>
      <span className="text-sm font-medium">
        {isPlaying ? 'Playing...' : label}
      </span>
    </Component>
  );
};
