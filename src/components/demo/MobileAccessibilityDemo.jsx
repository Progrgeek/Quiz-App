import React, { useState } from 'react';
import { AccessibilityProvider, useAccessibility } from '../../accessibility/AccessibilityProvider';
import { MobileProvider, useMobile } from '../../mobile/MobileProvider';
import { useTheme } from '../../design-system/theme/ThemeProvider';
import AccessibleButton from '../accessible/AccessibleButton';
import AccessibleInput from '../accessible/AccessibleInput';

const MobileAccessibilityDemo = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const { 
    reducedMotion, 
    highContrast, 
    largeText, 
    setReducedMotion, 
    setHighContrast, 
    setLargeText,
    announceToScreenReader 
  } = useAccessibility();

  const { 
    isMobile, 
    isTablet, 
    isDesktop, 
    orientation, 
    touchSupport, 
    viewport 
  } = useMobile();

  const { theme, setTheme, isDark } = useTheme();

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setShowSuccess(true);
      announceToScreenReader('Form submitted successfully!', 'assertive');
      setTimeout(() => setShowSuccess(false), 3000);
    } else {
      announceToScreenReader(`Form has ${Object.keys(newErrors).length} errors`, 'assertive');
    }
  };

  const handleInputChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 safe-area-all">
      {/* Skip Link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Header */}
      <header className="bg-white shadow-sm border-b safe-area-top" role="banner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold text-gray-900">
              Mobile & Accessibility Demo
            </h1>
            <nav aria-label="Theme controls">
              <div className="flex gap-2">
                <AccessibleButton
                  variant="outline"
                  size="small"
                  onClick={() => setTheme(isDark ? 'light' : 'dark')}
                  ariaLabel={`Switch to ${isDark ? 'light' : 'dark'} theme`}
                >
                  {isDark ? '☀️' : '🌙'}
                </AccessibleButton>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="max-w-4xl mx-auto p-4 space-y-8" role="main">
        
        {/* Device Information */}
        <section aria-labelledby="device-info-heading" className="mobile-card">
          <h2 id="device-info-heading" className="responsive-heading">
            Device Information
          </h2>
          <div className="responsive-grid">
            <div className="status-indicator info">
              <span>Device Type:</span>
              <strong>
                {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'}
              </strong>
            </div>
            <div className="status-indicator info">
              <span>Orientation:</span>
              <strong>{orientation}</strong>
            </div>
            <div className="status-indicator info">
              <span>Touch Support:</span>
              <strong>{touchSupport ? 'Yes' : 'No'}</strong>
            </div>
            <div className="status-indicator info">
              <span>Viewport:</span>
              <strong>{viewport.width} × {viewport.height}</strong>
            </div>
          </div>
        </section>

        {/* Accessibility Controls */}
        <section aria-labelledby="accessibility-heading" className="mobile-card">
          <h2 id="accessibility-heading" className="responsive-heading">
            Accessibility Controls
          </h2>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-4">
              <AccessibleButton
                variant={reducedMotion ? 'primary' : 'outline'}
                onClick={() => setReducedMotion(!reducedMotion)}
                ariaPressed={reducedMotion}
                ariaLabel="Toggle reduced motion"
              >
                {reducedMotion ? '✓' : ''} Reduced Motion
              </AccessibleButton>
              
              <AccessibleButton
                variant={highContrast ? 'primary' : 'outline'}
                onClick={() => setHighContrast(!highContrast)}
                ariaPressed={highContrast}
                ariaLabel="Toggle high contrast mode"
              >
                {highContrast ? '✓' : ''} High Contrast
              </AccessibleButton>
              
              <AccessibleButton
                variant={largeText ? 'primary' : 'outline'}
                onClick={() => setLargeText(!largeText)}
                ariaPressed={largeText}
                ariaLabel="Toggle large text"
              >
                {largeText ? '✓' : ''} Large Text
              </AccessibleButton>
            </div>
            
            <div className="text-sm text-gray-600">
              <p>These controls demonstrate real-time accessibility adjustments. Changes apply immediately throughout the interface.</p>
            </div>
          </div>
        </section>

        {/* Interactive Form Demo */}
        <section aria-labelledby="form-heading" className="mobile-card">
          <h2 id="form-heading" className="responsive-heading">
            Accessible Form Demo
          </h2>
          
          {showSuccess && (
            <div 
              className="mobile-success mb-4"
              role="alert"
              aria-live="assertive"
            >
              ✅ Form submitted successfully!
            </div>
          )}
          
          <form onSubmit={handleFormSubmit} className="mobile-form" noValidate>
            <AccessibleInput
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleInputChange('name')}
              error={errors.name}
              required
              placeholder="Enter your full name"
              helperText="Your name will be used for identification"
            />
            
            <AccessibleInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleInputChange('email')}
              error={errors.email}
              required
              placeholder="Enter your email address"
              helperText="We'll never share your email"
            />
            
            <div className="mobile-form-group">
              <label 
                htmlFor="message"
                className="mobile-form-label block text-sm font-semibold mb-2 text-gray-700"
              >
                Message <span className="text-red-500">*</span>
                <span className="sr-only">(required)</span>
              </label>
              <textarea
                id="message"
                value={formData.message}
                onChange={handleInputChange('message')}
                className={`
                  mobile-form-input resize-none
                  ${errors.message 
                    ? 'border-red-500 bg-red-50 text-red-900' 
                    : 'border-gray-300 bg-white text-gray-900'
                  }
                `}
                rows={4}
                placeholder="Enter your message"
                required
                aria-invalid={errors.message ? 'true' : 'false'}
                aria-describedby={errors.message ? 'message-error' : undefined}
              />
              {errors.message && (
                <div 
                  id="message-error"
                  className="mt-2 text-sm text-red-600"
                  role="alert"
                >
                  {errors.message}
                </div>
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <AccessibleButton
                type="submit"
                variant="primary"
                size="large"
                ariaLabel="Submit contact form"
              >
                Submit Form
              </AccessibleButton>
              
              <AccessibleButton
                type="button"
                variant="outline"
                size="large"
                onClick={() => {
                  setFormData({ name: '', email: '', message: '' });
                  setErrors({});
                  announceToScreenReader('Form cleared');
                }}
                ariaLabel="Clear form fields"
              >
                Clear Form
              </AccessibleButton>
            </div>
          </form>
        </section>

        {/* Touch Interaction Demo */}
        <section aria-labelledby="touch-heading" className="mobile-card">
          <h2 id="touch-heading" className="responsive-heading">
            Touch & Gesture Demo
          </h2>
          
          <div className="space-y-4">
            <p className="text-gray-600">
              {touchSupport 
                ? 'Touch interactions are available. Try tapping the buttons below.'
                : 'No touch support detected. Use mouse or keyboard to interact.'
              }
            </p>
            
            <div className="responsive-grid">
              <AccessibleButton
                variant="primary"
                onClick={() => announceToScreenReader('Primary action triggered')}
                ariaLabel="Primary touch action"
              >
                Touch Action 1
              </AccessibleButton>
              
              <AccessibleButton
                variant="secondary"
                onClick={() => announceToScreenReader('Secondary action triggered')}
                ariaLabel="Secondary touch action"
              >
                Touch Action 2
              </AccessibleButton>
              
              <AccessibleButton
                variant="success"
                onClick={() => announceToScreenReader('Success action triggered')}
                ariaLabel="Success touch action"
              >
                Touch Action 3
              </AccessibleButton>
            </div>
          </div>
        </section>

        {/* Responsive Layout Demo */}
        <section aria-labelledby="layout-heading" className="mobile-card">
          <h2 id="layout-heading" className="responsive-heading">
            Responsive Layout Demo
          </h2>
          
          <div className="responsive-grid">
            {[1, 2, 3, 4, 5, 6].map(num => (
              <div 
                key={num}
                className="bg-gray-100 p-4 rounded-lg text-center touch-friendly"
                role="gridcell"
                tabIndex={0}
              >
                <div className="font-semibold text-gray-800">Item {num}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {isMobile ? 'Mobile' : isTablet ? 'Tablet' : 'Desktop'} View
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Keyboard Navigation Test */}
        <section aria-labelledby="keyboard-heading" className="mobile-card">
          <h2 id="keyboard-heading" className="responsive-heading">
            Keyboard Navigation Test
          </h2>
          
          <p className="text-gray-600 mb-4">
            Use Tab to navigate, Enter or Space to activate buttons, and arrow keys for navigation.
          </p>
          
          <div 
            className="grid grid-cols-3 gap-2"
            role="grid"
            aria-label="Keyboard navigation grid"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
              <button
                key={num}
                className="
                  p-4 bg-blue-100 hover:bg-blue-200 rounded-lg
                  focus:ring-4 focus:ring-blue-300 focus:outline-none
                  transition-colors duration-200
                "
                onClick={() => announceToScreenReader(`Grid item ${num} selected`)}
                aria-label={`Grid item ${num}`}
              >
                {num}
              </button>
            ))}
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12 safe-area-bottom" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>Mobile & Accessibility Enhancement Demo</p>
            <p className="text-sm mt-2">
              Phase 2C: Enhanced for mobile devices and accessibility compliance
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Wrapper component with providers
const MobileAccessibilityDemoWrapper = () => {
  return (
    <AccessibilityProvider>
      <MobileProvider>
        <MobileAccessibilityDemo />
      </MobileProvider>
    </AccessibilityProvider>
  );
};

export default MobileAccessibilityDemoWrapper;
