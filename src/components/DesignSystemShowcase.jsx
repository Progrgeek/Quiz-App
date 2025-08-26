import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Button, 
  Card, 
  Input, 
  Badge, 
  Modal 
} from './ui';
import { 
  ExerciseWrapper, 
  FeedbackDisplay, 
  ExampleSection 
} from './shared';
import Stats from './Stats';
import { 
  Play, 
  Settings, 
  BookOpen, 
  Award,
  Users,
  Clock,
  Target
} from 'lucide-react';

/**
 * Design System Demo Component
 * Showcases all enhanced components working together
 */
const DesignSystemShowcase = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [selectedCard, setSelectedCard] = useState(null);

  const demoStats = {
    questionNumber: 7,
    totalQuestions: 10,
    timeElapsed: 245, // 4:05
    score: 75
  };

  const exerciseTypes = [
    { type: 'multipleChoice', label: 'Multiple Choice', icon: Target, color: 'primary' },
    { type: 'dragAndDrop', label: 'Drag & Drop', icon: Users, color: 'secondary' },
    { type: 'fillBlanks', label: 'Fill Blanks', icon: BookOpen, color: 'success' },
    { type: 'highlight', label: 'Highlight', icon: Award, color: 'warning' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            🎨 Design System Showcase
          </h1>
          <p className="text-lg text-gray-600">
            Professional UI components with accessibility and animations
          </p>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column - Exercise Demo */}
          <div className="lg:col-span-2">
            <ExerciseWrapper
              title="Design System Demo Exercise"
              instructions="Explore our enhanced UI components and design system"
              exerciseType="multipleChoice"
              progress={70}
              isCompleted={false}
            >
              {/* Exercise Type Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {exerciseTypes.map((exercise, index) => {
                  const IconComponent = exercise.icon;
                  return (
                    <motion.div
                      key={exercise.type}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        variant="elevated"
                        exerciseType={exercise.type}
                        className={`cursor-pointer transition-all duration-200 ${
                          selectedCard === exercise.type 
                            ? 'ring-2 ring-primary-500 scale-[1.02]' 
                            : 'hover:scale-[1.01]'
                        }`}
                        onClick={() => setSelectedCard(exercise.type)}
                      >
                        <Card.Header className="bg-gradient-to-r from-gray-50 to-gray-100">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-6 h-6 text-primary-500" />
                              <h3 className="font-semibold text-gray-800">
                                {exercise.label}
                              </h3>
                            </div>
                            <Badge variant={exercise.color} size="sm">
                              New
                            </Badge>
                          </div>
                        </Card.Header>
                        
                        <Card.Content>
                          <p className="text-gray-600 text-sm">
                            Experience the enhanced {exercise.label.toLowerCase()} component
                            with smooth animations and professional styling.
                          </p>
                        </Card.Content>
                        
                        <Card.Footer>
                          <Button
                            variant="outline"
                            size="sm"
                            fullWidth
                            icon={<Play className="w-4 h-4" />}
                          >
                            Try Exercise
                          </Button>
                        </Card.Footer>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

              {/* Input Demo */}
              <div className="mb-6">
                <Input
                  label="Try our enhanced input component"
                  placeholder="Type something here..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  hint="This input has validation states, icons, and smooth animations"
                  success={inputValue.length > 10 ? "Great! Your input looks good." : undefined}
                  icon={<BookOpen className="w-4 h-4" />}
                  maxLength={50}
                />
              </div>

              {/* Example Section Demo */}
              <ExampleSection
                title="Example: How to use components"
                content={
                  <div className="space-y-4">
                    <p className="text-gray-700">
                      Our design system provides consistent, accessible, and beautiful
                      components that work together seamlessly.
                    </p>
                    <div className="bg-gray-100 p-4 rounded-lg">
                      <code className="text-sm text-gray-800">
                        &lt;Button variant="primary" size="lg"&gt;Click me&lt;/Button&gt;
                      </code>
                    </div>
                  </div>
                }
                isVisible={showExample}
                onToggle={() => setShowExample(!showExample)}
                variant="highlighted"
                exerciseType="general"
              />

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => setShowFeedback(true)}
                  icon={<Award className="w-5 h-5" />}
                >
                  Show Success Feedback
                </Button>
                
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => setShowModal(true)}
                  icon={<Settings className="w-5 h-5" />}
                >
                  Open Modal Demo
                </Button>
              </div>
            </ExerciseWrapper>
          </div>

          {/* Right Column - Stats */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Stats {...demoStats} />
            </motion.div>

            {/* Additional Info Card */}
            <motion.div
              className="mt-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card variant="elevated">
                <Card.Header>
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-500" />
                    Phase 3 Status
                  </h3>
                </Card.Header>
                
                <Card.Content>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Components</span>
                      <Badge variant="success">5/5 Complete</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Design Tokens</span>
                      <Badge variant="success">200+ Active</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Accessibility</span>
                      <Badge variant="success">WCAG 2.1 AA</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Performance</span>
                      <Badge variant="success">60fps</Badge>
                    </div>
                  </div>
                </Card.Content>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Feedback Display */}
        <FeedbackDisplay
          type="success"
          title="Amazing!"
          message="You've successfully explored our enhanced design system. All components are working beautifully together!"
          isVisible={showFeedback}
          onClose={() => setShowFeedback(false)}
          position="top-center"
          actions={[
            {
              label: "Continue Exploring",
              onClick: () => setShowFeedback(false),
              variant: "primary"
            }
          ]}
        />

        {/* Modal Demo */}
        <Modal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          title="Design System Modal"
          size="md"
        >
          <div className="space-y-4">
            <p className="text-gray-700">
              This modal demonstrates our enhanced UI components working together
              with smooth animations and perfect accessibility.
            </p>
            
            <div className="grid grid-cols-3 gap-2">
              <Badge variant="primary">Primary</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
            </div>
            
            <Input
              label="Modal Input Example"
              placeholder="Type here..."
              hint="Inputs work perfectly inside modals too!"
            />
            
            <div className="flex gap-3 pt-4">
              <Button variant="primary" fullWidth>
                Confirm
              </Button>
              <Button 
                variant="outline" 
                fullWidth
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default DesignSystemShowcase;
