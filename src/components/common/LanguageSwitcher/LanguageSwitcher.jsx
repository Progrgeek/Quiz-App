import React, { useState } from 'react';
import { ChevronDown, Globe } from 'lucide-react';
import { useContent } from '../../../context/ContentContext.jsx';
import { useNavigationText } from '../../../hooks/useContent';

const LanguageSwitcher = () => {
  const { currentLanguage, availableLanguages, switchLanguage } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const languagesText = useNavigationText('languages');

  const languageNames = {
    en: 'English',
    es: 'Español',
    fr: 'Français'
  };

  const handleLanguageChange = (langCode) => {
    switchLanguage(langCode);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
        aria-label={languagesText}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">
          {languageNames[currentLanguage]}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
            {availableLanguages.map((langCode) => (
              <button
                key={langCode}
                onClick={() => handleLanguageChange(langCode)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                  currentLanguage === langCode 
                    ? 'text-blue-600 bg-blue-50 font-medium' 
                    : 'text-gray-700'
                }`}
                role="menuitem"
              >
                <div className="flex items-center justify-between">
                  <span>{languageNames[langCode]}</span>
                  {currentLanguage === langCode && (
                    <div className="w-2 h-2 bg-blue-600 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSwitcher;
