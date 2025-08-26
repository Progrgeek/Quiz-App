/**
 * Select Component Stories
 * Demonstrates the Select/Dropdown component with various configurations
 */

import React, { useState } from 'react';
import { Select } from '../src/components/ui';

export default {
  title: 'Form Components/Select',
  component: Select,
  parameters: {
    docs: {
      description: {
        component: 'A versatile select dropdown component with search, multi-select, and custom rendering capabilities.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Select size',
    },
    multiple: {
      control: 'boolean',
      description: 'Enable multi-select',
    },
    searchable: {
      control: 'boolean',
      description: 'Enable search functionality',
    },
    clearable: {
      control: 'boolean',
      description: 'Enable clear button',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    loading: {
      control: 'boolean',
      description: 'Loading state',
    },
  },
};

// Sample options data
const simpleOptions = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

const objectOptions = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'fr', label: 'France' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
  { value: 'au', label: 'Australia' },
];

const quizOptions = [
  { value: 'a', label: 'The quick brown fox jumps over the lazy dog' },
  { value: 'b', label: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' },
  { value: 'c', label: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua' },
  { value: 'd', label: 'Ut enim ad minim veniam, quis nostrud exercitation' },
];

// Basic select variants
export const Default = {
  args: {
    label: 'Choose a fruit',
    placeholder: 'Select a fruit...',
    options: simpleOptions,
  },
};

export const WithObjectOptions = {
  args: {
    label: 'Select Country',
    placeholder: 'Choose a country...',
    options: objectOptions,
  },
};

export const Searchable = {
  args: {
    label: 'Searchable Select',
    placeholder: 'Search and select...',
    options: objectOptions,
    searchable: true,
  },
};

export const Clearable = {
  args: {
    label: 'Clearable Select',
    placeholder: 'Select with clear option...',
    options: simpleOptions,
    clearable: true,
    defaultValue: 'Apple',
  },
};

export const MultiSelect = {
  args: {
    label: 'Multi-Select',
    placeholder: 'Select multiple options...',
    options: simpleOptions,
    multiple: true,
    searchable: true,
    clearable: true,
  },
};

// Different sizes
export const Sizes = {
  render: (args) => (
    <div className="space-y-4">
      <Select
        {...args}
        size="sm"
        label="Small Select"
        placeholder="Small size..."
      />
      <Select
        {...args}
        size="md"
        label="Medium Select"
        placeholder="Medium size..."
      />
      <Select
        {...args}
        size="lg"
        label="Large Select"
        placeholder="Large size..."
      />
    </div>
  ),
  args: {
    options: simpleOptions,
  },
};

// States
export const States = {
  render: (args) => (
    <div className="space-y-4">
      <Select
        {...args}
        label="Normal State"
        placeholder="Normal select..."
      />
      <Select
        {...args}
        label="With Error"
        placeholder="Error state..."
        error="Please select a valid option"
      />
      <Select
        {...args}
        label="With Success"
        placeholder="Success state..."
        success="Great choice!"
        defaultValue="Apple"
      />
      <Select
        {...args}
        label="Disabled"
        placeholder="Disabled select..."
        disabled
      />
      <Select
        {...args}
        label="Loading"
        placeholder="Loading options..."
        loading
      />
    </div>
  ),
  args: {
    options: simpleOptions,
  },
};

// Quiz-specific example
const QuizSelectDemo = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswerChange = (value) => {
    setSelectedAnswer(value);
    setShowFeedback(false);
  };

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const isCorrect = selectedAnswer === 'c';

  return (
    <div className="max-w-md space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Question: Which sentence contains correct grammar?
        </h3>
        <p className="text-blue-800 text-sm">
          Select the sentence with proper grammatical structure.
        </p>
      </div>

      <Select
        label="Choose your answer"
        placeholder="Select the correct sentence..."
        options={[
          { 
            value: 'a', 
            label: 'Me and my friend goes to the store' 
          },
          { 
            value: 'b', 
            label: 'My friend and me goes to the store' 
          },
          { 
            value: 'c', 
            label: 'My friend and I go to the store' 
          },
          { 
            value: 'd', 
            label: 'My friend and I goes to the store' 
          },
        ]}
        value={selectedAnswer}
        onChange={handleAnswerChange}
        error={showFeedback && !isCorrect ? 'Not quite right. Try again!' : ''}
        success={showFeedback && isCorrect ? 'Correct! Well done!' : ''}
        required
      />

      <div className="flex gap-2">
        <button
          onClick={checkAnswer}
          disabled={!selectedAnswer}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
        
        <button
          onClick={() => {
            setSelectedAnswer(null);
            setShowFeedback(false);
          }}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {showFeedback && (
        <div className={`p-3 rounded border ${
          isCorrect 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {isCorrect 
            ? 'Excellent! "My friend and I go to the store" uses the correct subject pronoun "I" and proper verb agreement.'
            : 'Hint: Remember to use "I" (not "me") as a subject pronoun, and make sure the verb agrees with the plural subject.'
          }
        </div>
      )}
    </div>
  );
};

export const QuizExample = {
  render: () => <QuizSelectDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of how the Select component can be used in quiz questions with feedback.',
      },
    },
  },
};

// Custom rendering example
export const CustomRendering = {
  render: () => {
    const userOptions = [
      { 
        value: 'john', 
        label: 'John Doe', 
        email: 'john@example.com',
        avatar: '👨‍💼'
      },
      { 
        value: 'jane', 
        label: 'Jane Smith', 
        email: 'jane@example.com',
        avatar: '👩‍🔬'
      },
      { 
        value: 'bob', 
        label: 'Bob Johnson', 
        email: 'bob@example.com',
        avatar: '👨‍🎨'
      },
    ];

    return (
      <Select
        label="Assign to User"
        placeholder="Select a user..."
        options={userOptions}
        renderOption={(option) => (
          <div className="flex items-center space-x-3">
            <span className="text-lg">{option.avatar}</span>
            <div>
              <div className="font-medium">{option.label}</div>
              <div className="text-sm text-gray-500">{option.email}</div>
            </div>
          </div>
        )}
        renderValue={(value) => {
          const user = userOptions.find(u => u.value === value);
          return user ? (
            <div className="flex items-center space-x-2">
              <span>{user.avatar}</span>
              <span>{user.label}</span>
            </div>
          ) : value;
        }}
      />
    );
  },
};

// Interactive playground
export const Playground = {
  args: {
    label: 'Interactive Select',
    placeholder: 'Try different configurations...',
    options: objectOptions,
    searchable: false,
    multiple: false,
    clearable: false,
    disabled: false,
    loading: false,
    size: 'md',
  },
};
