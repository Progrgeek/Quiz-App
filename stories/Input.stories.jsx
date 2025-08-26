import React from 'react';
import { Input } from '../src/components/ui';

export default {
  title: 'UI Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Input components for forms and user data collection. Essential for quiz creation, user registration, and search functionality.',
      },
    },
  },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'search', 'url', 'tel'],
      description: 'Input type',
    },
    variant: {
      control: { type: 'select' },
      options: ['default', 'filled', 'outlined'],
      description: 'Visual style variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Input size',
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'error', 'success', 'warning'],
      description: 'Validation state',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    label: {
      control: 'text',
      description: 'Input label',
    },
    helperText: {
      control: 'text',
      description: 'Helper or error text',
    },
    disabled: {
      control: 'boolean',
      description: 'Disabled state',
    },
    required: {
      control: 'boolean',
      description: 'Required field indicator',
    },
  },
};

export const Default = {
  args: {
    placeholder: 'Enter text here...',
    label: 'Default Input',
  },
};

export const Variants = () => (
  <div className="space-y-4 w-full max-w-sm">
    <Input variant="default" label="Default Input" placeholder="Default style" />
    <Input variant="filled" label="Filled Input" placeholder="Filled background" />
    <Input variant="outlined" label="Outlined Input" placeholder="Outlined border" />
  </div>
);

export const Sizes = () => (
  <div className="space-y-4 w-full max-w-sm">
    <Input size="sm" label="Small Input" placeholder="Small size" />
    <Input size="md" label="Medium Input" placeholder="Medium size (default)" />
    <Input size="lg" label="Large Input" placeholder="Large size" />
  </div>
);

export const States = () => (
  <div className="space-y-4 w-full max-w-sm">
    <Input 
      state="default" 
      label="Default State" 
      placeholder="Normal input" 
      helperText="This is helper text"
    />
    <Input 
      state="success" 
      label="Success State" 
      placeholder="Valid input" 
      helperText="Input is valid!"
      value="valid@example.com"
    />
    <Input 
      state="warning" 
      label="Warning State" 
      placeholder="Warning input" 
      helperText="Please double-check this value"
    />
    <Input 
      state="error" 
      label="Error State" 
      placeholder="Invalid input" 
      helperText="This field is required"
    />
  </div>
);

export const InputTypes = () => (
  <div className="space-y-4 w-full max-w-sm">
    <Input type="text" label="Text Input" placeholder="Regular text" />
    <Input type="email" label="Email Input" placeholder="user@example.com" />
    <Input type="password" label="Password Input" placeholder="••••••••" />
    <Input type="number" label="Number Input" placeholder="42" />
    <Input type="search" label="Search Input" placeholder="Search..." />
    <Input type="tel" label="Phone Input" placeholder="+1 (555) 123-4567" />
  </div>
);

export const QuizInputs = () => (
  <div className="space-y-6 w-full max-w-md">
    <div>
      <h3 className="text-lg font-semibold mb-4">Quiz Creation Form</h3>
      <div className="space-y-4">
        <Input 
          label="Quiz Title" 
          placeholder="Enter quiz title..."
          required
        />
        <Input 
          label="Description" 
          placeholder="Brief description of the quiz"
          helperText="Max 200 characters"
        />
        <Input 
          type="number" 
          label="Time Limit (minutes)" 
          placeholder="30"
          helperText="Set 0 for no time limit"
        />
        <Input 
          type="number" 
          label="Passing Score (%)" 
          placeholder="70"
          helperText="Minimum score to pass"
        />
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold mb-4">Student Registration</h3>
      <div className="space-y-4">
        <Input 
          label="Full Name" 
          placeholder="John Doe"
          required
        />
        <Input 
          type="email" 
          label="Email Address" 
          placeholder="student@school.edu"
          required
        />
        <Input 
          label="Student ID" 
          placeholder="STU123456"
          helperText="Your unique student identifier"
        />
      </div>
    </div>
  </div>
);

export const WithValidation = () => {
  const [email, setEmail] = React.useState('');
  const [emailState, setEmailState] = React.useState('default');
  const [emailHelper, setEmailHelper] = React.useState('Enter your email address');
  
  const validateEmail = (value) => {
    if (!value) {
      setEmailState('error');
      setEmailHelper('Email is required');
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      setEmailState('error');
      setEmailHelper('Please enter a valid email address');
    } else {
      setEmailState('success');
      setEmailHelper('Email is valid!');
    }
  };
  
  return (
    <div className="w-full max-w-sm">
      <Input
        type="email"
        label="Email Address"
        placeholder="user@example.com"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          validateEmail(e.target.value);
        }}
        state={emailState}
        helperText={emailHelper}
        required
      />
    </div>
  );
};

export const Interactive = {
  args: {
    label: 'Interactive Input',
    placeholder: 'Type something...',
    type: 'text',
    variant: 'default',
    size: 'md',
    state: 'default',
  },
  parameters: {
    docs: {
      description: {
        story: 'Use the controls below to interact with the input properties.',
      },
    },
  },
};
