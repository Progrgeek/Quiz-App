/**
 * Exercise Types Definitions
 * TypeScript-style definitions for all exercise types
 */

// Base exercise structure
export const ExerciseBase = {
  id: '',
  type: '', // 'multipleChoice', 'fillInTheBlanks', etc.
  title: '',
  instructions: '',
  content: '',
  difficulty: 'medium', // 'easy', 'medium', 'hard'
  timeLimit: null, // in milliseconds
  points: 100,
  category: '',
  tags: [],
  metadata: {},
  questions: []
};

// Question base structure
export const QuestionBase = {
  id: '',
  text: '',
  explanation: '',
  hints: [],
  media: null, // image, audio, video
  metadata: {}
};

// Multiple Choice Exercise
export const MultipleChoiceExercise = {
  ...ExerciseBase,
  type: 'multipleChoice',
  questions: [
    {
      ...QuestionBase,
      options: [
        {
          id: '',
          text: '',
          isCorrect: false,
          explanation: ''
        }
      ],
      correctAnswer: '', // option id
      allowMultiple: false
    }
  ]
};

// Fill in the Blanks Exercise
export const FillInTheBlanksExercise = {
  ...ExerciseBase,
  type: 'fillInTheBlanks',
  questions: [
    {
      ...QuestionBase,
      template: '', // Text with {blank} placeholders
      blanks: [
        {
          id: '',
          position: 0, // Position in template
          correctAnswers: [], // Array of acceptable answers
          caseSensitive: false,
          exactMatch: false,
          hints: []
        }
      ]
    }
  ]
};

// Drag and Drop Exercise
export const DragAndDropExercise = {
  ...ExerciseBase,
  type: 'dragAndDrop',
  questions: [
    {
      ...QuestionBase,
      draggableItems: [
        {
          id: '',
          content: '',
          type: 'text', // 'text', 'image', 'custom'
          data: null
        }
      ],
      dropZones: [
        {
          id: '',
          label: '',
          acceptedItems: [], // Array of draggable item ids
          maxItems: 1,
          required: true
        }
      ],
      correctMappings: [
        {
          itemId: '',
          zoneId: ''
        }
      ]
    }
  ]
};

// Sequencing Exercise
export const SequencingExercise = {
  ...ExerciseBase,
  type: 'sequencing',
  questions: [
    {
      ...QuestionBase,
      items: [
        {
          id: '',
          content: '',
          position: 0, // Correct position (0-based)
          type: 'text'
        }
      ],
      sequenceType: 'chronological', // 'chronological', 'alphabetical', 'numerical', 'logical'
      allowPartialCredit: true
    }
  ]
};

// Highlight Exercise
export const HighlightExercise = {
  ...ExerciseBase,
  type: 'highlight',
  questions: [
    {
      ...QuestionBase,
      content: '', // Text content to highlight in
      highlights: [
        {
          id: '',
          start: 0, // Character position
          end: 0,   // Character position
          type: 'correct', // 'correct', 'incorrect', 'neutral'
          explanation: ''
        }
      ],
      task: 'highlight-correct', // 'highlight-correct', 'highlight-errors', 'highlight-keywords'
      maxHighlights: null
    }
  ]
};

// Gap Fill Exercise
export const GapFillExercise = {
  ...ExerciseBase,
  type: 'gapFill',
  questions: [
    {
      ...QuestionBase,
      sentence: '', // Sentence with gaps marked as [gap]
      options: [], // Available words/phrases
      gaps: [
        {
          id: '',
          position: 0,
          correctOptions: [], // Array of correct option indices
          allowMultiple: false
        }
      ],
      shuffleOptions: true
    }
  ]
};

// Table Exercise
export const TableExercise = {
  ...ExerciseBase,
  type: 'tableExercise',
  questions: [
    {
      ...QuestionBase,
      table: {
        headers: [], // Column headers
        rows: [
          {
            id: '',
            cells: [
              {
                id: '',
                content: '',
                isEditable: false,
                correctContent: '',
                type: 'text' // 'text', 'dropdown', 'input'
              }
            ]
          }
        ]
      },
      taskType: 'fill-cells' // 'fill-cells', 'match-columns', 'sort-rows'
    }
  ]
};

// Single Answer Exercise
export const SingleAnswerExercise = {
  ...ExerciseBase,
  type: 'singleAnswer',
  questions: [
    {
      ...QuestionBase,
      inputType: 'text', // 'text', 'number', 'textarea'
      correctAnswers: [], // Array of acceptable answers
      caseSensitive: false,
      exactMatch: false,
      validationRules: {
        minLength: null,
        maxLength: null,
        pattern: null // Regex pattern
      }
    }
  ]
};

// Multiple Answers Exercise
export const MultipleAnswersExercise = {
  ...ExerciseBase,
  type: 'multipleAnswers',
  questions: [
    {
      ...QuestionBase,
      options: [
        {
          id: '',
          text: '',
          isCorrect: false,
          explanation: ''
        }
      ],
      correctAnswers: [], // Array of correct option ids
      minSelections: 1,
      maxSelections: null,
      requireExactMatch: false // If true, must select exactly the correct answers
    }
  ]
};

// Click to Change Exercise
export const ClickToChangeExercise = {
  ...ExerciseBase,
  type: 'clickToChange',
  questions: [
    {
      ...QuestionBase,
      content: '', // Text content with clickable elements
      clickableElements: [
        {
          id: '',
          text: '',
          position: { start: 0, end: 0 },
          states: [], // Different states the element can cycle through
          correctState: 0, // Index of correct state
          initialState: 0
        }
      ],
      maxChanges: null // Limit number of changes allowed
    }
  ]
};

