"use client";

import { createElement, forwardRef } from "react";
import { useLanguage } from "./LanguageProvider";

const TEXT_ATTRIBUTES = ["aria-label", "aria-valuetext", "alt", "title", "placeholder", "data-tooltip"];

// Translate at the React render boundary, never by mutating the DOM. The original
// source copy is the catalog key. Form values, IDs, handlers and scoring data pass through.
const Localized = forwardRef(function Localized({ as = "span", children, ...props }, ref) {
  const { t } = useLanguage();
  if (props.translate === "no") return createElement(as, { ...props, ref }, children);
  const translated = { ...props, ref };
  for (const key of TEXT_ATTRIBUTES) {
    if (typeof translated[key] === "string") translated[key] = t(translated[key]);
  }
  const text = child => typeof child === "string" ? t(child) : Array.isArray(child) ? child.map(text) : child;
  return createElement(as, translated, text(children));
});

export default Localized;
