import ui from "./fil.js";
import content from "./fil-content.js";
import courses from "./fil-courses.js";
import notes from "./fil-notes.js";
import v2 from "./fil-v2.js";
import v2Content from "./fil-v2-content.js";
import uiEdits from "./fil-ui-edits.js";
import schoolPriority from "./fil-school-priority.js";
import { isKeptText } from "./policy.js";
import { patterns } from "./patterns.js";

export const catalog = { ...ui, ...content, ...courses, ...notes, ...v2, ...v2Content, ...uiEdits, ...schoolPriority };
const normalize = value => value.replace(/\s+/g, " ").trim();
const normalized = new Map(Object.entries(catalog).map(([key, value]) => [normalize(key), value]));
const escape = text => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const templates = Object.entries(catalog).filter(([key]) => /\{\d+\}/.test(key)).map(([key, value]) => {
  const slots = [...key.matchAll(/\{(\d+)\}/g)].map(m => m[1]);
  const expression = key.split(/\{\d+\}/).map(escape).join("(.+?)");
  return [new RegExp(`^${expression}$`), value, slots];
});

export function translate(value, language = "en") {
  if (typeof value !== "string") return value;
  // Preserve source English; the only normalization requested in both languages is no em dash.
  if (language !== "fil") return value.replace(/—/g, ";");
  if (isKeptText(value)) return value.replace(/—/g, ";");
  const key = normalize(value);
  const direct = normalized.get(key);
  if (direct !== undefined) return value.replace(value.trim(), direct);
  for (const [pattern, render] of patterns) {
    const match = key.match(pattern);
    if (match) return render(match, text => translate(text, language));
  }
  for (const [pattern, target, slots] of templates) {
    const match = key.match(pattern);
    if (match) return target.replace(/\{(\d+)\}/g, (_, id) => translate(match[slots.indexOf(id) + 1], language));
  }
  // Unknown copy falls back as a whole, without translating pieces of proper names.
  return value.replace(/—/g, ";");
}
