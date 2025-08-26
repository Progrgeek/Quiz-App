/**
 * Quiz Integration Examples
 * Shows how new UI components integrate with existing Quiz functionality
 */

import React, { useState } from 'react';
import { Button, Toast, ToastProvider, useToast, Spinner, Tooltip } from '../src/components/ui';

export default {
  title: 'Integration/Quiz Examples',
  parameters: {
    docs: {
      description: {
        component: 'Examples showing how the new component library integrates with existing Quiz App functionality while maintaining backward compatibility.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <Story />
      </ToastProvider>
    ),
  ],
};

// Quiz Button Examples
export const QuizButtons = {
  render: () => (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Quiz Button Styles</h2>
      
      <div className="space-y-6">
        {/* Exercise Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Exercise Navigation</h3>
          <div className="flex gap-3">
            <Button variant="secondary" size="md">
              ← Previous
            </Button>
            <Button variant="primary" size="md">
              Next →
            </Button>
            <Button variant="success" size="md">
              Submit Answer
            </Button>
          </div>
        </div>

        {/* Answer Options */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Multiple Choice Answers</h3>
          <div className="space-y-2">
            <Button 
              variant="ghost" 
              fullWidth 
              className="justify-start h-auto p-4 text-left border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                A
              </span>
              The quick brown fox jumps over the lazy dog
            </Button>
            
            <Button 
              variant="ghost" 
              fullWidth 
              className="justify-start h-auto p-4 text-left border border-blue-300 bg-blue-50"
            >
              <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3">
                B
              </span>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit
            </Button>
            
            <Button 
              variant="ghost" 
              fullWidth 
              className="justify-start h-auto p-4 text-left border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
                C
              </span>
              Sed do eiusmod tempor incididunt ut labore
            </Button>
          </div>
        </div>

        {/* Exercise Controls */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Exercise Controls</h3>
          <div className="flex gap-3 flex-wrap">
            <Tooltip content="Play audio pronunciation" position="top">
              <Button variant="ghost" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M8.586 8.586A2 2 0 018 10v4a2 2 0 01.586 1.414L12 19l3.414-3.586A2 2 0 0116 14v-4a2 2 0 01-.586-1.414L12 5 8.586 8.586z" />
                </svg>
              </Button>
            </Tooltip>
            
            <Tooltip content="Hint available" position="top">
              <Button variant="warning" size="sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </Button>
            </Tooltip>
            
            <Button variant="secondary" size="sm">
              Reset
            </Button>
            
            <Button variant="error" size="sm">
              Skip
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Quiz Feedback Integration
const QuizFeedbackDemo = () => {
  const { showToast } = useToast();
  const [isChecking, setIsChecking] = useState(false);

  const simulateAnswerCheck = (isCorrect) => {
    setIsChecking(true);
    
    setTimeout(() => {
      setIsChecking(false);
      
      if (isCorrect) {
        showToast({
          type: 'success',
          title: 'Correct!',
          message: 'Great job! You selected the right answer.',
          duration: 3000,
        });
      } else {
        showToast({
          type: 'error',
          title: 'Not quite right',
          message: 'Try again! Remember to check the spelling.',
          action: {
            label: 'Show Hint',
            onClick: () => {
              showToast({
                type: 'info',
                title: 'Hint',
                message: 'The answer starts with the letter "C".',
                duration: 5000,
              });
            },
          },
          duration: 6000,
        });
      }
    }, 1500);
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <h3 className="text-lg font-semibold text-gray-900">Interactive Quiz Demo</h3>
      
      <div className="bg-white p-6 rounded-lg border">
        <h4 className="text-md font-medium mb-4">
          Question: What is the capital of France?
        </h4>
        
        <div className="space-y-2 mb-6">
          <Button 
            variant="ghost" 
            fullWidth 
            className="justify-start h-auto p-3 text-left border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            onClick={() => simulateAnswerCheck(false)}
            disabled={isChecking}
          >
            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              A
            </span>
            London
          </Button>
          
          <Button 
            variant="ghost" 
            fullWidth 
            className="justify-start h-auto p-3 text-left border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            onClick={() => simulateAnswerCheck(false)}
            disabled={isChecking}
          >
            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              B
            </span>
            Berlin
          </Button>
          
          <Button 
            variant="ghost" 
            fullWidth 
            className="justify-start h-auto p-3 text-left border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            onClick={() => simulateAnswerCheck(true)}
            disabled={isChecking}
          >
            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              C
            </span>
            Paris
          </Button>
          
          <Button 
            variant="ghost" 
            fullWidth 
            className="justify-start h-auto p-3 text-left border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
            onClick={() => simulateAnswerCheck(false)}
            disabled={isChecking}
          >
            <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              D
            </span>
            Madrid
          </Button>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {isChecking && (
              <>
                <Spinner variant="dots" size="sm" color="primary" />
                <span className="text-sm text-gray-600">Checking answer...</span>
              </>
            )}
          </div>
          
          <div className="flex gap-2">
            <Tooltip content="Get a hint for this question" position="top">
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => {
                  showToast({
                    type: 'info',
                    title: 'Hint',
                    message: 'Think about the city of lights and the Eiffel Tower.',
                    duration: 4000,
                  });
                }}
                disabled={isChecking}
              >
                Hint
              </Button>
            </Tooltip>
            
            <Button 
              variant="primary" 
              size="sm"
              disabled={isChecking}
            >
              Next Question
            </Button>
          </div>
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>• Click any answer to see feedback</p>
        <p>• Correct answer shows success toast</p>
        <p>• Incorrect answers offer hints</p>
        <p>• Loading states provide visual feedback</p>
      </div>
    </div>
  );
};

export const QuizFeedback = {
  render: () => <QuizFeedbackDemo />,
};

// Loading States in Quiz Context
export const QuizLoadingStates = {
  render: () => (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Quiz Loading States</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Exercise Loading */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Loading Exercise</h3>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <Spinner variant="ring" size="lg" color="primary" />
              <p className="mt-4 text-gray-600">Loading next exercise...</p>
            </div>
          </div>
        </div>

        {/* Submitting Answer */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Submitting Answer</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border border-blue-200 rounded">
              <p className="text-blue-800">Selected: Paris</p>
            </div>
            <Button 
              variant="primary" 
              fullWidth 
              loading={true}
              disabled={true}
            >
              Submitting...
            </Button>
          </div>
        </div>

        {/* Progress Saving */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Auto-save Progress</h3>
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded">
            <Spinner variant="pulse" size="sm" color="success" />
            <span className="text-green-800 text-sm">Saving progress...</span>
          </div>
        </div>

        {/* Content Loading */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Loading Content</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Spinner variant="bars" size="sm" color="primary" />
              <span className="text-sm text-gray-600">Loading audio...</span>
            </div>
            <div className="flex items-center gap-3">
              <Spinner variant="dots" size="sm" color="warning" />
              <span className="text-sm text-gray-600">Fetching images...</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};

// Accessibility Features
export const AccessibilityFeatures = {
  render: () => (
    <div className="space-y-8 p-6">
      <h2 className="text-2xl font-bold text-gray-900">Accessibility in Quiz Context</h2>
      
      <div className="space-y-6">
        {/* Keyboard Navigation */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Keyboard Navigation</h3>
          <p className="text-gray-600 mb-4">All components support keyboard navigation:</p>
          
          <div className="space-y-2">
            <Button variant="primary" size="md" className="mr-2">
              Tab to focus
            </Button>
            <Button variant="secondary" size="md" className="mr-2">
              Enter to activate
            </Button>
            <Button variant="success" size="md">
              Space for buttons
            </Button>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>• Use Tab to navigate between elements</p>
            <p>• Use Enter or Space to activate buttons</p>
            <p>• Use Escape to close tooltips</p>
          </div>
        </div>

        {/* Screen Reader Support */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Screen Reader Support</h3>
          
          <div className="space-y-4">
            <Tooltip content="This button is described for screen readers" position="top">
              <Button 
                variant="primary" 
                aria-label="Submit answer and proceed to next question"
              >
                Submit Answer
              </Button>
            </Tooltip>
            
            <div className="flex items-center gap-3">
              <Spinner 
                variant="ring" 
                size="md" 
                color="primary"
                aria-label="Loading next exercise, please wait"
              />
              <span className="sr-only">Loading next exercise</span>
              <span aria-hidden="true" className="text-gray-600">Processing...</span>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>• All interactive elements have proper ARIA labels</p>
            <p>• Loading states are announced to screen readers</p>
            <p>• Form validation errors are clearly communicated</p>
          </div>
        </div>

        {/* High Contrast Mode */}
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">High Contrast Support</h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-black text-white rounded border-2 border-yellow-400">
              <h4 className="font-semibold text-yellow-400 mb-2">High Contrast Mode</h4>
              <div className="space-y-2">
                <Button 
                  variant="primary" 
                  className="bg-yellow-400 text-black border-2 border-yellow-400 hover:bg-yellow-300"
                  size="sm"
                >
                  Primary Action
                </Button>
                <Button 
                  variant="secondary" 
                  className="bg-transparent text-white border-2 border-white hover:bg-white hover:text-black"
                  size="sm"
                >
                  Secondary Action
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p>• Components adapt to high contrast mode</p>
            <p>• Sufficient color contrast ratios maintained</p>
            <p>• Focus indicators remain visible</p>
          </div>
        </div>
      </div>
    </div>
  ),
};
