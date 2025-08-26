// design-system/tokens/index.js - Unified design token exports
import colors from './colors.js';
import typography from './typography.js';
import spacing from './spacing.js';

// Motion and animation tokens
export const motion = {
  duration: spacing.transitions.duration,
  easing: spacing.transitions.easing,
  presets: spacing.transitions.presets
};

// Theme configuration
export const themes = {
  light: {
    colors: colors.themes.light,
    name: 'light',
    displayName: 'Light Theme'
  },
  dark: {
    colors: colors.themes.dark,
    name: 'dark',
    displayName: 'Dark Theme'
  },
  highContrast: {
    colors: colors.themes.highContrast,
    name: 'highContrast',
    displayName: 'High Contrast'
  }
};

// Component-specific token collections
export const componentTokens = {
  button: {
    padding: {
      sm: `${spacing.semantic.interactive.buttonPadding.y} ${spacing.semantic.interactive.buttonPadding.x}`,
      md: `${spacing.spacing[3]} ${spacing.spacing[6]}`,
      lg: `${spacing.spacing[4]} ${spacing.spacing[8]}`
    },
    borderRadius: spacing.borderRadius.md,
    fontSize: {
      sm: typography.presets.buttonSmall.fontSize,
      md: typography.presets.button.fontSize,
      lg: typography.presets.buttonLarge.fontSize
    },
    fontWeight: typography.presets.button.fontWeight,
    transition: motion.presets.all,
    minHeight: spacing.exercise.button.minHeight,
    minWidth: spacing.exercise.button.minWidth
  },

  input: {
    padding: `${spacing.semantic.interactive.inputPadding.y} ${spacing.semantic.interactive.inputPadding.x}`,
    borderRadius: spacing.borderRadius.md,
    borderWidth: spacing.borderWidth.base,
    fontSize: typography.presets.body.fontSize,
    fontFamily: typography.families.sans,
    height: spacing.exercise.input.height,
    minWidth: spacing.exercise.input.minWidth,
    transition: motion.presets.color
  },

  card: {
    padding: spacing.exercise.card.padding,
    borderRadius: spacing.borderRadius.lg,
    shadow: spacing.boxShadow.md,
    minHeight: spacing.exercise.card.minHeight,
    transition: motion.presets.all
  },

  exercise: {
    containerPadding: spacing.semantic.exercise.containerPadding,
    itemGap: spacing.semantic.exercise.itemGap,
    sectionGap: spacing.semantic.exercise.sectionGap,
    feedbackMargin: spacing.semantic.exercise.feedbackMargin,
    buttonSpacing: spacing.semantic.exercise.buttonSpacing,
    areaMinHeight: spacing.exercise.exerciseArea.minHeight,
    areaPadding: spacing.exercise.exerciseArea.padding
  },

  typography: {
    heading: typography.presets.exerciseTitle,
    instruction: typography.presets.exerciseInstruction,
    content: typography.presets.exerciseContent,
    feedback: typography.presets.exerciseFeedback
  }
};

// Responsive design tokens
export const responsive = {
  breakpoints: spacing.breakpoints,
  containers: spacing.containerSizes,
  typography: typography.responsive,
  grid: spacing.grid
};

// Accessibility tokens
export const accessibility = {
  minTouchTarget: spacing.semantic.interactive.touchTarget,
  focusRing: {
    width: spacing.borderWidth[2],
    offset: spacing.spacing[0.5],
    color: colors.semantic.border.focus,
    style: 'solid'
  },
  typography: typography.accessibility,
  colors: {
    contrast: colors.themes.highContrast,
    contrastRatios: typography.accessibility.contrastRatios
  }
};

// Animation presets for common UI patterns
export const animations = {
  fadeIn: {
    from: { opacity: 0 },
    to: { opacity: 1 },
    duration: motion.duration.base,
    easing: motion.easing.out
  },
  slideUp: {
    from: { transform: 'translateY(1rem)', opacity: 0 },
    to: { transform: 'translateY(0)', opacity: 1 },
    duration: motion.duration.base,
    easing: motion.easing.out
  },
  scaleIn: {
    from: { transform: 'scale(0.95)', opacity: 0 },
    to: { transform: 'scale(1)', opacity: 1 },
    duration: motion.duration.fast,
    easing: motion.easing.out
  },
  bounce: {
    from: { transform: 'scale(1)' },
    to: { transform: 'scale(1.1)' },
    duration: motion.duration.fast,
    easing: motion.easing.bounce,
    direction: 'alternate',
    iterations: 2
  }
};

// Export individual token categories
export { colors, typography, spacing };

// Export unified token object
export const tokens = {
  colors,
  typography,
  spacing,
  motion,
  themes,
  components: componentTokens,
  responsive,
  accessibility,
  animations
};

// Default export
export default tokens;
