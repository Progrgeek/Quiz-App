/**
 * Multiple Choice Exercise
 * 
 * Extends BaseExercise to provide multiple choice functionality
 * while preserving the original UI and behavior of the MultipleAnswers component.
 * 
 * This class handles:
 * - Single and multiple selection modes
 * - Sound matching exercises
 * - Synonym exercises
 * - Audio playback
 * - Visual feedback
 */

import BaseExercise from '../base/BaseExercise.js';

export class MultipleChoiceExercise extends BaseExercise {
  constructor(config = {}) {
    super(config);
    
    // Multiple choice specific configuration
    this.selectionMode = config.selectionMode || 'multiple'; // 'single' | 'multiple'
    this.allowPartialCredit = config.allowPartialCredit !== false;
    this.requiredSelections = config.requiredSelections || 1;
    this.exerciseType = config.exerciseType || 'general';
    
    // Audio system
    this.speechSynthesis = window.speechSynthesis;
    this.isPlayingAudio = false;
    this.audioQueue = [];
    
    // UI state specific to multiple choice
    this.extendState({
      selectedAnswers: [], // For backward compatibility with MultipleAnswers
      isPlayingAudio: false,
      currentlyPlayingOption: null
    });
  }

  /**
   * Extend the base state with multiple choice specific state
   */
  extendState(additionalState) {
    this.state = { ...this.state, ...additionalState };
  }

  /**
   * Get exercise type identifier
   */
  getType() {
    return 'multiple-choice';
  }

  /**
   * Setup multiple choice specific interactions
   */
  setupInteractions() {
    super.setupInteractions();
    
    // Setup audio controls
    this.setupAudioSystem();
    
    // Setup option selection
    this.setupOptionSelection();
  }

  /**
   * Setup audio system for sound matching exercises
   */
  setupAudioSystem() {
    // Preload voices
    this.loadVoices();
    
    // Handle voices changed event
    this.speechSynthesis.addEventListener('voiceschanged', () => {
      this.loadVoices();
    });
  }

  /**
   * Load available voices for speech synthesis
   */
  loadVoices() {
    const voices = this.speechSynthesis.getVoices();
    this.englishVoice = voices.find(
      voice => voice.lang.startsWith('en-') && voice.localService === true
    ) || voices.find(voice => voice.lang.startsWith('en-'));
  }

  /**
   * Setup option selection behavior
   */
  setupOptionSelection() {
    // This will be handled by the React component
    // But we can define the logic here
  }

  /**
   * Render method - returns render instructions for React component
   */
  render() {
    return {
      type: 'multiple-choice',
      config: {
        selectionMode: this.selectionMode,
        requiredSelections: this.requiredSelections,
        exerciseType: this.exerciseType,
        allowPartialCredit: this.allowPartialCredit
      },
      state: this.getState(),
      methods: {
        selectOption: this.selectOption.bind(this),
        playAudio: this.playWordAudio.bind(this),
        playAllAudio: this.playAllAudio.bind(this),
        submitAnswer: this.submitAnswer.bind(this),
        reset: this.reset.bind(this)
      },
      content: this.getProcessedContent()
    };
  }

  /**
   * Get processed content for rendering
   */
  getProcessedContent() {
    // If using new schema format
    if (this.schema && this.schema.content) {
      return this.processSchemaContent();
    }
    
    // If using legacy format (for backward compatibility)
    if (this.exerciseData) {
      return this.processLegacyContent();
    }
    
    return { question: '', options: [] };
  }

  /**
   * Process content from universal schema
   */
  processSchemaContent() {
    const { content } = this.schema;
    
    return {
      question: this.getLocalizedText(content.question),
      instruction: this.getLocalizedText(content.instruction),
      options: content.elements.options.map(option => ({
        id: option.id,
        word: this.getLocalizedText(option.content.text),
        image: option.content.image?.url,
        isCorrect: option.metadata.isCorrect,
        endSound: option.metadata.endSound,
        category: option.metadata.category,
        audio: option.content.audio?.url !== undefined
      }))
    };
  }

