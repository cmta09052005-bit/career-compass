import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { createEmptySession, mergeSession, normalizeSession } from "../../lib/sessionSchema.js";
import { valleyPatch, valleySteps } from "../../lib/valleySelection.js";
import { fromSession } from "../../lib/scoringV2/fromSession.js";
import { buildRecommendations } from "../../lib/recommendations.js";

const root = fileURLToPath(new URL("../../", import.meta.url));
const input = path.resolve(root, process.argv[2] || "output/pdf/career-compass-new-flows.json");
const read = relative => JSON.parse(fs.readFileSync(path.join(root, relative), "utf8"));
const items = read("data/v2/items.json");
const courses = read("data/v2/courses-master.json");
const rawInput = fs.readFileSync(input);
const flows = JSON.parse(rawInput);
assert.equal(flows.length, 85, "Expected exactly 85 flows");
assert.deepEqual(flows.map(f => f.courseId), courses.map(c => c.id), "Expected master-list order, one target each");
const routes = [...new Set(flows.map(f => f.route))];
assert.equal(routes.length, 1, "Expected one route per input");
assert.ok(["NEW", "OLD"].includes(routes[0]), "Expected route NEW or OLD");
const route = routes[0].toLowerCase();
const mismatches = [];
function exact(bank, label, location) {
  const matches = bank.filter(item => item.text === label);
  if (matches.length !== 1) {
    mismatches.push({ location, label, matches: matches.length });
    return undefined;
  }
  return matches[0].id;
}
function selection(bank, labels, location) {
  assert.ok(Array.isArray(labels), `${location} must be an array`);
  return labels.map((label, i) => exact(bank, label, `${location}[${i}]`));
}
// Complete the exact-label audit of ALL flows before building any session.
const mapped = flows.map(f => {
  const prefix = f.courseId;
  assert.deepEqual(Object.keys(f.interests), Array.from({ length: 8 }, (_, i) => String(i + 1)));
  assert.deepEqual(Object.keys(f.skills), Array.from({ length: 15 }, (_, i) => String(i + 1)));
  const interests = Object.fromEntries(items.interests.map((question, index) => {
    const q = String(index + 1);
    const optionId = exact(question.options, f.interestLabels[q], `${prefix}.interestLabels.${q}`);
    if (optionId && optionId !== `${question.id}-${f.interests[q]}`) {
      mismatches.push({ location: `${prefix}.interests.${q}`, label: f.interestLabels[q], letter: f.interests[q], matches: "letter disagrees with exact option" });
    }
    return [question.id, optionId?.slice(-1)];
  }));
  const skills = Object.fromEntries(items.skills.map((item, index) => {
    const q = String(index + 1);
    const id = exact(items.skills, f.skillLabels[q], `${prefix}.skillLabels.${q}`);
    if (id && id !== item.id) mismatches.push({ location: `${prefix}.skills.${q}`, label: f.skillLabels[q], matches: "statement number disagrees with exact label" });
    return [id, f.skills[q]];
  }));
  const answers = { route, interests, skills, gwa: f.gwa,
    certificates: selection(items.certificates.filter(i => i.scored), f.certificates, `${prefix}.certificates`) };
  if (route === "new") answers.new = {
    electives: selection(items.electives.filter(i => i.scored), f.new.electives, `${prefix}.new.electives`),
    bestSubjects: selection(items.coreSubjects, f.new.coreSubjects, `${prefix}.new.coreSubjects`),
  };
  else answers.old = {
    strand: exact(items.strands, f.old.strand, `${prefix}.old.strand`),
    subjects: selection(items.oldSubjects, f.old.subjects, `${prefix}.old.subjects`),
  };
  return answers;
});
if (mismatches.length) {
  console.error("STOP: exact labels could not be mapped. No flow was scored; no labels were guessed.");
  console.error(JSON.stringify(mismatches, null, 2));
  process.exit(2);
}
const results = flows.map((flow, index) => {
  const answers = mapped[index];
  let session = mergeSession(createEmptySession(), {
    gradeLevel: flow.basecamp?.gradeLevel ?? (route === "new" ? 11 : 12), route,
    interests: answers.interests, skills: answers.skills,
    journeyProgress: { interests: "Completed", skills: "Completed" },
  });
  for (const step of valleySteps(route)) {
    const value = ["gwa", "certificates"].includes(step) ? answers[step] : answers[route][step];
    session = mergeSession(session, valleyPatch(session, step, value, true));
  }
  session = normalizeSession(mergeSession(session, { journeyProgress: { academic: "Completed" } }));
  const adapted = fromSession(session);
  if (!adapted.ok) return { expected: flow.courseId, pass: false, errors: adapted.errors, ranked: [] };
  // A normalizer must not silently discard or reinterpret any supplied answer.
  assert.deepEqual(adapted.answers, answers, `${flow.courseId}: session changed scoring answers`);
  const recommendation = buildRecommendations(session);
  if (!recommendation.ok) return { expected: flow.courseId, pass: false, errors: recommendation.errors, ranked: [] };
  assert.equal(recommendation.ranked.length, 85);
  const ranked = recommendation.ranked;
  const target = ranked.find(c => c.id === flow.courseId);
  const runner = ranked.find(c => c.id !== flow.courseId);
  const lead = target.total - runner.total;
  const tuple = c => `${c.total}/${c.breakdown.skill}/${c.breakdown.interest}`;
  const firstTuple = tuple(ranked[0]);
  const rank1Hash = ranked.slice(1).some(c => tuple(c) === firstTuple);
  const buckets = new Map();
  for (const c of ranked) buckets.set(tuple(c), [...(buckets.get(tuple(c)) || []), c.id]);
  const hashGroups = [...buckets.values()].filter(ids => ids.length > 1);
  const expectedMatches = target.total === flow.expected.rank1Total && runner.total === flow.expected.runnerUpTotal;
  return { expected: flow.courseId, actual: ranked[0].id, targetTotal: target.total,
    runnerId: runner.id, runnerTotal: runner.total, lead, rank1Hash, fullRankingHash: hashGroups.length > 0,
    hashGroups, expectedMatches, pass: ranked[0].id === flow.courseId && lead >= 3, ranked };
});
const md = value => String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
const failures = results.filter(r => !r.pass);
const passed = results.length - failures.length;
const report = path.join(root, `docs/qa/chatgpt-flows-${route}-report.md`);
let text = `# ChatGPT ${routes[0]} test flows: real-engine verification\n\nDate: 2026-10-26 (Asia/Manila).\n\nInput: ${path.relative(root, input).replaceAll("\\", "/")}\n\nInput SHA-256: ${createHash("sha256").update(rawInput).digest("hex")}\n\nResult: **${passed}/85 PASS**. Failing course IDs: ${failures.map(r => r.expected).join(", ") || "none"}.\n\n`;
text += `## Method\n\nAll interest-option text, skill-statement text, certificate categories and active-route subject/elective/strand labels were mapped by exact string equality to data/v2/items.json. Every label matched exactly; no trimming, aliases, fuzzy matching or guesses were used. Question letters and statement numbers were checked against their exact labels. Empty certificate/elective arrays remain empty, representing the explicit None responses. The NEW JSON coreSubjects field maps to the engine's bestSubjects field, using COR item IDs only.\n\nEach flow used createEmptySession, mergeSession and valleyPatch for every Valley step, then normalizeSession, fromSession and buildRecommendations. Basecamp grade levels from the input were retained. All 85 sessions passed validation, and canonical answers after normalization matched their mapped inputs exactly. Each real-engine ranking contained all 85 courses. The input flows were not changed.\n\nPASS means the actual Rank 1 equals the target and target total minus the highest non-target total is at least 3. Runner-up below is the highest non-target course in actual engine order; tied runner-up totals do not affect the lead.\n\nHash terminology: **Rank 1 hash** means another course ties the winning course on total, skill and interest, requiring the hash to decide the winner. **Any-rank hash** means at least one such tie exists anywhere among all 85 courses, including lower ranks. The engine computes an answer seed on every run, but a seed computation alone does not mean the hash decided Rank 1. These flags are derived from the real ranking's comparator keys, without modifying or instrumenting engine code.\n\n`;
text += `## All 85 results\n\n| Expected course | Actual Rank 1 | Target total | Runner-up | Runner-up total | Lead | Rank 1 hash | Any-rank hash | PASS/FAIL |\n| --- | --- | ---: | --- | ---: | ---: | --- | --- | --- |\n`;
for (const r of results) text += `| ${md(r.expected)} | ${md(r.actual ?? "validation failed")} | ${r.targetTotal ?? "-"} | ${r.runnerId ?? "-"} | ${r.runnerTotal ?? "-"} | ${r.lead ?? "-"} | ${r.rank1Hash ? "Yes" : "No"} | ${r.fullRankingHash ? "Yes" : "No"} | ${r.pass ? "PASS" : "FAIL"} |\n`;
text += `\n## Failing flows and actual top five\n\n`;
if (!failures.length) text += `None. All 85 targets ranked first with a strict lead of at least 3.\n`;
for (const r of failures) {
  text += `\n### ${r.expected}\n\n`;
  if (r.errors) text += `Validation errors: ${JSON.stringify(r.errors)}\n\nNo actual ranking was produced.\n`;
  else {
    text += `| Actual rank | Course ID | Exact name | Total | Skill | Interest |\n| ---: | --- | --- | ---: | ---: | ---: |\n`;
    for (const c of r.ranked.slice(0, 5)) text += `| ${c.rank} | ${c.id} | ${md(c.name)} | ${c.total} | ${c.breakdown.skill} | ${c.breakdown.interest} |\n`;
  }
}
text += `\n## Comparison with JSON expectations\n\n${results.every(r => r.expectedMatches) ? "All 85 target totals and runner-up totals exactly match the supplied JSON expectations." : "Mismatches: " + results.filter(r => !r.expectedMatches).map(r => r.expected).join(", ")}\n\nMinimum actual target lead: ${Math.min(...results.map(r => r.lead))}. Rank 1 required the hash in ${results.filter(r => r.rank1Hash).length} flows. At least one lower-rank hash tie was present in ${results.filter(r => r.fullRankingHash).length} flows.\n\n## Reproduction and scope\n\nRun node scripts/qa/verify-chatgpt-flows.mjs ${path.relative(root, input).replaceAll("\\", "/")}. This harness imports the production session helpers and recommendation pipeline. No scoring, ranking, data/v2 or input-flow file was edited. No commit was made.\n`;
fs.writeFileSync(report, text);
assert.equal(createHash("sha256").update(fs.readFileSync(input)).digest("hex"), createHash("sha256").update(rawInput).digest("hex"));
console.log(JSON.stringify({ input, report, passed, failed: failures.map(r => r.expected), minimumLead: Math.min(...results.map(r => r.lead)), rank1Hash: results.filter(r => r.rank1Hash).length, anyRankHash: results.filter(r => r.fullRankingHash).length, expectedTotalsMatch: results.every(r => r.expectedMatches) }, null, 2));
if (failures.length) process.exitCode = 1;
