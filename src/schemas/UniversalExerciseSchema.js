/**
 * Universal Exercise Schema - v1.0.0
 * 
 * This schema provides a flexible, universal structure that can accommodate
 * any knowledge domain while preserving the original UI and functionality
 * of all existing exercise types.
 * 
 * Design Philosophy:
 * - Preserve existing functionality and UI
 * - Support all current exercise types
 * - Enable future extensibility
 * - Maintain backward compatibility
 */

/**
 * Core Exercise Metadata Schema
 * Contains all the metadata about an exercise
 */
export const ExerciseMetadataSchema = {
  // Core identification
  id: 'string',                    // Unique identifier (UUID recommended)
  version: 'string',               // Semantic version (e.g., "1.0.0")
  type: 'string',                  // Exercise type identifier
  
  // Educational metadata
  difficulty: 'string',            // "beginner" | "intermediate" | "advanced"
  subjects: ['string'],            // Array of subjects (e.g., ["English", "Phonics"])
  topics: ['string'],              // Array of topics (e.g., ["Rhyming", "Synonyms"])
  learningObjectives: ['string'],  // Array of learning objectives
  estimatedTime: 'number',         // Estimated completion time in seconds
  
  // Internationalization
  language: 'string',              // ISO 639-1 language code (e.g., "en", "es")
  culturalContext: 'string',       // Optional cultural context identifier
  
  // Accessibility metadata
  accessibility: {
    screenReader: 'boolean',       // Screen reader compatible
    highContrast: 'boolean',       // High contrast mode support
    keyboardOnly: 'boolean',       // Full keyboard navigation support
    audioRequired: 'boolean',      // Requires audio capability
    visualRequired: 'boolean'      // Requires visual capability
  },
  
  // Exercise configuration
  configuration: {
    requiredSelections: 'number',  // How many items must be selected
    allowMultipleAttempts: 'boolean',
    showHintsAfterMistakes: 'boolean',
    timeLimit: 'number',           // Optional time limit in seconds
    autoAdvance: 'boolean'         // Auto-advance to next question
  }
};

/**
 * Localized Text Schema
 * Supports multiple languages and RTL text
 */
export const LocalizedTextSchema = {
  en: 'string',                    // English text (required as fallback)
  es: 'string',                    // Spanish text (optional)
  fr: 'string',                    // French text (optional)
  ar: 'string',                    // Arabic text (optional, RTL)
  // Add more languages as needed
  
  // RTL support metadata
  _metadata: {
    isRTL: 'boolean',              // Text direction
    hasRichText: 'boolean',        // Contains HTML/markdown
    voiceInstructions: 'object'    // Voice-specific pronunciation guides
  }
};

/**
 * Universal Option Schema
 * Supports all types of interactive elements
 */
export const UniversalOptionSchema = {
  // Core identification
  id: 'string',                    // Unique option identifier
  
  // Content (flexible based on exercise type)
  content: {
    text: 'LocalizedText',         // Text content (for word-based exercises)
    image: {
      url: 'string',               // Image URL
      alt: 'LocalizedText',        // Alt text for accessibility
      caption: 'LocalizedText'     // Optional caption
    },
    audio: {
      url: 'string',               // Audio file URL
      transcript: 'LocalizedText', // Audio transcript
      autoPlay: 'boolean'          // Should auto-play
    },
    richContent: 'any'             // For complex content (HTML, interactive elements)
  },
  
  // Answer metadata
  metadata: {
    isCorrect: 'boolean',          // Is this a correct answer
    category: 'string',            // Category for drag-drop exercises
    tags: ['string'],              // Tags for filtering/grouping
    weight: 'number',              // For weighted scoring
    difficulty: 'number',          // Individual option difficulty (1-10)
    
    // Exercise-specific metadata
    shouldCapitalize: 'boolean',   // For click-to-change exercises
    isPronoun: 'boolean',          // For grammar exercises
    endSound: 'string',            // For rhyming exercises
    syllableCount: 'number',       // For syllable counting
    sequence: 'number'             // For sequencing exercises
  },
  
  // Presentation hints
  presentation: {
    style: 'string',               // Custom CSS classes
    position: 'object',            // For positioning in drag-drop
    size: 'string',                // "small" | "medium" | "large"
    prominence: 'string'           // "primary" | "secondary" | "tertiary"
  }
};

/**
 * Exercise Content Schema
 * Contains all the actual content of the exercise
 */
export const ExerciseContentSchema = {
  // Main question/instruction
  question: 'LocalizedText',       // The main question text
  instruction: 'LocalizedText',    // How to complete the exercise
  context: 'LocalizedText',        // Optional background context
  
  // Interactive elements
  elements: {
    options: ['UniversalOption'],  // Array of selectable options
    media: [{                      // Additional media content
      type: 'string',              // "image" | "audio" | "video"
      url: 'string',               // Media URL
      alt: 'LocalizedText',        // Accessibility text
      caption: 'LocalizedText',    // Optional caption
      metadata: 'object'           // Additional metadata
    }],
    interactions: [{               // Custom interaction elements
      type: 'string',              // Type of interaction
      config: 'object',            // Configuration for the interaction
      validation: 'object'         // Validation rules
    }]
  },
  
  // Exercise-specific content
  customContent: 'any'             // For exercise-specific content that doesn't fit standard schema
};

/**
 * Solution Schema
 * Defines the correct answer and feedback
 */
