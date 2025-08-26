// components/demo/DesignSystemDemo.jsx - Enhanced design system showcase using existing UI
import React, { useState } from 'react';
import {
  ThemeProvider,
  useTheme,
  Button,
  Card,
  Input,
  Badge,
  Modal,
  Toast,
  ToastProvider,
  useToast,
  Spinner,
  Alert,
  Select,
  Checkbox,
  Radio,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  tokens as existingTokens
} from '../ui/index.js';
import {
  ThemeProvider as EnhancedThemeProvider,
  useTheme as useEnhancedTheme,
  tokens
} from '../../design-system/index.js';

const DesignSystemDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Quiz App Design System
          </h1>
          <p className="text-lg text-gray-600">
            Comprehensive design system with theme support, accessibility features, and consistent components.
          </p>
        </div>

        {/* Theme Switcher */}
        <ThemeSwitcher />
        
        {/* Design Tokens Preview */}
        <DesignTokensPreview />
        
        {/* Button Components */}
        <ButtonShowcase />
        
        {/* Input Components */}
        <InputShowcase />
        
        {/* Card Components */}
        <CardShowcase />
        
        {/* Exercise Components */}
        <ExerciseShowcase />
      </div>
    </div>
  );
};

// Theme switcher component
const ThemeSwitcher = () => {
  const { theme, setTheme, availableThemes, toggleTheme } = useTheme();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Theme System</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">Current theme: <strong>{theme}</strong></p>
            <ButtonGroup>
              {availableThemes.map((themeName) => (
                <Button
                  key={themeName}
                  variant={theme === themeName ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(themeName)}
                >
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </Button>
              ))}
            </ButtonGroup>
          </div>
          <div>
            <Button onClick={toggleTheme} variant="secondary">
              Toggle Light/Dark
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Design tokens preview
const DesignTokensPreview = () => {
  const { tokens: designTokens } = useTheme();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Design Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Colors */}
          <div>
            <h4 className="font-semibold mb-3">Colors</h4>
            <div className="space-y-2">
              {Object.entries(tokens.colors.base.primary).slice(0, 5).map(([shade, color]) => (
                <div key={shade} className="flex items-center space-x-2">
                  <div 
                    className="w-6 h-6 rounded border"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm">{shade}: {color}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Typography */}
          <div>
            <h4 className="font-semibold mb-3">Typography</h4>
            <div className="space-y-2">
              {Object.entries(tokens.typography.sizes).slice(0, 5).map(([size, value]) => (
                <div key={size} className="text-sm">
                  <span className="font-mono">{size}: {value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Spacing */}
          <div>
            <h4 className="font-semibold mb-3">Spacing</h4>
            <div className="space-y-2">
              {Object.entries(tokens.spacing.spacing).slice(0, 5).map(([size, value]) => (
                <div key={size} className="flex items-center space-x-2">
                  <div 
                    className="bg-blue-200 h-4"
                    style={{ width: value }}
                  />
                  <span className="text-sm font-mono">{size}: {value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Button showcase
const ButtonShowcase = () => {
  const [loading, setLoading] = useState({});
  
  const handleLoadingDemo = (buttonId) => {
    setLoading(prev => ({ ...prev, [buttonId]: true }));
    setTimeout(() => {
      setLoading(prev => ({ ...prev, [buttonId]: false }));
    }, 2000);
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Button Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Button Variants */}
          <div>
            <h4 className="font-semibold mb-3">Variants</h4>
            <div className="flex flex-wrap gap-2">
              {['primary', 'secondary', 'success', 'warning', 'error', 'outline', 'ghost'].map((variant) => (
                <Button key={variant} variant={variant}>
                  {variant.charAt(0).toUpperCase() + variant.slice(1)}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Button Sizes */}
          <div>
            <h4 className="font-semibold mb-3">Sizes</h4>
            <div className="flex flex-wrap items-center gap-2">
              {['sm', 'md', 'lg', 'xl'].map((size) => (
                <Button key={size} size={size}>
                  Size {size}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Button States */}
          <div>
            <h4 className="font-semibold mb-3">States</h4>
            <div className="flex flex-wrap gap-2">
              <Button>Normal</Button>
              <Button disabled>Disabled</Button>
              <Button 
                loading={loading.demo1}
                onClick={() => handleLoadingDemo('demo1')}
              >
                Loading Demo
              </Button>
              <Button leftIcon="📍">With Icon</Button>
              <Button rightIcon="→">With Right Icon</Button>
            </div>
          </div>
          
          {/* Button Group */}
          <div>
            <h4 className="font-semibold mb-3">Button Groups</h4>
            <div className="space-y-3">
              <ButtonGroup attached>
                <Button>One</Button>
                <Button>Two</Button>
                <Button>Three</Button>
              </ButtonGroup>
              
              <ButtonGroup orientation="vertical">
                <Button>Vertical</Button>
                <Button>Button</Button>
                <Button>Group</Button>
              </ButtonGroup>
            </div>
          </div>
          
          {/* Icon Buttons */}
          <div>
            <h4 className="font-semibold mb-3">Icon Buttons</h4>
            <div className="flex gap-2">
              <IconButton icon="⚙️" aria-label="Settings" />
              <IconButton icon="❤️" aria-label="Like" variant="error" />
              <IconButton icon="📱" aria-label="Mobile" variant="outline" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Input showcase
const InputShowcase = () => {
  const [inputValues, setInputValues] = useState({
    text: '',
    email: '',
    password: '',
    textarea: ''
  });
  
  const handleInputChange = (name, value) => {
    setInputValues(prev => ({ ...prev, [name]: value }));
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Input Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Text Input"
              placeholder="Enter some text"
              value={inputValues.text}
              onChange={(e) => handleInputChange('text', e.target.value)}
              helperText="This is a helper text"
            />
            
            <Input
              label="Email Input"
              type="email"
              placeholder="your@email.com"
              value={inputValues.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              leftIcon="📧"
              success={inputValues.email.includes('@')}
              successText="Valid email format"
            />
            
            <Input
              label="Password Input"
              type="password"
              placeholder="Enter password"
              value={inputValues.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={inputValues.password.length > 0 && inputValues.password.length < 6}
              errorText="Password must be at least 6 characters"
              rightIcon="👁️"
            />
            
            <Input
              label="Large Input"
              size="lg"
              placeholder="Large size input"
            />
          </div>
          
          <div className="space-y-4">
            <Input
              label="Small Input"
              size="sm"
              placeholder="Small size input"
            />
            
            <Input
              label="Disabled Input"
              placeholder="This is disabled"
              disabled
              value="Disabled value"
            />
            
            <Input
              label="Read-only Input"
              value="Read-only value"
              readOnly
            />
            
            <Textarea
              label="Textarea"
              placeholder="Enter multiple lines of text"
              rows={4}
              value={inputValues.textarea}
              onChange={(e) => handleInputChange('textarea', e.target.value)}
              helperText="Supports multiple lines"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Card showcase
const CardShowcase = () => {
  const [cardStates, setCardStates] = useState({
    interactive: false,
    loading: false
  });
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Card Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Default Card */}
          <Card>
            <CardHeader>
              <CardTitle level={4}>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              This is a default card with standard styling and content.
            </CardContent>
            <CardFooter>
              <CardActions>
                <Button size="sm" variant="outline">Action</Button>
              </CardActions>
            </CardFooter>
          </Card>
          
          {/* Elevated Card */}
          <Card variant="elevated">
            <CardHeader>
              <CardTitle level={4}>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              This card has an elevated shadow for more prominence.
            </CardContent>
          </Card>
          
          {/* Success Card */}
          <Card variant="success">
            <CardHeader>
              <CardTitle level={4}>Success Card</CardTitle>
            </CardHeader>
            <CardContent>
              This card indicates a successful state or positive feedback.
            </CardContent>
          </Card>
          
          {/* Interactive Card */}
          <Card 
            interactive
            onClick={() => setCardStates(prev => ({ ...prev, interactive: !prev.interactive }))}
          >
            <CardHeader>
              <CardTitle level={4}>Interactive Card</CardTitle>
            </CardHeader>
            <CardContent>
              Click me! State: {cardStates.interactive ? 'Clicked' : 'Not clicked'}
            </CardContent>
          </Card>
          
          {/* Loading Card */}
          <Card loading={cardStates.loading}>
            <CardHeader>
              <CardTitle level={4}>Loading Card</CardTitle>
            </CardHeader>
            <CardContent>
              This card can show a loading state.
            </CardContent>
            <CardFooter>
              <CardActions>
                <Button 
                  size="sm"
                  onClick={() => setCardStates(prev => ({ 
                    ...prev, 
                    loading: !prev.loading 
                  }))}
                >
                  Toggle Loading
                </Button>
              </CardActions>
            </CardFooter>
          </Card>
          
          {/* Large Card */}
          <Card size="lg" variant="outlined">
            <CardHeader>
              <CardTitle level={4}>Large Outlined Card</CardTitle>
            </CardHeader>
            <CardContent>
              This is a large card with outlined variant styling.
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

// Exercise showcase
const ExerciseShowcase = () => {
  const [exerciseProgress, setExerciseProgress] = useState({});
  
  const handleProgressUpdate = (exerciseId) => {
    setExerciseProgress(prev => ({
      ...prev,
      [exerciseId]: Math.min((prev[exerciseId] || 0) + 0.25, 1)
    }));
  };
  
  const exerciseData = [
    {
      id: 'drag-drop',
      title: 'Drag and Drop',
      description: 'Interactive drag and drop exercise for learning',
      type: 'dragAndDrop',
      difficulty: 'easy',
      status: 'active'
    },
    {
      id: 'multiple-choice',
      title: 'Multiple Choice',
      description: 'Choose the correct answer from multiple options',
      type: 'multipleChoice',
      difficulty: 'medium',
      status: 'completed'
    },
    {
      id: 'fill-blanks',
      title: 'Fill in the Blanks',
      description: 'Complete the sentences by filling in missing words',
      type: 'fillInTheBlanks',
      difficulty: 'hard',
      status: 'pending'
    }
  ];
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Exercise Components</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exerciseData.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              title={exercise.title}
              description={exercise.description}
              type={exercise.type}
              difficulty={exercise.difficulty}
              status={exercise.status}
              progress={exerciseProgress[exercise.id] || 0}
              actions={
                <>
                  <Button 
                    size="sm" 
                    variant="primary"
                    onClick={() => handleProgressUpdate(exercise.id)}
                  >
                    Start
                  </Button>
                  <Button size="sm" variant="outline">
                    Preview
                  </Button>
                </>
              }
              onClick={() => console.log(`Clicked exercise: ${exercise.title}`)}
            >
              <div className="text-sm text-gray-600">
                Additional exercise content can go here, such as learning objectives, 
                estimated time, or other metadata.
              </div>
            </ExerciseCard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default DesignSystemDemo;
