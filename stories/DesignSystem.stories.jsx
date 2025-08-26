/**
 * Design System Documentation
 * Showcases design tokens, color palettes, typography, and spacing
 */

import { tokens } from '../src/styles/tokens';
import { components } from '../src/styles/components';
import { animations } from '../src/styles/animations';
import { themes } from '../src/styles/themes';

export default {
  title: 'Design System/Tokens',
  parameters: {
    docs: {
      description: {
        component: 'Design tokens provide the foundation for consistent design across the Quiz App. These tokens define colors, typography, spacing, and more.',
      },
    },
  },
};

// Color Palette
export const Colors = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Color Palette</h2>
        
        {Object.entries(tokens.colors).map(([colorName, colorShades]) => (
          <div key={colorName} className="mb-8">
            <h3 className="text-lg font-semibold mb-4 capitalize">{colorName}</h3>
            <div className="grid grid-cols-10 gap-2">
              {Object.entries(colorShades).map(([shade, value]) => (
                <div key={shade} className="text-center">
                  <div 
                    className="w-full h-16 rounded-lg border border-gray-200 mb-2"
                    style={{ backgroundColor: value }}
                  ></div>
                  <div className="text-xs">
                    <div className="font-medium">{shade}</div>
                    <div className="text-gray-500">{value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ),
};

// Typography
export const Typography = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Typography Scale</h2>
        
        <div className="space-y-6">
          {Object.entries(tokens.typography.fontSizes).map(([sizeName, sizeValue]) => (
            <div key={sizeName} className="border-b border-gray-100 pb-4">
              <div className="flex items-baseline gap-4 mb-2">
                <span 
                  className="font-medium"
                  style={{ fontSize: sizeValue }}
                >
                  {sizeName} - The quick brown fox jumps over the lazy dog
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Size: {sizeValue}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Font Weights</h3>
        <div className="space-y-3">
          {Object.entries(tokens.typography.fontWeights).map(([weightName, weightValue]) => (
            <div key={weightName} className="flex items-center gap-4">
              <span 
                className="text-lg"
                style={{ fontWeight: weightValue }}
              >
                {weightName} - Sample text ({weightValue})
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Line Heights</h3>
        <div className="space-y-4">
          {Object.entries(tokens.typography.lineHeights).map(([heightName, heightValue]) => (
            <div key={heightName} className="border border-gray-200 p-4 rounded">
              <div className="text-sm font-medium text-gray-700 mb-2">
                {heightName} ({heightValue})
              </div>
              <p 
                className="text-base"
                style={{ lineHeight: heightValue }}
              >
                This is sample text to demonstrate the line height. Lorem ipsum dolor sit amet, 
                consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Spacing
export const Spacing = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Spacing Scale</h2>
        
        <div className="space-y-4">
          {Object.entries(tokens.spacing).map(([spaceName, spaceValue]) => (
            <div key={spaceName} className="flex items-center gap-4">
              <div className="w-20 text-sm font-medium">{spaceName}</div>
              <div 
                className="bg-blue-200 border border-blue-300"
                style={{ width: spaceValue, height: '20px' }}
              ></div>
              <div className="text-sm text-gray-600">{spaceValue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Border Radius
export const BorderRadius = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Border Radius</h2>
        
        <div className="grid grid-cols-4 gap-6">
          {Object.entries(tokens.borderRadius).map(([radiusName, radiusValue]) => (
            <div key={radiusName} className="text-center">
              <div 
                className="w-20 h-20 bg-blue-100 border-2 border-blue-300 mx-auto mb-2"
                style={{ borderRadius: radiusValue }}
              ></div>
              <div className="text-sm font-medium">{radiusName}</div>
              <div className="text-xs text-gray-600">{radiusValue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Shadows
export const Shadows = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Box Shadows</h2>
        
        <div className="grid grid-cols-3 gap-6">
          {Object.entries(tokens.boxShadows).map(([shadowName, shadowValue]) => (
            <div key={shadowName} className="text-center">
              <div 
                className="w-24 h-24 bg-white border border-gray-100 mx-auto mb-3 rounded-lg"
                style={{ boxShadow: shadowValue }}
              ></div>
              <div className="text-sm font-medium">{shadowName}</div>
              <div className="text-xs text-gray-600 max-w-[100px] mx-auto break-all">
                {shadowValue}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Breakpoints
export const Breakpoints = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Responsive Breakpoints</h2>
        
        <div className="space-y-4">
          {Object.entries(tokens.breakpoints).map(([breakpointName, breakpointValue]) => (
            <div key={breakpointName} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-16 text-sm font-medium">{breakpointName}</div>
              <div className="flex-1">
                <div 
                  className="h-4 bg-blue-200 rounded"
                  style={{ width: `${parseInt(breakpointValue) / 10}px` }}
                ></div>
              </div>
              <div className="text-sm text-gray-600">{breakpointValue}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};

// Component Tokens
export const ComponentTokens = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Component-Specific Tokens</h2>
        
        {Object.entries(components).map(([componentName, componentTokens]) => (
          <div key={componentName} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 capitalize">{componentName}</h3>
            
            {componentTokens.variants && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Variants</h4>
                <div className="grid grid-cols-1 gap-2">
                  {Object.entries(componentTokens.variants).map(([variantName, variantClasses]) => (
                    <div key={variantName} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">{variantName}</div>
                      <div className="text-xs text-gray-600 font-mono break-all">
                        {variantClasses}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {componentTokens.sizes && (
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Sizes</h4>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(componentTokens.sizes).map(([sizeName, sizeClasses]) => (
                    <div key={sizeName} className="p-3 bg-gray-50 rounded-lg">
                      <div className="font-medium text-sm mb-1">{sizeName}</div>
                      <div className="text-xs text-gray-600 font-mono">
                        {sizeClasses}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  ),
};

// Themes
export const ThemeShowcase = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Theme Variations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(themes).map(([themeName, themeColors]) => (
            <div key={themeName} className="border border-gray-200 rounded-lg overflow-hidden">
              <div 
                className="p-4 text-white font-semibold"
                style={{ backgroundColor: themeColors.primary }}
              >
                {themeName.charAt(0).toUpperCase() + themeName.slice(1)} Theme
              </div>
              
              <div className="p-4 space-y-3" style={{ backgroundColor: themeColors.surface }}>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(themeColors).map(([colorName, colorValue]) => (
                    <div key={colorName} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border border-gray-300"
                        style={{ backgroundColor: colorValue }}
                      ></div>
                      <span className="text-xs" style={{ color: themeColors.text }}>
                        {colorName}
                      </span>
                    </div>
                  ))}
                </div>
                
                <div className="pt-2">
                  <button 
                    className="px-3 py-1 rounded text-sm font-medium"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      color: 'white'
                    }}
                  >
                    Sample Button
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  ),
};
