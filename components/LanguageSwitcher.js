"use client";

import { useLanguage } from "./LanguageProvider";

export default function LanguageSwitcher({ navigation = false }) {
  const { language, setLanguage, t } = useLanguage();
  if (!navigation) return <label className="atlas-language"><span>{t("Language")}</span><select aria-label={t("Language")} value={language} onChange={event => setLanguage(event.target.value)}><option value="en">English</option><option value="fil">Filipino</option></select></label>;
  return <details className="language-switcher" onClick={event => event.stopPropagation()} onKeyDown={event => { if (event.key === "Escape") { event.currentTarget.open = false; event.currentTarget.querySelector("summary")?.focus(); } }} onBlur={event => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}>
    <summary aria-label={`${t("Language")}: ${language === "en" ? "English" : "Filipino"}`}>{t("Language")} <span aria-hidden="true">▾</span></summary>
    <div className="language-options" role="group" aria-label={t("Language")}>
      {[['en', 'English'], ['fil', 'Filipino']].map(([value, label]) => <button key={value} type="button" lang={value} aria-pressed={language === value} onClick={event => { setLanguage(value); const menu = event.currentTarget.closest("details"); menu.open = false; menu.querySelector("summary")?.focus(); }}>{label}</button>)}
    </div>
  </details>;
}
