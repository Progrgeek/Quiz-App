/**
 * Radio Component Stories
 * Demonstrates the Radio and RadioCard components with various configurations
 */

import React, { useState } from 'react';
import { Radio, RadioGroup, RadioCard } from '../src/components/ui';

export default {
  title: 'Form Components/Radio',
  component: Radio,
  parameters: {
    docs: {
      description: {
        component: 'Radio button components with group management and specialized card variant for enhanced UX.',
      },
    },
  },
  argTypes: {
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Radio button size',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
  },
};

// Basic radio examples
export const Default = {
  args: {
    name: 'example',
    children: 'This is a radio option',
  },
};

export const WithDescription = {
  args: {
    name: 'example',
    children: 'Enable dark mode',
    description: 'Switch to a darker color scheme for better night viewing',
  },
};

// Different sizes
export const Sizes = {
  render: (args) => (
    <div className="space-y-4">
      <Radio {...args} name="size-demo" size="sm">
        Small radio button
      </Radio>
      <Radio {...args} name="size-demo" size="md">
        Medium radio button
      </Radio>
      <Radio {...args} name="size-demo" size="lg">
        Large radio button
      </Radio>
    </div>
  ),
};

// Different states
export const States = {
  render: (args) => (
    <div className="space-y-4">
      <Radio {...args} name="states-demo">
        Normal radio
      </Radio>
      <Radio {...args} name="states-demo" defaultChecked>
        Selected radio
      </Radio>
      <Radio {...args} name="states-demo" disabled>
        Disabled radio
      </Radio>
      <Radio {...args} name="states-demo" disabled defaultChecked>
        Disabled selected
      </Radio>
    </div>
  ),
};

// Radio group example
const RadioGroupDemo = () => {
  const [selectedTheme, setSelectedTheme] = useState('system');

  return (
    <RadioGroup
      label="Choose Theme"
      description="Select your preferred color scheme"
      value={selectedTheme}
      onChange={setSelectedTheme}
      required
    >
      <Radio value="light">
        <div>
          <div className="font-medium">Light Mode</div>
          <div className="text-sm text-gray-600">
            Clean and bright interface
          </div>
        </div>
      </Radio>
      
      <Radio value="dark">
        <div>
          <div className="font-medium">Dark Mode</div>
          <div className="text-sm text-gray-600">
            Easy on the eyes for night usage
          </div>
        </div>
      </Radio>
      
      <Radio value="system">
        <div>
          <div className="font-medium">System</div>
          <div className="text-sm text-gray-600">
            Automatically match your device settings
          </div>
        </div>
      </Radio>
    </RadioGroup>
  );
};

export const RadioGroupExample = {
  render: () => <RadioGroupDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of using RadioGroup for managing related radio options.',
      },
    },
  },
};

// RadioCard examples
export const RadioCardVariant = {
  render: (args) => {
    const [selectedPlan, setSelectedPlan] = useState('pro');

    return (
      <RadioGroup
        label="Choose Your Plan"
        value={selectedPlan}
        onChange={setSelectedPlan}
        className="max-w-md space-y-3"
      >
        <RadioCard value="basic">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg">Basic</div>
              <div className="text-gray-600 text-sm">Perfect for getting started</div>
              <div className="mt-2">
                <div className="text-xs text-gray-500">✓ 5 projects</div>
                <div className="text-xs text-gray-500">✓ 1GB storage</div>
                <div className="text-xs text-gray-500">✓ Email support</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">$9</div>
              <div className="text-xs text-gray-500">/month</div>
            </div>
          </div>
        </RadioCard>

        <RadioCard value="pro">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2">
                <div className="font-semibold text-lg">Pro</div>
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                  Popular
                </span>
              </div>
              <div className="text-gray-600 text-sm">Great for growing teams</div>
              <div className="mt-2">
                <div className="text-xs text-gray-500">✓ 25 projects</div>
                <div className="text-xs text-gray-500">✓ 10GB storage</div>
                <div className="text-xs text-gray-500">✓ Priority support</div>
                <div className="text-xs text-gray-500">✓ Advanced analytics</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">$29</div>
              <div className="text-xs text-gray-500">/month</div>
            </div>
          </div>
        </RadioCard>

        <RadioCard value="enterprise">
          <div className="flex justify-between items-start">
            <div>
              <div className="font-semibold text-lg">Enterprise</div>
              <div className="text-gray-600 text-sm">For large organizations</div>
              <div className="mt-2">
                <div className="text-xs text-gray-500">✓ Unlimited projects</div>
                <div className="text-xs text-gray-500">✓ 100GB storage</div>
                <div className="text-xs text-gray-500">✓ 24/7 phone support</div>
                <div className="text-xs text-gray-500">✓ Custom integrations</div>
                <div className="text-xs text-gray-500">✓ SLA guarantee</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">$99</div>
              <div className="text-xs text-gray-500">/month</div>
            </div>
          </div>
        </RadioCard>
      </RadioGroup>
    );
  },
  parameters: {
    docs: {
      description: {
        story: 'RadioCard variant provides an enhanced card-based selection interface.',
      },
    },
  },
};

