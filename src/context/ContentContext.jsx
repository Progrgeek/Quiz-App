import React, { createContext, useContext, useState } from 'react';

// Language content imports
import enButtons from '../content/en/buttons.json';
import enNavigation from '../content/en/navigation.json';
import enUI from '../content/en/ui.json';
import enExercises from '../content/en/exercises.json';
import enFeedback from '../content/en/feedback.json';
import enInstructions from '../content/en/instructions.json';

import esButtons from '../content/es/buttons.json';
import esNavigation from '../content/es/navigation.json';
import esUI from '../content/es/ui.json';
import esExercises from '../content/es/exercises.json';
import esFeedback from '../content/es/feedback.json';
import esInstructions from '../content/es/instructions.json';

import frButtons from '../content/fr/buttons.json';
import frNavigation from '../content/fr/navigation.json';
import frUI from '../content/fr/ui.json';
import frExercises from '../content/fr/exercises.json';
import frFeedback from '../content/fr/feedback.json';
import frInstructions from '../content/fr/instructions.json';

// Content structure
const content = {
  en: {
    buttons: enButtons,
    navigation: enNavigation,
    ui: enUI,
    exercises: enExercises,
    feedback: enFeedback,
    instructions: enInstructions
  },
  es: {
    buttons: esButtons,
    navigation: esNavigation,
    ui: esUI,
    exercises: esExercises,
    feedback: esFeedback,
    instructions: esInstructions
  },
  fr: {
    buttons: frButtons,
    navigation: frNavigation,
    ui: frUI,
    exercises: frExercises,
    feedback: frFeedback,
    instructions: frInstructions
  }
};

// Create context
const ContentContext = createContext();

// Content provider component
export const ContentProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState('en');

  const switchLanguage = (language) => {
    if (content[language]) {
      setCurrentLanguage(language);
    }
  };

  const getContent = (category, key, variables = {}) => {
    const categoryContent = content[currentLanguage]?.[category];
    if (!categoryContent) {
      console.warn(`Category "${category}" not found for language "${currentLanguage}"`);
      return key;
    }

    // Handle nested keys with dot notation
    let text = categoryContent;
    const keyParts = key.split('.');
    
    for (const keyPart of keyParts) {
      if (text && typeof text === 'object' && keyPart in text) {
        text = text[keyPart];
      } else {
        console.warn(`Text key "${key}" not found in category "${category}" for language "${currentLanguage}"`);
        return key;
      }
    }

    if (typeof text !== 'string') {
      console.warn(`Text key "${key}" does not resolve to a string in category "${category}" for language "${currentLanguage}"`);
      return key;
    }

    // Replace variables in text
    Object.entries(variables).forEach(([variable, value]) => {
      text = text.replace(new RegExp(`{{${variable}}}`, 'g'), value);
    });

    return text;
  };

  const value = {
    currentLanguage,
    switchLanguage,
    getContent,
    availableLanguages: ['en', 'es', 'fr']
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};

// Hook to use the context
export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export default ContentContext;
