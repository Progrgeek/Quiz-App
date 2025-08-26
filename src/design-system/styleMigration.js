/**
 * Style Migration Mapping
 * Week 2 - Day 8: Component Standardization
 * 
 * Maps old hardcoded styles to new design system tokens
 */

export const styleMigrationMap = {
  // Background Colors
  'bg-white': 'bg-neutral-0',
  'bg-gray-50': 'bg-neutral-50',
  'bg-gray-100': 'bg-neutral-100',
  'bg-blue-50': 'bg-primary-50',
  'bg-blue-100': 'bg-primary-100',
  'bg-green-50': 'bg-success-50',
  'bg-green-100': 'bg-success-100',
  'bg-red-50': 'bg-error-50',
  'bg-red-100': 'bg-error-100',

  // Text Colors
  'text-gray-600': 'text-neutral-600',
  'text-gray-700': 'text-neutral-700',
  'text-gray-800': 'text-neutral-800',
  'text-blue-500': 'text-primary-500',
  'text-blue-600': 'text-primary-600',
  'text-blue-700': 'text-primary-700',
  'text-green-600': 'text-success-600',
  'text-green-700': 'text-success-700',
  'text-red-600': 'text-error-600',
  'text-red-700': 'text-error-700',

  // Border Colors
  'border-gray-200': 'border-neutral-200',
  'border-gray-300': 'border-neutral-300',
  'border-gray-400': 'border-neutral-400',
  'border-blue-300': 'border-primary-300',
  'border-blue-400': 'border-primary-400',
  'border-blue-500': 'border-primary-500',
  'border-green-300': 'border-success-300',
  'border-green-500': 'border-success-500',
  'border-red-300': 'border-error-300',
  'border-red-500': 'border-error-500',

  // Button Styles
  'bg-blue-500': 'bg-primary-500',
  'bg-blue-600': 'bg-primary-600',
  'hover:bg-blue-600': 'hover:bg-primary-600',
  'hover:bg-blue-700': 'hover:bg-primary-700',
  'from-blue-500': 'from-primary-500',
  'to-blue-600': 'to-primary-600',
  'from-blue-600': 'from-primary-600',
  'to-blue-700': 'to-primary-700',

  // Disabled States
  'disabled:from-gray-400': 'disabled:from-neutral-400',
  'disabled:to-gray-500': 'disabled:to-neutral-500',
  'disabled:bg-gray-400': 'disabled:bg-neutral-400',

  // Spacing (Padding)
  'p-2': 'p-2',
  'p-3': 'p-3', 
  'p-4': 'p-4',
  'p-6': 'p-6',
  'p-8': 'p-8',
  'px-2': 'px-2',
  'px-3': 'px-3',
  'px-4': 'px-4',
  'px-6': 'px-6',
  'px-8': 'px-8',
  'py-2': 'py-2',
  'py-3': 'py-3',
  'py-4': 'py-4',

  // Spacing (Margin)
  'mb-2': 'mb-2',
  'mb-4': 'mb-4',
  'mb-6': 'mb-6',
  'mb-8': 'mb-8',
  'mt-3': 'mt-3',
  'mt-4': 'mt-4',
  'mt-6': 'mt-6',
  'mt-8': 'mt-8',
  'mt-10': 'mt-10',

  // Border Radius
  'rounded': 'rounded-base',
  'rounded-lg': 'rounded-lg',
  'rounded-xl': 'rounded-xl',
  'rounded-2xl': 'rounded-2xl',
  'rounded-full': 'rounded-full',

  // Shadows
  'shadow-sm': 'shadow-sm',
  'shadow': 'shadow-base',
  'shadow-md': 'shadow-md',
  'shadow-lg': 'shadow-lg',
  'shadow-xl': 'shadow-xl',

  // Typography
  'text-xs': 'text-xs',
  'text-sm': 'text-sm',
  'text-base': 'text-base',
  'text-lg': 'text-lg',
  'text-xl': 'text-xl',
  'text-2xl': 'text-2xl',
  'font-medium': 'font-medium',
  'font-semibold': 'font-semibold',
  'font-bold': 'font-bold',

  // Grid Layouts - Exercise Specific
  'grid-cols-1': 'grid-cols-1',
  'grid-cols-2': 'grid-cols-2', 
  'grid-cols-3': 'grid-cols-3',
  'md:grid-cols-2': 'md:grid-cols-2',
  'md:grid-cols-3': 'md:grid-cols-3',
  'lg:grid-cols-3': 'lg:grid-cols-3',
  'sm:grid-cols-2': 'sm:grid-cols-2',
  'sm:grid-cols-3': 'sm:grid-cols-3',

  // Gaps
  'gap-2': 'gap-2',
  'gap-3': 'gap-3',
  'gap-4': 'gap-4',
  'gap-6': 'gap-6',

  // Display and Layout
  'flex': 'flex',
  'block': 'block',
  'hidden': 'hidden',
  'grid': 'grid',
  'relative': 'relative',
  'absolute': 'absolute',
  'fixed': 'fixed',

  // Responsive Display
  'sm:block': 'sm:block',
  'sm:hidden': 'sm:hidden',
  'md:block': 'md:block',
  'md:hidden': 'md:hidden',
  'lg:block': 'lg:block',
  'lg:hidden': 'lg:hidden',

  // Max Width
  'max-w-3xl': 'max-w-3xl',
  'max-w-4xl': 'max-w-4xl',
  'max-w-[1000px]': 'max-w-[1000px]',
  'max-w-[1400px]': 'max-w-[1400px]'
};

