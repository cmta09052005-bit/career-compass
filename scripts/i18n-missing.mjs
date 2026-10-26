import { readdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { catalog, translate } from "../lib/i18n/translate.js";
import { patterns } from "../lib/i18n/patterns.js";
import { keptEntries, isKeptText, normalizeText } from "../lib/i18n/policy.js";
import master from "../data/v2/courses-master.json" with { type: "json" };
import details from "../data/v2/course-details.json" with { type: "json" };
import items from "../data/v2/items.json" with { type: "json" };
import sources from "../data/v2/salary-sources.json" with { type: "json" };
import { getCourseSchools, schoolNotes } from "../lib/courseDataV2.js";
const root = fileURLToPath(new URL("../", import.meta.url));
const require = createRequire(import.meta.url), parser = require("espree");
const visibleAttributes = new Set(["aria-label", "aria-valuetext", "alt", "title", "placeholder", "label", "description", "data-tooltip", "data-plain-tooltip"]);
const ignoredProperties = new Set(["className", "href", "src", "id", "key", "type", "as", "role", "icon", "asset", "style", "name", "variant", "selector", "status", "section", "requires", "field", "color", "font", "unit", "format", "ease", "clearProps", "boxShadow", "filter", "duration", "start", "end", "backgroundImage", "background", "x", "y", "d", "viewBox"]);
const skippedCalls = new Set(["querySelector", "querySelectorAll", "closest", "getElementById", "getItem", "setItem", "removeItem", "addEventListener", "removeEventListener", "registerPlugin", "setAttribute", "getAttribute", "dispatchEvent", "useState", "matchMedia", "push", "replace", "import", "setFont", "format"]);
const entries = new Map();
function add(text, tier, origin, reason) {
  if (typeof text !== "string" || !/[A-Za-z]/.test(text)) return;
  text = normalizeText(text).replaceAll("&apos;", "'").replaceAll("&amp;", "&").replaceAll("&quot;", '"');
  if (isKeptText(text)) tier = "T3";
  const row = entries.get(text) || { text, tier, origins: [], ...(reason ? { policy: reason } : {}) };
  if (tier === "T1" && row.tier !== "T3") row.tier = tier;
  if (!row.origins.includes(origin)) row.origins.push(origin);
  entries.set(text, row);
}
const walkFiles = async dir => (await Promise.all((await readdir(dir, { withFileTypes: true })).map(f => f.isDirectory() ? walkFiles(path.join(dir, f.name)) : f.name.endsWith(".js") && !f.name.includes(".test.") ? [path.join(dir, f.name)] : []))).flat();
function usable(text) {
  if (/^(?:ArrowLeft|ArrowRight|NFD|STR-\d+|CA|JR)$/.test(text)) return false;
  if (/prefers-reduced-motion|^button\[|^M\{\d+\}/.test(text)) return false;
  if (/^(?:[./#?]|https?:|url\(|rgb|--|\[|\^|M[\d., -]|(?:group|province|stop):|stop-\{|[a-z-]+[+-]=)|\.(?:pdf|png|svg|js|json)$|noopener|\[role=|\b(?:power\d|sine|back)\.(?:out|inOut)|cubic-bezier|drop-shadow|opacity,transform|transform,opacity/.test(text)) return false;
  return /[a-zA-Z]/.test(text) && (!/^[\w-]+(?:\s+[\w-]+)*$/.test(text) || /^[A-Z][A-Za-z0-9 ()/,:.'?+-]+$/.test(text) || /^\d+ [A-Z][A-Z ]+$/.test(text));
}
function scan(file, source) {
  const ast = parser.parse(source, { ecmaVersion: "latest", sourceType: "module", ecmaFeatures: { jsx: true }, loc: true });
  const visit = (node, parent, ancestors = []) => {
    if (!node || typeof node !== "object") return;
    if (node.type === "ImportDeclaration") return;
    if (node.type === "JSXAttribute" && !visibleAttributes.has(node.name?.name)) return;
    if (node.type === "Property" && ignoredProperties.has(node.key?.name || node.key?.value)) return;
    const call = ancestors.findLast(n => n.type === "CallExpression");
    const callName = call?.callee?.property?.name || call?.callee?.name;
    if (node.type === "Literal" && typeof node.value === "string") {
      const text = normalizeText(node.value);
      const propertyKey = parent?.type === "Property" && parent.key === node;
      const technical = skippedCalls.has(callName) || /^(?:old|new|best|lowest|az|none|random|skip|overview|study|schools|careers|guidance|aid|strand|subjects|electives|bestSubjects|certificates|gwa|interests|skills|academic|en|fil|click|keydown|pointerdown|hashchange|pageshow|true|false|yes|no|auto|smooth|instant|nearest|center|left|right|normal|bold|mm|a4|helvetica|landscape|portrait|neutral|private|national|bicol|public-suc|community-college|partial|weak-source|unverified|outdated|derived-location|major-only|new-program)$/i.test(text) && !/^[A-Z]/.test(text);
      if (!propertyKey && !technical && usable(text) && !/\b(?:px|rem|dvh|svh|rgba|translateX|calc)\b|\w+:\w|\b(?:flex|grid|border|bg|text|font|items|justify|rounded|focus|hover|opacity|tracking|leading)-/.test(text)) add(text, "T1", `${file}:${node.loc.start.line}`);
    }
    if (node.type === "JSXText") add(node.value, "T1", `${file}:${node.loc.start.line}`);
    if (node.type === "TemplateLiteral") {
      const text = node.quasis.map((q, i) => q.value.cooked + (i < node.expressions.length ? `{${i}}` : "")).join("");
      if (usable(text) && !skippedCalls.has(callName) && !/^(?:[./#]|--|url\()|\b(?:px|rem|dvh|rgba|translateX)\b|\b(?:flex|grid|border|bg|text|font|items|justify|rounded|focus|hover|opacity|tracking|leading)-/.test(text)) add(text, "T1", `${file}:${node.loc.start.line}`);
    }
    for (const [key, value] of Object.entries(node)) if (!["loc", "start", "end", "raw"].includes(key)) { if (Array.isArray(value)) value.forEach(child => visit(child, node, [...ancestors, node])); else if (value && typeof value === "object") visit(value, node, [...ancestors, node]); }
  };
  visit(ast, null);
}
export async function inventory() {
  entries.clear();
  for (const file of [...await walkFiles(path.join(root, "app")), ...await walkFiles(path.join(root, "components")), ...["courseComparison", "courseDataV2", "courseDetailModel", "courseSearch", "schoolProximity", "explorerReport", "journeyEntry", "routeResolution", "recommendations", "sessionSchema", "useUnsavedProgressWarning"].map(f => path.join(root, `lib/${f}.js`))]) scan(path.relative(root, file).replaceAll("\\", "/"), await readFile(file, "utf8"));
  for (const entry of keptEntries) add(entry.text, "T3", entry.origin, entry.reason);
  for (const q of items.interests) { add(q.prompt, "T1", q.id); for (const o of q.options) add(o.text, "T1", o.id); }
  for (const bank of ["skills", "certificates", "strands", "oldSubjects", "electives", "coreSubjects"]) for (const row of items[bank]) { add(row.text, "T1", row.id); for (const field of ["section", "group"]) if (row[field]) add(row[field], "T1", `${row.id}.${field}`); }
  for (const row of items.electives) if (row.scored) add(`${row.section}: ${row.group}`, "T1", `${row.id}.groupHeading`);
  for (const c of master) {
    add(c.group, "T1", `${c.id}.group`); const d = details[c.id];
    for (const field of ["overview", "interestsStrengths", "guidanceTips"]) add(d[field], "T2", `${c.id}.${field}`);
    add([...new Intl.Segmenter("en", { granularity: "sentence" }).segment(d.overview)][0].segment.trim(), "T2", `${c.id}.overviewPreview`);
    for (const career of d.careers) if (career.notes) add(career.notes, "T2", `${c.id}.careers.notes`);
    for (const note of d.careerNotes || []) add(note.text, "T2", `${c.id}.careerNotes`);
    for (const school of getCourseSchools(c.id)) for (const note of schoolNotes(school)) add(note, "T1", `${school.id}.flagNote`);
  }
  add(sources.methodology, "T2", "salary-sources.methodology"); add(sources.updateNote, "T2", "salary-sources.updateNote");
  for (const reference of sources.references) add(reference.label, "T1", "salary-sources.referenceLabel");
  const normalizedCatalog = new Set(Object.keys(catalog).map(normalizeText));
  const rows = [...entries.values()].map(row => ({ ...row, coverage: row.tier === "T3" ? "kept-by-policy" : normalizedCatalog.has(row.text) ? "catalog" : patterns.some(([pattern]) => pattern.test(row.text)) ? "dynamic" : "missing" })).sort((a, b) => a.tier.localeCompare(b.tier) || a.text.localeCompare(b.text));
  return { policy: "T3 is intentionally English, including official DepEd elective/core names. Current app/components and UI-producing lib modules are scanned; tests, technical selectors/classes/paths, scoring internals, raw source-audit metadata and unused legacy data are excluded. Dynamic templates use numbered placeholders and explicit grammar is tested separately.", counts: Object.fromEntries(["T1", "T2", "T3"].map(tier => [tier, { total: rows.filter(r => r.tier === tier).length, missing: rows.filter(r => r.tier === tier && r.coverage === "missing").length }])), missing: rows.filter(r => r.coverage === "missing"), entries: rows };
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await inventory(); await writeFile(path.join(root, "docs/i18n-missing.json"), JSON.stringify(result, null, 2) + "\n");
  console.log(JSON.stringify(result.counts)); if (result.counts.T1.missing) { console.error(`FAIL: ${result.counts.T1.missing} T1 strings lack Filipino coverage.`); process.exitCode = 1; } else console.log("PASS: T1 translation coverage.");
}
