/**
 * Universal Exercise Schema
 * Standardizes all exercise types into a consistent structure while preserving exact functionality
 * 
 * This schema accommodates ALL existing exercise types:
 * - MultipleAnswers (sound matching, synonyms)
 * - DragAndDrop (category-based sorting)
 * - FillInTheBlanks (word completion, simple addition, possessive hints)
 * - GapFill (letter-by-letter completion with images)
 * - Highlight (text selection, vowels, pronouns, etc.)
 * - Sequencing (phrase ordering)
 * - ClickToChange (interactive text modification)
 * - SingleAnswer (single choice selection)
 */

export const UniversalExerciseSchema = {
  // Core metadata - consistent across all types
  metadata: {
    id: String,                    // Unique identifier
    type: String,                  // 'multiple-choice', 'drag-drop', 'fill-blanks', etc.
    subtype: String,               // 'sound_matching', 'synonym', 'word_completion', etc.
    title: String,                 // Exercise title
    question: String,              // Main question/instruction text
    difficulty: Number,            // 1-5 scale (mapped from existing difficulties)
    estimatedTime: Number,         // Seconds
    tags: Array,                   // ['grammar', 'vocabulary', 'phonics']
    version: String,               // Schema version
    language: String,              // 'en', 'es', 'fr'
    createdAt: Date,
    updatedAt: Date
  },

  // Content structure - accommodates all exercise types
  content: {
    // Text-based content
    text: {
      question: String,            // Main question (preserved exactly)
      instruction: String,         // How to complete the exercise
      template: String,            // For fill-in-blanks with {placeholders}
      context: String,             // Background information
      sentence: String,            // For gap-fill and text exercises
      explanation: String,         // Solution explanation
      solve: String               // Step-by-step solution
    },

    // Interactive elements - unified structure for all types
    elements: {
      // Multiple choice / Multiple answers
      options: [{
        id: String,
        content: String,           // Text content or word
        label: String,             // Display label
        isCorrect: Boolean,        // Correct answer flag
        type: String,              // 'text', 'image', 'audio'
        image: String,             // Image path for visual options
        audio: Boolean,            // Audio available flag
        metadata: Object           // Additional data (endSound, category, etc.)
      }],

      // Drag and drop specific
      draggableItems: [{
        id: String,
        content: String,           // Content (text/image path)
        label: String,             // Display label
        category: String,          // Correct category/position
        type: String,              // 'text', 'image'
        correctPosition: String,   // Where it belongs
        metadata: Object           // Sensory examples, descriptions
      }],

      dropZones: [{
        id: String,
        label: String,             // Zone label (category name)
        accepts: Array,            // What types it accepts
        maxItems: Number,          // Max items allowed
        description: String        // Zone description
      }],

      // Fill-in-blanks / Gap fill
      blanks: [{
        id: String,
        position: Number,          // Position in text/word
        correctAnswers: Array,     // Acceptable answers
        placeholder: String,       // {answer}, {given}, etc.
        caseSensitive: Boolean,
        exactMatch: Boolean,
        hints: Array               // Progressive hints
      }],

      // Highlight exercises
      targets: [{
        id: String,
        content: String,           // Text to highlight
        position: Number,          // Position in text
        type: String,              // 'vowel', 'pronoun', 'phrase'
        isCorrect: Boolean,        // Whether this should be selected
        category: String           // Grouping category
      }],

      // Sequencing exercises
      sequence: [{
        id: String,
        content: String,           // Text/phrase content
        correctOrder: Number,      // Correct position (1-based)
        currentOrder: Number       // Current position
      }],

      // Media elements
      media: {
        images: Array,             // Image paths and metadata
        audio: Array,              // Audio files and settings
        video: Array               // Video content (future)
      }
    },

    // Solution definition - universal validation
    solution: {
      type: String,                // 'single', 'multiple', 'position', 'text', 'sequence'
      
      // Single/Multiple choice solutions
      correctOptions: Array,       // IDs of correct options
      requiredSelections: Number,  // How many must be selected
      
      // Text-based solutions
      correctAnswers: Array,       // Acceptable text answers
      
      // Position-based solutions (drag/drop, sequencing)
      correctPositions: Object,    // { zoneId: [itemIds], ... }
      correctSequence: Array,      // Ordered array of IDs
      
      // Highlight solutions
      correctTargets: Array,       // IDs of elements to highlight
      
      // Validation settings
      caseSensitive: Boolean,
      exactMatch: Boolean,
      partialCredit: Boolean,
      
      // Feedback
      explanation: String,         // Why this is correct
      hints: Array,               // Progressive hints
      examples: Array             // Related examples
    }
  },

  // Presentation settings - preserve exact UI
  presentation: {
    layout: String,                // 'grid', 'list', 'columns', 'custom'
    gridColumns: Number,           // For option grids
    showProgress: Boolean,
    showTimer: Boolean,
    showHints: Boolean,
    allowSkip: Boolean,
    animations: Boolean,
    theme: String,                 // Exercise-specific theming
    
    // Mobile/responsive settings
    mobileLayout: String,
    responsiveBreakpoints: Object,
    
    // UI behavior
    autoAdvance: Boolean,          // Auto-move to next on correct
    confirmAnswers: Boolean,       // Require confirmation
    allowRetry: Boolean,           // Allow retry on incorrect
    showSolution: Boolean,         // Show solution after attempt
    
    // Visual styling (preserve exact appearance)
    styles: {
      container: String,           // CSS classes for container
      question: String,            // CSS classes for question
      options: String,             // CSS classes for options
      buttons: String,             // CSS classes for buttons
      feedback: String             // CSS classes for feedback
    }
  },

  // Learning enhancement
  learning: {
    example: {
      enabled: Boolean,
      data: Object,               // Example exercise data
      explanation: String,        // How to solve examples
      tips: Array                // Learning tips
    },
    
    hints: [{
      id: String,
      content: String,
      trigger: String,            // When to show (time, attempts, etc.)
      type: String               // 'text', 'audio', 'visual'
    }],
    
    feedback: {
      correct: {
        message: String,
        animation: String,
        sound: String,
        delay: Number             // Auto-advance delay
      },
      incorrect: {
        message: String,
        explanation: String,
        hints: Array,
        retry: Boolean,
        showSolution: Boolean
      },
      partial: {
        message: String,
        explanation: String,
        encouragement: String
      }
    },
    
    relatedConcepts: Array,       // Related learning topics
    prerequisites: Array,        // Required knowledge
    nextSteps: Array            // Suggested follow-up exercises
  },

  // Integration hooks - enable enhanced features
  integration: {
    // Gamification integration
    gamification: {
      baseXP: Number,             // Base XP for completion
      difficultyMultiplier: Number,
      speedBonus: Boolean,        // Extra XP for fast completion
      accuracyBonus: Boolean,     // Extra XP for high accuracy
      streakMultiplier: Boolean,  // XP multiplier for streaks
      achievements: Array,        // Possible achievements
      badges: Array              // Possible badges
    },
    
    // Analytics tracking
    analytics: {
      trackEvents: Array,         // Events to track
      customProperties: Object,   // Exercise-specific data
      performanceMetrics: Array,  // What to measure
      learningObjectives: Array   // What skills this measures
    },
    
    // Internationalization
    i18n: {
      namespace: String,          // Translation namespace
      keys: Object,              // Translation key mappings
      textDirection: String,      // LTR/RTL support
      locale: String             // Current locale
    },
    
    // Accessibility
    accessibility: {
      keyboardNavigation: Boolean,
      screenReaderSupport: Boolean,
      highContrast: Boolean,
      fontSize: String,
      audioDescriptions: Boolean,
      captionedAudio: Boolean,
      
      // ARIA labels and descriptions
      ariaLabels: Object,
      ariaDescriptions: Object,
      
      // Focus management
      focusOrder: Array,
      initialFocus: String,
      
      // Alternative interaction methods
      alternatives: {
        dragDrop: String,         // Alternative to drag/drop
        audio: String,            // Alternative to audio
        visual: String           // Alternative to visual elements
      }
    },
    
    // Technical integration
    technical: {
      // State management
      preserveState: Boolean,     // Preserve state on navigation
      autosave: Boolean,         // Autosave progress
      
      // Performance
      lazyLoad: Boolean,         // Lazy load media
      preload: Array,           // Resources to preload
      
      // Error handling
      fallbacks: Object,        // Fallback content
      errorRecovery: Object,    // Error recovery strategies
      
      // Data validation
      validation: {
        schema: Object,         // JSON schema validation
        sanitization: Object,   // Input sanitization rules
        security: Object       // Security constraints
      }
    }
  },

  // Exercise flow control
  flow: {
    totalQuestions: Number,       // Total questions in exercise
    currentQuestion: Number,      // Current question index
    questionOrder: Array,         // Order of questions
    
    // Navigation
    allowBack: Boolean,          // Allow going back
    allowSkip: Boolean,          // Allow skipping questions
    shuffleQuestions: Boolean,   // Randomize question order
    shuffleOptions: Boolean,     // Randomize option order
    
    // Timing
    timeLimit: Number,           // Overall time limit
    questionTimeLimit: Number,   // Per-question time limit
    showTimer: Boolean,          // Display timer
    timerWarnings: Array,        // Timer warning thresholds
    
    // Completion criteria
    passingScore: Number,        // Minimum score to pass
    maxAttempts: Number,         // Maximum attempts allowed
    completionRequired: Boolean, // Must complete all questions
    
    // Results handling
    showResults: Boolean,        // Show results at end
    showReview: Boolean,         // Allow reviewing answers
    allowRetake: Boolean,        // Allow retaking exercise
    saveProgress: Boolean       // Save progress for resume
  }
};

