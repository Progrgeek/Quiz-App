import React, { useState } from 'react';
import Modal from '../src/components/ui/Modal.jsx';
import Button from '../src/components/ui/Button.jsx';
import Alert from '../src/components/ui/Alert.jsx';

export default {
  title: 'UI Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Accessible modal dialog component with animations and customizable layouts. Perfect for quiz results, settings, and confirmation dialogs.',
      },
    },
  },
};

export const BasicModal = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)}>
          Open Basic Modal
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Basic Modal"
        >
          <p className="text-gray-600">
            This is a basic modal with a title and close button. You can close it by clicking 
            the X button, pressing Escape, or clicking outside the modal.
          </p>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Basic modal with title and close functionality.',
      },
    },
  },
};

export const QuizResultsModal = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const results = {
      score: 85,
      totalQuestions: 20,
      correctAnswers: 17,
      timeSpent: '12:34',
      accuracy: 85
    };
    
    return (
      <>
        <Button onClick={() => setIsOpen(true)} variant="success">
          View Quiz Results
        </Button>
        
        <Modal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          title="Quiz Results"
          size="lg"
        >
          <div className="space-y-6">
            {/* Score Display */}
            <div className="text-center py-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {results.score}%
              </div>
              <div className="text-xl text-gray-700 mb-4">Excellent Work!</div>
              <div className="text-sm text-gray-600">
                You scored {results.correctAnswers} out of {results.totalQuestions} questions correctly
              </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{results.correctAnswers}</div>
                <div className="text-sm text-blue-800">Correct</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-600">{results.totalQuestions - results.correctAnswers}</div>
                <div className="text-sm text-gray-800">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{results.timeSpent}</div>
                <div className="text-sm text-purple-800">Time</div>
              </div>
            </div>
            
            {/* Performance Analysis */}
            <Alert type="success">
              <strong>Great job!</strong> You performed above average. Your accuracy rate of {results.accuracy}% 
              shows strong understanding of the material.
            </Alert>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button variant="primary" className="flex-1">
                Review Answers
              </Button>
              <Button variant="secondary" className="flex-1">
                Retake Quiz
              </Button>
              <Button variant="ghost" onClick={() => setIsOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      </>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Modal displaying comprehensive quiz results with stats and actions.',
      },
    },
  },
};
