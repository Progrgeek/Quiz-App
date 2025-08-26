/**
 * Checkbox Component Stories
 * Demonstrates the Checkbox component with various configurations
 */

import React, { useState } from 'react';
import { Checkbox, CheckboxGroup } from '../src/components/ui';

export default {
  title: 'Form Components/Checkbox',
  component: Checkbox,
  parameters: {
    docs: {
      description: {
        component: 'A flexible checkbox component with group management, animations, and accessibility features.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Checkbox size',
    },
    variant: {
      control: 'select',
      options: ['default', 'card'],
      description: 'Checkbox variant',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    indeterminate: {
      control: 'boolean',
      description: 'Indeterminate state',
    },
  },
};

// Basic checkbox variants
export const Default = {
  args: {
    children: 'I agree to the terms and conditions',
  },
};

export const WithDescription = {
  args: {
    children: 'Enable notifications',
    description: 'Receive email notifications about updates and news',
  },
};

export const Required = {
  args: {
    children: 'I accept the privacy policy',
    description: 'Required to continue',
    required: true,
  },
};

// Different sizes
export const Sizes = {
  render: (args) => (
    <div className="space-y-4">
      <Checkbox {...args} size="sm">
        Small checkbox
      </Checkbox>
      <Checkbox {...args} size="md">
        Medium checkbox
      </Checkbox>
      <Checkbox {...args} size="lg">
        Large checkbox
      </Checkbox>
    </div>
  ),
};

// Different states
export const States = {
  render: (args) => (
    <div className="space-y-4">
      <Checkbox {...args}>
        Normal checkbox
      </Checkbox>
      <Checkbox {...args} defaultChecked>
        Checked checkbox
      </Checkbox>
      <Checkbox {...args} indeterminate>
        Indeterminate checkbox
      </Checkbox>
      <Checkbox {...args} disabled>
        Disabled checkbox
      </Checkbox>
      <Checkbox {...args} disabled defaultChecked>
        Disabled checked
      </Checkbox>
    </div>
  ),
};

// Card variant
export const CardVariant = {
  render: (args) => (
    <div className="space-y-3 max-w-md">
      <Checkbox {...args} variant="card">
        <div>
          <div className="font-medium">Basic Plan</div>
          <div className="text-sm text-gray-600">$9.99/month</div>
          <div className="text-xs text-gray-500 mt-1">
            Perfect for individuals and small projects
          </div>
        </div>
      </Checkbox>
      
      <Checkbox {...args} variant="card" defaultChecked>
        <div>
          <div className="font-medium">Pro Plan</div>
          <div className="text-sm text-gray-600">$19.99/month</div>
          <div className="text-xs text-gray-500 mt-1">
            Great for teams and growing businesses
          </div>
        </div>
      </Checkbox>
      
      <Checkbox {...args} variant="card">
        <div>
          <div className="font-medium">Enterprise Plan</div>
          <div className="text-sm text-gray-600">$49.99/month</div>
          <div className="text-xs text-gray-500 mt-1">
            Full features for large organizations
          </div>
        </div>
      </Checkbox>
    </div>
  ),
};

// Checkbox group examples
const CheckboxGroupDemo = () => {
  const [selected, setSelected] = useState(['option1']);

  return (
    <CheckboxGroup
      label="Choose your interests"
      description="Select all that apply"
      value={selected}
      onChange={setSelected}
      error={selected.length === 0 ? 'Please select at least one option' : ''}
    >
      <Checkbox value="option1">
        Technology & Programming
      </Checkbox>
      <Checkbox value="option2">
        Design & Creativity
      </Checkbox>
      <Checkbox value="option3">
        Business & Finance
      </Checkbox>
      <Checkbox value="option4">
        Health & Fitness
      </Checkbox>
      <Checkbox value="option5">
        Travel & Adventure
      </Checkbox>
    </CheckboxGroup>
  );
};

export const CheckboxGroupExample = {
  render: () => <CheckboxGroupDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of using CheckboxGroup for managing multiple related checkboxes.',
      },
    },
  },
};

