/**
 * Extended Exercise Adapters
 * Additional transformers for Highlight, Sequencing, ClickToChange, and other exercise types
 */

import { ExerciseTypes, ExerciseSubtypes, SolutionTypes } from '../schemas/UniversalExerciseSchema.js';

export class ExtendedExerciseAdapters {
  
  /**
   * Transform Highlight exercises
   * Preserves exact functionality from existing Highlight.jsx
   */
  static transformHighlight(exerciseData) {
    const subtype = exerciseData.type || ExerciseSubtypes.VOWELS;
    
    return {
      metadata: {
        id: exerciseData.id || `hl_${Date.now()}`,
        type: ExerciseTypes.HIGHLIGHT,
        subtype: subtype,
        title: exerciseData.question || 'Highlight Exercise',
        question: exerciseData.question,
        difficulty: this.mapDifficulty(exerciseData.difficulty || 'medium'),
        estimatedTime: 30,
        tags: ['reading', 'identification', subtype],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      content: {
        text: {
          question: exerciseData.question,
          instruction: this.getHighlightInstruction(subtype),
          explanation: exerciseData.explanation || '',
          solve: exerciseData.solve || ''
        },

        elements: {
          options: [],
          draggableItems: [],
          dropZones: [],
          blanks: [],
          
          targets: this.extractHighlightTargets(exerciseData, subtype),
          
          sequence: [],
          
          media: {
            images: [],
            audio: [exerciseData.text] // Text for pronunciation
          }
        },

        solution: {
          type: SolutionTypes.HIGHLIGHT,
          correctOptions: [],
          requiredSelections: 0,
          correctAnswers: [],
          correctPositions: {},
          correctSequence: [],
          correctTargets: this.extractCorrectTargets(exerciseData, subtype),
          caseSensitive: false,
          exactMatch: true,
          partialCredit: true,
          explanation: exerciseData.explanation || this.getHighlightExplanation(subtype),
          hints: [],
          examples: []
        }
      },

      presentation: {
        layout: 'text-highlight',
        gridColumns: 1,
        showProgress: true,
        showTimer: true,
        showHints: false,
        allowSkip: false,
        animations: true,
        theme: 'highlight',
        mobileLayout: 'stack',
        responsiveBreakpoints: {},
        autoAdvance: true,
        confirmAnswers: true,
        allowRetry: true,
        showSolution: true,
        styles: {
          container: 'relative bg-white pt-3 sm:pt-5 px-2 sm:px-4',
          question: 'text-xl font-bold text-green-600 mb-6',
          options: 'text-3xl sm:text-4xl font-bold text-center tracking-wider',
          buttons: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500',
          feedback: 'fixed inset-0 z-50'
        }
      },

      learning: {
        example: {
          enabled: true,
          data: this.generateHighlightExample(subtype),
          explanation: this.getHighlightExampleExplanation(subtype),
          tips: this.getHighlightTips(subtype)
        },
        hints: [],
        feedback: {
          correct: {
            message: "Perfect! You found all the correct letters.",
            animation: 'highlight',
            sound: 'success',
            delay: 2000
          },
          incorrect: {
            message: "Some selections are incorrect. Try again!",
            explanation: this.getHighlightFeedbackExplanation(subtype),
            hints: this.getHighlightHints(subtype),
            retry: true,
            showSolution: false
          },
          partial: {
            message: "Good job! You found some correct letters.",
            explanation: "You're on the right track!",
            encouragement: "Keep looking!"
          }
        },
        relatedConcepts: this.getHighlightRelatedConcepts(subtype),
        prerequisites: ['letter recognition'],
        nextSteps: ['advanced reading', 'phonics patterns']
      },

      integration: {
        gamification: {
          baseXP: 40,
          difficultyMultiplier: this.mapDifficulty(exerciseData.difficulty || 'medium'),
          speedBonus: true,
          accuracyBonus: true,
          streakMultiplier: true,
          achievements: ['eagle_eye', 'perfect_spotter', 'quick_finder'],
          badges: ['highlight_master', 'letter_detective']
        },
        analytics: {
          trackEvents: ['letter_clicked', 'letter_selected', 'letter_deselected', 'answer_submitted', 'completed'],
          customProperties: {
            textLength: exerciseData.text?.length || 0,
            targetCount: exerciseData.targets?.length || 0,
            highlightType: subtype,
            hasAudio: Boolean(exerciseData.text)
          },
          performanceMetrics: ['accuracy', 'time_to_complete', 'click_count', 'precision'],
          learningObjectives: ['letter_recognition', 'pattern_identification']
        },
        i18n: {
          namespace: 'exercises.highlight',
          keys: {
            question: 'question',
            instruction: 'instruction',
            checkAnswer: 'checkAnswer',
            playAudio: 'playAudio'
          },
          textDirection: 'ltr',
          locale: 'en'
        },
        accessibility: {
          keyboardNavigation: true,
          screenReaderSupport: true,
          highContrast: true,
          fontSize: 'large',
          audioDescriptions: true,
          captionedAudio: false,
          ariaLabels: {
            letter: 'Letter to select',
            selectedLetter: 'Selected letter',
            checkButton: 'Check your selections'
          },
          ariaDescriptions: {
            exercise: 'Text highlighting exercise for letter identification'
          },
          focusOrder: ['letters', 'checkButton'],
          initialFocus: 'letters[0]',
          alternatives: {
            click: 'Keyboard navigation available'
          }
        },
        technical: {
          preserveState: true,
          autosave: true,
          lazyLoad: false,
          preload: [],
          fallbacks: {},
          errorRecovery: {
            clickFail: 'enable_keyboard_mode'
          },
          validation: {
            schema: 'highlight_schema',
            sanitization: {
              userInput: 'sanitize_selections'
            },
            security: {
              xss: 'escape_text'
            }
          }
        }
      },

      flow: {
        totalQuestions: 1,
        currentQuestion: 1,
        questionOrder: [0],
        allowBack: false,
        allowSkip: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        timeLimit: 0,
        questionTimeLimit: 0,
        showTimer: true,
        timerWarnings: [],
        passingScore: 100,
        maxAttempts: 3,
        completionRequired: true,
        showResults: true,
        showReview: true,
        allowRetake: true,
        saveProgress: true
      }
    };
  }

  /**
   * Transform Sequencing exercises
   * Preserves exact functionality from existing Sequencing.jsx
   */
  static transformSequencing(exerciseData) {
    return {
      metadata: {
        id: exerciseData.id || `seq_${Date.now()}`,
        type: ExerciseTypes.SEQUENCING,
        subtype: 'phrase_ordering',
        title: exerciseData.question || 'Sequencing Exercise',
        question: exerciseData.question,
        difficulty: this.mapDifficulty(exerciseData.difficulty || 'medium'),
        estimatedTime: 75,
        tags: ['sequencing', 'ordering', 'logic'],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      content: {
        text: {
          question: exerciseData.question,
          instruction: "Drag the phrases to arrange them in the correct order.",
          explanation: exerciseData.explanation || '',
          solve: exerciseData.solve || ''
        },

        elements: {
          options: [],
          draggableItems: [],
          dropZones: [],
          blanks: [],
          targets: [],
          
          sequence: exerciseData.options?.map((option, index) => ({
            id: option.id || `seq_${index}`,
            content: option.content || option,
            correctOrder: exerciseData.correctOrder?.[index] || index + 1,
            currentOrder: index + 1
          })) || [],
          
          media: {
            images: [],
            audio: []
          }
        },

        solution: {
          type: SolutionTypes.SEQUENCE,
          correctOptions: [],
          requiredSelections: 0,
          correctAnswers: [],
          correctPositions: {},
          correctSequence: this.extractCorrectSequence(exerciseData),
          correctTargets: [],
          caseSensitive: false,
          exactMatch: true,
          partialCredit: true,
          explanation: exerciseData.explanation || 'The phrases are arranged in logical order.',
          hints: [],
          examples: []
        }
      },

      presentation: {
        layout: 'vertical-list',
        gridColumns: 1,
        showProgress: true,
        showTimer: true,
        showHints: false,
        allowSkip: false,
        animations: true,
        theme: 'sequencing',
        mobileLayout: 'stack',
        responsiveBreakpoints: {},
        autoAdvance: true,
        confirmAnswers: true,
        allowRetry: true,
        showSolution: true,
        styles: {
          container: 'min-h-screen bg-white',
          question: 'text-xl font-bold text-green-600 mb-6',
          options: 'space-y-3',
          buttons: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500',
          feedback: 'fixed inset-0 z-50'
        }
      },

      learning: {
        example: {
          enabled: true,
          data: this.generateSequencingExample(),
          explanation: "Look at the logical flow of the phrases. Think about what should come first, second, and so on.",
          tips: [
            "Read all phrases first to understand the context",
            "Look for connecting words that indicate order",
            "Think about the logical flow of events or ideas"
          ]
        },
        hints: [],
        feedback: {
          correct: {
            message: "Excellent! The phrases are in perfect order.",
            animation: 'sequence',
            sound: 'success',
            delay: 2000
          },
          incorrect: {
            message: "The order isn't quite right. Try rearranging the phrases.",
            explanation: "Think about the logical flow and connections between phrases.",
            hints: ["Look for time indicators", "Consider cause and effect relationships"],
            retry: true,
            showSolution: false
          },
          partial: {
            message: "You have some phrases in the right positions.",
            explanation: "You're making good progress!",
            encouragement: "Keep working on the order!"
          }
        },
        relatedConcepts: ['logical thinking', 'reading comprehension', 'sequence awareness'],
        prerequisites: ['basic reading'],
        nextSteps: ['advanced sequencing', 'story comprehension']
      },

      integration: {
        gamification: {
          baseXP: 80,
          difficultyMultiplier: this.mapDifficulty(exerciseData.difficulty || 'medium'),
          speedBonus: true,
          accuracyBonus: true,
          streakMultiplier: true,
          achievements: ['perfect_order', 'logic_master', 'sequence_expert'],
          badges: ['organizer', 'flow_master']
        },
        analytics: {
          trackEvents: ['phrase_moved', 'sequence_changed', 'answer_submitted', 'completed'],
          customProperties: {
            phraseCount: exerciseData.options?.length || 0,
            totalMoves: 0,
            sequenceType: 'phrase_ordering'
          },
          performanceMetrics: ['accuracy', 'time_to_complete', 'move_count', 'efficiency'],
          learningObjectives: ['logical_sequencing', 'reading_comprehension']
        },
        i18n: {
          namespace: 'exercises.sequencing',
          keys: {
            question: 'question',
            instruction: 'instruction',
            checkAnswer: 'checkAnswer',
            reset: 'reset'
          },
          textDirection: 'ltr',
          locale: 'en'
        },
        accessibility: {
          keyboardNavigation: true,
          screenReaderSupport: true,
          highContrast: false,
          fontSize: 'medium',
          audioDescriptions: true,
          captionedAudio: false,
          ariaLabels: {
            sequenceItem: 'Sequence item',
            moveUp: 'Move up in sequence',
            moveDown: 'Move down in sequence',
            checkButton: 'Check sequence order'
          },
          ariaDescriptions: {
            exercise: 'Phrase sequencing exercise using drag and drop'
          },
          focusOrder: ['sequenceItems', 'checkButton'],
          initialFocus: 'sequenceItems[0]',
          alternatives: {
            dragDrop: 'Keyboard arrow keys for reordering'
          }
        },
        technical: {
          preserveState: true,
          autosave: true,
          lazyLoad: false,
          preload: [],
          fallbacks: {
            dragDrop: 'button_based_reordering'
          },
          errorRecovery: {
            dragFail: 'enable_button_mode'
          },
          validation: {
            schema: 'sequencing_schema',
            sanitization: {
              userInput: 'sanitize_order'
            },
            security: {
              xss: 'escape_content'
            }
          }
        }
      },

      flow: {
        totalQuestions: 1,
        currentQuestion: 1,
        questionOrder: [0],
        allowBack: false,
        allowSkip: false,
        shuffleQuestions: false,
        shuffleOptions: true,
        timeLimit: 0,
        questionTimeLimit: 0,
        showTimer: true,
        timerWarnings: [],
        passingScore: 100,
        maxAttempts: 3,
        completionRequired: true,
        showResults: true,
        showReview: true,
        allowRetake: true,
        saveProgress: true
      }
    };
  }

  /**
   * Transform Single Answer exercises
   * Similar to multiple choice but only one selection allowed
   */
  static transformSingleAnswer(exerciseData) {
    return {
      metadata: {
        id: exerciseData.id || `sa_${Date.now()}`,
        type: ExerciseTypes.SINGLE_ANSWER,
        subtype: 'single_choice',
        title: exerciseData.question?.substring(0, 50) || 'Single Answer Exercise',
        question: exerciseData.question,
        difficulty: this.mapDifficulty(exerciseData.difficulty || 'medium'),
        estimatedTime: 30,
        tags: ['single-choice', 'selection'],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      content: {
        text: {
          question: exerciseData.question,
          instruction: "Select the best answer.",
          explanation: exerciseData.explanation || '',
          solve: exerciseData.solve || ''
        },

        elements: {
          options: exerciseData.options?.map((option, index) => ({
            id: `opt_${index}`,
            content: typeof option === 'string' ? option : option.content,
            label: typeof option === 'string' ? option : option.label,
            isCorrect: typeof option === 'string' ? 
              option === exerciseData.correctAnswer : 
              option.isCorrect,
            type: 'text',
            metadata: {
              originalIndex: index
            }
          })) || [],

          draggableItems: [],
          dropZones: [],
          blanks: [],
          targets: [],
          sequence: [],
          media: {
            images: [],
            audio: []
          }
        },

        solution: {
          type: SolutionTypes.SINGLE,
          correctOptions: this.extractSingleCorrectOption(exerciseData),
          requiredSelections: 1,
          correctAnswers: [],
          correctPositions: {},
          correctSequence: [],
          correctTargets: [],
          caseSensitive: false,
          exactMatch: true,
          partialCredit: false,
          explanation: exerciseData.explanation || exerciseData.hint || 'This is the correct answer.',
          hints: exerciseData.hint ? [exerciseData.hint] : [],
          examples: []
        }
      },

      presentation: {
        layout: 'list',
        gridColumns: 1,
        showProgress: true,
        showTimer: true,
        showHints: Boolean(exerciseData.hint),
        allowSkip: false,
        animations: true,
        theme: 'single-answer',
        mobileLayout: 'stack',
        responsiveBreakpoints: {},
        autoAdvance: true,
        confirmAnswers: true,
        allowRetry: false,
        showSolution: true,
        styles: {
          container: 'relative bg-white pt-3 sm:pt-5 px-2 sm:px-4',
          question: 'text-xl font-bold text-green-600 mb-6',
          options: 'space-y-3',
          buttons: 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500',
          feedback: 'fixed inset-0 z-50'
        }
      },

      learning: {
        example: {
          enabled: true,
          data: this.generateSingleAnswerExample(),
          explanation: "Read the question carefully and select the one best answer.",
          tips: [
            "Read all options before selecting",
            "Eliminate obviously wrong answers first",
            "Look for key words in the question"
          ]
        },
        hints: exerciseData.hint ? [
          {
            id: 'hint_1',
            content: exerciseData.hint,
            trigger: 'on_request',
            type: 'text'
          }
        ] : [],
        feedback: {
          correct: {
            message: "Correct! Well done.",
            animation: 'success',
            sound: 'success',
            delay: 2000
          },
          incorrect: {
            message: "That's not correct. Try again!",
            explanation: exerciseData.explanation || "Consider the options more carefully.",
            hints: exerciseData.hint ? [exerciseData.hint] : [],
            retry: true,
            showSolution: false
          },
          partial: {
            message: "",
            explanation: "",
            encouragement: ""
          }
        },
        relatedConcepts: ['reading comprehension', 'critical thinking'],
        prerequisites: ['basic reading'],
        nextSteps: ['multiple choice', 'advanced comprehension']
      },

      integration: {
        gamification: {
          baseXP: 50,
          difficultyMultiplier: this.mapDifficulty(exerciseData.difficulty || 'medium'),
          speedBonus: true,
          accuracyBonus: true,
          streakMultiplier: true,
          achievements: ['first_try', 'quick_thinker', 'accuracy_expert'],
          badges: ['choice_master', 'decision_maker']
        },
        analytics: {
          trackEvents: ['option_selected', 'answer_submitted', 'hint_used', 'completed'],
          customProperties: {
            optionCount: exerciseData.options?.length || 0,
            hasHint: Boolean(exerciseData.hint),
            correctAnswerPosition: this.getCorrectAnswerPosition(exerciseData)
          },
          performanceMetrics: ['accuracy', 'time_to_complete', 'hint_usage'],
          learningObjectives: ['reading_comprehension', 'decision_making']
        },
        i18n: {
          namespace: 'exercises.singleAnswer',
          keys: {
            question: 'question',
            instruction: 'instruction',
            checkAnswer: 'checkAnswer',
            hint: 'hint'
          },
          textDirection: 'ltr',
          locale: 'en'
        },
        accessibility: {
          keyboardNavigation: true,
          screenReaderSupport: true,
          highContrast: false,
          fontSize: 'medium',
          audioDescriptions: false,
          captionedAudio: false,
          ariaLabels: {
            option: 'Answer option',
            selectedOption: 'Selected answer option',
            checkButton: 'Check your answer'
          },
          ariaDescriptions: {
            exercise: 'Single choice selection exercise'
          },
          focusOrder: ['options', 'checkButton'],
          initialFocus: 'options[0]',
          alternatives: {}
        },
        technical: {
          preserveState: true,
          autosave: true,
          lazyLoad: false,
          preload: [],
          fallbacks: {},
          errorRecovery: {},
          validation: {
            schema: 'single_answer_schema',
            sanitization: {
              userInput: 'none_required'
            },
            security: {
              xss: 'not_applicable'
            }
          }
        }
      },

      flow: {
        totalQuestions: 1,
        currentQuestion: 1,
        questionOrder: [0],
        allowBack: false,
        allowSkip: false,
        shuffleQuestions: false,
        shuffleOptions: false,
        timeLimit: 0,
        questionTimeLimit: 0,
        showTimer: true,
        timerWarnings: [],
        passingScore: 100,
        maxAttempts: 2,
        completionRequired: true,
        showResults: true,
        showReview: true,
        allowRetake: true,
        saveProgress: true
      }
    };
  }

  // Helper methods for all transformers
  static mapDifficulty(difficulty) {
    const difficultyMap = {
      'easy': 1,
      'medium': 3,
      'hard': 5,
      1: 1, 2: 2, 3: 3, 4: 4, 5: 5
    };
    return difficultyMap[difficulty] || 3;
  }

  // Highlight helper methods
  static getHighlightInstruction(subtype) {
    const instructions = {
      [ExerciseSubtypes.VOWELS]: "Click on all the vowels in the word.",
      [ExerciseSubtypes.CONSONANTS]: "Click on all the consonants in the word.",
      [ExerciseSubtypes.PRONOUNS]: "Click on all the pronouns in the text.",
      'redundant-phrase': "Click on the redundant phrase in the text."
    };
    return instructions[subtype] || "Click on the correct letters.";
  }

  static extractHighlightTargets(exerciseData, subtype) {
    if (!exerciseData.text) return [];
    
    const text = exerciseData.text;
    const targets = [];
    
    // Generate targets based on exercise data
    if (exerciseData.targets) {
      return exerciseData.targets.map((target, index) => ({
        id: `target_${index}`,
        content: target,
        position: text.indexOf(target),
        type: subtype,
        isCorrect: true,
        category: subtype
      }));
    }
    
    // Auto-generate targets for vowels
    if (subtype === ExerciseSubtypes.VOWELS) {
      const vowels = 'aeiouAEIOU';
      for (let i = 0; i < text.length; i++) {
        if (vowels.includes(text[i])) {
          targets.push({
            id: `target_${i}`,
            content: text[i],
            position: i,
            type: 'vowel',
            isCorrect: true,
            category: 'vowel'
          });
        }
      }
    }
    
    return targets;
  }

  static extractCorrectTargets(exerciseData, subtype) {
    const targets = this.extractHighlightTargets(exerciseData, subtype);
    return targets.filter(target => target.isCorrect).map(target => target.id);
  }

  static getHighlightExplanation(subtype) {
    const explanations = {
      [ExerciseSubtypes.VOWELS]: "Vowels are the letters a, e, i, o, u.",
      [ExerciseSubtypes.CONSONANTS]: "Consonants are all letters that are not vowels.",
      [ExerciseSubtypes.PRONOUNS]: "Pronouns replace nouns (he, she, it, they, etc.)."
    };
    return explanations[subtype] || "These are the correct selections.";
  }

  static generateHighlightExample(subtype) {
    const examples = {
      [ExerciseSubtypes.VOWELS]: {
        text: "cat",
        targets: ["a"],
        explanation: "The letter 'a' is a vowel"
      },
      [ExerciseSubtypes.CONSONANTS]: {
        text: "dog",
        targets: ["d", "g"],
        explanation: "The letters 'd' and 'g' are consonants"
      }
    };
    return examples[subtype] || { text: "example", targets: ["e", "a"] };
  }

  static getHighlightExampleExplanation(subtype) {
    return `This example shows how to identify ${subtype} in text.`;
  }

  static getHighlightTips(subtype) {
    const tips = {
      [ExerciseSubtypes.VOWELS]: ["Remember: vowels are a, e, i, o, u", "Some letters might appear multiple times"],
      [ExerciseSubtypes.CONSONANTS]: ["Consonants are all other letters", "Count carefully"]
    };
    return tips[subtype] || ["Look carefully at each letter"];
  }

  static getHighlightFeedbackExplanation(subtype) {
    return `Review which letters are ${subtype} and try again.`;
  }

  static getHighlightHints(subtype) {
    const hints = {
      [ExerciseSubtypes.VOWELS]: ["Vowels are: a, e, i, o, u"],
      [ExerciseSubtypes.CONSONANTS]: ["Consonants are all letters except vowels"]
    };
    return hints[subtype] || ["Think about the letter types"];
  }

  static getHighlightRelatedConcepts(subtype) {
    const concepts = {
      [ExerciseSubtypes.VOWELS]: ['phonics', 'letter sounds', 'spelling'],
      [ExerciseSubtypes.CONSONANTS]: ['phonics', 'letter sounds', 'spelling'],
      [ExerciseSubtypes.PRONOUNS]: ['grammar', 'parts of speech', 'sentence structure']
    };
    return concepts[subtype] || ['letter recognition'];
  }

  // Sequencing helper methods
  static extractCorrectSequence(exerciseData) {
    if (exerciseData.correctOrder) {
      return exerciseData.correctOrder.map((position, index) => 
        exerciseData.options?.[position - 1]?.id || `seq_${position - 1}`
      );
    }
    
    // Default to original order if no correctOrder specified
    return exerciseData.options?.map((option, index) => 
      option.id || `seq_${index}`
    ) || [];
  }

  static generateSequencingExample() {
    return {
      question: "Arrange these phrases in order:",
      options: [
        { content: "First step", correctOrder: 1 },
        { content: "Second step", correctOrder: 2 },
        { content: "Final step", correctOrder: 3 }
      ]
    };
  }

  // Single Answer helper methods
  static extractSingleCorrectOption(exerciseData) {
    if (exerciseData.correctAnswer) {
      const correctIndex = exerciseData.options?.findIndex(option => 
        (typeof option === 'string' ? option : option.content) === exerciseData.correctAnswer
      );
      return correctIndex >= 0 ? [`opt_${correctIndex}`] : [];
    }
    
    const correctIndex = exerciseData.options?.findIndex(option => 
      typeof option === 'object' && option.isCorrect
    );
    return correctIndex >= 0 ? [`opt_${correctIndex}`] : [];
  }

  static getCorrectAnswerPosition(exerciseData) {
    if (exerciseData.correctAnswer) {
      return exerciseData.options?.findIndex(option => 
        (typeof option === 'string' ? option : option.content) === exerciseData.correctAnswer
      ) + 1;
    }
    
    return exerciseData.options?.findIndex(option => 
      typeof option === 'object' && option.isCorrect
    ) + 1;
  }

  static generateSingleAnswerExample() {
    return {
      question: "What color is the sky?",
      options: ["Blue", "Red", "Green", "Yellow"],
      correctAnswer: "Blue"
    };
  }

  /**
   * Transform Click To Change exercises
   */
  static transformClickToChange(exerciseData) {
    return {
      metadata: {
        id: exerciseData.id || `ctc_${Date.now()}`,
        type: 'click-to-change',
        subtype: 'word_replacement',
        title: exerciseData.question || 'Click to Change Exercise',
        question: exerciseData.question,
        difficulty: 'medium',
        estimatedTime: 45,
        tags: ['interactive', 'text', 'transformation'],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      content: {
        text: {
          question: exerciseData.question,
          instruction: exerciseData.instruction || "Click on words to change them",
        },
        elements: {
          options: exerciseData.options || [],
          targets: exerciseData.targets || []
        },
        solution: {
          type: 'click_selection',
          correct: exerciseData.correctAnswer || exerciseData.solution
        }
      },
      presentation: {
        showTimer: true,
        styles: {
          container: 'space-y-6',
          question: 'text-xl font-bold mb-4'
        }
      },
      flow: {
        totalQuestions: 1,
        showTimer: true
      },
      learning: {
        feedback: {
          correct: { message: 'Correct!', delay: 2000 },
          incorrect: { message: 'Try again!', delay: 2000 }
        }
      }
    };
  }

  /**
   * Transform Syllable Counting exercises
   */
  static transformSyllableCounting(exerciseData) {
    return {
      metadata: {
        id: exerciseData.id || `sc_${Date.now()}`,
        type: 'syllable-counting',
        subtype: 'word_counting',
        title: exerciseData.question || 'Syllable Counting Exercise',
        question: exerciseData.question,
        difficulty: 'medium',
        estimatedTime: 30,
        tags: ['phonics', 'counting', 'syllables'],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      content: {
        text: {
          question: exerciseData.question,
          instruction: exerciseData.instruction || "Count the syllables in each word",
        },
        elements: {
          options: exerciseData.options || [],
          words: exerciseData.words || []
        },
        solution: {
          type: 'syllable_count',
          correct: exerciseData.correctAnswer || exerciseData.solution
        }
      },
      presentation: {
        showTimer: true,
        styles: {
          container: 'space-y-6',
          question: 'text-xl font-bold mb-4'
        }
      },
      flow: {
        totalQuestions: 1,
        showTimer: true
      },
      learning: {
        feedback: {
          correct: { message: 'Correct!', delay: 2000 },
          incorrect: { message: 'Try again!', delay: 2000 }
        }
      }
    };
  }

  /**
   * Transform Table exercises
   */
  static transformTableExercise(exerciseData) {
    return {
      metadata: {
        id: exerciseData.id || `te_${Date.now()}`,
        type: 'table-exercise',
        subtype: 'data_table',
        title: exerciseData.question || 'Table Exercise',
        question: exerciseData.question,
        difficulty: 'medium',
        estimatedTime: 60,
        tags: ['table', 'data', 'analysis'],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      content: {
        text: {
          question: exerciseData.question,
          instruction: exerciseData.instruction || "Complete the table",
        },
        elements: {
          table: exerciseData.table || [],
          options: exerciseData.options || []
        },
        solution: {
          type: 'table_completion',
          correct: exerciseData.correctAnswer || exerciseData.solution
        }
      },
      presentation: {
        showTimer: true,
        styles: {
          container: 'space-y-6',
          question: 'text-xl font-bold mb-4'
        }
      },
      flow: {
        totalQuestions: 1,
        showTimer: true
      },
      learning: {
        feedback: {
          correct: { message: 'Correct!', delay: 2000 },
          incorrect: { message: 'Try again!', delay: 2000 }
        }
      }
    };
  }

  /**
   * Transform Rhyme exercises
   */
  static transformRhymeExercise(exerciseData) {
    return {
      metadata: {
        id: exerciseData.id || `re_${Date.now()}`,
        type: 'rhyme-exercises',
        subtype: 'rhyme_matching',
        title: exerciseData.question || 'Rhyme Exercise',
        question: exerciseData.question,
        difficulty: 'medium',
        estimatedTime: 45,
        tags: ['rhyme', 'phonics', 'matching'],
        version: '1.0',
        language: 'en',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      content: {
        text: {
          question: exerciseData.question,
          instruction: exerciseData.instruction || "Find the words that rhyme",
        },
        elements: {
          options: exerciseData.options || [],
          words: exerciseData.words || []
        },
        solution: {
          type: 'rhyme_matching',
          correct: exerciseData.correctAnswer || exerciseData.solution
        }
      },
      presentation: {
        showTimer: true,
        styles: {
          container: 'space-y-6',
          question: 'text-xl font-bold mb-4'
        }
      },
      flow: {
        totalQuestions: 1,
        showTimer: true
      },
      learning: {
        feedback: {
          correct: { message: 'Correct!', delay: 2000 },
          incorrect: { message: 'Try again!', delay: 2000 }
        }
      }
    };
  }
}
