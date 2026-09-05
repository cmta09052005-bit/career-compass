import items from "../data/items.json";
import { INTERESTS_WEIGHTS, SKILLS_WEIGHTS } from "./weightTable";

const SKILL_LABELS = {
  "SKL-01": "Understanding computer programs",
  "SKL-02": "Building and repairing machines",
  "SKL-03": "Explaining complex topics",
  "SKL-04": "Managing money and budgets",
  "SKL-05": "Staying calm in health emergencies",
  "SKL-06": "Visual expression and design",
  "SKL-07": "Persuading others",
  "SKL-08": "Following construction instructions",
  "SKL-09": "Caring for others",
  "SKL-10": "Guiding and mentoring",
};

export function buildReportEvidence(answers = {}, categoryCode) {
  const interests = items
    .filter((item) => item.section === "Interests")
    .flatMap((item) => {
      const selected = answers.interests?.[item.id];
      const option = item.options.find((entry) => entry.key === selected);
      return option && INTERESTS_WEIGHTS[item.id]?.[selected] === categoryCode
        ? [option.text]
        : [];
    })
    .slice(0, 4);
  const skills = items
    .filter((item) => item.section === "Skills")
    .filter((item) => {
      const rating = Number(answers.skills?.[item.id]);
      return SKILLS_WEIGHTS[item.id] === categoryCode && (rating === 4 || rating === 5);
    })
    .sort((a, b) => Number(answers.skills[b.id]) - Number(answers.skills[a.id]))
    .slice(0, 2)
    .map((item) => `${SKILL_LABELS[item.id]} (${answers.skills[item.id]}/5)`);

  return { interests, skills };
}
