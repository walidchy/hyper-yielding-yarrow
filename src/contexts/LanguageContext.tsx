
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import enTranslations from '../i18n/en.json';
import frTranslations from '../i18n/fr.json';
import arTranslations from '../i18n/ar.json';

export type Language = 'en' | 'fr' | 'ar';

export interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, variables?: string | string[]) => string;
  direction: 'ltr' | 'rtl';
}

const translations = {
  en: enTranslations,
  fr: frTranslations,
  ar: arTranslations
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    return (savedLanguage as Language) || 'en';
  });

  const [direction, setDirection] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', language);
    
    // Set direction based on language
    setDirection(language === 'ar' ? 'rtl' : 'ltr');
    
    // Set HTML dir and lang attributes
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  // Function to get a value from a nested object using a dot-notation path
  const getNestedValue = (obj: any, path: string): string => {
    const keys = path.split('.');
    let value = obj;
    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return path; // Return the path if the key doesn't exist
      }
    }
    return typeof value === 'string' ? value : path;
  };

  // Translation function
  const t = (key: string, variables?: string | string[]): string => {
    const translationObj = translations[language];
    let text = getNestedValue(translationObj, key);
    
    // Handle string fallback value
    if (typeof variables === 'string') {
      return text || variables;
    }
    
    // Handle array of variables
    if (Array.isArray(variables) && variables.length > 0) {
      variables.forEach((variable, index) => {
        text = text.replace(`{${index}}`, variable);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, direction }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
