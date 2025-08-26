/**
 * Spinner Component Stories
 * Demonstrates loading indicators with different variants and use cases
 */

import React, { useState } from 'react';
import { Spinner, LoadingOverlay, InlineLoader } from '../src/components/ui';

export default {
  title: 'UI Components/Spinner',
  component: Spinner,
  parameters: {
    docs: {
      description: {
        component: 'A comprehensive loading indicator system with multiple variants, sizes, and overlay capabilities. Perfect for different loading states and user feedback.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['dots', 'pulse', 'bars', 'ring'],
      description: 'Spinner animation variant',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: 'Spinner size',
    },
    color: {
      control: 'select',
      options: ['primary', 'secondary', 'success', 'error', 'warning'],
      description: 'Spinner color theme',
    },
  },
  args: {
    variant: 'dots',
    size: 'md',
    color: 'primary',
  },
};

// Basic spinner variants
export const Dots = {
  args: {
    variant: 'dots',
  },
};

export const Pulse = {
  args: {
    variant: 'pulse',
  },
};

export const Bars = {
  args: {
    variant: 'bars',
  },
};

export const Ring = {
  args: {
    variant: 'ring',
  },
};

// Different sizes
export const Sizes = {
  render: (args) => (
    <div className="flex items-center gap-8">
      <div className="text-center">
        <Spinner {...args} size="sm" />
        <p className="text-sm text-gray-600 mt-2">Small</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} size="md" />
        <p className="text-sm text-gray-600 mt-2">Medium</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} size="lg" />
        <p className="text-sm text-gray-600 mt-2">Large</p>
      </div>
    </div>
  ),
  args: {
    variant: 'dots',
    color: 'primary',
  },
};

// Different colors
export const Colors = {
  render: (args) => (
    <div className="flex items-center gap-6">
      <div className="text-center">
        <Spinner {...args} color="primary" />
        <p className="text-sm text-gray-600 mt-2">Primary</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} color="secondary" />
        <p className="text-sm text-gray-600 mt-2">Secondary</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} color="success" />
        <p className="text-sm text-gray-600 mt-2">Success</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} color="error" />
        <p className="text-sm text-gray-600 mt-2">Error</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} color="warning" />
        <p className="text-sm text-gray-600 mt-2">Warning</p>
      </div>
    </div>
  ),
  args: {
    variant: 'ring',
    size: 'md',
  },
};

// All variants showcase
export const AllVariants = {
  render: (args) => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      <div className="text-center">
        <Spinner {...args} variant="dots" />
        <p className="text-sm text-gray-600 mt-2">Dots</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} variant="pulse" />
        <p className="text-sm text-gray-600 mt-2">Pulse</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} variant="bars" />
        <p className="text-sm text-gray-600 mt-2">Bars</p>
      </div>
      
      <div className="text-center">
        <Spinner {...args} variant="ring" />
        <p className="text-sm text-gray-600 mt-2">Ring</p>
      </div>
    </div>
  ),
  args: {
    size: 'md',
    color: 'primary',
  },
};

// Loading overlay demo
const OverlayDemo = () => {
  const [isLoading, setIsLoading] = useState(false);

  const simulateLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 3000);
  };

  return (
    <div className="relative">
      <div className="p-8 bg-gray-50 rounded-lg min-h-[200px]">
        <h3 className="text-lg font-semibold mb-4">Content Area</h3>
        <p className="text-gray-600 mb-4">
          This is some content that will be covered by a loading overlay when loading is active.
        </p>
        <button
          onClick={simulateLoading}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
        >
          {isLoading ? 'Loading...' : 'Start Loading'}
        </button>
        
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded border">
            <h4 className="font-medium">Card 1</h4>
            <p className="text-sm text-gray-600">Some content here</p>
          </div>
          <div className="p-4 bg-white rounded border">
            <h4 className="font-medium">Card 2</h4>
            <p className="text-sm text-gray-600">More content here</p>
          </div>
        </div>
      </div>
      
      <LoadingOverlay
        isVisible={isLoading}
        message="Loading content..."
        variant="ring"
        size="lg"
      />
    </div>
  );
};

export const LoadingOverlayDemo = {
  render: () => <OverlayDemo />,
  parameters: {
    docs: {
      description: {
        story: 'Demo of the LoadingOverlay component. Click "Start Loading" to see the overlay in action.',
      },
    },
  },
};

// Inline loader examples
export const InlineLoaders = {
  render: () => (
    <div className="space-y-6 p-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Inline Loading States</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <InlineLoader size="sm" />
            <span className="text-sm">Loading small content...</span>
          </div>
          
          <div className="flex items-center gap-3">
            <InlineLoader size="md" color="success" />
            <span>Saving changes...</span>
          </div>
          
          <div className="flex items-center gap-3">
            <InlineLoader size="lg" color="warning" variant="bars" />
            <span className="text-lg">Processing large file...</span>
          </div>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">In Buttons</h4>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md">
            <InlineLoader size="sm" color="secondary" />
            Loading...
          </button>
          
          <button className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-md">
            <InlineLoader size="sm" variant="pulse" color="secondary" />
            Saving
          </button>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">In Cards</h4>
        <div className="p-4 bg-white border rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h5 className="font-medium">Data Processing</h5>
            <InlineLoader size="sm" color="primary" />
          </div>
          <p className="text-sm text-gray-600">
            Your data is being processed. This may take a few moments.
          </p>
        </div>
      </div>
    </div>
  ),
};

// Interactive playground
export const Playground = {
  args: {
    variant: 'dots',
    size: 'md',
    color: 'primary',
  },
};
