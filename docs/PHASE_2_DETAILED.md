# ⚙️ Phase 2: Quiz Engine & Centralized Logic (Week 3-4)

## 🎯 **Phase Objective**
Build a unified QuizEngine that consolidates all exercise logic into a single, powerful system. This engine will handle all exercise types, state management, scoring, and validation - making it trivial to add new exercise types and ensuring consistent behavior across the app.

---

## 📋 **Daily Implementation Schedule**

### **Day 9-10: Engine Architecture**

#### **Day 9 Morning: Core Engine Design**
- [ ] Design QuizEngine class architecture
- [ ] Define exercise type abstractions
- [ ] Create state management patterns with Zustand
- [ ] Design plugin system for exercise types

**Core Engine Structure:**
```javascript
class QuizEngine {
  constructor(exerciseConfig) {
    this.config = exerciseConfig;
    this.state = new ExerciseState();
    this.validator = new ValidationEngine();
    this.scorer = new ScoreCalculator();
    this.timer = new TimerManager();
  }
  
  // Core methods all exercises need
  start() {}
  submitAnswer(answer) {}
  nextQuestion() {}
  previousQuestion() {}
  calculateScore() {}
  getProgress() {}
  reset() {}
  pause() {}
  resume() {}
}
```

#### **Day 9 Afternoon: State Management Setup**
- [ ] Create Zustand stores for exercise state
- [ ] Implement state persistence
- [ ] Design state synchronization patterns
- [ ] Add state debugging tools

**Store Architecture:**
```
src/store/
├── exerciseStore.js     # Current exercise state
├── userProgressStore.js # Long-term progress
├── sessionStore.js      # Current session data
└── settingsStore.js     # App preferences
```

#### **Day 10: Exercise Type System**
- [ ] Define exercise type interfaces
- [ ] Create exercise type registry
- [ ] Implement exercise type plugins
- [ ] Build exercise configuration system

**Exercise Type Registry:**
```javascript
const EXERCISE_TYPES = {
  MULTIPLE_CHOICE: {
    id: 'multipleChoice',
    name: 'Multiple Choice',
    component: MultipleChoiceRenderer,
    validator: multipleChoiceValidator,
    scorer: multipleChoiceScorer,
    config: multipleChoiceConfig
  },
  DRAG_AND_DROP: {
    id: 'dragAndDrop',
    name: 'Drag and Drop',
    component: DragAndDropRenderer,
    validator: dragAndDropValidator,
    scorer: dragAndDropScorer,
    config: dragAndDropConfig
  }
  // ... other types
};
```

---

### **Day 11-12: Validation & Scoring Engine**

#### **Day 11: Validation Engine**
- [ ] Build universal answer validation system
- [ ] Implement type-specific validators
- [ ] Add partial credit scoring
- [ ] Create validation feedback system

**Validation Engine Features:**
```javascript
class ValidationEngine {
  validateAnswer(answer, correctAnswer, exerciseType) {
    const validator = this.getValidator(exerciseType);
    return validator.validate(answer, correctAnswer);
  }
  
  // Handles different answer types
  validateMultipleChoice(selected, correct) {}
  validateDragAndDrop(positions, correctPositions) {}
  validateFillInBlanks(userInput, correctAnswers) {}
  validateSequencing(sequence, correctSequence) {}
}
```

#### **Day 12: Advanced Scoring System**
- [ ] Implement sophisticated scoring algorithms
- [ ] Add time-based scoring bonuses
- [ ] Create difficulty multipliers
- [ ] Build streak and consistency bonuses

**Scoring Features:**
- **Base Score**: Correctness-based scoring
- **Time Bonus**: Faster answers get bonus points
- **Difficulty Multiplier**: Harder questions worth more
- **Streak Bonus**: Consecutive correct answers bonus
- **Consistency Score**: Performance stability over time

---

### **Day 13-14: Universal Exercise Component**

#### **Day 13: Exercise Renderer**
- [ ] Build UniversalExercise component
- [ ] Implement dynamic exercise type rendering
- [ ] Add exercise lifecycle management
- [ ] Create exercise state synchronization

