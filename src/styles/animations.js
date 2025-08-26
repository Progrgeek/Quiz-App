/**
 * Animation Definitions
 * Predefined animations for components and interactions
 */

export const animations = {
  // Fade animations
  fadeIn: {
    keyframes: {
      '0%': { opacity: 0 },
      '100%': { opacity: 1 },
    },
    duration: '300ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  fadeOut: {
    keyframes: {
      '0%': { opacity: 1 },
      '100%': { opacity: 0 },
    },
    duration: '300ms',
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  
  // Slide animations
  slideInUp: {
    keyframes: {
      '0%': { 
        opacity: 0,
        transform: 'translateY(16px)',
      },
      '100%': { 
        opacity: 1,
        transform: 'translateY(0px)',
      },
    },
    duration: '300ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  slideInDown: {
    keyframes: {
      '0%': { 
        opacity: 0,
        transform: 'translateY(-16px)',
      },
      '100%': { 
        opacity: 1,
        transform: 'translateY(0px)',
      },
    },
    duration: '300ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  slideInLeft: {
    keyframes: {
      '0%': { 
        opacity: 0,
        transform: 'translateX(-16px)',
      },
      '100%': { 
        opacity: 1,
        transform: 'translateX(0px)',
      },
    },
    duration: '300ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  slideInRight: {
    keyframes: {
      '0%': { 
        opacity: 0,
        transform: 'translateX(16px)',
      },
      '100%': { 
        opacity: 1,
        transform: 'translateX(0px)',
      },
    },
    duration: '300ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  // Scale animations
  scaleIn: {
    keyframes: {
      '0%': { 
        opacity: 0,
        transform: 'scale(0.95)',
      },
      '100%': { 
        opacity: 1,
        transform: 'scale(1)',
      },
    },
    duration: '200ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  scaleOut: {
    keyframes: {
      '0%': { 
        opacity: 1,
        transform: 'scale(1)',
      },
      '100%': { 
        opacity: 0,
        transform: 'scale(0.95)',
      },
    },
    duration: '200ms',
    easing: 'cubic-bezier(0.4, 0, 1, 1)',
  },
  
  // Bounce animation
  bounce: {
    keyframes: {
      '0%, 20%, 53%, 80%, 100%': {
        transform: 'translate3d(0,0,0)',
      },
      '40%, 43%': {
        transform: 'translate3d(0, -30px, 0)',
      },
      '70%': {
        transform: 'translate3d(0, -15px, 0)',
      },
      '90%': {
        transform: 'translate3d(0, -4px, 0)',
      },
    },
    duration: '1s',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Pulse animation (for loading states)
  pulse: {
    keyframes: {
      '0%, 100%': { opacity: 1 },
      '50%': { opacity: 0.5 },
    },
    duration: '2s',
    easing: 'cubic-bezier(0.4, 0, 0.6, 1)',
    iterationCount: 'infinite',
  },
  
  // Spin animation (for loading spinners)
  spin: {
    keyframes: {
      '0%': { transform: 'rotate(0deg)' },
      '100%': { transform: 'rotate(360deg)' },
    },
    duration: '1s',
    easing: 'linear',
    iterationCount: 'infinite',
  },
  
  // Quiz-specific animations
  correctAnswer: {
    keyframes: {
      '0%': { 
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(34, 197, 94, 0.7)',
      },
      '70%': { 
        transform: 'scale(1.05)',
        boxShadow: '0 0 0 10px rgba(34, 197, 94, 0)',
      },
      '100%': { 
        transform: 'scale(1)',
        boxShadow: '0 0 0 0 rgba(34, 197, 94, 0)',
      },
    },
    duration: '600ms',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  incorrectAnswer: {
    keyframes: {
      '0%, 100%': { transform: 'translateX(0)' },
      '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
      '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
    },
    duration: '500ms',
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  progressFill: {
    keyframes: {
      '0%': { width: '0%' },
      '100%': { width: 'var(--progress-width)' },
    },
    duration: '800ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  // Hover and focus animations
  buttonHover: {
    keyframes: {
      '0%': { transform: 'translateY(0)' },
      '100%': { transform: 'translateY(-1px)' },
    },
    duration: '150ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
  
  cardHover: {
    keyframes: {
      '0%': { 
        transform: 'translateY(0)',
        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      '100%': { 
        transform: 'translateY(-2px)',
        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      },
    },
    duration: '200ms',
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  },
};

// Utility functions for creating animation styles
export const createAnimation = (animationName, options = {}) => {
  const animation = animations[animationName];
  if (!animation) return {};
  
  return {
    animation: `${animationName} ${options.duration || animation.duration} ${options.easing || animation.easing} ${options.delay || '0ms'} ${options.iterationCount || animation.iterationCount || '1'} ${options.direction || 'normal'} ${options.fillMode || 'both'}`,
  };
};

export const createKeyframes = (animationName) => {
  const animation = animations[animationName];
  if (!animation || !animation.keyframes) return '';
  
  const keyframeRules = Object.entries(animation.keyframes)
    .map(([percentage, styles]) => {
      const styleRules = Object.entries(styles)
        .map(([property, value]) => `${property}: ${value}`)
        .join('; ');
      return `${percentage} { ${styleRules} }`;
    })
    .join(' ');
  
  return `@keyframes ${animationName} { ${keyframeRules} }`;
};

// CSS-in-JS animation utilities for Tailwind
export const tailwindAnimations = {
  'fade-in': 'fadeIn 300ms cubic-bezier(0, 0, 0.2, 1)',
  'fade-out': 'fadeOut 300ms cubic-bezier(0.4, 0, 1, 1)',
  'slide-in-up': 'slideInUp 300ms cubic-bezier(0, 0, 0.2, 1)',
  'slide-in-down': 'slideInDown 300ms cubic-bezier(0, 0, 0.2, 1)',
  'slide-in-left': 'slideInLeft 300ms cubic-bezier(0, 0, 0.2, 1)',
  'slide-in-right': 'slideInRight 300ms cubic-bezier(0, 0, 0.2, 1)',
  'scale-in': 'scaleIn 200ms cubic-bezier(0, 0, 0.2, 1)',
  'scale-out': 'scaleOut 200ms cubic-bezier(0.4, 0, 1, 1)',
  'bounce': 'bounce 1s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
  'spin': 'spin 1s linear infinite',
  'correct-answer': 'correctAnswer 600ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'incorrect-answer': 'incorrectAnswer 500ms cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'progress-fill': 'progressFill 800ms cubic-bezier(0, 0, 0.2, 1)',
  'button-hover': 'buttonHover 150ms cubic-bezier(0, 0, 0.2, 1)',
  'card-hover': 'cardHover 200ms cubic-bezier(0, 0, 0.2, 1)',
};

export default animations;