// Quiz-specific example
const QuizRadioDemo = () => {
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const correctAnswer = 'c';

  const checkAnswer = () => {
    setShowFeedback(true);
  };

  const resetQuiz = () => {
    setSelectedAnswer('');
    setShowFeedback(false);
  };

  const isCorrect = showFeedback && selectedAnswer === correctAnswer;

  return (
    <div className="max-w-2xl space-y-4">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Question: What is the capital of France?
        </h3>
        <p className="text-blue-800 text-sm">
          Choose the correct answer from the options below.
        </p>
      </div>

      <RadioGroup
        label="Select your answer"
        value={selectedAnswer}
        onChange={setSelectedAnswer}
        error={showFeedback && !isCorrect ? 'Incorrect answer. Try again!' : ''}
        required
      >
        <RadioCard value="a">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">London</div>
              <div className="text-sm text-gray-600">
                Capital of the United Kingdom
              </div>
            </div>
            <div className="text-2xl">🇬🇧</div>
          </div>
        </RadioCard>

        <RadioCard value="b">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Berlin</div>
              <div className="text-sm text-gray-600">
                Capital of Germany
              </div>
            </div>
            <div className="text-2xl">🇩🇪</div>
          </div>
        </RadioCard>

        <RadioCard value="c">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Paris</div>
              <div className="text-sm text-gray-600">
                Known as the City of Light
              </div>
            </div>
            <div className="text-2xl">🇫🇷</div>
          </div>
        </RadioCard>

        <RadioCard value="d">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Madrid</div>
              <div className="text-sm text-gray-600">
                Capital of Spain
              </div>
            </div>
            <div className="text-2xl">🇪🇸</div>
          </div>
        </RadioCard>
      </RadioGroup>

      <div className="flex gap-2">
        <button
          onClick={checkAnswer}
          disabled={!selectedAnswer}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Check Answer
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
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          {isCorrect ? (
            <div>
              <div className="font-semibold">Correct! 🎉</div>
              <div className="mt-1">
                Paris is indeed the capital of France. It's known for its rich history, 
                culture, and landmarks like the Eiffel Tower and Louvre Museum.
              </div>
            </div>
          ) : (
            <div>
              <div className="font-semibold">Not quite right.</div>
              <div className="mt-1">
                Think about which city is famous for the Eiffel Tower and is known as the City of Light.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const QuizExample = {
  render: () => <QuizRadioDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of using RadioCard in a quiz question with visual feedback.',
      },
    },
  },
};

// Settings form example
const SettingsFormDemo = () => {
  const [settings, setSettings] = useState({
    notifications: 'email',
    language: 'en',
    theme: 'system'
  });

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-lg space-y-6">
      <h3 className="text-lg font-semibold">User Preferences</h3>
      
      <RadioGroup
        label="Notification Preferences"
        description="How would you like to receive notifications?"
        value={settings.notifications}
        onChange={(value) => updateSetting('notifications', value)}
      >
        <Radio value="none">
          <div>
            <div className="font-medium">No notifications</div>
            <div className="text-sm text-gray-600">
              You won't receive any notifications
            </div>
          </div>
        </Radio>
        
        <Radio value="email">
          <div>
            <div className="font-medium">Email only</div>
            <div className="text-sm text-gray-600">
              Receive notifications via email
            </div>
          </div>
        </Radio>
        
        <Radio value="push">
          <div>
            <div className="font-medium">Push notifications</div>
            <div className="text-sm text-gray-600">
              Get instant browser notifications
            </div>
          </div>
        </Radio>
        
        <Radio value="both">
          <div>
            <div className="font-medium">Email + Push</div>
            <div className="text-sm text-gray-600">
              Receive both email and push notifications
            </div>
          </div>
        </Radio>
      </RadioGroup>

      <RadioGroup
        label="Language"
        value={settings.language}
        onChange={(value) => updateSetting('language', value)}
      >
        <Radio value="en">English</Radio>
        <Radio value="es">Español</Radio>
        <Radio value="fr">Français</Radio>
        <Radio value="de">Deutsch</Radio>
      </RadioGroup>

      <div className="p-4 bg-gray-50 rounded-lg">
        <h4 className="font-medium mb-2">Current Settings:</h4>
        <pre className="text-sm text-gray-700">
          {JSON.stringify(settings, null, 2)}
        </pre>
      </div>
    </div>
  );
};

export const SettingsFormExample = {
  render: () => <SettingsFormDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of using radio groups in a settings/preferences form.',
      },
    },
  },
};

// Interactive playground
export const Playground = {
  args: {
    name: 'playground',
    children: 'Playground radio option',
    size: 'md',
    disabled: false,
  },
};
