/**
 * Data Migration System
 * 
 * Transforms existing exercise data formats to the Universal Exercise Schema
 * while preserving all functionality and UI characteristics.
 * 
 * This ensures backward compatibility and smooth transition to the new system.
 */

import { v4 as uuidv4 } from 'uuid';

/**
 * Data Migration Class
 * Handles transformation of legacy exercise formats to universal schema
 */
export class DataMigration {
  constructor() {
    this.migrationVersion = '1.0.0';
    this.supportedTypes = [
      'multiple-answers',
      'click-to-change',
      'drag-drop',
      'fill-blanks',
      'multiple-choice',
      'single-answer',
      'gap-fill',
      'highlight',
      'sequencing',
      'syllable-counting',
      'table-exercise',
      'rhyme-exercises'
    ];
  }

  /**
   * Main migration entry point
   * @param {Object} legacyData - Legacy exercise data
   * @param {string} exerciseType - Type of exercise
   * @returns {Object} Migrated data in universal schema format
   */
  migrate(legacyData, exerciseType) {
    console.log(`Migrating ${exerciseType} exercise...`);
    
    switch (exerciseType) {
      case 'multiple-answers':
        return this.migrateMultipleAnswers(legacyData);
      case 'click-to-change':
        return this.migrateClickToChange(legacyData);
      case 'drag-drop':
        return this.migrateDragDrop(legacyData);
      case 'fill-blanks':
        return this.migrateFillBlanks(legacyData);
      case 'multiple-choice':
        return this.migrateMultipleChoice(legacyData);
      case 'single-answer':
        return this.migrateSingleAnswer(legacyData);
      case 'gap-fill':
        return this.migrateGapFill(legacyData);
      case 'highlight':
        return this.migrateHighlight(legacyData);
      case 'sequencing':
        return this.migrateSequencing(legacyData);
      case 'syllable-counting':
        return this.migrateSyllableCounting(legacyData);
      case 'table-exercise':
        return this.migrateTableExercise(legacyData);
      case 'rhyme-exercises':
        return this.migrateRhymeExercises(legacyData);
      default:
        throw new Error(`Unsupported exercise type: ${exerciseType}`);
    }
  }

  /**
   * Migrate Multiple Answers exercises
   * Handles both sound matching and synonym exercises
   */
  migrateMultipleAnswers(legacyData) {
    const exercises = [];
    
    // Handle sound matching exercises
    if (legacyData.soundMatchingExercises) {
      legacyData.soundMatchingExercises.forEach(exercise => {
        exercises.push(this.transformSoundMatchingExercise(exercise));
      });
    }
    
    // Handle synonym exercises
    if (legacyData.synonymExercises) {
      legacyData.synonymExercises.forEach(exercise => {
        exercises.push(this.transformSynonymExercise(exercise));
      });
    }
    
    // Handle direct array format
    if (Array.isArray(legacyData)) {
      legacyData.forEach(exercise => {
        if (exercise.type === 'sound_matching' || exercise.exerciseType === 'sound_matching') {
          exercises.push(this.transformSoundMatchingExercise(exercise));
        } else if (exercise.type === 'synonym' || exercise.exerciseType === 'synonym') {
          exercises.push(this.transformSynonymExercise(exercise));
        } else {
          exercises.push(this.transformGenericMultipleAnswers(exercise));
        }
      });
    }
    
    return exercises;
  }

