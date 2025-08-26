// components/demo/EnhancedDesignSystemDemo.jsx - Phase 2B Design System Integration Demo
import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Badge,
  Alert,
  Spinner,
  Tooltip,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  ToastProvider,
  useToast
} from '../ui/index.js';
import { 
  ThemeProvider, 
  useTheme
} from '../../design-system/theme/ThemeProvider.jsx';
import { tokens } from '../../styles/tokens.js';

const EnhancedDesignSystemDemo = () => {
  return (
    <ThemeProvider defaultTheme="light" respectSystemPreferences enablePersistence>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <DesignSystemContent />
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
};

const DesignSystemContent = () => {
  const { showToast } = useToast();
  
  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🎨 Phase 2B: Enhanced Design System Integration
        </h1>
        <p className="text-lg text-gray-600">
          Comprehensive design system with enhanced theme support, building on existing UI components.
        </p>
      </div>

      {/* Enhanced Theme System */}
      <EnhancedThemeShowcase />
      
      {/* Design Token Integration */}
      <DesignTokenIntegration />
      
      {/* Component Enhancement Examples */}
      <ComponentEnhancements />
      
      {/* Exercise-Specific Design Patterns */}
      <ExerciseDesignPatterns />
      
      {/* Accessibility & Responsive Features */}
      <AccessibilityShowcase />
    </>
  );
};

