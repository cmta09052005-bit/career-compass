import courses from "../../data/v2/courses-master.json" with { type: "json" };
import links from "../../data/v2/links.json" with { type: "json" };
import { assertValidAnswers } from "./validate.js";

// Called only after validation by the public scoring API.
export function gwaBonus(gwa) {
  if (typeof gwa !== "number" || !Number.isFinite(gwa) || gwa < 0 || gwa > 100) throw new RangeError("GWA must be a finite number from 0 to 100.");
  return gwa >= 95 ? 6 : gwa >= 90 ? 5 : gwa >= 85 ? 4 : gwa >= 80 ? 3 : gwa >= 75 ? 2 : 0;
}

export function scoreCourses(answers) {
  assertValidAnswers(answers);
  const bonus = gwaBonus(answers.gwa);
  const interests = new Set(Object.entries(answers.interests).map(([id, choice]) => `${id}-${choice}`));
  const certificates = new Set(answers.certificates);
  const matchCount = (ids, selected) => ids.reduce((sum, id) => sum + Number(selected.has(id)), 0);
  const oldSubjects = new Set(answers.old?.subjects);
  const electives = new Set(answers.new?.electives);
  const bestSubjects = new Set(answers.new?.bestSubjects);
  return courses.map(({ id, name }) => {
    const link = links[id];
    const interest = 3 * matchCount(link.interests, interests);
    const skill = link.skills.reduce((sum, key) => sum + answers.skills[key], 0);
    const certificate = 3 * matchCount(link.certificates, certificates);
    let strand = 0, subjects = 0, elective = 0, bestSubject = 0, gwa = 0;
    if (answers.route === "old") {
      const aligned = link.strand === answers.old.strand;
      strand = aligned ? 4 : 0;
      gwa = aligned ? bonus : 0;
      subjects = 3 * matchCount(link.oldSubjects, oldSubjects);
    } else {
      elective = 4 * matchCount(link.electives, electives);
      bestSubject = 3 * Number(bestSubjects.has(link.coreSubject));
      gwa = elective > 0 || bestSubject > 0 ? bonus : 0;
    }
    const academic = strand + subjects + elective + bestSubject + gwa;
    return {
      id, name, total: interest + skill + certificate + academic,
      breakdown: { interest, skill, certificate, academic, strand, subjects, elective, bestSubject, gwa },
    };
  });
}
