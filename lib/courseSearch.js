import master from "../data/v2/courses-master.json" with { type: "json" };
import details from "../data/v2/course-details.json" with { type: "json" };
import schools from "../data/v2/schools.json" with { type: "json" };
import schoolsByCourse from "../data/v2/schools-by-course.json" with { type: "json" };
import { schoolLabel } from "./courseDataV2.js";

export const EMPTY_FILTERS = { groups: [], schoolTypes: [], locations: [] };
const TYPE_LABELS = { "public-suc": "Public SUC", "community-college": "Community college", private: "Private", national: "National list (ownership unspecified)" };
const GROUP_LABELS = { bicol: "Bicol", national: "National list" };
export const words = text => String(text).normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
export const hasFilters = filters => ["groups", "schoolTypes", "locations"].some(key => filters[key]?.length);
export const countLabel = count => `${count} ${count === 1 ? "course" : "courses"}`;
const firstSentence = text => text.match(/^[\s\S]*?[.!?](?=\s+[A-Z]|$)/)?.[0] || text;

export function buildSearchIndex(courses = master, courseDetails = details, schoolRows = schools, byCourse = schoolsByCourse) {
  const schoolMap = new Map(schoolRows.map(school => [school.id, school]));
  return courses.map(course => {
    const detail = courseDetails[course.id];
    const fields = [{ field: "name", text: course.name }, { field: "group", text: course.group }, ...detail.careers.map(c => ({ field: "career", text: c.jobTitle })), ...detail.studyTopics.map(text => ({ field: "topic", text }))];
    return { id: course.id, name: course.name, group: course.group, overview: firstSentence(detail.overview), careers: detail.careers.map(c => c.jobTitle), schools: (byCourse[course.id] || []).map(id => schoolMap.get(id)).filter(Boolean), fields: fields.map(field => ({ ...field, words: words(field.text) })) };
  });
}

export function matchQuery(course, query) {
  const terms = words(query);
  const matches = terms.every(term => course.fields.some(field => field.words.some(word => word.startsWith(term))));
  if (!matches || !terms.length) return { matches, fields: [], hint: null };
  const matched = course.fields.filter(field => terms.some(term => field.words.some(word => word.startsWith(term))));
  const hint = ["career", "topic", "name", "group"].map(type => matched.find(field => field.field === type)).find(Boolean);
  return { matches, fields: [...new Set(matched.map(field => field.field))], hint: { field: hint.field, text: hint.text } };
}

export function schoolMatches(school, filters = EMPTY_FILTERS) {
  return (!filters.schoolTypes?.length || filters.schoolTypes.includes(school.type)) && (!filters.locations?.length || filters.locations.some(id => id === `group:${school.group}` || school.province && id === `province:${school.province}`));
}

export function matchesFilters(course, filters = EMPTY_FILTERS) {
  if (filters.groups?.length && !filters.groups.includes(course.group)) return false;
  return !filters.schoolTypes?.length && !filters.locations?.length || course.schools.some(school => schoolMatches(school, filters));
}

export function filterOptions(schoolRows = schools, courses = master) {
  return {
    groups: [...new Set(courses.map(c => c.group))].map(id => ({ id, label: id })),
    schoolTypes: [...new Set(schoolRows.map(s => s.type).filter(Boolean))].map(id => ({ id, label: TYPE_LABELS[id] || id })),
    locations: [...new Set(schoolRows.map(s => s.group).filter(Boolean))].map(group => ({ id: `group:${group}`, label: GROUP_LABELS[group] || group })).concat([...new Set(schoolRows.map(s => s.province).filter(Boolean))].sort().map(province => ({ id: `province:${province}`, label: province }))),
  };
}

export function cardInfoFor(course, filters = EMPTY_FILTERS) {
  // DRAFT default: Bicol, unflagged within Bicol, Albay, then stored data order.
  const eligible = course.schools.filter(s => schoolMatches(s, filters));
  const school = hasFilters({ schoolTypes: filters.schoolTypes, locations: filters.locations }) ? eligible[0] : [...eligible].sort((a, b) => Number(b.group === "bicol") - Number(a.group === "bicol") || Number(a.flags.some(f => ["partial", "weak-source"].includes(f))) - Number(b.flags.some(f => ["partial", "weak-source"].includes(f))) || Number(b.province === "Albay") - Number(a.province === "Albay"))[0];
  const type = school && school.type !== "national" ? TYPE_LABELS[school.type] || null : null;
  return { overview: course.overview, school: school ? { id: school.id, name: school.school, type, label: `${type ? `${type}, ` : ""}${schoolLabel(school)}` } : null, job: course.careers.find(title => title.trim().split(/\s+/).length <= 3) || course.careers[0] || null };
}

export function searchCourses(ranked, index, { query = "", filters = EMPTY_FILTERS, sort = "best" } = {}) {
  const byId = new Map(index.map(course => [course.id, course]));
  return ranked.flatMap(course => {
    const entry = byId.get(course.id), match = matchQuery(entry, query);
    return match.matches && matchesFilters(entry, filters) ? [{ ...course, searchMatch: match, info: cardInfoFor(entry, filters) }] : [];
  }).sort((a, b) => sort === "lowest" ? b.rank - a.rank : sort === "az" ? a.name.localeCompare(b.name, "en", { sensitivity: "base" }) || a.rank - b.rank : a.rank - b.rank);
}

export function activeFilterLabel(filters, options = filterOptions()) {
  if (!hasFilters(filters)) return "";
  return `On our list: ${[ ["groups", "Course group"], ["schoolTypes", "School type"], ["locations", "Location"] ].filter(([key]) => filters[key]?.length).map(([key, label]) => `${label}: ${options[key].filter(option => filters[key].includes(option.id)).map(option => option.label).join(", ")}`).join("; ")}`;
}
