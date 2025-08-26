import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Import all locales
import enTranslations from './locales/en';
import esTranslations from './locales/es';
import frTranslations from './locales/fr';

const translations = {
  en: enTranslations,
  es: esTranslations,
  fr: frTranslations
};

const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');
  const [content, setContent] = useState(translations.en);

  useEffect(() => {
    // Load language from localStorage if available
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && translations[savedLanguage]) {
      setCurrentLanguage(savedLanguage);
      setContent(translations[savedLanguage]);
    }
  }, []);

  const changeLanguage = (languageCode) => {
    if (translations[languageCode]) {
      setCurrentLanguage(languageCode);
      setContent(translations[languageCode]);
      localStorage.setItem('preferredLanguage', languageCode);
    }
  };

  const getNestedProperty = (obj, path) => {
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : null;
    }, obj);
  };

  const interpolateVariables = (text, variables = {}) => {
    if (!text || typeof text !== 'string') return text;
    
    return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      return variables[key] !== undefined ? variables[key] : match;
    });
  };

  const getText = (path, variables = {}) => {
    const text = getNestedProperty(content, path);
    
    if (text === null) {
      // Fallback to English if text not found in current language
      const fallbackText = getNestedProperty(translations.en, path);
      if (fallbackText) {
        return interpolateVariables(fallbackText, variables);
      }
      
      // Return path as fallback if no translation found
      console.warn(`Translation not found for path: ${path}`);
      return path;
    }
    
    return interpolateVariables(text, variables);
  };

  const value = {
    currentLanguage,
    availableLanguages: Object.keys(translations),
    changeLanguage,
    getText,
    content
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

ContentProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Convenience hook for getting specific text
export const useText = (path, variables = {}) => {
  const { getText } = useContent();
  return getText(path, variables);
};

export default ContentContext;