  /**
   * Process legacy content format (preserving original structure)
   */
  processLegacyContent() {
    const data = this.exerciseData;
    
    // Handle multiple exercises format
    if (data.soundMatchingExercises || data.synonymExercises) {
      const allExercises = [
        ...(data.soundMatchingExercises || []).map(ex => ({ ...ex, exerciseType: 'sound_matching' })),
        ...(data.synonymExercises || []).map(ex => ({ ...ex, exerciseType: 'synonym' }))
      ];
      
      const currentExercise = allExercises[this.state.currentIndex] || allExercises[0];
      return this.formatLegacyExercise(currentExercise);
    }
    
    // Handle single exercise format
    if (data.question && data.options) {
      return this.formatLegacyExercise(data);
    }
    
    return { question: '', options: [] };
  }

  /**
   * Format legacy exercise to consistent structure
   */
  formatLegacyExercise(exercise) {
    return {
      question: exercise.question || '',
      options: exercise.options || [],
      requiredSelections: exercise.requiredSelections || 1,
      exerciseType: exercise.exerciseType || exercise.type || 'general'
    };
  }

  /**
   * Handle option selection (preserving original MultipleAnswers logic)
   */
  selectOption(index) {
    const selectedAnswers = [...this.state.selectedAnswers];
    const isSelected = selectedAnswers.includes(index);
    
    if (isSelected) {
      // Remove selection
      const newSelected = selectedAnswers.filter(i => i !== index);
      this.updateState({ selectedAnswers: newSelected });
      this.announceToScreenReader(this.t('accessibility.optionDeselected'));
    } else {
      // Add selection
      if (this.selectionMode === 'single') {
        // Single selection mode
        this.updateState({ selectedAnswers: [index] });
      } else {
        // Multiple selection mode
        if (selectedAnswers.length < this.requiredSelections) {
          this.updateState({ selectedAnswers: [...selectedAnswers, index] });
        } else {
          // Maximum selections reached
          return;
        }
      }
      this.announceToScreenReader(this.t('accessibility.optionSelected'));
    }
    
    // Emit interaction event
    this.emit('userInteraction', {
      type: 'option_select',
      option: index,
      selected: !isSelected,
      totalSelected: this.state.selectedAnswers.length
    });
  }

  /**
   * Play audio for a specific word
   */
  async playWordAudio(word, options = {}) {
    if (this.isPlayingAudio) return;
    
    this.updateState({ 
      isPlayingAudio: true,
      currentlyPlayingOption: word 
    });
    
    try {
      await this.speak(word, {
        rate: options.rate || 0.8,
        pitch: options.pitch || 1,
        volume: options.volume || 1
      });
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      this.updateState({ 
        isPlayingAudio: false,
        currentlyPlayingOption: null 
      });
    }
  }

