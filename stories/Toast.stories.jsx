import React, { useState } from 'react';
import { Toast, ToastProvider, useToast } from '../src/components/ui/Toast.jsx';
import Button from '../src/components/ui/Button.jsx';

export default {
  title: 'UI Components/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <ToastProvider>
        <div style={{ minHeight: '200px' }}>
          <Story />
        </div>
      </ToastProvider>
    )
  ]
};

export const QuizCompletion = {
  render: () => {
    const [showToast, setShowToast] = useState(false);
    
    return (
      <div>
        <Button 
          onClick={() => setShowToast(true)}
        >
          Complete Quiz
        </Button>
        {showToast && (
          <Toast
            type="success"
            message="🎉 Quiz completed! You scored 8/10"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }
};

export const CorrectAnswer = {
  render: () => {
    const [showToast, setShowToast] = useState(false);
    
    return (
      <div>
        <Button 
          onClick={() => setShowToast(true)}
          variant="success"
        >
          Submit Correct Answer
        </Button>
        {showToast && (
          <Toast
            type="success"
            message="✅ Correct! Well done!"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }
};

export const IncorrectAnswer = {
  render: () => {
    const [showToast, setShowToast] = useState(false);
    
    return (
      <div>
        <Button 
          onClick={() => setShowToast(true)}
          variant="destructive"
        >
          Submit Wrong Answer
        </Button>
        {showToast && (
          <Toast
            type="error"
            message="❌ Incorrect. Try again!"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }
};

export const TimeWarning = {
  render: () => {
    const [showToast, setShowToast] = useState(false);
    
    return (
      <div>
        <Button 
          onClick={() => setShowToast(true)}
          variant="outline"
        >
          Show Time Warning
        </Button>
        {showToast && (
          <Toast
            type="warning"
            message="⚠️ Time running out! 2 minutes remaining"
            onClose={() => setShowToast(false)}
          />
        )}
      </div>
    );
  }
};
