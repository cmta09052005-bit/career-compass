import master from "../../data/v2/courses-master.json" with { type: "json" };
import details from "../../data/v2/course-details.json" with { type: "json" };
import items from "../../data/v2/items.json" with { type: "json" };
import schools from "../../data/v2/schools.json" with { type: "json" };
import { schoolLabel } from "../courseDataV2.js";

export const normalizeText = value => value.replace(/\s+/g, " ").trim();
export const keptEntries = [
  ...master.map(c => ({ text: c.name, reason: "course name", origin: `courses-master:${c.id}` })),
  ...Object.entries(details).flatMap(([id, c]) => [...c.careers.map(j => ({ text: j.jobTitle, reason: "job title", origin: `${id}.careers` })), ...c.studyTopics.flatMap(text => [text, text.replace(/\.$/, "")]).map(text => ({ text, reason: "study topic", origin: `${id}.studyTopics` }))]),
  ...schools.flatMap(s => [s.school, schoolLabel(s), s.campus, s.location, s.province].filter(Boolean).map(text => ({ text, reason: "school name or recorded place", origin: s.id }))),
  ...[...items.electives, ...items.coreSubjects].map(item => ({ text: item.text, reason: "official DepEd elective/core name", origin: item.id })),
  ...["GWA", "PDF", "CHED", "STEM", "ABM", "HUMSS", "GAS", "TVL", "ICT", "Curriculum", "curriculum", "Strand", "strand", "Grade", "Grade 11", "Grade 12", "English", "Filipino", "Career Compass", "CAREER COMPASS", "Bicol", "MB", "GB", "KB", "TechPro", "N", "E", "S", "W", "Escape", "Enter", "Tab", "Home", "End", "Charlene Mae T. Adille", "Juno Alligah B. Romano"].map(text => ({ text, reason: "borrowed technical term or proper name", origin: "translation policy" })),
];
const terms = new Set(keptEntries.map(x => normalizeText(x.text).toLowerCase()));
export function isKeptText(value) {
  return terms.has(normalizeText(value).toLowerCase()) || /^(?:https?:\/\/|CMO\b|₱|PHP\s*\d)/i.test(value.trim());
}