// Quiz-specific example
const QuizCheckboxDemo = () => {
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswers = ['b', 'c', 'd'];

  const checkAnswers = () => {
    setShowFeedback(true);
  };

  const resetQuiz = () => {
    setSelectedAnswers([]);
    setShowFeedback(false);
  };

  const isCorrect = showFeedback && 
    correctAnswers.length === selectedAnswers.length &&
    correctAnswers.every(answer => selectedAnswers.includes(answer));

  const hasPartialCorrect = showFeedback && 
    selectedAnswers.some(answer => correctAnswers.includes(answer));

  return (
    <div className="max-w-lg space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Question: Which of the following are programming languages?
        </h3>
        <p className="text-blue-800 text-sm">
          Select all correct answers. There may be more than one.
        </p>
      </div>

      <CheckboxGroup
        label="Programming Languages"
        value={selectedAnswers}
        onChange={setSelectedAnswers}
        error={showFeedback && !isCorrect && !hasPartialCorrect ? 
          'None of your selections are correct. Try again!' : ''}
      >
        <Checkbox value="a" variant="card">
          <div>
            <div className="font-medium">HTML</div>
            <div className="text-sm text-gray-600">
              Markup language for web content
            </div>
          </div>
        </Checkbox>
        
        <Checkbox value="b" variant="card">
          <div>
            <div className="font-medium">JavaScript</div>
            <div className="text-sm text-gray-600">
              Dynamic programming language for web development
            </div>
          </div>
        </Checkbox>
        
        <Checkbox value="c" variant="card">
          <div>
            <div className="font-medium">Python</div>
            <div className="text-sm text-gray-600">
              High-level programming language
            </div>
          </div>
        </Checkbox>
        
        <Checkbox value="d" variant="card">
          <div>
            <div className="font-medium">Java</div>
            <div className="text-sm text-gray-600">
              Object-oriented programming language
            </div>
          </div>
        </Checkbox>
        
        <Checkbox value="e" variant="card">
          <div>
            <div className="font-medium">CSS</div>
            <div className="text-sm text-gray-600">
              Stylesheet language for presentation
            </div>
          </div>
        </Checkbox>
      </CheckboxGroup>

      <div className="flex gap-2">
        <button
          onClick={checkAnswers}
          disabled={selectedAnswers.length === 0}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answers
        </button>
        
        <button
          onClick={resetQuiz}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
          Reset
        </button>
      </div>

      {showFeedback && (
        <div className={`p-4 rounded border ${
          isCorrect 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : hasPartialCorrect
            ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {isCorrect ? (
            <div>
              <div className="font-semibold">Perfect! 🎉</div>
              <div className="mt-1">
                JavaScript, Python, and Java are all programming languages. 
                HTML and CSS are markup and styling languages respectively.
              </div>
            </div>
          ) : hasPartialCorrect ? (
            <div>
              <div className="font-semibold">Partially correct!</div>
              <div className="mt-1">
                You got some right, but you're missing some correct answers or included incorrect ones.
                Programming languages: JavaScript, Python, Java.
              </div>
            </div>
          ) : (
            <div>
              <div className="font-semibold">Not quite right.</div>
              <div className="mt-1">
                Think about which of these can be used to write executable programs and logic.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const QuizExample = {
  render: () => <QuizCheckboxDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of using checkboxes in a multiple-answer quiz question.',
      },
    },
  },
};

// Select all functionality
const SelectAllDemo = () => {
  const [selectedItems, setSelectedItems] = useState([]);

  const allItems = [
    'apple',
    'banana', 
    'cherry',
    'date',
    'elderberry'
  ];

  const isAllSelected = selectedItems.length === allItems.length;
  const isIndeterminate = selectedItems.length > 0 && selectedItems.length < allItems.length;

  const handleSelectAll = (checked) => {
    setSelectedItems(checked ? allItems : []);
  };

  return (
    <div className="space-y-4">
      <Checkbox
        checked={isAllSelected}
        indeterminate={isIndeterminate}
        onChange={handleSelectAll}
      >
        <span className="font-medium">
          Select All Fruits ({selectedItems.length}/{allItems.length})
        </span>
      </Checkbox>
      
      <div className="ml-6 space-y-2 border-l-2 border-gray-200 pl-4">
        <CheckboxGroup
          value={selectedItems}
          onChange={setSelectedItems}
        >
          {allItems.map(item => (
            <Checkbox key={item} value={item}>
              {item.charAt(0).toUpperCase() + item.slice(1)}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </div>
      
      {selectedItems.length > 0 && (
        <div className="text-sm text-gray-600">
          Selected: {selectedItems.join(', ')}
        </div>
      )}
    </div>
  );
};

export const SelectAllExample = {
  render: () => <SelectAllDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example showing "select all" functionality with indeterminate state.',
      },
    },
  },
};

// Interactive playground
export const Playground = {
  args: {
    children: 'Playground checkbox',
    size: 'md',
    variant: 'default',
    disabled: false,
    indeterminate: false,
  },
};