  /**
   * Transform sound matching exercise to universal schema
   */
  transformSoundMatchingExercise(exercise) {
    return {
      metadata: {
        id: this.generateId(exercise.id),
        version: this.migrationVersion,
        type: 'multiple-answers',
        difficulty: this.inferDifficulty(exercise),
        subjects: ['English', 'Phonics'],
        topics: ['Sound Matching', 'Rhyming'],
        learningObjectives: [
          'Identify words with similar ending sounds',
          'Develop phonemic awareness',
          'Practice sound discrimination'
        ],
        estimatedTime: this.estimateTime(exercise),
        language: 'en',
        culturalContext: 'general',
        accessibility: {
          screenReader: true,
          highContrast: true,
          keyboardOnly: true,
          audioRequired: true,
          visualRequired: true
        },
        configuration: {
          requiredSelections: exercise.requiredSelections || 2,
          allowMultipleAttempts: true,
          showHintsAfterMistakes: true,
          autoAdvance: false
        }
      },
      content: {
        question: {
          en: exercise.question || 'Listen to each word. Which two words end with the same sound?'
        },
        instruction: {
          en: `Select ${exercise.requiredSelections || 2} words that have the same ending sound.`
        },
        elements: {
          options: exercise.options.map(option => ({
            id: this.generateOptionId(option),
            content: {
              text: {
                en: option.word
              },
              image: option.image ? {
                url: option.image,
                alt: { en: option.word },
                caption: { en: option.word }
              } : undefined,
              audio: {
                url: `speech:${option.word}`, // Placeholder for TTS
                transcript: { en: option.word },
                autoPlay: false
              }
            },
            metadata: {
              isCorrect: option.isCorrect,
              category: 'sound-matching',
              tags: [option.endSound || 'unknown-sound'],
              weight: 1,
              difficulty: 5,
              endSound: option.endSound
            },
            presentation: {
              size: 'medium',
              prominence: 'primary'
            }
          })),
          media: [],
          interactions: []
        }
      },
      solution: {
        correct: exercise.options
          .map((option, index) => option.isCorrect ? index : null)
          .filter(index => index !== null),
        explanation: {
          en: this.generateExplanation(exercise, 'sound-matching')
        },
        hints: [
          { en: 'Listen carefully to the ending sound of each word.' },
          { en: 'Say each word out loud and focus on how they end.' }
        ],
        partialCredit: true,
        scoringRules: {
          fullCredit: 100,
          partialCredit: 50,
          penalty: 0
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
          layouts: {
            mobile: 'grid',
            tablet: 'grid',
            desktop: 'grid'
          },
          columns: {
            mobile: 2,
            tablet: 3,
            desktop: 3
          }
        },
        theme: {
          primaryColor: '#3B82F6',
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
  }

  /**
   * Transform synonym exercise to universal schema
   */
  transformSynonymExercise(exercise) {
    return {
      metadata: {
        id: this.generateId(exercise.id),
        version: this.migrationVersion,
        type: 'multiple-answers',
        difficulty: this.inferDifficulty(exercise),
        subjects: ['English', 'Vocabulary'],
        topics: ['Synonyms', 'Word Meaning'],
        learningObjectives: [
          'Identify words with similar meanings',
          'Expand vocabulary knowledge',
          'Practice word associations'
        ],
        estimatedTime: this.estimateTime(exercise),
        language: 'en',
        accessibility: {
          screenReader: true,
          highContrast: true,
          keyboardOnly: true,
          audioRequired: false,
          visualRequired: true
        },
        configuration: {
          requiredSelections: exercise.requiredSelections || 2,
          allowMultipleAttempts: true,
          showHintsAfterMistakes: true,
          autoAdvance: false
        }
      },
      content: {
        question: {
          en: exercise.question || 'Find the two synonyms below. Synonyms are words with the same meaning or almost the same meaning.'
        },
        instruction: {
          en: `Select ${exercise.requiredSelections || 2} words that have similar meanings.`
        },
        elements: {
          options: exercise.options.map(option => ({
            id: this.generateOptionId(option),
            content: {
              text: {
                en: option.word
              },
              audio: option.audio ? {
                url: `speech:${option.word}`,
                transcript: { en: option.word },
                autoPlay: false
              } : undefined
            },
            metadata: {
              isCorrect: option.isCorrect,
              category: 'synonym',
              tags: ['vocabulary', 'meaning'],
              weight: 1,
              difficulty: 5
            },
            presentation: {
              size: 'medium',
              prominence: 'primary'
            }
          }))
        }
      },
      solution: {
        correct: exercise.options
          .map((option, index) => option.isCorrect ? index : null)
          .filter(index => index !== null),
        explanation: {
          en: this.generateExplanation(exercise, 'synonym')
        },
        hints: [
          { en: 'Think about what each word means.' },
          { en: 'Look for words that could be used in place of each other.' }
        ],
        partialCredit: true
      },
      presentation: {
        layout: 'list',
        variants: ['standard'],
        responsive: {
          breakpoints: {
            mobile: '0px',
            tablet: '768px',
            desktop: '1024px'
          },
          layouts: {
            mobile: 'list',
            tablet: 'grid',
            desktop: 'grid'
          },
          columns: {
            mobile: 1,
            tablet: 2,
            desktop: 3
          }
        }
      }
    };
  }

  /**
   * Migrate Click to Change exercises
   */
  migrateClickToChange(legacyData) {
    const exercises = [];
    
    if (legacyData.exercises) {
      legacyData.exercises.forEach(exercise => {
        exercises.push(this.transformClickToChangeExercise(exercise));
      });
    } else if (Array.isArray(legacyData)) {
      legacyData.forEach(exercise => {
        exercises.push(this.transformClickToChangeExercise(exercise));
      });
    }
    
    return exercises;
  }

  /**
   * Transform click to change exercise to universal schema
   */
  transformClickToChangeExercise(exercise) {
    const exerciseType = exercise.type || 'capitalize';
    
    return {
      metadata: {
        id: this.generateId(exercise.id),
        version: this.migrationVersion,
        type: 'click-to-change',
        difficulty: this.inferDifficulty(exercise),
        subjects: ['English', 'Grammar'],
        topics: exerciseType === 'capitalize' ? ['Capitalization'] : ['Pronouns'],
        learningObjectives: [
          exerciseType === 'capitalize' 
            ? 'Identify words that should be capitalized'
            : 'Identify pronouns in sentences'
        ],
        estimatedTime: this.estimateTime(exercise),
        language: 'en',
        accessibility: {
          screenReader: true,
          highContrast: true,
          keyboardOnly: true,
          audioRequired: false,
          visualRequired: true
        },
        configuration: {
          requiredSelections: this.countCorrectClickToChange(exercise),
          allowMultipleAttempts: true,
          showHintsAfterMistakes: true,
          autoAdvance: false
        }
      },
      content: {
        question: {
          en: exercise.question || this.generateClickToChangeQuestion(exerciseType)
        },
        instruction: {
          en: this.generateClickToChangeInstruction(exerciseType)
        },
        elements: {
          options: exercise.words.map((word, index) => ({
            id: this.generateOptionId({ word: word.text, index }),
            content: {
              text: {
                en: word.text
              }
            },
            metadata: {
              isCorrect: word.shouldCapitalize || word.isPronoun || false,
              category: exerciseType,
              tags: [exerciseType],
              weight: 1,
              difficulty: 5,
              shouldCapitalize: word.shouldCapitalize,
              isPronoun: word.isPronoun
            },
            presentation: {
              size: 'medium',
              prominence: word.shouldCapitalize || word.isPronoun ? 'primary' : 'secondary'
            }
          }))
        }
      },
      solution: {
        correct: exercise.words
          .map((word, index) => (word.shouldCapitalize || word.isPronoun) ? index : null)
          .filter(index => index !== null),
        explanation: {
          en: this.generateClickToChangeExplanation(exercise, exerciseType)
        },
        hints: [
          { en: exerciseType === 'capitalize' 
              ? 'Look for proper nouns and sentence beginnings.' 
              : 'Look for words that replace nouns like he, she, it, they.' }
        ],
        partialCredit: true
      },
      presentation: {
        layout: 'list',
        variants: ['standard'],
        responsive: {
          breakpoints: {
            mobile: '0px',
            tablet: '768px',
            desktop: '1024px'
          },
          layouts: {
            mobile: 'list',
            tablet: 'list',
            desktop: 'list'
          },
          columns: {
            mobile: 1,
            tablet: 1,
            desktop: 1
          }
        }
      }
    };
  }

  /**
   * Helper Methods
   */

  generateId(originalId) {
    return originalId ? `migrated-${originalId}-${uuidv4()}` : uuidv4();
  }

  generateOptionId(option) {
    const baseId = option.id || option.word || option.text || 'option';
    return `opt-${baseId}-${uuidv4()}`;
  }

  inferDifficulty(exercise) {
    // Infer difficulty based on exercise characteristics
    if (exercise.difficulty) return exercise.difficulty;
    
    const optionCount = exercise.options ? exercise.options.length : exercise.words?.length || 3;
    const requiredSelections = exercise.requiredSelections || 1;
    
    if (optionCount <= 3 && requiredSelections <= 2) return 'beginner';
    if (optionCount <= 5 && requiredSelections <= 3) return 'intermediate';
    return 'advanced';
  }

  estimateTime(exercise) {
    // Estimate completion time based on exercise complexity
    const baseTime = 60; // 1 minute base
    const optionCount = exercise.options ? exercise.options.length : exercise.words?.length || 3;
    const timePerOption = 15; // 15 seconds per option
    
    return Math.min(baseTime + (optionCount * timePerOption), 300); // Max 5 minutes
  }

  generateExplanation(exercise, type) {
    switch (type) {
      case 'sound-matching':
        const endSounds = exercise.options
          ?.filter(opt => opt.isCorrect)
          ?.map(opt => opt.endSound)
          ?.filter(sound => sound) || [];
        return `The correct words both end with the "${endSounds[0] || 'same'}" sound.`;
      
      case 'synonym':
        const synonyms = exercise.options
          ?.filter(opt => opt.isCorrect)
          ?.map(opt => opt.word) || [];
        return `"${synonyms[0]}" and "${synonyms[1]}" have similar meanings.`;
      
      default:
        return 'These are the correct answers for this exercise.';
    }
  }

  countCorrectClickToChange(exercise) {
    return exercise.words?.filter(word => word.shouldCapitalize || word.isPronoun)?.length || 1;
  }

  generateClickToChangeQuestion(type) {
    switch (type) {
      case 'capitalize':
        return 'Click on the words that should be capitalized.';
      case 'pronoun':
        return 'Click on all the pronouns in the sentence.';
      default:
        return 'Click on the correct words.';
    }
  }

  generateClickToChangeInstruction(type) {
    switch (type) {
      case 'capitalize':
        return 'Find and click all words that should begin with a capital letter.';
      case 'pronoun':
        return 'Find and click all pronouns (words that replace nouns like he, she, it, they).';
      default:
        return 'Click on the words that match the criteria.';
    }
  }

  generateClickToChangeExplanation(exercise, type) {
    const correctWords = exercise.words
      ?.filter(word => word.shouldCapitalize || word.isPronoun)
      ?.map(word => word.text) || [];
    
    switch (type) {
      case 'capitalize':
        return `The words that should be capitalized are: ${correctWords.join(', ')}.`;
      case 'pronoun':
        return `The pronouns in this sentence are: ${correctWords.join(', ')}.`;
      default:
        return `The correct words are: ${correctWords.join(', ')}.`;
    }
  }

  /**
   * Migrate other exercise types (placeholder implementations)
   * These would be implemented based on the specific structure of each exercise type
   */

  migrateDragDrop(legacyData) {
    // Implementation for drag and drop migration
    console.log('Migrating drag and drop exercises...');
    return this.createPlaceholderMigration('drag-drop', legacyData);
  }

  migrateFillBlanks(legacyData) {
    // Implementation for fill in the blanks migration
    console.log('Migrating fill in the blanks exercises...');
    return this.createPlaceholderMigration('fill-blanks', legacyData);
  }

  migrateMultipleChoice(legacyData) {
    // Implementation for multiple choice migration
    console.log('Migrating multiple choice exercises...');
    return this.createPlaceholderMigration('multiple-choice', legacyData);
  }

  migrateSingleAnswer(legacyData) {
    // Implementation for single answer migration
    console.log('Migrating single answer exercises...');
    return this.createPlaceholderMigration('single-answer', legacyData);
  }

  migrateGapFill(legacyData) {
    // Implementation for gap fill migration
    console.log('Migrating gap fill exercises...');
    return this.createPlaceholderMigration('gap-fill', legacyData);
  }

  migrateHighlight(legacyData) {
    // Implementation for highlight migration
    console.log('Migrating highlight exercises...');
    return this.createPlaceholderMigration('highlight', legacyData);
  }

  migrateSequencing(legacyData) {
    // Implementation for sequencing migration
    console.log('Migrating sequencing exercises...');
    return this.createPlaceholderMigration('sequencing', legacyData);
  }

  migrateSyllableCounting(legacyData) {
    // Implementation for syllable counting migration
    console.log('Migrating syllable counting exercises...');
    return this.createPlaceholderMigration('syllable-counting', legacyData);
  }

  migrateTableExercise(legacyData) {
    // Implementation for table exercise migration
    console.log('Migrating table exercises...');
    return this.createPlaceholderMigration('table-exercise', legacyData);
  }

  migrateRhymeExercises(legacyData) {
    // Implementation for rhyme exercises migration
    console.log('Migrating rhyme exercises...');
    return this.createPlaceholderMigration('rhyme-exercises', legacyData);
  }

  /**
   * Create a placeholder migration for exercise types not yet implemented
   */
  createPlaceholderMigration(exerciseType, legacyData) {
    return [{
      metadata: {
        id: uuidv4(),
        version: this.migrationVersion,
        type: exerciseType,
        difficulty: 'beginner',
        subjects: ['General'],
        topics: ['General'],
        learningObjectives: ['Complete the exercise'],
        estimatedTime: 120,
        language: 'en',
        accessibility: {
          screenReader: true,
          highContrast: true,
          keyboardOnly: true,
          audioRequired: false,
          visualRequired: true
        },
        configuration: {
          requiredSelections: 1,
          allowMultipleAttempts: true,
          showHintsAfterMistakes: true,
          autoAdvance: false
        }
      },
      content: {
        question: {
          en: 'Complete this exercise.'
        },
        elements: {
          options: [],
          media: [],
          interactions: []
        },
        customContent: legacyData // Preserve original data for later detailed migration
      },
      solution: {
        correct: [],
        explanation: {
          en: 'Exercise completed successfully.'
        },
        hints: [],
        partialCredit: false
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
          layouts: {
            mobile: 'grid',
            tablet: 'grid',
            desktop: 'grid'
          },
          columns: {
            mobile: 1,
            tablet: 2,
            desktop: 3
          }
        }
      }
    }];
  }
}

/**
 * Convenience function to migrate exercise data
 * @param {Object} legacyData - Legacy exercise data
 * @param {string} exerciseType - Type of exercise
 * @returns {Array} Array of migrated exercises
 */
export function migrateExerciseData(legacyData, exerciseType) {
  const migrator = new DataMigration();
  return migrator.migrate(legacyData, exerciseType);
}

export default DataMigration;
