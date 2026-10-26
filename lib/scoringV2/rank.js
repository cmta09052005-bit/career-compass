import { assertValidAnswers } from "./validate.js";
import { gwaBonus, scoreCourses } from "./score.js";
import { sha256 } from "./sha256.js";

function sorted(value) {
  if (Array.isArray(value)) return [...value].sort();
  if (value !== null && typeof value === "object") return Object.fromEntries(Object.keys(value).sort().map((key) => [key, sorted(value[key])]));
  return value;
}

export function canonicalizeAnswers(answers) {
  assertValidAnswers(answers);
  return JSON.stringify(sorted({
    route: answers.route, interests: answers.interests, skills: answers.skills,
    certificates: answers.certificates, gwaTier: gwaBonus(answers.gwa),
    [answers.route]: answers[answers.route],
  }));
}

export function answerSeed(answers) {
  return sha256(canonicalizeAnswers(answers));
}

export function rankCourses(answers) {
  const scores = scoreCourses(answers);
  const seed = answerSeed(answers);
  const keys = new Map();
  const key = (id) => {
    if (!keys.has(id)) keys.set(id, sha256(seed + id));
    return keys.get(id);
  };
  return scores.sort((a, b) => {
    const difference = b.total - a.total || b.breakdown.skill - a.breakdown.skill || b.breakdown.interest - a.breakdown.interest;
    if (difference) return difference;
    const x = key(a.id), y = key(b.id);
    // A full SHA-256 collision has no prescribed fallback; fail rather than favor an ID.
    if (a.id !== b.id && x === y) throw new Error("SHA256_TIE_COLLISION");
    return x < y ? -1 : x > y ? 1 : 0;
  });
}
