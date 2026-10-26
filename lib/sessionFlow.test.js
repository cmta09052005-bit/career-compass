import test from "node:test";
import assert from "node:assert/strict";
import priorV2 from "./fixtures/session-v2-pre-25b.json" with { type: "json" };
import fixture from "./fixtures/session-v1.json" with { type: "json" };
import items from "../data/v2/items.json" with { type: "json" };
import pilotSchools from "../data/v2/pilot-schools.json" with { type: "json" };
import { resolveRoute, isBasecampComplete } from "./routeResolution.js";
import { createEmptySession, normalizeSession, mergeSession } from "./sessionSchema.js";
import { isSectionValid, validatedProgress } from "./assessmentValidation.js";
import { journeyEntry } from "./journeyEntry.js";
import { fromSession } from "./scoringV2/fromSession.js";
import { validateAnswers, validateSectionAnswers } from "./scoringV2/validate.js";

function complete(route = "new") {
  return {
    ...createEmptySession(), gradeLevel: route === "new" ? 11 : 12, pilotSchoolId: null, route,
    interests: Object.fromEntries(items.interests.map(q => [q.id, "A"])),
    skills: Object.fromEntries(items.skills.map(q => [q.id, 3])), certificates: [], gwa: 0,
    old: { strand: "STR-04", subjects: ["ACA-01"] },
    new: { electives: [], bestSubjects: ["COR-01"] },
    valleyProgress: { gwa: true, certificates: true, old: { strand: true, subjects: true }, new: { electives: true, bestSubjects: true } },
    journeyProgress: { interests: "Completed", skills: "Completed", academic: "Completed" },
  };
}

test("Grade 11 automatically uses new, including after restore and an incompatible route patch", () => {
  const s = mergeSession(createEmptySession(), { gradeLevel: 11, route: "old" });
  assert.equal(s.route, "new"); assert.equal(isBasecampComplete(s), true);
  assert.deepEqual(resolveRoute({ gradeLevel: 11, chosenRoute: "old" }), { route: "new", locked: true, needsSchoolQuestion: false, needsRouteChoice: false });
  assert.equal(normalizeSession({ ...s, route: null }).route, "new");
});

// Pilot-school routing is unused since Prompt 24. Retained as historical coverage.
test.skip("Grade 12 pilot route is locked new; test-only list is never production school data", () => {
  const syntheticList = [{ id: "test-pilot", name: "Test-only fixture" }];
  const state = resolveRoute({ gradeLevel: 12, pilotSchoolId: "test-pilot", chosenRoute: "old" }, syntheticList);
  assert.equal(state.route, "new"); assert.equal(state.locked, true); assert.equal(state.needsRouteChoice, false);
});

test("Grade 12 chooses either route without a school question", () => {
  assert.deepEqual(pilotSchools, []);
  for (const route of ["old", "new"]) {
    const s = mergeSession(createEmptySession(), { gradeLevel: 12, pilotSchoolId: "other", route });
    assert.equal(s.route, route); assert.equal(isBasecampComplete(s), true);
    assert.equal(resolveRoute({ gradeLevel: 12, chosenRoute: route }).locked, false);
    assert.equal(resolveRoute({ gradeLevel: 12, chosenRoute: route }).needsSchoolQuestion, false);
    assert.equal(fromSession({ ...complete(route), gradeLevel: 12, pilotSchoolId: null }).ok, true);
  }
  assert.equal(resolveRoute({ gradeLevel: 12, pilotSchoolId: null, chosenRoute: "old" }).route, "old");
  assert.equal(resolveRoute({ gradeLevel: 12, pilotSchoolId: "unknown", chosenRoute: "new" }).route, "new");
});

test("full production-v1 saved fixture retains identity and clears all scoring and completion", () => {
  assert.equal(Object.keys(fixture.skills).length, 10);
  assert.equal(fixture.journeyProgress.academic, "Completed");
  const s = normalizeSession(fixture);
  assert.equal(s.schemaVersion, 2); assert.equal(s.nickname, fixture.nickname); assert.equal(s.avatarId, fixture.avatarId);
  assert.equal(s.gradeLevel, null); assert.equal(s.route, null); assert.equal(s.gwa, null);
  assert.deepEqual(s.interests, {}); assert.deepEqual(s.skills, {}); assert.deepEqual(s.certificates, []);
  assert.deepEqual(s.old, { strand: null, subjects: [] }); assert.deepEqual(s.new, { electives: [], bestSubjects: [] });
  assert.ok(Object.values(s.journeyProgress).every(value => value === "Not Started"));
  assert.equal(fromSession(s).ok, false); assert.equal(journeyEntry(s).href, "/intake");
});

