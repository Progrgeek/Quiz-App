import React, { useState } from 'react';
import { Button, Card, Input, Badge, Modal } from '../ui';
import { Play, Star, Heart, Check, X } from 'lucide-react';

/**
 * Design System Demo Component
 * Showcases all UI components with various states and configurations
 */
const DesignSystemDemo = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputError, setInputError] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (value.length < 3 && value.length > 0) {
      setInputError('Must be at least 3 characters');
    } else {
      setInputError('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <Card variant="elevated" className="text-center">
          <Card.Header>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Quiz App Design System
            </h1>
            <p className="text-gray-600">
              Professional UI components with accessibility and animations
            </p>
          </Card.Header>
        </Card>

        {/* Button Components */}
        <Card variant="elevated">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Button Components</h2>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* Primary Buttons */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Primary Variants</h3>
                <div className="space-y-2">
                  <Button variant="primary" fullWidth>Primary Button</Button>
                  <Button variant="primary" size="sm" fullWidth>Small Primary</Button>
                  <Button variant="primary" size="lg" fullWidth>Large Primary</Button>
                </div>
              </div>

              {/* Secondary & Outline */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">Secondary & Outline</h3>
                <div className="space-y-2">
                  <Button variant="secondary" fullWidth>Secondary</Button>
                  <Button variant="outline" fullWidth>Outline</Button>
                  <Button variant="ghost" fullWidth>Ghost</Button>
                </div>
              </div>

              {/* States & Icons */}
              <div className="space-y-3">
                <h3 className="font-medium text-gray-700">States & Icons</h3>
                <div className="space-y-2">
                  <Button variant="success" icon={<Check className="w-4 h-4" />} fullWidth>
                    Success
                  </Button>
                  <Button variant="error" icon={<X className="w-4 h-4" />} fullWidth>
                    Error
                  </Button>
                  <Button variant="primary" loading fullWidth>
                    Loading...
                  </Button>
                  <Button variant="outline" disabled fullWidth>
                    Disabled
                  </Button>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Card Components */}
        <Card variant="elevated">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Card Components</h2>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Elevated Card */}
              <Card variant="elevated" exerciseType="multipleChoice">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Multiple Choice</h3>
                    <Badge variant="primary">Active</Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-600 text-sm">
                    This is an elevated card with exercise type styling.
                  </p>
                </Card.Content>
                <Card.Footer>
                  <Button variant="primary" size="sm" fullWidth>
                    Start Exercise
                  </Button>
                </Card.Footer>
              </Card>

              {/* Bordered Card */}
              <Card variant="bordered" exerciseType="dragAndDrop">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Drag & Drop</h3>
                    <Badge variant="success">Completed</Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-600 text-sm">
                    This is a bordered card with progress tracking.
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-success-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </Card.Content>
                <Card.Footer>
                  <Button variant="outline" size="sm" fullWidth>
                    Review
                  </Button>
                </Card.Footer>
              </Card>

              {/* Flat Card */}
              <Card variant="flat" exerciseType="fillInBlanks">
                <Card.Header>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Fill in Blanks</h3>
                    <Badge variant="warning">In Progress</Badge>
                  </div>
                </Card.Header>
                <Card.Content>
                  <p className="text-gray-600 text-sm">
                    This is a flat card without shadows or borders.
                  </p>
                </Card.Content>
                <Card.Footer>
                  <Button variant="ghost" size="sm" fullWidth>
                    Continue
                  </Button>
                </Card.Footer>
              </Card>
            </div>
          </Card.Content>
        </Card>

        {/* Input Components */}
        <Card variant="elevated">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Input Components</h2>
          </Card.Header>
          <Card.Content>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-4">
                <Input
                  label="Basic Input"
                  placeholder="Enter your name"
                  hint="This is a basic input field"
                />
                
                <Input
                  label="With Icon"
                  placeholder="Search exercises..."
                  icon={<Play className="w-4 h-4" />}
                  iconPosition="left"
                />
                
                <Input
                  label="Success State"
                  value="Valid input"
                  success="Great! This looks good."
                />
              </div>

              <div className="space-y-4">
                <Input
                  label="Error State"
                  value={inputValue}
                  onChange={handleInputChange}
                  error={inputError}
                  placeholder="Type at least 3 characters"
                />
                
                <Input
                  label="With Character Count"
                  placeholder="Enter a description"
                  maxLength={100}
                  hint="Maximum 100 characters"
                />
                
                <Input
                  label="Disabled Input"
                  value="Disabled input"
                  disabled
                />
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Badge Components */}
        <Card variant="elevated">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Badge Components</h2>
          </Card.Header>
          <Card.Content>
            <div className="space-y-6">
              
              {/* Default Badges */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Default Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Default</Badge>
                  <Badge variant="primary">Primary</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="success">Success</Badge>
                  <Badge variant="warning">Warning</Badge>
                  <Badge variant="error">Error</Badge>
                  <Badge variant="info">Info</Badge>
                </div>
              </div>

              {/* Solid Badges */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">Solid Variants</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary-solid">Primary</Badge>
                  <Badge variant="success-solid">Success</Badge>
                  <Badge variant="warning-solid">Warning</Badge>
                  <Badge variant="error-solid">Error</Badge>
                </div>
              </div>

              {/* With Icons */}
              <div>
                <h3 className="font-medium text-gray-700 mb-3">With Icons</h3>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="success" icon={<Star className="w-3 h-3" />}>
                    Favorite
                  </Badge>
                  <Badge variant="error" icon={<Heart className="w-3 h-3" />}>
                    Liked
                  </Badge>
                  <Badge variant="primary" pulse icon={<Play className="w-3 h-3" />}>
                    Live
                  </Badge>
                </div>
              </div>
            </div>
          </Card.Content>
        </Card>

        {/* Modal Demo */}
        <Card variant="elevated">
          <Card.Header>
            <h2 className="text-xl font-semibold text-gray-800">Modal Components</h2>
          </Card.Header>
          <Card.Content>
            <div className="flex gap-4">
              <Button variant="primary" onClick={() => setModalOpen(true)}>
                Open Modal
              </Button>
            </div>
          </Card.Content>
        </Card>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Design System Modal"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This is a professional modal component with smooth animations, 
              accessibility features, and responsive design.
            </p>
            
            <div className="flex gap-3">
              <Button variant="primary" onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default DesignSystemDemo;
