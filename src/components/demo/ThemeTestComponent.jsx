import React from 'react';
import { useTheme } from '../../design-system/theme/ThemeProvider';

const ThemeTestComponent = () => {
  const { theme, setTheme, toggleTheme, isDark, isHighContrast } = useTheme();

  return (
    <div className="p-6 card-themed rounded-lg border-theme">
      <h2 className="text-2xl font-bold text-theme-primary mb-4">
        Theme Test Component
      </h2>
      
      <div className="mb-4">
        <p className="text-theme-secondary mb-2">
          Current theme: <strong className="text-theme-primary">{theme}</strong>
        </p>
        <p className="text-theme-secondary mb-2">
          Is Dark: <strong className="text-theme-primary">{isDark ? 'Yes' : 'No'}</strong>
        </p>
        <p className="text-theme-secondary mb-4">
          Is High Contrast: <strong className="text-theme-primary">{isHighContrast ? 'Yes' : 'No'}</strong>
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={toggleTheme}
          className="btn-primary px-4 py-2 rounded-lg"
        >
          Toggle Light/Dark
        </button>
        
        <button
          onClick={() => setTheme('light')}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
        >
          Light Theme
        </button>
        
        <button
          onClick={() => setTheme('dark')}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
        >
          Dark Theme
        </button>
        
        <button
          onClick={() => setTheme('highContrast')}
          className="px-4 py-2 bg-black text-white border-2 border-white rounded-lg"
        >
          High Contrast
        </button>
      </div>

      <div className="mt-6 p-4 bg-theme-secondary border-theme rounded-lg">
        <h3 className="text-lg font-semibold text-theme-primary mb-2">
          Theme Colors Test
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-theme-primary text-white rounded">
            Primary Background
          </div>
          <div className="p-3 bg-theme-secondary border-theme text-theme-primary rounded">
            Secondary Background
          </div>
          <div className="p-3 border-2 border-theme text-theme-primary rounded">
            Border Example
          </div>
          <div className="p-3 text-success rounded">
            Success Text
          </div>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="text"
          placeholder="Test input theming"
          className="input-themed w-full px-3 py-2 rounded-lg"
        />
      </div>
    </div>
  );
};

export default ThemeTestComponent;
