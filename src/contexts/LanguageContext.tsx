
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type Language = 'english' | 'hindi' | 'marathi';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  // Dashboard
  'dashboard': {
    'english': 'Dashboard',
    'hindi': 'डैशबोर्ड',
    'marathi': 'डॅशबोर्ड'
  },
  'detect_disease': {
    'english': 'Detect Disease',
    'hindi': 'रोग का पता लगाएं',
    'marathi': 'रोग शोधा'
  },
  'assess_fitness': {
    'english': 'Assess Fitness',
    'hindi': 'फिटनेस का आकलन करें',
    'marathi': 'फिटनेस तपासा'
  },
  'chatbot_ai': {
    'english': 'Chatbot AI',
    'hindi': 'चैटबॉट एआई',
    'marathi': 'चॅटबॉट एआय'
  },
  'hospital_near_me': {
    'english': 'Hospital Near Me',
    'hindi': 'मेरे पास अस्पताल',
    'marathi': 'माझ्या जवळील रुग्णालय'
  },
  'login': {
    'english': 'Login',
    'hindi': 'लॉग इन करें',
    'marathi': 'लॉगिन करा'
  },
  'register': {
    'english': 'Register',
    'hindi': 'पंजीकरण करें',
    'marathi': 'नोंदणी करा'
  },
  'email': {
    'english': 'Email',
    'hindi': 'ईमेल',
    'marathi': 'ईमेल'
  },
  'password': {
    'english': 'Password',
    'hindi': 'पासवर्ड',
    'marathi': 'पासवर्ड'
  },
  'confirm_password': {
    'english': 'Confirm Password',
    'hindi': 'पासवर्ड की पुष्टि करें',
    'marathi': 'पासवर्ड पुष्टी करा'
  },
  'welcome': {
    'english': 'Welcome to MedAI',
    'hindi': 'मेडएआई में आपका स्वागत है',
    'marathi': 'मेडएआई मध्ये आपले स्वागत आहे'
  },
  'select_language': {
    'english': 'Select Language',
    'hindi': 'भाषा चुनें',
    'marathi': 'भाषा निवडा'
  },
  'upload_image': {
    'english': 'Upload X-ray/CT Scan',
    'hindi': 'एक्स-रे/सीटी स्कैन अपलोड करें',
    'marathi': 'एक्स-रे/सीटी स्कॅन अपलोड करा'
  },
  'view_results': {
    'english': 'View Results',
    'hindi': 'परिणाम देखें',
    'marathi': 'निकाल पहा'
  },
  'submit': {
    'english': 'Submit',
    'hindi': 'जमा करें',
    'marathi': 'सबमिट करा'
  },
  'ask_question': {
    'english': 'Ask a health question...',
    'hindi': 'एक स्वास्थ्य प्रश्न पूछें...',
    'marathi': 'एक आरोग्य प्रश्न विचारा...'
  },
  'find_hospital': {
    'english': 'Find a Hospital',
    'hindi': 'एक अस्पताल खोजें',
    'marathi': 'रुग्णालय शोधा'
  },
  'logout': {
    'english': 'Logout',
    'hindi': 'लॉग आउट',
    'marathi': 'लॉगआउट'
  },
  'symptoms': {
    'english': 'Symptoms',
    'hindi': 'लक्षण',
    'marathi': 'लक्षणे'
  },
  'dr': {
    'english': 'Dr.',
    'hindi': 'डॉ.',
    'marathi': 'डॉ.'
  },
  'cardiologist': {
    'english': 'Cardiologist',
    'hindi': 'हृदय रोग विशेषज्ञ',
    'marathi': 'हृदयरोग तज्ञ'
  },
  'height': {
    'english': 'Height',
    'hindi': 'ऊंचाई',
    'marathi': 'उंची'
  },
  'weight': {
    'english': 'Weight',
    'hindi': 'वजन',
    'marathi': 'वजन'
  },
  'diet': {
    'english': 'Diet',
    'hindi': 'आहार',
    'marathi': 'आहार'
  },
  'alcohol': {
    'english': 'Alcohol Consumption',
    'hindi': 'शराब का सेवन',
    'marathi': 'मद्यपान'
  },
  'smoking': {
    'english': 'Smoking Habits',
    'hindi': 'धूम्रपान की आदतें',
    'marathi': 'धूम्रपान सवयी'
  },
  'cm': {
    'english': 'cm',
    'hindi': 'सेमी',
    'marathi': 'सेमी'
  },
  'kg': {
    'english': 'kg',
    'hindi': 'किग्रा',
    'marathi': 'किलो'
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('english');

  const t = (key: string): string => {
    const parts = key.split('.');
    let translation;
    
    if (parts.length === 1) {
      translation = translations[key as keyof typeof translations]?.[language];
    } else {
      const section = translations[parts[0] as keyof typeof translations];
      if (section) {
        translation = section[language as keyof typeof section];
      }
    }
    
    return translation || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
