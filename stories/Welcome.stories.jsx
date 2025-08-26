import React from 'react';
import Button from '../src/components/ui/Button.jsx';
import Card from '../src/components/ui/Card.jsx';
import Badge from '../src/components/ui/Badge.jsx';
import Alert from '../src/components/ui/Alert.jsx';

export default {
  title: 'Welcome/Component Library Overview',
  parameters: {
    layout: 'fullscreen',
  },
};

export const WelcomeShowcase = {
  render: () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Professional Quiz Component Library
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Enterprise-grade, accessible, and beautifully animated React components 
            designed specifically for educational applications and quiz platforms.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-8">
            <Badge variant="success" size="lg">✅ Production Ready</Badge>
            <Badge variant="primary" size="lg">🚀 15 Components</Badge>
            <Badge variant="secondary" size="lg">♿ WCAG 2.1 AA</Badge>
            <Badge variant="warning" size="lg">⚡ Framer Motion</Badge>
          </div>
          
          <Alert type="success" className="max-w-2xl mx-auto">
            <strong>Phase 1 Complete!</strong> All core UI components have been implemented 
            with professional quality, comprehensive testing, and full documentation.
          </Alert>
        </div>

        {/* Component Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Feedback Components */}
          <Card variant="elevated">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                  💬
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Feedback Components</h3>
                  <p className="text-gray-600">User interaction & notifications</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Toast Notifications</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Alert System</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Spinner/Loading</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tooltip System</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Form Components */}
          <Card variant="elevated">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                  📝
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Form Components</h3>
                  <p className="text-gray-600">Input & data collection</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Enhanced Button</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Input Component</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Select/Dropdown</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Checkbox & Radio</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
              </div>
            </div>
          </Card>

          {/* Layout Components */}
          <Card variant="elevated">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center text-2xl mr-4">
                  🎨
                </div>
                <div>
                  <h3 className="text-xl font-semibold">Layout Components</h3>
                  <p className="text-gray-600">Structure & navigation</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Card Component</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Modal Dialog</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Tabs Navigation</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pagination</span>
                  <Badge variant="success" size="sm">✓</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Technical Excellence */}
        <Card variant="quiz" className="mb-12">
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">Technical Excellence</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">Architecture</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• TypeScript-ready with PropTypes</li>
                  <li>• Context patterns for state management</li>
                  <li>• Compound component patterns</li>
                  <li>• Performance optimized</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-green-600">Quality Assurance</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Comprehensive Storybook documentation</li>
                  <li>• Vitest + Playwright testing</li>
                  <li>• Accessibility testing integration</li>
                  <li>• Error boundary patterns</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 text-purple-600">Developer Experience</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>• Clear component API design</li>
                  <li>• Comprehensive prop documentation</li>
                  <li>• Usage examples and patterns</li>
                  <li>• Consistent naming conventions</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4">
            <Button variant="primary" size="lg">
              Explore Components
            </Button>
            <Button variant="secondary" size="lg">
              View Documentation
            </Button>
            <Button variant="ghost" size="lg">
              GitHub Repository
            </Button>
          </div>
        </div>
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Complete overview of the professional quiz component library showcasing all features and capabilities.',
      },
    },
  },
};
