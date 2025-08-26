/**
 * Schema Validator - Universal Exercise Validation System
 * 
 * This validator ensures all exercise data conforms to the Universal Exercise Schema
 * while providing helpful error messages and type safety.
 */

import { z } from 'zod';

/**
 * Zod Schema Definitions
 */

// Localized Text Schema
const LocalizedTextSchema = z.object({
  en: z.string().min(1, "English text is required"),
  es: z.string().optional(),
  fr: z.string().optional(),
  ar: z.string().optional(),
  _metadata: z.object({
    isRTL: z.boolean().default(false),
    hasRichText: z.boolean().default(false),
    voiceInstructions: z.object({}).optional()
  }).optional()
}).strict();

// Accessibility Schema
const AccessibilitySchema = z.object({
  screenReader: z.boolean().default(true),
  highContrast: z.boolean().default(true),
  keyboardOnly: z.boolean().default(true),
  audioRequired: z.boolean().default(false),
  visualRequired: z.boolean().default(true)
}).strict();

// Exercise Configuration Schema
const ConfigurationSchema = z.object({
  requiredSelections: z.number().min(1).optional(),
  allowMultipleAttempts: z.boolean().default(true),
  showHintsAfterMistakes: z.boolean().default(true),
  timeLimit: z.number().positive().optional(),
  autoAdvance: z.boolean().default(false)
}).strict();

// Exercise Metadata Schema
const ExerciseMetadataSchema = z.object({
  id: z.string().uuid("ID must be a valid UUID"),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, "Version must follow semantic versioning (e.g., 1.0.0)"),
  type: z.enum([
    'multiple-answers',
    'multiple-choice', 
    'single-answer',
    'click-to-change',
    'drag-drop',
    'fill-blanks',
    'gap-fill',
    'highlight',
    'sequencing',
    'syllable-counting',
    'table-exercise',
    'rhyme-exercises'
  ]),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
  subjects: z.array(z.string()).min(1, "At least one subject is required"),
  topics: z.array(z.string()).min(1, "At least one topic is required"),
  learningObjectives: z.array(z.string()).min(1, "At least one learning objective is required"),
  estimatedTime: z.number().min(30).max(3600, "Estimated time should be between 30 seconds and 1 hour"),
  language: z.string().length(2, "Language must be a 2-letter ISO 639-1 code"),
  culturalContext: z.string().optional(),
  accessibility: AccessibilitySchema,
  configuration: ConfigurationSchema
}).strict();

// Media Content Schema
const MediaContentSchema = z.object({
  type: z.enum(['image', 'audio', 'video']),
  url: z.string().url("Media URL must be valid"),
  alt: LocalizedTextSchema,
  caption: LocalizedTextSchema.optional(),
  metadata: z.object({}).optional()
}).strict();

// Option Content Schema
const OptionContentSchema = z.object({
  text: LocalizedTextSchema.optional(),
  image: z.object({
    url: z.string().url("Image URL must be valid"),
    alt: LocalizedTextSchema,
    caption: LocalizedTextSchema.optional()
  }).optional(),
  audio: z.object({
    url: z.string().url("Audio URL must be valid"),
    transcript: LocalizedTextSchema,
    autoPlay: z.boolean().default(false)
  }).optional(),
  richContent: z.any().optional()
}).strict();

// Option Metadata Schema
const OptionMetadataSchema = z.object({
  isCorrect: z.boolean().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).default([]),
  weight: z.number().min(0).max(10).default(1),
  difficulty: z.number().min(1).max(10).default(5),
  
  // Exercise-specific metadata
  shouldCapitalize: z.boolean().optional(),
  isPronoun: z.boolean().optional(),
  endSound: z.string().optional(),
  syllableCount: z.number().positive().optional(),
  sequence: z.number().optional()
}).strict();

// Option Presentation Schema
const OptionPresentationSchema = z.object({
  style: z.string().optional(),
  position: z.object({
    x: z.number().optional(),
    y: z.number().optional()
  }).optional(),
  size: z.enum(['small', 'medium', 'large']).default('medium'),
  prominence: z.enum(['primary', 'secondary', 'tertiary']).default('primary')
}).strict();

// Universal Option Schema
const UniversalOptionSchema = z.object({
  id: z.string().min(1, "Option ID is required"),
  content: OptionContentSchema,
  metadata: OptionMetadataSchema,
  presentation: OptionPresentationSchema.optional()
}).strict();

// Interaction Element Schema
const InteractionElementSchema = z.object({
  type: z.string().min(1, "Interaction type is required"),
  config: z.object({}).default({}),
  validation: z.object({}).optional()
}).strict();

