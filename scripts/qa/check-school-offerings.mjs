// Cached, read-only government program audit. Not imported by the application.
import { readFile, writeFile } from "node:fs/promises";
const ids = {
  "SCH-001": 16701, "SCH-002": 16701, "SCH-003": 16700, "SCH-004": 16699,
  "SCH-005": 16698, "SCH-006": 16581, "SCH-007": 16648, "SCH-008": 16627,
  "SCH-009": 16626, "SCH-010": 16647, "SCH-011": 16625, "SCH-012": 16694,
  "SCH-013": 16657, "SCH-014": 16688, "SCH-015": 16693, "SCH-016": 16696,
  "SCH-017": 16707, "SCH-018": 16667, "SCH-019": 16706, "SCH-020": 16640,
  "SCH-021": 16594, "SCH-022": 16669, "SCH-023": 16654, "SCH-024": 16605,
  "SCH-025": 16606, "SCH-026": 16622, "SCH-027": 16649, "SCH-028": 15201,
  "SCH-029": 16560, "SCH-030": 16603, "SCH-031": 16598, "SCH-032": 16553,
  "SCH-033": 16554, "SCH-034": 16552, "SCH-035": 16692, "SCH-036": 16695,
  "SCH-037": 16565, "SCH-038": 16559,
};
const directory = JSON.parse(await readFile(new URL("../../docs/qa/school-priority/ched-heis.json", import.meta.url), "utf8"));
const file = new URL("../../docs/qa/school-priority/program-audit.json", import.meta.url);
let cache = {};
try { cache = JSON.parse(await readFile(file, "utf8")); } catch { /* First audit. */ }
for (const [schoolId, id] of Object.entries(ids)) {
  if (cache[schoolId]?.chedId === id) continue;
  const entry = directory.find(row => row.id === id);
  if (!entry) throw new Error(`Unknown directory ID ${id}`);
  const url = `https://region5.ched.gov.ph/hei-directory/${id}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${schoolId}: HTTP ${response.status}`);
  const html = await response.text();
  const section = html.slice(html.indexOf("Offered Programs"), html.indexOf("Institutional Authority"));
  const programs = [...section.matchAll(/<span class="font-bold text-slate-800[^>]*>([\s\S]*?)<\/span>/g)].map(match => match[1].replace(/<[^>]+>/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim());
  cache[schoolId] = { chedId: id, name: entry.name, url, checkedAt: new Date().toISOString(), programs };
  await writeFile(file, JSON.stringify(cache, null, 2));
  console.log(`${schoolId}: ${entry.name}, ${programs.length} programs`);
}
