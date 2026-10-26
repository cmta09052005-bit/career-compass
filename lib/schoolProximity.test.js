import assert from "node:assert/strict";
import test from "node:test";
import master from "../data/v2/courses-master.json" with { type: "json" };
import schoolRows from "../data/v2/schools.json" with { type: "json" };
import byCourse from "../data/v2/schools-by-course.json" with { type: "json" };
import locations from "../data/school-locations.json" with { type: "json" };
import { straightLineKm, schoolDistanceKm, sortSchoolsByProximity } from "./schoolProximity.js";
import { getCourseSchools } from "./courseDataV2.js";
import { buildSearchIndex, cardInfoFor } from "./courseSearch.js";

test("great-circle distance handles known distances, invalid coordinates and stable ties", () => {
  assert.equal(straightLineKm([0, 0], [0, 0]), 0);
  assert.ok(Math.abs(straightLineKm([0, 0], [0, 1]) - 111.195) < .001);
  for (const invalid of [null, [], [NaN, 0], [91, 0], [0, 181]]) assert.equal(straightLineKm(invalid, [0, 0]), null);
  const point = locations.origin.coordinates;
  const near = { id: "near", group: "national", coordinates: point };
  const far = { id: "far", group: "bicol", coordinates: [point[0] + 1, point[1]] };
  const unknown = { id: "missing" }, invalid = { id: "invalid", coordinates: [NaN, 0] };
  const original = [unknown, far, near, { ...near, id: "tie" }, invalid];
  assert.deepEqual(sortSchoolsByProximity(original).map(school => school.id), ["near", "tie", "far", "missing", "invalid"]);
  assert.equal(original[0], unknown);
  assert.deepEqual(sortSchoolsByProximity([]), []);
});

test("every course retains exactly its source school links, ordered by unrounded distance with unknowns last", () => {
  const index = buildSearchIndex();
  for (const course of master) {
    const rows = getCourseSchools(course.id);
    assert.deepEqual(rows.map(row => row.id).sort(), [...byCourse[course.id]].sort(), course.id);
    const distances = rows.map(row => schoolDistanceKm(row, course.id) ?? Infinity);
    assert.ok(distances.every((distance, i) => !i || distance >= distances[i - 1]), course.id);
    assert.ok(rows.every(row => row.courseIds.includes(course.id)));
    assert.equal(cardInfoFor(index.find(row => row.id === course.id)).school.id, rows[0].id);
  }
  assert.equal(getCourseSchools("ICT01")[0].id, "SCH-007", "BU Polangui is nearest for IT");
  assert.deepEqual(getCourseSchools("BUS06").slice(0, 2).map(school => school.id), ["SCH-007", "SCH-023"], "both Polangui campuses precede farther Entrepreneurship schools");
  assert.equal(getCourseSchools("BUS02")[0].id, "SCH-047", "national-only offering is retained");
  assert.equal(schoolDistanceKm(schoolRows.find(school => school.id === "SCH-001"), "EDU02"), null, "disputed campus link does not get a guessed distance");
});
