import React, { useState } from 'react';

// Import original "WithAnExample" components
import OriginalMultipleAnswers from './multipleAnswers/MultipleAnswersWithAnExample';
import OriginalSingleAnswer from './singleAnswer/SingleAnswerWithAnExample';
import OriginalDragAndDrop from './dragAndDrop/DragAndDropWithAnExample';
import OriginalFillInTheBlanks from './fillInTheBlanks/FillInTheBlanksWithAnExample';
import OriginalGapFill from './gapFill/GapFillWithAnExample';
import OriginalHighlight from './highlight/HighlightWithAnExample';
import OriginalClickToChange from './clickToChange/ClickToChangeWithAnExample';
import OriginalSequencing from './sequencing/SequincingWithAnExample';
import OriginalTableExercise from './tableExercise/TableExercisesWithAnExample';
import OriginalMultipleChoice from './multipleChoice/MultipleChoiceWithAnExample';
import OriginalSyllableCounting from './syllableCounting/SyllableCountingWithAnExample';
import OriginalRhymeExercises from './rhymeExercises/RhymeExercisesWithAnExample';

// Import universal components
import UniversalMultipleAnswers from './multipleAnswers/UniversalMultipleAnswers';
import UniversalSingleAnswer from './singleAnswer/UniversalSingleAnswer';
import UniversalDragAndDrop from './dragAndDrop/UniversalDragAndDrop';
import UniversalFillInTheBlanks from './fillInTheBlanks/UniversalFillInTheBlanks';
import UniversalGapFill from './gapFill/UniversalGapFill';
import UniversalHighlight from './highlight/UniversalHighlight';
import UniversalClickToChange from './clickToChange/UniversalClickToChange';
import UniversalSequencing from './sequencing/UniversalSequencing';
import UniversalTableExercise from './tableExercise/UniversalTableExercise';
import UniversalMultipleChoice from './multipleChoice/UniversalMultipleChoice';
import UniversalSyllableCounting from './syllableCounting/UniversalSyllableCounting';
import UniversalRhymeExercises from './rhymeExercises/UniversalRhymeExercises';

/**
 * Test Integration Component
 * 
 * This component allows side-by-side testing of:
 * 1. Original components
 * 2. Universal components (drop-in replacements)
 */