// Exercise Content Schema
const ExerciseContentSchema = z.object({
  question: LocalizedTextSchema,
  instruction: LocalizedTextSchema.optional(),
  context: LocalizedTextSchema.optional(),
  elements: z.object({
    options: z.array(UniversalOptionSchema).min(1, "At least one option is required"),
    media: z.array(MediaContentSchema).default([]),
    interactions: z.array(InteractionElementSchema).default([])
  }).strict(),
  customContent: z.any().optional()
}).strict();

// Solution Schema
const SolutionSchema = z.object({
  correct: z.any(), // Flexible to accommodate different answer formats
  explanation: LocalizedTextSchema,
  hints: z.array(LocalizedTextSchema).default([]),
  alternatives: z.array(z.object({
    answer: z.any(),
    explanation: LocalizedTextSchema
  })).default([]),
  partialCredit: z.boolean().default(false),
  scoringRules: z.object({
    fullCredit: z.number().min(0).default(100),
    partialCredit: z.number().min(0).default(50),
    penalty: z.number().min(0).default(0)
  }).optional()
}).strict();

// Responsive Configuration Schema
const ResponsiveConfigSchema = z.object({
  breakpoints: z.object({
    mobile: z.string().default('0px'),
    tablet: z.string().default('768px'),
    desktop: z.string().default('1024px')
  }),
  layouts: z.object({
    mobile: z.string().default('list'),
    tablet: z.string().default('grid'),
    desktop: z.string().default('grid')
  }),
  columns: z.object({
    mobile: z.number().min(1).default(1),
    tablet: z.number().min(1).default(2),
    desktop: z.number().min(1).default(3)
  })
}).strict();

// Theme Configuration Schema
const ThemeConfigSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Primary color must be a valid hex color").optional(),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Accent color must be a valid hex color").optional(),
  spacing: z.enum(['compact', 'normal', 'spacious']).default('normal'),
  borderRadius: z.enum(['none', 'small', 'medium', 'large']).default('medium'),
  elevation: z.enum(['none', 'small', 'medium', 'large']).default('small')
}).strict();

// Animation Configuration Schema
const AnimationConfigSchema = z.object({
  enabled: z.boolean().default(true),
  duration: z.enum(['fast', 'normal', 'slow']).default('normal'),
  easing: z.string().default('ease-in-out')
}).strict();

// Presentation Schema
const PresentationSchema = z.object({
  layout: z.enum(['grid', 'list', 'table', 'carousel', 'masonry', 'custom']).default('grid'),
  variants: z.array(z.enum(['compact', 'standard', 'expanded'])).default(['standard']),
  responsive: ResponsiveConfigSchema,
  theme: ThemeConfigSchema.optional(),
  animations: AnimationConfigSchema.optional()
}).strict();

// Complete Universal Exercise Schema
const UniversalExerciseSchema = z.object({
  metadata: ExerciseMetadataSchema,
  content: ExerciseContentSchema,
  solution: SolutionSchema,
  presentation: PresentationSchema
}).strict();

/**
 * Exercise Validator Class
 */
export class ExerciseValidator {
  constructor() {
    this.schema = UniversalExerciseSchema;
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Validate a complete exercise
   * @param {Object} exercise - Exercise data to validate
   * @returns {Object} Validation result with success status and errors
   */
  validateExercise(exercise) {
    this.clearErrors();
    
    try {
      const validatedExercise = this.schema.parse(exercise);
      
      // Additional business logic validation
      this.validateBusinessRules(validatedExercise);
      
      return {
        success: this.errors.length === 0,
        data: validatedExercise,
        errors: this.errors,
        warnings: this.warnings
      };
    } catch (error) {
      if (error instanceof z.ZodError) {
        this.errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
          code: err.code
        }));
      } else {
        this.errors.push({
          path: 'unknown',
          message: error.message,
          code: 'UNKNOWN_ERROR'
        });
      }
      
