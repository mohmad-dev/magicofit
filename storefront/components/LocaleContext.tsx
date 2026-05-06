"use client";

import { createContext, useContext, useEffect, useState } from "react";

type LocaleContextType = {
  locale: string;
  messages: Record<string, any>;
  t: (key: string) => string;
};

const LocaleContext = createContext<LocaleContextType | null>(null);

export function LocaleProvider({ 
  children, 
  locale,
  messages 
}: { 
  children: React.ReactNode;
  locale: string;
  messages: Record<string, any>;
}) {
  const [currentMessages, setCurrentMessages] = useState(messages);

  useEffect(() => {
    setCurrentMessages(messages);
  }, [messages]);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = currentMessages;
    
    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    
    return typeof value === "string" ? value : key;
  };

  return (
    <LocaleContext.Provider value={{ locale, messages: currentMessages, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocaleContext() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocaleContext must be used within LocaleProvider");
  }
  return context;
}

export function useSimpleTranslation(namespace: string = "common") {
  const { t } = useLocaleContext();
  
  return {
    t: (key: string) => t(`${namespace}.${key}`)
  };
}
