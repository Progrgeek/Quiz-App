/**
 * Universal Exercise Schema Implementation
 * Solves the field mismatch problem once and for all
 * 
 * This class normalizes all exercise types into a consistent format
 * while maintaining backward compatibility with existing components.
 */

export class UniversalExercise {
  constructor(rawData) {
    this.rawData = rawData;
    this.data = this.normalize(rawData);
    this.validate();
  }

  /**
   * Main normalization method - detects format and converts
   */
  normalize(rawData) {
    // If already in universal format, return as-is
    if (this.isUniversalFormat(rawData)) {
      return rawData;
    }

    // Detect and convert from legacy formats
    const exerciseType = this.detectExerciseType(rawData);
    
    switch (exerciseType) {
      case 'multiple-choice':
      case 'multiple-answers':
        return this.normalizeMultipleChoice(rawData);
      
      case 'single-answer':
      case 'number_comparison':
      case 'single-choice':
        return this.normalizeSingleAnswer(rawData);
      
      case 'fill-in-blanks':
      case 'simple_text':
        return this.normalizeFillInBlanks(rawData);
      
      case 'gap-fill':
        return this.normalizeGapFill(rawData);
      
      case 'drag-and-drop':
        return this.normalizeDragAndDrop(rawData);
      
      case 'sequencing':
        return this.normalizeSequencing(rawData);
      
      case 'click-to-change':
      case 'capitalize':
        return this.normalizeClickToChange(rawData);
      
      case 'highlight':
        return this.normalizeHighlight(rawData);
      
      case 'table':
        return this.normalizeTable(rawData);
      
      default:
        throw new Error(`Unknown exercise type detected: ${exerciseType}`);
    }
  }

  /**
   * Detect exercise type from raw data structure
   */
  detectExerciseType(rawData) {
    // Check for explicit exerciseType field first (most reliable)
    if (rawData.exerciseType) {
      return rawData.exerciseType;
    }
    
    // Detect from structure (most specific first)
    if (rawData.sentence && (rawData.sentence.includes('{answer}') || rawData.correctAnswer)) {
      return 'fill-in-blanks';
    }
    
    if (rawData.draggableItems || rawData.dropZones || (rawData.items && rawData.correctMatches)) {
      return 'drag-and-drop';
    }
    
    if (rawData.words && Array.isArray(rawData.words)) {
      if (rawData.words[0]?.shouldCapitalize !== undefined || rawData.words[0]?.shouldChange !== undefined) {
        return 'click-to-change';
      }
      if (rawData.words[0]?.shouldHighlight !== undefined || rawData.correctWords) {
        return 'highlight';
      }
      return 'highlight'; // Default for word arrays
    }
    
    if (rawData.options && Array.isArray(rawData.options)) {
      if (rawData.requiredSelections > 1) {
        return 'multiple-answers';
      }
      return rawData.options.length > 4 ? 'multiple-choice' : 'single-answer';
    }
    
    if (rawData.text && typeof rawData.text === 'string' && rawData.text.includes('___')) {
      return 'gap-fill';
    }
    
    if (rawData.sequence || rawData.correctOrder || rawData.correctSequence) {
      return 'sequencing';
    }
    
    if (rawData.rows && rawData.columns) {
      return 'table';
    }
    
    // Check for type field last (less reliable)
    if (rawData.type) {
      return rawData.type;
    }
    
    // Fallback
    return 'multiple-choice';
  }

  /**
   * Check if data is already in universal format
   */
  isUniversalFormat(data) {
    return data && 
           data.metadata && 
           data.content && 
           data.metadata.type && 
           data.content.question !== undefined &&
           data.content.elements !== undefined &&
           data.content.solution !== undefined;
  }

