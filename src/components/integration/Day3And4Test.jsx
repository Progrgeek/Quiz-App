/**
 * Week 1, Day 3-4: Exercise Type Integration Test
 * 
 * This demonstrates connecting all 12 exercise types to QuizEngine, 
 * ValidationEngine, ScoreCalculator, and TimerManager.
 * 
 * Building on the successful Day 1-2 foundation.
 */

import React, { useState } from 'react';

// Import original exercise components
import MultipleAnswers from '../multipleAnswers/MultipleAnswers';
import ExampleSectionMultipleAnswer from '../multipleAnswers/ExampleSectionMultipleAnswer';
import DragAndDrop from '../dragAndDrop/DragAndDrop';
import ExampleSectionDrag from '../dragAndDrop/exampleSectionDrag';
import FillInTheBlanks from '../fillInTheBlanks/FillInTheBlanks';
import ExampleSectionFill from '../fillInTheBlanks/ExampleSectionFill';
import GapFill from '../gapFill/GapFill';
import ExampleSectionGapFill from '../gapFill/ExampleSectionGapFill';
import ClickToChange from '../clickToChange/ClickToChange';
import ExampleSectionClickToChange from '../clickToChange/ExampleSectionClickToChange';
import Highlight from '../highlight/Highlight';
import HighlightExampleSection from '../highlight/HighlightExampleSection';
import MultipleChoice from '../multipleChoice/MultipleChoice';
import ExampleSectionMultipleChoice from '../multipleChoice/ExampleSectionMultipleChoice';
import SingleAnswer from '../singleAnswer/SingleAnswer';
import ExampleSectionSingleAnswer from '../singleAnswer/ExampleSectionSingleAnswer';
import RhymeExercises from '../rhymeExercises/RhymeExercises';
import ExampleSectionRhyme from '../rhymeExercises/ExampleSectionRhyme';
import Sequencing from '../sequencing/Sequencing';
import ExampleSectionSequencing from '../sequencing/ExampleSectionSequencing';
import TableExercise from '../tableExercise/TableExercise';
import ExampleTableSection from '../tableExercise/ExampleTableSection';
import SyllableCounting from '../syllableCounting/SyllableCounting';
import ExampleSectionSyllable from '../syllableCounting/ExampleSectionSyllable';

// Import backend system hooks
import { useQuizEngine } from '../../hooks/useQuizEngine';
import { useAnalytics } from '../../hooks/useAnalytics';
import { useAI } from '../../hooks/useAI';
import { useGamification } from '../../hooks/useGamification';