**UniversalExercise Structure:**
```jsx
const UniversalExercise = ({ exerciseId, exerciseType, config }) => {
  const engine = useQuizEngine(exerciseId, exerciseType, config);
  const ExerciseRenderer = getRenderer(exerciseType);
  
  return (
    <ExerciseLayout engine={engine}>
      <QuestionHeader 
        question={engine.currentQuestion}
        progress={engine.progress}
      />
      <ExerciseRenderer 
        question={engine.currentQuestion}
        onAnswer={engine.submitAnswer}
        state={engine.state}
      />
      <ExerciseControls engine={engine} />
    </ExerciseLayout>
  );
};
```

#### **Day 14: Exercise Migration**
- [ ] Create migration utilities
- [ ] Start migrating Multiple Choice exercises
- [ ] Test backward compatibility
- [ ] Performance optimization

**Migration Priority:**
1. Multiple Choice (simplest)
2. Fill in the Blanks
3. Drag and Drop
4. Sequencing
5. Complex exercises (Highlight, etc.)

---

### **Day 15-16: Advanced Features & Migration**

#### **Day 15: Advanced Engine Features**
- [ ] Implement auto-save functionality
- [ ] Add pause/resume capability
- [ ] Create exercise bookmarking
- [ ] Build hint system

**Advanced Features:**
```javascript
class QuizEngine {
  // Auto-save progress every 30 seconds
  enableAutoSave(interval = 30000) {}
  
  // Pause exercise (useful for phone calls, etc.)
  pause() {}
  resume() {}
  
  // Bookmark difficult questions for review
  bookmarkQuestion(questionId) {}
  
  // Progressive hint system
  getHint(level = 1) {}
}
```

#### **Day 16: Complete Migration & Testing**
- [ ] Migrate remaining exercise types
- [ ] Comprehensive integration testing
- [ ] Performance benchmarking
- [ ] Bug fixes and optimization

---

## 🏗️ **Detailed Architecture**

### **QuizEngine Core Class**
```javascript
export class QuizEngine {
  constructor(exerciseConfig) {
    this.id = generateId();
    this.type = exerciseConfig.type;
    this.questions = exerciseConfig.questions;
    this.settings = exerciseConfig.settings;
    
    // Core systems
    this.state = new ExerciseState(this.id);
    this.validator = new ValidationEngine();
    this.scorer = new ScoreCalculator(exerciseConfig.scoring);
    this.timer = new TimerManager();
    this.storage = new StorageManager(this.id);
    
    // Current exercise state
    this.currentQuestionIndex = 0;
    this.answers = new Map();
    this.score = 0;
    this.startTime = null;
    this.endTime = null;
    this.hints = new Map();
    
    // Event system
    this.events = new EventEmitter();
    this.setupEventHandlers();
  }
  
  // Lifecycle methods
  async start() {
    this.startTime = Date.now();
    this.timer.start();
    this.state.status = 'in_progress';
    this.events.emit('exercise:started', this.getState());
    await this.storage.save(this.getState());
  }
  
  async submitAnswer(answer) {
    const question = this.getCurrentQuestion();
    const validation = this.validator.validate(answer, question, this.type);
    
    this.answers.set(this.currentQuestionIndex, {
      answer,
      validation,
      timestamp: Date.now(),
      timeToAnswer: this.timer.getQuestionTime()
    });
    
    // Calculate score with bonuses
    const scoreData = this.scorer.calculateScore(validation, {
      timeToAnswer: this.timer.getQuestionTime(),
      difficulty: question.difficulty,
      hintsUsed: this.hints.get(this.currentQuestionIndex)?.length || 0
    });
    
    this.score += scoreData.points;
    
    this.events.emit('answer:submitted', {
      questionIndex: this.currentQuestionIndex,
      answer,
      validation,
      scoreData
    });
    
    await this.storage.save(this.getState());
    
    return validation;
  }
  
  nextQuestion() {
    if (this.hasNextQuestion()) {
      this.currentQuestionIndex++;
      this.timer.nextQuestion();
      this.events.emit('question:changed', this.getCurrentQuestion());
    } else {
      this.complete();
    }
  }
  
  async complete() {
    this.endTime = Date.now();
    this.timer.stop();
    this.state.status = 'completed';
    
    const finalScore = this.scorer.calculateFinalScore({
      answers: this.answers,
      totalTime: this.getTotalTime(),
      questionsCount: this.questions.length
    });
    
    this.score = finalScore.total;
    
    this.events.emit('exercise:completed', {
      score: finalScore,
      answers: this.answers,
      totalTime: this.getTotalTime()
    });
    
    await this.storage.save(this.getState());
  }
  
  // State management
  getState() {
    return {
      id: this.id,
      type: this.type,
      currentQuestionIndex: this.currentQuestionIndex,
      answers: Array.from(this.answers.entries()),
      score: this.score,
      startTime: this.startTime,
      endTime: this.endTime,
      status: this.state.status,
      timer: this.timer.getState()
    };
  }
  
  async loadState(savedState) {
    Object.assign(this, savedState);
    this.answers = new Map(savedState.answers);
    this.timer.loadState(savedState.timer);
  }
}
```