  /**
   * Normalize Multiple Choice exercises
   */
  normalizeMultipleChoice(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'multiple-choice',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 30,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Select the correct answer(s)',
        elements: {
          options: data.options || [],
          blanks: null,
          items: null,
          zones: null,
          text: null,
          media: data.media || null
        },
        solution: {
          type: (data.requiredSelections > 1 || (data.correctAnswers && data.correctAnswers.length > 1)) 
                ? 'multiple_choice' 
                : 'single_choice',
          value: data.correctAnswers || data.correctAnswer || [],
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: data.layout || 'grid',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        requiredSelections: data.requiredSelections || 1
      }
    };
  }

  /**
   * Normalize Single Answer exercises
   */
  normalizeSingleAnswer(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'single-answer',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 30,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Select the correct answer',
        elements: {
          options: data.options || [],
          blanks: null,
          items: null,
          zones: null,
          text: null,
          media: data.media || null
        },
        solution: {
          type: 'single_choice',
          value: data.correctAnswers ? data.correctAnswers[0] : data.correctAnswer,
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: data.layout || 'grid',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true
      }
    };
  }

  /**
   * Normalize Fill in the Blanks exercises
   */
  normalizeFillInBlanks(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'fill-in-blanks',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 45,
        knowledgeAreas: data.knowledgeAreas || ['language'],
        version: '1.0'
      },
      content: {
        question: data.question || data.sentence || '',
        instruction: data.instruction || 'Fill in the blank',
        elements: {
          options: null,
          blanks: this.extractBlanks(data.sentence || data.question),
          items: null,
          zones: null,
          text: data.sentence || data.question,
          media: data.media || null
        },
        solution: {
          type: 'text_input',
          value: data.correctAnswer || data.answer,
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'text_input',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        hint: data.hint
      }
    };
  }

  /**
   * Normalize Drag and Drop exercises
   */
  normalizeDragAndDrop(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'drag-and-drop',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 60,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Drag items to the correct positions',
        elements: {
          options: null,
          blanks: null,
          items: data.draggableItems || data.items || [],
          zones: data.dropZones || data.zones || [],
          text: null,
          media: data.media || null
        },
        solution: {
          type: 'drag_positions',
          value: data.correctMatches || data.correctPositions || {},
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'drag_drop',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true
      }
    };
  }

  /**
   * Normalize Click to Change exercises
   */
  normalizeClickToChange(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'click-to-change',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 45,
        knowledgeAreas: data.knowledgeAreas || ['language'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Click on the words that need to be changed',
        elements: {
          options: null,
          blanks: null,
          items: null,
          zones: null,
          text: null,
          words: data.words || [],
          media: data.media || null
        },
        solution: {
          type: 'word_selection',
          value: this.extractCorrectWords(data.words, data.type),
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'word_selection',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        changeType: data.type
      }
    };
  }

  /**
   * Normalize Highlight exercises
   */
  normalizeHighlight(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'highlight',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 30,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Select the highlighted words',
        elements: {
          options: null,
          blanks: null,
          items: null,
          zones: null,
          text: data.text || '',
          words: data.words || [],
          media: data.media || null
        },
        solution: {
          type: 'word_selection',
          value: data.correctWords || this.extractCorrectWords(data.words, 'highlight'),
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'word_highlight',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        highlightType: data.type || 'highlight'
      }
    };
  }

  /**
   * Normalize Gap Fill exercises
   */
  normalizeGapFill(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'gap-fill',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 30,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Fill in the gaps',
        elements: {
          options: null,
          blanks: this.extractBlanks(data.text),
          items: null,
          zones: null,
          text: data.text || '',
          media: data.media || null
        },
        solution: {
          type: 'text_input',
          value: data.correctAnswers || data.answers || [],
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'gap_fill',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        inputType: data.inputType || 'text'
      }
    };
  }

  /**
   * Normalize Sequencing exercises
   */
  normalizeSequencing(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'sequencing',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 45,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Put the items in the correct order',
        elements: {
          options: null,
          blanks: null,
          items: data.items || data.sequence || [],
          zones: null,
          text: null,
          media: data.media || null
        },
        solution: {
          type: 'sequence',
          value: data.correctOrder || data.correctSequence || [],
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'sequence',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        sequenceType: data.type || 'order'
      }
    };
  }

  /**
   * Normalize Table exercises
   */
  normalizeTable(data) {
    return {
      metadata: {
        id: data.id || `ex_${Date.now()}`,
        type: 'table',
        difficulty: data.difficulty || 'medium',
        estimatedTime: data.estimatedTime || 60,
        knowledgeAreas: data.knowledgeAreas || ['general'],
        version: '1.0'
      },
      content: {
        question: data.question || data.instruction || '',
        instruction: data.instruction || 'Complete the table',
        elements: {
          options: null,
          blanks: null,
          items: null,
          zones: null,
          text: null,
          table: {
            headers: data.headers || [],
            rows: data.rows || [],
            columns: data.columns || []
          },
          media: data.media || null
        },
        solution: {
          type: 'table_completion',
          value: data.correctValues || data.answers || [],
          explanation: data.explanation || data.feedback || ''
        }
      },
      example: this.createExample(data),
      presentation: {
        layout: 'table',
        showHints: Boolean(data.hint),
        showProgress: true,
        animations: true,
        tableType: data.type || 'completion'
      }
    };
  }

  /**
   * Extract correct words for click-to-change exercises
   */
  extractCorrectWords(words, changeType) {
    if (!words || !Array.isArray(words)) return [];
    
    return words.reduce((correct, word, index) => {
      let shouldSelect = false;
      
      switch (changeType) {
        case 'capitalize':
          shouldSelect = word.shouldCapitalize;
          break;
        case 'pronoun':
          shouldSelect = word.isPronoun;
          break;
        case 'verb':
          shouldSelect = word.isVerb;
          break;
        default:
          shouldSelect = word.isCorrect || word.shouldChange;
      }
      
      if (shouldSelect) {
        correct.push(index);
      }
      
      return correct;
    }, []);
  }

  /**
   * Extract blanks from sentence
   */
  extractBlanks(sentence) {
    if (!sentence) return [];
    
    const blanks = [];
    const regex = /\{([^}]+)\}/g;
    let match;
    
    while ((match = regex.exec(sentence)) !== null) {
      blanks.push({
        placeholder: match[1],
        position: match.index,
        length: match[0].length
      });
    }
    
    return blanks;
  }

  /**
   * Create example section
   */
  createExample(data) {
    if (!data.example && !data.exampleQuestion) {
      return { enabled: false, content: null };
    }
    
    // If explicit example provided
    if (data.example) {
      return {
        enabled: true,
        content: data.example
      };
    }
    
    // Generate simple example from existing data
    return {
      enabled: Boolean(data.exampleQuestion),
      content: data.exampleQuestion ? {
        question: data.exampleQuestion,
        elements: data.exampleElements || null,
        solution: data.exampleSolution || null
      } : null
    };
  }

  /**
   * Validate universal format
   */
  validate() {
    if (!this.data.metadata?.type) {
      throw new Error('Exercise must have a type');
    }
    if (!this.data.content?.question) {
      throw new Error('Exercise must have a question');
    }
    if (!this.data.content?.solution) {
      throw new Error('Exercise must have a solution');
    }
  }

  /**
   * Convert back to format expected by existing components
   */
  getForRenderer() {
    const type = this.data.metadata.type;
    const content = this.data.content;
    const presentation = this.data.presentation;
    
    switch (type) {
      case 'multiple-choice':
      case 'multiple-answers':
        return {
          question: content.question,
          instruction: content.instruction,
          options: content.elements.options,
          correctAnswers: Array.isArray(content.solution.value) 
            ? content.solution.value 
            : [content.solution.value],
          explanation: content.solution.explanation,
          requiredSelections: presentation.requiredSelections || 1,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'single-answer':
        return {
          question: content.question,
          instruction: content.instruction,
          options: content.elements.options,
          correctAnswer: content.solution.value,
          correctAnswers: [content.solution.value],
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'fill-in-blanks':
        return {
          question: content.question,
          sentence: content.elements.text,
          correctAnswer: content.solution.value,
          hint: presentation.hint,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'drag-and-drop':
        return {
          question: content.question,
          instruction: content.instruction,
          draggableItems: content.elements.items,
          dropZones: content.elements.zones,
          correctMatches: content.solution.value,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'click-to-change':
        return {
          question: content.question,
          instruction: content.instruction,
          words: content.elements.words,
          type: presentation.changeType,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'highlight':
        return {
          question: content.question,
          instruction: content.instruction,
          words: content.elements.words,
          text: content.elements.text,
          correctWords: content.solution.value,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'gap-fill':
        return {
          question: content.question,
          instruction: content.instruction,
          text: content.elements.text,
          blanks: content.elements.blanks,
          correctAnswers: content.solution.value,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'sequencing':
        return {
          question: content.question,
          instruction: content.instruction,
          items: content.elements.items,
          correctOrder: content.solution.value,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      case 'table':
        return {
          question: content.question,
          instruction: content.instruction,
          headers: content.elements.table.headers,
          rows: content.elements.table.rows,
          columns: content.elements.table.columns,
          correctValues: content.solution.value,
          explanation: content.solution.explanation,
          exerciseType: type,
          media: content.elements.media
        };
        
      default:
        // Return original data as fallback
        return this.rawData;
    }
  }

  /**
   * Get example data for renderer
   */
  getExampleForRenderer() {
    if (!this.data.example.enabled || !this.data.example.content) {
      return null;
    }
    
    // Create a new UniversalExercise for the example
    const exampleData = {
      ...this.rawData,
      ...this.data.example.content,
      isExample: true
    };
    
    const exampleExercise = new UniversalExercise(exampleData);
    return exampleExercise.getForRenderer();
  }

  /**
   * Get metadata
   */
  getMetadata() {
    return this.data.metadata;
  }

  /**
   * Get presentation settings
   */
  getPresentation() {
    return this.data.presentation;
  }
}

export default UniversalExercise;
