// design-system/tokens/spacing.js - Comprehensive spacing and sizing system
// Base spacing scale (rem values)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem'       // 384px
};

// Semantic spacing for common UI patterns
export const semanticSpacing = {
  // Component internal spacing
  component: {
    xs: spacing[1],      // 4px - Tight internal spacing
    sm: spacing[2],      // 8px - Small internal spacing
    md: spacing[4],      // 16px - Default internal spacing
    lg: spacing[6],      // 24px - Large internal spacing
    xl: spacing[8]       // 32px - Extra large internal spacing
  },

  // Layout spacing
  layout: {
    xs: spacing[4],      // 16px - Minimal section spacing
    sm: spacing[8],      // 32px - Small section spacing
    md: spacing[12],     // 48px - Default section spacing
    lg: spacing[16],     // 64px - Large section spacing
    xl: spacing[20],     // 80px - Extra large section spacing
    xxl: spacing[24]     // 96px - Maximum section spacing
  },

  // Exercise-specific spacing
  exercise: {
    itemGap: spacing[3],       // 12px - Gap between exercise items
    sectionGap: spacing[6],    // 24px - Gap between exercise sections
    containerPadding: spacing[6], // 24px - Exercise container padding
    feedbackMargin: spacing[4], // 16px - Feedback message margin
    buttonSpacing: spacing[4]   // 16px - Space between action buttons
  },

  // Interactive element spacing
  interactive: {
    buttonPadding: {
      x: spacing[4],     // 16px horizontal
      y: spacing[2]      // 8px vertical
    },
    inputPadding: {
      x: spacing[3],     // 12px horizontal
      y: spacing[2.5]    // 10px vertical
    },
    touchTarget: spacing[12] // 48px - Minimum touch target size
  }
};

// Border radius tokens
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px'    // Full rounded
};

// Border width tokens
export const borderWidth = {
  0: '0',
  base: '1px',
  2: '2px',
  4: '4px',
  8: '8px'
};

// Box shadow tokens
export const boxShadow = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  outline: '0 0 0 3px rgba(59, 130, 246, 0.5)'
};

// Z-index scale for layering
export const zIndex = {
  hide: -1,
  auto: 'auto',
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1020,
  banner: 1030,
  overlay: 1040,
  modal: 1050,
  popover: 1060,
  skipLink: 1070,
  toast: 1080,
  tooltip: 1090
};

// Animation and transition tokens
export const transitions = {
  duration: {
    instant: '0ms',
    fast: '150ms',
    base: '200ms',
    slow: '300ms',
    slower: '500ms'
  },
  
  easing: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
};

// Common transition presets (defined after transitions object)
transitions.presets = {
  fade: `opacity ${transitions.duration.base} ${transitions.easing.inOut}`,
  slide: `transform ${transitions.duration.base} ${transitions.easing.out}`,
  scale: `transform ${transitions.duration.fast} ${transitions.easing.out}`,
  color: `color ${transitions.duration.fast} ${transitions.easing.inOut}, background-color ${transitions.duration.fast} ${transitions.easing.inOut}`,
  all: `all ${transitions.duration.base} ${transitions.easing.inOut}`
};

// Responsive breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Container max widths
export const containerSizes = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  full: '100%'
};

// Exercise-specific sizing tokens
export const exerciseSizing = {
  // Drag and drop
  dragItem: {
    minWidth: spacing[20],  // 80px
    minHeight: spacing[12], // 48px
    maxWidth: spacing[48]   // 192px
  },
  
  // Input fields
  input: {
    height: spacing[12],    // 48px
    minWidth: spacing[20]   // 80px
  },
  
  // Buttons
  button: {
    minHeight: spacing[12], // 48px - Touch-friendly
    minWidth: spacing[20]   // 80px
  },
  
  // Cards and containers
  card: {
    minHeight: spacing[32], // 128px
    padding: spacing[6]     // 24px
  },
  
  // Exercise areas
  exerciseArea: {
    minHeight: spacing[40], // 160px
    padding: spacing[8]     // 32px
  }
};

// Grid system
export const grid = {
  columns: 12,
  gutter: spacing[6], // 24px
  margin: spacing[4], // 16px
  
  // Common column spans
  spans: {
    quarter: 3,   // 25%
    third: 4,     // 33.33%
    half: 6,      // 50%
    twoThirds: 8, // 66.66%
    full: 12      // 100%
  }
};

// Aspect ratios for media and containers
export const aspectRatios = {
  square: '1 / 1',
  video: '16 / 9',
  wide: '21 / 9',
  portrait: '3 / 4',
  landscape: '4 / 3'
};

// Export all spacing and sizing tokens
export default {
  spacing,
  semantic: semanticSpacing,
  borderRadius,
  borderWidth,
  boxShadow,
  zIndex,
  transitions,
  breakpoints,
  containerSizes,
  exercise: exerciseSizing,
  grid,
  aspectRatios
};
