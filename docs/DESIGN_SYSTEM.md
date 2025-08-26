# Quiz App Design System

A comprehensive design system for the Quiz App featuring consistent styling, accessibility, and professional animations.

## Overview

This design system provides a cohesive visual language and interaction patterns across the entire application. It includes design tokens, UI components, and guidelines for consistent implementation.

## Design Tokens

Our design system is built on a foundation of design tokens defined in `src/styles/tokens.js`:

### Color System
- **Primary Colors**: Blue palette for main actions and branding
- **Secondary Colors**: Purple palette for supporting actions
- **Semantic Colors**: Success (green), warning (yellow), error (red), info (blue)
- **Exercise Type Colors**: Unique colors for different exercise types
- **Neutral Colors**: Comprehensive gray scale for text and backgrounds

### Typography
- **Font Family**: Inter (system fallback)
- **Font Sizes**: 12px to 48px scale
- **Font Weights**: Light (300) to Bold (700)
- **Line Heights**: Optimized for readability

### Spacing & Sizing
- **Spacing Scale**: 4px base unit (0.25rem to 20rem)
- **Component Heights**: Consistent input and button heights
- **Border Radius**: Subtle rounded corners for modern feel

## UI Components

### Button Component (`src/components/ui/Button.jsx`)

**Variants:**
- `primary` - Main action buttons
- `secondary` - Secondary actions
- `outline` - Subtle actions
- `ghost` - Minimal actions
- `link` - Text-only actions
- `success` - Positive actions
- `error` - Destructive actions

**Sizes:** `sm`, `md`, `lg`

**Features:**
- Loading states with spinner
- Icon support (left/right)
- Full width option
- Accessibility compliant
- Smooth animations

**Usage:**
```jsx
import { Button } from '../ui';

<Button variant="primary" size="md" loading={isLoading}>
  Submit Answer
</Button>
```

### Card Component (`src/components/ui/Card.jsx`)

**Variants:**
- `elevated` - Subtle shadow
- `bordered` - Border only
- `flat` - No shadow or border

**Features:**
- Progress bar support
- Status indicators
- Header and footer sections
- Hover animations
- Exercise type styling

**Usage:**
```jsx
import { Card } from '../ui';

<Card variant="elevated" exerciseType="multipleChoice">
  <Card.Header>
    <h3>Exercise Title</h3>
  </Card.Header>
  <Card.Content>
    Exercise content here
  </Card.Content>
  <Card.Footer>
    <Button>Continue</Button>
  </Card.Footer>
</Card>
```

### Input Component (`src/components/ui/Input.jsx`)

**Features:**
- Validation states (error, success)
- Icon support
- Character counting
- Accessibility labels
- Focus animations

**Usage:**
```jsx
import { Input } from '../ui';

<Input
  label="Your Answer"
  placeholder="Type your answer here"
  value={answer}
  onChange={setAnswer}
  error={validationError}
  required
/>
```

### Badge Component (`src/components/ui/Badge.jsx`)

**Variants:**
- `default`, `primary`, `secondary`, `success`, `warning`, `error`, `info`
- Solid variants: `primary-solid`, `success-solid`, etc.
- Outline variants: `primary-outline`, `success-outline`, etc.

**Features:**
- Removable badges
- Icon support
- Pulse animation
- Multiple sizes

**Usage:**
```jsx
import { Badge } from '../ui';

<Badge variant="success" icon={checkIcon}>
  Completed
</Badge>
```

### Modal Component (`src/components/ui/Modal.jsx`)

**Features:**
- Smooth enter/exit animations
- Backdrop click to close
- Escape key handling
- Multiple sizes
- Accessibility focus management

**Usage:**
```jsx
import { Modal } from '../ui';

<Modal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  title="Exercise Instructions"
  size="md"
>
  <p>Instructions content here...</p>
</Modal>
```

## Animation System

All components use Framer Motion for smooth, performant animations:

- **Micro-interactions**: Hover, focus, and click states
- **State transitions**: Loading, success, error states
- **Layout animations**: Enter/exit animations for modals and overlays
- **Progress indicators**: Smooth progress bar animations

## Accessibility Features

### WCAG 2.1 AA Compliance
- **Color Contrast**: All text meets minimum contrast ratios
- **Keyboard Navigation**: All interactive elements are keyboard accessible
- **Screen Readers**: Proper ARIA labels and descriptions
- **Focus Management**: Visible focus indicators and logical tab order

### Implementation Details
- Semantic HTML elements
- ARIA attributes for complex interactions
- Focus trapping in modals
- Reduced motion support

## Responsive Design

### Breakpoints
- `sm`: 640px and up
- `md`: 768px and up
- `lg`: 1024px and up
- `xl`: 1280px and up

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement for larger screens.

## Usage Guidelines

### Component Composition
Build complex interfaces by composing simple components:

```jsx
function ExerciseCard({ exercise }) {
  return (
    <Card variant="elevated" exerciseType={exercise.type}>
      <Card.Header>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{exercise.title}</h3>
          <Badge variant="primary">{exercise.type}</Badge>
        </div>
      </Card.Header>
      
      <Card.Content>
        <p className="text-gray-600 mb-4">{exercise.description}</p>
        
        <div className="space-y-3">
          {exercise.questions.map((question, index) => (
            <Input
              key={index}
              label={`Question ${index + 1}`}
              value={answers[index]}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
            />
          ))}
        </div>
      </Card.Content>
      
      <Card.Footer>
        <div className="flex gap-3">
          <Button variant="outline" fullWidth>
            Skip
          </Button>
          <Button variant="primary" fullWidth>
            Submit
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
}
```

### Design Token Usage
Use design tokens for custom styling:

```jsx
import { designTokens } from '../styles/tokens';

const customStyles = {
  backgroundColor: designTokens.colors.exercise.multipleChoice.primary,
  borderRadius: designTokens.borderRadius.md,
  padding: designTokens.spacing.md
};
```

## Integration with Existing Components

The design system is designed to integrate seamlessly with existing exercise components:

1. **Gradual Migration**: Replace existing styling gradually
2. **Consistent Patterns**: Apply design tokens to existing components
3. **Enhanced Accessibility**: Add accessibility features to current components
4. **Improved Animations**: Replace CSS transitions with Framer Motion

## Next Steps

1. **Update Exercise Components**: Apply design system to existing exercise components
2. **Create Component Variants**: Add exercise-specific variants
3. **Documentation Examples**: Create interactive component documentation
4. **Testing**: Add visual regression testing for components

## Resources

- **Design Tokens**: `src/styles/tokens.js`
- **Components**: `src/components/ui/`
- **Tailwind Config**: Extended with design system tokens
- **Animation Library**: Framer Motion for all animations
