// One-time, cached location audit. No geocoding runs in the deployed app.
import { readFile, writeFile } from "node:fs/promises";
const file = new URL("../../docs/qa/school-priority/geocoder.json", import.meta.url);
let cache = {};
try { cache = JSON.parse(await readFile(file, "utf8")); } catch { /* First audit. */ }
const schools = JSON.parse(await readFile(new URL("../../data/v2/schools.json", import.meta.url), "utf8"));
const queries = {
  origin: "Polangui Municipal Hall, Albay, Philippines",
  "SCH-001": "Bicol University Main Campus, Legazpi, Philippines",
  "SCH-002": "Bicol University East Campus, Legazpi, Philippines",
  "SCH-003": "Bicol University Daraga, Philippines",
  "SCH-004": "Bicol University Guinobatan, Philippines",
  "SCH-005": "Bicol University Tabaco, Philippines",
  "SCH-006": "Bicol University Gubat, Philippines",
  "SCH-007": "Bicol University Polangui, Philippines",
  "SCH-008": "Sorsogon State College Bulan Campus",
  "SCH-009": "Sorsogon State University Magallanes, Philippines",
  "SCH-010": "Sorsogon State University Sorsogon City, Philippines",
  "SCH-011": "Sorsogon State University Castilla, Philippines",
  "SCH-012": "Camarines Sur Polytechnic Colleges, Nabua, Philippines",
  "SCH-014": "Catanduanes State University, Virac, Philippines",
  "SCH-017": "University of Santo Tomas Legazpi Rawis",
  "SCH-019": "Ateneo de Naga University, Naga, Philippines",
  "SCH-020": "University of Nueva Caceres, Naga, Philippines",
  "SCH-039": "University of the Philippines Diliman, Philippines",
  "SCH-040": "University of the Philippines Los Banos, Philippines",
  "SCH-041": "University of the Philippines Manila, Philippines",
  "SCH-042": "University of Santo Tomas, Manila, Philippines",
  "SCH-043": "Ateneo de Manila University, Quezon City, Philippines",
  "SCH-044": "De La Salle College of Saint Benilde, Manila, Philippines",
  "SCH-045": "De La Salle University, Manila, Philippines",
  "SCH-046": "Ateneo de Davao University, Davao, Philippines",
  "SCH-047": "Northwestern University, Laoag, Philippines",
  "SCH-048": "Davao Doctors College, Davao, Philippines",
  "SCH-049": "Philippine Merchant Marine Academy, San Narciso, Philippines",
};
for (const school of schools.filter(s => Number(s.id.slice(-3)) >= 21 && Number(s.id.slice(-3)) <= 38)) queries[school.id] = `${school.school.replace(/\(.*?\)/g, "")}, ${school.campus || school.location || ""}, Philippines`;
for (const id of ["SCH-022", "SCH-024", "SCH-026", "SCH-028", "SCH-035", "SCH-037"]) queries[id] = schools.find(school => school.id === id).school;
queries["SCH-032"] = "Gov Mariano E Villafuerte Community College Libmanan";
queries["SCH-033"] = "Governor Mariano E Villafuerte Community College Garchitorena";
queries["SCH-034"] = "Governor Mariano E Villafuerte Community College Siruma";
for (const [id, query] of Object.entries(queries)) {
  if (cache[id]?.query === query) continue;
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=ph&limit=5&q=${encodeURIComponent(query)}`;
  const response = await fetch(url, { headers: { "User-Agent": "CareerCompass-LocalSchoolLocationAudit/1.0" }, signal: AbortSignal.timeout(20000) });
  if (!response.ok) throw new Error(`${id}: HTTP ${response.status}`);
  cache[id] = { query, fetchedAt: new Date().toISOString(), candidates: await response.json() };
  await writeFile(file, JSON.stringify(cache, null, 2));
  console.log(`${id}: ${cache[id].candidates.length} candidates`);
  await new Promise(resolve => setTimeout(resolve, 1100));
}
