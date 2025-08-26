/**
 * Tabs Component Stories
 * Demonstrates the Tabs navigation component with various configurations
 */

import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/components/ui';

export default {
  title: 'Navigation Components/Tabs',
  component: Tabs,
  parameters: {
    docs: {
      description: {
        component: 'A flexible tabs component with keyboard navigation, multiple variants, and smooth animations.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'pills', 'underline', 'card'],
      description: 'Tab variant style',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Tab size',
    },
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      description: 'Tab orientation',
    },
  },
};

// Basic tabs example
export const Default = {
  render: (args) => (
    <Tabs defaultValue="tab1" {...args}>
      <TabsList>
        <TabsTrigger value="tab1">Overview</TabsTrigger>
        <TabsTrigger value="tab2">Features</TabsTrigger>
        <TabsTrigger value="tab3">Pricing</TabsTrigger>
        <TabsTrigger value="tab4">Support</TabsTrigger>
      </TabsList>
      
      <div className="mt-4">
        <TabsContent value="tab1">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Overview</h3>
            <p className="text-gray-700">
              Get a comprehensive overview of our product features and capabilities. 
              This section provides you with all the essential information you need to get started.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="tab2">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Features</h3>
            <ul className="text-gray-700 space-y-2">
              <li>• Advanced analytics and reporting</li>
              <li>• Real-time collaboration tools</li>
              <li>• Secure data encryption</li>
              <li>• Mobile-responsive design</li>
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="tab3">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Pricing</h3>
            <p className="text-gray-700">
              Choose from our flexible pricing plans designed to scale with your needs. 
              All plans include core features with optional premium add-ons.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="tab4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold mb-2">Support</h3>
            <p className="text-gray-700">
              Our dedicated support team is here to help you succeed. Access documentation, 
              tutorials, and direct support channels.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
  args: {
    variant: 'default',
    size: 'md',
    orientation: 'horizontal',
  },
};

// Different variants
export const Variants = {
  render: () => (
    <div className="space-y-8">
      {/* Default variant */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Default</h3>
        <Tabs defaultValue="default1" variant="default">
          <TabsList>
            <TabsTrigger value="default1">Tab 1</TabsTrigger>
            <TabsTrigger value="default2">Tab 2</TabsTrigger>
            <TabsTrigger value="default3">Tab 3</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="default1">Default tab content 1</TabsContent>
            <TabsContent value="default2">Default tab content 2</TabsContent>
            <TabsContent value="default3">Default tab content 3</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Pills variant */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Pills</h3>
        <Tabs defaultValue="pills1" variant="pills">
          <TabsList>
            <TabsTrigger value="pills1">Tab 1</TabsTrigger>
            <TabsTrigger value="pills2">Tab 2</TabsTrigger>
            <TabsTrigger value="pills3">Tab 3</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="pills1">Pills tab content 1</TabsContent>
            <TabsContent value="pills2">Pills tab content 2</TabsContent>
            <TabsContent value="pills3">Pills tab content 3</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Underline variant */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Underline</h3>
        <Tabs defaultValue="underline1" variant="underline">
          <TabsList>
            <TabsTrigger value="underline1">Tab 1</TabsTrigger>
            <TabsTrigger value="underline2">Tab 2</TabsTrigger>
            <TabsTrigger value="underline3">Tab 3</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="underline1">Underline tab content 1</TabsContent>
            <TabsContent value="underline2">Underline tab content 2</TabsContent>
            <TabsContent value="underline3">Underline tab content 3</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Card variant */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Card</h3>
        <Tabs defaultValue="card1" variant="card">
          <TabsList>
            <TabsTrigger value="card1">Tab 1</TabsTrigger>
            <TabsTrigger value="card2">Tab 2</TabsTrigger>
            <TabsTrigger value="card3">Tab 3</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="card1">Card tab content 1</TabsContent>
            <TabsContent value="card2">Card tab content 2</TabsContent>
            <TabsContent value="card3">Card tab content 3</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  ),
};

// Different sizes
export const Sizes = {
  render: () => (
    <div className="space-y-8">
      {/* Small */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Small</h3>
        <Tabs defaultValue="sm1" size="sm">
          <TabsList>
            <TabsTrigger value="sm1">Small Tab</TabsTrigger>
            <TabsTrigger value="sm2">Small Tab 2</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="sm1">Small tab content</TabsContent>
            <TabsContent value="sm2">Small tab content 2</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Medium */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium</h3>
        <Tabs defaultValue="md1" size="md">
          <TabsList>
            <TabsTrigger value="md1">Medium Tab</TabsTrigger>
            <TabsTrigger value="md2">Medium Tab 2</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="md1">Medium tab content</TabsContent>
            <TabsContent value="md2">Medium tab content 2</TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Large */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Large</h3>
        <Tabs defaultValue="lg1" size="lg">
          <TabsList>
            <TabsTrigger value="lg1">Large Tab</TabsTrigger>
            <TabsTrigger value="lg2">Large Tab 2</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            <TabsContent value="lg1">Large tab content</TabsContent>
            <TabsContent value="lg2">Large tab content 2</TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  ),
};

// With icons
export const WithIcons = {
  render: () => (
    <Tabs defaultValue="dashboard" variant="pills">
      <TabsList>
        <TabsTrigger 
          value="dashboard"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
            </svg>
          }
        >
          Dashboard
        </TabsTrigger>
        
        <TabsTrigger 
          value="analytics"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          }
        >
          Analytics
        </TabsTrigger>
        
        <TabsTrigger 
          value="settings"
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/>
            </svg>
          }
        >
          Settings
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-6">
        <TabsContent value="dashboard">
          <div className="p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2">📊 Dashboard</h3>
            <p className="text-gray-700">
              View your key metrics, recent activity, and important notifications at a glance.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="p-6 bg-green-50 rounded-lg">
            <h3 className="font-semibold mb-2">📈 Analytics</h3>
            <p className="text-gray-700">
              Dive deep into your data with comprehensive analytics and reporting tools.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="p-6 bg-purple-50 rounded-lg">
            <h3 className="font-semibold mb-2">⚙️ Settings</h3>
            <p className="text-gray-700">
              Customize your preferences, manage your account, and configure system settings.
            </p>
          </div>
        </TabsContent>
      </div>
    </Tabs>
  ),
};

