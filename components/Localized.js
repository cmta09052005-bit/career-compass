"use client";

import { Children, cloneElement, createElement, forwardRef, Fragment, isValidElement } from "react";
import { useLanguage } from "./LanguageProvider";

const TEXT_ATTRIBUTES = ["aria-label", "aria-valuetext", "alt", "title", "placeholder", "data-tooltip", "data-plain-tooltip"];

// Translate at the React render boundary, never by mutating the DOM. The original
// source copy is the catalog key. Form values, IDs, handlers and scoring data pass through.
const Localized = forwardRef(function Localized({ as = "span", children, ...props }, ref) {
  const { t } = useLanguage();
  if (props.translate === "no") return createElement(as, { ...props, ref }, children);
  const translated = { ...props, ref };
  for (const key of TEXT_ATTRIBUTES) {
    if (typeof translated[key] === "string") translated[key] = t(translated[key]);
  }
  const text = child => {
    if (typeof child === "string") return t(child);
    if (Array.isArray(child)) return Children.map(child, text);
    if (!isValidElement(child) || child.props.translate === "no") return child;
    if (child.type === Fragment || typeof child.type === "string") {
      const attributes = {};
      for (const key of TEXT_ATTRIBUTES) if (typeof child.props[key] === "string") attributes[key] = t(child.props[key]);
      return cloneElement(child, attributes, text(child.props.children));
    }
    return child;
  };
  return createElement(as, translated, text(children));
});

export default Localized;
