import test from "node:test";
import assert from "node:assert/strict";
import master from "../data/v2/courses-master.json" with { type: "json" };
import details from "../data/v2/course-details.json" with { type: "json" };
import { buildSearchIndex, matchQuery, matchesFilters, schoolMatches, filterOptions, cardInfoFor, searchCourses, activeFilterLabel, words } from "./courseSearch.js";
const index = buildSearchIndex(), ranked = master.map((c, i) => ({ ...c, rank: i + 1, total: 85 - i }));
test("word-prefix AND search uses source names, groups, careers and topics", () => {
  const ids = query => searchCourses(ranked, index, { query }).map(c => c.id);
  assert.ok(ids("nurse").includes("HLT01"));
  for (const id of ["EDU01", "EDU02", "EDU03", "EDU04", "EDU06", "EDU07", "EDU08"]) assert.ok(ids("teacher").includes(id));
  assert.deepEqual(ids(""), master.map(c => c.id));
  assert.deepEqual(ids("xyznotacourse"), []);
  assert.ok(!ids("urse").includes("HLT01"));
  assert.ok(ids("  NÚRSE   health ").includes("HLT01"));
  assert.ok(!ids("nurse xyznotacourse").length);
  assert.deepEqual(words("  ÉDUCATION   SÇIENCE "), ["education", "science"]);
  const match = matchQuery(index.find(c => c.id === "HLT01"), "nurse");
  assert.ok(match.fields.includes("career")); assert.equal(match.hint.text, "Staff nurse");
  const sourceHasWelding = index.some(c => c.fields.some(f => f.words.some(w => w.startsWith("welding"))));
  assert.equal(ids("welding").length > 0, sourceHasWelding);
  assert.equal(sourceHasWelding, false, "No welding occurs in the current searchable source fields");
});
const school = (id, type, province, flags = [], group = "bicol") => ({ id, school: id, type, province, flags, group, campus: null, location: null });
const fixture = { id: "X", group: "Computing", overview: "Exact source sentence.", careers: ["A very long exact career title", "Staff nurse"], schools: [school("Albay public", "public-suc", "Albay"), school("Sorsogon private", "private", "Sorsogon")] };
test("all eight filter combination types use AND across categories and OR within them", () => {
  for (let mask = 0; mask < 8; mask++) {
    const filters = { groups: mask & 1 ? ["Computing"] : [], schoolTypes: mask & 2 ? ["private"] : [], locations: mask & 4 ? ["province:Sorsogon"] : [] };
    assert.equal(matchesFilters(fixture, filters), true, `combination ${mask}`);
    assert.equal(matchesFilters(fixture, { ...filters, groups: ["Education"] }), false);
  }
  assert.equal(matchesFilters(fixture, { schoolTypes: ["private"], locations: ["province:Albay"] }), false, "type/location on different schools must not match");
  assert.equal(schoolMatches(fixture.schools[1], { schoolTypes: ["private", "community-college"], locations: ["province:Albay", "group:bicol"] }), true);
  assert.equal(matchesFilters({ ...fixture, schools: [] }, {}), true);
  assert.equal(matchesFilters({ ...fixture, schools: [] }, { locations: ["group:bicol"] }), false);
});
test("filter options are exactly the recorded values and never infer national ownership", () => {
  const options = filterOptions();
  assert.equal(options.groups.length, 9); assert.equal(options.schoolTypes.length, 4); assert.equal(options.locations.length, 10);
  assert.ok(options.schoolTypes.find(t => t.id === "national").label.includes("unspecified"));
  assert.ok(!options.locations.some(l => /near|nearest/i.test(l.label)));
  assert.equal(cardInfoFor({ ...fixture, schools: [school("National school", "national", null, [], "national")] }).school.type, null);
});
test("search combines with every active-filter combination using AND", () => {
  for (let mask = 0; mask < 8; mask++) {
    const filters = { groups: mask & 1 ? ["Health and Allied Sciences"] : [], schoolTypes: mask & 2 ? ["private"] : [], locations: mask & 4 ? ["province:Albay"] : [] };
    assert.ok(searchCourses(ranked, index, { query: "nurse", filters }).some(c => c.id === "HLT01"));
    assert.equal(searchCourses(ranked, index, { query: "zznotacoursezz", filters }).length, 0);
  }
});
test("card info preserves source text and chooses a matching school on the same record", () => {
  assert.equal(cardInfoFor(fixture).overview, fixture.overview);
  assert.equal(cardInfoFor(fixture).job, "Staff nurse");
  assert.equal(cardInfoFor(fixture, { schoolTypes: ["private"], locations: ["province:Sorsogon"] }).school.id, "Sorsogon private");
  assert.equal(cardInfoFor(fixture, { schoolTypes: ["private"], locations: ["province:Albay"] }).school, null);
  assert.equal(cardInfoFor({ ...fixture, schools: [] }).school, null);
  assert.equal(cardInfoFor({ ...fixture, careers: ["An exact long title with many words"] }).job, "An exact long title with many words");
  const rows = [school("Flagged Albay", "public-suc", "Albay", ["partial"]), school("Clean Sorsogon", "private", "Sorsogon"), school("Clean Albay", "private", "Albay")];
  assert.equal(cardInfoFor({ ...fixture, schools: rows }).school.id, "Flagged Albay", "unlocated fixtures retain source order");
  assert.equal(cardInfoFor({ ...fixture, schools: rows.slice(0, 2) }).school.id, "Flagged Albay", "flags and province do not invent a distance");
  assert.equal(cardInfoFor({ ...fixture, schools: [rows[0], school("National", "national", "Laguna", [], "national")] }).school.id, "Flagged Albay", "unknown-distance source order remains stable");
  assert.equal(cardInfoFor({ ...fixture, schools: [rows[1], { ...rows[1], id: "Second" }] }).school.id, "Clean Sorsogon", "stable source order");
  for (const c of index) { assert.equal(cardInfoFor(c).overview, [...new Intl.Segmenter("en", { granularity: "sentence" }).segment(details[c.id].overview)][0].segment.trim()); assert.ok(details[c.id].careers.some(j => j.jobTitle === cardInfoFor(c).job)); }
});
test("search, filters and all sorts preserve personal ranks, totals and source order", () => {
  const before = JSON.stringify({ ranked, index });
  const lowest = searchCourses(ranked, index, { sort: "lowest" });
  assert.equal(lowest[0].rank, 85); assert.equal(lowest.at(-1).rank, 1);
  const az = searchCourses(ranked, index, { sort: "az" });
  assert.ok(az.every((c, i) => !i || az[i - 1].name.localeCompare(c.name, "en", { sensitivity: "base" }) <= 0));
  const filtered = searchCourses(ranked, index, { query: "nurse", filters: { groups: ["Health and Allied Sciences"] } });
  assert.ok(filtered.length); for (const c of filtered) { const original = ranked.find(r => r.id === c.id); assert.equal(c.rank, original.rank); assert.equal(c.total, original.total); }
  assert.equal(JSON.stringify({ ranked, index }), before);
  assert.equal(activeFilterLabel({}), ""); assert.match(activeFilterLabel({ schoolTypes: ["private"], locations: ["province:Albay"] }), /on our list:.*Private.*Albay/i);
});