### **Zustand Store Integration**
```javascript
// exerciseStore.js
export const useExerciseStore = create((set, get) => ({
  // Current exercise
  currentExercise: null,
  currentEngine: null,
  
  // Actions
  startExercise: async (exerciseConfig) => {
    const engine = new QuizEngine(exerciseConfig);
    await engine.start();
    
    set({ 
      currentExercise: exerciseConfig,
      currentEngine: engine 
    });
  },
  
  submitAnswer: async (answer) => {
    const { currentEngine } = get();
    if (currentEngine) {
      const result = await currentEngine.submitAnswer(answer);
      set({}); // Trigger re-render
      return result;
    }
  },
  
  nextQuestion: () => {
    const { currentEngine } = get();
    if (currentEngine) {
      currentEngine.nextQuestion();
      set({}); // Trigger re-render
    }
  },
  
  // Getters
  getCurrentQuestion: () => {
    const { currentEngine } = get();
    return currentEngine?.getCurrentQuestion();
  },
  
  getProgress: () => {
    const { currentEngine } = get();
    return currentEngine?.getProgress();
  }
}));
```

### **Exercise Type Plugin System**
```javascript
// exerciseTypes.js
export class ExerciseTypeRegistry {
  constructor() {
    this.types = new Map();
  }
  
  register(type) {
    this.types.set(type.id, type);
  }
  
  get(typeId) {
    return this.types.get(typeId);
  }
  
  getRenderer(typeId) {
    return this.get(typeId)?.component;
  }
  
  getValidator(typeId) {
    return this.get(typeId)?.validator;
  }
  
  getScorer(typeId) {
    return this.get(typeId)?.scorer;
  }
}

// Built-in exercise types
export const multipleChoiceType = {
  id: 'multipleChoice',
  name: 'Multiple Choice',
  component: MultipleChoiceRenderer,
  validator: (answer, question) => {
    return {
      isCorrect: answer === question.correctAnswer,
      feedback: answer === question.correctAnswer 
        ? 'Correct!' 
        : `Incorrect. The correct answer is ${question.options[question.correctAnswer]}`
    };
  },
  scorer: (validation, metadata) => {
    let points = validation.isCorrect ? 100 : 0;
    
    // Time bonus (up to 50% bonus for quick answers)
    if (validation.isCorrect && metadata.timeToAnswer < 10000) {
      points *= 1 + (10000 - metadata.timeToAnswer) / 20000;
    }
    
    // Difficulty multiplier
    const difficultyMultiplier = {
      easy: 1,
      medium: 1.25,
      hard: 1.5
    };
    points *= difficultyMultiplier[metadata.difficulty] || 1;
    
    // Hint penalty
    points *= Math.max(0.5, 1 - (metadata.hintsUsed * 0.1));
    
    return {
      points: Math.round(points),
      breakdown: {
        base: validation.isCorrect ? 100 : 0,
        timeBonus: Math.round(points - 100),
        difficultyMultiplier,
        hintPenalty: metadata.hintsUsed * 10
      }
    };
  }
};
```

---

## 🧪 **Testing Strategy**

### **Unit Tests**
```javascript
describe('QuizEngine', () => {
  describe('Exercise Lifecycle', () => {
    it('starts exercise correctly', async () => {
      const engine = new QuizEngine(mockConfig);
      await engine.start();
      
      expect(engine.state.status).toBe('in_progress');
      expect(engine.startTime).toBeTruthy();
      expect(engine.timer.isRunning()).toBe(true);
    });
    
    it('handles answer submission', async () => {
      const engine = new QuizEngine(mockConfig);
      await engine.start();
      
      const result = await engine.submitAnswer('answer');
      
      expect(result).toHaveProperty('isCorrect');
      expect(engine.answers.size).toBe(1);
    });
  });
  
  describe('Scoring System', () => {
    it('calculates base score correctly', () => {
      const scorer = new ScoreCalculator();
      const result = scorer.calculateScore(
        { isCorrect: true },
        { timeToAnswer: 5000, difficulty: 'medium' }
      );
      
      expect(result.points).toBeGreaterThan(100);
    });
  });
});
```

