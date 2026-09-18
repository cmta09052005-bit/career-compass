import ui from "./fil.js";
import content from "./fil-content.js";
import { patterns } from "./patterns.js";

export const catalog = { ...ui, ...content };
const normalize = value => value.replace(/\s+/g, " ").trim();
const normalized = new Map(Object.entries(catalog).map(([key, value]) => [normalize(key), value]));
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const phrases = Object.keys(catalog).filter(key => key.length > 2).sort((a, b) => b.length - a.length);
const phrasePattern = new RegExp(`(?<![\\p{L}\\p{N}])(?:${phrases.map(escape).join("|")})(?![\\p{L}\\p{N}])`, "gu");

export function translate(value, language = "en") {
  if (typeof value !== "string") return value;
  // Preserve source English; the only normalization requested in both languages is no em dash.
  if (language !== "fil") return value.replace(/—/g, ";");
  const key = normalize(value);
  const direct = normalized.get(key);
  if (direct !== undefined) return value.replace(value.trim(), direct);
  for (const [pattern, render] of patterns) {
    const match = key.match(pattern);
    if (match) return render(match, text => translate(text, language));
  }
  // Composed labels (for example a region plus its status) reuse the same entries.
  return value.replace(phrasePattern, text => catalog[text]).replace(/—/g, ";");
}
