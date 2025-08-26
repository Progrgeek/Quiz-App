import React from 'react';
import Alert from '../src/components/ui/Alert.jsx';

export default {
  title: 'UI/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['info', 'success', 'warning', 'error'],
    },
  },
};

export const QuizSuccess = {
  args: {
    children: '🎉 Congratulations! You completed the quiz with a perfect score!',
    type: 'success',
  },
};

export const QuizError = {
  args: {
    children: '❌ Incorrect answer. Please try again!',
    type: 'error',
  },
};

export const QuizWarning = {
  args: {
    children: '⚠️ Time is running out! You have 2 minutes remaining.',
    type: 'warning',
  },
};

export const QuizInfo = {
  args: {
    children: 'ℹ️ Click on the correct answer to proceed to the next question.',
    type: 'info',
  },
};