const TestUniversalIntegration = () => {
  const [currentTest, setCurrentTest] = useState('multipleAnswers-original');
  const [testResults, setTestResults] = useState({
    // Multiple Answers
    'multipleAnswers-original': { status: 'pending', notes: '' },
    'multipleAnswers-universal': { status: 'pending', notes: '' },
    // Single Answer
    'singleAnswer-original': { status: 'pending', notes: '' },
    'singleAnswer-universal': { status: 'pending', notes: '' },
    // Drag and Drop
    'dragAndDrop-original': { status: 'pending', notes: '' },
    'dragAndDrop-universal': { status: 'pending', notes: '' },
    // Fill in the Blanks
    'fillInTheBlanks-original': { status: 'pending', notes: '' },
    'fillInTheBlanks-universal': { status: 'pending', notes: '' },
    // Gap Fill
    'gapFill-original': { status: 'pending', notes: '' },
    'gapFill-universal': { status: 'pending', notes: '' },
    // Highlight
    'highlight-original': { status: 'pending', notes: '' },
    'highlight-universal': { status: 'pending', notes: '' },
    // Click to Change
    'clickToChange-original': { status: 'pending', notes: '' },
    'clickToChange-universal': { status: 'pending', notes: '' },
    // Sequencing
    'sequencing-original': { status: 'pending', notes: '' },
    'sequencing-universal': { status: 'pending', notes: '' },
    // Table Exercise
    'tableExercise-original': { status: 'pending', notes: '' },
    'tableExercise-universal': { status: 'pending', notes: '' },
    // Multiple Choice
    'multipleChoice-original': { status: 'pending', notes: '' },
    'multipleChoice-universal': { status: 'pending', notes: '' },
    // Syllable Counting
    'syllableCounting-original': { status: 'pending', notes: '' },
    'syllableCounting-universal': { status: 'pending', notes: '' },
    // Rhyme Exercises
    'rhymeExercises-original': { status: 'pending', notes: '' },
    'rhymeExercises-universal': { status: 'pending', notes: '' }
  });

  const tests = [
    // Multiple Answers
    { 
      id: 'multipleAnswers-original', 
      name: 'Multiple Answers - Original', 
      component: OriginalMultipleAnswers,
      description: 'Original MultipleAnswersWithAnExample component',
      category: 'Multiple Selection'
    },
    { 
      id: 'multipleAnswers-universal', 
      name: 'Multiple Answers - Universal', 
      component: UniversalMultipleAnswers,
      description: 'Universal MultipleAnswers with example section',
      category: 'Multiple Selection'
    },
    // Single Answer
    {
      id: 'singleAnswer-original',
      name: 'Single Answer - Original',
      component: OriginalSingleAnswer,
      description: 'Original SingleAnswerWithAnExample component',
      category: 'Single Selection'
    },
    {
      id: 'singleAnswer-universal',
      name: 'Single Answer - Universal',
      component: UniversalSingleAnswer,
      description: 'Universal SingleAnswer with example section',
      category: 'Single Selection'
    },
    // Drag and Drop
    {
      id: 'dragAndDrop-original',
      name: 'Drag & Drop - Original',
      component: OriginalDragAndDrop,
      description: 'Original DragAndDropWithAnExample component',
      category: 'Interactive'
    },
    {
      id: 'dragAndDrop-universal',
      name: 'Drag & Drop - Universal',
      component: UniversalDragAndDrop,
      description: 'Universal DragAndDrop with example section',
      category: 'Interactive'
    },
    // Fill in the Blanks
    {
      id: 'fillInTheBlanks-original',
      name: 'Fill Blanks - Original',
      component: OriginalFillInTheBlanks,
      description: 'Original FillInTheBlanksWithAnExample component',
      category: 'Text Input'
    },
    {
      id: 'fillInTheBlanks-universal',
      name: 'Fill Blanks - Universal',
      component: UniversalFillInTheBlanks,
      description: 'Universal FillInTheBlanks with example section',
      category: 'Text Input'
    },
    // Gap Fill
    {
      id: 'gapFill-original',
      name: 'Gap Fill - Original',
      component: OriginalGapFill,
      description: 'Original GapFillWithAnExample component',
      category: 'Text Input'
    },
    {
      id: 'gapFill-universal',
      name: 'Gap Fill - Universal',
      component: UniversalGapFill,
      description: 'Universal GapFill with example section',
      category: 'Text Input'
    },
    // Highlight
    {
      id: 'highlight-original',
      name: 'Highlight - Original',
      component: OriginalHighlight,
      description: 'Original HighlightWithAnExample component',
      category: 'Interactive'
    },
    {
      id: 'highlight-universal',
      name: 'Highlight - Universal',
      component: UniversalHighlight,
      description: 'Universal Highlight with example section',
      category: 'Interactive'
    },
    // Click to Change
    {
      id: 'clickToChange-original',
      name: 'Click to Change - Original',
      component: OriginalClickToChange,
      description: 'Original ClickToChangeWithAnExample component',
      category: 'Interactive'
    },
    {
      id: 'clickToChange-universal',
      name: 'Click to Change - Universal',
      component: UniversalClickToChange,
      description: 'Universal ClickToChange with example section',
      category: 'Interactive'
    },
    // Sequencing
    {
      id: 'sequencing-original',
      name: 'Sequencing - Original',
      component: OriginalSequencing,
      description: 'Original SequencingWithAnExample component',
      category: 'Interactive'
    },
    {
      id: 'sequencing-universal',
      name: 'Sequencing - Universal',
      component: UniversalSequencing,
      description: 'Universal Sequencing with example section',
      category: 'Interactive'
    },
    // Table Exercise
    {
      id: 'tableExercise-original',
      name: 'Table Exercise - Original',
      component: OriginalTableExercise,
      description: 'Original TableExercisesWithAnExample component',
      category: 'Classification'
    },
    {
      id: 'tableExercise-universal',
      name: 'Table Exercise - Universal',
      component: UniversalTableExercise,
      description: 'Universal TableExercise with example section',
      category: 'Classification'
    },
    // Multiple Choice
    {
      id: 'multipleChoice-original',
      name: 'Multiple Choice - Original',
      component: OriginalMultipleChoice,
      description: 'Original MultipleChoiceWithAnExample component',
      category: 'Single Selection'
    },
    {
      id: 'multipleChoice-universal',
      name: 'Multiple Choice - Universal',
      component: UniversalMultipleChoice,
      description: 'Universal MultipleChoice with example section',
      category: 'Single Selection'
    },
    // Syllable Counting
    {
      id: 'syllableCounting-original',
      name: 'Syllable Count - Original',
      component: OriginalSyllableCounting,
      description: 'Original SyllableCountingWithAnExample component',
      category: 'Phonetics'
    },
    {
      id: 'syllableCounting-universal',
      name: 'Syllable Count - Universal',
      component: UniversalSyllableCounting,
      description: 'Universal SyllableCounting with example section',
      category: 'Phonetics'
    },
    // Rhyme Exercises
    {
      id: 'rhymeExercises-original',
      name: 'Rhyme Exercise - Original',
      component: OriginalRhymeExercises,
      description: 'Original RhymeExercisesWithAnExample component',
      category: 'Phonetics'
    },
    {
      id: 'rhymeExercises-universal',
      name: 'Rhyme Exercise - Universal',
      component: UniversalRhymeExercises,
      description: 'Universal RhymeExercises with example section',
      category: 'Phonetics'
    }
  ];

  const updateTestResult = (testId, status, notes) => {
    setTestResults(prev => ({
      ...prev,
      [testId]: { status, notes }
    }));
  };

  const getCurrentTest = () => tests.find(test => test.id === currentTest);
  const CurrentComponent = getCurrentTest()?.component;

  // Group tests by category
  const testsByCategory = tests.reduce((acc, test) => {
    if (!acc[test.category]) acc[test.category] = [];
    acc[test.category].push(test);
    return acc;
  }, {});

  // Calculate test statistics
  const totalTests = tests.length;
  const passedTests = Object.values(testResults).filter(result => result.status === 'success').length;
  const failedTests = Object.values(testResults).filter(result => result.status === 'error').length;
  const pendingTests = totalTests - passedTests - failedTests;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100">
      {/* Test Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Universal System Integration Test</h1>
          <p className="text-gray-600 mb-4">Compare original vs universal components side by side</p>
          
          {/* Test Statistics */}
          <div className="flex gap-4 mb-4 text-sm">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              Passed: {passedTests}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Failed: {failedTests}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              Pending: {pendingTests}
            </span>
            <span className="font-medium">Total: {totalTests} tests</span>
          </div>
          
          {/* Test Selection by Category */}
          <div className="space-y-4">
            {Object.entries(testsByCategory).map(([category, categoryTests]) => (
              <div key={category}>
                <h3 className="text-sm font-semibold text-gray-700 mb-2">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {categoryTests.map((test) => (
                    <button
                      key={test.id}
                      onClick={() => setCurrentTest(test.id)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors relative ${
                        currentTest === test.id
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {test.name}
                      {/* Status indicator */}
                      <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${
                        testResults[test.id].status === 'success' ? 'bg-green-500' :
                        testResults[test.id].status === 'error' ? 'bg-red-500' :
                        'bg-yellow-500'
                      }`}></span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Test Description */}
          <div className="bg-gray-50 rounded-lg p-3">
            <h3 className="font-medium text-gray-800">{getCurrentTest()?.name}</h3>
            <p className="text-sm text-gray-600">{getCurrentTest()?.description}</p>
          </div>
        </div>
      </div>

      {/* Current Test */}
      <div className="p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Testing: {getCurrentTest()?.name}
              </h2>
              
              {/* Test Result Controls */}
              <div className="flex gap-2">
                <button
                  onClick={() => updateTestResult(currentTest, 'success', 'Works perfectly!')}
                  className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
                >
                  ✅ Pass
                </button>
                <button
                  onClick={() => updateTestResult(currentTest, 'error', 'Found issues')}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
                >
                  ❌ Fail
                </button>
              </div>
            </div>

            {/* Component Render */}
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 className="text-lg font-medium mb-3 text-center text-gray-700">
                Component Output
              </h3>
              <div className="bg-white rounded border">
                {CurrentComponent && <CurrentComponent />}
              </div>
            </div>

            {/* Test Notes */}
            {testResults[currentTest].notes && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Test Result:</strong> {testResults[currentTest].notes}
                </p>
              </div>
            )}
          </div>

          {/* Overall Test Summary */}
          <div className="mt-6 bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold mb-4">Test Summary</h3>
            <div className="space-y-6">
              {Object.entries(testsByCategory).map(([category, categoryTests]) => (
                <div key={category}>
                  <h4 className="font-medium text-gray-800 mb-3">{category}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {categoryTests.map(test => (
                      <div key={test.id} className="border rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`w-3 h-3 rounded-full ${
                            testResults[test.id].status === 'success' ? 'bg-green-500' :
                            testResults[test.id].status === 'error' ? 'bg-red-500' :
                            'bg-yellow-500'
                          }`}></span>
                          <h5 className="font-medium text-sm">{test.name}</h5>
                        </div>
                        <p className="text-xs text-gray-600">{test.description}</p>
                        {testResults[test.id].notes && (
                          <p className="text-xs text-gray-500 mt-1">{testResults[test.id].notes}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-medium text-yellow-800 mb-2">Testing Instructions</h3>
            <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
              <li>Test each component by clicking the tabs above (organized by category)</li>
              <li>Verify that Universal components look identical to Originals</li>
              <li>Test functionality: select answers, check feedback, try audio controls</li>
              <li>For each exercise type, verify the "Learn with an Example" section displays correctly</li>
              <li>Test interactive features: drag & drop, click to change, highlighting</li>
              <li>Verify responsive design on different screen sizes</li>
              <li>Check data flow between example and exercise sections</li>
              <li>Mark each test as Pass ✅ or Fail ❌ based on your observations</li>
            </ol>
            <div className="mt-3 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                <strong>Expected Result:</strong> All 24 tests (12 original + 12 universal) should behave identically. 
                Universal components should have working example sections and preserve all original functionality.
              </p>
            </div>
            <div className="mt-3 p-3 bg-green-50 rounded">
              <p className="text-sm text-green-800">
                <strong>Success Criteria:</strong> When all tests pass, the universal system is ready for production deployment. 
                Each question type will have both standalone components and integrated example sections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestUniversalIntegration;
