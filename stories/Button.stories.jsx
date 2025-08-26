import React from 'react';
import Button from '../src/components/ui/Button.jsx';

export default {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
  },
};

export const Primary = {
  args: {
    children: 'Submit Answer',
    variant: 'primary',
  },
};

export const Secondary = {
  args: {
    children: 'Skip Question',
    variant: 'secondary',
  },
};

export const Success = {
  args: {
    children: 'Correct!',
    variant: 'success',
  },
};

export const Destructive = {
  args: {
    children: 'Reset Quiz',
    variant: 'destructive',
  },
};

export const Loading = {
  args: {
    children: 'Submitting...',
    variant: 'primary',
    loading: true,
  },
};

export const Small = {
  args: {
    children: 'Hint',
    size: 'sm',
    variant: 'outline',
  },
};

export const Large = {
  args: {
    children: 'Start Quiz',
    size: 'lg',
    variant: 'primary',
  },
};
