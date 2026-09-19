"use client";

import { browserStorage, subscribeToStorage } from "@/lib/browserStorage";


import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translate } from "@/lib/i18n/translate";

const LanguageContext = createContext({ language: "en", setLanguage: () => {}, t: value => value });
export const LANGUAGE_KEY = "careerCompassLanguage";

export default function LanguageProvider({ children }) {
  const [language, setCurrentLanguage] = useState("en");
  useEffect(() => {
    const restore = () => setCurrentLanguage(browserStorage.getItem(LANGUAGE_KEY) === "fil" ? "fil" : "en");
    queueMicrotask(restore);
    return subscribeToStorage(key => { if (key === null || key === LANGUAGE_KEY) restore(); });
  }, []);
  const setLanguage = useCallback(value => {
    if (value !== "en" && value !== "fil") return;
    setCurrentLanguage(value);
    try { browserStorage.setItem(LANGUAGE_KEY, value); } catch { /* Keep the in-memory preference. */ }
  }, []);
  useEffect(() => { document.documentElement.lang = language; }, [language]);
  const value = useMemo(() => ({ language, setLanguage, t: text => translate(text, language) }), [language, setLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export const useLanguage = () => useContext(LanguageContext);
