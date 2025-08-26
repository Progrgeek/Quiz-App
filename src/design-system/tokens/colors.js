// design-system/tokens/colors.js - Comprehensive color system with semantic tokens
export const colorTokens = {
  // Base color palette
  base: {
    white: '#FFFFFF',
    black: '#000000',
    transparent: 'transparent',
    current: 'currentColor'
  },

  // Gray scale
  gray: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
    950: '#0A0A0A'
  },

  // Primary colors (Quiz app brand)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
    950: '#172554'
  },

  // Secondary colors (Supporting elements)
  secondary: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D',
    950: '#052E16'
  },

  // Accent colors (Highlights and CTAs)
  accent: {
    50: '#FFF7ED',
    100: '#FFEDD5',
    200: '#FED7AA',
    300: '#FDBA74',
    400: '#FB923C',
    500: '#F97316',
    600: '#EA580C',
    700: '#C2410C',
    800: '#9A3412',
    900: '#7C2D12',
    950: '#431407'
  },

  // Success states
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    200: '#BBF7D0',
    300: '#86EFAC',
    400: '#4ADE80',
    500: '#22C55E',
    600: '#16A34A',
    700: '#15803D',
    800: '#166534',
    900: '#14532D'
  },

  // Warning states
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    200: '#FDE68A',
    300: '#FCD34D',
    400: '#FBBF24',
    500: '#F59E0B',
    600: '#D97706',
    700: '#B45309',
    800: '#92400E',
    900: '#78350F'
  },

  // Error states
  error: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    200: '#FECACA',
    300: '#FCA5A5',
    400: '#F87171',
    500: '#EF4444',
    600: '#DC2626',
    700: '#B91C1C',
    800: '#991B1B',
    900: '#7F1D1D'
  },

  // Info states
  info: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A'
  }
};

// Semantic color tokens for application contexts
export const semanticColors = {
  // Text colors
  text: {
    primary: colorTokens.gray[900],
    secondary: colorTokens.gray[600],
    tertiary: colorTokens.gray[500],
    disabled: colorTokens.gray[400],
    inverse: colorTokens.base.white,
    link: colorTokens.primary[600],
    linkHover: colorTokens.primary[700],
    success: colorTokens.success[700],
    warning: colorTokens.warning[700],
    error: colorTokens.error[700],
    info: colorTokens.info[700]
  },

  // Background colors
  background: {
    primary: colorTokens.base.white,
    secondary: colorTokens.gray[50],
    tertiary: colorTokens.gray[100],
    inverse: colorTokens.gray[900],
    overlay: 'rgba(0, 0, 0, 0.5)',
    success: colorTokens.success[50],
    warning: colorTokens.warning[50],
    error: colorTokens.error[50],
    info: colorTokens.info[50]
  },

  // Border colors
  border: {
    primary: colorTokens.gray[200],
    secondary: colorTokens.gray[300],
    focus: colorTokens.primary[500],
    success: colorTokens.success[300],
    warning: colorTokens.warning[300],
    error: colorTokens.error[300],
    info: colorTokens.info[300]
  },

  // Interactive states
  interactive: {
    primary: {
      default: colorTokens.primary[600],
      hover: colorTokens.primary[700],
      active: colorTokens.primary[800],
      disabled: colorTokens.gray[300],
      focus: colorTokens.primary[500]
    },
    secondary: {
      default: colorTokens.secondary[600],
      hover: colorTokens.secondary[700],
      active: colorTokens.secondary[800],
      disabled: colorTokens.gray[300],
      focus: colorTokens.secondary[500]
    },
    accent: {
      default: colorTokens.accent[500],
      hover: colorTokens.accent[600],
      active: colorTokens.accent[700],
      disabled: colorTokens.gray[300],
      focus: colorTokens.accent[400]
    }
  },

  // Exercise-specific colors
  exercise: {
    correct: {
      background: colorTokens.success[100],
      border: colorTokens.success[300],
      text: colorTokens.success[800]
    },
    incorrect: {
      background: colorTokens.error[100],
      border: colorTokens.error[300],
      text: colorTokens.error[800]
    },
    neutral: {
      background: colorTokens.gray[100],
      border: colorTokens.gray[300],
      text: colorTokens.gray[700]
    },
    highlight: {
      background: colorTokens.accent[100],
      border: colorTokens.accent[300],
      text: colorTokens.accent[800]
    },
    selected: {
      background: colorTokens.primary[100],
      border: colorTokens.primary[400],
      text: colorTokens.primary[800]
    }
  }
};

// Dark theme color overrides
export const darkThemeColors = {
  text: {
    primary: colorTokens.gray[100],
    secondary: colorTokens.gray[300],
    tertiary: colorTokens.gray[400],
    disabled: colorTokens.gray[600],
    inverse: colorTokens.gray[900],
    link: colorTokens.primary[400],
    linkHover: colorTokens.primary[300]
  },
  background: {
    primary: colorTokens.gray[900],
    secondary: colorTokens.gray[800],
    tertiary: colorTokens.gray[700],
    inverse: colorTokens.base.white,
    overlay: 'rgba(255, 255, 255, 0.1)'
  },
  border: {
    primary: colorTokens.gray[700],
    secondary: colorTokens.gray[600],
    focus: colorTokens.primary[400]
  }
};

// High contrast theme for accessibility
export const highContrastColors = {
  text: {
    primary: colorTokens.base.black,
    secondary: colorTokens.gray[800],
    inverse: colorTokens.base.white,
    link: '#0000EE',
    linkHover: '#0000CC'
  },
  background: {
    primary: colorTokens.base.white,
    secondary: colorTokens.gray[100],
    inverse: colorTokens.base.black
  },
  border: {
    primary: colorTokens.base.black,
    secondary: colorTokens.gray[800],
    focus: '#FF0000'
  },
  interactive: {
    primary: {
      default: '#0000EE',
      hover: '#0000CC',
      active: '#000088',
      focus: '#FF0000'
    }
  }
};

// Export all color systems
export default {
  base: colorTokens,
  semantic: semanticColors,
  themes: {
    light: semanticColors,
    dark: darkThemeColors,
    highContrast: highContrastColors
  }
};
