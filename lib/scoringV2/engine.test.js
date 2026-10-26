import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { Worker } from "node:worker_threads";
import courses from "../../data/v2/courses-master.json" with { type: "json" };
import items from "../../data/v2/items.json" with { type: "json" };
import links from "../../data/v2/links.json" with { type: "json" };
import { scoreCourses, rankCourses, gwaBonus, sha256, answerSeed, canonicalizeAnswers, validateAnswers, AnswerValidationError } from "./index.js";

function base(route = "old") {
  return {
    route, interests: Object.fromEntries(items.interests.map((q) => [q.id, "A"])),
    skills: Object.fromEntries(items.skills.map((s) => [s.id, 1])), certificates: [], gwa: 100,
    ...(route === "old" ? { old: { strand: "STR-04", subjects: ["ACA-01"] } } : { new: { electives: [], bestSubjects: ["COR-01"] } }),
  };
}
const result = (answers, id = "BUS01") => scoreCourses(answers).find((row) => row.id === id);
function maximize(id, route) {
  const a = base(route), link = links[id];
  for (const option of link.interests) a.interests[option.slice(0, 6)] = option.slice(-1);
  for (const skill of link.skills) a.skills[skill] = 5;
  a.certificates = [...link.certificates];
  if (route === "old") a.old = { strand: link.strand, subjects: [...link.oldSubjects] };
  else {
    a.new = { electives: link.electives.slice(0, 3), bestSubjects: [link.coreSubject] };
  }
  return a;
}

for (const [gwa, bonus] of [[0, 0], [74.99, 0], [75, 2], [79.99, 2], [80, 3], [84.99, 3], [85, 4], [89.99, 4], [90, 5], [94.5, 5], [94.99, 5], [95, 6], [100, 6]]) {
  test(`GWA ${gwa} gives ${bonus} without rounding in both routes`, () => {
    assert.equal(gwaBonus(gwa), bonus);
    for (const route of ["old", "new"]) {
      const a = maximize("BUS01", route); a.gwa = gwa;
      assert.equal(result(a).breakdown.gwa, bonus);
    }
  });
}

test("all 85 old-course maxima are 38 and all new-course maxima are 43, with exact breakdowns", () => {
  for (const { id } of courses) for (const route of ["old", "new"]) {
    const rows = scoreCourses(maximize(id, route));
    assert.equal(rows.length, 85);
    const target = rows.find((row) => row.id === id);
    assert.equal(target.total, route === "old" ? 38 : 43, `${id}/${route}`);
    assert.deepEqual([target.breakdown.interest, target.breakdown.skill, target.breakdown.certificate, target.breakdown.academic], [6, 10, 6, route === "old" ? 16 : 21]);
    for (const row of rows) {
      assert.ok(row.total <= (route === "old" ? 38 : 43));
      assert.equal(row.total, row.breakdown.interest + row.breakdown.skill + row.breakdown.certificate + row.breakdown.academic);
      assert.equal(row.breakdown.academic, row.breakdown.strand + row.breakdown.subjects + row.breakdown.elective + row.breakdown.bestSubject + row.breakdown.gwa);
      assert.ok(!("percentage" in row));
    }
  }
});

test("GAS removes all strand and GWA awards, retaining subject evidence", () => {
  const a = maximize("BUS01", "old"); a.old.strand = "STR-04";
  for (const row of scoreCourses(a)) assert.deepEqual([row.breakdown.strand, row.breakdown.gwa], [0, 0]);
  assert.equal(result(a).breakdown.subjects, 6);
});

test("empty certificates and electives award zero", () => {
  for (const row of scoreCourses(base("new"))) assert.deepEqual([row.breakdown.certificate, row.breakdown.elective], [0, 0]);
});

test("matched electives and the linked core award separately; GWA is given once", () => {
  const a = maximize("BUS01", "new");
  assert.deepEqual([result(a).breakdown.elective, result(a).breakdown.bestSubject, result(a).breakdown.gwa], [12, 3, 6]);
  a.new.electives = [links.BUS01.electives[0]];
  assert.deepEqual([result(a).breakdown.elective, result(a).breakdown.bestSubject], [4, 3]);
});