test("route/context changes clear only the branch that became inactive, retaining shared answers", () => {
  const old = complete("old");
  const next = mergeSession(old, { route: "new" });
  assert.deepEqual(next.old, createEmptySession().old); assert.deepEqual(next.new, old.new);
  for (const key of ["interests", "skills", "certificates", "gwa"]) assert.deepEqual(next[key], old[key]);
  assert.equal(next.valleyProgress.certificates, true); assert.equal(next.valleyProgress.gwa, true);
  assert.equal(next.valleyProgress.old.strand, false);
  const automatic = mergeSession(old, { gradeLevel: 11 });
  assert.equal(automatic.route, "new"); assert.deepEqual(automatic.old, createEmptySession().old);
  const pending = mergeSession(old, { pilotSchoolId: null });
  assert.equal(pending.route, "old"); assert.deepEqual(pending.old, old.old); assert.equal(pending.pilotSchoolId, null);
  const unchanged = mergeSession(old, { gradeLevel: 12, pilotSchoolId: "other" });
  assert.deepEqual(unchanged.old, old.old);
  const reverse = mergeSession({ ...complete("new"), gradeLevel: 12, pilotSchoolId: "other" }, { route: "old" });
  assert.deepEqual(reverse.new, createEmptySession().new); assert.deepEqual(reverse.old, old.old);
  const fresh = mergeSession(createEmptySession(), { gradeLevel: 11 });
  assert.equal(mergeSession(fresh, { gradeLevel: 12 }).journeyProgress.academic, "Not Started", "profile changes alone must not start Valley or skip the map introduction");
});

test("empty/nullable answers need explicit Valley confirmation, not merely valid canonical values", () => {
  const s = complete();
  assert.equal(isSectionValid(s, "academic"), true);
  assert.equal(fromSession(s).ok, true);
  for (const key of ["certificates", "electives"]) {
    const t = structuredClone(s);
    if (key === "certificates") t.valleyProgress.certificates = false;
    else t.valleyProgress.new[key] = false;
    assert.equal(isSectionValid(t, "academic"), false);
    assert.ok(fromSession(t).errors.some(error => error.code === "UNANSWERED" && error.path.endsWith(key)));
    assert.equal(validatedProgress(t).academic, "In Progress");
  }
});

test("partial validators do not demand unrelated sections, but reject unknown IDs and extra questions", () => {
  const s = complete();
  assert.equal(validateSectionAnswers({ interests: s.interests }, "interests").valid, true);
  assert.equal(validateSectionAnswers({ skills: s.skills }, "skills").valid, true);
  assert.equal(validateSectionAnswers({ skills: { ...s.skills, "SKL-16": 5 } }, "skills").valid, false);
  assert.equal(isSectionValid({ ...s, skills: { ...s.skills, "SKL-15": undefined } }, "skills"), false);
  assert.equal(isSectionValid({ ...s, certificates: ["CER-NONE"] }, "academic"), false);
  assert.equal(isSectionValid({ ...s, new: { ...s.new, bestSubjects: ["ELE-WORK-IMMERSION"] } }, "academic"), false);
});

test("sequential guards do not trust stored completion flags", () => {
  const s = complete();
  assert.equal(journeyEntry(s).href, "/results");
  const missing = { ...s, interests: {} };
  assert.deepEqual(validatedProgress(missing), { interests: "In Progress", skills: "In Progress", academic: "In Progress" });
  assert.equal(journeyEntry(missing).href, "/journey");
  assert.equal(journeyEntry({ ...s, gradeLevel: null }).href, "/intake");
});