// Vertical orientation
export const VerticalTabs = {
  render: () => (
    <Tabs defaultValue="profile" orientation="vertical" className="max-w-2xl">
      <div className="flex gap-6">
        <TabsList className="w-48">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        
        <div className="flex-1">
          <TabsContent value="profile">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Profile Settings</h3>
              <p className="text-gray-700 mb-4">
                Manage your personal information and profile preferences.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Update your display name</div>
                <div>• Change your profile picture</div>
                <div>• Edit your bio and contact information</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="security">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Security Settings</h3>
              <p className="text-gray-700 mb-4">
                Configure security options to protect your account.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Change your password</div>
                <div>• Enable two-factor authentication</div>
                <div>• Manage active sessions</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Notification Preferences</h3>
              <p className="text-gray-700 mb-4">
                Control how and when you receive notifications.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• Email notification settings</div>
                <div>• Push notification preferences</div>
                <div>• Notification frequency</div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="billing">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2">Billing & Subscription</h3>
              <p className="text-gray-700 mb-4">
                Manage your subscription and payment methods.
              </p>
              <div className="space-y-2 text-sm text-gray-600">
                <div>• View current plan</div>
                <div>• Update payment methods</div>
                <div>• Download invoices</div>
              </div>
            </div>
          </TabsContent>
        </div>
      </div>
    </Tabs>
  ),
};

// Quiz example with controlled state
const QuizTabDemo = () => {
  const [activeTab, setActiveTab] = useState('question1');
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 'question1',
      title: 'Question 1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2
    },
    {
      id: 'question2', 
      title: 'Question 2',
      question: 'Which planet is closest to the Sun?',
      options: ['Venus', 'Mercury', 'Earth', 'Mars'],
      correct: 1
    },
    {
      id: 'question3',
      title: 'Question 3', 
      question: 'What is 2 + 2?',
      options: ['3', '4', '5', '6'],
      correct: 1
    }
  ];

  const handleAnswer = (questionId, answerIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerIndex }));
  };

  const getTabStatus = (questionId) => {
    if (answers[questionId] !== undefined) return 'completed';
    if (activeTab === questionId) return 'current';
    return 'pending';
  };

  return (
    <div className="max-w-2xl">
      <Tabs value={activeTab} onChange={setActiveTab} variant="pills">
        <TabsList>
          {questions.map((q) => {
            const status = getTabStatus(q.id);
            return (
              <TabsTrigger 
                key={q.id} 
                value={q.id}
                className={
                  status === 'completed' 
                    ? 'bg-green-100 text-green-700' 
                    : status === 'current'
                    ? 'bg-blue-100 text-blue-700'
                    : ''
                }
                icon={
                  status === 'completed' ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : null
                }
              >
                {q.title}
              </TabsTrigger>
            );
          })}
        </TabsList>
        
        <div className="mt-6">
          {questions.map((q, qIndex) => (
            <TabsContent key={q.id} value={q.id}>
              <div className="p-6 bg-white border border-gray-200 rounded-lg">
                <h3 className="font-semibold text-lg mb-4">{q.question}</h3>
                
                <div className="space-y-2 mb-6">
                  {q.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(q.id, index)}
                      className={`w-full p-3 text-left rounded border transition-colors ${
                        answers[q.id] === index
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {String.fromCharCode(65 + index)}. {option}
                    </button>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={() => setActiveTab(questions[qIndex - 1]?.id)}
                    disabled={qIndex === 0}
                    className="px-4 py-2 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <button
                    onClick={() => {
                      if (qIndex < questions.length - 1) {
                        setActiveTab(questions[qIndex + 1].id);
                      }
                    }}
                    disabled={qIndex === questions.length - 1}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {qIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  </button>
                </div>
              </div>
            </TabsContent>
          ))}
        </div>
      </Tabs>
      
      <div className="mt-4 text-sm text-gray-600">
        Progress: {Object.keys(answers).length} / {questions.length} questions answered
      </div>
    </div>
  );
};

export const QuizExample = {
  render: () => <QuizTabDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Example of using tabs in a quiz interface with progress tracking.',
      },
    },
  },
};

// Interactive playground
export const Playground = {
  args: {
    variant: 'default',
    size: 'md',
    orientation: 'horizontal',
  },
};