test("GWA requires an elective or core match; no cluster award exists", () => {
  const a = base("new");
  assert.equal(result(a).breakdown.bestSubject, 3);
  assert.equal(result(a).breakdown.gwa, 6);
  a.new.bestSubjects = ["COR-02"];
  assert.deepEqual([result(a).breakdown.bestSubject, result(a).breakdown.gwa], [0, 0]);
  assert.ok(!Object.hasOwn(result(a).breakdown, "cluster"));
  a.new.electives = [links.BUS01.electives[0]];
  assert.deepEqual([result(a).breakdown.bestSubject, result(a).breakdown.gwa], [0, 6]);
});

test("SHA-256 known vectors, padding boundaries and UTF-8 match independent Node crypto", () => {
  assert.equal(sha256("abc"), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  for (const input of ["", "Career Compass 🧭", "\ud800", ...[55, 56, 63, 64, 65, 1000, 1000000].map((n) => "a".repeat(n))]) {
    assert.equal(sha256(input), createHash("sha256").update(input).digest("hex"));
  }
});

test("ranking obeys all four comparators, including ascending hash within exact ties", () => {
  const a = base("new"), seed = answerSeed(a), rows = rankCourses(a);
  assert.equal(rows.length, 85);
  assert.equal(new Set(rows.map((row) => row.id)).size, 85);
  let hashPairs = 0;
  for (let i = 1; i < rows.length; i++) {
    const p = rows[i - 1], q = rows[i];
    const differences = [p.total - q.total, p.breakdown.skill - q.breakdown.skill, p.breakdown.interest - q.breakdown.interest];
    const first = differences.find((n) => n !== 0);
    if (first !== undefined) assert.ok(first > 0);
    else { assert.ok(sha256(seed + p.id) < sha256(seed + q.id)); hashPairs++; }
  }
  assert.ok(hashPairs > 0, "fixture must exercise the final tie-break");
});

test("deterministic ranking ignores input key order, array order and metadata", () => {
  for (const route of ["old", "new"]) {
    const a = maximize("ENG01", route), b = structuredClone(a);
    b.interests = Object.fromEntries(Object.entries(b.interests).reverse());
    b.skills = Object.fromEntries(Object.entries(b.skills).reverse());
    b.certificates.reverse();
    if (route === "old") b.old.subjects.reverse();
    else { b.new.electives.reverse(); b.new.bestSubjects.reverse(); }
    Object.assign(b, { name: "Another name", avatar: "other", gradeLevel: 12, school: "different" });
    assert.deepEqual(rankCourses(a), rankCourses(b));
    assert.deepEqual(rankCourses(a), rankCourses(a));
    assert.equal(canonicalizeAnswers(a), canonicalizeAnswers(b));
    const before = JSON.stringify(a); rankCourses(a); assert.equal(JSON.stringify(a), before);
  }
});

test("hash uses GWA tier and active-route scoring fields only", () => {
  const a = maximize("BUS01", "old"), b = structuredClone(a);
  a.gwa = 94.5; b.gwa = 94.99;
  b.new = base("new").new;
  assert.equal(answerSeed(a), answerSeed(b));
  b.gwa = 95; assert.notEqual(answerSeed(a), answerSeed(b));
  b.gwa = a.gwa; b.interests["INT-08"] = "D";
  assert.notEqual(answerSeed(a), answerSeed(b));
});

test("validator rejects malformed objects, unknown IDs, duplicates and out-of-range values", () => {
  const cases = [
    [null, "TYPE"],
    [{ ...base(), route: "other" }, "RANGE"],
    ...[-1, 100.01].map((gwa) => [{ ...base(), gwa }, "RANGE"]),
    ...[NaN, Infinity, "90"].map((gwa) => [{ ...base(), gwa }, "TYPE"]),
    [{ ...base(), interests: {} }, "REQUIRED"],
    [{ ...base(), interests: { ...base().interests, "INT-09": "A" } }, "UNKNOWN_KEY"],
    [{ ...base(), interests: { ...base().interests, "INT-01": "E" } }, "RANGE"],
    ...[0, 6].map((value) => [{ ...base(), skills: { ...base().skills, "SKL-01": value } }, "RANGE"]),
    [{ ...base(), skills: { ...base().skills, "SKL-01": 1.5 } }, "INTEGER"],
    [{ ...base(), skills: { ...base().skills, "SKL-01": "5" } }, "TYPE"],
    [{ ...base(), certificates: ["CER-01", "CER-01"] }, "DUPLICATE"],
    [{ ...base(), certificates: ["CER-NONE"] }, "UNKNOWN_ID"],
    [{ ...base(), certificates: ["CER-01", "CER-02", "CER-03", "CER-04"] }, "COUNT"],
    [{ ...base(), old: { strand: "GAS", subjects: ["ACA-01"] } }, "UNKNOWN_ID"],
    [{ ...base(), old: { strand: "STR-04", subjects: [] } }, "COUNT"],
    [{ ...base(), old: { strand: "STR-04", subjects: ["ACA-01", "ACA-01"] } }, "DUPLICATE"],
    [{ ...base("new"), new: { electives: ["ELE-WORK-IMMERSION"], bestSubjects: ["COR-01"] } }, "UNKNOWN_ID"],
    [{ ...base("new"), new: { electives: [], cluster: null, bestSubjects: ["COR-01"] } }, "UNKNOWN_KEY"],
    [{ ...base("new"), new: { electives: [], bestSubjects: ["ELE-01"] } }, "UNKNOWN_ID"],
    [{ ...base("new"), new: { electives: [], bestSubjects: ["COR-01", "COR-02", "COR-03", "COR-04"] } }, "COUNT"],
    [{ ...base("new"), new: { electives: [], bestSubjects: ["COR-01", "COR-01"] } }, "DUPLICATE"],
    [{ ...base("new"), new: { electives: [], bestSubjects: [] } }, "COUNT"],
  ];
  for (const [a, code] of cases) {
    const validation = validateAnswers(a);
    assert.equal(validation.valid, false);
    assert.ok(validation.errors.some((e) => e.code === code));
    assert.throws(() => scoreCourses(a), (error) => error instanceof AnswerValidationError && error.code === "INVALID_ANSWERS");
  }
});

test("production scoring has no cap or percentage transformation", async () => {
  const source = await readFile(new URL("./score.js", import.meta.url), "utf8");
  assert.doesNotMatch(source, /Math\.(min|round)|percentage|\*\s*100|\/\s*100/);
  // Valid profiles cannot exceed 43, so an actual >100 valid-input example is impossible.
  assert.match(source, /total: interest \+ skill \+ certificate \+ academic/);
});

test("inherited scoring properties cannot bypass canonicalization", () => {
  const a = base();
  a.interests = Object.create(a.interests);
  assert.equal(validateAnswers(a).valid, false);
  assert.throws(() => rankCourses(a), AnswerValidationError);
});

test("browser-like VM with no crypto, window or Node APIs produces identical ranking", async () => {
  const source = (await Promise.all(["validate.js", "score.js", "sha256.js", "rank.js"].map(async (file) => (await readFile(new URL(file, import.meta.url), "utf8")).replace(/^import .*;\r?\n/gm, "").replace(/^export /gm, "")))).join("\n");
  const context = vm.createContext({ items: structuredClone(items), courses: structuredClone(courses), links: structuredClone(links), TextEncoder, input: base("new") });
  const actual = vm.runInContext(source + "\nJSON.stringify(rankCourses(input));", context);
  assert.equal(actual, JSON.stringify(rankCourses(base("new"))));
});

test("real module worker without Web Crypto produces identical ranking", async () => {
  const moduleUrl = new URL("./index.js", import.meta.url).href;
  const input = base("new");
  const worker = new Worker(`const {parentPort,workerData}=require('node:worker_threads'); Object.defineProperty(globalThis,'crypto',{value:undefined}); import(${JSON.stringify(moduleUrl)}).then(m=>parentPort.postMessage(m.rankCourses(workerData)));`, { eval: true, workerData: input });
  const actual = await new Promise((resolve, reject) => { worker.once("message", resolve); worker.once("error", reject); worker.once("exit", (code) => { if (code !== 0) reject(new Error(`worker exit ${code}`)); }); });
  assert.deepEqual(actual, rankCourses(input));
});