/**
 * Component Pattern Mappings
 * Maps old component patterns to new standardized components
 */
export const componentPatternMap = {
  // Question Headers
  oldPattern: 'h1 className="text-lg sm:text-xl font-bold text-green-600"',
  newPattern: '<ExerciseQuestion variant="primary" level={1}>',
  
  // Option Buttons
  oldPattern2: 'button with conditional bg-blue-100 border-blue-500 classes',
  newPattern2: '<ExerciseOption selected={} correct={} incorrect={} onClick={}>',
  
  // Main Containers
  oldPattern3: 'div className="relative bg-white pt-3 sm:pt-5 px-2 sm:px-4"',
  newPattern3: '<ExerciseContainer layout="standard">',
  
  // Action Buttons
  oldPattern4: 'button className="bg-gradient-to-r from-blue-500 to-blue-600..."',
  newPattern4: '<ExerciseButton variant="primary" size="medium">',
  
  // Grid Layouts
  oldPattern5: 'div className="grid gap-4 mb-8 grid-cols-2 sm:grid-cols-3"',
  newPattern5: '<ExerciseGrid exerciseType="multiple-choice">',
  
  // Audio Controls
  oldPattern6: 'button with Volume2 icon and blue styling',
  newPattern6: '<ExerciseAudioButton onPlay={} isPlaying={} label="">'
};

/**
 * Accessibility Improvements Map
 */
export const accessibilityMap = {
  // ARIA Labels
  'button without aria-label': 'Add aria-label or aria-labelledby',
  'heading without proper level': 'Use semantic heading levels (h1, h2, h3)',
  'interactive element without role': 'Add appropriate ARIA role',
  
  // Focus Management
  'missing focus styles': 'Add focus:outline-none focus:ring-2 focus:ring-primary-500',
  'no keyboard navigation': 'Add onKeyDown handlers for arrow keys',
  'missing skip links': 'Add skip-to-content links',
  
  // Color Contrast
  'insufficient contrast': 'Ensure 4.5:1 minimum contrast ratio',
  'color-only indicators': 'Add icons or patterns for colorblind users',
  
  // Touch Targets
  'small touch targets': 'Minimum 44px height/width for touch elements',
  'close proximity': 'Adequate spacing between interactive elements'
};

/**
 * Responsive Design Patterns
 */
export const responsivePatterns = {
  // Breakpoint Strategy
  mobile: {
    layout: 'single-column',
    spacing: 'compact',
    typography: 'base-size',
    touchTargets: 'large'
  },
  
  tablet: {
    layout: 'two-column',
    spacing: 'comfortable', 
    typography: 'slightly-larger',
    touchTargets: 'comfortable'
  },
  
  desktop: {
    layout: 'multi-column',
    spacing: 'generous',
    typography: 'optimal',
    touchTargets: 'standard'
  }
};

export default {
  styleMigrationMap,
  componentPatternMap,
  accessibilityMap,
  responsivePatterns
};
