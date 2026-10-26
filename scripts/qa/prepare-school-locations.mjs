import { readFile, writeFile } from "node:fs/promises";
const read = async path => JSON.parse(await readFile(new URL(path, import.meta.url), "utf8"));
const geocoder = await read("../../docs/qa/school-priority/geocoder.json");
const directory = await read("../../docs/qa/school-priority/ched-heis.json");
const programs = await read("../../docs/qa/school-priority/program-audit.json");
const schools = await read("../../data/v2/schools.json");
// Explicitly reviewed campus matches, never the geocoder's blind first result.
const osmPicks = {
  "SCH-002": 0, "SCH-003": 0, "SCH-004": 0, "SCH-005": 0, "SCH-006": 0, "SCH-007": 0,
  "SCH-009": 0, "SCH-011": 0, "SCH-012": 0, "SCH-014": 0, "SCH-017": 0,
  "SCH-019": 0, "SCH-020": 0, "SCH-021": 0, "SCH-023": 0, "SCH-024": 0,
  "SCH-025": 0, "SCH-027": 0, "SCH-029": 0, "SCH-030": 0, "SCH-031": 0,
  "SCH-036": 1, "SCH-039": 0, "SCH-040": 0, "SCH-041": 1, "SCH-042": 0,
  "SCH-043": 0, "SCH-046": 0, "SCH-047": 0, "SCH-048": 0, "SCH-049": 0,
};
const chedPicks = { "SCH-008": 16627, "SCH-010": 16647, "SCH-022": 16669, "SCH-026": 16622, "SCH-028": 15201, "SCH-032": 16553, "SCH-033": 16554, "SCH-035": 16692, "SCH-037": 16565, "SCH-038": 16559 };
function osmPoint(candidate) {
  return { coordinates: [Number(candidate.lat), Number(candidate.lon)], source: `https://www.openstreetmap.org/${candidate.osm_type}/${candidate.osm_id}`, basis: "Mapped campus reference point" };
}
const points = {};
for (const school of schools) {
  let point = null;
  if (Object.hasOwn(osmPicks, school.id)) point = osmPoint(geocoder[school.id].candidates[osmPicks[school.id]]);
  if (school.id === "SCH-001") point = osmPoint(geocoder["SCH-003"].candidates[2]);
  if (chedPicks[school.id]) {
    const row = directory.find(entry => entry.id === chedPicks[school.id]);
    const coordinates = [Number(row.lat), Number(row.lng)];
    if (coordinates[0] < 11.8 || coordinates[0] > 15 || coordinates[1] < 122 || coordinates[1] > 125) throw new Error(`Reject out-of-region directory point: ${school.id}`);
    point = { coordinates, source: `https://region5.ched.gov.ph/hei-directory/${row.id}`, basis: "CHED campus reference point" };
  }
  points[school.id] = {
    ...(point || { coordinates: null, source: null, basis: "Campus reference point not verified" }),
    ...(programs[school.id] ? { programSource: programs[school.id].url } : {}),
    ...(school.id === "SCH-001" ? { unresolvedCourses: ["EDU06", "EDU03", "EDU01", "EDU02"], review: "The current BU programs page locates College of Education under Daraga. The original source's West-campus association is retained for review, without assigning a distance to those course links." } : {}),
  };
}
// Reject grouped campuses and institution lists instead of inventing one location.
for (const id of ["SCH-013", "SCH-015", "SCH-016", "SCH-018", "SCH-044", "SCH-045", "SCH-050", "SCH-051"]) points[id] = { ...points[id], coordinates: null, source: null, basis: "Offering campus not resolved to one verified location" };
const output = { checkedOn: "2026-10-27", method: "Great-circle distance between bundled campus reference points and Polangui Municipal Hall; not road distance or travel time.", attribution: "Map coordinates © OpenStreetMap contributors (ODbL) and CHED Region V. Individual coordinate sources are retained per record.", origin: { name: "Polangui Municipal Hall, Albay, Philippines", ...osmPoint(geocoder.origin.candidates[0]) }, schools: points };
await writeFile(new URL("../../data/school-locations.json", import.meta.url), JSON.stringify(output, null, 2) + "\n");
console.log(`${Object.values(points).filter(point => point.coordinates).length}/${schools.length} campus reference points; unresolved and ambiguous records remain explicit.`);