// Enhanced theme system showcase
const EnhancedThemeShowcase = () => {
  const { theme, setTheme, availableThemes, toggleTheme, isDark, isHighContrast } = useTheme();
  
  return (
    <Card className="mb-8 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">🌓 Enhanced Theme System</h2>
        <p className="text-gray-600">
          Advanced theme management with system preference detection and persistence.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Theme Controls</h3>
          <div className="space-y-3">
            <div className="flex gap-2">
              {availableThemes.map((themeName) => (
                <Button
                  key={themeName}
                  variant={theme === themeName ? 'primary' : 'secondary'}
                  size="sm"
                  onClick={() => setTheme(themeName)}
                >
                  {themeName.charAt(0).toUpperCase() + themeName.slice(1)}
                </Button>
              ))}
            </div>
            
            <Button onClick={toggleTheme} variant="outline">
              Toggle Light/Dark
            </Button>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Theme Status</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Current Theme:</span>
              <Badge variant={isDark ? 'dark' : 'light'}>{theme}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Dark Mode:</span>
              <Badge variant={isDark ? 'success' : 'secondary'}>
                {isDark ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>High Contrast:</span>
              <Badge variant={isHighContrast ? 'warning' : 'secondary'}>
                {isHighContrast ? 'Enabled' : 'Disabled'}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Design token integration showcase
const DesignTokenIntegration = () => {
  return (
    <Card className="mb-8 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">🎨 Design Token Integration</h2>
        <p className="text-gray-600">
          Enhanced design tokens working with existing UI components.
        </p>
      </div>
      
      <Tabs defaultValue="colors">
        <TabsList>
          <TabsTrigger value="colors">Colors</TabsTrigger>
          <TabsTrigger value="typography">Typography</TabsTrigger>
          <TabsTrigger value="spacing">Spacing</TabsTrigger>
          <TabsTrigger value="components">Components</TabsTrigger>
        </TabsList>
        
        <TabsContent value="colors" className="mt-4">
          <ColorTokenShowcase />
        </TabsContent>
        
        <TabsContent value="typography" className="mt-4">
          <TypographyTokenShowcase />
        </TabsContent>
        
        <TabsContent value="spacing" className="mt-4">
          <SpacingTokenShowcase />
        </TabsContent>
        
        <TabsContent value="components" className="mt-4">
          <ComponentTokenShowcase />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

const ColorTokenShowcase = () => {
  const { tokens: designTokens } = useTheme();
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(tokens.colors.base.primary).slice(0, 8).map(([shade, color]) => (
        <div key={shade} className="text-center">
          <div 
            className="w-full h-16 rounded-lg border mb-2"
            style={{ backgroundColor: color }}
          />
          <div className="text-sm">
            <div className="font-medium">{shade}</div>
            <div className="text-gray-500 font-mono text-xs">{color}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const TypographyTokenShowcase = () => {
  return (
    <div className="space-y-4">
      <div style={{ fontSize: tokens.typography.sizes['4xl'], fontWeight: tokens.typography.weights.bold }}>
        Heading 1 - Extra Large
      </div>
      <div style={{ fontSize: tokens.typography.sizes['2xl'], fontWeight: tokens.typography.weights.semibold }}>
        Heading 2 - Large
      </div>
      <div style={{ fontSize: tokens.typography.sizes.lg, fontWeight: tokens.typography.weights.medium }}>
        Subheading - Medium
      </div>
      <div style={{ fontSize: tokens.typography.sizes.base, fontWeight: tokens.typography.weights.normal }}>
        Body text - Regular size and weight for optimal readability.
      </div>
      <div style={{ fontSize: tokens.typography.sizes.sm, fontWeight: tokens.typography.weights.normal }}>
        Caption text - Smaller text for secondary information.
      </div>
    </div>
  );
};

const SpacingTokenShowcase = () => {
  return (
    <div className="space-y-4">
      {Object.entries(tokens.spacing.semantic.component).map(([size, value]) => (
        <div key={size} className="flex items-center space-x-4">
          <div className="w-20 text-sm font-mono">{size}:</div>
          <div 
            className="bg-blue-200 h-4"
            style={{ width: value }}
          />
          <div className="text-sm text-gray-600">{value}</div>
        </div>
      ))}
    </div>
  );
};

const ComponentTokenShowcase = () => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold mb-3">Button Variants</h4>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="outline">Outline</Button>
        </div>
      </div>
      
      <div>
        <h4 className="font-semibold mb-3">Component States</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Alert variant="success">
            Success state with semantic colors
          </Alert>
          <Alert variant="warning">
            Warning state with appropriate styling
          </Alert>
          <Alert variant="error">
            Error state with clear visual feedback
          </Alert>
        </div>
      </div>
    </div>
  );
};

// Component enhancements showcase
const ComponentEnhancements = () => {
  const [inputValue, setInputValue] = useState('');
  
  return (
    <Card className="mb-8 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">⚡ Component Enhancements</h2>
        <p className="text-gray-600">
          Enhanced functionality and styling for existing UI components.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Enhanced Form Components</h3>
          <div className="space-y-4">
            <Input
              label="Enhanced Input"
              placeholder="Type something..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              helperText="This input has enhanced styling and functionality"
            />
            
            <div className="flex gap-2">
              <Button 
                variant="primary" 
                disabled={!inputValue}
                className="flex-1"
              >
                Submit ({inputValue.length} chars)
              </Button>
              <Button 
                variant="outline"
                onClick={() => setInputValue('')}
              >
                Clear
              </Button>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Interactive Components</h3>
          <div className="space-y-4">
            <Tooltip content="This is an enhanced tooltip with better styling">
              <Button variant="outline">Hover for tooltip</Button>
            </Tooltip>
            
            <div className="flex items-center gap-2">
              <Spinner size="sm" />
              <span>Loading state example</span>
            </div>
            
            <div className="flex gap-2">
              <Badge variant="success">New</Badge>
              <Badge variant="warning">Updated</Badge>
              <Badge variant="error">Critical</Badge>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Exercise-specific design patterns
const ExerciseDesignPatterns = () => {
  return (
    <Card className="mb-8 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">🎯 Exercise Design Patterns</h2>
        <p className="text-gray-600">
          Specialized design patterns optimized for different exercise types.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {exercisePatterns.map((pattern) => (
          <ExercisePatternCard key={pattern.id} {...pattern} />
        ))}
      </div>
    </Card>
  );
};

const ExercisePatternCard = ({ title, type, difficulty, description, status }) => {
  const statusColors = {
    active: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    pending: 'bg-gray-100 text-gray-800 border-gray-200'
  };
  
  const difficultyColors = {
    easy: 'bg-green-500',
    medium: 'bg-yellow-500',
    hard: 'bg-red-500'
  };
  
  return (
    <Card className={`border-2 ${statusColors[status]} hover:shadow-lg transition-all`}>
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <div className={`w-3 h-3 rounded-full ${difficultyColors[difficulty]}`} />
        </div>
        <div className="text-sm text-gray-600 mb-2">{type}</div>
        <p className="text-sm">{description}</p>
        <div className="mt-3 flex gap-2">
          <Button size="sm" variant="primary">Start</Button>
          <Button size="sm" variant="outline">Preview</Button>
        </div>
      </div>
    </Card>
  );
};

// Accessibility showcase
const AccessibilityShowcase = () => {
  return (
    <Card className="mb-8 p-6">
      <div className="mb-4">
        <h2 className="text-2xl font-bold mb-2">♿ Accessibility & Responsive Features</h2>
        <p className="text-gray-600">
          Built-in accessibility features and responsive design patterns.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-3">Accessibility Features</h3>
          <div className="space-y-3">
            <Alert variant="info">
              All components include proper ARIA labels and keyboard navigation
            </Alert>
            <div className="flex flex-wrap gap-2">
              <Button aria-label="Accessible button with clear label">
                Keyboard Accessible
              </Button>
              <Button disabled aria-label="Disabled button example">
                Disabled State
              </Button>
            </div>
            <p className="text-sm text-gray-600">
              Try navigating with Tab key and screen readers for full accessibility support.
            </p>
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-3">Responsive Design</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <Button className="w-full">Mobile Friendly</Button>
              <Button className="w-full" variant="outline">Touch Optimized</Button>
            </div>
            <Alert variant="success">
              Components automatically adapt to different screen sizes and input methods
            </Alert>
          </div>
        </div>
      </div>
    </Card>
  );
};

// Sample exercise data
const exercisePatterns = [
  {
    id: 1,
    title: "Drag & Drop",
    type: "Interactive",
    difficulty: "easy",
    description: "Drag items to correct positions with visual feedback",
    status: "active"
  },
  {
    id: 2,
    title: "Multiple Choice",
    type: "Selection",
    difficulty: "medium",
    description: "Choose from multiple options with clear validation",
    status: "completed"
  },
  {
    id: 3,
    title: "Fill in Blanks",
    type: "Input",
    difficulty: "hard",
    description: "Type correct answers in designated spaces",
    status: "pending"
  },
  {
    id: 4,
    title: "Sequencing",
    type: "Ordering",
    difficulty: "medium",
    description: "Arrange items in correct chronological order",
    status: "active"
  },
  {
    id: 5,
    title: "Matching",
    type: "Connection",
    difficulty: "easy",
    description: "Connect related items with visual connections",
    status: "pending"
  },
  {
    id: 6,
    title: "Highlight Text",
    type: "Selection",
    difficulty: "medium",
    description: "Select and highlight specific text segments",
    status: "completed"
  }
];

export default EnhancedDesignSystemDemo;