test("adapter emits only canonical scoring fields, excludes inactive answers and validates with the real engine", () => {
  for (const route of ["old", "new"]) {
    const s = complete(route);
    Object.assign(s, { nickname: "Personal", name: "Personal", avatarId: "navigator", school: "ignored" });
    const result = fromSession(s);
    assert.equal(result.ok, true); assert.deepEqual(result.errors, []);
    assert.equal(validateAnswers(result.answers).valid, true);
    assert.deepEqual(Object.keys(result.answers).sort(), ["route", "interests", "skills", "certificates", "gwa", route].sort());
    assert.ok(!Object.hasOwn(result.answers, route === "old" ? "new" : "old"));
    result.answers.interests["INT-01"] = "D";
    assert.equal(s.interests["INT-01"], "A");
  }
});

test("readSessionRecord migrates local and legacy serialized v1 fixtures, clearing notices and preserving preferences", async () => {
  class Storage {
    values = new Map();
    getItem(key) { return this.values.get(key) ?? null; }
    setItem(key, value) { this.values.set(key, String(value)); }
    removeItem(key) { this.values.delete(key); }
  }
  for (const location of ["localStorage", "sessionStorage"]) {
    const localStorage = new Storage(), sessionStorage = new Storage();
    globalThis.window = Object.assign(new EventTarget(), { localStorage, sessionStorage });
    window[location].setItem("careerCompassSession", JSON.stringify(fixture));
    window[location].setItem("careerCompassValleyStep", "2");
    window[location].setItem("careerCompassLanguage", "fil");
    const store = await import(`./browserStorage.js?schema-fixture-${location}`);
    const migrated = store.readSessionRecord();
    assert.equal(migrated.nickname, fixture.nickname); assert.equal(migrated.avatarId, fixture.avatarId);
    assert.equal(JSON.parse(localStorage.getItem(store.PROGRESS_KEY)).schemaVersion, 2);
    assert.equal(localStorage.getItem(store.SESSION_VERSION_KEY), "2");
    assert.equal(store.browserStorage.getItem("careerCompassValleyStep"), null);
    assert.equal(store.browserStorage.getItem("careerCompassLanguage"), "fil");
    assert.deepEqual(store.readSessionRecord(), migrated);
  }
  delete globalThis.window;
});

test("25b migration drops retired fields, preserves core selections and reopens empty core answers", () => {
  const before=structuredClone(priorV2);
  const migrated=normalizeSession(before);
  assert.ok(!Object.hasOwn(migrated.new,"cluster"));assert.ok(!Object.hasOwn(migrated.valleyProgress.new,"cluster"));
  assert.deepEqual(migrated.new.bestSubjects,before.new.bestSubjects.filter(id=>id.startsWith("COR-")));
  assert.equal(migrated.valleyProgress.new.bestSubjects,true);assert.equal(fromSession(migrated).ok,true);
  assert.deepEqual(migrated.interests,before.interests);assert.deepEqual(migrated.skills,before.skills);
  assert.deepEqual(migrated.new.electives,before.new.electives);assert.equal(migrated.nickname,before.nickname);
  const noCore=normalizeSession({...before,new:{...before.new,bestSubjects:["ELE-01","ELE-02"]}});
  assert.deepEqual(noCore.new.bestSubjects,[]);assert.equal(noCore.valleyProgress.new.bestSubjects,false);
  assert.equal(noCore.journeyProgress.academic,"In Progress");assert.equal(fromSession(noCore).ok,false);
  assert.deepEqual(before,priorV2,"migration must not mutate the saved fixture");
});
test("25b storage cleanup persists a normalized v2 record and removes the retired step", async () => {
  class Storage { values=new Map();getItem(k){return this.values.get(k)??null;}setItem(k,v){this.values.set(k,String(v));}removeItem(k){this.values.delete(k);} }
  globalThis.window=Object.assign(new EventTarget(),{localStorage:new Storage(),sessionStorage:new Storage()});
  window.localStorage.setItem("careerCompassSession",JSON.stringify(priorV2));
  window.localStorage.setItem("careerCompassValleyStep",JSON.stringify({route:"new",step:"cluster"}));
  const store=await import("./browserStorage.js?revision-25b");
  const migrated=store.readSessionRecord();
  assert.deepEqual(JSON.parse(window.localStorage.getItem("careerCompassSession")),JSON.parse(JSON.stringify(migrated)));
  assert.equal(store.browserStorage.getItem("careerCompassValleyStep"),null);
  assert.deepEqual(store.readSessionRecord(),migrated);delete globalThis.window;
});