// Rhyme Exercise
export const RhymeExercise = {
  ...ExerciseBase,
  type: 'rhymeExercise',
  questions: [
    {
      ...QuestionBase,
      word: '', // Target word to find rhymes for
      options: [], // Possible rhyming words
      correctRhymes: [], // Array of correct rhyming word indices
      includeNearRhymes: false,
      rhymeType: 'perfect' // 'perfect', 'slant', 'eye'
    }
  ]
};

// Syllable Counting Exercise
export const SyllableCountingExercise = {
  ...ExerciseBase,
  type: 'syllableCounting',
  questions: [
    {
      ...QuestionBase,
      word: '', // Word to count syllables for
      correctCount: 0, // Correct number of syllables
      showVisualDivider: true, // Show syllable divisions
      pronunciationGuide: '' // Phonetic guide
    }
  ]
};

// Answer Validation Types
export const ValidationResult = {
  isCorrect: false,
  partialCredit: 0, // 0-1 scale
  feedback: '',
  correctAnswer: null,
  userAnswer: null,
  explanation: '',
  hints: [],
  errors: []
};

// Exercise State Types
export const ExerciseState = {
  status: 'not-started', // 'not-started', 'in-progress', 'completed', 'paused'
  currentQuestionIndex: 0,
  startTime: null,
  endTime: null,
  answers: new Map(), // questionIndex -> answer data
  score: 0,
  hints: new Map(), // questionIndex -> hints used
  attempts: new Map(), // questionIndex -> attempt count
  timeSpent: new Map(), // questionIndex -> time in ms
  metadata: {}
};

// Quiz Engine Configuration
export const QuizEngineConfig = {
  // Timing
  enableGlobalTimer: false,
  globalTimeLimit: null, // milliseconds
  enableQuestionTimer: false,
  questionTimeLimit: null,
  
  // Behavior
  allowSkip: true,
  allowBack: true,
  allowRetry: false,
  maxAttempts: 1,
  
  // Hints and Help
  enableHints: true,
  maxHints: 3,
  hintPenalty: 0.1, // 10% penalty per hint
  
  // Feedback
  showImmediateFeedback: true,
  showCorrectAnswer: true,
  showExplanation: true,
  
  // Scoring
  enableScoring: true,
  scoringSystem: 'points', // 'points', 'percentage', 'grade'
  enablePartialCredit: true,
  enableTimeBonus: false,
  enableStreakBonus: false,
  
  // Randomization
  shuffleQuestions: false,
  shuffleAnswers: false,
  
  // Progress
  enableSaveProgress: true,
  autoSave: true,
  saveInterval: 30000, // 30 seconds
  
  // UI
  showProgress: true,
  showScore: true,
  showTimer: true,
  theme: 'default'
};

// Event Types
export const QuizEvents = {
  // Lifecycle events
  EXERCISE_STARTED: 'exercise:started',
  EXERCISE_COMPLETED: 'exercise:completed',
  EXERCISE_PAUSED: 'exercise:paused',
  EXERCISE_RESUMED: 'exercise:resumed',
  
  // Question events
  QUESTION_STARTED: 'question:started',
  QUESTION_ANSWERED: 'question:answered',
  QUESTION_SKIPPED: 'question:skipped',
  QUESTION_COMPLETED: 'question:completed',
  
  // Answer events
  ANSWER_SUBMITTED: 'answer:submitted',
  ANSWER_VALIDATED: 'answer:validated',
  ANSWER_CHANGED: 'answer:changed',
  
  // Hint events
  HINT_REQUESTED: 'hint:requested',
  HINT_SHOWN: 'hint:shown',
  
  // Timer events
  TIMER_STARTED: 'timer:started',
  TIMER_PAUSED: 'timer:paused',
  TIMER_RESUMED: 'timer:resumed',
  TIMER_WARNING: 'timer:warning',
  TIMER_EXPIRED: 'timer:expired',
  
  // Score events
  SCORE_UPDATED: 'score:updated',
  STREAK_STARTED: 'streak:started',
  STREAK_BROKEN: 'streak:broken',
  
  // State events
  STATE_SAVED: 'state:saved',
  STATE_LOADED: 'state:loaded',
  STATE_RESET: 'state:reset',
  
  // Error events
  ERROR_OCCURRED: 'error:occurred',
  VALIDATION_ERROR: 'validation:error'
};

// Storage Keys
export const StorageKeys = {
  EXERCISE_STATE: 'exercise-state',
  USER_PROGRESS: 'user-progress',
  SESSION_DATA: 'session-data',
  SETTINGS: 'settings',
  ANALYTICS: 'analytics'
};

// Export all types for use in other modules
export const ExerciseTypes = {
  MultipleChoiceExercise,
  FillInTheBlanksExercise,
  DragAndDropExercise,
  SequencingExercise,
  HighlightExercise,
  GapFillExercise,
  TableExercise,
  SingleAnswerExercise,
  MultipleAnswersExercise,
  ClickToChangeExercise,
  RhymeExercise,
  SyllableCountingExercise
};

export default {
  ExerciseBase,
  QuestionBase,
  ExerciseTypes,
  ValidationResult,
  ExerciseState,
  QuizEngineConfig,
  QuizEvents,
  StorageKeys
};
