// Day 5: UI Component Integration Test
// This demonstrates integrating the sophisticated design system with exercise components

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Import Design System Components directly
import Button from '../../design-system/components/Button.jsx';
import { ButtonGroup, IconButton } from '../../design-system/components/Button.jsx';
import Card, { CardHeader, CardTitle, CardContent, CardFooter, ExerciseCard } from '../../design-system/components/Card.jsx';
import Input from '../../design-system/components/Input.jsx';
import { ThemeProvider, useTheme } from '../../design-system/theme/ThemeProvider.jsx';
import { tokens } from '../../design-system/tokens/index.js';
import colors from '../../design-system/tokens/colors.js';

// Import Original Exercise Components (to enhance)
import MultipleAnswers from '../multipleAnswers/MultipleAnswers';
import DragAndDrop from '../dragAndDrop/DragAndDrop';
import FillInTheBlanks from '../fillInTheBlanks/FillInTheBlanks';

// Enhanced Exercise Wrapper with Design System Integration
const DesignSystemEnhancedWrapper = ({ 
  exerciseType, 
  OriginalComponent, 
  exerciseData, 
  onComplete 
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState('');
  const { currentTheme } = useTheme();

  const handleExerciseComplete = (result) => {
    console.log(`Enhanced ${exerciseType} completed:`, result);
    setIsCompleted(true);
    setScore(result.score || 0);
    setFeedback(result.feedback || 'Exercise completed!');
    onComplete?.(result);
  };

  const handleReset = () => {
    setIsCompleted(false);
    setScore(null);
    setFeedback('');
  };

  return (
    <ExerciseCard className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-3">
            <span className="text-2xl">📚</span>
            <span style={{ color: colors.base.primary[600] }}>
              {exerciseType.charAt(0).toUpperCase() + exerciseType.slice(1)} Exercise
            </span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={!isCompleted}
            >
              Reset
            </Button>
            <IconButton
              icon="⚙️"
              aria-label="Settings"
              variant="ghost"
              size="sm"
            />
          </div>
        </div>
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200"
          >
            <div className="flex items-center space-x-2">
              <span className="text-green-600 font-medium">✅ Completed!</span>
              <span className="text-sm text-green-700">Score: {score}%</span>
            </div>
            <p className="text-sm text-green-600 mt-1">{feedback}</p>
          </motion.div>
        )}
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          {/* Enhanced Original Component with Design System Context */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <OriginalComponent
              data={exerciseData}
              onComplete={handleExerciseComplete}
              // Enhanced props that use design system
              uiComponents={{
                Button,
                Card,
                Input,
                tokens,
                colors: colors.base
              }}
            />
          </div>
        </div>
      </CardContent>

      <CardFooter>
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              Status: {isCompleted ? 'Completed' : 'In Progress'}
            </div>
            {score !== null && (
              <div className="text-sm font-medium" style={{ color: colors.base.success[600] }}>
                Score: {score}%
              </div>
            )}
          </div>
          
          <ButtonGroup attached>
            <Button
              variant="outline"
              size="sm"
              leftIcon="📊"
            >
              Analytics
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon="🏆"
            >
              Achievements
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon="🤖"
            >
              AI Hints
            </Button>
          </ButtonGroup>
        </div>
      </CardFooter>
    </ExerciseCard>
  );
};

// Sample exercise data that works with multiple exercise types
const SAMPLE_EXERCISE_DATA = {
  'multiple-answers': {
    soundMatchingExercises: [
      {
        id: 1,
        question: "Which words rhyme with 'cat'?",
        options: [
          { word: "bat", image: "/images/bat.png", isCorrect: true },
          { word: "hat", image: "/images/hat.png", isCorrect: true },
          { word: "dog", image: "/images/dog.png", isCorrect: false },
          { word: "rat", image: "/images/rat.png", isCorrect: true }
        ]
      }
    ]
  },
  'drag-and-drop': {
    sensoryExercise: {
      question: "Categorize these sensory details by the sense they appeal to",
      categories: {
        sight: [
          {"id": "s1", "content": "bright yellow sun"},
          {"id": "s2", "content": "dark storm clouds"}
        ],
        sound: [
          {"id": "so1", "content": "birds chirping"},
          {"id": "so2", "content": "thunder rumbling"}
        ],
        smell: [
          {"id": "sm1", "content": "fresh coffee"},
          {"id": "sm2", "content": "sweet roses"}
        ]
      }
    }
  },
  'fill-in-blanks': {
    exercises: [
      {
        id: 1,
        type: "word_completion",
        sentence: "The cat is _____ on the mat.",
        options: ["sitting", "running", "flying"],
        correctAnswer: "sitting"
      }
    ]
  }
};

