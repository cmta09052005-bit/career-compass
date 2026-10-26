import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import courses from "../data/v2/courses-master.json" with { type: "json" };
import items from "../data/v2/items.json" with { type: "json" };
import links from "../data/v2/links.json" with { type: "json" };
import { rankCourses, scoreCourses, sha256, validateAnswers } from "../lib/scoringV2/index.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const searchSeed = "career-compass-v2-reachability-2026-10-26-v1";
const initialBudget = 512;
const extendedBudget = 8192;
const summaries = { PASS: 0, WARN: 0, TIE: 0, FAIL: 0 };

function randomFor(key) {
  let state = Number.parseInt(sha256(searchSeed + key).slice(0, 8), 16);
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}
function shuffle(values, random) {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
function candidate(id, flow, random) {
  const link = links[id];
  const answer = {
    route: flow,
    interests: Object.fromEntries(items.interests.map((q) => [q.id, "ABCD"[Math.floor(random() * 4)]])),
    skills: Object.fromEntries(items.skills.map((s) => [s.id, link.skills.includes(s.id) ? 5 : 1])),
    certificates: [...link.certificates], gwa: 100,
  };
  for (const option of link.interests) answer.interests[option.slice(0, 6)] = option.slice(-1);
  if (flow === "old") answer.old = { strand: link.strand, subjects: [...link.oldSubjects] };
  else {
    answer.new = {
      electives: shuffle(link.electives, random).slice(0, 1 + Math.floor(random() * 3)),
      bestSubjects: [link.coreSubject],
    };
  }
  return answer;
}
function inspect(answers, id) {
  // The search uses the production arithmetic, including for non-witness candidates.
  const rows = scoreCourses(answers);
  const target = rows.find((row) => row.id === id);
  const strongestOther = Math.max(...rows.filter((row) => row.id !== id).map((row) => row.total));
  return { lead: target.total - strongestOther, score: target.total };
}
function materialize(answers, id, flow) {
  // Every recorded answer is validated and ranked again through the real engine.
  const ranked = rankCourses(answers);
  const rank = ranked.findIndex((row) => row.id === id) + 1;
  const target = ranked[rank - 1];
  const others = ranked.filter((row) => row.id !== id);
  const lead = target.total - others[0].total;
  const hashTieBreakUsed = rank === 1 && others.some((row) => row.total === target.total && row.breakdown.skill === target.breakdown.skill && row.breakdown.interest === target.breakdown.interest);
  const uniqueHighestTotal = lead > 0;
  const status = rank !== 1 ? "FAIL" : uniqueHighestTotal ? (lead >= 3 ? "PASS" : "WARN") : hashTieBreakUsed ? "TIE" : null;
  return { course: id, name: target.name, flow, answers, rank, score: target.total, runnerUp: others[0].id, lead, uniqueHighestTotal, hashTieBreakUsed, status };
}
function priority(row) {
  if (!row) return -Infinity;
  if (row.status === "PASS" || row.status === "WARN") return 1000 + row.lead;
  if (row.status === "TIE") return 500;
  if (row.rank === 1) return 400;
  return row.lead - row.rank / 1000;
}

const witnesses = [];
for (const course of courses) {
  for (const flow of ["old", "new"]) {
    const random = randomFor(course.id + "/" + flow);
    let best = null, attempts = 0, extendedSearch = false;
    const search = (budget) => {
      for (let i = 0; i < budget; i++) {
        const answers = candidate(course.id, flow, random);
        attempts++;
        const probe = inspect(answers, course.id);
        if (!best || probe.lead >= best.lead) {
          const row = materialize(answers, course.id, flow);
          if (priority(row) > priority(best)) best = row;
        }
        if (best?.status === "PASS") return;
      }
    };
    search(initialBudget);
    if (best.status !== "PASS") {
      extendedSearch = true;
      search(extendedBudget);
      // Additional systematic sweep of all 4^6 non-target interest selections
      // over the best academic combination, after the larger seeded search.
      const free = items.interests.map((q) => q.id).filter((id) => !links[course.id].interests.some((option) => option.startsWith(id + "-")));
      for (let mask = 0; mask < 4 ** free.length && best.status !== "PASS"; mask++) {
        const answers = structuredClone(best.answers);
        let value = mask;
        for (const id of free) { answers.interests[id] = "ABCD"[value % 4]; value = Math.floor(value / 4); }
        attempts++;
        const probe = inspect(answers, course.id);
        if (probe.lead >= best.lead) {
          const row = materialize(answers, course.id, flow);
          if (priority(row) > priority(best)) best = row;
        }
      }
    }
    if (best.status === null) throw new Error(`${course.id}/${flow}: Rank 1 with equal totals resolved by skill/interest has no user-defined exclusive label. Clarification required.`);
    const verified = materialize(best.answers, course.id, flow);
    if (JSON.stringify(verified) !== JSON.stringify(best)) throw new Error(`Witness re-score mismatch: ${course.id}/${flow}`);
    if (!validateAnswers(best.answers).valid) throw new Error(`Invalid witness: ${course.id}/${flow}`);
    summaries[best.status]++;
    witnesses.push({ ...best, attempts, extendedSearch });
  }
  const last = witnesses.slice(-2);
  console.log(`${course.id}: ${last.map((row) => `${row.flow} ${row.status} lead=${row.lead} (${row.attempts} attempts)`).join("; ")}`);
}
if (witnesses.length !== 170 || new Set(witnesses.map((row) => row.course + "/" + row.flow)).size !== 170) throw new Error("Expected 170 distinct cases.");
const inputs = {};
for (const name of ["courses-master.json", "items.json", "links.json"]) inputs[name] = sha256(await readFile(path.join(root, "data/v2", name), "utf8"));
const report = [
  "# Scoring v2 reachability verification", "", "Date: 2026-10-26 (Asia/Manila). Revised v2 mappings only; Section 7's pre-revision lead table was not used.", "",
  `Summary: PASS ${summaries.PASS}; WARN ${summaries.WARN}; TIE ${summaries.TIE}; FAIL ${summaries.FAIL}. Cases: ${witnesses.length}.`, "",
  "PASS means unique highest total with lead >=3; WARN means unique highest total with lead 1-2. TIE means Rank 1 with equal total/skill/interest, resolved by SHA-256. TIE is not counted as PASS. FAIL means no Rank 1 witness found after extended search, not proven impossible.", "",
  "Lead is the target's score minus the strongest other course's score (Rank 2 when the target is Rank 1). Search stops at the first PASS; reported leads are feasible examples, not optimized maximum leads. Full validated answer objects, attempts, rank, lead and tie flags are in data/v2/witnesses.json.", "",
  `Seed: ${searchSeed}. Deterministic per-course/route Mulberry32 stream, initialized from SHA-256. Initial budget ${initialBudget}; extended budget ${extendedBudget} plus systematic enumeration of all 4^6 free-interest combinations when needed. Extended search runs for every non-PASS initial result, including every potential FAIL. Search is restricted to target-linked evidence and maximal target ratings; it does not prove non-reachability.`, "",
  "All candidate arithmetic uses scoreCourses; all recorded witnesses are ranked with rankCourses and re-scored before writing. GWA is 100, target-linked skills are 5, others 1, target certificates and interests are selected. Old profiles use the target strand and two linked subjects. New profiles vary one to three of five linked electives and select the target's single core subject; cluster is removed. Remaining interest choices vary. No old lead values or search-only arithmetic are used.", "",
  "A zero-lead Rank 1 resolved by skill/interest alone would stop this script for clarification rather than silently assign one of the user-defined labels. No such unclassified final row was written.", "",
  "Input SHA-256 (UTF-8 file content):", ...Object.entries(inputs).map(([name, hash]) => `- ${name}: ${hash}`), "",
  "| Course | Flow | Status | Rank | Score | Lead | Unique highest total | Hash tie-break | Attempts | Extended |",
  "| --- | --- | --- | ---: | ---: | ---: | --- | --- | ---: | --- |",
  ...witnesses.map((row) => `| ${row.course} ${row.name} | ${row.flow} | ${row.status} | ${row.rank} | ${row.score} | ${row.lead} | ${row.uniqueHighestTotal ? "yes" : "no"} | ${row.hashTieBreakUsed ? "yes" : "no"} | ${row.attempts} | ${row.extendedSearch ? "yes" : "no"} |`), "",
  "These witnesses establish mathematical reachability for the supplied static mappings. They do not establish frequency, predictive validity, fairness, admission eligibility, or availability of particular electives at a school.", "",
].join("\n");
await writeFile(path.join(root, "data/v2/witnesses.json"), JSON.stringify(witnesses, null, 2) + "\n");
await writeFile(path.join(root, "docs/reachability-report.md"), report);
console.log(`SUMMARY: PASS ${summaries.PASS}; WARN ${summaries.WARN}; TIE ${summaries.TIE}; FAIL ${summaries.FAIL}; ${witnesses.length}/170 re-scored.`);
if (summaries.FAIL > 0) process.exitCode = 1;
