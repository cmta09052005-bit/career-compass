import test from "node:test";
import assert from "node:assert/strict";
import witnesses from "../data/v2/witnesses.json" with { type: "json" };
import { togglePicks, valleyPatch, valleySteps, stepComplete, validUiGwa } from "./valleySelection.js";
import { createEmptySession, mergeSession } from "./sessionSchema.js";
import { fromSession } from "./scoringV2/fromSession.js";

test("Valley max picks, deselect and exclusive none confirmation", () => {
  assert.deepEqual(togglePicks(["a", "b", "c"], "d"), { values: ["a", "b", "c"], confirmed: true, limited: true });
  assert.deepEqual(togglePicks(["a"], "a"), { values: [], confirmed: false, limited: false });
  assert.deepEqual(togglePicks(["a"], null), { values: [], confirmed: true, limited: false });
  assert.equal(togglePicks([], null, true).confirmed, false);
  assert.deepEqual(togglePicks([], "a", true).values, ["a"]);
});
test("Valley route step lists, flags and exact UI GWA", () => {
  assert.deepEqual(valleySteps("old"), ["strand", "subjects", "gwa", "certificates"]);
  assert.deepEqual(valleySteps("new"), ["electives", "bestSubjects", "gwa", "certificates"]);
  assert.deepEqual(valleySteps(null), []);
  for (const v of [60, 74.99, 75, 94.99, 100, "60.00"]) assert.equal(validUiGwa(v), true);
  for (const v of [null, "", 59.99, 100.01, 90.123, "9e1", "90."]) assert.equal(validUiGwa(v), false);
  let s = mergeSession(createEmptySession(), { gradeLevel: 11 });
  assert.equal(stepComplete(s, "electives"), false);
  s = mergeSession(s, valleyPatch(s, "electives", [], true));
  assert.equal(stepComplete(s, "electives"), true);
  s = mergeSession(s, valleyPatch(s, "bestSubjects", [], false));
  assert.equal(stepComplete(s, "bestSubjects"), false);
});
for (const route of ["old", "new"]) test(`full ${route} journey from a real reachability witness validates through adapter`, () => {
  const witness = witnesses.find(w => w.flow === route);
  assert.ok(witness);
  const a = witness.answers;
  let s = mergeSession(createEmptySession(), { gradeLevel: 12, route });
  s = mergeSession(s, { interests: a.interests, journeyProgress: { interests: "Completed" } });
  s = mergeSession(s, { skills: a.skills, journeyProgress: { skills: "Completed" } });
  for (const step of valleySteps(route)) {
    const value = ["gwa", "certificates"].includes(step) ? a[step] : a[route][step];
    s = mergeSession(s, valleyPatch(s, step, value, true));
    assert.equal(stepComplete(s, step), true);
  }
  assert.equal(fromSession(s).ok, true);
  assert.deepEqual(fromSession(s).answers, a);
});
