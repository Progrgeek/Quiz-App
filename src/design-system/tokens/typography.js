// design-system/tokens/typography.js - Comprehensive typography system
export const fontFamilies = {
  sans: [
    'Inter',
    '-apple-system',
    'BlinkMacSystemFont',
    '"Segoe UI"',
    'Roboto',
    '"Helvetica Neue"',
    'Arial',
    'sans-serif',
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"'
  ],
  serif: [
    'ui-serif',
    'Georgia',
    'Cambria',
    '"Times New Roman"',
    'Times',
    'serif'
  ],
  mono: [
    'ui-monospace',
    'SFMono-Regular',
    '"SF Mono"',
    'Consolas',
    '"Liberation Mono"',
    'Menlo',
    'monospace'
  ],
  display: [
    '"Fredoka One"',
    'cursive',
    'system-ui'
  ]
};

// Font size scale (rem values)
export const fontSizes = {
  xs: '0.75rem',    // 12px
  sm: '0.875rem',   // 14px
  base: '1rem',     // 16px
  lg: '1.125rem',   // 18px
  xl: '1.25rem',    // 20px
  '2xl': '1.5rem',  // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem', // 36px
  '5xl': '3rem',    // 48px
  '6xl': '3.75rem', // 60px
  '7xl': '4.5rem',  // 72px
  '8xl': '6rem',    // 96px
  '9xl': '8rem'     // 128px
};

// Font weights
export const fontWeights = {
  thin: '100',
  extralight: '200',
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
  black: '900'
};

// Line heights
export const lineHeights = {
  none: '1',
  tight: '1.25',
  snug: '1.375',
  normal: '1.5',
  relaxed: '1.625',
  loose: '2',
  3: '.75rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem'
};

// Letter spacing
export const letterSpacing = {
  tighter: '-0.05em',
  tight: '-0.025em',
  normal: '0em',
  wide: '0.025em',
  wider: '0.05em',
  widest: '0.1em'
};

// Typography presets for common text styles
export const typographyPresets = {
  // Headings
  h1: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['4xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight
  },
  h2: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['3xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.tight
  },
  h3: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal
  },
  h4: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xl,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
    letterSpacing: letterSpacing.normal
  },
  h5: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal
  },
  h6: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal
  },

  // Body text
  bodyLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal
  },
  body: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal
  },
  bodySmall: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal
  },

  // Labels and UI text
  label: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide
  },
  caption: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.wide
  },
  overline: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.widest,
    textTransform: 'uppercase'
  },

  // Interactive elements
  button: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.normal
  },
  buttonSmall: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.normal
  },
  buttonLarge: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.none,
    letterSpacing: letterSpacing.normal
  },

  // Exercise-specific typography
  exerciseTitle: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.normal
  },
  exerciseInstruction: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal
  },
  exerciseContent: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.base,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal
  },
  exerciseFeedback: {
    fontFamily: fontFamilies.sans,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal
  },

  // Code and monospace
  code: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
    letterSpacing: letterSpacing.normal
  },
  codeBlock: {
    fontFamily: fontFamilies.mono,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal
  }
};

// Responsive typography utilities
export const responsiveTypography = {
  // Mobile-first breakpoint adjustments
  mobile: {
    h1: {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight
    },
    h2: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight
    },
    h3: {
      fontSize: fontSizes.lg,
      lineHeight: lineHeights.snug
    },
    exerciseTitle: {
      fontSize: fontSizes.xl,
      lineHeight: lineHeights.tight
    }
  },
  
  tablet: {
    h1: {
      fontSize: fontSizes['3xl'],
      lineHeight: lineHeights.tight
    },
    h2: {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight
    },
    exerciseTitle: {
      fontSize: fontSizes['2xl'],
      lineHeight: lineHeights.tight
    }
  },

  desktop: {
    // Desktop uses the default preset values
    ...typographyPresets
  }
};

// Accessibility considerations
export const accessibilityTypography = {
  // Minimum contrast ratios (WCAG AA)
  contrastRatios: {
    normal: 4.5,
    large: 3.0
  },
  
  // Minimum font sizes for accessibility
  minimumSizes: {
    body: '16px',
    interactive: '16px',
    label: '14px'
  },
  
  // Maximum line lengths for readability
  maxLineLength: {
    characters: 75,
    words: 12
  },
  
  // High contrast mode adjustments
  highContrast: {
    fontWeight: fontWeights.semibold, // Increase weight for better visibility
    letterSpacing: letterSpacing.wide // Increase spacing for clarity
  }
};

// Export all typography tokens
export default {
  families: fontFamilies,
  sizes: fontSizes,
  weights: fontWeights,
  lineHeights,
  letterSpacing,
  presets: typographyPresets,
  responsive: responsiveTypography,
  accessibility: accessibilityTypography
};
