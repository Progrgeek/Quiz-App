import React, { useState } from 'react';
import Card from '../src/components/ui/Card.jsx';

export default {
  title: 'UI Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Flexible card component for displaying content with consistent styling and interactive states. Perfect for quiz questions, student profiles, and content sections.',
      },
    },
  },
};

export const Default = {
  args: {
    children: (
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-2">Default Card</h3>
        <p className="text-gray-600">This is a basic card with default styling.</p>
      </div>
    ),
  },
};

export const QuizQuestion = {
  render: () => {
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    
    const options = ['London', 'Berlin', 'Paris', 'Madrid'];
    const correctAnswer = 2; // Paris
    
    const handleSubmit = () => {
      setIsSubmitted(true);
    };
    
    return (
      <Card className="max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Quiz Question #1</h3>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded">
              Multiple Choice
            </span>
          </div>
          <p className="mb-4 font-medium">What is the capital of France?</p>
          <div className="space-y-2 mb-4">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => !isSubmitted && setSelectedAnswer(index)}
                disabled={isSubmitted}
                className={`w-full text-left p-3 border rounded-lg transition-colors ${
                  isSubmitted && index === correctAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : isSubmitted && index === selectedAnswer && index !== correctAnswer
                    ? 'border-red-500 bg-red-50 text-red-700'
                    : isSubmitted
                    ? 'border-gray-300 bg-gray-50 text-gray-500'
                    : selectedAnswer === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                {option}
                {isSubmitted && index === correctAnswer && (
                  <span className="ml-2 text-green-600">✓</span>
                )}
                {isSubmitted && index === selectedAnswer && index !== correctAnswer && (
                  <span className="ml-2 text-red-600">✗</span>
                )}
              </button>
            ))}
          </div>
          {!isSubmitted ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswer === null}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors"
            >
              Submit Answer
            </button>
          ) : (
            <div className="text-center">
              <div className={`p-3 rounded-lg ${
                selectedAnswer === correctAnswer 
                  ? 'bg-green-50 border border-green-200 text-green-800'
                  : 'bg-red-50 border border-red-200 text-red-800'
              }`}>
                {selectedAnswer === correctAnswer 
                  ? '🎉 Correct! Paris is the capital of France.'
                  : '❌ Incorrect. The correct answer is Paris.'
                }
              </div>
            </div>
          )}
        </div>
      </Card>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive quiz question card with answer selection and feedback.',
      },
    },
  },
};