// Exercise Type Configurations with Design System Integration
const EXERCISE_TYPES = [
  {
    id: 'multiple-answers',
    name: 'Multiple Answers',
    description: 'Select all correct answers with enhanced UI',
    component: MultipleAnswers,
    icon: '✅',
    color: colors.base.blue[500]
  },
  {
    id: 'drag-and-drop',
    name: 'Drag & Drop',
    description: 'Categorize items with smooth animations',
    component: DragAndDrop,
    icon: '🎯',
    color: colors.base.green[500]
  },
  {
    id: 'fill-in-blanks',
    name: 'Fill in the Blanks',
    description: 'Complete sentences with design system inputs',
    component: FillInTheBlanks,
    icon: '📝',
    color: colors.base.purple[500]
  }
];

const Day5UITest = () => {
  const [currentExerciseType, setCurrentExerciseType] = useState('multiple-answers');
  const [results, setResults] = useState([]);
  const [theme, setTheme] = useState('light');

  const currentExerciseConfig = EXERCISE_TYPES.find(type => type.id === currentExerciseType);
  const currentExerciseData = SAMPLE_EXERCISE_DATA[currentExerciseType];

  const handleExerciseComplete = (result) => {
    console.log('Day 5 UI Test completed:', result);
    setResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      exerciseType: currentExerciseType,
      result
    }]);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header with Design System Components */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-3xl font-bold" style={{ color: colors.base.primary[700] }}>
                    🎨 Day 5: UI Component Integration
                  </CardTitle>
                  <p className="text-gray-600 mt-2">
                    Testing sophisticated design system integration with exercise components
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    leftIcon={theme === 'light' ? '🌙' : '☀️'}
                  >
                    {theme === 'light' ? 'Dark' : 'Light'} Mode
                  </Button>
                  <div className="text-sm text-gray-500">
                    Current Theme: {theme}
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Exercise Type Selector with Enhanced UI */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🎯 Select Exercise Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {EXERCISE_TYPES.map((type) => (
                  <motion.div
                    key={type.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 ${
                        currentExerciseType === type.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setCurrentExerciseType(type.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">{type.icon}</span>
                          <div>
                            <h3 className="font-medium" style={{ color: type.color }}>
                              {type.name}
                            </h3>
                            <p className="text-sm text-gray-600">{type.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Exercise Display */}
          {currentExerciseConfig && currentExerciseData && (
            <div className="mb-8">
              <DesignSystemEnhancedWrapper
                exerciseType={currentExerciseConfig.name}
                OriginalComponent={currentExerciseConfig.component}
                exerciseData={currentExerciseData}
                onComplete={handleExerciseComplete}
              />
            </div>
          )}

          {/* Design System Showcase */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>🎨 Design System Components Showcase</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                
                {/* Button Variants */}
                <div>
                  <h4 className="font-medium mb-3">Button Variants</h4>
                  <div className="flex flex-wrap gap-3">
                    <Button variant="primary">Primary</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="success">Success</Button>
                    <Button variant="warning">Warning</Button>
                    <Button variant="error">Error</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                </div>

                {/* Button Sizes */}
                <div>
                  <h4 className="font-medium mb-3">Button Sizes</h4>
                  <div className="flex items-center gap-3">
                    <Button size="sm">Small</Button>
                    <Button size="md">Medium</Button>
                    <Button size="lg">Large</Button>
                    <Button size="xl">Extra Large</Button>
                  </div>
                </div>

                {/* Button Groups */}
                <div>
                  <h4 className="font-medium mb-3">Button Groups</h4>
                  <ButtonGroup attached>
                    <Button>First</Button>
                    <Button>Second</Button>
                    <Button>Third</Button>
                  </ButtonGroup>
                </div>

                {/* Input Components */}
                <div>
                  <h4 className="font-medium mb-3">Input Components</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <Input placeholder="Standard input" />
                    <Input placeholder="Search..." leftIcon="🔍" />
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          {/* Results Display with Enhanced UI */}
          {results.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>📊 Exercise Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {results.slice(-5).map((result, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <span className="font-medium">{result.exerciseType}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Status */}
          <Card className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold" style={{ color: colors.base.primary[700] }}>
                  🎉 Day 5: UI Component Integration Complete!
                </h3>
                <p className="text-gray-600">
                  Successfully integrated sophisticated design system with exercise components
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <span className="text-green-600">✅ Button Components</span>
                  <span className="text-green-600">✅ Card Components</span>
                  <span className="text-green-600">✅ Input Components</span>
                  <span className="text-green-600">✅ Theme System</span>
                  <span className="text-green-600">✅ Design Tokens</span>
                </div>
                
                <div className="mt-6">
                  <Button 
                    variant="primary" 
                    size="lg"
                    leftIcon="🚀"
                  >
                    Continue to Week 2: Advanced System Integration
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </ThemeProvider>
  );
};

export default Day5UITest;