  /**
   * Play audio for all options
   */
  async playAllAudio() {
    if (this.isPlayingAudio) return;
    
    const content = this.getProcessedContent();
    const options = content.options || [];
    
    this.updateState({ isPlayingAudio: true });
    
    try {
      for (const option of options) {
        await this.speak(option.word, { rate: 0.8, pitch: 1 });
        // Small pause between words
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error('Error playing all audio:', error);
    } finally {
      this.updateState({ isPlayingAudio: false });
    }
  }

  /**
   * Speech synthesis helper
   */
  async speak(text, options = {}) {
    return new Promise((resolve, reject) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = options.rate || 0.9;
      utterance.pitch = options.pitch || 1;
      utterance.volume = options.volume || 1;
      
      if (this.englishVoice) {
        utterance.voice = this.englishVoice;
      }
      
      utterance.onend = () => resolve();
      utterance.onerror = (error) => reject(error);
      
      this.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Get current answer from UI state
   */
  getCurrentAnswer() {
    return this.state.selectedAnswers;
  }

  /**
   * Validate the user's answer
   */
  async validateAnswer(selectedAnswers = null) {
    const answer = selectedAnswers || this.state.selectedAnswers;
    const content = this.getProcessedContent();
    
    // Get correct answer indices
    const correctIndices = content.options
      .map((option, index) => option.isCorrect ? index : null)
      .filter(index => index !== null);
    
    // Check if answer is correct
    const isAllCorrect = answer.length === correctIndices.length &&
      answer.every(index => correctIndices.includes(index)) &&
      correctIndices.every(index => answer.includes(index));
    
    // Calculate partial credit if enabled
    let isPartiallyCorrect = false;
    if (this.allowPartialCredit && !isAllCorrect) {
      const correctSelections = answer.filter(index => correctIndices.includes(index));
      isPartiallyCorrect = correctSelections.length > 0 && correctSelections.length < correctIndices.length;
    }
    
    return {
      isCorrect: isAllCorrect,
      isPartiallyCorrect: isPartiallyCorrect,
      correctIndices: correctIndices,
      userAnswer: answer,
      explanation: this.getExplanation(isAllCorrect, correctIndices, content.options)
    };
  }

  /**
   * Generate explanation for the answer
   */
  getExplanation(isCorrect, correctIndices, options) {
    if (isCorrect) {
      return this.t('feedback.correct');
    }
    
    const correctWords = correctIndices.map(index => options[index].word);
    
    // Generate exercise-type specific explanation
    const exerciseType = this.getProcessedContent().exerciseType;
    
    switch (exerciseType) {
      case 'sound_matching':
        return `The correct words are: ${correctWords.join(' and ')}. They have the same ending sound.`;
      case 'synonym':
        return `The synonyms are: ${correctWords.join(' and ')}. They have similar meanings.`;
      default:
        return `The correct answers are: ${correctWords.join(', ')}.`;
    }
  }

  /**
   * Calculate score based on answer
   */
  calculateScore(answer = null) {
    const validation = this.validateAnswer(answer);
    
    if (validation.isCorrect) {
      return 100;
    } else if (validation.isPartiallyCorrect && this.allowPartialCredit) {
      const content = this.getProcessedContent();
      const correctIndices = content.options
        .map((option, index) => option.isCorrect ? index : null)
        .filter(index => index !== null);
      
      const userAnswer = answer || this.state.selectedAnswers;
      const correctSelections = userAnswer.filter(index => correctIndices.includes(index));
      
      // Partial credit based on percentage of correct selections
      return Math.round((correctSelections.length / correctIndices.length) * 100);
    }
    
    return 0;
  }

  /**
   * Provide feedback specific to multiple choice
   */
  provideFeedback(validation) {
    super.provideFeedback(validation);
    
    // Additional feedback for multiple choice
    if (validation.isPartiallyCorrect) {
      this.announceToScreenReader(this.t('feedback.partiallyCorrect'));
    }
    
    // If incorrect, show correct answer after a delay (if configured)
    if (!validation.isCorrect && this.schema?.metadata?.configuration?.showHintsAfterMistakes) {
      setTimeout(() => {
        this.showCorrectAnswer(validation);
      }, 2000);
    }
  }

  /**
   * Show correct answer
   */
  showCorrectAnswer(validation) {
    this.updateState({
      showCorrectAnswer: true,
      correctAnswerIndices: validation.correctIndices
    });
    
    this.announceToScreenReader(validation.explanation);
  }

  /**
   * Reset exercise to initial state
   */
  reset() {
    super.reset();
    this.updateState({
      selectedAnswers: [],
      isPlayingAudio: false,
      currentlyPlayingOption: null,
      showCorrectAnswer: false,
      correctAnswerIndices: []
    });
  }

  /**
   * Move to next question (for multi-question exercises)
   */
  moveToNext() {
    // Handle progression through multiple exercises
    const content = this.getProcessedContent();
    
    if (this.exerciseData.soundMatchingExercises || this.exerciseData.synonymExercises) {
      const allExercises = [
        ...(this.exerciseData.soundMatchingExercises || []),
        ...(this.exerciseData.synonymExercises || [])
      ];
      
      if (this.state.currentIndex + 1 < allExercises.length) {
        this.updateState({
          currentIndex: this.state.currentIndex + 1,
          selectedAnswers: [],
          showFeedback: false,
          showCorrectAnswer: false
        });
        
        this.emit('questionChanged', {
          currentIndex: this.state.currentIndex,
          totalQuestions: allExercises.length
        });
      } else {
        this.complete();
      }
    } else {
      this.complete();
    }
  }

  /**
   * Check if answer can be submitted
   */
  canSubmitAnswer() {
    const requiredCount = this.requiredSelections || 1;
    return this.state.selectedAnswers.length === requiredCount;
  }

  /**
   * Get selection count text for UI
   */
  getSelectionCountText() {
    const selected = this.state.selectedAnswers.length;
    const required = this.requiredSelections || 1;
    
    return this.t('exerciseTypes.multipleAnswers.selectionCount', {
      selected: selected,
      required: required
    });
  }

  /**
   * Destroy the exercise and cleanup
   */
  destroy() {
    // Stop any playing audio
    if (this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
    
    super.destroy();
  }
}

export default MultipleChoiceExercise;