      return {
        success: false,
        data: null,
        errors: this.errors,
        warnings: this.warnings
      };
    }
  }

  /**
   * Validate business rules specific to exercise types
   * @param {Object} exercise - Validated exercise data
   */
  validateBusinessRules(exercise) {
    const { metadata, content, solution } = exercise;
    
    // Validate required selections match correct answers
    if (metadata.configuration.requiredSelections) {
      const correctCount = Array.isArray(solution.correct) 
        ? solution.correct.length 
        : (solution.correct ? 1 : 0);
      
      if (metadata.configuration.requiredSelections !== correctCount) {
        this.warnings.push({
          path: 'metadata.configuration.requiredSelections',
          message: `Required selections (${metadata.configuration.requiredSelections}) doesn't match correct answers count (${correctCount})`,
          code: 'SELECTION_MISMATCH'
        });
      }
    }
    
    // Validate exercise type specific rules
    switch (metadata.type) {
      case 'multiple-answers':
      case 'multiple-choice':
        this.validateMultipleChoiceRules(exercise);
        break;
      case 'drag-drop':
        this.validateDragDropRules(exercise);
        break;
      case 'click-to-change':
        this.validateClickToChangeRules(exercise);
        break;
      // Add more exercise type validations as needed
    }
  }

  /**
   * Validate multiple choice specific rules
   */
  validateMultipleChoiceRules(exercise) {
    const { content } = exercise;
    const correctOptions = content.elements.options.filter(opt => opt.metadata.isCorrect);
    
    if (correctOptions.length === 0) {
      this.errors.push({
        path: 'content.elements.options',
        message: 'Multiple choice exercises must have at least one correct option',
        code: 'NO_CORRECT_OPTIONS'
      });
    }
    
    // Ensure all options have required content
    content.elements.options.forEach((option, index) => {
      if (!option.content.text && !option.content.image) {
        this.errors.push({
          path: `content.elements.options[${index}].content`,
          message: 'Option must have either text or image content',
          code: 'MISSING_CONTENT'
        });
      }
    });
  }

  /**
   * Validate drag and drop specific rules
   */
  validateDragDropRules(exercise) {
    const { content } = exercise;
    const categories = new Set();
    
    content.elements.options.forEach((option, index) => {
      if (!option.metadata.category) {
        this.errors.push({
          path: `content.elements.options[${index}].metadata.category`,
          message: 'Drag and drop options must have a category',
          code: 'MISSING_CATEGORY'
        });
      } else {
        categories.add(option.metadata.category);
      }
    });
    
    if (categories.size < 2) {
      this.warnings.push({
        path: 'content.elements.options',
        message: 'Drag and drop exercises typically have multiple categories',
        code: 'FEW_CATEGORIES'
      });
    }
  }

  /**
   * Validate click to change specific rules
   */
  validateClickToChangeRules(exercise) {
    const { content } = exercise;
    const clickableOptions = content.elements.options.filter(
      opt => opt.metadata.shouldCapitalize || opt.metadata.isPronoun
    );
    
    if (clickableOptions.length === 0) {
      this.errors.push({
        path: 'content.elements.options',
        message: 'Click to change exercises must have at least one clickable option',
        code: 'NO_CLICKABLE_OPTIONS'
      });
    }
  }

  /**
   * Validate exercise against a specific exercise type schema
   * @param {Object} exercise - Exercise data
   * @param {string} exerciseType - Type of exercise to validate against
   * @returns {Object} Validation result
   */
  validateExerciseType(exercise, exerciseType) {
    // First validate against universal schema
    const universalResult = this.validateExercise(exercise);
    
    if (!universalResult.success) {
      return universalResult;
    }
    
    // Then validate against exercise type specific rules
    // This can be extended for more specific validations per exercise type
    return universalResult;
  }

  /**
   * Clear all errors and warnings
   */
  clearErrors() {
    this.errors = [];
    this.warnings = [];
  }

  /**
   * Get formatted error messages
   * @returns {string} Formatted error messages
   */
  getFormattedErrors() {
    if (this.errors.length === 0) return '';
    
    return this.errors.map(error => 
      `${error.path}: ${error.message}`
    ).join('\n');
  }

  /**
   * Get formatted warning messages
   * @returns {string} Formatted warning messages
   */
  getFormattedWarnings() {
    if (this.warnings.length === 0) return '';
    
    return this.warnings.map(warning => 
      `${warning.path}: ${warning.message}`
    ).join('\n');
  }
}

/**
 * Convenience function to validate an exercise
 * @param {Object} exercise - Exercise data to validate
 * @returns {Object} Validation result
 */
export function validateExercise(exercise) {
  const validator = new ExerciseValidator();
  return validator.validateExercise(exercise);
}

/**
 * Convenience function to validate multiple exercises
 * @param {Array} exercises - Array of exercise data to validate
 * @returns {Array} Array of validation results
 */
export function validateExercises(exercises) {
  const validator = new ExerciseValidator();
  return exercises.map(exercise => validator.validateExercise(exercise));
}

export default ExerciseValidator;