// Type definitions for enhanced type safety
export const ExerciseTypes = {
  MULTIPLE_CHOICE: 'multiple-choice',
  MULTIPLE_ANSWERS: 'multiple-answers', 
  SINGLE_ANSWER: 'single-answer',
  DRAG_AND_DROP: 'drag-and-drop',
  FILL_IN_BLANKS: 'fill-in-blanks',
  GAP_FILL: 'gap-fill',
  HIGHLIGHT: 'highlight',
  SEQUENCING: 'sequencing',
  CLICK_TO_CHANGE: 'click-to-change',
  TABLE_EXERCISE: 'table-exercise',
  SYLLABLE_COUNTING: 'syllable-counting',
  RHYME_EXERCISES: 'rhyme-exercises'
};

export const ExerciseSubtypes = {
  // Multiple answers subtypes
  SOUND_MATCHING: 'sound_matching',
  SYNONYM: 'synonym',
  ANTONYM: 'antonym',
  
  // Fill in blanks subtypes
  WORD_COMPLETION: 'word_completion',
  SIMPLE_ADDITION: 'simple_addition',
  POSSESSIVE_HINT: 'possessive_hint',
  
  // Highlight subtypes
  VOWELS: 'vowels',
  CONSONANTS: 'consonants',
  PRONOUNS: 'pronouns',
  REDUNDANT_PHRASE: 'redundant-phrase',
  
  // Drag and drop subtypes
  ANIMALS: 'animals',
  OBJECTS: 'objects',
  CATEGORIES: 'categories',
  
  // Gap fill subtypes
  CONSONANT_BLEND: 'consonant_blend',
  WORD_FAMILY: 'word_family'
};

export const SolutionTypes = {
  SINGLE: 'single',           // Single correct option
  MULTIPLE: 'multiple',       // Multiple correct options
  POSITION: 'position',       // Position-based (drag/drop)
  TEXT: 'text',              // Text input
  SEQUENCE: 'sequence',       // Ordered sequence
  HIGHLIGHT: 'highlight',     // Text highlighting
  CLICK: 'click'             // Click interactions
};

// Validation helpers
export const validateExerciseSchema = (exercise) => {
  // Schema validation logic
  const required = ['metadata', 'content', 'presentation', 'learning', 'integration', 'flow'];
  const missing = required.filter(key => !exercise[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required schema fields: ${missing.join(', ')}`);
  }
  
  return true;
};

export const isValidExerciseType = (type) => {
  return Object.values(ExerciseTypes).includes(type);
};

export const isValidSubtype = (subtype) => {
  return Object.values(ExerciseSubtypes).includes(subtype);
};