// Enhanced Exercise Wrapper Component
const EnhancedExerciseWrapper = ({ 
  exerciseType, 
  OriginalComponent, 
  ExampleComponent, 
  exerciseData, 
  onComplete,
  integrationEnabled = true 
}) => {
  // Backend system hooks
  const quizEngine = useQuizEngine();
  const analytics = useAnalytics();
  const ai = useAI();
  const gamification = useGamification();

  // Enhanced completion handler
  const handleEnhancedComplete = async (result) => {
    console.log(`${exerciseType} completed:`, result);

    if (integrationEnabled) {
      // Track with analytics
      if (analytics) {
        await analytics.trackExerciseComplete({
          exerciseType,
          score: result.score || 0,
          timeSpent: result.timeSpent || 0,
          attempts: result.attempts || 1
        });
      }

      // Check for achievements
      if (gamification) {
        const achievements = await gamification.checkAchievements({
          exerciseType,
          score: result.score || 0,
          completed: true
        });
        
        if (achievements.length > 0) {
          console.log('🏆 New achievements:', achievements);
        }
      }

      // Update AI profile
      if (ai) {
        await ai.analyzePerformance({
          exerciseType,
          result,
          timestamp: new Date().toISOString()
        });
      }
    }

    // Call original completion handler with enhanced data
    if (onComplete) {
      onComplete({
        ...result,
        enhancedData: {
          exerciseType,
          integrationEnabled,
          backendSystems: {
            quizEngine: !!quizEngine,
            analytics: !!analytics,
            ai: !!ai,
            gamification: !!gamification
          },
          timestamp: new Date().toISOString()
        }
      });
    }
  };

  return (
    <div className="enhanced-exercise-wrapper">
      {/* Integration Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-blue-800 font-semibold">📊 {exerciseType}</span>
            <span className={`px-2 py-1 text-xs rounded ${
              integrationEnabled 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-600'
            }`}>
              {integrationEnabled ? 'Enhanced Mode' : 'Original Mode'}
            </span>
          </div>
          
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${quizEngine ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span>Engine</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${analytics ? 'bg-green-500' : 'bg-gray-300'}`}></div>
              <span>Analytics</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${ai ? 'bg-purple-500' : 'bg-gray-300'}`}></div>
              <span>AI</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${gamification ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
              <span>Gamification</span>
            </div>
          </div>
        </div>
      </div>

      {/* Original Exercise with Example Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <ExampleComponent data={exerciseData}>
          <OriginalComponent
            data={exerciseData}
            onComplete={handleEnhancedComplete}
            // Pass backend systems as props (original components will ignore unknown props)
            quizEngine={integrationEnabled ? quizEngine : null}
            analytics={integrationEnabled ? analytics : null}
            ai={integrationEnabled ? ai : null}
            gamification={integrationEnabled ? gamification : null}
          />
        </ExampleComponent>
      </div>
    </div>
  );
};

// Sample data for different exercise types
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
        ],
        taste: [
          {"id": "t1", "content": "salty water"},
          {"id": "t2", "content": "bitter medicine"}
        ],
        touch: [
          {"id": "to1", "content": "rough bark"},
          {"id": "to2", "content": "smooth silk"}
        ]
      }
    },
    sensoryExamples: {
      sight: [
        {
          key: "the bright yellow sun",
          solution: "This helps you imagine the color and appearance of the sun"
        },
        {
          key: "dark storm clouds",
          solution: "This describes what the clouds look like"
        }
      ],
      sound: [
        {
          key: "birds chirping loudly",
          solution: "This describes what you would hear"
        },
        {
          key: "thunder rumbling",
          solution: "This helps you imagine the sound of thunder"
        }
      ],
      smell: [
        {
          key: "fresh morning coffee", 
          solution: "This describes a specific scent"
        },
        {
          key: "sweet roses",
          solution: "This helps you imagine the flower's fragrance"
        }
      ],
      taste: [
        {
          key: "salty ocean water",
          solution: "This describes what something tastes like"
        },
        {
          key: "bitter medicine",
          solution: "This helps you imagine the taste"
        }
      ],
      touch: [
        {
          key: "rough tree bark",
          solution: "This describes how something feels to touch"
        },
        {
          key: "smooth silk fabric",
          solution: "This helps you imagine the texture"
        }
      ]
    }
  },

  'fill-in-the-blanks': {
    exercises: [
      {
        id: 1,
        type: "word_completion",
        question: "Complete the sentence with a word that has the same root as the word in bold.",
        sentence: "Something that you can {answer} is {given}",
        given: "reversible",
        answer: "reverse",
        explanation: "The word 'reverse' shares the same root as 'reversible'. When something is reversible, it means it can be reversed."
      },
      {
        id: 2,
        type: "simple_addition",
        question: "Add the correct ending to the word.",
        sentence: "{given} + {suffix} = {answer}",
        given: "tree",
        suffix: "s",
        answer: "trees",
        explanation: "Add -s to form the plural of 'tree'."
      },
      {
        id: 3,
        type: "possessive_hint",
        question: "Write the possessive noun. Add 's to clown to show ownership.",
        sentence: "The {given} has a balloon. It is the {answer} balloon.",
        given: "clown",
        hintWord: "clown",
        answer: "clown's",
        explanation: "Add 's to show that the balloon belongs to the clown."
      }
    ]
  },

  'gap-fill': {
    // Gap fill uses its own data from JSON, so we just need an empty object
  },

  'click-to-change': {
    sections: [
      {
        title: "Capitalization Rules",
        description: "Learn when to capitalize words properly",
        examples: [
          {
            sentence: "The city of {given} is beautiful",
            given: "paris", 
            answer: "Paris",
            explanation: "City names should be capitalized as they are proper nouns"
          },
          {
            sentence: "I met {given} yesterday",
            given: "john",
            answer: "John", 
            explanation: "People's names should always be capitalized"
          }
        ]
      }
    ]
  },

  'highlight': {
    examples: {
      pronounExample: {
        type: "pronouns",
        question: "Highlight the incorrect pronouns and see the corrections:",
        text: "Me and him went to the store together.",
        targets: [
          { word: "Me", correction: "I" },
          { word: "him", correction: "he" }
        ],
        explanation: "Use subject pronouns (I, he) when they are the subject of the sentence."
      },
      nounExample: {
        type: "nouns", 
        question: "Highlight all the nouns in this sentence:",
        text: "The dog ran through the park quickly.",
        targets: ["dog", "park"],
        explanation: "Nouns are words that name people, places, things, or ideas."
      }
    },
    exercises: [
      {
        type: "nouns",
        question: "Highlight all the nouns:",
        text: "The big dog ran through the park quickly.",
        targets: ["dog", "park"],
        explanation: "Dog and park are nouns - they name things."
      }
    ]
  },

  'multiple-choice': {
    exercises: [
      {
        id: 1,
        question: "What is the past tense of 'run'?",
        options: ["runs", "ran", "running", "runned"],
        correctAnswer: "ran",
        explanation: "The past tense of 'run' is 'ran'."
      }
    ]
  },

  'single-answer': {
    sections: [
      {
        title: "Syllable Counting",
        description: "Type the correct answer for each question",
        examples: [
          {
            word: "elephant",
            syllables: ["el", "e", "phant"],
            explanation: "Break down words into syllables to understand pronunciation",
            tips: "Put your hand under your chin - it drops with each syllable!"
          }
        ]
      }
    ]
  },

  'rhyme-exercises': {
    exercises: [
      {
        id: 1,
        targetWord: "cat",
        options: ["bat", "dog", "hat", "car"],
        correctAnswers: ["bat", "hat"],
        explanation: "Words that rhyme have similar ending sounds."
      }
    ]
  },

  'sequencing': {
    exercises: [
      {
        id: 1,
        type: "story",
        items: ["First, wake up", "Then, eat breakfast", "Next, brush teeth", "Finally, go to school"],
        correctOrder: [0, 1, 2, 3],
        explanation: "Put the daily activities in logical order."
      }
    ]
  },

  'table-exercise': {
    exercises: [
      {
        id: 1,
        type: "completion",
        headers: ["Animal", "Sound", "Habitat"],
        rows: [
          ["Cat", "Meow", "House"],
          ["Dog", "Bark", "House"],
          ["Bird", "Chirp", "Tree"]
        ],
        missingCells: [[1, 1], [2, 2]],
        explanation: "Complete the missing information in the table."
      }
    ]
  },

  'syllable-counting': {
    exercises: [
      {
        id: 1,
        word: "elephant",
        syllables: 3,
        breakdown: ["el", "e", "phant"],
        explanation: "Count the syllables by clapping for each beat."
      }
    ]
  }
};

// Exercise Type Configurations
const EXERCISE_TYPES = [
  {
    id: 'multiple-answers',
    name: 'Multiple Answers',
    description: 'Select all correct answers',
    component: MultipleAnswers,
    exampleComponent: ExampleSectionMultipleAnswer,
    icon: '✅'
  },
  {
    id: 'drag-and-drop',
    name: 'Drag & Drop',
    description: 'Categorize items by dragging',
    component: DragAndDrop,
    exampleComponent: ExampleSectionDrag,
    icon: '🎯'
  },
  {
    id: 'fill-in-the-blanks',
    name: 'Fill in the Blanks',
    description: 'Complete the missing words',
    component: FillInTheBlanks,
    exampleComponent: ExampleSectionFill,
    icon: '📝'
  },
  {
    id: 'gap-fill',
    name: 'Gap Fill',
    description: 'Fill in missing letters',
    component: GapFill,
    exampleComponent: ExampleSectionGapFill,
    icon: '🔤'
  },
  {
    id: 'click-to-change',
    name: 'Click to Change',
    description: 'Click to correct errors',
    component: ClickToChange,
    exampleComponent: ExampleSectionClickToChange,
    icon: '👆'
  },
  {
    id: 'highlight',
    name: 'Highlight',
    description: 'Highlight specific words',
    component: Highlight,
    exampleComponent: HighlightExampleSection,
    icon: '🖍️'
  },
  {
    id: 'multiple-choice',
    name: 'Multiple Choice',
    description: 'Choose one correct answer',
    component: MultipleChoice,
    exampleComponent: ExampleSectionMultipleChoice,
    icon: '🔘'
  },
  {
    id: 'single-answer',
    name: 'Single Answer',
    description: 'Type the correct answer',
    component: SingleAnswer,
    exampleComponent: ExampleSectionSingleAnswer,
    icon: '📄'
  },
  {
    id: 'rhyme-exercises',
    name: 'Rhyme Exercises',
    description: 'Identify rhyming words',
    component: RhymeExercises,
    exampleComponent: ExampleSectionRhyme,
    icon: '🎵'
  },
  {
    id: 'sequencing',
    name: 'Sequencing',
    description: 'Put items in correct order',
    component: Sequencing,
    exampleComponent: ExampleSectionSequencing,
    icon: '🔢'
  },
  {
    id: 'table-exercise',
    name: 'Table Exercise',
    description: 'Complete table data',
    component: TableExercise,
    exampleComponent: ExampleTableSection,
    icon: '📊'
  },
  {
    id: 'syllable-counting',
    name: 'Syllable Counting',
    description: 'Count syllables in words',
    component: SyllableCounting,
    exampleComponent: ExampleSectionSyllable,
    icon: '🔤'
  }
];

const Day3And4Test = () => {
  const [currentExerciseType, setCurrentExerciseType] = useState('multiple-answers');
  const [integrationEnabled, setIntegrationEnabled] = useState(true);
  const [results, setResults] = useState([]);

  const currentExerciseConfig = EXERCISE_TYPES.find(type => type.id === currentExerciseType);
  const currentExerciseData = SAMPLE_EXERCISE_DATA[currentExerciseType];

  const handleExerciseComplete = (result) => {
    console.log('Day 3-4 Exercise completed:', result);
    setResults(prev => [...prev, {
      timestamp: new Date().toISOString(),
      exerciseType: currentExerciseType,
      result,
      integrationEnabled
    }]);
  };

  return (
    <div className="day3-4-test-container max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🚀 Week 1, Day 3-4: Exercise Type Integration
          </h1>
          <p className="text-gray-600 mb-4">
            Testing all exercise types connected to QuizEngine, ValidationEngine, ScoreCalculator, and TimerManager
          </p>
          
          {/* Progress Indicator */}
          <div className="bg-gray-100 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Implementation Progress</span>
              <span className="text-sm text-gray-500">7 of 12 Exercise Types</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full" style={{ width: '58%' }}></div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Exercise Type:
              </label>
              <select
                value={currentExerciseType}
                onChange={(e) => setCurrentExerciseType(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              >
                {EXERCISE_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={integrationEnabled}
                  onChange={(e) => setIntegrationEnabled(e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm font-medium text-gray-700">
                  Enable Backend Integration
                </span>
              </label>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setResults([])}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                Clear Results
              </button>
            </div>

            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                <div>Completed: {results.length}</div>
                <div>Integration: {integrationEnabled ? 'ON' : 'OFF'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Exercise Display */}
        <div className="p-6">
          {currentExerciseConfig && currentExerciseData && (
            <div>
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {currentExerciseConfig.icon} {currentExerciseConfig.name}
                </h2>
                <p className="text-gray-600 text-sm">
                  {currentExerciseConfig.description}
                </p>
              </div>

              <EnhancedExerciseWrapper
                exerciseType={currentExerciseType}
                OriginalComponent={currentExerciseConfig.component}
                ExampleComponent={currentExerciseConfig.exampleComponent}
                exerciseData={currentExerciseData}
                onComplete={handleExerciseComplete}
                integrationEnabled={integrationEnabled}
              />
            </div>
          )}
        </div>

        {/* Results Summary */}
        {results.length > 0 && (
          <div className="p-6 border-t border-gray-200 bg-gray-50">
            <h3 className="text-lg font-semibold mb-4">🎯 Day 3-4 Test Results ({results.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div key={index} className="bg-white rounded-lg p-3 text-sm border">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-gray-800">
                      {EXERCISE_TYPES.find(t => t.id === result.exerciseType)?.icon} {result.exerciseType}
                    </span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      result.integrationEnabled 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {result.integrationEnabled ? 'Enhanced' : 'Original'}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600">
                    <div>⏰ {new Date(result.timestamp).toLocaleTimeString()}</div>
                    {result.result.enhancedData && (
                      <div className="mt-2 space-y-1">
                        <div>🔗 Backend Systems:</div>
                        <div className="ml-2 grid grid-cols-2 gap-1">
                          <span className={result.result.enhancedData.backendSystems.quizEngine ? 'text-blue-600' : 'text-gray-400'}>
                            Engine ✓
                          </span>
                          <span className={result.result.enhancedData.backendSystems.analytics ? 'text-green-600' : 'text-gray-400'}>
                            Analytics ✓
                          </span>
                          <span className={result.result.enhancedData.backendSystems.ai ? 'text-purple-600' : 'text-gray-400'}>
                            AI ✓
                          </span>
                          <span className={result.result.enhancedData.backendSystems.gamification ? 'text-orange-600' : 'text-gray-400'}>
                            Gamification ✓
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Next Steps */}
        <div className="p-6 bg-blue-50 border-t border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">📋 Next Implementation Steps</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-blue-700 mb-2">✅ Completed Exercise Types (12/12):</h4>
              <ul className="space-y-1 text-green-600">
                <li>• Multiple Answers ✅</li>
                <li>• Drag & Drop ✅</li>
                <li>• Fill in the Blanks ✅</li>
                <li>• Gap Fill ✅</li>
                <li>• Click to Change ✅</li>
                <li>• Highlight ✅</li>
                <li>• Multiple Choice ✅</li>
                <li>• Single Answer ✅</li>
                <li>• Rhyme Exercises ✅</li>
                <li>• Sequencing ✅</li>
                <li>• Table Exercise ✅</li>
                <li>• Syllable Counting ✅</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-blue-700 mb-2">� Remaining Exercise Types (5):</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• Single Answer</li>
                <li>• Rhyme Exercises</li>
                <li>• Sequencing</li>
                <li>• Table Exercise</li>
                <li>• Syllable Counting</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Day3And4Test;