### **Integration Tests**
```javascript
describe('Exercise Integration', () => {
  it('completes full exercise flow', async () => {
    const { renderWithProviders } = setupTest();
    
    renderWithProviders(<UniversalExercise exerciseId="test" />);
    
    // Answer all questions
    for (let i = 0; i < 5; i++) {
      await userEvent.click(screen.getByText('Answer A'));
      await userEvent.click(screen.getByText('Next'));
    }
    
    // Check completion
    expect(screen.getByText('Exercise Complete!')).toBeInTheDocument();
  });
});
```

---

## 📊 **Performance Benchmarks**

### **Target Performance Metrics**
- **Engine Initialization**: < 100ms
- **Answer Submission**: < 50ms
- **Question Transition**: < 200ms
- **State Persistence**: < 100ms
- **Memory Usage**: < 50MB for typical exercise

### **Performance Testing**
```javascript
describe('Performance', () => {
  it('initializes engine quickly', async () => {
    const start = performance.now();
    const engine = new QuizEngine(largeExerciseConfig);
    await engine.start();
    const end = performance.now();
    
    expect(end - start).toBeLessThan(100);
  });
  
  it('handles rapid answer submissions', async () => {
    const engine = new QuizEngine(mockConfig);
    await engine.start();
    
    const start = performance.now();
    for (let i = 0; i < 100; i++) {
      await engine.submitAnswer(`answer${i}`);
    }
    const end = performance.now();
    
    expect((end - start) / 100).toBeLessThan(50); // < 50ms per submission
  });
});
```

---

## 📋 **Migration Checklist**

### **Per Exercise Type Migration**
- [ ] **Analyze existing component** - understand current logic
- [ ] **Create exercise type definition** - define plugin structure
- [ ] **Build renderer component** - new component using UI library
- [ ] **Implement validator** - answer validation logic
- [ ] **Create scorer** - scoring algorithm
- [ ] **Write tests** - comprehensive test coverage
- [ ] **Integration testing** - test with UniversalExercise
- [ ] **Performance testing** - ensure no regressions
- [ ] **Update documentation** - migration notes and usage
- [ ] **Deploy and monitor** - gradual rollout with monitoring

### **Exercise Types Priority Order**
1. **Multiple Choice** (simplest, good test case)
2. **Fill in the Blanks** (medium complexity)
3. **Single Answer** (similar to multiple choice)
4. **Multiple Answers** (checkbox variant)
5. **Drag and Drop** (complex interactions)
6. **Sequencing** (ordering logic)
7. **Highlight** (text selection)
8. **Gap Fill** (text manipulation)
9. **Click to Change** (state changes)
10. **Table Exercise** (most complex)

---

## 🎯 **Phase 2 Success Criteria**

### **Must Have (Blocking)**
- ✅ QuizEngine handles all 10 exercise types
- ✅ State management centralized with Zustand
- ✅ All existing exercises migrated to unified engine
- ✅ Performance maintained or improved
- ✅ Backward compatibility ensured

### **Should Have (Important)**
- ✅ Advanced scoring system implemented
- ✅ Auto-save and pause/resume functionality
- ✅ Comprehensive test coverage (90%+)
- ✅ Plugin system for easy exercise type addition
- ✅ Exercise state persistence across sessions

### **Nice to Have (Enhancement)**
- ✅ Hint system integrated
- ✅ Exercise bookmarking
- ✅ Advanced analytics tracking
- ✅ Performance monitoring dashboard
- ✅ A/B testing framework

---

## 🚀 **Transition to Phase 3**

### **Handoff Requirements**
- [ ] All exercise types successfully migrated
- [ ] Performance benchmarks met or exceeded
- [ ] Comprehensive documentation complete
- [ ] Team trained on new engine architecture
- [ ] Production deployment successful

### **Phase 3 Preparation**
- [ ] Analytics data collection points identified
- [ ] Progress tracking requirements defined
- [ ] User behavior tracking patterns planned
- [ ] Dashboard wireframes created
- [ ] Data visualization library evaluated

**Ready for Phase 3 when all exercise types are running through the unified engine and performance targets are met.**