export const SolutionSchema = {
  // Correct answer (flexible format)
  correct: 'any',                  // Can be array, object, string, number based on exercise type
  
  // Feedback content
  explanation: 'LocalizedText',    // Explanation of the correct answer
  hints: ['LocalizedText'],        // Progressive hints
  
  // Alternative answers
  alternatives: [{                 // Alternative correct answers
    answer: 'any',                 // Alternative answer format
    explanation: 'LocalizedText'   // Why this is also correct
  }],
  
  // Scoring
  partialCredit: 'boolean',        // Allow partial credit
  scoringRules: {                  // Custom scoring rules
    fullCredit: 'number',          // Points for completely correct
    partialCredit: 'number',       // Points for partially correct
    penalty: 'number'              // Points deducted for wrong answers
  }
};

/**
 * Presentation Schema
 * Defines how the exercise should be displayed
 */
export const PresentationSchema = {
  // Layout configuration
  layout: 'string',                // "grid" | "list" | "table" | "carousel" | "masonry" | "custom"
  variants: ['string'],            // ["compact", "standard", "expanded"]
  
  // Responsive configuration
  responsive: {
    breakpoints: {
      mobile: 'string',            // Mobile breakpoint (e.g., "0px")
      tablet: 'string',            // Tablet breakpoint (e.g., "768px")
      desktop: 'string'            // Desktop breakpoint (e.g., "1024px")
    },
    layouts: {
      mobile: 'string',            // Layout for mobile
      tablet: 'string',            // Layout for tablet
      desktop: 'string'            // Layout for desktop
    },
    columns: {
      mobile: 'number',            // Number of columns on mobile
      tablet: 'number',            // Number of columns on tablet
      desktop: 'number'            // Number of columns on desktop
    }
  },
  
  // Theme configuration
  theme: {
    primaryColor: 'string',        // Primary color (e.g., "#3B82F6")
    accentColor: 'string',         // Accent color
    spacing: 'string',             // "compact" | "normal" | "spacious"
    borderRadius: 'string',        // "none" | "small" | "medium" | "large"
    elevation: 'string'            // "none" | "small" | "medium" | "large"
  },
  
  // Animation preferences
  animations: {
    enabled: 'boolean',            // Enable animations
    duration: 'string',            // "fast" | "normal" | "slow"
    easing: 'string'               // CSS easing function
  }
};

/**
 * Complete Universal Exercise Schema
 * Combines all sub-schemas into a complete exercise definition
 */
export const UniversalExerciseSchema = {
  metadata: 'ExerciseMetadata',
  content: 'ExerciseContent',
  solution: 'Solution',
  presentation: 'Presentation'
};

/**
 * Exercise Type Mappings
 * Maps current exercise types to their schema configurations
 */
export const ExerciseTypeMappings = {
  // Multiple Answers exercises
  'multiple-answers': {
    requiredFields: ['content.question', 'content.elements.options', 'solution.correct'],
    defaultLayout: 'grid',
    supportedLayouts: ['grid', 'list'],
    selectionMode: 'multiple'
  },
  
  // Click to Change exercises
  'click-to-change': {
    requiredFields: ['content.question', 'content.elements.options'],
    defaultLayout: 'list',
    supportedLayouts: ['list'],
    selectionMode: 'multiple',
    interaction: 'click-toggle'
  },
  
  // Drag and Drop exercises
  'drag-drop': {
    requiredFields: ['content.question', 'content.elements.options'],
    defaultLayout: 'grid',
    supportedLayouts: ['grid', 'table'],
    selectionMode: 'drag',
    interaction: 'drag-drop'
  },
  
  // Fill in the Blanks exercises
  'fill-blanks': {
    requiredFields: ['content.question', 'content.elements.options'],
    defaultLayout: 'list',
    supportedLayouts: ['list'],
    selectionMode: 'text-input',
    interaction: 'text-input'
  },
  
  // Add more exercise types as needed...
};

/**
 * Validation Schema Templates
 * Pre-defined validation rules for common exercise patterns
 */
export const ValidationTemplates = {
  // Exact match validation
  exactMatch: {
    type: 'exact',
    caseSensitive: false,
    whitespaceMatters: false
  },
  
  // Multiple selection validation
  multipleSelection: {
    type: 'multiple',
    requireAllCorrect: true,
    allowPartialCredit: true
  },
  
  // Sequence validation
  sequence: {
    type: 'sequence',
    orderMatters: true,
    allowGaps: false
  },
  
  // Pattern matching validation
  pattern: {
    type: 'pattern',
    regex: 'string',
    flags: 'string'
  }
};

/**
 * Default Values
 * Sensible defaults for all schema fields
 */
export const SchemaDefaults = {
  metadata: {
    version: '1.0.0',
    difficulty: 'beginner',
    language: 'en',
    accessibility: {
      screenReader: true,
      highContrast: true,
      keyboardOnly: true,
      audioRequired: false,
      visualRequired: true
    },
    configuration: {
      allowMultipleAttempts: true,
      showHintsAfterMistakes: true,
      autoAdvance: false
    }
  },
  presentation: {
    layout: 'grid',
    variants: ['standard'],
    responsive: {
      breakpoints: {
        mobile: '0px',
        tablet: '768px',
        desktop: '1024px'
      },
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 3
      }
    },
    theme: {
      spacing: 'normal',
      borderRadius: 'medium',
      elevation: 'small'
    },
    animations: {
      enabled: true,
      duration: 'normal',
      easing: 'ease-in-out'
    }
  }
};

export default UniversalExerciseSchema;
